/**
 * Hilfen rund um die Farben aus den Einstellungen.
 *
 * Der Kunde darf Primär- und Akzentfarbe frei wählen. Damit Schrift auf diesen
 * Farben lesbar bleibt, wird die Textfarbe nicht festgelegt, sondern aus der
 * Helligkeit der gewählten Farbe berechnet. Wer eine helle Primärfarbe einstellt,
 * bekommt dunkle Schrift darauf – ohne dass jemand eingreifen muss.
 */

type RGB = { r: number; g: number; b: number };

function hexZuRgb(hex: string): RGB {
  const sauber = hex.replace('#', '');
  return {
    r: parseInt(sauber.slice(0, 2), 16),
    g: parseInt(sauber.slice(2, 4), 16),
    b: parseInt(sauber.slice(4, 6), 16),
  };
}

/**
 * Relative Leuchtdichte nach WCAG 2.1.
 * Sie ist die Grundlage jeder Kontrastberechnung.
 */
function leuchtdichte({ r, g, b }: RGB): number {
  const kanal = (wert: number) => {
    const anteil = wert / 255;
    return anteil <= 0.03928 ? anteil / 12.92 : Math.pow((anteil + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * kanal(r) + 0.7152 * kanal(g) + 0.0722 * kanal(b);
}

/** Kontrastverhältnis zweier Farben, 1 (gleich) bis 21 (Schwarz auf Weiß). */
export function kontrast(hexA: string, hexB: string): number {
  const a = leuchtdichte(hexZuRgb(hexA));
  const b = leuchtdichte(hexZuRgb(hexB));
  const hell = Math.max(a, b);
  const dunkel = Math.min(a, b);
  return (hell + 0.05) / (dunkel + 0.05);
}

/**
 * Wählt Schwarz oder Weiß als Schriftfarbe – je nachdem, was auf der
 * Hintergrundfarbe besser lesbar ist.
 */
export function schriftAuf(hintergrund: string): '#ffffff' | '#1a1a1a' {
  return kontrast(hintergrund, '#ffffff') >= kontrast(hintergrund, '#1a1a1a') ? '#ffffff' : '#1a1a1a';
}
