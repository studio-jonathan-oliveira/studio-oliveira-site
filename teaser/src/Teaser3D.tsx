/*
 * Teaser 2.5D cinématographique — plan-séquence continu (demande Morgan).
 *
 * Concept « le site comme espace » : chaque séquence du storyboard validé
 * devient une station physique (cards, photos, murs typo) posée dans un
 * monde CSS 3D. Une caméra virtuelle voyage de station en station sans
 * aucune coupe : push-in logo, dolly vers le hero, traversée en profondeur
 * du couloir des 8 valeurs, travelling le long de la galerie typologies,
 * mur des stats, annonce + clic, pull-back final sur l'outro.
 *
 * Cinématique douce : rotations ≤ 9°, déplacements easés EIO, micro-dérive
 * « handheld » permanente (core.tsx), fausse profondeur de champ (blur par
 * distance focale), motion blur multi-échantillons (@remotion/motion-blur).
 */
import { Fragment } from 'react';
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  interpolateColors,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { CameraMotionBlur } from '@remotion/motion-blur';
import { C, FONT_HEADING } from './theme';
import { Cursor, Eyebrow, Grain, MaskLine } from './ui';
import type { CamKey, Pose } from './three/core';
import { P, PERSP, Plane, World, camSpace, cameraAt, pose, restPose } from './three/core';

/* ───────────────────────── Timeline (frames @30fps, 30 s) ────────────── */
const T = {
  logo: 0, // la vidéo logo se trace, push-in lent
  heroTravel: 86,
  hero: 104,
  corridorTravel: 192,
  corridor: 210, // traversée des 8 valeurs
  corridorEnd: 344,
  g: [362, 420, 478, 536], // galerie typologies (4 stations)
  statsTravel: 578,
  stats: 598,
  annonceTravel: 678,
  annonce: 698,
  click: 760,
  outroTravel: 800,
  outro: 822,
} as const;
export const TOTAL_3D = 900;

/* ───────────────────────── Monde : positions des stations ────────────── */
const HERO = { x: 520, y: 0, z: -2600, ry: -9 };
const WORDS = [
  'Architecture',
  'Design',
  'Contexte',
  'Expérientiel',
  'Signature',
  'Art de vivre',
  'Vivant',
  'Immersif',
];
// Espacement profond (700px) : un seul mot dans la zone de lecture à la
// fois, les voisins existent en amorce floue (parallaxe) sans s'empiler.
const wordPose = (i: number) =>
  pose({
    x: i % 2 === 0 ? -240 : 240,
    y: i % 2 === 0 ? -48 : 42,
    z: -4300 - i * 500,
    ry: i % 2 === 0 ? 7 : -7,
  });
const TYPOLOGIES = [
  { name: 'Micro urbain', img: 'typologies/01-micro-urbain@2x.jpg' },
  { name: 'Coeur urbain', img: 'typologies/02-coeur-urbain@2x.jpg' },
  { name: 'Frange urbaine', img: 'typologies/03-frange-urbaine@2x.jpg' },
  { name: 'Domaine & Caractère', img: 'typologies/04-domaine-caractere@2x.jpg' },
];
const GALLERY_Z = -8950;
const cardPose = (i: number) =>
  pose({ x: i % 2 === 0 ? 145 : -145, z: GALLERY_Z - i * 560, ry: i % 2 === 0 ? -6 : 6 });
const STATS_POS = { z: -11550 };
const ANNONCE_POS = { z: -13150 };
const OUTRO_POS = { z: -14750 };

