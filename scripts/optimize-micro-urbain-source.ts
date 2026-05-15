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
  // Hero — photo 01 (entrée). Largeur généreuse pour overlay H1 full-bleed.
  { source: `${DIR}/01-entree.png`, output: `${DIR}/01-hero.jpg`, width: 1800 },
  // Galerie — 3 photos en quinconce magazine. 02-details = format large.
  { source: `${DIR}/02-details.png`, output: `${DIR}/02-large.jpg`, width: 1600 },
  // 03/04 = format moyen, juxtaposées en row asymétrique.
  { source: `${DIR}/03-vue.png`, output: `${DIR}/03-row-left.jpg`, width: 1200 },
  { source: `${DIR}/04-vue.png`, output: `${DIR}/04-row-right.jpg`, width: 1200 },
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
  // Purge des sources PNG une fois les JPG produits — évite qu'astro:assets
  // les indexe (PNG = ~10x plus lourds).
  for (const v of variants) {
    if (existsSync(v.source)) {
      unlinkSync(v.source);
      console.log(`purged ${v.source}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
