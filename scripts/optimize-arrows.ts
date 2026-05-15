/**
 * Optimisation des 3 flèches Jonathan (fourni en PNG 1451×1449 8 MB chacune)
 * vers des assets web légers.
 *
 * Sources : `_assets/0[1-3]-fleche_*.png` (gitignored).
 * Sortie : `public/brand/fleche-{white,red,dark}.png` (256×256 trim alpha).
 *
 * Usage : pnpm tsx scripts/optimize-arrows.ts
 */
import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';

const mapping = [
  { src: '_assets/01-fleche_blanche.png', out: 'public/brand/fleche-white.png' },
  { src: '_assets/02-fleche_rouge.png', out: 'public/brand/fleche-red.png' },
  { src: '_assets/03-fleche_sombre.png', out: 'public/brand/fleche-dark.png' },
];

await mkdir('public/brand', { recursive: true });

for (const { src, out } of mapping) {
  const before = (await stat(src)).size;
  await sharp(src)
    .trim()
    .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, palette: true })
    .toFile(out);
  const after = (await stat(out)).size;
  console.log(
    `✓ ${src} → ${out} : ${Math.round(before / 1024)} KB → ${Math.round(after / 1024)} KB`,
  );
}

// Bonus : sortie webp ultra-légère pour usage <img srcset>.
for (const { src, out } of mapping) {
  const webpOut = out.replace(/\.png$/, '.webp');
  await sharp(src)
    .trim()
    .resize(256, 256, { fit: 'contain' })
    .webp({ quality: 90 })
    .toFile(webpOut);
  const after = (await stat(webpOut)).size;
  console.log(`  + ${webpOut} (${Math.round(after / 1024)} KB)`);
}
