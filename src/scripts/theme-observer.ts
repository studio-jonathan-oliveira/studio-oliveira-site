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
  // milieu du viewport. Si plusieurs sections intersectent simultanément
  // (cas des sections sticky comme le hero qui restent collées en haut
  // pendant qu'on scroll dans la section suivante), on prend la DERNIÈRE
  // dans l'ordre du DOM — c'est elle qui correspond au contenu visible
  // « courant » (Morgan 2026-04-29 retours bloc 2 : le cursor + sidebar
  // restaient en mode dark sur les sections cream après le hero sticky).
  // Si aucune, fallback light.
  const recompute = () => {
    const mid = window.innerHeight / 2;
    let active: HTMLElement | undefined;
    for (const s of sections) {
      const rect = s.getBoundingClientRect();
      if (rect.top <= mid && rect.bottom >= mid) active = s;
    }
    if (active) applyTheme(readTheme(active), active);
    else applyTheme('light', null);
  };

  observer = new IntersectionObserver(recompute, {
    rootMargin: '-45% 0px -45% 0px',
    threshold: [0, 0.25, 0.5, 0.75, 1],
  });

  sections.forEach((s) => observer!.observe(s));
  // Scroll fallback throttlé via rAF — sinon recompute fire à chaque event
  // et les getBoundingClientRect N×par-scroll font laguer (feedback
  // 2026-04-24 : « le scrolling lag un peu »).
  //
  // Perf 2026-05-17 (Morgan : lag scroll iPhone) — sur mobile on skip ce
  // scroll fallback : getBoundingClientRect sur N sections à chaque rAF
  // créait du layout thrashing iPhone. L'IntersectionObserver ci-dessus
  // suffit à détecter les transitions de section sur mobile (l'edge case
  // résolu en 2026-04-24 concernait le desktop sticky uniquement).
  const isMobileScroll = window.matchMedia('(pointer: coarse), (max-width: 1023px)').matches;
  if (!isMobileScroll) {
    let rafPending = false;
    const onScroll = () => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        rafPending = false;
        recompute();
      });
    };
    window.addEventListener('scroll', onScroll, {
      passive: true,
      signal: scrollController.signal,
    });
  }

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
