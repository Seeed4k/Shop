/**
 * Die Hintergrund-Gestaltungen, unter denen der Kunde im Panel wählen kann.
 *
 * Alle vier sind reines CSS – kein Bild, keine zusätzliche Anfrage, kein
 * Gewicht auf der Leitung. Und alle leiten ihren Farbton aus der Primärfarbe
 * ab. Der Kunde wählt also eine Stimmung, keine zweite Farbe, und das Ergebnis
 * passt automatisch zu seinem Shop. Die Regeln dazu stehen in
 * src/styles/global.css.
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
} as const satisfies Record<string, Hintergrund>;

export type HintergrundId = keyof typeof hintergruende;

export const hintergrundIds = Object.keys(hintergruende) as [HintergrundId, ...HintergrundId[]];
