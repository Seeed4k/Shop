/**
 * Der Hintergrund „Sticker-Collage“ als SVG-Datei.
 *
 * Eine dicht überklebte Fläche wie eine Heckscheibe oder ein Laternenmast:
 * knallige Popfarben, weiße Stanzränder, dicke dunkle Konturen, dunkler
 * Untergrund in den Lücken.
 *
 * Vier Entscheidungen, die man kennen sollte:
 *
 * 1. Alle Motive sind selbst gezeichnet und bewusst allgemein: Bär, Smiley,
 *    Pflaster, Würfel, Geist, Auge, Klecks, Namensschild und so weiter.
 *    Keine Marken, keine Schrift, keine bekannten Figuren. Eine Vorlage, die
 *    an Kunden übergeben wird, darf keine fremden Werke mitliefern.
 *
 * 2. Die Farben sind eine feste Popfarben-Palette und hängen NICHT an den
 *    Shopfarben. Aus einem gedeckten Braun lässt sich keine knallige Collage
 *    ableiten. Die Shopfarben bleiben im Kopfbereich, bei Knöpfen und Preisen.
 *
 * 3. Die Collage ist eine eigene Datei (/hintergrund/sticker.svg), kein Teil
 *    jeder Seite. So lädt der Browser sie einmal und nimmt sie danach aus dem
 *    Zwischenspeicher – die Seiten selbst bleiben klein.
 *
 * 4. Die Aufkleber werden per Zufall mit festem Startwert verteilt. Die
 *    Collage wirkt dadurch unregelmäßig, sieht aber bei jedem Build exakt
 *    gleich aus.
 */

const DUNKEL = '#16121f';
const WEISS = '#ffffff';

/** Die Popfarben-Palette. Jeder Aufkleber bekommt eine davon. */
const FARBEN = [
  '#ff3ea5', // Pink
  '#1ec8ff', // Himmelblau
  '#8b5cf6', // Violett
  '#ffd60a', // Gelb
  '#7ae82f', // Giftgrün
  '#ff7a1a', // Orange
  '#ff3b3b', // Rot
  '#2ee6b6', // Mint
  '#3b6cff', // Blau
];

/** Der Untergrund, der zwischen den Aufklebern durchscheint. */
const UNTERGRUND = '#1d1640';

type Motiv = {
  /**
   * Die Silhouette. Sie wird zweimal gezeichnet: einmal dick in Weiß als
   * Stanzrand, einmal in der Aufkleberfarbe mit dunkler Kontur. Die Elemente
   * tragen deshalb keine eigene Farbe – sie erben sie.
   */
  umriss: string;
  /**
   * Was auf dem Aufkleber drauf ist: Augen, Punkte, Glanzlichter. Elemente
   * ohne eigene Füllung übernehmen die Aufkleberfarbe.
   */
  details: string;
};

const x = (cx: number, cy: number, g: number, breite = 5) =>
  `<path d="M${cx - g},${cy - g} l${2 * g},${2 * g} M${cx + g},${cy - g} l${-2 * g},${2 * g}" fill="none" stroke="${DUNKEL}" stroke-width="${breite}"/>`;

