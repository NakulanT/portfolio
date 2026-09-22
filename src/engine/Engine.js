// One renderer, one camera, one persistent being. Worlds are swapped underneath.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createBeing } from './being';
import { disposeTree, damp } from './util';
import { buildNeural } from './worlds/neural';
import { buildArcade } from './worlds/arcade';
import { buildZen } from './worlds/zen';
import { buildOlympus } from './worlds/olympus';
import { buildCosmos } from './worlds/cosmos';

const BUILDERS = { neural: buildNeural, arcade: buildArcade, zen: buildZen, olympus: buildOlympus, cosmos: buildCosmos };

// Where the being floats on screen (NDC), chosen so it never sits under that world's panel.
const BEING_NDC = {
  neural: { x: 0.6, y: 0.1 },
  arcade: { x: 0.62, y: 0.3 },
  zen: { x: -0.55, y: 0.34 },
  olympus: { x: -0.62, y: 0.28 },
  cosmos: { x: -0.55, y: -0.28 },
};

export class Engine {
  constructor(canvas, { world, count, onFrame }) {
    this.count = count;
    this.onFrame = onFrame;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const r = (this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' }));
    // Resolution is the biggest cost on Retina screens. Start at up to 1.25x and let
    // _adapt() step it down (to 0.7x) if frames run slow.
    this.dprMax = Math.min(window.devicePixelRatio || 1, 1.25);
    this.dpr = this.dprMax;
    r.setPixelRatio(this.dpr);
    this.perf = { acc: 0, n: 0, cool: 0 };
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.05;

    this.scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(r);
    this.env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    this.scene.environment = this.env;

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 900);

    // Bit lives in its own scene with fixed studio lighting, drawn after the world with a
    // cleared depth buffer: it is never hidden by a planet or pillar, and it looks like the
    // same character in every world instead of picking up each world's lights.
    this.beingScene = new THREE.Scene();
    this.beingScene.environment = this.env;
    this.beingScene.environmentIntensity = 0.7;
    this.beingScene.add(new THREE.HemisphereLight('#ffffff', '#8a90a8', 1.2));
    const key = new THREE.DirectionalLight('#ffffff', 1.6);
    key.position.set(3, 6, 8);
    this.beingScene.add(key);
    this.being = createBeing(THREE);
    this.beingScene.add(this.being.root);
    r.autoClear = false;

    this.camCur = new THREE.Vector3();
    this.lookCur = new THREE.Vector3();
    this.camTgt = new THREE.Vector3();
    this.lookTgt = new THREE.Vector3();
    this.v = { fwd: new THREE.Vector3(), right: new THREE.Vector3(), up: new THREE.Vector3(), tgt: new THREE.Vector3(), look: new THREE.Vector3(), p: new THREE.Vector3() };
    this.pointer = { x: 0, y: 0, sx: 0, sy: 0 };
    this.stopIdx = 0;
    this.gate = false;
    this.talking = false;
    this.scale = 1;
    this.t = 0;
    this.screen = [0, 0];

    this._resize = this._resize.bind(this);
    this._move = (e) => { this.pointer.x = (e.clientX / this.w) * 2 - 1; this.pointer.y = (e.clientY / this.h) * 2 - 1; };
    window.addEventListener('resize', this._resize);
    window.addEventListener('pointermove', this._move, { passive: true });
    this._resize();

    this.setWorld(world);
    this.last = performance.now();
    this._tick = this._tick.bind(this);
    this.raf = requestAnimationFrame(this._tick);
  }

