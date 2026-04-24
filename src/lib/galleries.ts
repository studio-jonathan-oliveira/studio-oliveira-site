/*
 * Galeries photos par typologie / verticale.
 *
 * Chargement via import.meta.glob eager : tous les fichiers d'un dossier
 * sont automatiquement inclus et triés alphabétiquement par nom de fichier.
 * Préfixer les fichiers avec "01-", "02-", etc. pour forcer l'ordre éditorial.
 *
 * Placeholder actuel : rendus Twinmotion + photos projets livrés (source
 * _brief/client-assets/photos-projets/). À enrichir progressivement par
 * Jonathan via Sanity en Phase 4.
 */
import type { ImageMetadata } from 'astro';

const typologiesGlob = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/typologies/*/*.{png,jpg,jpeg,webp}',
  { eager: true },
);

const verticalesGlob = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/verticales/*/*.{png,jpg,jpeg,webp}',
  { eager: true },
);

function groupBySlug(glob: Record<string, { default: ImageMetadata }>, base: string) {
  const map = new Map<string, ImageMetadata[]>();
  for (const [path, mod] of Object.entries(glob)) {
    const match = path.match(new RegExp(`/${base}/([^/]+)/`));
    if (!match) continue;
    const slug = match[1]!;
    const arr = map.get(slug) ?? [];
    arr.push(mod.default);
    map.set(slug, arr);
  }
  // tri déterministe sur le nom de fichier (via path original)
  const sorted = new Map<string, ImageMetadata[]>();
  for (const [slug] of map) {
    const items = Object.entries(glob)
      .filter(([p]) => p.includes(`/${base}/${slug}/`))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, m]) => m.default);
    sorted.set(slug, items);
  }
  return sorted;
}

const TYPOLOGIE_GALLERIES = groupBySlug(typologiesGlob, 'typologies');
const VERTICALE_GALLERIES = groupBySlug(verticalesGlob, 'verticales');

export function getTypologieGallery(slug: string): ImageMetadata[] {
  return TYPOLOGIE_GALLERIES.get(slug) ?? [];
}

export function getVerticaleGallery(slug: string): ImageMetadata[] {
  return VERTICALE_GALLERIES.get(slug) ?? [];
}
