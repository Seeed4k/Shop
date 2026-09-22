/**
 * Prüfungen für die Sperre des Admin-Panels im Live-Betrieb.
 * Sicherheitsrelevant: Hier darf sich nichts unbemerkt ändern.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { panelGesperrt } from '../.test-build/panel-sperre.mjs';

test('Live ohne Cloud-Kennung: Panel und Schnittstelle gesperrt', () => {
  for (const pfad of ['/keystatic', '/keystatic/', '/keystatic/collection/produkte', '/api/keystatic/update', '/api/keystatic/tree']) {
    assert.equal(panelGesperrt(pfad, true, undefined), true, pfad);
    assert.equal(panelGesperrt(pfad, true, ''), true, pfad);
    assert.equal(panelGesperrt(pfad, true, '   '), true, pfad);
  }
});

test('Live mit Cloud-Kennung: Panel erreichbar, Keystatic Cloud übernimmt die Anmeldung', () => {
  assert.equal(panelGesperrt('/keystatic', true, 'team/projekt'), false);
  assert.equal(panelGesperrt('/api/keystatic/update', true, 'team/projekt'), false);
});

test('Auf dem eigenen Rechner: Panel immer erreichbar', () => {
  assert.equal(panelGesperrt('/keystatic', false, undefined), false);
  assert.equal(panelGesperrt('/api/keystatic/update', false, undefined), false);
});

test('Shop-Seiten sind nie betroffen', () => {
  for (const pfad of ['/', '/produkt/bauernbrot/', '/anfrageliste/', '/keystatic-fan-seite/', '/api/andere']) {
    assert.equal(panelGesperrt(pfad, true, undefined), false, pfad);
  }
});
