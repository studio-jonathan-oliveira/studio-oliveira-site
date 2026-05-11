/*
 * Génère public/og-default.jpg (1200×630, ~150-200 KB) — image de partage
 * Open Graph + Twitter Cards par défaut pour toutes les pages du site.
 *
 * Composition :
 *   - Photo de fond : public/hero/hero-01-poster.jpg (cover crop center)
 *   - Voile sombre : ink #1d1f1b à 65% pour assurer la lisibilité du wordmark
 *   - Wordmark cream centré (depuis public/brand/wordmark-cream.png), largeur
 *     ~52% du canvas, position centrée verticalement
 *
 * Usage :
 *   pnpm tsx scripts/generate-og-default.ts
 *
 * Audit SEO 2026-05-11 : og-default.jpg manquant → partages réseaux
 * (LinkedIn, WhatsApp, Twitter, Slack) affichent une image cassée pour tout
 * le site. Cette image est référencée par BaseLayout.astro:31 comme default.
 */

import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = process.cwd();
const W = 1200;
const H = 630;

const photoPath = join(ROOT, 'public/hero/hero-01-poster.jpg');
const wordmarkPath = join(ROOT, 'public/brand/wordmark-cream.png');
const outPath = join(ROOT, 'public/og-default.jpg');

async function main() {
  // 1. Charger et redimensionner la photo en cover 1200×630
  const photoBuf = await sharp(await readFile(photoPath))
    .resize(W, H, { fit: 'cover', position: 'center' })
    .toBuffer();

  // 2. Voile ink 65% (#1d1f1b à 0.65 alpha) pour lisibilité wordmark cream
  const veilSvg = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${W}" height="${H}" fill="#1d1f1b" fill-opacity="0.62" />
    </svg>
  `;
  const veilBuf = Buffer.from(veilSvg);

  // 3. Wordmark cream à 52% de la largeur
  const wordmarkBuf = await sharp(await readFile(wordmarkPath))
    .resize({ width: Math.round(W * 0.52) })
    .toBuffer();

  const wordmarkMeta = await sharp(wordmarkBuf).metadata();
  const wordmarkW = wordmarkMeta.width ?? Math.round(W * 0.52);
  const wordmarkH = wordmarkMeta.height ?? 200;

  const left = Math.round((W - wordmarkW) / 2);
  const top = Math.round((H - wordmarkH) / 2);

  // 4. Composition finale → JPEG q82 (~150-200 KB)
  const finalBuf = await sharp(photoBuf)
    .composite([
      { input: veilBuf, top: 0, left: 0 },
      { input: wordmarkBuf, top, left },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  await writeFile(outPath, finalBuf);

  const sizeKB = Math.round(finalBuf.byteLength / 1024);
  console.log(`✓ og-default.jpg généré : ${W}×${H}, ${sizeKB} KB → ${outPath}`);
}

main().catch((err) => {
  console.error('✗ Erreur génération og-default.jpg :', err);
  process.exit(1);
});
