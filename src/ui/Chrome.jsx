import { VOICE, WORLDS, WORLD_BY_ID, STOPS } from '../worlds';

export function Glyph({ id }) {
  const p = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  if (id === 'neural') return <svg {...p}><circle cx="5" cy="6" r="2" /><circle cx="5" cy="18" r="2" /><circle cx="19" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><path d="M7 7l3 4M7 17l3-4M14 12h3" /></svg>;
  if (id === 'arcade') return <svg {...p}><path d="M7 5h2v2h6V5h2v2h2v4h2v6h-2v-2h-2v4h-4v-2h-2v2H7v-4H5v2H3v-6h2V7h2z" /><path d="M9 11h1M14 11h1" /></svg>;
  if (id === 'zen') return <svg {...p}><path d="M3 6c6 1.2 12 1.2 18 0M5 10h14M7 6v14M17 6v14" /></svg>;
  if (id === 'olympus') return <svg {...p}><path d="M4 7l8-4 8 4M5 8h14M7 8v11M12 8v11M17 8v11M4 20h16" /></svg>;
  return <svg {...p}><circle cx="12" cy="12" r="4.5" /><ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(-20 12 12)" /></svg>;
}

export function Dial({ world, onPick, onAll, hint }) {
  return (
    <nav className="dial" aria-label="Choose a world">
      <span className="dial-label">Worlds</span>
      <div className="dial-row">
        {WORLDS.map((w) => (
          <button
            key={w.id}
            type="button"
            className={`dial-btn${w.id === world ? ' on' : ''}`}
            aria-pressed={w.id === world}
            title={`${w.name} (press ${w.key})`}
            onClick={() => onPick(w.id)}
          >
            <Glyph id={w.id} />
            <span className="dial-name">{w.name}</span>
          </button>
        ))}
        <button type="button" className="dial-all" onClick={onAll} aria-label="What are worlds?" title="What are worlds?">?</button>
      </div>
      {hint && <div className="dial-hint">One portfolio, five worlds. Try another one ↑ or press 1–5</div>}
    </nav>
  );
}

const GROUPS = STOPS.reduce((acc, s, i) => {
  const last = acc[acc.length - 1];
  if (last && last.kind === s.kind) last.stops.push(i);
  else acc.push({ kind: s.kind, stops: [i] });
  return acc;
}, []);

export function Rail({ world, stop, onGo }) {
  const V = VOICE[world];
  return (
    <nav className="rail" aria-label="Chapters">
      {GROUPS.map((g) => {
        const on = g.stops.includes(stop);
        return (
          <div key={g.kind} className={`rail-g${on ? ' on' : ''}${g.stops[g.stops.length - 1] < stop ? ' done' : ''}`}>
            <button type="button" className="rail-label" onClick={() => onGo(g.stops[0])}>{V.rail[g.kind]}</button>
            {g.stops.length > 1 && (
              <div className="rail-ticks">
                {g.stops.map((i) => (
                  <button key={i} type="button" className={`tick${i === stop ? ' on' : ''}${i < stop ? ' done' : ''}`} onClick={() => onGo(i)} aria-label={`Go to ${V.num(i + 1)}`} />
                ))}
              </div>
            )}
          </div>
        );
      })}
      <div className="rail-count">{String(stop + 1).padStart(2, '0')} / {STOPS.length}</div>
    </nav>
  );
}

export function MobileNav({ stop, onStep }) {
  return (
    <div className="mnav">
      <button type="button" onClick={() => onStep(-1)} disabled={stop === 0} aria-label="Previous">↑</button>
      <span>{String(stop + 1).padStart(2, '0')} / {STOPS.length}</span>
      <button type="button" onClick={() => onStep(1)} disabled={stop === STOPS.length - 1} aria-label="Next">↓</button>
    </div>
  );
}

export function Gate({ world, onPick }) {
  return (
    <div className="gate" role="dialog" aria-modal="true" aria-label="Choose a world">
      <div className="gate-inner">
        <p className="gate-kicker">Nakulan T · AI Engineer</p>
        <h1 className="gate-title">One portfolio. <em>Five worlds.</em></h1>
        <p className="gate-sub">
          The same work, told five ways: a different 3D place, layout and voice each time. Bit comes with you
          everywhere. Switch any time from the bar at the top, or press 1–5.
        </p>
        <div className="gate-grid">
          {WORLDS.map((w) => (
            <button key={w.id} type="button" className="gate-tile" data-w={w.id} onClick={() => onPick(w.id)}>
              <span className="gt-key">{w.key}</span>
              <Glyph id={w.id} />
              <span className="gt-name">{w.name}</span>
              <span className="gt-blurb">{w.blurb}</span>
            </button>
          ))}
        </div>
        <button type="button" className="gate-skip" onClick={() => onPick(world)}>
          Continue in {WORLD_BY_ID[world].name} →
        </button>
      </div>
    </div>
  );
}

export function Iris({ iris }) {
  if (!iris) return null;
  return (
    <div className={`iris iris--${iris.phase}`} data-w={iris.id} style={{ '--ix': `${iris.x}px`, '--iy': `${iris.y}px` }} aria-hidden="true">
      <span className="iris-name">{WORLD_BY_ID[iris.id].name}</span>
    </div>
  );
}
