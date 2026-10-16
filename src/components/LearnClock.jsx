import { useEffect, useState } from 'react';
import { useActiveId } from '../scroll.js';
import { BigClock } from './AnalogClock.jsx';
import { toWords } from '../clocks/words.js';
import { dragTo } from '../clocks/dial.js';

const HALF_DAY = 12 * 60;
const TASK_MINUTES = [0, 15, 30, 45, 10, 20, 40, 50];

// Time on the lesson dial is kept as minutes after 12:00 (0–719).
const toDate = (total) => new Date(2026, 0, 1, Math.floor(total / 60), total % 60);
const label = (total) => `${Math.floor(total / 60) || 12}:${String(total % 60).padStart(2, '0')}`;
const randomTask = () =>
  Math.floor(Math.random() * 12) * 60 + TASK_MINUTES[Math.floor(Math.random() * TASK_MINUTES.length)];

const LESSONS = [
  ['Krátká tlustá ručička = HODINY', 'Pohybuje se pomalu. Za celý den oběhne ciferník dvakrát (2 × 12 = 24 hodin).', 'bg-orange-500 text-white', 'text-orange-600', 180],
  ['Dlouhá štíhlá ručička = MINUTY', 'Pohybuje se rychleji. Za jednu hodinu oběhne celý kruh (60 minut).', 'bg-blue-600 text-white', 'text-blue-600', 180],
  ['Celá hodina (např. 3:00)', <>Dlouhá modrá ručička míří <strong>přesně nahoru na 12</strong>. Krátká ukazuje hodinu: „tři hodiny“.</>, 'bg-amber-400', '', 180],
  ['Půl (např. 3:30 = půl čtvrté)', <>Dlouhá ručička míří <strong>dolů na 6</strong>. Krátká je v půli cesty mezi 3 a 4 — proto česky říkáme <strong>půl čtvrté</strong>, ne „půl třetí“.</>, 'bg-amber-400', '', 210],
  ['Čtvrt a tři čtvrtě', <>3:15 je <strong>čtvrt na čtyři</strong> (dlouhá ručička na 3). 3:45 je <strong>tři čtvrtě na čtyři</strong> (dlouhá ručička na 9).</>, 'bg-amber-400', '', 195],
  ['Minuty po pěti', 'Každé číslo na ciferníku znamená 5 minut: na 1 je 5 minut, na 2 je 10 minut, na 4 je 20 minut…', 'bg-amber-400', '', 200],
];
// Each lesson shows its example on the dial (minutes after 12:00) as you read it.
const LESSON_IDS = LESSONS.map((_, i) => `lekce-${i + 1}`);

const DEMOS = [
  ['Celá', 180],
  ['Čtvrt', 195],
  ['Půl', 210],
  ['Tři čtvrtě', 225],
];

const ADJUST = [
  ['−1 hod', -60],
  ['+1 hod', 60],
  ['−5 min', -5],
  ['+5 min', 5],
  ['+15 min', 15],
];

