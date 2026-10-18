import { gearPath, meshAngle, meshCentre, pitchRadius, steps } from '../clocks/gear.js';

const INK = '#221F2B';
const rad = (deg) => (deg * Math.PI) / 180;

// Like the other chapter art, every drawing here is driven by `p`, the scroll progress (0–1).

function Gear({ x, y, m, z, angle, color, hub = 0.3 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <path d={gearPath(m, z)} fill={color} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <circle r={pitchRadius(m, z) * hub} fill="#FBFAF5" stroke={INK} strokeWidth="2.5" />
    </g>
  );
}

// Saw-toothed escape wheel; the teeth lean the way it turns (clockwise).
function sawPath(z, root, tip) {
  const pitch = 360 / z;
  const point = (r, deg) => `${(r * Math.cos(rad(deg))).toFixed(2)} ${(r * Math.sin(rad(deg))).toFixed(2)}`;
  return `M${Array.from({ length: z }, (_, i) => `${point(root, i * pitch)}L${point(tip, i * pitch + pitch * 0.35)}L${point(root, i * pitch + pitch * 0.45)}`).join('L')}Z`;
}

// Verge and foliot (konec 13. století): the weight turns the great wheel, its pinion turns the crown wheel,
// and the crown wheel's teeth push the two pallets on the vertical verge in turn. Each push swings the
// foliot one way until the other pallet catches a tooth, so the whole train moves in small steps: tik, tak.
const CROWN = 15; // crown wheels have an odd tooth count, so one pallet is always in a gap
const GREAT = 40;
const PINION = 10;
const BEATS = 42;
const BARREL = 14;

export function GearsArt({ p }) {
  const m = 2.2;
  const [gx, gy] = [70, 132];
  const dir = -40;
  const [px, py] = meshCentre(gx, gy, m, GREAT, PINION, dir);
  const beats = p * BEATS;
  // The crown wheel moves half a tooth per beat; the great wheel turns the other way, PINION/GREAT as fast.
  const crown = steps(beats) * (180 / CROWN);
  const great = (-crown * PINION) / GREAT;
  const fall = rad(-great) * BARREL; // the rope unwinds exactly as far as the barrel's rim travels
  const swing = 40 * Math.sin(Math.PI * beats); // the foliot reverses between beats
  const crownR = 32;
  const pallet = (y, angle) => {
    const reach = 13 * Math.cos(rad(angle));
    return <path d={`M${px} ${y - 4}H${px + reach}L${px + reach * 0.7} ${y + 4}H${px}Z`} fill="#F4B23E" stroke={INK} strokeWidth="2" strokeLinejoin="round" />;
  };
  const arm = 58 * Math.cos(rad(swing));

  return (
    <svg viewBox="0 0 200 220" className="w-full h-full">
      {/* Crown wheel behind the pinion on the same arbor, seen face on: its teeth point at you. */}
      <g transform={`translate(${px} ${py}) rotate(${crown})`}>
        <path d={`${sawPath(CROWN, crownR - 8, crownR)}M${crownR - 14} 0A${crownR - 14} ${crownR - 14} 0 1 0 ${14 - crownR} 0A${crownR - 14} ${crownR - 14} 0 1 0 ${crownR - 14} 0Z`} fillRule="evenodd" fill="#FBFAF5" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      <line x1={px} y1={py + crownR + 6} x2={px} y2="20" stroke={INK} strokeWidth="3" />
      <Gear x={gx} y={gy} m={m} z={GREAT} angle={great} color="#D2381F" hub={0.12} />
      <Gear x={px} y={py} m={m} z={PINION} angle={meshAngle(great, GREAT, PINION, dir)} color="#F4B23E" />

      {/* The barrel sits on the great wheel's arbor; the falling weight unwinds its rope. */}
      <g transform={`translate(${gx} ${gy}) rotate(${great})`}>
        <circle r={BARREL} fill="#A52A15" stroke={INK} strokeWidth="2.5" />
        <line x1="0" y1={-BARREL} x2="0" y2={BARREL} stroke={INK} strokeWidth="2" />
      </g>
      <line x1={gx - BARREL} y1={gy} x2={gx - BARREL} y2={176 + fall} stroke={INK} strokeWidth="2.5" />
      <rect x={gx - BARREL - 12} y={176 + fall} width="24" height="16" rx="3" fill={INK} />

      {/* Verge (drawn behind the pinion) with its two pallets at the top and bottom of the crown wheel, foliot on top. */}
      {pallet(py - crownR, swing - 50)}
      {pallet(py + crownR, swing + 50)}
      <line x1={px - arm} y1="20" x2={px + arm} y2="20" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      {[-1, 1].map((side) => (
        <circle key={side} cx={px + side * arm} cy="20" r={7 + side * 2 * Math.sin(rad(swing))} fill="#2D5BD2" stroke={INK} strokeWidth="2.5" />
      ))}
    </svg>
  );
}

// Anchor escapement with a seconds pendulum (kotvový krok, kolem 1670). The 30-tooth escape wheel moves
// half a tooth per swing, so it turns once a minute and the seconds hand sits right on its arbor.
// The anchor's pallets span 7½ teeth; while one locks a tooth the other waits in a gap.
const ESCAPE = 30;
const SWINGS = 16;

