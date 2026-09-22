# Messenger-Shop-Vorlage

Wiederverwendbare Vorlage für einfache Online-Shops kleiner Betriebe. Der Shop ist ein
Produktkatalog mit Kategorien, Bildern, Beschreibungen und Preisen. Bestellt wird nicht
über einen Checkout, sondern per Messenger (Telegram, Threema, Signal). Bezahlt wird
separat, außerhalb der Website.

Ein neuer Kundenshop entsteht durch Kopieren dieser Vorlage und Ausfüllen der
Einstellungen – Name, Logo, Farben, Kontaktdaten und Messenger kommen nicht aus dem Code.

## Die beiden Anleitungen

- **[ANLEITUNG-KUNDE.md](ANLEITUNG-KUNDE.md)** – für den Shopbetreiber, in einfacher
  Sprache: anmelden, Produkte pflegen, Preise eintragen, Bilder hochladen, Einstellungen.
- **[NEUER-KUNDE.md](NEUER-KUNDE.md)** – Checkliste, um aus dieser Vorlage einen fertigen
  Kundenshop zu machen. Inklusive der Frage, wem das Repository nach der Übergabe gehört.

## Grundsätze

| Grundsatz | Wie er eingehalten wird |
|-----------|-------------------------|
| Wartungsfrei | Statischer Build, keine Datenbank, keine Server-Logik. Inhalte liegen als Dateien im Repository. |
| Laienfreundlich | Pflege über ein Admin-Panel mit E-Mail-Login, ohne GitHub-Kenntnisse. |
| Datenschutzfreundlich | Keine Cookies, kein Tracking, keine externen Skripte, Schriftarten oder Einbettungen. Beim Seitenaufruf geht keine Anfrage an Dritte. |
| Wiederverwendbar | Alles Kundenspezifische steht in `src/content/einstellungen.json` – bis hin zu Schrift und Hintergrund. |

## Technik

- **Astro 7** mit TypeScript, statischer Build
- **Eigenes CSS**, Farben über CSS-Variablen aus den Einstellungen
- **Keystatic** als Redaktionssystem (siehe `docs/entscheidungen/001-cms-auswahl.md`)
- **Netlify** als Standard-Hosting mit automatischem Build bei jeder Änderung
- **Selbst gehostete Schriften** unter `public/schriften/`, SIL OFL 1.1 – keine Google-Fonts-Einbindung
- **Keystatic** als Admin-Panel unter `/keystatic`, Login per E-Mail über Keystatic Cloud
- Abhängigkeiten: `astro`, `zod` (Prüfung der Inhalte), `qrcode-generator` (nur beim Build),
  `@keystatic/core`, `@keystatic/astro`, `@astrojs/react`, `react`, `react-dom` (nur für das Panel),
  `@astrojs/netlify` (Hosting)

## Befehle

```bash
npm install      # Abhängigkeiten installieren
npm run dev      # Entwicklungsserver auf http://localhost:4321
npm run build    # Website nach dist/ bauen
npm run preview  # Gebaute Website lokal ansehen
npm run check    # Typen und Astro-Komponenten prüfen
npm test         # Prüfungen für Bestelltext und Messenger-Links

npm run neuer-shop -- --wirklich   # Beispielinhalte löschen (nur für einen neuen Kundenshop)
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
└── styles/global.css        Grundgestaltung, Schriften, Hintergründe, CSS-Variablen

public/
└── schriften/               Die vier Schriftdateien samt Lizenztexten
```

**Der Dateiname ist der Slug.** Keystatic erzeugt ihn aus dem Namen, deshalb gibt es kein
eigenes `slug`-Feld in den Dateien.

## Das Admin-Panel

Der Kunde pflegt alle Inhalte unter `/keystatic`. Die Feldbeschriftungen und Hilfetexte sind
deutsch; die Bedienoberfläche von Keystatic selbst („Create“, „Save“) ist englisch.

```bash
npm run dev     # Panel unter http://localhost:4321/keystatic, schreibt direkt in die Dateien
```

Für den Kundenshop wird `PUBLIC_KEYSTATIC_CLOUD_PROJECT` beim Hoster gesetzt (siehe
`.env.example`). Dann meldet sich der Kunde mit seiner E-Mail-Adresse an und braucht kein
GitHub-Konto.

