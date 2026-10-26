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
