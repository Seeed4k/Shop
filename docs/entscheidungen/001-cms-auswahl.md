# 001 – CMS-Auswahl für die Messenger-Shop-Vorlage

**Status:** Empfehlung, Entscheidung ausstehend
**Datum:** 2026-09-22
**Betrifft:** Redaktionssystem, mit dem der Kunde nach der Übergabe alle Inhalte pflegt

## Empfehlung

**Keystatic mit Keystatic Cloud** als Authentifizierung.
Als dokumentierte Rückfalloption: **Sveltia CMS** (falls ein GitHub-Konto für den Kunden
doch akzeptabel ist oder Keystatic Cloud eingestellt wird).

## Bewertung gegen die acht Kriterien

| # | Kriterium | Keystatic | TinaCMS | Decap CMS | Sveltia CMS |
|---|-----------|-----------|---------|-----------|-------------|
| 1 | Login ohne eigenes GitHub-Konto | **ja** (Keystatic Cloud, Einladung per E-Mail) | ja (Tina Cloud) | **nein** (siehe Git Gateway) | **nein** (GitHub-/GitLab-OAuth) |
| 2 | Inhalte als Dateien im Git-Repo | ja | ja | ja | ja |
| 3 | Bild-Upload im Panel | ja | ja | ja | ja |
| 4 | Sammlungen, Verweise, Listen, Rich-Text | ja, typsicher in TypeScript | ja | ja | ja |
| 5 | Anlegen/Löschen durch den Kunden | ja | ja | ja | ja |
| 6 | Dauerhaft kostenlos für einen Redakteur | ja (bis 3 Nutzer/Team) | ja (bis 2 Nutzer) | ja | ja |
| 7 | Deutsche Oberfläche / beschriftbare Felder | Feldbeschriftungen frei auf Deutsch, Bedienoberfläche englisch | Beschriftungen deutsch, Oberfläche englisch | Oberfläche auf Deutsch verfügbar | Oberfläche auf Deutsch verfügbar |
| 8 | Aktiv gepflegt, Astro-tauglich | ja, Astro-Integration ist first-party | ja, aber Astro-Anbindung aufwendiger | ja | ja, sehr aktiv |

## Begründung

### Warum Kriterium 1 die Entscheidung trägt

Alle vier Kandidaten erfüllen die Kriterien 2–6 und 8. Der Unterschied liegt fast
vollständig beim Login — und genau dort scheiden zwei Kandidaten aus:

* **Decap CMS** konnte E-Mail-Login bisher nur über *Netlify Git Gateway* + Netlify
  Identity. Git Gateway ist von Netlify abgekündigt: bestehende Sites laufen weiter,
  neue Einrichtungen werden nicht empfohlen, Fehler werden nicht mehr behoben
  (nur noch schwerwiegende Sicherheitslücken). Eine Vorlage, aus der auf Jahre hinaus
  neue Kundenshops entstehen sollen, auf eine abgekündigte Komponente zu setzen,
  widerspricht dem Grundsatz „wartungsfrei nach Übergabe". Ohne Git Gateway bleibt
  bei Decap nur GitHub-OAuth — der Kunde bräuchte ein GitHub-Konto.
* **Sveltia CMS** ist technisch der modernste Nachbau von Decap, sehr aktiv gepflegt
  und hat eine deutsche Oberfläche. Es besitzt aber bewusst kein eigenes Nutzersystem
  und lehnt sich vollständig an den Git-Anbieter an: der Kunde bräuchte ein
  GitHub-Konto. Alternative Anmeldeverfahren sind angekündigt, aber nicht verfügbar.

Bleiben Keystatic und TinaCMS.

### Warum Keystatic und nicht TinaCMS

* **Weniger bewegliche Teile.** Keystatic liest und schreibt die Dateien direkt.
  TinaCMS legt eine GraphQL-Schicht mit eigenem Build-Schritt über die Inhalte und
  erzeugt zusätzliche generierte Dateien im Repo. Für einen Produktkatalog ohne
  Redaktions-Workflow ist das Aufwand ohne Gegenwert — und jede zusätzliche Schicht
  ist etwas, das nach der Übergabe kaputtgehen kann.
* **Selbst betreiben bleibt möglich.** Fällt Tina Cloud weg, braucht der
  selbstgehostete Ersatz eine Datenbank (Redis oder MongoDB), einen Auth-Anbieter und
  eine GraphQL-Funktion — das ist genau der Server, den wir laut Briefing nicht wollen.
  Fällt Keystatic Cloud weg, stellt man auf GitHub-OAuth um: eine Änderung in der
  Konfigurationsdatei, kein Server.
* **Astro-Integration ist first-party.** `@keystatic/astro` kommt vom selben Team
  (Thinkmill) und unterstützt in Version 6 die Astro-Versionen 5, 6 und 7 — die aktuelle stabile
  Astro-Version 7 ist also abgedeckt.
* **Nutzergrenze passt besser.** Keystatic Cloud ist bis 3 Nutzer pro Team kostenlos,
  Tina Cloud bis 2. Bei einem Betrieb, in dem zwei Personen Produkte pflegen und wir
  als Dienstleister im Team bleiben, ist 3 der realistischere Zuschnitt.
* **Schema in TypeScript.** Die Felddefinitionen sind normaler, typgeprüfter Code.
  Für eine Vorlage, die pro Kunde kopiert und angepasst wird, heißt das: Tippfehler
  im Datenmodell fallen beim Build auf, nicht erst im Panel des Kunden.

### Wie der Login für den Kunden aussieht

