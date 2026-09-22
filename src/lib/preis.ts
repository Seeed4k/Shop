import type { Einstellungen } from './einstellungen';

/**
 * Preise werden durchgaengig als ganze Cent gerechnet.
 *
 * Grund: Kommazahlen summieren sich in JavaScript ungenau auf
 * (0.1 + 0.2 ergibt 0.30000000000000004). Bei einer Anfrageliste mit
 * mehreren Posten fällt das als falscher Cent in der Zwischensumme auf.
 * Mit ganzen Zahlen kann das nicht passieren.
 */

const formatierer = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Macht aus 490 die Anzeige „4,90 €“ im deutschen Format (1.234,50 €). */
export function preisFormatieren(cent: number): string {
  return formatierer.format(cent / 100);
}

/**
 * Der Hinweistext, der laut Briefing an jedem Preis stehen muss.
 * Welcher es ist, ergibt sich aus dem Umsatzsteuer-Modus in den Einstellungen.
 */
export function umsatzsteuerHinweis(einstellungen: Einstellungen): string {
  return einstellungen.preise.umsatzsteuerModus === 'kleinunternehmer'
    ? 'Kein Ausweis der Umsatzsteuer gemäß § 19 UStG'
    : 'inkl. MwSt.';
}

/** Kurzform für die Zwischensumme der Anfrageliste, z. B. "inkl. MwSt., zzgl. Versand". */
export function zwischensummeHinweis(einstellungen: Einstellungen): string {
  const steuer =
    einstellungen.preise.umsatzsteuerModus === 'kleinunternehmer'
      ? 'keine MwSt. ausgewiesen'
      : 'inkl. MwSt.';
  return `${steuer}, zzgl. Versand`;
}
