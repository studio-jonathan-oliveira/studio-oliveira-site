/*
 * S3 — Valeurs (typographie cinétique) : les 8 mots verbatim de la bande
 * valeurs de la trame home, Bold sentence case, apparition wavy en cascade
 * (pattern « apparition wavy/vague » annoté par Jonathan).
 */
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, EIO, FONT_HEADING, FONT_MONO, PAGE_X, W } from '../theme';
import { Cursor, Eyebrow, Grain, MaskLine, useK, useP } from '../ui';

const GROUP_A = ['Architecture', 'Design', 'Contexte', 'Expérientiel'];
const GROUP_B = ['Signature', 'Art de vivre', 'Vivant', 'Immersif'];
const GROUP_DUR = 48;

const WordRow = ({
  word,
  index,
  globalIndex,
  exitP,
}: {
  word: string;
  index: number;
  globalIndex: number;
  exitP: number;
}) => {
  const k = useK();
  const left = index % 2 === 0;
  const inP = useP(2 + index * 5, 22);
  return (
    <div
      style={{
        position: 'absolute',
        top: (510 + index * 270) * k,
        left: PAGE_X,
        right: PAGE_X,
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        flexDirection: left ? 'row' : 'row-reverse',
        transform: `translateY(${-70 * exitP}px)`,
        opacity: 1 - exitP,
      }}
    >
      <MaskLine delay={2 + index * 5} dur={22}>
        <div
          style={{
            fontFamily: FONT_HEADING,
            fontWeight: 700,
            fontSize: 122 * Math.min(1, k * 1.18),
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            color: C.ink,
            whiteSpace: 'nowrap',
          }}
        >
          {word}
        </div>
      </MaskLine>
      <div
        style={{
          fontFamily: FONT_MONO,
          fontWeight: 500,
          fontSize: 22,
          letterSpacing: 4,
          color: C.moss,
          opacity: inP * 0.85,
        }}
      >
        {String(globalIndex + 1).padStart(2, '0')}
      </div>
    </div>
  );
};

export const Values = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const isB = frame >= GROUP_DUR;
  const words = isB ? GROUP_B : GROUP_A;
  const exitRaw = useP(GROUP_DUR - 8, 8, EIO);
  const exitP = isB ? 0 : exitRaw;
  // Curseur violet qui parcourt la colonne de mots
  const travel = useP(isB ? GROUP_DUR + 4 : 4, 40);
  const cursorIn = useP(isB ? GROUP_DUR + 2 : 2, 10);
  return (
    <AbsoluteFill style={{ backgroundColor: C.cream }}>
      <Eyebrow
        size={24}
        style={{ position: 'absolute', top: 196 * k, width: '100%', textAlign: 'center' }}
      >
        Studio J. Oliveira
      </Eyebrow>
      {/* key force le re-render des MaskLine au changement de groupe */}
      <div key={isB ? 'B' : 'A'} style={{ position: 'absolute', inset: 0 }}>
        {words.map((w, i) => (
          <WordRow key={w} word={w} index={i} globalIndex={(isB ? 4 : 0) + i} exitP={exitP} />
        ))}
      </div>
      <Cursor
        size={26}
        fill={C.violet}
        style={{
          position: 'absolute',
          left: W / 2 - 13,
          top: (460 + travel * 850) * k,
          opacity: cursorIn,
        }}
      />
      <Grain />
    </AbsoluteFill>
  );
};
