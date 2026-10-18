import { test } from 'vitest';
import assert from 'node:assert/strict';

import { formatDigital } from './digital.js';
import { handAngles } from './analog.js';
import { toBinaryColumns } from './binary.js';
import { toWords } from './words.js';
import { dragTo } from './dial.js';
import { moonPhase } from './moon.js';
import { altitudeCircle, onDial, sunLongitude, sunsetAngle } from './orloj.js';

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

test('dragging the minute hand snaps to 5 minutes and carries the hour across 12', () => {
  assert.equal(dragTo(180, 92), 195); // 3:00 → 3:15
  assert.equal(dragTo(235, 0), 240); // 3:55 → 4:00
  assert.equal(dragTo(240, 330), 235); // 4:00 → 3:55
  assert.equal(dragTo(0, 330), 715); // 12:00 → 11:55
  assert.equal(dragTo(715, 359), 0); // 11:55 → 12:00
});

test('dragging the hour hand snaps to whole hours and keeps the minutes', () => {
  assert.equal(dragTo(180, 120, 'hour'), 240); // 3:00 → 4:00
  assert.equal(dragTo(225, 112, 'hour'), 225); // grabbing the hand at 3:45 (112.5°) leaves it on 3:45
  assert.equal(dragTo(225, 140, 'hour'), 285); // 3:45 → 4:45
  assert.equal(dragTo(30, 5, 'hour'), 30); // 12:30 (15°) nudged back a little stays 12:30
  assert.equal(dragTo(30, 330, 'hour'), 690); // 12:30 → 11:30
  assert.equal(dragTo(690, 10, 'hour'), 30); // 11:30 → 12:30
});

test('moon phase is new at a known new moon and full half a month later', () => {
  assert.ok(moonPhase(new Date(Date.UTC(2000, 0, 6, 18, 14))) < 0.001);
  assert.ok(Math.abs(moonPhase(new Date(Date.UTC(2000, 0, 21, 4, 40))) - 0.5) < 0.02); // total lunar eclipse = full moon
  assert.ok(Math.abs(moonPhase(new Date(Date.UTC(1999, 11, 30))) - 0.74) < 0.01); // before the reference date still lands in 0–1
});

test('orloj dial puts the summer sun near the centre and the winter sun near the rim', () => {
  assert.ok(Math.abs(((sunLongitude(new Date(Date.UTC(2026, 2, 20, 14, 46))) + 180) % 360) - 180) < 0.1); // March equinox
  assert.ok(Math.abs(sunLongitude(new Date(Date.UTC(2026, 5, 21, 8, 24))) - 90) < 0.1); // June solstice
  assert.ok(Math.abs(onDial(0, 0).angle) < 1e-9 && Math.abs(onDial(0, 0).r - 66) < 1e-9);
  assert.ok(Math.abs(onDial(90, 0).r - 43.3) < 0.1 && Math.abs(onDial(90, 0).angle + 90) < 1e-9);
  assert.ok(Math.abs(onDial(270, 0).r - 100.6) < 0.2);
});

test('orloj horizon crosses the equator at six o\'clock, so the equinox sun rises at six', () => {
  const { dy, r } = altitudeCircle(0);
  assert.ok(Math.abs(Math.hypot(66, dy) - r) < 1e-9);
});

test('Prague sunset: six in the evening at the equinox, after eight solar time at midsummer', () => {
  assert.ok(Math.abs(sunsetAngle(0) - 90) < 1e-9);
  assert.ok(Math.abs(sunsetAngle(90) / 15 - 8.08) < 0.02);
});
