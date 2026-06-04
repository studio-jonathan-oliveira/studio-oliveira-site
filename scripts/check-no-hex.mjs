/*
 * Garde-fou « no hardcoded hex » — version Node cross-platform.
 *
 * Remplace l'ancien hook shell inline (lefthook.yml) qui plantait sous
 * Windows local (« sh -c: line 6: syntax error ») : lefthook n'invoque pas
 * le même shell selon l'OS, et le bloc multi-ligne était mal passé. Node est
 * présent partout (pré-requis du projet) → exécution déterministe.
 *
 * Rôle : refuser tout hex hardcodé (#rgb / #rrggbb) dans les fichiers
 * .astro/.ts/.tsx/.css, SAUF la couche 1 de la palette
 * (src/styles/global.css + src/lib/brand-colors.ts). Voir
 * _brief/charte-couleurs.md.
 *
 * Usage : node scripts/check-no-hex.mjs <fichier> [<fichier> ...]
 * (lefthook passe {staged_files}). Exit 1 si violation.
 */
import { readFileSync } from 'node:fs';

const ALLOWED = [/src[\\/]styles[\\/]global\.css$/, /src[\\/]lib[\\/]brand-colors\.ts$/];
const TARGET_EXT = /\.(astro|ts|tsx|css)$/;
const HEX = /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/;
// Lignes à ignorer : commentaires CSS (* …) et JS (// …) où un hex peut
// apparaître en documentation sans être appliqué.
const COMMENT_LINE = /^\s*(\*|\/\/)/;

const files = process.argv
  .slice(2)
  .filter((f) => TARGET_EXT.test(f) && !ALLOWED.some((re) => re.test(f)));

const hits = [];
for (const file of files) {
  let content;
  try {
    content = readFileSync(file, 'utf8');
  } catch {
    continue; // fichier supprimé / introuvable → ignoré
  }
  content.split(/\r?\n/).forEach((line, i) => {
    if (COMMENT_LINE.test(line)) return;
    if (HEX.test(line)) hits.push(`${file}:${i + 1}: ${line.trim()}`);
  });
}

if (hits.length > 0) {
  console.error(
    '[REFUSE] Hex hardcode detecte hors src/styles/global.css et src/lib/brand-colors.ts.',
  );
  console.error('  Voir _brief/charte-couleurs.md (architecture 3 couches).');
  console.error('');
  console.error(hits.join('\n'));
  process.exit(1);
}
