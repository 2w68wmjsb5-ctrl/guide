"""Settings from environment variables and the optional config.yaml."""

import os
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = Path(os.getenv("DATA_DIR", ROOT / "data"))
IMPORT_DIR = DATA_DIR / "import"
DB_PATH = DATA_DIR / "dashboard.db"
CONFIG_PATH = Path(os.getenv("CONFIG_PATH", ROOT / "config.yaml"))


def env(name: str, default: str = "") -> str:
    return os.getenv(name, default).strip()


def env_list(name: str) -> list[str]:
    return [part.strip() for part in env(name).split(",") if part.strip()]


DEMO = env("DEMO").lower() in ("1", "true", "yes", "ja")

BRING_EMAIL = env("BRING_EMAIL")
BRING_PASSWORD = env("BRING_PASSWORD")
BRING_LIST = env("BRING_LIST")

TIMETREE_EMAIL = env("TIMETREE_EMAIL")
TIMETREE_PASSWORD = env("TIMETREE_PASSWORD")
TIMETREE_CALENDAR_CODES = env_list("TIMETREE_CALENDAR_CODES")
EXTRA_ICS_URLS = env_list("EXTRA_ICS_URLS")

DASHBOARD_USER = env("DASHBOARD_USER")
DASHBOARD_PASSWORD = env("DASHBOARD_PASSWORD")

# Refresh intervals in seconds
BRING_INTERVAL = 5 * 60
CALENDAR_INTERVAL = 30 * 60
IMPORT_INTERVAL = 60


def load_rules() -> dict:
    """Read config.yaml on every call so edits apply without a restart."""
    if not CONFIG_PATH.is_file():
        return {}
    with CONFIG_PATH.open(encoding="utf-8") as fh:
        return yaml.safe_load(fh) or {}
