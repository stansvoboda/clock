const ERAS = [
  {
    id: 'voda', when: 'cca 1400 př. n. l.', title: 'Voda a písek', error: 'Chyba: ~15 minut denně',
    text: 'Klepsydra (vodní hodiny) a přesýpací hodiny. První měřiče nezávislé na slunci a počasí.',
    bg: '#38BDF8', ink: '#082F49',
    icon: <><path d="M30 8C30 8 14 28 14 38A16 16 0 0 0 46 38C46 28 30 8 30 8Z" fill="#0284C7" stroke="#1c1c17" strokeLinejoin="round" strokeWidth="3" /><circle cx="24" cy="36" r="3" fill="#fff" /></>,
  },
  {
    id: 'ozubena-kola', when: '13. století', title: 'Ozubená kola', error: 'Chyba: ~10 minut denně',
    text: 'Mechanické věžní stroje se závažím a lihýřem. Odbíjely hodiny v klášterech a na náměstích.',
    bg: '#FB923C', ink: '#431407',
    icon: <><circle cx="30" cy="30" r="20" fill="#EA580C" stroke="#1c1c17" strokeWidth="3" /><circle cx="30" cy="30" r="8" fill="#fff" stroke="#1c1c17" strokeWidth="2.5" /><path d="M30 4V10M30 50V56M4 30H10M50 30H56M12 12L16 16M44 44L48 48M12 48L16 44M44 16L48 12" stroke="#1c1c17" strokeLinecap="round" strokeWidth="4.5" /></>,
  },
  {
    id: 'kyvadlo', when: '1656', title: 'Kyvadlo', error: 'Chyba: ~10 sekund denně',
    text: 'Christiaan Huygens využil stálou dobu kyvu. Hodiny najednou zpřesnily z minut na sekundy.',
    bg: '#FB7185', ink: '#4C0519',
    icon: <><line x1="30" y1="8" x2="30" y2="38" stroke="#1c1c17" strokeWidth="3" /><circle cx="30" cy="44" r="11" fill="#E11D48" stroke="#1c1c17" strokeWidth="3" /><circle cx="30" cy="8" r="4" fill="#1c1c17" /></>,
  },
  {
    id: 'kremen', when: '1927', title: 'Křemen', error: 'Chyba: ~1 sekunda za měsíc',
    text: 'Křemenný krystal kmitá tisícekrát za sekundu a drží čas mnohem přesněji než kyvadlo. Dnes je v každých levných hodinkách.',
    bg: '#C084FC', ink: '#3B0764',
    icon: <><polygon points="30,6 48,22 38,52 22,52 12,22" fill="#7E22CE" stroke="#1c1c17" strokeLinejoin="round" strokeWidth="3" /><line x1="12" y1="22" x2="48" y2="22" stroke="#1c1c17" strokeWidth="2.5" /><line x1="30" y1="6" x2="30" y2="52" stroke="#1c1c17" strokeWidth="2.5" /></>,
  },
  {
    id: 'atom', when: '1955', title: 'Atomové hodiny', error: 'Dnes: 1 s za 100 mil. let',
    text: 'Atom cesia kmitá 9 192 631 770krát za sekundu. Podle něj se řídí družice GPS i internet.',
    bg: '#4ADE80', ink: '#052E16',
    icon: <><ellipse cx="30" cy="30" rx="24" ry="8" fill="none" stroke="#1c1c17" strokeWidth="2.5" transform="rotate(30 30 30)" /><ellipse cx="30" cy="30" rx="24" ry="8" fill="none" stroke="#1c1c17" strokeWidth="2.5" transform="rotate(-30 30 30)" /><circle cx="30" cy="30" r="7" fill="#15803D" stroke="#1c1c17" strokeWidth="2.5" /></>,
  },
];

// Rendered in two parts around the Prague Orloj, so the story stays in chronological order.
export default function Milestones({ part }) {
  const [label, title, text, eras, cols] = part === 1
    ? ['Kapitola 2 • Bez slunce', 'Voda, písek a ozubená kola', 'Hodiny, které jdou i v noci a pod mrakem.', ERAS.slice(0, 2), '']
    : ['Kapitola 4 • Přesnost', 'Kyvadlo, křemen a atom', 'Každá nová technologie zmenšila chybu měření — z minut na sekundy a z sekund na miliardtiny sekundy.', ERAS.slice(2), 'lg:grid-cols-3'];

  return (
    <section className="py-space-xl border-t-2 border-on-surface bg-surface">
      <div className="max-w-[1380px] mx-auto px-4 md:px-margin">
        <div className="reveal flex flex-col lg:flex-row justify-between lg:items-end mb-10 gap-4">
          <div>
            <span className="font-label text-label-caps text-primary uppercase">{label}</span>
            <h2 className="font-display text-headline-xl-mobile md:text-headline-xl">{title}</h2>
          </div>
          <p className="text-on-surface-variant max-w-md">{text}</p>
        </div>

        <ol className={`grid grid-cols-1 sm:grid-cols-2 ${cols} gap-4`}>
          {eras.map((era) => (
            <li
              key={era.id}
              id={era.id}
              className="reveal scroll-mt-24 sm:last:odd:col-span-2 lg:last:odd:col-span-1 rounded-2xl p-5 chunky-shadow flex flex-col justify-between border-[3px] border-[#1c1c17]"
              style={{ backgroundColor: era.bg, color: era.ink }}
            >
              <div>
                <div className="w-20 h-20 rounded-2xl bg-white border-[3px] border-[#1c1c17] flex items-center justify-center mb-4 mx-auto chunky-shadow-sm">
                  <svg className={`w-14 h-14 icon-${era.id}`} viewBox="0 0 60 60" aria-hidden="true">{era.icon}</svg>
                </div>
                <span className="font-label text-xs font-bold block text-center uppercase tracking-wider">{era.when}</span>
                <h3 className="font-display text-headline-sm font-bold mt-1 mb-2 text-center text-on-surface">{era.title}</h3>
                <p className="text-caption text-center">{era.text}</p>
              </div>
              <p className="mt-4 pt-3 border-t-2 border-[#1c1c17] text-xs font-label font-bold text-center bg-white/60 py-1 rounded-lg">{era.error}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
