/*
 * Theme observer — source unique de vérité pour le thème dark/light.
 *
 * Refonte 2026-04-23 (audit systémique) : avant ça, ScrollNav et CustomCursor
 * avaient chacun leur IntersectionObserver concurrent qui écrivait
 * `body.is-dark-section` avec des rootMargin différents. Résultat : cursor
 * invisible, sidebar stale, race conditions.
 *
 * Nouvelle règle :
 *   - Une section sombre DOIT porter `data-theme="dark"` (explicite, pas de regex).
 *   - Le store écrit `document.documentElement.dataset.theme = 'dark' | 'light'`.
 *   - Les composants CSS utilisent `html[data-theme="dark"]` pour adapter.
 *   - Transition `body.is-dark-section` conservée en cascade pour compat rétro.
 *
 * Singleton : initialisé une seule fois au boot, re-wire au astro:page-load.
 */

type Theme = 'light' | 'dark';

let currentTheme: Theme = 'light';
let observer: IntersectionObserver | null = null;
let activeSection: HTMLElement | null = null;

function applyTheme(theme: Theme, section: HTMLElement | null) {
  if (activeSection === section && currentTheme === theme) return;
  activeSection = section;
  currentTheme = theme;
  const root = document.documentElement;
  root.dataset.theme = theme;
  // Compat rétro : certains CSS historiques utilisent encore body.is-dark-section
  document.body.classList.toggle('is-dark-section', theme === 'dark');
}

function readTheme(el: HTMLElement): Theme {
  // Règle explicite : data-theme="dark" ou data-theme="light".
  const attr = el.dataset.theme;
  if (attr === 'dark' || attr === 'light') return attr;
  return 'light';
}

export function initThemeObserver() {
  // Idempotent — survit aux view transitions
  if (observer) observer.disconnect();

  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-theme]'));

  if (sections.length === 0) {
    // Page sans annotation = light par défaut
    applyTheme('light', null);
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      // On prend la section la plus visible (intersectionRatio le plus haut)
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible.length === 0) return;
      const best = visible[0];
      if (!best) return;
      const target = best.target as HTMLElement;
      applyTheme(readTheme(target), target);
    },
    {
      rootMargin: '-45% 0px -45% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    },
  );

  sections.forEach((s) => observer!.observe(s));

  // Initialisation : détecter la section active au chargement
  const initial = sections.find((s) => {
    const rect = s.getBoundingClientRect();
    return rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;
  });
  if (initial) applyTheme(readTheme(initial), initial);
}

// Auto-boot + re-wire sur view transitions
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeObserver, { once: true });
} else {
  initThemeObserver();
}
document.addEventListener('astro:page-load', initThemeObserver);
