import { useRef } from 'react';
import { handAngles } from '../clocks/analog.js';

const MINUTE_LABELS = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));
const HOUR_LABELS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

// Point on a circle around (150, 150); 0° is 12 o'clock.
const polar = (radius, degrees) => {
  const rad = (degrees * Math.PI) / 180;
  return [150 + radius * Math.sin(rad), 150 - radius * Math.cos(rad)];
};

// Keeps a hand's angle continuous (354° → 360°, not back to 0°), so its transition takes the short way round.
function useUnwrapped(angle) {
  const last = useRef(angle);
  last.current += ((angle - last.current + 540) % 360) - 180;
  return last.current;
}

function Hand({ angle, length, tail = 14, width, color, spring }) {
  return (
    <line
      x1="150" y1={150 + tail} x2="150" y2={150 - length}
      stroke={color} strokeWidth={width} strokeLinecap="round"
      style={{
        transform: `rotate(${angle}deg)`,
        transformOrigin: '150px 150px',
        transition: spring ? 'transform 0.45s var(--spring)' : undefined,
      }}
    />
  );
}

// The performer: a red-bezelled dial whose bezel counts minutes by fives.
// With `onAngle`, pressing or dragging on the dial reports the pointer's angle (0° = 12 o'clock) and the
// hand being turned ('hour' or 'minute'), and the hands spring onto the new time.
export function Dial({ date, label, onAngle, seconds = false, className = 'w-full h-full' }) {
  const angles = handAngles(date);
  const hour = useUnwrapped(angles.hour);
  const minute = useUnwrapped(angles.minute);
  const hand = useRef('minute');
  // Pointer position relative to the dial centre, in fractions of its radius.
  const locate = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / (r.width / 2) - 1;
    const y = 1 - (e.clientY - r.top) / (r.height / 2);
    return { x, y, distance: Math.hypot(x, y) };
  };
  const drag = (e) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const { x, y, distance } = locate(e);
    if (distance < 0.08) return; // under the centre cap the angle is noise
    onAngle(((Math.atan2(x, y) * 180) / Math.PI + 360) % 360, hand.current);
  };
  const dragProps = onAngle && {
    onPointerDown: (e) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      // A finger on the inner part of the dial turns the short hour hand, further out the long minute hand.
      hand.current = locate(e).distance < 0.55 ? 'hour' : 'minute';
      drag(e);
    },
    onPointerMove: drag,
  };
  return (
    <svg
      viewBox="0 0 300 300"
      className={`${className} ${onAngle ? 'cursor-grab active:cursor-grabbing touch-none' : ''}`}
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      {...dragProps}
    >
      <circle cx="150" cy="150" r="148" fill="#D2381F" />
      <g className="font-display font-bold text-[13px] select-none" fill="#FBFAF5" textAnchor="middle" dominantBaseline="central" style={{ fontStretch: '125%' }}>
        {MINUTE_LABELS.map((text, i) => {
          const [x, y] = polar(134, i * 30);
          return <text key={text} x={x} y={y}>{text}</text>;
        })}
      </g>
      <circle cx="150" cy="150" r="119" fill="#FBFAF5" />
      {Array.from({ length: 60 }, (_, i) => (
        <line key={i} x1="150" y1="35" x2="150" y2={i % 5 ? 41 : 49} stroke="#221F2B" strokeWidth={i % 5 ? 1.5 : 4} transform={`rotate(${i * 6} 150 150)`} />
      ))}
      <Hand angle={hour} length={58} width={12} color="#D2381F" spring={!!onAngle} />
      <Hand angle={minute} length={98} width={6} color="#2D5BD2" spring={!!onAngle} />
      {/* Numerals sit above the hands, haloed in paper, so the minute hand never hides the number it points at. */}
      <g className="font-display font-extrabold text-[27px] select-none" fill="#221F2B" textAnchor="middle" dominantBaseline="central" stroke="#FBFAF5" strokeWidth="5" strokeLinejoin="round" paintOrder="stroke" style={{ fontStretch: '80%' }}>
        {HOUR_LABELS.map((text, i) => {
          const [x, y] = polar(84, i * 30);
          return <text key={text} x={x} y={y}>{text}</text>;
        })}
      </g>
      {/* The thin seconds hand goes over the numerals so their paper halo doesn't cut it. */}
      {seconds && <Hand angle={angles.second} length={106} tail={24} width={2} color="#221F2B" />}
      <circle cx="150" cy="150" r="9" fill="#221F2B" />
      <circle cx="150" cy="150" r="3.5" fill="#FBFAF5" />
    </svg>
  );
}

export const BigClock = (props) => <Dial {...props} />;
export const SmallClock = ({ className = 'w-36 h-36', ...props }) => <Dial seconds className={className} {...props} />;
