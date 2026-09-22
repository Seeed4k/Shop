/**
 * Der Bestelltext und die Messenger-Links.
 *
 * Es werden keine Messenger-Widgets und keine fremden Skripte eingebunden.
 * Hier entstehen nur gewöhnliche Links, die der Besucher selbst anklickt.
 */

export type ShopDaten = {
  name: string;
  /** z. B. „inkl. MwSt., zzgl. Versand“ – kommt aus dem Umsatzsteuer-Modus. */
  zwischensummeHinweis: string;
  messenger: {
    telegram: { aktiv: boolean; benutzername?: string };
    threema: { aktiv: boolean; id?: string };
    signal: { aktiv: boolean; telefon?: string };
  };
};

export type ProduktDaten = {
  slug: string;
  name: string;
  preisCent: number;
  einheit?: string;
  verfuegbar: boolean;
  link: string;
};

export type Zeile = {
  produkt: ProduktDaten;
  menge: number;
  preisCent: number;
};

const waehrung = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Preis im deutschen Format.
 *
 * Intl setzt zwischen Zahl und Eurozeichen ein geschütztes Leerzeichen.
 * Auf der Website ist das richtig, im Nachrichtentext ersetzen wir es durch
 * ein gewöhnliches: Messenger stellen es teils als Kästchen dar, und der Text
 * soll überall gleich aussehen.
 */
export function preisFormatieren(cent: number, fuerNachricht = false): string {
  const text = waehrung.format(cent / 100);
  return fuerNachricht ? text.replace(/ /g, ' ') : text;
}

/**
 * Baut den Bestelltext nach dem Format aus dem Briefing:
 *
 *   Bestellanfrage – [Shopname]
 *   2 × Produkt A (500 g) – je 4,90 € = 9,80 €
 *   1 × Produkt B – 12,00 €
 *   Zwischensumme: 21,80 € (inkl. MwSt., zzgl. Versand)
 *   Name: [falls angegeben]
 *   Anmerkung: [falls angegeben]
 */
export function nachrichtBauen(
  zeilen: Zeile[],
  shop: ShopDaten,
  name: string,
  anmerkung: string
): string {
  const teile: string[] = [`Bestellanfrage – ${shop.name}`];

  for (const zeile of zeilen) {
    const einheit = zeile.produkt.einheit ? ` (${zeile.produkt.einheit})` : '';
    const einzelpreis = preisFormatieren(zeile.preisCent, true);

    if (zeile.menge === 1) {
      teile.push(`1 × ${zeile.produkt.name}${einheit} – ${einzelpreis}`);
    } else {
      const gesamt = preisFormatieren(zeile.preisCent * zeile.menge, true);
      teile.push(`${zeile.menge} × ${zeile.produkt.name}${einheit} – je ${einzelpreis} = ${gesamt}`);
    }
  }

  teile.push(`Zwischensumme: ${preisFormatieren(zwischensumme(zeilen), true)} (${shop.zwischensummeHinweis})`);

  const gekuerzterName = name.trim();
  if (gekuerzterName) teile.push(`Name: ${gekuerzterName}`);

  const gekuerzteAnmerkung = anmerkung.trim();
  if (gekuerzteAnmerkung) teile.push(`Anmerkung: ${gekuerzteAnmerkung}`);

  return teile.join('\n');
}

export function zwischensumme(zeilen: Zeile[]): number {
  return zeilen.reduce((summe, zeile) => summe + zeile.preisCent * zeile.menge, 0);
}

/**
 * Ab welcher Länge der Bestelltext nicht mehr an den Link gehängt wird.
 *
 * Sehr lange Adressen werden von Betriebssystemen und Messenger-Apps
 * abgeschnitten – dann käme eine halbe Bestellung an, was schlimmer wäre als
 * gar keine. Oberhalb dieser Grenze öffnet der Link nur den Chat, und der
 * vollständige Text liegt in der Zwischenablage.
 */
export const LAENGENGRENZE = 2000;

export type MessengerKnopf = {
  dienst: 'telegram' | 'threema' | 'signal';
  href: string;
  /** Trägt der Link den Bestelltext schon mit sich? */
  mitText: boolean;
};

