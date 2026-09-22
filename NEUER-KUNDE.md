# Neuen Kundenshop anlegen

Checkliste, um aus dieser Vorlage einen fertigen Shop für einen Kunden zu machen.
Richtwert: **unter einer Stunde**, wenn die Angaben des Kunden vorliegen.

---

## Vorher vom Kunden besorgen

Ohne diese Dinge kommen Sie in Schritt 4 nicht weiter:

- [ ] Shopname, Logo (quadratisch, ab 256 px)
- [ ] Zwei Farben als Hex-Wert, oder die Erlaubnis, sie festzulegen
- [ ] Anschrift, E-Mail, Telefon für den Fußbereich
- [ ] Messenger-Kennungen: Telegram-Benutzername, Threema-ID, Signal-Nummer
- [ ] **Umsatzsteuer-Modus** – regelbesteuert oder Kleinunternehmer nach § 19 UStG.
      Im Zweifel beim Steuerberater des Kunden nachfragen, nicht raten.
- [ ] Angaben zu Versand und Bestellablauf
- [ ] **Rechtstexte**: Impressum, Datenschutz, Widerruf, Versand & Zahlung.
      Stellt der Kunde bereit. Ohne sie darf der Shop nicht online.
- [ ] E-Mail-Adresse der Person, die die Inhalte pflegen wird
- [ ] Wunschdomain

---

## 1. Repository anlegen

Diese Vorlage auf GitHub kopieren (**Use this template** oder Fork), Name zum
Beispiel `shop-mustermann`.

```bash
git clone https://github.com/IHR-KONTO/shop-mustermann
cd shop-mustermann
npm install
```

---

## 2. Beispielinhalte entfernen

```bash
npm run neuer-shop -- --wirklich
```

Das löscht alle Produkte, Kategorien und Bilder und setzt Einstellungen sowie
Rechtstexte zurück. Der Shopname steht danach auf „NEUER SHOP – bitte
Einstellungen ausfüllen“, damit ein versehentlicher Start sofort auffällt.

---

## 3. Keystatic Cloud einrichten

Damit sich der Kunde später **mit E-Mail und ohne GitHub-Konto** anmelden kann:

