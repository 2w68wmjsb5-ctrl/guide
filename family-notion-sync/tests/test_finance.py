import csv
import random
import tempfile
import unittest
from datetime import date, timedelta
from pathlib import Path
from unittest import mock

from sync import finance_sync
from sync import notion as n
from tests.fake_notion import IDS, SCHEMA, FakeNotion

TODAY = date(2026, 10, 26)
RULES = {"finanzen": {"ignorieren": ["Umbuchung"], "ruecklagen_begriffe": ["Tagesgeld"]}}


def demo_rows(today: date) -> list[list]:
    """A year of bookings like the app's demo data, as a Finanzguru-style CSV."""
    rnd = random.Random(42)
    rows = []
    month = date(today.year - 1, today.month, 1)
    monthly = [(1, 1150.00, "Wohnbau Mustermann", "Miete"), (2, 89.00, "Stadtwerke", "Abschlag Strom/Gas"),
               (3, 39.99, "Telekom Deutschland GmbH", "Internet"), (5, 17.99, "Netflix", "Abo"),
               (15, 49.00, "Deutsche Bahn", "Deutschlandticket"), (28, 180.00, "Kita Sonnenschein", "Beitrag")]
    while month <= today:
        def booking(day, amount, name, purpose):
            d = month.replace(day=min(day, 28))
            if d <= today:
                rows.append([d.strftime("%d.%m.%Y"), f"{amount:.2f}".replace(".", ","), name, purpose, "", "Giro"])
        booking(27, 3150.00, "Arbeitgeber A GmbH", "Gehalt")
        booking(10, 255.00, "Familienkasse", "Kindergeld")
        for day, amount, name, purpose in monthly:
            booking(day, -amount, name, purpose)
        booking(28, -400.00, "Tagesgeld", "Sparen")
        booking(20, -500.00, "Umbuchung Gemeinschaftskonto", "Umbuchung")
        if month.month in (1, 4, 7, 10):
            booking(15, -55.08, "Rundfunk ARD ZDF", "Quartal")
        for _ in range(6):
            booking(rnd.randint(1, 28), -round(rnd.uniform(8, 95), 2), rnd.choice(["REWE", "dm", "Aldi"]), "Karte")
        month = (month + timedelta(days=32)).replace(day=1)
    rows.append([date(today.year - 1, 3, 1).strftime("%d.%m.%Y"), "-470,00", "HUK-Coburg", "Kfz-Versicherung", "", "Giro"])
    rows.append([date(today.year, 3, 1).strftime("%d.%m.%Y"), "-480,00", "HUK-Coburg", "Kfz-Versicherung", "", "Giro"])
    return rows


def write_csv(path: Path, rows: list[list]) -> None:
    with path.open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh, delimiter=";")
        w.writerow(["Buchungstag", "Betrag", "Empfänger", "Verwendungszweck", "Analyse-Hauptkategorie", "Referenzkonto"])
        w.writerows(rows)


