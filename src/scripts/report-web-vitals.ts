/*
 * Report Web Vitals → Plausible custom events.
 *
 * Mesure LCP / INP / CLS / FCP / TTFB via la lib `web-vitals` et envoie
 * chaque métrique comme événement Plausible `web-vital` avec props :
 *   - metric: nom (LCP, INP, CLS, FCP, TTFB)
 *   - value: valeur numérique arrondie (ms pour LCP/INP/FCP/TTFB, unitless ×1000 pour CLS)
 *   - rating: good / needs-improvement / poor (seuils Google)
 *   - path: pathname (sans query string)
 *
 * Permet de tracker en RUM si on tient les cibles CWV (LCP < 2s, INP < 200ms,
 * CLS < 0.05) en conditions réelles, pas juste en Lighthouse synthétique.
 *
 * No-op si :
 *   - Plausible n'est pas chargé (dev / preview sans PUBLIC_PLAUSIBLE_DOMAIN)
 *   - prefers-reduced-data ou prefers-reduced-motion (respect signal user)
 */
import { onLCP, onINP, onCLS, onFCP, onTTFB, type Metric } from 'web-vitals';

interface PlausibleApi {
  (event: string, options?: { props?: Record<string, string | number | boolean> }): void;
  q?: unknown[];
}

declare global {
  interface Window {
    plausible?: PlausibleApi;
  }
}

function sendToPlausible(metric: Metric) {
  // Plausible peut ne pas être chargé (dev local, blocage adblock, etc.).
  // Stash dans le buffer si le script tarde — Plausible relit `window.plausible.q`.
  if (typeof window === 'undefined') return;

  const value =
    metric.name === 'CLS'
      ? Math.round(metric.value * 1000) // CLS unitless → ×1000 pour précision int
      : Math.round(metric.value);

  const props = {
    metric: metric.name,
    value,
    rating: metric.rating,
    path: window.location.pathname,
  };

  if (window.plausible) {
    window.plausible('web-vital', { props });
  } else {
    // Buffer pour quand le script Plausible se charge (defer)
    const stub = function (...args: unknown[]) {
      (stub.q = stub.q ?? []).push(args);
    } as PlausibleApi & { q?: unknown[] };
    window.plausible = stub;
    window.plausible('web-vital', { props });
  }
}

onLCP(sendToPlausible);
onINP(sendToPlausible);
onCLS(sendToPlausible);
onFCP(sendToPlausible);
onTTFB(sendToPlausible);
