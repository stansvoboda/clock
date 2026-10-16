import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion, useActiveId } from '../scroll.js';
import { BigClock, Dial } from './AnalogClock.jsx';
import { SceneTitle } from './Chapter.jsx';
import Icon from './Icon.jsx';
import { toWords } from '../clocks/words.js';
import { dragTo } from '../clocks/dial.js';
import { diagnose, label, lessonFor, taskText } from '../clocks/quiz.js';

const HALF_DAY = 12 * 60;
const TASK_MINUTES = [0, 15, 30, 45, 10, 20, 40, 50];

// Time on the lesson dial is kept as minutes after 12:00 (0–719).
const toDate = (total) => new Date(2026, 0, 1, Math.floor(total / 60), total % 60);
const randomTask = () =>
  Math.floor(Math.random() * 12) * 60 + TASK_MINUTES[Math.floor(Math.random() * TASK_MINUTES.length)];

const LESSONS = [
  ['Krátká tlustá ručička = HODINY', 'Pohybuje se pomalu. Za celý den oběhne ciferník dvakrát (2 × 12 = 24 hodin).', 'text-[#A52A15]', 180],
  ['Dlouhá štíhlá ručička = MINUTY', 'Pohybuje se rychleji. Za jednu hodinu oběhne celý kruh (60 minut).', 'text-[#1F3F99]', 180],
  ['Celá hodina (např. 3:00)', <>Dlouhá modrá ručička míří <strong>přesně nahoru na 12</strong>. Krátká ukazuje hodinu: „tři hodiny“.</>, '', 180],
  ['Půl (např. 3:30 = půl čtvrté)', <>Dlouhá ručička míří <strong>dolů na 6</strong>. Krátká je v půli cesty mezi 3 a 4 — proto česky říkáme <strong>půl čtvrté</strong>, ne „půl třetí“.</>, '', 210],
  ['Čtvrt a tři čtvrtě', <>3:15 je <strong>čtvrt na čtyři</strong> (dlouhá ručička na 3). 3:45 je <strong>tři čtvrtě na čtyři</strong> (dlouhá ručička na 9).</>, '', 195],
  ['Minuty po pěti', 'Každé číslo na ciferníku znamená 5 minut: na 1 je 5 minut, na 2 je 10 minut, na 4 je 20 minut…', '', 200],
];
// Each lesson shows its example on the dial (minutes after 12:00) as you read it.
const LESSON_IDS = LESSONS.map((_, i) => `lekce-${i + 1}`);

const DEMOS = [
  ['Celá', 180],
  ['Čtvrt', 195],
  ['Půl', 210],
  ['Tři čtvrtě', 225],
];

// Swatches echo the hands: short thick red for hours, long thin blue for minutes.
const HOUR_SWATCH = 'w-4 h-2.5 bg-actor';
const MINUTE_SWATCH = 'w-6 h-1.5 bg-film';
const ADJUST = [
  ['−1 hod', -60, HOUR_SWATCH],
  ['+1 hod', 60, HOUR_SWATCH],
  ['−5 min', -5, MINUTE_SWATCH],
  ['+5 min', 5, MINUTE_SWATCH],
  ['+15 min', 15, MINUTE_SWATCH],
];

