import { test } from 'vitest';
import assert from 'node:assert/strict';

import { formatDigital } from './digital.js';
import { handAngles } from './analog.js';
import { toBinaryColumns } from './binary.js';
import { toWords } from './words.js';

const at = (hours, minutes, seconds = 0) => new Date(2026, 0, 1, hours, minutes, seconds);

test('digital pads every part to two digits', () => {
  assert.equal(formatDigital(at(9, 5, 7)), '09:05:07');
  assert.equal(formatDigital(at(23, 59, 59)), '23:59:59');
});

test('analog hands point the right way', () => {
  assert.deepEqual(handAngles(at(0, 0, 0)), { hour: 0, minute: 0, second: 0 });
  assert.deepEqual(handAngles(at(15, 0, 0)), { hour: 90, minute: 0, second: 0 });
  assert.equal(handAngles(at(6, 30)).hour, 195); // halfway between 6 and 7
  assert.equal(handAngles(at(0, 0, 30)).second, 180);
});

test('binary splits each digit into 4 bits', () => {
  const columns = toBinaryColumns(at(12, 34, 59));
  assert.equal(columns.length, 6);
  assert.deepEqual(columns[0], [false, false, false, true]); // 1
  assert.deepEqual(columns[5], [true, false, false, true]); // 9
});

test('words speak Czech, count quarters towards the next hour and wrap at twelve', () => {
  assert.equal(toWords(at(3, 0)), 'tři hodiny');
  assert.equal(toWords(at(13, 0)), 'jedna hodina');
  assert.equal(toWords(at(7, 0)), 'sedm hodin');
  assert.equal(toWords(at(3, 14)), 'čtvrt na čtyři');
  assert.equal(toWords(at(3, 30)), 'půl čtvrté');
  assert.equal(toWords(at(7, 30)), 'půl osmé');
  assert.equal(toWords(at(3, 45)), 'tři čtvrtě na čtyři');
  assert.equal(toWords(at(12, 15)), 'čtvrt na jednu');
  assert.equal(toWords(at(12, 30)), 'půl jedné');
  assert.equal(toWords(at(3, 5)), 'pět minut po třetí');
  assert.equal(toWords(at(3, 25)), 'za pět minut půl čtvrté');
  assert.equal(toWords(at(12, 55)), 'za pět minut jedna');
  assert.equal(toWords(at(11, 58)), 'dvanáct hodin');
  assert.equal(toWords(at(23, 58)), 'dvanáct hodin');
});
