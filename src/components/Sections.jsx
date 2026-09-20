import { useEffect, useRef, useState } from 'react';
import profileImg from '../assets/profile.jpg';
import {
  profile, links, stats, marquee, work, principles, stack, timeline, projects,
} from '../data';
import { arts, Icon } from './Art';

export function Nav({ theme, onToggle }) {
  return (
    <header className="nav">
      <a className="brand" href="#top" aria-label="Nakulan T, home">
        <span className="mark">n<i /></span>
        <span className="brand-name">Nakulan T</span>
      </a>
      <nav className="nav-links" aria-label="Sections">
        <a href="#work">Work</a>
        <a href="#approach">Approach</a>
        <a href="#stack">Stack</a>
        <a href="#journey">Journey</a>
        <a href="#projects">Projects</a>
      </nav>
      <div className="nav-actions">
        <button className="icon-btn" onClick={onToggle} aria-label="Toggle light and dark theme">
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </button>
        <a className="btn btn-small" href="#contact">Let&apos;s talk</a>
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section className="hero container" id="top">
      <div className="hero-copy">
        <p className="pill reveal"><span className="dot" /> {profile.role} · {profile.company}</p>
        <h1 className="reveal d1">
          I engineer AI systems and design how they <span className="grad">feel</span>.
        </h1>
        <p className="lead reveal d2">
          I turn messy business problems into agentic GenAI and computer vision products that are
          monitored, maintainable and built to last. Based in {profile.location}.
        </p>
        <div className="cta reveal d3">
          <a className="btn" href="#work">See the work <Icon name="arrow" /></a>
          <a className="btn btn-ghost" href="#contact">Get in touch</a>
        </div>
        <ul className="social reveal d4">
          {links.filter((l) => l.icon !== 'mail').map((l) => (
            <li key={l.label}>
              <a href={l.href} target="_blank" rel="noreferrer" aria-label={l.label} title={l.label}>
                <Icon name={l.icon} />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="hero-visual reveal d2">
        <div className="orbit o1" />
        <div className="orbit o2" />
        <div className="portrait">
          <img src={profileImg} alt="Portrait of Nakulan T" width="640" height="640" />
        </div>
        <div className="float f1"><b>AWS Certified</b><span>Machine Learning Engineer – Associate</span></div>
        <div className="float f2"><b>RAG + Guardrails</b><span>relevant, safe answers</span></div>
        <div className="float f3"><b>AgentCore</b><span>agents in production</span></div>
      </div>
    </section>
  );
}

export function Marquee() {
  const row = [...marquee, ...marquee];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="track">
        {row.map((m, i) => (
          <span key={i}>{m}<i /></span>
        ))}
      </div>
    </div>
  );
}

function CountUp({ value, prefix = '', suffix = '', decimals = 0 }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setN(value); return undefined; }
    let raf;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t) => {
        const p = Math.min((t - start) / 1400, 1);
        setN(value * (1 - Math.pow(1 - p, 3)));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value]);
  return <span ref={ref}>{prefix}{n.toFixed(decimals)}{suffix}</span>;
}

export function Stats() {
  return (
    <section className="container stats">
      {stats.map((s, i) => (
        <div className={`stat reveal d${i}`} key={s.label}>
          <div className="num"><CountUp {...s} /></div>
          <p>{s.label}</p>
        </div>
      ))}
    </section>
  );
}

function Spot({ className = '', children }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return <article className={`card spot ${className}`} onMouseMove={onMove}>{children}</article>;
}

