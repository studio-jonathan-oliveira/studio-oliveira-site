/*
 * S7 — Outro : wordmark crème en intro-reveal (scale 1.12 + blur → net,
 * keyframe intro-reveal de global.css), URL en tracking-in, signature mono.
 */
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { C, H, W } from '../theme';
import { Eyebrow, Grain, useK, useP } from '../ui';

export const Outro = () => {
  const k = useK();
  const vh = H * k;
  const p = useP(4, 30);
  const eb = useP(24, 22);
  const credit = useP(40, 22);
  const blur = (1 - p) * 8;
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <div
        style={{
          position: 'absolute',
          left: W / 2,
          top: vh / 2 - 130 * k,
          transform: `translate(-50%, -50%) scale(${1.12 - 0.12 * p})`,
          opacity: p,
          filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
        }}
      >
        <Img
          src={staticFile('brand/wordmark-cream.png')}
          style={{ width: 760, display: 'block' }}
        />
      </div>
      <Eyebrow
        size={27}
        color={C.cream}
        style={{
          position: 'absolute',
          top: vh / 2 + 60 * k,
          width: '100%',
          textAlign: 'center',
          opacity: eb,
          letterSpacing: 20 - 13.5 * eb,
        }}
      >
        www.jonathanoliveira.fr
      </Eyebrow>
      <Eyebrow
        size={19}
        color={C.cream}
        tracking={3.5}
        style={{
          position: 'absolute',
          bottom: 170 * k,
          width: '100%',
          textAlign: 'center',
          opacity: eb * 0.5,
        }}
      >
        Studio J. Oliveira — Design immersif &amp; expérientiel
      </Eyebrow>
      {/* Crédit Studio Margerit — bas-droite, lisible (retour Morgan) */}
      <Eyebrow
        size={20}
        color={C.cream}
        tracking={3}
        style={{
          position: 'absolute',
          bottom: 88 * k,
          right: 72,
          opacity: credit * 0.75,
          transform: `translateY(${(1 - credit) * 14}px)`,
        }}
      >
        Designed &amp; created by Studio Margerit
      </Eyebrow>
      <Grain dark />
    </AbsoluteFill>
  );
};
