import { defineType } from 'sanity';

/**
 * Typology — les 4 typologies de jardin propriétaires de Jonathan.
 * Le slug détermine l'URL `/architecture-paysagere/[slug]`.
 */
export default defineType({
  name: 'typology',
  title: 'Typologie',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Nom propriétaire',
      description: 'Ex : "Micro-urbain", "Cœur urbain", "Frange urbaine", "Domaines & Caractère"',
      validation: (r) => r.required(),
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug URL',
      options: {
        source: 'title',
        maxLength: 48,
        slugify: (input) =>
          input
            .toLowerCase()
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, ''),
      },
      validation: (r) => r.required(),
    },
    {
      name: 'order',
      type: 'number',
      title: 'Ordre d’affichage',
      description: '1 = micro-urbain … 4 = domaine-caractère',
      validation: (r) => r.required().min(1).max(10),
    },
    {
      name: 'h1Seo',
      type: 'string',
      title: 'H1 SEO (requête Google)',
      description:
        'Le titre visible en H1. Doit être une requête utilisateur réelle (ex : « Aménagement de petit jardin en ville »). Le nom propriétaire est ensuite repris en H2.',
      validation: (r) => r.required(),
    },
    {
      name: 'surface',
      type: 'string',
      title: 'Surface indicative',
      description: 'Ex : "< 50 m²"',
    },
    {
      name: 'budgetTravaux',
      type: 'string',
      title: 'Budget travaux indicatif',
      description: 'Ex : "< 20 k€"',
    },
    {
      name: 'prixEtude',
      type: 'string',
      title: 'Prix étude TTC',
      description: 'Ex : "1 200 €"',
    },
    {
      name: 'exemple',
      type: 'string',
      title: 'Exemple de typologie',
      description: 'Ex : "Terrasse, rooftop, patio intérieur"',
    },
    {
      name: 'shortDescription',
      type: 'text',
      rows: 3,
      title: 'Description courte (teaser)',
      description: '1-2 phrases. Utilisée dans les cartes teaser sur la home et le hub.',
    },
    {
      name: 'description',
      type: 'blockContent',
      title: 'Description longue',
      description: '1000-1500 mots. Voir _brief/plan-seo.md §3.2 pour la structure.',
    },
    {
      name: 'complexity',
      type: 'text',
      rows: 5,
      title: 'Complexité principale',
      description: 'Copie des points-clés du process PDF pour affichage dans une section dédiée.',
    },
    {
      name: 'livrablesInclus',
      type: 'array',
      title: 'Livrables inclus dans l’étude',
      of: [{ type: 'string' }],
    },
    {
      name: 'coverImage',
      type: 'image',
      title: 'Image de couverture',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', validation: (r) => r.required() }],
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
      name: 'relatedProjects',
      type: 'array',
      title: 'Projets liés',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      validation: (r) => r.max(6),
    },
    {
      name: 'faq',
      type: 'array',
      title: 'FAQ (pour schema FAQPage)',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', type: 'string', validation: (r) => r.required() },
            { name: 'answer', type: 'text', rows: 3, validation: (r) => r.required() },
          ],
          preview: { select: { title: 'question' } },
        },
      ],
      validation: (r) => r.min(3).warning('Minimum 3 questions pour activer le schema FAQPage.'),
    },
    { name: 'seo', type: 'seo', title: 'SEO' },
  ],
  preview: {
    select: { title: 'title', media: 'coverImage', subtitle: 'h1Seo' },
  },
  orderings: [
    { title: 'Ordre d’affichage', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
});
