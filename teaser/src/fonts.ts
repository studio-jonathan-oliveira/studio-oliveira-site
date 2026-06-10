/*
 * Fonts self-hosted du site (variables woff2) — chargées telles quelles,
 * le navigateur de rendu gère les axes (weight 100-900).
 */
import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export const fontsReady = Promise.all([
  loadFont({
    family: 'Inter Variable',
    url: staticFile('fonts/inter-variable-latin.woff2'),
    weight: '100 900',
  }),
  loadFont({
    family: 'Geist Mono Variable',
    url: staticFile('fonts/geist-mono-variable-latin.woff2'),
    weight: '100 900',
  }),
]);
