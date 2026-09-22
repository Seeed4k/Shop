import { config, collection, singleton, fields } from '@keystatic/core';
import { schriftarten } from './src/lib/schriften';
import { hintergruende } from './src/lib/hintergruende';

/**
 * Das Admin-Panel, über das der Kunde alle Inhalte pflegt.
 *
 * Drei Regeln haben diese Datei geformt:
 *
 * 1. Jede Beschriftung ist deutsch, und jedes Feld, das erklärungsbedürftig
 *    ist, hat einen Hilfetext. Die Bedienoberfläche von Keystatic selbst ist
 *    englisch („Create“, „Save“) – alles, was wir beeinflussen können, ist es
 *    nicht.
 *
 * 2. Die Dateinamen und Ordner müssen exakt dem entsprechen, was
 *    src/content.config.ts erwartet. Wer hier einen Pfad ändert, muss ihn dort
 *    mitändern, sonst findet die Website die Inhalte nicht mehr.
 *
 * 3. Auswahllisten statt Freitext, wo es geht. Der Kunde soll keine
 *    Schriftnamen kennen und keine Farbwerte raten müssen.
 */

/**
 * Wo hochgeladene Bilder landen.
 *
 * Zwei Dinge sind hier wichtig:
 *
 * 1. Die Bilder liegen unter src/ und nicht in public/. Nur so kann Astro
 *    verkleinerte Varianten in modernen Formaten daraus erzeugen. Läge ein
 *    Bild in public/, würde es unverändert ausgeliefert – und ein großes
 *    Handyfoto aus dem Panel machte die Seite langsam.
 *
 * 2. Jede Sammlung bekommt einen eigenen Ordner. Der Grund ist Keystatics
 *    Ablage: Bei Sammlungen schiebt es den Namen des Eintrags in den Pfad
 *    (bilder/produkte/bauernbrot/…), bei Einstellungen nicht. Ohne getrennte
 *    Ordner lägen Produktordner und einzelne Shopbilder wild durcheinander.
 */
const bildFeld = (bereich: string) => (label: string, beschreibung: string, pflicht = false) =>
  fields.image({
    label,
    description: beschreibung,
    directory: `src/bilder/${bereich}`,
    publicPath: `/src/bilder/${bereich}/`,
    validation: { isRequired: pflicht },
  });

const produktBild = bildFeld('produkte');
const kategorieBild = bildFeld('kategorien');
const shopBild = bildFeld('shop');

/** Aus den Schrift- und Hintergrunddefinitionen werden die Auswahllisten erzeugt. */
/**
 * Erzeugt die Auswahlliste aus den Schrift- bzw. Hintergrunddefinitionen.
 *
 * Eine Quelle für beides: Wer in src/lib/schriften.ts eine Schrift ergänzt,
 * muss hier nichts nachtragen.
 */
const auswahlAus = <T extends Record<string, { label: string; beschreibung: string }>>(eintraege: T) =>
  (Object.entries(eintraege) as [keyof T & string, { label: string; beschreibung: string }][]).map(
    ([wert, { label }]) => ({ label, value: wert })
  );

/**
 * Beschreibt eine Auswahl, ohne die schmale Spalte zu sprengen.
 *
 * Keystatic setzt den Hilfetext unter das Feld – bei einer Auswahlliste ist
 * diese Spalte schmal. Alle Optionsbeschreibungen dort hineinzuschreiben
 * ergäbe eine unlesbare Wortschlange, deshalb nur ein Satz und ein Hinweis,
 * dass die Wirkung sofort auf der Website zu sehen ist.
 */

