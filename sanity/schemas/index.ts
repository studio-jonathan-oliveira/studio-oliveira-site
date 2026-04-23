/*
 * Barrel export des schémas Sanity.
 *
 * À importer depuis `sanity/sanity.config.ts` lors du scaffold Studio :
 *   import { schemaTypes } from './schemas';
 *   export default defineConfig({ schema: { types: schemaTypes }, ... });
 */

import blockContent from './blockContent';
import seo from './seo';
import siteSettings from './siteSettings';
import typology from './typology';
import service from './service';
import project from './project';
import article from './article';
import author from './author';
import location from './location';
import testimonial from './testimonial';

export const schemaTypes = [
  // Objects réutilisables en premier
  blockContent,
  seo,
  // Documents principaux
  siteSettings,
  typology,
  service,
  project,
  article,
  author,
  location,
  testimonial,
];
