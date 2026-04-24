# CLAUDE.md — Règles permanentes du projet

**Destinataire** : toi, Claude, à chaque session de travail sur ce dépôt.
**Dernière mise à jour** : 2026-04-24 (Phase 0 — note reprise §11 ajoutée).

---

## 1. Contexte projet

**Client** : Studio J Oliveira — designer végétal biophilique indépendant. Siège : 41 rue Général Souham, 19100 Brive-la-Gaillarde. Zones d'intervention : Brive + Bordeaux + Limoges + Toulouse (prospection).

**Objectif business** : faire du site le canal n°1 d'acquisition de prospects qualifiés (particuliers HNW, hôtellerie-restauration, bureaux corporate, architectes prescripteurs). Positionnement **studio de design premium** — jamais « artisan jardinier ».

**Deadline mise en ligne** : fin mai 2026 (validé le 2026-04-22).

**Documentation source** : tout est dans [`_brief/`](_brief/). Voir [`_brief/00-INDEX.md`](_brief/00-INDEX.md).
**Plan d'exécution** : `C:/Users/Morgan/.claude/plans/projet-bright-eich.md` (hors-repo).

---

## 2. Priorité n°1 absolue — SEO

Le SEO conditionne **toutes** les décisions d'architecture (URLs, structure Hn, maillage interne, densité de contenu, structured data, Core Web Vitals).

**KPIs cibles (6 mois post-lancement)** :

- Top 3 Google sur « designer végétal [zone] »
- 20+ requêtes longue traîne pertinentes en top 10
- Lighthouse SEO = **100** partout
- Lighthouse Perf ≥ **90** (pages standard) / ≥ **85** (pages immersives avec scroll-scrub)

**Core Web Vitals non négociables** :

- **LCP < 2 s**
- **INP < 200 ms**
- **CLS < 0.05**

**Règle dure** : les scroll-driven immersifs (séquences Twinmotion) ne doivent **JAMAIS** bloquer le rendu du contenu textuel. Crawler Google doit lire H1 et texte avant toute chose.

---

## 3. Stack technique verrouillée

| Rôle                   | Techno                                 | Version                                                               |
| ---------------------- | -------------------------------------- | --------------------------------------------------------------------- |
| Framework              | Astro                                  | ^6.1.8 (SSG)                                                          |
| UI interactive         | React                                  | ^19.2.5 (islands Astro)                                               |
| Styling                | Tailwind CSS                           | ^4.2.4 (via `@tailwindcss/vite`)                                      |
| Animation React        | Motion (ex-Framer Motion)              | ^12.38.0                                                              |
| Scroll-driven complexe | GSAP + ScrollTrigger                   | ^3.15.0 (**lazy, uniquement `/conceptions/[slug]`**)                  |
| Immersif               | Canvas 2D + pipeline frames Twinmotion | (pas de Three.js / R3F)                                               |
| CMS                    | Sanity.io                              | ^7.21.0 — package séparé `/sanity/`, **JAMAIS importé depuis `src/`** |
| Hébergement            | Vercel                                 | région `fra1`                                                         |
| Formulaires            | Astro Actions + Resend + Turnstile     | ^6.12.2 / ^1.5.0                                                      |
| Validation             | Zod                                    | ^4.3.6                                                                |
| Analytics              | Plausible + GSC + Bing Webmaster       | (RGPD-friendly, pas de bannière cookie)                               |
| CWV tracking           | web-vitals                             | ^5.2.0                                                                |
| Pipeline frames        | sharp + fluent-ffmpeg + tsx            | (scripts Node dans `scripts/`)                                        |
| Package manager        | pnpm                                   | ^10.33.1                                                              |
| Node runtime           |                                        | ≥ 22.12 (v24 installé localement)                                     |

**Pas de drift** sans re-validation explicite par Morgan. Si besoin d'ajouter une dépendance structurante, demander d'abord.

---

## 4. Règles de code

