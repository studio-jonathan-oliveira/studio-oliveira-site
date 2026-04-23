# Frontend premium — anti-patterns et règles éditoriales

À consulter avant toute décision de composant, layout ou micro-interaction. Objectif : éviter l'aspect « site d'agence 2020 ». Territoire visuel : Aesop, Kinfolk, Hermès Jardins, Apple, Lusion Studio.

---

## Anti-patterns bannis

- **Cartes bento** — grille de cartes arrondies avec ombres portées. C'est 2022-2023. On fait du grid éditorial magazine, pas du dashboard.
- **Ombres portées visibles** sur images ou blocs — jamais. Profondeur par superposition, grain, et espace négatif.
- **Fonds blancs purs (#FFFFFF)** — le fond est crème papier `#F5F1EA`. Le blanc pur est cheap.
- **Hover cards qui se soulèvent** — on n'est pas Spotify. Les états hover sont subtils : crossfade d'image, révélation de légende discrète, pas de `scale(1.05)`.
- **Boutons arrondis pleins aux couleurs saturées** — préférer les boutons texte avec soulignement animé, ou contour fin, ou pill discret.
- **Icônes Lucide/Heroicons génériques** dans les sections éditoriales — si besoin d'icônes, dessinées ou custom. Le reste = typographie + photo.
- **Animations d'entrée fade-up sur tout** — pas de chorégraphie scroll systématique. Une animation doit servir la narration, sinon elle est supprimée.
- **Emojis dans le contenu** — jamais (sauf demande explicite Morgan). Registres éditoriaux incompatibles.
- **Sections « Pourquoi nous choisir » avec 3 colonnes + icônes** — pur 2015.
- **Carousels / sliders** — mort. On scrolle.
- **« Voir plus » qui ouvre un modal** — on navigue vers une page dédiée, avec sa propre URL (SEO).
- **Breadcrumbs visibles sur home/hub** — uniquement sur pages feuilles utiles.

## Règles éditoriales

- **Espace > contenu** — marges généreuses partout (`py-24` minimum sur sections). Le vide est premium.
- **Typographie = décor** — la serif de titre (Cormorant) doit porter une charge émotionnelle. Les H1 sont grands (`var(--text-hero)`), aérés, en plein cadre.
- **Photos plein cadre** — pas de vignettes cadrées avec bordures. L'image respire bord à bord du bloc.
- **Grain subtil en overlay** — SVG noise à 2% d'opacité, `mix-blend-mode: multiply`, appliqué aux hero/sections photo. Apporte la texture papier/artisanat.
- **Transitions de page** : View Transitions API. Fondu + léger slide, jamais brutal.
- **Curseur custom** (optionnel desktop) : cercle organique 16-20px qui suit, réactif au hover sur liens/boutons (se dilate + inverse couleur). Jamais sur mobile.
- **Micro-typographie** : `text-wrap: balance` sur titres, `text-wrap: pretty` sur paragraphes, pas de veuves/orphelines.
- **Ligatures** : activer `font-feature-settings: 'liga', 'clig'` sur le corps.

## Mobile-first vrai

- Mobile n'est pas desktop en plus petit. C'est un registre éditorial différent : moins de hiérarchies visuelles simultanées, plus de scroll vertical, moins de deux colonnes.
- Menu mobile : drawer plein écran, transitions soignées (150-200ms), fond semi-opaque crème.
- Touch targets : ≥ 44px × 44px (iOS HIG).
- Tester sur vrai appareil middle-range (pas DevTools seul) avant validation de phase.

## Règle d'or

En cas de doute, on **enlève**. Retenue > démonstration.

## Références de benchmark

- **Éditorial / minimaliste** : `omaivillas.com`, `archidomo.fr`, `studiodado.com`, `studioredd.nl`, `designbyad.com.au`
- **Immersif / premium** : `9to5studio.it`, `shed.design`, `springs.estate`, `felix-nieto.com`
- **Retail premium** : `aesop.com`, `kinfolk.com`, `hermes.com/fr/fr/category/universe/hermes-jardins`
- **Tech immersif** : `apple.com/apple-vision-pro`, `lusion.co`, `active.theory`

Ne jamais copier. Prendre les patterns d'espacement, typographie, timing.
