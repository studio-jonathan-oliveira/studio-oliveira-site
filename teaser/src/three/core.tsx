/*
 * Moteur 2.5D du teaser — caméra virtuelle + plans dans l'espace CSS 3D.
 *
 * Principe : un conteneur racine porte `perspective` ; le « monde » est un
 * div preserve-3d dont le transform est l'INVERSE de la pose caméra
 * (translateZ(PERSP) · R⁻¹ · T⁻¹). Les contenus sont des <Plane> positionnés
 * en coordonnées monde. Un objet situé à PERSP px devant la caméra se rend
 * à l'échelle 1:1 — restPose() calcule donc la pose caméra « au repos »
 * face à un plan donné.
 */
import type { CSSProperties, ReactNode } from 'react';
import { Easing, interpolate } from 'remotion';

export const PERSP = 1600;

/** --ease-in-out-editorial (déplacements caméra) */
const EIO = Easing.bezier(0.76, 0, 0.24, 1);

export interface Pose {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
}

export const pose = (p: Partial<Pose>): Pose => ({
  x: 0,
  y: 0,
  z: 0,
  rx: 0,
  ry: 0,
  rz: 0,
  ...p,
});

const RAD = Math.PI / 180;

/**
 * Pose caméra au repos face à un point (px,py,pz) orienté yaw/pitch,
 * à distance dist le long de la normale du plan.
 */
export const restPose = (
  px: number,
  py: number,
  pz: number,
  ry = 0,
  rx = 0,
  dist = PERSP,
): Pose => ({
  x: px + Math.sin(ry * RAD) * Math.cos(rx * RAD) * dist,
  y: py - Math.sin(rx * RAD) * dist,
  z: pz + Math.cos(ry * RAD) * Math.cos(rx * RAD) * dist,
  rx,
  ry,
  rz: 0,
});

export interface CamKey {
  f: number;
  p: Pose;
}

/** Interpolation piecewise EIO entre poses-clés + micro-dérive organique. */
export const cameraAt = (frame: number, keys: CamKey[]): Pose => {
  const first = keys[0];
  const last = keys[keys.length - 1];
  if (!first || !last) throw new Error('cameraAt: keys vides');
  let a = first;
  let b = last;
  for (let i = 0; i < keys.length - 1; i++) {
    const k0 = keys[i];
    const k1 = keys[i + 1];
    if (k0 && k1 && frame >= k0.f && frame <= k1.f) {
      a = k0;
      b = k1;
      break;
    }
  }
  if (frame <= first.f) b = first;
  if (frame >= last.f) a = last;
  const t =
    a.f === b.f
      ? 0
      : interpolate(frame, [a.f, b.f], [0, 1], {
          easing: EIO,
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
  const mix = (ka: number, kb: number) => ka + (kb - ka) * t;
  // Dérive « handheld » très lente — la caméra ne fige jamais totalement
  const drift = {
    x: 9 * Math.sin(frame * 0.016 + 1.3),
    y: 7 * Math.sin(frame * 0.011 + 4.1),
    ry: 0.7 * Math.sin(frame * 0.009 + 2.2),
    rz: 0.5 * Math.sin(frame * 0.007),
  };
  return {
    x: mix(a.p.x, b.p.x) + drift.x,
    y: mix(a.p.y, b.p.y) + drift.y,
    z: mix(a.p.z, b.p.z),
    rx: mix(a.p.rx, b.p.rx),
    ry: mix(a.p.ry, b.p.ry) + drift.ry,
    rz: mix(a.p.rz, b.p.rz) + drift.rz,
  };
};

/** Distance avant signée (axe de visée) + distance euclidienne caméra→point. */
export const camSpace = (px: number, py: number, pz: number, cam: Pose) => {
  const dx = px - cam.x;
  const dy = py - cam.y;
  const dz = pz - cam.z;
  // forward ≈ direction -Z tournée par yaw/pitch (angles faibles)
  const fx = -Math.sin(cam.ry * RAD);
  const fy = Math.sin(cam.rx * RAD);
  const fz = -Math.cos(cam.ry * RAD);
  return {
    forward: dx * fx + dy * fy + dz * fz,
    dist: Math.hypot(dx, dy, dz),
  };
};

/** Progression utilitaire frame absolue → 0..1 easée (pas un hook). */
export const P = (
  frame: number,
  start: number,
  dur: number,
  easing: (t: number) => number = Easing.bezier(0.16, 1, 0.3, 1),
): number =>
  interpolate(frame, [start, start + dur], [0, 1], {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

export const World = ({ cam, children }: { cam: Pose; children: ReactNode }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      transformStyle: 'preserve-3d',
      transform: `translateZ(${PERSP}px) rotateZ(${-cam.rz}deg) rotateX(${-cam.rx}deg) rotateY(${-cam.ry}deg) translate3d(${-cam.x}px, ${-cam.y}px, ${-cam.z}px)`,
    }}
  >
    {children}
  </div>
);

export const Plane = ({
  x = 0,
  y = 0,
  z = 0,
  rx = 0,
  ry = 0,
  rz = 0,
  w,
  h,
  blur = 0,
  opacity = 1,
  style,
  children,
}: Partial<Pose> & {
  w: number;
  h: number;
  blur?: number;
  opacity?: number;
  style?: CSSProperties;
  children?: ReactNode;
}) => {
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: w,
        height: h,
        marginLeft: -w / 2,
        marginTop: -h / 2,
        transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${ry}deg) rotateX(${rx}deg) rotateZ(${rz}deg)`,
        backfaceVisibility: 'hidden',
        opacity,
        filter: blur > 0.3 ? `blur(${blur.toFixed(2)}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
