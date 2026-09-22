# Messenger-Shop-Vorlage

Wiederverwendbare Vorlage für einfache Online-Shops kleiner Betriebe. Der Shop ist ein
Produktkatalog mit Kategorien, Bildern, Beschreibungen und Preisen. Bestellt wird nicht
über einen Checkout, sondern per Messenger (Telegram, Threema, Signal). Bezahlt wird
separat, außerhalb der Website.

Ein neuer Kundenshop entsteht durch Kopieren dieser Vorlage und Ausfüllen der
Einstellungen – Name, Logo, Farben, Kontaktdaten und Messenger kommen nicht aus dem Code.

## Grundsätze

| Grundsatz | Wie er eingehalten wird |
|-----------|-------------------------|
| Wartungsfrei | Statischer Build, keine Datenbank, keine Server-Logik. Inhalte liegen als Dateien im Repository. |
| Laienfreundlich | Pflege über ein Admin-Panel mit E-Mail-Login, ohne GitHub-Kenntnisse. |
| Datenschutzfreundlich | Keine Cookies, kein Tracking, keine externen Skripte, Schriftarten oder Einbettungen. Beim Seitenaufruf geht keine Anfrage an Dritte. |
| Wiederverwendbar | Alles Kundenspezifische steht in `src/content/einstellungen.json`. |

## Technik

- **Astro 7** mit TypeScript, statischer Build
- **Eigenes CSS**, Farben über CSS-Variablen aus den Einstellungen
- **Keystatic** als Redaktionssystem (siehe `docs/entscheidungen/001-cms-auswahl.md`)
- **Netlify** als Standard-Hosting mit automatischem Build bei jeder Änderung
- **Systemschriften** statt geladener Schriftdateien – keine externe Anfrage, kein Ladeflackern

## Befehle

```bash
npm install      # Abhängigkeiten installieren
npm run dev      # Entwicklungsserver auf http://localhost:4321
npm run build    # Website nach dist/ bauen
npm run preview  # Gebaute Website lokal ansehen
npm run check    # Typen und Astro-Komponenten prüfen
```

## Aufbau

```
src/
├── content/                 Die Inhalte, gepflegt über das Panel
│   ├── einstellungen.json   Name, Logo, Farben, Kontakt, Messenger, Versand
│   ├── kategorien/          Eine JSON-Datei je Kategorie
│   ├── produkte/            Eine Markdown-Datei je Produkt
│   └── rechtstexte/         Impressum, Datenschutz, Widerruf, AGB, Versand & Zahlung
├── bilder/                  Bilder aus dem Panel, werden beim Build optimiert
├── lib/                     Laden, Prüfen und Aufbereiten der Inhalte
├── layouts/ components/     Grundgerüst und wiederkehrende Bausteine
├── pages/                   Die Seiten der Website
└── styles/global.css        Grundgestaltung und CSS-Variablen
```

**Der Dateiname ist der Slug.** Keystatic erzeugt ihn aus dem Namen, deshalb gibt es kein
eigenes `slug`-Feld in den Dateien.

## Zwei Entwurfsentscheidungen, die man kennen sollte

**Preise stehen in Cent.** Das Feld heißt `preisCent`, 4,90 € sind also `490`.
Kommazahlen summieren sich in JavaScript ungenau auf – bei einer Anfrageliste mit mehreren
Posten fiele das als falscher Cent in der Zwischensumme auf. Im Panel ist das Feld
entsprechend beschriftet.

**Der Build bricht nie wegen eines Inhaltsfehlers ab.** Ein Produkt, das auf eine gelöschte
Kategorie verweist, ein fehlendes Bild, eine ungültige Threema-ID – all das führt zu einer
verständlichen Warnung im Build-Log und zum Ausblenden des betroffenen Inhalts, nicht zu
einer Website, die offline geht. Deshalb ist der Kategorie-Verweis eines Produkts bewusst
ein einfacher Text und kein `reference()` von Astro: Ein `reference()` würde den Build
scheitern lassen.

Nach einer Änderung des Kunden lohnt ein Blick ins Build-Log des Hosters. Alle Meldungen
beginnen mit `[Shop-Inhalte]`.

## Stand der Arbeit

- [x] **Phase 1** – Grundgerüst, Datenmodell, Beispielinhalte, Grundlayout
- [ ] **Phase 2** – Seiten und Design
- [ ] **Phase 3** – Anfrageliste und Messenger
- [ ] **Phase 4** – CMS einbauen
- [ ] **Phase 5** – Feinschliff
- [ ] **Phase 6** – Übergabe-Paket

## Rechtliches

Die mitgelieferten Rechtstexte sind ausdrücklich **Platzhalter**. Rechtssichere Texte hängen
vom einzelnen Betrieb ab und gehören in die Hand einer fachkundigen Stelle. Auch die
Formulierungen rund um den Bestellablauf stehen unter rechtlichem Vorbehalt.
