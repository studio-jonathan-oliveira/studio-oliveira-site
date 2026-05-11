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
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? 'https://www.jonathanoliveira.fr',
  trailingSlash: 'never',
  output: 'static',
  adapter: vercel(),
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
        !page.includes('coeur-urbain-parenthese-exotique'),
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
