"""Family dashboard: syncs the sources in the background and serves the web UI."""

import asyncio
import base64
import logging
import secrets
from contextlib import asynccontextmanager
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from . import config, demo, finance, tasks
from .sources import finance_import

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
log = logging.getLogger("dashboard")

STATIC_DIR = config.ROOT / "static"

state = {
    "einkauf": None,
    "termine": None,
    "status": {},  # source -> {ok, zeit, fehler}
}


def _mark(source: str, error: Exception | None = None, note: str = "") -> None:
    state["status"][source] = {
        "ok": error is None,
        "zeit": datetime.now().isoformat(timespec="seconds"),
        "fehler": str(error) if error else "",
        "info": note,
    }


async def _loop(source: str, interval: int, job) -> None:
    while True:
        try:
            await job()
        except Exception as exc:
            log.exception("%s sync failed", source)
            _mark(source, exc)
        await asyncio.sleep(interval)


async def sync_bring() -> None:
    from .sources import bring

    state["einkauf"] = await bring.fetch()
    _mark("Bring!")


async def sync_calendar() -> None:
    from .sources import calendar

    state["termine"] = await asyncio.to_thread(calendar.fetch)
    _mark("Kalender", note=f"{len(state['termine'])} Termine")


async def sync_import() -> None:
    summary = await asyncio.to_thread(finance_import.import_folder, config.IMPORT_DIR, config.DB_PATH)
    if summary["files"] or summary["errors"] or "Finanzen" not in state["status"]:
        error = RuntimeError("; ".join(summary["errors"])) if summary["errors"] else None
        _mark("Finanzen", error, f"{summary['new']} neue Umsätze" if summary["files"] else "")


def _tasks_db() -> Path:
    # Demo mode gets a throwaway database so it never mixes with real chores
    return config.DATA_DIR / "demo.db" if config.DEMO else config.DB_PATH


def _players() -> list[str]:
    names = [str(n) for n in config.load_rules().get("familie") or [] if str(n).strip()]
    return names or ["Spieler 1", "Spieler 2"]


def _prepare_tasks() -> None:
    db = _tasks_db()
    if config.DEMO:
        db.unlink(missing_ok=True)
    conn = tasks.connect(db)
    try:
        if config.DEMO:
            demo.seed_tasks(conn, _players())
        else:
            tasks.seed_defaults(conn, config.load_rules().get("haushalt"))
    finally:
        conn.close()


@asynccontextmanager
async def lifespan(_: FastAPI):
    jobs = []
    _prepare_tasks()
    if config.DEMO:
        state["einkauf"], state["termine"] = demo.shopping(), demo.events()
        for source in ("Bring!", "Kalender", "Finanzen"):
            _mark(source, note="Demo-Daten")
    else:
        if config.BRING_EMAIL:
            jobs.append(asyncio.create_task(_loop("Bring!", config.BRING_INTERVAL, sync_bring)))
        if config.TIMETREE_EMAIL or config.EXTRA_ICS_URLS:
            jobs.append(asyncio.create_task(_loop("Kalender", config.CALENDAR_INTERVAL, sync_calendar)))
        jobs.append(asyncio.create_task(_loop("Finanzen", config.IMPORT_INTERVAL, sync_import)))
    yield
    for job in jobs:
        job.cancel()


app = FastAPI(title="Familien-Dashboard", lifespan=lifespan)


@app.middleware("http")
async def basic_auth(request: Request, call_next):
    if not config.DASHBOARD_PASSWORD:
        return await call_next(request)
    header = request.headers.get("authorization", "")
    if header.startswith("Basic "):
        try:
            user, _, pw = base64.b64decode(header[6:]).decode().partition(":")
        except ValueError:
            user, pw = "", ""
        if secrets.compare_digest(user, config.DASHBOARD_USER) and secrets.compare_digest(pw, config.DASHBOARD_PASSWORD):
            return await call_next(request)
    return JSONResponse({"detail": "Login nötig"}, status_code=401,
                        headers={"WWW-Authenticate": 'Basic realm="Dashboard"'})


