import { useActiveId } from '../scroll.js';

const LINKS = [
  ['slunce', 'Slunce'],
  ['voda', 'Voda'],
  ['ozubena-kola', 'Ozubená kola'],
  ['orloj', 'Orloj'],
  ['kyvadlo', 'Kyvadlo'],
  ['kremen', 'Křemen'],
  ['atom', 'Atom'],
  ['nauc-se', 'Nauč se'],
];
const IDS = LINKS.map(([id]) => id);

export default function Header() {
  const active = useActiveId(IDS);
  const chapter = LINKS.find(([id]) => id === active)?.[1];

  return (
    <header className="sticky top-0 z-50 w-full bg-surface border-b-2 border-on-surface shadow-[0_4px_0_0_#1c1c17]">
      <div className="flex justify-between items-center w-full px-4 md:px-margin max-w-[1380px] mx-auto h-16 gap-4">
        <a href="#hero" className="min-h-11 flex items-center gap-2 font-display text-headline-sm md:text-headline-md font-bold text-primary tracking-tight">
          <span className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container chunky-border flex items-center justify-center chunky-shadow-sm shrink-0">
            <span className="icon text-[20px]" aria-hidden="true">schedule</span>
          </span>
          <span className={chapter ? 'hidden sm:inline' : ''}>Jak lidé měřili čas</span>
        </a>
        {chapter && (
          <span className="lg:hidden font-label text-label-caps bg-amber-300 chunky-border px-3 py-1 rounded-full truncate" aria-hidden="true">
            {chapter}
          </span>
        )}
        <nav aria-label="Kapitoly" className="hidden lg:flex items-center gap-5 font-label text-label-caps">
          {LINKS.map(([id, text]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={id === active ? 'location' : undefined}
              className={`py-3 transition-colors hover:text-primary ${id === active ? 'text-primary font-bold underline decoration-2 underline-offset-8' : 'text-on-surface-variant font-medium'}`}
            >
              {text}
            </a>
          ))}
        </nav>
        <a href="#nauc-se" className="chunky-btn bg-primary-container text-on-primary-container font-label text-label-caps px-4 py-2 rounded-xl flex items-center gap-1.5 shrink-0">
          <span className="icon text-[18px]" aria-hidden="true">play_circle</span>
          <span className="hidden sm:inline">Vyzkoušet hodiny</span>
          <span className="sm:hidden">Nauč se</span>
        </a>
      </div>
      <div className="scroll-progress h-1 bg-primary-container" aria-hidden="true" />
    </header>
  );
}
