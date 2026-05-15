/**
 * Pipeline d'optimisation des 5 images hero (refonte DA Jonathan 2026-05-15).
 *
 * Lit les sources brutes haute résolution depuis `_assets/hero-source/` (gitignored)
 * et produit des assets servables depuis `public/hero/` :
 *   - `01-villa.webp` à `05-ruelle.webp` (1920×1080, q82) = principal
 *   - `01-villa.jpg`  à `05-ruelle.jpg`  (1920×1080, mozjpeg q80) = fallback / poster
 *
 * Idempotent : à relancer quand une source est remplacée.
 *
 * Usage : pnpm tsx scripts/optimize-hero-images.ts
 */
import sharp from 'sharp';
import { readdir, mkdir, stat } from 'node:fs/promises';
import { join, parse } from 'node:path';

const SRC_DIR = '_assets/hero-source';
const OUT_DIR = 'public/hero';

// Refonte 2026-05-15 (retour Morgan : « images un peu pixelisées ») :
// double sortie 1x et 2x pour piloter srcset retina. La 2x couvre les
// écrans haute densité (laptop retina, iPad Pro, 4K desktop) sans pénaliser
// les écrans 1080p qui ne chargent que la 1x. Position bottom center à la
// requête Jonathan (cadrage bas-centré la plupart du temps).
const VARIANTS = [
  { suffix: '', width: 1920, height: 1080, quality: 86 }, // 1x baseline
  { suffix: '@2x', width: 3840, height: 2160, quality: 80 }, // 2x retina
];

await mkdir(OUT_DIR, { recursive: true });

const files = (await readdir(SRC_DIR))
  .filter((f) => /^0[1-5]-.*\.(jpg|jpeg|JPEG|JPG|png|PNG)$/.test(f))
  .sort();

if (files.length === 0) {
  console.error(`Aucune image source dans ${SRC_DIR}/ (attendu : 01-*.jpg à 05-*.jpg).`);
  process.exit(1);
}

let totalAfter = 0;

for (const file of files) {
  const srcPath = join(SRC_DIR, file);
  await stat(srcPath); // valider l'existence — la taille brute n'est plus reportée.

  const { name } = parse(file);
  const baseName = name.toLowerCase();

  for (const v of VARIANTS) {
    const pipeline = sharp(srcPath).resize(v.width, v.height, {
      fit: 'cover',
      position: 'attention', // crop intelligent autour du sujet principal
    });

    const webp = await pipeline.clone().webp({ quality: v.quality, effort: 5 }).toBuffer();
    const jpeg = await pipeline
      .clone()
      .jpeg({ quality: v.quality - 2, mozjpeg: true, progressive: true })
      .toBuffer();

    const webpPath = join(OUT_DIR, `${baseName}${v.suffix}.webp`);
    const jpegPath = join(OUT_DIR, `${baseName}${v.suffix}.jpg`);
    await sharp(webp).toFile(webpPath);
    await sharp(jpeg).toFile(jpegPath);

    totalAfter += webp.byteLength + jpeg.byteLength;
    console.log(
      `✓ ${file}${v.suffix} → ${Math.round(webp.byteLength / 1024)} KB webp + ${Math.round(jpeg.byteLength / 1024)} KB jpg`,
    );
  }
}

const totalAfterMB = Math.round((totalAfter / 1024 / 1024) * 10) / 10;
console.log(
  `\nTotal : ${files.length} hero images × ${VARIANTS.length} variants × 2 formats = ${totalAfterMB} MB.`,
);
