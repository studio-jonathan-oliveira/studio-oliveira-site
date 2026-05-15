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
const WIDTH = 1920;
const HEIGHT = 1080;

await mkdir(OUT_DIR, { recursive: true });

const files = (await readdir(SRC_DIR))
  .filter((f) => /^0[1-5]-.*\.(jpg|jpeg|JPEG|JPG|png|PNG)$/.test(f))
  .sort();

if (files.length === 0) {
  console.error(`Aucune image source dans ${SRC_DIR}/ (attendu : 01-*.jpg à 05-*.jpg).`);
  process.exit(1);
}

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const srcPath = join(SRC_DIR, file);
  const before = (await stat(srcPath)).size;
  totalBefore += before;

  const { name } = parse(file);
  const baseName = name.toLowerCase();

  const pipeline = sharp(srcPath).resize(WIDTH, HEIGHT, {
    fit: 'cover',
    position: 'center',
  });

  const webp = await pipeline.clone().webp({ quality: 82, effort: 5 }).toBuffer();
  const jpeg = await pipeline
    .clone()
    .jpeg({ quality: 80, mozjpeg: true, progressive: true })
    .toBuffer();

  const webpPath = join(OUT_DIR, `${baseName}.webp`);
  const jpegPath = join(OUT_DIR, `${baseName}.jpg`);
  await sharp(webp).toFile(webpPath);
  await sharp(jpeg).toFile(jpegPath);

  totalAfter += webp.byteLength + jpeg.byteLength;
  console.log(
    `✓ ${file} : ${Math.round(before / 1024)} KB → ${Math.round(webp.byteLength / 1024)} KB webp + ${Math.round(jpeg.byteLength / 1024)} KB jpg`,
  );
}

const savedKB = Math.round((totalBefore - totalAfter) / 1024);
console.log(`\nTotal : -${savedKB} KB sur les 5 hero images (${files.length} traitées).`);
