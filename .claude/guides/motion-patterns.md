# Motion patterns — Motion library (ex-Framer Motion)

À consulter quand on anime en React. Librairie : `motion` (gratuite, React-first, hydratation-safe en Astro islands).

---

## Import correct

```tsx
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
```

Pas `from 'motion'` (qui exporte la version VanillaJS). La version React est `motion/react`.

## Timing de référence — éditorial, pas corporate

| Cas                  | Duration    | Ease                                                 |
| -------------------- | ----------- | ---------------------------------------------------- |
| Hover subtil         | 200 ms      | `ease-out`                                           |
| Apparition section   | 400 ms      | `[0.16, 1, 0.3, 1]` (custom, `--ease-out-editorial`) |
| Transition de page   | 500-700 ms  | `[0.76, 0, 0.24, 1]` (`--ease-in-out-editorial`)     |
| Reveal typographique | 800-1200 ms | `[0.16, 1, 0.3, 1]` + stagger 30-50ms par lettre/mot |

**Ne jamais** : `type: 'spring'` avec bounce visible, `duration < 150ms` (saccadé), `duration > 1500ms` (traîne).

## Respect prefers-reduced-motion — OBLIGATOIRE

```tsx
const shouldReduceMotion = useReducedMotion();

<motion.div
  initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
>
```

Pour les composants non-animés au repos mais animés au scroll : si `shouldReduceMotion`, sauter directement à l'état final.

## Pattern d'apparition au viewport

```tsx
<motion.section
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-80px' }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
>
```

`once: true` = l'animation ne rejoue pas si l'utilisateur scrolle à nouveau. `margin: '-80px'` = déclenche avant que l'élément soit entièrement visible pour une transition fluide.

## Variants pour stagger

```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

<motion.ul variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
  {items.map((it) => (
    <motion.li key={it.id} variants={item}>
      {it.content}
    </motion.li>
  ))}
</motion.ul>;
```

## AnimatePresence pour sorties

```tsx
<AnimatePresence mode="wait">
  {isOpen && (
    <motion.div
      key="menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      ...
    </motion.div>
  )}
</AnimatePresence>
```

`mode="wait"` évite le cross-fade entre éléments qui entrent/sortent en même temps.

## Intégration avec Astro islands

Les composants Motion sont React → à importer dans un `.tsx` hydraté.

```astro
---
import { FadeIn } from '@/components/islands/FadeIn';
---

<FadeIn client:visible>
  <h2>Titre</h2>
</FadeIn>
```

**Toujours** préférer `client:visible` (hydrate quand l'élément entre dans le viewport) pour préserver le budget JS initial. `client:load` uniquement si le composant doit être interactif immédiatement (ex : menu mobile).

## Anti-patterns

- **Animer `box-shadow`** — coûteux GPU, préférer `opacity` + pseudo-élément
- **Animer `height: auto`** — pas animable, utiliser `max-height` avec valeur concrète, ou `grid-template-rows`
- **`type: 'spring'` avec `damping < 20`** — bounce visible, ton non-premium
- **Parallax > 20% translation** — ton « sites d'agence 2020 »
- **Hover qui change le layout** (`scale`, `rotate` qui dépasse la hitbox) — frustrant à manipuler

## Alternative CSS-only quand possible

Si une animation peut se faire en CSS pur (hover button, fade in, gradient reveal), **ne pas importer Motion** — économie bundle. Motion reste pour les compositions complexes, stagger, AnimatePresence, useScroll.
