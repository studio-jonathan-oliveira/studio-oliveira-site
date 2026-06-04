/*
 * Palette brute — source unique de vérité pour les contextes JS/serveur où
 * les CSS variables de `src/styles/global.css` ne sont pas lisibles :
 *   - Meta `theme-color` (string statique dans le <head>)
 *   - Templates HTML d'emails (Resend, lus par les clients mail isolés)
 *   - Générateurs OG images (`scripts/generate-og-*.ts`)
 *   - Tout autre contexte hors-DOM (RSS, JSON-LD, etc.)
 *
 * RÈGLE : les valeurs hex de ce fichier DOIVENT rester strictement
 * synchrones avec la couche 1 de `src/styles/global.css` (palette brute).
 * Pour swap de palette : modifier les deux fichiers en même temps.
 *
 * Voir _brief/charte-couleurs.md pour la procédure.
 */

export const BRAND_COLORS = {
  cream: '#ede6d6', // BEIGE — swap palette finale 2026-06-04 (était #f5f1ea)
  moss: '#70725b',
  ink: '#000000', // NOIR pur (était #0a0a0a)
  violet: '#e0afff', // VIOLET/lilas — nouvel accent
  red: '#ff0d00', // LEGACY, en cours de retrait
  forestDeep: '#2a2d28',
  draft: '#d97706',
} as const;

/**
 * Couleur appliquée au meta `theme-color` (chrome mobile / barre URL).
 * Doit refléter le fond dominant du site, donc `cream` par défaut.
 */
export const THEME_COLOR_META = BRAND_COLORS.cream;

/**
 * Palette dérivée pour les templates d'emails (Resend).
 * Les clients mail ne lisent pas les CSS vars — on doit fournir les hex.
 * Mapping sémantique calqué sur la couche 2 de `global.css`.
 */
export const EMAIL_COLORS = {
  background: '#ece5d4', // légère variation pour le fond email (offset 1 pt vs beige)
  surface: '#ffffff',
  border: '#e5e2da',
  divider: '#eeeeee',
  textPrimary: '#111111',
  textMeta: '#666666',
  textMuted: '#888888',
} as const;
