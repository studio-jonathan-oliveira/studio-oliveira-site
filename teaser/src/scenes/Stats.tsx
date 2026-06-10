/*
 * S5 — Stats sur noir : chiffres-clés réels de la home (+10 études, +10 ans,
 * +3 régions). Chiffres ExtraLight crème (état repos des cartes stats de la
 * trame : « chiffre crème FIN »), labels Bold, compteur animé.
 */
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, DUR, EIO, EO, FONT_HEADING, PAGE_X } from '../theme';
import { Eyebrow, Grain, MaskLine, useK, useP } from '../ui';

const STATS = [
  { value: 10, label: 'études' },
  { value: 10, label: 'ans' },
  { value: 3, label: 'régions' },
];

const Row = ({ value, label, index }: { value: number; label: string; index: number }) => {
  const k = useK();
  const frame = useCurrentFrame();
  const delay = 4 + index * 11;
  const reveal = useP(delay, 22);
  const count = Math.round(
    interpolate(frame, [delay + 2, delay + 18], [0, value], {
      easing: EO,
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: PAGE_X,
        right: PAGE_X,
        top: (488 + index * 330) * k,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 36 }}>
        <MaskLine delay={delay} dur={22}>
          <div
            style={{
              fontFamily: FONT_HEADING,
              fontWeight: 200,
              fontSize: 226 * k,
              lineHeight: 1,
              color: C.cream,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            +{count}
          </div>
        </MaskLine>
        <MaskLine delay={delay + 5} dur={22}>
          <div
            style={{
              fontFamily: FONT_HEADING,
              fontWeight: 700,
              fontSize: 74 * Math.min(1, k * 1.15),
              letterSpacing: '-0.02em',
              color: C.cream,
            }}
          >
            {label}
          </div>
        </MaskLine>
      </div>
      <div
        style={{
          marginTop: 34 * k,
          height: 1,
          backgroundColor: C.cream,
          opacity: reveal * 0.26,
          transform: `scaleX(${reveal})`,
          transformOrigin: 'left',
        }}
      />
    </div>
  );
};

export const Stats = () => {
  const k = useK();
  const eb = useP(2, 16);
  // Sortie : rideau beige vers la scène annonce
  const exitWipe = useP(DUR.stats - 14, 12, EIO);
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <Eyebrow
        size={24}
        color={C.cream}
        style={{ position: 'absolute', top: 196 * k, left: PAGE_X, opacity: eb * 0.75 }}
      >
        Depuis 2021
      </Eyebrow>
      {STATS.map((s, i) => (
        <Row key={s.label} value={s.value} label={s.label} index={i} />
      ))}
      <Grain dark />
      <AbsoluteFill
        style={{ backgroundColor: C.cream, transform: `translateY(${(1 - exitWipe) * 100}%)` }}
      />
    </AbsoluteFill>
  );
};
