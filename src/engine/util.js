// Small helpers shared by the being and every world builder.

export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Vertical sky gradient, top colour first. Used as scene.background.
export function gradientTexture(T, stops) {
  const c = document.createElement('canvas');
  c.width = 4; c.height = 512;
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 0, 512);
  stops.forEach(([at, col]) => grd.addColorStop(at, col));
  g.fillStyle = grd;
  g.fillRect(0, 0, 4, 512);
  const tex = new T.CanvasTexture(c);
  tex.colorSpace = T.SRGBColorSpace;
  return tex;
}

// Soft round glow for sprites and points.
export function glowTexture(T, inner = 'rgba(255,255,255,1)') {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, inner);
  grd.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const tex = new T.CanvasTexture(c);
  tex.colorSpace = T.SRGBColorSpace;
  return tex;
}

export function glowSprite(T, color, scale, opacity = 1) {
  const s = new T.Sprite(new T.SpriteMaterial({
    map: glowTexture(T), color, transparent: true, opacity,
    blending: T.AdditiveBlending, depthWrite: false, fog: false,
  }));
  s.scale.setScalar(scale);
  return s;
}

export function disposeTree(obj) {
  obj.traverse((n) => {
    if (n.geometry) n.geometry.dispose();
    const mats = Array.isArray(n.material) ? n.material : n.material ? [n.material] : [];
    mats.forEach((m) => {
      Object.values(m).forEach((v) => { if (v && v.isTexture) v.dispose(); });
      if (m.uniforms) Object.values(m.uniforms).forEach((u) => { if (u.value && u.value.isTexture) u.value.dispose(); });
      m.dispose();
    });
  });
}

export const damp = (dt, k) => 1 - Math.exp(-dt * k);
