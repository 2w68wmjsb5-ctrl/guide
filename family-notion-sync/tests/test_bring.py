import unittest

from sync import bring_sync
from tests.fake_notion import IDS, SCHEMA, FakeNotion


class FakeBring:
    def __init__(self, purchase: dict[str, str]):
        self.items = dict(purchase)   # name -> spec
        self.recent: list[str] = []

    def purchase(self):
        return {bring_sync._key(k): (k, v) for k, v in self.items.items()}

    def apply(self, add, complete):
        for name, info in add:
            self.items[name] = info
        for name in complete:
            self.items.pop(name, None)
            self.recent.append(name)


class BringSyncTest(unittest.TestCase):
    def setUp(self):
        self.notion = FakeNotion(SCHEMA)
        self.ds = IDS["einkaufsliste"]

    def run_sync(self, bring):
        return bring_sync.sync(self.notion, self.ds, bring)

    def state(self):
        return {r["Artikel"]: (r["Gekauft"], r["In Bring"], r["Info"]) for r in self.notion.rows(self.ds)}

    def test_items_from_bring_appear_in_notion(self):
        bring = FakeBring({"Milch": "2x", "Brot": ""})
        self.run_sync(bring)
        self.assertEqual(self.state(), {"Milch": (False, True, "2x"), "Brot": (False, True, "")})

    def test_item_added_in_notion_goes_to_bring(self):
        self.notion.add(self.ds, Artikel="Kaffee", Info="Bohnen")
        bring = FakeBring({})
        self.run_sync(bring)
        self.assertEqual(bring.items, {"Kaffee": "Bohnen"})
        self.assertEqual(self.state()["Kaffee"], (False, True, "Bohnen"))

    def test_bought_in_bring_is_ticked_in_notion(self):
        self.notion.add(self.ds, Artikel="Milch", **{"In Bring": True})
        self.run_sync(FakeBring({}))
        self.assertEqual(self.state()["Milch"], (True, False, ""))

    def test_ticked_in_notion_is_completed_in_bring(self):
        self.notion.add(self.ds, Artikel="Milch", Gekauft=True, **{"In Bring": True})
        bring = FakeBring({"Milch": ""})
        self.run_sync(bring)
        self.assertEqual(bring.items, {})
        self.assertEqual(bring.recent, ["Milch"])
        self.assertEqual(self.state()["Milch"], (True, False, ""))
        # A second run changes nothing and does not bring it back
        self.run_sync(bring)
        self.assertEqual(len(self.notion.rows(self.ds)), 1)
        self.assertEqual(bring.items, {})

    def test_rebought_item_reopens_old_row(self):
        self.notion.add(self.ds, Artikel="Milch", Gekauft=True)
        self.run_sync(FakeBring({"milch": "1x"}))
        rows = self.notion.rows(self.ds)
        self.assertEqual(len(rows), 1)
        self.assertEqual(self.state()["Milch"], (False, True, "1x"))

    def test_spec_changed_in_bring_updates_notion(self):
        self.notion.add(self.ds, Artikel="Milch", Info="1x", **{"In Bring": True})
        self.run_sync(FakeBring({"Milch": "3x"}))
        self.assertEqual(self.state()["Milch"], (False, True, "3x"))

    def test_second_run_is_quiet(self):
        bring = FakeBring({"Milch": "2x"})
        self.notion.add(self.ds, Artikel="Eier")
        self.run_sync(bring)
        writes = len([c for c in self.notion.calls if c[0] != "query"])
        self.run_sync(bring)
        self.assertEqual(len([c for c in self.notion.calls if c[0] != "query"]), writes)


if __name__ == "__main__":
    unittest.main()
