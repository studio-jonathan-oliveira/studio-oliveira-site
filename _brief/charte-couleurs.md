# Charte couleurs — procédure de swap

**Objet** : permettre à Morgan/Jonathan de **changer une couleur de la palette** en disant simplement _« le crème devient #FFEB3B, le noir devient #87CEEB, le rouge devient #1976D2 »_ — sans avoir à toucher 200 fichiers ni risquer de régression.

**Dernière mise à jour** : 2026-05-28.

---

## 1. Palette actuelle — swap FINAL Jonathan 2026-06-04 (trames « modif finales »)

**DA finale = 3 couleurs** : beige + noir + violet. Le rouge est conservé comme
token LEGACY le temps de migrer les pages une à une (puis retrait).

| Token CSS             | Hex       | Rôle principal                                                                                                      |
| --------------------- | --------- | ------------------------------------------------------------------------------------------------------------------- |
| `--color-cream`       | `#EDE6D6` | BEIGE — fond clair dominant sitewide (était `#F5F1EA`)                                                              |
| `--color-ink`         | `#000000` | NOIR pur — texte sur fond clair + fonds sombres (footer) (était `#0A0A0A`)                                          |
| `--color-violet`      | `#E0AFFF` | VIOLET/lilas — nouvel accent (CTA, hover, fond `/demarrer-un-projet`)                                               |
| `--color-moss`        | `#70725B` | Vert grisé — texte secondaire sur fond clair                                                                        |
| `--color-red`         | `#FF0D00` | LEGACY rouge — en cours de retrait (→ violet), encore référencé par pages non migrées                               |
| `--color-forest-deep` | `#2A2D28` | Gris-vert sombre — variant dark historique (overlays cards)                                                         |
| `--color-draft`       | `#D97706` | Orange — UNIQUEMENT marqueurs `[À FOURNIR]` en dev (hors thème, ne pas changer en cas de swap de palette de marque) |

---

## 2. Architecture en 3 couches

Le système est conçu pour que **modifier une couleur de marque = modifier une seule valeur**.

```
┌─ COUCHE 1 — Palette brute ──────────────────────────────────┐
│ src/styles/global.css      lignes 67-80   (@theme {})       │
│ src/lib/brand-colors.ts    lignes 17-25                     │
│                                                             │
│ → 6 hex. C'est la SEULE source de vérité.                   │
│ → On modifie ICI quand la palette change.                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─ COUCHE 2 — Rôles sémantiques ──────────────────────────────┐
│ src/styles/global.css      lignes 82-105                    │
│                                                             │
│ --bg-page, --text-primary, --accent-action, --overlay-*…    │
│ → Décrivent À QUOI sert chaque couleur.                     │
│ → Modifier ICI si on veut "inverser" clair/sombre           │
│   sans toucher les hex.                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─ COUCHE 3 — Alias rétro-compat ─────────────────────────────┐
│ src/styles/global.css      lignes 107-114                   │
│                                                             │
│ --color-forest, --color-laterite, --color-gold, etc.        │
│ → Anciens noms utilisés dans ~200 endroits du code.         │
│ → Ne pas y toucher, ne pas en créer de nouveaux.            │
└─────────────────────────────────────────────────────────────┘
```

**Règle absolue** : aucun hex hors couche 1. Vérifié par Lefthook au commit
(grep `#[0-9a-fA-F]{6}` refusé hors `global.css` / `brand-colors.ts`).

---

## 3. Procédure de swap de palette (5 étapes)

### Exemple : _« le crème devient `#FFEB3B`, le noir devient `#87CEEB`, le rouge devient `#1976D2` »_

#### Étape 1 — Modifier `src/styles/global.css` (couche 1)

```css
@theme {
  --color-cream: #ffeb3b; /* ← était #f5f1ea */
  --color-ink: #87ceeb; /* ← était #0a0a0a */
  --color-red: #1976d2; /* ← était #ff0d00 */
  /* moss, forest-deep, draft : inchangés sauf demande */
}
```

#### Étape 2 — Synchroniser `src/lib/brand-colors.ts`

