import { useEffect, useRef, useState } from 'react';
import { GridEnv, QAgent, Trainer, WALL, PIT, EMPTY, REWARD } from '../rl';
import { useGame } from '../game';
import { Icon } from './Art';

const SPEEDS = [
  { k: '1×', sps: 4 },
  { k: '5×', sps: 20 },
  { k: '20×', sps: 80 },
  { k: 'Turbo', sps: 2400 },
];
const TOOLS = [
  { id: 'wall', label: 'Wall' },
  { id: 'pit', label: 'Pit' },
  { id: 'goal', label: 'Goal' },
  { id: 'start', label: 'Start' },
  { id: 'erase', label: 'Erase' },
];

const cssVar = (name, fallback) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

function Spark({ data }) {
  if (data.length < 2) return <div className="spark empty">learning curve appears here</div>;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 240},${52 - ((v - min) / span) * 46}`).join(' ');
  return (
    <svg className="spark" viewBox="0 0 240 56" preserveAspectRatio="none" role="img" aria-label="Return per episode">
      <polyline points={`0,56 ${pts} 240,56`} className="fill" />
      <polyline points={pts} className="line" />
    </svg>
  );
}

export default function Arena() {
  const game = useGame();
  const mount = useRef(null);
  const api = useRef({});
  const ctl = useRef({ running: true, speed: 2, tool: 'wall' });
  const [ui, setUi] = useState({
    running: true, speed: 2, tool: 'wall', episode: 0, eps: 1, wins: 0, avg: 0, route: null, shortest: 14, reachable: true, returns: [], gl: true, loading: true,
  });

  useEffect(() => {
    const el = mount.current;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const T = await import('three');
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
      if (disposed) return;

      let renderer;
      try {
        renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      } catch (e) {
        setUi((u) => ({ ...u, gl: false, loading: false }));
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      if (reduce) { ctl.current.running = false; }

      // ---------- learning ----------
      const env = new GridEnv(8);
      const agent = new QAgent(8);
      const trainer = new Trainer(env, agent);
      const N = env.n;
      const HALF = N / 2;
      const cellXZ = (i) => { const [x, z] = env.xy(i); return [x - HALF + 0.5, z - HALF + 0.5]; };

      // ---------- scene ----------
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(8.4, 8.6, 10.6);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.minPolarAngle = 0.55;
      controls.maxPolarAngle = 1.3;
      controls.target.set(0, -0.2, 0);
      controls.autoRotate = !reduce;
      controls.autoRotateSpeed = 0.55;
      if (coarse) { controls.enableRotate = false; renderer.domElement.style.touchAction = 'pan-y'; }

      scene.add(new T.AmbientLight(0xffffff, 0.85));
      const sun = new T.DirectionalLight(0xffffff, 1.15);
      sun.position.set(5, 9, 6);
      scene.add(sun);

      const colors = {};
      const readColors = () => {
        colors.c1 = new T.Color(cssVar('--accent', '#35e6ff'));
        colors.c2 = new T.Color(cssVar('--violet', '#ff4d8d'));
        colors.c3 = new T.Color(cssVar('--c3', '#ffc857'));
        colors.c4 = new T.Color(cssVar('--c4', '#5dff9a'));
        colors.tile = new T.Color(cssVar('--tile', '#141c33'));
        colors.wall = new T.Color(cssVar('--wall', '#2a3550'));
        colors.line = new T.Color(cssVar('--text-3', '#6f7d9f'));
      };
      readColors();

      const dummy = new T.Object3D();
      const tmp = new T.Color();

      // base plate + grid
      const plate = new T.Mesh(new T.BoxGeometry(N + 0.3, 0.1, N + 0.3), new T.MeshStandardMaterial({ roughness: 0.9 }));
      plate.position.y = -0.6;
      scene.add(plate);
      const grid = new T.GridHelper(N + 4, N + 4, 0x000000, 0x000000);
      grid.material.transparent = true;
      grid.material.opacity = 0.16;
      grid.position.y = -0.62;
      scene.add(grid);

      // tiles: height and colour show the learned value
      const tiles = new T.InstancedMesh(new T.BoxGeometry(0.92, 1, 0.92), new T.MeshStandardMaterial({ roughness: 0.5, metalness: 0.15 }), N * N);
      tiles.instanceMatrix.setUsage(T.DynamicDrawUsage);
      scene.add(tiles);
      const walls = new T.InstancedMesh(new T.BoxGeometry(0.86, 1, 0.86), new T.MeshStandardMaterial({ roughness: 0.55, metalness: 0.25 }), N * N);
      scene.add(walls);
      const arrows = new T.InstancedMesh(new T.ConeGeometry(0.1, 0.27, 6), new T.MeshBasicMaterial({ transparent: true, opacity: 0.95 }), N * N);
      arrows.instanceMatrix.setUsage(T.DynamicDrawUsage);
      scene.add(arrows);
      const crumbs = new T.InstancedMesh(new T.SphereGeometry(0.075, 10, 10), new T.MeshBasicMaterial(), 64);
      crumbs.count = 0;
      scene.add(crumbs);

      // goal gem, start ring, hover outline
      const gem = new T.Mesh(new T.OctahedronGeometry(0.3), new T.MeshStandardMaterial({ roughness: 0.25, flatShading: true }));
      scene.add(gem);
      const gemLight = new T.PointLight(0xffffff, 5, 4);
      scene.add(gemLight);
      const startRing = new T.Mesh(new T.TorusGeometry(0.32, 0.035, 8, 40), new T.MeshBasicMaterial());
      startRing.rotation.x = Math.PI / 2;
      scene.add(startRing);
      const hover = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(0.98, 0.06, 0.98)), new T.LineBasicMaterial());
      hover.visible = false;
      scene.add(hover);

      // the agent: a small robot
      const bot = new T.Group();
      const botMat = new T.MeshStandardMaterial({ roughness: 0.35, metalness: 0.3 });
      const body = new T.Mesh(new T.BoxGeometry(0.4, 0.3, 0.4), botMat);
      body.position.y = 0.17;
      const head = new T.Mesh(new T.SphereGeometry(0.17, 16, 12), botMat);
      head.position.y = 0.42;
      const eyeMat = new T.MeshBasicMaterial({ color: 0x05070d });
      const eyeL = new T.Mesh(new T.BoxGeometry(0.05, 0.06, 0.03), eyeMat);
      const eyeR = eyeL.clone();
      eyeL.position.set(-0.06, 0.44, 0.15);
      eyeR.position.set(0.06, 0.44, 0.15);
      const ant = new T.Mesh(new T.CylinderGeometry(0.012, 0.012, 0.16, 6), botMat);
      ant.position.y = 0.65;
      const antTip = new T.Mesh(new T.SphereGeometry(0.035, 8, 8), new T.MeshBasicMaterial());
      antTip.position.y = 0.75;
      bot.add(body, head, eyeL, eyeR, ant, antTip);
      scene.add(bot);

      // celebration particles
      const P = 40;
      const parts = new T.InstancedMesh(new T.SphereGeometry(0.045, 6, 6), new T.MeshBasicMaterial({ transparent: true }), P);
      parts.count = 0;
      scene.add(parts);
      const particles = Array.from({ length: P }, () => ({ p: new T.Vector3(), v: new T.Vector3(), life: 0 }));

      const applyColors = () => {
        plate.material.color.copy(colors.tile).multiplyScalar(0.55);
        grid.material.color.copy(colors.line);
        tiles.material.color.set(0xffffff);
        walls.material.color.copy(colors.wall);
        arrows.material.color.copy(colors.c1).lerp(new T.Color(0xffffff), 0.55);
        crumbs.material.color.copy(colors.c4);
        gem.material.color.copy(colors.c3);
        gem.material.emissive.copy(colors.c3);
        gem.material.emissiveIntensity = 0.85;
        gemLight.color.copy(colors.c3);
        startRing.material.color.copy(colors.c4);
        hover.material.color.copy(colors.c1);
        botMat.color.copy(colors.c1);
        botMat.emissive.copy(colors.c1);
        botMat.emissiveIntensity = 0.28;
        antTip.material.color.copy(colors.c2);
        parts.material.color.copy(colors.c3);
      };

      // ---------- drawing the learned world ----------
      const lift = new T.Object3D();
      lift.rotation.order = 'YXZ';
      const ARROW_Y = [0, -Math.PI / 2, Math.PI, Math.PI / 2];

      const paintWorld = () => {
        let w = 0;
        for (let i = 0; i < N * N; i += 1) {
          const [px, pz] = cellXZ(i);
          const cell = env.cells[i];
          const v = Math.min(Math.max(agent.maxQ(i), 0), 1);
          let h = 0.12 + v * 0.62;
          if (cell === PIT) { h = 0.05; tmp.copy(colors.c2); }
          else if (i === env.goal || i === env.start) { h = 0.16; tmp.copy(colors.tile).lerp(colors.c3, i === env.goal ? 0.55 : 0); if (i === env.start) tmp.copy(colors.tile).lerp(colors.c4, 0.35); }
          else tmp.copy(colors.tile).lerp(colors.c1, Math.min(v * 1.15, 1));
          dummy.position.set(px, h / 2 - 0.55, pz);
          dummy.scale.set(1, h, 1);
          dummy.rotation.set(0, 0, 0);
          dummy.updateMatrix();
          tiles.setMatrixAt(i, dummy.matrix);
          tiles.setColorAt(i, tmp);

          if (cell === WALL) {
            dummy.position.set(px, 0.55 - 0.55 + 0.02, pz);
            dummy.scale.set(1, 1.1, 1);
            dummy.updateMatrix();
            walls.setMatrixAt(w, dummy.matrix);
            w += 1;
          }

          const o = i * 4;
          const seen = Math.abs(agent.q[o]) + Math.abs(agent.q[o + 1]) + Math.abs(agent.q[o + 2]) + Math.abs(agent.q[o + 3]) > 0.001;
          if (seen && cell === EMPTY && i !== env.goal) {
            lift.rotation.set(-Math.PI / 2, ARROW_Y[agent.best(i, () => 0)], 0);
            lift.position.set(px, h - 0.55 + 0.04, pz);
            lift.scale.setScalar(0.55 + v * 0.6);
          } else {
            lift.position.set(px, -2, pz);
            lift.scale.setScalar(0.0001);
          }
          lift.updateMatrix();
          arrows.setMatrixAt(i, lift.matrix);
        }
        walls.count = w;
        tiles.instanceMatrix.needsUpdate = true;
        if (tiles.instanceColor) tiles.instanceColor.needsUpdate = true;
        walls.instanceMatrix.needsUpdate = true;
        arrows.instanceMatrix.needsUpdate = true;

        const [gx, gz] = cellXZ(env.goal);
        gem.position.set(gx, -0.05, gz);
        gemLight.position.set(gx, 0.5, gz);
        const [sx, sz] = cellXZ(env.start);
        startRing.position.set(sx, -0.36, sz);
      };

      const paintRoute = (path) => {
        if (!path) { crumbs.count = 0; return; }
        const pts = path.slice(1, -1).slice(0, 64);
        pts.forEach((c, i) => {
          const [px, pz] = cellXZ(c);
          dummy.position.set(px, -0.3, pz);
          dummy.scale.setScalar(1);
          dummy.rotation.set(0, 0, 0);
          dummy.updateMatrix();
          crumbs.setMatrixAt(i, dummy.matrix);
        });
        crumbs.count = pts.length;
        crumbs.instanceMatrix.needsUpdate = true;
      };

      // ---------- resize + theme ----------
      const resize = () => {
        const w = el.clientWidth || 1;
        const h = el.clientHeight || 1;
        renderer.setSize(w, h, false);
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        camera.aspect = w / h;
        camera.position.setLength(w < 620 ? 19.5 : 15.6);
        camera.updateProjectionMatrix();
      };
      const sizeWatch = new ResizeObserver(resize);
      sizeWatch.observe(el);
      resize();
      const themeWatch = new MutationObserver(() => { readColors(); applyColors(); paintWorld(); });
      themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      applyColors();

      // ---------- agent visuals ----------
      let from = cellXZ(env.start);
      let to = from;
      let hop = 1;
      let hopDur = 0.15;
      let lastEnded = false;
      const pos = { x: from[0], z: from[1] };
      bot.position.set(pos.x, -0.42, pos.z);
      let shake = 0;

      const burst = () => {
        const [gx, gz] = cellXZ(env.goal);
        particles.forEach((q) => {
          q.p.set(gx, 0, gz);
          const a = Math.random() * Math.PI * 2;
          q.v.set(Math.cos(a) * (0.6 + Math.random() * 1.4), 1.6 + Math.random() * 1.8, Math.sin(a) * (0.6 + Math.random() * 1.4));
          q.life = 1;
        });
      };

      // ---------- ui bridge ----------
      let statTimer = 0;
      const pushStats = (extra = {}) => {
        const last = trainer.returns.slice(-40);
        setUi((u) => ({
          ...u,
          episode: trainer.episode,
          eps: trainer.eps,
          wins: trainer.successRate(30),
          avg: last.length ? last.reduce((a, b) => a + b, 0) / last.length : 0,
          returns: trainer.returns.slice(-80),
          ...extra,
        }));
      };
      const checkRoute = () => {
        const r = trainer.greedyRoute();
        const shortest = env.shortest();
        const len = r.success ? r.path.length - 1 : null;
        paintRoute(r.success ? r.path : null);
        pushStats({ route: len, shortest, reachable: shortest !== -1 });
        if (r.success && len === shortest) game.award('converged');
      };
      let firstEpisode = false;
      const onEvent = (ev, animate) => {
        const target = cellXZ(ev.to);
        if (animate) {
          from = lastEnded ? cellXZ(env.start) : [pos.x, pos.z];
          to = target;
          hop = 0;
          if (ev.fell) shake = 1;
        } else {
          from = target; to = target; hop = 1; pos.x = target[0]; pos.z = target[1];
        }
        lastEnded = ev.end;
        if (ev.win) burst();
        if (ev.end) {
          if (!firstEpisode) { firstEpisode = true; game.award('episode'); }
          if (trainer.episode % 4 === 0) checkRoute();
        }
      };

      // ---------- editing the world ----------
      const refresh = (edited) => {
        trainer.s = env.start;
        trainer.steps = 0;
        trainer.ret = 0;
        lastEnded = true;
        paintWorld();
        const shortest = env.shortest();
        const reachable = shortest !== -1;
        if (edited && !reachable) game.award('chaos');
        checkRoute();
      };
      const applyTool = (cell) => {
        const tool = ctl.current.tool;
        const { cells } = env;
        if (tool === 'wall' || tool === 'pit') {
          if (cell === env.start || cell === env.goal) return;
          const v = tool === 'wall' ? WALL : PIT;
          if (cells[cell] === v) cells[cell] = EMPTY;
          else {
            cells[cell] = v;
            if (v === WALL) game.track('wall'); else game.award('trapper');
          }
        } else if (tool === 'erase') {
          if (cell === env.start || cell === env.goal) return;
          cells[cell] = EMPTY;
        } else if (tool === 'goal') {
          if (cell === env.start) return;
          cells[cell] = EMPTY;
          env.goal = cell;
        } else if (tool === 'start') {
          if (cell === env.goal) return;
          cells[cell] = EMPTY;
          env.start = cell;
        }
        trainer.bumpEpsilon(0.35);
        refresh(true);
      };

      const ray = new T.Raycaster();
      const floor = new T.Plane(new T.Vector3(0, 1, 0), 0.55);
      const hit = new T.Vector3();
      const ndc = new T.Vector2();
      const cellAt = (e) => {
        const r = renderer.domElement.getBoundingClientRect();
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ndc, camera);
        if (!ray.ray.intersectPlane(floor, hit)) return -1;
        const cx = Math.floor(hit.x + HALF);
        const cz = Math.floor(hit.z + HALF);
        return cx < 0 || cz < 0 || cx >= N || cz >= N ? -1 : cz * N + cx;
      };
      let down = null;
      const onDown = (e) => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; };
      const onUp = (e) => {
        if (!down) return;
        const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
        const quick = performance.now() - down.t < 600;
        down = null;
        if (moved < 6 && quick) { const c = cellAt(e); if (c >= 0) applyTool(c); }
      };
      const onMove = (e) => {
        const c = cellAt(e);
        controls.autoRotate = false;
        if (c < 0) { hover.visible = false; return; }
        const [px, pz] = cellXZ(c);
        hover.position.set(px, -0.5 + 0.2, pz);
        hover.visible = true;
      };
      const onLeave = () => { hover.visible = false; controls.autoRotate = !reduce; };
      const dom = renderer.domElement;
      dom.addEventListener('pointerdown', onDown);
      dom.addEventListener('pointerup', onUp);
      dom.addEventListener('pointermove', onMove);
      dom.addEventListener('pointerleave', onLeave);

      // ---------- controls exposed to the panel ----------
      api.current = {
        toggle: () => { ctl.current.running = !ctl.current.running; setUi((u) => ({ ...u, running: ctl.current.running })); },
        speed: (i) => { ctl.current.speed = i; setUi((u) => ({ ...u, speed: i })); },
        tool: (id) => { ctl.current.tool = id; setUi((u) => ({ ...u, tool: id })); },
        resetAgent: () => { trainer.resetAll(); trainer.s = env.start; lastEnded = true; paintWorld(); paintRoute(null); pushStats({ route: null }); },
        resetMap: () => { env.reset(); trainer.resetAll(); refresh(false); pushStats({ route: null }); },
      };

      // ---------- loop ----------
      let visible = true;
      let raf = 0;
      let last = performance.now();
      let acc = 0;
      let paintClock = 0;
      const frame = (now) => {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        controls.update();

        const c = ctl.current;
        if (c.running) {
          const sps = SPEEDS[c.speed].sps;
          acc += dt * sps;
          let n = 0;
          let lastEv = null;
          while (acc >= 1 && n < 600) {
            acc -= 1; n += 1;
            lastEv = trainer.step();
            if (sps <= 100) onEvent(lastEv, true);
          }
          if (n === 600) acc = 0;
          if (sps > 100 && lastEv) onEvent(lastEv, false);
          hopDur = Math.min(0.18, 0.85 / Math.max(sps, 1));
          paintClock += dt;
          if (n > 0 && paintClock > 0.09) { paintClock = 0; paintWorld(); }
          statTimer += dt;
          if (statTimer > 0.3) { statTimer = 0; pushStats(); }
        }

        hop = Math.min(1, hop + dt / hopDur);
        pos.x = from[0] + (to[0] - from[0]) * hop;
        pos.z = from[1] + (to[1] - from[1]) * hop;
        const arc = Math.sin(hop * Math.PI) * 0.22;
        shake = Math.max(0, shake - dt * 2.2);
        bot.position.set(pos.x + Math.sin(now * 0.05) * shake * 0.06, -0.42 + arc, pos.z);
        bot.rotation.y = Math.atan2(to[0] - from[0], to[1] - from[1]) || bot.rotation.y;
        gem.rotation.y += dt * 1.2;
        gem.position.y = -0.05 + Math.sin(now * 0.002) * 0.06;

        let alive = 0;
        particles.forEach((q, i) => {
          if (q.life <= 0) return;
          q.life -= dt * 1.1;
          q.v.y -= 6 * dt;
          q.p.addScaledVector(q.v, dt);
          dummy.position.copy(q.p);
          dummy.scale.setScalar(Math.max(q.life, 0.001));
          dummy.rotation.set(0, 0, 0);
          dummy.updateMatrix();
          parts.setMatrixAt(i, dummy.matrix);
          alive = i + 1;
        });
        parts.count = alive;
        parts.instanceMatrix.needsUpdate = true;

        renderer.render(scene, camera);
        if (visible) raf = requestAnimationFrame(frame);
      };
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) { last = performance.now(); raf = requestAnimationFrame(frame); }
      }, { threshold: 0.05 });
      io.observe(el);

      paintWorld();
      checkRoute();
      setUi((u) => ({ ...u, loading: false, running: ctl.current.running }));

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect(); sizeWatch.disconnect(); themeWatch.disconnect();
        dom.removeEventListener('pointerdown', onDown);
        dom.removeEventListener('pointerup', onUp);
        dom.removeEventListener('pointermove', onMove);
        dom.removeEventListener('pointerleave', onLeave);
        controls.dispose();
        scene.traverse((o) => {
          if (o.geometry) o.geometry.dispose();
          if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
        });
        renderer.dispose();
        if (dom.parentNode === el) el.removeChild(dom);
        api.current = {};
      };
    })();

    return () => { disposed = true; cleanup(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const status = !ui.reachable
    ? { tone: 'bad', text: 'Goal unreachable · remove a wall' }
    : ui.route
      ? { tone: 'good', text: ui.route === ui.shortest ? `Optimal route · ${ui.route} steps` : `Route found · ${ui.route} steps (shortest ${ui.shortest})` }
      : { tone: 'wait', text: 'Exploring · the agent knows nothing yet' };

  return (
    <section className="container section arena" id="arena" data-section="arena">
      <div className="section-head reveal">
        <p className="eyebrow">Level 01 · The Arena</p>
        <h2>A real RL agent lives here.</h2>
        <p className="sub">I built a tiny Q-learning environment for this site. The agent starts knowing nothing and learns the shortest safe route to the gem. Change its world with walls and traps, and watch it adapt.</p>
      </div>

      <div className="arena-grid reveal d1">
        <div className="stage panel">
          <div className="canvas3d" ref={mount} />
          {ui.loading && ui.gl && <div className="stage-note">Loading 3D world…</div>}
          {!ui.gl && <div className="stage-note">WebGL is not available in this browser, so the 3D arena cannot run.</div>}
          <div className={`status ${status.tone}`}><i />{status.text}</div>
          <div className="hint">Drag to rotate · Click a tile to place the selected tool</div>
        </div>

        <aside className="console panel">
          <div className="console-head">
            <span className="mono">PortfolioEnv-v1</span>
            <span className="mono dim">8×8 · 4 actions</span>
          </div>

          <div className="stats4">
            <div><b>{ui.episode}</b><span>Episode</span></div>
            <div><b>{ui.eps.toFixed(2)}</b><span>Epsilon ε</span></div>
            <div><b>{Math.round(ui.wins * 100)}%</b><span>Recent wins</span></div>
            <div><b>{ui.avg.toFixed(1)}</b><span>Avg return</span></div>
          </div>
          <Spark data={ui.returns} />

          <div className="ctrl-row">
            <button className="gbtn primary" onClick={() => api.current.toggle && api.current.toggle()}>
              <Icon name={ui.running ? 'pause' : 'play'} /> {ui.running ? 'Pause' : 'Train'}
            </button>
            <button className="gbtn" onClick={() => api.current.resetAgent && api.current.resetAgent()}><Icon name="reset" /> Forget</button>
            <button className="gbtn" onClick={() => api.current.resetMap && api.current.resetMap()}>Reset map</button>
          </div>

          <p className="mini-label">Speed</p>
          <div className="seg">
            {SPEEDS.map((s, i) => (
              <button key={s.k} className={ui.speed === i ? 'on' : ''} onClick={() => api.current.speed && api.current.speed(i)}>{s.k}</button>
            ))}
          </div>

          <p className="mini-label">Tool</p>
          <div className="seg tools">
            {TOOLS.map((t) => (
              <button key={t.id} className={ui.tool === t.id ? 'on' : ''} onClick={() => api.current.tool && api.current.tool(t.id)}>{t.label}</button>
            ))}
          </div>

          <ul className="legend-rl">
            <li><i className="a" /> Tile height and glow: learned value</li>
            <li><i className="b" /> Arrow: what the agent would do</li>
            <li><i className="c" /> Green dots: its best route</li>
            <li><i className="d" /> Gem: +1 · Pit: −1 · Wall bump: −0.3</li>
          </ul>
        </aside>
      </div>

      <div className="rl-notes reveal">
        <div className="note">
          <p className="mini-label">The environment</p>
          <p><b>State</b> the tile the agent stands on (64 of them). <b>Actions</b> up, right, down, left. <b>Reward</b> +{REWARD.goal} for the gem, {REWARD.pit} for a pit, {REWARD.bump} for a wall bump, {REWARD.step} per step, so shorter routes score higher.</p>
        </div>
        <div className="note">
          <p className="mini-label">The learning rule</p>
          <p className="formula">Q(s,a) ← Q(s,a) + α · [ r + γ · max Q(s′,a′) − Q(s,a) ]</p>
          <p>α = 0.5, γ = 0.95. Epsilon starts at 1 (pure exploration) and decays toward 0.04 (mostly exploiting what it learned).</p>
        </div>
        <pre className="note code" aria-label="Training loop in pseudocode">{`for episode in range(N):
    s = env.reset()
    while not done:
        a = epsilon_greedy(Q, s)
        s2, r, done = env.step(a)
        Q[s, a] += alpha * (r + gamma * Q[s2].max() - Q[s, a])
        s = s2`}</pre>
      </div>
    </section>
  );
}
