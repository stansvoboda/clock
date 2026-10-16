import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion, useScrollProgress } from '../scroll.js';

const PRESETS = [
  ['Ráno', 15],
  ['Poledne', 50],
  ['Odpoledne', 75],
  ['Západ', 92],
];

const STEPS = [
  ['Sluneční tyč v písku', <>Před 3 500 lety ve starověkém Egyptě zapíchli do země prostou tyč — <strong>gnómon</strong>. Zjistili, že délka a směr jejího stínu se během dne pravidelně mění.</>],
  ['Otáčivý tanec stínu', 'Stín se otáčel spolu se sluncem na obloze. Ráno byl dlouhý, v poledne nejkratší a večer se zase protahoval na druhou stranu.'],
  ['Kde byl stín, tam byl čas', 'Rozdělením denní dráhy na 12 dílů vznikly první hodiny. Měly však háček: v noci nebo pod mrakem se čas doslova zastavil.'],
];

function dayLabel(value) {
  if (value < 30) return 'Ráno (cca 8:00)';
  if (value <= 60) return 'Poledne (12:00)';
  if (value < 85) return 'Odpoledne (cca 16:00)';
  return 'Západ slunce (cca 19:30)';
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

  const sunLeft = 10 + day * 0.8;
  const sunTop = 55 - Math.sin((day / 100) * Math.PI) * 40;
  // The shadow points away from the sun and is longest when the sun is low.
  const shadowAngle = (day - 50) * -1.5;
  const shadowLength = 0.5 + Math.abs(day - 50) * 0.015;

  return (
    <section id="slunce" ref={sectionRef} className="py-space-xl border-t-2 border-on-surface bg-[#FBBF24]">
      <div className="max-w-[1380px] mx-auto px-4 md:px-margin">
        <div className="flex flex-wrap items-center gap-3 mb-space-lg">
          <span className="px-4 py-1.5 rounded-full bg-amber-300 chunky-border font-label text-label-caps chunky-shadow-sm flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-800" aria-hidden="true" />
            cca 1500 př. n. l.
          </span>
          <span className="text-caption text-amber-950">Kapitola 1 • Počátky lidské vynalézavosti</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <h2 className="font-display text-headline-xl-mobile md:text-headline-xl">1. Slunce a stín</h2>
            {STEPS.map(([title, text], i) => (
              <div key={title} className="reveal lg:min-h-[32svh] lg:flex lg:items-center">
              <div className="bg-surface-container-lowest chunky-border rounded-2xl p-5 chunky-shadow flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-amber-200 chunky-border font-label text-label-caps text-amber-900 flex items-center justify-center shrink-0">{i + 1}</span>
                <div>
                  <h3 className="font-display text-headline-sm mb-1">{title}</h3>
                  <p className="text-on-surface-variant">{text}</p>
                </div>
              </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-7 bg-surface-container-lowest chunky-border rounded-3xl p-5 md:p-8 chunky-shadow-lg lg:sticky lg:top-24">
            <div className="flex flex-wrap justify-between items-center gap-3 pb-4 mb-6 border-b-2 border-on-surface">
              <div>
                <span className="font-label text-label-caps text-primary uppercase">Interaktivní simulátor</span>
                <h3 className="font-display text-headline-md">Egyptský sluneční gnómon</h3>
              </div>
              <output htmlFor="sun-slider" className="bg-amber-300 chunky-border px-3 py-1 rounded-full font-label text-xs font-bold">
                {dayLabel(day)}
              </output>
            </div>

            <div ref={stageRef} className="relative w-full h-[320px] md:h-[400px] rounded-2xl chunky-border overflow-hidden bg-gradient-to-b from-sky-200 via-amber-100 to-amber-200" aria-hidden="true">
              <svg className="absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2" style={{ left: `${sunLeft}%`, top: `${sunTop}%` }} viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="20" fill="#FDE047" stroke="#1c1c17" strokeWidth="2.5" />
                <circle cx="24" cy="27" r="2.5" fill="#1c1c17" />
                <circle cx="36" cy="27" r="2.5" fill="#1c1c17" />
                <path d="M24 35Q30 42 36 35" fill="none" stroke="#1c1c17" strokeLinecap="round" strokeWidth="2.5" />
                <path d="M30 4V9M30 51V56M4 30H9M51 30H56M12 12L16 16M44 44L48 48M12 48L16 44M44 16L48 12" stroke="#1c1c17" strokeLinecap="round" strokeWidth="2.5" />
              </svg>
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
                <div className="w-64 md:w-96 h-36 border-t-[3px] border-x-[3px] border-on-surface rounded-t-full bg-amber-100/90 relative flex justify-center overflow-hidden">
                  <div className="font-label text-xs font-bold text-amber-950">
                    <span className="absolute left-[16%] top-[38%]">IX</span>
                    <span className="absolute left-1/2 -translate-x-1/2 top-3">XII</span>
                    <span className="absolute right-[16%] top-[38%]">III</span>
                  </div>
                  <div className="absolute bottom-0 w-3 h-28 bg-slate-900/60 rounded-full origin-bottom" style={{ transform: `rotate(${shadowAngle}deg) scaleY(${shadowLength})` }} />
                  <div className="absolute bottom-0 w-4 h-24 bg-amber-900 chunky-border rounded-t-md z-10" />
                  <div className="absolute bottom-0 w-12 h-3 bg-on-surface rounded-t-sm z-10" />
                </div>
                <div className="w-full bg-[#E5D2A8] h-10 border-t-2 border-on-surface" />
              </div>
            </div>

            <div className="mt-6 bg-surface-container chunky-border rounded-2xl p-4 md:p-5">
              <p className="font-label text-label-caps uppercase mb-3 flex items-center gap-2">
                <span className="icon text-primary text-[20px]" aria-hidden="true">light_mode</span>
                Ovládej slunce a sleduj stín
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {PRESETS.map(([label, value]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setDay(value)}
                    className={`chunky-btn font-label text-xs py-2 rounded-lg ${dayLabel(day) === dayLabel(value) ? 'bg-amber-400 font-bold' : 'bg-amber-100'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-3 text-caption text-on-surface-variant">
                Den
                <input id="sun-slider" type="range" min="0" max="100" value={day} onChange={(e) => setDay(Number(e.target.value))} className="w-full h-11 accent-primary cursor-pointer" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
