/*
 * Astro Actions — endpoints serveur typés (Zod) pour les formulaires.
 *
 * Pré-requis runtime : un adapter SSR (Vercel/Node). En SSG pur, les Actions
 * ne sont pas exécutables en prod. Voir astro.config.mjs.
 *
 * Sécurité formulaire contact :
 *   1. Validation Zod stricte côté serveur (réplique du schéma client)
 *   2. Vérification Cloudflare Turnstile (anti-bot)
 *   3. Sanitization HTML basique du message avant injection dans l'email
 *   4. Envoi via Resend
 */

import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import { Resend } from 'resend';

const TYPOLOGIES = [
  'micro-urbain',
  'coeur-urbain',
  'frange-urbaine',
  'domaine-caractere',
  'architecture-publique',
  'amenagement-interieur',
  'autre',
] as const;

export type TypologieContact = (typeof TYPOLOGIES)[number];

export const TYPOLOGIE_LABELS: Record<TypologieContact, string> = {
  'micro-urbain': 'Micro-urbain (< 50 m²)',
  'coeur-urbain': 'Cœur urbain (50–300 m²)',
  'frange-urbaine': 'Frange urbaine (300–1 500 m²)',
  'domaine-caractere': 'Domaines & Caractère (> 1 500 m²)',
  'architecture-publique': 'Architecture publique / prescripteur',
  'amenagement-interieur': 'Aménagement intérieur (hôtellerie, bureaux…)',
  autre: 'Autre / pas encore qualifié',
};

// Schéma partagé client/serveur. Réutilisable côté React via re-export.
export const contactSchema = z.object({
  nom: z
    .string()
    .trim()
    .min(2, 'Nom trop court (2 caractères minimum).')
    .max(120, 'Nom trop long.'),
  email: z.string().trim().email('Email invalide.').max(200),
  telephone: z.string().trim().max(40, 'Téléphone trop long.').optional().or(z.literal('')),
  typologie: z.enum(TYPOLOGIES, { message: 'Typologie invalide.' }),
  zone: z.string().trim().max(80).optional().or(z.literal('')),
  message: z
    .string()
    .trim()
    .min(20, 'Message trop court (20 caractères minimum).')
    .max(5000, 'Message trop long (5 000 caractères maximum).'),
  turnstileToken: z.string().min(1, 'Vérification anti-spam manquante.'),
});

// _output évite l'erreur « Cannot find namespace 'z' » : astro:schema
// re-exporte z comme valeur mais TS ne voit pas le namespace pour z.infer.
export type ContactInput = (typeof contactSchema)['_output'];

/** Escape HTML basique pour éviter qu'un payload dans le message casse l'email. */
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

async function verifyTurnstile(token: string, secret: string, remoteIp?: string): Promise<boolean> {
  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);
  if (remoteIp) body.set('remoteip', remoteIp);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  if (!res.ok) return false;
  const data = (await res.json()) as TurnstileVerifyResponse;
  return Boolean(data.success);
}

