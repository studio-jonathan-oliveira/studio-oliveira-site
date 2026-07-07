/*
 * Helpers JSON-LD typés — structured data pour SEO.
 *
 * Chaque fonction retourne un objet JSON-LD conforme à schema.org. Usage côté
 * Astro : passer l'objet dans un `<script type="application/ld+json">` via
 * `set:html={JSON.stringify(...)}`. Multiple schemas par page supportés via
 * `jsonLdGraph([...])`.
 *
 * Règles :
 * - Un seul LocalBusiness primaire partagé entre home, contact, zones/brive
 *   (même `@id` → consolidation Google).
 * - Person Jonathan référencée depuis /studio et comme auteur d'Article.
 * - Sitemap + canonical gérés ailleurs (astro.config + BaseLayout).
 */

import { SITE } from './site-config';
import { siteSettings } from './site-settings';

type Thing = Record<string, unknown>;

const SITE_URL = SITE.url;
const LOCAL_BUSINESS_ID = `${SITE_URL}/#localbusiness`;
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const PERSON_ID = `${SITE_URL}/#jonathan`;

// Types ---------------------------------------------------------------------

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProjectSeoInput {
  title: string;
  slug: string;
  section: 'realisations' | 'conceptions';
  year?: number | null | undefined;
  location?: string | null | undefined;
  coverImage?: string | undefined;
  description?: string | undefined;
}

export interface ArticleSeoInput {
  title: string;
  slug: string;
  excerpt?: string | undefined;
  publishedAt: string;
  updatedAt?: string | undefined;
  coverImage?: string | undefined;
  readingTime?: number | undefined;
  authorName?: string | undefined;
}

export interface ServiceSeoInput {
  name: string;
  slug: string;
  /**
   * Path dédié au service, utilisé pour construire l'URL absolue.
   * Défaut : `/architecture-paysagere/[slug]` pour rétro-compat typologies.
   * Exemples : `/lcd-atypiques`, `/pros`, `/amenagement-vegetal-interieur/hotellerie`.
   */
  path?: string;
  description?: string;
  priceRangeMin?: number;
  priceRangeMax?: number;
  priceCurrency?: string;
  areaServed?: string[];
}

export interface LocationSeoInput {
  ville: string;
  slug: string;
  description?: string;
  region?: string;
}

// Builders ------------------------------------------------------------------

/**
 * Champ lexical métier — alimente `knowsAbout` (Person + Organization)
 * et `serviceType` (LocalBusiness). Couvre les requêtes Google que le studio
 * doit capter au-delà du positionnement « designer végétal » visible.
 *
 * Stratégie : visibilité maximale sur les synonymes du métier sans diluer
 * la marque dans le contenu lisible. Google lit ces tokens via JSON-LD,
 * l'utilisateur humain ne les voit pas.
 */
export const KEYWORDS_METIER = [
  // Métier principal et synonymes
  'Designer végétal',
  'Designer paysagiste',
  'Architecte paysagiste',
  'Concepteur paysagiste',
  'Concepteur de jardins',
  'Paysagiste designer',
  'Paysagiste concepteur',
  'Studio de design végétal',
  'Studio de paysage',
  'Cabinet de paysagisme',
  'Bureau d’études paysage',
  // Spécialités
  'Design biophilique',
  'Architecture biophilique',
  'Biophilie appliquée',
  'Conception de jardin sur mesure',
  'Aménagement paysager',
  'Aménagement extérieur',
  'Aménagement de jardin',
  'Aménagement végétal',
  'Aménagement végétal d’intérieur',
  'Décor végétal',
  'Mur végétal',
  'Toiture végétalisée',
  'Jardin intérieur',
  'Patio végétalisé',
  'Terrasse végétalisée',
  'Rooftop végétalisé',
  // Typologies de projet
  'Petit jardin de ville',
  'Jardin de ville sur mesure',
  'Grand jardin péri-urbain',
  'Parc privé',
  'Domaine privé',
  'Jardin de caractère',
  'Jardin contemporain',
  'Jardin méditerranéen',
  'Jardin sec',
  'Jardin d’architecte',
  'Jardin de maison de ville',
  'Jardin de résidence secondaire',
  // Verticales pro
  'Décorateur végétal hôtellerie',
  'Aménagement végétal restaurant',
  'Végétalisation de bureaux',
  'Végétalisation commerce',
  'Aménagement Airbnb atypique',
  'Scénographie végétale',
  // Geo
  'Paysagiste Brive',
  'Paysagiste Brive-la-Gaillarde',
  'Paysagiste Corrèze',
  'Paysagiste Limousin',
  'Paysagiste Aquitaine',
  'Paysagiste Bordeaux',
  'Paysagiste Limoges',
  'Paysagiste Haute-Vienne',
  'Designer végétal Bordeaux',
  'Designer végétal Brive',
  'Designer végétal Limoges',
  'Architecte paysagiste Aquitaine',
  'Architecte paysagiste Nouvelle-Aquitaine',
];

