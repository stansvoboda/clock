import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Sundial from './components/Sundial.jsx';
import Orloj from './components/Orloj.jsx';
import Milestones from './components/Milestones.jsx';
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
        <Milestones part={1} />
        <Orloj />
        <Milestones part={2} />
        <LearnClock />
        <Finale />
      </main>
      <Footer />
    </>
  );
}
