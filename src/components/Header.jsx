import { useActiveId } from '../scroll.js';
import { useNow } from '../useNow.js';
import { Dial } from './AnalogClock.jsx';
import Icon from './Icon.jsx';

// The cue list: every scene is addressable by its year.
const LINKS = [
  ['slunce', 'Slunce', '−1500'],
  ['voda', 'Voda', '−1400'],
  ['ozubena-kola', 'Ozubená kola', '13. st.'],
  ['orloj', 'Orloj', '1410'],
  ['kyvadlo', 'Kyvadlo', '1656'],
  ['chronometr', 'Moře', '1761'],
  ['pasma', 'Pásma', '1884'],
  ['kremen', 'Křemen', '1927'],
  ['atom', 'Atom', '1955'],
  ['nauc-se', 'Nauč se', 'Dnes'],
  ['dnes', 'Čtyři podoby', 'Teď'],
];
const IDS = LINKS.map(([id]) => id);

// The lighting batten: the performer dial in miniature, the cue list and the way to the lesson.
export default function Header() {
  const active = useActiveId(IDS);
  const chapter = LINKS.find(([id]) => id === active)?.[1];
  const now = useNow();

  return (
    <header className="sticky top-0 z-50 w-full bg-screen border-b-2 border-ink">
      <div className="flex justify-between items-center w-full px-4 md:px-8 max-w-stage mx-auto h-16 gap-4">
        <a href="#hero" className="min-h-11 flex items-center gap-3 shrink-0">
          <Dial date={now} label="" seconds className="w-10 h-10 shrink-0" />
          <span className={`cond text-[1.75rem] whitespace-nowrap ${chapter ? 'sr-only sm:not-sr-only' : ''}`}>Jak lidé měřili čas</span>
        </a>
        {chapter && chapter !== 'Nauč se' && (
          <span className="xl:hidden wide text-xs uppercase truncate" aria-hidden="true">
            {chapter}
          </span>
        )}
        <nav aria-label="Kapitoly" className="hidden xl:flex items-stretch h-full">
          {LINKS.map(([id, text, year]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={id === active ? 'location' : undefined}
              className={`group flex flex-col justify-center px-2.5 border-l border-ink/15 transition-colors ${id === active ? 'bg-ink text-screen' : 'hover:bg-cyc'}`}
            >
              <span className="wide text-[0.8rem] leading-none">{year}</span>
              <span className={`text-xs leading-tight mt-1 ${id === active ? 'text-screen/80' : 'text-ink/70'}`}>{text}</span>
            </a>
          ))}
        </nav>
        <a href="#nauc-se" className="cue cue-actor shrink-0">
          <Icon name="play" className="w-4 h-4" />
          <span className="hidden sm:inline">Vyzkoušet hodiny</span>
          <span className="sm:hidden">Nauč se</span>
        </a>
      </div>
      <div className="scroll-progress h-[3px] bg-actor" aria-hidden="true" />
    </header>
  );
}
