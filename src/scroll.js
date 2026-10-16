import { useEffect, useState } from 'react';

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 0 when the element's top reaches the middle of the viewport, 1 when its bottom does.
// Returns null until the user scrolls, so the initial state is left alone.
export function useScrollProgress(ref) {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = ref.current.getBoundingClientRect();
      setProgress(Math.min(1, Math.max(0, (innerHeight / 2 - rect.top) / rect.height)));
    };
    const onScroll = () => {
      frame ||= requestAnimationFrame(update);
    };
    addEventListener('scroll', onScroll, { passive: true });
    return () => {
      removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ref]);

  return progress;
}

// Id of the element (from `ids`) that currently crosses the middle of the viewport.
// When several do (cards side by side), the first one in `ids` wins.
// `ids` must be a stable array (a module constant).
export function useActiveId(ids) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const crossing = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => (entry.isIntersecting ? crossing.add(entry.target.id) : crossing.delete(entry.target.id)));
        const first = ids.find((id) => crossing.has(id));
        if (first) setActive(first);
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
