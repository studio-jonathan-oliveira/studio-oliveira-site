/*
 * Résolution des paramètres du site : Sanity (siteSettings, singleton) fusionné
 * par-dessus les défauts statiques de `site-config.ts`.
 *
 * Toute valeur Sanity absente / vide retombe sur le défaut statique → le site
 * reste identique tant que le CMS n'est pas peuplé. Consommé par le Footer, la
 * page contact et les structured data (schema-org.ts) pour que Jonathan édite
 * ses coordonnées (NAP) + réseaux sans toucher au code.
 *
 * `siteSettings` est résolu une fois au build (top-level await) : les modules
 * synchrones comme schema-org.ts peuvent l'importer directement.
 */

import { fetch } from './sanity';
import { siteSettingsQuery } from './queries';
import { SITE } from './site-config';

interface RawSiteSettings {
  siteName?: string | null;
  tagline?: string | null;
  founderName?: string | null;
  foundedYear?: number | null;
  contact?: { phone?: string | null; phoneDisplay?: string | null; email?: string | null } | null;
  address?: {
    street?: string | null;
    postalCode?: string | null;
    city?: string | null;
    region?: string | null;
    country?: string | null;
    countryCode?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  } | null;
  hours?: { days?: string | null; open?: string | null; close?: string | null } | null;
  social?: {
    instagram?: string | null;
    linkedin?: string | null;
    pinterest?: string | null;
    googleBusiness?: string | null;
  } | null;
  legal?: {
    companyName?: string | null;
    siret?: string | null;
    legalForm?: string | null;
    editorName?: string | null;
  } | null;
}

export interface ResolvedSiteSettings {
  name: string;
  tagline: string;
  founderName: string;
  foundedYear: number;
  contact: { phone: string; phoneDisplay: string; phoneInternational: string; email: string };
  address: {
    street: string;
    postalCode: string;
    city: string;
    region: string;
    country: string;
    countryCode: string;
    latitude: number;
    longitude: number;
  };
  hours: { days: string; open: string; close: string };
  social: { instagram: string; linkedin: string; pinterest: string; googleBusiness: string };
  legal: {
    companyName: string;
    siret: string;
    legalForm: string;
    editorName: string;
    hosting: (typeof SITE.legal)['hosting'];
  };
}

/** Retourne la valeur Sanity si présente et non vide, sinon le défaut statique. */
function str(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

function num(value: number | null | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function resolve(raw: RawSiteSettings | null): ResolvedSiteSettings {
  return {
    name: str(raw?.siteName, SITE.name),
    tagline: str(raw?.tagline, SITE.tagline),
    founderName: str(raw?.founderName, SITE.founderName),
    foundedYear: num(raw?.foundedYear, SITE.foundedYear),
    contact: {
      phone: str(raw?.contact?.phone, SITE.contact.phone),
      phoneDisplay: str(raw?.contact?.phoneDisplay, SITE.contact.phoneDisplay),
      // Pas de champ dédié E.164 espacé dans Sanity : on reprend le téléphone
      // brut s'il est fourni, sinon le format international statique.
      phoneInternational: str(raw?.contact?.phone, SITE.contact.phoneInternational),
      email: str(raw?.contact?.email, SITE.contact.email),
    },
    address: {
      street: str(raw?.address?.street, SITE.address.street),
      postalCode: str(raw?.address?.postalCode, SITE.address.postalCode),
      city: str(raw?.address?.city, SITE.address.city),
      region: str(raw?.address?.region, SITE.address.region),
      country: str(raw?.address?.country, SITE.address.country),
      countryCode: str(raw?.address?.countryCode, SITE.address.countryCode),
      latitude: num(raw?.address?.latitude, SITE.address.latitude),
      longitude: num(raw?.address?.longitude, SITE.address.longitude),
    },
    hours: {
      days: str(raw?.hours?.days, SITE.hours.days),
      open: str(raw?.hours?.open, SITE.hours.open),
      close: str(raw?.hours?.close, SITE.hours.close),
    },
    social: {
      instagram: str(raw?.social?.instagram, SITE.social.instagram),
      linkedin: str(raw?.social?.linkedin, SITE.social.linkedin),
      pinterest: str(raw?.social?.pinterest, SITE.social.pinterest),
      // Pas expose dans le schema Sanity : la valeur vient toujours de
      // site-config.ts. Le fallback suffit, inutile d'etendre la requete GROQ.
      googleBusiness: str(raw?.social?.googleBusiness, SITE.social.googleBusiness),
    },
    legal: {
      companyName: str(raw?.legal?.companyName, SITE.legal.companyName),
      siret: str(raw?.legal?.siret, SITE.legal.siret),
      legalForm: str(raw?.legal?.legalForm, SITE.legal.legalForm),
      editorName: str(raw?.legal?.editorName, SITE.legal.editorName),
      hosting: SITE.legal.hosting,
    },
  };
}

export async function getSiteSettings(): Promise<ResolvedSiteSettings> {
  const raw = await fetch<RawSiteSettings | null>(siteSettingsQuery, {}, null);
  return resolve(raw);
}

/** Paramètres résolus au build, importables par les modules synchrones. */
export const siteSettings: ResolvedSiteSettings = await getSiteSettings();
