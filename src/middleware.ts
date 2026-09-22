import type { MiddlewareHandler } from 'astro';

/**
 * Behandlung der Panel-Route /keystatic.
 *
 * Hintergrund: Die Bedienoberfläche von Keystatic lädt die Schrift Inter von
 * Google Fonts nach. Auf den Shop-Seiten passiert das nicht – dort wird gar
 * nichts von außen geholt. Im Panel aber schon, und damit ginge bei jedem
 * Öffnen die IP-Adresse des Kunden an Google. Das widerspricht dem Grundsatz
 * „keine externen Schriftarten“, und nötig ist es auch nicht: Inter liegt
 * längst unter public/schriften/ auf dem eigenen Server.
 *
 * Zwei Eingriffe beheben das:
 *
 * 1. Eine Sicherheitsrichtlinie (CSP) erlaubt Stilvorlagen nur vom eigenen
 *    Server. Der Browser holt den Google-Link dann gar nicht erst.
 * 2. Eine eigene @font-face-Regel meldet unsere Datei unter dem Namen an, den
 *    die Oberfläche erwartet. Das Panel sieht also aus wie vorgesehen.
 *
 * Der Eingriff gilt nur für /keystatic. Die Shop-Seiten sind vorgebaute
 * Dateien und laufen hier ohnehin nicht durch.
 */

/**
 * Was das Panel erreichen darf.
 *
 * Im Cloud-Modus spricht es mit Keystatic Cloud und GitHub – beides muss
 * erlaubt bleiben, sonst kann der Kunde sich nicht anmelden und nichts
 * speichern. ws: ist für den Entwicklungsserver nötig, der darüber neu lädt.
 */
const SICHERHEITSRICHTLINIE = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  // Nur vom eigenen Server: Das sperrt den Google-Fonts-Aufruf aus.
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob: https://images.keystatic.com https://avatars.githubusercontent.com",
  "connect-src 'self' ws: wss: https://api.keystatic.cloud https://api.github.com https://*.githubusercontent.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
].join('; ');

/** Meldet die selbst gehostete Datei unter dem Namen an, den das Panel erwartet. */
const EIGENE_SCHRIFT =
  `<style>@font-face{font-family:'Inter';font-style:normal;font-weight:100 900;` +
  `font-display:swap;src:url('/schriften/inter.woff2') format('woff2')}</style>`;

export const onRequest: MiddlewareHandler = async (kontext, weiter) => {
  const antwort = await weiter();

  if (!kontext.url.pathname.startsWith('/keystatic')) return antwort;

  antwort.headers.set('Content-Security-Policy', SICHERHEITSRICHTLINIE);
  antwort.headers.set('X-Robots-Tag', 'noindex, nofollow');

  // Nur die HTML-Hülle bekommt die Schriftregel, nicht die API-Antworten.
  if (!antwort.headers.get('content-type')?.includes('text/html')) return antwort;

  const html = await antwort.text();

  return new Response(html.replace('<!DOCTYPE html>', `<!DOCTYPE html>${EIGENE_SCHRIFT}`), {
    status: antwort.status,
    statusText: antwort.statusText,
    headers: antwort.headers,
  });
};
