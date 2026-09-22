#!/usr/bin/env node
/**
 * Entfernt die Beispielinhalte, damit aus der Vorlage ein leerer Kundenshop wird.
 *
 * Aufruf:  npm run neuer-shop -- --wirklich
 *
 * Die Sicherheitsabfrage ist Absicht: Das Skript löscht unwiderruflich alle
 * Produkte, Kategorien und Bilder. In einem laufenden Kundenshop wäre das ein
 * Unglück, und ein vertippter Befehl passiert schneller, als man denkt.
 */
import { rmSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

if (!process.argv.includes('--wirklich')) {
  console.error(`
Dieses Skript löscht ALLE Produkte, Kategorien und Bilder dieses Shops.

Gedacht ist es für genau einen Fall: aus der Vorlage einen neuen, leeren
Kundenshop machen. Wenn Sie sicher sind:

    npm run neuer-shop -- --wirklich
`);
  process.exit(1);
}

const leeren = (ordner, muster) => {
  if (!existsSync(ordner)) return 0;
  const dateien = readdirSync(ordner).filter((d) => muster.test(d));
  for (const datei of dateien) rmSync(join(ordner, datei), { recursive: true, force: true });
  return dateien.length;
};

const produkte = leeren('src/content/produkte', /\.md$/);
const kategorien = leeren('src/content/kategorien', /\.json$/);

for (const bereich of ['produkte', 'kategorien', 'shop']) {
  rmSync(join('src/bilder', bereich), { recursive: true, force: true });
  mkdirSync(join('src/bilder', bereich), { recursive: true });
}

/**
 * Leere Einstellungen mit unverfänglichen Standardwerten.
 *
 * Der Shopname ist bewusst auffällig: Geht die Seite versehentlich so online,
 * fällt es sofort auf.
 */
const einstellungen = {
  shop: {
    name: 'NEUER SHOP – bitte Einstellungen ausfüllen',
    website: '',
    logo: '',
    favicon: '',
    primaerfarbe: '#7a4b2a',
    akzentfarbe: '#3f7d4f',
    schrift: 'system',
    hintergrund: 'schlicht',
    startseiteUeberschrift: '',
    startseiteText: '',
    startseiteBild: '',
    startseiteBildAlt: '',
  },
  kontakt: { inhaber: '', adresse: '', email: '', telefon: '' },
  messenger: {
    telegram: { aktiv: false, benutzername: '' },
    threema: { aktiv: false, id: '' },
    signal: { aktiv: false, telefon: '' },
  },
  preise: { umsatzsteuerModus: 'inklusive' },
  versand: '',
  bestellablauf: '',
};
writeFileSync('src/content/einstellungen.json', JSON.stringify(einstellungen, null, 2) + '\n', 'utf8');

// Rechtstexte leeren, aber die Überschriften behalten - der Kunde füllt sie.
const rechtstexte = {
  impressum: 'Impressum',
  datenschutz: 'Datenschutzerklärung',
  widerruf: 'Widerrufsbelehrung',
  agb: 'Allgemeine Geschäftsbedingungen',
  'versand-zahlung': 'Versand & Zahlung',
};
for (const [datei, titel] of Object.entries(rechtstexte)) {
  writeFileSync(`src/content/rechtstexte/${datei}.md`, `---\ntitel: ${titel}\n---\n\n`, 'utf8');
}

console.log(`
Beispielinhalte entfernt:
  ${produkte} Produkte, ${kategorien} Kategorien, alle Bilder
  Einstellungen und Rechtstexte zurückgesetzt

Weiter mit NEUER-KUNDE.md, Schritt 4.
`);
