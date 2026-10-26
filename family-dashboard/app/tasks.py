"""Household quests (recurring chores with XP per player) and one-off to-dos.

Unlike the other sections these are entered in the dashboard itself, so they
live in their own SQLite tables next to the transactions.
"""

import sqlite3
from datetime import date, timedelta
from pathlib import Path

XP_PER_LEVEL = 100

DEFAULT_CHORES = [  # (title, every n days, xp)
    ("Staubsaugen", 7, 20),
    ("Bad putzen", 7, 30),
    ("Küche wischen", 3, 10),
    ("Müll rausbringen", 3, 5),
    ("Wäsche waschen", 4, 15),
    ("Bettwäsche wechseln", 14, 20),
    ("Pflanzen gießen", 4, 5),
    ("Kühlschrank ausmisten", 30, 25),
]


def connect(db_path: Path) -> sqlite3.Connection:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            kind TEXT NOT NULL,             -- 'haushalt' or 'todo'
            title TEXT NOT NULL,
            every_days INTEGER,             -- chores only
            xp INTEGER NOT NULL DEFAULT 10,
            due TEXT,                       -- to-dos only, optional
            last_done TEXT,
            created TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS task_log (
            task_id INTEGER, player TEXT, day TEXT, xp INTEGER
        );
    """)
    return conn


def seed_defaults(conn: sqlite3.Connection, chores: list | None = None, today: date | None = None) -> None:
    """Fill in a starter set of chores the first time the dashboard runs."""
    if conn.execute("SELECT COUNT(*) FROM tasks").fetchone()[0]:
        return
    today = today or date.today()
    rows = chores or [{"titel": t, "alle_tage": d, "xp": x} for t, d, x in DEFAULT_CHORES]
    conn.executemany(
        "INSERT INTO tasks (kind, title, every_days, xp, created) VALUES ('haushalt', ?, ?, ?, ?)",
        [(c["titel"], int(c.get("alle_tage", 7)), int(c.get("xp", 10)), today.isoformat()) for c in rows],
    )
    conn.commit()


def add(conn: sqlite3.Connection, kind: str, title: str, every_days: int | None = None,
        due: str | None = None, xp: int | None = None, today: date | None = None) -> int:
    if kind not in ("haushalt", "todo"):
        raise ValueError("Unbekannte Art")
    if kind == "haushalt" and not every_days:
        every_days = 7
    if xp is None:
        # Rarer chores are worth more
        xp = min(50, 5 + 2 * (every_days or 0)) if kind == "haushalt" else 10
    cur = conn.execute(
        "INSERT INTO tasks (kind, title, every_days, xp, due, created) VALUES (?, ?, ?, ?, ?, ?)",
        (kind, title.strip(), every_days if kind == "haushalt" else None, xp, due or None,
         (today or date.today()).isoformat()),
    )
    conn.commit()
    return cur.lastrowid


def complete(conn: sqlite3.Connection, task_id: int, player: str = "", today: date | None = None) -> None:
    today = today or date.today()
    task = conn.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()
    if task is None:
        raise KeyError(task_id)
    conn.execute("UPDATE tasks SET last_done = ? WHERE id = ?", (today.isoformat(), task_id))
    conn.execute("INSERT INTO task_log VALUES (?, ?, ?, ?)", (task_id, player, today.isoformat(), task["xp"]))
    conn.commit()


def reopen(conn: sqlite3.Connection, task_id: int) -> None:
    """Undo a to-do ticked by mistake, including its XP."""
    conn.execute("UPDATE tasks SET last_done = NULL WHERE id = ? AND kind = 'todo'", (task_id,))
    conn.execute("""DELETE FROM task_log WHERE rowid = (
        SELECT MAX(rowid) FROM task_log WHERE task_id = ?)""", (task_id,))
    conn.commit()


def delete(conn: sqlite3.Connection, task_id: int) -> None:
    conn.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()


def overview(conn: sqlite3.Connection, players: list[str], today: date | None = None) -> dict:
    today = today or date.today()
    chores, todos = [], []
    for t in conn.execute("SELECT * FROM tasks ORDER BY id"):
        if t["kind"] == "haushalt":
            last = date.fromisoformat(t["last_done"]) if t["last_done"] else None
            next_due = last + timedelta(days=t["every_days"]) if last else today
            last_player = conn.execute(
                "SELECT player FROM task_log WHERE task_id = ? ORDER BY rowid DESC LIMIT 1", (t["id"],)
            ).fetchone()
            chores.append({
                "id": t["id"], "titel": t["title"], "alle_tage": t["every_days"], "xp": t["xp"],
                "zuletzt": t["last_done"], "zuletzt_von": last_player[0] if last_player else "",
                "faellig": next_due.isoformat(), "faellig_in": (next_due - today).days,
            })
        else:
            done = t["last_done"]
            # Finished to-dos stay visible (struck through) until the next day
            if done and date.fromisoformat(done) < today:
                continue
            todos.append({
                "id": t["id"], "titel": t["title"], "faellig": t["due"], "erledigt": bool(done), "xp": t["xp"],
                "faellig_in": (date.fromisoformat(t["due"]) - today).days if t["due"] else None,
            })
    chores.sort(key=lambda c: (c["faellig_in"], c["titel"]))
    todos.sort(key=lambda t: (t["erledigt"], t["faellig"] is None, t["faellig"] or "", t["id"]))

    week_start = (today - timedelta(days=today.weekday())).isoformat()
    stats = []
    for name in players:
        total, week = conn.execute(
            "SELECT COALESCE(SUM(xp), 0), COALESCE(SUM(CASE WHEN day >= ? THEN xp END), 0) FROM task_log WHERE player = ?",
            (week_start, name),
        ).fetchone()
        stats.append({
            "name": name, "xp": total, "woche_xp": week,
            "level": total // XP_PER_LEVEL + 1, "fortschritt": total % XP_PER_LEVEL, "pro_level": XP_PER_LEVEL,
        })
    return {"haushalt": chores, "todos": todos, "spieler": stats}
