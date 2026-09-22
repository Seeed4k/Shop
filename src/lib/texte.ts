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
    preisGeaendert: 'Der Preis dieses Artikels hat sich geändert.',
    produktEntfallen: 'Ein Artikel ist nicht mehr im Angebot und wurde von der Liste entfernt.',
  },

  messenger: {
    ueberschrift: 'Bestellung per Messenger senden',
    telegram: 'Über Telegram senden',
    threema: 'Über Threema senden',
    signal: 'Über Signal senden',
    kopieren: 'Bestelltext kopieren',
    kopiert: 'Bestellung kopiert. Im Chat einfach einfügen und senden.',
    kopierenFehlgeschlagen:
      'Das Kopieren hat nicht geklappt. Bitte markieren Sie den Text unten und kopieren Sie ihn von Hand.',
    keinerAktiv: 'Zurzeit ist kein Messenger hinterlegt. Bitte nehmen Sie über die Kontaktdaten Kontakt auf.',
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
