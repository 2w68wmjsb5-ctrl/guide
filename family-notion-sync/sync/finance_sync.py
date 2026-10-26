"""Finance exports uploaded to Notion -> transactions, fixed costs, income and savings.

1. Rows in "Finanz-Import" with status "Neu" (or none) are downloaded and parsed.
2. New bookings go into "Umsätze"; bookings already there are skipped.
3. Recurring payments are detected like in the app and kept in "Fixkosten" and
   "Einnahmen" (rows marked "Automatisch"). Rows entered by hand are never touched.
4. Transfers matching a savings goal's terms become rows in "Rücklagen".

Nothing here prints amounts or names, because the workflow logs can be public.
"""

import logging
import tempfile
from datetime import date
from pathlib import Path

import requests

from . import finance
from . import notion as n
from .finance_import import Transaction, parse_file

log = logging.getLogger(__name__)

INTERVAL_NAMES = {"monatlich": "monatlich", "quartal": "vierteljährlich",
                  "halbjährlich": "halbjährlich", "jaehrlich": "jährlich"}

CATEGORY_HINTS = [  # matched against the export's category and the payee
    (("miete", "wohn", "nebenkosten", "hausgeld"), "Wohnen"),
    (("strom", "gas", "energie", "stadtwerke", "wärme", "wasser"), "Energie"),
    (("internet", "telefon", "mobilfunk", "handy", "telekom", "vodafone", "o2", "1&1"), "Kommunikation"),
    (("netflix", "spotify", "disney", "prime", "abo", "streaming", "medien", "rundfunk", "gez", "zeitung"), "Abos"),
    (("versicherung", "huk", "allianz", "ergo", "axa", "debeka"), "Versicherung"),
    (("bahn", "auto", "kfz", "tank", "mobilität", "verkehr", "adac", "leasing"), "Mobilität"),
    (("kita", "kinder", "schule", "kindergarten", "betreuung"), "Kinder"),
]


def category_for(*texts: str) -> str:
    haystack = " ".join(t.lower() for t in texts if t)
    for words, category in CATEGORY_HINTS:
        if any(w in haystack for w in words):
            return category
    return "Sonstiges"


# --- reading from Notion -----------------------------------------------------

def transaction_from_page(page: dict) -> Transaction | None:
    day = n.get(page, "Datum")
    amount = n.get(page, "Betrag")
    if not day or amount is None:
        return None
    return Transaction(
        day=date.fromisoformat(day[:10]),
        amount=float(amount),
        counterparty=n.get(page, "Empfänger") or "",
        purpose=n.get(page, "Zweck") or "",
        category=n.get(page, "Kategorie") or "",
        account=n.get(page, "Konto") or "",
    )


def goals_from_pages(pages: list[dict]) -> list[dict]:
    goals = []
    for page in pages:
        terms = [t.strip() for t in (n.get(page, "Begriffe") or "").split(",") if t.strip()]
        goals.append({
            "id": page["id"],
            "name": n.get(page, "Name") or "Sparziel",
            "begriffe": terms,
            "seit": (n.get(page, "Seit") or "1970-01-01")[:10],
            "start": n.get(page, "Startstand") or 0,
            "ziel": n.get(page, "Ziel") or 0,
        })
    return goals


def _contains(t: Transaction, terms: list[str]) -> bool:
    haystack = f"{t.counterparty} {t.purpose}".lower()
    return any(term.lower() in haystack for term in terms)


# --- planning (pure, tested) ---------------------------------------------------

def plan_recurring(found: list[dict], existing: list[dict], stopped_flag: str, is_income: bool) -> tuple[list, list]:
    """Return (creates, updates) for the Fixkosten or Einnahmen database.

    existing: pages with an Auto-ID. A detected contract keeps its row; one that
    is no longer detected gets the stopped flag (Gekündigt/Beendet). The flag is
    never cleared again, so ticking it by hand sticks.
    """
    by_key = {n.get(p, "Auto-ID"): p for p in existing}
    last_name = "Zuletzt eingegangen" if is_income else "Zuletzt abgebucht"
    next_name = "Nächster Eingang" if is_income else "Nächste Abbuchung"
    creates, updates, seen = [], [], set()
    for r in found:
        if r.get("manuell"):
            continue
        seen.add(r["key"])
        props = {
            "Betrag": n.number(r["betrag"]),
            "Intervall": n.select(INTERVAL_NAMES.get(r["intervall"], "monatlich")),
            next_name: n.date(r["naechste"]),
            last_name: n.date(r["letzte"]),
        }
        page = by_key.get(r["key"])
        if page is None:
            props |= {
                "Name": n.title(r["name"]),
                "Quelle": n.select("Automatisch"),
                "Auto-ID": n.text(r["key"]),
            }
            if is_income:
                props["Wer"] = n.select("Familie")
            else:
                props["Kategorie"] = n.select(category_for(r.get("kategorie", ""), r["name"]))
            creates.append(props)
        else:
            updates.append((page["id"], props))
    for key, page in by_key.items():
        if key not in seen and not n.get(page, stopped_flag):
            updates.append((page["id"], {stopped_flag: n.checkbox(True)}))
    return creates, updates


