/*
 * Types + helpers pour le rendu Portable Text (Sanity → HTML sémantique).
 *
 * Le rendu lui-même vit dans `src/components/astro/portable-text/` (composants
 * Astro récursifs, zéro JS client). Ce module ne porte que les types partagés
 * et la résolution des liens internes / embeds — logique pure, testable.
 */

export interface PtSpan {
  _type: 'span';
  _key?: string;
  text: string;
  marks?: string[];
}

/** Référence résolue d'un `internalLink` (cf. BLOCK_CONTENT_FRAGMENT dans queries.ts). */
export interface PtReference {
  _type?: string;
  slug?: string;
  section?: string;
}

export interface PtMarkDef {
  _key: string;
  _type: string;
  href?: string;
  blank?: boolean;
  reference?: PtReference;
}

export interface PtBlock {
  _type: 'block';
  _key?: string;
  style?: string;
  listItem?: 'bullet' | 'number';
  level?: number;
  children?: PtSpan[];
  markDefs?: PtMarkDef[];
}

export interface PtImage {
  _type: 'image';
  _key?: string;
  asset?: { _ref?: string; _type?: string };
  hotspot?: { x?: number; y?: number; height?: number; width?: number };
  crop?: { top?: number; bottom?: number; left?: number; right?: number };
  alt?: string;
  caption?: string;
}

export interface PtFigureGallery {
  _type: 'figureGallery';
  _key?: string;
  images?: PtImage[];
}

export interface PtVideoEmbed {
  _type: 'videoEmbed';
  _key?: string;
  url?: string;
  caption?: string;
}

export type PtNode = PtBlock | PtImage | PtFigureGallery | PtVideoEmbed;

/**
 * URL d'un lien interne selon le type de document référencé.
 * Retourne `null` si non résoluble (pas de slug, ou type sans page dédiée) :
 * l'appelant rend alors le texte sans lien plutôt qu'un lien mort.
 */
export function internalHref(ref?: PtReference): string | null {
  if (!ref?.slug) return null;
  switch (ref._type) {
    case 'article':
      return `/journal/${ref.slug}`;
    case 'typology':
      return `/architecture-paysagere/${ref.slug}`;
    case 'location':
      return `/zones/${ref.slug}`;
    case 'project':
      return ref.section === 'conceptions'
        ? `/conceptions/${ref.slug}`
        : `/realisations/${ref.slug}`;
    // `service` n'a pas de page publique à ce jour → pas de lien.
    default:
      return null;
  }
}

/**
 * Convertit une URL YouTube / Vimeo en URL d'embed `<iframe>`.
 * Retourne `null` si le format n'est pas reconnu (on n'affiche alors rien).
 */
export function toEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt?.[1]) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo?.[1]) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}
