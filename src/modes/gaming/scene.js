// A spinning arcade coin over a scrolling starfield, orbited by blocky "power-up" cubes.
export function buildGamingScene({ T, scene, camera, pointer, readVar }) {
  camera.position.set(0, 0, 8);

  const colors = {};
  const read = () => {
    colors.p1 = new T.Color(readVar('--g-accent', '#ff2d95'));
    colors.p2 = new T.Color(readVar('--g-accent-2', '#00f0ff'));
    colors.p3 = new T.Color(readVar('--g-gold', '#ffd23f'));
    colors.dim = new T.Color(readVar('--g-text-3', '#6b6b8f'));
  };
  read();

  scene.add(new T.AmbientLight(0xffffff, 0.7));
  const key = new T.PointLight(0xffffff, 6, 20);
  key.position.set(3, 2, 5);
  scene.add(key);

  // ---- starfield ----
  const S = 500;
  const starGeo = new T.BufferGeometry();
  const starPos = new Float32Array(S * 3);
  for (let i = 0; i < S; i += 1) {
    starPos[i * 3] = (Math.random() - 0.5) * 30;
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 30;
    starPos[i * 3 + 2] = Math.random() * -40;
  }
  starGeo.setAttribute('position', new T.BufferAttribute(starPos, 3));
  const stars = new T.Points(starGeo, new T.PointsMaterial({ size: 0.05, transparent: true, opacity: 0.9 }));
  scene.add(stars);

  // ---- coin ----
  const coin = new T.Group();
  const coinMat = new T.MeshStandardMaterial({ metalness: 0.75, roughness: 0.22, emissiveIntensity: 0.35 });
  const face = new T.Mesh(new T.CylinderGeometry(1.15, 1.15, 0.22, 32), coinMat);
  face.rotation.z = Math.PI / 2;
  const ringGeo = new T.TorusGeometry(0.85, 0.05, 8, 32);
  const ring = new T.Mesh(ringGeo, coinMat);
  ring.rotation.y = Math.PI / 2;
  const star = new T.Mesh(new T.OctahedronGeometry(0.42, 0), new T.MeshStandardMaterial({ metalness: 0.6, roughness: 0.15 }));
  star.rotation.z = Math.PI / 2;
  coin.add(face, ring, star);
  scene.add(coin);

  // ---- orbiting blocks ----
  const blockMat = new T.MeshStandardMaterial({ roughness: 0.4, metalness: 0.15 });
  const blocks = Array.from({ length: 6 }, (_, i) => {
    const b = new T.Mesh(new T.BoxGeometry(0.42, 0.42, 0.42), blockMat.clone());
    b.userData = { r: 2.6 + (i % 3) * 0.5, a: (i / 6) * Math.PI * 2, speed: 0.35 + (i % 3) * 0.12, y: (Math.random() - 0.5) * 1.6 };
    scene.add(b);
    return b;
  });

  const applyColors = () => {
    read();
    coinMat.color.copy(colors.p3);
    coinMat.emissive.copy(colors.p3).multiplyScalar(0.3);
    stars.material.color.copy(colors.dim);
    blocks.forEach((b, i) => b.material.color.copy(i % 2 ? colors.p1 : colors.p2));
    blocks.forEach((b) => { b.material.emissive.copy(b.material.color).multiplyScalar(0.25); });
  };
  applyColors();

  const update = (dt, t) => {
    coin.rotation.y += dt * 2.4;
    coin.position.y = Math.sin(t * 1.1) * 0.25;
    camera.position.x = pointer.x * 0.9;
    camera.position.y = -pointer.y * 0.5;
    camera.lookAt(0, 0, 0);

    const pos = stars.geometry.attributes.position;
    for (let i = 0; i < S; i += 1) {
      let z = pos.array[i * 3 + 2] + dt * 6;
      if (z > 6) z = -40;
      pos.array[i * 3 + 2] = z;
    }
    pos.needsUpdate = true;

    blocks.forEach((b) => {
      b.userData.a += dt * b.userData.speed;
      b.position.set(Math.cos(b.userData.a) * b.userData.r, b.userData.y + Math.sin(t * 1.4 + b.userData.a) * 0.15, Math.sin(b.userData.a) * b.userData.r - 1);
      b.rotation.x += dt * 0.8;
      b.rotation.y += dt * 1.1;
    });
  };

  return { update, onTheme: applyColors };
}