/* ───────────────────────── Trajectoire caméra ────────────────────────── */
const camKeys: CamKey[] = [
  { f: 0, p: pose({ z: 1760 }) },
  { f: T.heroTravel, p: pose({ z: 1600 }) },
  { f: T.hero, p: restPose(HERO.x, HERO.y, HERO.z, HERO.ry, 0, 1760) },
  { f: T.corridorTravel, p: restPose(HERO.x, HERO.y, HERO.z, HERO.ry, 0, 1560) },
  // Couloir des valeurs — serpentin doux
  { f: T.corridor, p: pose({ z: -2780 }) },
  { f: 243, p: pose({ x: 45, z: -4600, ry: -3, rz: 1 }) },
  { f: 276, p: pose({ x: -45, y: 12, z: -6000, ry: 3, rz: -1 }) },
  { f: 310, p: pose({ x: 38, y: -8, z: -7300, ry: -2.5, rz: 0.8 }) },
  { f: T.corridorEnd, p: pose({ z: -8250 }) },
  // Galerie typologies — arrêt face à chaque carte
  ...TYPOLOGIES.map((_, i) => {
    const c = cardPose(i);
    return [
      { f: T.g[i]!, p: restPose(c.x, c.y, c.z, c.ry, 0, 1880) },
      { f: T.g[i]! + 42, p: restPose(c.x, c.y, c.z, c.ry, 0, 1730) },
    ];
  }).flat(),
  // Stats — légère plongée qui se redresse
  { f: T.stats, p: restPose(0, 0, STATS_POS.z + 140, 0, -2, 1650) },
  { f: T.annonceTravel, p: restPose(0, 0, STATS_POS.z + 140, 0, 0, 1500) },
  // Annonce — cadrage frontal calme
  { f: T.annonce, p: restPose(0, 0, ANNONCE_POS.z, 0, 0, 1640) },
  { f: T.outroTravel, p: restPose(0, 0, ANNONCE_POS.z, 0, 0, 1540) },
  // Outro — arrivée proche puis pull-back contemplatif
  { f: T.outro, p: restPose(0, -10, OUTRO_POS.z, 0, 0, 1460) },
  { f: TOTAL_3D, p: restPose(0, 10, OUTRO_POS.z, 0, 0, 1700) },
];

/** Fausse profondeur de champ — net à la distance focale PERSP. */
const dof = (fwd: number, soft = 480, max = 4.5) =>
  Math.min(max, Math.max(0, Math.abs(fwd - PERSP) / soft - 0.25));

/* ───────────────────────── Stations ──────────────────────────────────── */

const LogoStation = ({ frame }: { frame: number }) => {
  const fade = 1 - P(frame, T.heroTravel + 4, 12);
  const eb = P(frame, 46, 24);
  const meta = P(frame, 56, 20);
  return (
    <Plane w={1040} h={1640} opacity={fade} style={{ borderRadius: 40 }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 40,
          backgroundColor: C.cream,
          border: `1px solid ${C.ink}26`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 980,
            transform: 'translate(-50%, -50%)',
            mixBlendMode: 'multiply',
          }}
        >
          <Sequence from={0} durationInFrames={88} layout="none">
            {/* Proxy 1080p : la source 4K saturait l'extracteur vidéo sous
                motion blur multi-échantillons (10 seeks/frame) */}
            <OffthreadVideo
              src={staticFile('brand/logo-animation-1080p.mp4')}
              muted
              playbackRate={1.45}
              style={{ width: '100%', display: 'block' }}
            />
          </Sequence>
        </div>
        <Eyebrow
          size={24}
          color={C.ink}
          style={{
            position: 'absolute',
            top: 150,
            width: '100%',
            textAlign: 'center',
            opacity: eb,
            letterSpacing: 26 - 20 * eb,
          }}
        >
          Studio J. Oliveira
        </Eyebrow>
        <Eyebrow
          size={20}
          color={C.moss}
          style={{
            position: 'absolute',
            bottom: 140,
            width: '100%',
            textAlign: 'center',
            opacity: meta * 0.9,
          }}
        >
          Nouveau site — 2026
        </Eyebrow>
      </div>
    </Plane>
  );
};

const HeroStation = ({ frame, cam }: { frame: number; cam: Pose }) => {
  const cs = camSpace(HERO.x, HERO.y, HERO.z, cam);
  const zoom = P(frame, T.hero, 120);
  // Cluster texte en avant du plan photo (parallaxe réelle au dolly)
  const RAD = Math.PI / 180;
  const fx = Math.sin(HERO.ry * RAD) * 150;
  const fz = Math.cos(HERO.ry * RAD) * 150;
  return (
    <>
      <Plane
        x={HERO.x}
        y={HERO.y}
        z={HERO.z}
        ry={HERO.ry}
        w={1400}
        h={2240}
        blur={frame < T.corridor ? 0 : dof(cs.forward)}
        style={{ borderRadius: 44, overflow: 'hidden' }}
      >
        <Img
          src={staticFile('hero/01-image@2x.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${1.1 - 0.07 * zoom})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to bottom, ${C.ink}14 0%, transparent 38%, ${C.ink}b8 100%)`,
          }}
        />
      </Plane>
      <Plane x={HERO.x + fx} y={210} z={HERO.z + fz} ry={HERO.ry} w={960} h={700}>
        <Eyebrow
          size={25}
          color={C.cream}
          style={{ opacity: P(frame, T.hero + 8, 20), marginBottom: 30 }}
        >
          Design immersif &amp; expérientiel
        </Eyebrow>
        <MaskLine delay={T.hero + 4} dur={26}>
          <div
            style={{
              fontFamily: FONT_HEADING,
              fontWeight: 200,
              fontSize: 100,
              lineHeight: 1.06,
              color: C.cream,
            }}
          >
            Studio
          </div>
        </MaskLine>
        <MaskLine delay={T.hero + 11} dur={28}>
          <div
            style={{
              fontFamily: FONT_HEADING,
              fontWeight: 200,
              fontSize: 148,
              lineHeight: 1.05,
              color: C.cream,
              whiteSpace: 'nowrap',
            }}
          >
            J. Oliveira
          </div>
        </MaskLine>
      </Plane>
    </>
  );
};

