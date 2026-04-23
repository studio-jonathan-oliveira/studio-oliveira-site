/*
 * Motion enhance — polish visuel transversal, vanilla Motion.
 *
 * Attributs data-* :
 *   - data-reveal="up|fade|slide-left|slow"   → reveal scroll-triggered
 *   - data-reveal-stagger                      → stagger auto des enfants directs
 *   - data-reveal-delay="0.3"                  → delay custom (s)
 *   - data-magnetic                            → aimant curseur (CTA)
 *   - data-parallax="0.2"                      → parallax scroll vertical
 *   - data-mask-reveal                         → conteneur masque : enfants [data-mask-line] y 110%→0%
 *   - data-hero-sequence                       → séquence cinématique hero
 *   - data-hero-zoom                           → image hero pilotée scroll : scale + dim
 *
 * ⚠️ Bypass prefers-reduced-motion explicite (demande Morgan 2026-04-22).
 * À réintégrer en Phase 6 audit accessibilité.
 *
 * Implémentation Motion : on pilote via props individuelles (y, x, opacity)
 * plutôt que `transform` string pour éviter les conflits d'unités (% vs px).
 */

import { animate, inView, scroll } from 'motion';

const EASE_EDITORIAL: [number, number, number, number] = [0.16, 1, 0.3, 1];

type RevealVariant = 'up' | 'fade' | 'slide-left' | 'slow';

interface RevealSpec {
  from: Record<string, number | string>;
  to: Record<string, number | string>;
  duration: number;
}

const REVEALS: Record<RevealVariant, RevealSpec> = {
  up: {
    from: { opacity: 0, y: 56 },
    to: { opacity: 1, y: 0 },
    duration: 1.2,
  },
  fade: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: 1.3,
  },
  'slide-left': {
    from: { opacity: 0, x: -56 },
    to: { opacity: 1, x: 0 },
    duration: 1.2,
  },
  slow: {
    from: { opacity: 0, y: 80 },
    to: { opacity: 1, y: 0 },
    duration: 1.6,
  },
};

function applyInitial(el: HTMLElement, from: Record<string, number | string>) {
  // État initial inline pour éviter tout flash entre rendu HTML et animation
  if ('opacity' in from) el.style.opacity = String(from.opacity);
  if ('y' in from) el.style.transform = `translateY(${from.y}px)`;
  if ('x' in from) el.style.transform = `translateX(${from.x}px)`;
}

function setupReveal(el: HTMLElement, variant: RevealVariant, delay = 0) {
  const spec = REVEALS[variant];
  applyInitial(el, spec.from);
  el.style.willChange = 'transform, opacity';

  inView(
    el,
    () => {
      animate(el, spec.to, {
        duration: spec.duration,
        delay,
        ease: EASE_EDITORIAL,
      });
      window.setTimeout(
        () => {
          el.style.willChange = 'auto';
        },
        (spec.duration + delay) * 1000 + 50
      );
      return undefined;
    },
    { margin: '0px 0px -12% 0px' }
  );
}

function setupReveals(root: ParentNode) {
  const nodes = root.querySelectorAll<HTMLElement>('[data-reveal]');
  nodes.forEach((el) => {
    if (el.dataset.revealDone) return;
    if (el.hasAttribute('data-reveal-stagger')) return;
    el.dataset.revealDone = 'true';
    const variant = (el.dataset.reveal || 'up') as RevealVariant;
    const customDelay = parseFloat(el.dataset.revealDelay || '0');
    setupReveal(el, variant, Number.isFinite(customDelay) ? customDelay : 0);
  });
}

function setupStaggers(root: ParentNode) {
  const groups = root.querySelectorAll<HTMLElement>('[data-reveal-stagger]');
  groups.forEach((group) => {
    if (group.dataset.staggerDone) return;
    group.dataset.staggerDone = 'true';
    const step = parseFloat(group.dataset.revealStagger || '0.1');
    const baseDelay = parseFloat(group.dataset.revealDelay || '0');
    const variant = (group.dataset.reveal || 'up') as RevealVariant;
    const children = Array.from(group.children) as HTMLElement[];
    children.forEach((child, i) => {
      if (child.hasAttribute('data-reveal')) return;
      child.dataset.revealDone = 'true';
      setupReveal(child, variant, baseDelay + i * step);
    });
  });
}