**Wo Bilder landen.** Keystatic legt sie unter `src/bilder/` ab und schiebt bei Sammlungen
den Namen des Eintrags in den Pfad:

```
src/bilder/shop/logo.png                              Einstellungen (kein Eintragsname)
src/bilder/kategorien/brot/bild.jpg                   Kategorie „brot“
src/bilder/produkte/bauernbrot/bilder/0/bild.jpg      Produkt „bauernbrot“, erstes Bild
```

Das ist Keystatics Regel, keine Wahl – wer die Pfade in `keystatic.config.ts` ändert, muss
`src/content.config.ts` und die vorhandenen Dateien mitziehen.

**Nach dem Löschen bleiben Bilder liegen.** Löscht der Kunde ein Produkt, verschwindet die
Inhaltsdatei, der Bildordner bleibt. Das schadet der Website nicht – unbenutzte Bilder landen
nicht im fertigen Ergebnis – aber der Build meldet sie, damit man sie gelegentlich aufräumen kann.

**Eine serverseitige Route.** Nur `/keystatic` läuft beim Aufruf; alle Shop-Seiten sind
vorgebaute Dateien. React wird ausschließlich vom Panel gebraucht und kommt auf den
Shop-Seiten nicht an. Die Seiten laden drei eigene Skripte von zusammen rund 6 KB.

**Gesperrt, solange Keystatic Cloud fehlt.** Keystatic hängt `/keystatic` und
`/api/keystatic` immer ein, auch im lokalen Modus – und der kennt keine Anmeldung. Die
Middleware sperrt beides deshalb auf der Live-Seite, solange
`PUBLIC_KEYSTATIC_CLOUD_PROJECT` nicht gesetzt ist. Auf dem eigenen Rechner bleibt das
Panel offen. Geprüft durch direkten Aufruf der gebauten Netlify-Funktion und in `npm test`.

**Keine Google Fonts im Panel.** Die Keystatic-Oberfläche lädt Inter von Google nach. Eine
Middleware (`src/middleware.ts`) unterbindet das per Sicherheitsrichtlinie und stellt
stattdessen die selbst gehostete Datei bereit.

## Aussehen: was der Kunde selbst einstellen kann

Über das Panel, ohne eine Zeile Code:

| Einstellung | Wirkung |
|-------------|---------|
| Primär- und Akzentfarbe | Kopfbereich, Links, Preise, Buttons. Die Schriftfarbe darauf wird aus der Helligkeit berechnet, damit sie auch bei einer hellen Farbe lesbar bleibt. Linien und ruhige Flächen nehmen automatisch einen Hauch der Primärfarbe auf. |
| Schriftart | Fünf Auswahlmöglichkeiten: Systemschrift, Modern (Inter), Klassisch (Lora + Inter), Freundlich (Nunito), Traditionell (Source Serif 4). |
| Hintergrund | Fünf Auswahlmöglichkeiten: Schlicht weiß, Warmes Papier, Sanfter Verlauf, Feines Punktmuster, Sticker-Collage. |

**Warum Auswahllisten und keine Freitextfelder?** Der Kunde wählt eine Stimmung, keine
Schriftnamen und keine zweite Farbe. Die Hintergründe leiten ihren Ton über `color-mix`
aus der Primärfarbe ab und passen damit immer zum Shop. Die Schriften kommen als fertige
Paare aus Überschrift und Fließtext – frei kombinierbare Schriften ergeben schnell etwas
Unruhiges, und eine Vorlage für Laien soll keine Fallgrube sein.

**Was das kostet:** nichts an Anfragen. Die Hintergründe sind reines CSS. Von den vier
Schriftdateien (37 bis 50 KB) lädt der Browser immer nur die eine gewählte – eine
`@font-face`-Regel, auf die keine Schriftfamilie verweist, löst keinen Download aus. Bei
der Systemschrift wird gar keine Datei geholt.

Wer eine Schrift oder einen Hintergrund ergänzen will, trägt sie an zwei Stellen ein:
`src/lib/schriften.ts` bzw. `src/lib/hintergruende.ts` (Beschriftung fürs Panel) und
`src/styles/global.css` (die Gestaltung selbst).

## Anfrageliste und Messenger