const ValuesCorridor = ({ cam }: { cam: Pose }) => (
  <>
    {WORDS.map((w, i) => {
      const wp = wordPose(i);
      const cs = camSpace(wp.x, wp.y, wp.z, cam);
      // Zone de lecture : le mot naît en profondeur (fwd 2400) et s'éteint
      // avant de devenir géant (fwd 450) — jamais d'empilement illisible.
      const farIn = Math.min(1, Math.max(0, (2400 - cs.forward) / 600));
      const nearOut = Math.min(1, Math.max(0, (cs.forward - 600) / 250));
      const left = i % 2 === 0;
      return (
        <Plane
          key={w}
          {...wp}
          w={920}
          h={240}
          opacity={farIn * nearOut}
          blur={dof(cs.forward, 600, 3)}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: left ? 'row' : 'row-reverse',
              alignItems: 'baseline',
              gap: 30,
              justifyContent: 'flex-start',
            }}
          >
            <div
              style={{
                fontFamily: FONT_HEADING,
                fontWeight: 700,
                fontSize: 132,
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
                color: C.ink,
                whiteSpace: 'nowrap',
              }}
            >
              {w}
            </div>
            <Eyebrow size={22} color={C.moss} tracking={4}>
              {String(i + 1).padStart(2, '0')}
            </Eyebrow>
          </div>
        </Plane>
      );
    })}
    {/* Curseur violet flottant au milieu du couloir */}
    <Plane x={0} y={170} z={-6050} w={60} h={60} opacity={0.95}>
      <Cursor size={30} fill={C.violet} />
    </Plane>
  </>
);

const Gallery = ({ frame, cam }: { frame: number; cam: Pose }) => (
  <>
    {TYPOLOGIES.map((t, i) => {
      const cp = cardPose(i);
      const cs = camSpace(cp.x, cp.y, cp.z, cam);
      const arrive = T.g[i]!;
      // La carte se dissout au départ du travelling — sinon elle resterait
      // physiquement entre la caméra et la carte suivante (même axe).
      const exitFade = 1 - P(frame, i < 3 ? arrive + 46 : T.statsTravel + 6, 14);
      const RAD = Math.PI / 180;
      const fx = Math.sin(cp.ry * RAD) * 130;
      const fz = Math.cos(cp.ry * RAD) * 130;
      return (
        // Fragment impératif : un nœud DOM intermédiaire non-transformé
        // aplatirait le preserve-3d et projetterait les plans à z=0.
        <Fragment key={t.name}>
          <Plane
            {...cp}
            w={880}
            h={1100}
            opacity={exitFade}
            blur={dof(cs.forward, 650, 3.5)}
            style={{ borderRadius: 40, overflow: 'hidden', border: `1px solid ${C.ink}33` }}
          >
            <Img
              src={staticFile(t.img)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Plane>
          {/* Cartels flottants au-dessus / en-dessous de la carte (parallaxe) */}
          <Plane x={cp.x + fx} y={-625} z={cp.z + fz} ry={cp.ry} w={800} h={90} opacity={exitFade}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Eyebrow size={19} style={{ opacity: P(frame, arrive + 4, 12) * 0.95 }}>
                Etudes par typologies de jardin
              </Eyebrow>
              <Eyebrow
                size={19}
                color={C.ink}
                tracking={4}
                style={{ opacity: P(frame, arrive + 6, 12) }}
              >
                {String(i + 1).padStart(2, '0')}/04
              </Eyebrow>
            </div>
          </Plane>
          <Plane x={cp.x + fx} y={668} z={cp.z + fz} ry={cp.ry} w={800} h={200} opacity={exitFade}>
            <MaskLine delay={arrive + 4} dur={16}>
              <div
                style={{
                  fontFamily: FONT_HEADING,
                  fontWeight: 700,
                  fontSize: 62,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.05,
                  color: C.ink,
                  whiteSpace: 'nowrap',
                }}
              >
                {t.name}
              </div>
            </MaskLine>
            <Eyebrow
              size={19}
              tracking={4}
              style={{
                opacity: P(frame, arrive + 10, 12) * 0.9,
                textAlign: 'right',
                marginTop: 16,
              }}
            >
              Choisir → Découvrir
            </Eyebrow>
          </Plane>
        </Fragment>
      );
    })}
  </>
);

const STATS = [
  { value: 10, label: 'études' },
  { value: 10, label: 'ans' },
  { value: 3, label: 'régions' },
];

const StatsWall = ({ frame }: { frame: number }) => (
  <>
    <Plane z={STATS_POS.z - 160} w={3400} h={2600} style={{ backgroundColor: C.ink }} />
    <Plane y={-560} z={STATS_POS.z + 60} w={900} h={70}>
      <Eyebrow
        size={23}
        color={C.cream}
        style={{ textAlign: 'center', width: '100%', opacity: P(frame, T.stats, 16) * 0.75 }}
      >
        Depuis 2021
      </Eyebrow>
    </Plane>
    {STATS.map((s, i) => {
      const delay = T.stats + 2 + i * 10;
      const reveal = P(frame, delay, 22);
      const count = Math.round(P(frame, delay + 2, 16) * s.value);
      return (
        <Plane
          key={s.label}
          x={-30}
          y={-300 + i * 320}
          z={STATS_POS.z + 140 - i * 130}
          w={940}
          h={300}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 34 }}>
            <MaskLine delay={delay} dur={22}>
              <div
                style={{
                  fontFamily: FONT_HEADING,
                  fontWeight: 200,
                  fontSize: 212,
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
                  fontSize: 70,
                  letterSpacing: '-0.02em',
                  color: C.cream,
                }}
              >
                {s.label}
              </div>
            </MaskLine>
          </div>
          <div
            style={{
              marginTop: 26,
              height: 1,
              backgroundColor: C.cream,
              opacity: reveal * 0.26,
              transform: `scaleX(${reveal})`,
              transformOrigin: 'left',
            }}
          />
        </Plane>
      );
    })}
  </>
);

