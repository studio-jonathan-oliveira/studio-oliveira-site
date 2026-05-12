# Studio J Oliveira — Site

Site officiel du **Studio J Oliveira**, designer végétal biophilique à Brive-la-Gaillarde, avec zones d'intervention élargies à Bordeaux, Limoges et Toulouse.

> ⚠️ Source de vérité projet : [`_brief/`](_brief/) (briefs, plans, analyses). Voir aussi [CLAUDE.md](CLAUDE.md) pour les règles permanentes (SEO, stack verrouillée, conventions de commit, contenu Jonathan sacré).

---

## Stack

| Rôle            | Techno                             | Version            |
| --------------- | ---------------------------------- | ------------------ |
| Framework       | Astro (SSG + Vercel SSR endpoints) | ^6.1.8             |
| UI interactive  | React 19 (islands)                 | ^19.2.5            |
| Styling         | Tailwind CSS                       | ^4.2.4             |
| Animation       | Motion + Lenis                     | ^12.38.0 / ^1.3.23 |
| CMS             | Sanity.io (package isolé)          | ^7.21.0            |
| Hébergement     | Vercel (région `fra1`)             |                    |
| Form + email    | Astro Actions + Resend + Turnstile | ^6.12.2 / ^1.5.0   |
| Analytics       | Vercel Analytics + Speed Insights  | ^2.0.1 / ^2.0.0    |
| Package manager | pnpm                               | ^10.33.1           |
| Node            |                                    | ≥ 22.12            |

---

## Démarrage rapide

```bash
pnpm install
cp .env.example .env  # remplir les valeurs (cf. § Variables d'environnement)
pnpm dev              # → http://localhost:4321
```

---

## Commandes principales

### Développement & qualité

| Commande            | Action                                               |
| ------------------- | ---------------------------------------------------- |
| `pnpm dev`          | Dev server (HMR, port 4321)                          |
| `pnpm build`        | Build production (output : `dist/` + Vercel adapter) |
| `pnpm preview`      | Preview du build local                               |
| `pnpm check`        | `astro check` (TypeScript + Astro)                   |
| `pnpm lint`         | ESLint + astro check                                 |
| `pnpm format`       | Prettier write all                                   |
| `pnpm format:check` | Prettier check (utilisé par le CI)                   |

### Assets & contenu

| Commande           | Action                                                                            |
| ------------------ | --------------------------------------------------------------------------------- |
| `pnpm og:default`  | Régénère `public/og-default.jpg` (image OG fallback)                              |
| `pnpm og:pages`    | Régénère les 17 OG dédiées par page (cf. `src/lib/og-pages.ts`)                   |
| `pnpm sanity:seed` | Initialise le dataset Sanity (siteSettings, typologies, services, zones, projets) |

### Sanity Studio

```bash
pnpm studio:dev      # studio local (localhost:3333)
pnpm studio:build
pnpm studio:deploy   # déploie le studio sur sanity.studio (URL personnalisée)
```

---

## Variables d'environnement

Cf. `.env.example` pour le template complet. Variables critiques pour la prod :

| Variable                    | Usage                                                                       |
| --------------------------- | --------------------------------------------------------------------------- |
| `PUBLIC_SITE_URL`           | URL canonique (sitemap, OG, schema). Ex : `https://www.jonathanoliveira.fr` |
| `PUBLIC_SANITY_PROJECT_ID`  | ID projet Sanity                                                            |
| `PUBLIC_SANITY_DATASET`     | `production`                                                                |
| `SANITY_API_TOKEN`          | Token read-only build (Sanity → Settings → API)                             |
| `RESEND_API_KEY`            | Resend (envoi email formulaire contact)                                     |
| `RESEND_FROM_EMAIL`         | Adresse `from:` (DKIM/SPF validés sur le domaine)                           |
| `RESEND_TO_EMAIL`           | Boîte de réception Jonathan                                                 |
| `PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile (anti-spam form, public)                               |
| `TURNSTILE_SECRET_KEY`      | Cloudflare Turnstile (server-side validation)                               |

---

## Architecture

```
src/
├── actions/          # Astro Actions (form contact + Turnstile + Resend)
├── assets/           # Images optimisées par Astro Image (typologies, projets, hero)
├── components/
│   ├── astro/        # Composants Astro (zéro JS par défaut)
│   └── islands/      # Composants React (hydratés, justifiés en commentaire)
├── data/             # Sources statiques (zones-content, mock-projects, hero-lqip)
├── layouts/          # BaseLayout
├── lib/              # Utilitaires (sanity client, schema-org, drafts, og-pages)
├── pages/            # Routes (file-based)
├── scripts/          # Code client-side global (motion-enhance, theme-observer)
└── styles/           # global.css (Tailwind + @theme tokens + @font-face)

sanity/               # Package séparé (Studio CMS, schemas, config). NE PAS importer depuis src/.
scripts/              # Scripts Node tsx (genOG, sanity-seed, optimize assets, pipeline frames)
public/               # Assets statiques servis tels quels (fonts, hero videos, og, brand)
_brief/               # Documentation projet (source de vérité). NE PAS toucher sans concertation.
```

---

## Règles d'or (extrait CLAUDE.md)

1. **SEO conditionne tout** : URLs, Hn, structured data, Core Web Vitals (LCP < 2s, INP < 200ms, CLS < 0.05).
2. **TypeScript strict**, imports absolus `@/...`, Tailwind utilitaires (pas de `@apply`).
3. **Composants Astro par défaut**, React uniquement si justifié en commentaire d'en-tête.
4. **Aucune invention éditoriale** : tout placeholder manquant → `[À FOURNIR PAR JONATHAN : ...]`, logué dans [`_brief/contenus-manquants.md`](_brief/contenus-manquants.md). Les marqueurs sont masqués en prod via `src/lib/drafts.ts` + `<DraftOnly>`.
5. **Commits en français**, convention sémantique (`feat:` `fix:` `refactor:` `perf:` `seo:` `docs:` `style:` `chore:` `build:` `ci:`).
6. **Lefthook pre-commit** : Prettier + ESLint + `astro check`. **Ne pas skip** (`--no-verify` interdit sauf demande explicite).

---

## CI

GitHub Actions `.github/workflows/ci.yml` exécute à chaque PR et push sur `main` :

- Prettier check
- TypeScript / Astro check
- ESLint (max-warnings 0)
- Build production

Le concurrency group annule les runs obsolètes sur la même branche.

---

## Déploiement (Vercel)

Le projet est déployé sur Vercel (région `fra1`) avec :

- `output: 'static'` + `@astrojs/vercel` adapter
- Toutes les pages prerender (SSG), seul l'endpoint Astro Action `/actions/contact` s'exécute en SSR-on-demand
- SSL/HTTPS automatique, domaine custom à pointer via DNS (A record + CNAME `www`)
- Analytics + Speed Insights à activer manuellement dans le dashboard Vercel (gratuit)

Preview URL auto-générée à chaque push : https://studio-oliveira-site.vercel.app

---

## Pour aller plus loin

- [`CLAUDE.md`](CLAUDE.md) — règles permanentes du projet (à lire avant toute édition).
- [`_brief/00-INDEX.md`](_brief/00-INDEX.md) — index documentation projet.
- [`_brief/cahier-des-charges-unifie.md`](_brief/cahier-des-charges-unifie.md) — source unique de vérité éditoriale.
- [`_brief/plan-seo.md`](_brief/plan-seo.md) — stratégie SEO détaillée.
- [`.claude/guides/`](.claude/guides/) — patterns techniques maison (Motion, Sanity, SEO, frontend premium).
