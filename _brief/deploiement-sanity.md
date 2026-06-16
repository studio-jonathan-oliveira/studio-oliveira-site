# Déploiement Sanity — runbook

Procédure pour activer le CMS **Sanity** sur le site Studio J Oliveira, proprement.
Dernière mise à jour : 2026-06-16.

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

> ⚠️ Il reste un **décalage contenu** : la page `/projets` (le hub actuel, refonte trames)
> et la home/studio ont leur contenu **codé en dur**. Le câblage de ces pages sur Sanity
> est la **Phase B** ci-dessous (à faire après création du projet, pour pouvoir tester sur
> de la vraie donnée). L'infra (Phase A) est prête.

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

## Phase B — Câbler les pages sur Sanity (actions code, après Phase A)

À faire une fois le projet créé + seedé (pour tester sur de la vraie donnée). Ordre conseillé :

1. **Aligner le schéma `project`** sur la structure des trames `/projets`
   (sous-titre, phase « Conception/Réalisation/Co-conception » + année, localisation,
   texte « approche » en blockContent, ordre d'affichage). Adapter le seed mock en
   conséquence.
2. **Câbler `/projets`** : remplacer les tableaux `conceptions[]` / `realisations[]` codés
   en dur par `fetch(projectsListQuery, { section })`, en **gardant le rendu pixel
   identique** (quinconce, accordéons, infobulle curseur, lightbox « approche »).
3. **Journal** : déjà câblé — il suffit que Jonathan écrive ses articles. Ajouter une
   intro de page (champ `siteSettings` ou doc dédié) pour remplacer le placeholder.
4. **Galeries + FAQ typologies** : exposer `typology.gallery` + `typology.faq` dans les
   4 pages typologies (le hero, les specs et le manifeste restent en dur = DA verrouillée).
5. **NAP / réseaux** : consommer `siteSettings` (téléphone, email, adresse, Instagram…)
   dans le Footer / Contact / JSON-LD au lieu de `site-config.ts`.
6. (Optionnel, plus tard) zones (`location`), verticales pro (`service`), témoignages.

> Chaque câblage est **non bloquant** : si Sanity renvoie vide, le fallback s'affiche.
> On peut donc livrer page par page.

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