def plan_savings(transactions: list[Transaction], goals: list[dict], booked: set[str]) -> list[dict]:
    creates = []
    for goal in goals:
        if not goal["begriffe"]:
            continue
        since = date.fromisoformat(goal["seit"])
        for t in transactions:
            if t.amount < 0 and t.day >= since and t.uid not in booked and _contains(t, goal["begriffe"]):
                booked.add(t.uid)
                creates.append({
                    "Buchung": n.title(t.counterparty or t.purpose or "Einzahlung"),
                    "Datum": n.date(t.day.isoformat()),
                    "Betrag": n.number(round(-t.amount, 2)),
                    "Sparziel": n.relation(goal["id"]),
                    "Umsatz-ID": n.text(t.uid),
                })
    return creates


# --- running -----------------------------------------------------------------

def _download(url: str, name: str, folder: Path) -> Path:
    response = requests.get(url, timeout=60)
    response.raise_for_status()
    path = folder / Path(name or "export.csv").name
    path.write_bytes(response.content)
    return path


def _transaction_props(t: Transaction) -> dict:
    return {
        "Empfänger": n.title(t.counterparty or t.purpose or "(ohne Namen)"),
        "Datum": n.date(t.day.isoformat()),
        "Betrag": n.number(t.amount),
        "Zweck": n.text(t.purpose),
        "Kategorie": n.text(t.category),
        "Konto": n.text(t.account),
        "Umsatz-ID": n.text(t.uid),
    }


def sync(notion: n.Notion, ids: dict, rules: dict, today: date | None = None) -> str:
    pending = notion.query(ids["finanz_import"], {"or": [
        {"property": "Status", "select": {"equals": "Neu"}},
        {"property": "Status", "select": {"is_empty": True}},
    ]})
    pending = [p for p in pending if n.get(p, "Datei")]
    if not pending:
        return "Keine neuen Exporte"

    stored = notion.query(ids["umsaetze"])
    known = {n.get(p, "Umsatz-ID") for p in stored}
    transactions = [t for t in (transaction_from_page(p) for p in stored) if t]

    added_total, failed = 0, 0
    with tempfile.TemporaryDirectory() as tmp:
        for page in pending:
            try:
                parsed = []
                for f in n.get(page, "Datei"):
                    parsed += parse_file(_download(f["url"], f["name"], Path(tmp)))
                new = []
                for t in parsed:
                    if t.uid not in known:
                        known.add(t.uid)
                        new.append(t)
                for t in new:
                    notion.create(ids["umsaetze"], _transaction_props(t))
                transactions += new
                added_total += len(new)
                notion.update(page["id"], {
                    "Status": n.select("Importiert"),
                    "Neue Umsätze": n.number(len(new)),
                    "Meldung": n.text(f"{len(parsed)} Buchungen gelesen, {len(new)} neu"),
                })
            except Exception as exc:  # keep going with the other uploads
                failed += 1
                log.warning("Export konnte nicht gelesen werden: %s", type(exc).__name__)
                notion.update(page["id"], {"Status": n.select("Fehler"), "Meldung": n.text(str(exc)[:300])})

    goals = goals_from_pages(notion.query(ids["sparziele"]))
    analysis_rules = dict(rules)
    analysis_rules["sparziele"] = [{"begriffe": g["begriffe"]} for g in goals]
    result = finance.analyse(transactions, analysis_rules, today)
    changes = 0
    if not result.get("leer"):
        for ds, found, flag, income in (
            (ids["fixkosten"], result["fixkosten"], "Gekündigt", False),
            (ids["einnahmen"], result["einnahmen_regelmaessig"], "Beendet", True),
        ):
            existing = notion.query(ds, {"property": "Auto-ID", "rich_text": {"is_not_empty": True}})
            creates, updates = plan_recurring(found, existing, flag, income)
            for props in creates:
                notion.create(ds, props)
            for page_id, props in updates:
                notion.update(page_id, props)
            changes += len(creates) + len(updates)

    booked = {n.get(p, "Umsatz-ID") for p in notion.query(ids["ruecklagen"])}
    savings = plan_savings(transactions, goals, booked)
    for props in savings:
        notion.create(ids["ruecklagen"], props)

    message = (f"{len(pending) - failed} Export(e) importiert, {added_total} neue Umsätze, "
               f"{changes} Änderungen an Fixkosten/Einnahmen, {len(savings)} Einzahlungen")
    if failed:
        raise RuntimeError(f"{failed} Export(e) fehlerhaft. {message}")
    return message
