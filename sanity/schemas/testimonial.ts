import { defineType } from 'sanity';

export default defineType({
  name: 'testimonial',
  title: 'Témoignage',
  type: 'document',
  fields: [
    {
      name: 'quote',
      type: 'text',
      rows: 4,
      title: 'Quote',
      validation: (r) => r.required().min(20).max(400),
    },
    { name: 'author', type: 'string', title: 'Nom de l’auteur', validation: (r) => r.required() },
    { name: 'role', type: 'string', title: 'Rôle / titre (B2B)' },
    { name: 'company', type: 'string', title: 'Entreprise / établissement (B2B)' },
    {
      name: 'avatar',
      type: 'image',
      title: 'Photo (si consentement diffusion)',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string' }],
    },
    {
      name: 'associatedProject',
      type: 'reference',
      title: 'Projet associé',
      to: [{ type: 'project' }],
    },
    {
      name: 'consent',
      type: 'boolean',
      title: 'Consentement diffusion publique',
      description: 'À cocher uniquement après accord explicite du client.',
      initialValue: false,
      validation: (r) => r.required(),
    },
  ],
  preview: {
    select: { title: 'author', subtitle: 'quote', media: 'avatar' },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle?.slice(0, 80) + (subtitle && subtitle.length > 80 ? '…' : ''),
      media,
    }),
  },
});
