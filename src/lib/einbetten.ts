/**
 * Bettet Daten als JSON in die Seite ein, damit das Skript im Browser sie
 * lesen kann, ohne dafür eine weitere Datei zu laden.
 *
 * Das Ersetzen von „<“ ist Pflicht: Stünde irgendwo in den Daten die
 * Zeichenfolge </script>, würde der Browser das Skript an dieser Stelle für
 * beendet halten und den Rest als Seiteninhalt lesen.
 */
export function alsJson(wert: unknown): string {
  return JSON.stringify(wert).replace(/</g, '\\u003c');
}
