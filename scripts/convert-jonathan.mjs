/**
 * Conversion photos Jonathan → WebP optimisés.
 * Usage : pnpm tsx scripts/convert-jonathan.mjs
 */
import sharp from 'sharp';
import { mkdirSync, statSync, unlinkSync } from 'fs';

const outDir = 'src/assets/jonathan';
mkdirSync(outDir, { recursive: true });

const photos = [
  {
    src: '_brief/client-assets/logo-identite/DSC07980.JPG',
    out: 'portrait-01.webp',
    width: 1800,
    height: 2400,
  },
  {
    src: '_brief/client-assets/logo-identite/DSC08003.JPEG',
    out: 'portrait-02.webp',
    width: 1800,
    height: 2400,
  },
];

for (const p of photos) {
  const output = `${outDir}/${p.out}`;
  const meta = await sharp(p.src)
    .resize(p.width, p.height, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85, effort: 5 })
    .toFile(output);
  const srcSize = statSync(p.src).size;
  console.log(
    `✓ ${p.out} — ${(srcSize / 1024 / 1024).toFixed(1)} → ${(meta.size / 1024).toFixed(0)} kB`,
  );
}

// Clean les JPG bruts qu'on avait copiés
try {
  unlinkSync(`${outDir}/portrait-01.jpg`);
  unlinkSync(`${outDir}/portrait-02.jpg`);
} catch {
  // déjà supprimés
}
