import { createContext, useContext, useEffect, useRef, useState } from 'react';

// The four modes. Each is a completely separate design: its own layout components,
// typography, colour system and 3D scene. Only the underlying content (src/data.js)
// and the achievement/XP layer (src/game.jsx) are shared between them.
export const MODES = [
  { id: 'rl', label: 'Reinforcement Learning', short: 'RL Lab' },
  { id: 'gaming', label: 'Arcade', short: 'Arcade' },
  { id: 'japanese', label: 'Japanese', short: '日本' },
  { id: 'greek', label: 'Greek', short: 'Hellenic' },
];

const KEY = 'nakulan-portfolio-mode';
const DEFAULT = 'rl';

const ModeCtx = createContext(null);
export const useMode = () => useContext(ModeCtx);

export function ModeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (MODES.some((m) => m.id === saved)) return saved;
    } catch (e) { /* private mode or blocked storage */ }
    return DEFAULT;
  });

  const first = useRef(true);
  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    try { localStorage.setItem(KEY, mode); } catch (e) { /* ignore */ }
    // Each mode is a full re-layout; carrying over the old scroll position drops the
    // visitor mid-page in the new design instead of at its hero. Skip on first mount,
    // since the page is already at the top then.
    if (first.current) { first.current = false; return; }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [mode]);

  return <ModeCtx.Provider value={{ mode, setMode }}>{children}</ModeCtx.Provider>;
}
