/**
 * Re-compresse les 4 hero posters (JPEG mozjpeg q78 progressive).
 * Idempotent : à relancer quand un poster est remplacé.
 *
 * Usage : pnpm tsx scripts/optimize-hero-posters.mjs
 */
import sharp from 'sharp';
import { readFile, writeFile, stat } from 'node:fs/promises';

const files = [
  'public/hero/hero-01-poster.jpg',
  'public/hero/hero-02-poster.jpg',
  'public/hero/hero-03-poster.jpg',
  'public/hero/hero-04-poster.jpg',
];

let totalBefore = 0;
let totalAfter = 0;
for (const f of files) {
  const before = (await stat(f)).size;
  const buf = await readFile(f);
  const optimized = await sharp(buf)
    .jpeg({ quality: 78, mozjpeg: true, progressive: true })
    .toBuffer();
  await writeFile(f, optimized);
  const after = optimized.byteLength;
  totalBefore += before;
  totalAfter += after;
  const pct = Math.round((1 - after / before) * 100);
  console.log(
    `✓ ${f}: ${Math.round(before / 1024)} KB → ${Math.round(after / 1024)} KB (-${pct}%)`,
  );
}
const savedKB = Math.round((totalBefore - totalAfter) / 1024);
console.log(`\nTotal : -${savedKB} KB sur les 4 posters.`);
