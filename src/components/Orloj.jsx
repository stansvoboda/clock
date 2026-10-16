import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../scroll.js';
import { useNow } from '../useNow.js';
import { moonPhase } from '../clocks/moon.js';
import { Fact, SceneTitle, Step } from './Chapter.jsx';
import Icon from './Icon.jsx';

const CARDS = [
  ['Staročeský čas', <>Vnější prstenec se zlatými švabachovými číslicemi 1–24 se během roku natáčí tak, aby 24. hodina vždy padla na <strong>západ slunce</strong>.</>],
  ['Astronomický ciferník', 'Podklad představuje Zemi a nebe. Modrá část je den nad obzorem, hnědá a černá část dole znázorňují soumrak a noc.'],
  ['Měsíční koule a kalendárium', 'Dvoubarevná koulička se sama pootáčí a ukazuje fáze Měsíce. Malíř Josef Mánes později vyzdobil spodní kalendářní desku.'],
];

// The twelve apostles in the order they pass the two windows of the Prague Orloj, two at a time.
const APOSTLES = ['Petr', 'Matěj', 'Ondřej', 'Tomáš', 'Juda Tadeáš', 'Šimon', 'Bartoloměj', 'Barnabáš', 'Jakub', 'Pavel', 'Jan', 'Filip'];
const PAIR_MS = 500;

// One context for the whole page: browsers cap how many can exist, and each click used to open a new one.
let audio;

// Three bell strokes synthesized on the spot, so no audio file is needed.
function playBells() {
  audio ??= new AudioContext(); // created on the first click, as autoplay rules require a user gesture
  if (audio.state === 'suspended') audio.resume();
  [0, 0.9, 1.8].forEach((start) => {
    [[392, 0.3], [784, 0.15], [1080, 0.08]].forEach(([frequency, volume]) => {
      const tone = audio.createOscillator();
      const gain = audio.createGain();
      const at = audio.currentTime + start;
      tone.frequency.value = frequency;
      gain.gain.setValueAtTime(volume, at);
      gain.gain.exponentialRampToValueAtTime(0.001, at + 1.6);
      tone.connect(gain).connect(audio.destination);
      tone.start(at);
      tone.stop(at + 1.6);
    });
  });
}

export default function Orloj() {
  const [ringing, setRinging] = useState(false);
  const [pair, setPair] = useState(0);
  const now = useNow();
  // Like the real dial: noon at the top, the sun goes once round in 24 hours, the moon trails it by its phase.
  const sunAngle = (now.getHours() + now.getMinutes() / 60) * 15 - 180;
  const moonAngle = sunAngle - moonPhase(now) * 360;
  const dialRef = useRef(null);

  // Like the real Orloj, the apostles appear once by themselves when the dial comes into view.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setRinging(true);
      observer.disconnect();
    }, { threshold: 0.6 });
    observer.observe(dialRef.current);
    return () => observer.disconnect();
  }, []);

  // All six pairs of apostles pass the windows, then the show ends.
  useEffect(() => {
    if (!ringing) return;
    const step = setInterval(() => setPair((p) => p + 1), PAIR_MS);
    const end = setTimeout(() => setRinging(false), PAIR_MS * APOSTLES.length / 2);
    return () => {
      clearInterval(step);
      clearTimeout(end);
    };
  }, [ringing]);

  const ring = () => {
    setPair(0);
    setRinging(true);
    playBells();
  };
  const shown = [0, 1].map((i) => (pair * 2 + i) % APOSTLES.length);

  return (
    <section id="orloj" className="py-24 scroll-mt-16">
      <div className="max-w-stage mx-auto px-4 md:px-8">
        <SceneTitle title="Pražský orloj" when="1410" number={4} subtitle="Mistr Mikuláš z Kadaně" />
        <p className="mt-6 text-xl leading-relaxed max-w-[60ch]">
          Jeden z nejstarších dosud fungujících orlojů na světě. Neukazuje jen běžný čas, ale i pohyb Slunce, fáze Měsíce, zvěrokruh a staročeské hodiny.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 items-start">
          <div className="lg:col-span-7 mt-16 lg:sticky lg:top-28 flex flex-col items-center">
            {/* Death rings the bell while the apostles pass the two windows. */}
            <div className="flex items-end gap-4 sm:gap-6" aria-hidden="true">
              <Death swing={ringing ? (pair % 2 ? 12 : -12) : 0} />
              {shown.map((i) => (
                <div key={i % 2} className="screen hang [--cable:2.5rem] w-20 h-28 sm:w-24 sm:h-32 flex items-end justify-center overflow-hidden">
                  <Apostle index={i} up={ringing} />
                </div>
              ))}
              <span className="text-ink transition-transform duration-300" style={{ transform: `rotate(${ringing ? (pair % 2 ? -14 : 14) : 0}deg)` }}>
                <Icon name="bell" className="w-10 h-10" />
              </span>
            </div>
            <p className="mt-3 h-6 font-bold">{ringing ? shown.map((i) => `sv. ${APOSTLES[i]}`).join(' a ') : ''}</p>

            <div ref={dialRef} className="mt-4 w-72 h-72 sm:w-96 sm:h-96">
              <OrlojDial sunAngle={sunAngle} moonAngle={moonAngle} />
            </div>

            <div className="mt-8 flex flex-col items-center text-center">
              <button type="button" onClick={ring} disabled={ringing} className="cue cue-actor text-base px-8">
                <Icon name="bell" />
                Odbít orloj
              </button>
              <p className="mt-3 text-sm font-bold" aria-live="polite">
                {ringing ? 'Orloj odbíjí… Bim! Bam! Bim!' : 'Klikni, poslechni si zvony a sleduj apoštoly v okénkách'}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            {CARDS.map(([title, text]) => <Step key={title} title={title}>{text}</Step>)}
            <Fact>Podle pověsti dali konšelé orlojníka Hanuše oslepit, aby podobný orloj nepostavil nikde jinde. Ve skutečnosti orloj sestrojil Mikuláš z Kadaně a Hanuš ho jen o 80 let později opravoval.</Fact>
          </div>
        </div>
      </div>
    </section>
  );
}