  _resize() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.mobile = this.w < 760;
    this.renderer.setSize(this.w, this.h, false);
    this.camera.aspect = this.w / this.h;
    this.camera.fov = this.mobile ? 62 : 50;
    this.camera.updateProjectionMatrix();
  }

  setWorld(id) {
    if (this.worldRoot) {
      this.scene.remove(this.worldRoot);
      disposeTree(this.worldRoot);
    }
    if (this.scene.background && this.scene.background.isTexture) this.scene.background.dispose();
    this.scene.background = null;
    this.scene.fog = null;
    this.scene.environmentIntensity = 1;
    this.worldRoot = new THREE.Group();
    this.scene.add(this.worldRoot);
    this.worldId = id;
    this.world = BUILDERS[id](THREE, { root: this.worldRoot, scene: this.scene, count: this.count });
    this.being.setSkin(id);
    this._targets();
    // fly in from above and behind the new destination
    this.camCur.copy(this.camTgt).add(new THREE.Vector3(0, 5, 12));
    this.lookCur.copy(this.lookTgt);
  }

  go(i) {
    const d = Math.sign(i - this.stopIdx);
    this.stopIdx = i;
    if (d) this.being.swoop(d);
    if (i === 0 || i === this.count - 1) this.being.wave();
  }

  setGate(open) {
    this.gate = open;
    if (open) this.being.wave(2.4);
  }

  setTalking(on) { this.talking = on; }

  // jump straight to the current destination (used by reduced motion and screenshot tests)
  snap() {
    this._targets();
    this.camCur.copy(this.camTgt);
    this.lookCur.copy(this.lookTgt);
    this.snapBeing = true;
  }

  beingScreen() { return this.screen; }

  _targets() {
    const s = this.gate ? this.world.overview() : this.world.stop(this.stopIdx);
    this.camTgt.fromArray(s.cam);
    this.lookTgt.fromArray(s.look);
  }

  _tick(now) {
    this.raf = requestAnimationFrame(this._tick);
    // rAF's timestamp can precede the performance.now() taken at construction; a negative
    // dt makes every exponential damp diverge, so clamp to [0, 50ms].
    const dt = Math.max(0, Math.min((now - this.last) / 1000, 0.05));
    this.last = now;
    if (document.hidden) return;
    this._adapt(now);
    this.t += dt;
    const { camera, pointer: p, v } = this;

    this._targets();
    const k = this.reduced ? 14 : 2.1;
    this.camCur.lerp(this.camTgt, damp(dt, k));
    this.lookCur.lerp(this.lookTgt, damp(dt, k * 1.3));
    p.sx += (p.x - p.sx) * damp(dt, 4);
    p.sy += (p.y - p.sy) * damp(dt, 4);

    camera.position.copy(this.camCur);
    camera.lookAt(this.lookCur);
    camera.updateMatrixWorld();
    v.right.setFromMatrixColumn(camera.matrixWorld, 0);
    v.up.setFromMatrixColumn(camera.matrixWorld, 1);
    if (!this.reduced) {
      camera.position.addScaledVector(v.right, p.sx * 0.35).addScaledVector(v.up, -p.sy * 0.2);
      camera.lookAt(this.lookCur);
      camera.updateMatrixWorld();
    }
    camera.getWorldDirection(v.fwd);
    v.right.setFromMatrixColumn(camera.matrixWorld, 0);
    v.up.setFromMatrixColumn(camera.matrixWorld, 1);

    // the being floats at a fixed spot in view, lagging a little so it feels like it follows you
    const ndc = this.gate ? { x: 0, y: 0.5 } : this.mobile ? { x: 0.42, y: 0.62 } : BEING_NDC[this.worldId];
    const dist = 7.5;
    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist;
    const halfW = halfH * camera.aspect;
    v.tgt.copy(camera.position).addScaledVector(v.fwd, dist).addScaledVector(v.right, ndc.x * halfW).addScaledVector(v.up, ndc.y * halfH);
    const b = this.being.root;
    if (this.snapBeing) { b.position.copy(v.tgt); this.snapBeing = false; } else b.position.lerp(v.tgt, damp(dt, 3.2));
    const sTgt = (this.gate ? 1.2 : 1) * (this.mobile ? 0.8 : 1);
    this.scale += (sTgt - this.scale) * damp(dt, 4);
    b.scale.setScalar(this.scale);
    v.look.copy(camera.position).addScaledVector(v.right, p.sx * 2.6).addScaledVector(v.up, -p.sy * 1.7);
    this.being.update(dt, this.t, { lookAt: v.look, talking: this.talking, reduced: this.reduced });

    this.world.update(dt, this.t, { stop: this.stopIdx, gate: this.gate, camera });
    this.renderer.clear();
    this.renderer.render(this.scene, camera);
    this.renderer.clearDepth();
    this.renderer.render(this.beingScene, camera);

    // screen-space centre and radius of the being, for the speech bubble and the iris
    v.p.copy(b.position).project(camera);
    const cx = ((v.p.x + 1) / 2) * this.w, cy = ((1 - v.p.y) / 2) * this.h;
    v.p.copy(b.position).addScaledVector(v.up, 0.8 * this.scale).project(camera);
    const r = Math.abs(cy - ((1 - v.p.y) / 2) * this.h);
    this.screen = [cx, cy];
    this.onFrame && this.onFrame(cx, cy, r);
  }

  // Average real frame time over ~1s; drop resolution when slow, recover slowly when fast.
  _adapt(now) {
    const f = this.perf;
    if (f.prev) { f.acc += now - f.prev; f.n++; }
    f.prev = now;
    if (f.n < 60) return;
    const avg = f.acc / f.n;
    f.acc = 0; f.n = 0;
    if (now < f.cool) return;
    let next = this.dpr;
    if (avg > 21) next = Math.max(0.7, this.dpr - 0.15);
    else if (avg < 13 && this.dpr < this.dprMax) next = Math.min(this.dprMax, this.dpr + 0.1);
    if (next !== this.dpr) {
      this.dpr = next;
      this.renderer.setPixelRatio(next);
      this.renderer.setSize(this.w, this.h, false);
      f.cool = now + 1500;
    }
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this._resize);
    window.removeEventListener('pointermove', this._move);
    if (this.worldRoot) disposeTree(this.worldRoot);
    disposeTree(this.being.root);
    this.env.dispose();
    this.renderer.dispose();
  }
}
