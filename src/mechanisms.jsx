// Design workbench (dev only, open /mechanismy.html): every chapter drawing with a slider for `p`,
// so the gears can be stepped through slowly. See docs/mechanismy.md for the mechanisms behind them.
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/anybody/wdth.css';
import '@fontsource-variable/atkinson-hyperlegible-next';
import './index.css';
import { CHAPTERS } from './components/Chapter.jsx';

function Bench({ title, when, Art }) {
  const [p, setP] = useState(0);
  return (
    <section className="screen p-6">
      <h2 className="font-display font-extrabold text-2xl">{title}</h2>
      <p className="text-sm mb-4">{when}</p>
      <div className="h-[380px]"><Art p={p} /></div>
      <label className="flex items-center gap-3 font-bold mt-4">
        p = {p.toFixed(3)}
        <input type="range" min="0" max="1" step="0.001" value={p} onChange={(e) => setP(Number(e.target.value))} className="w-full h-11 accent-actor" />
      </label>
    </section>
  );
}

createRoot(document.getElementById('root')).render(
  <main className="max-w-stage mx-auto px-4 py-12 grid gap-10 md:grid-cols-2">
    <h1 className="cond text-6xl md:col-span-2">Mechanismy hodin</h1>
    {CHAPTERS.map(({ id, title, when, Art }) => <Bench key={id} title={title} when={when} Art={Art} />)}
  </main>,
);
