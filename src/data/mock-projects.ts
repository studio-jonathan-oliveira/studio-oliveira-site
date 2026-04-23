/*
 * Projets mock — utilisés tant que Sanity n'est pas peuplé.
 *
 * Les photos référencées ici sont issues de `_brief/client-assets/photos-projets/`
 * (projets réels livrés par Jonathan), converties en WebP optimisés via
 * `scripts/convert-projets.mjs`.
 *
 * ⚠️ Les champs `title`, `location`, `year`, `typologyLabel` sont plausibles
 * mais À VALIDER PAR JONATHAN (notamment les années et villes précises).
 * Les `summary` sont en placeholder [À FOURNIR PAR JONATHAN].
 *
 * Quand Sanity Studio est opérationnel, `src/lib/sanity.ts` retournera les
 * projets réels et ce mock sera dépassé (fallback seulement si le CMS est vide).
 */

import type { ImageMetadata } from 'astro';

// Jungle Room — 1er projet livré historique, assets existants + ajouts du dossier client
import jungleEntree from '@/assets/projets/jungle-room-entree.png';
import jungleEspaces from '@/assets/projets/jungle-room-espaces.png';
import jungleMezzanine from '@/assets/projets/jungle-room-mezzanine.png';
import jungleSalon from '@/assets/projets/jungle-room/01-salon.webp';
import jungle02 from '@/assets/projets/jungle-room/02.webp';
import jungle03 from '@/assets/projets/jungle-room/03.webp';

// Café de Paris — restaurant / bar pro
import cafeCover from '@/assets/projets/cafe-de-paris/01-cover.webp';
import cafe02 from '@/assets/projets/cafe-de-paris/02.webp';
import cafe03 from '@/assets/projets/cafe-de-paris/03.webp';
import cafe04 from '@/assets/projets/cafe-de-paris/04.webp';
import cafe05 from '@/assets/projets/cafe-de-paris/05.webp';

// Schmit Cuisine — commerce / espace cuisine
import schmitCover from '@/assets/projets/schmit-cuisine/01-cover.webp';
import schmit02 from '@/assets/projets/schmit-cuisine/02.webp';
import schmit03 from '@/assets/projets/schmit-cuisine/03.webp';
import schmit04 from '@/assets/projets/schmit-cuisine/04.webp';

// Airbnb — LCD atypique
import airbnbCover from '@/assets/projets/airbnb/01-cover.webp';
import airbnb02 from '@/assets/projets/airbnb/02.webp';
import airbnb03 from '@/assets/projets/airbnb/03.webp';
import airbnb04 from '@/assets/projets/airbnb/04.webp';
import airbnb05 from '@/assets/projets/airbnb/05.webp';

// Conceptions Twinmotion
import coeurCover from '@/assets/projets/coeur-urbain-parenthese/01-cover.webp';
import coeur02 from '@/assets/projets/coeur-urbain-parenthese/02.webp';
import coeur03 from '@/assets/projets/coeur-urbain-parenthese/03.webp';
import frangeCover from '@/assets/projets/frange-urbaine-restanque/01-cover.webp';
import provenceCover from '@/assets/projets/provence-correzienne/01-cover.webp';

export interface MockProject {
  slug: string;
  title: string;
  section: 'realisations' | 'conceptions';
  year: number;
  location: string;
  typologyLabel: string;
  typologySlug?: string;
  cover: ImageMetadata;
  gallery: { src: ImageMetadata; alt: string; caption?: string }[];
  summary: string;
  featured?: boolean;
  // Pour les "conceptions" seulement
  scrollFramesSlug?: string;
  scrollFramesCount?: number;
}

