import { Composition } from 'remotion';
import { Teaser } from './Teaser';
import { Teaser3D, TOTAL_3D } from './Teaser3D';
import { FPS, H, TOTAL_FRAMES, W } from './theme';
import './fonts';

/*
 * Déclinaisons Instagram :
 *  - Teaser / TeaserFeed     : montage 2D v1 (validé)
 *  - Teaser3D / Teaser3DFeed : plan-séquence 2.5D cinématographique
 * 9:16 (1080×1920) = Reels + Stories ; 4:5 (1080×1350) = post feed.
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
    <Composition
      id="Teaser3D"
      component={Teaser3D}
      durationInFrames={TOTAL_3D}
      fps={FPS}
      width={W}
      height={H}
    />
    <Composition
      id="Teaser3DFeed"
      component={Teaser3D}
      durationInFrames={TOTAL_3D}
      fps={FPS}
      width={W}
      height={1350}
    />
  </>
);