function buildEmailHtml(input: ContactInput): string {
  // Whitespace préservé via white-space: pre-wrap ; tous les champs déjà escapés.
  const rows: Array<[string, string]> = [
    ['Nom', escapeHtml(input.nom)],
    ['Email', escapeHtml(input.email)],
    ['Téléphone', input.telephone ? escapeHtml(input.telephone) : '—'],
    ['Typologie', escapeHtml(TYPOLOGIE_LABELS[input.typologie])],
    ['Zone', input.zone ? escapeHtml(input.zone) : '—'],
  ];
  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-family:ui-monospace,monospace;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#666;width:140px;">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;font-family:Georgia,serif;font-size:15px;color:#111;">${value}</td></tr>`,
    )
    .join('');

  const messageEscaped = escapeHtml(input.message);

  return `<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:24px;background:#f4f1ea;font-family:Georgia,serif;color:#111;">
    <table role="presentation" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e2da;">
      <tr>
        <td style="padding:24px 28px 8px;border-bottom:1px solid #eee;">
          <p style="margin:0;font-family:ui-monospace,monospace;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#888;">Studio J Oliveira — Nouveau contact</p>
          <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-size:22px;font-weight:500;color:#111;">Demande qualifiée</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:0 16px;">
          <table role="presentation" style="width:100%;border-collapse:collapse;">${tableRows}</table>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 28px 28px;">
          <p style="margin:0 0 8px;font-family:ui-monospace,monospace;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#888;">Message</p>
          <div style="white-space:pre-wrap;font-family:Georgia,serif;font-size:15px;line-height:1.55;color:#111;">${messageEscaped}</div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildEmailText(input: ContactInput): string {
  return [
    `Nouveau contact — Studio J Oliveira`,
    ``,
    `Nom        : ${input.nom}`,
    `Email      : ${input.email}`,
    `Téléphone  : ${input.telephone || '—'}`,
    `Typologie  : ${TYPOLOGIE_LABELS[input.typologie]}`,
    `Zone       : ${input.zone || '—'}`,
    ``,
    `Message :`,
    input.message,
  ].join('\n');
}

/* ─────────────────────────────────────────────────────────────────────────
 * Action `demarrer` — page /demarrer-un-projet (refonte trame Jonathan
 * 2026-05-22). Formulaire qualifié avec upload documents (PDF/JPG/PNG).
 * Champs verbatim trame : nom, email, téléphone, localisation, surface,
 * budget, période, documents. Pas de message libre (volonté Jonathan).
 * ───────────────────────────────────────────────────────────────────────── */

export const BUDGET_OPTIONS = [
  { value: 'sous-10k', label: 'Moins de 10 000 €' },
  { value: '10-30k', label: '10 000 – 30 000 €' },
  { value: '30-80k', label: '30 000 – 80 000 €' },
  { value: '80-200k', label: '80 000 – 200 000 €' },
  { value: 'plus-200k', label: 'Plus de 200 000 €' },
  { value: 'non-defini', label: 'À cadrer ensemble' },
] as const;
export type BudgetKey = (typeof BUDGET_OPTIONS)[number]['value'];
const BUDGET_KEYS = BUDGET_OPTIONS.map((o) => o.value) as [BudgetKey, ...BudgetKey[]];
const BUDGET_LABEL: Record<BudgetKey, string> = Object.fromEntries(
  BUDGET_OPTIONS.map((o) => [o.value, o.label]),
) as Record<BudgetKey, string>;

export const PERIODE_OPTIONS = [
  { value: 'sous-3m', label: 'Moins de 3 mois' },
  { value: '3-6m', label: '3 à 6 mois' },
  { value: '6-12m', label: '6 à 12 mois' },
  { value: 'plus-12m', label: 'Plus de 12 mois' },
  { value: 'non-defini', label: 'Pas de date fixée' },
] as const;
export type PeriodeKey = (typeof PERIODE_OPTIONS)[number]['value'];
const PERIODE_KEYS = PERIODE_OPTIONS.map((o) => o.value) as [PeriodeKey, ...PeriodeKey[]];
const PERIODE_LABEL: Record<PeriodeKey, string> = Object.fromEntries(
  PERIODE_OPTIONS.map((o) => [o.value, o.label]),
) as Record<PeriodeKey, string>;

// Limites alignées sur la contrainte Vercel Serverless (body ≤ 4.5 MB).
// Base64 overhead ~33 % → total binaire 3 MB max après décodage = ~4 MB
// de payload JSON, headroom suffisant pour les autres champs.
export const MAX_FILES = 5;
export const MAX_FILE_BYTES = 2.5 * 1024 * 1024; // 2,5 Mo / fichier
export const MAX_TOTAL_BYTES = 3 * 1024 * 1024; // 3 Mo total décodé
export const ACCEPTED_MIME = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'] as const;

// Garde-fou côté serveur contre un client qui forgerait `size: 1` avec un
// `base64` énorme : on recalcule le binaire depuis la string base64 et on
// refuse si l'écart > 16 octets (padding base64 normal).
function decodedByteLength(base64: string): number {
  const clean = base64.replace(/[^A-Za-z0-9+/=]/g, '');
  const padding = clean.endsWith('==') ? 2 : clean.endsWith('=') ? 1 : 0;
  return Math.floor((clean.length * 3) / 4) - padding;
}

const documentSchema = z.object({
  filename: z.string().trim().min(1).max(200),
  size: z.number().int().min(1).max(MAX_FILE_BYTES, `Fichier trop volumineux (max 2,5 Mo).`),
  type: z.string().max(120),
  base64: z
    .string()
    .min(1)
    .max(4 * 1024 * 1024) // ~4 MB base64 = ~3 MB binaire (alignement MAX_FILE_BYTES + overhead)
    .regex(/^[A-Za-z0-9+/=\s]+$/, 'Payload invalide.'),
});

export const demarrerSchema = z.object({
  nom: z
    .string()
    .trim()
    .min(2, 'Nom trop court (2 caractères minimum).')
    .max(120, 'Nom trop long.'),
  email: z.string().trim().email('Email invalide.').max(200),
  telephone: z.string().trim().max(40, 'Téléphone trop long.').optional().or(z.literal('')),
  localisation: z
    .string()
    .trim()
    .min(2, 'Localisation trop courte.')
    .max(120, 'Localisation trop longue.'),
  surface: z.string().trim().min(1, 'Surface requise.').max(80, 'Surface trop longue.'),
  budget: z.enum(BUDGET_KEYS, { message: 'Budget invalide.' }),
  periode: z.enum(PERIODE_KEYS, { message: 'Période invalide.' }),
  documents: z.array(documentSchema).max(MAX_FILES, `${MAX_FILES} fichiers maximum.`).default([]),
  turnstileToken: z.string().min(1, 'Vérification anti-spam manquante.'),
});

export type DemarrerInput = (typeof demarrerSchema)['_output'];

function buildDemarrerEmailHtml(input: DemarrerInput): string {
  const rows: Array<[string, string]> = [
    ['Nom', escapeHtml(input.nom)],
    ['Email', escapeHtml(input.email)],
    ['Téléphone', input.telephone ? escapeHtml(input.telephone) : '—'],
    ['Localisation', escapeHtml(input.localisation)],
    ['Surface', escapeHtml(input.surface)],
    ['Budget', escapeHtml(BUDGET_LABEL[input.budget])],
    ['Période', escapeHtml(PERIODE_LABEL[input.periode])],
    [
      'Documents',
      input.documents.length > 0 ? `${input.documents.length} fichier(s) en pièce jointe` : 'Aucun',
    ],
  ];
  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-family:ui-monospace,monospace;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#666;width:140px;">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;font-family:Georgia,serif;font-size:15px;color:#111;">${value}</td></tr>`,
    )
    .join('');

  return `<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:24px;background:#f4f1ea;font-family:Georgia,serif;color:#111;">
    <table role="presentation" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e2da;">
      <tr>
        <td style="padding:24px 28px 8px;border-bottom:1px solid #eee;">
          <p style="margin:0;font-family:ui-monospace,monospace;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#888;">Studio J Oliveira — Démarrer un projet</p>
          <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-size:22px;font-weight:500;color:#111;">Nouvelle demande qualifiée</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:0 16px;">
          <table role="presentation" style="width:100%;border-collapse:collapse;">${tableRows}</table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildDemarrerEmailText(input: DemarrerInput): string {
  return [
    `Nouvelle demande qualifiée — Studio J Oliveira`,
    ``,
    `Nom          : ${input.nom}`,
    `Email        : ${input.email}`,
    `Téléphone    : ${input.telephone || '—'}`,
    `Localisation : ${input.localisation}`,
    `Surface      : ${input.surface}`,
    `Budget       : ${BUDGET_LABEL[input.budget]}`,
    `Période      : ${PERIODE_LABEL[input.periode]}`,
    `Documents    : ${input.documents.length}`,
  ].join('\n');
}

export const server = {
  contact: defineAction({
    accept: 'json',
    input: contactSchema,
    handler: async (input, context): Promise<{ ok: true; id: string }> => {
      // Lecture des env vars à l'appel (pas au build) — laisse le build SSG passer
      // même si les secrets ne sont pas définis localement.
      const resendKey = import.meta.env.RESEND_API_KEY;
      const fromEmail = import.meta.env.RESEND_FROM_EMAIL;
      const toEmail = import.meta.env.RESEND_TO_EMAIL;
      const turnstileSecret = import.meta.env.TURNSTILE_SECRET_KEY;

      if (!resendKey || !fromEmail || !toEmail || !turnstileSecret) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            'Service indisponible. Merci de réessayer plus tard ou de nous joindre par téléphone.',
        });
      }

      // 1) Vérification Turnstile
      const remoteIp =
        context.request.headers.get('cf-connecting-ip') ??
        context.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        undefined;

      const turnstileOk = await verifyTurnstile(input.turnstileToken, turnstileSecret, remoteIp);
      if (!turnstileOk) {
        throw new ActionError({
          code: 'FORBIDDEN',
          message: 'Vérification anti-spam échouée. Merci de rafraîchir la page et de réessayer.',
        });
      }

      // 2) Envoi email via Resend
      const resend = new Resend(resendKey);
      const subject = `[Contact site] ${input.nom} — ${TYPOLOGIE_LABELS[input.typologie]}`;

      try {
        const { data, error } = await resend.emails.send({
          from: fromEmail,
          to: toEmail,
          replyTo: input.email,
          subject,
          html: buildEmailHtml(input),
          text: buildEmailText(input),
        });

        if (error || !data?.id) {
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message:
              "L'envoi a échoué. Merci de réessayer dans quelques minutes ou de nous joindre directement par téléphone.",
          });
        }

        return { ok: true, id: data.id };
      } catch (err) {
        if (err instanceof ActionError) throw err;
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            "L'envoi a échoué. Merci de réessayer dans quelques minutes ou de nous joindre directement par téléphone.",
        });
      }
    },
  }),

  demarrer: defineAction({
    accept: 'json',
    input: demarrerSchema,
    handler: async (input, context): Promise<{ ok: true; id: string }> => {
      const resendKey = import.meta.env.RESEND_API_KEY;
      const fromEmail = import.meta.env.RESEND_FROM_EMAIL;
      const toEmail = import.meta.env.RESEND_TO_EMAIL;
      const turnstileSecret = import.meta.env.TURNSTILE_SECRET_KEY;

      if (!resendKey || !fromEmail || !toEmail || !turnstileSecret) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            'Service indisponible. Merci de réessayer plus tard ou de nous joindre par téléphone.',
        });
      }

      // Garde-fous anti-bypass : on recalcule la vraie taille décodée depuis
      // chaque base64 (le `size` envoyé par le client n'est pas fiable).
      let totalDecoded = 0;
      for (const d of input.documents) {
        const actual = decodedByteLength(d.base64);
        if (actual > MAX_FILE_BYTES + 16 || Math.abs(actual - d.size) > 16) {
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: `Fichier "${d.filename}" rejeté (taille incohérente).`,
          });
        }
        totalDecoded += actual;
      }
      if (totalDecoded > MAX_TOTAL_BYTES) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: `Poids total des pièces jointes dépassé (max 3 Mo).`,
        });
      }

      const remoteIp =
        context.request.headers.get('cf-connecting-ip') ??
        context.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        undefined;

      const turnstileOk = await verifyTurnstile(input.turnstileToken, turnstileSecret, remoteIp);
      if (!turnstileOk) {
        throw new ActionError({
          code: 'FORBIDDEN',
          message: 'Vérification anti-spam échouée. Merci de rafraîchir la page et de réessayer.',
        });
      }

      const resend = new Resend(resendKey);
      const subject = `[Démarrer un projet] ${input.nom} — ${input.localisation}`;

      try {
        const { data, error } = await resend.emails.send({
          from: fromEmail,
          to: toEmail,
          replyTo: input.email,
          subject,
          html: buildDemarrerEmailHtml(input),
          text: buildDemarrerEmailText(input),
          attachments: input.documents.map((d) => ({
            filename: d.filename,
            content: d.base64,
          })),
        });

        if (error || !data?.id) {
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message:
              "L'envoi a échoué. Merci de réessayer dans quelques minutes ou de nous joindre directement par téléphone.",
          });
        }

        return { ok: true, id: data.id };
      } catch (err) {
        if (err instanceof ActionError) throw err;
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            "L'envoi a échoué. Merci de réessayer dans quelques minutes ou de nous joindre directement par téléphone.",
        });
      }
    },
  }),
};
