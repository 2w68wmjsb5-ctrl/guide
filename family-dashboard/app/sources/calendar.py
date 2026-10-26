"""Appointments from TimeTree (unofficial login via timetree-exporter) and iCal links."""

import logging
from datetime import date, datetime, timedelta

import httpx
import recurring_ical_events
from icalendar import Calendar as ICalendar
from timetree_exporter.api.auth import login
from timetree_exporter.api.calendar import TimeTreeCalendar
from timetree_exporter.calendar import Calendar
from timetree_exporter.exporter import build_single_calendar

from .. import config

log = logging.getLogger(__name__)
DAYS_AHEAD = 21


def _timetree_calendars() -> list[tuple[str, ICalendar]]:
    api = TimeTreeCalendar(login(config.TIMETREE_EMAIL, config.TIMETREE_PASSWORD))
    result = []
    for meta in api.get_metadata():
        if meta.get("deactivated_at") is not None:
            continue
        if config.TIMETREE_CALENDAR_CODES and meta.get("alias_code") not in config.TIMETREE_CALENDAR_CODES:
            continue
        cal = Calendar(api, meta)
        result.append((cal.name or "TimeTree", build_single_calendar(cal.get_events(), cal.get_labels())))
    return result


def _ics_calendars() -> list[tuple[str, ICalendar]]:
    result = []
    for url in config.EXTRA_ICS_URLS:
        response = httpx.get(url.replace("webcal://", "https://"), timeout=20, follow_redirects=True)
        response.raise_for_status()
        cal = ICalendar.from_ical(response.content)
        result.append((str(cal.get("X-WR-CALNAME", "Kalender")), cal))
    return result


def _as_datetime(value) -> tuple[datetime, bool]:
    if isinstance(value, datetime):
        return value.astimezone(), False
    return datetime.combine(value, datetime.min.time()).astimezone(), True


def events_from(calendars: list[tuple[str, ICalendar]], start: date, days: int = DAYS_AHEAD) -> list[dict]:
    end = start + timedelta(days=days)
    events = []
    for source, cal in calendars:
        for ev in recurring_ical_events.of(cal).between(start, end):
            begin, all_day = _as_datetime(ev.get("DTSTART").dt)
            finish = ev.get("DTEND")
            categories = ev.get("CATEGORIES")
            label = ""
            if categories is not None:
                cats = categories if isinstance(categories, list) else [categories]
                label = ", ".join(str(c) for cat in cats for c in cat.cats)
            events.append({
                "titel": str(ev.get("SUMMARY", "(ohne Titel)")),
                "start": begin.isoformat(),
                "ende": _as_datetime(finish.dt)[0].isoformat() if finish else None,
                "ganztags": all_day,
                "ort": str(ev.get("LOCATION", "")),
                "kalender": source,
                "label": label,
            })
    return sorted(events, key=lambda e: e["start"])


def fetch() -> list[dict]:
    calendars = []
    if config.TIMETREE_EMAIL:
        calendars += _timetree_calendars()
    if config.EXTRA_ICS_URLS:
        calendars += _ics_calendars()
    return events_from(calendars, date.today())
