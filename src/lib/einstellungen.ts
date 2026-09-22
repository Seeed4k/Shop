import * as z from 'zod';
import roheEinstellungen from '../content/einstellungen.json';
import { warnen } from './warnungen';
import { freiwillig } from './zod-hilfen';
import { kontrast, schriftAuf } from './farben';
import { schriftartIds } from './schriften';
import { hintergrundIds } from './hintergruende';

/**
 * Die Einstellungen sind das Herz der Wiederverwendbarkeit: Name, Logo, Farben,
 * Kontaktdaten und Messenger kommen von hier und nicht aus dem Code. Ein neuer
 * Kundenshop entsteht durch Kopieren der Vorlage und Ausfüllen dieser Datei
 * über das Panel.
 *
 * Fehlerhafte Einstellungen lassen den Build nicht scheitern. Sie werden im
 * Build-Log gemeldet, und die Vorlage fällt auf einen sicheren Wert zurück.
 * Eine Website, die wegen eines Tippfehlers im Panel offline geht, wäre das
 * Gegenteil von „wartungsfrei“.
 */

const hexFarbe = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, 'Farben werden als Hex-Wert mit sechs Zeichen angegeben, zum Beispiel #8a5a2b.');

const messengerSchema = z.object({
  telegram: z.object({
    aktiv: z.boolean().default(false),
    // Ohne führendes @ – das setzt die Vorlage selbst, wenn nötig.
    benutzername: freiwillig(
      z.string().regex(/^[A-Za-z0-9_]{5,32}$/, 'Der Telegram-Benutzername besteht aus 5 bis 32 Buchstaben, Ziffern oder Unterstrichen – ohne das @ davor.')
    ),
  }).default({ aktiv: false }),
  threema: z.object({
    aktiv: z.boolean().default(false),
    id: freiwillig(
      z.string().regex(/^[A-Z0-9]{8}$/, 'Eine Threema-ID besteht aus genau 8 Großbuchstaben oder Ziffern.')
    ),
  }).default({ aktiv: false }),
  signal: z.object({
    aktiv: z.boolean().default(false),
    telefon: freiwillig(
      z.string().regex(/^\+[1-9][0-9]{6,20}$/, 'Die Signal-Nummer wird international angegeben, zum Beispiel +4915112345678.')
    ),
  }).default({ aktiv: false }),
});

const einstellungenSchema = z.object({
  shop: z.object({
    name: z.string().min(1, 'Der Shop braucht einen Namen.'),
    website: freiwillig(z.url('Die Adresse der Website muss vollständig sein, zum Beispiel https://mein-hofladen.de.')),
    logo: freiwillig(z.string()),
    favicon: freiwillig(z.string()),
    primaerfarbe: hexFarbe.default('#7a4b2a'),
    akzentfarbe: hexFarbe.default('#3f7d4f'),

    // Schrift und Hintergrund sind Auswahllisten, keine Freitextfelder.
    // Ein Laie soll eine Stimmung wählen können, ohne Schriftnamen zu kennen
    // oder eine Farbe zu treffen, die zur Primärfarbe passt.
    schrift: z
      .enum(schriftartIds, { error: 'Diese Schriftart gibt es nicht. Bitte im Panel eine aus der Liste wählen.' })
      .default('system'),
    hintergrund: z
      .enum(hintergrundIds, { error: 'Diesen Hintergrund gibt es nicht. Bitte im Panel einen aus der Liste wählen.' })
      .default('schlicht'),
    hintergrundBild: freiwillig(z.string()),
    startseiteUeberschrift: z.string().default(''),
    startseiteText: z.string().default(''),
    startseiteBild: freiwillig(z.string()),
    startseiteBildAlt: freiwillig(z.string()),
  }),
  kontakt: z.object({
    inhaber: z.string().default(''),
    adresse: z.string().default(''),
    email: freiwillig(z.email('Die E-Mail-Adresse im Kontakt ist nicht vollständig.')),
    telefon: z.string().default(''),
  }),
  messenger: messengerSchema,
  preise: z.object({
    umsatzsteuerModus: z
      .enum(['inklusive', 'kleinunternehmer'], {
        error: 'Der Umsatzsteuer-Modus muss „inklusive“ oder „kleinunternehmer“ sein.',
      })
      .default('inklusive'),
  }),
  versand: z.string().default(''),
  bestellablauf: z.string().default(''),
});

export type Einstellungen = ReturnType<typeof einstellungenSchema.parse>;

/**
 * Sichere Notfallwerte. Sie greifen nur, wenn die Einstellungsdatei so kaputt
 * ist, dass nicht einmal der Shopname gelesen werden kann. Die Seite bleibt
 * dann online, sieht aber sichtbar unfertig aus – das ist gewollt, damit der
 * Fehler auffällt und nicht monatelang unbemerkt bleibt.
 */
const notfallwerte: Einstellungen = einstellungenSchema.parse({
  shop: { name: 'Shop (Einstellungen prüfen)' },
  kontakt: {},
  messenger: {},
  preise: {},
});

/**
 * Entfernt einen Wert an der angegebenen Stelle aus den Rohdaten.
 * Gibt zurück, ob tatsächlich etwas entfernt wurde.
 */
function wertEntfernen(daten: unknown, pfad: readonly PropertyKey[]): boolean {
  let stelle: any = daten;
  for (const schritt of pfad.slice(0, -1)) {
    if (stelle == null || typeof stelle !== 'object') return false;
    stelle = stelle[schritt];
  }
  const letzter = pfad.at(-1);
  if (stelle == null || typeof stelle !== 'object' || letzter === undefined) return false;
  if (!(letzter in stelle)) return false;
  delete stelle[letzter];
  return true;
}

