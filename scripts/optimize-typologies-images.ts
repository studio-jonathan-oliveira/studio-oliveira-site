/**
 * Pipeline d'optimisation des 5 images typologies (refonte DA Jonathan
 * 2026-05-15). Sources brutes : `_assets/typologies-source/0[1-5]-*.{jpg,jpeg}`.
 *
 * Sorties : `public/typologies/0[1-5]-{slug}.{webp,jpg}` en 2 variants 1x/2x.
 *   - 1x = 900×900 (card carrée)
 *   - 2x = 1800×1800
 *
 * Le cadrage est cover + position attention (sujet principal centré bas).
 * Idempotent.
 *
 * Usage : pnpm tsx scripts/optimize-typologies-images.ts
 */
import sharp from 'sharp';
import { mkdir, readdir, stat } from 'node:fs/promises';
import { join, parse } from 'node:path';

const SRC_DIR = '_assets/typologies-source';
const OUT_DIR = 'public/typologies';

const VARIANTS = [
  { suffix: '', size: 900, quality: 86 },
  { suffix: '@2x', size: 1800, quality: 80 },
];

// Position du crop par fichier (retour Morgan 2026-05-15) :
//   - 02-coeur-urbain : 'south' → voir depuis le bas de l'image
//   - 04-domaine-caractere : 'east' → centrer un peu plus à droite pour
//     apercevoir la statue
//   - les autres : 'attention' (sharp = smart-crop autour du sujet principal)
type SharpPosition = 'attention' | 'centre' | 'south' | 'east' | 'west';
const POSITION_BY_FILE: Record<string, SharpPosition> = {
  '01-micro-urbain': 'attention',
  '02-coeur-urbain': 'south',
  // Refonte 2026-06-18 (Morgan « on ne voit pas le bas, l'image a été crop ») :
  // 'attention' → 'south'. Le smart-crop gardait la canopée lumineuse + le ciel
  // (zone la plus saillante) et coupait le premier plan (jardin, terrasse). On
  // ancre désormais le carré sur le BAS de la source pour conserver ce premier
  // plan. À régénérer avec la source dans _assets/typologies-source/.
  '03-frange-urbaine': 'south',
  // Refonte v6 2026-05-15 : 'east' → 'centre' (Morgan « redécale vers la
  // gauche, la tour doit apparaître sur la partie droite »). Centrer garde
  // la tour à droite du frame final au lieu de la pousser au centre.
  '04-domaine-caractere': 'centre',
  '05-architecture-publique': 'attention',
};

await mkdir(OUT_DIR, { recursive: true });

const files = (await readdir(SRC_DIR))
  .filter((f) => /^0[1-5]-.*\.(jpg|jpeg|JPEG|JPG|png|PNG)$/.test(f))
  .sort();

if (files.length === 0) {
  console.error(`Aucune image source dans ${SRC_DIR}/.`);
  process.exit(1);
}

for (const file of files) {
  const srcPath = join(SRC_DIR, file);
  await stat(srcPath);

  const { name } = parse(file);
  const baseName = name.toLowerCase();

  const position = POSITION_BY_FILE[baseName] ?? 'attention';
  for (const v of VARIANTS) {
    const pipeline = sharp(srcPath).resize(v.size, v.size, {
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

    console.log(
      `✓ ${file}${v.suffix} → ${Math.round(webp.byteLength / 1024)} KB webp + ${Math.round(jpeg.byteLength / 1024)} KB jpg`,
    );
  }
}
