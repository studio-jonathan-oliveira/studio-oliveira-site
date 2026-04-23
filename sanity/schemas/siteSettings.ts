import { defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Paramètres du site',
  type: 'document',
  // Singleton : un seul doc, pas de création multiple dans le studio.
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'siteName',
      type: 'string',
      title: 'Nom du site',
      initialValue: 'Studio J Oliveira',
      validation: (r) => r.required(),
    },
    { name: 'tagline', type: 'string', title: 'Tagline' },
    {
      name: 'logo',
      type: 'image',
      title: 'Logo principal',
      options: { hotspot: true },
    },
    {
      name: 'contact',
      type: 'object',
      title: 'Contact',
      fields: [
        { name: 'phone', type: 'string', title: 'Téléphone (format international)' },
        { name: 'email', type: 'email', title: 'Email' },
        { name: 'address', type: 'text', rows: 3, title: 'Adresse complète' },
      ],
    },
    {
      name: 'social',
      type: 'object',
      title: 'Réseaux sociaux',
      fields: [
        { name: 'instagram', type: 'url', title: 'Instagram' },
        { name: 'linkedin', type: 'url', title: 'LinkedIn' },
        { name: 'pinterest', type: 'url', title: 'Pinterest' },
      ],
    },
    {
      name: 'defaultOgImage',
      type: 'image',
      title: 'Image OG par défaut',
      options: { hotspot: true },
    },
  ],
  preview: { prepare: () => ({ title: 'Paramètres du site' }) },
});
