/*
 * Teaser lancement du site — montage des 7 séquences.
 * 1080×1920 @30fps, ~21 s. Voir theme.ts pour la timeline.
 */
import { AbsoluteFill, Sequence } from 'remotion';
import { DUR } from './theme';
import { LogoIntro } from './scenes/LogoIntro';
import { Hero } from './scenes/Hero';
import { Values } from './scenes/Values';
import { Typologies } from './scenes/Typologies';
import { Stats } from './scenes/Stats';
import { Announce } from './scenes/Announce';
import { Outro } from './scenes/Outro';

export const Teaser = () => {
  let at = 0;
  const seq = (dur: number) => {
    const from = at;
    at += dur;
    return from;
  };
  return (
    <AbsoluteFill>
      <Sequence from={seq(DUR.logoIntro)} durationInFrames={DUR.logoIntro} premountFor={30}>
        <LogoIntro />
      </Sequence>
      <Sequence from={seq(DUR.hero)} durationInFrames={DUR.hero}>
        <Hero />
      </Sequence>
      <Sequence from={seq(DUR.values)} durationInFrames={DUR.values}>
        <Values />
      </Sequence>
      <Sequence from={seq(DUR.typologies)} durationInFrames={DUR.typologies}>
        <Typologies />
      </Sequence>
      <Sequence from={seq(DUR.stats)} durationInFrames={DUR.stats}>
        <Stats />
      </Sequence>
      <Sequence from={seq(DUR.announce)} durationInFrames={DUR.announce}>
        <Announce />
      </Sequence>
      <Sequence from={seq(DUR.outro)} durationInFrames={DUR.outro}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
