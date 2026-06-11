/*
 * Fonts self-hosted du site (variables woff2), inlinées en data-URI
 * (fonts-data.ts) : aucun fetch réseau au rendu, donc aucun timeout de
 * delayRender possible même sous charge maximale (motion blur 3D).
 */
import { loadFont } from '@remotion/fonts';
import { GEIST_MONO_B64, INTER_VARIABLE_B64 } from './fonts-data';

export const fontsReady = Promise.all([
  loadFont({
    family: 'Inter Variable',
    url: `data:font/woff2;base64,${INTER_VARIABLE_B64}`,
    format: 'woff2',
    weight: '100 900',
  }),
  loadFont({
    family: 'Geist Mono Variable',
    url: `data:font/woff2;base64,${GEIST_MONO_B64}`,
    format: 'woff2',
    weight: '100 900',
  }),
]);
