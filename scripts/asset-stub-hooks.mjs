/*
 * Hook de résolution ESM : neutralise les imports d'images (`.png`, `.webp`…).
 *
 * `src/data/mock-projects.ts` importe des assets image en modules (résolus par
 * Vite dans Astro). Hors Astro (seed lancé par tsx/node), Node ne sait pas
 * charger un `.png` → crash `ERR_UNKNOWN_FILE_EXTENSION`. Le seed n'utilise que
 * les métadonnées (titres, slugs, alt…) et uploade les images via des chemins
 * disque (`projectAssetMap`), jamais via ces modules → on peut les stubber en
 * `export default {}` sans rien perdre.
 */

const IMAGE_RE = /\.(png|jpe?g|webp|avif|gif|svg)(\?.*)?$/i;

export async function resolve(specifier, context, next) {
  if (IMAGE_RE.test(specifier)) {
    return {
      url: 'data:text/javascript,export default {}',
      shortCircuit: true,
    };
  }
  return next(specifier, context);
}
