// Gear geometry for the mechanism drawings. Angles are SVG degrees: 0 points right, positive turns clockwise.
// Gears that mesh share one module m (tooth size), so a gear with z teeth has pitch radius m·z/2
// and two meshing gears sit exactly r1 + r2 apart.

export const pitchRadius = (m, z) => (m * z) / 2;

const rad = (deg) => (deg * Math.PI) / 180;
const at = (r, deg) => `${(r * Math.cos(rad(deg))).toFixed(2)} ${(r * Math.sin(rad(deg))).toFixed(2)}`;

// Closed outline of a gear centred on 0 0, tooth 0 pointing right.
// shortcut: straight-flanked teeth instead of true cycloidal clock profiles, fine at drawing size.
export function gearPath(m, z) {
  const r = pitchRadius(m, z);
  const tip = r + m;
  const root = r - 1.25 * m;
  const pitch = 360 / z;
  const points = [];
  for (let i = 0; i < z; i++) {
    const c = i * pitch;
    points.push(at(root, c - 0.3 * pitch), at(tip, c - 0.12 * pitch), at(tip, c + 0.12 * pitch), at(root, c + 0.3 * pitch));
  }
  return `M${points.join('L')}Z`;
}

// Centre of a gear meshing with one at x y, in direction `dir` (degrees).
export function meshCentre(x, y, m, z1, z2, dir) {
  const d = pitchRadius(m, z1) + pitchRadius(m, z2);
  return [x + d * Math.cos(rad(dir)), y + d * Math.sin(rad(dir))];
}

// Angle of the driven gear: it turns the other way, z1/z2 as fast, with a gap facing the driver's tooth.
export const meshAngle = (a1, z1, z2, dir) => dir + 180 + 180 / z2 - (z1 / z2) * (a1 - dir);

// Escapement step: the wheel stands still most of the swing and jumps one step while the pallet lets go,
// centred on each whole number of `beats`. Returns how many steps have happened, smoothly.
export function steps(beats, width = 0.16) {
  const n = Math.round(beats);
  const f = Math.min(1, Math.max(0, (beats - n) / width + 0.5));
  return n - 1 + f * f * (3 - 2 * f);
}
