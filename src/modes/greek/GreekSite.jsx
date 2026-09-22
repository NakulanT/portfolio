import { useState } from 'react';
import profileImg from '../../assets/profile.jpg';
import { profile, links, stats, work, principles, stack, timeline, projects } from '../../data';
import { Icon } from '../../components/Art';
import { SceneCanvas } from '../../three/SceneCanvas';
import { buildGreekScene } from './scene';
import './greek.css';

const NUM = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ϛ', 'Ζ', 'Η', 'Θ'];
const scrollTo = (id) => (e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

export function GreekSite() {
  return (
    <div className="gr">
      <Nav />
      <Hero />
      <Stats />
      <Tablets />
      <Maxims />
      <Arsenal />
      <Chronicle />
      <Odyssey />
      <Audience />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="gr-nav">
      <a className="gr-brand" href="#gr-top" onClick={scrollTo('gr-top')}>{profile.name}</a>
      <nav>
        <a href="#gr-work" onClick={scrollTo('gr-work')}>Works</a>
        <a href="#gr-maxims" onClick={scrollTo('gr-maxims')}>Maxims</a>
        <a href="#gr-arsenal" onClick={scrollTo('gr-arsenal')}>Arsenal</a>
        <a href="#gr-chronicle" onClick={scrollTo('gr-chronicle')}>Chronicle</a>
        <a href="#gr-audience" onClick={scrollTo('gr-audience')}>Audience</a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="gr-hero" id="gr-top">
      <SceneCanvas className="gr-scene" build={buildGreekScene} label="A marble column and a turning amphora under golden light" />
      <div className="gr-hero-veil" />
      <div className="gr-hero-copy">
        <p className="gr-kicker">In service of {profile.company}, of {profile.location}</p>
        <h1>{profile.name}</h1>
        <p className="gr-role">{profile.role}</p>
        <p className="gr-lead">I turn messy business problems into reliable, monitored and maintainable AI systems — agentic GenAI on AWS Bedrock AgentCore, and real-time computer vision.</p>
        <div className="gr-cta">
          <a className="gr-btn primary" href="#gr-work" onClick={scrollTo('gr-work')}>Behold the works</a>
          <a className="gr-btn" href="#gr-audience" onClick={scrollTo('gr-audience')}>Seek an audience</a>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="gr-stats">
      {stats.map((s, i) => (
        <div className="gr-stat" key={s.label}>
          <span className="gr-num">{NUM[i] || i + 1}</span>
          <b>{s.prefix || ''}{s.value}{s.suffix || ''}</b>
          <p>{s.label}</p>
        </div>
      ))}
    </section>
  );
}

function Tablets() {
  return (
    <section className="gr-section" id="gr-work">
      <SectionHead k="The works" t="Inscribed for posterity." />
      <div className="gr-tablets">
        {work.map((w, i) => (
          <article className="gr-tablet" key={w.id}>
            <span className="gr-num small">{NUM[i % NUM.length]}</span>
            <h3>{w.title}</h3>
            <p className="gr-problem">{w.problem}</p>
            <p>{w.solution}</p>
            <ul className="gr-tags">{w.tags.map((t) => <li key={t}>{t}</li>)}</ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function Maxims() {
  return (
    <section className="gr-section" id="gr-maxims">
      <SectionHead k="Maxims" t="What I hold to be true." />
      <div className="gr-maxims">
        {principles.map((p, i) => (
          <div className="gr-maxim" key={p.n}>
            <span className="gr-num">{NUM[i]}</span>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Arsenal() {
  return (
    <section className="gr-section" id="gr-arsenal">
      <SectionHead k="The arsenal" t="Instruments of the craft." />
      <div className="gr-arsenal">
        {stack.map((g) => (
          <div className="gr-arm-group" key={g.group}>
            <h3>{g.group}</h3>
            <ul>{g.items.map((it) => <li key={it}>{it}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Chronicle() {
  return (
    <section className="gr-section" id="gr-chronicle">
      <SectionHead k="The chronicle" t="A history of deeds." />
      <ol className="gr-scroll">
        {timeline.map((t) => (
          <li key={t.title}>
            <span className="gr-when">{t.when}</span>
            <h3>{t.title}</h3>
            <p className="gr-org">{t.org}</p>
            <p>{t.text}</p>
          </li>
        ))}
      </ol>
      <div className="gr-laurel">
        <p className="gr-kicker">A laurel, earned</p>
        <h3>AWS Certified Machine Learning Engineer – Associate</h3>
        <p className="gr-org">Issued Sep 2026 · Valid to Sep 2029</p>
      </div>
    </section>
  );
}

function Odyssey() {
  return (
    <section className="gr-section">
      <SectionHead k="Lesser odysseys" t="Where the curiosity wandered." />
      <ul className="gr-odyssey">
        {projects.map((p, i) => (
          <li key={p.name}>
            <a href={p.href} target="_blank" rel="noreferrer">
              <span className="gr-num small">{NUM[i % NUM.length]}</span>
              <span className="gr-odyssey-t"><b>{p.name}</b><small>{p.stack}</small></span>
              <span className="gr-odyssey-note">{p.note}</span>
              <Icon name="arrow" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Audience() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch (e) { window.location.href = `mailto:${profile.email}`; }
  };
  return (
    <section className="gr-section gr-audience" id="gr-audience">
      <div className="gr-audience-card">
        <SectionHead k="An audience" t="Speak, and be heard." />
        <div className="gr-cta">
          <a className="gr-btn primary" href={`mailto:${profile.email}`}><Icon name="mail" /> {profile.email}</a>
          <button className="gr-btn" onClick={copy}><Icon name="copy" /> {copied ? 'Copied' : 'Copy email'}</button>
        </div>
        <ul className="gr-links">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} target={l.icon === 'mail' ? undefined : '_blank'} rel="noreferrer">
                <Icon name={l.icon} /><span><b>{l.label}</b><small>{l.handle}</small></span><Icon name="arrow" />
              </a>
            </li>
          ))}
        </ul>
        <img className="gr-portrait" src={profileImg} alt={`Portrait of ${profile.name}`} />
      </div>
    </section>
  );
}

function SectionHead({ k, t }) {
  return (
    <div className="gr-section-head">
      <p className="gr-kicker">{k}</p>
      <h2>{t}</h2>
    </div>
  );
}

function Footer() {
  return (
    <footer className="gr-footer">
      <span>© {new Date().getFullYear()} {profile.name}</span>
      <span>Carved in marble, gilded in Three.js</span>
    </footer>
  );
}