const MOTIVE: Record<string, Motiv> = {
  baer: {
    umriss:
      '<circle cx="-27" cy="-24" r="14"/><circle cx="27" cy="-24" r="14"/>' +
      '<rect x="-24" y="18" width="13" height="30" rx="6.5"/><rect x="8" y="20" width="13" height="22" rx="6.5"/>' +
      '<circle cx="0" cy="2" r="35"/>',
    details:
      `<circle cx="-27" cy="-24" r="6.5" fill="${WEISS}" fill-opacity="0.4" stroke="none"/>` +
      `<circle cx="27" cy="-24" r="6.5" fill="${WEISS}" fill-opacity="0.4" stroke="none"/>` +
      x(-13, -4, 6) + x(13, -4, 6) +
      `<ellipse cx="0" cy="15" rx="14" ry="10" fill="${WEISS}" fill-opacity="0.45" stroke="none"/>` +
      `<ellipse cx="0" cy="10" rx="5.5" ry="4" fill="${DUNKEL}" stroke="none"/>`,
  },
  smiley: {
    umriss: '<circle cx="0" cy="0" r="35"/>',
    details:
      x(-12, -9, 6) + x(12, -9, 6) +
      `<path d="M-20,5 Q0,32 20,5 Z" fill="${DUNKEL}" stroke-width="3"/>` +
      `<ellipse cx="0" cy="16" rx="7" ry="5" fill="#ff3ea5" stroke="none"/>`,
  },
  pflaster: {
    umriss: '<rect x="-58" y="-21" width="116" height="42" rx="21"/>',
    details:
      `<rect x="-19" y="-15" width="38" height="30" rx="6" fill="${WEISS}" fill-opacity="0.5" stroke-width="2.5"/>` +
      [-44, -32, 32, 44]
        .flatMap((px) => [-7, 7].map((py) => `<circle cx="${px}" cy="${py}" r="2.6" fill="${DUNKEL}" stroke="none"/>`))
        .join(''),
  },
  wuerfel: {
    umriss: '<rect x="-31" y="-31" width="62" height="62" rx="13"/>',
    details: [
      [-15, -15], [15, -15], [0, 0], [-15, 15], [15, 15],
    ]
      .map(([px, py]) => `<circle cx="${px}" cy="${py}" r="6.5" fill="${WEISS}" stroke-width="2"/>`)
      .join(''),
  },
  geist: {
    umriss: '<path d="M-31,42 L-31,-6 A31,31 0 0 1 31,-6 L31,42 L20,33 L10,42 L0,33 L-10,42 L-20,33 Z"/>',
    details:
      `<ellipse cx="-11" cy="-4" rx="6.5" ry="9.5" fill="${DUNKEL}" stroke="none"/>` +
      `<ellipse cx="11" cy="-4" rx="6.5" ry="9.5" fill="${DUNKEL}" stroke="none"/>` +
      `<circle cx="-9" cy="-8" r="2.4" fill="${WEISS}" stroke="none"/><circle cx="13" cy="-8" r="2.4" fill="${WEISS}" stroke="none"/>` +
      `<ellipse cx="0" cy="13" rx="4.5" ry="5.5" fill="${DUNKEL}" stroke="none"/>`,
  },
  auge: {
    umriss: '<path d="M-46,0 Q0,-44 46,0 Q0,44 -46,0 Z"/>',
    details:
      `<path d="M-35,0 Q0,-30 35,0 Q0,30 -35,0 Z" fill="${WEISS}" stroke-width="2.5"/>` +
      `<circle cx="0" cy="0" r="15" fill="#1ec8ff" stroke-width="2.5"/>` +
      `<circle cx="0" cy="0" r="7" fill="${DUNKEL}" stroke="none"/>` +
      `<circle cx="5" cy="-5" r="3" fill="${WEISS}" stroke="none"/>`,
  },
  klecks: {
    umriss:
      '<path d="M-38,-6 C-40,-30 -14,-40 4,-34 C24,-42 44,-24 38,-4 C44,10 36,20 30,20 L30,38 A7,7 0 0 1 16,38 L16,24 L4,24 L4,48 A7,7 0 0 1 -10,48 L-10,24 L-22,22 L-22,34 A7,7 0 0 1 -36,34 L-36,14 C-44,8 -42,0 -38,-6 Z"/>',
    details: `<ellipse cx="-16" cy="-17" rx="9" ry="5" fill="${WEISS}" fill-opacity="0.55" stroke="none" transform="rotate(-20 -16 -17)"/>`,
  },
  namensschild: {
    umriss: '<rect x="-54" y="-38" width="108" height="76" rx="11"/>',
    details:
      `<rect x="-32" y="-29" width="64" height="9" rx="4.5" fill="${WEISS}" fill-opacity="0.9" stroke="none"/>` +
      `<rect x="-45" y="-11" width="90" height="40" rx="5" fill="${WEISS}" stroke-width="2.5"/>` +
      `<path d="M-34,11 q6,-13 12,0 t12,0 t12,0 t12,0 t12,0" fill="none" stroke-width="4"/>`,
  },
  stern: {
    umriss:
      '<path d="M0,-42 L11,-14 L40,-13 L17,5 L25,34 L0,17 L-25,34 L-17,5 L-40,-13 L-11,-14 Z"/>',
    details: `<path d="M-6,-20 l4,-9" fill="none" stroke="${WEISS}" stroke-width="3.5"/>`,
  },
  blitz: {
    umriss: '<path d="M12,-48 L-26,6 L-4,6 L-16,48 L26,-10 L4,-10 Z"/>',
    details: `<path d="M6,-32 L-12,-2" fill="none" stroke="${WEISS}" stroke-opacity="0.7" stroke-width="3.5"/>`,
  },
  herz: {
    umriss:
      '<path d="M0,36 C-36,13 -44,-10 -29,-25 C-17,-37 -2,-29 0,-17 C2,-29 17,-37 29,-25 C44,-10 36,13 0,36 Z"/>',
    details: `<path d="M-24,-13 q4,-11 13,-11" fill="none" stroke="${WEISS}" stroke-width="4"/>`,
  },
  flamme: {
    umriss:
      '<path d="M0,-48 C19,-25 31,-12 31,8 A31,31 0 0 1 -31,8 C-31,-10 -19,-19 -11,-33 C-8,-19 0,-15 3,-25 C5,-33 3,-41 0,-48 Z"/>',
    details: `<path d="M0,-6 C8,4 15,11 15,19 A15,15 0 0 1 -15,19 C-15,9 -7,4 0,-6 Z" fill="#ffd60a" stroke-width="2.5"/>`,
  },
  sprechblase: {
    umriss:
      '<path d="M-48,-30 h96 a12,12 0 0 1 12,12 v34 a12,12 0 0 1 -12,12 h-48 l-24,19 v-19 h-24 a12,12 0 0 1 -12,-12 v-34 a12,12 0 0 1 12,-12 z"/>',
    details: [-20, 0, 20].map((px) => `<circle cx="${px}" cy="-1" r="6.5" fill="${DUNKEL}" stroke="none"/>`).join(''),
  },
  krone: {
    umriss: '<path d="M-42,26 L-46,-22 L-21,1 L0,-33 L21,1 L46,-22 L42,26 Z"/>',
    details:
      `<circle cx="-46" cy="-25" r="5.5" fill="${WEISS}" stroke-width="2.5"/>` +
      `<circle cx="0" cy="-36" r="5.5" fill="${WEISS}" stroke-width="2.5"/>` +
      `<circle cx="46" cy="-25" r="5.5" fill="${WEISS}" stroke-width="2.5"/>` +
      `<circle cx="-20" cy="16" r="5.5" fill="#ff3ea5" stroke-width="2.5"/>` +
      `<circle cx="0" cy="16" r="5.5" fill="#1ec8ff" stroke-width="2.5"/>` +
      `<circle cx="20" cy="16" r="5.5" fill="#7ae82f" stroke-width="2.5"/>`,
  },
  donut: {
    umriss: '<circle cx="0" cy="0" r="37"/>',
    details:
      `<circle cx="0" cy="0" r="12" fill="${WEISS}" stroke-width="3"/>` +
      [
        [-22, -12, 30, '#ffffff'], [-6, -26, -20, '#ffd60a'], [14, -22, 50, '#1ec8ff'],
        [25, -2, -30, '#ffffff'], [18, 20, 20, '#7ae82f'], [-2, 26, -60, '#ffd60a'],
        [-22, 14, 70, '#1ec8ff'], [-27, 1, 0, '#ff3b3b'],
      ]
        .map(
          ([px, py, w, f]) =>
            `<rect x="-5" y="-2" width="10" height="4" rx="2" fill="${f}" stroke="none" transform="translate(${px} ${py}) rotate(${w})"/>`
        )
        .join(''),
  },
  blume: {
    umriss: [
      [0, -23], [21.9, -7.1], [13.5, 18.6], [-13.5, 18.6], [-21.9, -7.1],
    ]
      .map(([px, py]) => `<circle cx="${px}" cy="${py}" r="17"/>`)
      .join(''),
    details:
      `<circle cx="0" cy="0" r="14" fill="#ffd60a" stroke-width="3"/>` + x(-5, -2, 2.6, 2.6) + x(5, -2, 2.6, 2.6),
  },
  zielflagge: {
    umriss:
      '<rect x="-32" y="-48" width="7" height="96" rx="3.5"/>' +
      '<path d="M-25,-44 L30,-44 L30,4 L-25,4 Z"/>',
    details:
      `<circle cx="-28.5" cy="-50" r="6" fill="${WEISS}" stroke-width="2.5"/>` +
      [0, 1, 2, 3]
        .flatMap((i) =>
          [0, 1, 2].map((j) =>
            (i + j) % 2 === 0
              ? `<rect x="${-25 + i * 13.75}" y="${-44 + j * 16}" width="13.75" height="16" fill="${DUNKEL}" stroke="none"/>`
              : ''
          )
        )
        .join(''),
  },
  totenkopf: {
    umriss:
      '<path d="M-32,-4 C-32,-30 -16,-40 0,-40 C16,-40 32,-30 32,-4 C32,10 26,16 20,18 L20,30 A6,6 0 0 1 14,36 L-14,36 A6,6 0 0 1 -20,30 L-20,18 C-26,16 -32,10 -32,-4 Z"/>',
    details:
      `<ellipse cx="-12" cy="-4" rx="9" ry="10" fill="${DUNKEL}" stroke="none"/>` +
      `<ellipse cx="12" cy="-4" rx="9" ry="10" fill="${DUNKEL}" stroke="none"/>` +
      `<circle cx="-9" cy="-8" r="2.6" fill="${WEISS}" stroke="none"/><circle cx="15" cy="-8" r="2.6" fill="${WEISS}" stroke="none"/>` +
      `<path d="M0,8 L-5,16 L5,16 Z" fill="${DUNKEL}" stroke="none"/>` +
      `<path d="M-10,24 v10 M0,24 v12 M10,24 v10" fill="none" stroke-width="3"/>`,
  },
  pilz: {
    umriss: '<rect x="-15" y="-2" width="30" height="40" rx="11"/><path d="M-44,6 C-44,-36 44,-36 44,6 Z"/>',
    details:
      `<rect x="-15" y="-2" width="30" height="40" rx="11" fill="#fff4e0"/>` +
      '<path d="M-44,6 C-44,-36 44,-36 44,6 Z"/>' +
      [[-22, -8, 7], [4, -18, 6], [24, -4, 7.5], [-3, -3, 4.5]]
        .map(([px, py, r]) => `<circle cx="${px}" cy="${py}" r="${r}" fill="${WEISS}" stroke="none"/>`)
        .join(''),
  },
};

