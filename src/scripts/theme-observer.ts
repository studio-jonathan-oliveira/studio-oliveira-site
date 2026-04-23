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
let scrollController: AbortController | null = null;

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
  scrollController?.abort();
  scrollController = new AbortController();

  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-theme]'));

  if (sections.length === 0) {
    // Page sans annotation = light par défaut
    applyTheme('light', null);
    return;
  }

  // Recompute global : cherche la section [data-theme] qui intersecte le
  // milieu du viewport. Si aucune, fallback light (sinon on restait bloqué
  // sur dark quand on scrollait dans le footer — bug 2026-04-24 : « curseur
  // disparaît en bas »). Appelé par observer ET par scroll listener pour
  // couvrir les zones entre sections (footer, hero top).
  const recompute = () => {
    const mid = window.innerHeight / 2;
    const active = sections.find((s) => {
      const rect = s.getBoundingClientRect();
      return rect.top <= mid && rect.bottom >= mid;
    });
    if (active) applyTheme(readTheme(active), active);
    else applyTheme('light', null);
  };

  observer = new IntersectionObserver(recompute, {
    rootMargin: '-45% 0px -45% 0px',
    threshold: [0, 0.25, 0.5, 0.75, 1],
  });

  sections.forEach((s) => observer!.observe(s));
  // Scroll fallback (passive) — catch les zones sans section annotée
  window.addEventListener('scroll', recompute, {
    passive: true,
    signal: scrollController.signal,
  });

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
