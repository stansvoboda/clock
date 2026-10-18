import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion, useScrollProgress } from '../scroll.js';
import { Fact, SceneTitle, Step } from './Chapter.jsx';
import { hourLineSlope } from '../clocks/sundial.js';

// Slider value 0–100 runs from 7:00 to 17:00 solar time on the equinox. Earlier or later the sun is
// behind the wall, and at 6:00 and 18:00 the shadow would run off to infinity.
const PRESETS = [
  ['Ráno', 10],
  ['Poledne', 50],
  ['Odpoledne', 80],
  ['Večer', 100],
];
const solarHour = (day) => 7 + day / 10;
const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
const NUMERALS = { 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII', 13: 'I', 14: 'II', 15: 'III', 16: 'IV', 17: 'V' };

// The dial drawing: the style's root at the top, hour lines fanning down, edge of the painted dial.
const ROOT = [150, 24];
const DROP = 40; // from the root down to the equinox line, which the nodus's shadow follows all day
const EDGE = { left: 18, right: 282, bottom: 168 };

// Where an hour line from the root meets the edge of the dial.
function lineEnd(hour) {
  const slope = hourLineSlope(hour);
  const down = EDGE.bottom - ROOT[1];
  const across = slope < 0 ? ROOT[0] - EDGE.left : EDGE.right - ROOT[0];
  const t = Math.min(down, across / Math.abs(slope || 1e-9));
  return [ROOT[0] + slope * t, ROOT[1] + t];
}

const STEPS = [
  ['Sluneční tyč v písku', <>Před 3 500 lety ve starověkém Egyptě zapíchli do země prostou tyč — <strong>gnómon</strong>. Zjistili, že délka a směr jejího stínu se během dne pravidelně mění.</>],
  ['Otáčivý tanec stínu', 'Stín se otáčel spolu se sluncem na obloze. Ráno byl dlouhý, v poledne nejkratší a večer se zase protahoval na druhou stranu.'],
  ['Kde byl stín, tam byl čas', 'Rozdělením denní dráhy na 12 dílů vznikly první hodiny. Měly však háček: v noci nebo pod mrakem se čas doslova zastavil.'],
];

function timeLabel(day) {
  const minutes = Math.round((solarHour(day) * 60) / 5) * 5;
  return `Sluneční čas ${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
}

export default function Sundial() {
  const [day, setDay] = useState(50); // 0 = sunrise, 100 = sunset

  // Scrolling moves the sun from sunrise to sunset. On wide screens the simulator is pinned
  // while the story steps scroll past, so we follow the whole section; on narrow screens the stage itself.
  // shortcut: breakpoint is read once on mount, resizing across 1024px keeps the old target until reload.
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const [wide] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  const progress = useScrollProgress(wide ? sectionRef : stageRef);
  useEffect(() => {
    if (progress !== null && !prefersReducedMotion()) setDay(Math.round(progress * 100));
  }, [progress]);

  // We face the south wall, so the sun is behind us: it rises on our right and sets on our left,
  // and the shadow swings the other way, from the morning hours on the left to the evening ones on the right.
  const hour = solarHour(day);
  const sunLeft = 90 - day * 0.8;
  const sunTop = 26 - Math.sin(((hour - 6) / 12) * Math.PI) * 16; // stays in the sky above the wall
  // The tip of the style (the nodus) casts its shadow onto the equinox line; the shadow is the style's line to it.
  const shadow = [ROOT[0] + hourLineSlope(hour) * DROP, ROOT[1] + DROP];

  return (
    <section id="slunce" ref={sectionRef} className="py-24 scroll-mt-16">
      <div className="max-w-stage mx-auto px-4 md:px-8">
        <SceneTitle title="Slunce a stín" when="cca 1500 př. n. l." number={1} subtitle="Počátky lidské vynalézavosti" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 items-start">
          <div className="lg:col-span-7 mt-12 lg:mt-16 lg:sticky lg:top-28">
            <div className="screen hang p-4 sm:p-6 [--cable:4rem]">
              <div className="flex flex-wrap justify-between items-end gap-3 pb-4">
                <div>
                  <h3 className="font-display font-extrabold text-2xl leading-tight">Sluneční hodiny na zdi</h3>
                  <p className="text-sm">Interaktivní simulátor • Praha, jarní rovnodennost</p>
                </div>
                <output htmlFor="sun-slider" className="surtitle text-sm">{timeLabel(day)}</output>
              </div>

              <div ref={stageRef} className="relative w-full h-[300px] md:h-[380px] overflow-hidden bg-[#BFE3EC]" aria-hidden="true">
                <svg className="absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2" style={{ left: `${sunLeft}%`, top: `${sunTop}%` }} viewBox="0 0 60 60">
                  <path d="M30 2V10M30 50V58M2 30H10M50 30H58M10 10L16 16M44 44L50 50M10 50L16 44M44 16L50 10" stroke="#D2381F" strokeLinecap="round" strokeWidth="3" />
                  <circle cx="30" cy="30" r="17" fill="#F4B23E" />
                </svg>
                <svg viewBox="0 0 300 200" className="absolute inset-x-0 bottom-0 w-full h-[66%]">
                  {/* Plastered church wall with the painted dial; ground in front of it. */}
                  <rect x="-300" y="0" width="900" height="200" fill="#FBFAF5" />
                  <rect x={EDGE.left - 8} y="8" width={EDGE.right - EDGE.left + 16} height={EDGE.bottom} rx="4" fill="none" stroke="#221F2B" strokeWidth="2.5" />
                  <line x1={EDGE.left} y1={ROOT[1] + DROP} x2={EDGE.right} y2={ROOT[1] + DROP} stroke="#2D5BD2" strokeWidth="1.5" strokeDasharray="4 4" />
                  {HOURS.map((h) => {
                    const [x, y] = lineEnd(h);
                    const [lx, ly] = [ROOT[0] + (x - ROOT[0]) * 0.86, ROOT[1] + (y - ROOT[1]) * 0.86];
                    return (
                      <g key={h}>
                        <line x1={ROOT[0]} y1={ROOT[1]} x2={lx} y2={ly} stroke="#221F2B" strokeWidth="1.5" opacity="0.5" />
                        <text x={x} y={y} dy={y >= EDGE.bottom - 1 ? -4 : 4} textAnchor="middle" className="wide" fontSize="11" fontWeight="700" fill="#221F2B">{NUMERALS[h]}</text>
                      </g>
                    );
                  })}
                  <line x1={ROOT[0]} y1={ROOT[1]} x2={shadow[0]} y2={shadow[1]} stroke="#221F2B" strokeWidth="5" strokeLinecap="round" opacity="0.45" />
                  <circle cx={shadow[0]} cy={shadow[1]} r="5" fill="#221F2B" opacity="0.6" />
                  {/* The style sticks out of the wall toward the sky's pole; seen face on it is a short stub. */}
                  <line x1={ROOT[0]} y1={ROOT[1]} x2={ROOT[0]} y2={ROOT[1] + 18} stroke="#221F2B" strokeWidth="4" strokeLinecap="round" />
                  <circle cx={ROOT[0]} cy={ROOT[1] + 18} r="4" fill="#D2381F" stroke="#221F2B" strokeWidth="2" />
                  <circle cx={ROOT[0]} cy={ROOT[1]} r="4" fill="#221F2B" />
                  <rect x="-300" y="186" width="900" height="14" fill="#E9C77B" />
                </svg>
              </div>

              <div className="mt-5 pt-4 border-t-2 border-ink">
                <p className="font-bold mb-3">Ovládej slunce a sleduj stín</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {PRESETS.map(([label, value]) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setDay(value)}
                      aria-pressed={day === value}
                      className={`cue ${day === value ? 'cue-on' : ''}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-3 font-bold">
                  Den
                  <input id="sun-slider" type="range" min="0" max="100" value={day} onChange={(e) => setDay(Number(e.target.value))} className="w-full h-11 accent-actor cursor-pointer" />
                </label>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 lg:order-first">
            {STEPS.map(([title, text]) => <Step key={title} title={title}>{text}</Step>)}
            <Fact>Proč má hodina 60 minut? Staří Babyloňané počítali v šedesátkové soustavě. Proto má hodina 60 minut, minuta 60 sekund a kruh 360 stupňů.</Fact>
          </div>
        </div>
      </div>
    </section>
  );
}
