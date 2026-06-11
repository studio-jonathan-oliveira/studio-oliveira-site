/*
 * S6 — Annonce + CTA : « Le nouveau site est en ligne. » puis la pill
 * « Démarrer un projet » (topbar de la trame) : noire au repos, le curseur
 * signature la rejoint (magnetic) et au clic elle passe VIOLET texte noir —
 * exactement les 3 états topbar annotés par Jonathan.
 */
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, DUR, EIO, FONT_HEADING, W } from '../theme';
import { Cursor, Eyebrow, Grain, MaskLine, useK, useP } from '../ui';

const CLICK_AT = 58;
const PILL_W = 600;
const PILL_H = 116;
const PILL_Y = 1210;

export const Announce = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const url = useP(22, 18);
  // Sortie : rideau ink vers l'outro
  const exitWipe = useP(DUR.announce - 14, 12, EIO);
  const pillIn = spring({ frame: frame - 30, fps, config: { damping: 16, mass: 0.9 } });
  const move = useP(34, 26);
  const cursorIn = useP(32, 10);
  const clicked = frame >= CLICK_AT;
  // squash de clic : dip rapide puis retour élastique
  const clickSpring = spring({ frame: frame - CLICK_AT, fps, config: { damping: 11, mass: 0.6 } });
  const squash = clicked ? 0.95 + 0.05 * clickSpring : 1;

  const pillX = W / 2 - PILL_W / 2;
  const pillTop = PILL_Y * k + (1 - pillIn) * 110;
  const cursorX = W - 150 + (pillX + PILL_W - 36 - (W - 150)) * move;
  const cursorStartY = 1640 * k;
  const cursorY = cursorStartY + (pillTop + PILL_H - 30 - cursorStartY) * move;

  return (
    <AbsoluteFill style={{ backgroundColor: C.cream }}>
      <div style={{ position: 'absolute', top: 700 * k, width: '100%', textAlign: 'center' }}>
        <MaskLine delay={4} dur={24}>
          <div style={{ fontFamily: FONT_HEADING, fontWeight: 200, fontSize: 96, color: C.ink }}>
            Le nouveau site
          </div>
        </MaskLine>
        <MaskLine delay={10} dur={24}>
          <div
            style={{
              fontFamily: FONT_HEADING,
              fontWeight: 700,
              fontSize: 96,
              letterSpacing: '-0.02em',
              color: C.ink,
            }}
          >
            est en ligne.
          </div>
        </MaskLine>
        <Eyebrow size={25} style={{ marginTop: 56, opacity: url, display: 'inline-block' }}>
          www.jonathanoliveira.fr
        </Eyebrow>
      </div>

      <div
        style={{
          position: 'absolute',
          left: pillX,
          top: pillTop,
          width: PILL_W,
          height: PILL_H,
          borderRadius: PILL_H / 2,
          backgroundColor: clicked ? C.violet : C.ink,
          color: clicked ? C.ink : C.cream,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT_HEADING,
          fontWeight: 700,
          fontSize: 42,
          opacity: Math.min(1, pillIn * 1.4),
          transform: `scale(${squash})`,
        }}
      >
        Démarrer un projet
      </div>

      <Cursor
        size={56}
        fill={C.ink}
        dotFill={clicked ? C.violet : C.ink}
        style={{
          position: 'absolute',
          left: cursorX,
          top: cursorY,
          opacity: cursorIn,
        }}
      />
      <Grain />
      <AbsoluteFill
        style={{ backgroundColor: C.ink, transform: `translateY(${(1 - exitWipe) * 100}%)` }}
      />
    </AbsoluteFill>
  );
};
