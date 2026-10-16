import Icon from './Icon.jsx';

const SOURCES = [
  ['https://www.rmg.co.uk', 'Royal Museums Greenwich'],
  ['https://www.nist.gov/pml/time-and-frequency-division', 'NIST'],
  ['https://www.bipm.org', 'BIPM'],
  ['https://www.orloj.eu', 'orloj.eu'],
];

// The apron in front of the stage: credits and the way back to the start.
export default function Footer() {
  return (
    <footer className="bg-ink text-screen">
      <div className="flex flex-col lg:flex-row justify-between items-center px-4 md:px-8 py-12 max-w-stage mx-auto gap-8">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <span className="cond text-4xl">Jak lidé měřili čas</span>
          <p className="mt-2">© 2026 Stanislav Svoboda — hravý průvodce historií měření času</p>
          <p className="text-sm mt-2 text-screen/80">
            Zdroje:{' '}
            {SOURCES.map(([href, name], i) => (
              <span key={href}>{i > 0 && ' · '}<a href={href} className="underline hover:text-[#F4B23E]">{name}</a></span>
            ))}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href="#hero" className="cue cue-light">
            <Icon name="up" className="w-4 h-4" />
            Zpět na začátek
          </a>
          <a href="https://github.com/stansvoboda/clock" className="cue cue-light">
            <Icon name="code" className="w-4 h-4" />
            Zdrojový kód na GitHubu
          </a>
        </div>
      </div>
    </footer>
  );
}
