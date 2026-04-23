# Sanity patterns — CMS du projet

À consulter pour tout ce qui touche à Sanity Studio, schémas, GROQ queries, Portable Text.

---

## Règle architecturale fondamentale

**Sanity Studio est un package séparé** dans `/sanity/` à la racine du repo. Il a son propre `package.json` (à initialiser via `npm create sanity@latest` en Phase 2).

**Le dossier `src/` ne doit JAMAIS importer depuis `/sanity/`.** ESLint rule à configurer pour interdire ce pattern. Raison : on veut zéro empreinte Studio dans le bundle Astro (impact majeur sur CWV).

Le client Sanity utilisé depuis `src/` est `@sanity/client`, consommé dans `src/lib/sanity.ts`. Il parle à l'API Sanity (`.apicdn.sanity.io`), pas au Studio.

---

## Structure fichier `src/lib/sanity.ts`

```ts
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanity = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: '2026-04-22', // date lock pour stabilité
  useCdn: true, // CDN pour SSG + webhook rebuild
  token: import.meta.env.SANITY_API_TOKEN, // read-only, pour build SSG
});

const builder = imageUrlBuilder(sanity);
export const urlFor = (source: any) => builder.image(source);
```

**Ne pas** importer cette instance dans des composants client-side. Build time only (Astro SSG).

## Conventions de schémas

- **Nommage** : kebab-case pour les fichiers (`project.ts`, `typology.ts`), PascalCase pour les interfaces TS.
- **Slugs** : toujours via `slug` type avec validation regex FR-friendly : `/^[a-z0-9-]+$/`. Pas de caractères spéciaux.
- **Images** : toujours `{ hotspot: true, crop: true }` pour contrôle cadrage par Jonathan.
- **Required fields** : utiliser `validation: (Rule) => Rule.required()` systématique. Pas de champs optionnels cachés qui cassent le build.
- **Preview** : chaque schéma doit avoir un `preview` custom affichant le titre + image cover + statut, pour UX Studio.
- **Orderings** : prévoir `orderings` (par défaut, par date, par ordre manuel si pertinent).

## GROQ queries — toujours typées

```ts
// src/lib/queries.ts
export const projectSlugsQuery = `*[_type == "project" && defined(slug.current)][].slug.current`;

export const projectBySlugQuery = `
  *[_type == "project" && slug.current == $slug][0]{
    _id, title, slug, client, location, year,
    "typology": typology->slug.current,
    coverImage,
    gallery[]{ _key, asset, caption, alt },
    "scrollFramesProject": scrollFramesSlug,
    description, challenge, solution,
    seoTitle, seoDescription
  }
`;
```

Toujours typer le résultat :

```ts
import type { Project } from '@/types/sanity';

const project = await sanity.fetch<Project>(projectBySlugQuery, { slug });
```

Générer les types avec `sanity-codegen` ou `@sanity/types-gen` en Phase 2 — manuel au début, auto ensuite.

## Portable Text custom blocks

Blocs à implémenter pour le rich content (articles + descriptions projets) :

- **`figure`** : image pleine largeur + caption + alt. Rendu via `<figure>` HTML avec aspect-ratio + Astro `<Image>`.
- **`quote`** : citation éditoriale stylée. Rendu via `<blockquote>` avec guillemets typographiques « » en ornement.
- **`gallery`** : 2-3 images inline côte à côte (responsive).
- **`videoEmbed`** : YouTube/Vimeo lazy-loaded via `partytown`.
- **`callout`** : encadré d'information (utilisé rarement, par défaut le corps est fluide).

Pour Astro + Portable Text, utiliser `portabletext-svelte`... non, Astro. Utiliser `astro-portabletext` ou custom via `@portabletext/to-html`.

## Autonomie éditoriale de Jonathan — objectif

Jonathan doit pouvoir, en **totale autonomie** :

1. Ajouter un nouveau projet (titre, slug auto, cover, galerie, description, SEO)
2. Ajouter un nouvel article (titre, excerpt, cover, Portable Text rich, tags, SEO)
3. Modifier les textes des pages piliers sans toucher au code
4. Changer les coordonnées, social links, logo via `siteSettings` (singleton)

**Test de validation Phase 2** : Jonathan crée un projet de test → il apparaît en `/realisations/[slug]` après rebuild.

## Webhook Sanity → Vercel

- Dans Sanity Studio : créer un webhook `publish` qui pointe vers `https://api.vercel.com/v1/integrations/deploy/...` (deploy hook Vercel).
- Filtre GROQ : `_type in ["project", "article", "typology", "service", "siteSettings"]` — éviter rebuilds inutiles sur edits de drafts.
- Secret partagé pour validation (HMAC header).

## Anti-patterns

- **`useCdn: false` en prod** : ralentit tout, sauf si besoin de temps-réel (pas notre cas).
- **Fetch Sanity côté client** : jamais. SSG uniquement, ou Astro Actions pour interactions (ex : search).
- **Mettre la clé API write dans le client** : impossible, Sanity bloque. Mais surtout : `SANITY_API_TOKEN` ne doit jamais finir dans un `PUBLIC_*` env var.
- **Références circulaires non gérées** : `project → relatedProjects` peut créer des boucles. Limiter la profondeur dans les queries.
