import { useEffect, useState } from 'react';
import { GameProvider, useGame } from './game';
import { Hud, QuestDrawer, Toasts } from './components/Hud';
import Arena from './components/Arena';
import {
  Hero, Scoreboard, Missions, RewardFn, Skills, Log, SideQuests, Contact, Footer,
} from './components/Sections';

function Site() {
  const game = useGame();
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'dark');

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* storage can be unavailable */ }
    game.award('night');
  };

  // scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('in')); return undefined; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // visiting a section counts toward the Explorer achievement
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) game.track('section', e.target.dataset.section); });
    }, { threshold: 0.3 });
    document.querySelectorAll('[data-section]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [game.track]);

  return (
    <>
      <Hud theme={theme} onToggle={toggle} />
      <main>
        <Hero />
        <Scoreboard />
        <Arena />
        <Missions />
        <RewardFn />
        <Skills />
        <Log />
        <SideQuests />
        <Contact />
      </main>
      <Footer />
      <QuestDrawer />
      <Toasts />
    </>
  );
}

export default function App() {
  return (
    <GameProvider>
      <Site />
    </GameProvider>
  );
}
