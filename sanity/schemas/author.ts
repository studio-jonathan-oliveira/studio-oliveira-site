import { defineType } from 'sanity';

export default defineType({
  name: 'author',
  title: 'Auteur',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', validation: (r) => r.required() },
    {
      name: 'slug',
      type: 'slug',
      options: { source: 'name', maxLength: 48 },
      validation: (r) => r.required(),
    },
    { name: 'role', type: 'string', title: 'Rôle', description: 'Ex : "Designer végétal"' },
    {
      name: 'avatar',
      type: 'image',
      title: 'Portrait',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string' }],
    },
    { name: 'bio', type: 'text', rows: 4, title: 'Bio courte' },
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'avatar' } },
});
