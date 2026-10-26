"""Bring! shopping list via the unofficial bring-api client (also used by Home Assistant)."""

import aiohttp
from bring_api import Bring

from .. import config


async def _client(session: aiohttp.ClientSession) -> tuple[Bring, str, str]:
    bring = Bring(session, config.BRING_EMAIL, config.BRING_PASSWORD)
    await bring.login()
    lists = (await bring.load_lists()).lists
    if not lists:
        raise RuntimeError("Keine Bring!-Liste gefunden")
    chosen = next((l for l in lists if l.name.lower() == config.BRING_LIST.lower()), lists[0])
    return bring, chosen.listUuid, chosen.name


async def fetch() -> dict:
    async with aiohttp.ClientSession() as session:
        bring, list_uuid, name = await _client(session)
        items = (await bring.get_list(list_uuid)).items
        return {
            "liste": name,
            "offen": [{"name": i.itemId, "info": i.specification} for i in items.purchase],
            "zuletzt": [i.itemId for i in items.recently[:12]],
        }


async def add(item: str, info: str = "") -> None:
    async with aiohttp.ClientSession() as session:
        bring, list_uuid, _ = await _client(session)
        await bring.save_item(list_uuid, item, info)


async def complete(item: str) -> None:
    async with aiohttp.ClientSession() as session:
        bring, list_uuid, _ = await _client(session)
        await bring.complete_item(list_uuid, item)
