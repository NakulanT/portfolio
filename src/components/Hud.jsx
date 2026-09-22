import { ACHIEVEMENTS, useGame } from '../game';
import { Icon } from './Art';

export function Hud({ theme, onToggle }) {
  const g = useGame();
  const { info } = g;
  const doneCount = Object.keys(g.done).length;
  const pct = Math.round((info.into / info.next) * 100);
  return (
    <header className="hud">
      <a className="brand" href="#top" aria-label="Nakulan T, home">
        <span className="mark">N</span>
        <span className="brand-name">NAKULAN T</span>
      </a>
      <nav className="hud-nav" aria-label="Sections">
        <a href="#arena">Arena</a>
        <a href="#missions">Missions</a>
        <a href="#skills">Skills</a>
        <a href="#log">Log</a>
        <a href="#quests">Side quests</a>
        <a href="#contact">Contact</a>
      </nav>
      <div className="hud-right">
        <div className="xp" title={`${g.xp} XP in total`}>
          <div className="xp-top">
            <span className="lvl">LV {info.level}</span>
            <span className="rank">{info.rank}</span>
          </div>
          <div className="xp-bar"><i style={{ width: `${info.max ? 100 : pct}%` }} /></div>
        </div>
        <button className="icon-btn quest-btn" onClick={() => g.setQuestOpen(true)} aria-label="Open the quest log">
          <Icon name="trophy" /><span>{doneCount}/{ACHIEVEMENTS.length}</span>
        </button>
        <button className="icon-btn" onClick={onToggle} aria-label="Switch between day and night">
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </button>
      </div>
    </header>
  );
}

export function QuestDrawer() {
  const g = useGame();
  if (!g.questOpen) return null;
  return (
    <div className="drawer-wrap" onClick={() => g.setQuestOpen(false)}>
      <aside className="drawer panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Quest log">
        <div className="drawer-head">
          <div>
            <p className="eyebrow">Quest log</p>
            <h3>LV {g.info.level} · {g.info.rank}</h3>
            <p className="dim mono">{g.xp} XP · {Object.keys(g.done).length}/{ACHIEVEMENTS.length} achievements</p>
          </div>
          <button className="icon-btn" onClick={() => g.setQuestOpen(false)} aria-label="Close"><Icon name="close" /></button>
        </div>
        <ul className="ach-list">
          {ACHIEVEMENTS.map((a) => {
            const on = !!g.done[a.id];
            return (
              <li key={a.id} className={on ? 'on' : ''}>
                <span className="tick">{on ? <Icon name="check" /> : null}</span>
                <span className="ach-text"><b>{a.title}</b><small>{a.desc}</small></span>
                <span className="ach-xp">+{a.xp}</span>
              </li>
            );
          })}
        </ul>
        <button className="gbtn" onClick={g.reset}>Reset progress</button>
      </aside>
    </div>
  );
}

export function Toasts() {
  const g = useGame();
  return (
    <div className="toasts" aria-live="polite">
      {g.toasts.map((t) => (
        <div key={t.id} className={`toast ${t.kind}`}>
          <b>{t.title}</b>
          <span>{t.sub}</span>
        </div>
      ))}
    </div>
  );
}
