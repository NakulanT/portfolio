import { useEffect } from 'react';
import { useGame } from '../../game';
import { Hud, QuestDrawer, Toasts } from '../../components/Hud';
import Arena from '../../components/Arena';
import {
  Hero, Scoreboard, Missions, RewardFn, Skills, Log, SideQuests, Contact, Footer,
} from '../../components/Sections';
import './rl.css';

export function RLSite({ theme, onToggle }) {
  const game = useGame();

  // scroll reveal for elements with the .reveal class (they start hidden in rl.css)
  useEffect(() => {
    const els = document.querySelectorAll('.rl-root .reveal');
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
    document.querySelectorAll('.rl-root [data-section]').forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.track]);

  return (
    <div className="rl-root">
      <Hud theme={theme} onToggle={onToggle} />
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
    </div>
  );
}
