/*
 * Sanity CLI — config pour `sanity deploy`, `sanity dataset`, etc.
 * Vit dans le package Studio autonome (sanity/).
 */
import { defineCliConfig } from 'sanity/cli';

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID ?? '';
const dataset =
  process.env.SANITY_STUDIO_DATASET ?? process.env.PUBLIC_SANITY_DATASET ?? 'production';

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  studioHost: 'studio-oliveira',
  autoUpdates: true,
});
