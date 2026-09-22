import * as z from 'zod';

/**
 * Macht ein Feld optional und verträgt dabei, was das Panel bei leeren
 * Eingaben schreibt.
 *
 * Keystatic lässt ein leeres Feld nicht einfach weg: Ein leeres Textfeld wird
 * zu "", ein leeres Bild- oder Zahlenfeld zu null. Eine gewöhnliche
 * .optional()-Prüfung fiele darüber, und der Kunde bekäme eine Warnung im
 * Build-Log, obwohl er nur ein freiwilliges Feld leer gelassen hat.
 *
 * Beides wird deshalb vorab in "nicht vorhanden" übersetzt.
 */
export function freiwillig<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess(
    (wert) => (wert === null || wert === '' ? undefined : wert),
    schema.optional()
  );
}
