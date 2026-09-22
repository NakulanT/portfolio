// Zen: a winding path through vermilion torii at dawn. Each stop is a stone lantern under
// a sakura tree; petals fall, paper lanterns rise, and Fuji waits on the horizon.
import { gradientTexture, rng } from '../util';

const GAP = 12;
const px = (s) => Math.sin(s * 0.045) * 7;
const dxds = (s) => Math.cos(s * 0.045) * 7 * 0.045;
const pathAt = (s) => ({ x: px(s), z: -s });
const normalAt = (s) => { const d = dxds(s), l = Math.hypot(1, d); return { x: 1 / l, z: d / l }; };

export function buildZen(T, { root, scene, count }) {
  scene.background = gradientTexture(T, [[0, '#cdb9dc'], [0.42, '#efd0c4'], [0.62, '#fbe6d6'], [1, '#f3e2d3']]);
  scene.fog = new T.Fog('#f4e1d2', 14, 105);
  scene.environmentIntensity = 0.8;
  root.add(new T.HemisphereLight('#fff4e6', '#b4988a', 1.1));
  const sun = new T.DirectionalLight('#ffd2a6', 1.5);
  sun.position.set(-12, 14, 6);
  root.add(sun);

  const stopS = (i) => 8 + i * GAP;
  const end = stopS(count - 1) + 30;
  const R = rng(11);

  const ground = new T.Mesh(new T.PlaneGeometry(220, end + 120), new T.MeshStandardMaterial({ color: '#e8d8c3', roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.z = -end / 2 + 20;
  root.add(ground);

  // stepping-stone path
  const stoneN = Math.floor((end + 20) / 1.4);
  const stones = new T.InstancedMesh(new T.CylinderGeometry(0.55, 0.62, 0.12, 9), new T.MeshStandardMaterial({ color: '#b9ab9b', roughness: 0.95, flatShading: true }), stoneN);
  const m4 = new T.Matrix4(), q = new T.Quaternion(), sc = new T.Vector3(), pos = new T.Vector3(), eul = new T.Euler();
  for (let i = 0; i < stoneN; i++) {
    const s = -20 + i * 1.4;
    const p = pathAt(s), n = normalAt(s), off = (R() - 0.5) * 0.5;
    pos.set(p.x + n.x * off, 0.04, p.z + n.z * off);
    q.setFromEuler(eul.set(0, R() * 3, 0));
    sc.set(0.8 + R() * 0.4, 1, 0.8 + R() * 0.4);
    stones.setMatrixAt(i, m4.compose(pos, q, sc));
  }
  root.add(stones);

  // torii: small tunnels of gates between stops, instanced per part
  const toriiS = [];
  for (let i = -1; i < count; i++) {
    // a short tunnel just past each lantern, ending before the next stop's camera
    const s0 = stopS(i) + 1;
    for (let j = 0; j < 3; j++) toriiS.push(s0 + j * 1.5);
  }
  const TN = toriiS.length;
  const red = new T.MeshStandardMaterial({ color: '#d4381e', roughness: 0.55 });
  const black = new T.MeshStandardMaterial({ color: '#1b1512', roughness: 0.6 });
  const parts = [
    { geo: new T.CylinderGeometry(0.15, 0.17, 3.6, 12), mat: red, locals: [[-1.45, 1.8, 0], [1.45, 1.8, 0]] },
    { geo: new T.BoxGeometry(4.1, 0.24, 0.36), mat: red, locals: [[0, 3.72, 0]] },
    { geo: new T.BoxGeometry(4.4, 0.13, 0.44), mat: black, locals: [[0, 3.9, 0]] },
    { geo: new T.BoxGeometry(3.3, 0.17, 0.2), mat: red, locals: [[0, 3.05, 0]] },
    { geo: new T.CylinderGeometry(0.22, 0.22, 0.3, 12), mat: black, locals: [[-1.45, 0.15, 0], [1.45, 0.15, 0]] },
  ];
  const base = new T.Matrix4(), local = new T.Matrix4();
  parts.forEach((p) => {
    const im = new T.InstancedMesh(p.geo, p.mat, TN * p.locals.length);
    let k = 0;
    toriiS.forEach((s) => {
      const c = pathAt(s);
      base.compose(pos.set(c.x, 0, c.z), q.setFromEuler(eul.set(0, Math.atan2(-dxds(s), 1), 0)), sc.set(1, 1, 1));
      p.locals.forEach((l) => { local.makeTranslation(l[0], l[1], l[2]); im.setMatrixAt(k++, m4.multiplyMatrices(base, local)); });
    });
    root.add(im);
  });

  // lanterns + sakura trees at each stop
  const stoneMat = new T.MeshStandardMaterial({ color: '#9d948a', roughness: 0.9, flatShading: true });
  const fireMat = new T.MeshBasicMaterial({ color: '#ffb35c' });
  const trunkMat = new T.MeshStandardMaterial({ color: '#4a3128', roughness: 0.9 });
  const blossomGeo = new T.IcosahedronGeometry(0.6, 1);
  const blossomN = count * 8;
  const blossoms = new T.InstancedMesh(blossomGeo, new T.MeshStandardMaterial({ color: '#ffffff', roughness: 0.8, flatShading: true }), blossomN);
  const pink = new T.Color();
  let bk = 0;
  const lanterns = [];
  for (let i = 0; i < count; i++) {
    const s = stopS(i), side = i % 2 ? 1 : -1;
    const c = pathAt(s), n = normalAt(s);
    const L = new T.Group();
    L.position.set(c.x + n.x * side * 3.3, 0, c.z + n.z * side * 3.3);
    const pieces = [
      [new T.CylinderGeometry(0.42, 0.5, 0.24, 6), 0.12],
      [new T.CylinderGeometry(0.13, 0.16, 0.9, 6), 0.69],
      [new T.CylinderGeometry(0.34, 0.3, 0.14, 6), 1.2],
    ];
    pieces.forEach(([g, y]) => { const m = new T.Mesh(g, stoneMat); m.position.y = y; L.add(m); });
    const fire = new T.Mesh(new T.BoxGeometry(0.34, 0.32, 0.34), fireMat); fire.position.y = 1.43; L.add(fire);
    const roof = new T.Mesh(new T.ConeGeometry(0.62, 0.42, 6), stoneMat); roof.position.y = 1.8; L.add(roof);
    const knob = new T.Mesh(new T.SphereGeometry(0.1, 8, 6), stoneMat); knob.position.y = 2.06; L.add(knob);
    const light = new T.PointLight('#ffae5c', 0, 7, 1.6); light.position.y = 1.45; L.add(light);
    root.add(L);
    lanterns.push({ L, fire, light });

    // sakura behind the lantern
    const tx = L.position.x + n.x * side * 2.2, tz = L.position.z + n.z * side * 2.2 - 1;
    const trunk = new T.Mesh(new T.CylinderGeometry(0.12, 0.24, 2.6, 7), trunkMat);
    trunk.position.set(tx, 1.3, tz); trunk.rotation.z = side * 0.12;
    root.add(trunk);
    for (let b = 0; b < 8; b++) {
      pos.set(tx + (R() - 0.5) * 2.6 + side * 0.3, 2.6 + R() * 1.3, tz + (R() - 0.5) * 2.2);
      sc.setScalar(0.7 + R() * 0.6);
      blossoms.setMatrixAt(bk, m4.compose(pos, q.identity(), sc));
      blossoms.setColorAt(bk, pink.setHSL(0.95 + R() * 0.03, 0.7, 0.68 + R() * 0.1));
      bk++;
    }

    // raked-sand rock garden on the other side, every other stop
    if (i % 2 === 0) {
      const gx = c.x - n.x * side * 5.5, gz = c.z - n.z * side * 5.5;
      const rock = new T.Mesh(new T.DodecahedronGeometry(0.7, 0), new T.MeshStandardMaterial({ color: '#5b544e', roughness: 1, flatShading: true }));
      rock.position.set(gx, 0.3, gz); rock.scale.set(1.3, 0.7, 1); rock.rotation.y = R() * 3;
      root.add(rock);
      for (let r = 1; r <= 4; r++) {
        const ring = new T.Mesh(new T.RingGeometry(0.7 + r * 0.45, 0.76 + r * 0.45, 48), new T.MeshBasicMaterial({ color: '#cdbba5' }));
        ring.rotation.x = -Math.PI / 2; ring.position.set(gx, 0.012, gz);
        root.add(ring);
      }
    }
  }
  root.add(blossoms);

  // Fuji and far hills (unfogged, pale)
  const fuji = new T.Group();
  const fujiMat = new T.MeshBasicMaterial({ color: '#948db5', fog: false });
  const cone = new T.Mesh(new T.ConeGeometry(70, 42, 48, 1, true), fujiMat);
  const cap = new T.Mesh(new T.ConeGeometry(21, 12.6, 48), new T.MeshBasicMaterial({ color: '#fbf7f3', fog: false }));
  cap.position.y = 14.8;
  fuji.add(cone, cap);
  const disc = new T.Mesh(new T.CircleGeometry(12, 48), new T.MeshBasicMaterial({ color: '#e8553b', fog: false }));
  disc.position.set(-46, 44, -8);
  fuji.add(disc);
  root.add(fuji);

  // falling petals around the camera
  const PN = 220;
  const petals = new T.InstancedMesh(new T.PlaneGeometry(0.1, 0.07), new T.MeshBasicMaterial({ color: '#f6b7c9', side: T.DoubleSide }), PN);
  const pst = Array.from({ length: PN }, () => ({ x: (R() - 0.5) * 26, y: R() * 9, z: (R() - 0.5) * 30, v: 0.4 + R() * 0.6, ph: R() * 6, r: R() * 6 }));
  root.add(petals);

  // rising sky lanterns
  const SL = 16;
  const sky = new T.InstancedMesh(new T.CylinderGeometry(0.18, 0.14, 0.36, 10), new T.MeshBasicMaterial({ color: '#ffb35c', fog: false }), SL);
  const slt = Array.from({ length: SL }, () => ({ x: (R() - 0.5) * 50, y: R() * 25, z: -R() * end, v: 0.3 + R() * 0.3 }));
  root.add(sky);

  function update(dt, t, { stop, gate, camera }) {
    const cp = camera.position;
    fuji.position.set(cp.x + 22, -2, cp.z - 190);
    lanterns.forEach((l, i) => {
      const on = i <= stop && !gate;
      l.light.intensity += ((on ? 5 : 0) - l.light.intensity) * Math.min(1, dt * 3);
      l.fire.material.color.set(on ? '#ffc070' : '#d9c4a8');
    });
    for (let i = 0; i < PN; i++) {
      const p = pst[i];
      p.y -= p.v * dt;
      p.x += Math.sin(t * 0.9 + p.ph) * 0.35 * dt;
      p.r += dt * 1.5;
      if (p.y < 0) { p.y = 9; p.x = (R() - 0.5) * 26; p.z = (R() - 0.5) * 30; }
      pos.set(cp.x + p.x, p.y, cp.z - 6 + p.z);
      q.setFromEuler(eul.set(p.r, p.r * 0.7, p.ph));
      petals.setMatrixAt(i, m4.compose(pos, q, sc.set(1, 1, 1)));
    }
    petals.instanceMatrix.needsUpdate = true;
    for (let i = 0; i < SL; i++) {
      const s = slt[i];
      s.y += s.v * dt;
      if (s.y > 30) s.y = 0;
      pos.set(s.x + Math.sin(t * 0.3 + i) * 0.8, 4 + s.y, s.z);
      sky.setMatrixAt(i, m4.compose(pos, q.identity(), sc.set(1, 1, 1)));
    }
    sky.instanceMatrix.needsUpdate = true;
  }

  return {
    stop(i) {
      const s = stopS(i), side = i % 2 ? 1 : -1;
      const c = pathAt(s), n = normalAt(s);
      const back = pathAt(s - 6.5), ahead = pathAt(s + 8);
      const L = { x: c.x + n.x * side * 3.3, z: c.z + n.z * side * 3.3 };
      return {
        cam: [back.x - n.x * side * 0.9, 1.75, back.z],
        look: [L.x * 0.55 + ahead.x * 0.45, 1.6, L.z * 0.55 + ahead.z * 0.45],
      };
    },
    overview: () => ({ cam: [2, 4.5, 20], look: [0, 3.2, -30] }),
    update,
  };
}
