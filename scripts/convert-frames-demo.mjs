/**
 * Conversion one-shot PNG → WebP pour la démo scroll-scrub.
 * Remplace la future chaîne process-frames.ts complète.
 * Usage : node scripts/convert-frames-demo.mjs
 */
import sharp from 'sharp';
import { readdirSync, unlinkSync } from 'fs';
import { join } from 'path';

const dir = 'public/frames/coeur-urbain-parenthese';
const files = readdirSync(dir)
  .filter((f) => f.endsWith('.png'))
  .sort();

let totalBefore = 0;
let totalAfter = 0;

for (const f of files) {
  const input = join(dir, f);
  const output = join(dir, f.replace('.png', '.webp'));
  const { size: sizeBefore } = await sharp(input).metadata();
  const meta = await sharp(input)
    .resize(1920, 1080, { fit: 'cover' })
    .webp({ quality: 82, effort: 5 })
    .toFile(output);
  totalBefore += sizeBefore || 0;
  totalAfter += meta.size;
  console.log(`✓ ${f} → ${f.replace('.png', '.webp')} (${(meta.size / 1024).toFixed(0)} kB)`);
}

console.log(`\nTotal after: ${(totalAfter / 1024 / 1024).toFixed(1)} MB`);

// Cleanup PNG (on garde que les WebP)
for (const f of files) {
  unlinkSync(join(dir, f));
}
console.log('PNG supprimés.');