class FinanceSyncTest(unittest.TestCase):
    def setUp(self):
        self.notion = FakeNotion(SCHEMA)
        self.goal = self.notion.add("sparziele", Name="Notgroschen", Ziel=10000, Startstand=4000,
                                    Seit="2026-01-01", Begriffe="Tagesgeld")
        self.tmp = tempfile.TemporaryDirectory()
        self.csv = Path(self.tmp.name) / "finanzguru.csv"
        write_csv(self.csv, demo_rows(TODAY))

    def tearDown(self):
        self.tmp.cleanup()

    def upload(self):
        return self.notion.add("finanz_import", Export="Export", Status="Neu",
                               Datei=[{"name": "finanzguru.csv", "type": "file", "file": {"url": "https://x"}}])

    def run_sync(self):
        def fake_download(url, name, folder):
            return self.csv
        with mock.patch.object(finance_sync, "_download", fake_download):
            return finance_sync.sync(self.notion, IDS, RULES, TODAY)

    def test_nothing_to_do_without_uploads(self):
        self.assertEqual(self.run_sync(), "Keine neuen Exporte")

    def test_import_detects_contracts_income_and_savings(self):
        upload = self.upload()
        self.run_sync()
        imp = self.notion.rows("finanz_import")[0]
        self.assertEqual(imp["Status"], "Importiert")
        self.assertGreater(imp["Neue Umsätze"], 100)

        fixed = {r["Name"]: r for r in self.notion.rows("fixkosten")}
        for name in ["Wohnbau Mustermann", "Stadtwerke", "Netflix", "Kita Sonnenschein", "HUK-Coburg", "Rundfunk ARD ZDF"]:
            self.assertIn(name, fixed)
        self.assertNotIn("REWE", fixed)
        self.assertFalse(any("Umbuchung" in k for k in fixed))
        self.assertFalse(any("Tagesgeld" in k for k in fixed))
        self.assertEqual(fixed["HUK-Coburg"]["Intervall"], "jährlich")
        self.assertEqual(fixed["Rundfunk ARD ZDF"]["Intervall"], "vierteljährlich")
        self.assertEqual(fixed["Wohnbau Mustermann"]["Kategorie"], "Wohnen")
        self.assertEqual(fixed["Netflix"]["Kategorie"], "Abos")
        self.assertEqual(fixed["Netflix"]["Quelle"], "Automatisch")
        self.assertTrue(all(r["Nächste Abbuchung"] for r in fixed.values()))

        income = {r["Name"] for r in self.notion.rows("einnahmen")}
        self.assertEqual(income, {"Arbeitgeber A GmbH", "Familienkasse"})

        savings = self.notion.rows("ruecklagen")
        self.assertTrue(savings)
        self.assertTrue(all(r["Sparziel"] == [self.goal] for r in savings))
        self.assertTrue(all(r["Datum"] >= "2026-01-01" for r in savings))
        self.assertEqual(sum(r["Betrag"] for r in savings), 400 * len(savings))
        self.assertTrue(upload)

    def test_reimport_adds_nothing(self):
        self.upload()
        self.run_sync()
        counts = {ds: len(self.notion.rows(ds)) for ds in ("umsaetze", "fixkosten", "einnahmen", "ruecklagen")}
        self.upload()
        message = self.run_sync()
        self.assertIn("0 neue Umsätze", message)
        self.assertEqual({ds: len(self.notion.rows(ds)) for ds in counts}, counts)

    def test_manual_rows_are_left_alone(self):
        manual = self.notion.add("fixkosten", Name="Kita", Betrag=180, Intervall="monatlich", Quelle="Manuell")
        self.upload()
        self.run_sync()
        row = next(r for r in self.notion.rows("fixkosten") if r["id"] == manual)
        self.assertEqual(row["Betrag"], 180)
        self.assertFalse(row["Gekündigt"])

    def test_broken_file_is_marked(self):
        self.csv.write_text("nur;Unsinn\n1;2\n", encoding="utf-8")
        self.upload()
        with self.assertRaises(RuntimeError):
            self.run_sync()
        self.assertEqual(self.notion.rows("finanz_import")[0]["Status"], "Fehler")


class PlanRecurringTest(unittest.TestCase):
    def test_stopped_contract_gets_flag_once(self):
        notion = FakeNotion(SCHEMA)
        notion.add("fixkosten", Name="Altes Abo", **{"Auto-ID": "altes abo"})
        existing = notion.query("fixkosten")
        creates, updates = finance_sync.plan_recurring([], existing, "Gekündigt", False)
        self.assertEqual(creates, [])
        self.assertEqual(updates, [(existing[0]["id"], {"Gekündigt": n.checkbox(True)})])
        notion.update(*updates[0])
        _, updates = finance_sync.plan_recurring([], notion.query("fixkosten"), "Gekündigt", False)
        self.assertEqual(updates, [])


if __name__ == "__main__":
    unittest.main()
