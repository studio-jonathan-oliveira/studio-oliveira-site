/*
 * Primitives UI du teaser — répliques des patterns motion du site :
 * mask-reveal ([data-mask-line]), eyebrow mono, curseur signature ■.,
 * grain papier (body::before de global.css).
 */
import type { CSSProperties, ReactNode } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, EO, FONT_MONO, H } from './theme';

/**
 * Facteur d'échelle verticale par rapport au master 9:16 (1080×1920).
 * Permet de décliner la même composition en feed 4:5 (1080×1350) :
 * la largeur ne change pas, seules les positions verticales se compriment.
 */
export const useK = (): number => useVideoConfig().height / H;

/** Progression 0→1 easée à partir de la frame locale de la séquence. */
export const useP = (delay: number, dur: number, easing: (t: number) => number = EO): number => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + dur], [0, 1], {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

/**
 * Ligne en mask-reveal : conteneur clippé, l'enfant monte de 110% → 0
 * (pattern [data-mask-line] du site).
 */
export const MaskLine = ({
  delay,
  dur = 26,
  children,
  style,
  innerStyle,
}: {
  delay: number;
  dur?: number;
  children: ReactNode;
  style?: CSSProperties;
  innerStyle?: CSSProperties;
}) => {
  const p = useP(delay, dur);
  return (
    <div style={{ overflow: 'hidden', ...style }}>
      <div style={{ transform: `translateY(${(1 - p) * 110}%)`, ...innerStyle }}>{children}</div>
    </div>
  );
};

/** Eyebrow mono — uppercase, tracking canonique 0.24em (utility .eyebrow). */
export const Eyebrow = ({
  children,
  color = C.moss,
  size = 25,
  tracking,
  style,
}: {
  children: ReactNode;
  color?: string;
  size?: number;
  tracking?: number;
  style?: CSSProperties;
}) => (
  <div
    style={{
      fontFamily: FONT_MONO,
      fontWeight: 500,
      fontSize: size,
      letterSpacing: tracking ?? size * 0.24,
      textTransform: 'uppercase',
      color,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Curseur signature de la trame : carré arrondi + dot bas-droite (■.). */
export const Cursor = ({
  size,
  fill,
  dotFill,
  style,
}: {
  size: number;
  fill: string;
  dotFill?: string;
  style?: CSSProperties;
}) => (
  <div style={{ position: 'relative', width: size, height: size, ...style }}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: size * 0.28,
        backgroundColor: fill,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: size * 1.18,
        top: size * 0.86,
        width: size * 0.26,
        height: size * 0.26,
        borderRadius: '50%',
        backgroundColor: dotFill ?? fill,
      }}
    />
  </div>
);

// Texture grain « papier imprimé » — data URI identique à body::before du site.
const GRAIN_URI = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.45 0'/></filter><rect width='220' height='220' filter='url(%23n)'/></svg>")`;

/** Grain plein cadre. `dark` : sur fond noir on passe en screen léger. */
export const Grain = ({ dark = false }: { dark?: boolean }) => {
  const frame = useCurrentFrame();
  // Micro-déplacement du tile par frame → grain vivant type pellicule.
  const ox = (frame * 73) % 220;
  const oy = (frame * 131) % 220;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        backgroundImage: GRAIN_URI,
        backgroundPosition: `${ox}px ${oy}px`,
        opacity: dark ? 0.13 : 0.05,
        mixBlendMode: dark ? 'screen' : 'multiply',
        filter: dark ? 'invert(1)' : undefined,
      }}
    />
  );
};
