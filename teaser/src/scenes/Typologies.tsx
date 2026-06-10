/*
 * S4 — Typologies : 4 panneaux rapides (un par typologie de jardin, images
 * réelles du site). Image en clip-reveal bas→haut + rise (pattern
 * data-clip-reveal / image-rise), liseret 1px à courbure bas-droite qui se
 * trace (tokens --stroke-liseret / --radius-liseret), nom en mask-reveal.
 */
import { AbsoluteFill, Img, Sequence, staticFile } from 'remotion';
import { C, DUR, EIO, FONT_HEADING, PAGE_X, W } from '../theme';
import { Eyebrow, Grain, MaskLine, useK, useP } from '../ui';

const TYPOLOGIES = [
  { name: 'Micro urbain', img: 'typologies/01-micro-urbain@2x.jpg' },
  { name: 'Coeur urbain', img: 'typologies/02-coeur-urbain@2x.jpg' },
  { name: 'Frange urbaine', img: 'typologies/03-frange-urbaine@2x.jpg' },
  { name: 'Domaine & Caractère', img: 'typologies/04-domaine-caractere@2x.jpg' },
];

const PANEL_DUR = DUR.typologies / TYPOLOGIES.length;
const FRAME_PAD = 18;
const FRAME_R = 48;

const Panel = ({ name, img, index }: { name: string; img: string; index: number }) => {
  const k = useK();
  const CARD = { x: 100, y: 450 * k, w: W - 200, h: 1060 * k, r: 40 };
  const reveal = useP(0, 14);
  const zoom = useP(0, PANEL_DUR);
  const draw = useP(1, 16);
  const cta = useP(8, 12);
  const fx = CARD.x - FRAME_PAD;
  const fy = CARD.y - FRAME_PAD;
  const fw = CARD.w + FRAME_PAD * 2;
  const fh = CARD.h + FRAME_PAD * 2;
  return (
    <AbsoluteFill style={{ backgroundColor: C.cream }}>
      <div
        style={{
          position: 'absolute',
          left: PAGE_X,
          right: PAGE_X,
          top: 196 * k,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <Eyebrow size={23}>Etudes par typologies de jardin</Eyebrow>
        <Eyebrow size={23} color={C.ink} tracking={4}>
          {String(index + 1).padStart(2, '0')}/04
        </Eyebrow>
      </div>

      {/* Liseret qui se trace — courbure bas-droite uniquement */}
      <svg width={W} height={1920 * k} style={{ position: 'absolute', inset: 0 }} fill="none">
        <path
          d={`M ${fx} ${fy} H ${fx + fw} V ${fy + fh - FRAME_R} Q ${fx + fw} ${fy + fh} ${fx + fw - FRAME_R} ${fy + fh} H ${fx} Z`}
          stroke={C.ink}
          strokeWidth={1}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
        />
      </svg>

      {/* Image : clip-reveal bas→haut + léger rise/scale */}
      <div
        style={{
          position: 'absolute',
          left: CARD.x,
          top: CARD.y,
          width: CARD.w,
          height: CARD.h,
          borderRadius: CARD.r,
          overflow: 'hidden',
          clipPath: `inset(${(1 - reveal) * 100}% 0 0 0)`,
        }}
      >
        <Img
          src={staticFile(img)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${1.1 - 0.04 * reveal - 0.03 * zoom}) translateY(${(1 - reveal) * 40}px)`,
          }}
        />
      </div>

      {/* Nom sur sa propre ligne (les noms longs type « Domaine & Caractère »
          étaient tronqués quand le CTA partageait la ligne), CTA en dessous. */}
      <div
        style={{
          position: 'absolute',
          left: PAGE_X,
          right: PAGE_X,
          top: CARD.y + CARD.h + 56 * k,
        }}
      >
        <MaskLine delay={4} dur={16}>
          <div
            style={{
              fontFamily: FONT_HEADING,
              fontWeight: 700,
              fontSize: 76 * Math.min(1, k * 1.18),
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              color: C.ink,
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </div>
        </MaskLine>
        <Eyebrow
          size={21}
          tracking={4}
          style={{ opacity: cta * 0.9, textAlign: 'right', marginTop: 26 * k }}
        >
          Choisir → Découvrir
        </Eyebrow>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

export const Typologies = () => {
  // Sortie : rideau ink (fond de la scène stats suivante) — même esprit que
  // le wipe beige du hero, easing in-out éditorial.
  const exitWipe = useP(DUR.typologies - 14, 12, EIO);
  return (
    <AbsoluteFill style={{ backgroundColor: C.cream }}>
      {TYPOLOGIES.map((t, i) => (
        <Sequence key={t.name} from={i * PANEL_DUR} durationInFrames={PANEL_DUR}>
          <Panel name={t.name} img={t.img} index={i} />
        </Sequence>
      ))}
      <AbsoluteFill
        style={{ backgroundColor: C.ink, transform: `translateY(${(1 - exitWipe) * 100}%)` }}
      />
    </AbsoluteFill>
  );
};