/**
 * Die Links zu den aktivierten Messengern.
 *
 * Drei Eigenheiten, die das Briefing benennt:
 *
 * - Telegram und Threema können den Text über ?text= vorausfüllen.
 * - Signal kann das nicht. Der Link öffnet nur den Chat, deshalb ist dort die
 *   Zwischenablage der einzige Weg.
 * - Der Samsung-Internet-Browser öffnet Threema-Links laut Threema nicht.
 *   Auch dort hilft die Zwischenablage – und weil wir vor jedem Klick
 *   ohnehin kopieren, ist dieser Fall bereits abgedeckt.
 */
export function messengerKnoepfe(shop: ShopDaten, nachricht: string): MessengerKnopf[] {
  const kodiert = encodeURIComponent(nachricht);
  const passtInDenLink = kodiert.length <= LAENGENGRENZE;
  const knoepfe: MessengerKnopf[] = [];

  const { telegram, threema, signal } = shop.messenger;

  if (telegram.aktiv && telegram.benutzername) {
    knoepfe.push({
      dienst: 'telegram',
      href: `https://t.me/${encodeURIComponent(telegram.benutzername)}${passtInDenLink ? `?text=${kodiert}` : ''}`,
      mitText: passtInDenLink,
    });
  }

  if (threema.aktiv && threema.id) {
    knoepfe.push({
      dienst: 'threema',
      href: `https://threema.id/${encodeURIComponent(threema.id)}${passtInDenLink ? `?text=${kodiert}` : ''}`,
      mitText: passtInDenLink,
    });
  }

  if (signal.aktiv && signal.telefon) {
    knoepfe.push({
      dienst: 'signal',
      /*
       * Signal übernimmt keinen Text – der Link öffnet nur den Chat.
       *
       * Die Nummer wird bewusst NICHT kodiert. Sie steht hinter der Raute,
       * und was dort steht, reicht der Browser unverändert an die App weiter.
       * Ein kodiertes Pluszeichen (%2B) käme bei Signal genau so an und
       * ergäbe keine gültige Nummer. Das Pluszeichen ist an dieser Stelle
       * erlaubt, und die Einstellungen lassen ohnehin nur ein Plus mit
       * Ziffern durch.
       */
      href: `https://signal.me/#p/${signal.telefon}`,
      mitText: false,
    });
  }

  return knoepfe;
}

/**
 * Kopiert Text in die Zwischenablage.
 *
 * Der zweite Weg über ein unsichtbares Textfeld ist der Rückfall für ältere
 * Browser und für Seiten ohne HTTPS, wo die Clipboard-API nicht zur Verfügung
 * steht. Gibt zurück, ob es geklappt hat.
 *
 * Hinweis für später: document.execCommand gilt als veraltet, und die
 * Typprüfung meldet das auch. Das ist hier Absicht – es ist genau der
 * Rückfall, den das Briefing verlangt, und es gibt keinen Ersatz, der in
 * denselben alten Browsern funktioniert. Bitte nicht "aufräumen".
 */
export async function kopieren(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Weiter mit dem Rückfall.
  }

  try {
    const feld = document.createElement('textarea');
    feld.value = text;
    feld.setAttribute('readonly', '');
    feld.style.cssText = 'position:fixed;top:-1000px;opacity:0';
    document.body.appendChild(feld);
    feld.select();
    const geklappt = document.execCommand('copy');
    document.body.removeChild(feld);
    return geklappt;
  } catch {
    return false;
  }
}

/**
 * Die reinen Chat-Links der aktivierten Messenger, ohne Bestelltext.
 *
 * Sie hängen nur von den Einstellungen ab und ändern sich nie – deshalb
 * können daraus schon beim Build QR-Codes entstehen.
 */
export function chatLinks(shop: ShopDaten): { dienst: MessengerKnopf['dienst']; href: string }[] {
  const { telegram, threema, signal } = shop.messenger;
  const links: { dienst: MessengerKnopf['dienst']; href: string }[] = [];

  if (telegram.aktiv && telegram.benutzername) {
    links.push({ dienst: 'telegram', href: `https://t.me/${encodeURIComponent(telegram.benutzername)}` });
  }
  if (threema.aktiv && threema.id) {
    links.push({ dienst: 'threema', href: `https://threema.id/${encodeURIComponent(threema.id)}` });
  }
  if (signal.aktiv && signal.telefon) {
    // Siehe oben: hinter der Raute bleibt das Pluszeichen unkodiert.
    links.push({ dienst: 'signal', href: `https://signal.me/#p/${signal.telefon}` });
  }

  return links;
}