export default function LearnClock() {
  const [time, setTime] = useState(180); // 3:00
  const [task, setTask] = useState(465); // 7:45
  const [feedback, setFeedback] = useState(null);

  // On wide screens the dial is pinned next to the lessons, so it follows the lesson being read.
  // On narrow screens it sits below them, where jumping times would only confuse.
  const activeLesson = useActiveId(LESSON_IDS);
  useEffect(() => {
    if (activeLesson && window.matchMedia('(min-width: 1024px)').matches) {
      setTime(LESSONS[LESSON_IDS.indexOf(activeLesson)][4]);
      setFeedback(null);
    }
  }, [activeLesson]);

  const date = toDate(time);
  const words = toWords(date);
  const adjust = (delta) => {
    setTime((t) => (t + delta + HALF_DAY) % HALF_DAY);
    setFeedback(null);
  };
  const drag = (angle) => {
    setTime((t) => dragTo(t, angle));
    setFeedback(null);
  };
  const newTask = () => {
    setTask(randomTask());
    setFeedback(null);
  };
  const check = () =>
    setFeedback(
      time === task
        ? { ok: true, text: `Výborně! Je ${toWords(toDate(task))}. Čas máš v malíčku.` }
        : { ok: false, text: `Ještě ne. Teď máš nastaveno ${label(time)}, hledáme ${label(task)}.` },
    );

  return (
    <section id="nauc-se" className="py-space-xl border-t-2 border-on-surface bg-[#38BDF8]">
      <div className="max-w-[1380px] mx-auto px-4 md:px-margin">
        <div className="reveal text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-container text-on-primary-container chunky-border px-4 py-1.5 rounded-full chunky-shadow mb-3 font-label text-label-caps uppercase">
            <span className="icon text-[18px]" aria-hidden="true">school</span>
            Kapitola 8 • Škola času
          </div>
          <h2 className="font-display text-headline-xl-mobile md:text-headline-xl mb-2">Nauč se číst hodiny</h2>
          <p className="text-body-xl text-sky-950">
            Atomové hodiny řídí družice, ale na zdi, ve škole i na nádraží pořád visí ručičky. Za pět minut je přečteš — a pak si to vyzkoušíš v trenažéru.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 lg:row-start-1 flex flex-col gap-4">
            <h3 className="font-display text-headline-sm">Lekce krok za krokem</h3>
            <ol className="flex flex-col gap-4 lg:gap-20">
              {LESSONS.map(([title, text, badge, color], i) => (
                <li key={i} id={LESSON_IDS[i]} className="reveal bg-surface-container-lowest chunky-border rounded-xl p-4 chunky-shadow flex items-start gap-3">
                  <span className={`w-7 h-7 rounded-full font-bold flex items-center justify-center shrink-0 text-sm ${badge}`}>{i + 1}</span>
                  <div>
                    <h4 className={`font-display text-base font-bold ${color}`}>{title}</h4>
                    <p className="text-sm text-on-surface-variant">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-2 pt-3 border-t-2 border-sky-700/40">
              <p className="font-label text-xs block mb-2 uppercase">Klikni a předveď na hodinách:</p>
              <div className="grid grid-cols-2 gap-2">
                {DEMOS.map(([name, value]) => (
                  <button key={name} type="button" onClick={() => adjust(value - time)} className="chunky-btn bg-surface-container-lowest font-label text-xs py-2 px-3 rounded-lg text-left flex items-center justify-between">
                    Ukaž: {name} ({label(value)})
                    <span className="icon text-sm" aria-hidden="true">arrow_forward</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-start-6 lg:col-span-7 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-24">
            <div className="bg-surface-container-lowest chunky-border rounded-3xl p-5 md:p-8 chunky-shadow-lg flex flex-col items-center">
              <div className="w-full flex justify-between items-center pb-3 mb-4 border-b-2 border-on-surface">
                <span className="font-label text-label-caps text-primary uppercase">Interaktivní ciferník</span>
                <div className="flex items-center gap-4 text-xs font-label" aria-hidden="true">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500" /> Hodiny</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-600" /> Minuty</span>
                </div>
              </div>
              <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 my-2">
                <BigClock date={date} label={`Ručičkové hodiny ukazují ${words}`} onAngle={drag} />
              </div>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4" aria-live="polite">
                <div className="bg-surface-container chunky-border rounded-xl p-3 text-center">
                  <span className="text-xs font-label text-on-surface-variant uppercase">Slovy česky</span>
                  <p className="font-display text-headline-sm text-primary font-bold mt-1">{words}</p>
                </div>
                <div className="bg-surface-container chunky-border rounded-xl p-3 text-center">
                  <span className="text-xs font-label text-on-surface-variant uppercase">Digitálně (ráno / odpoledne)</span>
                  <p className="font-label text-2xl font-bold mt-1">
                    {label(time)} <span className="text-sm text-on-surface-variant font-normal">/ {label(time + HALF_DAY)}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-start-1 lg:col-span-5 lg:row-start-2 bg-surface-container-highest chunky-border rounded-3xl p-5 md:p-8 chunky-shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 mb-5 border-b-2 border-on-surface">
                <div>
                  <span className="font-label text-label-caps text-primary uppercase">Cvičení</span>
                  <h3 className="font-display text-headline-md">Zkus to sám!</h3>
                </div>
                <p className="flex items-center gap-2 bg-amber-300 chunky-border px-3.5 py-1.5 rounded-xl chunky-shadow-sm font-label text-sm font-bold">
                  <span className="icon text-lg" aria-hidden="true">flag</span>
                  Úkol: Nastav {label(task)}
                </p>
              </div>
              {/* On narrow screens the big dial is scrolled away by now, so the trainer gets its own copy. */}
              <div className="lg:hidden w-48 h-48 mx-auto mb-5" aria-hidden="true">
                <BigClock date={date} label="" onAngle={drag} />
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-6" role="group" aria-label="Posun ručiček">
                {ADJUST.map(([text, delta]) => (
                  <button key={text} type="button" onClick={() => adjust(delta)} className="chunky-btn bg-surface-container-lowest px-3 py-2 rounded-lg font-label text-xs">
                    {text}
                  </button>
                ))}
                <button type="button" onClick={newTask} className="chunky-btn bg-sky-200 text-sky-900 sm:ml-auto px-3 py-2 rounded-lg font-label text-xs flex items-center gap-1">
                  <span className="icon text-sm" aria-hidden="true">shuffle</span> Nový úkol
                </button>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button type="button" onClick={check} className="chunky-btn bg-primary-container text-on-primary font-display text-headline-sm px-6 py-3 rounded-xl w-full sm:w-auto whitespace-nowrap">
                  Zkontrolovat ✨
                </button>
                <p
                  aria-live="polite"
                  className={`text-sm font-bold ${feedback ? `p-2 rounded-lg chunky-border ${feedback.ok ? 'text-emerald-800 bg-emerald-100' : 'text-amber-900 bg-amber-100'}` : ''}`}
                >
                  {feedback ? feedback.text : 'Táhni dlouhou ručičku po ciferníku (nebo použij tlačítka) a stiskni Zkontrolovat.'}
                </p>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}
