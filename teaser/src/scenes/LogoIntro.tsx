/*
 * S1 — Ouverture : l'animation existante du logo « oliveim. » (vidéo Jonathan,
 * tracé noir sur blanc) intégrée en multiply sur le beige de la marque :
 * le blanc disparaît, le tracé noir reste → raccord DA invisible.
 */
import { AbsoluteFill, OffthreadVideo, staticFile } from 'remotion';
import { C, DUR, W } from '../theme';
import { Eyebrow, Grain, useK, useP } from '../ui';

// La source fait 5.27s : tracé sur fond blanc jusqu'à ~4.15s puis end-card
// fond noir (incompatible multiply). On accélère et on coupe juste avant le
// flip : à 84 frames @1.45, le temps source atteint 4.06s.
const RATE = 1.45;

export const LogoIntro = () => {
  const k = useK();
  const settle = useP(0, DUR.logoIntro);
  const eb = useP(46, 24);
  const meta = useP(56, 20);
  return (
    <AbsoluteFill style={{ backgroundColor: C.cream }}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div
          style={{
            width: W * 0.94,
            transform: `scale(${1.05 - 0.05 * settle})`,
            mixBlendMode: 'multiply',
          }}
        >
          <OffthreadVideo
            src={staticFile('brand/logo-animation-1080p.mp4')}
            muted
            playbackRate={RATE}
            style={{ width: '100%', display: 'block' }}
          />
        </div>
      </AbsoluteFill>
      <Eyebrow
        size={26}
        style={{
          position: 'absolute',
          top: 220 * k,
          width: '100%',
          textAlign: 'center',
          opacity: eb,
          letterSpacing: 28 - 21 * eb,
          color: C.ink,
        }}
      >
        Studio J. Oliveira
      </Eyebrow>
      <Eyebrow
        size={22}
        color={C.moss}
        style={{
          position: 'absolute',
          bottom: 200 * k,
          width: '100%',
          textAlign: 'center',
          opacity: meta * 0.9,
        }}
      >
        Nouveau site — 2026
      </Eyebrow>
      <Grain />
    </AbsoluteFill>
  );
};