function setupMagnetic(root: ParentNode) {
  const magnets = root.querySelectorAll<HTMLElement>('[data-magnetic]');
  magnets.forEach((el) => {
    if (el.dataset.magneticDone) return;
    el.dataset.magneticDone = 'true';
    const strength = parseFloat(el.dataset.magnetic || '0.35');

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
  });
}

function setupParallax(root: ParentNode) {
  const layers = root.querySelectorAll<HTMLElement>('[data-parallax]');
  layers.forEach((el) => {
    if (el.dataset.parallaxDone) return;
    el.dataset.parallaxDone = 'true';
    const factor = parseFloat(el.dataset.parallax || '0.2');
    scroll(
      (progress: number) => {
        const offset = (progress - 0.5) * factor * 120;
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      },
      { target: el }
    );
  });
}

/**
 * Mask-reveal — un conteneur [data-mask-reveal] dont les enfants [data-mask-line]
 * sont clippés (overflow hidden côté CSS) puis translateY 110% → 0 avec stagger.
 * Signature typo façon 9to5studio / shed.design.
 */
function setupMaskReveals(root: ParentNode) {
  const groups = root.querySelectorAll<HTMLElement>('[data-mask-reveal]');
  groups.forEach((group) => {
    if (group.dataset.maskDone) return;
    group.dataset.maskDone = 'true';
    const step = parseFloat(group.dataset.maskStagger || '0.1');
    const baseDelay = parseFloat(group.dataset.maskDelay || '0');
    const dur = parseFloat(group.dataset.maskDuration || '1.2');
    const trigger = group.dataset.maskTrigger ?? 'auto';

    const lines = group.querySelectorAll<HTMLElement>('[data-mask-line]');
    lines.forEach((line) => {
      line.style.transform = 'translateY(110%)';
      line.style.willChange = 'transform';
    });

    const play = () => {
      lines.forEach((line, i) => {
        animate(
          line,
          { y: ['110%', '0%'] },
          { duration: dur, delay: baseDelay + i * step, ease: EASE_EDITORIAL }
        );
      });
    };

    if (trigger === 'now') {
      play();
    } else {
      inView(group, () => {
        play();
        return undefined;
      });
    }
  });
}

/**
 * Hero sequence — piloté depuis Motion. Les lignes H1 utilisent le mask-reveal
 * dédié (data-mask-line) : animation from='110%' to='0%' en %.
 */
function setupHeroSequence(root: ParentNode) {
  const hero = root.querySelector<HTMLElement>('[data-hero-sequence]');
  if (!hero || hero.dataset.heroDone === 'true') return;
  hero.dataset.heroDone = 'true';

  const eyebrow = hero.querySelector<HTMLElement>('[data-hero="eyebrow"]');
  const manifesto = hero.querySelector<HTMLElement>('[data-hero="manifesto"]');
  const cta = hero.querySelector<HTMLElement>('[data-hero="cta"]');
  const cue = hero.querySelector<HTMLElement>('[data-hero="cue"]');
  const maskLines = hero.querySelectorAll<HTMLElement>('[data-hero-mask] [data-mask-line]');

  const softs = [eyebrow, manifesto, cta, cue].filter((x): x is HTMLElement => !!x);
  softs.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.willChange = 'transform, opacity';
  });
  maskLines.forEach((line) => {
    line.style.transform = 'translateY(110%)';
    line.style.willChange = 'transform';
  });

  const ease = EASE_EDITORIAL;
  const appear = (el: HTMLElement, delay: number, dur = 1.1) =>
    animate(el, { opacity: 1, y: 0 }, { duration: dur, delay, ease });

  const play = () => {
    if (eyebrow) appear(eyebrow, 0.2, 0.9);
    maskLines.forEach((line, i) => {
      animate(
        line,
        { y: ['110%', '0%'] },
        { duration: 1.3, delay: 0.45 + i * 0.18, ease }
      );
    });
    if (manifesto) appear(manifesto, 1.0, 1.1);
    if (cta) appear(cta, 1.25, 1);
    if (cue) appear(cue, 1.55, 0.9);
  };

  // Si l'IntroBumper est présent, on attend son signal pour jouer pile pendant la révélation.
  const bumper = document.getElementById('intro-bumper');
  if (bumper) {
    // Fallback safety : si intro:done n'arrive jamais, on joue après 8s
    const timeoutId = window.setTimeout(play, 8000);
    document.addEventListener(
      'intro:done',
      () => {
        window.clearTimeout(timeoutId);
        play();
      },
      { once: true }
    );
  } else {
    play();
  }
}

