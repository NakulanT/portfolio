// Bit: the little guide who travels through every world with the visitor.
// One persistent object. Switching worlds changes its costume, never its identity.
import { glowTexture, damp } from './util';

const SKINS = {
  neural: { skin: '#eef2fb', accent: '#1fd6ff', eye: '#7df9ff', visor: '#050912', glow: '#39e6ff', glowOp: 0.55, rough: 0.3, eyeShape: 'capsule' },
  arcade: { skin: '#fff0fb', accent: '#ff2bd6', eye: '#ffe066', visor: '#12021f', glow: '#ff4fd8', glowOp: 0.6, rough: 0.25, eyeShape: 'pixel' },
  zen: { skin: '#fbf6ee', accent: '#d9381e', eye: '#ffae4a', visor: '#1b1411', glow: '#ffb070', glowOp: 0.28, rough: 0.45, eyeShape: 'capsule' },
  olympus: { skin: '#f3eee6', accent: '#c9a24a', eye: '#ffd27a', visor: '#2a2118', glow: '#ffd88a', glowOp: 0.25, rough: 0.55, eyeShape: 'capsule' },
  cosmos: { skin: '#f1f0ff', accent: '#8b5cff', eye: '#c5b3ff', visor: '#07051a', glow: '#9d7bff', glowOp: 0.6, rough: 0.2, eyeShape: 'capsule' },
};

