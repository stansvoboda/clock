import { useRef, useState } from 'react';
import { prefersReducedMotion, useScrollProgress } from '../scroll.js';

const INK = '#1c1c17';

// Every illustration is drawn from `p`, the scroll progress through its chapter (0–1).

function WaterArt({ p }) {
  // Water drains from the upper vessel into the lower one; the drip is visible while it flows.
  const fill = { transformBox: 'fill-box', transformOrigin: 'bottom' };
  return (
    <svg viewBox="0 0 200 220" className="w-full h-full">
      <path d="M40 20H160L140 90H60Z" fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <clipPath id="upper"><path d="M40 20H160L140 90H60Z" /></clipPath>
      {/* The clip sits on a wrapper so it doesn't scale with the water. */}
      <g clipPath="url(#upper)">
        <rect x="30" y="20" width="140" height="70" fill="#0EA5E9" style={{ ...fill, transform: `scaleY(${1 - p * 0.9})` }} />
        {[30, 45, 60, 75].map((y) => <line key={y} x1="136" y1={y} x2="156" y2={y} stroke={INK} strokeWidth="2" />)}
      </g>
      <circle cx="100" cy="112" r="5" fill="#0EA5E9" stroke={INK} strokeWidth="2" style={{ opacity: p < 0.98 ? 1 : 0, transform: `translateY(${(p * 1000) % 40}px)` }} />
      <path d="M50 150H150L140 200H60Z" fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <clipPath id="lower"><path d="M50 150H150L140 200H60Z" /></clipPath>
      <g clipPath="url(#lower)">
        <rect x="40" y="150" width="120" height="50" fill="#0EA5E9" style={{ ...fill, transform: `scaleY(${0.1 + p * 0.8})` }} />
      </g>
    </svg>
  );
}

function Gear({ cx, cy, r, teeth, angle, color }) {
  return (
    <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: `${cx}px ${cy}px` }}>
      {Array.from({ length: teeth }, (_, i) => (
        <rect key={i} x={cx - 6} y={cy - r - 10} width="12" height="16" rx="2" fill={color} stroke={INK} strokeWidth="3" transform={`rotate(${(360 / teeth) * i} ${cx} ${cy})`} />
      ))}
      <circle cx={cx} cy={cy} r={r} fill={color} stroke={INK} strokeWidth="3" />
      <circle cx={cx} cy={cy} r={r * 0.3} fill="#fff" stroke={INK} strokeWidth="3" />
    </g>
  );
}

function GearsArt({ p }) {
  // The falling weight turns the big gear; the small one meshes and turns the other way, faster.
  const turn = p * 360;
  return (
    <svg viewBox="0 0 200 220" className="w-full h-full">
      <line x1="40" y1="70" x2="40" y2={110 + p * 70} stroke={INK} strokeWidth="3" />
      <rect x="26" y={110 + p * 70} width="28" height="30" rx="4" fill="#78350F" stroke={INK} strokeWidth="3" />
      <Gear cx={75} cy={70} r={40} teeth={12} angle={turn} color="#EA580C" />
      <Gear cx={147} cy={124} r={24} teeth={7} angle={-turn * (12 / 7) + 13} color="#FDBA74" />
    </svg>
  );
}

function PendulumArt({ p }) {
  // Eight full swings over the chapter; every half swing ticks the hand one step.
  const swing = 22 * Math.sin(p * 16 * Math.PI);
  const ticks = Math.floor(p * 16);
  return (
    <svg viewBox="0 0 200 220" className="w-full h-full">
      <circle cx="100" cy="60" r="44" fill="#fff" stroke={INK} strokeWidth="4" />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1="100" y1="20" x2="100" y2="27" stroke={INK} strokeWidth="3" transform={`rotate(${i * 30} 100 60)`} />)}
      <line x1="100" y1="60" x2="100" y2="26" stroke="#E11D48" strokeWidth="4" strokeLinecap="round" style={{ transform: `rotate(${ticks * 6}deg)`, transformOrigin: '100px 60px' }} />
      <circle cx="100" cy="60" r="5" fill={INK} />
      <g style={{ transform: `rotate(${swing}deg)`, transformOrigin: '100px 108px' }}>
        <line x1="100" y1="108" x2="100" y2="186" stroke={INK} strokeWidth="4" />
        <circle cx="100" cy="192" r="16" fill="#E11D48" stroke={INK} strokeWidth="4" />
      </g>
      <circle cx="100" cy="108" r="5" fill={INK} />
    </svg>
  );
}

// Segments a–g of a seven-segment digit: [x, y, width, height] in a 30 × 54 box.
const SEGMENTS = { a: [5, 0, 20, 5], b: [25, 5, 5, 20], c: [25, 29, 5, 20], d: [5, 49, 20, 5], e: [0, 29, 5, 20], f: [0, 5, 5, 20], g: [5, 24.5, 20, 5] };
const DIGITS = { 1: 'bc', 2: 'abdeg', 0: 'abcdef' };
const DISPLAY = ['1', '2', '0', '0']; // 12:00, blinking on like a new watch
const DISPLAY_SEGMENTS = DISPLAY.reduce((sum, digit) => sum + DIGITS[digit].length, 0);

