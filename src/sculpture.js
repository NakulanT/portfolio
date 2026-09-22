// The one 3D element on the page: a liquid, iridescent sculpture that sits beside the
// content. It never moves the camera. Scrolling only changes how it breathes (noise
// amplitude/frequency per section) and turns it; the pointer tilts it and makes it swell.
import * as THREE from 'three';

const NOISE = /* glsl */ `
vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
uniform float uTime; uniform float uAmp; uniform float uFreq;
float warp(vec3 p){
  return snoise(p * uFreq + vec3(uTime * 0.22)) * uAmp
       + snoise(p * uFreq * 2.1 - vec3(uTime * 0.31)) * uAmp * 0.12;
}
`;

// A studio made of coloured light panels, baked into an environment map. This is what
// the chrome/pearl surface reflects, so it decides the sculpture's palette.
function studioEnvironment(renderer) {
  const env = new THREE.Scene();
  // a dark room makes the colour panels read as deep, smooth gradients on the chrome
  const room = new THREE.Mesh(new THREE.SphereGeometry(20, 32, 16), new THREE.MeshBasicMaterial({ color: '#23222a', side: THREE.BackSide }));
  env.add(room);
  const panel = (color, w, h, pos, intensity = 1) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }));
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    env.add(m);
  };
  panel('#ffffff', 16, 8, [0, 13, 5], 2.4);     // big top softbox
  panel('#2f4bff', 12, 18, [-14, 0, 4], 2.4);   // cobalt wall on the left
  panel('#ff6a2b', 10, 16, [14, -2, 4], 2.2);   // warm orange on the right
  panel('#ff4fa8', 12, 8, [2, -13, -6], 1.8);   // pink from below
  panel('#f3efe7', 22, 10, [0, 0, 16], 1.1);    // the page itself, in front
  const pmrem = new THREE.PMREMGenerator(renderer);
  const tex = pmrem.fromScene(env, 0.02).texture;
  pmrem.dispose();
  env.traverse((n) => { n.geometry && n.geometry.dispose(); n.material && n.material.dispose(); });
  return tex;
}

// how the sculpture behaves in each section (data-mood on the <section>)
export const MOODS = {
  hero: { amp: 0.24, freq: 1.05, spin: 0.12 },
  numbers: { amp: 0.16, freq: 1.8, spin: 0.2 },
  work: { amp: 0.3, freq: 0.8, spin: 0.08 },
  method: { amp: 0.22, freq: 1.5, spin: 0.14 },
  projects: { amp: 0.12, freq: 2.2, spin: 0.22 },
  stack: { amp: 0.24, freq: 1.6, spin: 0.16 },
  path: { amp: 0.2, freq: 1.2, spin: 0.1 },
  contact: { amp: 0.28, freq: 0.95, spin: 0.18 },
};