/**
 * Hero zoom — scroll-driven sur la sortie haute du viewport.
 */
function setupHeroZoom(root: ParentNode) {
  const zooms = root.querySelectorAll<HTMLElement>('[data-hero-zoom]');
  zooms.forEach((el) => {
    if (el.dataset.heroZoomDone) return;
    el.dataset.heroZoomDone = 'true';
    const container = el.parentElement as HTMLElement | null;
    if (!container) return;

    scroll(
      (progress: number) => {
        const scale = 1 + progress * 0.22;
        const translate = progress * -40;
        const brightness = 1 - progress * 0.45;
        const blur = progress * 6;
        el.style.transform = `translate3d(0, ${translate}px, 0) scale(${scale})`;
        el.style.filter = `brightness(${brightness}) blur(${blur}px)`;
      },
      { target: container, offset: ['start start', 'end start'] as never }
    );
  });
}

/**
 * Clip-reveal — un élément dont le contenu est masqué par clip-path inset(100% 0 0 0)
 * (wipe top→bottom) se dévoile à l'inView. Usage : images, cartes, blocs visuels.
 */
function setupClipReveals(root: ParentNode) {
  const nodes = root.querySelectorAll<HTMLElement>('[data-clip-reveal]');
  nodes.forEach((el) => {
    if (el.dataset.clipDone) return;
    el.dataset.clipDone = 'true';
    const dur = parseFloat(el.dataset.clipDuration || '1.4');
    const delay = parseFloat(el.dataset.clipDelay || '0');
    const direction = el.dataset.clipReveal || 'top'; // top | left | bottom | right
    const fromMap: Record<string, string> = {
      top: 'inset(100% 0 0 0)',
      bottom: 'inset(0 0 100% 0)',
      left: 'inset(0 100% 0 0)',
      right: 'inset(0 0 0 100%)',
    };
    const fromClip: string = fromMap[direction] ?? 'inset(100% 0 0 0)';
    el.style.clipPath = fromClip;
    el.style.willChange = 'clip-path';

    inView(
      el,
      () => {
        animate(
          el,
          { clipPath: [fromClip, 'inset(0 0 0 0)'] },
          { duration: dur, delay, ease: EASE_EDITORIAL }
        );
        return undefined;
      },
      { margin: '0px 0px -10% 0px' }
    );
  });
}

/**
 * Quote scroll — chaque [data-quote-word] enfant d'un [data-quote-scroll] a son
 * opacité modulée par la progression scroll de la section. Effet "phrase qui se
 * compose au scroll" — signature springs.estate / shed.design.
 */
function setupQuoteScroll(root: ParentNode) {
  const quotes = root.querySelectorAll<HTMLElement>('[data-quote-scroll]');
  quotes.forEach((container) => {
    if (container.dataset.quoteDone) return;
    container.dataset.quoteDone = 'true';
    const words = Array.from(
      container.querySelectorAll<HTMLElement>('[data-quote-word]')
    );
    if (words.length === 0) return;

    words.forEach((w) => (w.style.opacity = '0.15'));

    scroll(
      (progress: number) => {
        // Compression : la phrase se compose entre 15% et 75% du scroll de la section.
        const eased = Math.max(0, Math.min(1, (progress - 0.15) / 0.6));
        const active = eased * words.length;
        words.forEach((w, i) => {
          const local = Math.max(0, Math.min(1, active - i));
          w.style.opacity = String(0.15 + local * 0.85);
        });
      },
      { target: container, offset: ['start end', 'end start'] as never }
    );
  });
}

