import { Composition } from 'remotion';
import { Teaser } from './Teaser';
import { FPS, H, TOTAL_FRAMES, W } from './theme';
import './fonts';

/*
 * Deux déclinaisons Instagram de la même composition :
 *  - Teaser     : 1080×1920 (9:16) — Reels + Stories
 *  - TeaserFeed : 1080×1350 (4:5)  — post feed
 * La mise en page verticale s'adapte via useK() (ui.tsx).
 */
export const RemotionRoot = () => (
  <>
    <Composition
      id="Teaser"
      component={Teaser}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={W}
      height={H}
    />
    <Composition
      id="TeaserFeed"
      component={Teaser}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={W}
      height={1350}
    />
  </>
);
