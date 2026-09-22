// A torii gate on still water at dusk, with sakura petals drifting down and a glowing sun disc.
export function buildJapaneseScene({ T, scene, camera, pointer, readVar }) {
  camera.position.set(0, 1.1, 7.2);
  camera.lookAt(0, 1.6, 0);

  const colors = {};
  const read = () => {
    colors.vermillion = new T.Color(readVar('--jp-accent', '#c1272d'));
    colors.ink = new T.Color(readVar('--jp-ink', '#181410'));
    colors.gold = new T.Color(readVar('--jp-gold', '#c9a24b'));
    colors.paper = new T.Color(readVar('--jp-paper', '#efe7d8'));
    colors.mist = new T.Color(readVar('--jp-mist', '#efe7d8'));
  };
  read();

  scene.fog = new T.Fog(colors.mist.getHex(), 6, 16);
  scene.add(new T.AmbientLight(0xffffff, 0.9));
  const rim = new T.DirectionalLight(0xffffff, 0.7);
  rim.position.set(-3, 4, 2);
  scene.add(rim);

  // ---- sun disc ----
  const sun = new T.Mesh(new T.CircleGeometry(1.7, 48), new T.MeshBasicMaterial({ transparent: true, opacity: 0.9 }));
  sun.position.set(0, 2.1, -6);
  scene.add(sun);
  const sunGlow = new T.Mesh(new T.CircleGeometry(2.4, 48), new T.MeshBasicMaterial({ transparent: true, opacity: 0.18 }));
  sunGlow.position.copy(sun.position);
  sunGlow.position.z += 0.02;
  scene.add(sunGlow);

  // ---- water plane ----
  const water = new T.Mesh(new T.PlaneGeometry(30, 30, 1, 1), new T.MeshBasicMaterial({ transparent: true, opacity: 0.5 }));
  water.rotation.x = -Math.PI / 2;
  water.position.y = -0.5;
  scene.add(water);
  const grid = new T.GridHelper(30, 40, 0x000000, 0x000000);
  grid.material.transparent = true;
  grid.material.opacity = 0.05;
  grid.position.y = -0.49;
  scene.add(grid);

  // ---- torii gate ----
  const toriiMat = new T.MeshStandardMaterial({ roughness: 0.55 });
  const capMat = new T.MeshStandardMaterial({ roughness: 0.4 });
  const torii = new T.Group();
  const pillarGeo = new T.CylinderGeometry(0.14, 0.17, 3.4, 12);
  const pL = new T.Mesh(pillarGeo, toriiMat); pL.position.set(-1.65, 1.2, 0);
  const pR = new T.Mesh(pillarGeo, toriiMat); pR.position.set(1.65, 1.2, 0);
  const kasagi = new T.Mesh(new T.BoxGeometry(4.1, 0.24, 0.34), capMat); kasagi.position.set(0, 3.02, 0);
  const kasagiCurve = new T.Mesh(new T.CylinderGeometry(0.17, 0.17, 4.3, 8), capMat);
  kasagiCurve.rotation.z = Math.PI / 2; kasagiCurve.position.set(0, 3.18, 0);
  const shimaki = new T.Mesh(new T.BoxGeometry(3.9, 0.15, 0.26), capMat); shimaki.position.set(0, 2.78, 0);
  const nuki = new T.Mesh(new T.BoxGeometry(3.6, 0.18, 0.2), toriiMat); nuki.position.set(0, 2.15, 0);
  const gaku = new T.Mesh(new T.BoxGeometry(0.55, 0.55, 0.06), capMat); gaku.position.set(0, 2.5, 0.14);
  torii.add(pL, pR, kasagi, kasagiCurve, shimaki, nuki, gaku);
  scene.add(torii);

  const applyColors = () => {
    read();
    scene.fog.color.copy(colors.mist);
    sun.material.color.copy(colors.gold);
    sunGlow.material.color.copy(colors.gold);
    water.material.color.copy(colors.mist);
    toriiMat.color.copy(colors.vermillion);
    capMat.color.copy(colors.ink);
  };
  applyColors();

  // ---- sakura petals ----
  const N = 90;
  const petalGeo = new T.PlaneGeometry(0.09, 0.09);
  const petalMat = new T.MeshBasicMaterial({ transparent: true, opacity: 0.92, side: T.DoubleSide });
  const petals = new T.InstancedMesh(petalGeo, petalMat, N);
  scene.add(petals);
  const dummy = new T.Object3D();
  const state = Array.from({ length: N }, () => ({
    x: (Math.random() - 0.5) * 14,
    y: Math.random() * 8,
    z: (Math.random() - 0.5) * 10 - 1,
    speed: 0.25 + Math.random() * 0.4,
    drift: (Math.random() - 0.5) * 0.6,
    spin: Math.random() * Math.PI,
    spinSpeed: (Math.random() - 0.5) * 2,
    sway: Math.random() * Math.PI * 2,
  }));
  const paint = () => {
    petalMat.color.copy(colors.vermillion).lerp(new T.Color(0xffffff), 0.35);
  };
  paint();

  let t0 = 0;
  const update = (dt, t) => {
    t0 = t;
    camera.position.x = Math.sin(t * 0.06) * 0.8 + pointer.x * 0.5;
    camera.position.y = 1.1 + pointer.y * -0.2;
    camera.lookAt(0, 1.6, -1);
    sun.material.opacity = 0.85 + Math.sin(t * 0.6) * 0.05;

    state.forEach((p, i) => {
      p.y -= p.speed * dt;
      p.sway += dt;
      if (p.y < -0.6) { p.y = 8; p.x = (Math.random() - 0.5) * 14; }
      p.spin += p.spinSpeed * dt;
      dummy.position.set(p.x + Math.sin(p.sway) * 0.6, p.y, p.z);
      dummy.rotation.set(p.spin * 0.6, p.spin, p.spin * 0.4);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      petals.setMatrixAt(i, dummy.matrix);
    });
    petals.instanceMatrix.needsUpdate = true;
  };

  return { update, onTheme: applyColors };
}
