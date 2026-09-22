/**
 * Die Anfrageliste im Browser.
 *
 * Gespeichert wird ausschließlich im localStorage des Besuchers – kein Server,
 * keine Cookies, keine Übertragung. Wer die Seite schließt, nimmt seine Liste
 * mit; wir erfahren nie davon.
 *
 * Dieses Modul kümmert sich nur um das Speichern und Rechnen. Was angezeigt
 * wird, steht in den Seiten, die es benutzen.
 */

export type Posten = {
  /** Der Dateiname des Produkts, gleichzeitig sein Slug. */
  slug: string;
  menge: number;
  /** Der Preis zum Zeitpunkt des Hinzufügens, um Änderungen zu erkennen. */
  preisCent: number;
};

const SCHLUESSEL = 'anfrageliste';
const FASSUNG = 1;

/** Wird ausgelöst, sobald sich die Liste ändert – auch im selben Tab. */
export const EREIGNIS = 'anfrageliste:geaendert';

/**
 * localStorage kann werfen: im privaten Modus, bei gesperrten Website-Daten
 * oder wenn der Speicher voll ist. Die Seite darf daran nicht zerbrechen,
 * deshalb liegt jeder Zugriff in einem try/catch.
 */
function rohLesen(): string | null {
  try {
    return window.localStorage.getItem(SCHLUESSEL);
  } catch {
    return null;
  }
}

function rohSchreiben(wert: string): boolean {
  try {
    window.localStorage.setItem(SCHLUESSEL, wert);
    return true;
  } catch {
    return false;
  }
}

function istPosten(wert: unknown): wert is Posten {
  if (typeof wert !== 'object' || wert === null) return false;
  const p = wert as Record<string, unknown>;
  return (
    typeof p.slug === 'string' &&
    p.slug.length > 0 &&
    typeof p.menge === 'number' &&
    Number.isFinite(p.menge) &&
    p.menge > 0 &&
    typeof p.preisCent === 'number' &&
    Number.isFinite(p.preisCent)
  );
}

/**
 * Liest die Liste. Was nicht als Posten durchgeht, fliegt still raus –
 * der Inhalt des localStorage lässt sich von Hand verändern, und darauf darf
 * sich die Seite nicht verlassen.
 */
export function lesen(): Posten[] {
  const roh = rohLesen();
  if (!roh) return [];

  try {
    const daten = JSON.parse(roh);
    const posten = Array.isArray(daten) ? daten : daten?.artikel;
    if (!Array.isArray(posten)) return [];
    return posten.filter(istPosten).map((p) => ({
      slug: p.slug,
      menge: Math.min(99, Math.max(1, Math.round(p.menge))),
      preisCent: Math.round(p.preisCent),
    }));
  } catch {
    return [];
  }
}

export function schreiben(posten: Posten[]): void {
  rohSchreiben(JSON.stringify({ fassung: FASSUNG, artikel: posten }));
  window.dispatchEvent(new CustomEvent(EREIGNIS));
}

/** Legt einen Artikel auf die Liste oder erhöht seine Menge. */
export function hinzufuegen(slug: string, menge: number, preisCent: number): void {
  const posten = lesen();
  const vorhanden = posten.find((p) => p.slug === slug);

  if (vorhanden) {
    vorhanden.menge = Math.min(99, vorhanden.menge + menge);
    // Der aktuelle Preis gilt – der Besucher sieht ihn ja gerade auf der Seite.
    vorhanden.preisCent = preisCent;
  } else {
    posten.push({ slug, menge: Math.min(99, Math.max(1, menge)), preisCent });
  }

  schreiben(posten);
}

export function mengeSetzen(slug: string, menge: number): void {
  const posten = lesen();
  const eintrag = posten.find((p) => p.slug === slug);
  if (!eintrag) return;

  if (menge < 1) {
    schreiben(posten.filter((p) => p.slug !== slug));
    return;
  }

  eintrag.menge = Math.min(99, Math.round(menge));
  schreiben(posten);
}

export function entfernen(slug: string): void {
  schreiben(lesen().filter((p) => p.slug !== slug));
}

export function leeren(): void {
  schreiben([]);
}

/** Die Gesamtzahl der Artikel – für die Anzeige im Kopfbereich. */
export function anzahl(): number {
  return lesen().reduce((summe, posten) => summe + posten.menge, 0);
}

/**
 * Meldet jede Änderung der Liste – eigene und die aus anderen Tabs.
 * Gibt eine Funktion zum Abmelden zurück.
 */
export function beiAenderung(rueckruf: () => void): () => void {
  const eigenes = () => rueckruf();
  const fremdes = (ereignis: StorageEvent) => {
    if (ereignis.key === SCHLUESSEL || ereignis.key === null) rueckruf();
  };

  window.addEventListener(EREIGNIS, eigenes);
  window.addEventListener('storage', fremdes);

  return () => {
    window.removeEventListener(EREIGNIS, eigenes);
    window.removeEventListener('storage', fremdes);
  };
}

/**
 * Lässt dieser Browser die Seite überhaupt speichern?
 *
 * Im privaten Modus oder bei gesperrten Website-Daten wirft schon der
 * Schreibversuch. Die Anfrageliste funktioniert dann für die Dauer des
 * Besuchs, geht aber beim Schließen verloren – darauf muss hingewiesen werden.
 */
export function speicherVerfuegbar(): boolean {
  try {
    const probe = `${SCHLUESSEL}:probe`;
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}
