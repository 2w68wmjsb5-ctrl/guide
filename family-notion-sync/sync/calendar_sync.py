"""One-way sync of TimeTree (and optional iCal links) into the Notion "Termine" database.

Only rows the sync created itself (they carry a "Quelle-ID") are updated or
removed; appointments entered directly in Notion are never touched. Future
rows whose event disappeared upstream are moved to the trash, past ones stay.
"""

import logging
from dataclasses import dataclass
from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo

from . import notion as n

log = logging.getLogger(__name__)
TZ = ZoneInfo("Europe/Berlin")

CATEGORY_HINTS = [  # first match wins, checked against label and calendar name
    (("müll", "abfall", "tonne", "papier", "wertstoff"), "Müll"),
    (("geburtstag", "birthday"), "Geburtstage"),
    (("ferien", "feiertag", "urlaub", "holiday"), "Ferien"),
    (("schule", "kita", "kindergarten"), "Schule & Kita"),
    (("sport", "training", "yoga", "fitness"), "Sport"),
    (("arzt", "termin"), "Termine"),
]


@dataclass
class Event:
    uid: str
    title: str
    start: str          # ISO date (all day) or ISO datetime with offset
    end: str | None
    location: str
    category: str
    source: str         # "TimeTree" or "iCal"


def category_for(*texts: str) -> str:
    haystack = " ".join(t.lower() for t in texts if t)
    for words, category in CATEGORY_HINTS:
        if any(w in haystack for w in words):
            return category
    return "Familie"


def _when(value) -> tuple[str, bool]:
    if isinstance(value, datetime):
        if value.tzinfo is None:
            value = value.replace(tzinfo=TZ)
        return value.astimezone(TZ).isoformat(timespec="minutes"), False
    return value.isoformat(), True


def events_from_ical(calendars: list[tuple[str, str, object]], start: date, days: int) -> list[Event]:
    """calendars: (source, calendar name, icalendar.Calendar)."""
    import recurring_ical_events

    end = start + timedelta(days=days)
    result = []
    for source, cal_name, cal in calendars:
        # recurring_ical_events stamps every occurrence with a RECURRENCE-ID, so
        # look at the source to know which events really are series
        series = {str(c.get("UID")) for c in cal.walk("VEVENT")
                  if c.get("RRULE") is not None or c.get("RDATE") is not None or c.get("RECURRENCE-ID") is not None}
        for ev in recurring_ical_events.of(cal).between(start, end):
            begin, all_day = _when(ev.get("DTSTART").dt)
            finish = ev.get("DTEND")
            finish_iso = None
            if finish is not None:
                if all_day:
                    last_day = finish.dt - timedelta(days=1)  # iCal all-day ends are exclusive
                    finish_iso = last_day.isoformat() if last_day > ev.get("DTSTART").dt else None
                else:
                    finish_iso = _when(finish.dt)[0]
            label = ""
            categories = ev.get("CATEGORIES")
            if categories is not None:
                cats = categories if isinstance(categories, list) else [categories]
                label = ", ".join(str(c) for cat in cats for c in cat.cats)
            title = str(ev.get("SUMMARY", "(ohne Titel)"))
            # One-off events keep their row when moved; each occurrence of a
            # series gets its own row, keyed by its original slot
            uid = str(ev.get("UID", title))
            if uid in series:
                recurrence = ev.get("RECURRENCE-ID")
                uid = f"{uid}|{_when(recurrence.dt)[0] if recurrence is not None else begin}"
            result.append(Event(
                uid=uid,
                title=title,
                start=begin,
                end=finish_iso,
                location=str(ev.get("LOCATION", "")),
                category=category_for(label, cal_name, title if source == "iCal" else ""),
                source=source,
            ))
    return result


def timetree_calendars(email: str, password: str, codes: list[str]) -> list[tuple[str, str, object]]:
    from timetree_exporter.api.auth import login
    from timetree_exporter.api.calendar import TimeTreeCalendar
    from timetree_exporter.calendar import Calendar
    from timetree_exporter.exporter import build_single_calendar

    api = TimeTreeCalendar(login(email, password))
    result = []
    for meta in api.get_metadata():
        if meta.get("deactivated_at") is not None:
            continue
        if codes and meta.get("alias_code") not in codes:
            continue
        cal = Calendar(api, meta)
        result.append(("TimeTree", cal.name or "TimeTree", build_single_calendar(cal.get_events(), cal.get_labels())))
    return result


def ical_calendars(urls: list[str]) -> list[tuple[str, str, object]]:
    import requests
    from icalendar import Calendar as ICalendar

    result = []
    for url in urls:
        response = requests.get(url.replace("webcal://", "https://"), timeout=30)
        response.raise_for_status()
        cal = ICalendar.from_ical(response.content)
        result.append(("iCal", str(cal.get("X-WR-CALNAME", "Kalender")), cal))
    return result


# --- comparing and writing ---------------------------------------------------

def _norm(value: str | None):
    """Notion returns '2026-10-27T15:30:00.000+01:00'; compare as real points in time."""
    if not value:
        return None
    if "T" not in value:
        return date.fromisoformat(value[:10])
    return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(TZ).replace(second=0, microsecond=0)


def _props(ev: Event) -> dict:
    return {
        "Titel": n.title(ev.title),
        "Datum": n.date(ev.start, ev.end),
        "Ort": n.text(ev.location),
        "Kategorie": n.select(ev.category),
        "Quelle": n.select(ev.source),
        "Quelle-ID": n.text(ev.uid),
    }


def _changed(page: dict, ev: Event) -> bool:
    current = page["properties"]["Datum"].get("date") or {}
    return (n.get(page, "Titel") != ev.title
            or _norm(current.get("start")) != _norm(ev.start)
            or _norm(current.get("end")) != _norm(ev.end)
            or (n.get(page, "Ort") or "") != ev.location)


def apply(notion: n.Notion, data_source_id: str, events: list[Event], sources_ok: set[str], today: date) -> str:
    existing = notion.query(data_source_id, {"property": "Quelle-ID", "rich_text": {"is_not_empty": True}})
    by_uid = {n.get(p, "Quelle-ID"): p for p in existing}
    created = updated = removed = 0
    seen = set()
    for ev in events:
        seen.add(ev.uid)
        page = by_uid.get(ev.uid)
        if page is None:
            notion.create(data_source_id, _props(ev))
            created += 1
        elif _changed(page, ev):
            props = _props(ev)
            del props["Kategorie"]  # keep a category the family picked by hand
            notion.update(page["id"], props)
            updated += 1
    for uid, page in by_uid.items():
        if uid in seen or n.get(page, "Quelle") not in sources_ok:
            continue
        start = _norm(n.get(page, "Datum"))
        start_day = start.date() if isinstance(start, datetime) else start
        if start_day and start_day >= today:
            notion.trash(page["id"])
            removed += 1
    return f"{len(events)} Termine: {created} neu, {updated} geändert, {removed} entfernt"
