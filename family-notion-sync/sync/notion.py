"""Small Notion API client plus helpers to read and write property values.

Uses the data-source endpoints of API version 2025-09-03, because the
dashboard's databases are addressed by their data source (collection) IDs.
"""

import time

import requests

API = "https://api.notion.com/v1"
VERSION = "2025-09-03"


class NotionError(RuntimeError):
    pass


class Notion:
    def __init__(self, token: str, session: requests.Session | None = None):
        self.session = session or requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {token}",
            "Notion-Version": VERSION,
            "Content-Type": "application/json",
        })

    def _call(self, method: str, path: str, body: dict | None = None) -> dict:
        for attempt in range(5):
            response = self.session.request(method, f"{API}{path}", json=body, timeout=30)
            if response.status_code == 429 or response.status_code >= 500:
                # Rate limit (3 requests/s on average) or a hiccup: wait and retry
                time.sleep(float(response.headers.get("Retry-After", 1 + attempt * 2)))
                continue
            if not response.ok:
                # Only the error code goes into the message: the body can echo page content
                try:
                    code = response.json().get("code", "")
                except ValueError:
                    code = ""
                raise NotionError(f"Notion {method} {path.split('/')[1]}: HTTP {response.status_code} {code}")
            return response.json()
        raise NotionError(f"Notion {method} {path.split('/')[1]}: zu viele Wiederholungen")

    def query(self, data_source_id: str, filter: dict | None = None) -> list[dict]:
        pages, cursor = [], None
        while True:
            body: dict = {"page_size": 100}
            if filter:
                body["filter"] = filter
            if cursor:
                body["start_cursor"] = cursor
            result = self._call("POST", f"/data_sources/{data_source_id}/query", body)
            pages += result["results"]
            if not result.get("has_more"):
                return pages
            cursor = result["next_cursor"]

    def create(self, data_source_id: str, properties: dict) -> dict:
        return self._call("POST", "/pages", {
            "parent": {"type": "data_source_id", "data_source_id": data_source_id},
            "properties": properties,
        })

    def update(self, page_id: str, properties: dict) -> dict:
        return self._call("PATCH", f"/pages/{page_id}", {"properties": properties})

    def trash(self, page_id: str) -> dict:
        return self._call("PATCH", f"/pages/{page_id}", {"in_trash": True})


# --- reading property values -------------------------------------------------

def _plain(rich: list) -> str:
    return "".join(part.get("plain_text", "") for part in rich or [])


def get(page: dict, name: str):
    """Return a property value as a plain Python value."""
    prop = page["properties"].get(name)
    if prop is None:
        return None
    kind = prop["type"]
    value = prop.get(kind)
    if kind in ("title", "rich_text"):
        return _plain(value)
    if kind in ("select", "status"):
        return value["name"] if value else None
    if kind == "multi_select":
        return [v["name"] for v in value]
    if kind == "date":
        return value["start"] if value else None
    if kind == "relation":
        return [v["id"] for v in value]
    if kind == "files":
        return [{"name": f.get("name", ""), "url": (f.get("file") or f.get("external") or {}).get("url")}
                for f in value]
    if kind == "formula":
        return value.get(value.get("type"))
    return value  # number, checkbox, url, created_time, ...


# --- writing property values -------------------------------------------------

def title(text: str) -> dict:
    return {"title": [{"text": {"content": text[:2000]}}]}


def text(value: str) -> dict:
    return {"rich_text": [{"text": {"content": value[:2000]}}] if value else []}


def number(value: float | None) -> dict:
    return {"number": value}


def checkbox(value: bool) -> dict:
    return {"checkbox": bool(value)}


def select(name: str | None) -> dict:
    return {"select": {"name": name} if name else None}


def date(start: str | None, end: str | None = None) -> dict:
    if not start:
        return {"date": None}
    return {"date": {"start": start, "end": end}}


def relation(*page_ids: str) -> dict:
    return {"relation": [{"id": pid} for pid in page_ids]}
