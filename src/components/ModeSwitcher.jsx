import { useState } from 'react';
import { MODES, useMode } from '../mode';

const GLYPH = {
  rl: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><path d="M10 6.5h4M6.5 10v4M17.5 10v4M10 17.5h4" /></svg>
  ),
  gaming: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6 9h4M8 7v4M15 9h.01M18 11h.01" /><path d="M4 15 5.5 8.5A3 3 0 0 1 8.4 6h7.2a3 3 0 0 1 2.9 2.5L20 15a2.2 2.2 0 0 1-4 1.6L14.5 15h-5L8 16.6A2.2 2.2 0 0 1 4 15Z" /></svg>
  ),
  japanese: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 9h18M6 9V6M18 9V6M4 6h16M6 9v11M18 9v11" /></svg>
  ),
  greek: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 5h16M6 5v14M18 5v14M4 19h16M6 9h2v10H6zM11 9h2v10h-2zM16 9h2v10h-2z" /></svg>
  ),
};

export function ModeSwitcher() {
  const { mode, setMode } = useMode();
  const [open, setOpen] = useState(false);

  return (
    <div className={`mode-switcher${open ? ' open' : ''}`} data-mode-ui>
      <button
        className="mode-fab"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Switch portfolio mode"
      >
        {GLYPH[mode]}
        <span className="mode-fab-label">{MODES.find((m) => m.id === mode)?.short}</span>
      </button>
      {open && (
        <div className="mode-menu" role="menu">
          <p className="mode-menu-title">Choose a world</p>
          {MODES.map((m) => (
            <button
              key={m.id}
              role="menuitemradio"
              aria-checked={m.id === mode}
              className={`mode-option${m.id === mode ? ' active' : ''}`}
              onClick={() => { setMode(m.id); setOpen(false); }}
            >
              <span className="mode-option-icon">{GLYPH[m.id]}</span>
              <span className="mode-option-text">
                <b>{m.label}</b>
                <small>{m.id === 'rl' ? 'A live Q-learning agent' : m.id === 'gaming' ? 'Retro arcade cabinet' : m.id === 'japanese' ? 'Torii gate, falling sakura' : 'Marble, columns, gold'}</small>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
