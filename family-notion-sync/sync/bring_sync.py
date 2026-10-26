"""Two-way sync between the Bring! list and the Notion shopping list.

Notion keeps a hidden checkbox "In Bring" per row, which turns the two lists
into a small state machine:

  open, In Bring       Bring still has it  -> take over Bring's details
                       Bring lost it       -> bought in Bring: tick it in Notion
  open, not In Bring   new in Notion       -> add to Bring
  bought, In Bring     ticked in Notion    -> complete it in Bring
  missing in Notion    new in Bring        -> add a row (or reopen an old one)

Items are matched by name, case-insensitively, the way Bring! itself does.
"""

import asyncio
import logging
from dataclasses import dataclass, field

from . import notion as n

log = logging.getLogger(__name__)


@dataclass
class Row:
    id: str
    name: str
    info: str
    bought: bool
    in_bring: bool


@dataclass
class Plan:
    notion_create: list[tuple[str, str]] = field(default_factory=list)       # (name, info)
    notion_update: list[tuple[str, dict]] = field(default_factory=list)      # (page id, properties)
    bring_add: list[tuple[str, str]] = field(default_factory=list)           # (name, info)
    bring_complete: list[str] = field(default_factory=list)                  # name

    def summary(self) -> str:
        return (f"{len(self.bring_add)} nach Bring!, {len(self.bring_complete)} in Bring! abgehakt, "
                f"{len(self.notion_create)} neu in Notion, {len(self.notion_update)} in Notion aktualisiert")


def _key(name: str) -> str:
    return " ".join(name.lower().split())


def plan(rows: list[Row], purchase: dict[str, tuple[str, str]]) -> Plan:
    """purchase maps key -> (name as in Bring, specification)."""
    result = Plan()
    handled: set[str] = set()
    open_keys = {_key(r.name) for r in rows if not r.bought}

    for row in rows:
        if not row.name.strip():
            continue
        k = _key(row.name)
        if not row.bought:
            if k in handled:
                continue  # duplicate open row: leave it alone
            handled.add(k)
            if row.in_bring:
                if k in purchase:
                    spec = purchase[k][1]
                    if spec != row.info:
                        result.notion_update.append((row.id, {"Info": n.text(spec)}))
                else:
                    result.notion_update.append((row.id, {"Gekauft": n.checkbox(True), "In Bring": n.checkbox(False)}))
            else:
                if k in purchase:
                    props = {"In Bring": n.checkbox(True)}
                    if not row.info and purchase[k][1]:
                        props["Info"] = n.text(purchase[k][1])
                    result.notion_update.append((row.id, props))
                else:
                    result.bring_add.append((row.name.strip(), row.info))
                    result.notion_update.append((row.id, {"In Bring": n.checkbox(True)}))
        elif row.in_bring:
            if k in purchase and k not in open_keys:
                result.bring_complete.append(purchase[k][0])
                handled.add(k)
            result.notion_update.append((row.id, {"In Bring": n.checkbox(False)}))

    bought_by_key: dict[str, Row] = {}
    for row in rows:
        if row.bought and not row.in_bring:
            bought_by_key.setdefault(_key(row.name), row)
    for k, (name, spec) in purchase.items():
        if k in handled:
            continue
        old = bought_by_key.get(k)
        if old:
            result.notion_update.append((old.id, {
                "Gekauft": n.checkbox(False), "In Bring": n.checkbox(True), "Info": n.text(spec)}))
        else:
            result.notion_create.append((name, spec))
    return result


def read_rows(notion: n.Notion, data_source_id: str) -> list[Row]:
    return [Row(
        id=p["id"],
        name=n.get(p, "Artikel") or "",
        info=n.get(p, "Info") or "",
        bought=bool(n.get(p, "Gekauft")),
        in_bring=bool(n.get(p, "In Bring")),
    ) for p in notion.query(data_source_id)]


class BringList:
    """Thin wrapper around the unofficial bring-api client (same as Home Assistant)."""

    def __init__(self, email: str, password: str, list_name: str = ""):
        self.email, self.password, self.list_name = email, password, list_name

    async def _run(self, job):
        import aiohttp
        from bring_api import Bring

        async with aiohttp.ClientSession() as session:
            bring = Bring(session, self.email, self.password)
            await bring.login()
            lists = (await bring.load_lists()).lists
            if not lists:
                raise RuntimeError("Keine Bring!-Liste gefunden")
            wanted = self.list_name.lower()
            chosen = next((l for l in lists if l.name.lower() == wanted), lists[0])
            return await job(bring, chosen.listUuid)

    def purchase(self) -> dict[str, tuple[str, str]]:
        async def job(bring, uuid):
            items = (await bring.get_list(uuid)).items
            return {_key(i.itemId): (i.itemId, i.specification or "") for i in items.purchase}
        return asyncio.run(self._run(job))

    def apply(self, add: list[tuple[str, str]], complete: list[str]) -> None:
        if not add and not complete:
            return

        async def job(bring, uuid):
            for name, info in add:
                await bring.save_item(uuid, name, info)
            for name in complete:
                await bring.complete_item(uuid, name)
        asyncio.run(self._run(job))


def sync(notion: n.Notion, data_source_id: str, bring: BringList) -> str:
    purchase = bring.purchase()
    rows = read_rows(notion, data_source_id)
    todo = plan(rows, purchase)
    bring.apply(todo.bring_add, todo.bring_complete)
    for page_id, props in todo.notion_update:
        notion.update(page_id, props)
    for name, info in todo.notion_create:
        notion.create(data_source_id, {
            "Artikel": n.title(name), "Info": n.text(info), "In Bring": n.checkbox(True)})
    return todo.summary()
