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
};
