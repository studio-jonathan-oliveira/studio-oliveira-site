/**
 * optimize-hero-videos — ré-encode les vidéos source du hero d'accueil
 * (déposées dans `_assets/hero-source/`) vers des MP4 H.264 + WebM VP9
 * compacts pour usage en fond hero, avec poster JPEG première frame.
 *
 * Cible :
 *   - 1280×720 @ 30fps (suffisant pour un fond, gain de poids majeur vs 1080p)
 *   - H.264 CRF 25 + preset slow + faststart (qualité visuelle transparente
 *     à ~2-3 Mbps, moov atom au début pour streaming progressif)
 *   - Audio strippé (pas d'audio sur un hero muted, économise du poids)
 *
 * Note : WebM VP9 désactivé après benchmark — CRF 33 produit des fichiers
 * PLUS lourds que H.264 CRF 25 sur ce type de footage architectural lent.
 * MP4 H.264 suffit pour autoplay garanti partout. Si besoin d'économiser
 * encore du bandwidth, re-activer WebM avec CRF 38-42 et benchmark à nouveau.
 *
 * Usage : pnpm tsx scripts/optimize-hero-videos.ts
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, parse } from 'node:path';

const FFMPEG =
  process.platform === 'win32'
    ? 'node_modules/.pnpm/ffmpeg-static@5.3.0/node_modules/ffmpeg-static/ffmpeg.exe'
    : 'node_modules/.pnpm/ffmpeg-static@5.3.0/node_modules/ffmpeg-static/ffmpeg';

const SOURCE_DIR = '_assets/hero-source';
const OUTPUT_DIR = 'public/hero';

function run(args: string[]) {
  execFileSync(FFMPEG, args, { stdio: 'inherit' });
}

function fmtMB(bytes: number) {
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

function optimize(input: string, baseName: string) {
  const mp4Out = join(OUTPUT_DIR, `${baseName}.mp4`);
  const posterOut = join(OUTPUT_DIR, `${baseName}-poster.jpg`);

  console.log(`\n— ${baseName} —`);
  console.log(`  source : ${fmtMB(statSync(input).size)}`);

  // MP4 H.264 — compat universelle, autoplay garanti partout
  console.log('  → MP4 H.264 720p CRF 25...');
  run([
    '-y',
    '-i',
    input,
    '-vf',
    'scale=1280:720:flags=lanczos',
    '-c:v',
    'libx264',
    '-preset',
    'slow',
    '-crf',
    '25',
    '-pix_fmt',
    'yuv420p',
    '-profile:v',
    'high',
    '-level',
    '4.0',
    '-movflags',
    '+faststart',
    '-an',
    '-r',
    '30',
    mp4Out,
  ]);
  console.log(`    ${fmtMB(statSync(mp4Out).size)}`);

  // Poster — première frame en JPEG, sert de fallback + premier paint
  console.log('  → Poster JPEG (frame 0)...');
  run([
    '-y',
    '-i',
    input,
    '-vf',
    'scale=1280:720:flags=lanczos',
    '-vframes',
    '1',
    '-q:v',
    '4',
    posterOut,
  ]);
  console.log(`    ${fmtMB(statSync(posterOut).size)}`);
}

function main() {
  if (!existsSync(SOURCE_DIR)) {
    console.error(`Source dir manquant : ${SOURCE_DIR}`);
    process.exit(1);
  }
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const sources = readdirSync(SOURCE_DIR)
    .filter((f) => /\.(mp4|mov|webm|mkv)$/i.test(f))
    .sort();

  if (sources.length === 0) {
    console.error(`Aucune vidéo dans ${SOURCE_DIR}`);
    process.exit(1);
  }

  console.log(`${sources.length} vidéos à optimiser →\n`);
  for (const src of sources) {
    const { name } = parse(src);
    optimize(join(SOURCE_DIR, src), name);
  }
  console.log('\n✓ Done.');
}

main();
