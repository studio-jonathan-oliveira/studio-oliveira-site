# Plan SEO — Studio J Oliveira

Plan SEO détaillé, fondation du site. **Le SEO conditionne toutes les décisions d'architecture.**

KPIs cibles (6 mois post-lancement) :

- **Top 3** sur « designer végétal [zone] »
- **20+ requêtes longue traîne** pertinentes en top 10
- **Lighthouse SEO = 100** partout, **Perf ≥ 90** (pages standard) / **≥ 85** (pages immersives)
- **Core Web Vitals** : LCP < 2 s, INP < 200 ms, CLS < 0.05

---

## 1. Architecture informationnelle (clusters hub + spokes)

### Vue d'ensemble

```
/                                            → hub général (home)
/studio                                      → manifeste, ADN biophilique, parcours
/conception-jardin                           → HUB pilier — typologies de jardin
  /conception-jardin/micro-urbain            → spoke — petit jardin en ville
  /conception-jardin/coeur-urbain            → spoke — jardin de ville
  /conception-jardin/frange-urbaine          → spoke — grand jardin péri-urbain
  /conception-jardin/domaine-caractere       → spoke — parcs et domaines privés
/amenagement-vegetal-interieur               → HUB — service intérieur
  /amenagement-vegetal-interieur/hotellerie
  /amenagement-vegetal-interieur/restauration
  /amenagement-vegetal-interieur/bureaux
  /amenagement-vegetal-interieur/commerces
  /amenagement-vegetal-interieur/airbnb-locations-atypiques
/realisations                                → portfolio photos réelles
/realisations/[slug]
/conceptions                                 → portfolio rendus Twinmotion immersifs
/conceptions/[slug]                          → scroll-scrub
/journal                                     → blog (moteur SEO)
/journal/[slug]
/zones/brive-la-gaillarde                    → SEO local pilier
/zones/bordeaux
/zones/limoges
/zones/toulouse
/contact
/mentions-legales | /confidentialite
```

### Raisonnement

