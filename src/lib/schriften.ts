/**
 * Die Schriften, unter denen der Kunde im Panel wählen kann.
 *
 * Hier stehen nur die Angaben, die das Panel und der Seitenkopf brauchen:
 * Beschriftung, Hilfetext und die Datei zum Vorabladen. Wie die Schriften
 * eingebunden und zugewiesen werden, steht in src/styles/global.css – die
 * Gestaltung gehört an einen Ort, nicht in zusammengesetzte CSS-Texte.
 *
 * Zwei Regeln bestimmen den Aufbau:
 *
 * 1. Alle Schriftdateien liegen unter public/schriften/ auf dem eigenen Server.
 *    Es wird nichts von Google Fonts oder einem anderen Anbieter nachgeladen.
 *    Der Browser holt immer nur die Datei der gewählten Schrift (37 bis 50 KB).
 *
 * 2. Der Kunde wählt ein fertiges Paar aus Überschriften- und Fließtextschrift,
 *    nicht zwei Schriften einzeln. Eine freie Kombination führt schnell zu
 *    unruhigen Ergebnissen – eine Vorlage für Laien soll keine Fallgrube sein.
 */

export type Schriftart = {
  /** Beschriftung im Panel. */
  label: string;
  /** Hilfetext im Panel, damit die Wahl ohne Vorschau verständlich ist. */
  beschreibung: string;
  /**
   * Die Dateien dieser Schrift, zum Vorabladen im Seitenkopf.
   * Leer bei der Systemschrift – dort wird gar nichts geladen.
   */
  dateien: string[];
};

export const schriftarten = {
  system: {
    label: 'Systemschrift',
    beschreibung:
      'Die Schrift, die das Gerät des Besuchers ohnehin hat. Lädt am schnellsten, weil gar keine Datei geholt wird.',
    dateien: [],
  },
  modern: {
    label: 'Modern und sachlich',
    beschreibung:
      'Klare, gut lesbare Schrift ohne Schnörkel. Passt zu Handwerk, Technik und allem, was nüchtern wirken soll.',
    dateien: ['/schriften/inter.woff2'],
  },
  klassisch: {
    label: 'Klassisch',
    beschreibung:
      'Überschriften mit Serifen, Fließtext ohne. Wirkt gediegen und bleibt dabei gut lesbar.',
    dateien: ['/schriften/lora.woff2', '/schriften/inter.woff2'],
  },
  freundlich: {
    label: 'Freundlich und rund',
    beschreibung:
      'Weiche, runde Formen. Passt zu Hofläden, Bäckereien, Blumen und allem, was warm wirken soll.',
    dateien: ['/schriften/nunito.woff2'],
  },
  traditionell: {
    label: 'Traditionell',
    beschreibung:
      'Durchgehend Serifenschrift, wie im Buchdruck. Passt zu alteingesessenen Betrieben und Manufakturen.',
    dateien: ['/schriften/source-serif-4.woff2'],
  },
} as const satisfies Record<string, Schriftart>;

export type SchriftartId = keyof typeof schriftarten;

export const schriftartIds = Object.keys(schriftarten) as [SchriftartId, ...SchriftartId[]];
