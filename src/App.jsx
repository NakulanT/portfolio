import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Engine } from './engine/Engine';
import { STOPS, WORLDS, WORLD_BY_ID, GATE_LINE, lineFor } from './worlds';
import { Panel } from './ui/Panel';
import { Dial, Rail, MobileNav, Gate, Iris } from './ui/Chrome';

const K_WORLD = 'nk-world', K_SEEN = 'nk-gate-seen', K_SWITCHED = 'nk-switched';
const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } },
};
const urlWorld = () => {
  const q = new URLSearchParams(window.location.search).get('world');
  return WORLD_BY_ID[q] ? q : null;
};
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function App() {
  const canvas = useRef(null);
  const engine = useRef(null);
  const bubble = useRef(null);
  const bubbleSize = useRef([300, 60]);
  const [world, setWorld] = useState(() => urlWorld() || (WORLD_BY_ID[store.get(K_WORLD)] ? store.get(K_WORLD) : 'neural'));
  const [stop, setStop] = useState(0);
  const [gate, setGate] = useState(() => !store.get(K_SEEN) && !urlWorld());
  const [switched, setSwitched] = useState(() => !!store.get(K_SWITCHED));
  const [iris, setIris] = useState(null);
  const worldRef = useRef(world);
  const gateRef = useRef(gate);
  const busy = useRef(false);
  gateRef.current = gate;

  useEffect(() => { document.documentElement.dataset.world = world; }, [world]);

  useEffect(() => {
    const e = new Engine(canvas.current, {
      world: worldRef.current,
      count: STOPS.length,
      onFrame: (cx, cy, r) => {
        const el = bubble.current;
        if (!el) return;
        const [bw, bh] = bubbleSize.current;
        const W = window.innerWidth, H = window.innerHeight;
        const topBar = W < 760 ? 70 : 128; // keep clear of the world dial
        let left = cx - bw / 2;
        let top = cy - r - bh - 12;
        if (top < topBar) {
          // no room above Bit: speak from the side facing the middle of the screen
          top = Math.max(topBar, cy - bh / 2);
          left = cx < W / 2 ? cx + r + 16 : cx - r - 16 - bw;
        }
        left = Math.min(Math.max(12, left), W - bw - 12);
        top = Math.min(top, H - bh - 12);
        el.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      },
    });
    engine.current = e;
    if (import.meta.env.DEV) window.__engine = e;
    return () => e.dispose();
  }, []);

  // the bubble's size only changes when its line changes; measure it then, not every frame
  useEffect(() => {
    const el = bubble.current;
    if (!el || !('ResizeObserver' in window)) return undefined;
    const ro = new ResizeObserver(() => { bubbleSize.current = [el.offsetWidth, el.offsetHeight]; });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => { engine.current && engine.current.go(stop); }, [stop]);
  useEffect(() => { engine.current && engine.current.setGate(gate); }, [gate]);

  const closeGate = useCallback(() => { setGate(false); store.set(K_SEEN, '1'); }, []);

  const pickWorld = useCallback((id) => {
    if (busy.current) return;
    if (id === worldRef.current) { closeGate(); return; }
    busy.current = true;
    const [x, y] = engine.current.beingScreen();
    setIris({ id, x, y, phase: 'in' });
    setTimeout(() => {
      engine.current.setWorld(id);
      worldRef.current = id;
      setWorld(id);
      closeGate();
      setSwitched(true);
      store.set(K_SWITCHED, '1');
      store.set(K_WORLD, id);
      window.history.replaceState(null, '', `?world=${id}`);
      setIris((v) => v && { ...v, phase: 'out' });
      setTimeout(() => { setIris(null); busy.current = false; }, 650);
    }, reduced ? 0 : 560);
  }, [closeGate]);

  const step = useCallback((d) => {
    if (gateRef.current) { closeGate(); return; }
    setStop((s) => Math.max(0, Math.min(STOPS.length - 1, s + d)));
  }, [closeGate]);

  // wheel, keys and swipes all move one stop at a time
  useEffect(() => {
    let acc = 0, lock = 0, lastWheel = 0;
    const scrollable = (target, dy) => {
      const b = target && target.closest && target.closest('.panel-body, .gate');
      if (!b) return false;
      return dy > 0 ? b.scrollTop + b.clientHeight < b.scrollHeight - 2 : b.scrollTop > 0;
    };
    const onWheel = (e) => {
      if (scrollable(e.target, e.deltaY)) return;
      e.preventDefault();
      const now = performance.now();
      if (now - lastWheel > 220) acc = 0;
      lastWheel = now;
      if (now < lock) return;
      acc += e.deltaY;
      if (Math.abs(acc) > 45) { step(Math.sign(acc)); acc = 0; lock = now + 800; }
    };
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const w = WORLDS.find((x) => x.key === e.key);
      if (w) { pickWorld(w.id); return; }
      if (['ArrowDown', 'ArrowRight', 'PageDown', ' ', 'j'].includes(e.key)) { e.preventDefault(); step(1); }
      else if (['ArrowUp', 'ArrowLeft', 'PageUp', 'k'].includes(e.key)) { e.preventDefault(); step(-1); }
      else if (e.key === 'Home') setStop(0);
      else if (e.key === 'End') setStop(STOPS.length - 1);
      else if (e.key === 'Escape' && gateRef.current) closeGate();
    };
    let ty = null, tTarget = null;
    const onTouchStart = (e) => { ty = e.touches[0].clientY; tTarget = e.target; };
    const onTouchEnd = (e) => {
      if (ty === null) return;
      const dy = ty - e.changedTouches[0].clientY;
      ty = null;
      if (Math.abs(dy) < 50 || scrollable(tTarget, dy)) return;
      step(dy > 0 ? 1 : -1);
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [step, pickWorld, closeGate]);

  // Bit's line, typed out while its mouth moves
  const line = useMemo(() => (gate ? GATE_LINE : lineFor(world, stop, switched)), [gate, world, stop, switched]);
  const [typed, setTyped] = useState('');
  useEffect(() => {
    if (reduced) { setTyped(line); return undefined; }
    let i = 0;
    setTyped('');
    engine.current && engine.current.setTalking(true);
    const id = setInterval(() => {
      i += 2;
      setTyped(line.slice(0, i));
      if (i >= line.length) { clearInterval(id); engine.current && engine.current.setTalking(false); }
    }, 24);
    return () => clearInterval(id);
  }, [line]);

  return (
    <>
      <canvas ref={canvas} className="stage" aria-hidden="true" />
      <div className="ui">
        <Dial world={world} onPick={pickWorld} onAll={() => setGate(true)} hint={!switched && !gate} />
        {!gate && <Rail world={world} stop={stop} onGo={setStop} />}
        {!gate && <Panel world={world} stop={stop} onWorld={pickWorld} />}
        {!gate && <MobileNav stop={stop} onStep={step} />}
        <div ref={bubble} className={`bubble${gate ? ' at-gate' : ''}`} role="status">
          <span className="bubble-ghost" aria-hidden="true">{line}</span>
          <span className="bubble-text">{typed}</span>
          <span className="bubble-who">Bit</span>
        </div>
        {gate && <Gate world={world} onPick={pickWorld} />}
        <Iris iris={iris} />
      </div>
    </>
  );
}
