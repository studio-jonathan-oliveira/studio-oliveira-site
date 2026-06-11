/*
 * Thème du teaser — strictement dérivé de la DA du site.
 * Couleurs importées de la couche 1 (src/lib/brand-colors.ts) : aucun hex ici
 * (garde-fou scripts/check-no-hex.mjs). Easings = tokens de global.css.
 */
import { Easing } from 'remotion';
import { BRAND_COLORS } from '../../src/lib/brand-colors';

export const C = {
  cream: BRAND_COLORS.cream,
  ink: BRAND_COLORS.ink,
  violet: BRAND_COLORS.violet,
  moss: BRAND_COLORS.moss,
} as const;

/** --ease-out-editorial */
export const EO = Easing.bezier(0.16, 1, 0.3, 1);
/** --ease-in-out-editorial */
export const EIO = Easing.bezier(0.76, 0, 0.24, 1);

export const FONT_HEADING = "'Inter Variable', 'Helvetica Neue', sans-serif";
export const FONT_MONO = "'Geist Mono Variable', ui-monospace, monospace";

/** Marge latérale uniforme (équivalent --page-x à l'échelle 1080). */
export const PAGE_X = 72;

export const W = 1080;
export const H = 1920;
export const FPS = 30;

// Durées des séquences (frames @30fps)
export const DUR = {
  logoIntro: 84,
  hero: 102,
  values: 96,
  typologies: 160,
  stats: 74,
  announce: 80,
  outro: 78,
} as const;

export const TOTAL_FRAMES =
  DUR.logoIntro + DUR.hero + DUR.values + DUR.typologies + DUR.stats + DUR.announce + DUR.outro;
