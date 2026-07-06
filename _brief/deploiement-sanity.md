# Déploiement Sanity — runbook

Procédure pour activer le CMS **Sanity** sur le site Studio J Oliveira, proprement.
Dernière mise à jour : 2026-07-06 (Phase B câblage Priorité 1 réalisée — PR #16).

Objectif : Jonathan édite **lui-même** son contenu via une interface propre (Sanity
Studio), sans pouvoir casser la direction artistique. Périmètre éditable validé :
**Projets (conceptions + réalisations + photos)**, **Journal**, **Coordonnées / NAP +
réseaux**, **Galeries + FAQ des typologies**. (Contour à affiner avec Jonathan ensuite.)

---

## 0. Architecture — ce qui est DÉJÀ en place (code)

- **Studio isolé en package autonome** : tout vit dans `sanity/` (`sanity.config.ts`,
  `sanity.cli.ts`, `schemas/`, `package.json` propre). Ses dépendances lourdes
  (`sanity` v6, `styled-components`) **ne sont JAMAIS installées par le build du site** →
  c'est ce qui faisait échouer Vercel en avril (commit `a95923c`). Le site (Astro/Vercel)
  ne consomme que `@sanity/client` + `@sanity/image-url` via `src/lib/sanity.ts`.
- **Client front résilient** : tant que `PUBLIC_SANITY_PROJECT_ID` est vide, les requêtes
  renvoient `[]`/`null` et le site build avec des placeholders. Brancher Sanity n'est donc
  jamais bloquant pour un déploiement.
- **11 schémas** prêts (`sanity/schemas/`) : siteSettings (singleton verrouillé), typology,
  service, project, article, author, location, testimonial, seo, blockContent.
- **Desk structure FR** + singleton `siteSettings` protégé (pas de création/suppression).
- **Seed idempotent** : `scripts/sanity-seed.ts` (typologies, services, zones, settings,
  7 projets mock).
- **CSP Vercel déjà ouverte** pour Sanity (`cdn.sanity.io`, `*.api.sanity.io`,
  `*.apicdn.sanity.io`) dans `vercel.json`.
- **`.env.example`** documente toutes les variables.

> ✅ **Mise à jour 2026-07-06** : la Phase B « Priorité 1 » est faite (PR #16). Sont désormais
> câblés sur Sanity (avec fallback pixel-identique) : `/projets`, conceptions + réalisations
> (liste **et** détail), journal, le **rendu Portable Text**, le **NAP + réseaux** (via
> `siteSettings`) et la **FAQ des typologies**. Restent en dur, volontairement : la home, le
> studio, les **galeries** des typologies (DA verrouillée) et les zones/services/témoignages
> (Priorité 2, cf. bas de Phase B). Tout reste **non bloquant** : tant que Sanity est vide,
> le site s'affiche à l'identique.

---

## Mise en ligne — hébergeur & domaine (liste simple)

**Hébergeur = déjà en place.** Le repo est **connecté à Vercel** (projet `studio-oliveira-site`,
org `morganmargerit19s-projects`) : chaque commit génère une preview, `main` déploie en prod.
Rien à créer côté hébergeur.

### À faire par Morgan / Jonathan (comptes & décisions — hors code)

| #   | Action                                                               | Détail / reco                                                                                                                                                                                                                                                                                                           |
| --- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Domaine `jonathanoliveira.fr`**                                    | Jonathan le paie déjà (cher, plateforme à identifier). Deux options : le **transférer chez OVH** (moins cher) OU juste **pointer ses DNS vers Vercel** sans transférer. ⚠️ Un ancien site existe dessus → prévoir une **table de redirections 301**. **À clarifier d'abord : chez quel registrar est-il aujourd'hui ?** |
| 2   | **Projet Sanity**                                                    | sanity.io → Project ID + 2 tokens (Viewer lecture / Editor pour le seed). Cf. Phase A.                                                                                                                                                                                                                                  |
| 3   | **Email pro** `contact@jonathanoliveira.fr`                          | Requis pour Resend + JSON-LD (aujourd'hui un Gmail). Reco : OVH Mail (cohérent domaine) ou Fastmail.                                                                                                                                                                                                                    |
| 4   | **Resend** (envoi formulaire) + **Cloudflare Turnstile** (anti-spam) | Clés API à générer (gratuit).                                                                                                                                                                                                                                                                                           |
| 5   | **Mentions légales / RGPD**                                          | SIRET, forme juridique, éditeur responsable → texte à fournir (cf. `contenus-manquants.md`).                                                                                                                                                                                                                            |

### Ce que je fais côté technique (une fois les comptes créés)

- Renseigner les **variables d'env Vercel** (Sanity, Resend, Turnstile, `PUBLIC_SITE_URL`) — cf. `.env.example`.
- **Seeder** le dataset + **déployer le Studio** (Phase A).
- Brancher le **Deploy Hook** Vercel ↔ webhook Sanity (rebuild auto à chaque publication de Jonathan).
- Config **domaine custom + DNS** sur Vercel + **redirections 301** de l'ancien site.
- Vérifs finales : Lighthouse (SEO 100 / Perf ≥ 90), sitemap, Search Console + Bing, Google Business Profile.
- Inviter Jonathan sur Sanity (rôle Editor) + mini-doc FR de prise en main.

**Chemin critique = le domaine** (qui le détient, où sont les DNS, plan de redirections). Le
reste s'enchaîne en quelques heures une fois les comptes ouverts.

---

## Migration turnkey (≤ 2 jours) — état & séquence

Objectif : ne laisser que des **actions de compte** à Morgan/Jonathan. Tout le code est prêt.

### Ce qui est câblé et **sans perte** après seed (identique, mais éditable)

- **NAP + réseaux** (Footer, ContactBar, contact, JSON-LD) — seed complet.
- **Zones** (`/zones` + `/zones/[slug]`) — seed complet (schéma `location` aligné).
- **FAQ typologies** — s'affiche via fallback verbatim ; _voir caveat 2_ pour l'édition CMS.
- **Détail réalisations/conceptions** + **journal** — rendus Portable Text prêts (attendent le contenu).

### ⚠️ Caveats à connaître avant de brancher Sanity

1. **`/projets` n'est PAS lossless.** Le seed crée 7 projets mock **sans** `subtitle`/`kind`/
   `approche`, alors que le fallback actuel affiche 9 conceptions + 16 réalisations riches.
   Dès que Sanity contient ≥ 1 projet, `/projets` bascule sur Sanity → **cartes plus rares et
   sans texte « approche »** tant que Jonathan n'a pas saisi ses **vrais projets** (avec leur
   approche). → **Action Jonathan** : saisir les projets réels dans le Studio avant/juste après
   la bascule. C'est du contenu, aucun code ne le remplace.
2. **FAQ typologies éditable dans le CMS** : le seed ne remplit pas encore `typology.faq`
   (le contenu vit en dur dans les 4 pages `.astro`). Le site l'affiche via fallback, mais pour
   que Jonathan l'édite dans Sanity il faut d'abord **extraire ces FAQ vers un module data**
   partagé (`src/data/typologies-faq.ts`) puis les seeder. Petit chantier de suivi, non bloquant.

### Séquence de bascule (jour J)

1. Morgan crée le projet Sanity + tokens (Phase A.1) et renseigne l'env local + Vercel (A.2).
2. `pnpm sanity:seed` (token Editor) → siteSettings, author, typologies, services, **zones**, 7 projets.
3. `pnpm studio:deploy` → Studio en ligne. Inviter Jonathan (Editor).
4. **Jonathan saisit ses vrais projets** (caveat 1) + coordonnées + FAQ si besoin.
5. Repasser `SANITY_API_TOKEN` sur le Viewer, re-déployer Vercel, brancher le Deploy Hook (A.6).
6. Domaine + DNS + redirections 301 (section « Mise en ligne »).

---

## Phase A — Activer le Studio (actions Morgan)

### 1. Créer le projet Sanity (~10 min)

1. Compte sur **sanity.io** (gratuit, free tier large : ~3 éditeurs, quota généreux).
2. Créer un projet (via le dashboard **sanity.io/manage**, ou `pnpm dlx sanity@latest login`).
   Noter le **Project ID**. Garder le dataset **`production`**.
3. **API → Tokens** : générer **deux** tokens :
   - un **Viewer** (lecture) → ce sera `SANITY_API_TOKEN` (build SSG du site) ;
   - un **Editor** (écriture) temporaire → uniquement pour lancer le seed (étape 4),
     à supprimer ensuite.
4. **API → CORS origins** : ajouter `http://localhost:3333` (studio local) et l'URL du
   studio déployé (`https://studio-oliveira.sanity.studio`) avec _Allow credentials_.

### 2. Renseigner l'environnement

- En **local** : copier `.env.example` → `.env` et remplir `PUBLIC_SANITY_PROJECT_ID`,
  `PUBLIC_SANITY_DATASET=production`, `SANITY_API_TOKEN` (le Viewer).
- Sur **Vercel** (Settings → Environment Variables, scope Production + Preview) : mêmes
  trois variables. Re-déployer pour qu'elles soient prises en compte.

### 3. Installer + lancer le Studio en local

```bash
pnpm studio:install      # installe les deps du package sanity/ (isolé)
pnpm studio:dev          # http://localhost:3333
```

Vérifier qu'on voit l'arborescence FR (Paramètres du site, Typologies, Projets, Journal…).

### 4. Seeder le contenu initial

Avec le token **Editor** exporté en local (`SANITY_API_TOKEN=<editor>` le temps du seed) :

```bash
pnpm sanity:seed
```

Cela crée siteSettings + 4 typologies + services + zones + 7 projets mock (idempotent :
relançable). Recharger le Studio → les documents apparaissent. **Repasser** ensuite
`SANITY_API_TOKEN` sur le token **Viewer** (et supprimer le token Editor côté Sanity).

### 5. Déployer le Studio (l'URL de Jonathan)

```bash
pnpm studio:deploy       # publie sur https://studio-oliveira.sanity.studio
```

(Le `studioHost` est déjà `studio-oliveira` dans `sanity/sanity.cli.ts`.) On pourra
brancher un sous-domaine `admin.jonathanoliveira.fr` plus tard si souhaité.

### 6. Rebuild auto du site à la publication

1. Vercel → **Settings → Git → Deploy Hooks** : créer un hook (ex. « Sanity publish »,
   branche `main`). Copier l'URL générée.
2. Sanity → **sanity.io/manage → API → Webhooks** : nouveau webhook, coller l'URL Vercel,
   _Trigger on_ Create/Update/Delete, dataset `production`. (Pas de secret côté site requis.)

→ Désormais, quand Jonathan **publie**, le site se reconstruit tout seul.

---

## Phase B — Câbler les pages sur Sanity (actions code)

### ✅ Priorité 1 — fait (PR #16, 2026-07-06)

1. ✅ **Schéma `project` aligné** sur les trames `/projets` (sous-titre, `kind`, `order`,
   `approche`) — déjà en place avant la PR.
2. ✅ **`/projets` câblé** : `fetch(projectsHubQuery, { section })` conceptions + réalisations,
   fallback verbatim trame pixel-identique.
3. ✅ **Journal câblé** (liste + détail). Rendu du corps via le nouveau **PortableText**
   (`src/components/astro/portable-text/`). _Reste_ : Jonathan écrit ses articles + une intro
   de page `/journal` (placeholder aujourd'hui).
4. ✅ **Détail conceptions + réalisations** rendus depuis Sanity (Portable Text + `urlFor`).
   `realisations/[slug]` : TODO historique levé (mock = fallback quand Sanity vide).
5. ✅ **FAQ des 4 typologies** exposée depuis `typology.faq` (fallback trame). Hero, specs,
   manifeste et **galeries** restent en dur = DA verrouillée.
6. ✅ **NAP + réseaux** consommés depuis `siteSettings` (nouveau `src/lib/site-settings.ts`)
   dans Footer, ContactBar, page contact et JSON-LD (`schema-org.ts`), fallback `site-config.ts`.

### 🔜 Priorité 2 — reste à câbler (non bloquant pour la mise en ligne)

Dépend surtout de **contenu Jonathan**, pas de dev pur :

- **Zones** (`/zones` + `/zones/[slug]`) → schéma `location` (aujourd'hui `@/data/zones-content`
  statique). Utile SEO local, mais attend le contenu rédigé des pages villes.
- **Témoignages** → afficher `testimonialsAllQuery` (home + typologies). Attend les quotes clients.
- **Compléter le seed** (`scripts/sanity-seed.ts`) : articles + auteur + témoignages de démo
  (aujourd'hui : siteSettings, typologies, services, zones, 7 projets — pas d'article/témoignage).
- **Services / verticales pro** (`service`) : schéma prêt mais **aucune page n'existe** →
  décision produit, pas juste du câblage.

### 🎨 À trancher avec Jonathan (décisions DA, hors code)

- **Galeries des typologies** : comment mapper une galerie Sanity de taille variable dans les
  diptyques bespoke à slots fixes (aujourd'hui : images statiques via `astro:assets`).
- **ScrollFrames** dans `conceptions/[slug]` : intégrer l'island (dépend des frames Twinmotion).

> Chaque câblage est **non bloquant** : si Sanity renvoie vide, le fallback s'affiche.

---

## Phase C — Onboarding Jonathan

- Lui donner l'URL du Studio + un compte (l'inviter dans **sanity.io/manage → Members**,
  rôle **Editor**).
- Session de prise en main (~30 min) : créer un projet, uploader des photos (recadrage
  hotspot), brouillon → **Publier**, voir le site se mettre à jour.
- Mini-doc FR (1 page) : « Ajouter un projet », « Écrire un article », « Modifier mes
  coordonnées ». À rédiger quand le câblage Phase B est en place.

---

## Annexe — commandes utiles

```bash
pnpm studio:install   # installe le package Studio (sanity/) — une fois
pnpm studio:dev       # studio en local (localhost:3333)
pnpm studio:deploy    # déploie le studio sur *.sanity.studio
pnpm sanity:seed      # peuple le dataset (token Editor requis)
pnpm build            # build du SITE (n'installe jamais les deps du Studio)
```

**Règle d'or** : ne jamais importer `sanity/` ni `sanity/sanity.config.ts` depuis `src/`.
Le site lit le contenu uniquement via `src/lib/sanity.ts` (`@sanity/client`).
