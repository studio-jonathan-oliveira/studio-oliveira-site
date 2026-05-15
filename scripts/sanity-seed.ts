/*
 * Sanity seed — initialise le dataset avec le contenu hardcodé existant.
 *
 * À lancer UNE FOIS après avoir créé le projet Sanity et configuré .env :
 *
 *   pnpm tsx scripts/sanity-seed.ts
 *
 * Idempotent : utilise `createOrReplace` avec des `_id` déterministes.
 * Relancer le script écrase les docs existants par les versions à jour
 * du contenu hardcodé. Une fois Jonathan ayant édité dans le studio,
 * ne PLUS relancer (sinon écrasement de ses modifs).
 *
 * Sources :
 *   - src/lib/site-config.ts → siteSettings + 4 typologies + 5 services
 *   - src/data/zones-content.ts → 3 locations
 *
 * Variables d'environnement requises :
 *   - SANITY_STUDIO_PROJECT_ID (ou PUBLIC_SANITY_PROJECT_ID)
 *   - SANITY_STUDIO_DATASET (ou PUBLIC_SANITY_DATASET, défaut "production")
 *   - SANITY_API_TOKEN avec droits Editor (à générer dans sanity.io/manage)
 */

import { createClient } from '@sanity/client';
import { readFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import { SITE } from '../src/lib/site-config';
import { ZONES } from '../src/data/zones-content';
import { mockProjects } from '../src/data/mock-projects';
import { cleanDraft } from '../src/lib/drafts';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_STUDIO_DATASET ?? process.env.PUBLIC_SANITY_DATASET ?? 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  console.error('❌ SANITY_STUDIO_PROJECT_ID (ou PUBLIC_SANITY_PROJECT_ID) manquant dans .env');
  process.exit(1);
}
if (!token) {
  console.error('❌ SANITY_API_TOKEN manquant dans .env (générer depuis sanity.io/manage)');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-04-22',
  token,
  useCdn: false,
});

// ----------------------------------------------------------------------------
// SiteSettings (singleton)
// ----------------------------------------------------------------------------

async function seedSiteSettings() {
  const doc = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: SITE.name,
    tagline: SITE.tagline,
    founderName: SITE.founderName,
    foundedYear: SITE.foundedYear,
    phone: SITE.contact.phone,
    phoneDisplay: SITE.contact.phoneDisplay,
    email: SITE.contact.email,
    addressStreet: SITE.address.street,
    addressPostalCode: SITE.address.postalCode,
    addressCity: SITE.address.city,
    addressRegion: SITE.address.region,
    addressCountry: SITE.address.country,
    addressCountryCode: SITE.address.countryCode,
    addressLatitude: SITE.address.latitude,
    addressLongitude: SITE.address.longitude,
    hoursDays: SITE.hours.days,
    hoursOpen: SITE.hours.open,
    hoursClose: SITE.hours.close,
    instagram: SITE.social.instagram,
    linkedin: SITE.social.linkedin || undefined,
    pinterest: SITE.social.pinterest || undefined,
    companyName: SITE.legal.companyName,
    siret: SITE.legal.siret || undefined,
    legalForm: SITE.legal.legalForm || undefined,
    editorName: SITE.legal.editorName,
  };
  await client.createOrReplace(doc);
  console.log('✓ siteSettings');
}

// ----------------------------------------------------------------------------
// Typologies (4 docs, _id déterministe `typology.<slug>`)
// ----------------------------------------------------------------------------

async function seedTypologies() {
  for (let i = 0; i < SITE.typologies.length; i++) {
    const t = SITE.typologies[i]!;
    const doc = {
      _id: `typology.${t.slug}`,
      _type: 'typology',
      title: t.nomProprietaire,
      slug: { _type: 'slug', current: t.slug },
      order: i + 1,
      h1Seo: t.h1Seo,
      surface: t.surface,
      budgetTravaux: t.budgetTravaux,
      prixEtude: t.prixEtude,
      exemple: t.exemple,
    };
    await client.createOrReplace(doc);
    console.log(`✓ typology.${t.slug}`);
  }
}

// ----------------------------------------------------------------------------
// Services / verticales d'aménagement intérieur (5 docs)
// ----------------------------------------------------------------------------

