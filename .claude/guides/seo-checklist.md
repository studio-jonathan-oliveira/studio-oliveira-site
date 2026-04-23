# Checklist SEO — à vérifier avant chaque merge

À parcourir systématiquement avant de marquer une page comme terminée. Les critères ci-dessous sont cumulatifs et non-négociables.

---

## Structure et balises

- [ ] **Un H1 unique** par page, reprenant la requête SEO cible (cf. `_brief/plan-seo.md` §2)
- [ ] **Hiérarchie Hn** cohérente : H2 pour sections, H3 pour sous-sections. Pas de saut (jamais H1 → H3).
- [ ] **`<title>`** : ≤ 60 caractères, inclut le mot-clé primaire + marque (`— Studio J Oliveira`).
- [ ] **`<meta name="description">`** : 140-160 caractères, 1 CTA, 1 mot-clé primaire, ton éditorial.
- [ ] **`<html lang="fr">`** — toujours FR.
- [ ] **`<link rel="canonical">`** pointe vers l'URL canonique (sans query params, sans trailing slash — on a `trailingSlash: 'never'`).

## Open Graph & Twitter Cards

- [ ] **`og:title`**, `og:description`, `og:image` (1200×630 px), `og:url`, `og:type` renseignés par page.
- [ ] **`twitter:card`** = `summary_large_image`.
- [ ] **OG image custom** par page pilier, génération dynamique via `@vercel/og` en Phase 5.

## Images

- [ ] Toutes les images passent par `<Image>` ou `<Picture>` Astro (AVIF + WebP fallback).
- [ ] **`alt`** descriptif (pas `"image"`, pas vide sauf images purement décoratives marquées `role="presentation"`).
- [ ] **`width`** et `height` explicites sur chaque image (CLS).
- [ ] **`loading="lazy"`** par défaut, sauf LCP (`loading="eager"` + `fetchpriority="high"`).

## Structured data JSON-LD

- [ ] Schemas injectés selon mapping de `_brief/plan-seo.md` §4.
- [ ] Validation `validator.schema.org` → 0 erreur.
- [ ] `LocalBusiness` primaire : **un seul `@id`** partagé entre home, contact, zones/brive.
- [ ] `Article` : `author`, `datePublished`, `image`, `headline` ≤ 110 caractères.
- [ ] `FAQPage` : minimum 3 questions, pas de FAQ artificielle.
- [ ] `BreadcrumbList` sur toute page profonde (typologies, projets, articles, zones).

## Performance — Core Web Vitals

- [ ] **Lighthouse** sur mobile, throttled 4G : Perf ≥ 90 (≥ 85 pages immersives), Accessibility ≥ 95, Best Practices = 100, SEO = 100.
- [ ] **LCP < 2 s** : hero image preload + fetchpriority, fonts préchargées, critical CSS inliné.
- [ ] **INP < 200 ms** : aucun JS sync > 50 ms, islands lazy, GSAP uniquement sur /conceptions/[slug].
- [ ] **CLS < 0.05** : dimensions images, aspect-ratio canvas, `size-adjust` polices.
- [ ] **Budget JS initial** ≤ 80 Ko compressé hors page immersive.
- [ ] **Pas de reflow** à l'arrivée des fonts (`font-display: swap` + `size-adjust` calibrées).

## Accessibilité (prérequis SEO + éthique)

- [ ] **Contraste** WCAG AA minimum, AAA sur corps de texte.
- [ ] **Navigation clavier** complète, focus rings visibles mais stylés.
- [ ] **`aria-label`** sur tous les boutons icon-only.
- [ ] **Landmarks** : `<header>`, `<main>`, `<nav>`, `<footer>`, `<aside>` bien typés.
- [ ] **Skip link** "Aller au contenu principal" en tout début de `<body>`.
- [ ] **`prefers-reduced-motion`** respecté partout (CSS + Motion + GSAP).
- [ ] **axe-core** (extension ou Playwright) → 0 erreur critique.

## Maillage interne

- [ ] Minimum **3 liens internes contextuels** par page (hors nav / footer).
- [ ] Liens ancres descriptives (pas « cliquez ici »).
- [ ] Aucune page orpheline — chaque page a au moins 2 pages qui pointent vers elle.
- [ ] Crawler Screaming Frog local → 0 erreur 404, 0 redirect chain, 0 duplicate title/meta.

## URLs et sitemap

- [ ] URLs **en français**, kebab-case, riches en keywords.
- [ ] **Sitemap.xml** auto via `@astrojs/sitemap`, exclusion explicite des pages légales et 404.
- [ ] **robots.txt** autorisant tout sauf `/api/*` et `/404`.

## Contenu

- [ ] **Volume** conforme au plan (`_brief/plan-seo.md` §5) — pages piliers 1500-2000 mots, articles 1500+ mots.
- [ ] **Densité mot-clé** naturelle, pas de stuffing.
- [ ] **Pas de duplicate content** entre pages locales `/zones/*`.
- [ ] **Pas de contenu IA** ni inventé pour Jonathan (règle dure).

## Vérification post-merge

- [ ] **GSC URL inspection** sur la page publiée — validée OK.
- [ ] **PageSpeed Insights** réel (pas Lighthouse local uniquement) : terrain et labo concordent.
- [ ] **OG preview** validé (linkedin.com/post-inspector, metatags.io).

---

## Outils à lancer avant merge

```bash
pnpm check                            # astro check (types)
pnpm lint                             # ESLint + astro check
pnpm build && pnpm preview            # vérif build + lighthouse local
pnpm tsx scripts/audit-seo.ts         # audit custom par page (Phase 6)
```

## Référence permanente

Tout le plan SEO détaillé : [`_brief/plan-seo.md`](../../_brief/plan-seo.md).