export function Work() {
  return (
    <section className="container section" id="work">
      <div className="section-head reveal">
        <p className="eyebrow">Selected work</p>
        <h2>Problems I solved, end to end.</h2>
        <p className="sub">Each one started with a person who was stuck. Illustrations are drawn for this site, not screenshots.</p>
      </div>
      <div className="bento">
        {work.map((w, i) => {
          const Art = arts[w.art];
          return (
            <Spot key={w.id} className={`reveal d${i % 3}`}>
              <div className="art-wrap"><Art /></div>
              <div className="card-body">
                <h3>{w.title}</h3>
                <p className="problem">{w.problem}</p>
                <p>{w.solution}</p>
                <ul className="tags">{w.tags.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
            </Spot>
          );
        })}
      </div>
    </section>
  );
}

export function Approach() {
  return (
    <section className="container section" id="approach">
      <div className="section-head reveal">
        <p className="eyebrow">How I work</p>
        <h2>Engineer's rigour, designer's care.</h2>
      </div>
      <div className="principles">
        {principles.map((p, i) => (
          <div className={`principle reveal d${i}`} key={p.n}>
            <span className="n">{p.n}</span>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Stack() {
  return (
    <section className="container section" id="stack">
      <div className="section-head reveal">
        <p className="eyebrow">Toolbox</p>
        <h2>What I build with.</h2>
      </div>
      <div className="stack-grid">
        {stack.map((g, i) => (
          <div className={`stack-group reveal d${i % 3}`} key={g.group}>
            <h3>{g.group}</h3>
            <ul className="tags">{g.items.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Journey() {
  return (
    <section className="container section" id="journey">
      <div className="section-head reveal">
        <p className="eyebrow">Journey</p>
        <h2>Where I have been building.</h2>
      </div>
      <div className="journey">
        <ol className="timeline">
          {timeline.map((t, i) => (
            <li className={`reveal d${i}`} key={t.title}>
              <span className="when">{t.when}</span>
              <h3>{t.title}</h3>
              <p className="org">{t.org}</p>
              <p>{t.text}</p>
            </li>
          ))}
        </ol>
        <aside className="cert reveal d1">
          <svg viewBox="0 0 120 120" className="badge" aria-hidden="true">
            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 6" />
            <circle cx="60" cy="60" r="40" fill="var(--accent)" opacity="0.12" />
            <path d="m40 62 14 14 28-32" fill="none" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="eyebrow">Certification</p>
          <h3>AWS Certified Machine Learning Engineer – Associate</h3>
          <p className="org">Issued Sep 2026 · Valid to Sep 2029</p>
        </aside>
      </div>
    </section>
  );
}

export function Projects() {
  return (
    <section className="container section" id="projects">
      <div className="section-head reveal">
        <p className="eyebrow">Side projects</p>
        <h2>Where the curiosity goes.</h2>
      </div>
      <ul className="project-list">
        {projects.map((p, i) => (
          <li className={`reveal d${i % 3}`} key={p.name}>
            <a href={p.href} target="_blank" rel="noreferrer">
              <span className="pn">{String(i + 1).padStart(2, '0')}</span>
              <span className="pt">
                <b>{p.name}</b>
                <small>{p.stack}</small>
              </span>
              <span className="pnote">{p.note}</span>
              <span className="parrow"><Icon name="arrow" /></span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      window.location.href = `mailto:${profile.email}`;
    }
  };
  return (
    <section className="container section contact" id="contact">
      <div className="contact-card reveal">
        <p className="eyebrow">Contact</p>
        <h2>Let&apos;s build something that holds up.</h2>
        <p className="sub">Have an AI problem worth solving, or a team that needs an engineer who also cares how it feels? I would love to hear about it.</p>
        <div className="cta">
          <a className="btn" href={`mailto:${profile.email}`}><Icon name="mail" /> {profile.email}</a>
          <button className="btn btn-ghost" onClick={copy}><Icon name="copy" /> {copied ? 'Copied' : 'Copy email'}</button>
        </div>
        <ul className="link-grid">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} target={l.icon === 'mail' ? undefined : '_blank'} rel="noreferrer">
                <Icon name={l.icon} />
                <span><b>{l.label}</b><small>{l.handle}</small></span>
                <Icon name="arrow" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="container footer">
      <span>© {new Date().getFullYear()} Nakulan T</span>
      <span>Designed and built by hand · React · Vite</span>
    </footer>
  );
}
