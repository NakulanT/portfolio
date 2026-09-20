import { useEffect, useState } from 'react';
import {
  Nav, Hero, Marquee, Stats, Work, Approach, Stack, Journey, Projects, Contact, Footer,
} from './components/Sections';

export default function App() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'dark',
  );

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* storage can be unavailable */ }
  };

  // scroll-reveal
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return undefined;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // soft cursor glow
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine) return undefined;
    const move = (e) => {
      document.documentElement.style.setProperty('--cx', `${e.clientX}px`);
      document.documentElement.style.setProperty('--cy', `${e.clientY}px`);
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);

  return (
    <>
      <div className="glow" aria-hidden="true" />
      <Nav theme={theme} onToggle={toggle} />
      <main>
        <Hero />
        <Marquee />
        <Stats />
        <Work />
        <Approach />
        <Stack />
        <Journey />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
