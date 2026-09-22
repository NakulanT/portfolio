import { profile, links, stats, principles, stack, timeline, projects } from '../data';
import { VOICE, WORLDS, STOPS } from '../worlds';
import photo from '../assets/profile.jpg';

const fmt = (s) => `${s.prefix || ''}${s.decimals ? s.value.toFixed(s.decimals) : s.value}${s.suffix}`;
const frac = (s) => (s.suffix === '%' ? s.value / 100 : s.suffix.includes('FPS') ? s.value / 60 : 1);

function Head({ V, kind, n }) {
  const idx = STOPS.findIndex((s) => s.kind === kind && (n === undefined || s.n === n));
  return (
    <header className="p-head">
      <span className="p-num">{V.num(idx + 1)}</span>
      <span className="p-chapter">{V.title[kind]}</span>
    </header>
  );
}

function Hello({ V }) {
  return (
    <>
      <div className="p-kicker">{V.hello.kicker}</div>
      <div className="hello-row">
        <img className="hello-photo" src={photo} alt="Nakulan T" width="120" height="120" />
        <div>
          {V.hello.alt && <div className="hello-alt" aria-hidden="true">{V.hello.alt}</div>}
          <h1 className="hello-name">{profile.name}</h1>
          <div className="hello-role">{profile.role} · {profile.company} · {profile.location}</div>
        </div>
      </div>
      <p className="p-lede">
        I build agentic GenAI on AWS Bedrock AgentCore, make LLM systems observable, and ship real-time
        computer vision. AWS Certified Machine Learning Engineer, Associate.
      </p>
      <div className="p-hint">{V.hello.hint}</div>
    </>
  );
}

function Stats({ V }) {
  return (
    <>
      <Head V={V} kind="stats" />
      <ul className="stats">
        {stats.map((s, i) => (
          <li key={s.label} className="stat" style={{ '--f': frac(s) }}>
            <em className="stat-rank">{V.rank(i)}</em>
            <i className="stat-gauge" aria-hidden="true" />
            <b className="stat-value">{fmt(s)}</b>
            <span className="stat-label">{s.label}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

function Principles({ V }) {
  return (
    <>
      <Head V={V} kind="principles" />
      <ol className="principles">
        {principles.map((p, i) => (
          <li key={p.title}>
            <span className="pr-n">{V.rank(i)}</span>
            <div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

function Work({ V, item, n }) {
  return (
    <>
      <Head V={V} kind="work" n={n} />
      <h2 className="work-title">{item.title}</h2>
      <dl className="work">
        <div className="work-row work-problem"><dt>{V.labels.problem}</dt><dd>{item.problem}</dd></div>
        <div className="work-row work-solution"><dt>{V.labels.solution}</dt><dd>{item.solution}</dd></div>
        <div className="work-row work-tags">
          <dt>{V.labels.tags}</dt>
          <dd><ul className="chips">{item.tags.map((t) => <li key={t}>{t}</li>)}</ul></dd>
        </div>
      </dl>
    </>
  );
}

function Projects({ V }) {
  return (
    <>
      <Head V={V} kind="projects" />
      <ul className="projects">
        {projects.map((p) => (
          <li key={p.name}>
            <a href={p.href} target="_blank" rel="noreferrer">
              <span className="pj-name">{p.name}</span>
              <span className="pj-stack">{p.stack}</span>
              <span className="pj-note">{p.note}</span>
              <span className="pj-go" aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

function Stack({ V }) {
  return (
    <>
      <Head V={V} kind="stack" />
      <div className="stack">
        {stack.map((g) => (
          <section key={g.group} className="stack-g">
            <h3>{g.group}</h3>
            <ul className="chips">{g.items.map((t) => <li key={t}>{t}</li>)}</ul>
          </section>
        ))}
      </div>
    </>
  );
}

function Timeline({ V }) {
  return (
    <>
      <Head V={V} kind="timeline" />
      <ol className="timeline">
        {timeline.map((e) => (
          <li key={e.title}>
            <span className="tl-when">{e.when}</span>
            <h3>{e.title}</h3>
            <span className="tl-org">{e.org}</span>
            <p>{e.text}</p>
          </li>
        ))}
      </ol>
    </>
  );
}

function Contact({ V, world, onWorld }) {
  return (
    <>
      <Head V={V} kind="contact" />
      <p className="p-lede">{V.contact}</p>
      <ul className="links">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} target={l.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer">
              <span className="ln-label">{l.label}</span>
              <span className="ln-handle">{l.handle}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="elsewhere">
        <span>Same story, another world:</span>
        {WORLDS.filter((w) => w.id !== world).map((w) => (
          <button key={w.id} type="button" onClick={() => onWorld(w.id)}>{w.name}</button>
        ))}
      </div>
    </>
  );
}

export function Panel({ world, stop, onWorld }) {
  const V = VOICE[world];
  const s = STOPS[stop];
  let body;
  if (s.kind === 'hello') body = <Hello V={V} />;
  else if (s.kind === 'stats') body = <Stats V={V} />;
  else if (s.kind === 'principles') body = <Principles V={V} />;
  else if (s.kind === 'work') body = <Work V={V} item={s.item} n={s.n} />;
  else if (s.kind === 'projects') body = <Projects V={V} />;
  else if (s.kind === 'stack') body = <Stack V={V} />;
  else if (s.kind === 'timeline') body = <Timeline V={V} />;
  else body = <Contact V={V} world={world} onWorld={onWorld} />;

  return (
    <div className="panel-wrap">
      <article key={`${world}-${stop}`} className={`panel panel--${s.kind}`} aria-live="polite">
        <div className="panel-deco" aria-hidden="true" />
        <div className="panel-body">{body}</div>
      </article>
    </div>
  );
}
