import { defineType } from 'sanity';

/**
 * Location — pages SEO local `/zones/[slug]`.
 *
 * 3 docs : Brive (siège), Bordeaux, Limoges.
 *
 * Aligné sur la structure de `src/data/zones-content.ts` qui sert de seed
 * et de source de vérité tant que Sanity n'est pas peuplé. Le script
 * `scripts/sanity-seed.ts` initialise les docs depuis ce fichier TS.
 */
export default defineType({
  name: 'location',
  title: 'Zone (page locale)',
  type: 'document',
  fieldsets: [
    { name: 'identite', title: 'Identité', options: { collapsible: false } },
    { name: 'editorial', title: 'Contenu éditorial', options: { collapsible: true } },
    { name: 'territoire', title: 'Climat & territoire', options: { collapsible: true } },
    { name: 'maillage', title: 'Communes & typologies', options: { collapsible: true } },
    { name: 'faqGroup', title: 'FAQ', options: { collapsible: true } },
    { name: 'seoGroup', title: 'SEO', options: { collapsible: true } },
  ],
  fields: [
    // Identité
    {
      name: 'ville',
      type: 'string',
      title: 'Ville (forme canonique avec accents/tirets)',
      fieldset: 'identite',
      validation: (r) => r.required(),
    },
    {
      name: 'villeSimple',
      type: 'string',
      title: 'Ville (forme simplifiée — Brive, Bordeaux…)',
      fieldset: 'identite',
      description: 'Utilisée dans les titres de section H2.',
    },
    {
      name: 'slug',
      type: 'slug',
      fieldset: 'identite',
      options: { source: 'ville', maxLength: 60 },
      validation: (r) => r.required(),
    },
    {
      name: 'region',
      type: 'string',
      title: 'Région',
      fieldset: 'identite',
    },
    {
      name: 'departement',
      type: 'string',
      title: 'Département',
      fieldset: 'identite',
    },
    {
      name: 'codeDepartement',
      type: 'string',
      title: 'Code département',
      fieldset: 'identite',
      validation: (r) => r.length(2),
    },
    {
      name: 'role',
      type: 'string',
      title: 'Rôle du studio',
      fieldset: 'identite',
      options: {
        list: [
          { value: 'siege', title: 'Siège social' },
          { value: 'bureau-etudes', title: 'Bureau d’études' },
          { value: 'zone-intervention', title: 'Zone d’intervention' },
        ],
        layout: 'radio',
      },
    },
    {
      name: 'order',
      type: 'number',
      title: 'Ordre d’affichage',
      fieldset: 'identite',
    },

    // Éditorial
    {
      name: 'h1',
      type: 'string',
      title: 'H1 (requête SEO ciblée)',
      fieldset: 'editorial',
      description: 'Ex : « Paysagiste designer à Brive-la-Gaillarde »',
      validation: (r) => r.required().min(20).max(80),
    },
    {
      name: 'introLead',
      type: 'text',
      rows: 3,
      title: 'Intro courte (au-dessus de la fold, 2-3 phrases)',
      fieldset: 'editorial',
    },
    {
      name: 'introLong',
      type: 'text',
      rows: 6,
      title: 'Intro longue (150-200 mots, après le H1)',
      fieldset: 'editorial',
      description:
        'Doit ratisser les requêtes locales (paysagiste, designer, architecte paysagiste + ville).',
    },
    {
      name: 'content',
      type: 'blockContent',
      title: 'Contenu long-form (optionnel — si on veut développer plus)',
      fieldset: 'editorial',
    },

    // Territoire
    {
      name: 'climatType',
      type: 'string',
      title: 'Type de climat (court)',
      fieldset: 'territoire',
      description: 'Ex : « Tempéré océanique à influence continentale »',
    },
    {
      name: 'climatDescription',
      type: 'text',
      rows: 4,
      title: 'Description du climat',
      fieldset: 'territoire',
    },
    {
      name: 'caracteristiquesPaysageres',
      type: 'text',
      rows: 3,
      title: 'Caractéristiques paysagères du territoire',
      fieldset: 'territoire',
    },
    {
      name: 'essences',
      type: 'array',
      title: 'Essences végétales adaptées',
      fieldset: 'territoire',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    },

    // Maillage
    {
      name: 'communesVoisines',
      type: 'array',
      title: 'Communes voisines (longue traîne géo)',
      fieldset: 'maillage',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    },
    {
      name: 'typologiesDominantes',
      type: 'array',
      title: 'Typologies dominantes localement',
      fieldset: 'maillage',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'typology',
              type: 'reference',
              to: [{ type: 'typology' }],
              validation: (r) => r.required(),
            },
            {
              name: 'raison',
              type: 'text',
              rows: 2,
              title: 'Raison locale',
            },
          ],
          preview: {
            select: { title: 'typology.title', subtitle: 'raison' },
          },
        },
      ],
    },

    // FAQ
    {
      name: 'faq',
      type: 'array',
      title: 'FAQ locale (6-8 questions)',
      fieldset: 'faqGroup',
      description:
        'Au moins une question doit comparer paysagiste / designer végétal pour capter cette requête.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', type: 'string', validation: (r) => r.required() },
            { name: 'answer', type: 'text', rows: 4, validation: (r) => r.required() },
          ],
          preview: { select: { title: 'question' } },
        },
      ],
    },

    // SEO
    {
      name: 'coverImage',
      type: 'image',
      title: 'Image de couverture',
      fieldset: 'seoGroup',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', validation: (r) => r.required() }],
    },
    {
      name: 'seo',
      type: 'seo',
      fieldset: 'seoGroup',
    },
  ],
  preview: {
    select: { title: 'ville', subtitle: 'role', media: 'coverImage' },
    prepare({ title, subtitle, media }) {
      const roleLabel =
        subtitle === 'siege'
          ? 'Siège social'
          : subtitle === 'bureau-etudes'
            ? 'Bureau d’études'
            : 'Zone d’intervention';
      return { title, subtitle: roleLabel, media };
    },
  },
});
