import { handAngles } from '../clocks/analog.js';

const MINUTE_LABELS = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));
const HOUR_LABELS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

// Point on a circle around (cx, cy); 0° is 12 o'clock.
const polar = (cx, cy, radius, degrees) => {
  const rad = (degrees * Math.PI) / 180;
  return [cx + radius * Math.sin(rad), cy - radius * Math.cos(rad)];
};

// Hands are drawn pointing at 12 and rotated by handAngles.
function Hand({ angle, center, length, color, width }) {
  return (
    <line
      x1={center} y1={center} x2={center} y2={center - length}
      stroke={color} strokeWidth={width} strokeLinecap="round"
      transform={`rotate(${angle} ${center} ${center})`}
    />
  );
}

// With `onAngle`, pressing or dragging on the dial reports the pointer's angle (0° = 12 o'clock).
export function BigClock({ date, label, onAngle }) {
  const { hour, minute } = handAngles(date);
  const drag = (e) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const r = e.currentTarget.getBoundingClientRect();
    const degrees = (Math.atan2(e.clientX - r.left - r.width / 2, r.top + r.height / 2 - e.clientY) * 180) / Math.PI;
    onAngle((degrees + 360) % 360);
  };
  const dragProps = onAngle && {
    className: 'w-full h-full drop-shadow-md cursor-grab active:cursor-grabbing touch-none',
    onPointerDown: (e) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      drag(e);
    },
    onPointerMove: drag,
  };
  return (
    <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-md" role="img" aria-label={label} {...dragProps}>
      <circle cx="150" cy="150" r="142" fill="#fff" stroke="#1c1c17" strokeWidth="4" />
      <circle cx="150" cy="150" r="116" fill="#FFFDF7" stroke="#1c1c17" strokeWidth="2.5" />
      <g className="font-label font-bold text-[10px] fill-slate-500 select-none" textAnchor="middle" dominantBaseline="central">
        {MINUTE_LABELS.map((text, i) => {
          const [x, y] = polar(150, 150, 130, i * 30);
          return <text key={text} x={x} y={y}>{text}</text>;
        })}
      </g>
      <g className="font-display font-bold text-[22px] fill-[#1c1c17] select-none" textAnchor="middle" dominantBaseline="central">
        {HOUR_LABELS.map((text, i) => {
          const [x, y] = polar(150, 150, 96, i * 30);
          return <text key={text} x={x} y={y}>{text}</text>;
        })}
      </g>
      <Hand angle={hour} center={150} length={62} color="#F97316" width={10} />
      <Hand angle={minute} center={150} length={100} color="#2563EB" width={5} />
      <circle cx="150" cy="150" r="8" fill="#FACC15" stroke="#1c1c17" strokeWidth="3" />
    </svg>
  );
}

export function SmallClock({ date, label }) {
  const { hour, minute, second } = handAngles(date);
  return (
    <svg viewBox="0 0 100 100" className="w-28 h-28" role="img" aria-label={label}>
      <circle cx="50" cy="50" r="46" fill="#fff" stroke="#1c1c17" strokeWidth="3" />
      <g className="font-display font-bold text-[9px] fill-[#1c1c17] select-none" textAnchor="middle" dominantBaseline="central">
        <text x="50" y="15">12</text>
        <text x="85" y="50">3</text>
        <text x="50" y="85">6</text>
        <text x="15" y="50">9</text>
      </g>
      {HOUR_LABELS.map((h, i) => {
        const [x1, y1] = polar(50, 50, 44, i * 30);
        const [x2, y2] = polar(50, 50, 40, i * 30);
        return <line key={h} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1c1c17" strokeWidth="1.5" />;
      })}
      <Hand angle={hour} center={50} length={22} color="#F97316" width={4} />
      <Hand angle={minute} center={50} length={32} color="#2563EB" width={2.5} />
      <Hand angle={second} center={50} length={36} color="#DC2626" width={1.2} />
      <circle cx="50" cy="50" r="3.5" fill="#FACC15" stroke="#1c1c17" strokeWidth="1.5" />
    </svg>
  );
}
