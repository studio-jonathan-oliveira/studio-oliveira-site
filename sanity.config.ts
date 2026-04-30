/*
 * Sanity Studio — config racine.
 *
 * Studio embedded dans ce repo (deps `sanity` + `@sanity/vision` à la racine).
 * Règle dure : ne JAMAIS importer ce fichier ni `/sanity/` depuis `/src/`.
 * Le client front consomme uniquement `src/lib/sanity.ts`.
 *
 * Lancer le studio en local :
 *   pnpm studio:dev
 *
 * Déployer le studio sur sanity.studio :
 *   pnpm studio:deploy
 */
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID ?? '';
const dataset =
  process.env.SANITY_STUDIO_DATASET ?? process.env.PUBLIC_SANITY_DATASET ?? 'production';

export default defineConfig({
  name: 'studio-oliveira',
  title: 'Studio J Oliveira — CMS',
  projectId,
  dataset,

  plugins: [
    // Structure : arborescence du contenu. Singletons (siteSettings) isolés du
    // reste pour éviter "create new" sur ce qui doit rester unique.
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenu')
          .items([
            S.listItem()
              .title('Paramètres du site')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.documentTypeListItem('typology').title('Typologies de jardin'),
            S.documentTypeListItem('service').title('Verticales pro (intérieur)'),
            S.divider(),
            S.documentTypeListItem('project').title('Projets'),
            S.documentTypeListItem('article').title('Journal (articles)'),
            S.documentTypeListItem('author').title('Auteurs'),
            S.divider(),
            S.documentTypeListItem('location').title('Zones d’intervention'),
            S.documentTypeListItem('testimonial').title('Témoignages'),
          ]),
    }),
    // Vision : interroger GROQ depuis le studio (debug, exploration data).
    visionTool({
      defaultApiVersion: '2026-04-22',
      defaultDataset: dataset,
    }),
  ],

  schema: {
    types: schemaTypes,
    // Empêche création de docs siteSettings supplémentaires (singleton).
    templates: (templates) => templates.filter(({ schemaType }) => schemaType !== 'siteSettings'),
  },

  document: {
    // Empêche aussi la suppression du singleton via le menu actions.
    actions: (input, context) =>
      context.schemaType === 'siteSettings'
        ? input.filter(
            ({ action }) => !action || ['publish', 'discardChanges', 'restore'].includes(action),
          )
        : input,
  },
});