/**
 * Liest die Einstellungen und verwirft dabei gezielt nur das, was nicht stimmt.
 *
 * Der naive Weg wäre, bei einem einzigen Fehler die komplette Datei zu
 * verwerfen. Das hätte eine unangenehme Folge: Ein Tippfehler in der
 * Threema-ID würde auch Shopname, Farben und Kontaktdaten auf Ersatzwerte
 * setzen – die halbe Website sähe kaputt aus wegen eines Feldes, das nur einen
 * Button betrifft.
 *
 * Stattdessen wird das fehlerhafte Feld entfernt und erneut gelesen. Fehlt für
 * das Feld ein sinnvoller Standardwert und bleibt die Datei deshalb ungültig,
 * greifen am Ende doch die Notfallwerte.
 */
function einstellungenLaden(): Einstellungen {
  // Kopie, damit die importierten Rohdaten unangetastet bleiben.
  const daten = structuredClone(roheEinstellungen) as unknown;

  let ergebnis = einstellungenSchema.safeParse(daten);

  // Die Obergrenze verhindert eine Endlosschleife, falls sich ein Fehler nicht
  // durch Entfernen beheben lässt.
  for (let versuch = 0; !ergebnis.success && versuch < 20; versuch++) {
    let etwasEntfernt = false;

    for (const fehler of ergebnis.error.issues) {
      const feld = fehler.path.join(' → ') || '(oberste Ebene)';
      warnen('Einstellungen', `${feld}: ${fehler.message}`);
      if (wertEntfernen(daten, fehler.path)) etwasEntfernt = true;
    }

    // Nichts zu entfernen heißt: Ein Pflichtfeld fehlt ganz. Weitere Versuche
    // bringen dann nichts mehr.
    if (!etwasEntfernt) break;

    ergebnis = einstellungenSchema.safeParse(daten);
  }

  if (!ergebnis.success) {
    warnen(
      'Einstellungen',
      'Die Einstellungen konnten nicht gelesen werden. Die Seite läuft mit Ersatzwerten weiter – bitte im Panel prüfen.'
    );
    return notfallwerte;
  }

  const einstellungen = ergebnis.data;

  // Ein Messenger, der aktiv ist, aber keine Kennung hat, würde einen
  // Button erzeugen, der ins Leere führt. Lieber still abschalten und melden.
  const kennungen = {
    telegram: einstellungen.messenger.telegram.benutzername,
    threema: einstellungen.messenger.threema.id,
    signal: einstellungen.messenger.signal.telefon,
  } as const;

  for (const [dienst, kennung] of Object.entries(kennungen) as [keyof typeof kennungen, string | undefined][]) {
    if (einstellungen.messenger[dienst].aktiv && !kennung) {
      warnen(
        'Einstellungen',
        `${dienst} ist aktiviert, aber die Kennung fehlt. Der Button wird nicht angezeigt.`
      );
      einstellungen.messenger[dienst].aktiv = false;
    }
  }

  if (!einstellungen.messenger.telegram.aktiv && !einstellungen.messenger.threema.aktiv && !einstellungen.messenger.signal.aktiv) {
    warnen(
      'Einstellungen',
      'Kein Messenger ist aktiviert. Die Anfrageliste bietet dann nur die Kopier-Lösung an.'
    );
  }

  /*
   * Kontrastprüfung der gewählten Farben.
   *
   * Die Schriftfarbe wird zwar automatisch hell oder dunkel gewählt, aber bei
   * mittelhellen Tönen reicht auch die bessere von beiden nicht immer für die
   * 4,5:1, die für kleinen Text gefordert sind. Das kann die Vorlage nicht
   * beheben – die Farbe gehört dem Kunden. Sie kann aber darauf hinweisen.
   */
  for (const [name, farbe] of [
    ['Primärfarbe', einstellungen.shop.primaerfarbe],
    ['Akzentfarbe', einstellungen.shop.akzentfarbe],
  ] as const) {
    const verhaeltnis = kontrast(farbe, schriftAuf(farbe));
    if (verhaeltnis < 4.5) {
      warnen(
        'Einstellungen',
        `Die ${name} ${farbe} erreicht mit der bestmöglichen Schriftfarbe nur ${verhaeltnis.toFixed(
          1
        )}:1. Für kleinen Text sind 4,5:1 gefordert. Bitte eine etwas dunklere oder hellere Farbe wählen.`
      );
    }
  }

  // „Eigenes Bild“ ohne Bild ergäbe einen leeren Hintergrund. Dann lieber
  // schlicht weiß und ein Hinweis.
  if (einstellungen.shop.hintergrund === 'bild' && !einstellungen.shop.hintergrundBild) {
    warnen(
      'Einstellungen',
      'Als Hintergrund ist „Eigenes Bild“ gewählt, aber kein Bild hochgeladen. Es wird der weiße Hintergrund verwendet.'
    );
    einstellungen.shop.hintergrund = 'schlicht';
  }

  if (!einstellungen.shop.website) {
    warnen(
      'Einstellungen',
      'Es ist keine Adresse der Website hinterlegt. Ohne sie fehlen sitemap.xml und die Vorschaubilder beim Teilen.'
    );
  }

  return einstellungen;
}

export const einstellungen = einstellungenLaden();

/** Gibt es überhaupt einen aktiven Messenger? Steuert die Anzeige in Phase 3. */
export const messengerAktiv =
  einstellungen.messenger.telegram.aktiv ||
  einstellungen.messenger.threema.aktiv ||
  einstellungen.messenger.signal.aktiv;
