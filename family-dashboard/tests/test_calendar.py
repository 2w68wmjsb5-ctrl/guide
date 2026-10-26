from datetime import date

from icalendar import Calendar

from app.sources.calendar import events_from

ICS = b"""BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:1
SUMMARY:Yoga
DTSTART;TZID=Europe/Berlin:20261001T183000
DTEND;TZID=Europe/Berlin:20261001T193000
RRULE:FREQ=WEEKLY
CATEGORIES:Sport
END:VEVENT
BEGIN:VEVENT
UID:2
SUMMARY:Gelbe Tonne
DTSTART;VALUE=DATE:20261027
END:VEVENT
END:VCALENDAR
"""


def test_recurring_and_all_day_events():
    events = events_from([("Familie", Calendar.from_ical(ICS))], date(2026, 10, 26), days=14)
    titles = [e["titel"] for e in events]
    assert titles.count("Yoga") == 2
    tonne = next(e for e in events if e["titel"] == "Gelbe Tonne")
    assert tonne["ganztags"] and tonne["start"].startswith("2026-10-27")
    assert events[0]["label"] == "Sport" or events[1]["label"] == "Sport"
