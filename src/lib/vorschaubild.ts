import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

/**
 * Macht aus einem Bild eine vollständige Adresse für das Vorschaubild beim
 * Teilen (Open Graph).
 *
 * Messenger und soziale Netzwerke laden dieses Bild von außen. Sie können
 * deshalb nichts mit einer relativen Adresse anfangen, und sie mögen keine
 * riesigen Dateien – hier wird auf 1200 × 630 zugeschnitten, das übliche Maß.
 *
 * Ohne hinterlegte Adresse der Website in den Einstellungen gibt es kein
 * Vorschaubild. Darauf weist der Build bereits hin.
 */
export async function vorschaubildErzeugen(
  bild: ImageMetadata | undefined,
  seite: URL | undefined
): Promise<string | undefined> {
  if (!bild || !seite) return undefined;

  const erzeugt = await getImage({
    src: bild,
    width: 1200,
    height: 630,
    fit: 'cover',
    format: 'jpg',
  });

  return new URL(erzeugt.src, seite).href;
}
