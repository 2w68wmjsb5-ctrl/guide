# Notion-Abgleich fürs Familien-Dashboard

Holt Bring!, TimeTree und Finanz-Exporte automatisch in das Notion-Dashboard
„Familie Schneider“. Läuft als GitHub Action alle 15 Minuten, ohne eigenes Gerät.

| Quelle | Richtung | Was passiert |
|---|---|---|
| Bring! | beide Richtungen | Neue Artikel in Bring! erscheinen in Notion, in Notion hinzugefügte landen in Bring!. Abhaken geht auf beiden Seiten. |
| TimeTree (+ iCal-Links) | nach Notion | Termine der nächsten 90 Tage. Geänderte Termine werden angepasst, gelöschte verschwinden. Von Hand in Notion eingetragene Termine bleiben unberührt. |
| Finanzguru / Bank | nach Notion | Export (CSV/Excel) in Notion unter **Finanz-Import** hochladen. Beim nächsten Lauf werden die Umsätze gelesen, Fixkosten und Einnahmen erkannt und Einzahlungen den Sparzielen zugeordnet. |

Der Zustand jeder Quelle steht im Dashboard unter **Datenquellen**.

## Einrichten (einmalig, ca. 10 Minuten)

### 1. Notion-Schlüssel anlegen

1. <https://www.notion.so/profile/integrations> öffnen → **Neue Integration**.
2. Name „Familien-Abgleich“, Workspace auswählen, Typ **Intern** → Speichern.
3. Den **Internal Integration Secret** kopieren (beginnt mit `ntn_`).
4. In Notion die Seite **Familie Schneider** öffnen → `•••` oben rechts → **Verbindungen** →
   „Familien-Abgleich“ hinzufügen. Damit darf der Abgleich die Seite und alle Datenbanken darunter bearbeiten.

### 2. Zugangsdaten in GitHub hinterlegen

Im Repo auf GitHub: **Settings → Secrets and variables → Actions → New repository secret**.

| Secret | Inhalt |
|---|---|
| `NOTION_TOKEN` | der Schlüssel aus Schritt 1 |
| `BRING_EMAIL`, `BRING_PASSWORD` | euer Bring!-Konto |
| `TIMETREE_EMAIL`, `TIMETREE_PASSWORD` | euer TimeTree-Konto |
| `EXTRA_ICS_URLS` | optional: iCal-Links (Müllabfuhr, Schulferien …), kommagetrennt |

Optional unter **Variables** (nicht geheim):

| Variable | Inhalt |
|---|---|
| `BRING_LIST` | Name der Bring!-Liste, z. B. `Zuhause` (leer = erste Liste) |
| `TIMETREE_CALENDAR_CODES` | nur bestimmte TimeTree-Kalender, kommagetrennt (leer = alle) |

Fehlt eine Quelle, wird sie einfach übersprungen und steht in Notion auf „Aus“.

### 3. Ersten Lauf starten

**Actions → Notion-Abgleich → Run workflow**. Nach etwa einer Minute stehen in Notion unter
**Datenquellen** grüne Häkchen. Danach läuft alles von selbst.

## Gut zu wissen

- **Datenschutz:** Das Repo ist öffentlich. Passwörter liegen nur als GitHub-Secrets vor, Finanzdaten
  nur in Notion. Die Protokolle der Läufe enthalten nur Zahlen wie „3 neu, 1 geändert“, keine Namen oder Beträge.
- **Inoffizielle Schnittstellen:** Bring! und TimeTree haben keine offizielle API. Ändert eine App etwas,
  zeigt „Datenquellen“ einen Fehler. Meist hilft dann ein Update von `bring-api` bzw. `timetree-exporter`
  in `requirements.txt`.
- **Finanzen:** Rücklagen erkennt der Abgleich über die Spalte **Begriffe** der Sparziele (z. B. „Tagesgeld“).
  Erkannte Verträge sind mit „Automatisch“ markiert; „Gekündigt“ setzt der Abgleich selbst, wenn ein Vertrag
  nicht mehr abgebucht wird. Von Hand angelegte Fixkosten bleiben unberührt. Korrekturen (ignorierte Umsätze,
  Kreditkarten-Abbuchung, ausgeschlossene Empfänger) stehen in `config.yaml`.
- **Ruhepause:** GitHub schaltet geplante Läufe in öffentlichen Repos nach 60 Tagen ohne Änderungen am Repo ab.
  Dann unter **Actions** auf „Enable workflow“ klicken.

## Entwickeln

```bash
pip install -r requirements.txt
python -m unittest discover -s tests -t .
NOTION_TOKEN=... python -m sync bring      # nur eine Quelle: bring | termine | finanzen
```
