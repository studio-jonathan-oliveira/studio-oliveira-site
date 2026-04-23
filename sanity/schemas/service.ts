import { defineType } from 'sanity';

/**
 * Service — verticales d'aménagement végétalisé d'intérieur.
 * Slug détermine `/amenagement-vegetal-interieur/[slug]` (hotellerie, restauration, etc.).
 */
export default defineType({
  name: 'service',
  title: 'Service intérieur (verticale)',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', validation: (r) => r.required() },
    {
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 60 },
      validation: (r) => r.required(),
    },
    {
      name: 'order',
      type: 'number',
      title: 'Ordre d’affichage',
      validation: (r) => r.min(1).max(20),
    },
    {
      name: 'h1Seo',
      type: 'string',
      title: 'H1 SEO (requête cherchée)',
      validation: (r) => r.required(),
    },
    {
      name: 'shortDescription',
      type: 'text',
      rows: 3,
      title: 'Description courte (hub teaser)',
    },
    {
      name: 'content',
      type: 'blockContent',
      title: 'Contenu détaillé',
      description: '1000-1500 mots — cf. _brief/plan-seo.md §5.',
    },
    {
      name: 'coverImage',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', validation: (r) => r.required() }],
    },
    {
      name: 'gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', validation: (r) => r.required() },
            { name: 'caption', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'relatedProjects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      validation: (r) => r.max(6),
    },
    {
      name: 'faq',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', type: 'string', validation: (r) => r.required() },
            { name: 'answer', type: 'text', rows: 3, validation: (r) => r.required() },
          ],
        },
      ],
    },
    { name: 'seo', type: 'seo' },
  ],
  preview: { select: { title: 'title', media: 'coverImage', subtitle: 'h1Seo' } },
});
