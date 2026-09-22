// @ts-check
import { defineConfig } from 'astro/config';
import einstellungen from './src/content/einstellungen.json' with { type: 'json' };

// Die Adresse der Website kommt aus den Einstellungen, damit der Kunde sie im
// Panel pflegen kann. Sie wird fuer sitemap.xml und Open-Graph-Daten gebraucht.
// Falls sie fehlt, faellt der Build nicht aus - es gibt nur absolute URLs weniger.
const website = einstellungen?.shop?.website?.trim();

export default defineConfig({
  site: website || undefined,
  output: 'static',
  // Keine externen Anfragen beim Seitenaufruf: Bilder werden beim Build
  // optimiert und selbst ausgeliefert.
  image: {
    // Grosse Handyfotos aus dem Panel duerfen die Seite nicht verlangsamen.
    responsiveStyles: true,
    layout: 'constrained',
  },
  build: {
    // Saubere URLs ohne .html-Endung
    format: 'directory',
  },
});