function QuartzArt({ p }) {
  // The display fills in one segment at a time.
  const lit = Math.round(p * DISPLAY_SEGMENTS);
  let index = 0;
  return (
    <svg viewBox="0 0 200 220" className="w-full h-full">
      <rect x="40" y="10" width="120" height="30" rx="6" fill="#A855F7" stroke={INK} strokeWidth="3" />
      <rect x="40" y="180" width="120" height="30" rx="6" fill="#A855F7" stroke={INK} strokeWidth="3" />
      <rect x="20" y="40" width="160" height="140" rx="28" fill="#3B0764" stroke={INK} strokeWidth="4" />
      <rect x="34" y="72" width="132" height="76" rx="8" fill="#1c1917" stroke={INK} strokeWidth="3" />
      {DISPLAY.map((digit, i) => (
        <g key={i} transform={`translate(${44 + i * 30 + (i > 1 ? 12 : 0)} 83) scale(0.75 1)`}>
          {Object.entries(SEGMENTS).map(([name, [x, y, w, h]]) => {
            const on = DIGITS[digit].includes(name) && index++ < lit;
            return <rect key={name} x={x} y={y} width={w} height={h} rx="2" fill={on ? '#F87171' : '#3f1d1d'} />;
          })}
        </g>
      ))}
      <circle cx="100" cy="100" r="3" fill={p > 0.5 ? '#F87171' : '#3f1d1d'} />
      <circle cx="100" cy="120" r="3" fill={p > 0.5 ? '#F87171' : '#3f1d1d'} />
    </svg>
  );
}

const CAESIUM = '9192631770';

function AtomArt({ p }) {
  // Digits lock in from left to right; the rest keep scrambling until the scroll catches up.
  const locked = Math.floor(p * (CAESIUM.length + 1));
  const number = [...CAESIUM].map((d, i) => (i < locked ? d : (Number(d) + Math.floor(p * 97) * (i + 3)) % 10)).join('');
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
      <svg viewBox="0 0 200 200" className="w-full flex-1 min-h-0">
        {[0, 60, 120].map((tilt) => (
          <g key={tilt} style={{ transform: `rotate(${tilt + p * 180}deg)`, transformOrigin: '100px 100px' }}>
            <ellipse cx="100" cy="100" rx="85" ry="28" fill="none" stroke={INK} strokeWidth="4" />
            <circle cx="185" cy="100" r="8" fill="#FACC15" stroke={INK} strokeWidth="3" />
          </g>
        ))}
        <circle cx="100" cy="100" r="20" fill="#15803D" stroke={INK} strokeWidth="4" />
      </svg>
      <p className="font-label font-bold text-xl md:text-2xl tabular-nums tracking-wider bg-white chunky-border rounded-lg px-3 py-1">
        {number.slice(0, 1)} {number.slice(1, 4)} {number.slice(4, 7)} {number.slice(7)}
      </p>
    </div>
  );
}

