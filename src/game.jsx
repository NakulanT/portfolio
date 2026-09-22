import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

// The gamification layer: XP, levels, achievements and quest progress, saved in the browser.

export const SECTION_IDS = ['top', 'arena', 'missions', 'skills', 'log', 'contact'];

export const ACHIEVEMENTS = [
  { id: 'start', title: 'Press Start', desc: 'Begin the run', xp: 20 },
  { id: 'explorer', title: 'Explorer', desc: 'Visit every section of the site', xp: 60 },
  { id: 'episode', title: 'First Episode', desc: 'Watch the agent finish an episode', xp: 30 },
  { id: 'builder', title: 'Level Designer', desc: 'Place 3 walls in the arena', xp: 30 },
  { id: 'trapper', title: 'Trap Setter', desc: 'Place a pit in the arena', xp: 20 },
  { id: 'converged', title: 'Converged', desc: 'Let the agent find the shortest route', xp: 80 },
  { id: 'chaos', title: 'Chaos Engineer', desc: 'Make the goal unreachable', xp: 40 },
  { id: 'missions', title: 'Mission Control', desc: 'Clear 5 missions', xp: 50 },
  { id: 'night', title: 'Shift Change', desc: 'Switch between day and night', xp: 10 },
  { id: 'contact', title: 'Player Two', desc: 'Copy the email address', xp: 100 },
  { id: 'konami', title: 'Old School', desc: 'Enter the classic code', xp: 60 },
];
const BY_ID = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));

export const RANKS = ['Rookie', 'Apprentice', 'Engineer', 'Architect', 'Principal'];
const XP_PER_LEVEL = 100;
export const MISSION_XP = 10;

export function levelInfo(xp) {
  const top = RANKS.length;
  const level = Math.min(Math.floor(xp / XP_PER_LEVEL) + 1, top);
  const max = level >= top;
  const into = max ? Math.min(xp - (top - 1) * XP_PER_LEVEL, XP_PER_LEVEL) : xp % XP_PER_LEVEL;
  return { level, rank: RANKS[level - 1], into, next: XP_PER_LEVEL, max };
}

const KEY = 'nakulan-portfolio-game-v1';
const fresh = () => ({ xp: 0, done: {}, missions: [], sections: [], walls: 0 });
const load = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (raw && typeof raw.xp === 'number') return { ...fresh(), ...raw };
  } catch (e) { /* private mode or blocked storage: start fresh */ }
  return fresh();
};
const save = (d) => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* ignore */ } };

const CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

const GameCtx = createContext(null);
export const useGame = () => useContext(GameCtx);

export function GameProvider({ children }) {
  // The ref is the source of truth so repeated calls (StrictMode, fast events) can never double-award.
  const data = useRef(null);
  if (data.current === null) data.current = load();
  const [view, setView] = useState(() => ({ ...data.current }));
  const [toasts, setToasts] = useState([]);
  const [questOpen, setQuestOpen] = useState(false);

  const commit = useCallback(() => {
    save(data.current);
    setView({ ...data.current, done: { ...data.current.done }, missions: [...data.current.missions], sections: [...data.current.sections] });
  }, []);

  const toast = useCallback((kind, title, sub) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t.slice(-3), { id, kind, title, sub }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const addXp = useCallback((n) => {
    const d = data.current;
    const before = levelInfo(d.xp).level;
    d.xp += n;
    const after = levelInfo(d.xp);
    if (after.level > before) toast('level', `Level ${after.level}: ${after.rank}`, 'You levelled up');
  }, [toast]);

  const award = useCallback((id) => {
    const d = data.current;
    const a = BY_ID[id];
    if (!a || d.done[id]) return;
    d.done[id] = true;
    toast('achievement', a.title, `Achievement unlocked · +${a.xp} XP`);
    addXp(a.xp);
    commit();
  }, [addXp, commit, toast]);

  const track = useCallback((kind, id) => {
    const d = data.current;
    if (kind === 'section') {
      if (d.sections.includes(id)) return;
      d.sections.push(id);
      commit();
      if (SECTION_IDS.every((s) => d.sections.includes(s))) award('explorer');
    } else if (kind === 'mission') {
      if (d.missions.includes(id)) return;
      d.missions.push(id);
      toast('xp', 'Mission cleared', `+${MISSION_XP} XP`);
      addXp(MISSION_XP);
      commit();
      if (d.missions.length >= 5) award('missions');
    } else if (kind === 'wall') {
      d.walls += 1;
      commit();
      if (d.walls >= 3) award('builder');
    }
  }, [addXp, award, commit, toast]);

  const reset = useCallback(() => {
    data.current = fresh();
    commit();
    toast('xp', 'Progress reset', 'Fresh save file');
  }, [commit, toast]);

  // The classic code.
  useEffect(() => {
    let i = 0;
    const onKey = (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      i = k === CODE[i] ? i + 1 : (k === CODE[0] ? 1 : 0);
      if (i === CODE.length) { i = 0; award('konami'); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [award]);

  const value = useMemo(() => ({
    ...view, info: levelInfo(view.xp), toasts, questOpen, setQuestOpen, award, track, reset,
  }), [view, toasts, questOpen, award, track, reset]);

  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>;
}
