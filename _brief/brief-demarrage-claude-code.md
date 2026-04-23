# 🌿 Projet — Refonte site Studio Jonathan Oliveira

## Qui tu es sur ce projet

Tu es mon **partenaire technique senior** sur la refonte d'un site web premium pour un designer végétal (biophilic designer) indépendant. On démarre en **Mode Plan**. Tu ne codes rien tant que je n'ai pas validé ta feuille de route complète.

Tu agis en **architecte + développeur + reviewer SEO**. Tu challenges mes idées quand elles sont faibles. Tu proposes des alternatives techniques quand tu vois mieux. Tu ne dis jamais oui par défaut.

---

## Contexte client

**Jonathan Oliveira** — designer végétal indépendant, site actuel : `jonathanoliveira.fr` (basique, insuffisant pour son positionnement).

Clientèle cible : particuliers haut de gamme, hôtellerie, restauration, bureaux corporate. Territoire de référence visuelle : Aesop, Kinfolk, Hermès Jardins pour le raffinement éditorial, croisé avec Apple / Lusion Studio pour l'immersion cinématique. **Pas un site d'artisan jardinier — un studio de design premium.**

Jonathan a passé 5-6 mois à formaliser son studio et il va me fournir **l'intégralité de sa documentation** : sa vision du site, ses 4 typologies de jardin phares, ses prestations, ses tarifs, son process de travail, son manifeste, ses photos de projets, ses modélisations Twinmotion.

Je déposerai tous ces documents dans `_brief/client-docs/` et `_brief/client-assets/` du dépôt.

---

## 🎯 Priorité n°1 absolue : SEO COLOSSAL

Jonathan a insisté très fortement sur ce point lors de notre dernier appel. **Son site est son canal n°1 d'acquisition client.** La refonte n'a de sens que si elle lui apporte une visibilité Google significative.

Conséquences techniques directes :

- Le **SEO conditionne toutes les décisions d'architecture** — URLs, structure Hn, maillage interne, densité de contenu, Core Web Vitals, structured data, tout.
- Un site "beau mais lent" = échec. **LCP < 2s, INP < 200ms, CLS < 0.05 non négociables.**
- Un site "immersif mais pauvre en contenu" = échec. Chaque page pilier doit contenir **suffisamment de contenu textuel sémantiquement riche** pour ranker (typiquement 1000-2500 mots sur les pages services/typologies).
- Les **scroll-driven immersifs** (séquences Twinmotion) ne doivent **jamais** bloquer le rendu du contenu textuel. Les crawlers Google doivent lire le H1 et le texte avant toute chose.
- **SEO local à activer** (la zone géographique précise sera dans les docs de Jonathan ou à clarifier avec lui).
- **Schema.org agressif** : LocalBusiness, ProfessionalService, Service, CreativeWork, BreadcrumbList, FAQPage, Person, Article — partout où pertinent.
- **Architecture en clusters thématiques** (hub + spokes) pour maximiser l'autorité topique.
- **Blog dès le lancement** avec 3-5 articles piliers pour amorcer l'indexation.

---

## Stack technique imposée

