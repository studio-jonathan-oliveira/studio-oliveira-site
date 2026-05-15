/*
 * Optimize micro-urbain typologie source images — one-shot.
 *
 * Sources brutes : _assets/micro-urbain/0X-*.jpg (5 fichiers fournis par
 * Jonathan / Morgan 2026-05-15). Sortie : src/assets/typologies/micro-urbain/
 * en mozjpeg q82, largeurs adaptées au rôle (hero / large / diptyque).
 *
 * Disposition cible (trame Jonathan) :
 *   01-hero          → hero plein-bleed
 *   02-large-top     → 1re image grande pleine largeur sous hero
 *   03-diptyque-left → image diptyque gauche (portrait plus petit)
 *   04-diptyque-right→ image diptyque droite (portrait plus grand)
 *   05-large-bottom  → 2e image grande pleine largeur sous diptyque
 */
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'node:fs';

const DIR = 'src/assets/typologies/micro-urbain';
mkdirSync(DIR, { recursive: true });

interface Variant {
  source: string;
  output: string;
  width: number;
}

// Qualité augmentée 82 → 92 (retour Morgan 2026-05-15 v4 : qualité pas
// suffisante sur preview). Widths max augmentés pour avoir des sources
// retina propres jusqu'à 2400px viewport.
const variants: Variant[] = [
  { source: '_assets/micro-urbain/01-hero.jpg', output: `${DIR}/01-hero.jpg`, width: 2600 },
  {
    source: '_assets/micro-urbain/02-roof.jpg',
    output: `${DIR}/02-large-top.jpg`,
    width: 2400,
  },
  {
    source: '_assets/micro-urbain/03-patio.jpg',
    output: `${DIR}/03-diptyque-left.jpg`,
    width: 1500,
  },
  {
    source: '_assets/micro-urbain/04-patio.jpg',
    output: `${DIR}/04-diptyque-right.jpg`,
    width: 1800,
  },
  {
    source: '_assets/micro-urbain/05-roof.jpg',
    output: `${DIR}/05-large-bottom.jpg`,
    width: 2400,
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
  // PAS de purge des sources brutes : _assets/micro-urbain/ est conservé
  // pour réutilisation (re-tirage à d'autres tailles si besoin). Sources
  // sous _assets/ sont gitignored, donc pas de poids repo.
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
