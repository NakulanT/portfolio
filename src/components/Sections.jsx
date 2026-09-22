import { useEffect, useRef, useState } from 'react';
import profileImg from '../assets/profile.jpg';
import { profile, links, stats, work, principles, stack, timeline, projects } from '../data';
import { useGame, MISSION_XP } from '../game';
import { arts, Icon } from './Art';

const pad = (n) => String(n).padStart(2, '0');

export function Hero() {
  const g = useGame();
  const start = (e) => {
    e.preventDefault();
    g.award('start');
    document.getElementById('arena')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <section className="hero container" id="top" data-section="top">
      <div className="hero-copy">
        <p className="boot reveal"><span className="dot" /> PORTFOLIO.EXE · v1.0 · player loaded</p>
        <h1 className="reveal d1"><span className="glitch" data-text="NAKULAN T">NAKULAN T</span></h1>
        <p className="class reveal d2">AI ENGINEER <i>/</i> AGENTIC GENAI <i>/</i> COMPUTER VISION</p>
        <p className="lead reveal d2">
          I turn messy business problems into reliable, monitored and maintainable AI systems. This site is an environment: a real reinforcement-learning agent lives in it, and you can change its world.
        </p>
        <div className="cta reveal d3">
          <a className="gbtn primary big" href="#arena" onClick={start}><Icon name="play" /> Press start</a>
          <a className="gbtn big" href="#contact">Recruit player one</a>
        </div>
        <pre className="term reveal d4" aria-hidden="true">{`> agent.train(episodes=∞)
> reward = solved_problems − downtime
> status: open to conversations_`}</pre>
      </div>

      <aside className="player panel reveal d2" aria-label="Player card">
        <div className="player-tag"><span>PLAYER 1</span><span>READY</span></div>
        <img src={profileImg} alt="Portrait of Nakulan T" width="640" height="640" />
        <dl className="player-stats">
          <div><dt>Name</dt><dd>{profile.name}</dd></div>
          <div><dt>Class</dt><dd>{profile.role}</dd></div>
          <div><dt>Guild</dt><dd>{profile.company}</dd></div>
          <div><dt>Base</dt><dd>{profile.location}</dd></div>
          <div className="badge-row"><dt>Badge</dt><dd>AWS Certified Machine Learning Engineer – Associate</dd></div>
        </dl>
      </aside>
    </section>
  );
}

function CountUp({ value, prefix = '', suffix = '', decimals = 0 }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(value); return undefined; }
    let raf;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / 1300, 1);
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

export function Scoreboard() {
  return (
    <section className="container scoreboard">
      {stats.map((s, i) => (
        <div className={`score panel reveal d${i}`} key={s.label}>
          <p className="mini-label">Score {pad(i + 1)}</p>
          <div className="num"><CountUp {...s} /></div>
          <p>{s.label}</p>
        </div>
      ))}
    </section>
  );
}

