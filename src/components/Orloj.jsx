import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../scroll.js';
import { useNow } from '../useNow.js';
import { moonPhase } from '../clocks/moon.js';
import { EQUATOR, altitudeCircle, onDial, sunLongitude, sunsetAngle } from '../clocks/orloj.js';
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
const CROW_MS = 1400;

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
  const [crowing, setCrowing] = useState(false);
  const [pair, setPair] = useState(0);
  const now = useNow();
  // Like the real dial: noon at the top, the sun goes once round in 24 hours. The zodiac ring turns with the stars,
  // a little faster, so the sun and the moon (its phase further along the ecliptic) ride the ring through the year.
  const sunAngle = (now.getHours() + now.getMinutes() / 60) * 15 - 180;
  const sun = sunLongitude(now);
  const phase = moonPhase(now);
  const zodiac = sunAngle - onDial(sun, 0).angle;
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

  // All six pairs of apostles pass the windows, the doors close and the rooster crows.
  useEffect(() => {
    if (!ringing) return;
    const step = setInterval(() => setPair((p) => p + 1), PAIR_MS);
    const end = setTimeout(() => {
      setRinging(false);
      setCrowing(true);
    }, PAIR_MS * APOSTLES.length / 2);
    return () => {
      clearInterval(step);
      clearTimeout(end);
    };
  }, [ringing]);

  useEffect(() => {
    if (!crowing) return;
    const end = setTimeout(() => setCrowing(false), CROW_MS);
    return () => clearTimeout(end);
  }, [crowing]);

  const ring = () => {
    setPair(0);
    setCrowing(false);
    setRinging(true);
    playBells();
  };
  const shown = [0, 1].map((i) => (pair * 2 + i) % APOSTLES.length);
  const beat = ringing && pair % 2 === 1;

  return (
    <section id="orloj" className="py-24 scroll-mt-16">
      <div className="max-w-stage mx-auto px-4 md:px-8">
        <SceneTitle title="Pražský orloj" when="1410" number={4} subtitle="Mistr Mikuláš z Kadaně" />
        <p className="mt-6 text-xl leading-relaxed max-w-[60ch]">
          Jeden z nejstarších dosud fungujících orlojů na světě. Neukazuje jen běžný čas, ale i pohyb Slunce, fáze Měsíce, zvěrokruh a staročeské hodiny.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 items-start">
          <div className="lg:col-span-7 mt-16 lg:sticky lg:top-28 flex flex-col items-center">
            <div ref={dialRef} className="w-full max-w-md">
              <svg viewBox="0 0 360 416" className="w-full h-auto drop-shadow-[0_24px_24px_rgb(34_31_43_/_0.35)]" role="img" aria-label="Pražský orloj: dvě okénka s apoštoly, kohout, astronomický ciferník a čtyři figury po stranách">
                {/* The window storey under its little roof, with the rooster in the gable. */}
                <path d="M92 56L180 4L268 56Z" fill="#4A4556" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
                <path d="M164 56V38Q164 26 180 24Q196 26 196 38V56Z" fill={INK} />
                <Rooster crowing={crowing} />
                <rect x="96" y="54" width="168" height="102" fill={STONE} stroke={INK} strokeWidth="3" />
                {shown.map((i, w) => (
                  <Window key={w} x={116 + w * 80} open={ringing}>
                    {/* A new key each pair, so every apostle walks the window afresh. */}
                    {ringing && <Apostle key={pair} index={i} />}
                  </Window>
                ))}

                {/* The dial storey: the dial in its square frame, a figure in a niche at each side. */}
                <rect x="14" y="154" width="332" height="248" fill={STONE} stroke={INK} strokeWidth="3" />
                <rect x="44" y="400" width="272" height="12" rx="2" fill={STONE_DARK} stroke={INK} strokeWidth="3" />
                {[[16, 172], [16, 282], [302, 172], [302, 282]].map(([x, y]) => (
                  <path key={`${x}${y}`} d={`M${x} ${y + 84}V${y + 14}Q${x} ${y} ${x + 21} ${y - 4}Q${x + 42} ${y} ${x + 42} ${y + 14}V${y + 84}Z`} fill="#3A3646" stroke={INK} strokeWidth="2" />
                ))}
                <Figure x={17} y={178} robe="#BFA6EE" hat="#F4B23E" moving="item" beat={beat}>
                  {/* Vanity admires itself in a mirror. */}
                  <path d="M28 46L34 30" stroke="#F2C9A0" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="34" cy="26" r="5" fill="#C9C6D2" stroke={INK} strokeWidth="1.5" />
                </Figure>
                <Figure x={17} y={288} robe="#5CC9B0" hat="#8A5A3B" moving="item" beat={beat}>
                  {/* The Miser shakes his purse. */}
                  <path d="M34 50Q40 60 34 64Q26 64 28 54Z" fill="#F4B23E" stroke={INK} strokeWidth="1.5" />
                  <line x1="8" y1="40" x2="6" y2="80" stroke="#8A5A3B" strokeWidth="2.5" />
                </Figure>
                <Death pull={beat} ringing={ringing} />
                <Figure x={303} y={288} robe="#D2381F" hat="#FBFAF5" moving="head" beat={beat}>
                  {/* The Turk with his lute shakes his head. */}
                  <ellipse cx="14" cy="54" rx="7" ry="9" fill="#B08A4E" stroke={INK} strokeWidth="1.5" />
                  <line x1="18" y1="48" x2="30" y2="36" stroke="#B08A4E" strokeWidth="2.5" />
                </Figure>

                <rect x="76" y="164" width="208" height="208" fill="#2B3550" stroke={INK} strokeWidth="3" />
                {[[86, 174], [274, 174], [86, 362], [274, 362]].map(([cx, cy]) => <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="4" fill="#F7D154" />)}
                <OrlojDial ring={zodiac} sun={sun} phase={phase} />
              </svg>
            </div>
            <p className="mt-3 h-6 font-bold">{ringing ? shown.map((i) => `sv. ${APOSTLES[i]}`).join(' a ') : crowing ? 'Kykyryký!' : ''}</p>

            <div className="mt-6 flex flex-col items-center text-center">
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

const INK = '#221F2B';
const STONE = '#D9CBAE';
const STONE_DARK = '#B8A684';
const DIAL = (300 * 100) / 148; // the dial is drawn 296 across in a 300 box, the frame leaves room for 200
const ROBES = ['#D2381F', '#2D5BD2', '#F4B23E', '#5CC9B0', '#BFA6EE', '#F0935A'];
const ARCH = 'M0 76V24Q0 6 24 0Q48 6 48 24V76Z';

// An arched window whose two wooden doors swing open while the apostles pass.
// Nested svgs give every moving part its own coordinates, so the CSS transform origins stay simple.
function Window({ x, open, children }) {
  const leaf = (left) => ({ transform: `scaleX(${open ? 0.1 : 1})`, transformOrigin: `${left ? 0 : 48}px 0px` });
  return (
    <>
      <svg x={x} y="70" width="48" height="76" viewBox="0 0 48 76">
        <clipPath id={`orloj-window-${x}`}><path d={ARCH} /></clipPath>
        <g clipPath={`url(#orloj-window-${x})`}>
          <rect width="48" height="76" fill={INK} />
          {children}
          {[true, false].map((left) => (
            <g key={left} className="transition-transform duration-500 ease-out" style={leaf(left)}>
              <rect x={left ? 0 : 24} width="24" height="76" fill="#8A5A3B" stroke={INK} strokeWidth="1.5" />
              <path d={left ? 'M8 0V76M16 0V76' : 'M32 0V76M40 0V76'} stroke="#6B4429" strokeWidth="1.5" />
              <circle cx={left ? 20 : 28} cy="46" r="1.8" fill="#F7D154" />
            </g>
          ))}
        </g>
      </svg>
      <path d={ARCH} transform={`translate(${x} 70)`} fill="none" stroke={INK} strokeWidth="3" />
    </>
  );
}

// A flat cut-out apostle walking past the window and pausing to face the square, as the figures on the turning
// wheel inside the real orloj do.
function Apostle({ index }) {
  const walk = !prefersReducedMotion();
  return (
    <g style={walk ? { animation: `apostle-walk ${PAIR_MS}ms ease-in-out both` } : undefined}>
      <path d="M8 76L14 42H34L40 76Z" fill={ROBES[index % ROBES.length]} />
      <circle cx="24" cy="31" r="10" fill="#F2C9A0" />
      <path d="M13 28Q24 12 35 28Q24 22 13 28Z" fill={INK} />
      <circle cx="24" cy="31" r="15" fill="none" stroke="#F7D154" strokeWidth="2" />
    </g>
  );
}

// The golden rooster crows and flaps once the windows have closed.
function Rooster({ crowing }) {
  return (
    <svg x="166" y="28" width="28" height="28" viewBox="0 0 30 30">
      <path d="M4 10Q2 20 10 22" fill="none" stroke="#F4B23E" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="15" cy="20" rx="8" ry="6" fill="#F4B23E" />
      <path d="M13 26V30M17 26V30" stroke="#F4B23E" strokeWidth="1.5" />
      <g className="transition-transform duration-300" style={{ transform: `rotate(${crowing ? -25 : 0}deg)`, transformOrigin: '20px 16px' }}>
        <circle cx="21" cy="11" r="4" fill="#F4B23E" />
        <path d="M19 6Q21 3 23 6" fill="#D2381F" />
        <path d={crowing ? 'M24 10L29 8L24 12L29 14L24 12Z' : 'M24 10L28 11L24 12Z'} fill="#D2381F" />
      </g>
      <path d="M10 19Q15 14 20 19Q15 22 10 19Z" fill="#B08A4E" style={crowing && !prefersReducedMotion() ? { animation: 'rooster-flap 200ms ease-in-out 6 alternate', transformOrigin: '18px 18px' } : undefined} />
    </svg>
  );
}

// One of the three figures beside the dial: on every other strike it shakes its head or the thing it holds.
function Figure({ x, y, robe, hat, moving, beat, children }) {
  const shake = (on) => ({ transform: `rotate(${on ? 14 : 0}deg)`, transformOrigin: moving === 'head' ? '20px 34px' : '26px 46px' });
  return (
    <svg x={x} y={y} width="40" height="80" viewBox="0 0 40 80">
      <path d="M8 80L12 38H28L32 80Z" fill={robe} />
      <g className="transition-transform duration-300" style={shake(moving === 'head' && beat)}>
        <circle cx="20" cy="26" r="9" fill="#F2C9A0" />
        <path d="M10 22Q20 8 30 22Z" fill={hat} />
      </g>
      <g className="transition-transform duration-300" style={shake(moving === 'item' && beat)}>{children}</g>
    </svg>
  );
}

// Death pulls the rope of the little bell above and nods, and turns over the hourglass in the other hand: time is up.
function Death({ pull, ringing }) {
  const move = (angle, x, y) => ({ transform: `rotate(${angle}deg)`, transformOrigin: `${x}px ${y}px` });
  return (
    <svg x="300" y="146" width="46" height="110" viewBox="0 -20 50 120">
      <g className="transition-transform duration-300" style={move(pull ? -20 : 0, 40, -20)}>
        <path d="M40 -20V-14M32 0Q32 -14 40 -14Q48 -14 48 0Z" fill="#F4B23E" stroke={INK} strokeWidth="1.5" />
        <circle cx="40" cy="2" r="2" fill={INK} />
      </g>
      <g className="transition-transform duration-300" style={move(pull ? 14 : 0, 25, 40)}>
        <circle cx="25" cy="28" r="10" fill="#FBFAF5" />
        <circle cx="21" cy="27" r="2.5" fill={INK} />
        <circle cx="29" cy="27" r="2.5" fill={INK} />
        <rect x="21" y="34" width="8" height="4" fill="#FBFAF5" />
      </g>
      <path d="M25 40V70M15 48H35M17 54H33M18 60H32M25 70L17 98M25 70L33 98M15 48L8 58" stroke="#FBFAF5" strokeWidth="3" strokeLinecap="round" />
      <path d="M35 48L42 32M42 32V4" stroke="#FBFAF5" strokeWidth="3" strokeLinecap="round" className="transition-transform duration-300" style={move(pull ? 12 : 0, 35, 48)} />
      <path d="M3 59H13L8 66L13 73H3L8 66Z" fill="#F4B23E" stroke="#FBFAF5" strokeWidth="1.5" strokeLinejoin="round" className="transition-transform duration-500" style={move(ringing ? 180 : 0, 8, 66)} />
    </svg>
  );
}

// ♈ to ♓ at the middle of each sign; U+FE0E asks for the text glyph, not the emoji tile.
const ZODIAC = Array.from({ length: 12 }, (_, i) => [String.fromCodePoint(0x2648 + i) + '︎', 15 + i * 30]);
const ROMAN = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

// Day sky inside Prague's horizon, dusk down to 18° below it, night beyond.
const [HORIZON, TWILIGHT] = [altitudeCircle(0), altitudeCircle(-18)];

// Lit part of the moon seen from the north: waxing on the right, waning on the left.
function moonShape(cx, cy, r, phase) {
  const waxing = phase < 0.5;
  const c = Math.cos(phase * 2 * Math.PI);
  return `M${cx} ${cy - r}A${r} ${r} 0 0 ${waxing ? 1 : 0} ${cx} ${cy + r}A${Math.abs(c) * r} ${r} 0 0 ${waxing === c > 0 ? 0 : 1} ${cx} ${cy - r}Z`;
}

// Astronomical dial: day sky above, dusk and night below the horizon. The zodiac ring is the ecliptic
// projected like the real dial, so it touches both tropics and the sun drifts between them through the year.
function OrlojDial({ ring, sun, phase }) {
  const rotate = (angle) => ({ transform: `rotate(${angle}deg)`, transformOrigin: '150px 150px' });
  const at = ({ angle, r }) => [150 + r * Math.sin((angle * Math.PI) / 180), 150 - r * Math.cos((angle * Math.PI) / 180)];
  const [summer, winter] = [onDial(90, ring), onDial(270, ring)];
  const [[x1, y1], [x2, y2]] = [at(summer), at(winter)];
  const sunAt = onDial(sun, ring);
  const moonAt = onDial(sun + phase * 360, ring);
  const [moonX, moonY] = at(moonAt);
  const dusk = sunsetAngle(sun);
  return (
    <svg x={180 - DIAL / 2} y={268 - DIAL / 2} width={DIAL} height={DIAL} viewBox="0 0 300 300">
      <clipPath id="orloj-sky"><circle cx="150" cy="150" r="128" /></clipPath>
      {/* Old Czech hours: the outer ring turns through the year so that 24 always falls on sunset. */}
      <circle cx="150" cy="150" r="148" fill="#221F2B" stroke="#F7D154" strokeWidth="2" />
      <g fill="#F7D154" fontSize="13" fontFamily="Georgia, serif" fontWeight="700" textAnchor="middle" dominantBaseline="central">
        {Array.from({ length: 24 }, (_, i) => (
          <text key={i} x="150" y="11" transform={`rotate(${dusk + (i + 1) * 15} 150 150)`}>{i + 1}</text>
        ))}
      </g>
      <g clipPath="url(#orloj-sky)">
        <rect width="300" height="300" fill="#221F2B" />
        {[[TWILIGHT, '#8A5A3B'], [HORIZON, '#4A86D0']].map(([{ dy, r }, fill]) => <circle key={fill} cx="150" cy={150 + dy} r={r} fill={fill} />)}
      </g>
      {[onDial(270, 0).r, EQUATOR, onDial(90, 0).r].map((r) => <circle key={r} cx="150" cy="150" r={r} fill="none" stroke="#F7D154" strokeWidth="1.2" opacity="0.7" />)}
      <circle cx={(x1 + x2) / 2} cy={(y1 + y2) / 2} r={(summer.r + winter.r) / 2} fill="none" stroke="#F7D154" strokeWidth="3" />
      <g fill="#F7D154" fontSize="12" textAnchor="middle" dominantBaseline="central">
        {ZODIAC.map(([sign, longitude]) => {
          const [x, y] = at(onDial(longitude, ring));
          return <text key={sign} x={x} y={y} stroke="#221F2B" strokeWidth="3" paintOrder="stroke">{sign}</text>;
        })}
      </g>
      {/* Fixed Roman numerals round the edge of the sky: the sun hand reads Central European time on them. */}
      <g fill="#F7D154" fontSize="10" fontFamily="Georgia, serif" fontWeight="700" textAnchor="middle" dominantBaseline="central" stroke="#221F2B" strokeWidth="2.5" paintOrder="stroke">
        {Array.from({ length: 24 }, (_, i) => (
          <text key={i} x="150" y="30" transform={`rotate(${i * 15} 150 150)`}>{ROMAN[i % 12]}</text>
        ))}
      </g>
      <line x1="150" y1="150" x2="150" y2="34" stroke="#C9C6D2" strokeWidth="3" style={rotate(moonAt.angle)} />
      <circle cx={moonX} cy={moonY} r="10" fill="#221F2B" stroke="#C9C6D2" strokeWidth="2" />
      <path d={moonShape(moonX, moonY, 10, phase)} fill="#FBFAF5" />
      <g style={rotate(sunAt.angle)}>
        <line x1="150" y1="150" x2="150" y2="44" stroke="#F7D154" strokeWidth="4" />
        <path d="M144 46L150 22L156 46Z" fill="#F7D154" stroke="#221F2B" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="150" cy={150 - sunAt.r} r="11" fill="#F7D154" stroke="#221F2B" strokeWidth="2" />
      </g>
      <circle cx="150" cy="150" r="9" fill="#F4B23E" stroke="#221F2B" strokeWidth="2" />
    </svg>
  );
}
