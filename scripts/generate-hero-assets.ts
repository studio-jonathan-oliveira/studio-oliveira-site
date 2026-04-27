/*
 * Génère les assets du hero homepage à partir d'une source haute résolution :
 *   1. public/hero-fallback.webp  — image full quality optimisée (~700-800 KB)
 *      remplace l'ancien hero-fallback.jpg (13 MB).
 *   2. src/data/hero-lqip.ts      — module TS exportant le LQIP (Low Quality
 *      Image Placeholder) en data URI base64. Inliné comme background-image
 *      initial sur le hero → affichage instantané, 0 round-trip réseau.
 *      Le LQIP est encodé en JPEG très compressé (qualité 30, largeur 24px,
 *      blur), ce qui produit ~1-2 KB suffisamment décodable par tout navigateur.
 *
 * Source : public/hero-fallback.jpg (ou argument CLI). Si l'argument n'est pas
 * fourni, on lit le JPG actuel (13 MB) avant de l'écraser par le WebP.
 *
 * Usage :
 *   pnpm tsx scripts/generate-hero-assets.ts [chemin-source]
 *
 * Note : le module hero-lqip.ts est régénéré à chaque run. Ne pas éditer à la
 * main — relancer le script si l'image source change.
 */

import sharp from 'sharp';
import { readFile, writeFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = process.cwd();

const SRC = process.argv[2] ? join(ROOT, process.argv[2]) : join(ROOT, 'public/hero-fallback.jpg');

const OUT_WEBP = join(ROOT, 'public/hero-fallback.webp');
const OUT_LQIP_MODULE = join(ROOT, 'src/data/hero-lqip.ts');

// 1) WebP full quality, resize max 2400px (largeur écrans 4K rétro-compatible),
//    qualité 78 (bon ratio fidélité/poids pour photo de jardin nocturne).
const sourceBuffer = await readFile(SRC);
const sourceMeta = await sharp(sourceBuffer).metadata();
console.log(
  `Source : ${SRC} — ${sourceMeta.width}×${sourceMeta.height} (${humanSize(sourceBuffer.length)})`,
);

await sharp(sourceBuffer)
  .resize({ width: 2000, withoutEnlargement: true })
  .webp({ quality: 72, effort: 6 })
  .toFile(OUT_WEBP);

const webpStats = await stat(OUT_WEBP);
console.log(`✓ ${OUT_WEBP} — ${humanSize(webpStats.size)}`);

// 2) LQIP : downscale 24px de large, blur léger, JPEG qualité 30 → ~1-2 KB.
//    Format JPEG (pas WebP) car certains parsers SSR/preview ont des soucis
//    avec WebP en data URI. JPEG est universellement supporté.
const lqipBuffer = await sharp(sourceBuffer)
  .resize({ width: 24 })
  .blur(1.2)
  .jpeg({ quality: 30, progressive: false })
  .toBuffer();

const lqipDataUri = `data:image/jpeg;base64,${lqipBuffer.toString('base64')}`;
console.log(`✓ LQIP — ${humanSize(lqipBuffer.length)} (${lqipDataUri.length} chars data URI)`);

const moduleSource = `// AUTO-GÉNÉRÉ par scripts/generate-hero-assets.ts — ne pas éditer à la main.
// Régénérer avec : pnpm tsx scripts/generate-hero-assets.ts

/**
 * LQIP (Low Quality Image Placeholder) du hero homepage en data URI base64.
 * Inliné comme \`background-image\` initial pour un affichage instantané (0 RTT).
 * Remplacé par hero-fallback.webp dès que celui-ci a chargé (cf. index.astro).
 */
export const HERO_LQIP_DATA_URI = ${JSON.stringify(lqipDataUri)};
`;

await writeFile(OUT_LQIP_MODULE, moduleSource, 'utf8');
console.log(`✓ ${OUT_LQIP_MODULE}`);

function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