/** Zufall mit festem Startwert: unregelmäßig, aber bei jedem Build gleich. */
function zufall(startwert: number): () => number {
  let zustand = startwert;
  return () => {
    zustand = (zustand * 1664525 + 1013904223) % 4294967296;
    return zustand / 4294967296;
  };
}

/** Kantenlänge einer Kachel in Pixeln. Die Kachel wiederholt sich nahtlos. */
export const KACHEL = 960;

type Aufkleber = { motiv: string; farbe: string; x: number; y: number; drehung: number; groesse: number };

/** Mischt eine Liste wie einen Kartenstapel (Fisher-Yates). */
function mischen<T>(liste: T[], wuerfel: () => number): T[] {
  for (let i = liste.length - 1; i > 0; i--) {
    const j = Math.floor(wuerfel() * (i + 1));
    [liste[i], liste[j]] = [liste[j]!, liste[i]!];
  }
  return liste;
}

function aufkleberVerteilen(): Aufkleber[] {
  const wuerfel = zufall(2026_09_22);
  const namen = Object.keys(MOTIVE);

  /*
   * Zwei Lagen, wie bei einer echten Collage:
   * - unten 24 Aufkleber frei verstreut, die die Lücken füllen,
   * - darüber ein versetztes Raster von 8 × 8, damit die Fläche gleichmäßig
   *   bedeckt ist und keine Ecke leer bleibt.
   */
  const reihen = 8;
  const schritt = KACHEL / reihen;
  const UNTERE_LAGE = 24;
  const anzahl = UNTERE_LAGE + reihen * reihen;

  /*
   * Die Motive kommen aus einem gemischten Stapel: Jedes Motiv ist einmal
   * dran, bevor sich eines wiederholt. So tauchen alle Motive gleich oft auf,
   * und keines ballt sich in einer Spalte.
   */
  const stapel: string[] = [];
  while (stapel.length < anzahl) stapel.push(...mischen([...namen], wuerfel));

  const liste: Aufkleber[] = [];
  let vorigeFarbe = '';
  const naechsteFarbe = () => {
    // Nie zweimal dieselbe Farbe hintereinander – sonst verschwimmen
    // benachbarte Aufkleber zu einem Fleck.
    let farbe: string;
    do farbe = FARBEN[Math.floor(wuerfel() * FARBEN.length)]!;
    while (farbe === vorigeFarbe);
    vorigeFarbe = farbe;
    return farbe;
  };

  for (let i = 0; i < UNTERE_LAGE; i++) {
    liste.push({
      motiv: stapel[liste.length]!,
      farbe: naechsteFarbe(),
      x: wuerfel() * KACHEL,
      y: wuerfel() * KACHEL,
      drehung: Math.round((wuerfel() - 0.5) * 90),
      groesse: 1.1 + wuerfel() * 0.4,
    });
  }

  for (let zeile = 0; zeile < reihen; zeile++) {
    for (let spalte = 0; spalte < reihen; spalte++) {
      // Versetzte Reihen, damit kein Raster sichtbar wird.
      const versatz = zeile % 2 === 0 ? 0 : schritt / 2;
      liste.push({
        motiv: stapel[liste.length]!,
        farbe: naechsteFarbe(),
        x: spalte * schritt + versatz + (wuerfel() - 0.5) * schritt * 0.7,
        y: zeile * schritt + (wuerfel() - 0.5) * schritt * 0.7,
        drehung: Math.round((wuerfel() - 0.5) * 70),
        groesse: 1.15 + wuerfel() * 0.5,
      });
    }
  }

  // Randüberstände auf der Gegenseite wiederholen – sonst sähe man die Fugen.
  const RAND = 95;
  const alle: Aufkleber[] = [];
  for (const a of liste) {
    const dx = a.x < RAND ? [0, KACHEL] : a.x > KACHEL - RAND ? [0, -KACHEL] : [0];
    const dy = a.y < RAND ? [0, KACHEL] : a.y > KACHEL - RAND ? [0, -KACHEL] : [0];
    for (const vx of dx) for (const vy of dy) alle.push({ ...a, x: a.x + vx, y: a.y + vy });
  }
  return alle;
}