/**
 * Scrollytelling vertical — section longue avec stage sticky intérieur.
 * Plusieurs [data-scrolly-slide] sont crossfade pilotés au scroll, chaque slide
 * zoom légèrement scale(1→1.1) pendant sa phase active. Les [data-scrolly-chapter]
 * associés (même index) s'affichent en parallèle.
 */
function setupScrollytelling(root: ParentNode) {
  const sections = root.querySelectorAll<HTMLElement>('[data-scrolly]');
  sections.forEach((section) => {
    if (section.dataset.scrollyDone) return;
    section.dataset.scrollyDone = 'true';
    const slides = Array.from(
      section.querySelectorAll<HTMLElement>('[data-scrolly-slide]')
    );
    const chapters = Array.from(
      section.querySelectorAll<HTMLElement>('[data-scrolly-chapter]')
    );
    const ticks = Array.from(section.querySelectorAll<HTMLElement>('.scrolly-tick'));
    const n = slides.length;
    if (n === 0) return;

    // État initial
    slides.forEach((s, i) => {
      s.style.opacity = i === 0 ? '1' : '0';
      s.style.transform = 'scale(1)';
      s.style.willChange = 'opacity, transform';
    });
    chapters.forEach((c, i) => {
      c.style.opacity = i === 0 ? '1' : '0';
      c.style.transform = i === 0 ? 'translateY(0px)' : 'translateY(30px)';
      c.style.willChange = 'opacity, transform';
    });

    scroll(
      (progress: number) => {
        // Progress global → position [0, n] dans les slides
        const eased = Math.max(0, Math.min(1, progress));
        const activeFloat = eased * n;
        const activeIndex = Math.min(n - 1, Math.floor(activeFloat));
        const localProgress = activeFloat - activeIndex; // 0→1 dans le slide actif

        slides.forEach((slide, i) => {
          if (i === activeIndex) {
            // Slide actif : opacity 1, zoom progressif 1 → 1.1
            slide.style.opacity = '1';
            slide.style.transform = `scale(${1 + localProgress * 0.1})`;
          } else if (i === activeIndex - 1) {
            // Slide précédent : fade out rapide (crossfade)
            slide.style.opacity = String(Math.max(0, 1 - localProgress * 3));
            slide.style.transform = `scale(${1.1 + localProgress * 0.05})`;
          } else {
            slide.style.opacity = '0';
          }
        });

        chapters.forEach((chapter, i) => {
          if (i === activeIndex) {
            const textLocal = Math.min(1, localProgress * 2.5);
            chapter.style.opacity = String(textLocal);
            chapter.style.transform = `translateY(${(1 - textLocal) * 30}px)`;
          } else if (i === activeIndex - 1) {
            const fading = Math.max(0, 1 - localProgress * 3);
            chapter.style.opacity = String(fading);
          } else {
            chapter.style.opacity = '0';
            chapter.style.transform = 'translateY(30px)';
          }
        });

        ticks.forEach((tick, i) => {
          if (i <= activeIndex) {
            tick.style.width = i === activeIndex ? '56px' : '28px';
            tick.style.opacity = i === activeIndex ? '1' : '0.8';
          } else {
            tick.style.width = '28px';
            tick.style.opacity = '0.3';
          }
        });
      },
      { target: section, offset: ['start start', 'end end'] as never }
    );
  });
}

function enhance(root: ParentNode = document) {
  setupHeroSequence(root);
  setupStaggers(root);
  setupReveals(root);
  setupMaskReveals(root);
  setupClipReveals(root);
  setupQuoteScroll(root);
  setupScrollytelling(root);
  setupMagnetic(root);
  setupParallax(root);
  setupHeroZoom(root);
}

function init() {
  enhance(document);
  document.addEventListener('astro:page-load', () => enhance(document));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
