# Home patterns — animations & patterns visuels réutilisables

Catalogue des patterns d'animation et d'interaction mis en place sur `src/pages/index.astro`, conçus pour être redéployés sur les autres pages du site (typologies, conceptions, journal, contact). Tous activables via `data-*` attributes — la logique est centralisée dans `src/scripts/motion-enhance.ts`.

À lire en complément de :

- [`motion-patterns.md`](motion-patterns.md) — Motion **côté React** (composants `.tsx` hydratés)
- [`frontend-premium.md`](frontend-premium.md) — règles éditoriales et anti-patterns

---

## 1. Vue d'ensemble

| Couche                      | Tech                            | Fichier                                                  |
| --------------------------- | ------------------------------- | -------------------------------------------------------- |
| Smooth scroll global        | Lenis 1.x                       | `src/components/astro/SmoothScroll.astro`                |
| Animations scroll & in-view | Motion (vanilla JS) + SplitType | `src/scripts/motion-enhance.ts` (pilote unique, ~970 l.) |
| Theme observer              | IntersectionObserver            | `src/scripts/theme-observer.ts`                          |
| Curseur custom              | RAF natif (lerp 0.18)           | `src/components/astro/CustomCursor.astro`                |
| Texture grain               | SVG `feTurbulence` + mix-blend  | `src/components/astro/Grain.astro`                       |

**Easing universel** : `EASE_EDITORIAL = [0.16, 1, 0.3, 1]` (constante `--ease-out-editorial`). Jamais de `type: 'spring'` avec bounce visible.

**Initialisation** : `motion-enhance.ts` exporte `enhance(root)` appelé sur `DOMContentLoaded` + `astro:page-load` (compatible View Transitions). Chaque setup pose un flag `dataset.*Done` pour idempotence (anti-double-animation au re-mount).

**Reduced motion** : actuellement bypassed (à réintégrer Phase 6 audit a11y). Ne pas dupliquer les guards `prefers-reduced-motion` ailleurs sans plan global.

---

## 2. Patterns scroll-driven

### `data-reveal` — apparition au viewport

Animation Motion `inView()` à -12% de marge (révèle 12% avant entrée).

```html
<section data-reveal="up">…</section>
<section data-reveal="up" data-reveal-delay="0.3">…</section>
```

Variants disponibles :

| Variant      | From → To                                   | Durée | Usage                            |
| ------------ | ------------------------------------------- | ----- | -------------------------------- |
| `up`         | `opacity 0, y +56` → `opacity 1, y 0`       | 1.2 s | Sections texte (défaut)          |
| `fade`       | `opacity 0` → `opacity 1`                   | 1.3 s | Blocs minimalistes               |
| `slide-left` | `opacity 0, x -56` → `opacity 1, x 0`       | 1.2 s | Entrées latérales                |
| `slow`       | `opacity 0, y +80` → `opacity 1, y 0`       | 1.6 s | Headers dramatiques              |
| `image-rise` | `opacity 0, y +120, scale 1.08` → `1, 0, 1` | 1.8 s | Images cinématiques (designbyad) |

Implémentation : `motion-enhance.ts` `setupReveal()` (l.~77).

### `data-reveal-stagger` — stagger sur enfants directs

```html
<ul data-reveal="up" data-reveal-stagger="0.1" data-reveal-delay="0.2">
  <li>…</li>
  <li>…</li>
</ul>
```

Itère `group.children` et applique `setupReveal()` avec délai croissant. Skip enfants ayant déjà leur propre `data-reveal`.

### `data-mask-reveal` — révélation texte par lignes masquées

Pattern « ligne qui monte derrière un mask », typique des H1/H2 designbyad.

```html
<h2 data-mask-reveal data-mask-stagger="0.14">
  <span data-mask-line class="block">Première ligne</span>
  <span data-mask-line class="block">Deuxième ligne</span>
</h2>
```

Paramètres : `data-mask-stagger` (défaut 0.1 s), `data-mask-delay` (0), `data-mask-duration` (1.2 s), `data-mask-trigger="auto|now"`.

CSS requis sur le wrapper : `overflow: hidden` (chaque `.hero-line`/`.block` doit être clipé). Chaque `data-mask-line` translateY `110% → 0%`.

### `data-split` — révélation char-by-char réversible scroll-driven

