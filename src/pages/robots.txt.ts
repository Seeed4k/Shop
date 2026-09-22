import type { APIRoute } from 'astro';

/**
 * robots.txt.
 *
 * Das Admin-Panel wird ausgenommen – es gehört nicht in Suchergebnisse.
 * Gesperrt ist es damit nicht; dafür sorgt die Anmeldung.
 */
export const GET: APIRoute = ({ site }) => {
  const zeilen = ['User-agent: *', 'Allow: /', 'Disallow: /keystatic', 'Disallow: /api/keystatic'];

  if (site) zeilen.push('', `Sitemap: ${new URL('sitemap.xml', site).href}`);

  return new Response(zeilen.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
