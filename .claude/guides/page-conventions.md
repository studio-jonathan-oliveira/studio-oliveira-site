# Page conventions — règles à propager sur tout le site

Conventions visuelles et techniques imposées par Morgan sur les pages `/studio` et `/architecture-paysagere` (2026-04-27), à propager sur l'ensemble du site (typologies, conceptions, journal, contact, réalisations, etc.).

À lire en complément de :

- [`home-patterns.md`](home-patterns.md) — catalogue des patterns `data-*` réutilisables
- [`frontend-premium.md`](frontend-premium.md) — anti-patterns éditoriaux
- [`motion-patterns.md`](motion-patterns.md) — Motion React (`.tsx` hydratés)

---

## 1. Palette — monochrome cream uniquement

**Interdiction absolue** d'utiliser `var(--color-laterite)` ou `var(--color-moss)` sur du **texte éditorial** (titres, paragraphes, emphases italic, eyebrows mono, citations).

**Règle** : tout texte d'emphase ou mot-clé est en **cream avec opacité 50-60 %** (pattern home `<span class="hover-accent">`).

```html
<!-- ❌ AVANT -->
<em class="text-[var(--color-laterite)] italic">vision</em>
<em class="text-[var(--color-moss)] not-italic">méthode</em>

<!-- ✅ APRÈS -->
<em class="text-[var(--color-cream)]/55 italic">vision</em>
<em class="text-[var(--color-cream)]/55 not-italic">méthode</em>
```

| Usage                                         | Avant                                  | Après                                     |
| --------------------------------------------- | -------------------------------------- | ----------------------------------------- |
| Mots-clés italic dans copy                    | `text-[var(--color-laterite)]`         | `text-[var(--color-cream)]/55`            |
| Eyebrows mono uppercase                       | `text-[var(--color-laterite)]/moss`    | `text-[var(--color-cream)]/55`            |
| Borders éditoriales (blockquote, séparateurs) | `border-[var(--color-laterite)]/40`    | `border-[var(--color-cream)]/40`          |
| Hovers (link underline / text)                | `hover:text-[var(--color-laterite)]`   | `hover:text-[var(--color-cream)]`         |
| Dot pulsant signature                         | `background: var(--color-laterite)`    | `color-mix(cream 60%, transparent)`       |
| Halo radial décoratif                         | `color-mix(laterite 32%, transparent)` | `color-mix(cream 18%, transparent)`       |
| Hover background ligne                        | `color-mix(laterite 4%)`               | `color-mix(cream 6%)`                     |
| Guillemet décoratif `::before`                | `color: var(--color-laterite)`         | `color: var(--color-cream); opacity: 0.3` |
| Séparateurs `·` dans bandes keywords          | `color: var(--color-laterite)`         | `color: var(--color-cream); opacity: 0.4` |

**Couleurs OK** : `cream` (avec opacités), `forest`, `ink`. Ces 3 forment la palette monochrome du site.

---

## 2. H1 cassé designbyad — pattern signature

Tous les hero de pages éditoriales suivent le même pattern : nom propre / kicker en italique mid-size + positionnement énorme en CAPS, en `data-mask-reveal` :

```astro
<h1
  data-mask-reveal
  data-mask-stagger="0.14"
  class="page-h1-broken mt-6 font-[family-name:var(--font-heading)] leading-[1.02]"
>
  <span data-mask-line class="block pb-[0.05em] italic">Jonathan</span>
  <span data-mask-line class="block pb-[0.05em] italic">Oliveira —</span>
  <span data-mask-line class="page-h1-positioning block pb-[0.18em]">DESIGNER BIOPHILIQUE.</span>
</h1>
```

CSS associé :

```css
.page-h1-broken {
  font-size: clamp(2rem, 5vw, 3.5rem);
}
.page-h1-positioning {
  font-family: var(--font-heading), sans-serif;
  font-weight: 500;
  font-size: clamp(2.6rem, 7vw, 5.5rem);
  line-height: 0.96;
  letter-spacing: -0.012em;
}
```

**Règle** : sur chaque page pilier, le H1 doit avoir au moins une ligne en CAPS Jost monumentales (positionnement / titre principal) et au moins une ligne en italic Cormorant (sous-titre / nom propre / contrepoint). Pas de H1 plat.

---

## 3. Mask-reveal sur **tous** les H2

Tout H2 d'une page éditoriale doit être en `data-mask-reveal`, avec chaque ligne wrappée :

```astro
<h2 data-mask-reveal data-mask-stagger="0.14" class="...">
  <span data-mask-line class="block pb-[0.05em]">Première ligne</span>
  <span data-mask-line class="block pb-[0.12em]"
    >deuxième ligne <em class="italic">avec emphase</em>.</span
  >
</h2>
```

