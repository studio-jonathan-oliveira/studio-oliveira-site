/*
 * Optimize /demarrer-un-projet source images — one-shot.
 *
 * Sources brutes : _assets/demarrer_un_projet/ (déposées par Morgan
 * 2026-05-22). Sortie : src/assets/demarrer-un-projet/ en mozjpeg q92.
 *
 *   01-hero  → photo full-bleed du hero (allée végétale)
 *   02-aside → photo unique partagée par les 2 sections "L'APPEL DE …"
 *              (collée bas-gauche, sticky pendant le scroll)
 */
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'node:fs';

const DIR = 'src/assets/demarrer-un-projet';
mkdirSync(DIR, { recursive: true });

interface Variant {
  source: string;
  output: string;
  width: number;
}

const variants: Variant[] = [
  {
    source: '_assets/demarrer_un_projet/01-hero.jpeg',
    output: `${DIR}/01-hero.jpg`,
    width: 2600,
  },
  {
    source: '_assets/demarrer_un_projet/02-aside.jpg',
    output: `${DIR}/02-aside.jpg`,
    width: 1800,
  },
];

async function main() {
  for (const v of variants) {
    if (!existsSync(v.source)) {
      console.warn(`skip ${v.source} (not found)`);
      continue;
    }
    await sharp(v.source)
      .rotate()
      .resize({ width: v.width, withoutEnlargement: true })
      .jpeg({ quality: 92, mozjpeg: true })
      .toFile(v.output);
    console.log(`${v.output} ok`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
