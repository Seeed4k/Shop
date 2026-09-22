/**
 * Alle sichtbaren Texte der Oberfläche an einer Stelle.
 *
 * Laut Briefing (Abschnitt 6) sollen die Oberflächentexte zentral gesammelt
 * sein. Das hat zwei Gründe: Formulierungen lassen sich ohne Suche im Code
 * ändern, und bei der rechtlichen Prüfung (Abschnitt 9) liegt alles beisammen,
 * was ein Anwalt anschauen muss.
 *
 * Nicht hier stehen Texte, die der Kunde selbst pflegt – die kommen aus den
 * Einstellungen oder aus den Inhalten.
 */
export const texte = {
  navigation: {
    zurStartseite: 'Zur Startseite',
    menueOeffnen: 'Menü öffnen',
    menueSchliessen: 'Menü schließen',
    kategorien: 'Kategorien',
    anfrageliste: 'Anfrageliste',
    anfragelisteMitAnzahl: (anzahl: number) =>
      anzahl === 1 ? '1 Artikel auf der Anfrageliste' : `${anzahl} Artikel auf der Anfrageliste`,
  },

  produkt: {
    abKategorie: 'Kategorie',
    grundpreis: 'Grundpreis',
    nichtVerfuegbar: 'Zurzeit nicht verfügbar',
    nichtBestellbar: 'Dieses Produkt ist zurzeit nicht verfügbar und kann nicht angefragt werden.',
    verfuegbar: 'Verfügbar',
    menge: 'Menge',
    zurAnfrageliste: 'Zur Anfrageliste hinzufügen',
    hinzugefuegt: 'Zur Anfrageliste hinzugefügt',
    keineBeschreibung: 'Zu diesem Produkt gibt es noch keine ausführliche Beschreibung.',
    galerie: 'Bilder des Produkts',
    bildWaehlen: (nummer: number, gesamt: number) => `Bild ${nummer} von ${gesamt} anzeigen`,
    zurueckZu: (kategorie: string) => `Zurück zu ${kategorie}`,
    weitereProdukte: (kategorie: string) => `Weitere Produkte aus ${kategorie}`,
  },

  kategorie: {
    leer: 'In dieser Kategorie sind zurzeit keine Produkte eingetragen.',
    alleAnsehen: 'Alle Produkte ansehen',
  },

  startseite: {
    hervorgehoben: 'Empfehlungen',
    kategorienUeberschrift: 'Unser Angebot',
    keineProdukte: 'Es sind noch keine Produkte eingetragen.',
  },

  anfrageliste: {
    ueberschrift: 'Anfrageliste',
    inArbeit: 'Die Anfrageliste wird gerade gebaut. Ab Phase 3 können Sie hier Artikel sammeln und per Messenger senden.',
    bestellablaufUeberschrift: 'So läuft die Bestellung ab',
    versandUeberschrift: 'Versand und Abholung',
    leer: 'Ihre Anfrageliste ist noch leer.',
    weiterStoebern: 'Zum Angebot',
    entfernen: 'Artikel entfernen',
    listeLeeren: 'Liste leeren',
    zwischensumme: 'Zwischensumme',
    name: 'Ihr Name (freiwillig)',
    anmerkung: 'Anmerkung (freiwillig)',
    // Hinweis: Die genaue Formulierung steht laut Briefing unter rechtlichem
    // Vorbehalt (Abschnitt 9). Sie ist bewusst als Anfrage formuliert.
    keinVertrag:
      'Ihre Anfrage ist noch keine verbindliche Bestellung. Verbindlich wird sie erst, wenn der Shop sie Ihnen bestätigt.',
    datenschutzHinweis:
      'Name und Anmerkung werden nur in die Nachricht übernommen. Sie werden weder gespeichert noch an uns übertragen.',
    preisGeaendert: (name: string, alt: string, neu: string) =>
      `Der Preis von „${name}“ hat sich geändert: früher ${alt}, jetzt ${neu}. Die Liste wurde aktualisiert.`,
    produktEntfallen: (name: string) =>
      `„${name}“ ist nicht mehr im Angebot und wurde von der Liste entfernt.`,
    produktVergriffen: (name: string) =>
      `„${name}“ ist zurzeit nicht verfügbar und wurde von der Liste entfernt.`,
    produktUnbekannt: 'Ein Artikel ist nicht mehr im Angebot und wurde von der Liste entfernt.',
    artikelEinzeln: 'Artikel',
    summeZeile: 'Zwischensumme',
    mengeVon: (name: string) => `Menge von ${name}`,
    entfernenVon: (name: string) => `${name} von der Liste entfernen`,
    wirklichLeeren: 'Wirklich die ganze Liste leeren?',
    speicherGesperrt:
      'Ihr Browser erlaubt dieser Seite kein Speichern. Die Anfrageliste funktioniert, geht beim Schließen des Tabs aber verloren.',
  },

  messenger: {
    ueberschrift: 'Bestellung per Messenger senden',
    telegram: 'Über Telegram senden',
    threema: 'Über Threema senden',
    signal: 'Über Signal senden',
    kopieren: 'Bestelltext kopieren',
    kopiert: 'Bestellung kopiert. Im Chat einfach einfügen und senden.',
    kopiertNurText: 'Bestelltext kopiert. Sie können ihn jetzt überall einfügen.',
    kopierenFehlgeschlagen:
      'Das Kopieren hat nicht geklappt. Bitte markieren Sie den Text unten und kopieren Sie ihn von Hand.',
    keinerAktiv: 'Zurzeit ist kein Messenger hinterlegt. Bitte nehmen Sie über die Kontaktdaten Kontakt auf.',
    // Signal kann keinen Text vorausfüllen, deshalb steht der Hinweis
    // unabhängig von der Länge der Liste an diesem Button.
    signalHinweis: 'Signal öffnet nur den Chat. Der Bestelltext liegt dann in der Zwischenablage – bitte im Chat einfügen.',
    zuLang: 'Ihre Liste ist zu lang, um sie an den Link zu hängen. Der Messenger öffnet nur den Chat, der Bestelltext liegt in der Zwischenablage – bitte im Chat einfügen.',
    vorschau: 'Bestelltext anzeigen',
    qrUeberschrift: 'Chat mit dem Handy öffnen',
    qrErklaerung:
      'Scannen Sie den Code mit der Kamera Ihres Handys – der Chat öffnet sich dort. Praktisch, wenn der Messenger nur auf dem Handy installiert ist.',
    qrNachtrag:
      'Der Bestelltext liegt in der Zwischenablage dieses Geräts. Schreiben Sie Ihre Bestellung am Handy also von Hand, oder senden Sie sie von hier aus mit den Knöpfen oben.',
    qrBeschriftung: (dienst: string, shop: string) => `QR-Code: ${dienst}-Chat mit ${shop} öffnen`,
  },

  fussbereich: {
    rechtliches: 'Rechtliches',
    kontakt: 'Kontakt',
  },

  fehlerseite: {
    titel: 'Seite nicht gefunden',
    text: 'Diese Seite gibt es nicht – vielleicht wurde sie entfernt oder die Adresse hat einen Tippfehler.',
    zurueck: 'Zur Startseite',
  },
} as const;
