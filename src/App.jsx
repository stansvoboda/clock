import { useEffect } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Sundial from './components/Sundial.jsx';
import Orloj from './components/Orloj.jsx';
import Chapter, { CHAPTERS } from './components/Chapter.jsx';
import LearnClock from './components/LearnClock.jsx';
import Finale from './components/Finale.jsx';
import Footer from './components/Footer.jsx';
import { useActiveId } from './scroll.js';

// Each scene's cyclorama light, in story order.
const LIGHTS = {
  hero: '#F4B23E',
  slunce: '#F7D154',
  ...Object.fromEntries(CHAPTERS.map((c) => [c.id, c.bg])),
  orloj: '#79A6E6',
  'nauc-se': '#F4B23E',
  dnes: '#F7D154',
};
const SCENE_IDS = Object.keys(LIGHTS);

// Changes the stage light when a new scene crosses the middle of the viewport.
function Lighting() {
  const active = useActiveId(SCENE_IDS);
  useEffect(() => {
    if (!active) return;
    document.documentElement.style.setProperty('--cyc', LIGHTS[active]);
    document.querySelector('meta[name=theme-color]')?.setAttribute('content', LIGHTS[active]);
  }, [active]);
  return null;
}

export default function App() {
  return (
    <>
      <Lighting />
      <Header />
      <main>
        <Hero />
        <Sundial />
        {CHAPTERS.slice(0, 2).map((chapter, i) => <Chapter key={chapter.id} number={i + 2} {...chapter} />)}
        <Orloj />
        {CHAPTERS.slice(2).map((chapter, i) => <Chapter key={chapter.id} number={i + 5} {...chapter} />)}
        <LearnClock />
        <Finale />
      </main>
      <Footer />
    </>
  );
}