export default function LearnClock() {
  const [time, setTime] = useState(180); // 3:00
  const [task, setTask] = useState(465); // 7:45
  const [round, setRound] = useState(0); // odd rounds ask in Czech words
  const [misses, setMisses] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const bigDial = useRef(null);

  // On wide screens the dial is pinned next to the lessons, so it follows the lesson being read.
  // On narrow screens it sits below them, where jumping times would only confuse.
  const activeLesson = useActiveId(LESSON_IDS);
  useEffect(() => {
    if (activeLesson && window.matchMedia('(min-width: 1024px)').matches) {
      setTime(LESSONS[LESSON_IDS.indexOf(activeLesson)][3]);
      setFeedback(null);
    }
  }, [activeLesson]);

  const date = toDate(time);
  const words = toWords(date);
  const adjust = (delta) => {
    setTime((t) => (t + delta + HALF_DAY) % HALF_DAY);
    setFeedback(null);
  };
  const drag = (angle, hand) => {
    setTime((t) => dragTo(t, angle, hand));
    setFeedback(null);
  };
  // Below lg the big dial sits under the demo buttons, so bring it into view when a demo moves it.
  const demo = (value) => {
    adjust(value - time);
    if (!window.matchMedia('(min-width: 1024px)').matches) {
      bigDial.current.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }
  };
  const newTask = () => {
    setTask(randomTask());
    setRound((r) => r + 1);
    setMisses(0);
    setFeedback(null);
  };
  const check = () => {
    const hint = diagnose(time, task);
    if (hint) setMisses((m) => m + 1);
    setFeedback(hint ? { ok: false, text: hint } : { ok: true, text: `Výborně! ${label(task)} je ${toWords(toDate(task))}.` });
  };
  const lesson = lessonFor(task);

  return (
    <section id="nauc-se" className="py-24 scroll-mt-16">
      <div className="max-w-stage mx-auto px-4 md:px-8">
        <SceneTitle title="Nauč se číst hodiny" number={10} subtitle="Škola času" />
        <p className="mt-6 text-xl leading-relaxed max-w-[60ch]">
          Atomové hodiny řídí družice, ale na zdi, ve škole i na nádraží pořád visí ručičky. Za pět minut je přečteš — a pak si to vyzkoušíš v trenažéru.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 items-start">
          <div className="lg:col-span-5 lg:row-start-1">
            <h3 className="font-display font-extrabold text-2xl mt-12">Lekce krok za krokem</h3>
            <ol className="flex flex-col lg:gap-16">
              {LESSONS.map(([title, text, color, example], i) => (
                <li key={i} id={LESSON_IDS[i]} className="pt-10 max-w-[40ch] scroll-mt-20">
                  <h4 className={`font-display font-extrabold text-2xl leading-tight mb-1 ${color}`}>{title}</h4>
                  <p className="text-lg leading-relaxed">{text}</p>
                  {/* Below lg the big dial is far away, so each lesson carries its own example. */}
                  <div className="lg:hidden w-40 h-40 sm:w-48 sm:h-48 mt-4 drop-shadow-[0_24px_24px_rgb(34_31_43_/_0.35)]">
                    <Dial date={toDate(example)} label={`Hodiny ukazují ${toWords(toDate(example))}`} />
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-10 pt-4 border-t-2 border-ink">
              <p className="font-bold mb-3">Klikni a předveď na hodinách:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DEMOS.map(([name, value]) => (
                  <button key={name} type="button" onClick={() => demo(value)} className="cue justify-between normal-case">
                    Ukaž: {name} ({label(value)})
                    <Icon name="right" className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* The performer steps out of the film: this dial is the child's to move. */}
          <div ref={bigDial} className="lg:col-start-6 lg:col-span-7 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-24 mt-16 flex flex-col items-center scroll-mb-4">
            <div className="w-72 h-72 sm:w-[26rem] sm:h-[26rem] drop-shadow-[0_28px_28px_rgb(34_31_43_/_0.35)]">
              <BigClock date={date} label={`Ručičkové hodiny ukazují ${words}`} onAngle={drag} />
            </div>
            <div className="mt-4 flex items-center gap-6 text-sm font-bold" aria-hidden="true">
              <span className="flex items-center gap-2"><span className="w-6 h-2.5 bg-actor" /> Hodiny</span>
              <span className="flex items-center gap-2"><span className="w-8 h-1.5 bg-film" /> Minuty</span>
            </div>
            <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="surtitle text-center py-3">
                <span className="text-sm opacity-80">Slovy česky</span>
                <p className="font-display font-extrabold text-2xl mt-1">{words}</p>
              </div>
              <div className="surtitle text-center py-3">
                <span className="text-sm opacity-80">Digitálně (ráno / odpoledne)</span>
                <p className="wide text-2xl mt-1 tabular-nums">
                  {label(time)} <span className="text-base opacity-75">/ {label(time + HALF_DAY)}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-start-1 lg:col-span-5 lg:row-start-2 mt-20">
            <div className="screen hang p-6 sm:p-8 [--cable:4rem]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pb-4 mb-5 border-b-2 border-ink">
                <div>
                  <h3 className="cond text-5xl">Zkus to sám!</h3>
                  <p className="text-sm mt-1">Cvičení</p>
                </div>
                <p className="bg-actor text-white px-3 py-1.5 font-display font-extrabold text-lg">Úkol: Nastav {taskText(task, round % 2 === 1)}</p>
              </div>
              {/* On narrow screens the big dial is scrolled away by now, so the trainer gets its own copy. */}
              <div className="lg:hidden w-64 h-64 min-[400px]:w-72 min-[400px]:h-72 sm:w-80 sm:h-80 mx-auto mb-5" aria-hidden="true">
                <BigClock date={date} label="" onAngle={drag} />
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-6" role="group" aria-label="Posun ručiček">
                {ADJUST.map(([text, delta, swatch]) => (
                  <button key={text} type="button" onClick={() => adjust(delta)} className="cue normal-case font-body text-base tracking-normal tabular-nums">
                    <span className={swatch} aria-hidden="true" /> {text}
                  </button>
                ))}
                <button type="button" onClick={newTask} className="cue normal-case sm:ml-auto">
                  <Icon name="shuffle" className="w-4 h-4" /> Nový úkol
                </button>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button type="button" onClick={check} className="cue cue-actor text-base px-8 py-3 whitespace-nowrap">
                  Zkontrolovat
                </button>
                <p aria-live="polite" className={`font-bold ${feedback ? `px-3 py-2 ${feedback.ok ? 'bg-[#92DB97]' : 'bg-[#F7D154]'}` : ''}`}>
                  {feedback ? feedback.text : 'Táhni prstem po ciferníku: u kraje točíš dlouhou ručičkou, blíž středu krátkou. Pak stiskni Zkontrolovat.'}
                  {feedback && !feedback.ok && misses >= 2 && (
                    <a href={`#${LESSON_IDS[lesson]}`} className="block mt-1 underline underline-offset-4">
                      Nápověda: lekce „{LESSONS[lesson][0]}“
                    </a>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