export default config({
  /**
   * Zum Entwickeln werden die Dateien lokal geschrieben. Für den Kunden läuft
   * das Panel über Keystatic Cloud – dort meldet er sich mit seiner
   * E-Mail-Adresse an und braucht kein GitHub-Konto.
   *
   * Die Projektkennung kommt aus der Umgebungsvariablen
   * PUBLIC_KEYSTATIC_CLOUD_PROJECT und wird beim Hoster gesetzt. Ist sie nicht
   * gesetzt, bleibt es beim lokalen Modus.
   */
  storage: import.meta.env.PUBLIC_KEYSTATIC_CLOUD_PROJECT ? { kind: 'cloud' } : { kind: 'local' },
  cloud: import.meta.env.PUBLIC_KEYSTATIC_CLOUD_PROJECT
    ? { project: import.meta.env.PUBLIC_KEYSTATIC_CLOUD_PROJECT }
    : undefined,

  ui: {
    brand: { name: 'Shop-Verwaltung' },
    navigation: {
      Angebot: ['produkte', 'kategorien'],
      Shop: ['einstellungen'],
      Rechtstexte: ['impressum', 'datenschutz', 'widerruf', 'agb', 'versandZahlung'],
    },
  },

  collections: {
    // ------------------------------------------------------------- Produkte
    produkte: collection({
      label: 'Produkte',
      // Ohne Schrägstrich am Ende: eine Datei je Produkt, kein Unterordner.
      path: 'src/content/produkte/*',
      // Die Beschreibung landet als Fließtext unter den Angaben in derselben
      // Datei. extension: 'md' sorgt dafür, dass es eine gewöhnliche
      // Markdown-Datei wird, die Astro ohne Zusatzpaket lesen kann.
      format: { contentField: 'beschreibung' },
      slugField: 'name',
      columns: ['name', 'kategorie'],
      entryLayout: 'form',
      schema: {
        name: fields.slug({
          name: {
            label: 'Name',
            description: 'So erscheint das Produkt auf der Website.',
            validation: { isRequired: true, length: { min: 1, max: 120 } },
          },
          slug: {
            label: 'Adresse der Produktseite',
            description:
              'Wird automatisch aus dem Namen gebildet. Nur ändern, wenn es einen Grund gibt – ein geänderter Wert macht alte Links ungültig.',
          },
        }),

        kategorie: fields.relationship({
          label: 'Kategorie',
          description:
            'In welcher Kategorie steht das Produkt? Wird die Kategorie später gelöscht, verschwindet das Produkt von der Website.',
          collection: 'kategorien',
          validation: { isRequired: true },
        }),

        preisCent: fields.integer({
          label: 'Preis in Cent',
          // Kurz halten: Das Zahlenfeld ist schmal, und der Hilfetext wird
          // darunter in derselben schmalen Spalte umbrochen.
          description: 'Ohne Komma: 4,90 € sind 490.',
          validation: { isRequired: true, min: 0, max: 10_000_000 },
        }),

        einheit: fields.text({
          label: 'Einheit',
          description: 'Worauf sich der Preis bezieht, zum Beispiel „Stück“, „500 g“ oder „1 kg Laib“. Freiwillig.',
        }),

        grundpreis: fields.text({
          label: 'Grundpreis',
          description:
            'Zum Beispiel „3,98 € / kg“. Bei Waren nach Gewicht oder Volumen ist der Grundpreis gesetzlich vorgeschrieben. Fehlt er dort, erscheint beim Veröffentlichen eine Warnung.',
        }),

        kurzbeschreibung: fields.text({
          label: 'Kurzbeschreibung',
          description: 'Ein bis zwei Sätze. Erscheint auf den Übersichtskarten.',
          multiline: true,
          validation: { isRequired: true, length: { min: 1, max: 300 } },
        }),

        bilder: fields.array(
          fields.object({
            bild: produktBild('Bild', 'Möglichst quer und mindestens 1200 Pixel breit.', true),
            alt: fields.text({
              label: 'Bildbeschreibung',
              description:
                'Was ist auf dem Bild zu sehen? Blinde Besucher bekommen diesen Text vorgelesen, und er erscheint, wenn das Bild nicht lädt.',
              validation: { isRequired: true, length: { min: 1, max: 200 } },
            }),
          }),
          {
            label: 'Bilder',
            description: 'Mindestens ein Bild. Das erste ist das Hauptbild – mit dem Griff links lässt sich die Reihenfolge ändern.',
            itemLabel: (props) => props.fields.alt.value || 'Bild',
            validation: { length: { min: 1 } },
          }
        ),

        verfuegbar: fields.checkbox({
          label: 'Verfügbar',
          description:
            'Abgehakt heißt bestellbar. Ohne Haken bleibt das Produkt sichtbar, wird aber als „zurzeit nicht verfügbar“ gekennzeichnet und kann nicht auf die Anfrageliste.',
          defaultValue: true,
        }),

        hervorgehoben: fields.checkbox({
          label: 'Auf der Startseite zeigen',
          description: 'Hervorgehobene Produkte erscheinen oben auf der Startseite unter „Empfehlungen“.',
          defaultValue: false,
        }),

        reihenfolge: fields.integer({
          label: 'Reihenfolge',
          description:
            'Kleinere Zahlen stehen weiter vorn, innerhalb der Kategorie. Leer lassen heißt: hinten, alphabetisch einsortiert.',
        }),

        beschreibung: fields.markdoc({
          label: 'Beschreibung',
          description: 'Der ausführliche Text auf der Produktseite. Freiwillig.',
          extension: 'md',
        }),
      },
    }),

    // ----------------------------------------------------------- Kategorien
    kategorien: collection({
      label: 'Kategorien',
      path: 'src/content/kategorien/*',
      format: { data: 'json' },
      slugField: 'name',
      columns: ['name'],
      entryLayout: 'form',
      schema: {
        name: fields.slug({
          name: {
            label: 'Name',
            description: 'Erscheint in der Navigation und als Überschrift der Kategorieseite.',
            validation: { isRequired: true, length: { min: 1, max: 80 } },
          },
          slug: {
            label: 'Adresse der Kategorieseite',
            description: 'Wird automatisch aus dem Namen gebildet.',
          },
        }),

        beschreibung: fields.text({
          label: 'Einleitung',
          description: 'Ein bis zwei Sätze über der Produktliste. Freiwillig.',
          multiline: true,
          validation: { length: { max: 400 } },
        }),

        bild: kategorieBild('Kategoriebild', 'Erscheint auf der Startseite und über der Produktliste. Freiwillig.'),

        bildAlt: fields.text({
          label: 'Bildbeschreibung',
          description: 'Was ist auf dem Bild zu sehen? Nur nötig, wenn ein Bild hinterlegt ist.',
          validation: { length: { max: 200 } },
        }),

        reihenfolge: fields.integer({
          label: 'Reihenfolge',
          description: 'Kleinere Zahlen stehen in der Navigation weiter vorn. Leer lassen heißt: hinten, alphabetisch.',
        }),

        sichtbar: fields.checkbox({
          label: 'Sichtbar',
          description:
            'Ohne Haken verschwindet die Kategorie von der Website – mitsamt allen Produkten, die darin stehen.',
          defaultValue: true,
        }),
      },
    }),
  },

  singletons: {
    // -------------------------------------------------------- Einstellungen
    einstellungen: singleton({
      label: 'Einstellungen',
      path: 'src/content/einstellungen',
      format: { data: 'json' },
      entryLayout: 'form',
      schema: {
        shop: fields.object(
          {
            name: fields.text({
              label: 'Name des Shops',
              validation: { isRequired: true, length: { min: 1, max: 80 } },
            }),
            website: fields.text({
              label: 'Adresse der Website',
              description:
                'Vollständig mit https://, zum Beispiel https://mein-hofladen.de. Wird für die Seitenübersicht bei Suchmaschinen und für das Vorschaubild beim Teilen gebraucht.',
            }),
            logo: shopBild('Logo', 'Quadratisch, mindestens 256 Pixel. Erscheint oben links.'),
            favicon: shopBild('Symbol für den Browser-Tab', 'Quadratisch. Wird sehr klein angezeigt – am besten nur das Zeichen, ohne Schrift.'),
            primaerfarbe: fields.text({
              label: 'Primärfarbe',
              description:
                'Als Hex-Wert mit Rautezeichen, zum Beispiel #7a4b2a. Bestimmt Kopfbereich, Links und Preise. Die Schriftfarbe darauf wird automatisch hell oder dunkel gewählt.',
              defaultValue: '#7a4b2a',
              validation: { isRequired: true, pattern: { regex: /^#[0-9a-fA-F]{6}$/, message: 'Sechsstelliger Hex-Wert mit Rautezeichen, zum Beispiel #7a4b2a.' } },
            }),
            akzentfarbe: fields.text({
              label: 'Akzentfarbe',
              description: 'Als Hex-Wert, zum Beispiel #3f7d4f. Für Hinweise und Hervorhebungen.',
              defaultValue: '#3f7d4f',
              validation: { isRequired: true, pattern: { regex: /^#[0-9a-fA-F]{6}$/, message: 'Sechsstelliger Hex-Wert mit Rautezeichen, zum Beispiel #3f7d4f.' } },
            }),
            schrift: fields.select({
              label: 'Schriftart',
              description: 'Gilt für die ganze Website. „Systemschrift“ lädt am schnellsten.',
              options: auswahlAus(schriftarten),
              defaultValue: 'system',
            }),
            hintergrund: fields.select({
              label: 'Hintergrund',
              description: 'Bei „Eigenes Bild“ das Bild im Feld darunter hochladen.',
              options: auswahlAus(hintergruende),
              defaultValue: 'schlicht',
            }),
            hintergrundBild: shopBild(
              'Eigenes Hintergrundbild',
              'Nur nötig bei „Eigenes Bild“. Quer, mindestens 1600 Pixel breit. Bitte nur Bilder, an denen Sie die Rechte haben – fremde Grafiken und Logos können eine Abmahnung nach sich ziehen.'
            ),
            startseiteUeberschrift: fields.text({
              label: 'Überschrift der Startseite',
              description: 'Der erste Satz, den Besucher lesen. Leer lassen heißt: der Name des Shops.',
            }),
            startseiteText: fields.text({
              label: 'Text der Startseite',
              description: 'Zwei bis vier Sätze darüber, was es bei Ihnen gibt.',
              multiline: true,
              validation: { length: { max: 600 } },
            }),
            startseiteBild: shopBild('Bild der Startseite', 'Quer, mindestens 1600 Pixel breit.'),
            startseiteBildAlt: fields.text({
              label: 'Bildbeschreibung',
              description: 'Was ist auf dem Bild der Startseite zu sehen?',
            }),
          },
          { label: 'Shop' }
        ),

        kontakt: fields.object(
          {
            inhaber: fields.text({ label: 'Inhaber', description: 'Name oder Firma, wie sie im Fußbereich stehen soll.' }),
            adresse: fields.text({
              label: 'Anschrift',
              description: 'Straße und Ort, jeweils in eine eigene Zeile.',
              multiline: true,
            }),
            email: fields.text({ label: 'E-Mail', description: 'Wird im Fußbereich als anklickbarer Link angezeigt.' }),
            telefon: fields.text({ label: 'Telefon', description: 'Wird im Fußbereich als anklickbarer Link angezeigt.' }),
          },
          { label: 'Kontakt' }
        ),

        messenger: fields.object(
          {
            telegram: fields.object(
              {
                aktiv: fields.checkbox({ label: 'Telegram anbieten', defaultValue: false }),
                benutzername: fields.text({
                  label: 'Telegram-Benutzername',
                  description: 'Ohne das @ davor, zum Beispiel hofladen_sonnenacker. Telegram übernimmt den Bestelltext automatisch.',
                }),
              },
              { label: 'Telegram' }
            ),
            threema: fields.object(
              {
                aktiv: fields.checkbox({ label: 'Threema anbieten', defaultValue: false }),
                id: fields.text({
                  label: 'Threema-ID',
                  description: 'Genau 8 Zeichen, Großbuchstaben und Ziffern. Threema übernimmt den Bestelltext automatisch.',
                }),
              },
              { label: 'Threema' }
            ),
            signal: fields.object(
              {
                aktiv: fields.checkbox({ label: 'Signal anbieten', defaultValue: false }),
                telefon: fields.text({
                  label: 'Signal-Telefonnummer',
                  description:
                    'International mit Pluszeichen, zum Beispiel +4915112345678. Signal kann den Bestelltext nicht übernehmen – er wird stattdessen in die Zwischenablage gelegt.',
                }),
              },
              { label: 'Signal' }
            ),
          },
          {
            label: 'Messenger',
            description: 'Nur angehakte Messenger erscheinen auf der Anfrageliste. Fehlt die Kennung, wird der Messenger stillschweigend ausgelassen.',
          }
        ),

        preise: fields.object(
          {
            umsatzsteuerModus: fields.select({
              label: 'Umsatzsteuer',
              description:
                'Bestimmt den Hinweis, der an jedem Preis steht. Im Zweifel beim Steuerberater nachfragen – das ist eine rechtliche Frage.',
              options: [
                { label: 'Preise inklusive Mehrwertsteuer', value: 'inklusive' },
                { label: 'Kleinunternehmer nach § 19 UStG – keine Mehrwertsteuer ausgewiesen', value: 'kleinunternehmer' },
              ],
              defaultValue: 'inklusive',
            }),
          },
          { label: 'Preise' }
        ),

        versand: fields.text({
          label: 'Versand und Abholung',
          description: 'Versandkosten, Lieferzeit, Abholung. Erscheint auf der Anfrageliste. Jeder Punkt in eine eigene Zeile.',
          multiline: true,
          validation: { length: { max: 1200 } },
        }),

        bestellablauf: fields.text({
          label: 'So läuft die Bestellung ab',
          description:
            'Was passiert, nachdem der Kunde die Anfrage geschickt hat? Wann wird die Bestellung verbindlich, wie wird bezahlt? Erscheint auf der Anfrageliste.',
          multiline: true,
          validation: { length: { max: 1200 } },
        }),
      },
    }),

    // --------------------------------------------------------- Rechtstexte
    ...rechtstext('impressum', 'Impressum'),
    ...rechtstext('datenschutz', 'Datenschutzerklärung'),
    ...rechtstext('widerruf', 'Widerrufsbelehrung'),
    ...rechtstext('agb', 'AGB', 'Freiwillig. Bleibt das Feld leer, verschwindet der Punkt aus dem Fußbereich.'),
    ...rechtstext('versandZahlung', 'Versand & Zahlung', undefined, 'versand-zahlung'),
  },
});

/**
 * Baut einen Rechtstext als eigenen Eintrag.
 *
 * Die fünf Rechtstexte sind absichtlich keine Felder innerhalb der
 * Einstellungen: Fünf lange Texte in einem einzigen Formular wären im Panel
 * unübersichtlich, und so ist jeder Text eine eigene Datei.
 */
function rechtstext<Schluessel extends string>(
  schluessel: Schluessel,
  titel: string,
  hinweis?: string,
  dateiname: string = schluessel
) {
  // Die Typisierung sorgt dafür, dass der Schlüssel als genauer Name erhalten
  // bleibt. Ohne sie würde daraus ein beliebiger Text, und die Navigation
  // oben könnte die Rechtstexte nicht mehr benennen.
  const eintrag = {
    [schluessel]: singleton({
      label: titel,
      path: `src/content/rechtstexte/${dateiname}`,
      format: { contentField: 'inhalt' },
      entryLayout: 'form',
      schema: {
        titel: fields.text({
          label: 'Überschrift',
          description: 'So heißt der Link im Fußbereich.',
          defaultValue: titel,
          validation: { isRequired: true },
        }),
        inhalt: fields.markdoc({
          label: 'Text',
          description:
            hinweis ??
            'Rechtssichere Texte hängen vom Betrieb ab. Lassen Sie sie von einer fachkundigen Stelle erstellen – Rechtstexte-Dienst, Kammer oder Anwalt.',
          extension: 'md',
        }),
      },
    }),
  };

  return eintrag as { [Name in Schluessel]: (typeof eintrag)[string] };
}
