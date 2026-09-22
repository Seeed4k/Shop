import type { ImageMetadata } from 'astro';
import { warnen } from './warnungen';

/**
 * Übersetzt einen Bildpfad aus dem CMS in ein Bild, das Astro optimieren kann.
 *
 * Warum dieser Umweg? Das Panel schreibt nur einen Pfad als Text in die
 * Inhaltsdatei, zum Beispiel „/src/bilder/bauernbrot-1.jpg“. Damit Astro daraus
 * verkleinerte Varianten in modernen Formaten erzeugen kann, braucht es aber
 * ein echtes Import-Ergebnis. import.meta.glob sammelt beim Build alle Bilder
 * aus dem Ordner ein, und hier wird der Pfad in diesem Verzeichnis nachgeschlagen.
 *
 * Nebeneffekt, der uns entgegenkommt: Bilder, die im Ordner liegen, aber von
 * keinem Inhalt verwendet werden, landen nicht in der fertigen Website.
 */
const bildDateien = import.meta.glob<{ default: ImageMetadata }>(
  '/src/bilder/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true }
);

/**
 * Sucht das Bild zu einem Pfad.
 *
 * Gibt `undefined` zurück, wenn es das Bild nicht gibt – etwa weil der Kunde es
 * im Panel gelöscht, aber noch irgendwo verlinkt hat. Die aufrufende Seite
 * blendet das Bild dann aus, statt den Build abbrechen zu lassen.
 */
export function bildFinden(pfad: string | undefined, fundstelle: string): ImageMetadata | undefined {
  if (!pfad) return undefined;

  const treffer = bildDateien[pfad];
  if (treffer) return treffer.default;

  warnen(
    'Bilder',
    `Das Bild „${pfad}“ wurde nicht gefunden (verwendet bei: ${fundstelle}). Es wird ausgelassen.`
  );
  return undefined;
}

/** Ein Produktbild samt Alternativtext, fertig zum Anzeigen. */
export type AufbereitetesBild = {
  quelle: ImageMetadata;
  alt: string;
};

/**
 * Bereitet die Bilderliste eines Produkts auf. Das erste Bild ist laut
 * Datenmodell das Hauptbild, deshalb bleibt die Reihenfolge erhalten.
 */
export function bilderAufbereiten(
  bilder: { bild: string; alt: string }[],
  fundstelle: string
): AufbereitetesBild[] {
  return bilder
    .map(({ bild, alt }) => {
      const quelle = bildFinden(bild, fundstelle);
      return quelle ? { quelle, alt } : undefined;
    })
    .filter((eintrag): eintrag is AufbereitetesBild => eintrag !== undefined);
}

/**
 * Meldet Bilder, auf die kein Inhalt mehr verweist.
 *
 * Hintergrund: Löscht der Kunde im Panel ein Produkt, verschwindet die
 * Inhaltsdatei – die hochgeladenen Bilder bleiben aber im Repository liegen.
 * Auf der Website richten sie keinen Schaden an (unbenutzte Bilder landen
 * nicht im fertigen Ergebnis), über die Jahre sammelt sich aber Ballast an.
 * Deshalb der Hinweis im Build-Log.
 */
export function verwaisteBilderMelden(benutzt: Iterable<string>): void {
  const inGebrauch = new Set(benutzt);
  const verwaist = Object.keys(bildDateien).filter((pfad) => !inGebrauch.has(pfad));

  if (verwaist.length === 0) return;

  warnen(
    'Bilder',
    `${verwaist.length} Bild(er) werden von keinem Inhalt mehr verwendet und können gelöscht werden: ${verwaist
      .slice(0, 8)
      .join(', ')}${verwaist.length > 8 ? ' …' : ''}`
  );
}
