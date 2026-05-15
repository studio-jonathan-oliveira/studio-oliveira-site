/*
 * Optimize micro-urbain typologie source images — one-shot.
 *
 * Sources brutes : src/assets/typologies/micro-urbain/*.png (4 fichiers).
 * Sortie : src/assets/typologies/micro-urbain/*.jpg compressés mozjpeg q82,
 * largeurs adaptées (1800 hero, 1400 galerie). Les PNG sources sont
 * supprimées en fin de run pour éviter qu'astro:assets sélectionne la
 * version lourde au build.
 */
import sharp from 'sharp';
import { mkdirSync, unlinkSync, existsSync } from 'node:fs';

const DIR = 'src/assets/typologies/micro-urbain';
mkdirSync(DIR, { recursive: true });

interface Variant {
  source: string;
  output: string;
  width: number;
}

const variants: Variant[] = [
  // Hero — terrasse-salon (Morgan 2026-05-15 : photo dédiée pour overlay H1
  // haut-gauche + specs en overlay bas). Source brute dans _assets/hero-source/
  // (hors index astro:assets), output dans src/assets pour import typé.
  {
    source: '_assets/hero-source/03-terrasse-salon.jpg',
    output: `${DIR}/01-hero.jpg`,
    width: 2200,
  },
  // Galerie — 3 photos en quinconce magazine. Sources brutes déjà optimisées
  // en commit précédent, on ne les retraite pas (purge déjà passée).
];

async function main() {
  for (const v of variants) {
    if (!existsSync(v.source)) {
      console.warn(`skip ${v.source} (not found)`);
      continue;
    }
    await sharp(v.source)
      .rotate()
      .resize({ width: v.width, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(v.output);
    console.log(`${v.output} ok`);
  }
  // Purge UNIQUEMENT des sources PNG dans DIR (évite qu'astro:assets indexe
  // les PNG ~10x plus lourds). Ne touche PAS aux sources brutes hors DIR
  // (_assets/hero-source/* est partagé avec d'autres pipelines).
  for (const v of variants) {
    if (v.source.startsWith(DIR) && v.source.endsWith('.png') && existsSync(v.source)) {
      unlinkSync(v.source);
      console.log(`purged ${v.source}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
