import unittest
from datetime import date

from sync import calendar_sync
from tests.fake_notion import IDS, SCHEMA, FakeNotion

TODAY = date(2026, 10, 26)

ICS = """BEGIN:VCALENDAR
VERSION:2.0
PRODID:test
BEGIN:VEVENT
UID:arzt-1
SUMMARY:Kinderarzt U7
DTSTART;TZID=Europe/Berlin:20261028T153000
DTEND;TZID=Europe/Berlin:20261028T163000
LOCATION:Praxis Dr. Weber
END:VEVENT
BEGIN:VEVENT
UID:tonne-1
SUMMARY:Gelbe Tonne
DTSTART;VALUE=DATE:20261027
DTEND;VALUE=DATE:20261028
CATEGORIES:Müll
END:VEVENT
BEGIN:VEVENT
UID:ferien-1
SUMMARY:Herbstferien Ende
DTSTART;VALUE=DATE:20261029
DTEND;VALUE=DATE:20261101
END:VEVENT
BEGIN:VEVENT
UID:yoga-1
SUMMARY:Yoga
DTSTART;TZID=Europe/Berlin:20261020T183000
DTEND;TZID=Europe/Berlin:20261020T193000
RRULE:FREQ=WEEKLY;COUNT=4
END:VEVENT
END:VCALENDAR
"""


def calendars(text=ICS):
    from icalendar import Calendar
    return [("TimeTree", "Familie", Calendar.from_ical(text))]


class CalendarSyncTest(unittest.TestCase):
    def setUp(self):
        self.notion = FakeNotion(SCHEMA)
        self.ds = IDS["termine"]

    def sync(self, text=ICS, ok=("TimeTree",)):
        events = calendar_sync.events_from_ical(calendars(text), TODAY, 30)
        return calendar_sync.apply(self.notion, self.ds, events, set(ok), TODAY)

    def rows(self):
        return {(r["Titel"], (r["Datum"] or "")[:10]): r for r in self.notion.rows(self.ds)}

    def test_events_are_created_with_dates_and_categories(self):
        self.sync()
        rows = self.rows()
        self.assertEqual(rows[("Kinderarzt U7", "2026-10-28")]["Datum"], "2026-10-28T15:30+01:00")
        self.assertEqual(rows[("Kinderarzt U7", "2026-10-28")]["Ort"], "Praxis Dr. Weber")
        self.assertEqual(rows[("Gelbe Tonne", "2026-10-27")]["Kategorie"], "Müll")
        ferien = self.notion.pages[rows[("Herbstferien Ende", "2026-10-29")]["id"]]["properties"]["Datum"]["date"]
        self.assertEqual(ferien, {"start": "2026-10-29", "end": "2026-10-31"})
        # The weekly event: only occurrences from today on (27.10., 3.11., 10.11.)
        yoga = sorted(k[1] for k in rows if k[0] == "Yoga")
        self.assertEqual(yoga, ["2026-10-27", "2026-11-03", "2026-11-10"])
        self.assertTrue(all(r["Quelle"] == "TimeTree" for r in rows.values()))

    def test_second_run_writes_nothing(self):
        self.sync()
        before = len([c for c in self.notion.calls if c[0] != "query"])
        message = self.sync()
        self.assertIn("0 neu, 0 geändert, 0 entfernt", message)
        self.assertEqual(len([c for c in self.notion.calls if c[0] != "query"]), before)

    def test_changes_and_removals_follow_timetree(self):
        self.sync()
        changed = ICS.replace("Kinderarzt U7", "Kinderarzt U7 (verschoben)").replace("T153000", "T090000")
        changed = changed.replace("BEGIN:VEVENT\nUID:tonne-1", "BEGIN:VEVENT\nUID:tonne-gone")
        message = self.sync(changed)
        rows = self.rows()
        self.assertIn(("Kinderarzt U7 (verschoben)", "2026-10-28"), rows)
        self.assertEqual(rows[("Kinderarzt U7 (verschoben)", "2026-10-28")]["Datum"], "2026-10-28T09:00+01:00")
        self.assertIn("1 geändert", message)
        self.assertIn("1 neu", message)  # "tonne-gone" is new
        self.assertIn("1 entfernt", message)  # old "tonne-1" row trashed

    def test_manual_and_past_rows_stay(self):
        manual = self.notion.add(self.ds, Titel="Geburtstag Oma", Datum="2026-10-30")
        past = self.notion.add(self.ds, Titel="Alt", Datum="2026-10-01", Quelle="TimeTree", **{"Quelle-ID": "x|2026-10-01"})
        self.sync()
        ids = {r["id"] for r in self.notion.rows(self.ds)}
        self.assertIn(manual, ids)
        self.assertIn(past, ids)

    def test_failed_source_removes_nothing(self):
        self.sync()
        count = len(self.notion.rows(self.ds))
        events = []  # TimeTree login failed, so nothing came back and TimeTree is not "ok"
        calendar_sync.apply(self.notion, self.ds, events, set(), TODAY)
        self.assertEqual(len(self.notion.rows(self.ds)), count)

    def test_category_hints(self):
        self.assertEqual(calendar_sync.category_for("", "Abfallkalender"), "Müll")
        self.assertEqual(calendar_sync.category_for("Geburtstage"), "Geburtstage")
        self.assertEqual(calendar_sync.category_for("", "Familie"), "Familie")


if __name__ == "__main__":
    unittest.main()
