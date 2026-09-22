import { defineCollection } from 'astro:content';
import * as z from 'zod';
import { glob } from 'astro/loaders';
import { freiwillig } from './lib/zod-hilfen';

/**
 * Datenmodell der Shop-Vorlage.
 *
 * Wichtig für das Zusammenspiel mit dem CMS (Keystatic):
 * Die Dateinamen sind gleichzeitig die Slugs. Keystatic erzeugt sie aus dem
 * Namen, deshalb gibt es kein eigenes "slug"-Feld in den Dateien.
 *
 * Ebenso wichtig: Das Feld "kategorie" eines Produkts ist bewusst ein einfacher
 * Text und KEIN reference() von Astro. Ein reference() würde den Build
 * abbrechen lassen, sobald der Kunde eine Kategorie löscht, auf die noch ein
 * Produkt verweist. Laut Briefing darf genau das nicht passieren. Die
 * Auflösung und die Warnung übernimmt src/lib/inhalte.ts.
 */

/**
 * Pfad, unter dem Keystatic hochgeladene Bilder ablegt.
 *
 * Darunter legt es je Bereich einen Ordner an, bei Sammlungen zusätzlich einen
 * je Eintrag – etwa /src/bilder/produkte/bauernbrot/bild.jpg. Geprüft wird
 * deshalb nur der Anfang.
 */
export const BILDER_ORDNER = '/src/bilder/';

const bildPfad = z
  .string()
  .refine((wert) => wert.startsWith(BILDER_ORDNER), {
    message: `Der Bildpfad muss mit "${BILDER_ORDNER}" beginnen. Bilder werden über das Panel hochgeladen, dann stimmt der Pfad automatisch.`,
  });

const kategorien = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/kategorien' }),
  schema: z.object({
    name: z.string().min(1, 'Die Kategorie braucht einen Namen.'),
    beschreibung: freiwillig(z.string()),
    bild: freiwillig(bildPfad),
    bildAlt: freiwillig(z.string()).describe('Alternativtext des Kategoriebildes für Screenreader'),
    reihenfolge: freiwillig(z.number().int()),
    sichtbar: z.boolean().default(true),
  }),
});

const produkte = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/produkte' }),
  schema: z.object({
    name: z.string().min(1, 'Das Produkt braucht einen Namen.'),

    // Slug der Kategorie, also deren Dateiname. Siehe Hinweis oben:
    // absichtlich kein reference().
    kategorie: z.string().min(1, 'Das Produkt braucht eine Kategorie.'),

    // Preise werden als ganze Cent gespeichert. Das vermeidet Rundungsfehler
    // beim Aufsummieren der Anfrageliste. Im Panel heisst das Feld
    // "Preis in Cent" mit einem Beispiel im Hilfetext (4,90 EUR = 490).
    preisCent: z
      .number({ error: 'Der Preis muss eine ganze Zahl in Cent sein, zum Beispiel 490 für 4,90 €.' })
      .int('Der Preis muss eine ganze Zahl in Cent sein, zum Beispiel 490 für 4,90 €.')
      .min(0, 'Der Preis darf nicht negativ sein.'),

    einheit: freiwillig(z.string()).describe('z. B. „Stück“ oder „500 g“'),

    // Pflicht bei Waren nach Gewicht oder Volumen. Das kann nur ein Mensch
    // entscheiden, deshalb wird es nicht erzwungen, sondern beim Build
    // angemahnt, wenn die Einheit nach einer Mengenangabe aussieht.
    grundpreis: freiwillig(z.string()).describe('z. B. „3,98 € / kg“'),

    kurzbeschreibung: z
      .string()
      .min(1, 'Die Kurzbeschreibung erscheint auf den Übersichtskarten und ist Pflicht.'),

    bilder: z
      .array(
        z.object({
          bild: bildPfad,
          alt: z
            .string()
            .min(1, 'Jedes Bild braucht einen Alternativtext, damit die Seite barrierefrei bleibt.'),
        })
      )
      .min(1, 'Das Produkt braucht mindestens ein Bild. Das erste Bild ist das Hauptbild.'),

    verfuegbar: z.boolean().default(true),
    hervorgehoben: z.boolean().default(false),
    reihenfolge: freiwillig(z.number().int()),
  }),
});

const rechtstexte = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/rechtstexte' }),
  schema: z.object({
    titel: z.string().min(1, 'Der Rechtstext braucht eine Überschrift.'),
  }),
});

export const collections = { kategorien, produkte, rechtstexte };
