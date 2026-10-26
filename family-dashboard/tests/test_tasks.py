from datetime import date, timedelta

from app import tasks

TODAY = date(2026, 10, 26)
PLAYERS = ["Spieler 1", "Spieler 2"]


def db(tmp_path):
    return tasks.connect(tmp_path / "t.db")


def test_defaults_are_seeded_once(tmp_path):
    conn = db(tmp_path)
    tasks.seed_defaults(conn, today=TODAY)
    tasks.seed_defaults(conn, today=TODAY)
    chores = tasks.overview(conn, PLAYERS, TODAY)["haushalt"]
    assert len(chores) == len(tasks.DEFAULT_CHORES)
    # Never done means due today
    assert all(c["faellig_in"] == 0 for c in chores)


def test_completing_a_chore_reschedules_it_and_awards_xp(tmp_path):
    conn = db(tmp_path)
    chore = tasks.add(conn, "haushalt", "Bad putzen", every_days=7, xp=30, today=TODAY)
    tasks.complete(conn, chore, "Spieler 2", TODAY - timedelta(days=9))
    view = tasks.overview(conn, PLAYERS, TODAY)
    bad = view["haushalt"][0]
    assert bad["faellig_in"] == -2 and bad["zuletzt_von"] == "Spieler 2"
    tasks.complete(conn, chore, "Spieler 1", TODAY)
    view = tasks.overview(conn, PLAYERS, TODAY)
    assert view["haushalt"][0]["faellig_in"] == 7
    p1, p2 = view["spieler"]
    assert (p1["xp"], p1["woche_xp"]) == (30, 30)
    assert (p2["xp"], p2["woche_xp"]) == (30, 0)  # done before this week


def test_levels(tmp_path):
    conn = db(tmp_path)
    chore = tasks.add(conn, "haushalt", "Großputz", every_days=30, xp=50, today=TODAY)
    for _ in range(5):
        tasks.complete(conn, chore, "Spieler 1", TODAY)
    p1 = tasks.overview(conn, PLAYERS, TODAY)["spieler"][0]
    assert (p1["xp"], p1["level"], p1["fortschritt"]) == (250, 3, 50)


def test_todos_sorting_done_and_reopen(tmp_path):
    conn = db(tmp_path)
    later = tasks.add(conn, "todo", "Steuer", today=TODAY)
    call = tasks.add(conn, "todo", "Beim Arzt anrufen", due=TODAY.isoformat(), today=TODAY)
    late = tasks.add(conn, "todo", "Heizung", due=(TODAY - timedelta(days=1)).isoformat(), today=TODAY)
    titles = [t["titel"] for t in tasks.overview(conn, PLAYERS, TODAY)["todos"]]
    assert titles == ["Heizung", "Beim Arzt anrufen", "Steuer"]

    tasks.complete(conn, call, "Spieler 1", TODAY)
    todos = tasks.overview(conn, PLAYERS, TODAY)["todos"]
    assert todos[-1]["titel"] == "Beim Arzt anrufen" and todos[-1]["erledigt"]
    # Gone the next day
    tomorrow = tasks.overview(conn, PLAYERS, TODAY + timedelta(days=1))["todos"]
    assert "Beim Arzt anrufen" not in [t["titel"] for t in tomorrow]

    tasks.reopen(conn, call)
    view = tasks.overview(conn, PLAYERS, TODAY)
    assert not next(t for t in view["todos"] if t["id"] == call)["erledigt"]
    assert view["spieler"][0]["xp"] == 0

    tasks.delete(conn, later)
    tasks.delete(conn, late)
    assert [t["titel"] for t in tasks.overview(conn, PLAYERS, TODAY)["todos"]] == ["Beim Arzt anrufen"]


def test_demo_seed(tmp_path):
    from app import demo

    conn = db(tmp_path)
    demo.seed_tasks(conn, PLAYERS, TODAY)
    view = tasks.overview(conn, PLAYERS, TODAY)
    assert view["haushalt"][0]["titel"] == "Bad putzen"  # most overdue first
    assert any(t["erledigt"] for t in view["todos"])
    assert all(p["level"] >= 2 for p in view["spieler"])
