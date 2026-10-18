import { useRef, useState } from 'react';
import { prefersReducedMotion, useScrollProgress } from '../scroll.js';
import { Balance, GearsArt, PendulumArt } from './Mechanisms.jsx';

const INK = '#221F2B';

// Every illustration is drawn from `p`, the scroll progress through its chapter (0–1).

function WaterArt({ p }) {
  // Water drains from the upper vessel into the lower one; the drip is visible while it flows.
  const fill = { transformBox: 'fill-box', transformOrigin: 'bottom' };
  return (
    <svg viewBox="0 0 200 220" className="w-full h-full">
      <path d="M40 20H160L140 90H60Z" fill="#FBFAF5" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <clipPath id="upper"><path d="M40 20H160L140 90H60Z" /></clipPath>
      {/* The clip sits on a wrapper so it doesn't scale with the water. */}
      <g clipPath="url(#upper)">
        <rect x="30" y="20" width="140" height="70" fill="#2D5BD2" style={{ ...fill, transform: `scaleY(${1 - p * 0.9})` }} />
        {[30, 45, 60, 75].map((y) => <line key={y} x1="136" y1={y} x2="156" y2={y} stroke={INK} strokeWidth="2" />)}
      </g>
      <circle cx="100" cy="112" r="5" fill="#2D5BD2" stroke={INK} strokeWidth="2" style={{ opacity: p < 0.98 ? 1 : 0, transform: `translateY(${(p * 1000) % 40}px)` }} />
      <path d="M50 150H150L140 200H60Z" fill="#FBFAF5" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <clipPath id="lower"><path d="M50 150H150L140 200H60Z" /></clipPath>
      <g clipPath="url(#lower)">
        <rect x="40" y="150" width="120" height="50" fill="#2D5BD2" style={{ ...fill, transform: `scaleY(${0.1 + p * 0.8})` }} />
      </g>
    </svg>
  );
}

