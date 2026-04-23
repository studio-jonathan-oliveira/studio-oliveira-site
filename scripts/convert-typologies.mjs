/**
 * Conversion 1 image par typologie (frame hero Twinmotion) → WebP optimisé.
 * Cible : src/assets/typologies/*.webp pour le scrollytelling home.
 *
 * Micro-urbain : GAP identifié (pas d'asset disponible) → jungle-room en fallback
 * visuel évocateur (intérieur-extérieur, scale verticale).
 */
import sharp from 'sharp';
import { mkdirSync } from 'fs';

const sources = {
  'coeur-urbain': '_brief/client-assets/photos-projets/Coeur urbain - parenthese exotique/Image1_010.png',
  'frange-urbaine': '_brief/client-assets/photos-projets/Frange urbaine - restanque correzienne/Image4_002.png',
  'domaine-caractere': '_brief/client-assets/photos-projets/Provence correzienne - Domaine et caracteres/terrasse day_008.png',
  'micro-urbain': '_brief/client-assets/photos-projets/jungle-room/3.png',
};

const outDir = 'src/assets/typologies';
mkdirSync(outDir, { recursive: true });

for (const [slug, src] of Object.entries(sources)) {
  const output = `${outDir}/${slug}.webp`;
  const meta = await sharp(src)
    .resize(2400, 1600, { fit: 'cover', position: 'center' })
    .webp({ quality: 82, effort: 5 })
    .toFile(output);
  console.log(`✓ ${slug} (${(meta.size / 1024).toFixed(0)} kB)`);
}
