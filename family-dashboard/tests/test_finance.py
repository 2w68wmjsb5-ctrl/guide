from datetime import date

from app import demo, finance
from app.sources.finance_import import parse_amount, parse_rows


def test_parse_amount_formats():
    assert parse_amount("-1.234,56") == -1234.56
    assert parse_amount("1,234.56") == 1234.56
    assert parse_amount("12,30 €") == 12.30
    assert parse_amount("45,00-") == -45.0
    assert parse_amount("") is None


def test_parse_rows_skips_bank_preamble():
    rows = [
        ["Kontoauszug Girokonto"],
        ["Zeitraum:", "01.01.2026 - 31.01.2026"],
        [],
        ["Buchungstag", "Valuta", "Auftraggeber/Empfänger", "Verwendungszweck", "Betrag (EUR)"],
        ["02.01.2026", "02.01.2026", "Stadtwerke", "Abschlag", "-89,00"],
        ["27.01.2026", "27.01.2026", "Arbeitgeber", "Gehalt", "3.150,00"],
    ]
    txs = parse_rows(rows)
    assert [(t.day, t.amount, t.counterparty) for t in txs] == [
        (date(2026, 1, 2), -89.0, "Stadtwerke"),
        (date(2026, 1, 27), 3150.0, "Arbeitgeber"),
    ]


def test_parse_rows_debit_credit_columns():
    rows = [["Datum", "Name", "Soll", "Haben"], ["01.02.2026", "Miete", "1.150,00", ""], ["03.02.2026", "Bonus", "", "200,00"]]
    assert [t.amount for t in parse_rows(rows)] == [-1150.0, 200.0]


def test_demo_detects_fixed_costs_and_income():
    today = date(2026, 10, 26)
    result = finance.analyse(demo.transactions(today), demo.RULES, today)
    fixed = {f["name"]: f for f in result["fixkosten"]}
    assert fixed["Wohnbau Mustermann"]["intervall"] == "monatlich"
    assert fixed["GEZ Rundfunkbeitrag"]["intervall"] == "quartal"
    assert fixed["HUK-Coburg"]["intervall"] == "jaehrlich"
    assert fixed["ADAC"]["intervall"] == "jaehrlich"
    # Variable shopping must not show up as fixed costs
    assert not any(name in fixed for name in ("REWE", "Edeka", "Amazon"))
    # Savings transfers are savings, not fixed costs
    assert "Tagesgeld" not in fixed and "Urlaub Unterkonto" not in fixed
    income = {i["name"] for i in result["einnahmen_regelmaessig"]}
    assert {"Arbeitgeber A GmbH", "Arbeitgeber B AG", "Familienkasse"} <= income
    assert result["ruecklage_empfehlung"] == round(95 / 3 + 480 / 12 + 120 / 12, 2)
    notgroschen = next(g for g in result["sparziele"] if g["name"] == "Notgroschen")
    assert notgroschen["stand"] == 4000 + 9 * 400  # 28th of Jan..Sep


def test_stopped_contract_is_dropped():
    from app.sources.finance_import import Transaction

    txs = [Transaction(date(2026, m, 3), -9.99, "Altes Abo", "") for m in range(1, 5)]
    txs.append(Transaction(date(2026, 10, 1), -5.0, "Bäcker", ""))
    result = finance.analyse(txs, {}, date(2026, 10, 2))
    assert result["fixkosten"] == []


def test_import_folder_moves_files_and_dedupes(tmp_path):
    from app.sources.finance_import import connect, import_folder, load_all

    imp, db = tmp_path / "import", tmp_path / "db.sqlite"
    imp.mkdir()
    csv_text = "Buchungsdatum;Empfänger;Verwendungszweck;Betrag\n01.10.2026;Stadtwerke;Abschlag;-89,00\n"
    (imp / "export1.csv").write_text(csv_text, encoding="cp1252")
    (imp / "export2.csv").write_text(csv_text, encoding="utf-8")  # same booking again
    (imp / "kaputt.csv").write_text("foo;bar\n1;2\n")
    summary = import_folder(imp, db)
    assert summary["new"] == 1 and len(summary["errors"]) == 1
    assert len(list((imp / "done").iterdir())) == 2 and len(list((imp / "fehler").iterdir())) == 1
    assert [t.counterparty for t in load_all(connect(db))] == ["Stadtwerke"]


def test_amex_export_is_flipped_and_payments_dropped():
    # Layout of the American Express online export (German)
    rows = [
        ["Datum", "Beschreibung", "Betrag", "Erweiterte Details", "Erscheint auf Ihrer Abrechnung als", "Kategorie"],
        ["03/10/2026", "REWE MARKT GMBH", "54,20", "", "REWE", "Einkaufen-Lebensmittel"],
        ["05/10/2026", "ZAHLUNG ERHALTEN. BESTEN DANK.", "-812,00", "", "", ""],
        ["07/10/2026", "AMAZON EU", "-23,90", "Gutschrift", "AMAZON", "Einkaufen"],
    ]
    txs = parse_rows(rows, "activity.csv")
    assert [(t.day, t.amount, t.purpose, t.account) for t in txs] == [
        (date(2026, 10, 3), -54.20, "REWE MARKT GMBH", "Amex"),
        (date(2026, 10, 7), 23.90, "AMAZON EU", "Amex"),
    ]


def test_amex_detected_by_filename():
    rows = [["Datum", "Beschreibung", "Betrag"], ["03.10.2026", "Edeka", "12,00"]]
    assert parse_rows(rows, "Amex_Oktober.csv")[0].amount == -12.0
    assert parse_rows(rows, "giro.csv")[0].amount == 12.0


def test_amex_bill_on_current_account_is_not_counted_twice():
    today = date(2026, 10, 26)
    result = finance.analyse(demo.transactions(today), demo.RULES, today)
    names = {f["name"] for f in result["fixkosten"]}
    assert not any("American Express" in n for n in names)
    sep = next(m for m in result["monate"] if m["monat"] == "2026-09")
    txs = demo.transactions(today)
    card = sum(-t.amount for t in txs if t.account == "Amex" and t.day.strftime("%Y-%m") == "2026-09")
    fixed = sum(-t.amount for t in txs if not t.account and t.amount < 0 and t.day.strftime("%Y-%m") == "2026-09"
                and "American Express" not in t.counterparty and t.counterparty not in ("Tagesgeld", "Urlaub Unterkonto"))
    assert round(sep["ausgaben"], 2) == round(card + fixed, 2)
    # The refund lowers spending and does not appear as income
    assert "Amazon" not in {i["name"] for i in result["einnahmen_regelmaessig"]}
