import { useState } from 'react';
import profileImg from '../../assets/profile.jpg';
import { profile, links, stats, work, principles, stack, timeline, projects } from '../../data';
import { Icon } from '../../components/Art';
import { SceneCanvas } from '../../three/SceneCanvas';
import { buildJapaneseScene } from './scene';
import './japanese.css';

const pad = (n) => String(n).padStart(2, '0');
const scrollTo = (id) => (e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

export function JapaneseSite() {
  return (
    <div className="jp">
      <Nav />
      <Hero />
      <Scores />
      <Work />
      <Principles />
      <Skills />
      <Log />
      <Quests />
      <Contact />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="jp-nav">
      <a className="jp-brand" href="#jp-top" onClick={scrollTo('jp-top')}>
        <span className="jp-seal">印</span>
        <span>{profile.name}</span>
      </a>
      <nav>
        <a href="#jp-work" onClick={scrollTo('jp-work')}>Work</a>
        <a href="#jp-approach" onClick={scrollTo('jp-approach')}>Approach</a>
        <a href="#jp-skills" onClick={scrollTo('jp-skills')}>Skills</a>
        <a href="#jp-log" onClick={scrollTo('jp-log')}>Journey</a>
        <a href="#jp-contact" onClick={scrollTo('jp-contact')}>Contact</a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="jp-hero" id="jp-top">
      <SceneCanvas className="jp-scene" build={buildJapaneseScene} label="A torii gate with falling sakura petals over still water" />
      <div className="jp-hero-veil" />
      <span className="jp-vertical left">AI ENGINEER · コンピュータビジョン</span>
      <div className="jp-hero-copy">
        <p className="jp-kicker">{profile.company} · {profile.location}</p>
        <h1>{profile.name}</h1>
        <p className="jp-role">{profile.role}</p>
        <p className="jp-lead">I turn messy business problems into reliable, monitored and maintainable AI systems — agentic GenAI on AWS Bedrock AgentCore, and real-time computer vision.</p>
        <div className="jp-cta">
          <a className="jp-btn primary" href="#jp-work" onClick={scrollTo('jp-work')}>View the work</a>
          <a className="jp-btn" href="#jp-contact" onClick={scrollTo('jp-contact')}>Contact</a>
        </div>
      </div>
      <span className="jp-vertical right">令和 · REIWA ERA OF SHIPPING</span>
    </section>
  );
}

function Scores() {
  return (
    <section className="jp-scores">
      {stats.map((s, i) => (
        <div className="jp-score" key={s.label}>
          <span className="jp-score-n">{pad(i + 1)}</span>
          <b>{s.prefix || ''}{s.value}{s.suffix || ''}</b>
          <p>{s.label}</p>
        </div>
      ))}
    </section>
  );
}

function Work() {
  return (
    <section className="jp-section" id="jp-work">
      <SectionHead kicker="経歴 · Case Studies" title="Problems, solved end to end." glyph="記" />
      <div className="jp-scrolls">
        {work.map((w, i) => (
          <article className="jp-scroll" key={w.id}>
            <div className="jp-scroll-index">{pad(i + 1)}</div>
            <div className="jp-scroll-body">
              <h3>{w.title}</h3>
              <p className="jp-problem">{w.problem}</p>
              <p>{w.solution}</p>
              <ul className="jp-tags">{w.tags.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Principles() {
  return (
    <section className="jp-section" id="jp-approach">
      <SectionHead kicker="信条 · Principles" title="The way I work." glyph="道" />
      <div className="jp-principles">
        {principles.map((p) => (
          <div className="jp-principle" key={p.n}>
            <span className="jp-p-n">{p.n}</span>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className="jp-section" id="jp-skills">
      <SectionHead kicker="技 · Craft" title="Tools of the trade." glyph="匠" />
      <div className="jp-skills">
        {stack.map((g) => (
          <div className="jp-skill-group" key={g.group}>
            <h3>{g.group}</h3>
            <ul>{g.items.map((it) => <li key={it}>{it}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Log() {
  return (
    <section className="jp-section" id="jp-log">
      <SectionHead kicker="旅 · Journey" title="Where the path has led." glyph="旅" />
      <ol className="jp-path">
        {timeline.map((t) => (
          <li key={t.title}>
            <span className="jp-when">{t.when}</span>
            <h3>{t.title}</h3>
            <p className="jp-org">{t.org}</p>
            <p>{t.text}</p>
          </li>
        ))}
      </ol>
      <div className="jp-badge">
        <span className="jp-seal small">証</span>
        <div>
          <p className="jp-kicker">Certification</p>
          <h3>AWS Certified Machine Learning Engineer – Associate</h3>
          <p className="jp-org">Issued Sep 2026 · Valid to Sep 2029</p>
        </div>
      </div>
    </section>
  );
}

function Quests() {
  return (
    <section className="jp-section" id="jp-quests">
      <SectionHead kicker="余白 · Further paths" title="Where the curiosity goes." glyph="縁" />
      <ul className="jp-quests">
        {projects.map((p, i) => (
          <li key={p.name}>
            <a href={p.href} target="_blank" rel="noreferrer">
              <span className="jp-score-n">{pad(i + 1)}</span>
              <span className="jp-quest-t"><b>{p.name}</b><small>{p.stack}</small></span>
              <span className="jp-quest-note">{p.note}</span>
              <Icon name="arrow" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch (e) { window.location.href = `mailto:${profile.email}`; }
  };
  return (
    <section className="jp-section jp-contact" id="jp-contact">
      <div className="jp-contact-card">
        <SectionHead kicker="縁 · Let's connect" title="A bond worth starting." glyph="縁" />
        <div className="jp-cta">
          <a className="jp-btn primary" href={`mailto:${profile.email}`}><Icon name="mail" /> {profile.email}</a>
          <button className="jp-btn" onClick={copy}><Icon name="copy" /> {copied ? 'Copied' : 'Copy email'}</button>
        </div>
        <ul className="jp-links">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} target={l.icon === 'mail' ? undefined : '_blank'} rel="noreferrer">
                <Icon name={l.icon} /><span><b>{l.label}</b><small>{l.handle}</small></span><Icon name="arrow" />
              </a>
            </li>
          ))}
        </ul>
        <img className="jp-portrait" src={profileImg} alt={`Portrait of ${profile.name}`} />
      </div>
    </section>
  );
}

function SectionHead({ kicker, title, glyph }) {
  return (
    <div className="jp-section-head">
      <div>
        <p className="jp-kicker">{kicker}</p>
        <h2>{title}</h2>
      </div>
      <span className="jp-glyph" aria-hidden="true">{glyph}</span>
    </div>
  );
}

function Footer() {
  return (
    <footer className="jp-footer">
      <span>© {new Date().getFullYear()} {profile.name}</span>
      <span>Designed with washi, ink and Three.js</span>
    </footer>
  );
}
