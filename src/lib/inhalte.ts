import { getCollection, type CollectionEntry } from 'astro:content';
import { bilderAufbereiten, bildFinden, verwaisteBilderMelden, type AufbereitetesBild } from './bilder';
import { einstellungen } from './einstellungen';
import { warnen } from './warnungen';

/**
 * Laden und Aufbereiten der Inhalte.
 *
 * Die wichtigste Regel dieser Datei steht im Briefing (Abschnitt 3):
 * Der Build darf niemals fehlschlagen, weil ein Produkt auf eine gelöschte
 * Kategorie verweist. Deshalb wird jeder Verweis hier von Hand aufgelöst.
 * Was nicht aufgeht, wird ausgeblendet und gemeldet – nicht geworfen.
 */

export type Kategorie = {
  slug: string;
  name: string;
  beschreibung?: string;
  bild?: ReturnType<typeof bildFinden>;
  bildAlt: string;
  reihenfolge?: number;
};

export type Produkt = {
  slug: string;
  name: string;
  kategorie: Kategorie;
  preisCent: number;
  einheit?: string;
  grundpreis?: string;
  kurzbeschreibung: string;
  bilder: AufbereitetesBild[];
  hauptbild: AufbereitetesBild;
  verfuegbar: boolean;
  hervorgehoben: boolean;
  reihenfolge?: number;
  eintrag: CollectionEntry<'produkte'>;
};

/**
 * Sortiert nach dem Feld „reihenfolge“, danach alphabetisch.
 *
 * Einträge ohne Reihenfolge landen hinten statt vorne. Das ist der freundlichere
 * Fall: Wer bei einem neuen Produkt das Feld leer lässt, will es selten ganz
 * oben haben – und die alphabetische Ordnung bleibt als Rückfall verständlich.
 */
function nachReihenfolge<T extends { reihenfolge?: number; name: string }>(a: T, b: T): number {
  const aRang = a.reihenfolge ?? Number.MAX_SAFE_INTEGER;
  const bRang = b.reihenfolge ?? Number.MAX_SAFE_INTEGER;
  if (aRang !== bRang) return aRang - bRang;
  return a.name.localeCompare(b.name, 'de');
}

/** Sieht die Einheit nach einer Mengenangabe aus? Dann ist ein Grundpreis Pflicht. */
const mengenEinheit = /\d\s*(g|kg|ml|l|liter|gramm|stk)\b/i;

let zwischenspeicher: { kategorien: Kategorie[]; produkte: Produkt[] } | undefined;

async function inhalteAufbereiten() {
  if (zwischenspeicher) return zwischenspeicher;

  const roheKategorien = await getCollection('kategorien');
  const roheProdukte = await getCollection('produkte');

  // Schritt 1: Kategorien aufbereiten. Unsichtbare fliegen raus, werden aber
  // weiter unten noch gebraucht, um Produkte richtig einordnen zu können.
  const alleKategorienNachSlug = new Map(roheKategorien.map((eintrag) => [eintrag.id, eintrag]));

  const kategorien: Kategorie[] = roheKategorien
    .filter((eintrag) => eintrag.data.sichtbar)
    .map((eintrag) => ({
      slug: eintrag.id,
      name: eintrag.data.name,
      beschreibung: eintrag.data.beschreibung,
      bild: bildFinden(eintrag.data.bild, `Kategorie „${eintrag.data.name}“`),
      bildAlt: eintrag.data.bildAlt ?? eintrag.data.name,
      reihenfolge: eintrag.data.reihenfolge,
    }))
    .sort(nachReihenfolge);

  const sichtbareKategorienNachSlug = new Map(kategorien.map((kategorie) => [kategorie.slug, kategorie]));

  // Schritt 2: Produkte aufbereiten und dabei den Kategorie-Verweis auflösen.
  const produkte: Produkt[] = [];

  for (const eintrag of roheProdukte) {
    const daten = eintrag.data;
    const fundstelle = `Produkt „${daten.name}“`;

    // Der Fall, um den es im Briefing geht: Die Kategorie existiert nicht mehr.
    const kategorie = sichtbareKategorienNachSlug.get(daten.kategorie);
    if (!kategorie) {
      const existiertAberUnsichtbar = alleKategorienNachSlug.has(daten.kategorie);
      warnen(
        'Produkte',
        existiertAberUnsichtbar
          ? `${fundstelle} gehört zur Kategorie „${daten.kategorie}“, die auf „nicht sichtbar“ steht. Das Produkt wird nicht angezeigt.`
          : `${fundstelle} verweist auf die Kategorie „${daten.kategorie}“, die es nicht (mehr) gibt. Das Produkt wird nicht angezeigt. Bitte im Panel eine gültige Kategorie auswählen.`
      );
      continue;
    }

    // Ein Produkt ohne anzeigbares Bild hätte eine kaputte Karte zur Folge.
    const bilder = bilderAufbereiten(daten.bilder, fundstelle);
    if (bilder.length === 0) {
      warnen(
        'Produkte',
        `${fundstelle} hat kein anzeigbares Bild. Das Produkt wird nicht angezeigt. Bitte im Panel mindestens ein Bild hochladen.`
      );
      continue;
    }

    // Preisangabenverordnung: Bei Waren nach Gewicht oder Volumen muss ein
    // Grundpreis stehen. Das lässt sich nicht automatisch berechnen, weil die
    // Einheit ein Freitext ist – also wird daran erinnert.
    if (!daten.grundpreis && daten.einheit && mengenEinheit.test(daten.einheit)) {
      warnen(
        'Produkte',
        `${fundstelle} wird nach Menge verkauft („${daten.einheit}“), hat aber keinen Grundpreis. Der ist bei Gewichts- und Volumenangaben vorgeschrieben.`
      );
    }

    produkte.push({
      slug: eintrag.id,
      name: daten.name,
      kategorie,
      preisCent: daten.preisCent,
      einheit: daten.einheit,
      grundpreis: daten.grundpreis,
      kurzbeschreibung: daten.kurzbeschreibung,
      bilder,
      hauptbild: bilder[0]!,
      verfuegbar: daten.verfuegbar,
      hervorgehoben: daten.hervorgehoben,
      reihenfolge: daten.reihenfolge,
      eintrag,
    });
  }

  produkte.sort(nachReihenfolge);

  // Eine leere Kategorie ist kein Fehler, aber fast immer ein Versehen.
  for (const kategorie of kategorien) {
    if (!produkte.some((produkt) => produkt.kategorie.slug === kategorie.slug)) {
      warnen('Kategorien', `Die Kategorie „${kategorie.name}“ enthält kein Produkt.`);
    }
  }

  // Alles, worauf irgendein Inhalt verweist – der Rest im Bilderordner ist
  // übrig geblieben und wird gemeldet.
  const benutzteBilder = new Set<string>();
  for (const eintrag of roheKategorien) if (eintrag.data.bild) benutzteBilder.add(eintrag.data.bild);
  for (const eintrag of roheProdukte) for (const b of eintrag.data.bilder) benutzteBilder.add(b.bild);
  for (const pfad of [einstellungen.shop.logo, einstellungen.shop.favicon, einstellungen.shop.startseiteBild]) {
    if (pfad) benutzteBilder.add(pfad);
  }
  verwaisteBilderMelden(benutzteBilder);

  zwischenspeicher = { kategorien, produkte };
  return zwischenspeicher;
}

