// The few drawn icons the stage needs, in one 2px stroke on a 24px grid.
const PATHS = {
  down: 'M12 4v15M6 13l6 6 6-6',
  up: 'M12 20V5M6 11l6-6 6 6',
  right: 'M4 12h15M13 6l6 6-6 6',
  bell: 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4',
  shuffle: 'M3 7h4l10 10h4M3 17h4l3-3M14 10l3-3h4M18 4l3 3-3 3M18 14l3 3-3 3',
  replay: 'M4 12a8 8 0 1 0 2.5-5.8M4 4v4h4',
  code: 'M8 7l-5 5 5 5M16 7l5 5-5 5',
  play: 'M8 5v14l11-7z',
};

export default function Icon({ name, className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}
