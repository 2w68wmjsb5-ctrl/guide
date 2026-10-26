"""Entry point: python -m sync [bring] [termine] [finanzen]

Without arguments all configured sources run. Each source reports its state to
the "Datenquellen" database, which the dashboard shows. Credentials come from
environment variables (GitHub secrets), never from files in the repo.
"""

import logging
import os
import sys
from datetime import date, datetime
from pathlib import Path
from zoneinfo import ZoneInfo

import yaml

from . import bring_sync, calendar_sync, finance_sync
from . import notion as n

log = logging.getLogger("sync")
ROOT = Path(__file__).resolve().parent.parent
TZ = ZoneInfo("Europe/Berlin")


def env(name: str) -> str:
    return os.getenv(name, "").strip()


def env_list(name: str) -> list[str]:
    return [part.strip() for part in env(name).split(",") if part.strip()]


class Status:
    """Writes one row per source into the "Datenquellen" database."""

    def __init__(self, notion: n.Notion, data_source_id: str):
        self.notion = notion
        self.rows = {n.get(p, "Quelle"): p["id"] for p in notion.query(data_source_id)}
        self.data_source_id = data_source_id

    def set(self, source: str, state: str, message: str) -> None:
        props = {
            "Status": n.select(state),
            "Meldung": n.text(message[:300]),
            "Zuletzt": n.date(datetime.now(TZ).isoformat(timespec="minutes")),
        }
        if source in self.rows:
            self.notion.update(self.rows[source], props)
        else:
            self.notion.create(self.data_source_id, {"Quelle": n.title(source)} | props)


def run_bring(notion, ids, config) -> str | None:
    if not env("BRING_EMAIL"):
        return None
    bring = bring_sync.BringList(env("BRING_EMAIL"), env("BRING_PASSWORD"), env("BRING_LIST"))
    return bring_sync.sync(notion, ids["einkaufsliste"], bring)


def run_termine(notion, ids, config) -> str | None:
    calendars, sources_ok = [], set()
    if env("TIMETREE_EMAIL"):
        calendars += calendar_sync.timetree_calendars(
            env("TIMETREE_EMAIL"), env("TIMETREE_PASSWORD"), env_list("TIMETREE_CALENDAR_CODES"))
        sources_ok.add("TimeTree")
    if env_list("EXTRA_ICS_URLS"):
        calendars += calendar_sync.ical_calendars(env_list("EXTRA_ICS_URLS"))
        sources_ok.add("iCal")
    if not sources_ok:
        return None
    today = datetime.now(TZ).date()
    events = calendar_sync.events_from_ical(calendars, today, int(config.get("termine_tage", 90)))
    return calendar_sync.apply(notion, ids["termine"], events, sources_ok, today)


def run_finanzen(notion, ids, config) -> str | None:
    return finance_sync.sync(notion, ids, config, datetime.now(TZ).date())


JOBS = {
    "bring": ("Bring!", run_bring),
    "termine": ("TimeTree", run_termine),
    "finanzen": ("Finanz-Import", run_finanzen),
}


def main(argv: list[str]) -> int:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")
    token = env("NOTION_TOKEN")
    if not token:
        log.error("NOTION_TOKEN fehlt")
        return 2
    config = yaml.safe_load((ROOT / "config.yaml").read_text(encoding="utf-8")) or {}
    ids = config["notion"]
    notion = n.Notion(token)
    status = Status(notion, ids["datenquellen"])

    failed = False
    for name in argv or list(JOBS):
        label, job = JOBS[name]
        try:
            message = job(notion, ids, config)
            if message is None:
                status.set(label, "Aus", "Nicht eingerichtet (Zugangsdaten fehlen)")
                log.info("%s: nicht eingerichtet", label)
            else:
                status.set(label, "OK", message)
                # Only counts are logged, the workflow log may be public
                log.info("%s: %s", label, message if name != "finanzen" else "fertig")
        except Exception as exc:
            failed = True
            log.error("%s: Fehler (%s)", label, type(exc).__name__)
            try:
                status.set(label, "Fehler", f"{type(exc).__name__}: {str(exc)[:200]}")
            except Exception:
                log.error("Status konnte nicht in Notion gespeichert werden")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
