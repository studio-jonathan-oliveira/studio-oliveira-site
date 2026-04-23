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

export function organization(): Thing {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE.name,
    url: SITE_URL,
    founder: { '@id': PERSON_ID },
    foundingDate: String(SITE.foundedYear),
    logo: `${SITE_URL}/brand/wordmark-moss.png`,
    sameAs: [SITE.social.instagram, SITE.social.linkedin, SITE.social.pinterest].filter(Boolean),
  };
}

export function person(): Thing {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: SITE.founderName,
    jobTitle: 'Designer végétal · Architecte biophilique',
    worksFor: { '@id': ORGANIZATION_ID },
    url: `${SITE_URL}/studio`,
  };
}

export function localBusiness(opts: { areaServed?: string[] } = {}): Thing {
  const areaServed = opts.areaServed ?? SITE.zones.map((z) => z.ville);
  return {
    '@type': 'ProfessionalService',
    '@id': LOCAL_BUSINESS_ID,
    name: SITE.name,
    description: SITE.tagline,
    url: SITE_URL,
    telephone: SITE.contact.phoneInternational,
    email: SITE.contact.email,
    image: `${SITE_URL}/brand/wordmark-moss.png`,
    founder: { '@id': PERSON_ID },
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      postalCode: SITE.address.postalCode,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.address.latitude,
      longitude: SITE.address.longitude,
    },
    areaServed: areaServed.map((city) => ({ '@type': 'City', name: city })),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: SITE.hours.open,
        closes: SITE.hours.close,
      },
    ],
  };
}

export function website(): Thing {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE.name,
    description: SITE.tagline,
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
  const thing: Thing = {
    '@type': 'Service',
    name: input.name,
    url: `${SITE_URL}/architecture-paysagere/${input.slug}`,
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
    author: input.authorName
      ? { '@type': 'Person', name: input.authorName }
      : { '@id': PERSON_ID },
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
    name: `${SITE.name} — ${input.ville}`,
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
