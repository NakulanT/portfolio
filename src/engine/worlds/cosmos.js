// Cosmos: a small solar system. Every stop is a planet on its own slow orbit, so the
// camera keeps chasing it; nebulae glow behind an asteroid belt.
import { glowSprite, glowTexture, rng } from '../util';

const PALETTES = [
  ['#3a7bd5', '#6fd3ff', '#1c3f78'], ['#e0785a', '#f2c29b', '#8a3d2c'], ['#8b5cff', '#d0b8ff', '#3b1f7a'],
  ['#2fbf9b', '#b5ffe4', '#11574a'], ['#e4b75a', '#fff0c2', '#8c6420'], ['#ff5fa2', '#ffd1e4', '#7a1f48'],
  ['#5a6be0', '#c7ceff', '#232c7a'], ['#c9ced6', '#ffffff', '#6d737d'],
];

function planetTexture(T, pal, R) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = pal[0];
  g.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 46; i++) {
    const y = R() * 256, h = 3 + R() * 26;
    g.globalAlpha = 0.18 + R() * 0.4;
    g.fillStyle = pal[Math.floor(R() * 3)];
    g.fillRect(0, y, 512, h);
  }
  for (let i = 0; i < 90; i++) {
    g.globalAlpha = 0.12 + R() * 0.2;
    g.fillStyle = pal[1];
    g.beginPath();
    g.ellipse(R() * 512, R() * 256, 4 + R() * 30, 2 + R() * 7, 0, 0, Math.PI * 2);
    g.fill();
  }
  const tex = new T.CanvasTexture(c);
  tex.colorSpace = T.SRGBColorSpace;
  return tex;
}

