import { formatDigital } from '../clocks/digital.js';
import { useNow } from '../useNow.js';

const dateFormat = new Intl.DateTimeFormat('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

function utcOffset(date) {
  const minutes = -date.getTimezoneOffset();
  const sign = minutes < 0 ? '−' : '+';
  const abs = Math.abs(minutes);
  return `UTC ${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`;
}

function Badge({ className, dot, children }) {
  return (
    <div className={`absolute hidden xl:flex items-center gap-2 bg-surface-container-lowest chunky-border px-3 py-1.5 rounded-full chunky-shadow ${className}`}>
      <span className={`w-3 h-3 rounded-full chunky-border ${dot}`} />
      <span className="font-label text-label-caps text-on-surface-variant">{children}</span>
    </div>
  );
}

// Decorative shapes floating around the headline, one per era.
function Shapes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none" aria-hidden="true">
      <svg className="absolute top-10 left-[6%] -rotate-12 hidden md:block w-24 h-24" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="34" fill="#FACC15" stroke="#1c1c17" strokeWidth="3" />
        <path d="M50 8V2M50 98V92M8 50H2M98 50H92M21 21L16 16M84 84L79 79M21 79L16 84M84 21L79 16" stroke="#1c1c17" strokeLinecap="round" strokeWidth="3.5" />
        <circle cx="42" cy="46" r="4" fill="#1c1c17" />
        <circle cx="58" cy="46" r="4" fill="#1c1c17" />
        <path d="M40 58Q50 68 60 58" fill="none" stroke="#1c1c17" strokeLinecap="round" strokeWidth="3" />
      </svg>
      <svg className="absolute top-24 right-[8%] rotate-[14deg] hidden md:block w-20 h-28" viewBox="0 0 80 110">
        <path d="M16 14H64L48 55L64 96H16L32 55Z" fill="#38BDF8" stroke="#1c1c17" strokeLinejoin="round" strokeWidth="3" />
        <rect x="10" y="8" width="60" height="8" rx="3" fill="#F97316" stroke="#1c1c17" strokeWidth="3" />
        <rect x="10" y="94" width="60" height="8" rx="3" fill="#F97316" stroke="#1c1c17" strokeWidth="3" />
        <path d="M24 94Q40 76 56 94Z" fill="#FDE047" stroke="#1c1c17" strokeWidth="2.5" />
      </svg>
      <svg className="absolute bottom-20 left-[10%] rotate-[10deg] hidden md:block w-20 h-20" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="#FB923C" stroke="#1c1c17" strokeWidth="3" />
        <circle cx="50" cy="50" r="16" fill="#FDF9F1" stroke="#1c1c17" strokeWidth="3" />
        <path d="M50 4V16M50 84V96M4 50H16M84 50H96M17 17L26 26M74 74L83 83M17 83L26 74M74 26L83 17" stroke="#1c1c17" strokeLinecap="round" strokeWidth="6" />
      </svg>
      <svg className="absolute bottom-16 right-[10%] -rotate-[8deg] hidden md:block w-20 h-24" viewBox="0 0 80 100">
        <line x1="40" y1="10" x2="40" y2="70" stroke="#1c1c17" strokeWidth="3" />
        <circle cx="40" cy="75" r="16" fill="#FB7185" stroke="#1c1c17" strokeWidth="3" />
        <circle cx="40" cy="10" r="5" fill="#1c1c17" />
      </svg>
      <svg className="absolute top-1/2 left-[2%] -translate-y-1/2 rotate-[18deg] hidden lg:block w-20 h-20" viewBox="0 0 100 100">
        <ellipse cx="50" cy="50" rx="40" ry="14" fill="none" stroke="#1c1c17" strokeWidth="3" transform="rotate(30 50 50)" />
        <ellipse cx="50" cy="50" rx="40" ry="14" fill="none" stroke="#1c1c17" strokeWidth="3" transform="rotate(-30 50 50)" />
        <circle cx="50" cy="50" r="10" fill="#4ADE80" stroke="#1c1c17" strokeWidth="3" />
      </svg>
    </div>
  );
}

export default function Hero() {
  const now = useNow();
  const [hh, mm, ss] = formatDigital(now).split(':');
  const date = dateFormat.format(now);

  return (
    <section id="hero" className="relative min-h-[calc(100svh-4rem)] flex flex-col justify-center items-center text-center px-4 md:px-margin bg-grid-pattern overflow-hidden py-space-xl">
      <Shapes />
      <Badge className="top-12 left-10 -rotate-[4deg]" dot="bg-amber-400">1500 př. n. l.</Badge>
      <Badge className="bottom-24 left-16 rotate-[6deg]" dot="bg-sky-400">1410 Staroměstský orloj</Badge>
      <Badge className="top-20 right-14 rotate-[3deg]" dot="bg-violet-400">1955 atomové hodiny</Badge>

      <div className="max-w-4xl mx-auto flex flex-col items-center z-10">
        <div className="inline-flex items-center gap-2 bg-surface-container-lowest chunky-border px-4 py-1.5 rounded-full chunky-shadow mb-6">
          <span className="icon text-primary text-[20px]" aria-hidden="true">auto_stories</span>
          <span className="font-label text-label-caps text-primary">VÝPRAVA DĚJINAMI MĚŘENÍ ČASU</span>
        </div>
        <h1 className="font-display text-display-hero-mobile md:text-display-hero mb-6">Kolik je hodin?</h1>

        <div className="bg-surface-container-lowest chunky-border rounded-3xl p-5 md:p-8 chunky-shadow-lg flex flex-col items-center my-4">
          <p className="text-[12px] font-label tracking-widest text-on-surface-variant uppercase mb-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            Reálný místní čas právě teď
          </p>
          <time
            dateTime={now.toISOString()}
            className="flex items-baseline font-label font-bold text-5xl sm:text-6xl md:text-8xl tracking-tight bg-surface-container px-4 md:px-6 py-3 rounded-2xl chunky-border"
          >
            {hh}<span className="text-primary px-1">:</span>{mm}<span className="text-primary px-1">:</span>
            <span className="text-3xl sm:text-4xl md:text-6xl text-primary-container">{ss}</span>
          </time>
          <div className="mt-3 flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-caption text-on-surface-variant">
            <span>{date[0].toUpperCase() + date.slice(1)}</span>
            <span className="font-label text-xs font-semibold bg-surface-container-high px-2 py-0.5 rounded">{utcOffset(now)}</span>
          </div>
        </div>

        <p className="text-body-xl text-on-surface-variant max-w-2xl mt-6 mb-8">
          Lidé na to odpovídali tisíce let. Pojď se podívat jak — od stínu v poušti až po kmitající atomy — a nauč se hravě číst ručičkové hodiny.
        </p>
        <a href="#slunce" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface-container-lowest chunky-btn font-label text-label-caps motion-safe:animate-bounce">
          Scrolluj dolů
          <span className="icon text-primary text-[20px]" aria-hidden="true">south</span>
        </a>
      </div>
    </section>
  );
}
