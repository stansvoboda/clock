import { formatDigital } from '../clocks/digital.js';
import { useNow } from '../useNow.js';
import { Dial } from './AnalogClock.jsx';
import Icon from './Icon.jsx';

const dateFormat = new Intl.DateTimeFormat('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

function utcOffset(date) {
  const minutes = -date.getTimezoneOffset();
  const sign = minutes < 0 ? '−' : '+';
  const abs = Math.abs(minutes);
  return `UTC ${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`;
}

// The performer on its stand, telling the real time.
export function Performer({ date, label, className }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <Dial date={date} label={label} seconds className="w-full aspect-square drop-shadow-[0_24px_24px_rgb(34_31_43_/_0.35)]" />
      <span className="w-3 h-[6.5rem] lg:h-16 bg-ink -mt-1" aria-hidden="true" />
      <span className="w-24 h-2.5 bg-ink" aria-hidden="true" />
    </div>
  );
}

export default function Hero() {
  const now = useNow();
  const [hh, mm, ss] = formatDigital(now).split(':');
  const date = dateFormat.format(now);

  return (
    <section id="hero" className="relative min-h-[calc(100svh-4rem)] overflow-hidden flex flex-col">
      <p className="surtitle text-center text-base">Výprava dějinami měření času</p>

      <div className="relative flex-1 w-full max-w-stage mx-auto px-4 md:px-8 pt-12 lg:pt-16 pb-48 lg:pb-36 grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-4 lg:gap-y-20 items-start">
        <div className="screen hang lg:col-span-7 p-6 sm:p-10 lg:p-14 [--cable:3rem] lg:[--cable:4rem] fly">
          <h1 className="cond text-[clamp(3.5rem,13vw,6rem)]">Kolik je hodin?</h1>
          <p className="mt-5 text-lg sm:text-xl leading-relaxed max-w-[36ch]">
            Lidé na to odpovídali tisíce let. Pojď se podívat jak — od stínu v poušti až po kmitající atomy — a nauč se hravě číst ručičkové hodiny.
          </p>
        </div>

        <div className="relative lg:col-span-5 lg:self-stretch -mt-24 lg:mt-0 min-h-[15rem] sm:min-h-[26rem] lg:min-h-[34rem]">
          {/* The round screen projects the time digitally; the performer in front shows it on a dial. */}
          <div className="absolute right-0 top-[7rem] lg:top-0 w-[12.5rem] sm:w-[20rem] lg:w-[23rem] aspect-square rounded-full bg-film text-screen flex flex-col items-center justify-center text-center shadow-[0_28px_44px_-24px_rgb(34_31_43_/_0.6)]">
            <span className="absolute bottom-full left-1/2 w-[1.5px] h-16 bg-ink" aria-hidden="true" />
            <p className="text-xs sm:text-sm font-bold px-6">Reálný místní čas právě teď</p>
            <time dateTime={now.toISOString()} className="wide font-bold text-3xl sm:text-5xl lg:text-6xl leading-none tabular-nums my-2">
              {hh}:{mm}<span className="text-[0.55em] align-top ml-1 opacity-80">{ss}</span>
            </time>
            <p className="text-xs sm:text-sm">{date[0].toUpperCase() + date.slice(1)}</p>
            <p className="text-xs mt-1 opacity-80">{utcOffset(now)}</p>
          </div>
          {/* The stand's foot rests on the stage floor below the grid. */}
          <Performer date={now} label={`Ručičkové hodiny ukazují místní čas ${hh}:${mm}`} className="absolute left-0 lg:-left-28 -bottom-[6.75rem] lg:-bottom-[3.5rem] w-[11.5rem] sm:w-[15rem] lg:w-[19rem] z-10" />
        </div>
      </div>

      {/* The stage floor: the cue to start and the programme of the show. */}
      <div className="absolute inset-x-0 bottom-0 h-40 lg:h-28 bg-floor" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-40 lg:h-28 z-20">
        <div className="h-full w-full max-w-stage mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-end lg:items-center justify-center lg:justify-between gap-x-6 gap-y-4 pb-4 lg:pb-0">
          <a href="#slunce" className="cue cue-light shrink-0">
            Scrolluj dolů
            <Icon name="down" className="w-4 h-4" />
          </a>
          <p className="self-stretch lg:self-auto flex flex-wrap text-xs sm:text-sm font-bold text-ink gap-x-4 lg:gap-x-6 lg:ml-auto lg:mr-[min(32%,28rem)]">
            <span>1500 př. n. l.</span>
            <span>1410 Staroměstský orloj</span>
            <span>1955 atomové hodiny</span>
          </p>
        </div>
      </div>
    </section>
  );
}
