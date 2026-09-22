/**
 * Sammelstelle für Hinweise, die beim Build auffallen.
 *
 * Grundsatz der Vorlage: Der Build bricht niemals wegen eines Inhaltsfehlers
 * ab. Stattdessen wird der betroffene Inhalt ausgeblendet und hier gemeldet.
 * Die Meldungen erscheinen im Build-Log des Hosters, wo wir sie nach einer
 * Kundenaenderung nachlesen koennen.
 */

const bereitsGemeldet = new Set<string>();

/**
 * Meldet einen Hinweis genau einmal pro Build.
 *
 * Astro baut Seiten teils mehrfach an (Entwicklungsmodus, Prerendering).
 * Ohne diese Sperre stünde dieselbe Meldung dutzendfach im Log und ginge
 * zwischen dem Rauschen unter.
 */
export function warnen(bereich: string, meldung: string): void {
  const schluessel = `${bereich}::${meldung}`;
  if (bereitsGemeldet.has(schluessel)) return;
  bereitsGemeldet.add(schluessel);
  console.warn(`[Shop-Inhalte] ${bereich}: ${meldung}`);
}
