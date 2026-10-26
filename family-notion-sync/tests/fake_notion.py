"""In-memory stand-in for the Notion API, enough for the sync's queries and writes."""

import itertools

_ids = itertools.count(1)


def _read(prop: dict):
    """Turn a written property value back into what the API returns."""
    kind = next(iter(prop))
    value = prop[kind]
    if kind in ("title", "rich_text"):
        return {"type": kind, kind: [{"plain_text": part["text"]["content"]} for part in value]}
    return {"type": kind, kind: value}


class FakeNotion:
    def __init__(self, schema: dict[str, dict[str, str]]):
        """schema: data source -> {property name: type}"""
        self.schema = schema
        self.pages: dict[str, dict] = {}
        self.calls: list[tuple] = []

    def add(self, ds: str, **values) -> str:
        """Seed a row with plain values."""
        props = {}
        for name, kind in self.schema[ds].items():
            v = values.get(name)
            if kind in ("title", "rich_text"):
                props[name] = {"type": kind, kind: [{"plain_text": v}] if v else []}
            elif kind == "date":
                props[name] = {"type": "date", "date": {"start": v, "end": None} if v else None}
            elif kind == "select":
                props[name] = {"type": "select", "select": {"name": v} if v else None}
            elif kind == "checkbox":
                props[name] = {"type": "checkbox", "checkbox": bool(v)}
            elif kind == "relation":
                props[name] = {"type": "relation", "relation": [{"id": i} for i in (v or [])]}
            elif kind == "files":
                props[name] = {"type": "files", "files": v or []}
            else:
                props[name] = {"type": kind, kind: v}
        page_id = f"page-{next(_ids)}"
        self.pages[page_id] = {"id": page_id, "ds": ds, "in_trash": False, "properties": props}
        return page_id

    # --- API surface used by the sync --------------------------------------

    def query(self, ds: str, filter: dict | None = None) -> list[dict]:
        self.calls.append(("query", ds))
        rows = [p for p in self.pages.values() if p["ds"] == ds and not p["in_trash"]]
        return [p for p in rows if self._match(p, filter)]

    def create(self, ds: str, properties: dict) -> dict:
        self.calls.append(("create", ds))
        page_id = self.add(ds)
        for name, prop in properties.items():
            assert name in self.schema[ds], f"unknown property {name} in {ds}"
            self.pages[page_id]["properties"][name] = _read(prop)
        return self.pages[page_id]

    def update(self, page_id: str, properties: dict) -> dict:
        self.calls.append(("update", page_id))
        page = self.pages[page_id]
        for name, prop in properties.items():
            assert name in self.schema[page["ds"]], f"unknown property {name}"
            page["properties"][name] = _read(prop)
        return page

    def trash(self, page_id: str) -> dict:
        self.calls.append(("trash", page_id))
        self.pages[page_id]["in_trash"] = True
        return self.pages[page_id]

    # --- helpers -------------------------------------------------------------

    def _match(self, page: dict, f: dict | None) -> bool:
        if not f:
            return True
        if "or" in f:
            return any(self._match(page, sub) for sub in f["or"])
        prop = page["properties"][f["property"]]
        kind, cond = next((k, v) for k, v in f.items() if k != "property")
        value = prop[prop["type"]]
        if kind == "rich_text":
            text = "".join(x["plain_text"] for x in value)
            return bool(text) if cond.get("is_not_empty") else not text
        if kind == "select":
            name = value["name"] if value else None
            if cond.get("is_empty"):
                return name is None
            return name == cond["equals"]
        raise NotImplementedError(f)

    def rows(self, ds: str) -> list[dict]:
        from sync import notion as n
        return [{k: n.get(p, k) for k in self.schema[ds]} | {"id": p["id"]}
                for p in self.pages.values() if p["ds"] == ds and not p["in_trash"]]


SCHEMA = {
    "einkauf": {"Artikel": "title", "Info": "rich_text", "Gekauft": "checkbox", "In Bring": "checkbox", "Bereich": "select"},
    "termine": {"Titel": "title", "Datum": "date", "Ort": "rich_text", "Kategorie": "select",
                "Quelle": "select", "Quelle-ID": "rich_text"},
    "fixkosten": {"Name": "title", "Betrag": "number", "Intervall": "select", "Kategorie": "select",
                  "Nächste Abbuchung": "date", "Zuletzt abgebucht": "date", "Gekündigt": "checkbox",
                  "Quelle": "select", "Auto-ID": "rich_text"},
    "einnahmen": {"Name": "title", "Betrag": "number", "Intervall": "select", "Wer": "select",
                  "Nächster Eingang": "date", "Zuletzt eingegangen": "date", "Beendet": "checkbox",
                  "Quelle": "select", "Auto-ID": "rich_text"},
    "sparziele": {"Name": "title", "Ziel": "number", "Startstand": "number", "Seit": "date", "Begriffe": "rich_text"},
    "ruecklagen": {"Buchung": "title", "Datum": "date", "Betrag": "number", "Sparziel": "relation",
                   "Umsatz-ID": "rich_text"},
    "umsaetze": {"Empfänger": "title", "Datum": "date", "Betrag": "number", "Zweck": "rich_text",
                 "Kategorie": "rich_text", "Konto": "rich_text", "Umsatz-ID": "rich_text"},
    "finanz_import": {"Export": "title", "Datei": "files", "Status": "select", "Meldung": "rich_text",
                      "Neue Umsätze": "number"},
    "datenquellen": {"Quelle": "title", "Status": "select", "Zuletzt": "date", "Meldung": "rich_text"},
}
IDS = {k: k for k in ["einkaufsliste", "termine", "fixkosten", "einnahmen", "sparziele", "ruecklagen",
                      "umsaetze", "finanz_import", "datenquellen"]} | {"einkaufsliste": "einkauf"}
