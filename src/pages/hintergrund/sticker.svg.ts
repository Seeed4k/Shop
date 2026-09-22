import type { APIRoute } from 'astro';
import { stickerbombSvg } from '../../lib/stickerbomb';

/**
 * Die Sticker-Collage als eigene Datei. Sie entsteht beim Build und liegt
 * danach als gewöhnliche Datei neben den Seiten.
 */
export const GET: APIRoute = () =>
  new Response(stickerbombSvg(), {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
  });
