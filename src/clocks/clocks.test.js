import { test } from 'node:test';
import assert from 'node:assert/strict';

import { formatDigital } from '../js/clocks/digital.js';
import { handAngles } from '../js/clocks/analog.js';
import { toBinaryColumns } from '../js/clocks/binary.js';
import { toWords } from '../js/clocks/words.js';

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

test('words round to five minutes and handle the hour wrap', () => {
  assert.equal(toWords(at(3, 0)), "three o'clock");
  assert.equal(toWords(at(3, 14)), 'quarter past three');
  assert.equal(toWords(at(3, 30)), 'half past three');
  assert.equal(toWords(at(3, 40)), 'twenty to four');
  assert.equal(toWords(at(11, 58)), "twelve o'clock");
  assert.equal(toWords(at(23, 58)), "twelve o'clock");
});