const AnnonceWall = ({ frame }: { frame: number }) => {
  const { fps } = useVideoConfig();
  const url = P(frame, T.annonce + 18, 18);
  const pillIn = spring({
    frame: frame - (T.annonce + 26),
    fps,
    config: { damping: 16, mass: 0.9 },
  });
  const move = P(frame, T.annonce + 30, 26);
  const clicked = frame >= T.click;
  const clickSpring = spring({ frame: frame - T.click, fps, config: { damping: 11, mass: 0.6 } });
  const squash = clicked ? 0.95 + 0.05 * clickSpring : 1;
  const pillW = 580;
  const pillH = 112;
  const pillTop = 700 + (1 - pillIn) * 110;
  const cursorX = 880 + (540 + pillW / 2 - 50 - 880) * move;
  const cursorY = 1080 + (pillTop + pillH - 26 - 1080) * move;
  return (
    <Plane z={ANNONCE_POS.z} w={1080} h={1200}>
      <div style={{ position: 'absolute', top: 130, width: '100%', textAlign: 'center' }}>
        <MaskLine delay={T.annonce + 2} dur={24}>
          <div style={{ fontFamily: FONT_HEADING, fontWeight: 200, fontSize: 94, color: C.ink }}>
            Le nouveau site
          </div>
        </MaskLine>
        <MaskLine delay={T.annonce + 8} dur={24}>
          <div
            style={{
              fontFamily: FONT_HEADING,
              fontWeight: 700,
              fontSize: 94,
              letterSpacing: '-0.02em',
              color: C.ink,
            }}
          >
            est en ligne.
          </div>
        </MaskLine>
        <Eyebrow size={24} style={{ marginTop: 50, opacity: url, display: 'inline-block' }}>
          www.jonathanoliveira.fr
        </Eyebrow>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 540 - pillW / 2,
          top: pillTop,
          width: pillW,
          height: pillH,
          borderRadius: pillH / 2,
          backgroundColor: clicked ? C.violet : C.ink,
          color: clicked ? C.ink : C.cream,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT_HEADING,
          fontWeight: 700,
          fontSize: 41,
          opacity: Math.min(1, pillIn * 1.4),
          transform: `scale(${squash})`,
        }}
      >
        Démarrer un projet
      </div>
      <div
        style={{
          position: 'absolute',
          left: cursorX,
          top: cursorY,
          opacity: P(frame, T.annonce + 28, 10),
        }}
      >
        <Cursor size={54} fill={C.ink} dotFill={clicked ? C.violet : C.ink} />
      </div>
    </Plane>
  );
};