export function PendulumArt({ p }) {
  const [cx, cy] = [100, 90];
  const tip = 36;
  const pivot = cy - tip * Math.SQRT2; // arms tangent to the wheel, so the pallets dip straight in and out
  const beats = p * SWINGS;
  const swing = 7 * Math.sin(Math.PI * beats); // drawn ~2× wider than a real 3–4° swing, so it reads
  const wheel = steps(beats) * (180 / ESCAPE) + 309; // a tooth tip rests 2° short of the locking pallet
  const seconds = steps(beats) * 6;
  const palletTip = (side) => [cx + side * tip * Math.SQRT1_2, cy - tip * Math.SQRT1_2];

  return (
    <svg viewBox="0 0 200 220" className="w-full h-full">
      {/* Pendulum hangs behind the movement and swings with the anchor through its crutch. */}
      <g style={{ transform: `rotate(${swing}deg)`, transformOrigin: `${cx}px ${pivot}px` }}>
        <line x1={cx} y1={pivot} x2={cx} y2="184" stroke={INK} strokeWidth="3" />
        <circle cx={cx} cy="194" r="15" fill="#D2381F" stroke={INK} strokeWidth="3" />
      </g>

      <g transform={`translate(${cx} ${cy}) rotate(${wheel})`}>
        <path d={sawPath(ESCAPE, tip - 6, tip)} fill="#F4B23E" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        {[0, 90, 180, 270].map((a) => <line key={a} x1="0" y1="0" x2={(tip - 7) * Math.cos(rad(a))} y2={(tip - 7) * Math.sin(rad(a))} stroke={INK} strokeWidth="3" />)}
      </g>

      <g style={{ transform: `rotate(${swing}deg)`, transformOrigin: `${cx}px ${pivot}px` }}>
        {[-1, 1].map((side) => {
          const [x, y] = palletTip(side);
          // Arm out to just past the rim, then a nib that reaches in between the teeth.
          return (
            <g key={side}>
              <path d={`M${cx} ${pivot}L${x + side * 5} ${y - 5}`} stroke="#2D5BD2" strokeWidth="6" strokeLinecap="round" />
              <path d={`M${x + side * 8} ${y - 8}L${x} ${y}L${x + side * 2} ${y - 9}Z`} fill="#2D5BD2" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
            </g>
          );
        })}
      </g>

      {/* Skeleton dial in front: the open ring lets you watch the wheel that carries the seconds hand. */}
      <circle cx={cx} cy={cy} r="54" fill="none" stroke={INK} strokeWidth="10" opacity="0.12" />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={cx} y1={cy - 58} x2={cx} y2={cy - 50} stroke={INK} strokeWidth="3" transform={`rotate(${i * 30} ${cx} ${cy})`} />
      ))}
      <line x1={cx} y1={cy} x2={cx} y2={cy - 30} stroke="#D2381F" strokeWidth="3" strokeLinecap="round" style={{ transform: `rotate(${seconds}deg)`, transformOrigin: `${cx}px ${cy}px` }} />
      <circle cx={cx} cy={cy} r="5" fill={INK} />
      <circle cx={cx} cy={pivot} r="5" fill={INK} />
    </svg>
  );
}

// Balance wheel and hairspring, the heart of a marine chronometer: the spring winds and unwinds as the
// wheel swings back and forth, and a rocking ship cannot disturb it the way it upsets a pendulum.
const COILS = 5;

export function BalanceArt({ p }) {
  const [cx, cy] = [100, 110];
  const swing = 150 * Math.sin(p * 16 * Math.PI);
  // The inner end turns with the wheel, the outer end is pinned to the stud; the coils between share the twist.
  const spring = Array.from({ length: 121 }, (_, i) => {
    const s = i / 120;
    const a = rad(s * COILS * 360 + swing * (1 - s) - 90);
    const r = 6 + 30 * s;
    return `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  });

  return (
    <svg viewBox="0 0 200 220" className="w-full h-full">
      <g style={{ transform: `rotate(${swing}deg)`, transformOrigin: `${cx}px ${cy}px` }}>
        <circle cx={cx} cy={cy} r="66" fill="none" stroke={INK} strokeWidth="12" />
        <circle cx={cx} cy={cy} r="66" fill="none" stroke="#F4B23E" strokeWidth="6" />
        {[0, 120, 240].map((a) => <line key={a} x1={cx} y1={cy} x2={cx + 60 * Math.cos(rad(a))} y2={cy + 60 * Math.sin(rad(a))} stroke={INK} strokeWidth="4" />)}
        {[60, 180, 300].map((a) => <circle key={a} cx={cx + 66 * Math.cos(rad(a))} cy={cy + 66 * Math.sin(rad(a))} r="5" fill="#D2381F" stroke={INK} strokeWidth="2" />)}
      </g>
      <path d={`M${spring.join('L')}`} fill="none" stroke="#2D5BD2" strokeWidth="2" />
      <rect x={cx - 4} y={cy - 44} width="8" height="10" fill={INK} />
      <circle cx={cx} cy={cy} r="6" fill={INK} />
    </svg>
  );
}