const SERVICE_TYPES = [
  'Conception de jardin sur mesure',
  'Aménagement paysager',
  'Aménagement de jardin',
  'Aménagement végétal d’intérieur',
  'Design biophilique',
  'Étude paysagère',
  'Maîtrise d’œuvre paysagère',
  'Suivi de chantier paysager',
  'Conseil en végétalisation',
  'Scénographie végétale',
  'Décor végétal pour hôtellerie',
  'Décor végétal pour restauration',
  'Végétalisation de bureaux',
  'Aménagement Airbnb et locations atypiques',
];

const ALTERNATE_NAMES = [
  'Studio Oliveira',
  'Studio Jonathan Oliveira',
  'Studio J Oliveira — Designer paysagiste',
  'Paysagiste designer Brive',
  'Architecte paysagiste Brive-la-Gaillarde',
  'Designer paysagiste Corrèze',
];

export function organization(): Thing {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: siteSettings.name,
    alternateName: ALTERNATE_NAMES,
    url: SITE_URL,
    founder: { '@id': PERSON_ID },
    foundingDate: String(siteSettings.foundedYear),
    logo: `${SITE_URL}/brand/wordmark-moss.png`,
    description: siteSettings.tagline,
    knowsAbout: KEYWORDS_METIER,
    sameAs: [
      siteSettings.social.instagram,
      siteSettings.social.linkedin,
      siteSettings.social.pinterest,
    ].filter(Boolean),
  };
}

export function person(): Thing {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: siteSettings.founderName,
    jobTitle: 'Designer paysagiste · Architecte biophilique',
    description:
      'Designer paysagiste fondateur du Studio J Oliveira. Conception de jardins, aménagement végétal d’intérieur et design biophilique en Nouvelle-Aquitaine.',
    knowsAbout: KEYWORDS_METIER,
    worksFor: { '@id': ORGANIZATION_ID },
    url: `${SITE_URL}/studio`,
    sameAs: [siteSettings.social.instagram].filter(Boolean),
  };
}

export function localBusiness(opts: { areaServed?: string[] } = {}): Thing {
  const areaServed = opts.areaServed ?? SITE.zones.map((z) => z.ville);
  return {
    // ProfessionalService = sous-type de LocalBusiness. Multi-typage pour cumuler
    // les signaux Google : LocalBusiness (rich results local) + ProfessionalService
    // (catégorie métier) + Organization (entité globale).
    '@type': ['ProfessionalService', 'LocalBusiness'],
    '@id': LOCAL_BUSINESS_ID,
    name: siteSettings.name,
    alternateName: ALTERNATE_NAMES,
    description: siteSettings.tagline,
    slogan: 'Designer végétal · Studio de design biophilique',
    knowsAbout: KEYWORDS_METIER,
    serviceType: SERVICE_TYPES,
    priceRange: '€€€',
    url: SITE_URL,
    telephone: siteSettings.contact.phoneInternational,
    email: siteSettings.contact.email,
    image: `${SITE_URL}/brand/wordmark-moss.png`,
    founder: { '@id': PERSON_ID },
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteSettings.address.street,
      postalCode: siteSettings.address.postalCode,
      addressLocality: siteSettings.address.city,
      addressRegion: siteSettings.address.region,
      addressCountry: siteSettings.address.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteSettings.address.latitude,
      longitude: siteSettings.address.longitude,
    },
    areaServed: areaServed.map((city) => ({ '@type': 'City', name: city })),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: siteSettings.hours.open,
        closes: siteSettings.hours.close,
      },
    ],
  };
}

