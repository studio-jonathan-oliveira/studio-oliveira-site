/*
 * Sanity Studio — config racine du package Studio AUTONOME (sanity/).
 *
 * Ce package est isolé du site Astro : ne JAMAIS l'importer depuis /src/.
 * Le client front consomme uniquement `src/lib/sanity.ts` (@sanity/client).
 *
 * Lancer le studio en local :   pnpm -C sanity install && pnpm -C sanity dev
 * Déployer sur *.sanity.studio : pnpm -C sanity deploy   (ou `pnpm studio:deploy` à la racine)
 *
 * Les IDs projet/dataset viennent de l'env (SANITY_STUDIO_* prioritaire, sinon
 * PUBLIC_SANITY_* partagé avec le site). Tant qu'ils sont vides, le studio
 * démarre mais ne se connecte à aucun dataset.
 */
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

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