export function createSculpture(canvas) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  const dprMax = Math.min(window.devicePixelRatio || 1, 1.5);
  let dpr = dprMax;
  renderer.setPixelRatio(dpr);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  scene.environment = studioEnvironment(renderer);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0, 7.2);

  const uniforms = { uTime: { value: 0 }, uAmp: { value: MOODS.hero.amp }, uFreq: { value: MOODS.hero.freq } };
  const material = new THREE.MeshPhysicalMaterial({
    color: '#ffffff', metalness: 1, roughness: 0.2,
    iridescence: 0.8, iridescenceIOR: 1.6, iridescenceThicknessRange: [220, 700],
    clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.2,
  });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${NOISE}`)
      // displace along the sphere normal and rebuild the normal from two nearby displaced points
      .replace('#include <beginnormal_vertex>', `
        vec3 nrm = normalize(position);
        vec3 tng = normalize(abs(nrm.y) > 0.99 ? cross(nrm, vec3(1.0, 0.0, 0.0)) : cross(nrm, vec3(0.0, 1.0, 0.0)));
        vec3 btg = normalize(cross(nrm, tng));
        float e = 0.012;
        vec3 q0 = position + nrm * warp(position);
        vec3 pa = position + tng * e; vec3 pb = position + btg * e;
        vec3 qa = pa + normalize(pa) * warp(pa);
        vec3 qb = pb + normalize(pb) * warp(pb);
        vec3 objectNormal = normalize(cross(qa - q0, qb - q0));
        if (dot(objectNormal, nrm) < 0.0) objectNormal = -objectNormal;
      `)
      .replace('#include <begin_vertex>', 'vec3 transformed = q0;');
  };
  const blob = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 64), material);

  // a thin ink orbit and two chrome satellites keep it from reading as a plain ball
  const rig = new THREE.Group();
  rig.add(blob);
  const orbit = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.005, 8, 200), new THREE.MeshBasicMaterial({ color: '#141414', transparent: true, opacity: 0.55 }));
  orbit.rotation.set(1.18, 0.2, 0);
  rig.add(orbit);
  const chrome = new THREE.MeshPhysicalMaterial({ color: '#ffffff', metalness: 1, roughness: 0.08, iridescence: 0.6, envMapIntensity: 1.4 });
  const sats = [0.16, 0.09].map((r) => { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 24), chrome); rig.add(s); return s; });
  scene.add(rig);

  const state = {
    mood: { ...MOODS.hero }, target: MOODS.hero,
    px: 0, py: 0, sx: 0, sy: 0, swell: 0, scroll: 0,
    t: 0, last: performance.now(), frames: 0, acc: 0, cool: 0,
  };

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the ~3.4-unit-wide sculpture inside a narrow, tall canvas
    camera.fov = w / h < 1 ? Math.min(60, 2 * Math.atan(Math.tan((32 * Math.PI) / 360) / (w / h)) * (180 / Math.PI)) : 32;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  // on phones the canvas scrolls away with the hero; stop rendering while it's off-screen
  let visible = true;
  const vis = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  vis.observe(canvas);

  const onMove = (e) => {
    state.px = (e.clientX / window.innerWidth) * 2 - 1;
    state.py = (e.clientY / window.innerHeight) * 2 - 1;
    const r = canvas.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    state.swell = Math.max(0, 1 - Math.hypot(dx, dy) * 2.2); // pointer near the sculpture makes it swell
  };
  const onScroll = () => { state.scroll = window.scrollY; };
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  let raf = 0;
  function tick(now) {
    raf = requestAnimationFrame(tick);
    if (document.hidden || !visible) { state.last = now; return; }
    const dt = Math.max(0, Math.min((now - state.last) / 1000, 0.05));
    state.last = now;

    // adaptive resolution: step down if frames are slow, recover when fast
    state.acc += dt; state.frames++;
    if (state.frames >= 60) {
      const avg = (state.acc / state.frames) * 1000;
      state.acc = 0; state.frames = 0;
      if (now > state.cool) {
        const next = avg > 21 ? Math.max(0.75, dpr - 0.2) : avg < 13 ? Math.min(dprMax, dpr + 0.1) : dpr;
        if (next !== dpr) { dpr = next; renderer.setPixelRatio(dpr); resize(); state.cool = now + 1500; }
      }
    }

    const speed = reduced ? 0 : 1;
    state.t += dt * speed;
    const k = 1 - Math.exp(-dt * 1.6);
    const m = state.mood, g = state.target;
    m.amp += (g.amp + state.swell * 0.12 - m.amp) * k;
    m.freq += (g.freq - m.freq) * k;
    m.spin += (g.spin - m.spin) * k;
    uniforms.uTime.value = state.t;
    uniforms.uAmp.value = reduced ? g.amp * 0.6 : m.amp;
    uniforms.uFreq.value = m.freq;

    state.sx += (state.px - state.sx) * (1 - Math.exp(-dt * 3));
    state.sy += (state.py - state.sy) * (1 - Math.exp(-dt * 3));
    blob.rotation.y += dt * m.spin * speed;
    rig.rotation.x = state.sy * 0.25 + state.scroll * 0.0004;
    rig.rotation.y = state.sx * 0.35 + state.scroll * 0.0009;
    orbit.rotation.z += dt * 0.15 * speed;
    const a = state.t * 0.5;
    sats[0].position.set(Math.cos(a) * 1.55, Math.sin(a) * 0.58, Math.sin(a) * 1.45);
    sats[1].position.set(Math.cos(-a * 1.4 + 2) * 1.3, Math.sin(-a * 1.4 + 2) * -0.42, Math.sin(-a * 1.4 + 2) * 1.2);

    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(tick);

  return {
    setMood(name) { state.target = MOODS[name] || MOODS.hero; },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      vis.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      scene.traverse((n) => { n.geometry && n.geometry.dispose(); n.material && n.material.dispose(); });
      scene.environment.dispose();
      renderer.dispose();
    },
  };
}
