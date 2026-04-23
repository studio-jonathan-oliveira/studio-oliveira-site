import { defineType } from 'sanity';

/**
 * Location — pages SEO local `/zones/[ville]`.
 * 4 docs : Brive (siège), Bordeaux, Limoges, Toulouse.
 */
export default defineType({
  name: 'location',
  title: 'Zone (page locale)',
  type: 'document',
  fields: [
    { name: 'ville', type: 'string', title: 'Ville', validation: (r) => r.required() },
    {
      name: 'slug',
      type: 'slug',
      options: { source: 'ville', maxLength: 60 },
      validation: (r) => r.required(),
    },
    { name: 'region', type: 'string', title: 'Région' },
    {
      name: 'role',
      type: 'string',
      title: 'Rôle',
      description: 'Ex : "Siège social", "Bureau", "Point d’études", "Prospection"',
    },
    {
      name: 'order',
      type: 'number',
      title: 'Ordre d’affichage',
    },
    {
      name: 'intro',
      type: 'text',
      rows: 3,
      title: 'Intro (150 mots)',
    },
    {
      name: 'climat',
      type: 'text',
      rows: 4,
      title: 'Climat et territoire',
      description: 'Contexte local, essences adaptées.',
    },
    {
      name: 'essences',
      type: 'array',
      title: 'Essences végétales adaptées',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    },
    {
      name: 'content',
      type: 'blockContent',
      title: 'Contenu complet',
      description: '1500 mots minimum (2000 pour Brive). Unique, pas de copier-coller.',
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
    {
      name: 'coverImage',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', validation: (r) => r.required() }],
    },
    { name: 'seo', type: 'seo' },
  ],
  preview: {
    select: { title: 'ville', subtitle: 'role', media: 'coverImage' },
  },
});
