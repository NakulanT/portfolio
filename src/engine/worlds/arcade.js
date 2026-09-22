// Arcade: a synthwave highway at night. Each stop is a glowing arcade cabinet by the
// road; a striped sun sinks behind wireframe mountains and voxel invaders march overhead.
import { gradientTexture, glowSprite, rng } from '../util';

const NEON = ['#ff2bd6', '#22e1ff', '#ffe066', '#7cff4f', '#ff6b3d', '#a67cff'];
const GAP = 16;

const INVADER = [
  '..X.....X..',
  '...X...X...',
  '..XXXXXXX..',
  '.XX.XXX.XX.',
  'XXXXXXXXXXX',
  'X.XXXXXXX.X',
  'X.X.....X.X',
  '...XX.XX...',
];

export function buildArcade(T, { root, scene, count }) {
  scene.background = gradientTexture(T, [[0, '#05010f'], [0.45, '#1c0536'], [0.62, '#4a0a5e'], [0.72, '#ff2d95'], [1, '#12002a']]);
  scene.fog = new T.Fog('#2a0640', 18, 120);
  scene.environmentIntensity = 0.6;
  root.add(new T.HemisphereLight('#ff7ce8', '#12002a', 0.9));
  const key = new T.DirectionalLight('#ffd1f5', 0.8);
  key.position.set(0, 10, 10);
  root.add(key);

  const len = count * GAP + 260;
  const zMid = -len / 2 + 60;

  // glowing grid floor
  const floorMat = new T.ShaderMaterial({
    uniforms: { uCam: { value: new T.Vector3() }, uFog: { value: new T.Color('#2a0640') } },
    vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }',
    fragmentShader: `
      uniform vec3 uCam; uniform vec3 uFog; varying vec3 vW;
      void main(){
        vec2 g = vW.xz / 2.0;
        vec2 f = abs(fract(g - 0.5) - 0.5) / fwidth(g);
        float line = 1.0 - min(min(f.x, f.y), 1.0);
        vec3 col = mix(vec3(0.035, 0.0, 0.08), vec3(1.0, 0.17, 0.78), line);
        float d = length(vW.xz - uCam.xz);
        col = mix(col, uFog, smoothstep(14.0, 115.0, d));
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  const floor = new T.Mesh(new T.PlaneGeometry(300, len), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = zMid;
  root.add(floor);

  // road with lane markings
  const road = new T.Mesh(new T.PlaneGeometry(5, len), new T.MeshBasicMaterial({ color: '#06010d' }));
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, 0.01, zMid);
  root.add(road);
  const edgeMat = new T.MeshBasicMaterial({ color: '#22e1ff' });
  [-2.5, 2.5].forEach((x) => {
    const e = new T.Mesh(new T.BoxGeometry(0.08, 0.02, len), edgeMat);
    e.position.set(x, 0.02, zMid);
    root.add(e);
  });
  const dashN = Math.floor(len / 5);
  const dashes = new T.InstancedMesh(new T.BoxGeometry(0.12, 0.02, 1.6), new T.MeshBasicMaterial({ color: '#ffe066' }), dashN);
  const m4 = new T.Matrix4();
  for (let i = 0; i < dashN; i++) { m4.makeTranslation(0, 0.02, 40 - i * 5); dashes.setMatrixAt(i, m4); }
  root.add(dashes);

  // wireframe mountains on both sides
  [-1, 1].forEach((side) => {
    const geo = new T.PlaneGeometry(60, len, 14, Math.floor(len / 5));
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i);
      const u = side > 0 ? (x + 30) / 60 : 1 - (x + 30) / 60;
      const h = Math.max(0, Math.pow(u, 1.4) * (5 + 7 * (0.5 + 0.5 * Math.sin(y * 0.21 + x * 0.4)) + 4 * Math.sin(y * 0.07)));
      pos.setZ(i, h);
    }
    geo.computeVertexNormals();
    const solid = new T.Mesh(geo, new T.MeshBasicMaterial({ color: '#14002b', polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }));
    const wire = new T.Mesh(geo, new T.MeshBasicMaterial({ color: '#ff3fd8', wireframe: true, transparent: true, opacity: 0.85 }));
    [solid, wire].forEach((m) => { m.rotation.x = -Math.PI / 2; m.position.set(side * 42, 0, zMid); root.add(m); });
  });

  // striped sun
  const sunMat = new T.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uTime: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: `
      uniform float uTime; varying vec2 vUv;
      void main(){
        vec2 p = vUv*2.0-1.0; float r = length(p); if (r > 1.0) discard;
        vec3 c = mix(vec3(1.0,0.12,0.55), vec3(1.0,0.88,0.32), smoothstep(0.1, 0.95, vUv.y));
        if (vUv.y < 0.56) { float band = fract(vUv.y*11.0 + uTime*0.18); if (band < (0.56 - vUv.y)*1.25) discard; }
        gl_FragColor = vec4(c, smoothstep(1.0, 0.97, r));
      }`,
  });
  const sun = new T.Mesh(new T.PlaneGeometry(76, 76), sunMat);
  const sunGlow = glowSprite(T, '#ff3d9a', 170, 0.55);
  root.add(sunGlow, sun);

  // stars
  const R = rng(3);
  const S = 900;
  const sp = new Float32Array(S * 3);
  for (let i = 0; i < S; i++) {
    const a = R() * Math.PI, e = 0.05 + R() * 1.2, r = 220;
    sp[i * 3] = Math.cos(a) * r * Math.cos(e) * 1.6; sp[i * 3 + 1] = Math.sin(e) * r * 0.6 + 8; sp[i * 3 + 2] = -Math.sin(a) * r * Math.cos(e);
  }
  const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(sp, 3));
  const stars = new T.Points(sg, new T.PointsMaterial({ color: '#ffffff', size: 1.4, sizeAttenuation: false, fog: false, transparent: true, opacity: 0.8 }));
  root.add(stars);

  // cabinets
  const screenVS = 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }';
  const screenFS = `
    uniform float uTime; uniform vec3 uColor; uniform float uSeed; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)) + uSeed) * 43758.5453); }
    void main(){
      vec2 g = floor(vUv * vec2(32.0, 24.0));
      float v = step(0.9, h(g + vec2(0.0, floor(uTime * 7.0 + g.x * 0.3))));
      float px = 16.0 + 11.0 * sin(uTime * 1.7 + uSeed);
      if (g.y < 2.0 && abs(g.x - px) < 3.0) v = 1.0;
      vec2 ball = vec2(16.0 + 14.0 * sin(uTime * 2.3 + uSeed), 12.0 + 9.0 * sin(uTime * 3.1));
      if (length(g - floor(ball)) < 1.0) v = 1.0;
      float scan = 0.8 + 0.2 * sin(vUv.y * 300.0);
      float vig = smoothstep(0.75, 0.2, length(vUv - 0.5));
      gl_FragColor = vec4(uColor * (0.12 + v) * scan * (0.5 + vig * 0.7), 1.0);
    }`;
  const bodyGeo = new T.BoxGeometry(1.5, 2.9, 1.1);
  const edges = new T.EdgesGeometry(bodyGeo);
  const bodyMat = new T.MeshStandardMaterial({ color: '#150a26', roughness: 0.55, metalness: 0.3 });
  const coinGeo = new T.CylinderGeometry(0.34, 0.34, 0.08, 28);
  const coinMat = new T.MeshStandardMaterial({ color: '#ffcc33', metalness: 1, roughness: 0.25, emissive: '#6a4500', emissiveIntensity: 0.5 });
  const cabs = [];
  for (let i = 0; i < count; i++) {
    const side = i % 2 ? 1 : -1;
    const color = NEON[i % NEON.length];
    const g = new T.Group();
    g.position.set(side * 4.2, 0, -i * GAP);
    g.rotation.y = Math.atan2(-side * 5.4, 6.5) * 0.85;
    const body = new T.Mesh(bodyGeo, bodyMat); body.position.y = 1.45;
    const line = new T.LineSegments(edges, new T.LineBasicMaterial({ color })); line.position.y = 1.45;
    const bezel = new T.Mesh(new T.BoxGeometry(1.3, 1.0, 0.1), new T.MeshBasicMaterial({ color: '#000000' }));
    bezel.position.set(0, 2.15, 0.52); bezel.rotation.x = -0.18;
    const smat = new T.ShaderMaterial({ uniforms: { uTime: { value: 0 }, uColor: { value: new T.Color(color) }, uSeed: { value: i * 1.7 } }, vertexShader: screenVS, fragmentShader: screenFS });
    const screen = new T.Mesh(new T.PlaneGeometry(1.14, 0.86), smat);
    screen.position.set(0, 2.15, 0.575); screen.rotation.x = -0.18;
    const marquee = new T.Mesh(new T.BoxGeometry(1.5, 0.42, 0.34), new T.MeshBasicMaterial({ color }));
    marquee.position.set(0, 2.98, 0.4);
    const deck = new T.Mesh(new T.BoxGeometry(1.5, 0.2, 0.6), bodyMat);
    deck.position.set(0, 1.35, 0.78); deck.rotation.x = 0.32;
    g.add(body, line, bezel, screen, marquee, deck);
    ['#ff2bd6', '#22e1ff', '#ffe066'].forEach((c, j) => {
      const b = new T.Mesh(new T.CylinderGeometry(0.07, 0.07, 0.06, 14), new T.MeshBasicMaterial({ color: c }));
      b.position.set(-0.3 + j * 0.3, 1.48, 0.86); b.rotation.x = 0.32;
      g.add(b);
    });
    const coin = new T.Mesh(coinGeo, coinMat);
    coin.rotation.order = 'YXZ'; // tilt face-on first, then spin about world Y
    coin.rotation.x = Math.PI / 2;
    coin.position.y = 3.85;
    g.add(coin);
    const halo = glowSprite(T, color, 5, 0.35);
    halo.position.set(0, 2.4, 0.6);
    g.add(halo);
    root.add(g);
    cabs.push({ g, smat, coin, halo, side });
  }

  // voxel invaders
  const vox = [];
  INVADER.forEach((row, y) => [...row].forEach((ch, x) => { if (ch === 'X') vox.push([x - 5, 3.5 - y]); }));
  const INV = 6;
  const inv = new T.InstancedMesh(new T.BoxGeometry(0.46, 0.46, 0.46), new T.MeshBasicMaterial({ color: '#ffffff', fog: false }), INV * vox.length);
  const invCol = new T.Color();
  for (let j = 0; j < INV; j++) for (let v = 0; v < vox.length; v++) inv.setColorAt(j * vox.length + v, invCol.set(NEON[j % NEON.length]));
  root.add(inv);

  function update(dt, t, { stop, gate, camera }) {
    floorMat.uniforms.uCam.value.copy(camera.position);
    sunMat.uniforms.uTime.value = t;
    sun.position.set(camera.position.x * 0.2, 17, camera.position.z - 175);
    sunGlow.position.set(sun.position.x, 12, sun.position.z - 2);
    stars.position.z = camera.position.z;
    cabs.forEach((c, i) => {
      c.smat.uniforms.uTime.value = t;
      c.coin.rotation.y = t * 2.4 + i;
      c.coin.position.y = 3.85 + Math.sin(t * 2 + i) * 0.12;
      c.halo.material.opacity = i === stop && !gate ? 0.6 + Math.sin(t * 6) * 0.15 : 0.22;
    });
    let k = 0;
    for (let j = 0; j < INV; j++) {
      const bx = Math.sin(t * 0.35 + j * 1.3) * 26 + (j - 2.5) * 5;
      const by = 15 + (j % 3) * 4.5 + Math.round(Math.sin(t * 2 + j) * 1) * 0.5;
      const bz = camera.position.z - 70 - (j % 2) * 18;
      const step = Math.floor(t * 2 + j) % 2 ? 0.25 : 0;
      for (let v = 0; v < vox.length; v++) {
        const [x, y] = vox[v];
        m4.makeTranslation(bx + x * 0.5 + (y < 0 ? step : 0), by + y * 0.5, bz);
        inv.setMatrixAt(k++, m4);
      }
    }
    inv.instanceMatrix.needsUpdate = true;
  }

  return {
    stop(i) {
      const side = i % 2 ? 1 : -1;
      const z = -i * GAP;
      return { cam: [-side * 1.3, 2.5, z + 6.8], look: [side * 2.4, 2.05, z - 0.6] };
    },
    overview: () => ({ cam: [0, 3.6, 16], look: [0, 4.5, -60] }),
    update,
  };
}
