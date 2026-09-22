/**
 * Die Hintergrund-Gestaltungen, unter denen der Kunde im Panel wählen kann.
 *
 * Die ersten vier sind reines CSS und leiten ihren Farbton aus der
 * Primärfarbe ab – der Kunde wählt eine Stimmung, keine zweite Farbe.
 * Die Sticker-Collage ist eine beim Build erzeugte SVG-Datei mit fester
 * Popfarben-Palette (src/lib/stickerbomb.ts). „Eigenes Bild“ zeigt ein
 * hochgeladenes Bild. Die Gestaltung steht in src/styles/global.css.
 */

export type Hintergrund = {
  label: string;
  beschreibung: string;
};

export const hintergruende = {
  schlicht: {
    label: 'Schlicht weiß',
    beschreibung: 'Weißer Hintergrund. Lässt die Produktbilder am stärksten wirken.',
  },
  papier: {
    label: 'Warmes Papier',
    beschreibung: 'Ein sehr heller Ton in Ihrer Primärfarbe, wie getöntes Papier. Wirkt weicher als Weiß.',
  },
  verlauf: {
    label: 'Sanfter Verlauf',
    beschreibung: 'Oben ein Hauch Farbe, nach unten in Weiß auslaufend. Gibt der Seite Tiefe.',
  },
  muster: {
    label: 'Feines Punktmuster',
    beschreibung: 'Ein zurückhaltendes Punktraster in Ihrer Primärfarbe. Gibt der Fläche Struktur.',
  },
  sticker: {
    label: 'Sticker-Collage',
    beschreibung:
      'Dicht überklebt in knalligen Popfarben. Auffällig – passt zu Streetwear, Plattenladen oder Skateshop, weniger zu einem ruhigen Sortiment.',
  },
  bild: {
    label: 'Eigenes Bild',
    beschreibung:
      'Ein eigenes Foto oder eine Grafik als Hintergrund. Das Bild wird im Feld „Eigenes Hintergrundbild“ hochgeladen.',
  },
} as const satisfies Record<string, Hintergrund>;

export type HintergrundId = keyof typeof hintergruende;

export const hintergrundIds = Object.keys(hintergruende) as [HintergrundId, ...HintergrundId[]];