export function buildCosmos(T, { root, scene, count }) {
  scene.background = new T.Color('#020108');
  scene.environmentIntensity = 0.25;
  root.add(new T.AmbientLight('#6b5fa8', 0.35));
  const sunLight = new T.PointLight('#fff1d6', 3.2, 0, 0);
  root.add(sunLight);

  const R = rng(21);

  // starfield
  const S = 2500;
  const sp = new Float32Array(S * 3), sc = new Float32Array(S * 3);
  const tint = new T.Color();
  for (let i = 0; i < S; i++) {
    const u = R() * 2 - 1, th = R() * Math.PI * 2, r = 380 + R() * 120, s = Math.sqrt(1 - u * u);
    sp[i * 3] = Math.cos(th) * s * r; sp[i * 3 + 1] = u * r; sp[i * 3 + 2] = Math.sin(th) * s * r;
    tint.setHSL(0.55 + R() * 0.25, 0.6, 0.75 + R() * 0.25);
    sc[i * 3] = tint.r; sc[i * 3 + 1] = tint.g; sc[i * 3 + 2] = tint.b;
  }
  const sg = new T.BufferGeometry();
  sg.setAttribute('position', new T.BufferAttribute(sp, 3));
  sg.setAttribute('color', new T.BufferAttribute(sc, 3));
  const stars = new T.Points(sg, new T.PointsMaterial({ size: 1.6, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: 0.9 }));
  root.add(stars);

  // nebulae
  [['#6a2cff', -180, 60, -260, 260], ['#ff3e9d', 220, -40, -200, 220], ['#1fd1ff', 60, 120, 260, 240], ['#7b2cff', -260, -80, 160, 200]].forEach(([c, x, y, z, s]) => {
    const n = glowSprite(T, c, s, 0.22);
    n.position.set(x, y, z);
    root.add(n);
  });

  // the sun
  const sun = new T.Mesh(new T.SphereGeometry(6, 48, 32), new T.MeshBasicMaterial({ color: '#ffd27a' }));
  const corona = glowSprite(T, '#ffb347', 46, 0.9);
  const corona2 = glowSprite(T, '#ff6a3d', 60, 0.35);
  root.add(sun, corona, corona2);

  // planets
  const planets = [];
  for (let i = 0; i < count; i++) {
    const pal = PALETTES[i % PALETTES.length];
    const radius = 1.2 + R() * 1.5 + (i % 4 === 0 ? 0.6 : 0);
    const orbit = 18 + i * 7.5;
    const pivot = new T.Group();
    const planet = new T.Mesh(new T.SphereGeometry(radius, 48, 32), new T.MeshStandardMaterial({ map: planetTexture(T, pal, R), roughness: 0.85 }));
    planet.rotation.z = 0.3 * (R() - 0.5);
    pivot.add(planet);
    const atmo = glowSprite(T, pal[1], radius * 3.4, 0.18);
    pivot.add(atmo);
    if (i % 3 === 1) {
      const ring = new T.Mesh(new T.RingGeometry(radius * 1.45, radius * 2.3, 72), new T.MeshBasicMaterial({ color: pal[1], transparent: true, opacity: 0.45, side: T.DoubleSide }));
      ring.rotation.x = Math.PI / 2 - 0.35;
      pivot.add(ring);
    }
    let moon = null;
    if (i % 2 === 0) {
      moon = new T.Mesh(new T.SphereGeometry(radius * 0.22, 20, 14), new T.MeshStandardMaterial({ color: '#b8b3c8', roughness: 1 }));
      pivot.add(moon);
    }
    // faint orbit line
    const og = new T.BufferGeometry().setFromPoints(new T.EllipseCurve(0, 0, orbit, orbit).getPoints(160).map((p) => new T.Vector3(p.x, 0, p.y)));
    root.add(new T.LineLoop(og, new T.LineBasicMaterial({ color: '#8b7cff', transparent: true, opacity: 0.12 })));
    root.add(pivot);
    planets.push({ pivot, planet, moon, radius, orbit, phase: i * 2.1, speed: 0.012 / (1 + i * 0.12) });
  }

  // asteroid belt
  const AN = 450;
  const belt = new T.InstancedMesh(new T.IcosahedronGeometry(0.28, 0), new T.MeshStandardMaterial({ color: '#8a8198', roughness: 1, flatShading: true }), AN);
  const m4 = new T.Matrix4(), q = new T.Quaternion(), p = new T.Vector3(), s = new T.Vector3(), e = new T.Euler();
  const beltR = 18 + count * 7.5 + 8;
  for (let i = 0; i < AN; i++) {
    const a = R() * Math.PI * 2, r = beltR + (R() - 0.5) * 10;
    p.set(Math.cos(a) * r, (R() - 0.5) * 2, Math.sin(a) * r);
    q.setFromEuler(e.set(R() * 3, R() * 3, R() * 3));
    s.setScalar(0.4 + R() * 1.6);
    belt.setMatrixAt(i, m4.compose(p, q, s));
  }
  root.add(belt);

  // drifting dust near the camera for a sense of speed
  const D = 200;
  const dp = new Float32Array(D * 3);
  for (let i = 0; i < D; i++) { dp[i * 3] = (R() - 0.5) * 200; dp[i * 3 + 1] = (R() - 0.5) * 60; dp[i * 3 + 2] = (R() - 0.5) * 200; }
  const dg = new T.BufferGeometry(); dg.setAttribute('position', new T.BufferAttribute(dp, 3));
  root.add(new T.Points(dg, new T.PointsMaterial({ size: 0.3, map: glowTexture(T), color: '#b69cff', transparent: true, opacity: 0.6, blending: T.AdditiveBlending, depthWrite: false })));

  let time = 0;
  const placePlanets = () => planets.forEach((pl) => {
    const a = pl.phase + time * pl.speed;
    pl.pivot.position.set(Math.cos(a) * pl.orbit, 0, Math.sin(a) * pl.orbit);
  });
  placePlanets();

  function update(dt, t) {
    time = t;
    placePlanets();
    sun.rotation.y += dt * 0.05;
    corona.material.opacity = 0.85 + Math.sin(t * 2) * 0.08;
    belt.rotation.y += dt * 0.006;
    stars.rotation.y += dt * 0.002;
    planets.forEach((pl, i) => {
      pl.planet.rotation.y += dt * (0.12 + i * 0.01);
      if (pl.moon) pl.moon.position.set(Math.cos(t * 0.7 + i) * pl.radius * 2.4, Math.sin(t * 0.5) * pl.radius * 0.4, Math.sin(t * 0.7 + i) * pl.radius * 2.4);
    });
  }

  const v = new T.Vector3(), out = new T.Vector3(), side = new T.Vector3(), up = new T.Vector3(0, 1, 0);
  return {
    stop(i) {
      const pl = planets[i];
      v.copy(pl.pivot.position);
      out.copy(v).normalize();
      side.crossVectors(up, out).normalize();
      const r = pl.radius;
      const cam = v.clone().addScaledVector(out, r * 4.6).addScaledVector(side, -r * 2.4).addScaledVector(up, r * 1.2);
      // aim past the planet so it sits left of centre, clear of the hologram panel
      const look = v.clone().addScaledVector(side, r * 2.1);
      return { cam: cam.toArray(), look: look.toArray() };
    },
    overview: () => ({ cam: [0, 90, 150], look: [0, 0, 10] }),
    update,
  };
}
