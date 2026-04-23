import { defineType } from 'sanity';

export default defineType({
  name: 'article',
  title: 'Article (Journal)',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', validation: (r) => r.required() },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug URL',
      options: { source: 'title', maxLength: 80 },
      validation: (r) => r.required(),
    },
    {
      name: 'excerpt',
      type: 'text',
      rows: 3,
      title: 'Chapeau',
      description: '1-3 phrases, utilisé en liste + meta description par défaut.',
      validation: (r) => r.max(300),
    },
    {
      name: 'coverImage',
      type: 'image',
      title: 'Image de couverture',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', validation: (r) => r.required() }],
      validation: (r) => r.required(),
    },
    {
      name: 'author',
      type: 'reference',
      title: 'Auteur',
      to: [{ type: 'author' }],
      validation: (r) => r.required(),
    },
    {
      name: 'publishedAt',
      type: 'datetime',
      title: 'Date de publication',
      validation: (r) => r.required(),
    },
    {
      name: 'readingTime',
      type: 'number',
      title: 'Temps de lecture (minutes)',
      description: 'À calculer : 200 mots/min. Ou saisir manuellement.',
      validation: (r) => r.min(1).max(120),
    },
    {
      name: 'tags',
      type: 'array',
      title: 'Tags',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    },
    {
      name: 'content',
      type: 'blockContent',
      title: 'Contenu',
      validation: (r) => r.required(),
    },
    { name: 'seo', type: 'seo', title: 'SEO' },
  ],
  preview: {
    select: { title: 'title', media: 'coverImage', subtitle: 'publishedAt' },
    prepare: ({ title, media, subtitle }) => ({
      title,
      media,
      subtitle: subtitle ? new Date(subtitle).toLocaleDateString('fr-FR') : undefined,
    }),
  },
  orderings: [
    {
      title: 'Publication (récent → ancien)',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
});
