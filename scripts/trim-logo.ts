/*
 * Crop le PNG du logo pour supprimer les marges transparentes.
 * Utile parce que le wordmark fourni est sur un canvas carré avec beaucoup de vide autour,
 * ce qui fait paraître le logo tout petit à l'écran.
 *
 * Usage : pnpm tsx scripts/trim-logo.ts
 */

import sharp from 'sharp';
import { join } from 'node:path';

const ROOT = process.cwd();

const logos = [
  {
    src: join(ROOT, '_brief/client-assets/logo-identite/Oliveira-vertmousse.png'),
    out: join(ROOT, 'public/brand/wordmark-moss.png'),
  },
  {
    src: join(ROOT, '_brief/client-assets/logo-identite/Oliveira-B.png'),
    out: join(ROOT, 'public/brand/wordmark-black.png'),
  },
];

for (const { src, out } of logos) {
  await sharp(src)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 10 })
    .resize({ width: 1200, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(out);

  const meta = await sharp(out).metadata();
  console.log(`✓ ${out} — ${meta.width}×${meta.height}`);
}

// Variante crème — on prend le logo moss trimmé, on normalise vers le noir pur
// (tous les pixels colorés deviennent noirs en conservant leur alpha), puis on
// le "teinte" en crème pour l'appliquer sur fond sombre.
await sharp(join(ROOT, 'public/brand/wordmark-moss.png'))
  .ensureAlpha()
  .threshold(200, { grayscale: false })
  .negate({ alpha: false })
  .tint({ r: 245, g: 241, b: 234 })
  .png({ compressionLevel: 9 })
  .toFile(join(ROOT, 'public/brand/wordmark-cream.png'));

const creamMeta = await sharp(join(ROOT, 'public/brand/wordmark-cream.png')).metadata();
console.log(`✓ public/brand/wordmark-cream.png — ${creamMeta.width}×${creamMeta.height}`);
