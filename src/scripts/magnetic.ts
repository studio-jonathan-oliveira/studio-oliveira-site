/*
 * Helper magnétique pur — pas d'effet de bord global.
 *
 * Séparé de `motion-enhance.ts` (qui exécute `init()` au top-level
 * touchant `document`) pour pouvoir être importé depuis un module
 * React island sans crasher le SSR prerendering.
 *
 * Utilisé par :
 *   - motion-enhance.ts → setupMagnetic (scan sitewide `[data-magnetic]`)
 *   - DemarrerForm.tsx → bouton ENVOYER (island React, hydraté après scan)
 */

import { animate } from 'motion';

const EASE_EDITORIAL: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Applique le pattern magnétique signature designbyad sur un élément.
 * Renvoie une fonction de cleanup (à appeler dans useEffect return).
 */
export function bindMagnetic(el: HTMLElement, strength = 0.35): () => void {
  const onMove = (e: PointerEvent) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    animate(el, { x: dx, y: dy }, { duration: 0.25, ease: EASE_EDITORIAL });
  };
  const onLeave = () => {
    animate(el, { x: 0, y: 0 }, { duration: 0.45, ease: EASE_EDITORIAL });
  };

  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerleave', onLeave);

  return () => {
    el.removeEventListener('pointermove', onMove);
    el.removeEventListener('pointerleave', onLeave);
  };
}