async function seedServices() {
  for (let i = 0; i < SITE.verticalesInterieur.length; i++) {
    const v = SITE.verticalesInterieur[i]!;
    const doc = {
      _id: `service.${v.slug}`,
      _type: 'service',
      title: v.label,
      slug: { _type: 'slug', current: v.slug },
      order: i + 1,
      h1Seo: v.h1Seo,
    };
    await client.createOrReplace(doc);
    console.log(`✓ service.${v.slug}`);
  }
}

// ----------------------------------------------------------------------------
// Locations / zones (3 docs : Brive, Bordeaux, Limoges)
// ----------------------------------------------------------------------------

async function seedLocations() {
  for (let i = 0; i < ZONES.length; i++) {
    const z = ZONES[i]!;
    const doc = {
      _id: `location.${z.slug}`,
      _type: 'location',
      ville: z.ville,
      villeSimple: z.villeSimple,
      slug: { _type: 'slug', current: z.slug },
      region: z.region,
      departement: z.departement,
      codeDepartement: z.codeDepartement,
      role: z.role,
      order: i + 1,
      h1: z.h1,
      introLead: z.introLead,
      introLong: z.introLong,
      climatType: z.climat.type,
      climatDescription: z.climat.description,
      caracteristiquesPaysageres: z.caracteristiquesPaysageres,
      essences: z.essences,
      communesVoisines: z.communesVoisines,
      typologiesDominantes: z.typologiesDominantes.map((td) => ({
        _key: `td.${td.slug}`,
        _type: 'object',
        typology: { _type: 'reference', _ref: `typology.${td.slug}` },
        raison: td.raison,
      })),
      faq: z.faq.map((f, idx) => ({
        _key: `faq.${idx}`,
        _type: 'object',
        question: f.question,
        answer: f.answer,
      })),
      seo: {
        seoTitle: z.metaTitle,
        seoDescription: z.metaDescription,
      },
    };
    await client.createOrReplace(doc);
    console.log(`✓ location.${z.slug}`);
  }
}

// ----------------------------------------------------------------------------
// Projects (mockProjects → Sanity). Upload des covers + galerie + descriptifs
// nettoyés des marqueurs [À FOURNIR / À VALIDER] (vide plutôt que pollué).
// ----------------------------------------------------------------------------

async function uploadImage(filepath: string, altSuffix: string): Promise<string | null> {
  try {
    const buf = await readFile(filepath);
    const name = basename(filepath);
    const ext = extname(name).slice(1) || 'jpg';
    const asset = await client.assets.upload('image', buf, {
      filename: name,
      contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
    });
    return asset._id;
  } catch (err) {
    console.warn(`  ⚠  Upload échec pour ${filepath} (${altSuffix}) :`, (err as Error).message);
    return null;
  }
}

