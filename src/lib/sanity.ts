/*
 * Client Sanity consommé côté Astro SSG (pas dans les islands React).
 *
 * Import depuis `src/lib/sanity.ts` — jamais depuis `/sanity/` qui est le package Studio.
 * La règle ESLint isolant `/sanity/` sera ajoutée au futur `eslint.config.js` Phase 2.
 *
 * Tant que `PUBLIC_SANITY_PROJECT_ID` n'est pas défini dans `.env`, le client est `null`
 * et les helpers de query retournent `[]` ou `null` — permet au build de passer sans
 * configuration Sanity complète (pages qui affichent des placeholders).
 */

import { createClient, type SanityClient } from '@sanity/client';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? 'production';
const token = import.meta.env.SANITY_API_TOKEN;

export const sanity: SanityClient | null = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2026-04-22',
      useCdn: true,
      token: token || undefined,
      perspective: 'published',
    })
  : null;

if (!sanity && import.meta.env.DEV) {
  console.warn(
    '[sanity] PUBLIC_SANITY_PROJECT_ID non défini — les queries retourneront null/[]. Configurer .env pour activer le CMS.',
  );
}

const builder = sanity ? createImageUrlBuilder(sanity) : null;

export function urlFor(source: SanityImageSource) {
  if (!builder) {
    throw new Error('[sanity] urlFor appelé sans client configuré. Vérifier .env.');
  }
  return builder.image(source);
}

/**
 * Fetch typé avec fallback silencieux si Sanity n'est pas configuré.
 * Retourne `fallback` en cas d'absence de client OU d'erreur réseau.
 */
export async function fetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T,
): Promise<T> {
  if (!sanity) return fallback;
  try {
    return await sanity.fetch<T>(query, params);
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('[sanity] fetch failed:', err);
    }
    return fallback;
  }
}
