export default function Footer() {
  return (
    <footer className="bg-surface-container-highest border-t-2 border-on-surface">
      <div className="flex flex-col lg:flex-row justify-between items-center px-4 md:px-margin py-space-lg max-w-[1380px] mx-auto gap-space-md">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <span className="font-display text-headline-md font-bold text-primary">Jak lidé měřili čas</span>
          <p className="text-on-surface-variant mt-1">© 2026 Stanislav Svoboda — hravý průvodce historií měření času</p>
          <p className="text-caption text-on-surface-variant mt-2">
            Zdroje:{' '}
            {[['https://www.rmg.co.uk', 'Royal Museums Greenwich'], ['https://www.nist.gov/pml/time-and-frequency-division', 'NIST'], ['https://www.bipm.org', 'BIPM'], ['https://www.orloj.eu', 'orloj.eu']].map(([href, name], i) => (
              <span key={href}>{i > 0 && ' · '}<a href={href} className="underline hover:text-primary">{name}</a></span>
            ))}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href="#hero" className="chunky-btn bg-surface-container-lowest font-label text-label-caps px-4 py-2 rounded-xl flex items-center gap-1.5">
            <span className="icon text-sm" aria-hidden="true">north</span>
            Zpět na začátek
          </a>
          <a href="https://github.com/stansvoboda/clock" className="chunky-btn bg-surface-container-lowest font-label text-label-caps px-4 py-2 rounded-xl flex items-center gap-1.5">
            <span className="icon text-sm" aria-hidden="true">code</span>
            Zdrojový kód na GitHubu
          </a>
        </div>
      </div>
    </footer>
  );
}
