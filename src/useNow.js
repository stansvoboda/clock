import { useEffect, useState } from 'react';

// Re-renders at every full second, so displays never skip or lag.
export function useNow() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setTimeout(() => setNow(new Date()), 1000 - now.getMilliseconds());
    return () => clearTimeout(id);
  }, [now]);

  return now;
}
