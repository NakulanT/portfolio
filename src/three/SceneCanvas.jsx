import { useThreeScene } from './useThreeScene';

export function SceneCanvas({ build, className = '', label }) {
  const mount = useThreeScene(build);
  return <div className={`scene3d-bg ${className}`} ref={mount} role="img" aria-label={label} />;
}
