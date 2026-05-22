/**
 * Pipeline d'optimisation des images hero.
 *
 * Lit les sources brutes haute résolution depuis `_assets/hero-source/` (gitignored)
 * et produit des assets servables depuis `public/hero/` :
 *   - `<slug>.webp` (1920×1080, q86) = principal
 *   - `<slug>.jpg`  (1920×1080, mozjpeg q84) = fallback / poster
 *   - `<slug>@2x.{webp,jpg}` (3840×2160, q80) = retina
 *
 * Nommage source attendu : `01-<slug>.jpg` ... `99-<slug>.jpg`. Refonte
 * 2026-05-22 : la regex acceptait `01-05` (limite refonte 2026-05-15),
 * relâchée pour supporter 6+ slides (Morgan a fourni 6 photos hero).
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

const VARIANTS = [
  { suffix: '', width: 1920, height: 1080, quality: 86 }, // 1x baseline
  { suffix: '@2x', width: 3840, height: 2160, quality: 80 }, // 2x retina
];

// Position du crop par fichier (refonte v8 2026-05-15 retour Morgan :
// « on voit trop le haut, pas assez le bas » sur 01-villa). 'south' force
// le crop sharp à conserver le bas de l'image source.
type SharpPosition = 'attention' | 'centre' | 'south' | 'east' | 'north';
const POSITION_BY_FILE: Record<string, SharpPosition> = {
  '01-villa': 'south',
  '02-cypres': 'attention',
  '03-terrasse-salon': 'attention',
  '04-pergola-palmiers': 'attention',
  '05-ruelle': 'attention',
};

await mkdir(OUT_DIR, { recursive: true });

const files = (await readdir(SRC_DIR))
  .filter((f) => /^\d{2}-.*\.(jpg|jpeg|JPEG|JPG|png|PNG)$/.test(f))
  .sort();

if (files.length === 0) {
  console.error(`Aucune image source dans ${SRC_DIR}/ (attendu : 01-*.jpg, 02-*.jpg, ...).`);
  process.exit(1);
}

let totalAfter = 0;

for (const file of files) {
  const srcPath = join(SRC_DIR, file);
  await stat(srcPath); // valider l'existence — la taille brute n'est plus reportée.

  const { name } = parse(file);
  const baseName = name.toLowerCase();

  const position = POSITION_BY_FILE[baseName] ?? 'attention';
  for (const v of VARIANTS) {
    const pipeline = sharp(srcPath).resize(v.width, v.height, {
      fit: 'cover',
      position,
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
