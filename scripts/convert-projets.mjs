/**
 * Conversion batch des photos projets → WebP optimisés.
 * Source : _brief/client-assets/photos-projets/
 * Cible : src/assets/projets/<slug>/<n>-<type>.webp
 *
 * Usage : pnpm tsx scripts/convert-projets.mjs
 */
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const BASE = '_brief/client-assets/photos-projets';
const OUT = 'src/assets/projets';

/**
 * Projets à générer — chaque entrée définit slug + sélection de 1 cover + N galerie.
 */
const projets = [
  {
    slug: 'cafe-de-paris',
    source: `${BASE}/cafe-de-paris`,
    images: [
      { file: 'DSC03873.JPG', out: '01-cover' },
      { file: 'DSC03888.JPG', out: '02' },
      { file: 'DSC03897-2.JPG', out: '03' },
      { file: 'DSC08012.JPG', out: '04' },
      { file: 'DSC08029.JPG', out: '05' },
    ],
  },
  {
    slug: 'schmit-cuisine',
    source: `${BASE}/schmit-cuisine`,
    images: [
      { file: 'IMG_5870.JPEG', out: '01-cover' },
      { file: 'IMG_6349.JPEG', out: '02' },
      { file: 'IMG_6353.JPEG', out: '03' },
      { file: 'IMG_6392.JPEG', out: '04' },
    ],
  },
  {
    slug: 'jungle-room',
    source: `${BASE}/jungle-room`,
    images: [
      { file: '1.png', out: '01-salon' },
      { file: '4.png', out: '02' },
      { file: '7.png', out: '03' },
    ],
  },
  {
    slug: 'airbnb',
    source: `${BASE}/airbnb`,
    images: [
      { file: 'DSC03870_HDR_HDR.jpeg', out: '01-cover' },
      { file: 'DSC03943.jpeg', out: '02' },
      { file: 'DSC04145_HDR.jpeg', out: '03' },
      { file: 'DSC04244.jpeg', out: '04' },
      { file: 'DSC04515.jpeg', out: '05' },
    ],
  },
  {
    slug: 'coeur-urbain-parenthese',
    source: `${BASE}/Coeur urbain - parenthese exotique`,
    images: [
      { file: 'Image1.png', out: '01-cover' },
      { file: 'Image2.png', out: '02' },
      { file: 'Image4.png', out: '03' },
    ],
  },
  {
    slug: 'frange-urbaine-restanque',
    source: `${BASE}/Frange urbaine - restanque correzienne`,
    images: [{ file: 'Image4.jpg', out: '01-cover' }],
  },
  {
    slug: 'provence-correzienne',
    source: `${BASE}/Provence correzienne - Domaine et caracteres`,
    images: [{ file: 'terrasse day.png', out: '01-cover' }],
  },
];

const opts = {
  maxWidth: 2400,
  maxHeight: 1800,
  quality: 82,
};

let totalBefore = 0;
let totalAfter = 0;

for (const p of projets) {
  const outDir = join(OUT, p.slug);
  mkdirSync(outDir, { recursive: true });

  for (const img of p.images) {
    const src = join(p.source, img.file);
    if (!existsSync(src)) {
      console.warn(`✗ MANQUE : ${src}`);
      continue;
    }

    const output = join(outDir, `${img.out}.webp`);
    const meta = await sharp(src)
      .resize(opts.maxWidth, opts.maxHeight, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: opts.quality, effort: 5 })
      .toFile(output);

    // Source size (via stat)
    const { statSync } = await import('fs');
    const srcSize = statSync(src).size;
    totalBefore += srcSize;
    totalAfter += meta.size;

    console.log(
      `✓ ${p.slug}/${img.out}.webp — ${(srcSize / 1024 / 1024).toFixed(1)} → ${(meta.size / 1024).toFixed(0)} kB`,
    );
  }
}

console.log(
  `\n── Total : ${(totalBefore / 1024 / 1024).toFixed(1)} Mo → ${(totalAfter / 1024 / 1024).toFixed(1)} Mo (${((1 - totalAfter / totalBefore) * 100).toFixed(0)}% économisé)`,
);
