/**
 * Entscheidet, ob das Admin-Panel auf der Live-Seite gesperrt wird.
 *
 * Hintergrund: Keystatic hängt /keystatic und /api/keystatic immer ein, auch
 * im lokalen Modus – und der lokale Modus kennt keine Anmeldung. Er ist für den
 * eigenen Rechner gedacht. Ginge die Seite ohne Keystatic-Cloud-Kennung online,
 * stünde dort eine Schreibschnittstelle, die jeder aus dem Internet aufrufen
 * könnte.
 *
 * Deshalb: Im Live-Betrieb ist das Panel nur erreichbar, wenn Keystatic Cloud
 * eingerichtet ist. Dann übernimmt Keystatic Cloud die Anmeldung.
 */
export function panelGesperrt(pfad: string, liveBetrieb: boolean, cloudProjekt: string | undefined): boolean {
  const istPanel = pfad === '/keystatic' || pfad.startsWith('/keystatic/') || pfad.startsWith('/api/keystatic');
  if (!istPanel) return false;
  if (!liveBetrieb) return false;
  return !cloudProjekt?.trim();
}
