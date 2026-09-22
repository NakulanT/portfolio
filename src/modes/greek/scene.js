// A turning marble column beside a spinning amphora, with drifting golden light motes.
export function buildGreekScene({ T, scene, camera, pointer, readVar }) {
  camera.position.set(0, 0.4, 7.6);

  const colors = {};
  const read = () => {
    colors.marble = new T.Color(readVar('--gr-marble', '#f2ede1'));
    colors.ink = new T.Color(readVar('--gr-ink', '#1c2a3a'));
    colors.gold = new T.Color(readVar('--gr-gold', '#c9a24b'));
    colors.terra = new T.Color(readVar('--gr-terra', '#af5a3e'));
  };
  read();

  scene.add(new T.AmbientLight(0xffffff, 1));
  const sun = new T.DirectionalLight(0xffffff, 1.1);
  sun.position.set(4, 6, 4);
  scene.add(sun);
  const fill = new T.DirectionalLight(0xffffff, 0.35);
  fill.position.set(-4, 1, -3);
  scene.add(fill);

  const marbleMat = new T.MeshStandardMaterial({ roughness: 0.35, metalness: 0.05 });
  const potMat = new T.MeshStandardMaterial({ roughness: 0.45, metalness: 0.1 });

  // ---- Doric column via Lathe ----
  const colPts = [
    new T.Vector2(0, 0), new T.Vector2(0.62, 0), new T.Vector2(0.62, 0.1), new T.Vector2(0.5, 0.14),
    new T.Vector2(0.44, 0.16), new T.Vector2(0.4, 2.6), new T.Vector2(0.46, 2.66), new T.Vector2(0.46, 2.78),
    new T.Vector2(0.6, 2.84), new T.Vector2(0.6, 2.98), new T.Vector2(0, 2.98),
  ];
  const column = new T.Mesh(new T.LatheGeometry(colPts, 28), marbleMat);
  column.position.set(-1.9, -1.5, 0);
  scene.add(column);
  // fluting hint: thin vertical grooves via a wireframe overlay
  const flute = new T.Mesh(new T.CylinderGeometry(0.41, 0.41, 2.5, 20, 1, true), new T.MeshBasicMaterial({ transparent: true, opacity: 0.12, wireframe: true }));
  flute.position.set(-1.9, -0.05, 0);
  scene.add(flute);

  // ---- amphora via Lathe ----
  const potPts = [
    new T.Vector2(0, -1.3), new T.Vector2(0.32, -1.28), new T.Vector2(0.4, -1.1), new T.Vector2(0.3, -0.8),
    new T.Vector2(0.5, -0.3), new T.Vector2(0.58, 0.2), new T.Vector2(0.42, 0.7), new T.Vector2(0.3, 1.0),
    new T.Vector2(0.34, 1.2), new T.Vector2(0.22, 1.3), new T.Vector2(0, 1.32),
  ];
  const amphora = new T.Mesh(new T.LatheGeometry(potPts, 32), potMat);
  amphora.scale.setScalar(0.85);
  amphora.position.set(1.9, -0.1, 0.3);
  scene.add(amphora);

  // laurel-ish ring of small leaves around the amphora neck
  const leafGeo = new T.SphereGeometry(0.07, 6, 6);
  const leafMat = new T.MeshStandardMaterial({ roughness: 0.5 });
  const leaves = new T.InstancedMesh(leafGeo, leafMat, 14);
  scene.add(leaves);
  const dummy = new T.Object3D();
  for (let i = 0; i < 14; i += 1) {
    const a = (i / 14) * Math.PI * 2;
    dummy.position.set(1.9 + Math.cos(a) * 0.62, 0.55, 0.3 + Math.sin(a) * 0.62);
    dummy.scale.setScalar(0.9 + Math.sin(a * 3) * 0.2);
    dummy.updateMatrix();
    leaves.setMatrixAt(i, dummy.matrix);
  }

  // ---- golden motes ----
  const M = 60;
  const moteGeo = new T.SphereGeometry(0.02, 6, 6);
  const moteMat = new T.MeshBasicMaterial({ transparent: true, opacity: 0.8 });
  const motes = new T.InstancedMesh(moteGeo, moteMat, M);
  scene.add(motes);
  const moteState = Array.from({ length: M }, () => ({
    a: Math.random() * Math.PI * 2, r: 2 + Math.random() * 3.4, y: (Math.random() - 0.5) * 3.2, speed: 0.06 + Math.random() * 0.12,
  }));

  const applyColors = () => {
    read();
    marbleMat.color.copy(colors.marble);
    potMat.color.copy(colors.terra);
    leafMat.color.copy(colors.gold);
    moteMat.color.copy(colors.gold);
    flute.material.color.copy(colors.ink);
  };
  applyColors();

  const update = (dt, t) => {
    column.rotation.y += dt * 0.12;
    flute.rotation.y += dt * 0.12;
    amphora.rotation.y += dt * 0.22;
    leaves.rotation.y += dt * 0.22;
    camera.position.x = pointer.x * 0.7;
    camera.position.y = 0.4 - pointer.y * 0.3;
    camera.lookAt(0, 0, 0);

    moteState.forEach((m, i) => {
      m.a += dt * m.speed;
      dummy.position.set(Math.cos(m.a) * m.r, m.y + Math.sin(t * 0.5 + i) * 0.15, Math.sin(m.a) * m.r - 1);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      motes.setMatrixAt(i, dummy.matrix);
    });
    motes.instanceMatrix.needsUpdate = true;
  };

  return { update, onTheme: applyColors };
}