export function website(): Thing {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: siteSettings.name,
    description: siteSettings.tagline,
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'fr-FR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbs(items: BreadcrumbItem[]): Thing {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.item.startsWith('http') ? item.item : `${SITE_URL}${item.item}`,
    })),
  };
}

export function faqPage(items: FaqItem[]): Thing {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: it.answer,
      },
    })),
  };
}

export function service(input: ServiceSeoInput): Thing {
  const path = input.path ?? `/architecture-paysagere/${input.slug}`;
  const thing: Thing = {
    '@type': 'Service',
    name: input.name,
    url: `${SITE_URL}${path}`,
    provider: { '@id': LOCAL_BUSINESS_ID },
    areaServed: (input.areaServed ?? SITE.zones.map((z) => z.ville)).map((city) => ({
      '@type': 'City',
      name: city,
    })),
  };
  if (input.description) thing.description = input.description;
  if (input.priceRangeMin != null && input.priceRangeMax != null) {
    thing.offers = {
      '@type': 'Offer',
      priceSpecification: {
        '@type': 'PriceSpecification',
        minPrice: input.priceRangeMin,
        maxPrice: input.priceRangeMax,
        priceCurrency: input.priceCurrency ?? 'EUR',
      },
    };
  }
  return thing;
}

export function creativeWorkProject(input: ProjectSeoInput): Thing {
  const thing: Thing = {
    '@type': 'CreativeWork',
    name: input.title,
    url: `${SITE_URL}/${input.section}/${input.slug}`,
    creator: { '@id': PERSON_ID },
  };
  if (input.description) thing.description = input.description;
  if (input.coverImage) thing.image = input.coverImage;
  if (input.year) thing.dateCreated = String(input.year);
  if (input.location) {
    thing.locationCreated = { '@type': 'Place', name: input.location };
  }
  return thing;
}

export function article(input: ArticleSeoInput): Thing {
  const thing: Thing = {
    '@type': 'Article',
    headline: input.title,
    url: `${SITE_URL}/journal/${input.slug}`,
    datePublished: input.publishedAt,
    author: input.authorName ? { '@type': 'Person', name: input.authorName } : { '@id': PERSON_ID },
    publisher: { '@id': ORGANIZATION_ID },
  };
  if (input.updatedAt) thing.dateModified = input.updatedAt;
  if (input.excerpt) thing.description = input.excerpt;
  if (input.coverImage) thing.image = input.coverImage;
  if (input.readingTime) thing.timeRequired = `PT${input.readingTime}M`;
  return thing;
}

export function locationBusiness(input: LocationSeoInput): Thing {
  return {
    '@type': 'ProfessionalService',
    name: `${siteSettings.name} — ${input.ville}`,
    url: `${SITE_URL}/zones/${input.slug}`,
    parentOrganization: { '@id': ORGANIZATION_ID },
    description:
      input.description ??
      `Studio de design biophilique intervenant à ${input.ville}${input.region ? ` (${input.region})` : ''}.`,
    areaServed: { '@type': 'City', name: input.ville },
  };
}

// Assemblage ----------------------------------------------------------------

/**
 * Empaquette plusieurs schemas dans un graph JSON-LD unique.
 * Résultat à injecter via `<script type="application/ld+json" set:html={...} />`.
 */
export function jsonLdGraph(items: Thing[]): string {
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@graph': items,
    },
    null,
    // Pas de pretty-print en prod (économie bytes)
    import.meta.env.DEV ? 2 : undefined,
  );
}
