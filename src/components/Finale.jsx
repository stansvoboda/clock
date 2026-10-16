import { SmallClock } from './AnalogClock.jsx';
import { formatDigital } from '../clocks/digital.js';
import { toBinaryColumns } from '../clocks/binary.js';
import { toWords } from '../clocks/words.js';
import { useNow } from '../useNow.js';
import { CHAPTERS } from './Chapter.jsx';

// Bar length on a log scale of seconds lost per day: 10^-12 s is empty, 10^3 s is full.
const barWidth = (perDay) => `${((Math.log10(perDay) + 12) / 15) * 100}%`;

function Card({ title, dot, bg, ink, note, children }) {
  return (
    <div className="reveal rounded-2xl p-6 chunky-shadow flex flex-col justify-between gap-4 border-[3px] border-[#1c1c17]" style={{ backgroundColor: bg, color: ink }}>
      <div className="flex items-center justify-between">
        <h3 className="font-label text-xs text-on-surface uppercase font-bold tracking-wider">{title}</h3>
        <span className={`w-3.5 h-3.5 rounded-full chunky-border ${dot}`} aria-hidden="true" />
      </div>
      <div className="flex justify-center">{children}</div>
      <p className="text-xs font-medium text-center">{note}</p>
    </div>
  );
}

export default function Finale() {
  const now = useNow();
  const digital = formatDigital(now);
  const digits = digital.replaceAll(':', '');
  const words = toWords(now);

  return (
    <section className="py-space-xl border-t-2 border-on-surface bg-surface">
      <div className="max-w-[1380px] mx-auto px-4 md:px-margin">
        <div className="reveal text-center max-w-3xl mx-auto mb-10">
          <span className="font-label text-label-caps text-primary uppercase block mb-2">Dnešní hodiny</span>
          <h2 className="font-display text-headline-xl-mobile md:text-headline-xl mb-2">Jeden čas, čtyři podoby</h2>
          <p className="text-body-xl text-on-surface-variant">Všechny čtyři karty ukazují stejný okamžik — právě teď.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="A • Digitální" dot="bg-emerald-500" bg="#FEF08A" ink="#713F12" note="Nejčastější podoba na telefonech, počítačích a mikrovlnkách.">
            <p className="font-label text-3xl xl:text-4xl font-bold tracking-tight text-on-surface bg-white chunky-border py-3 px-4 rounded-xl tabular-nums">{digital}</p>
          </Card>
          <Card title="B • Analogové" dot="bg-blue-600" bg="#BAE6FD" ink="#0369A1" note="Krátká ručička hodiny, dlouhá minuty, tenká červená vteřiny.">
            <SmallClock date={now} label={`Ručičkové hodiny ukazují ${words}`} />
          </Card>
          <Card title="C • Binární" dot="bg-purple-600" bg="#E9D5FF" ink="#581C87" note="Každá číslice ve sloupci teček 8-4-2-1. Takhle počítají počítače.">
            <div className="flex gap-2 bg-white/70 py-2.5 px-3 rounded-xl border-2 border-[#1c1c17]" role="img" aria-label={`Binární hodiny ukazují ${digital}`}>
              {toBinaryColumns(now).map((bits, i) => (
                <div key={i} className={`flex flex-col gap-1 items-center ${i % 2 === 1 && i < 5 ? 'mr-1.5' : ''}`}>
                  <span className="text-[10px] font-label font-bold">{digits[i]}</span>
                  {bits.map((on, j) => (
                    <span key={j} className={`w-4 h-4 rounded-full border ${on ? 'bg-purple-600 border-slate-900' : 'bg-slate-200 border-slate-500'}`} />
                  ))}
                </div>
              ))}
            </div>
          </Card>
          <Card title="D • Slovy" dot="bg-amber-500" bg="#FED7AA" ink="#7C2D12" note="Jak si čas řekneme, když se potkáme na ulici (zaokrouhleno na 5 minut).">
            <p className="font-display text-2xl xl:text-3xl font-extrabold text-[#9A3412] text-center bg-white py-2 px-3 rounded-xl chunky-border w-full">{words}</p>
          </Card>
        </div>

        <div className="reveal mt-space-xl max-w-4xl mx-auto bg-surface-container-lowest chunky-border rounded-3xl p-5 md:p-8 chunky-shadow-lg">
          <h3 className="font-display text-headline-md mb-1">Jak hodiny zpřesňovaly</h3>
          <p className="text-on-surface-variant mb-6">O kolik se hodiny spletou za den. Každý dílek osy znamená 10× přesnější hodiny.</p>
          <ol className="flex flex-col gap-3">
            {CHAPTERS.filter((c) => c.perDay).map((c) => (
              <li key={c.id} className="grid grid-cols-1 sm:grid-cols-[11rem_1fr] gap-1 sm:gap-4 items-center">
                <a href={`#${c.id}`} className="font-label text-label-caps hover:text-primary">{c.when} • {c.title}</a>
                <div className="flex flex-col gap-1">
                  <div className="h-5 rounded-full chunky-border bg-[repeating-linear-gradient(90deg,transparent_0_calc(100%/15-1px),#1c1c1726_calc(100%/15-1px)_calc(100%/15))]" aria-hidden="true">
                    <div className="h-full rounded-full border-r-2 border-on-surface" style={{ width: barWidth(c.perDay), backgroundColor: c.bg }} />
                  </div>
                  <span className="text-caption text-on-surface-variant">{c.error}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="reveal mt-space-xl text-center max-w-2xl mx-auto">
          <p className="font-display text-headline-md">Od stínu tyče v poušti po kmitání atomu.</p>
          <p className="text-body-xl text-on-surface-variant mt-2">A teď už čas přečteš i ty — na mobilu, na zdi i podle slunce.</p>
          <a href="#nauc-se" className="chunky-btn inline-flex items-center gap-2 mt-6 bg-primary-container text-on-primary-container font-label text-label-caps px-5 py-2 rounded-xl">
            <span className="icon text-[18px]" aria-hidden="true">replay</span>
            Procvičit znovu
          </a>
        </div>
      </div>
    </section>
  );
}