function Mission({ w, i }) {
  const g = useGame();
  const cleared = g.missions.includes(w.id);
  const Art = arts[w.art];
  const clear = () => g.track('mission', w.id);
  const onMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * 10).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${((0.5 - (e.clientY - r.top) / r.height) * 8).toFixed(2)}deg`);
  };
  const onLeave = (e) => { e.currentTarget.style.setProperty('--rx', '0deg'); e.currentTarget.style.setProperty('--ry', '0deg'); };
  return (
    <div className={`card-wrap reveal d${i % 3}`}>
      <article
        className={`card mission${cleared ? ' cleared' : ''}`}
        role="button"
        tabIndex={0}
        aria-pressed={cleared}
        onClick={clear}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clear(); } }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <div className="mission-tag"><span>MISSION {pad(i + 1)}</span><span className="state">{cleared ? 'CLEARED' : `+${MISSION_XP} XP`}</span></div>
        <div className="art-wrap"><Art /></div>
        <div className="card-body">
          <h3>{w.title}</h3>
          <p className="lbl">Objective</p>
          <p className="problem">{w.problem}</p>
          <p className="lbl">Solution</p>
          <p>{w.solution}</p>
          <ul className="tags">{w.tags.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      </article>
    </div>
  );
}

export function Missions() {
  const g = useGame();
  return (
    <section className="container section" id="missions" data-section="missions">
      <div className="section-head reveal">
        <p className="eyebrow">Level 02 · Missions</p>
        <h2>Problems I solved, end to end.</h2>
        <p className="sub">Each mission started with someone who was stuck. Click a mission to clear it and earn XP. {g.missions.length}/{work.length} cleared.</p>
      </div>
      <div className="bento">
        {work.map((w, i) => <Mission key={w.id} w={w} i={i} />)}
      </div>
    </section>
  );
}

export function RewardFn() {
  return (
    <section className="container section" id="reward">
      <div className="section-head reveal">
        <p className="eyebrow">Design notes</p>
        <h2>My reward function.</h2>
        <p className="sub">What I optimise for when I build. If you train an agent on the wrong reward, it will find a clever way to fail, and the same is true of a team.</p>
      </div>
      <div className="terms">
        {principles.map((p, i) => (
          <div className={`term panel reveal d${i}`} key={p.n}>
            <p className="mini-label">Term {p.n}</p>
            <h3><span className="plus">+</span> {p.title}</h3>
            <p>{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section className="container section" id="skills" data-section="skills">
      <div className="section-head reveal">
        <p className="eyebrow">Level 03 · Skill tree</p>
        <h2>What I build with.</h2>
      </div>
      <div className="tree">
        {stack.map((grp, i) => (
          <div className={`branch panel reveal d${i % 3}`} key={grp.group}>
            <h3><i /> {grp.group}</h3>
            <ul>
              {grp.items.map((it) => <li className="node" key={it}><i />{it}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Log() {
  return (
    <section className="container section" id="log" data-section="log">
      <div className="section-head reveal">
        <p className="eyebrow">Level 04 · Save points</p>
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
        <aside className="cert panel reveal d1">
          <p className="eyebrow">Achievement unlocked</p>
          <h3>AWS Certified Machine Learning Engineer – Associate</h3>
          <p className="org">Issued Sep 2026 · Valid to Sep 2029</p>
        </aside>
      </div>
    </section>
  );
}

export function SideQuests() {
  return (
    <section className="container section" id="quests">
      <div className="section-head reveal">
        <p className="eyebrow">Side quests</p>
        <h2>Where the curiosity goes.</h2>
      </div>
      <ul className="project-list">
        {projects.map((p, i) => (
          <li className={`reveal d${i % 3}`} key={p.name}>
            <a href={p.href} target="_blank" rel="noreferrer">
              <span className="pn">{pad(i + 1)}</span>
              <span className="pt"><b>{p.name}</b><small>{p.stack}</small></span>
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
  const g = useGame();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      g.award('contact');
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      window.location.href = `mailto:${profile.email}`;
    }
  };
  return (
    <section className="container section contact" id="contact" data-section="contact">
      <div className="contact-card panel reveal">
        <p className="eyebrow">Player two</p>
        <h2>Ready to build something that holds up?</h2>
        <p className="sub">Have an AI problem worth solving, or a team that needs an engineer who also cares how it feels? I would love to hear about it.</p>
        <div className="cta">
          <a className="gbtn primary big" href={`mailto:${profile.email}`}><Icon name="mail" /> {profile.email}</a>
          <button className="gbtn big" onClick={copy}><Icon name="copy" /> {copied ? 'Copied' : 'Copy email'}</button>
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
  const g = useGame();
  return (
    <footer className="container footer">
      <span>© {new Date().getFullYear()} Nakulan T · built with React, Three.js and a little Q-learning</span>
      <span className="konami">↑ ↑ ↓ ↓ ← → ← → B A</span>
      <button className="link-btn" onClick={g.reset}>New game</button>
    </footer>
  );
}
