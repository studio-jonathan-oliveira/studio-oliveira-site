# Migration go-live — domaine + hébergeur

**Créé le 2026-06-29.** À décider **avec Jonathan** avant la mise en ligne : sur quel
**domaine** et chez quel **hébergeur** le site part en production. Aujourd'hui le projet est
développé en preview sur `studio-oliveira-site.vercel.app` (auto-deploy Vercel sur push
`main`, région `fra1`) et tout le code pointe vers `https://www.jonathanoliveira.fr`.

---

## 1. Décisions à prendre avec Jonathan

1. **Domaine** : le studio possède-t-il déjà `jonathanoliveira.fr` ? Chez quel registrar
   (OVH, Gandi, Google Domains…) ? Sinon, l'acheter. (Tout le code suppose déjà ce domaine
   en `www` — cf. §3.)
2. **Hébergeur** : rester sur **Vercel** (recommandé, le site est conçu pour) ou migrer
   ailleurs ? ⚠️ Le choix a des conséquences techniques fortes (§4).
3. **Email pro** : créer `contact@jonathanoliveira.fr` (et/ou une boîte qui reçoit les
   leads) — nécessaire pour les mentions légales ET pour l'envoi Resend (§2).

---

## 2. Si on RESTE sur Vercel (chemin recommandé — migration légère)

Le site est déjà un projet Astro + adapter Vercel (`@astrojs/vercel`), avec Actions SSR
(formulaires), Analytics, Speed Insights, `vercel.json` (headers/CSP/redirects). Rien à
réécrire. Étapes :

1. **Brancher le domaine** : Vercel → projet → _Settings → Domains_ → ajouter
   `jonathanoliveira.fr` + `www.jonathanoliveira.fr` (canonical = `www`, le code l'utilise).
   Suivre les enregistrements DNS fournis (A/CNAME) à poser chez le registrar. Vercel gère
   le certificat HTTPS automatiquement.
2. **Variables d'environnement** (Vercel → _Settings → Environment Variables_, scope
   Production) :
   - `PUBLIC_SITE_URL=https://www.jonathanoliveira.fr` (sinon fallback déjà correct).
   - **Formulaires (5)** : `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`,
     `TURNSTILE_SECRET_KEY`, `PUBLIC_TURNSTILE_SITE_KEY`. ⚠️ `PUBLIC_TURNSTILE_SITE_KEY`
     est **inlinée au build** → la poser AVANT de déclencher le build, puis redéployer.
   - **Sanity (3, quand on active le CMS)** : `PUBLIC_SANITY_PROJECT_ID`,
     `PUBLIC_SANITY_DATASET=production`, `SANITY_API_TOKEN`.
3. **Resend** : vérifier le domaine d'envoi (SPF/DKIM) dans Resend. `RESEND_FROM_EMAIL`
   **doit** être sur un domaine vérifié (PAS un Gmail). `RESEND_TO_EMAIL` peut rediriger
   vers le Gmail du studio. Faire **un envoi de test réel** depuis `/contact` et `/demarrer`.
4. **Turnstile** (Cloudflare) : dans le dashboard du widget, autoriser le domaine de prod
   dans la liste des hostnames.
5. **Sanity CORS** (si CMS activé) : ajouter `https://www.jonathanoliveira.fr` aux origins.
6. **Analytics** : Vercel Web Analytics + Speed Insights fonctionnent nativement, rien à
   faire. (Cohérent avec la politique de confidentialité corrigée le 2026-06-29.)
7. **Vérifs post-bascule** : `robots.txt`, `sitemap-index.xml`, OG (`og:url`/canonical),
   JSON-LD `url` → tous doivent afficher le domaine final. Soumettre le sitemap à Google
   Search Console + Bing Webmaster sur la propriété du domaine final.

---

## 3. Références au domaine dans le code (si le domaine final diffère)

Tout est centralisé — un seul vrai point + un fallback :

- `astro.config.mjs` → `site: process.env.PUBLIC_SITE_URL ?? 'https://www.jonathanoliveira.fr'`
  (pilote sitemap + canonical). → poser `PUBLIC_SITE_URL` suffit.
- `src/lib/site-config.ts` → `SITE.url` (utilisé par JSON-LD, OG, schema-org). À aligner si
  le domaine change.
- `public/llms.txt` → URLs absolues écrites en dur (à mettre à jour si changement de domaine).
- `public/robots.txt` → vérifier l'URL du sitemap.

Si le domaine reste `jonathanoliveira.fr`, **rien à changer dans le code**.

---

## 4. Si on MIGRE hors Vercel (chemin lourd — à éviter sauf raison forte)

Le site n'est pas un simple statique : les **formulaires** (`/contact`, `/demarrer`)
tournent en **fonctions serverless** via Astro Actions + l'adapter Vercel. Conséquences si
on quitte Vercel :

- **Adapter** : remplacer `@astrojs/vercel` par l'adapter de l'hébergeur cible
  (`@astrojs/netlify`, `@astrojs/node`, Cloudflare…). Un hébergeur **100 % statique** (sans
  serverless) **casserait les formulaires** → il faut un host avec fonctions.
- **Analytics** : Vercel Web Analytics + Speed Insights ne marchent **que sur Vercel**.
  Ailleurs → repasser à **Plausible** (ou équivalent cookieless) ET **mettre à jour la
  politique de confidentialité** en conséquence (cf. `/confidentialite`).
- **`vercel.json`** (headers de sécurité/CSP + redirect 301 `/architecture-paysagere`) :
  à reporter dans la config du nouvel hébergeur.
- **Deploy hook** (rebuild auto sur publication Sanity) : recréer l'équivalent côté nouvel
  hébergeur (cf. `deploiement-sanity.md` Phase A.6).

→ Recommandation : **rester sur Vercel** sauf contrainte client explicite. La migration
domaine seule (§2) est rapide et sans risque ; changer d'hébergeur rouvre adapter +
analytics + forms + CSP.

---

## 5. Ordre conseillé

1. Lever les bloquants go-live (cf. `contenus-manquants.md` § BLOQUANTS) : SIRET, email pro,
   validation juridique confidentialité.
2. Brancher le domaine sur Vercel + env vars + Resend vérifié + envoi test (§2).
3. (Optionnel mais souhaité) activer Sanity — Palier 1 (`deploiement-sanity.md` Phase A).
4. GSC + Bing + soumettre le sitemap sur le domaine final.