/** Alle sichtbaren Kategorien, fertig sortiert. */
export async function kategorienLaden(): Promise<Kategorie[]> {
  return (await inhalteAufbereiten()).kategorien;
}

/** Alle anzeigbaren Produkte, fertig sortiert. */
export async function produkteLaden(): Promise<Produkt[]> {
  return (await inhalteAufbereiten()).produkte;
}

/** Die Produkte einer Kategorie, in ihrer Reihenfolge. */
export async function produkteDerKategorie(kategorieSlug: string): Promise<Produkt[]> {
  const { produkte } = await inhalteAufbereiten();
  return produkte.filter((produkt) => produkt.kategorie.slug === kategorieSlug);
}

/** Die auf der Startseite hervorgehobenen Produkte. */
export async function hervorgehobeneProdukte(): Promise<Produkt[]> {
  const { produkte } = await inhalteAufbereiten();
  return produkte.filter((produkt) => produkt.hervorgehoben);
}

/** Adresse einer Kategorieseite. */
export function kategorieLink(kategorie: Pick<Kategorie, 'slug'>): string {
  return `/kategorie/${kategorie.slug}/`;
}

/** Adresse einer Produktseite. */
export function produktLink(produkt: Pick<Produkt, 'slug'>): string {
  return `/produkt/${produkt.slug}/`;
}

export type Rechtstext = {
  slug: string;
  titel: string;
  eintrag: CollectionEntry<'rechtstexte'>;
};

/**
 * Die befüllten Rechtstexte, in fester Reihenfolge.
 *
 * Optionale Texte (laut Briefing die AGB) sollen aus dem Fußbereich
 * verschwinden, wenn sie leer sind. Deshalb wird hier auf Inhalt geprüft und
 * nicht nur auf das Vorhandensein der Datei.
 */
const rechtstextReihenfolge = ['impressum', 'datenschutz', 'widerruf', 'agb', 'versand-zahlung'];

export async function rechtstexteLaden(): Promise<Rechtstext[]> {
  const eintraege = await getCollection('rechtstexte');

  return eintraege
    .filter((eintrag) => {
      const hatInhalt = (eintrag.body ?? '').trim().length > 0;
      if (!hatInhalt) {
        warnen('Rechtstexte', `„${eintrag.data.titel}“ ist leer und wird nicht verlinkt.`);
      }
      return hatInhalt;
    })
    .map((eintrag) => ({ slug: eintrag.id, titel: eintrag.data.titel, eintrag }))
    .sort((a, b) => {
      const aRang = rechtstextReihenfolge.indexOf(a.slug);
      const bRang = rechtstextReihenfolge.indexOf(b.slug);
      return (aRang === -1 ? 99 : aRang) - (bRang === -1 ? 99 : bRang);
    });
}

/** Adresse einer Rechtsseite. */
export function rechtstextLink(rechtstext: Pick<Rechtstext, 'slug'>): string {
  return `/${rechtstext.slug}/`;
}