// Segments a–g of a seven-segment digit: [x, y, width, height] in a 30 × 54 box.
const SEGMENTS = { a: [5, 0, 20, 5], b: [25, 5, 5, 20], c: [25, 29, 5, 20], d: [5, 49, 20, 5], e: [0, 29, 5, 20], f: [0, 5, 5, 20], g: [5, 24.5, 20, 5] };
const DIGITS = { 0: 'abcdef', 1: 'bc', 2: 'abdeg', 3: 'abcdg', 4: 'bcfg', 5: 'acdfg', 6: 'acdefg', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' };
const QUARTZ_HZ = 32768;
const STAGES = 15; // 2^15 = 32 768, so fifteen halvings leave exactly one tick a second
const QUARTZ_SECONDS = 9.99; // watch time that passes over the whole chapter

function QuartzArt({ p }) {
  // The crystal fork hums 32 768 times a second; each divider stage flips at half the speed of the one
  // before it, the last flips once a second and steps the display (and blinks its colon).
  const t = p * QUARTZ_SECONDS;
  const hum = 1.5 * Math.sin(p * 4000); // far too fast to see, so it just shimmers
  const display = `000${Math.floor(t)}`;
  const colon = Math.floor(t * 2) % 2 === 0;
  return (
    <svg viewBox="0 0 200 220" className="w-full h-full">
      <path d={`M${92 - hum} 10L92 46Q92 56 100 56Q108 56 108 46L${108 + hum} 10`} fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M${92 - hum} 10L92 46Q92 56 100 56Q108 56 108 46L${108 + hum} 10`} fill="none" stroke="#FBFAF5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="100" y1="57" x2="100" y2="72" stroke={INK} strokeWidth="2.5" />
      <text x="116" y="30" fontSize="9" fontWeight="700" fill={INK}>32 768 Hz</text>

      {Array.from({ length: STAGES }, (_, i) => {
        const hz = QUARTZ_HZ / 2 ** (i + 1);
        const on = Math.floor(t * 2 * hz) % 2 === 0;
        // Stages faster than a few flips a second blur, as they would to the eye.
        const fill = hz > 4 ? '#B08A4E' : on ? '#F4B23E' : '#4A4556';
        return <rect key={i} x={6 + i * 12.6} y="74" width="10" height="12" rx="2" fill={fill} stroke={INK} strokeWidth="1.5" />;
      })}
      <line x1="11" y1="72" x2="100" y2="72" stroke={INK} strokeWidth="2.5" />
      <text x="6" y="98" fontSize="8" fontWeight="700" fill={INK}>÷2 ÷2 ÷2 …</text>
      <text x="183" y="98" fontSize="8" fontWeight="700" fill={INK} textAnchor="end">1 Hz</text>
      <line x1="187" y1="87" x2="187" y2="122" stroke={INK} strokeWidth="2.5" />

      <rect x="20" y="112" width="160" height="96" rx="24" fill="#221F2B" stroke={INK} strokeWidth="3" />
      <rect x="34" y="128" width="132" height="64" rx="8" fill="#3A3646" stroke={INK} strokeWidth="3" />
      {[...display.slice(-4)].map((digit, i) => (
        <g key={i} transform={`translate(${44 + i * 30 + (i > 1 ? 12 : 0)} 137) scale(0.75 0.85)`}>
          {Object.entries(SEGMENTS).map(([name, [x, y, w, h]]) => (
            <rect key={name} x={x} y={y} width={w} height={h} rx="2" fill={DIGITS[digit].includes(name) ? '#FF7A5C' : '#4A4556'} />
          ))}
        </g>
      ))}
      <circle cx="100" cy="152" r="3" fill={colon ? '#FF7A5C' : '#4A4556'} />
      <circle cx="100" cy="168" r="3" fill={colon ? '#FF7A5C' : '#4A4556'} />
    </svg>
  );
}

function ChronometerArt({ p }) {
  // The ship rocks on the waves, yet the balance inside the watch keeps its own steady swing: gravity
  // does not drive it as it drives a pendulum, so the rocking cannot upset it.
  const rock = 8 * Math.sin(p * 12 * Math.PI);
  const swing = 150 * Math.sin(p * 40 * Math.PI);
  return (
    <svg viewBox="0 0 200 220" className="w-full h-full">
      <rect x="92" y="6" width="16" height="12" rx="3" fill="#F4B23E" stroke={INK} strokeWidth="3" />
      <circle cx="100" cy="62" r="46" fill="#FBFAF5" stroke={INK} strokeWidth="3" />
      <Balance cx={100} cy={62} r={34} swing={swing} />
      <g style={{ transform: `rotate(${rock}deg)`, transformOrigin: '100px 180px' }}>
        <line x1="100" y1="160" x2="100" y2="116" stroke={INK} strokeWidth="3" />
        <path d="M105 120V155H138Z" fill="#FBFAF5" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M50 160H150L135 188H65Z" fill="#221F2B" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      </g>
      {/* The svg is wider than its viewBox on wide stages, so the sea runs far past both edges. */}
      <path d={`M-400 192${' q10 -10 20 0'.repeat(50)} V230 H-400Z`} fill="#2D5BD2" stroke={INK} strokeWidth="3" style={{ transform: `translateX(${(p * 400) % 20}px)` }} />
    </svg>
  );
}

function TrainArt({ p }) {
  // Every town's clock starts on its own local time; as the train arrives they all agree.
  const apart = Math.max(0, 1 - p * 1.4);
  return (
    <svg viewBox="0 0 200 220" className="w-full h-full">
      {[-40, 0, 32].map((offset, i) => {
        const cx = 40 + i * 60;
        const minute = (offset * apart + 360) % 360;
        return (
          <g key={cx}>
            <line x1={cx} y1="78" x2={cx} y2="110" stroke={INK} strokeWidth="3" />
            <circle cx={cx} cy="52" r="26" fill="#FBFAF5" stroke={INK} strokeWidth="3" />
            <line x1={cx} y1="52" x2={cx} y2="32" stroke="#2D5BD2" strokeWidth="3" strokeLinecap="round" style={{ transform: `rotate(${minute}deg)`, transformOrigin: `${cx}px 52px` }} />
            <line x1={cx} y1="52" x2={cx} y2="40" stroke={INK} strokeWidth="3" strokeLinecap="round" style={{ transform: `rotate(${minute / 12}deg)`, transformOrigin: `${cx}px 52px` }} />
            <circle cx={cx} cy="52" r="4" fill={INK} />
          </g>
        );
      })}
      <line x1="-400" y1="190" x2="600" y2="190" stroke={INK} strokeWidth="3" />
      <g style={{ transform: `translateX(${-150 + p * 150}px)` }}>
        <rect x="40" y="140" width="70" height="40" rx="6" fill="#D2381F" stroke={INK} strokeWidth="3" />
        <rect x="110" y="152" width="40" height="28" rx="4" fill="#A52A15" stroke={INK} strokeWidth="3" />
        <rect x="124" y="130" width="14" height="22" fill={INK} />
        <rect x="52" y="150" width="20" height="14" rx="2" fill="#F7D154" stroke={INK} strokeWidth="3" />
        <rect x="80" y="150" width="20" height="14" rx="2" fill="#F7D154" stroke={INK} strokeWidth="3" />
        {[60, 95, 135].map((x) => <circle key={x} cx={x} cy="184" r="9" fill="#FBFAF5" stroke={INK} strokeWidth="3" />)}
      </g>
    </svg>
  );
}

const CAESIUM = '9192631770';

// Atoms whose turn it is to fly, spread through the beam; the same ones flip each time, so the count reads steadily.
const ATOMS = 18;

function AtomArt({ p }) {
  // A caesium beam clock, left to right: oven, sorting magnet, microwave cavity, second magnet, detector.
  // The microwaves are tuned while the digits lock in; the closer to 9 192 631 770 Hz, the more atoms flip
  // (turn blue), and only flipped atoms are steered into the detector, which steers the tuning in turn.
  const locked = Math.floor(p * (CAESIUM.length + 1));
  const number = [...CAESIUM].map((d, i) => (i < locked ? d : (Number(d) + Math.floor(p * 97) * (i + 3)) % 10)).join('');
  const tuned = locked / CAESIUM.length;
  const label = { fontSize: 8.5, fontWeight: 700, fill: INK, textAnchor: 'middle' };
  const magnet = (x) => (
    <g key={x}>
      <rect x={x} y="74" width="18" height="18" rx="2" fill="#D2381F" stroke={INK} strokeWidth="2.5" />
      <rect x={x} y="108" width="18" height="18" rx="2" fill="#2D5BD2" stroke={INK} strokeWidth="2.5" />
    </g>
  );
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
      <svg viewBox="0 0 200 180" className="w-full flex-1 min-h-0">
        <rect x="4" y="82" width="26" height="36" rx="4" fill="#F4B23E" stroke={INK} strokeWidth="2.5" />
        <text x="17" y="76" {...label}>cesium</text>
        {magnet(40)}
        <text x="49" y="68" {...label}>magnet</text>
        <rect x="70" y="80" width="58" height="40" rx="3" fill="#FBFAF5" stroke={INK} strokeWidth="2.5" />
        <path d={`M72 ${88}${Array.from({ length: 9 }, (_, i) => ` q3 ${i % 2 ? 5 : -5} 6 0`).join('')}`} fill="none" stroke="#BFA6EE" strokeWidth="2" style={{ transform: `translateX(${(p * 120) % 12 - 6}px)` }} />
        <text x="99" y="68" {...label}>mikrovlny</text>
        {magnet(138)}
        <text x="147" y="68" {...label}>magnet</text>
        <rect x="174" y="50" width="22" height="24" rx="3" fill="#2D5BD2" fillOpacity={0.15 + 0.85 * tuned} stroke={INK} strokeWidth="2.5" />
        <text x="185" y="44" {...label}>detektor</text>
        {/* The detector's count tunes the microwaves: the feedback loop. */}
        <path d="M185 74V150H99V124" fill="none" stroke={INK} strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M95 128L99 121L103 128Z" fill={INK} />
        <text x="142" y="164" {...label}>doladění</text>
        {Array.from({ length: ATOMS }, (_, i) => {
          const x = 30 + ((p * 6 + i / ATOMS) % 1) * 170;
          const flips = ((i * 7) % ATOMS) / ATOMS < tuned;
          const past = x > 156 ? x - 156 : 0; // the second magnet steers them once they leave it
          if (flips && x > 180) return null; // counted by the detector
          const y = 100 + (flips ? -past * 1.25 : past * 0.6);
          return <circle key={i} cx={x} cy={y} r="3.5" fill={flips && x > 99 ? '#2D5BD2' : '#F4B23E'} stroke={INK} strokeWidth="1.5" />;
        })}
      </svg>
      <p className="surtitle wide text-xl md:text-2xl tabular-nums">
        {number.slice(0, 1)} {number.slice(1, 4)} {number.slice(4, 7)} {number.slice(7)}
      </p>
    </div>
  );
}

// The scene's title rail: name left, year right, like a cue on the stage manager's list.
export function SceneTitle({ title, when, number, subtitle }) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2 border-b-2 border-ink pb-3">
        <h2 className="cond text-[clamp(3.5rem,11vw,6rem)]">{title}</h2>
        {when && <p className="wide font-bold text-[clamp(1.25rem,3vw,2.25rem)] leading-none pb-1">{when}</p>}
      </div>
      <p className="mt-3 font-bold">Kapitola {number} • {subtitle}</p>
    </div>
  );
}

// One beat of the story, spoken on the lit stage; only the film and the fact get screens.
export function Step({ title, children }) {
  return (
    <div className="lg:min-h-[40svh] lg:flex lg:items-center pt-10">
      <div className="max-w-[40ch]">
        <h3 className="font-display font-extrabold text-[1.75rem] leading-tight mb-2">{title}</h3>
        <p className="text-lg leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

// A short side note under a chapter's story steps, on the second projector's blue screen.
export function Fact({ children }) {
  return (
    <aside className="screen film hang fly p-6 sm:p-7 mt-14">
      <p className="text-lg leading-relaxed"><strong className="font-display font-extrabold text-xl block mb-1">Věděl jsi?</strong> {children}</p>
    </aside>
  );
}

export const CHAPTERS = [
  {
    id: 'voda', when: 'cca 1400 př. n. l.', title: 'Voda a písek', error: 'Chyba: ~15 minut denně', perDay: 900, Art: WaterArt,
    bg: '#86CFE0', subtitle: 'Hodiny, které jdou i v noci',
    steps: [
      ['Nádoba s dírkou', 'Klepsydra je nádoba s malou dírkou u dna. Jak vody ubývá, teče pomaleji, a proto má nádoba šikmé stěny: hladina tak klesá skoro stejně rychle a rysky na stěně ukazují, kolik času uplynulo.'],
      ['I v noci a pod mrakem', 'Na rozdíl od stínu klepsydra nepotřebuje slunce. Ve starých Athénách odměřovala řečníkům u soudu, jak dlouho smějí mluvit.'],
      ['Přesýpací hodiny', 'Písek místo vody přišel až ve středověku. Hodil se na lodě, kde by voda na vlnách šplouchala.'],
    ],
    fact: 'Nejstarší dochované vodní hodiny pocházejí z chrámu v Karnaku v Egyptě, z doby faraona Amenhotepa III. Je jim přes 3 400 let.',
  },
  {
    id: 'ozubena-kola', when: 'konec 13. století', title: 'Ozubená kola', error: 'Chyba: ~10 minut denně', perDay: 600, Art: GearsArt,
    bg: '#F0935A', subtitle: 'Hodiny poháněné závažím',
    steps: [
      ['Padající závaží', 'Závaží na laně pomalu klesá a roztáčí ozubená kola. Kola převádějí jeho pohyb až na ručičku nebo na zvon.'],
      ['Tik, tak', 'Samo by závaží spadlo hned. Brzdí ho kroková zarážka s lihýřem, takže kola popojíždějí po malých krůčcích.'],
      ['Hodiny na věži', 'První mechanické hodiny stály ve věžích klášterů a radnic. Často neměly ani ciferník, jen odbíjely.'],
    ],
    fact: 'Anglické slovo „clock“ pochází ze středověké latiny: „clocca“ znamená zvon. První mechanické hodiny totiž čas neukazovaly, ale odbíjely.',
  },
  {
    id: 'kyvadlo', when: '1656', title: 'Kyvadlo', error: 'Chyba: ~10 sekund denně', perDay: 10, Art: PendulumArt,
    bg: '#F29AAA', subtitle: 'Z minut na sekundy',
    steps: [
      ['Pořád stejně dlouho', 'Galileo Galilei si všiml, že kyvadlo se houpe pořád stejně dlouho — ať kmitá trochu víc, nebo trochu míň.'],
      ['Huygensovy hodiny', 'Christiaan Huygens v roce 1656 postavil první kyvadlové hodiny. Brzy k nim přibyla kotva: každý kyv pustí ozubené kolo o půl zubu dál.'],
      ['Najednou přesně', 'Chyba klesla z mnoha minut na pár sekund denně. Hodiny konečně dostaly i minutovou ručičku.'],
    ],
    fact: 'Kyvadlo dlouhé skoro přesně 1 metr udělá jeden kyv za 1 sekundu. Říká se mu sekundové kyvadlo.',
  },
  {
    id: 'chronometr', when: '1761', title: 'Hodiny na moři', error: 'Chyba: 5 sekund za 81 dní plavby', perDay: 5 / 81, Art: ChronometerArt,
    bg: '#5CC9B0', subtitle: 'Jak najít cestu přes oceán',
    steps: [
      ['Kde to jsme?', 'Podle slunce námořníci snadno zjistili, jak daleko jsou na sever nebo na jih. Jak daleko na východ nebo na západ, ale nevěděli. Lodě se ztrácely a narážely na útesy.'],
      ['Čas prozradí polohu', 'Země se za hodinu otočí o 15 stupňů. Když víš, kolik je hodin doma, a na moři je zrovna poledne, rozdíl časů ti řekne, kde jsi. Kyvadlové hodiny se ale na houpající lodi zastavily.'],
      ['Tesař proti hvězdářům', 'Britský parlament v roce 1714 vypsal odměnu 20 000 liber. Samouk John Harrison, původně tesař, na hodinách pracoval přes 30 let. Jeho kapesní H4 při plavbě na Jamajku v roce 1761 ztratila jen 5 sekund.'],
    ],
    fact: 'Peníze za své hodiny dostal Harrison až v roce 1773, skoro v 80 letech. Pomohl mu až sám král Jiří III.',
  },
  {
    id: 'pasma', when: '1884', title: 'Vlaky a časová pásma', error: 'Praha a Vídeň: 8 minut rozdílu', Art: TrainArt,
    bg: '#BEDB63', subtitle: 'Jeden čas pro celou zemi',
    steps: [
      ['Každé město svůj čas', 'Dřív si každé město řídilo hodiny podle svého slunce. Když bylo poledne v Praze, ve Vídni už bylo o 8 minut víc.'],
      ['Zmatek na nádraží', 'Pro vlaky to byla pohroma. Jízdní řády se počítaly v mnoha různých časech a na některých nádražích visely hodiny dvoje.'],
      ['Greenwich a pásma', 'V roce 1884 se státy ve Washingtonu dohodly, že nultý poledník povede anglickým Greenwichem. Postupně z toho vzniklo 24 časových pásem po jedné hodině.'],
    ],
    fact: 'Vlaky v Rakousku-Uhersku, a tedy i v Čechách, začaly jezdit podle středoevropského času 1. října 1891. Proto máme v zimě UTC+1 a v létě UTC+2.',
  },
  {
    id: 'kremen', when: '1927', title: 'Křemen a elektřina', error: 'Chyba: ~1 sekunda za měsíc', perDay: 1 / 30, Art: QuartzArt,
    bg: '#BFA6EE', subtitle: 'Krystal, který se chvěje',
    steps: [
      ['Chvějící se krystal', 'Když do křemenného krystalu pustíš elektrický proud, začne se chvět. V hodinkách přesně 32 768krát za sekundu.'],
      ['Velké jako skříň', 'První křemenné hodiny postavili v roce 1927 v Bellových laboratořích v USA. Zabraly celou skříň.'],
      ['Svítící číslice', 'V 70. letech se křemen vešel do hodinek. Digitální hodinky ukazovaly čas na displeji ze sedmi dílků.'],
    ],
    fact: 'Číslo 32 768 není náhoda: je to 2 na 15. Hodinky ho patnáctkrát vydělí dvěma a dostanou přesně jeden tik za sekundu.',
  },
  {
    id: 'atom', when: '1955', title: 'Atomové hodiny', error: 'Dnes: 1 s za 100 mil. let', perDay: 1 / (1e8 * 365), Art: AtomArt,
    bg: '#92DB97', subtitle: 'Nejpřesnější čas na světě',
    steps: [
      ['Tep atomu', 'Louis Essen a Jack Parry v Londýně v roce 1955 sestrojili první hodiny řízené atomy cesia.'],
      ['Nová sekunda', 'Od roku 1967 je jedna sekunda přesně 9 192 631 770 kmitů atomu cesia. Ne den, ale atom určuje, jak dlouhá sekunda je.'],
      ['Čas pro celý svět', 'Podle atomových hodin se řídí družice GPS, mobilní sítě i internet. Tvůj telefon si s nimi čas sám porovnává.'],
    ],
    fact: 'Nejlepší dnešní optické hodiny jsou ještě přesnější než cesiové. Kdyby běžely od vzniku vesmíru před 13,8 miliardy let, nezpozdily by se ani o sekundu.',
  },
];

// A pinned illustration that plays as the chapter's story steps scroll past it.
export default function Chapter({ id, number, when, title, subtitle, error, steps, fact, Art }) {
  // Same scroll targets as the sundial: the whole section where the art is pinned, the art itself on narrow screens.
  // shortcut: breakpoint is read once on mount, resizing across 1024px keeps the old target until reload.
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const [wide] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  const progress = useScrollProgress(wide ? sectionRef : stageRef);
  const p = progress === null || prefersReducedMotion() ? 1 : progress;
  const flip = number % 2 === 1; // alternate sides on wide screens

  return (
    <section id={id} ref={sectionRef} className="py-24 scroll-mt-16">
      <div className="max-w-stage mx-auto px-4 md:px-8">
        <SceneTitle title={title} when={when} number={number} subtitle={subtitle} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 items-start">
          <div className="lg:col-span-7 mt-12 lg:mt-16 lg:sticky lg:top-28">
            <div className="screen hang fly p-4 sm:p-6 [--cable:4rem]">
              <div ref={stageRef} className="h-[280px] md:h-[380px]" aria-hidden="true">
                <Art p={p} />
              </div>
            </div>
            <p className="surtitle wide text-sm text-center">{error}</p>
          </div>
          <div className={`lg:col-span-5 ${flip ? '' : 'lg:order-first'}`}>
            {steps.map(([heading, text]) => <Step key={heading} title={heading}>{text}</Step>)}
            <Fact>{fact}</Fact>
          </div>
        </div>
      </div>
    </section>
  );
}
