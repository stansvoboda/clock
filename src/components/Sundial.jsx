import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion, useScrollProgress } from '../scroll.js';
import { Fact, SceneTitle, Step } from './Chapter.jsx';

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
    <section id="slunce" ref={sectionRef} className="py-24 scroll-mt-16">
      <div className="max-w-stage mx-auto px-4 md:px-8">
        <SceneTitle title="Slunce a stín" when="cca 1500 př. n. l." number={1} subtitle="Počátky lidské vynalézavosti" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 items-start">
          <div className="lg:col-span-7 mt-12 lg:mt-16 lg:sticky lg:top-28">
            <div className="screen hang p-4 sm:p-6 [--cable:4rem]">
              <div className="flex flex-wrap justify-between items-end gap-3 pb-4">
                <div>
                  <h3 className="font-display font-extrabold text-2xl leading-tight">Egyptský sluneční gnómon</h3>
                  <p className="text-sm">Interaktivní simulátor</p>
                </div>
                <output htmlFor="sun-slider" className="surtitle text-sm">{dayLabel(day)}</output>
              </div>

              <div ref={stageRef} className="relative w-full h-[300px] md:h-[380px] overflow-hidden bg-[#BFE3EC]" aria-hidden="true">
                <svg className="absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2" style={{ left: `${sunLeft}%`, top: `${sunTop}%` }} viewBox="0 0 60 60">
                  <path d="M30 2V10M30 50V58M2 30H10M50 30H58M10 10L16 16M44 44L50 50M10 50L16 44M44 16L50 10" stroke="#D2381F" strokeLinecap="round" strokeWidth="3" />
                  <circle cx="30" cy="30" r="17" fill="#F4B23E" />
                </svg>
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
                  <div className="w-64 md:w-96 h-36 rounded-t-full bg-screen relative flex justify-center overflow-hidden">
                    <div className="wide text-xs font-bold">
                      <span className="absolute left-[16%] top-[38%]">IX</span>
                      <span className="absolute left-1/2 -translate-x-1/2 top-3">XII</span>
                      <span className="absolute right-[16%] top-[38%]">III</span>
                    </div>
                    <div className="absolute bottom-0 w-3 h-28 bg-ink/45 rounded-full origin-bottom" style={{ transform: `rotate(${shadowAngle}deg) scaleY(${shadowLength})` }} />
                    <div className="absolute bottom-0 w-3 h-24 bg-ink z-10" />
                  </div>
                  <div className="w-full bg-[#E9C77B] h-10" />
                </div>
              </div>

              <div className="mt-5 pt-4 border-t-2 border-ink">
                <p className="font-bold mb-3">Ovládej slunce a sleduj stín</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {PRESETS.map(([label, value]) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setDay(value)}
                      aria-pressed={dayLabel(day) === dayLabel(value)}
                      className={`cue ${dayLabel(day) === dayLabel(value) ? 'cue-on' : ''}`}
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
