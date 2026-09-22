/**
 * Prüfungen für den Bestelltext und die Messenger-Links.
 *
 * Läuft mit `node --test tests/` nach einem Build der TypeScript-Dateien.
 * Geprüft wird alles, was sich ohne Browser prüfen lässt – vor allem die
 * Fälle, die im Beispielshop nie auftreten, etwa eine sehr lange Liste.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nachrichtBauen, messengerKnoepfe, zwischensumme, LAENGENGRENZE } from '../.test-build/nachricht.mjs';

const shop = {
  name: 'Testshop',
  zwischensummeHinweis: 'inkl. MwSt., zzgl. Versand',
  messenger: {
    telegram: { aktiv: true, benutzername: 'testshop' },
    threema: { aktiv: true, id: 'TESTID12' },
    signal: { aktiv: true, telefon: '+4915112345678' },
  },
};

const produkt = (slug, name, preisCent, einheit) => ({
  slug, name, preisCent, einheit, verfuegbar: true, link: `/produkt/${slug}/`,
});

test('Nachrichtenformat entspricht dem Briefing', () => {
  const zeilen = [
    { produkt: produkt('a', 'Produkt A', 490, '500 g'), menge: 2, preisCent: 490 },
    { produkt: produkt('b', 'Produkt B', 1200), menge: 1, preisCent: 1200 },
  ];

  assert.equal(
    nachrichtBauen(zeilen, shop, '', ''),
    [
      'Bestellanfrage – Testshop',
      '2 × Produkt A (500 g) – je 4,90 € = 9,80 €',
      '1 × Produkt B – 12,00 €',
      'Zwischensumme: 21,80 € (inkl. MwSt., zzgl. Versand)',
    ].join('\n')
  );
});

test('Name und Anmerkung nur, wenn ausgefüllt', () => {
  const zeilen = [{ produkt: produkt('a', 'A', 100), menge: 1, preisCent: 100 }];
  assert.ok(!nachrichtBauen(zeilen, shop, '   ', '  ').includes('Name:'));
  const mit = nachrichtBauen(zeilen, shop, ' Maria Berger ', ' Bitte kühl ');
  assert.ok(mit.includes('Name: Maria Berger'));
  assert.ok(mit.includes('Anmerkung: Bitte kühl'));
});

test('Zwischensumme rechnet in ganzen Cent', () => {
  // Der klassische Rundungsfehler: 0,10 + 0,20 ergäbe als Kommazahl
  // 0.30000000000000004. In Cent kann das nicht passieren.
  const zeilen = [
    { produkt: produkt('a', 'A', 10), menge: 1, preisCent: 10 },
    { produkt: produkt('b', 'B', 20), menge: 1, preisCent: 20 },
  ];
  assert.equal(zwischensumme(zeilen), 30);
});

test('Kurzer Text hängt am Telegram- und Threema-Link', () => {
  const knoepfe = messengerKnoepfe(shop, 'Kurze Bestellung');
  assert.equal(knoepfe.length, 3);
  assert.ok(knoepfe[0].href.startsWith('https://t.me/testshop?text='));
  assert.equal(knoepfe[0].mitText, true);
  assert.ok(knoepfe[1].href.startsWith('https://threema.id/TESTID12?text='));
  assert.equal(knoepfe[1].mitText, true);
});

test('Signal bekommt nie einen Text und behält das Pluszeichen', () => {
  const [, , signal] = messengerKnoepfe(shop, 'Kurze Bestellung');
  assert.equal(signal.href, 'https://signal.me/#p/+4915112345678');
  assert.equal(signal.mitText, false);
  assert.ok(!signal.href.includes('%2B'));
});

test('Zu langer Text wird nicht an den Link gehängt', () => {
  // Knapp über die Grenze: Ein Zeichen, das kodiert drei Zeichen ergibt.
  const langerText = 'ü'.repeat(Math.ceil(LAENGENGRENZE / 3) + 10);
  assert.ok(encodeURIComponent(langerText).length > LAENGENGRENZE);

  const knoepfe = messengerKnoepfe(shop, langerText);
  assert.equal(knoepfe[0].href, 'https://t.me/testshop');
  assert.equal(knoepfe[0].mitText, false);
  assert.equal(knoepfe[1].href, 'https://threema.id/TESTID12');
  assert.equal(knoepfe[1].mitText, false);
});

test('Genau an der Grenze wird der Text noch mitgegeben', () => {
  const genau = 'a'.repeat(LAENGENGRENZE);
  assert.equal(encodeURIComponent(genau).length, LAENGENGRENZE);
  assert.equal(messengerKnoepfe(shop, genau)[0].mitText, true);
});

test('Abgeschaltete Messenger erscheinen nicht', () => {
  const nurSignal = { ...shop, messenger: { ...shop.messenger, telegram: { aktiv: false }, threema: { aktiv: false } } };
  const knoepfe = messengerKnoepfe(nurSignal, 'Test');
  assert.equal(knoepfe.length, 1);
  assert.equal(knoepfe[0].dienst, 'signal');
});

test('Aktivierter Messenger ohne Kennung erscheint nicht', () => {
  const ohneKennung = { ...shop, messenger: { ...shop.messenger, telegram: { aktiv: true } } };
  assert.ok(!messengerKnoepfe(ohneKennung, 'Test').some((k) => k.dienst === 'telegram'));
});
