/*
 * Projets mock — utilisés tant que Sanity n'est pas peuplé.
 *
 * Les photos référencées ici sont issues de `_brief/client-assets/photos-projets/`
 * (projets réels livrés par Jonathan) — AUCUN contenu éditorial n'est inventé,
 * uniquement des placeholders explicites.
 *
 * Quand Sanity Studio est opérationnel, `src/lib/sanity.ts` retournera les
 * projets réels et ce mock sera dépassé (fallback seulement si le CMS est vide).
 */

import type { ImageMetadata } from 'astro';

import jungleEntree from '@/assets/projets/jungle-room-entree.png';
import jungleEspaces from '@/assets/projets/jungle-room-espaces.png';
import jungleMezzanine from '@/assets/projets/jungle-room-mezzanine.png';

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
  {
    slug: 'jungle-room-agde',
    title: 'Jungle Room — Agde',
    section: 'realisations',
    year: 2024,
    location: 'Agde, Occitanie',
    typologyLabel: 'Micro-urbain',
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
    ],
    summary:
      '[À FOURNIR PAR JONATHAN : 3-5 phrases éditoriales sur le parti-pris du projet, les contraintes du lieu, le geste principal. Tonalité éditoriale 1ʳᵉ personne.]',
    featured: true,
  },
];

export const mockProjectsBySection = {
  realisations: mockProjects.filter((p) => p.section === 'realisations'),
  conceptions: mockProjects.filter((p) => p.section === 'conceptions'),
};
