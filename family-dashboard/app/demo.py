"""Sample data so the dashboard can be tried without any accounts (DEMO=true)."""

import random
from datetime import date, datetime, timedelta

from . import tasks
from .sources.finance_import import Transaction

RULES = {
    "finanzen": {"ruecklagen_begriffe": ["Tagesgeld"]},
    "sparziele": [
        {"name": "Notgroschen", "ziel": 10000, "start": 4000, "seit": "2026-01-01", "begriffe": ["Tagesgeld"]},
        {"name": "Urlaub", "ziel": 3000, "start": 650, "seit": "2026-01-01", "begriffe": ["Urlaub"]},
    ],
}


def transactions(today: date | None = None) -> list[Transaction]:
    today = today or date.today()
    rnd = random.Random(42)
    txs = []
    start = date(today.year - 1, today.month, 1)
    monthly = [
        (1, 1150.00, "Wohnbau Mustermann", "Miete"),
        (2, 89.00, "Stadtwerke", "Abschlag Strom/Gas"),
        (3, 39.99, "Telekom Deutschland GmbH", "Internet"),
        (5, 17.99, "Netflix", "Abo"),
        (5, 10.99, "Spotify", "Family"),
        (15, 49.00, "Deutsche Bahn", "Deutschlandticket"),
        (28, 180.00, "Kita Sonnenschein", "Beitrag"),
    ]
    month = start
    while month <= today:
        def booking(day, amount, name, purpose):
            d = month.replace(day=min(day, 28))
            if d <= today:
                txs.append(Transaction(d, amount, name, purpose))

        booking(27, 3150.00, "Arbeitgeber A GmbH", "Gehalt")
        booking(27, 1980.00, "Arbeitgeber B AG", "Gehalt")
        booking(10, 255.00, "Familienkasse", "Kindergeld")
        for day, amount, name, purpose in monthly:
            booking(day, -amount, name, purpose)
        booking(28, -400.00, "Tagesgeld", "Sparen")
        booking(28, -100.00, "Urlaub Unterkonto", "Urlaub")
        if month.month in (1, 4, 7, 10):
            booking(15, -95.00, "GEZ Rundfunkbeitrag", "Quartal")
        if month.month == 3:
            booking(1, -480.00, "HUK-Coburg", "Kfz-Versicherung")
        if month.month == 11:
            booking(1, -120.00, "ADAC", "Mitgliedschaft")
        for _ in range(14):
            shop = rnd.choice(["REWE", "Edeka", "dm", "Aldi", "Amazon", "Tankstelle"])
            booking(rnd.randint(1, 28), -round(rnd.uniform(8, 95), 2), shop, "Kartenzahlung")
        month = (month + timedelta(days=32)).replace(day=1)
    # Last year's yearly bills so they are detected as recurring
    txs.append(Transaction(date(today.year - 1, 3, 1), -470.00, "HUK-Coburg", "Kfz-Versicherung"))
    txs.append(Transaction(date(today.year - 2, 11, 1), -120.00, "ADAC", "Mitgliedschaft"))
    return txs


def shopping() -> dict:
    return {
        "liste": "Zuhause",
        "offen": [{"name": n, "info": i} for n, i in [
            ("Milch", "2x"), ("Brot", ""), ("Bananen", ""), ("Kaffee", "Bohnen"),
            ("Windeln", "Gr. 4"), ("Tomaten", ""), ("Spülmaschinentabs", ""),
        ]],
        "zuletzt": ["Butter", "Eier", "Käse", "Nudeln", "Äpfel", "Joghurt"],
    }


def events(today: date | None = None) -> list[dict]:
    today = today or date.today()

    def at(days, hour, minute=0):
        return (datetime.combine(today + timedelta(days=days), datetime.min.time())
                .replace(hour=hour, minute=minute).astimezone().isoformat())

    def allday(days):
        return datetime.combine(today + timedelta(days=days), datetime.min.time()).astimezone().isoformat()

    raw = [
        ("Kinderarzt U7", at(0, 15, 30), False, "Praxis Dr. Weber", "Familie"),
        ("Gelbe Tonne", allday(1), True, "", "Müll"),
        ("Elternabend Kita", at(2, 19), False, "Kita Sonnenschein", "Familie"),
        ("Geburtstag Oma", allday(4), True, "", "Geburtstage"),
        ("Yoga", at(5, 18, 30), False, "", "Sport"),
        ("Zahnarzt", at(8, 9), False, "", "Termine"),
        ("Kfz-Werkstatt", at(11, 8), False, "Autohaus", "Termine"),
        ("Restmüll", allday(12), True, "", "Müll"),
    ]
    return [{"titel": t, "start": s, "ende": None, "ganztags": a, "ort": o, "kalender": "Familie", "label": l}
            for t, s, a, o, l in raw]


def seed_tasks(conn, players: list[str], today: date | None = None) -> None:
    today = today or date.today()
    day = lambda n: (today + timedelta(days=n)).isoformat()
    tasks.seed_defaults(conn, today=today)
    # Some chores done recently, some overdue
    done = {"Staubsaugen": (-3, 0), "Bad putzen": (-9, 1), "Küche wischen": (-1, 1), "Müll rausbringen": (-3, 0),
            "Wäsche waschen": (-2, 1), "Bettwäsche wechseln": (-6, 0), "Pflanzen gießen": (-5, 1)}
    for row in conn.execute("SELECT id, title FROM tasks").fetchall():
        if row["title"] in done:
            offset, who = done[row["title"]]
            tasks.complete(conn, row["id"], players[who % len(players)], today + timedelta(days=offset))
    # Older history so the players have levels
    for i in range(14):
        conn.execute("INSERT INTO task_log VALUES (0, ?, ?, ?)", (players[i % len(players)], day(-20 - i), 20 + i % 3 * 5))
    conn.commit()
    for title, due in [("Beim Kinderarzt anrufen (Impftermin)", day(0)), ("Geschenk für Oma besorgen", day(3)),
                       ("Kfz-Versicherung vergleichen", day(10)), ("Handwerker für Heizung anfragen", day(-1)),
                       ("Fotos fürs Fotobuch aussuchen", None)]:
        tasks.add(conn, "todo", title, due=due, today=today)
    done_id = tasks.add(conn, "todo", "Fahrradschloss kaufen", today=today)
    tasks.complete(conn, done_id, players[0], today)
