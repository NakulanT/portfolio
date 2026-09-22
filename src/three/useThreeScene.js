import { useEffect, useRef } from 'react';

// Shared plumbing for the three background 3D scenes (Japanese, Gaming, Greek).
// `build(THREE, ctx)` sets up the scene once and returns an `update(dt, t)` called every
// frame, plus an optional `dispose()` for anything build() allocated beyond what this hook
// already tracks and cleans up (geometries/materials on scene.traverse are handled here).
//
// Handles: renderer lifecycle, resize, pausing when off-screen or reduced-motion is set,
// and a pointer-driven parallax value (ctx.pointer) build() can read inside update().
export function useThreeScene(build, opts = {}) {
  const mount = useRef(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return undefined;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const T = await import('three');
      if (disposed) return;

      let renderer;
      try {
        renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      } catch (e) {
        el.dataset.fallback = 'true';
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(opts.fov || 42, 1, 0.1, 100);
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

      const readVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);

      const ctx = { T, scene, camera, renderer, pointer, readVar, el };
      const built = build(ctx) || {};
      const update = built.update || (() => {});

      const resize = () => {
        const w = el.clientWidth || 1;
        const h = el.clientHeight || 1;
        renderer.setSize(w, h, false);
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        built.resize?.(w, h);
      };
      const sizeWatch = new ResizeObserver(resize);
      sizeWatch.observe(el);
      resize();

      const themeWatch = new MutationObserver(() => built.onTheme?.());
      themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-mode'] });

      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        pointer.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        pointer.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      };
      const onLeave = () => { pointer.tx = 0; pointer.ty = 0; };
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);

      let visible = true;
      let raf = 0;
      let last = performance.now();
      const frame = (now) => {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        pointer.x += (pointer.tx - pointer.x) * 0.05;
        pointer.y += (pointer.ty - pointer.y) * 0.05;
        update(dt, now / 1000);
        renderer.render(scene, camera);
        if (visible && !reduce) raf = requestAnimationFrame(frame);
      };
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) { last = performance.now(); raf = requestAnimationFrame(frame); }
      }, { threshold: 0.05 });
      io.observe(el);
      if (reduce) frame(performance.now());

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        sizeWatch.disconnect();
        themeWatch.disconnect();
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
        built.dispose?.();
        scene.traverse((o) => {
          if (o.geometry) o.geometry.dispose();
          if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
        });
        renderer.dispose();
        if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
      };
    })();

    return () => { disposed = true; cleanup(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return mount;
}