Wir betreiben ein Keystatic-Cloud-Team und verbinden darin das Kunden-Repository.
Den Kunden laden wir per E-Mail in dieses Team ein. Er meldet sich am Panel unter
`/keystatic` mit seiner E-Mail-Adresse an, sieht Kategorien, Produkte und
Einstellungen auf Deutsch beschriftet, und jede Speicherung landet als Commit im
Repository — versioniert und rücksetzbar. Ein GitHub-Konto braucht er nie.

## Passung zum Datenmodell aus Abschnitt 3

| Anforderung | Umsetzung in Keystatic |
|-------------|------------------------|
| Kategorie, Produkt als Sammlungen | `collection()` mit `slugField` — der Slug wird im Panel automatisch aus dem Namen erzeugt und ist nachträglich änderbar |
| Produkt → Kategorie (Verweis) | `fields.relationship()` mit Auswahlliste der vorhandenen Kategorien |
| Bilder als Liste, erstes = Hauptbild | `fields.array(fields.object({ bild, alt }))` mit Sortierung per Ziehen |
| Alternativtext je Bild (Barrierefreiheit) | eigenes Textfeld im Bild-Objekt, im Panel als Pflichtfeld beschriftbar |
| Rich-Text für Beschreibung und Rechtstexte | `fields.mdx()` bzw. `fields.markdoc()` |
| Einstellungen als ein Eintrag | `singleton()` — genau ein Eintrag, nicht löschbar, thematisch gruppiert |
| Umsatzsteuer-Modus als Auswahl | `fields.select()` mit den beiden vorgegebenen Optionen |
| Messenger je aktiv + Kennung | `fields.conditional()` — das ID-Feld erscheint erst, wenn der Messenger aktiviert ist |
| Zahlen, Ja/Nein, Reihenfolge | `fields.integer()`, `fields.checkbox()` mit Standardwert |

Zwei Punkte, die Keystatic **nicht** löst und die wir selbst bauen müssen:

* **Preis mit zwei Nachkommastellen.** Keystatic kennt kein Dezimalfeld. Der Preis wird
  als ganzzahliger Cent-Betrag gespeichert und im Panel als „Preis in Cent" beschriftet —
  oder als Textfeld mit Prüfmuster. Ich schlage Cent vor: das vermeidet Rundungsfehler
  bei der Zwischensumme in der Anfrageliste, und der Hilfetext erklärt es in einem Satz.
  Das ist eine Detailentscheidung für Phase 1, ich lege sie dir dort noch einmal vor.
* **Warnung vor dem Löschen einer Kategorie mit Produkten.** Kein
  Git-basiertes CMS erfüllt das — auch TinaCMS, Decap und Sveltia prüfen keine
  Verweis-Integrität beim Löschen. Der Schutz aus Abschnitt 3 greift trotzdem:
  der Build bricht nicht ab, verwaiste Produkte werden ausgeblendet und als Warnung
  im Build-Log gemeldet. Zusätzlich wird der Hilfetext am Kategorie-Feld darauf
  hinweisen, dass Produkte einer gelöschten Kategorie verschwinden.

---

## Restrisiken, offen benannt

1. **Abhängigkeit von Keystatic Cloud.** Der E-Mail-Login ist ein gehosteter Dienst
   eines kleinen Anbieters. Das Risiko ist aber begrenzt: die Inhalte liegen als
   Dateien im Git-Repository, nicht bei Keystatic. Fällt der Dienst aus, bleibt die
   Website online, und das Panel lässt sich auf GitHub-OAuth umstellen.
2. **Bedienoberfläche ist englisch.** Menüpunkte wie „Create"/„Save" bleiben englisch;
   alle Feldbezeichnungen, Beschreibungen und Hilfetexte definieren wir auf Deutsch.
   Kriterium 7 lässt das ausdrücklich zu. Decap und Sveltia wären hier besser,
   scheitern aber an Kriterium 1.
3. **Eine serverseitige Route.** Das Panel unter `/keystatic` muss serverseitig
   laufen, die eigentlichen Shop-Seiten bleiben vorgebaut und statisch. Es bleibt
   bei „keine Datenbank, keine Server-Logik" — es ist nur eine Funktion beim Hoster,
   die nichts tut, solange niemand das Panel öffnet.
4. **Wer besitzt das Repository nach der Übergabe?** Damit der Kunde ohne
   GitHub-Konto arbeiten kann, muss das Repository bei uns bleiben. „Vollständige
   Übergabe" heißt dann: der Kunde besitzt die Inhalte und bestimmt über die Website,
   wir halten die Code-Ablage. Wird das Repository an ein Kundenkonto übertragen,
   braucht er doch ein GitHub-Konto. Das ist eine kaufmännische Entscheidung,
   keine technische — sie sollte im Kundenvertrag stehen.

## Auswirkung auf das Hosting

Der Astro-Cloudflare-Adapter unterstützt Cloudflare **Pages** nicht mehr; für
Cloudflare führt der Weg über **Workers**. Für die Vorlage schlage ich deshalb
**Netlify** als Standard-Hosting vor: automatischer Build bei jedem Commit,
serverseitige Routen ohne Sonderbehandlung, und die Rolle als reiner Build- und
Auslieferungsdienst ohne Datenbank. Cloudflare Workers bleibt als Variante möglich.

## Einordnung in die Phasen

Die CMS-Empfehlung ist laut Abschnitt 8 Teil von **Phase 4**, muss aber vor Phase 1
entschieden sein: das Datenmodell aus Abschnitt 3 wird in Phase 1 als Content
Collections gebaut, und diese Dateistruktur muss exakt der entsprechen, die Keystatic
später schreibt. Eine spätere Umstellung hieße, alle Inhaltsdateien zu migrieren.

Nach Freigabe baue ich Phase 1 so, dass die Ordner- und Dateistruktur bereits zum
Keystatic-Schema passt. Das Panel selbst kommt wie geplant in Phase 4 dazu.
