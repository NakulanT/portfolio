// Olympus: a circular marble agora at golden hour. Each stop is a plinth carrying a
// golden Platonic solid; the camera walks the ring inside a peristyle of fluted columns,
// around a floating golden dodecahedron.
import { gradientTexture, glowSprite, glowTexture, rng } from '../util';

const RING = 15;

export function buildOlympus(T, { root, scene, count }) {
  scene.background = gradientTexture(T, [[0, '#2f3b6e'], [0.35, '#8a6f92'], [0.58, '#e7a86b'], [0.7, '#f8d9a2'], [1, '#e9c595']]);
  scene.fog = new T.Fog('#efc79a', 34, 150);
  scene.environmentIntensity = 0.45;
  root.add(new T.HemisphereLight('#ffe3b8', '#6a5a4a', 0.55));
  const sunL = new T.DirectionalLight('#ffc98a', 2.1);
  sunL.position.set(-30, 14, -40);
  root.add(sunL);
  const fill = new T.DirectionalLight('#9fb2ff', 0.35);
  fill.position.set(20, 10, 30);
  root.add(fill);

  const marble = new T.MeshStandardMaterial({ color: '#e4d9c6', roughness: 0.5, metalness: 0.02 });
  const marbleShade = new T.MeshStandardMaterial({ color: '#d2c5ae', roughness: 0.55, flatShading: true });
  const gold = new T.MeshStandardMaterial({ color: '#e0b458', metalness: 1, roughness: 0.22, emissive: '#6b4a10', emissiveIntensity: 0.25 });

  // stepped platform
  [[31, 1.2, -0.6], [33, 1.2, -1.8], [35.5, 1.2, -3]].forEach(([r, h, y]) => {
    const m = new T.Mesh(new T.CylinderGeometry(r, r + 0.4, h, 96), marble);
    m.position.y = y;
    root.add(m);
  });
  const sea = new T.Mesh(new T.PlaneGeometry(700, 700), new T.MeshStandardMaterial({ color: '#b98d63', roughness: 1 }));
  sea.rotation.x = -Math.PI / 2;
  sea.position.y = -3.6;
  root.add(sea);

  // peristyle columns (flat-shaded 20-sided shafts read as fluting)
  const CN = 30, CR = 26;
  const shaft = new T.InstancedMesh(new T.CylinderGeometry(0.62, 0.75, 9, 20), marbleShade, CN);
  const echinus = new T.InstancedMesh(new T.CylinderGeometry(0.95, 0.68, 0.4, 20), marble, CN);
  const abacus = new T.InstancedMesh(new T.BoxGeometry(2, 0.35, 2), marble, CN);
  const plinthC = new T.InstancedMesh(new T.CylinderGeometry(0.95, 1, 0.3, 20), marble, CN);
  const m4 = new T.Matrix4();
  for (let i = 0; i < CN; i++) {
    const a = (i / CN) * Math.PI * 2, x = Math.cos(a) * CR, z = Math.sin(a) * CR;
    shaft.setMatrixAt(i, m4.makeTranslation(x, 4.8, z));
    echinus.setMatrixAt(i, m4.makeTranslation(x, 9.5, z));
    abacus.setMatrixAt(i, m4.makeRotationY(-a).setPosition(x, 9.87, z));
    plinthC.setMatrixAt(i, m4.makeTranslation(x, 0.15, z));
  }
  root.add(shaft, echinus, abacus, plinthC);
  const archi = new T.Mesh(new T.CylinderGeometry(CR + 1.1, CR + 1.1, 1.3, 96, 1, true), new T.MeshStandardMaterial({ color: '#eadfcd', roughness: 0.5, side: T.DoubleSide }));
  archi.position.y = 10.7;
  const frieze = new T.Mesh(new T.CylinderGeometry(CR + 1.3, CR + 1.3, 0.35, 96, 1, true), new T.MeshStandardMaterial({ color: '#b5653f', roughness: 0.6, side: T.DoubleSide }));
  frieze.position.y = 11.5;
  const cornice = new T.Mesh(new T.CylinderGeometry(CR + 1.8, CR + 1.5, 0.45, 96, 1, true), new T.MeshStandardMaterial({ color: '#eadfcd', roughness: 0.5, side: T.DoubleSide }));
  cornice.position.y = 11.9;
  root.add(archi, frieze, cornice);

  // the centrepiece
  const altar = new T.Mesh(new T.CylinderGeometry(3, 3.5, 1.6, 8), marbleShade);
  altar.position.y = 0.8;
  const altar2 = new T.Mesh(new T.CylinderGeometry(2.2, 2.6, 0.8, 8), marble);
  altar2.position.y = 2;
  const idea = new T.Mesh(new T.DodecahedronGeometry(2.2, 0), gold);
  idea.position.y = 7;
  const cage = new T.LineSegments(new T.EdgesGeometry(new T.IcosahedronGeometry(3.6, 0)), new T.LineBasicMaterial({ color: '#ffe2a0', transparent: true, opacity: 0.6 }));
  cage.position.y = 7;
  const ideaGlow = glowSprite(T, '#ffcf70', 14, 0.3);
  ideaGlow.position.y = 7;
  root.add(altar, altar2, idea, cage, ideaGlow);

  // plinths with golden solids
  const solids = [
    new T.TetrahedronGeometry(0.72), new T.OctahedronGeometry(0.66), new T.BoxGeometry(0.85, 0.85, 0.85),
    new T.DodecahedronGeometry(0.6), new T.IcosahedronGeometry(0.62),
  ];
  const stops = [];
  for (let i = 0; i < count; i++) {
    const a = Math.PI / 2 - (i / count) * Math.PI * 2;
    const x = Math.cos(a) * RING, z = Math.sin(a) * RING;
    const g = new T.Group();
    g.position.set(x, 0, z);
    g.rotation.y = -a + Math.PI / 2;
    const base = new T.Mesh(new T.BoxGeometry(1.5, 0.25, 1.5), marble); base.position.y = 0.12;
    const die = new T.Mesh(new T.BoxGeometry(1.15, 1.3, 1.15), marbleShade); die.position.y = 0.9;
    const top = new T.Mesh(new T.BoxGeometry(1.5, 0.2, 1.5), marble); top.position.y = 1.65;
    const mat = gold.clone();
    const solid = new T.Mesh(solids[i % solids.length], mat); solid.position.y = 2.6;
    const halo = glowSprite(T, '#ffd27a', 4, 0.0); halo.position.y = 2.6;
    const shaftLight = new T.Mesh(new T.CylinderGeometry(0.6, 1.4, 14, 20, 1, true), new T.MeshBasicMaterial({
      color: '#ffe3a6', transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide,
    }));
    shaftLight.position.y = 8.5;
    g.add(base, die, top, solid, halo, shaftLight);
    root.add(g);
    stops.push({ a, x, z, solid, mat, halo, shaftLight });
  }

  // cypress trees outside the ring
  const R = rng(5);
  const cyp = new T.InstancedMesh(new T.ConeGeometry(1.2, 9, 8), new T.MeshStandardMaterial({ color: '#34452c', roughness: 1, flatShading: true }), 26);
  for (let i = 0; i < 26; i++) {
    const a = R() * Math.PI * 2, r = 42 + R() * 30;
    cyp.setMatrixAt(i, m4.makeTranslation(Math.cos(a) * r, 1.2, Math.sin(a) * r));
  }
  root.add(cyp);

  const sun = glowSprite(T, '#ffb050', 90, 0.7);
  sun.position.set(-110, 18, -150);
  const sunDisc = new T.Mesh(new T.CircleGeometry(9, 40), new T.MeshBasicMaterial({ color: '#fff0c8', fog: false }));
  sunDisc.position.set(-110, 18, -151);
  sunDisc.lookAt(0, 4, 0);
  root.add(sun, sunDisc);

  // golden motes
  const M = 500;
  const mp = new Float32Array(M * 3);
  for (let i = 0; i < M; i++) {
    const a = R() * Math.PI * 2, r = 3 + R() * 24;
    mp[i * 3] = Math.cos(a) * r; mp[i * 3 + 1] = R() * 12; mp[i * 3 + 2] = Math.sin(a) * r;
  }
  const mg = new T.BufferGeometry(); mg.setAttribute('position', new T.BufferAttribute(mp, 3));
  const motes = new T.Points(mg, new T.PointsMaterial({ size: 0.16, map: glowTexture(T), color: '#ffd88a', transparent: true, blending: T.AdditiveBlending, depthWrite: false }));
  root.add(motes);

  function update(dt, t, { stop, gate }) {
    idea.rotation.y += dt * 0.25; idea.rotation.x += dt * 0.12;
    idea.position.y = 7 + Math.sin(t * 0.8) * 0.3;
    cage.rotation.y -= dt * 0.1; cage.rotation.z += dt * 0.05;
    motes.rotation.y += dt * 0.02;
    stops.forEach((s, i) => {
      const cur = i === stop && !gate;
      s.solid.rotation.y += dt * (cur ? 1.1 : 0.35);
      s.solid.rotation.x = Math.sin(t * 0.5 + i) * 0.4;
      s.solid.position.y = 2.6 + Math.sin(t * 1.2 + i) * 0.1;
      const k = Math.min(1, dt * 3);
      s.mat.emissiveIntensity += ((cur ? 0.9 : 0.2) - s.mat.emissiveIntensity) * k;
      s.halo.material.opacity += ((cur ? 0.55 : 0) - s.halo.material.opacity) * k;
      s.shaftLight.material.opacity += ((cur ? 0.045 : 0) - s.shaftLight.material.opacity) * k;
    });
  }

  return {
    stop(i) {
      const s = stops[i];
      // look below the plinth so its golden solid sits in the upper third, above the tablet
      const ca = s.a + 0.15, r = 23.5;
      return {
        cam: [Math.cos(ca) * r, 4.2, Math.sin(ca) * r],
        look: [s.x * 0.92, 1.1, s.z * 0.92],
      };
    },
    overview: () => ({ cam: [0, 9, 42], look: [0, 5, 0] }),
    update,
  };
}
