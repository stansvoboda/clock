import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../scroll.js';
import { useNow } from '../useNow.js';
import { moonPhase } from '../clocks/moon.js';
import { Fact } from './Chapter.jsx';

const CARDS = [
  ['Staročeský čas', <>Vnější prstenec se zlatými švabachovými číslicemi 1–24 se během roku natáčí tak, aby 24. hodina vždy padla na <strong>západ slunce</strong>.</>],
  ['Astronomický ciferník', 'Podklad představuje Zemi a nebe. Modrá část je den nad obzorem, hnědá a černá část dole znázorňují soumrak a noc.'],
  ['Měsíční koule a kalendárium', 'Dvoubarevná koulička se sama pootáčí a ukazuje fáze Měsíce. Malíř Josef Mánes později vyzdobil spodní kalendářní desku.'],
];

// The twelve apostles in the order they pass the two windows of the Prague Orloj, two at a time.
const APOSTLES = ['Petr', 'Matěj', 'Ondřej', 'Tomáš', 'Juda Tadeáš', 'Šimon', 'Bartoloměj', 'Barnabáš', 'Jakub', 'Pavel', 'Jan', 'Filip'];
const FACES = ['person', 'face', 'face_2', 'face_3', 'face_4', 'face_5', 'face_6', 'person_2', 'person_3', 'person_4', 'man', 'elderly'];
const PAIR_MS = 500;

// Three bell strokes synthesized on the spot, so no audio file is needed.
function playBells() {
  const audio = new AudioContext();
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
  setTimeout(() => audio.close(), 4000);
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
  const apostle = `w-10 h-16 bg-amber-400/80 rounded-t-full flex items-center justify-center transition-transform duration-300 ${ringing ? '-translate-y-4 scale-125' : ''}`;

  return (
    <section id="orloj" className="py-space-xl border-t-2 border-on-surface bg-[#0B132B] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FACC15_1px,transparent_1px)] [background-size:24px_24px]" aria-hidden="true" />
      <div className="max-w-[1380px] mx-auto px-4 md:px-margin relative">
        <div className="reveal text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-[#FACC15] text-[#1E293B] chunky-border px-4 py-1.5 rounded-full chunky-shadow mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E293B]" aria-hidden="true" />
            <span className="font-label text-label-caps uppercase">Kapitola 4 • Mistr Mikuláš z Kadaně</span>
          </div>
          <h2 className="font-display text-headline-xl-mobile md:text-headline-xl text-[#FACC15] mb-3">Pražský orloj, 1410</h2>
          <p className="text-body-xl text-slate-300">
            Jeden z nejstarších dosud fungujících orlojů na světě. Neukazuje jen běžný čas, ale i pohyb Slunce, fáze Měsíce, zvěrokruh a staročeské hodiny.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 bg-[#1E293B] border-[3px] border-[#FACC15] rounded-3xl p-6 md:p-8 chunky-shadow-lg flex flex-col items-center">
            <div className="flex items-end gap-6 mb-2" aria-hidden="true">
              <span className={`icon text-4xl text-slate-200 transition-transform duration-300 origin-bottom ${ringing ? (pair % 2 ? 'rotate-12' : '-rotate-12') : ''}`}>skull</span>
              {shown.map((i) => (
                <div key={i % 2} className="w-16 h-24 rounded-t-full bg-[#0F172A] border-2 border-[#FACC15] flex items-end justify-center pb-2 overflow-hidden">
                  <div className={apostle}>
                    <span className="icon text-[#0F172A] text-xl">{FACES[i]}</span>
                  </div>
                </div>
              ))}
              <span className={`icon text-4xl text-[#FACC15] transition-transform duration-300 ${ringing ? (pair % 2 ? '-rotate-12' : 'rotate-12') : ''}`}>notifications</span>
            </div>
            <p className="mb-6 h-5 font-label text-xs text-[#FACC15]">{ringing ? shown.map((i) => `sv. ${APOSTLES[i]}`).join(' a ') : ''}</p>

            <div ref={dialRef} className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full border-4 border-[#FACC15] shadow-[0_0_40px_rgba(250,204,21,0.25)] flex items-center justify-center overflow-hidden" role="img" aria-label="Stylizovaný astronomický ciferník Pražského orloje">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0369a1_0%,_#0f172a_70%)]" />
              <div className="absolute w-[75%] h-[75%] rounded-full border border-[#FACC15]/40" />
              <div className="absolute w-[54%] h-[54%] rounded-full border border-[#FACC15]/50" />
              <div className="absolute w-[37%] h-[37%] rounded-full border border-[#FACC15]/60" />
              <div className="absolute w-[21%] h-[21%] rounded-full border border-[#FACC15]/80 bg-[#1E293B]/60" />
              <div className="absolute w-1/2 h-1/2 rounded-full border-2 border-[#FACC15] translate-x-4 translate-y-3 flex items-center justify-between px-2 text-[#FACC15] text-[10px]">
                <span>♈</span><span>♋</span><span>♎</span><span>♑</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `rotate(${sunAngle}deg)` }}>
                <div className="w-1 h-[46%] bg-[#FACC15] mb-[46%] relative flex justify-center">
                  <span className="icon absolute -top-3 text-[#FACC15] text-2xl drop-shadow-[0_0_8px_#FACC15]">sunny</span>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `rotate(${moonAngle}deg)` }}>
                <div className="w-1 h-[37%] bg-slate-300 mb-[37%] relative flex justify-center">
                  <div className="absolute -top-3 w-5 h-5 rounded-full border border-black bg-gradient-to-r from-amber-100 to-slate-900" />
                </div>
              </div>
              {[['top-2', 'XII'], ['right-3', 'VI'], ['bottom-2', 'XII'], ['left-3', 'VI']].map(([pos, text]) => (
                <span key={pos} className={`absolute ${pos} font-label text-xs font-bold text-[#FACC15]`}>{text}</span>
              ))}
              <div className="w-5 h-5 rounded-full bg-[#FACC15] border-2 border-slate-900 z-10" />
            </div>

            <div className="mt-8 flex flex-col items-center">
              <button
                type="button"
                onClick={ring}
                disabled={ringing}
                className={`chunky-btn bg-[#FACC15] text-[#1E293B] font-label text-sm px-8 py-3 rounded-xl flex items-center gap-3 font-bold ${ringing ? 'motion-safe:animate-pulse' : ''}`}
              >
                <span className="icon text-2xl" aria-hidden="true">notifications_active</span>
                Odbít orloj
              </button>
              <p className="mt-2 text-xs font-label text-slate-400" aria-live="polite">
                {ringing ? 'Orloj odbíjí… Bim! Bam! Bim!' : 'Klikni, poslechni si zvony a sleduj apoštoly v okénkách'}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-5">
            {CARDS.map(([title, text], i) => (
              <div key={title} className="reveal bg-[#1E293B] border-2 border-slate-700 hover:border-[#FACC15] transition-colors rounded-2xl p-6 chunky-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-8 rounded-lg bg-amber-400/20 text-[#FACC15] border border-[#FACC15] flex items-center justify-center font-bold">{i + 1}</span>
                  <h3 className="font-display text-headline-sm text-[#FACC15]">{title}</h3>
                </div>
                <p className="text-slate-300">{text}</p>
              </div>
            ))}
            <Fact>Podle pověsti dali konšelé orlojníka Hanuše oslepit, aby podobný orloj nepostavil nikde jinde. Ve skutečnosti orloj sestrojil Mikuláš z Kadaně a Hanuš ho jen o 80 let později opravoval.</Fact>
          </div>
        </div>
      </div>
    </section>
  );
}