def _finances() -> dict:
    if config.DEMO:
        return finance.analyse(demo.transactions(), demo.RULES)
    conn = finance_import.connect(config.DB_PATH)
    try:
        transactions = finance_import.load_all(conn)
    finally:
        conn.close()
    return finance.analyse(transactions, config.load_rules())


def _tasks_overview() -> dict:
    conn = tasks.connect(_tasks_db())
    try:
        return tasks.overview(conn, _players())
    finally:
        conn.close()


@app.get("/api/dashboard")
async def dashboard():
    return {
        "finanzen": await asyncio.to_thread(_finances),
        "aufgaben": _tasks_overview(),
        "einkauf": state["einkauf"],
        "termine": state["termine"],
        "status": state["status"],
        "demo": config.DEMO,
    }


class Item(BaseModel):
    name: str
    info: str = ""


@app.post("/api/einkauf")
async def add_item(item: Item):
    if config.DEMO:
        state["einkauf"]["offen"].append(item.model_dump())
        return {"ok": True}
    from .sources import bring

    await bring.add(item.name, item.info)
    await sync_bring()
    return {"ok": True}


@app.post("/api/einkauf/erledigt")
async def complete_item(item: Item):
    if config.DEMO:
        einkauf = state["einkauf"]
        einkauf["offen"] = [i for i in einkauf["offen"] if i["name"] != item.name]
        einkauf["zuletzt"].insert(0, item.name)
        return {"ok": True}
    from .sources import bring

    await bring.complete(item.name)
    await sync_bring()
    return {"ok": True}


class NewTask(BaseModel):
    art: str            # "haushalt" or "todo"
    titel: str
    alle_tage: int | None = None
    faellig: str | None = None


class Done(BaseModel):
    wer: str = ""


def _with_tasks(fn, *args):
    conn = tasks.connect(_tasks_db())
    try:
        return fn(conn, *args)
    finally:
        conn.close()


@app.post("/api/aufgaben")
async def add_task(task: NewTask):
    if not task.titel.strip():
        raise HTTPException(400, "Titel fehlt")
    try:
        task_id = _with_tasks(tasks.add, task.art, task.titel, task.alle_tage, task.faellig)
    except ValueError as exc:
        raise HTTPException(400, str(exc))
    return {"id": task_id}


@app.post("/api/aufgaben/{task_id}/erledigt")
async def complete_task(task_id: int, done: Done):
    try:
        _with_tasks(tasks.complete, task_id, done.wer)
    except KeyError:
        raise HTTPException(404, "Aufgabe nicht gefunden")
    return {"ok": True}


@app.post("/api/aufgaben/{task_id}/offen")
async def reopen_task(task_id: int):
    _with_tasks(tasks.reopen, task_id)
    return {"ok": True}


@app.delete("/api/aufgaben/{task_id}")
async def delete_task(task_id: int):
    _with_tasks(tasks.delete, task_id)
    return {"ok": True}


@app.post("/api/import")
async def upload(file: UploadFile):
    """Upload an export from the phone's browser instead of copying it to the share."""
    name = Path(file.filename or "upload.csv").name
    if Path(name).suffix.lower() not in (".csv", ".txt", ".xlsx", ".xlsm"):
        raise HTTPException(400, "Bitte eine CSV- oder Excel-Datei hochladen")
    config.IMPORT_DIR.mkdir(parents=True, exist_ok=True)
    (config.IMPORT_DIR / name).write_bytes(await file.read())
    await sync_import()
    return state["status"]["Finanzen"]


@app.get("/")
async def index():
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/sw.js")
async def service_worker():
    # Served from the root so it may control the whole app, not just /static
    return FileResponse(STATIC_DIR / "sw.js", media_type="text/javascript",
                        headers={"Cache-Control": "no-cache"})


app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
