// Neural Lab: the being is an RL agent walking a live value grid. Each stop is a goal
// state; tiles show a value heatmap rippling out from the current goal and the path the
// agent has already walked lights up behind it. A neural net pulses in the sky.
import { glowTexture, rng } from '../util';

export function buildNeural(T, { root, scene, count }) {
  scene.background = new T.Color('#03050b');
  scene.fog = new T.FogExp2('#03050b', 0.032);
  scene.environmentIntensity = 0.35;
  root.add(new T.HemisphereLight('#7fb2ff', '#02040a', 0.8));
  const sun = new T.DirectionalLight('#ffffff', 1.3);
  sun.position.set(6, 14, 8);
  root.add(sun);

  const pts = [];
  for (let i = 0; i < count; i++) pts.push({ x: Math.round(Math.sin(i * 1.13) * 5 + Math.sin(i * 0.41) * 2), z: -i * 6 });

  // the agent's trajectory: a staircase walk between consecutive goals
  const trail = new Map();
  trail.set(`${pts[0].x},${pts[0].z}`, 0);
  for (let i = 1; i < count; i++) {
    let { x, z } = pts[i - 1];
    const b = pts[i];
    while (x !== b.x || z !== b.z) {
      const moveZ = z !== b.z && (x === b.x || ((x + z) & 1));
      if (moveZ) z += Math.sign(b.z - z); else x += Math.sign(b.x - x);
      const k = `${x},${z}`;
      if (!trail.has(k)) trail.set(k, i);
    }
  }

  const X0 = -11, X1 = 11, Z0 = 10, Z1 = -(count - 1) * 6 - 18;
  const cols = X1 - X0 + 1, rows = Z0 - Z1 + 1, n = cols * rows;
  const tiles = new T.InstancedMesh(
    new T.BoxGeometry(0.9, 0.14, 0.9),
    new T.MeshStandardMaterial({ color: '#ffffff', roughness: 0.5, metalness: 0.3 }),
    n,
  );
  const tx = new Float32Array(n), tz = new Float32Array(n), seg = new Int16Array(n);
  let k = 0;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    tx[k] = X0 + c; tz[k] = Z0 - r;
    const s = trail.get(`${tx[k]},${tz[k]}`);
    seg[k] = s === undefined ? -1 : s;
    k++;
  }
  const m4 = new T.Matrix4(), col = new T.Color();
  const cBase = new T.Color('#0a1322'), cCyan = new T.Color('#1fd6ff'), cLime = new T.Color('#b6ff3b'), cPlan = new T.Color('#1b3a55');
  for (let i = 0; i < n; i++) { m4.makeTranslation(tx[i], -0.07, tz[i]); tiles.setMatrixAt(i, m4); tiles.setColorAt(i, cBase); }
  root.add(tiles);

  // goal crystals with light beams
  const crystals = [];
  const cryGeo = new T.OctahedronGeometry(0.42, 0);
  const beamGeo = new T.CylinderGeometry(0.025, 0.025, 1.3, 6);
  for (let i = 0; i < count; i++) {
    const g = new T.Group();
    g.position.set(pts[i].x, 0, pts[i].z);
    const mat = new T.MeshStandardMaterial({ color: '#0b2233', emissive: '#1fd6ff', emissiveIntensity: 0.6, roughness: 0.2, metalness: 0.6 });
    const cry = new T.Mesh(cryGeo, mat);
    cry.position.y = 1.55;
    const beam = new T.Mesh(beamGeo, new T.MeshBasicMaterial({ color: '#1fd6ff', transparent: true, opacity: 0.35, blending: T.AdditiveBlending, depthWrite: false }));
    beam.position.y = 0.65;
    g.add(cry, beam);
    root.add(g);
    crystals.push({ g, cry, mat, beam });
  }

  // neural net hanging in the sky, travelling with the camera
  const net = new T.Group();
  const layers = [5, 8, 8, 6, 3];
  const nodes = [];
  const nodeMat = new T.MeshBasicMaterial({ color: '#7df9ff', fog: false });
  const nodeGeo = new T.SphereGeometry(0.28, 12, 10);
  layers.forEach((cnt, l) => {
    for (let j = 0; j < cnt; j++) {
      const p = new T.Vector3(-16 + l * 8, (j - (cnt - 1) / 2) * 1.9, 0);
      nodes.push({ p, l });
      const m = new T.Mesh(nodeGeo, nodeMat);
      m.position.copy(p);
      net.add(m);
    }
  });
  const edges = [];
  const epos = [];
  nodes.forEach((a) => nodes.forEach((b) => {
    if (b.l === a.l + 1) { edges.push([a.p, b.p]); epos.push(a.p.x, a.p.y, a.p.z, b.p.x, b.p.y, b.p.z); }
  }));
  const eg = new T.BufferGeometry();
  eg.setAttribute('position', new T.Float32BufferAttribute(epos, 3));
  net.add(new T.LineSegments(eg, new T.LineBasicMaterial({ color: '#1fd6ff', transparent: true, opacity: 0.14, fog: false })));
  const P = 50;
  const pulseGeo = new T.BufferGeometry();
  const pulsePos = new Float32Array(P * 3);
  pulseGeo.setAttribute('position', new T.BufferAttribute(pulsePos, 3));
  const pulses = new T.Points(pulseGeo, new T.PointsMaterial({
    size: 0.7, map: glowTexture(T), color: '#b6ff3b', transparent: true, blending: T.AdditiveBlending, depthWrite: false, fog: false,
  }));
  net.add(pulses);
  const R = rng(7);
  const pulseState = Array.from({ length: P }, () => ({ e: Math.floor(R() * edges.length), u: R(), v: 0.4 + R() * 0.8 }));
  net.position.set(0, 7.5, -40);
  root.add(net);

  // drifting "bits"
  const B = 300;
  const bitsPos = new Float32Array(B * 3);
  for (let i = 0; i < B; i++) {
    bitsPos[i * 3] = (R() - 0.5) * 30;
    bitsPos[i * 3 + 1] = R() * 10;
    bitsPos[i * 3 + 2] = 10 - R() * (count * 6 + 30);
  }
  const bitsGeo = new T.BufferGeometry();
  bitsGeo.setAttribute('position', new T.BufferAttribute(bitsPos, 3));
  root.add(new T.Points(bitsGeo, new T.PointsMaterial({
    size: 0.12, map: glowTexture(T), color: '#6fe9ff', transparent: true, opacity: 0.8, blending: T.AdditiveBlending, depthWrite: false,
  })));

  let acc = 0;
  function update(dt, t, { stop, gate, camera }) {
    const goal = pts[gate ? 0 : stop];
    acc += dt;
    if (acc > 1 / 30) {
      acc = 0;
      // rows are laid out by z, so only walk the band the camera can actually see
      const cz = camera.position.z;
      const r0 = Math.max(0, Math.floor(Z0 - (cz + 6))), r1 = Math.min(rows, Math.ceil(Z0 - (cz - 45)));
      for (let i = r0 * cols; i < r1 * cols; i++) {
        const dx = tx[i] - goal.x, dz = tz[i] - goal.z;
        const d = Math.sqrt(dx * dx + dz * dz);
        const value = Math.exp(-d * 0.17);
        const ripple = 0.5 + 0.5 * Math.sin(d * 0.9 - t * 3.2);
        let y = value * ripple * 0.4;
        col.copy(cBase).lerp(cCyan, Math.min(1, value * (0.2 + ripple * 0.6)));
        const s = seg[i];
        if (s >= 0) {
          if (s <= stop && !gate) { col.lerp(cLime, 0.85); y += 0.06; } else col.lerp(cPlan, 0.5);
        }
        m4.makeTranslation(tx[i], y - 0.07, tz[i]);
        tiles.setMatrixAt(i, m4);
        tiles.setColorAt(i, col);
      }
      tiles.instanceMatrix.needsUpdate = true;
      tiles.instanceColor.needsUpdate = true;
    }

    crystals.forEach((c, i) => {
      const cur = i === stop && !gate;
      c.cry.rotation.y += dt * (cur ? 2.2 : 0.8);
      c.cry.position.y = 1.55 + Math.sin(t * 2 + i) * 0.08;
      const s = cur ? 1.35 : 0.8;
      c.cry.scale.setScalar(c.cry.scale.x + (s - c.cry.scale.x) * Math.min(1, dt * 6));
      const tgt = i < stop && !gate ? cLime : cCyan;
      c.mat.emissive.lerp(tgt, Math.min(1, dt * 4));
      c.mat.emissiveIntensity = cur ? 1.6 + Math.sin(t * 5) * 0.3 : 0.55;
      c.beam.material.opacity = cur ? 0.6 : 0.2;
    });

    net.position.z = camera.position.z - 42;
    net.position.x = camera.position.x * 0.4;
    for (let i = 0; i < P; i++) {
      const p = pulseState[i];
      p.u += dt * p.v;
      if (p.u > 1) { p.u = 0; p.e = Math.floor(R() * edges.length); }
      const [a, b] = edges[p.e];
      pulsePos[i * 3] = a.x + (b.x - a.x) * p.u;
      pulsePos[i * 3 + 1] = a.y + (b.y - a.y) * p.u;
      pulsePos[i * 3 + 2] = 0;
    }
    pulseGeo.attributes.position.needsUpdate = true;

    for (let i = 0; i < B; i++) {
      bitsPos[i * 3 + 1] += dt * 0.25;
      if (bitsPos[i * 3 + 1] > 10) bitsPos[i * 3 + 1] = 0;
    }
    bitsGeo.attributes.position.needsUpdate = true;
  }

  return {
    stop(i) {
      const p = pts[i];
      return { cam: [p.x + 4.2, 3.4, p.z + 7.4], look: [p.x - 1.4, 1.1, p.z - 1.5] };
    },
    overview: () => ({ cam: [9, 12, 19], look: [0, 0.5, -12] }),
    update,
  };
}