const OutroWall = ({ frame }: { frame: number }) => {
  const p = P(frame, T.outro + 2, 28);
  const eb = P(frame, T.outro + 18, 22);
  const credit = P(frame, T.outro + 30, 22);
  return (
    <>
      <Plane z={OUTRO_POS.z - 160} w={3400} h={2600} style={{ backgroundColor: C.ink }} />
      <Plane z={OUTRO_POS.z} w={1080} h={1240}>
        <div
          style={{
            position: 'absolute',
            top: 300,
            left: '50%',
            transform: `translate(-50%, -50%) scale(${1.1 - 0.1 * p})`,
            opacity: p,
            filter: p < 0.97 ? `blur(${(1 - p) * 7}px)` : undefined,
          }}
        >
          <Img
            src={staticFile('brand/wordmark-cream.png')}
            style={{ width: 720, display: 'block' }}
          />
        </div>
        <Eyebrow
          size={26}
          color={C.cream}
          style={{
            position: 'absolute',
            top: 520,
            width: '100%',
            textAlign: 'center',
            opacity: eb,
            letterSpacing: 19 - 13 * eb,
          }}
        >
          www.jonathanoliveira.fr
        </Eyebrow>
        <Eyebrow
          size={18}
          color={C.cream}
          tracking={3.5}
          style={{
            position: 'absolute',
            top: 1060,
            width: '100%',
            textAlign: 'center',
            opacity: eb * 0.5,
          }}
        >
          Studio J. Oliveira — Design immersif &amp; expérientiel
        </Eyebrow>
        <Eyebrow
          size={20}
          color={C.cream}
          tracking={3}
          style={{
            position: 'absolute',
            top: 1140,
            right: 72,
            opacity: credit * 0.75,
            transform: `translateY(${(1 - credit) * 12}px)`,
          }}
        >
          Designed &amp; created by Studio Margerit
        </Eyebrow>
      </Plane>
    </>
  );
};

/* ───────────────────────── Assemblage ────────────────────────────────── */

const BG_FRAMES = [
  0,
  T.heroTravel,
  T.hero,
  T.corridorTravel,
  T.corridor,
  T.statsTravel,
  T.stats,
  T.annonceTravel,
  T.annonce,
  T.outroTravel,
  T.outro,
];
const BG_COLORS = [
  C.cream,
  C.cream,
  C.ink,
  C.ink,
  C.cream,
  C.cream,
  C.ink,
  C.ink,
  C.cream,
  C.cream,
  C.ink,
];

const Scene3D = () => {
  const frame = useCurrentFrame();
  const cam = cameraAt(frame, camKeys);
  const bg = interpolateColors(frame, BG_FRAMES as unknown as number[], BG_COLORS);
  return (
    <AbsoluteFill style={{ backgroundColor: bg, perspective: PERSP, overflow: 'hidden' }}>
      <World cam={cam}>
        {frame < T.hero + 20 && <LogoStation frame={frame} />}
        {frame >= T.logo + 70 && frame < T.corridor + 40 && <HeroStation frame={frame} cam={cam} />}
        {frame >= T.corridorTravel && frame < T.corridorEnd + 40 && <ValuesCorridor cam={cam} />}
        {frame >= T.corridorEnd - 30 && frame < T.statsTravel + 30 && (
          <Gallery frame={frame} cam={cam} />
        )}
        {frame >= T.statsTravel - 10 && frame < T.annonceTravel + 30 && <StatsWall frame={frame} />}
        {frame >= T.annonceTravel - 10 && frame < T.outroTravel + 30 && (
          <AnnonceWall frame={frame} />
        )}
        {frame >= T.outroTravel - 10 && <OutroWall frame={frame} />}
      </World>
    </AbsoluteFill>
  );
};

export const Teaser3D = () => {
  const frame = useCurrentFrame();
  const dark =
    (frame >= T.hero && frame < T.corridor) ||
    (frame >= T.stats && frame < T.annonce) ||
    frame >= T.outro;
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <CameraMotionBlur shutterAngle={230} samples={10}>
        <Scene3D />
      </CameraMotionBlur>
      {/* Optique : vignette + grain par-dessus le monde (jamais bluré) */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: `radial-gradient(ellipse 110% 105% at 50% 48%, transparent 62%, ${C.ink}30 100%)`,
        }}
      />
      <Grain dark={dark} />
    </AbsoluteFill>
  );
};
