/*
 * GROQ queries — Sanity.
 *
 * Centralisées ici pour réutilisation multi-pages et génération de types future.
 * Convention : fragment partiel en UPPER_SNAKE, query complète en suffix "Query".
 */

// Fragments réutilisables ----------------------------------------------------

const IMAGE_FRAGMENT = `{
  _type,
  asset,
  hotspot,
  crop,
  alt,
  caption
}`;

const SEO_FRAGMENT = `{
  seoTitle,
  seoDescription,
  "ogImage": ogImage${IMAGE_FRAGMENT}
}`;

// Portable Text : spread brut + résolution des liens internes (type + slug +
// section) pour que le renderer construise l'URL de destination. Les images et
// blocs custom passent par le spread `...` (asset/_ref inclus, suffisant pour urlFor).
const BLOCK_CONTENT = `[]{
  ...,
  markDefs[]{
    ...,
    _type == "internalLink" => {
      "reference": {
        "_type": @.reference->_type,
        "slug": @.reference->slug.current,
        "section": @.reference->section
      }
    }
  }
}`;

// siteSettings (singleton) ---------------------------------------------------

export const siteSettingsQuery = /* groq */ `
  *[_type == "siteSettings"][0]{
    siteName,
    tagline,
    "logo": logo${IMAGE_FRAGMENT},
    contact,
    social,
    "defaultOgImage": defaultOgImage${IMAGE_FRAGMENT}
  }
`;

// Typologies (4 docs) --------------------------------------------------------

export const typologiesAllQuery = /* groq */ `
  *[_type == "typology"] | order(order asc) {
    _id, _updatedAt,
    title,
    "slug": slug.current,
    h1Seo,
    surface,
    budgetTravaux,
    prixEtude,
    exemple,
    shortDescription,
    "coverImage": coverImage${IMAGE_FRAGMENT}
  }
`;

export const typologyBySlugQuery = /* groq */ `
  *[_type == "typology" && slug.current == $slug][0]{
    _id, _updatedAt,
    title,
    "slug": slug.current,
    h1Seo,
    surface,
    budgetTravaux,
    prixEtude,
    exemple,
    shortDescription,
    description${BLOCK_CONTENT},
    complexity,
    livrablesInclus,
    faq,
    "coverImage": coverImage${IMAGE_FRAGMENT},
    "gallery": gallery[]${IMAGE_FRAGMENT},
    "relatedProjects": relatedProjects[]->{
      _id, title, "slug": slug.current, "coverImage": coverImage${IMAGE_FRAGMENT}
    },
    ...${SEO_FRAGMENT}
  }
`;

export const typologySlugsQuery = /* groq */ `
  *[_type == "typology" && defined(slug.current)][].slug.current
`;

// Services — verticales d'aménagement intérieur (hôtellerie, resto, etc.) ---

export const servicesAllQuery = /* groq */ `
  *[_type == "service"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    "coverImage": coverImage${IMAGE_FRAGMENT}
  }
`;

export const serviceBySlugQuery = /* groq */ `
  *[_type == "service" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    content${BLOCK_CONTENT},
    faq,
    "coverImage": coverImage${IMAGE_FRAGMENT},
    "gallery": gallery[]${IMAGE_FRAGMENT},
    "relatedProjects": relatedProjects[]->{
      _id, title, "slug": slug.current, "coverImage": coverImage${IMAGE_FRAGMENT}
    },
    ...${SEO_FRAGMENT}
  }
`;

// Projets — deux sections (réalisations / conceptions) ----------------------

export const projectsListQuery = /* groq */ `
  *[_type == "project" && section == $section] | order(year desc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    section,
    year,
    location,
    "typology": typology->slug.current,
    "typologyLabel": typology->title,
    "coverImage": coverImage${IMAGE_FRAGMENT},
    featured
  }
`;

// Hub /projets — cartes (conceptions ou réalisations) au format trame.
// Tri : `order` explicite d'abord, sinon année décroissante.
export const projectsHubQuery = /* groq */ `
  *[_type == "project" && section == $section] | order(coalesce(order, 9999) asc, year desc, _createdAt desc) {
    _id,
    title,
    subtitle,
    kind,
    year,
    location,
    "typologyLabel": typology->title,
    approche,
    "coverImage": coverImage${IMAGE_FRAGMENT}
  }
`;

export const projectsFeaturedQuery = /* groq */ `
  *[_type == "project" && featured == true] | order(year desc) [0...6] {
    _id, title, "slug": slug.current, section, year, location,
    "typology": typology->slug.current,
    "coverImage": coverImage${IMAGE_FRAGMENT}
  }
`;

export const projectBySlugQuery = /* groq */ `
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    section,
    year,
    location,
    client,
    surface,
    "typology": typology->{
      title, "slug": slug.current
    },
    "coverImage": coverImage${IMAGE_FRAGMENT},
    "gallery": gallery[]${IMAGE_FRAGMENT},
    scrollFramesSlug,
    scrollFramesCount,
    "twinmotionVideo": twinmotionVideo.asset->url,
    description${BLOCK_CONTENT},
    challenge${BLOCK_CONTENT},
    solution${BLOCK_CONTENT},
    outcomeStats[],
    ...${SEO_FRAGMENT}
  }
`;

export const projectSlugsQuery = /* groq */ `
  {
    "realisations": *[_type == "project" && section == "realisations" && defined(slug.current)][].slug.current,
    "conceptions": *[_type == "project" && section == "conceptions" && defined(slug.current)][].slug.current
  }
`;

// Articles blog --------------------------------------------------------------

export const articlesListQuery = /* groq */ `
  *[_type == "article" && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    readingTime,
    tags,
    "coverImage": coverImage${IMAGE_FRAGMENT},
    "author": author->{name, "slug": slug.current}
  }
`;

export const articleBySlugQuery = /* groq */ `
  *[_type == "article" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    readingTime,
    tags,
    content${BLOCK_CONTENT},
    "coverImage": coverImage${IMAGE_FRAGMENT},
    "author": author->{
      name, "slug": slug.current, bio, "avatar": avatar${IMAGE_FRAGMENT}
    },
    "relatedArticles": *[_type == "article" && slug.current != $slug && count(tags[@ in ^.^.tags]) > 0] | order(publishedAt desc)[0...3]{
      title, "slug": slug.current, excerpt, "coverImage": coverImage${IMAGE_FRAGMENT}
    },
    ...${SEO_FRAGMENT}
  }
`;

export const articleSlugsQuery = /* groq */ `
  *[_type == "article" && defined(slug.current)][].slug.current
`;

// Zones (pages locales) ------------------------------------------------------

export const locationBySlugQuery = /* groq */ `
  *[_type == "location" && slug.current == $slug][0]{
    _id,
    ville,
    "slug": slug.current,
    region,
    role,
    intro,
    climat,
    essences,
    content${BLOCK_CONTENT},
    faq,
    "coverImage": coverImage${IMAGE_FRAGMENT},
    ...${SEO_FRAGMENT}
  }
`;

// Témoignages ----------------------------------------------------------------

export const testimonialsAllQuery = /* groq */ `
  *[_type == "testimonial"] | order(_createdAt desc) {
    _id,
    quote,
    author,
    role,
    company,
    "avatar": avatar${IMAGE_FRAGMENT},
    "associatedProject": associatedProject->{
      title, "slug": slug.current
    }
  }
`;