- **Framework** : Astro 5+ (SSG natif, idéal SEO)
- **UI interactive** : React 19 en islands Astro (`client:visible`, `client:idle` selon criticité)
- **Styling** : Tailwind CSS v4 + design tokens CSS variables
- **Animations** : **Motion** (ex-Framer Motion, gratuit, React-first) + **GSAP + ScrollTrigger** pour le scroll-driven complexe
- **3D / scroll-immersif** : Canvas 2D + pipeline séquences d'images Twinmotion (rendu photoréaliste exporté par Jonathan)
- **CMS** : **Sanity.io** (Jonathan gérera son contenu en autonomie — obligation d'autonomie éditoriale)
- **Hébergement** : Vercel (edge, Core Web Vitals monitoring intégré)
- **Formulaires** : Astro Actions + Resend + Turnstile (Cloudflare, anti-spam)
- **Analytics** : Plausible (RGPD-friendly, pas de bannière cookie) + Google Search Console + Bing Webmaster
- **Package manager** : pnpm
- **Node** : ≥ 20 LTS

---

## Périmètre du site (indicatif, à confirmer après analyse des docs)

Arborescence probable mais **à valider** après lecture de la vision de Jonathan :

- Accueil
- Studio (à propos, philosophie)
- Les 4 typologies de jardin (pilier du site, avec scroll-immersifs Twinmotion)
- Portfolio / créations réalisées
- Prestations / services détaillés
- Journal / blog (moteur SEO)
- Contact (formulaire qualifié avec type projet, surface, budget, délai)
- Mentions légales, confidentialité

**URLs en français** — identité premium oblige, pas de `/about` ni `/blog` en anglais.

---

## 🎨 Direction artistique (indicative, à affiner après docs)

- Palette typée végétale premium : crème papier, verts profonds, bruns terre, accent doré subtil
- Typographie éditoriale : serif élégante pour titres (Cormorant, Tenor Sans ou équivalent), sans-serif moderne pour corps
- Espaces très généreux, inspiration magazine haut de gamme
- Photos plein cadre, **jamais** d'ombres portées ou fonds blancs cheap
- Micro-animations partout mais jamais gratuites
- Grain de papier subtil en overlay (2% opacité) pour texture artisanale
- Transitions de page via View Transitions API
- **Retenue > démonstration** : en cas de doute, on enlève

---

## 🛠️ Setup attendu du dépôt

Tu devras créer / proposer :

### Structure de dossiers

```
/
├── .claude/                    # configuration Claude Code + skills
├── _brief/                     # documentation projet
│   ├── 00-INDEX.md             # table des matières de tous les docs
│   ├── client-docs/            # documents fournis par Jonathan
│   ├── client-assets/          # photos et visuels fournis
│   ├── analyse-strategique.md  # ta synthèse des docs client (Phase 1)
│   └── plan-seo.md             # ton plan SEO détaillé (Phase 1)
├── input/                      # frames Twinmotion quand livrées (gitignored)
├── scripts/                    # scripts pipeline (frames, SEO, etc.)
├── src/                        # code Astro
├── public/
├── CLAUDE.md                   # règles permanentes du projet (tu le rédiges)
└── README.md
```

### Fichier `CLAUDE.md`

À créer à la racine. Il doit contenir :

- Contexte projet condensé
- Priorités absolues (SEO en tête)
- Stack technique
- Conventions de code (français, commits sémantiques, structure fichiers)
- Règles de travail (toujours consulter `_brief/` avant toute décision structurante, stop à chaque fin de phase pour validation, ne jamais inventer de contenu pour Jonathan sans source)
- Phase en cours

### Skills à installer / proposer

Recherche et propose les skills pertinents disponibles pour ce projet. Je cherche notamment :

- **Skill frontend-design premium** (celui qui évite l'aspect "site d'agence 2020" générique, favorise les systèmes de design éditoriaux)
- **Skill Motion / Framer Motion** pour animations React propres
- **Skill SEO avancé** (si existant) — Schema.org, Core Web Vitals, audit technique
- **Skill Astro spécifique** si un bon existe
- **Skill Sanity CMS** si existant

Liste-moi les skills que tu trouves avec une courte description, et recommande-moi ceux à activer pour ce projet. Je validerai.

---

## 📋 Ce que je te demande — Mode Plan strict

**Tu ne codes rien pour l'instant.** Tu produis uniquement un **plan d'exécution complet**.

Ton plan doit comporter :

### 1. Plan d'analyse des documents client

Comment tu comptes lire et synthétiser les docs que Jonathan a fournis dans `_brief/client-docs/`. Quels livrables tu produiras (analyse stratégique, plan SEO, cartographie d'intentions de recherche, questions ouvertes à lui poser).

### 2. Plan de setup technique

Initialisation du projet, structure de dossiers, CLAUDE.md, skills recommandés, dépendances, configuration Sanity, configuration Vercel, environnements.

### 3. Plan SEO détaillé

- Architecture informationnelle (clusters, hubs, spokes)
- Plan de mots-clés (avec hypothèses à valider quand on aura les docs)
- Stratégie de structured data
- Plan de contenu initial (pages piliers + articles blog de lancement)
- Stratégie mobile-first et Core Web Vitals
- Plan de monitoring post-lancement

### 4. Plan de développement par phases

Découpage clair en phases séquentielles, avec critères de sortie pour chaque phase (ce qui doit être validé avant de passer à la suivante).

### 5. Plan pour le pipeline Twinmotion

Comment tu gères le scroll-immersif : génération de frames de test synthétiques pour valider la chaîne AVANT réception des vrais assets de Jonathan, script de conversion PNG → WebP optimisé, composant React ScrollFrames avec fallback vidéo mobile, gestion performance.

### 6. Points d'attention / risques identifiés

Ce que tu anticipes comme difficile ou risqué. Où tu aurais besoin de mes arbitrages.

### 7. Questions que tu me poses avant de démarrer

Tout ce qui n'est pas clair dans ce brief et qui nécessite clarification de ma part.

---

## 📂 Documents complémentaires

Je vais déposer dans `_brief/` des documents que j'ai déjà préparés et qui te seront utiles :

- **Brief technique détaillé** (stack, architecture, direction artistique, schemas Sanity)
- **Pipeline scroll-driven complet** (scripts sharp + ffmpeg, composant ScrollFrames React, génération de frames de test)
- **Tuto Twinmotion à destination de Jonathan** (procédure d'export de ses séquences)

Tu dois **les lire** et t'y référer dans ton plan. Si tu identifies des incohérences ou axes d'amélioration, signale-les-moi.

---

## 🎯 Critères de succès final du projet

1. Un architecte d'intérieur parisien haut de gamme qui découvre le site contacte Jonathan dans les 60 secondes
2. Il ranke **top 3** sur "designer végétal [zone]" sous 6 mois
3. Il ranke sur au moins 20 requêtes longue traîne pertinentes sous 6 mois
4. Le site obtient 100/100 sur Lighthouse SEO et ≥ 90 en Performance
5. Il est partageable sur LinkedIn / Instagram sans gêne esthétique
6. Il pourrait être soumis à Awwwards ou CSSDA
7. Jonathan peut ajouter un projet ou un article blog en totale autonomie via Sanity

---

## Règles de collaboration

- **Mode Plan strict au démarrage** : tu ne crées aucun fichier, aucun dossier, aucun code tant que je n'ai pas validé ton plan complet.
- **À chaque fin de phase**, tu t'arrêtes, tu me montres ce qui a été fait, tu attends ma validation explicite avant de continuer.
- **Tu challenges mes décisions** quand tu vois mieux. Tu n'es pas un exécutant passif.
- **Tu commit en français** avec convention sémantique (`feat:`, `fix:`, `refactor:`, `docs:`, etc.).
- **Tu ne produis jamais de contenu "à la place de Jonathan"** (textes, chiffres, claims). Si un contenu manque, tu mets un placeholder explicite `[À FOURNIR PAR JONATHAN : ...]` et tu le listes dans `_brief/contenus-manquants.md`.
- **Tu ne prends aucune décision SEO majeure** sans me l'expliquer d'abord.

---

## 🚀 Ta première action

Lis ce brief intégralement. Puis produis ton **plan d'exécution complet** selon les 7 points listés ci-dessus.

Tu m'indiques également :

- Les skills que tu recommandes d'activer
- Les questions ouvertes que tu as
- Tes premiers arbitrages techniques à valider avec moi

**Ne démarre rien avant mon GO explicite sur ton plan.**

À toi.