1. Auf [keystatic.cloud](https://keystatic.cloud) anmelden.
2. Ein Team anlegen (eines pro Kunde ist übersichtlicher, eines für alle ist billiger).
3. Im Team ein Projekt anlegen und mit dem Repository aus Schritt 1 verbinden.
4. Die Projektkennung notieren, Form: `team/projekt`.

> **Kosten:** kostenlos bis 3 Nutzer pro Team. Darüber 10 $ im Monat.
> Für Sie plus eine Person beim Kunden reicht der kostenlose Rahmen.

---

## 4. Einstellungen ausfüllen

Lokal starten und das Panel öffnen:

```bash
npm run dev
# http://localhost:4321/keystatic
```

Im lokalen Modus schreibt das Panel direkt in die Dateien – ohne Anmeldung.

- [ ] **Einstellungen** vollständig ausfüllen, inklusive **Adresse der Website**
      (ohne sie fehlen `sitemap.xml` und die Vorschaubilder beim Teilen)
- [ ] Logo und Symbol für den Browser-Tab hochladen
- [ ] Schriftart und Hintergrund mit dem Kunden abstimmen
- [ ] Kategorien anlegen
- [ ] Erste Produkte anlegen
- [ ] **Rechtstexte** einfügen

Dann bauen und die Meldungen lesen:

```bash
npm run build
```

Alle Meldungen beginnen mit `[Shop-Inhalte]`. Sie müssen nicht alle
verschwinden – „Kein Messenger aktiviert“ zum Beispiel ist nur dann ein
Problem, wenn tatsächlich einer aktiv sein soll.

---

## 5. Bei Netlify veröffentlichen

1. Auf [netlify.com](https://netlify.com) **Add new site → Import an existing
   project** und das Repository auswählen.
2. Build-Befehl und Verzeichnis stehen in `netlify.toml` – nichts eintragen.
3. Unter **Site configuration → Environment variables** anlegen:

   | Name | Wert |
   |------|------|
   | `PUBLIC_KEYSTATIC_CLOUD_PROJECT` | die Kennung aus Schritt 3, z. B. `mustermann/shop` |

4. **Deploy** auslösen.

> Ohne diese Variable ist das Panel auf der Live-Seite **gesperrt** – wer
> `/keystatic` aufruft, sieht „Verwaltung noch nicht eingerichtet“. Das ist
> Absicht: Der lokale Modus von Keystatic kennt keine Anmeldung, und ohne Sperre
> stünde eine Schreibschnittstelle offen im Netz. Der Shop selbst läuft auch
> ohne die Variable normal.

---

## 6. Domain verbinden

- [ ] Domain bei Netlify hinterlegen (**Domain management**)
- [ ] DNS beim Anbieter des Kunden umstellen
- [ ] HTTPS-Zertifikat abwarten (Netlify macht das von selbst, dauert Minuten)
- [ ] **Adresse der Website** in den Einstellungen auf die echte Domain ändern,
      falls dort noch ein Platzhalter steht, und neu veröffentlichen

---

## 7. Den Kunden einladen

1. In Keystatic Cloud im Team unter **Users** die E-Mail-Adresse des Kunden einladen.
2. Der Kunde bekommt eine E-Mail und meldet sich unter
   `https://seine-domain.de/keystatic` an.
3. `ANLEITUNG-KUNDE.md` weitergeben – am besten ausgedruckt oder als PDF.

---

## 8. Vor der Übergabe prüfen

- [ ] Alle Seiten aufrufen: Start, jede Kategorie, mehrere Produkte,
      Anfrageliste, alle Rechtsseiten, eine erfundene Adresse für die 404-Seite
- [ ] Am **Handy** ansehen, nicht nur am Rechner
- [ ] **Testbestellung über jeden aktivierten Messenger**, einmal vom Handy und
      einmal vom Rechner. Kommt die Nachricht vollständig an?
- [ ] Bei Signal prüfen: Text liegt in der Zwischenablage und lässt sich einfügen
- [ ] Im Panel einmal ein Produkt anlegen, ändern und löschen
- [ ] Lighthouse laufen lassen:

```bash
npm run build
cd dist && python3 -m http.server 4400
npx lighthouse http://127.0.0.1:4400/ --view
```

- [ ] Build-Log auf `[Shop-Inhalte]`-Meldungen durchsehen
- [ ] **Rechtstexte liegen vor und sind geprüft** – ohne sie geht der Shop nicht online

---

## 9. Die Eigentumsfrage – bitte vorher klären

Hier gibt es keine Lösung, die alles auf einmal erfüllt. Entscheiden Sie mit dem
Kunden **vor** der Übergabe:

### Weg A: Das Repository bleibt bei Ihnen

- Der Kunde meldet sich mit **E-Mail** an und braucht kein GitHub-Konto.
- Er pflegt alle Inhalte selbst, ohne Sie.
- Sie behalten Zugriff auf den Code – technisch unvermeidlich.
- „Vollständige Übergabe“ heißt dann: Der Kunde besitzt seine Inhalte und
  bestimmt über die Website, Sie halten die Code-Ablage.
- **Gehört in den Vertrag:** Was passiert, wenn der Kunde wechseln will? Eine
  Zusage, das Repository auf Verlangen zu übertragen, kostet Sie nichts und
  nimmt dem Kunden die Sorge.

### Weg B: Das Repository geht an den Kunden

- Sie übertragen das Repository an sein GitHub-Konto und entfernen sich aus dem
  Keystatic-Team.
- Sie haben keinen Zugriff mehr – echte vollständige Übergabe.
- **Aber:** Der Kunde braucht dann ein GitHub-Konto und muss die
  Keystatic-Cloud-Verbindung selbst halten. Für einen Laien ist das ein Bruch
  mit dem Versprechen „keine GitHub-Kenntnisse nötig“.

**Empfehlung:** Weg A mit einer Übertragungszusage im Vertrag.

---

## 10. Übergeben

- [ ] `ANLEITUNG-KUNDE.md` übergeben und einmal gemeinsam durchgehen
- [ ] Zugangsdaten Keystatic Cloud bestätigen
- [ ] Vereinbaren, wer bei Problemen erreichbar ist
- [ ] Rechnung und, je nach Weg aus Schritt 9, die Vereinbarung zum Repository

---

## Was danach zu tun bleibt

Nichts Regelmäßiges. Die Website läuft ohne Pflege. Drei Dinge kommen
gelegentlich vor:

- **Änderungen des Kunden, die schiefgehen** – das Build-Log bei Netlify zeigt,
  was nicht stimmt. Alle Meldungen beginnen mit `[Shop-Inhalte]`.
- **Verwaiste Bilder** – löscht der Kunde ein Produkt, bleibt sein Bildordner
  liegen. Der Build meldet die Bilder namentlich. Einmal im Jahr aufräumen reicht.
- **Sicherheitsaktualisierungen** – nur nötig, wenn GitHub eine Meldung zu einer
  Abhängigkeit schickt. `npm update` und veröffentlichen.

---

## Was Sie nicht machen können

Ehrlichkeitshalber:

- **Die Rechtstexte schreiben.** Das ist eine Rechtsberatung und Anwälten vorbehalten.
- **Den Umsatzsteuer-Modus festlegen.** Steuerberater des Kunden.
- **Die Formulierungen auf der Anfrageliste rechtlich absegnen.** Sie sind als
  unverbindliche Anfrage formuliert und stehen laut Briefing unter rechtlichem
  Vorbehalt. Vor dem ersten echten Kunden prüfen lassen.