Les `<br />` doivent être convertis en `<span data-mask-line>`. Padding-bottom 0.05em en standard, 0.12em quand la ligne contient des jambages descendants (j, p, g, y) ou de l'italic.

---

## 4. Bandes keywords — JUSTIFY designbyad

Au moins **une bande keywords par page** entre 2 sections, en CAPS `data-justify-scroll`. Mots à puiser **uniquement dans le contenu existant** de la page (pas d'invention).

```astro
<p
  class="page-keywords-band"
  data-reveal="up"
  data-justify-scroll
  data-justify-amp="20"
  data-justify-seed="7"
>
  Mot1 <span aria-hidden="true">·</span>
  Mot2 <span aria-hidden="true">·</span>
  Mot3 <span aria-hidden="true">·</span>
  Mot4 <span aria-hidden="true">·</span>
  Mot5
</p>
```

CSS commun (à factoriser un jour en composant) :

```css
.page-keywords-band {
  font-family: var(--font-heading), sans-serif;
  font-weight: 500;
  font-size: clamp(1.1rem, 3vw, 2.4rem);
  line-height: 1.1;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-cream);
  text-align: justify;
  max-width: 90rem;
  margin-left: auto;
  margin-right: auto;
}
.page-keywords-band > span[aria-hidden] {
  display: inline-block;
  margin: 0 0.4em;
  color: var(--color-cream);
  opacity: 0.4;
  font-weight: 400;
}
```

**Long blocs de texte (citations, manifestes)** : ajouter aussi `data-justify-scroll` (amp 0.55, window `0.05,0.65`) sur la blockquote pour effet spread sur les mots du paragraphe.

---

## 5. ScrollNav — sections obligatoires

**Toute section visible** d'une page doit porter `id` + `data-section-label` (alimente la sidebar gauche ScrollNav).

Sur les `<section>` HTML directes :

```astro
<section id="demarche" data-section-label="Démarche" data-theme="dark" ...></section>
```

Sur les `<Section>` Astro components, utiliser les props `id` + `sectionLabel` :

```astro
<Section variant="forest" id="parcours" sectionLabel="Parcours" labelledBy="parcours-title" />
```

Le hero porte toujours `id="hero"` + label correspondant (« Accueil », « Studio », « Architecture paysagère »…).

Le CTA final porte `id="contact-cta"` + `sectionLabel="Contact"`.

**Cible** : 5 à 7 sections visibles par page. En dessous, la sidebar n'a pas d'utilité ; au-dessus, la lecture devient confuse.

---

## 6. Hero pleine page (100svh) sur pages sombres

Toutes les pages `darkHero` ou hero sombre :

- Section : `min-h-[100svh]`
- Pour les hero split (texte + image) : `lg:h-full` sur le wrapper image, `data-img-reveal` lent (`speed="0.95"`) sur l'image
- Bloc texte hero : `data-scroll-rise data-scroll-rise-amp="-80"` à `-100` (descend doucement au scroll)

---

## 7. Header — verre dépoli auto sur sections sombres

Implémenté **globalement** dans `Header.astro` via `:global(body.is-dark-section)` (alimenté par `theme-observer` qui détecte `data-theme="dark"` au scroll).

**Conséquence** : aucune action page-spécifique requise. Il suffit que les sections sombres soient correctement taguées `data-theme="dark"` (ou `variant="forest"` / `variant="immersive"` qui le posent automatiquement) pour que le Header passe en verre dépoli avec text-shadow + box-shadow renforcés sur logo cream / menu / topbar / CTA pill.

Sur sections claires (cream) : retour automatique au `mix-blend-mode: difference` qui marche bien sur fond uni.

---

## 8. Image-reveal — règles d'usage

| Cas                                                  | Pattern                                                                                        |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Image full-bleed / chapitres pinned / hero immersive | `data-img-reveal data-img-reveal-speed="1"` (ou `0.95`)                                        |
| Image décalée asymétrique (parallax avec texte)      | `data-img-reveal-offset="left                                                                  | right" data-img-reveal-offset-amp="40-60"` |
| Cards en grid (typologies, projets, etc.)            | **❌ Ne PAS utiliser `data-img-reveal`**. Utiliser `data-reveal-stagger` sur le `<ul>` parent. |
| Portraits / images sticky                            | `data-img-reveal-speed="0.95"` (slow reveal cinématique)                                       |

**Règle de fond** : `data-img-reveal` est conçu pour les images **full-bleed grand format** (clip-path qui se révèle au scroll). Sur des cards en grid avec aspect-ratio fixe, le scroll observer ne se déclenche pas correctement → images restent masquées (bug confirmé sur archi-paysagere typologies). Réservé aux gros visuels.

---

## 9. Parallax + scroll-rise — dosage

| Cas                                      | Valeur                                                 |
| ---------------------------------------- | ------------------------------------------------------ |
| Header de section qui « descend »        | `data-parallax="-0.20"` à `-0.25`                      |
| Copy de section qui « monte »            | `data-parallax="0.18"` à `0.25`                        |
| Bloc texte hero qui sort par le bas      | `data-scroll-rise data-scroll-rise-amp="-80"` à `-100` |
| Quote / blockquote qui remonte au scroll | `data-scroll-rise data-scroll-rise-amp="60"`           |

**Règle** : pas plus de 2-3 effets parallax/scroll-rise simultanés par section, sinon saturation visuelle. Une animation doit servir la narration ou être supprimée (cf. `frontend-premium.md`).

**Conflits à éviter** : ne pas empiler `data-scroll-rise` (transform Y) avec `data-justify-scroll` (transform X) sur le même élément. Choisir l'un ou l'autre.

---

## 10. Respiration full-bleed entre sections lourdes

Quand 2 sections forest se suivent (ex: Typologies → Process), insérer une **bande respiration full-bleed** 60vh (50vh mobile) avec une photo de projet livré, sans texte par-dessus :

```astro
<section
  class="page-respiration relative overflow-hidden bg-[var(--color-forest)]"
  aria-hidden="true"
  data-theme="dark"
>
  <div data-img-reveal data-img-reveal-speed="1" class="page-respiration-frame">
    <Image
      src={respirationImage}
      alt=""
      widths={[960, 1440, 1920, 2560]}
      sizes="100vw"
      quality={82}
      format="webp"
      class="h-full w-full object-cover object-center"
      loading="lazy"
    />
  </div>
</section>
```

CSS :

```css
.page-respiration {
  height: 60vh;
  min-height: 320px;
}
@media (max-width: 768px) {
  .page-respiration {
    height: 50vh;
  }
}
.page-respiration-frame {
  position: absolute;
  inset: 0;
}
```

**Règle** : pas de Section component ici (on veut full-bleed sans padding canonique). Section HTML directe, `aria-hidden="true"` car pas de contenu sémantique.

---

## 11. Contenu — interdiction d'invention

Rappel de la règle CLAUDE.md §5 : **aucun mot inventé pour Jonathan**.

Toute mise en exergue (CAPS, italic, color emphasis, mots dans bande keywords) doit utiliser des mots **déjà présents** dans le contenu de la page. On ne fait que **reformuler typographiquement**.

Si un contenu manque pour qu'un pattern soit pertinent (ex: bande keywords vide), insérer un placeholder `[À FOURNIR PAR JONATHAN : ...]` et logger dans `_brief/contenus-manquants.md`.

---

## 12. Checklist propagation par page

Avant de commit une nouvelle page propagée, vérifier :

- [ ] Aucune classe `text-[var(--color-laterite)]` ou `text-[var(--color-moss)]` (grep)
- [ ] H1 cassé designbyad (italic + CAPS)
- [ ] Tous les H2 en `data-mask-reveal` avec `<span data-mask-line>` par ligne
- [ ] Au moins une bande keywords `data-justify-scroll`
- [ ] `id` + `sectionLabel` sur toutes les sections visibles (hero, sections principales, CTA final)
- [ ] Hero `min-h-[100svh]` si page sombre
- [ ] `data-scroll-rise` sur bloc texte hero
- [ ] Pas de `data-img-reveal` sur cards en grid
- [ ] `data-img-reveal-speed="1"` sur images full-bleed et chapitres pinned
- [ ] Bande respiration full-bleed entre sections lourdes consécutives (si pertinent)
- [ ] Aucun mot inventé (tout vient du contenu existant)
- [ ] `pnpm check` 0 error / 0 warning
- [ ] `pnpm build` 28 pages OK

---

## 13. Pages restantes à propager

Par ordre de priorité (audit + 3 passes : conservatrice → audace → immersion) :

1. `/contact` — page formulaire, pattern à adapter (less audace, plus fonctionnel)
2. `/journal/index` — hub articles, mask-reveal H2 + cards typologies-style
3. `/journal/[slug]` — articles, hero éditorial + img-reveal
4. `/realisations/index` — hub projets, hscroll-typologies possible
5. `/realisations/[slug]` — page projet, hero immersif + galleries img-reveal
6. `/lcd-atypiques` — page secondaire, propagation simple
7. `/amenagement-vegetal-interieur/index` — hub, pattern jumeau de architecture-paysagere
8. `/amenagement-vegetal-interieur/[slug]` — typologies internes
9. `/architecture-paysagere/[slug]` — typologies pilier business
10. `/conceptions/index` + `/conceptions/[slug]` — pages immersives GSAP (à part)
11. `/projets/index` — collection projets
12. `/pros/index` — page B2B (architectes prescripteurs)
