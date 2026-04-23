import { defineType } from 'sanity';

/**
 * Project — un projet (réalisation ou conception).
 *
 * `section` différencie :
 *   - `realisations` → photos réelles, aboutis
 *   - `conceptions`  → rendus Twinmotion, études en cours
 *
 * Le scroll-scrub Twinmotion est activé via `scrollFramesSlug` + `scrollFramesCount`
 * (correspondent aux outputs de scripts/process-frames.ts dans public/scrollframes/[slug]/).
 */
export default defineType({
  name: 'project',
  title: 'Projet',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Titre du projet',
      validation: (r) => r.required(),
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug URL',
      options: { source: 'title', maxLength: 60 },
      validation: (r) => r.required(),
    },
    {
      name: 'section',
      type: 'string',
      title: 'Section',
      options: {
        list: [
          { title: 'Réalisations (photos réelles)', value: 'realisations' },
          { title: 'Conceptions (rendus Twinmotion)', value: 'conceptions' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
      initialValue: 'realisations',
    },
    {
      name: 'typology',
      type: 'reference',
      title: 'Typologie',
      to: [{ type: 'typology' }],
    },
    {
      name: 'year',
      type: 'number',
      title: 'Année',
      validation: (r) => r.min(2000).max(2100),
    },
    { name: 'client', type: 'string', title: 'Client (si diffusable)' },
    { name: 'location', type: 'string', title: 'Lieu' },
    { name: 'surface', type: 'string', title: 'Surface', description: 'Ex : "180 m²"' },
    {
      name: 'featured',
      type: 'boolean',
      title: 'Mis en avant sur la home',
      initialValue: false,
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
      name: 'gallery',
      type: 'array',
      title: 'Galerie',
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
      name: 'scrollFramesSlug',
      type: 'string',
      title: 'Slug scroll-frames',
      description:
        'Si scroll-scrub immersif activé, dossier public/scrollframes/[slug]. Doit matcher le slug fourni à scripts/process-frames.ts.',
      hidden: ({ document }) => document?.section !== 'conceptions',
    },
    {
      name: 'scrollFramesCount',
      type: 'number',
      title: 'Nombre de frames',
      description: 'Typiquement 192. À synchroniser avec le manifest.json généré.',
      hidden: ({ document }) => document?.section !== 'conceptions',
      validation: (r) => r.min(0).max(500),
    },
    {
      name: 'twinmotionVideo',
      type: 'file',
      title: 'Vidéo Twinmotion (fallback mobile)',
      hidden: ({ document }) => document?.section !== 'conceptions',
    },
    {
      name: 'description',
      type: 'blockContent',
      title: 'Description / parti-pris',
    },
    {
      name: 'challenge',
      type: 'blockContent',
      title: 'Le défi',
    },
    {
      name: 'solution',
      type: 'blockContent',
      title: 'La réponse apportée',
    },
    {
      name: 'outcomeStats',
      type: 'array',
      title: 'Chiffres-clés',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', type: 'string', title: 'Valeur (ex : "180 m²")', validation: (r) => r.required() },
            { name: 'label', type: 'string', title: 'Libellé (ex : "Surface traitée")', validation: (r) => r.required() },
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        },
      ],
      validation: (r) => r.max(4),
    },
    { name: 'seo', type: 'seo', title: 'SEO' },
  ],
  preview: {
    select: { title: 'title', subtitle: 'location', media: 'coverImage', section: 'section' },
    prepare: ({ title, subtitle, media, section }) => ({
      title,
      subtitle: [section === 'realisations' ? 'Réalisation' : 'Conception', subtitle].filter(Boolean).join(' · '),
      media,
    }),
  },
  orderings: [
    {
      title: 'Année (récent → ancien)',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
  ],
});
