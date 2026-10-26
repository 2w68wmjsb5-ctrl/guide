"""Derive fixed costs, income and savings from raw transactions."""

import re
from collections import Counter, defaultdict
from datetime import date, timedelta
from statistics import median

from .sources.finance_import import AMEX, Transaction

# How the monthly card bill shows up on the current account
CARD_BILL_TERMS = ["american express", "amex"]

INTERVALS = [  # (name, months, min days, max days)
    ("monatlich", 1, 25, 38),
    ("quartal", 3, 80, 100),
    ("halbjährlich", 6, 165, 200),
    ("jaehrlich", 12, 340, 390),
]
INTERVAL_LABEL = {"monatlich": "monatlich", "quartal": "vierteljährlich",
                  "halbjährlich": "halbjährlich", "jaehrlich": "jährlich"}
INTERVAL_MONTHS = {name: months for name, months, _, _ in INTERVALS}


def _key(t: Transaction) -> str:
    """Group key: counterparty without reference numbers, dates and legal suffixes."""
    text = (t.counterparty or t.purpose).lower()
    text = re.sub(r"\d[\d./-]*", " ", text)
    text = re.sub(r"\b(gmbh|ag|se|kg|e\.?v\.?|co|mbh|sagt danke|lastschrift|sepa)\b", " ", text)
    words = re.findall(r"[a-zäöüß]+", text)
    return " ".join(words[:3])


def _contains(t: Transaction, terms: list[str]) -> bool:
    haystack = f"{t.counterparty} {t.purpose}".lower()
    return any(term.lower() in haystack for term in terms or [])


def _month(d: date) -> str:
    return d.strftime("%Y-%m")


def _add_months(d: date, months: int) -> date:
    y, m = divmod(d.month - 1 + months, 12)
    year, month = d.year + y, m + 1
    for day in (d.day, 30, 29, 28):
        try:
            return date(year, month, day)
        except ValueError:
            continue
    raise ValueError(d)


def detect_recurring(transactions: list[Transaction], reference: date) -> list[dict]:
    groups: dict[tuple[str, bool], list[Transaction]] = defaultdict(list)
    for t in transactions:
        key = _key(t)
        if key:
            groups[(key, t.amount > 0)].append(t)

    found = []
    for (key, incoming), items in groups.items():
        items.sort(key=lambda t: t.day)
        # One booking per month counts; several in one month means variable spending
        months = Counter(_month(t.day) for t in items)
        if len(items) < 2 or max(months.values()) > 1:
            continue
        gaps = [(b.day - a.day).days for a, b in zip(items, items[1:])]
        gap = median(gaps)
        interval = next((name for name, _, lo, hi in INTERVALS if lo <= gap <= hi), None)
        if interval is None:
            continue
        if interval == "monatlich" and len(items) < 3:
            continue
        amounts = [abs(t.amount) for t in items]
        mid = median(amounts)
        recent = amounts[-3:]
        if mid == 0 or max(abs(a - median(recent)) for a in recent) / median(recent) > 0.2:
            continue
        last = items[-1]
        expected_next = _add_months(last.day, INTERVAL_MONTHS[interval])
        # Drop contracts that stopped: next booking overdue by more than half an interval
        if (reference - expected_next).days > max(20, gap / 2):
            continue
        name = Counter(t.counterparty or t.purpose for t in items).most_common(1)[0][0]
        found.append({
            "key": key,
            "name": name.strip()[:40],
            "betrag": round(abs(last.amount), 2),
            "intervall": interval,
            "intervall_label": INTERVAL_LABEL[interval],
            "monatlich": round(abs(last.amount) / INTERVAL_MONTHS[interval], 2),
            "letzte": last.day.isoformat(),
            "naechste": expected_next.isoformat(),
            "eingang": incoming,
            "kategorie": last.category,
        })
    return sorted(found, key=lambda r: -r["monatlich"])


