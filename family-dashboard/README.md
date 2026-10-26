# Familien-Dashboard

Ein Dashboard für zu Hause mit Fixkosten, Einnahmen, Rücklagen, Einkaufsliste und Terminen.
Die Daten kommen automatisch aus euren Apps, nichts wird von Hand eingetragen.

| Bereich | Quelle | Wie oft |
|---|---|---|
| Einkaufsliste | Bring! (abhaken und hinzufügen geht auch im Dashboard) | alle 5 Min. |
| Termine | TimeTree, dazu optional iCal-Links (Müllabfuhr, Ferien …) | alle 30 Min. |
| Fixkosten, Einnahmen, Rücklagen | Export eurer Finanz-App (CSV/Excel) | sobald eine Datei im Import-Ordner liegt |

## Starten (Raspberry Pi / NAS mit Docker)

```bash
cp .env.example .env              # Zugangsdaten eintragen
cp config.example.yaml config.yaml
docker compose up -d --build
```

Danach im Browser `http://<ip-des-pi>:8080` öffnen. Zum Ausprobieren ohne Zugangsdaten
`DEMO=true` in die `.env` schreiben.

## Als App aufs Handy

Das Dashboard ist eine Web-App (PWA): Ihr installiert sie aus dem Browser, dann hat sie ein
eigenes Icon und öffnet sich im Vollbild wie eine normale App. Ohne Netz zeigt sie den zuletzt
geladenen Stand, die Einkaufsliste habt ihr also auch im Supermarkt.

- **iPhone:** In Safari öffnen → Teilen-Symbol → „Zum Home-Bildschirm“.
- **Android:** In Chrome öffnen → Menü ⋮ → „App installieren“ (oder „Zum Startbildschirm hinzufügen“).

**Auch unterwegs (außerhalb des WLANs):** Am einfachsten mit [Tailscale](https://tailscale.com)
(kostenlos für Privatnutzer). Tailscale auf dem Raspi/NAS und auf beiden Handys installieren und
mit demselben Konto anmelden. Danach auf dem Raspi:

```bash
sudo tailscale serve --bg 8080
```

Jetzt ist das Dashboard unter `https://<geraetename>.<euer-tailnet>.ts.net` erreichbar, aber nur
für eure eigenen Geräte, nicht für das Internet. Diese Adresse installiert ihr als App. Weil sie
HTTPS hat, funktioniert dort auch der Offline-Modus. Über `http://<IP>:8080` im Heim-WLAN klappt
das Installieren auf dem iPhone ebenfalls, Android legt dann aber nur eine Verknüpfung an, und
offline geht nichts.

## Wie die Finanzdaten reinkommen

Die Finanz-App exportiert eure Umsätze als CSV oder Excel. Das Dashboard liest jede Datei ein,
die in `data/import/` landet, ignoriert doppelte Buchungen und verschiebt die Datei danach nach
`data/import/done/` (oder bei Problemen nach `data/import/fehler/`). Es gibt drei Wege:

1. **Netzwerkordner (am bequemsten):** `data/import` als Freigabe auf dem NAS einrichten
   (SMB, Nextcloud, Syncthing …) und am Handy einbinden. Dann in der App „Exportieren → In Dateien
   sichern → Import-Ordner“ wählen.
2. **Upload im Dashboard:** unten auf „Export aus der Finanz-App hochladen“ tippen.
3. **Bank-CSV direkt:** Exporte aus dem Onlinebanking funktionieren genauso.
   Die Spalten werden automatisch erkannt, auch Vorspann-Zeilen und Soll/Haben-Spalten.

Wie oft ihr exportiert, ist egal. Einmal im Monat reicht, und Überschneidungen machen nichts.

**Was automatisch erkannt wird:**
- **Fixkosten:** Zahlungen an denselben Empfänger mit ähnlichem Betrag in festem Rhythmus
  (monatlich, vierteljährlich, halbjährlich, jährlich). Verträge, die nicht mehr abgebucht werden,
  fallen von selbst wieder raus.
- **Einnahmen:** regelmäßige Eingänge wie Gehalt oder Kindergeld. Die Kachel „Übrig am Monatsende“
  rechnet noch erwartete Eingänge und noch fällige Fixkosten mit ein.
- **Rücklagen:** Überweisungen auf Tagesgeld oder Sparziele (Begriffe in `config.yaml`), dazu der
  Fortschritt eurer Sparziele und eine Empfehlung, wie viel ihr pro Monat für die jährlichen und
  vierteljährlichen Kosten zurücklegen solltet.

Liegt die Erkennung daneben, korrigiert ihr das in `config.yaml` (Einträge ausschließen, manuelle
Fixkosten, Umbuchungen ignorieren). Änderungen gelten ohne Neustart.

## Gut zu wissen

- **TimeTree hat keine offizielle API mehr.** Der Abruf läuft über die Bibliothek
  [`timetree-exporter`](https://github.com/eoleedi/TimeTree-Exporter), die sich wie die App mit
  E-Mail und Passwort anmeldet. Das kann brechen, wenn TimeTree etwas ändert. Dann steht im
  Dashboard oben ein rotes Dreieck bei „Kalender“, und ein Update der Bibliothek hilft meist.
- **Bring!** nutzt ebenfalls eine inoffizielle API (die gleiche wie Home Assistant).
- Zugangsdaten stehen nur in der `.env` auf eurem Gerät. Wenn das Dashboard aus dem Internet
  erreichbar sein soll, setzt `DASHBOARD_USER`/`DASHBOARD_PASSWORD` und nutzt einen VPN-Zugang
  (Tailscale, siehe oben), statt den Port im Router freizugeben.
- Für ein Wandtablet: genauso als App installieren. Die Seite aktualisiert sich jede Minute
  selbst und folgt dem Dark Mode des Geräts.

## Entwicklung

```bash
python -m venv .venv && .venv/bin/pip install -r requirements.txt pytest
DEMO=true .venv/bin/uvicorn app.main:app --reload --port 8080
.venv/bin/pytest
```
