/*
 * Configuration statique du site — NAP, contact, zones, réseaux.
 *
 * Source : _brief/client-docs/PROCESS ETUDES STUDIO 2026.pdf.
 * À terme, déplacer vers Sanity `siteSettings` (singleton) pour édition par Jonathan.
 * Pour l'instant, hardcodé pour éviter un aller-retour CMS sur des valeurs stables.
 */

export const SITE = {
  name: 'Studio J Oliveira',
  tagline: 'Designer végétal · Studio de design biophilique',
  founderName: 'Jonathan Oliveira',
  foundedYear: 2021,
  url: 'https://www.jonathanoliveira.fr',

  contact: {
    phone: '+33661088444',
    phoneDisplay: '06 61 08 84 44',
    phoneInternational: '+33 6 61 08 84 44',
    // [À FOURNIR PAR JONATHAN : email pro sur domaine jonathanoliveira.fr — voir _brief/questions-ouvertes.md §3.3]
    email: 'contact.jonathanbiodesign@gmail.com',
  },

  address: {
    street: '41 rue Général Souham',
    postalCode: '19100',
    city: 'Brive-la-Gaillarde',
    region: 'Corrèze',
    country: 'France',
    countryCode: 'FR',
    // Coordonnées GPS à affiner si besoin via GMB
    latitude: 45.1582,
    longitude: 1.5326,
  },

  hours: {
    // Lundi-vendredi 9h-18h non-stop (process PDF)
    days: 'Lun–Ven',
    open: '09:00',
    close: '18:00',
  },

  zones: [
    { slug: 'brive-la-gaillarde', ville: 'Brive-la-Gaillarde', region: 'Corrèze', role: 'Siège social' },
    { slug: 'bordeaux', ville: 'Bordeaux', region: 'Aquitaine Sud', role: 'Point d’études' },
    { slug: 'limoges', ville: 'Limoges', region: 'Aquitaine Nord', role: 'Bureau Verneuil-sur-Vienne' },
    { slug: 'toulouse', ville: 'Toulouse', region: 'Haute-Garonne', role: 'Prospection' },
  ] as const,

  typologies: [
    {
      slug: 'micro-urbain',
      nomProprietaire: 'Micro-urbain',
      h1Seo: 'Aménagement de petit jardin en ville',
      surface: '< 50 m²',
      budgetTravaux: '< 20 k€',
      prixEtude: '1 200 €',
      coutEtudeNumeric: 1200,
      suiviChantierTaux: '12 %',
      exemple: 'Terrasse, rooftop, patio intérieur',
    },
    {
      slug: 'coeur-urbain',
      nomProprietaire: 'Cœur urbain',
      h1Seo: 'Conception de jardin de ville sur mesure',
      surface: '50 — 300 m²',
      budgetTravaux: '20 — 50 k€',
      prixEtude: '2 750 €',
      coutEtudeNumeric: 2750,
      suiviChantierTaux: '10 %',
      exemple: 'Maison de ville, cour patrimoniale',
    },
    {
      slug: 'frange-urbaine',
      nomProprietaire: 'Frange urbaine',
      h1Seo: 'Aménagement de grand jardin péri-urbain',
      surface: '300 — 1 500 m²',
      budgetTravaux: '50 — 90 k€',
      prixEtude: '4 250 €',
      coutEtudeNumeric: 4250,
      suiviChantierTaux: '8 %',
      exemple: 'Résidence, gîte, maison d’architecte',
    },
    {
      slug: 'domaine-caractere',
      nomProprietaire: 'Domaines & Caractère',
      h1Seo: 'Conception de parc et domaine privé',
      surface: 'Sans limite',
      budgetTravaux: '> 90 k€',
      prixEtude: '6 500 €',
      coutEtudeNumeric: 6500,
      suiviChantierTaux: '6 %',
      exemple: 'Château, manoir, domaine familial',
    },
  ] as const,

  verticalesInterieur: [
    {
      slug: 'hotellerie',
      label: 'Hôtellerie',
      h1Seo: 'Décor végétal pour hôtels et maisons d’hôtes',
    },
    {
      slug: 'restauration',
      label: 'Restauration',
      h1Seo: 'Aménagement végétal pour restaurants et bars',
    },
    {
      slug: 'bureaux',
      label: 'Bureaux',
      h1Seo: 'Végétalisation d’espaces de bureaux corporate',
    },
    {
      slug: 'commerces',
      label: 'Commerces',
      h1Seo: 'Décor végétal pour boutiques et concept stores',
    },
    {
      slug: 'airbnb-locations-atypiques',
      label: 'Airbnb & locations atypiques',
      h1Seo: 'Aménagement végétalisé pour locations courte durée',
    },
  ] as const,

  // Réseaux sociaux — [À FOURNIR PAR JONATHAN : URLs réelles]
  social: {
    instagram: '', // ex : https://www.instagram.com/oliveirastudio
    linkedin: '',
    pinterest: '',
  },

  // Mentions légales — [À FOURNIR PAR JONATHAN : SIRET, forme juridique, éditeur responsable]
  legal: {
    companyName: 'Studio J Oliveira',
    siret: '', // [À FOURNIR]
    legalForm: '', // [À FOURNIR]
    editorName: 'Jonathan Oliveira',
    hosting: {
      name: 'Vercel Inc.',
      address: '440 N Barranca Ave #4133, Covina, CA 91723, United States',
      url: 'https://vercel.com',
    },
  },
} as const;

export type TypologieSlug = (typeof SITE.typologies)[number]['slug'];
export type VerticaleInterieurSlug = (typeof SITE.verticalesInterieur)[number]['slug'];
export type ZoneSlug = (typeof SITE.zones)[number]['slug'];
