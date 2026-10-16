import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Sundial from './components/Sundial.jsx';
import Orloj from './components/Orloj.jsx';
import Chapter, { CHAPTERS } from './components/Chapter.jsx';
import LearnClock from './components/LearnClock.jsx';
import Finale from './components/Finale.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <>
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
