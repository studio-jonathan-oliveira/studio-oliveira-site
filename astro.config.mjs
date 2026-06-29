// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import vercel from '@astrojs/vercel';

// https://astro.build/config
// Adapter Vercel + output: 'static' (2026-05-11) : nécessaire pour les
// Astro Actions du formulaire contact. Toutes les pages restent prerender
// par défaut, seules les Actions endpoints s'exécutent en SSR. Aucun impact
// SEO/perf sur le reste du site.

// Sanity branché ? Tant qu'il ne l'est pas, /journal et /conceptions sont vides
// (fallback []) → noindex côté page + retrait du sitemap. Réintégrés
// automatiquement dès que Sanity est configuré (et donc peuplé). Voir audit
// go-live 2026-06-29.
const sanityConnected = Boolean(process.env.PUBLIC_SANITY_PROJECT_ID);

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? 'https://www.jonathanoliveira.fr',
  trailingSlash: 'never',
  output: 'static',
  adapter: vercel(),
  // Hub /architecture-paysagere supprimé 2026-06-05 (Morgan) — redirection 301
  // vers /projets (nouveau hub portefeuille). Les 4 typologies restent sous
  // /architecture-paysagere/[slug].
  redirects: {
    '/architecture-paysagere': '/projets',
  },
  build: {
    format: 'directory',
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('/mentions-legales') &&
        !page.includes('/confidentialite') &&
        !page.includes('/404') &&
        // Pages mock-projects draft (summary [À FOURNIR PAR JONATHAN]) :
        // noindex côté page + retrait du sitemap pour ne pas exposer des URLs
        // dont le contenu n'est pas finalisé.
        !page.includes('coeur-urbain-parenthese-exotique') &&
        !page.includes('frange-urbaine-restanque') &&
        !page.includes('provence-correzienne-domaine') &&
        !page.includes('/realisations/cafe-de-paris') &&
        !page.includes('/realisations/schmit-cuisine') &&
        !page.includes('/realisations/airbnb-signature') &&
        !page.includes('/realisations/jungle-room-agde') &&
        // architecture-publique = page squelette tant que Jonathan n'a pas
        // fourni le positionnement (noindex en prod via SHOW_DRAFTS).
        !page.includes('architecture-publique') &&
        // /journal et /conceptions vides tant que Sanity n'est pas branché.
        (sanityConnected || (!page.includes('/journal') && !page.includes('/conceptions'))),
    }),
    mdx(),
    partytown(),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
  },
});
