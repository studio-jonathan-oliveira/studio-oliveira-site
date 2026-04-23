import { defineType, defineArrayMember } from 'sanity';

/**
 * Portable Text — config partagée par les champs `content` rich.
 * Blocs custom : image légendée, citation, galerie inline.
 */
export default defineType({
  name: 'blockContent',
  title: 'Contenu rich',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Paragraphe', value: 'normal' },
        { title: 'Titre 2', value: 'h2' },
        { title: 'Titre 3', value: 'h3' },
        { title: 'Titre 4', value: 'h4' },
        { title: 'Citation', value: 'blockquote' },
      ],
      lists: [
        { title: 'Puces', value: 'bullet' },
        { title: 'Numérotée', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Gras', value: 'strong' },
          { title: 'Italique', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Lien externe',
            fields: [
              { name: 'href', type: 'url', title: 'URL' },
              {
                name: 'blank',
                type: 'boolean',
                title: 'Ouvrir dans un nouvel onglet',
                initialValue: true,
              },
            ],
          },
          {
            name: 'internalLink',
            type: 'object',
            title: 'Lien interne',
            fields: [
              {
                name: 'reference',
                type: 'reference',
                to: [
                  { type: 'project' },
                  { type: 'article' },
                  { type: 'typology' },
                  { type: 'service' },
                  { type: 'location' },
                ],
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texte alternatif (alt)',
          validation: (r) => r.required(),
        },
        { name: 'caption', type: 'string', title: 'Légende' },
      ],
    }),
    defineArrayMember({
      type: 'object',
      name: 'figureGallery',
      title: 'Galerie inline (2-3 images)',
      fields: [
        {
          name: 'images',
          type: 'array',
          of: [
            {
              type: 'image',
              options: { hotspot: true },
              fields: [
                { name: 'alt', type: 'string' },
                { name: 'caption', type: 'string' },
              ],
            },
          ],
          validation: (r) => r.min(2).max(3),
        },
      ],
    }),
    defineArrayMember({
      type: 'object',
      name: 'videoEmbed',
      title: 'Vidéo embed (YouTube / Vimeo)',
      fields: [
        { name: 'url', type: 'url', validation: (r) => r.required() },
        { name: 'caption', type: 'string', title: 'Légende' },
      ],
    }),
  ],
});
