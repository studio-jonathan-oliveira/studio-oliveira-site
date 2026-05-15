/*
 * Optimize studio source images — one-shot script.
 * Lit _assets/studio/*.jpg (sources Jonathan brutes), produit des versions
 * compressées dans src/assets/studio/ pour import via astro:assets.
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

mkdirSync('src/assets/studio', { recursive: true });

async function main() {
  await sharp('_assets/studio/01-hero.jpg')
    .rotate()
    .resize({ width: 1800, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile('src/assets/studio/01-hero.jpg');
  console.log('01-hero.jpg ok');

  await sharp('_assets/studio/02-parcours.jpg')
    .rotate()
    .resize({ width: 1400, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile('src/assets/studio/02-parcours.jpg');
  console.log('02-parcours.jpg ok');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