export function createBeing(T) {
  const root = new T.Group();
  const body = new T.Group();
  root.add(body);

  const skin = new T.MeshPhysicalMaterial({ color: '#eef2fb', roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.2 });
  const accent = new T.MeshStandardMaterial({ color: '#1fd6ff', roughness: 0.35, metalness: 0.4 });
  const eyeMat = new T.MeshBasicMaterial({ color: '#7df9ff' });
  const visorMat = new T.MeshPhysicalMaterial({ color: '#050912', roughness: 0.1, metalness: 0.3, clearcoat: 1 });

  const shell = new T.Mesh(new T.SphereGeometry(0.5, 48, 36), skin);
  shell.scale.set(1, 0.92, 0.94);
  body.add(shell);

  // dark glass face band on the front (+z)
  const visor = new T.Mesh(new T.SphereGeometry(0.507, 48, 24, Math.PI / 2 - 0.95, 1.9, 0.98, 1.05), visorMat);
  visor.scale.copy(shell.scale);
  body.add(visor);

  const face = new T.Group();
  body.add(face);
  const capsule = new T.CapsuleGeometry(0.042, 0.085, 4, 10);
  const pixel = new T.BoxGeometry(0.1, 0.1, 0.03);
  const eyeL = new T.Mesh(capsule, eyeMat);
  const eyeR = new T.Mesh(capsule, eyeMat);
  eyeL.position.set(-0.13, 0.05, 0.458); eyeL.rotation.y = -0.27;
  eyeR.position.set(0.13, 0.05, 0.458); eyeR.rotation.y = 0.27;
  const mouth = new T.Mesh(new T.TorusGeometry(0.05, 0.011, 6, 18, Math.PI), eyeMat);
  mouth.position.set(0, -0.1, 0.462);
  mouth.rotation.z = Math.PI;
  face.add(eyeL, eyeR, mouth);

  // side pods, antenna
  const podGeo = new T.CylinderGeometry(0.11, 0.11, 0.09, 24);
  [-1, 1].forEach((s) => {
    const pod = new T.Mesh(podGeo, accent);
    pod.rotation.z = Math.PI / 2;
    pod.position.set(0.49 * s, 0.02, 0);
    body.add(pod);
  });
  const stalk = new T.Mesh(new T.CylinderGeometry(0.012, 0.012, 0.22, 8), accent);
  stalk.position.y = 0.55;
  const tip = new T.Mesh(new T.SphereGeometry(0.045, 16, 12), eyeMat);
  tip.position.y = 0.68;
  body.add(stalk, tip);

  // floating hands
  const handGeo = new T.SphereGeometry(0.1, 20, 16);
  const handL = new T.Mesh(handGeo, skin);
  const handR = new T.Mesh(handGeo, skin);
  body.add(handL, handR);

  const glow = new T.Sprite(new T.SpriteMaterial({
    map: glowTexture(T), color: '#39e6ff', transparent: true, opacity: 0.5,
    blending: T.AdditiveBlending, depthWrite: false, fog: false,
  }));
  glow.scale.setScalar(2.6);
  root.add(glow);

  // costume pieces live here and are rebuilt on every world switch
  let acc = new T.Group();
  body.add(acc);
  let accUpdate = null;
  let attached = [];

  const state = {
    blinkIn: 2, blink: 0, wave: 0, spin: 0, swoop: 0, talking: false,
    q: new T.Quaternion(), dummy: new T.Object3D(),
  };

  function clearCostume() {
    attached.forEach((m) => { m.parent && m.parent.remove(m); m.geometry && m.geometry.dispose(); });
    attached = [];
    body.remove(acc);
    acc.traverse((n) => { n.geometry && n.geometry.dispose(); n.material && n.material !== skin && n.material !== accent && n.material !== eyeMat && n.material.dispose(); });
    acc = new T.Group();
    body.add(acc);
    accUpdate = null;
  }

  function costume(id, c) {
    clearCostume();
    const gold = new T.MeshStandardMaterial({ color: '#d8b25a', metalness: 1, roughness: 0.28 });
    if (id === 'neural') {
      // orbiting ring of bits
      const ring = new T.Group();
      ring.rotation.set(1.2, 0, 0.3);
      ring.add(new T.Mesh(new T.TorusGeometry(0.8, 0.008, 6, 120), new T.MeshBasicMaterial({ color: c.eye, transparent: true, opacity: 0.7 })));
      const bitGeo = new T.BoxGeometry(0.06, 0.06, 0.06);
      const bitMat = new T.MeshBasicMaterial({ color: c.eye });
      for (let i = 0; i < 7; i++) {
        const b = new T.Mesh(bitGeo, bitMat);
        const a = (i / 7) * Math.PI * 2;
        b.position.set(Math.cos(a) * 0.8, Math.sin(a) * 0.8, 0);
        ring.add(b);
      }
      acc.add(ring);
      accUpdate = (dt) => { ring.rotation.z += dt * 0.9; };
    } else if (id === 'arcade') {
      // pixel crown
      const mat = new T.MeshStandardMaterial({ color: '#ffd23f', emissive: '#ff9e00', emissiveIntensity: 0.6, roughness: 0.4 });
      const g = new T.BoxGeometry(0.09, 0.09, 0.09);
      [[-0.2, 0.08], [-0.1, 0.14], [0, 0.2], [0.1, 0.14], [0.2, 0.08]].forEach(([x, h]) => {
        const col = new T.Mesh(new T.BoxGeometry(0.09, h, 0.09), mat);
        col.position.set(x, 0.47 + h / 2, 0.05);
        acc.add(col);
      });
      const band = new T.Mesh(new T.BoxGeometry(0.5, 0.07, 0.12), mat);
      band.position.set(0, 0.47, 0.05);
      acc.add(band);
      const gem = new T.Mesh(g, new T.MeshBasicMaterial({ color: '#22e1ff' }));
      gem.position.set(0, 0.47, 0.12);
      acc.add(gem);
      accUpdate = (dt, t) => { gem.rotation.y = t * 3; };
    } else if (id === 'zen') {
      // fox-mask ears, cheek marks and a paper lantern in hand
      const earGeo = new T.ConeGeometry(0.13, 0.3, 4);
      const inner = new T.MeshStandardMaterial({ color: c.accent, roughness: 0.6 });
      [-1, 1].forEach((s) => {
        const ear = new T.Mesh(earGeo, skin);
        ear.position.set(0.24 * s, 0.5, -0.02);
        ear.rotation.set(0, Math.PI / 4, -0.38 * s);
        const e2 = new T.Mesh(new T.ConeGeometry(0.07, 0.2, 4), inner);
        e2.position.set(0.24 * s + 0.012 * s, 0.49, 0.045);
        e2.rotation.copy(ear.rotation);
        acc.add(ear, e2);
        const mark = new T.Mesh(new T.BoxGeometry(0.11, 0.022, 0.01), inner);
        mark.position.set(0.31 * s, -0.08, 0.345);
        mark.rotation.set(0, 0.72 * s, -0.25 * s);
        acc.add(mark);
      });
      const lantern = new T.Group();
      const paper = new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 0.17, 14), new T.MeshBasicMaterial({ color: '#ffb35c' }));
      const capMat = new T.MeshStandardMaterial({ color: '#1b1411' });
      const capT = new T.Mesh(new T.CylinderGeometry(0.07, 0.08, 0.025, 14), capMat); capT.position.y = 0.095;
      const capB = capT.clone(); capB.position.y = -0.095;
      const string = new T.Mesh(new T.CylinderGeometry(0.004, 0.004, 0.14, 4), capMat); string.position.y = 0.17;
      lantern.add(paper, capT, capB, string);
      lantern.position.y = -0.27;
      handR.add(lantern);
      attached.push(lantern);
      accUpdate = (dt, t) => { lantern.rotation.z = Math.sin(t * 1.7) * 0.18; };
    } else if (id === 'olympus') {
      // golden laurel wreath
      const wreath = new T.Group();
      const leaf = new T.SphereGeometry(0.05, 10, 8);
      for (let i = 0; i < 22; i++) {
        const a = -Math.PI * 0.95 + (i / 21) * Math.PI * 1.9; // leaves a gap at the front
        const l = new T.Mesh(leaf, gold);
        const r = 0.44;
        l.position.set(Math.sin(a + Math.PI) * r, 0, Math.cos(a + Math.PI) * r);
        l.scale.set(0.55, 0.3, 1.5);
        l.rotation.set(0.6 * (i % 2 ? 1 : -1), a + Math.PI, 0);
        wreath.add(l);
      }
      wreath.position.y = 0.3;
      wreath.rotation.x = -0.25;
      acc.add(wreath);
    } else if (id === 'cosmos') {
      const helmet = new T.Mesh(new T.SphereGeometry(0.8, 40, 30), new T.MeshPhysicalMaterial({
        color: '#ffffff', transparent: true, opacity: 0.14, roughness: 0.02, clearcoat: 1, depthWrite: false,
      }));
      const collar = new T.Mesh(new T.TorusGeometry(0.46, 0.06, 12, 48), accent);
      collar.rotation.x = Math.PI / 2;
      collar.position.y = -0.52;
      const moon = new T.Mesh(new T.SphereGeometry(0.075, 18, 14), new T.MeshStandardMaterial({ color: '#b9b6c9', roughness: 0.9 }));
      acc.add(helmet, collar, moon);
      accUpdate = (dt, t) => { moon.position.set(Math.cos(t * 0.9) * 1.1, Math.sin(t * 0.6) * 0.25, Math.sin(t * 0.9) * 1.1); };
    }
  }

  function setSkin(id) {
    const c = SKINS[id] || SKINS.neural;
    skin.color.set(c.skin); skin.roughness = c.rough;
    accent.color.set(c.accent);
    eyeMat.color.set(c.eye);
    visorMat.color.set(c.visor);
    glow.material.color.set(c.glow); glow.material.opacity = c.glowOp;
    const g = c.eyeShape === 'pixel' ? pixel : capsule;
    eyeL.geometry = g; eyeR.geometry = g;
    costume(id, c);
    state.spin = 1;
  }

  function update(dt, t, { lookAt, talking, reduced }) {
    // face the visitor, leaning toward the pointer
    state.dummy.position.copy(root.position);
    state.dummy.lookAt(lookAt);
    root.quaternion.slerp(state.dummy.quaternion, damp(dt, 5));

    const bob = reduced ? 0 : Math.sin(t * 1.6) * 0.08;
    body.position.y = bob;
    state.swoop *= Math.exp(-dt * 3);
    body.rotation.x = state.swoop * 0.5 + (reduced ? 0 : Math.sin(t * 0.8) * 0.04);
    body.rotation.z = reduced ? 0 : Math.sin(t * 0.7) * 0.05;
    if (state.spin > 0) {
      state.spin = Math.max(0, state.spin - dt * 1.4);
      const e = 1 - state.spin;
      body.rotation.y = (1 - (1 - e) ** 3) * Math.PI * 2;
    } else body.rotation.y = 0;

    // blink
    state.blinkIn -= dt;
    if (state.blinkIn <= 0) { state.blink = 0.16; state.blinkIn = 2.2 + Math.random() * 3.2; }
    let eyeY = 1;
    if (state.blink > 0) { state.blink -= dt; eyeY = 0.12; }
    eyeL.scale.y = eyeR.scale.y = eyeY;

    mouth.scale.y = talking ? 0.4 + Math.abs(Math.sin(t * 17)) * 1.1 : 1;
    tip.scale.setScalar(1 + Math.sin(t * 4) * 0.15);

    handL.position.set(-0.72, -0.2 + Math.sin(t * 1.6 + 1.2) * 0.05, 0.08);
    if (state.wave > 0) {
      state.wave -= dt;
      handR.position.set(0.7 + Math.sin(t * 14) * 0.07, 0.22, 0.12);
    } else handR.position.set(0.72, -0.2 + Math.sin(t * 1.6 + 2.4) * 0.05, 0.08);

    accUpdate && accUpdate(dt, t);
  }

  return {
    root,
    setSkin,
    update,
    wave: (s = 1.6) => { state.wave = s; },
    swoop: (d = 1) => { state.swoop = 0.9 * d; },
  };
}
