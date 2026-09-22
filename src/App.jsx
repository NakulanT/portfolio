import { useEffect, useRef } from 'react';
import { createSculpture } from './sculpture';
import { profile, links, stats, work, principles, stack, timeline, projects } from './data';
import photo from './assets/profile.jpg';

const pad = (n) => String(n).padStart(2, '0');
const fmt = (s) => `${s.prefix || ''}${s.decimals ? s.value.toFixed(s.decimals) : s.value}${s.suffix}`;

function Section({ id, mood, label, title, children }) {
  return (
    <section id={id} data-mood={mood} className="section">
      <header className="section-head reveal">
        <span className="label">{label}</span>
        {title && <h2>{title}</h2>}
      </header>
      {children}
    </section>
  );
}

export default function App() {
  const canvas = useRef(null);

  // the sculpture, and its mood following whichever section fills the middle of the screen
  useEffect(() => {
    const s = createSculpture(canvas.current);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) s.setMood(e.target.dataset.mood); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    document.querySelectorAll('[data-mood]').forEach((el) => io.observe(el));
    return () => { io.disconnect(); s.dispose(); };
  }, []);

  // gentle fade-up as things enter
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const email = links.find((l) => l.icon === 'mail');

  return (
    <>
      <canvas ref={canvas} className="sculpture" aria-hidden="true" />

      <nav className="nav">
        <a href="#top" className="brand">Nakulan T</a>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#projects">Projects</a>
          <a href="#path">Experience</a>
          <a href="#contact" className="nav-cta">Contact</a>
        </div>
      </nav>

      <main className="page">
        <section id="top" data-mood="hero" className="hero">
          <div className="hero-meta reveal">
            <img src={photo} alt="Nakulan T" className="avatar" width="56" height="56" />
            <div>
              <div className="hero-role">{profile.role} at {profile.company}</div>
              <div className="hero-loc">{profile.location} · AWS Certified ML Engineer, Associate</div>
            </div>
          </div>
          <h1 className="hero-title reveal">
            I build AI that <em>people can trust</em>, run and understand.
          </h1>
          <p className="hero-lede reveal">
            Agentic GenAI on AWS Bedrock AgentCore, observable LLM systems and real-time computer vision,
            designed from the problem outward.
          </p>
          <div className="hero-actions reveal">
            <a className="btn btn-dark" href={email.href}>Say hello</a>
            <a className="btn" href="#work">See the work ↓</a>
          </div>
        </section>

        <Section id="numbers" mood="numbers" label="In numbers">
          <ul className="numbers">
            {stats.map((s) => (
              <li key={s.label} className="reveal">
                <b>{fmt(s)}</b>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="work" mood="work" label="Selected work" title="Problems first, then the system that solves them.">
          <ol className="work">
            {work.map((w, i) => (
              <li key={w.id} className="work-item reveal">
                <span className="work-n">{pad(i + 1)}</span>
                <div className="work-main">
                  <h3>{w.title}</h3>
                  <div className="work-cols">
                    <div><span className="mini">Problem</span><p>{w.problem}</p></div>
                    <div><span className="mini">What I built</span><p>{w.solution}</p></div>
                  </div>
                  <ul className="tags">{w.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="method" mood="method" label="How I work">
          <ol className="method">
            {principles.map((p) => (
              <li key={p.title} className="reveal">
                <span className="method-n">{p.n}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="projects" mood="projects" label="Side projects" title="Things I built to learn.">
          <ul className="projects">
            {projects.map((p) => (
              <li key={p.name} className="reveal">
                <a href={p.href} target="_blank" rel="noreferrer">
                  <span className="pj-name">{p.name}</span>
                  <span className="pj-stack">{p.stack}</span>
                  <span className="pj-note">{p.note}</span>
                  <span className="pj-go" aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="stack" mood="stack" label="Toolkit">
          <div className="stack">
            {stack.map((g) => (
              <div key={g.group} className="stack-g reveal">
                <h3>{g.group}</h3>
                <p>{g.items.join(' · ')}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="path" mood="path" label="Experience & education">
          <ol className="path">
            {timeline.map((t) => (
              <li key={t.title} className="reveal">
                <span className="path-when">{t.when}</span>
                <div>
                  <h3>{t.title}</h3>
                  <span className="path-org">{t.org}</span>
                  <p>{t.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <section id="contact" data-mood="contact" className="contact">
          <span className="label reveal">Contact</span>
          <h2 className="contact-title reveal">Have a problem worth solving? <em>Let's talk.</em></h2>
          <a className="contact-mail reveal" href={email.href}>{email.handle}</a>
          <ul className="contact-links reveal">
            {links.filter((l) => l.icon !== 'mail').map((l) => (
              <li key={l.label}><a href={l.href} target="_blank" rel="noreferrer">{l.label} <span>{l.handle}</span></a></li>
            ))}
          </ul>
        </section>

        <footer className="footer">© {new Date().getFullYear()} Nakulan T · Built with React and Three.js</footer>
      </main>
    </>
  );
}
