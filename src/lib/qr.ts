import qrcode from 'qrcode-generator';

/**
 * Erzeugt einen QR-Code als SVG – beim Build, nicht im Browser.
 *
 * Der Code entsteht also einmal beim Veröffentlichen und liegt danach als
 * Teil der Seite vor. Es wird kein Dienst angefragt, kein Bild nachgeladen
 * und im Browser nichts gerechnet.
 *
 * Warum ein eigener SVG-Ausgeber statt createSvgTag aus der Bibliothek:
 * Diese zeichnet jedes Modul einzeln und braucht dafür rund 11 KB. Hier
 * werden waagerecht zusammenhängende Module zu einem Zug verbunden, was
 * dieselbe Grafik in etwa einem Fünftel ergibt.
 */

/**
 * Fehlerkorrektur-Stufe M verträgt rund 15 % Verlust. Das ist der übliche
 * Kompromiss: robust genug für einen Bildschirm, ohne den Code unnötig
 * dicht zu machen.
 */
const KORREKTUR = 'M';

/** Ruhezone in Modulen. Die Norm verlangt vier – darunter lesen viele Geräte schlecht. */
const RAND = 4;

export function qrAlsSvg(inhalt: string, beschriftung: string): string {
  const qr = qrcode(0, KORREKTUR);
  qr.addData(inhalt);
  qr.make();

  const anzahl = qr.getModuleCount();
  const groesse = anzahl + RAND * 2;
  const zuege: string[] = [];

  for (let zeile = 0; zeile < anzahl; zeile++) {
    let start = -1;

    for (let spalte = 0; spalte <= anzahl; spalte++) {
      const dunkel = spalte < anzahl && qr.isDark(zeile, spalte);

      if (dunkel && start === -1) {
        start = spalte;
      } else if (!dunkel && start !== -1) {
        // Eine waagerechte Reihe dunkler Module wird ein einziger Zug.
        zuege.push(`M${start + RAND},${zeile + RAND}h${spalte - start}v1h-${spalte - start}z`);
        start = -1;
      }
    }
  }

  // role="img" mit Titel: Screenreader sagen, wozu der Code da ist, statt
  // eine sinnlose Grafik anzukündigen.
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${groesse} ${groesse}"`,
    ` role="img" aria-label="${beschriftung.replace(/"/g, '&quot;')}" shape-rendering="crispEdges">`,
    `<rect width="${groesse}" height="${groesse}" fill="#ffffff"/>`,
    // Schwarz auf Weiß, bewusst nicht in den Shopfarben: Ein QR-Code wird von
    // einer Kamera gelesen, und dabei zählt Kontrast mehr als Gestaltung.
    `<path fill="#000000" d="${zuege.join('')}"/>`,
    `</svg>`,
  ].join('');
}
