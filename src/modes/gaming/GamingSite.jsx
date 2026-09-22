import { useState } from 'react';
import profileImg from '../../assets/profile.jpg';
import { profile, links, stats, work, principles, stack, timeline, projects } from '../../data';
import { Icon } from '../../components/Art';
import { SceneCanvas } from '../../three/SceneCanvas';
import { buildGamingScene } from './scene';
import './gaming.css';

const pad = (n) => String(n).padStart(2, '0');
const scrollTo = (id) => (e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

export function GamingSite() {
  return (
    <div className="game">
      <div className="game-scan" aria-hidden="true" />
      <Nav />
      <Hero />
      <Hud />
      <Levels />
      <Rules />
      <Inventory />
      <HighScores />
      <Bonus />
      <Continue />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="game-nav">
      <a className="game-logo" href="#game-top" onClick={scrollTo('game-top')}>★ {profile.name.toUpperCase()}</a>
      <nav>
        <a href="#game-levels" onClick={scrollTo('game-levels')}>LEVELS</a>
        <a href="#game-inv" onClick={scrollTo('game-inv')}>INVENTORY</a>
        <a href="#game-scores" onClick={scrollTo('game-scores')}>HI-SCORES</a>
        <a href="#game-bonus" onClick={scrollTo('game-bonus')}>BONUS</a>
        <a href="#game-continue" onClick={scrollTo('game-continue')}>CONTINUE</a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="game-hero" id="game-top">
      <SceneCanvas className="game-scene" build={buildGamingScene} label="A spinning gold coin over a scrolling starfield" />
      <div className="game-marquee"><span>{profile.role.toUpperCase()} · {profile.company.toUpperCase()} · NEW HIGH SCORE · CONTINUE?</span></div>
      <div className="game-hero-copy">
        <p className="game-insert blink">PRESS START</p>
        <h1>{profile.name}</h1>
        <p className="game-sub">{profile.role} — {profile.location}</p>
        <p className="game-lead">I turn messy business problems into reliable, monitored and maintainable AI systems: agentic GenAI on AWS Bedrock AgentCore and real-time computer vision.</p>
        <div className="game-cta">
          <a className="game-btn primary" href="#game-levels" onClick={scrollTo('game-levels')}>1P START</a>
          <a className="game-btn" href="#game-continue" onClick={scrollTo('game-continue')}>2P CONTINUE</a>
        </div>
      </div>
    </section>
  );
}

function Hud() {
  return (
    <section className="game-hud">
      {stats.map((s, i) => (
        <div className="game-tile" key={s.label}>
          <span className="game-tile-k">P{i + 1}</span>
          <b>{s.prefix || ''}{s.value}{s.suffix || ''}</b>
          <p>{s.label}</p>
        </div>
      ))}
    </section>
  );
}

function Levels() {
  return (
    <section className="game-section" id="game-levels">
      <SectionHead k="STAGE SELECT" t="Choose a level." />
      <div className="game-grid">
        {work.map((w, i) => (
          <article className="game-card" key={w.id}>
            <div className="game-card-top"><span>LVL-{pad(i + 1)}</span><span className="game-diff">{'★'.repeat((i % 3) + 1)}</span></div>
            <h3>{w.title}</h3>
            <p className="game-problem">{w.problem}</p>
            <p>{w.solution}</p>
            <ul className="game-tags">{w.tags.map((t) => <li key={t}>{t}</li>)}</ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function Rules() {
  return (
    <section className="game-section">
      <SectionHead k="RULEBOOK" t="How I play." />
      <div className="game-rules">
        {principles.map((p) => (
          <div className="game-rule" key={p.n}>
            <span className="game-tile-k">RULE {p.n}</span>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Inventory() {
  return (
    <section className="game-section" id="game-inv">
      <SectionHead k="INVENTORY" t="Items equipped." />
      <div className="game-inv">
        {stack.map((g) => (
          <div className="game-slot-group" key={g.group}>
            <h3>{g.group}</h3>
            <div className="game-slots">{g.items.map((it) => <span className="game-slot" key={it}>{it}</span>)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HighScores() {
  return (
    <section className="game-section" id="game-scores">
      <SectionHead k="HALL OF FAME" t="High score table." />
      <table className="game-table">
        <thead><tr><th>RANK</th><th>ENTRY</th><th>DETAIL</th><th>DATE</th></tr></thead>
        <tbody>
          {timeline.map((t, i) => (
            <tr key={t.title}>
              <td>{pad(i + 1)}</td>
              <td><b>{t.title}</b><small>{t.org}</small></td>
              <td>{t.text}</td>
              <td>{t.when}</td>
            </tr>
          ))}
          <tr className="game-cert-row">
            <td>★</td>
            <td><b>AWS Certified ML Engineer – Associate</b><small>Amazon Web Services</small></td>
            <td>Unlocked achievement</td>
            <td>Sep 2026 – Sep 2029</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

function Bonus() {
  return (
    <section className="game-section" id="game-bonus">
      <SectionHead k="BONUS STAGE" t="Side quests." />
      <ul className="game-bonus-list">
        {projects.map((p, i) => (
          <li key={p.name}>
            <a href={p.href} target="_blank" rel="noreferrer">
              <span className="game-tile-k">{pad(i + 1)}</span>
              <span className="game-quest-t"><b>{p.name}</b><small>{p.stack}</small></span>
              <span className="game-quest-note">{p.note}</span>
              <Icon name="arrow" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Continue() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch (e) { window.location.href = `mailto:${profile.email}`; }
  };
  return (
    <section className="game-section game-continue" id="game-continue">
      <div className="game-continue-card">
        <SectionHead k="PLAYER 2" t="Ready to co-op?" />
        <div className="game-cta">
          <a className="game-btn primary" href={`mailto:${profile.email}`}><Icon name="mail" /> {profile.email}</a>
          <button className="game-btn" onClick={copy}><Icon name="copy" /> {copied ? 'COPIED' : 'COPY EMAIL'}</button>
        </div>
        <ul className="game-links">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} target={l.icon === 'mail' ? undefined : '_blank'} rel="noreferrer">
                <Icon name={l.icon} /><span><b>{l.label}</b><small>{l.handle}</small></span><Icon name="arrow" />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <img className="game-avatar" src={profileImg} alt={`Portrait of ${profile.name}`} />
    </section>
  );
}

function SectionHead({ k, t }) {
  return (
    <div className="game-section-head">
      <p className="game-eyebrow">[ {k} ]</p>
      <h2>{t}</h2>
    </div>
  );
}

function Footer() {
  return (
    <footer className="game-footer">
      <span>© {new Date().getFullYear()} {profile.name} · GAME OVER? INSERT COIN TO CONTINUE</span>
    </footer>
  );
}
