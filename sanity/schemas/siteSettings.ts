import { defineType } from 'sanity';

/**
 * SiteSettings — singleton de configuration globale.
 *
 * Aligné sur `src/lib/site-config.ts` qui sert de fallback statique.
 * Une fois Sanity peuplé, `src/lib/site-config.ts` peut être supprimé
 * et remplacé par une query GROQ avec mise en cache build-time.
 */
export default defineType({
  name: 'siteSettings',
  title: 'Paramètres du site',
  type: 'document',
  // Verrouillage singleton (création/suppression interdites) géré côté config
  // dans sanity/sanity.config.ts (templates + document.actions). L'ancien
  // `__experimental_actions` (Sanity v2) n'existe plus en v6.
  fieldsets: [
    { name: 'general', title: 'Général', options: { collapsible: false } },
    { name: 'contact', title: 'Contact (NAP)', options: { collapsible: true } },
    { name: 'address', title: 'Adresse complète', options: { collapsible: true } },
    { name: 'hours', title: 'Horaires', options: { collapsible: true } },
    { name: 'social', title: 'Réseaux sociaux', options: { collapsible: true } },
    { name: 'legal', title: 'Mentions légales', options: { collapsible: true } },
    { name: 'media', title: 'Médias', options: { collapsible: true } },
  ],
  fields: [
    // Général
    {
      name: 'siteName',
      type: 'string',
      title: 'Nom du site',
      fieldset: 'general',
      initialValue: 'Studio J Oliveira',
      validation: (r) => r.required(),
    },
    {
      name: 'tagline',
      type: 'string',
      title: 'Tagline',
      fieldset: 'general',
      initialValue: 'Designer paysagiste · Studio de design biophilique',
    },
    {
      name: 'founderName',
      type: 'string',
      title: 'Fondateur',
      fieldset: 'general',
      initialValue: 'Jonathan Oliveira',
    },
    {
      name: 'foundedYear',
      type: 'number',
      title: 'Année de création',
      fieldset: 'general',
      initialValue: 2021,
    },

    // Contact
    {
      name: 'phone',
      type: 'string',
      title: 'Téléphone (E.164)',
      fieldset: 'contact',
      description: 'Format international : +33661088444',
    },
    {
      name: 'phoneDisplay',
      type: 'string',
      title: 'Téléphone (affichage humain)',
      fieldset: 'contact',
      description: 'Ex : 06 61 08 84 44',
    },
    {
      name: 'email',
      type: 'email',
      title: 'Email principal',
      fieldset: 'contact',
    },

    // Adresse
    {
      name: 'addressStreet',
      type: 'string',
      title: 'Rue',
      fieldset: 'address',
    },
    {
      name: 'addressPostalCode',
      type: 'string',
      title: 'Code postal',
      fieldset: 'address',
    },
    {
      name: 'addressCity',
      type: 'string',
      title: 'Ville',
      fieldset: 'address',
    },
    {
      name: 'addressRegion',
      type: 'string',
      title: 'Région',
      fieldset: 'address',
    },
    {
      name: 'addressCountry',
      type: 'string',
      title: 'Pays',
      fieldset: 'address',
      initialValue: 'France',
    },
    {
      name: 'addressCountryCode',
      type: 'string',
      title: 'Code pays (ISO 2)',
      fieldset: 'address',
      initialValue: 'FR',
    },
    {
      name: 'addressLatitude',
      type: 'number',
      title: 'Latitude',
      fieldset: 'address',
    },
    {
      name: 'addressLongitude',
      type: 'number',
      title: 'Longitude',
      fieldset: 'address',
    },

    // Horaires
    {
      name: 'hoursDays',
      type: 'string',
      title: 'Jours d’ouverture (libellé)',
      fieldset: 'hours',
      initialValue: 'Lun–Ven',
    },
    {
      name: 'hoursOpen',
      type: 'string',
      title: 'Heure d’ouverture',
      fieldset: 'hours',
      initialValue: '09:00',
    },
    {
      name: 'hoursClose',
      type: 'string',
      title: 'Heure de fermeture',
      fieldset: 'hours',
      initialValue: '18:00',
    },

    // Social
    {
      name: 'instagram',
      type: 'url',
      title: 'Instagram',
      fieldset: 'social',
    },
    {
      name: 'linkedin',
      type: 'url',
      title: 'LinkedIn',
      fieldset: 'social',
    },
    {
      name: 'pinterest',
      type: 'url',
      title: 'Pinterest',
      fieldset: 'social',
    },

    // Légal
    {
      name: 'companyName',
      type: 'string',
      title: 'Raison sociale',
      fieldset: 'legal',
    },
    {
      name: 'siret',
      type: 'string',
      title: 'SIRET',
      fieldset: 'legal',
    },
    {
      name: 'legalForm',
      type: 'string',
      title: 'Forme juridique',
      fieldset: 'legal',
    },
    {
      name: 'editorName',
      type: 'string',
      title: 'Directeur de la publication',
      fieldset: 'legal',
    },

    // Médias
    {
      name: 'logo',
      type: 'image',
      title: 'Logo principal',
      fieldset: 'media',
      options: { hotspot: true },
    },
    {
      name: 'defaultOgImage',
      type: 'image',
      title: 'Image OG par défaut (1200×630)',
      fieldset: 'media',
      options: { hotspot: true },
    },
  ],
  preview: { prepare: () => ({ title: 'Paramètres du site' }) },
});