const ROBES = ['#D2381F', '#2D5BD2', '#F4B23E', '#5CC9B0', '#BFA6EE', '#F0935A'];

// A flat cut-out apostle that rises into the window when the orloj strikes.
function Apostle({ index, up }) {
  return (
    <svg viewBox="0 0 60 90" className="w-14 sm:w-16 transition-transform duration-300 ease-out" style={{ transform: up ? 'translateY(0)' : 'translateY(18%)' }}>
      <path d="M12 90L18 44H42L48 90Z" fill={ROBES[index % ROBES.length]} />
      <path d="M18 44Q30 36 42 44L40 52H20Z" fill="#221F2B" opacity="0.25" />
      <circle cx="30" cy="30" r="12" fill="#F2C9A0" />
      <path d="M17 26Q30 8 43 26Q30 20 17 26Z" fill="#221F2B" />
    </svg>
  );
}

// Death, pulling the bell rope.
function Death({ swing }) {
  return (
    <svg viewBox="0 0 50 90" className="w-12 h-20 transition-transform duration-300 origin-bottom" style={{ transform: `rotate(${swing}deg)` }}>
      <circle cx="25" cy="16" r="12" fill="#FBFAF5" />
      <circle cx="20" cy="15" r="3" fill="#221F2B" />
      <circle cx="30" cy="15" r="3" fill="#221F2B" />
      <rect x="20" y="24" width="10" height="5" fill="#FBFAF5" />
      <path d="M25 30V62M14 38H36M16 44H34M17 50H33M25 62L16 88M25 62L34 88M36 38L44 20" stroke="#FBFAF5" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// U+FE0E asks for the text glyph, not the emoji tile.
const ZODIAC = [['♈\uFE0E', 0], ['♋\uFE0E', 90], ['♎\uFE0E', 180], ['♑\uFE0E', 270]];

// Stylised astronomical dial: day sky above, dusk and night below the horizon, the zodiac ring off centre.
function OrlojDial({ sunAngle, moonAngle }) {
  const rotate = (angle) => ({ transform: `rotate(${angle}deg)`, transformOrigin: '150px 150px' });
  return (
    <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_24px_24px_rgb(34_31_43_/_0.35)]" role="img" aria-label="Stylizovaný astronomický ciferník Pražského orloje">
      <clipPath id="orloj-sky"><circle cx="150" cy="150" r="128" /></clipPath>
      <circle cx="150" cy="150" r="148" fill="#F4B23E" />
      {Array.from({ length: 24 }, (_, i) => (
        <line key={i} x1="150" y1="4" x2="150" y2="16" stroke="#221F2B" strokeWidth="2" transform={`rotate(${i * 15} 150 150)`} />
      ))}
      <g clipPath="url(#orloj-sky)">
        <rect width="300" height="300" fill="#4A86D0" />
        <circle cx="150" cy="268" r="122" fill="#8A5A3B" />
        <circle cx="150" cy="280" r="104" fill="#221F2B" />
      </g>
      {[96, 66, 38].map((r) => <circle key={r} cx="150" cy="150" r={r} fill="none" stroke="#F7D154" strokeWidth="1.2" opacity="0.7" />)}
      <circle cx="162" cy="160" r="74" fill="none" stroke="#F7D154" strokeWidth="3" />
      <g fill="#F7D154" fontSize="14" textAnchor="middle" dominantBaseline="central">
        {ZODIAC.map(([sign, angle]) => {
          const rad = (angle * Math.PI) / 180;
          return <text key={sign} x={162 + 74 * Math.sin(rad)} y={160 - 74 * Math.cos(rad)}>{sign}</text>;
        })}
      </g>
      <g className="wide font-bold" fontSize="12" fill="#F7D154" textAnchor="middle" dominantBaseline="central">
        <text x="150" y="34">XII</text>
        <text x="266" y="150">VI</text>
        <text x="150" y="266">XII</text>
        <text x="34" y="150">VI</text>
      </g>
      <g style={rotate(moonAngle)}>
        <line x1="150" y1="150" x2="150" y2="68" stroke="#C9C6D2" strokeWidth="3" />
        <circle cx="150" cy="60" r="10" fill="#221F2B" stroke="#C9C6D2" strokeWidth="2" />
        <path d="M150 50A10 10 0 0 1 150 70Z" fill="#FBFAF5" />
      </g>
      <g style={rotate(sunAngle)}>
        <line x1="150" y1="150" x2="150" y2="22" stroke="#F7D154" strokeWidth="4" />
        <circle cx="150" cy="40" r="11" fill="#F7D154" />
      </g>
      <circle cx="150" cy="150" r="9" fill="#F4B23E" stroke="#221F2B" strokeWidth="2" />
    </svg>
  );
}
