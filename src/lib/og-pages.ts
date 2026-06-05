/*
 * Pages avec une OG image dédiée (générée par `scripts/generate-og-pages.ts`).
 *
 * Chaque entrée produit un fichier `/public/og/<filename>.jpg` 1200×630 cream
 * avec titre Jost + eyebrow Geist Mono. BaseLayout pick l'OG par pathname.
 *
 * Pages NON listées ici → fallback `/og-default.jpg` (image photo + voile +
 * wordmark, générée par `scripts/generate-og-default.ts`).
 *
 * Pour ajouter un OG dédié à une page : ajouter une entrée + re-run
 * `pnpm tsx scripts/generate-og-pages.ts`.
 */

export interface OgPage {
  path: string;
  /** Slug filename (sans extension, peut contenir des slashes). */
  filename: string;
  eyebrow: string;
  title: string;
  /** Variante visuelle. `dark` = fond ink, texte cream. `light` = fond cream, texte ink. */
  variant: 'light' | 'dark';
}

export const OG_PAGES: OgPage[] = [
  {
    path: '/',
    filename: 'home',
    eyebrow: 'Studio J Oliveira · Brive · Bordeaux · Limoges',
    title: 'Designer végétal biophilique',
    variant: 'dark',
  },
  {
    path: '/studio',
    filename: 'studio',
    eyebrow: 'À propos',
    title: 'Le studio — Jonathan Oliveira',
    variant: 'light',
  },
  {
    path: '/projets',
    filename: 'projets',
    eyebrow: 'Portefeuille',
    title: 'Réalisations & conceptions',
    variant: 'dark',
  },
  {
    path: '/realisations',
    filename: 'realisations',
    eyebrow: 'Portefeuille · Projets livrés',
    title: 'Réalisations',
    variant: 'light',
  },
  {
    path: '/conceptions',
    filename: 'conceptions',
    eyebrow: 'Portefeuille · Études en cours',
    title: 'Conceptions immersives',
    variant: 'dark',
  },
  {
    path: '/journal',
    filename: 'journal',
    eyebrow: 'Éditorial',
    title: 'Notes de studio',
    variant: 'light',
  },
  {
    path: '/contact',
    filename: 'contact',
    eyebrow: 'Engager le dialogue',
    title: 'Contact — Studio J Oliveira',
    variant: 'dark',
  },
  {
    path: '/demarrer-un-projet',
    filename: 'demarrer-un-projet',
    eyebrow: 'Parcours client',
    title: 'Démarrer un projet',
    variant: 'light',
  },
  {
    path: '/zones',
    filename: 'zones/index',
    eyebrow: 'Couverture territoriale',
    title: 'Zones d’intervention',
    variant: 'light',
  },
  {
    path: '/zones/brive-la-gaillarde',
    filename: 'zones/brive-la-gaillarde',
    eyebrow: 'Zone · Corrèze (19) · Siège',
    title: 'Paysagiste designer à Brive',
    variant: 'light',
  },
  {
    path: '/zones/bordeaux',
    filename: 'zones/bordeaux',
    eyebrow: 'Zone · Gironde (33)',
    title: 'Paysagiste designer à Bordeaux',
    variant: 'light',
  },
  {
    path: '/zones/limoges',
    filename: 'zones/limoges',
    eyebrow: 'Zone · Haute-Vienne (87) · Bureau d’études',
    title: 'Paysagiste designer à Limoges',
    variant: 'light',
  },
];

const OG_BY_PATH = new Map(OG_PAGES.map((p) => [p.path, p]));

/**
 * Retourne le chemin /og/... pour une pathname donnée, ou null si la page
 * n'a pas d'OG dédiée (fallback /og-default.jpg côté BaseLayout).
 */
export function getOgImagePath(pathname: string): string | null {
  // Normalise trailing slash : Astro est en trailingSlash: 'never'
  const normalized =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const entry = OG_BY_PATH.get(normalized);
  return entry ? `/og/${entry.filename}.jpg` : null;
}
