/*
 * Génère les OG images dédiées par page dans public/og/<filename>.jpg
 * (1200×630 chacune, ~70-120 KB JPEG q85).
 *
 * Composition :
 *   - Fond uni : cream (#F5F1EA) ou ink (#1D1F1B) selon variant
 *   - Wordmark monochrome en haut-gauche (~38% width)
 *   - Eyebrow Jost SemiBold majuscules tracking 0.22em en bas-gauche
 *   - Titre Jost Medium 86px multi-lignes au-dessus de l'eyebrow
 *   - Filet bottom-gauche signature
 *
 * Usage :
 *   pnpm tsx scripts/generate-og-pages.ts
 *
 * Idempotent : ré-exécuter écrase les fichiers existants. Ajouter des
 * pages dans `src/lib/og-pages.ts`.
 *
 * Police : Inter Variable depuis `public/fonts/inter-variable-latin.woff2`.
 * Sharp ne peut pas embarquer woff2 dans un SVG `<text>` sans fallback —
 * on inline les glyphes via SVG path en pratique difficile. Solution
 * pragmatique : SVG `<text>` avec font-family Inter ET valeur en majuscules
 * pour minimiser les besoins de glyphes complexes. Sharp utilise la police
 * système si elle est installée ; sinon le fallback "system-ui" prend le
 * relais. Pour un rendu garanti partout, on peut migrer plus tard vers
 * satori + resvg (vrai support woff2 → glyphes embedded).
 */

import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { OG_PAGES, type OgPage } from '../src/lib/og-pages';

const ROOT = process.cwd();
const W = 1200;
const H = 630;
const CREAM = '#F5F1EA';
const INK = '#1D1F1B';
const MOSS = '#70725B';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Découpe un titre en lignes pour qu'il rentre dans la largeur. Heuristique
 * char-count (pas de mesure réelle de glyphes — suffisant pour des titres
 * éditoriaux ≤ 60 caractères).
 */
function splitTitle(title: string, maxCharsPerLine = 22): string[] {
  const words = title.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function buildSvg(page: OgPage): string {
  const isDark = page.variant === 'dark';
  const bg = isDark ? INK : CREAM;
  const fg = isDark ? CREAM : INK;
  const accent = isDark ? CREAM : MOSS;

  const titleLines = splitTitle(page.title);
  const titleSize = titleLines.length > 2 ? 70 : 86;
  const titleLineHeight = titleSize * 1.04;
  const titleBlockHeight = titleLineHeight * titleLines.length;

  const padding = 72;
  const titleY = H - padding - 64 - titleBlockHeight + titleLineHeight - 18;
  const eyebrowY = H - padding - 30;

  const wordmark = 'STUDIO J OLIVEIRA';

  return `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${W}" height="${H}" fill="${bg}" />
      <!-- wordmark top-left -->
      <text
        x="${padding}"
        y="${padding + 22}"
        font-family="Inter Variable, Inter, Segoe UI, Helvetica Neue, system-ui, sans-serif"
        font-weight="600"
        font-size="22"
        letter-spacing="6"
        fill="${fg}"
      >${escapeXml(wordmark)}</text>

      <!-- accent line bottom-right -->
      <line
        x1="${W - padding - 200}"
        x2="${W - padding}"
        y1="${H - padding}"
        y2="${H - padding}"
        stroke="${accent}"
        stroke-width="2"
      />

      <!-- title block bottom-left -->
      ${titleLines
        .map((line, i) => {
          const y = titleY + i * titleLineHeight;
          return `<text
            x="${padding}"
            y="${y}"
            font-family="Inter Variable, Inter, Segoe UI, Helvetica Neue, system-ui, sans-serif"
            font-weight="500"
            font-size="${titleSize}"
            letter-spacing="-1.2"
            fill="${fg}"
          >${escapeXml(line)}</text>`;
        })
        .join('\n')}

      <!-- eyebrow under title -->
      <text
        x="${padding}"
        y="${eyebrowY}"
        font-family="Geist Mono Variable, Geist Mono, ui-monospace, monospace"
        font-weight="500"
        font-size="18"
        letter-spacing="4"
        fill="${accent}"
      >${escapeXml(page.eyebrow.toUpperCase())}</text>
    </svg>
  `;
}

async function main() {
  console.log(`Generating ${OG_PAGES.length} OG images...\n`);

  for (const page of OG_PAGES) {
    const svg = buildSvg(page);
    const outPath = join(ROOT, 'public/og', `${page.filename}.jpg`);
    await mkdir(dirname(outPath), { recursive: true });

    const buf = await sharp(Buffer.from(svg)).jpeg({ quality: 85, mozjpeg: true }).toBuffer();

    await writeFile(outPath, buf);
    const sizeKB = Math.round(buf.byteLength / 1024);
    console.log(`✓ ${page.filename}.jpg — ${sizeKB} KB`);
  }

  console.log(`\n✅ ${OG_PAGES.length} OG images générées dans public/og/`);
}

main().catch((err) => {
  console.error('❌ Erreur génération OG pages :', err);
  process.exit(1);
});
