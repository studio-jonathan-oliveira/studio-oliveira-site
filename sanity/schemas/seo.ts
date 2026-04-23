import { defineType } from 'sanity';

/**
 * SEO — object réutilisable inliné dans les docs principaux.
 */
export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    {
      name: 'seoTitle',
      type: 'string',
      title: 'Titre SEO',
      description: '≤ 60 caractères. Sera complété par « — Studio J Oliveira ».',
      validation: (r) => r.max(60).warning('Idéalement ≤ 60 caractères.'),
    },
    {
      name: 'seoDescription',
      type: 'text',
      rows: 3,
      title: 'Meta description',
      description: '140-160 caractères.',
      validation: (r) =>
        r.min(120).warning('Trop court.').max(170).warning('Trop long — préférer 140-160.'),
    },
    {
      name: 'ogImage',
      type: 'image',
      title: 'Image Open Graph (1200×630)',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt' }],
    },
  ],
  options: { collapsible: true, collapsed: true },
});
