# PATTO Muay Thai Strength & Conditioning

Build pipeline for the PATTO Muay Thai Strength & Conditioning guide: a
minimal-time S&C programme that supplements Muay Thai training, rendered to a
print-ready A4 PDF in the PATTO Tactical brand system (same tokens, type,
hexagon motif and page architecture as the Gym Guide).

## Build

```
npm install   # once at the repo root; playwright is shared
pip install pypdf reportlab
npm run build
```

Produces `PATTO_Muay_Thai_Strength_Conditioning.pdf`.

## Übungen anpassen

Alle Übungsdaten stehen in **`data.js`** (Warm-up, Einheit A/B/C, Finisher,
Stretching, Hüftmobilität). Nur dort ändern, dann `npm run build`. Tabellen,
Kennzahlen (Übungen, Sätze gesamt, Minuten) und der Übungs-Index A–Z werden
automatisch daraus erzeugt. `contrast: true` markiert eine Zeile als Kontrastsatz.

## Vor der Veröffentlichung

Die Übungstabellen sind aktuell aus `SC_Final.xlsx` übernommen und dienen als
Platzhalter. Warm-up, Einheit B (EMOM/AMRAP), die Sprint-Finisher und die
Kontrast-Hauptübungen von A und C entsprechen noch weitgehend der
Fremdvorlage und sollen vor dem Verkauf durch eine eigene Auswahl ersetzt
werden. Alle Texte sind eigenständig formuliert.

## Struktur

- `data.js` — Übungsdaten (einzige Datei für Programmänderungen)
- `chapters.js` — Kapitelliste für Inhaltsverzeichnis, Trennseiten und Reihenfolge
- `htmlkit.js` / `style.css` — PATTO-Tactical-Bausteine aus dem Gym Guide plus S&C-Komponenten (Übungstabelle, Finisher, Wochenraster, Tracker)
- `gen_dark.js` — Cover, Vorwort, 5 Kapiteltrenner, Abschluss
- `gen_light1.js` — Inhaltsverzeichnis, „Wie benutze ich diesen Guide?“
- `gen_light2.js` … `gen_light6.js` — Kapitel 1–5
- `gen_light7.js` — Anhang: Übungs-Index A–Z, Trainings-Tracker
- `merge.py` — fügt dunkle und helle Seiten zusammen und setzt Fußzeile und Seitenzahlen
