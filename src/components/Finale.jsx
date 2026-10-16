import { SmallClock } from './AnalogClock.jsx';
import { formatDigital } from '../clocks/digital.js';
import { toBinaryColumns } from '../clocks/binary.js';
import { toWords } from '../clocks/words.js';
import { useNow } from '../useNow.js';
import { CHAPTERS } from './Chapter.jsx';
import Icon from './Icon.jsx';

// Bar length on a log scale of seconds lost per day: 10^-12 s is empty, 10^3 s is full.
const barWidth = (perDay) => `${((Math.log10(perDay) + 12) / 15) * 100}%`;

// One way of showing the time: its screen, a name under it and a note.
function Face({ title, note, className = '', children }) {
  return (
    <figure className={`fly flex flex-col ${className}`}>
      {children}
      <figcaption className="mt-4">
        <h3 className="font-display font-extrabold text-lg">{title}</h3>
        <p className="text-sm leading-snug mt-1 max-w-[32ch]">{note}</p>
      </figcaption>
    </figure>
  );
}

export default function Finale() {
  const now = useNow();
  const digital = formatDigital(now);
  const digits = digital.replaceAll(':', '');
  const words = toWords(now);

  return (
    <section id="dnes" className="relative pt-24 scroll-mt-16">
      <div className="max-w-stage mx-auto px-4 md:px-8">
        <div className="border-b-2 border-ink pb-3">
          <h2 className="cond text-[clamp(3.5rem,11vw,6rem)]">Jeden čas, čtyři podoby</h2>
        </div>
        <p className="mt-3 font-bold">Dnešní hodiny</p>
        <p className="mt-6 text-xl leading-relaxed max-w-[60ch]">Všechny čtyři karty ukazují stejný okamžik — právě teď.</p>

        {/* Four screens of four shapes, all projecting the same moment. */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-12 gap-x-6 sm:gap-x-10 gap-y-16 items-start">
          <Face title="A • Digitální" note="Nejčastější podoba na telefonech, počítačích a mikrovlnkách." className="col-span-2 lg:col-span-5">
            <div className="screen hang [--cable:3.5rem] py-10 px-6 text-center">
              <p className="wide font-bold text-[clamp(2.5rem,6vw,4.25rem)] leading-none tabular-nums">{digital}</p>
            </div>
          </Face>
          <Face title="B • Analogové" note="Krátká ručička hodiny, dlouhá minuty, tenká vteřiny." className="lg:col-span-3 mt-8 lg:mt-16">
            <div className="relative self-center w-full max-w-[15rem] aspect-square">
              <span className="absolute bottom-full left-1/2 w-[1.5px] h-8 lg:h-24 bg-ink" aria-hidden="true" />
              <SmallClock date={now} label={`Ručičkové hodiny ukazují ${words}`} className="w-full h-full drop-shadow-[0_24px_24px_rgb(34_31_43_/_0.35)]" />
            </div>
          </Face>
          <Face title="C • Binární" note="Každá číslice ve sloupci teček 8-4-2-1. Takhle počítají počítače." className="lg:col-span-4 lg:-mt-6">
            <div className="screen hang [--cable:5rem] self-start py-4 px-3 sm:py-5 sm:px-4 flex gap-1 sm:gap-2" role="img" aria-label={`Binární hodiny ukazují ${digital}`}>
              {toBinaryColumns(now).map((bits, i) => (
                <div key={i} className={`flex flex-col gap-1.5 items-center ${i % 2 === 1 && i < 5 ? 'mr-1 sm:mr-2' : ''}`}>
                  <span className="wide text-xs font-bold">{digits[i]}</span>
                  {bits.map((on, j) => (
                    <span key={j} className={`w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full ${on ? 'bg-film' : 'bg-ink/15'}`} />
                  ))}
                </div>
              ))}
            </div>
          </Face>
          <Face title="D • Slovy" note="Jak si čas řekneme, když se potkáme na ulici (zaokrouhleno na 5 minut)." className="col-span-2 lg:col-span-12">
            <p className="surtitle cond text-center text-[clamp(2.25rem,6vw,4rem)] py-5 normal-case">{words}</p>
          </Face>
        </div>

        <div className="screen hang fly [--cable:4rem] mt-28 max-w-4xl mx-auto p-6 md:p-10">
          <h3 className="font-display font-extrabold text-3xl mb-1">Jak hodiny zpřesňovaly</h3>
          <p className="mb-8">O kolik se hodiny spletou za den. Každý dílek osy znamená 10× přesnější hodiny.</p>
          <ol className="flex flex-col gap-4">
            {CHAPTERS.filter((c) => c.perDay).map((c) => (
              <li key={c.id} className="grid grid-cols-1 sm:grid-cols-[12rem_1fr] gap-1 sm:gap-5 items-center">
                <a href={`#${c.id}`} className="font-bold hover:underline">{c.when} • {c.title}</a>
                <div className="flex flex-col gap-1">
                  <div className="h-6 bg-[repeating-linear-gradient(90deg,transparent_0_calc(100%/15-1px),#221F2B26_calc(100%/15-1px)_calc(100%/15))] border-b-2 border-ink" aria-hidden="true">
                    <div className="h-full border-r-[3px] border-ink" style={{ width: barWidth(c.perDay), backgroundColor: c.bg }} />
                  </div>
                  <span className="text-sm">{c.error}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-28 pb-16 text-center max-w-2xl mx-auto">
          <p className="cond text-[clamp(2.5rem,7vw,4.5rem)]">Od stínu tyče v poušti po kmitání atomu.</p>
          <p className="text-xl mt-4">A teď už čas přečteš i ty — na mobilu, na zdi i podle slunce.</p>
          <a href="#nauc-se" className="cue cue-actor mt-8">
            <Icon name="replay" className="w-4 h-4" />
            Procvičit znovu
          </a>
        </div>
      </div>
      <div className="h-16 bg-floor" aria-hidden="true" />
    </section>
  );
}