Es gibt keinen Checkout. Der Besucher sammelt Artikel auf einer Anfrageliste und
schickt sie über Telegram, Threema oder Signal.

- **Die Liste liegt ausschließlich im Browser** des Besuchers (localStorage). Kein Server,
  keine Cookies, keine Übertragung. Name und Anmerkung gehen nur in den Nachrichtentext.
- **Beim Öffnen wird abgeglichen:** Geänderte Preise werden übernommen und gemeldet,
  entfallene oder vergriffene Artikel entfernt und gemeldet. Sonst nennte die Bestellung
  einen Betrag, den es nicht mehr gibt.
- **Vor jedem Messenger-Klick wird kopiert.** Signal kann keinen Text vorausfüllen, und
  der Samsung-Internet-Browser öffnet Threema-Links nicht – in beiden Fällen rettet die
  Zwischenablage die Bestellung. Der Link selbst wird dabei nicht abgefangen, sonst
  hielte der Browser das Öffnen für ein ungefragtes Fenster und blockierte es.
- **Sehr lange Listen** werden nicht an den Link gehängt (Grenze: 2000 kodierte Zeichen).
  Der Messenger öffnet dann nur den Chat, der Text liegt in der Zwischenablage.
- **QR-Codes** für jeden aktivierten Messenger, erzeugt beim Build als eingebettetes SVG.
  Für den Fall, dass der Messenger nur auf dem Handy installiert ist.

Es sind keine Messenger-Widgets und keine fremden Skripte eingebunden – nur gewöhnliche
Links, die der Besucher selbst anklickt.

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
- [x] **Phase 2** – Seiten und Design
- [x] **Phase 3** – Anfrageliste und Messenger
- [x] **Phase 4** – CMS einbauen
- [x] **Phase 5** – Feinschliff
- [x] **Phase 6** – Übergabe-Paket

## Qualität

Gemessen mit Lighthouse, mobil, auf sechs Seitentypen (Start, Kategorie, Produkt,
Anfrageliste, 404, Rechtsseite) – jeweils **100** in Performance, Barrierefreiheit,
Best Practices und SEO. Auch mit dem aufwendigsten Hintergrund (Sticker-Collage).

So lässt sich das nachstellen:

```bash
npm run build
cd dist && python3 -m http.server 4400     # oder ein beliebiger statischer Server
npx lighthouse http://127.0.0.1:4400/ --preset=desktop --view
```

**Bilder** werden beim Build in moderne Formate umgerechnet (WebP mit JPEG-Rückfall,
mehrere Größen je Bild). Wichtig dabei: Der Netlify-Adapter würde sonst alle Bilder über
Netlifys Bilddienst leiten – die Adressen funktionierten dann nur bei Netlify. Deshalb
steht in `astro.config.mjs` ausdrücklich `imageCDN: false`.

**SEO**: Titel und Beschreibung auf jeder Seite, Open-Graph-Daten mit Vorschaubild
(1200 × 630), `sitemap.xml`, `robots.txt` und strukturierte Daten nach schema.org
(`Product` mit Preis und Verfügbarkeit) auf den Produktseiten. Ohne hinterlegte Adresse
der Website bleiben absolute Adressen weg, statt falsche anzugeben.

**Barrierefreiheit**: semantisches HTML, Sprungmarke zum Inhalt, Alternativtexte als
Pflichtfeld im Panel, sichtbarer Fokusrahmen, Überschriften ohne Ebenensprung, vollständige
Tastaturbedienung. Der Build prüft zusätzlich den Kontrast der vom Kunden gewählten Farben
und meldet, wenn auch die bessere Schriftfarbe unter 4,5:1 bleibt.

**Randfälle**, jeweils geprüft: leere Kategorie (Hinweistext statt leerer Seite), sehr lange
Namen (kein Überlaufen bis hinunter zu 320 px), kein aktivierter Messenger (Hinweis auf die
Kontaktdaten, keine QR-Codes), leerer Rechtstext (keine Seite, kein Link im Fußbereich).

## Rechtliches

Die mitgelieferten Rechtstexte sind ausdrücklich **Platzhalter**. Rechtssichere Texte hängen
vom einzelnen Betrieb ab und gehören in die Hand einer fachkundigen Stelle. Auch die
Formulierungen rund um den Bestellablauf stehen unter rechtlichem Vorbehalt.