def analyse(transactions: list[Transaction], rules: dict, today: date | None = None) -> dict:
    today = today or date.today()
    finance_rules = rules.get("finanzen") or {}
    ignore = finance_rules.get("ignorieren") or []
    # Transfers towards a savings goal are savings too, not spending
    savings_terms = list(finance_rules.get("ruecklagen_begriffe") or [])
    for goal in rules.get("sparziele") or []:
        savings_terms += goal.get("begriffe") or []

    txs = [t for t in transactions if not _contains(t, ignore)]
    # With the Amex purchases imported, the monthly Amex debit on the current
    # account would count the same money twice
    amex_days = [t.day for t in txs if t.account == AMEX]
    if amex_days:
        card_terms = finance_rules.get("kreditkarten_abbuchung") or CARD_BILL_TERMS
        first = min(amex_days)
        txs = [t for t in txs if t.account == AMEX or t.day < first or not _contains(t, card_terms)]
    if not txs:
        return {"leer": True, "sparziele": _goals([], rules)}

    # Imports lag behind, so "now" for the data is the newest booking
    reference = max(t.day for t in txs)
    # Two years back, so yearly bills have occurred at least twice
    window = [t for t in txs if t.day >= reference - timedelta(days=760)]
    savings_ids = {id(t) for t in window if t.amount < 0 and _contains(t, savings_terms)}
    spending = [t for t in window if id(t) not in savings_ids]

    # Card refunds are not income
    refund_keys = {_key(t) for t in spending if t.account == AMEX and t.amount > 0}
    recurring = [r for r in detect_recurring(spending, reference)
                 if not (r["eingang"] and r["key"] in refund_keys)]
    excluded = finance_rules.get("fixkosten_ausschliessen") or []
    fixed = [r for r in recurring if not r["eingang"]
             and not any(e.lower() in r["name"].lower() for e in excluded)]
    for manual in finance_rules.get("fixkosten_manuell") or []:
        interval = manual.get("intervall", "monatlich")
        months = INTERVAL_MONTHS.get(interval, 1)
        fixed.append({
            "name": manual["name"], "betrag": float(manual["betrag"]), "intervall": interval,
            "intervall_label": INTERVAL_LABEL.get(interval, interval),
            "monatlich": round(float(manual["betrag"]) / months, 2),
            "letzte": None, "naechste": None, "eingang": False, "manuell": True,
        })
    fixed.sort(key=lambda r: -r["monatlich"])
    income = [r for r in recurring if r["eingang"]]

    # Monthly overview for the last 6 months of data
    months = []
    cursor = date(reference.year, reference.month, 1)
    for _ in range(6):
        months.append(_month(cursor))
        cursor = (cursor - timedelta(days=1)).replace(day=1)
    months.reverse()
    per_month = {m: {"monat": m, "einnahmen": 0.0, "ausgaben": 0.0, "gespart": 0.0} for m in months}
    for t in window:
        bucket = per_month.get(_month(t.day))
        if bucket is None:
            continue
        if id(t) in savings_ids:
            bucket["gespart"] += -t.amount
        elif t.account == AMEX:
            bucket["ausgaben"] += -t.amount  # refunds lower the spending
        elif t.amount > 0:
            bucket["einnahmen"] += t.amount
        else:
            bucket["ausgaben"] += -t.amount
    for bucket in per_month.values():
        for k in ("einnahmen", "ausgaben", "gespart"):
            bucket[k] = round(bucket[k], 2)

    current = per_month[_month(reference)]
    month_end = _add_months(date(reference.year, reference.month, 1), 1) - timedelta(days=1)

    def due_this_month(items):
        return [i for i in items if i.get("naechste") and reference < date.fromisoformat(i["naechste"]) <= month_end]

    still_due = due_this_month(fixed)
    expected = due_this_month(income)
    expected_sum = round(sum(i["betrag"] for i in expected), 2)
    still_due_sum = round(sum(f["betrag"] for f in still_due), 2)
    irregular = [f for f in fixed if f["intervall"] != "monatlich"]

    return {
        "leer": False,
        "stand": reference.isoformat(),
        "fixkosten": fixed,
        "fixkosten_monatlich": round(sum(f["monatlich"] for f in fixed), 2),
        "einnahmen_regelmaessig": income,
        "einnahmen_monatlich": round(sum(i["monatlich"] for i in income), 2),
        "monate": list(per_month.values()),
        "aktueller_monat": current,
        "noch_faellig": sorted(still_due, key=lambda f: f["naechste"]),
        "noch_faellig_summe": still_due_sum,
        "noch_erwartet_summe": expected_sum,
        # Left at month end once expected income and due fixed costs are booked
        "prognose_uebrig": round(current["einnahmen"] + expected_sum - current["ausgaben"]
                                 - current["gespart"] - still_due_sum, 2),
        # Monthly amount to set aside so quarterly/yearly bills never hurt
        "ruecklage_empfehlung": round(sum(f["monatlich"] for f in irregular), 2),
        "ruecklage_posten": irregular,
        "sparziele": _goals(txs, rules),
        "letzte_umsaetze": [
            {"datum": t.day.isoformat(), "betrag": t.amount, "name": t.counterparty or t.purpose, "konto": t.account}
            for t in sorted(txs, key=lambda t: t.day, reverse=True)[:8]
        ],
    }


def _goals(transactions: list[Transaction], rules: dict) -> list[dict]:
    goals = []
    for goal in rules.get("sparziele") or []:
        since = date.fromisoformat(str(goal.get("seit", "1970-01-01")))
        saved = float(goal.get("start", 0))
        for t in transactions:
            if t.day >= since and _contains(t, goal.get("begriffe")):
                saved += -t.amount  # transfer out of the current account adds to the goal
        target = float(goal.get("ziel", 0)) or None
        goals.append({
            "name": goal.get("name", "Sparziel"),
            "stand": round(saved, 2),
            "ziel": target,
            "prozent": round(min(100, saved / target * 100), 1) if target else None,
        })
    return goals