- **URLs en français, riches en keywords** — `/conception-jardin/micro-urbain` est un signal SEO 10× plus fort que `/services/1` ou `/savoir-faire/micro-urbain`.
- **4 typologies = 4 spokes** d'un **hub pilier** `/conception-jardin` qui capte la requête générique forte + consolide l'autorité topique via maillage interne.
- **Pros + Airbnb = 5 spokes** d'un **hub secondaire** `/amenagement-vegetal-interieur` (pas un hub séparé qui diluerait l'autorité au lancement).
- **Dichotomie `/realisations` vs `/conceptions`** — arbitrée pour refléter la dualité photos réelles (preuve sociale) vs rendus Twinmotion (vision studio).
- **4 pages `/zones/*`** — SEO local multi-villes (Brive siège, Bordeaux / Limoges / Toulouse zones d'intervention).

### Maillage interne (règles)

- Chaque page typologie renvoie vers **3-5 projets réalisés** de la typologie correspondante + **1-2 articles** pertinents.
- Chaque page `/zones/[ville]` renvoie vers **projets locaux** + **typologies dominantes** sur le territoire.
- Chaque article renvoie vers **1-2 pages typologies** + **1 page service** + **2-3 articles liés**.
- Chaque page projet renvoie vers **typologie** + **zone géographique** du projet.
- **Règle** : minimum 3 liens internes contextuels par page (hors nav). Aucune page orpheline.

---

## 2. Plan de mots-clés — traduction des typologies propriétaires

Problème central : les noms internes de Jonathan (« Micro-urbain », « Cœur urbain », « Frange urbaine », « Domaines & Caractère ») ont **0 volume de recherche Google**. Ce sont des concepts de studio, pas des requêtes utilisateur.

**Solution** : chaque page typologie a **deux niveaux de titres** :

- **H1 = requête SEO cherchée**
- **H2 = nom propriétaire Jonathan** (cohérence branding interne)

### Cartographie typologies → requêtes principales

| Typologie Jonathan   | H1 page (requête cherchée)                   | Requêtes secondaires visées                                                                   |
| -------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Micro-urbain         | « Aménagement de petit jardin en ville »     | jardin terrasse sur mesure, jardin appartement rdc, jardin rooftop Paris, patio végétalisé    |
| Cœur urbain          | « Conception de jardin de ville sur mesure » | paysagiste jardin urbain, jardin maison de ville, jardin 100m2 ville                          |
| Frange urbaine       | « Aménagement de grand jardin péri-urbain »  | paysagiste maison campagne, jardin résidence secondaire, aménagement grand jardin lotissement |
| Domaines & Caractère | « Conception de parc et domaine privé »      | paysagiste domaine, aménagement grand terrain, conception parc privé, jardin château          |

### Mots-clés de marque et génériques

| Niveau           | Requête                                | Intention                   | Page cible                                    |
| ---------------- | -------------------------------------- | --------------------------- | --------------------------------------------- |
| Marque           | « Jonathan Oliveira designer végétal » | Navigational                | `/`                                           |
| Marque           | « Studio Oliveira Brive »              | Navigational local          | `/` ou `/zones/brive-la-gaillarde`            |
| Générique expert | « designer végétal »                   | Informationnel / commercial | `/` + `/studio`                               |
| Générique expert | « biophilic design France »            | Informationnel              | `/journal/biophilie-vegetal-concu`            |
| Générique        | « conception jardin sur mesure »       | Commercial                  | `/conception-jardin`                          |
| Générique        | « concepteur jardin »                  | Commercial                  | `/conception-jardin`                          |
| Géo              | « designer végétal Bordeaux »          | Local commercial            | `/zones/bordeaux`                             |
| Géo              | « paysagiste designer Limoges »        | Local commercial            | `/zones/limoges`                              |
| Géo              | « architecte paysagiste Toulouse »     | Local commercial            | `/zones/toulouse`                             |
| Géo              | « designer jardin Brive »              | Local commercial            | `/zones/brive-la-gaillarde`                   |
| Comparatif       | « designer végétal vs paysagiste »     | Informationnel mid-funnel   | `/journal/designer-vegetal-vs-paysagiste`     |
| Transactionnel   | « prix conception jardin sur mesure »  | Transactionnel              | `/journal/prix-conception-jardin-2026`        |
| Vertical pro     | « décorateur végétal hôtellerie »      | Commercial B2B              | `/amenagement-vegetal-interieur/hotellerie`   |
| Vertical pro     | « mur végétal restaurant »             | Commercial B2B              | `/amenagement-vegetal-interieur/restauration` |

**Volume et difficulté réels à mesurer** via Ahrefs / SEMrush / Mangools au moment de la rédaction finale des pages. La cartographie ci-dessus est une **hypothèse raisonnée** à valider.

---

## 3. Stratégie géo-ciblage — 4 pages locales qualitatives

### Règle de base

**Pas de pages locales usine à gaz.** 4 pages uniques, chacune 1500 mots minimum (2000 pour Brive, siège social), **zéro copier-coller**.

### Structure-type `/zones/[ville]`

1. **H1** : « Designer végétal à [Ville] — conception de jardins sur mesure »
2. Intro (150 mots) — contexte biophilique local
3. **H2** : Climat et territoire — essences végétales adaptées
   - Ex. Bordeaux : climat océanique tempéré, olivier viable, gaura, agapanthe, vivaces méditerranéennes
   - Ex. Brive : micro-climat corrézien, chênaie, châtaignier, gramineas bas
   - Ex. Limoges : climat continental tempéré, hortensias, fougères, arbres indigènes
   - Ex. Toulouse : climat méditerranéen tardif, oliviers, agrumes rustiques, jardins secs
4. **H2** : Typologies dominantes sur le territoire (avec liens vers /conception-jardin/\*)
5. **H2** : Projets réalisés ou zone de prospection (avec liens /realisations/_ ou /conceptions/_)
6. **H2** : FAQ locale (5-7 questions : « Quelle durée pour une étude à [Ville] », « Intervenez-vous aussi sur [ville voisine] », etc.)
7. **H2** : Contact / prise de rendez-vous (avec coordonnées locales si existantes, ou rattachement au siège Brive)

### NAP (Nom-Adresse-Téléphone)

Un **seul LocalBusiness primaire** : siège Brive, 41 rue Général Souham, 19100 Brive-la-Gaillarde, 06 61 08 84 44, `contact@jonathanoliveira.fr` (ou l'actuel gmail en attendant).

Pour les autres villes :

- **Limoges** : bureau « box étude » à Verneuil-sur-Vienne → `areaServed` dans le schema `LocalBusiness` primaire, pas un nouveau `LocalBusiness` (sauf si Jonathan a une adresse physique stable, à clarifier).
- **Bordeaux** et **Toulouse** : `areaServed` seulement, pas d'adresse physique.

### Google Business Profile

**Action à effectuer** : vérifier existence + mise à jour de la fiche GBP de Brive. Cohérence NAP avec le site = critère de ranking local majeur (voir `questions-ouvertes.md` §3.4).

---

## 4. Structured data JSON-LD

Helpers typés à implémenter dans `src/lib/schema-org.ts`. Chaque page inclut uniquement les schemas pertinents (pas de pollution).

### Mapping page ↔ schemas

| Page                                        | Schemas à injecter                                                                                |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `/`                                         | `Organization` + `LocalBusiness` (siège Brive) + `WebSite` avec `SearchAction` + `BreadcrumbList` |
| `/studio`                                   | `Person` (Jonathan Oliveira) + `AboutPage`                                                        |
| `/conception-jardin`                        | `Service` parent + `ItemList` des 4 typologies + `FAQPage`                                        |
| `/conception-jardin/[typologie]`            | `Service` enfant + `Offer` (tarif étude) + `FAQPage` + `BreadcrumbList`                           |
| `/amenagement-vegetal-interieur`            | `Service` + `ItemList` des 5 verticales + `FAQPage`                                               |
| `/amenagement-vegetal-interieur/[vertical]` | `Service` + `FAQPage` + `BreadcrumbList`                                                          |
| `/realisations/[slug]`                      | `CreativeWork` + `ImageObject` + `Place` (si localisable) + `BreadcrumbList`                      |
| `/conceptions/[slug]`                       | `CreativeWork` + `ImageObject` + `Place` + `BreadcrumbList`                                       |
| `/journal/[slug]`                           | `Article` (headline, datePublished, author Person, image) + `BreadcrumbList`                      |
| `/zones/[ville]`                            | `LocalBusiness` avec `areaServed` local + `Service` + `BreadcrumbList`                            |
| `/contact`                                  | `ContactPage` + `LocalBusiness` complet (NAP)                                                     |

### Règles transverses

- **Un seul `LocalBusiness` primaire** (home + contact + zones/brive) avec le **même `@id`** pour consolidation Google.
- **`Organization` vs `LocalBusiness`** : `LocalBusiness` est un sous-type d'`Organization`. Utiliser `ProfessionalService` (sous-type de LocalBusiness) pour refléter la réalité du studio.
- **`Person` Jonathan** : à créer une fois, référencé depuis `/studio` et depuis chaque `Article` en tant qu'auteur.
- **`Offer` sur les typologies** : indiquer fourchette de prix (`priceRange`) avec les tarifs officiels documentés — signal de transparence apprécié de Google et des utilisateurs.
- **`FAQPage`** : minimum 3 questions par page typologie et vertical pro. Les questions doivent être **vraies** (issues des contacts réels de Jonathan) — voir `contenus-manquants.md`.
- **Validation** : `validator.schema.org` obligatoire avant chaque déploiement sur 3 types de pages minimum (home, typologie, article).

---

## 5. Plan de contenu de lancement

### Pages piliers — 8 pages, ~22 000 mots

| Page                                   | Volume cible   | Priorité de rédaction                      |
| -------------------------------------- | -------------- | ------------------------------------------ |
| `/`                                    | 800-1200 mots  | Phase 1 (placeholder OK) → Phase 7 (final) |
| `/studio`                              | 1200-1800 mots | Phase 2                                    |
| `/conception-jardin` (hub)             | 1500-2000 mots | Phase 2                                    |
| `/conception-jardin/micro-urbain`      | 1500 mots      | Phase 2                                    |
| `/conception-jardin/coeur-urbain`      | 1500 mots      | Phase 2                                    |
| `/conception-jardin/frange-urbaine`    | 1500 mots      | Phase 2                                    |
| `/conception-jardin/domaine-caractere` | 1500 mots      | Phase 2                                    |
| `/amenagement-vegetal-interieur` (hub) | 1500 mots      | Phase 4                                    |

### Pages secondaires — 9 pages, ~13 500 mots

- 5 spokes `/amenagement-vegetal-interieur/*` : 5 × 1000-1500 = 5 000-7 500 mots
- 4 pages `/zones/*` : 4 × 1500 (2000 pour Brive) = 6 500 mots

### Articles blog inauguraux — 5 articles, ~9 000 mots

| #   | Titre                                                                | Intention                 | Mot-clé primaire                  | Volume    | Priorité |
| --- | -------------------------------------------------------------------- | ------------------------- | --------------------------------- | --------- | -------- |
| 1   | Biophilie : pourquoi le végétal conçu transforme vos intérieurs      | Informationnel top-funnel | design biophilique                | 1800 mots | Phase 4  |
| 2   | Designer végétal vs paysagiste : quelle différence pour votre projet | Comparatif mid-funnel     | designer végétal vs paysagiste    | 1500 mots | Phase 4  |
| 3   | Combien coûte la conception d'un jardin sur mesure en 2026           | Transactionnel qualifiant | prix conception jardin sur mesure | 2000 mots | Phase 4  |
| 4   | 5 essences corréziennes qui transforment un jardin de caractère      | Local + expertise         | plantes jardin Corrèze            | 1500 mots | Phase 4  |
| 5   | Aménager un jardin intérieur dans un appartement haussmannien        | Niche premium urbain      | jardin intérieur appartement      | 1800 mots | Phase 4  |

### Total contenu inaugural

**~44 500 mots** (pages piliers + pages secondaires + articles). **Risque majeur** — voir `questions-ouvertes.md` §2.3.

### Garde-fous rédaction

- **Chaque page** doit inclure : H1 unique, H2/H3 structurés, méta-description 140-160 caractères, image principale avec `alt` descriptif, 3+ liens internes contextuels, FAQ si pertinent.
- **Ton éditorial** : Aesop/Kinfolk, pas corpo/agence. Phrases claires, paragraphes courts (3-5 lignes), vocabulaire précis (pas de « solution », « innovant », « qualitatif » à vide).
- **Preuves à inclure** : chiffres du studio (surface traitée, nombre de projets, années d'expérience), projets réalisés en illustration, quotes clients si disponibles.
- **Pas de jargon SEO visible** (pas de keyword stuffing) — l'utilisateur humain doit trouver le texte fluide.

---

## 6. Core Web Vitals — stratégie technique

### LCP < 2 s

- Astro SSG → HTML statique pur
- Hero image : `<Image>` Astro avec `fetchpriority="high"` + `preload`
- Hero vidéo (home) : `preload=metadata` seulement (pas le fichier entier), poster image en fallback
- Fonts : `<link rel="preload" as="font">` pour **2 weights max** (Cormorant 500 + Inter 400). `font-display: swap`. Self-hostées dans `public/fonts/`.
- Critical CSS inliné automatiquement par Astro

### INP < 200 ms

- **Aucun JS synchrone > 50 ms** dans les handlers
- Islands React : `client:visible` ou `client:idle` par défaut. `client:load` seulement si vraiment critique (header nav).
- GSAP + ScrollTrigger : **chargé uniquement sur `/conceptions/[slug]`**, pas ailleurs
- Motion : léger, mais scope aux composants qui l'utilisent vraiment
- Turnstile : chargé seulement au focus sur le formulaire (différé)

### CLS < 0.05

- Dimensions explicites sur toutes les images (Astro `<Image>` force width/height)
- `aspect-ratio` CSS sur le canvas ScrollFrames
- Polices avec `size-adjust` fine-tuning pour éviter layout shift à l'arrivée des fonts custom
- Pas d'injection de contenu au-dessus du viewport après LCP (pas de bannière cookie — Plausible RGPD-friendly)

### Budget JS initial ≤ 80 Ko compressé

Hors page `/conceptions/[slug]` qui peut aller jusqu'à 120 Ko (GSAP + ScrollTrigger + logique frames).

- Sanity Studio EXCLU du bundle : package séparé dans `/sanity/`, jamais importé depuis `src/`
- React : hydratation partielle, pas full-page SPA
- Motion : tree-shaking agressif
- Polyfills : éviter (Astro gère les targets modernes)

### Images

- AVIF + WebP fallback via Astro `<Image>`
- `srcset` responsive (320 / 640 / 960 / 1280 / 1920 px)
- Lazy loading par défaut (sauf LCP)
- Pas de PNG ou JPEG non compressés en prod

### Build

- Tailwind v4 via `@tailwindcss/vite` (plus rapide, purge lightningcss)
- Astro build en mode SSG (pas SSR, sauf pour `/api/contact` en Astro Action)
- Cache Vercel : assets immutables avec `immutable, max-age=31536000`

---

## 7. Monitoring post-lancement

### Outils à mettre en place

| Outil                       | Usage                                                                 | Priorité |
| --------------------------- | --------------------------------------------------------------------- | -------- |
| **Google Search Console**   | Sitemap, indexation, requêtes, erreurs crawl, Core Web Vitals terrain | J+1      |
| **Bing Webmaster Tools**    | Sitemap, 5% trafic FR B2B premium                                     | J+1      |
| **Plausible Analytics**     | Trafic, goals (form submit, clic tel, clic email), sources            | J+1      |
| **`web-vitals` npm**        | CWV réels → `/api/vitals` → Plausible custom events                   | Phase 5  |
| **UptimeRobot**             | Ping 5 min home + contact + 1 page projet                             | J+1      |
| **Google Business Profile** | Fiche GBP Brive, à jour et complétée                                  | J+3      |

### Actions post-lancement J+1

1. Submit sitemap `/sitemap-index.xml` dans GSC et Bing Webmaster
2. **Inspection URL manuelle** des 8 pages piliers dans GSC (demande d'indexation)
3. Vérification 0 erreur crawl
4. Vérification CWV sur terrain (≥ 24h pour signal réel)
5. Test des goals Plausible (envoi formulaire depuis un autre device)
6. Vérification des balises Open Graph sur chaque page (validator OG + partage LinkedIn test)

### Rapport mensuel automatisé

Script Node.js exécuté via Vercel Cron 1× par mois :

1. Pull data GSC (API Search Console) → top 20 requêtes, impressions, CTR, positions
2. Pull data Plausible → trafic, top pages, sources, goals
3. Génère `rapport-YYYY-MM.md` dans un repo de suivi
4. Envoie le rapport par email à Jonathan via Resend

Objectif : traçabilité de l'évolution + feedback régulier sans action manuelle.

### Itération SEO post-J+30

- **Month 1-3** : indexation des pages piliers, attendre que Google profile
- **Month 3-6** : analyse des requêtes réelles → ajustement des H1/H2 si requêtes cherchées différentes de celles anticipées. Nouveaux articles blog sur les angles qui ressortent.
- **Month 6+** : ajout de nouveaux projets au portfolio, nouvelles pages de contenu sur les verticales qui convertissent le mieux.

---

## 8. Hypothèses et limites

- **Volumes de recherche** : toutes les requêtes listées sont des hypothèses raisonnées. À valider via un outil (Ahrefs / SEMrush) au moment de la rédaction fine.
- **Concurrence** : non analysée à ce stade. À compléter en Phase 2 — qui ranke aujourd'hui sur « designer végétal Bordeaux », « paysagiste designer Limoges », etc. ? Quels types de pages ? Quel volume de contenu ?
- **Intention de recherche** : certaines requêtes ciblées ici (ex : « designer végétal vs paysagiste ») peuvent être SERP-dominées par des annuaires ou des contenus d'agences SEO plutôt que par des studios. À vérifier.
- **Ancien site** : les URLs indexées de `jonathanoliveira.fr` actuel doivent être extraites (GSC ou Screaming Frog) pour bâtir la table 301. Voir `questions-ouvertes.md` §1.1.