```ts
export const BRAND_COLORS = {
  cream: '#ffeb3b',
  ink: '#87ceeb',
  red: '#1976d2',
  // moss, forestDeep, draft : inchangés
} as const;
```

Mettre aussi à jour `EMAIL_COLORS.background` si la dérive du fond email
doit suivre le nouveau cream (ex. `#FFE970` au lieu de `#F4F1EA`).

#### Étape 3 — Mettre à jour ce fichier

Reporter la nouvelle palette dans la table §1 (dater le swap).

#### Étape 4 — Build + smoke test

```bash
pnpm check         # TypeScript + Astro
pnpm build         # build production
pnpm preview       # ouvrir http://localhost:4321
```

Vérifier visuellement les pages les plus exposées :

- `/` (home immersive — hero, manifeste, typologies)
- `/architecture-paysagere` + 1 spoke
- `/studio` (fond clair éditorial)
- `/conceptions/[slug]` (scroll-scrub fond sombre)
- `/journal/[slug]` (article long, fond clair)

#### Étape 5 — Validation par agents (OBLIGATOIRE)

Lancer **2 agents de revue en parallèle** pour valider qu'aucune régression
visuelle ou de contraste n'est introduite :

1. **Agent `code-reviewer`** sur le diff — détecte :
   - hex oubliés (devrait être bloqué par Lefthook mais on revérifie)
   - usages incohérents des rôles sémantiques
   - contrastes WCAG cassés (texte sur fond)

2. **Agent `Explore` (mode "very thorough")** — recherche :
   - Composants qui consommeraient les anciens hex via mémoire (cache, OG
     images générées, captures dans le dossier `_brief/`, etc.)
   - Mentions de couleurs dans la doc qui doivent être mises à jour
   - Schemas Sanity ou JSON-LD qui référenceraient des couleurs

Ne pas merger sans le retour des deux agents.

---

## 4. Fichiers concernés (anti-checklist)

Quand on swap, on ne touche **QUE** :

- ✅ `src/styles/global.css` (couche 1 — 6 hex)
- ✅ `src/lib/brand-colors.ts` (palette JS — 6 hex + email overrides)
- ✅ `_brief/charte-couleurs.md` (cette doc — table §1)

Si on doit modifier autre chose, c'est qu'une fuite est apparue.
**Stopper et investiguer avant de continuer.**

---

## 5. Cas particuliers documentés

### Emails Resend (`src/actions/index.ts`)

Les clients mail (Gmail, Outlook, Apple Mail) ne lisent pas les CSS
variables. Les templates utilisent les valeurs de `EMAIL_COLORS` exporté
depuis `brand-colors.ts`. Le fond email est un offset de ~1 point vs le
cream (historique : `#F4F1EA` vs `#F5F1EA` site) pour différencier le
fond cartouche du fond crème natif. À reproduire si swap.

### Meta `theme-color` (chrome mobile)

Définie dans `BaseLayout.astro` via la constante `THEME_COLOR_META` de
`brand-colors.ts`. Suit automatiquement la palette.

### Marqueur draft `--color-draft` (orange)

Hors thème de marque — c'est un outil de dev (visible uniquement quand
`SHOW_DRAFTS=true`). **À ne PAS modifier en cas de swap de palette** sauf
demande explicite : son rôle est de jurer visuellement avec le reste du
site pour signaler du contenu manquant.

### Overlays / dilutions

Toutes les anciennes `rgba(0,0,0,X)` et `rgba(245,241,234,X)` ont été
converties en `color-mix(in oklab, var(--color-ink|cream) X%, transparent)`.
Les fréquences les plus utilisées sont disponibles comme tokens dédiés
`--overlay-ink-{strong|medium|soft|veil}` et `--overlay-cream-*`.

---

## 6. Historique des swaps

| Date       | Changement                                                                                                 | Auteur |
| ---------- | ---------------------------------------------------------------------------------------------------------- | ------ |
| 2026-05-28 | Mise en place architecture 3 couches — palette d'origine fixée                                             | Claude |
| 2026-06-04 | Swap FINAL trames Jonathan : cream→#EDE6D6, ink→#000000, + `--color-violet` #E0AFFF. Rouge devient LEGACY. | Claude |