const r = (zahl: number) => Math.round(zahl * 10) / 10;

/** Erzeugt die vollständige SVG-Datei. */
export function stickerbombSvg(): string {
  const vorlagen = Object.entries(MOTIVE)
    .map(([name, m]) => `<g id="u-${name}">${m.umriss}</g><g id="d-${name}">${m.details}</g>`)
    .join('');

  const aufkleber = aufkleberVerteilen()
    .map((a) => {
      const lage = `translate(${r(a.x)} ${r(a.y)}) rotate(${a.drehung}) scale(${r(a.groesse)})`;
      // Erst der weiße Stanzrand, dann die Farbfläche mit Kontur und Details.
      // Jeder Aufkleber bringt seinen eigenen Rand mit, so überdecken spätere
      // die früheren – wie bei echten, übereinander geklebten Stickern.
      return (
        `<g transform="${lage}">` +
        `<use href="#u-${a.motiv}" class="rand"/>` +
        `<g class="flaeche" fill="${a.farbe}"><use href="#u-${a.motiv}"/><use href="#d-${a.motiv}"/></g>` +
        `</g>`
      );
    })
    .join('');

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${KACHEL}" height="${KACHEL}" viewBox="0 0 ${KACHEL} ${KACHEL}">` +
    `<style>.rand{fill:${WEISS};stroke:${WEISS};stroke-width:13;stroke-linejoin:round}` +
    `.flaeche{stroke:${DUNKEL};stroke-width:3.5;stroke-linejoin:round;stroke-linecap:round}</style>` +
    `<defs>${vorlagen}</defs>` +
    `<rect width="${KACHEL}" height="${KACHEL}" fill="${UNTERGRUND}"/>` +
    aufkleber +
    `</svg>`
  );
}