export const CHAPTERS = [
  {
    id: 'voda', when: 'cca 1400 př. n. l.', title: 'Voda a písek', error: 'Chyba: ~15 minut denně', Art: WaterArt,
    bg: '#38BDF8', chip: 'bg-sky-200', ink: 'text-sky-950', subtitle: 'Hodiny, které jdou i v noci',
    steps: [
      ['Nádoba s dírkou', 'Klepsydra je nádoba s malou dírkou u dna. Voda odkapává pořád stejně rychle a rysky na stěně ukazují, kolik času uplynulo.'],
      ['I v noci a pod mrakem', 'Na rozdíl od stínu klepsydra nepotřebuje slunce. Ve starých Athénách odměřovala řečníkům u soudu, jak dlouho smějí mluvit.'],
      ['Přesýpací hodiny', 'Písek místo vody přišel až ve středověku. Hodil se na lodě, kde by voda na vlnách šplouchala.'],
    ],
  },
  {
    id: 'ozubena-kola', when: 'konec 13. století', title: 'Ozubená kola', error: 'Chyba: ~10 minut denně', Art: GearsArt,
    bg: '#FB923C', chip: 'bg-orange-200', ink: 'text-orange-950', subtitle: 'Hodiny poháněné závažím',
    steps: [
      ['Padající závaží', 'Závaží na laně pomalu klesá a roztáčí ozubená kola. Kola převádějí jeho pohyb až na ručičku nebo na zvon.'],
      ['Tik, tak', 'Samo by závaží spadlo hned. Brzdí ho kroková zarážka s lihýřem, takže kola popojíždějí po malých krůčcích.'],
      ['Hodiny na věži', 'První mechanické hodiny stály ve věžích klášterů a radnic. Často neměly ani ciferník, jen odbíjely.'],
    ],
  },
  {
    id: 'kyvadlo', when: '1656', title: 'Kyvadlo', error: 'Chyba: ~10 sekund denně', Art: PendulumArt,
    bg: '#FB7185', chip: 'bg-rose-200', ink: 'text-rose-950', subtitle: 'Z minut na sekundy',
    steps: [
      ['Pořád stejně dlouho', 'Galileo Galilei si všiml, že kyvadlo se houpe pořád stejně dlouho — ať kmitá víc, nebo míň.'],
      ['Huygensovy hodiny', 'Christiaan Huygens v roce 1656 postavil první kyvadlové hodiny. Každý kyv pustí ozubené kolo o jeden zub dál.'],
      ['Najednou přesně', 'Chyba klesla z mnoha minut na pár sekund denně. Hodiny konečně dostaly i minutovou ručičku.'],
    ],
  },
  {
    id: 'kremen', when: '1927', title: 'Křemen a elektřina', error: 'Chyba: ~1 sekunda za měsíc', Art: QuartzArt,
    bg: '#C084FC', chip: 'bg-purple-200', ink: 'text-purple-950', subtitle: 'Krystal, který se chvěje',
    steps: [
      ['Chvějící se krystal', 'Když do křemenného krystalu pustíš elektrický proud, začne se chvět. V hodinkách přesně 32 768krát za sekundu.'],
      ['Velké jako skříň', 'První křemenné hodiny postavili v roce 1927 v Bellových laboratořích v USA. Zabraly celou skříň.'],
      ['Svítící číslice', 'V 70. letech se křemen vešel do hodinek. Digitální hodinky ukazovaly čas na displeji ze sedmi dílků.'],
    ],
  },
  {
    id: 'atom', when: '1955', title: 'Atomové hodiny', error: 'Dnes: 1 s za 100 mil. let', Art: AtomArt,
    bg: '#4ADE80', chip: 'bg-green-200', ink: 'text-green-950', subtitle: 'Nejpřesnější čas na světě',
    steps: [
      ['Tep atomu', 'Louis Essen a Jack Parry v Londýně v roce 1955 sestrojili první hodiny řízené atomy cesia.'],
      ['Nová sekunda', 'Od roku 1967 je jedna sekunda přesně 9 192 631 770 kmitů atomu cesia. Ne den, ale atom určuje, jak dlouhá sekunda je.'],
      ['Čas pro celý svět', 'Podle atomových hodin se řídí družice GPS, mobilní sítě i internet. Tvůj telefon si s nimi čas sám porovnává.'],
    ],
  },
];

// A pinned illustration that plays as the chapter's story steps scroll past it.
export default function Chapter({ id, number, when, title, subtitle, error, steps, bg, chip, ink, Art }) {
  // Same scroll targets as the sundial: the whole section where the art is pinned, the art itself on narrow screens.
  // shortcut: breakpoint is read once on mount, resizing across 1024px keeps the old target until reload.
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const [wide] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  const progress = useScrollProgress(wide ? sectionRef : stageRef);
  const p = progress === null || prefersReducedMotion() ? 1 : progress;
  const flip = number % 2 === 1; // alternate sides on wide screens

  return (
    <section id={id} ref={sectionRef} className="py-space-xl border-t-2 border-on-surface scroll-mt-16" style={{ backgroundColor: bg }}>
      <div className="max-w-[1380px] mx-auto px-4 md:px-margin">
        <div className="flex flex-wrap items-center gap-3 mb-space-lg">
          <span className={`px-4 py-1.5 rounded-full ${chip} chunky-border font-label text-label-caps chunky-shadow-sm`}>{when}</span>
          <span className={`text-caption ${ink}`}>Kapitola {number} • {subtitle}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className={`lg:col-span-5 flex flex-col gap-6 ${flip ? 'lg:order-last' : ''}`}>
            <h2 className="font-display text-headline-xl-mobile md:text-headline-xl">{number}. {title}</h2>
            {steps.map(([heading, text], i) => (
              <div key={heading} className="reveal lg:min-h-[32svh] lg:flex lg:items-center">
                <div className="bg-surface-container-lowest chunky-border rounded-2xl p-5 chunky-shadow flex items-start gap-4">
                  <span className={`w-8 h-8 rounded-full ${chip} chunky-border font-label text-label-caps flex items-center justify-center shrink-0`}>{i + 1}</span>
                  <div>
                    <h3 className="font-display text-headline-sm mb-1">{heading}</h3>
                    <p className="text-on-surface-variant">{text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-7 bg-surface-container-lowest chunky-border rounded-3xl p-5 md:p-8 chunky-shadow-lg lg:sticky lg:top-24">
            <div ref={stageRef} className="h-[280px] md:h-[380px] rounded-2xl chunky-border bg-surface-container p-4" aria-hidden="true">
              <Art p={p} />
            </div>
            <p className={`mt-4 text-center font-label font-bold text-sm ${chip} chunky-border rounded-lg py-2`}>{error}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