async function seedProjects() {
  // ⚠ Les imports Astro de mockProjects ne fonctionnent pas hors build
  // (resolved par Vite). On reconstruit les chemins via convention :
  // src/assets/projets/<sous-dossier>/<filename>.
  //
  // Tableau parallèle hardcodé des chemins disk pour matcher mockProjects.
  // À régénérer si on ajoute des projets dans mock-projects.ts.
  const projectAssetMap: Record<string, { cover: string; gallery: string[] }> = {
    'jungle-room-agde': {
      cover: 'src/assets/projets/jungle-room-entree.png',
      gallery: [
        'src/assets/projets/jungle-room-entree.png',
        'src/assets/projets/jungle-room-espaces.png',
        'src/assets/projets/jungle-room-mezzanine.png',
        'src/assets/projets/jungle-room/01-salon.webp',
        'src/assets/projets/jungle-room/02.webp',
        'src/assets/projets/jungle-room/03.webp',
      ],
    },
    'cafe-de-paris': {
      cover: 'src/assets/projets/cafe-de-paris/01-cover.webp',
      gallery: [
        'src/assets/projets/cafe-de-paris/01-cover.webp',
        'src/assets/projets/cafe-de-paris/02.webp',
        'src/assets/projets/cafe-de-paris/03.webp',
        'src/assets/projets/cafe-de-paris/04.webp',
        'src/assets/projets/cafe-de-paris/05.webp',
      ],
    },
    'schmit-cuisine': {
      cover: 'src/assets/projets/schmit-cuisine/01-cover.webp',
      gallery: [
        'src/assets/projets/schmit-cuisine/01-cover.webp',
        'src/assets/projets/schmit-cuisine/02.webp',
        'src/assets/projets/schmit-cuisine/03.webp',
        'src/assets/projets/schmit-cuisine/04.webp',
      ],
    },
    'airbnb-signature': {
      cover: 'src/assets/projets/airbnb/01-cover.webp',
      gallery: [
        'src/assets/projets/airbnb/01-cover.webp',
        'src/assets/projets/airbnb/02.webp',
        'src/assets/projets/airbnb/03.webp',
        'src/assets/projets/airbnb/04.webp',
        'src/assets/projets/airbnb/05.webp',
      ],
    },
    'coeur-urbain-parenthese-exotique': {
      cover: 'src/assets/projets/coeur-urbain-parenthese/01-cover.webp',
      gallery: [
        'src/assets/projets/coeur-urbain-parenthese/01-cover.webp',
        'src/assets/projets/coeur-urbain-parenthese/02.webp',
        'src/assets/projets/coeur-urbain-parenthese/03.webp',
      ],
    },
    'frange-urbaine-restanque': {
      cover: 'src/assets/projets/frange-urbaine-restanque/01-cover.webp',
      gallery: ['src/assets/projets/frange-urbaine-restanque/01-cover.webp'],
    },
    'provence-correzienne-domaine': {
      cover: 'src/assets/projets/provence-correzienne/01-cover.webp',
      gallery: ['src/assets/projets/provence-correzienne/01-cover.webp'],
    },
  };

  const root = process.cwd();

  for (const project of mockProjects) {
    const assets = projectAssetMap[project.slug];
    if (!assets) {
      console.warn(`  ⚠  Pas de mapping disk pour ${project.slug}, skip.`);
      continue;
    }

    // 1. Upload cover
    const coverAssetId = await uploadImage(join(root, assets.cover), `${project.slug} cover`);
    if (!coverAssetId) continue;

    // 2. Upload gallery (en parallèle pour aller plus vite)
    const galleryUploads = await Promise.all(
      project.gallery.map(async (img, i) => {
        const filepath = assets.gallery[i];
        if (!filepath) return null;
        const assetId = await uploadImage(join(root, filepath), `${project.slug} gallery ${i}`);
        if (!assetId) return null;
        return {
          _key: `g${i}`,
          _type: 'image',
          asset: { _type: 'reference' as const, _ref: assetId },
          alt: img.alt,
          caption: img.caption ?? undefined,
        };
      }),
    );

    const gallery = galleryUploads.filter((g): g is NonNullable<typeof g> => g !== null);

    // 3. Description Portable Text minimaliste depuis summary (cleanDraft)
    const cleanSummary = cleanDraft(project.summary, '');
    const description = cleanSummary
      ? [
          {
            _key: 'desc-0',
            _type: 'block',
            style: 'normal',
            children: [{ _key: 'desc-0-0', _type: 'span', marks: [], text: cleanSummary }],
            markDefs: [],
          },
        ]
      : undefined;

    const doc = {
      _id: `project.${project.slug}`,
      _type: 'project',
      title: project.title,
      slug: { _type: 'slug', current: project.slug },
      section: project.section,
      year: project.year,
      location: cleanDraft(project.location, ''),
      typology: project.typologySlug
        ? { _type: 'reference', _ref: `typology.${project.typologySlug}` }
        : undefined,
      featured: project.featured ?? false,
      coverImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: coverAssetId },
        alt: project.title,
      },
      gallery,
      description,
      scrollFramesSlug: project.scrollFramesSlug,
      scrollFramesCount: project.scrollFramesCount,
    };

    await client.createOrReplace(doc);
    console.log(`✓ project.${project.slug} (${gallery.length} images galerie)`);
  }
}

// ----------------------------------------------------------------------------
// Run
// ----------------------------------------------------------------------------

async function main() {
  console.log(`Seeding Sanity dataset "${dataset}" (project ${projectId})...\n`);
  await seedSiteSettings();
  console.log('');
  await seedTypologies();
  console.log('');
  await seedServices();
  console.log('');
  await seedLocations();
  console.log('');
  await seedProjects();
  console.log('\n✅ Seed terminé.\n');
  console.log(
    'Prochaine étape : ouvrir le studio (`pnpm studio:dev`) pour voir le contenu importé.',
  );
  console.log('Ne PAS relancer ce script après que Jonathan ait commencé à éditer dans le studio.');
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
