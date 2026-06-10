/*
 * S2 — Hero : photo réelle du site (slideshow home), voile ink, wordmark
 * « Studio / J. Oliveira » en mask-reveal ExtraLight (sentence case, trame
 * home), eyebrow « Design immersif & expérientiel » (verbatim ADN).
 * Sortie : wipe beige bas→haut (EIO) vers la scène valeurs.
 */
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { C, DUR, EIO, FONT_HEADING, PAGE_X } from '../theme';
import { Eyebrow, Grain, MaskLine, useK, useP } from '../ui';

export const Hero = () => {
  const k = useK();
  const zoom = useP(0, DUR.hero);
  const eb = useP(14, 20);
  // Entrée : rideau beige (continuité du fond de l'intro logo) qui se lève
  const entry = useP(0, 14, EIO);
  const wipe = useP(DUR.hero - 14, 12, EIO);
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <Img
          src={staticFile('hero/01-image@2x.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${1.12 - 0.09 * zoom})`,
          }}
        />
      </AbsoluteFill>
      {/* Voile ink bas (lisibilité wordmark) — overlay-ink du site */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(to bottom, transparent 42%, ${C.ink}c4 100%)`,
        }}
      />
      <AbsoluteFill style={{ backgroundColor: C.ink, opacity: 0.13 }} />

      {/* Eyebrow + wordmark dans le même flux (pas de chevauchement possible
          quand la hauteur varie entre 9:16 et 4:5) */}
      <div style={{ position: 'absolute', left: PAGE_X - 6, bottom: 130 * k }}>
        <Eyebrow
          size={25}
          color={C.cream}
          style={{ opacity: eb, marginLeft: 10, marginBottom: 34 * k }}
        >
          Design immersif &amp; expérientiel
        </Eyebrow>
        <MaskLine delay={6} dur={26}>
          <div
            style={{
              fontFamily: FONT_HEADING,
              fontWeight: 200,
              fontSize: 108 * Math.min(1, k * 1.12),
              lineHeight: 1.06,
              color: C.cream,
              wordSpacing: 10,
            }}
          >
            Studio
          </div>
        </MaskLine>
        <MaskLine delay={13} dur={28}>
          <div
            style={{
              fontFamily: FONT_HEADING,
              fontWeight: 200,
              fontSize: 158 * Math.min(1, k * 1.12),
              lineHeight: 1.04,
              color: C.cream,
              whiteSpace: 'nowrap',
            }}
          >
            J. Oliveira
          </div>
        </MaskLine>
      </div>

      <Grain dark />
      <AbsoluteFill
        style={{ backgroundColor: C.cream, transform: `translateY(${-entry * 100}%)` }}
      />
      {/* Wipe beige sortant */}
      <AbsoluteFill
        style={{
          backgroundColor: C.cream,
          transform: `translateY(${(1 - wipe) * 100}%)`,
        }}
      />
    </AbsoluteFill>
  );
};