export const mockProjects: MockProject[] = [
  // ═══════ RÉALISATIONS ═══════
  {
    slug: 'jungle-room-agde',
    title: 'Jungle Room — Agde',
    section: 'realisations',
    year: 2024,
    location: 'Agde, Occitanie',
    typologyLabel: 'LCD atypique',
    typologySlug: 'micro-urbain',
    cover: jungleEntree,
    gallery: [
      {
        src: jungleEntree,
        alt: 'Entrée végétalisée du Jungle Room avec cascade de lierre',
        caption: 'Entrée signature — cascade de lierre et signalétique laiton.',
      },
      {
        src: jungleEspaces,
        alt: 'Espaces de vie végétalisés — cuisine, banquette, mur textile',
        caption: 'Cuisine panoramique et espaces de vie intégrés.',
      },
      {
        src: jungleMezzanine,
        alt: 'Chambre mezzanine avec mur végétal immersif toute hauteur',
        caption: 'Mezzanine chambre — mur végétal immersif, HSP 5 m.',
      },
      {
        src: jungleSalon,
        alt: 'Salon du Jungle Room en ambiance immersive',
      },
      { src: jungle02, alt: 'Détail décor Jungle Room' },
      { src: jungle03, alt: 'Détail décor Jungle Room' },
    ],
    summary:
      '[À FOURNIR PAR JONATHAN : 3-5 phrases éditoriales sur le parti-pris du projet, les contraintes du lieu, le geste principal. Tonalité éditoriale 1ʳᵉ personne.]',
    featured: true,
  },
  {
    slug: 'cafe-de-paris',
    title: 'Café de Paris',
    section: 'realisations',
    year: 2024,
    location: '[À VALIDER PAR JONATHAN]',
    typologyLabel: 'Restauration',
    cover: cafeCover,
    gallery: [
      { src: cafeCover, alt: "Café de Paris — vue d'ensemble" },
      { src: cafe02, alt: 'Café de Paris — détail décor végétal' },
      { src: cafe03, alt: 'Café de Paris — ambiance salle' },
      { src: cafe04, alt: 'Café de Paris — détail signature végétale' },
      { src: cafe05, alt: 'Café de Paris — perspective générale' },
    ],
    summary:
      '[À FOURNIR PAR JONATHAN : 3-5 phrases sur le parti-pris du café, les contraintes du lieu, la sélection végétale, la scénographie de salle.]',
    featured: true,
  },
  {
    slug: 'schmit-cuisine',
    title: 'Schmit Cuisine',
    section: 'realisations',
    year: 2024,
    location: '[À VALIDER PAR JONATHAN]',
    typologyLabel: 'Commerce',
    cover: schmitCover,
    gallery: [
      { src: schmitCover, alt: 'Schmit Cuisine — vue principale' },
      { src: schmit02, alt: 'Schmit Cuisine — espace commercial' },
      { src: schmit03, alt: 'Schmit Cuisine — détail végétal' },
      { src: schmit04, alt: 'Schmit Cuisine — ambiance lieu' },
    ],
    summary:
      '[À FOURNIR PAR JONATHAN : 3-5 phrases sur le projet Schmit, contraintes commerce cuisine, sélection plantes adaptées au contexte.]',
  },
  {
    slug: 'airbnb-signature',
    title: 'Airbnb — location signature',
    section: 'realisations',
    year: 2024,
    location: '[À VALIDER PAR JONATHAN]',
    typologyLabel: 'LCD atypique',
    cover: airbnbCover,
    gallery: [
      { src: airbnbCover, alt: "Airbnb — vue d'ensemble" },
      { src: airbnb02, alt: 'Airbnb — espace de vie végétalisé' },
      { src: airbnb03, alt: 'Airbnb — détail décor' },
      { src: airbnb04, alt: 'Airbnb — chambre ou espace dédié' },
      { src: airbnb05, alt: 'Airbnb — ambiance signature' },
    ],
    summary:
      '[À FOURNIR PAR JONATHAN : 3-5 phrases sur le parti-pris de cet airbnb signature, pourquoi la location de courte durée atypique demande une écriture végétale dédiée.]',
    featured: true,
  },

  // ═══════ CONCEPTIONS (études en cours, rendus Twinmotion) ═══════
  {
    slug: 'coeur-urbain-parenthese-exotique',
    title: 'Parenthèse exotique',
    section: 'conceptions',
    year: 2026,
    location: '[À VALIDER PAR JONATHAN]',
    typologyLabel: 'Cœur urbain',
    typologySlug: 'coeur-urbain',
    cover: coeurCover,
    gallery: [
      { src: coeurCover, alt: 'Parenthèse exotique — rendu caméra Twinmotion' },
      { src: coeur02, alt: 'Parenthèse exotique — vue terrasse' },
      { src: coeur03, alt: 'Parenthèse exotique — détail végétal' },
    ],
    summary:
      "[À FOURNIR PAR JONATHAN : 3-5 phrases sur l'étude Cœur urbain Parenthèse exotique. Contexte, contraintes, geste conceptuel, essences choisies.]",
    scrollFramesSlug: 'coeur-urbain-parenthese',
    scrollFramesCount: 15,
    featured: true,
  },
  {
    slug: 'frange-urbaine-restanque',
    title: 'Restanque corrézienne',
    section: 'conceptions',
    year: 2026,
    location: 'Corrèze',
    typologyLabel: 'Frange urbaine',
    typologySlug: 'frange-urbaine',
    cover: frangeCover,
    gallery: [{ src: frangeCover, alt: 'Restanque corrézienne — rendu Twinmotion' }],
    summary:
      "[À FOURNIR PAR JONATHAN : 3-5 phrases sur l'étude Frange urbaine restanque corrézienne. Territoire instable ville-nature, traitement terrasse, patrimoine corrézien.]",
  },
  {
    slug: 'provence-correzienne-domaine',
    title: 'Provence corrézienne — Domaine & Caractère',
    section: 'conceptions',
    year: 2026,
    location: 'Corrèze',
    typologyLabel: 'Domaines & Caractère',
    typologySlug: 'domaine-caractere',
    cover: provenceCover,
    gallery: [{ src: provenceCover, alt: "Provence corrézienne — terrasse vue d'ensemble" }],
    summary:
      '[À FOURNIR PAR JONATHAN : 3-5 phrases sur le projet Provence corrézienne, domaine de caractère, dialogue architecture ancienne / paysage réel / mémoire invisible.]',
  },
];

export const mockProjectsBySection = {
  realisations: mockProjects.filter((p) => p.section === 'realisations'),
  conceptions: mockProjects.filter((p) => p.section === 'conceptions'),
};