Utilise SplitType pour fragmenter, puis Motion `scroll()` pour driver chaque char au scroll. **Réversible** (feedback Morgan : remonte = retour à l'état caché).

```html
<p data-split data-split-types="chars" data-split-stagger="0.03">
  Texte qui apparaît lettre par lettre au scroll.
</p>
```

Paramètres : `data-split-types="chars|words|lines"`, `data-split-stagger` (0.03 s), `data-split-delay` (0). Window d'animation : `0.15 → 0.35` du progress section.

### `data-justify-scroll` — spread typographique designbyad

Mots d'un bloc text-justify s'écartent au scroll de leur position left-aligned compacte vers leur position justify finale. Premier et dernier mot ancrés.

```html
<p data-justify-scroll data-justify-amp="22" data-justify-seed="7">Mot1 · Mot2 · Mot3 · Mot4</p>
```

Paramètres :

- `data-justify-amp` (ratio 0-1, défaut 0.7) — intensité du spread
- `data-justify-window="0.1,0.75"` — `[start, end]` progress du déploiement
- `data-justify-seed` — seed RNG pour phases déterministes

CSS appliqué auto : `text-align: justify`. Re-mesure des positions au load + resize (debounce 200 ms).

Implémentation : `setupJustifiedScroll()` (l.~288).

### `data-char-drift` — dérive char-by-char au scroll

Chaque lettre oscille indépendamment (sine wave phase-décalée) autour de sa position. Première et dernière lettre ancrées. Sensation typographie « vivante ».

```html
<h2 data-char-drift data-char-drift-amp="12" data-char-drift-amp-y="8" data-char-drift-seed="23">
  TITRE QUI VIBRE
</h2>
```

### `data-parallax` — parallax vertical scroll-driven

```html
<div data-parallax="0.4">…</div>
<!-- monte plus vite -->
<div data-parallax="-0.3">…</div>
<!-- descend (inverse) -->
```

Formule : `y = (progress - 0.5) * factor * 520` → factor 0.2 = ±104 px d'amplitude. Continu (Motion `scroll()`).

### `data-scroll-rise` — image qui monte plus vite que le scroll

```html
<figure data-scroll-rise data-scroll-rise-amp="120">…</figure>
```

Formule : `y = (1 - 2*progress) * amp` → image sort par le haut avant le scroll attendu. Amp défaut 80 px.

### `data-img-reveal` — image qui se déroule (clip-path) plus vite que le scroll

Pattern designbyad signature : l'image se dévoile par clip-path `inset(100% 0 0 0)` → `inset(0 0 0 0)`, plus vite que le scroll, avec offset latéral optionnel pour le côté asymétrique.

```html
<figure data-img-reveal data-img-reveal-offset="right" data-img-reveal-offset-amp="50">
  <img src="…" />
</figure>
```

Paramètres : `data-img-reveal-speed` (0.75 = 75% du viewport), `data-img-reveal-offset="left|right"`, `data-img-reveal-offset-amp` (px, défaut 40). **Réversible**.

Implémentation : `setupImageReveals()` (l.~520).

### `data-quote-scroll` — phrase qui se colorie mot par mot

```html
<p>
  <span data-quote-scroll>
    <span data-quote-word>Mot</span>
    <span data-quote-word>par</span>
    <span data-quote-word>mot.</span>
  </span>
</p>
```

Chaque `[data-quote-word]` voit son `opacity` modulée de 0.15 → 1 selon la progression de la section parent. Ease-out quad (ralentit vers la fin). Transition CSS : `opacity 60ms linear`.

---

## 3. Patterns interactifs (souris)

### `data-magnetic` — aimant curseur

L'élément suit le pointeur avec amortissement, puis revient en place au `pointerleave`.

```html
<a href="…" data-magnetic="0.35">CTA</a>
```

Paramètre : force `0..1` (défaut 0.25, 0 = désactivé). Composant `CtaLink.astro` l'expose via prop `magnetic={0.18}`.

Skip auto sur `pointer: coarse` (mobile).

### CtaLink — CTA universel

```astro
<CtaLink
  href="/contact"
  label="Démarrer un projet"
  tone="dark"
  'dark'
  |
  'light'
  |
  'accent'
  size="md"
  'sm'
  |
  'md'
  |
  'lg'
  magnetic={0.25}
/>
```

Structure : dot pulsant 7 px (keyframe `cta-link-pulse` 2.6 s) + label mono uppercase + arrow `→` qui translate au hover.

### CustomCursor — curseur custom

Auto-actif desktop (`pointer: fine`). Dot 9 px central + ring 24 px trailing (lerp 0.18 RAF). Hover sur `a, button, [data-magnetic]` → ring grow 32 px. `[data-cursor-label="EXPLORER"]` → ring 96 px + label centré. `[data-cursor-skip]` désactive l'expansion (CTA volumineux).

`mix-blend-mode: difference` sur le ring (auto-invert sur fond clair/sombre).

---

## 4. Patterns spécifiques

### `data-hero-sequence` — cascade hero homepage

Anime eyebrow → H1 (mask-reveal) → manifesto → CTA → cue en cascade temporisée. Synchro sur signal `intro:done` (IntroBumper, actuellement off), fallback 8 s.

Éléments ciblés (tous optionnels) :

```html
<div data-hero-sequence>
  <p data-hero="eyebrow">…</p>
  <h1 data-hero-mask>
    <span data-mask-line>…</span>
  </h1>
  <p data-hero="manifesto">…</p>
  <div data-hero="cta">…</div>
  <div data-hero="cue">…</div>
</div>
```

Timings : eyebrow 0.2 s, mask-lines 0.45 + (i × 0.18), manifesto 1.0 s, CTA 1.25 s, cue 1.55 s.

### `data-hscroll-typologies` — horizontal scroll pinned

4 panels alignés horizontalement, scroll vertical → translate horizontal du rail. Dwell 15 % début + 12 % fin. Parallax 3 couches (`frame|image|text`), char reveal du nom au panel actif, CTA pointer-follow optionnel.

```html
<section data-hscroll-typologies>
  <div data-hscroll-rail>
    <article data-hscroll-panel>
      <div data-parallax-layer="frame">…</div>
      <div data-parallax-layer="image">…</div>
      <div data-parallax-layer="text">
        <h3 class="htypo-name"><em>Nom typologie</em></h3>
      </div>
    </article>
    …
  </div>
  <div class="htypo-tick" data-tick></div>
  <a data-cursor-cta>Voir</a>
</section>
```

Breakpoint : desktop ≥ 1024 px + `pointer: fine` only ; tablet/mobile retombe en CSS scroll-snap natif. Reduced motion = stack vertical.

---

## 5. Composants UI partagés (récap rôles)

| Composant        | Rôle                                                                                                        | Fichier                                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| **CtaLink**      | CTA universel dot + label + arrow + magnetic                                                                | `src/components/astro/CtaLink.astro`      |
| **CustomCursor** | Curseur custom mix-blend-difference + labels                                                                | `src/components/astro/CustomCursor.astro` |
| **ScrollNav**    | Sidebar gauche numérotée + thumb (auto-alimentée par `[data-section-label]`)                                | `src/components/astro/ScrollNav.astro`    |
| **SmoothScroll** | Lenis 1.1 s expo.out, expose `window.__lenis`                                                               | `src/components/astro/SmoothScroll.astro` |
| **Grain**        | Texture papier `feTurbulence` opacity 2.5 % multiply                                                        | `src/components/astro/Grain.astro`        |
| **Header**       | Fixed topbar, logo swap moss/cream, mix-blend-difference (sauf dark-hero non scrolled cf. passe 2026-04-27) | `src/components/astro/Header.astro`       |
| **MenuPrimary**  | Fullscreen overlay nav, dialog natif, clip-path curtain 0.75 s                                              | `src/components/astro/MenuPrimary.astro`  |

Sections doivent porter `data-section-label="Accueil"` et `data-theme="dark|light"` pour ScrollNav + theme-observer.

---

## 6. Keyframes CSS principaux

| Keyframe             | Fichier                 | Rôle                                       |
| -------------------- | ----------------------- | ------------------------------------------ |
| `bifurc-pulse`       | `index.astro` `<style>` | Dot pulsant cards bifurcation (2.6 s)      |
| `scroll-pulse`       | `index.astro` `<style>` | Ligne « scroll to explore » (2.8 s)        |
| `cta-link-pulse`     | `CtaLink.astro`         | Dot CTA universel (2.6 s)                  |
| `status-pulse`       | `Header`, `MenuPrimary` | Status dot disponibilité (2.5 s)           |
| `primary-menu-panel` | `MenuPrimary.astro`     | Curtain clip-path open (0.75 s)            |
| `primary-menu-item`  | `MenuPrimary.astro`     | Items stagger 0.95 s, delay 0.25 + i\*0.07 |

---

## 7. Comment redéployer un pattern sur une autre page

1. **Identifier le pattern** dans le catalogue ci-dessus.
2. **Ajouter les `data-*` attributes** sur le markup voulu — pas besoin d'imports ou de scripts additionnels, `motion-enhance.ts` est déjà chargé globalement par `BaseLayout.astro`.
3. **Vérifier les CSS requis** :
   - `data-mask-reveal` → `overflow: hidden` sur le wrapper de chaque ligne
   - `data-justify-scroll` → `text-align: justify` sera appliqué auto, mais la typo doit s'y prêter (jamais sur titre Cormorant énorme)
   - `data-img-reveal` → l'image doit être dans un wrapper avec dimensions fixes
4. **Tester sur dev** (`pnpm dev`) puis valider sur build (`pnpm build && pnpm preview`).
5. **Respecter `frontend-premium.md`** : pas de chorégraphie systématique, l'animation sert la narration ou est supprimée.

---

## 8. Anti-patterns / pièges connus

- **Ne pas empiler `data-reveal` ET `data-mask-reveal` sur le même élément** — conflit d'initiale.
- **Ne pas mettre `isolation: isolate` sur une section qui contient un `data-img-reveal`** — crée un stacking context qui bloque le clip.
- **Ne jamais utiliser `data-hero-zoom`** — désactivé après bug Morgan 2026-04-27 (« voit toujours du noir »).
- **Mix-blend-mode du Header sur photo bruyante = imprévisible.** En dark-hero, on a basculé en `mix-blend-mode: normal` + text-shadow direct (commit `1ea926e`). Patterns à éviter : superposer un Header `mix-blend: difference` au-dessus d'une image sans zone uniforme stable.
- **Lenis est exposé en `window.__lenis`** : utiliser `window.__lenis?.scrollTo(target, { offset: -80 })` pour les ancres internes plutôt que `scrollIntoView()` natif (qui casse le smooth scroll).
- **GSAP n'est PAS utilisé** sur la home (feedback Morgan « trop lourd »). Réservé aux pages `/conceptions/[slug]` (scroll-scrub immersif). Ne pas l'importer ailleurs.
