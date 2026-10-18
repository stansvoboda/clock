import { test } from 'vitest';
import assert from 'node:assert/strict';

import { gearPath, meshAngle, meshCentre, pitchRadius, steps } from './gear.js';

// Gear outline as points in the drawing, turned by `angle` and moved to x y.
function outline(m, z, x, y, angle) {
  const a = (angle * Math.PI) / 180;
  return gearPath(m, z).slice(1, -1).split('L').map((p) => {
    const [px, py] = p.split(' ').map(Number);
    return [x + px * Math.cos(a) - py * Math.sin(a), y + px * Math.sin(a) + py * Math.cos(a)];
  });
}

function inside([x, y], polygon) {
  let hit = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

test('meshing gears sit one pitch radius sum apart', () => {
  const [x, y] = meshCentre(0, 0, 2, 40, 8, 0);
  assert.equal(x, pitchRadius(2, 40) + pitchRadius(2, 8));
  assert.ok(Math.abs(y) < 1e-9);
});

test('meshed teeth touch but never overlap through a whole turn', () => {
  const m = 2.4;
  for (const [z1, z2, dir] of [[40, 8, 30], [30, 30, 0], [12, 7, 140]]) {
    const [x2, y2] = meshCentre(0, 0, m, z1, z2, dir);
    for (let a1 = 0; a1 < 360 / z1 * 3; a1 += 0.5) {
      const g1 = outline(m, z1, 0, 0, a1);
      const g2 = outline(m, z2, x2, y2, meshAngle(a1, z1, z2, dir));
      assert.ok(!g2.some((p) => inside(p, g1)), `${z1}/${z2} overlap at ${a1}°`);
      const gap = Math.min(...g2.map((p) => Math.min(...g1.map((q) => distance(p, q)))));
      assert.ok(gap < m * 0.9, `${z1}/${z2} drift apart at ${a1}°: ${gap}`);
    }
  }
});

test('the escapement steps once per beat and rests in between', () => {
  assert.equal(steps(0.5), 0);
  assert.equal(steps(1), 0.5);
  assert.equal(steps(1.5), 1);
  assert.equal(steps(3.4), 3);
});
