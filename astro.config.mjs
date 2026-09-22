// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import netlify from '@astrojs/netlify';
import einstellungen from './src/content/einstellungen.json' with { type: 'json' };

// Die Adresse der Website kommt aus den Einstellungen, damit der Kunde sie im
// Panel pflegen kann. Sie wird für sitemap.xml und Open-Graph-Daten gebraucht.
// Fehlt sie, bricht der Build nicht ab - es gibt nur absolute URLs weniger.
const website = einstellungen?.shop?.website?.trim();

export default defineConfig({
  site: website || undefined,

  /*
   * Die Shop-Seiten werden vorgebaut und liegen als fertige Dateien aus -
   * daran ändert sich nichts. Nur das Admin-Panel unter /keystatic braucht
   * eine Route, die beim Aufruf läuft: Es liest und schreibt Dateien im
   * Repository, und das geht nicht in einer vorgebauten Seite.
   *
   * Es bleibt trotzdem bei "keine Datenbank, keine Server-Logik". Es ist eine
   * Funktion beim Hoster, die nichts tut, solange niemand das Panel öffnet.
   */
  output: 'static',
  /*
   * imageCDN: false ist wichtig.
   *
   * Sonst leitet der Adapter alle Bilder über Netlifys Bilddienst
   * (/.netlify/images?...). Sie würden dann bei jedem Aufruf umgerechnet
   * statt einmal beim Build, und die Adressen funktionierten nur bei Netlify -
   * ein Hosterwechsel bräche sämtliche Bilder. So entstehen fertige Dateien
   * in modernen Formaten, die überall liegen können.
   */
  adapter: netlify({ imageCDN: false }),

  /*
   * React wird ausschließlich vom Keystatic-Panel gebraucht. Auf den
   * Shop-Seiten kommt kein React-Code an - dort steht keine einzige
   * React-Komponente.
   */
  integrations: [react(), keystatic()],

  image: {
    // Große Handyfotos aus dem Panel dürfen die Seite nicht verlangsamen.
    responsiveStyles: true,
    layout: 'constrained',
  },

  build: {
    // Saubere URLs ohne .html-Endung
    format: 'directory',
  },
});
