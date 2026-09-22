import type { APIRoute } from 'astro';
import { kategorienLaden, produkteLaden, rechtstexteLaden, kategorieLink, produktLink, rechtstextLink } from '../lib/inhalte';

/**
 * Die Seitenübersicht für Suchmaschinen.
 *
 * Bewusst selbst geschrieben statt über ein Zusatzpaket: Es sind dreißig
 * Zeilen, und die Vorlage soll nach der Übergabe möglichst wenige Teile
 * haben, die veralten können.
 *
 * Ohne hinterlegte Adresse der Website in den Einstellungen gibt es keine
 * absoluten Adressen – dann bleibt die Datei leer, statt falsche Angaben zu
 * machen. Das Fehlen der Adresse wird bereits beim Laden der Einstellungen
 * gemeldet.
 */
export const GET: APIRoute = async ({ site }) => {
  const adressen: string[] = [];

  if (site) {
    const kategorien = await kategorienLaden();
    const produkte = await produkteLaden();
    const rechtstexte = await rechtstexteLaden();

    adressen.push(
      '/',
      '/anfrageliste/',
      ...kategorien.map(kategorieLink),
      ...produkte.map(produktLink),
      ...rechtstexte.map(rechtstextLink)
    );
  }

  const eintraege = adressen
    .map((pfad) => `  <url><loc>${new URL(pfad, site).href}</loc></url>`)
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${eintraege}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  );
};