- **TypeScript strict** (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`).
- **Composants Astro par défaut**. Un composant React (`.tsx`) **DOIT** se justifier en commentaire d'en-tête (interactivité nécessaire, ou contrainte librairie React-only). React = hydratation = JS bundle : budget contraint.
- **Imports absolus** : `@/…` pour `src/…`. Pas de `../../..` relatifs profonds.
- **Tailwind** : classes utilitaires, `@apply` **interdit**. Tokens via `@theme` dans `src/styles/global.css`.
- **Islands hydration** : `client:visible` ou `client:idle` par défaut. `client:load` uniquement si justifié.
- **GSAP importé dynamiquement** sur pages `/conceptions/[slug]`, jamais au top-level ailleurs.
- **Sanity client** : uniquement dans `src/lib/sanity.ts` et via GROQ queries typées. Pas d'import depuis `/sanity/` (le studio est un package séparé).
- **Pas de `any`** sauf justifié en commentaire. Préférer `unknown` + narrowing.
- **Commentaires** : en français, seulement quand le _pourquoi_ est non-évident. Pas de description du _quoi_ que le code porte déjà.

---

## 5. Règle éditoriale — CRITIQUE

**INTERDICTION absolue d'inventer du contenu pour Jonathan** (textes, chiffres, claims, tonalité).

Si un contenu manque :

1. Insérer un placeholder explicite : `[À FOURNIR PAR JONATHAN : description du besoin, volume attendu, contexte]`
2. Logger systématiquement dans [`_brief/contenus-manquants.md`](_brief/contenus-manquants.md)

Cette règle s'applique à **tout contenu éditorial** : phrases de hero, descriptions de typologies, articles de blog, quotes clients, chiffres-clés, noms de projets. Jonathan a passé 5-6 mois à formaliser son studio — son verbe est précis, on ne brode pas autour.

---

## 6. Règles de commit

- **Français** — messages, PR descriptions, commentaires PR.
- **Convention sémantique** :
  - `feat:` nouvelle fonctionnalité
  - `fix:` correction de bug
  - `refactor:` refactorisation sans changement de comportement
  - `perf:` amélioration de performance
  - `seo:` amélioration SEO (schema, meta, Hn, maillage)
  - `docs:` documentation
  - `style:` formatting (Prettier)
  - `chore:` tooling, deps, config
  - `build:` build system
  - `ci:` CI/CD
- **Lefthook pre-commit** : Prettier + ESLint + `astro check` — ne pas skip (`--no-verify` interdit sauf demande explicite Morgan).

---

## 7. Arrêt obligatoire à chaque fin de phase

Le projet est découpé en 7 phases (cf. plan). À la fin de chaque phase :

1. Annoncer que la phase est terminée
2. Résumer ce qui a été fait (bullet points)
3. Lister les livrables produits (fichiers, fonctions, pages)
4. **Attendre validation explicite de Morgan** avant de passer à la phase suivante

Ne **jamais** enchaîner deux phases sans green light.

---

## 8. Références permanentes à consulter

Avant toute décision structurante (archi, SEO, DA, contenu), consulter :

- [`_brief/`](_brief/) — source de vérité projet (briefs, analyses, plans)
- [`.claude/guides/`](.claude/guides/) — patterns techniques maison (Motion, Sanity, SEO, pipeline frames, frontend premium)
- `C:/Users/Morgan/.claude/plans/projet-bright-eich.md` — plan d'exécution complet validé

Si une décision SEO majeure est en jeu, **toujours expliquer d'abord à Morgan** avant de trancher.

---

## 9. Phase en cours

**Phase 0 — Setup & fondations** (en cours, termination imminente).

**Prochaine phase** : Phase 1 — Design system + layout + home statique (après validation Morgan de Phase 0).

**Ne pas démarrer Phase 1** sans green light explicite.

---

## 10. Commandes utiles

```bash
# Développement
pnpm dev                 # serveur dev Astro (localhost:4321)
pnpm build               # build production
pnpm preview             # serveur preview du build

# Qualité
pnpm check               # astro check (TypeScript + Astro)
pnpm lint                # ESLint + astro check
pnpm format              # Prettier write all
pnpm format:check        # Prettier check all

# Pipeline frames (phase 3+)
pnpm tsx scripts/generate-test-frames.ts
pnpm tsx scripts/process-frames.ts <slug> <input-dir> [video-file]
```

**Path pnpm Windows local** (si non-PATH dans shell fraîchement spawné) :
`C:\Users\Morgan\AppData\Local\Microsoft\WinGet\Links\pnpm.exe`

---

## 11. Reprise prochaine session — animations designbyad

**Note posée le 2026-04-24 par Morgan.** À traiter dès la prochaine ouverture de session.

**Objectif** : compléter / affiner la reproduction de la structure et des effets d'animations de `designbyad.com.au` (home, menu, transitions).

**Outils à mobiliser** :

- **MCP `magic`** (`@21st-dev/magic`, scope user) — composants UI, inspiration, refiner. ⚠️ Vérifier qu'il est toujours connecté en début de session (`/mcp`). Sinon réinstaller :
  ```
  claude mcp add magic --scope user --env API_KEY="<clé>" -- npx -y @21st-dev/magic@latest
  ```
- **Skill `ui-ux` (« pro max »)** — à charger côté Morgan si pas natif dans l'env. Confirmer dispo avant usage.
- **Vidéos de référence designbyad** — Morgan doit les pousser depuis son PC dev dans `_brief/client-assets/refs-designbyad/` (nommage explicite : `home.mp4`, `menu-open.mp4`, `project-hover.mp4`, etc.) avec un mini-README qui dit ce que chaque vidéo capture.

**État existant à connaître avant d'ouvrir** : un audit des patterns designbyad déjà implémentés a été fait. **13 patterns sont déjà codés** (smooth scroll Lenis, mix-blend-difference header, burger↔X morph, custom cursor, menu fullscreen curtain + stagger, link underline, SplitText, justified text dynamique, image reveal masque, parallax inverse cadre/image, manifeste justify uppercase, alternance cream/ink). Voir `src/components/astro/{SmoothScroll,Header,MenuPrimary,CustomCursor}.astro`, `src/scripts/motion-enhance.ts`, `src/styles/global.css`, `src/pages/index.astro`.

**Workflow prévu** :

1. Extraire frames clés des vidéos refs via ffmpeg (créer `scripts/extract-ref-frames.ts` si besoin)
2. Comparer frame-à-frame avec l'existant → liste de deltas
3. Patterns probablement manquants à vérifier : transitions inter-pages, hero entry sequence, hover project cards, footer reveal, loader/preload, marquee infini, scroll-snap horizontal éventuel
4. Implémenter les deltas, exécuter skill `simplify` après, MCP `magic` pour générer composants candidats si pertinent

**Garde-fou** : Phase 0 **toujours pas validée** par Morgan. Ces animations relèvent de Phase 1+. Demander green light explicite avant d'écrire du code production. Tant que pas validé : audit, plan, POC isolés OK ; pas de modification massive de pages live.
