/*
 * Helpers — marqueurs éditoriaux « À FOURNIR / À VALIDER PAR JONATHAN ».
 *
 * Tant que Jonathan n'a pas livré tous les contenus définitifs, les pages
 * embarquent des placeholders en gras `[À FOURNIR ...]` / `[À VALIDER ...]`.
 * En prod, ces marqueurs ne doivent ni s'afficher aux visiteurs, ni se
 * retrouver indexés (meta description, schema, contenu textuel scannable).
 *
 * Pattern d'usage :
 *   - `isDraft(value)` : détecte si une chaîne contient un marqueur
 *   - `cleanDraft(value, fallback)` : retourne `fallback` si draft, sinon `value`
 *   - `SHOW_DRAFTS` : `true` en dev (les marqueurs s'affichent pour debug),
 *     `false` en prod (les marqueurs sont systématiquement masqués)
 *
 * Le composant `DraftOnly.astro` wrap les blocs entiers à masquer en prod.
 */

const DRAFT_MARKERS = ['[À FOURNIR', '[À VALIDER', '[A FOURNIR', '[A VALIDER'];

export function isDraft(value: string | null | undefined): boolean {
  if (!value) return false;
  return DRAFT_MARKERS.some((marker) => value.includes(marker));
}

export function cleanDraft<T extends string | undefined>(value: T, fallback: string = ''): string {
  if (isDraft(value)) return fallback;
  return value ?? '';
}

/**
 * Affiche les marqueurs en dev (debug visuel pendant la rédaction), les
 * masque en prod. Utiliser via `{SHOW_DRAFTS && (<...>)}` ou via le composant
 * `<DraftOnly>`.
 */
// `import.meta.env` n'existe que sous Astro/Vite ; optional chaining pour rester
// exécutable hors build (ex. scripts/sanity-seed.ts lancé par node/tsx).
export const SHOW_DRAFTS = import.meta.env?.DEV ?? false;

/**
 * Détecte si un projet mock est encore "draft" (summary placeholder). Sert
 * à appliquer `noindex` sur les pages /realisations/[slug] et /conceptions/[slug]
 * tant que Jonathan n'a pas fourni les descriptifs définitifs.
 */
export function isDraftProject(project: { summary?: string; location?: string }): boolean {
  return isDraft(project.summary) || isDraft(project.location);
}
