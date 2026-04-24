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
import SplitType from 'split-type';

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
        (spec.duration + delay) * 1000 + 50,
      );
      return undefined;
    },
    { margin: '0px 0px -12% 0px' },
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
    // Multiplier 280 (vs 120 avant) — amplitude plus ressentie (feedback Morgan
    // 2026-04-24 : « je ne ressent pas très bien le parallax dans la fluidité »).
    // Factor typique 0.2 → ±56px d'amplitude, 0.4 → ±112px.
    scroll(
      (progress: number) => {
        const offset = (progress - 0.5) * factor * 280;
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      },
      { target: el },
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
          { duration: dur, delay: baseDelay + i * step, ease: EASE_EDITORIAL },
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
 * Split chars reveal — tous les [data-split] ont leurs caractères splittés
 * et animés un par un (yPercent 110 → 0) avec stagger 0.025s, easing expo.inOut,
 * déclenchement à l'entrée viewport. Signature designbyad.com.au / GSAP SplitText.
 *
 * Usage : <h2 data-split>Mon titre</h2>  ou  <p data-split data-split-stagger="0.02">…</p>
 *
 * Options :
 *   - data-split-delay="0.2"     (s, délai avant démarrage)
 *   - data-split-stagger="0.03"  (s, pas entre caractères)
 *   - data-split-duration="1.0"  (s)
 *   - data-split-types="chars"   (chars | words | lines — défaut chars)
 */
function setupSplitReveals(root: ParentNode) {
  const nodes = root.querySelectorAll<HTMLElement>('[data-split]');
  nodes.forEach((el) => {
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = 'true';

    const types = (el.dataset.splitTypes || 'chars') as 'chars' | 'words' | 'lines';
    const stagger = parseFloat(el.dataset.splitStagger || '0.025');

    const split = new SplitType(el, { types });
    const targets = types === 'lines' ? split.lines : types === 'words' ? split.words : split.chars;
    if (!targets || targets.length === 0) return;

    targets.forEach((t) => {
      (t as HTMLElement).style.display = 'inline-block';
      (t as HTMLElement).style.transform = 'translateY(110%)';
      (t as HTMLElement).style.willChange = 'transform';
    });
    if (getComputedStyle(el).overflow === 'visible') {
      el.style.overflow = 'hidden';
      el.style.paddingBottom = '0.1em';
    }

    // Scroll-driven RÉVERSIBLE (feedback Morgan 2026-04-24 : « animations
    // dépendantes du scroll doivent être inversées si on scroll dans l'autre
    // sens »). progress 0 = off-screen → 110% ; progress 0.5+ = à l'écran → 0% ;
    // staggé par index pour effet cascade qui se joue/rejoue au scroll.
    scroll(
      (progress: number) => {
        const count = targets.length;
        targets.forEach((t, i) => {
          const localStart = Math.min(0.5, (i / count) * 0.35);
          const localEnd = Math.min(0.9, localStart + 0.35 + stagger * 1.2);
          const local = Math.max(0, Math.min(1, (progress - localStart) / (localEnd - localStart)));
          const translateY = (1 - local) * 110;
          (t as HTMLElement).style.transform = `translateY(${translateY}%)`;
        });
      },
      { target: el, offset: ['start end', 'end start'] as never },
    );
  });
}

/**
 * Image reveal — wipe clip-path bottom→top sur toute image ou figure qui porte
 * [data-img-reveal] (ou tag <img> dans [data-gallery-auto-reveal]). Signature
 * designbyad.com.au : images qui apparaissent masque-balayé à l'entrée viewport.
 */
function setupImageReveals(root: ParentNode) {
  const nodes = root.querySelectorAll<HTMLElement>('[data-img-reveal]');
  nodes.forEach((el) => {
    if (el.dataset.imgRevealDone) return;
    el.dataset.imgRevealDone = 'true';
    // Scroll-driven RÉVERSIBLE (feedback Morgan 2026-04-24) : clip-path piloté
    // par progress directement. Se referme si on remonte, se rouvre si on
    // redescend — sensation de vie dans toutes les directions.
    el.style.willChange = 'clip-path';
    scroll(
      (progress: number) => {
        const local = Math.max(0, Math.min(1, progress / 0.45));
        const inset = (1 - local) * 100;
        el.style.clipPath = `inset(${inset}% 0 0 0)`;
      },
      { target: el, offset: ['start end', 'end start'] as never },
    );
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
      animate(line, { y: ['110%', '0%'] }, { duration: 1.3, delay: 0.45 + i * 0.18, ease });
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
      { once: true },
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
      { target: container, offset: ['start start', 'end start'] as never },
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
          { duration: dur, delay, ease: EASE_EDITORIAL },
        );
        return undefined;
      },
      { margin: '0px 0px -10% 0px' },
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
    const words = Array.from(container.querySelectorAll<HTMLElement>('[data-quote-word]'));
    if (words.length === 0) return;

    words.forEach((w) => (w.style.opacity = '0.15'));

    // Target la section parent (pas le blockquote, qui est sticky donc
    // son bounding rect ne bouge pas pendant le scroll → progress cassé).
    // Fallback : le container lui-même si pas de section trouvée.
    const section = (container.closest('section') as HTMLElement | null) ?? container;

    scroll(
      (progress: number) => {
        // Section 120vh + sticky 100vh → période sticky : progress 0.45 à 0.55.
        // Fenêtre coloration 0.30 → 0.72 : le début se compose vite, la fin
        // ralentit (feedback Morgan 2026-04-23 : « ralentir légèrement la
        // vitesse de coloriage du texte à la fin »).
        const START = 0.3;
        const END = 0.72;
        const linear = Math.max(0, Math.min(1, (progress - START) / (END - START)));
        // Ease-out quad : se compose plus vite au début, ralentit vers la fin
        const eased = 1 - Math.pow(1 - linear, 1.8);
        const active = eased * words.length;
        words.forEach((w, i) => {
          const local = Math.max(0, Math.min(1, active - i));
          w.style.opacity = String(0.15 + local * 0.85);
        });
      },
      { target: section, offset: ['start end', 'end start'] as never },
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
    const slides = Array.from(section.querySelectorAll<HTMLElement>('[data-scrolly-slide]'));
    const chapters = Array.from(section.querySelectorAll<HTMLElement>('[data-scrolly-chapter]'));
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
      { target: section, offset: ['start start', 'end end'] as never },
    );
  });
}

/**
 * Typologies horizontal scroll — section pin + rail translateX mappé sur scroll
 * vertical. Signature demandée dans le PDF Jonathan l.750.
 * Greffé : CTA suiveur souris par panneau (pattern mp4 référence client).
 *
 * Desktop (≥1024px + hover) uniquement. En dessous, CSS prend le relai :
 * - tablet/mobile : scroll-snap horizontal natif (swipe)
 * - reduce-motion : stack vertical classique
 */
function setupHorizontalTypologies(root: ParentNode) {
  const sections = root.querySelectorAll<HTMLElement>('[data-hscroll-typologies]');
  sections.forEach((section) => {
    if (section.dataset.hscrollDone) return;
    section.dataset.hscrollDone = 'true';

    const rail = section.querySelector<HTMLElement>('[data-hscroll-rail]');
    if (!rail) return;
    const panels = Array.from(rail.querySelectorAll<HTMLElement>('[data-hscroll-panel]'));
    const ticks = Array.from(section.querySelectorAll<HTMLElement>('.htypo-tick'));
    const n = panels.length;
    if (n === 0) return;

    // Guard : desktop + pointer fine uniquement, sinon CSS gère (snap / stack)
    const mq = window.matchMedia('(min-width: 1024px) and (hover: hover)');
    if (!mq.matches) return;

    // Dwell 2026-04-24 (feedback Morgan « scroll horizontal plus lent et plus
    // sticky sur le début et la fin »). On s'arrête 22% au début et 18% à la
    // fin → sensation d'immersion sur le 1er et le dernier panel. Pour
    // ralentir, la section fait aussi 550vh de scroll (CSS) vs 400vh.
    const DWELL_START = 0.22;
    const DWELL_END = 0.18;
    const activeRange = 1 - DWELL_START - DWELL_END;

    // Pré-split chars des noms de typologie pour stagger reveal par panel actif
    const names = panels.map((p) => p.querySelector<HTMLElement>('.htypo-name em'));
    const nameSplits = names.map((el) => {
      if (!el) return null;
      const split = new SplitType(el, { types: 'chars' });
      (split.chars || []).forEach((c) => {
        (c as HTMLElement).style.display = 'inline-block';
        (c as HTMLElement).style.transform = 'translateY(110%)';
        (c as HTMLElement).style.willChange = 'transform';
      });
      el.style.overflow = 'hidden';
      el.style.paddingBottom = '0.1em';
      return split;
    });
    const playedSplits = new Set<number>();

    // Parallax 3 couches (brief Jonathan 2026-04-24 : « parallax multicouche
    // entre le cadre où sont les images, les images à l'intérieur qui bouge
    // en parallax au scroll, les textes aussi qui évoluent en parallax »).
    // Ratios parallax différents par couche pour l'effet profondeur.
    const layers = panels.map((p) => ({
      frame: p.querySelector<HTMLElement>('[data-parallax-layer="frame"]'),
      image: p.querySelector<HTMLElement>('[data-parallax-layer="image"]'),
      text: p.querySelector<HTMLElement>('[data-parallax-layer="text"]'),
    }));

    scroll(
      (progress: number) => {
        // Remap : 0 → reste sur panel 1 ; DWELL_START → commence à translater ;
        // 1 - DWELL_END → atteint le dernier panel ; 1 → reste dessus.
        const eased = Math.max(0, Math.min(1, (progress - DWELL_START) / activeRange));

        const railWidth = rail.scrollWidth;
        const viewportW = window.innerWidth;
        const travel = Math.max(0, railWidth - viewportW);
        const x = -eased * travel;
        rail.style.transform = `translate3d(${x}px, 0, 0)`;

        const activeIndex = Math.min(n - 1, Math.floor(eased * n + 0.0001));

        // Reveal chars du panel actif au premier passage
        if (!playedSplits.has(activeIndex)) {
          playedSplits.add(activeIndex);
          const split = nameSplits[activeIndex];
          const chars = split?.chars;
          if (chars) {
            chars.forEach((c, i) => {
              animate(
                c as HTMLElement,
                { y: ['110%', '0%'] },
                { duration: 0.9, delay: i * 0.02, ease: EASE_EDITORIAL },
              );
            });
          }
        }

        // Pattern designbyad.com.au exact (analyse 2026-04-24) : pour CHAQUE
        // panel, on calcule sa position viewport (bord droit / viewport width)
        // et on translate l'image inverse — elle « reste en place » pendant
        // que le cadre glisse vers la gauche. Amplitude 140px = marge overflow
        // des inner (wider que frame). Les textes bougent à 40% de l'amplitude
        // pour la profondeur stratifiée.
        const vw = window.innerWidth;
        layers.forEach((layer) => {
          if (!layer.frame) return;
          const rect = layer.frame.getBoundingClientRect();
          // posRight : 1 quand frame est entièrement à droite du viewport,
          // 0 quand entièrement à gauche — normalisation [0, 1] clampée.
          const posRight = Math.max(0, Math.min(1, rect.right / vw));
          // Centré : 0.5 quand le cadre est au milieu → offset 0 ; 1 quand à droite → +140px
          // (image en retard, "révèle" le côté droit) ; 0 quand à gauche → -140px.
          const centered = posRight - 0.5;
          const imgShift = centered * 140;
          if (layer.image) {
            layer.image.style.transform = `translate3d(${-imgShift}px, 0, 0)`;
          }
          if (layer.text) {
            layer.text.style.transform = `translate3d(${-imgShift * 0.4}px, 0, 0)`;
          }
        });

        ticks.forEach((tick, i) => {
          tick.classList.toggle('is-active', i === activeIndex);
          tick.classList.toggle('is-passed', i < activeIndex);
        });
      },
      { target: section, offset: ['start start', 'end end'] as never },
    );

    // CTA suiveur souris — une frame ajustée par pointermove + reset au leave
    panels.forEach((panel) => {
      const cta = panel.querySelector<HTMLElement>('[data-cursor-cta]');
      if (!cta) return;
      let rafId = 0;
      let pendingX = 0;
      let pendingY = 0;

      const flush = () => {
        rafId = 0;
        cta.style.translate = `${pendingX}px ${pendingY}px`;
      };

      panel.addEventListener('pointermove', (e) => {
        const rect = panel.getBoundingClientRect();
        pendingX = e.clientX - rect.left;
        pendingY = e.clientY - rect.top;
        if (!rafId) rafId = window.requestAnimationFrame(flush);
      });
    });
  });
}

function enhance(root: ParentNode = document) {
  setupHeroSequence(root);
  setupSplitReveals(root);
  setupImageReveals(root);
  setupStaggers(root);
  setupReveals(root);
  setupMaskReveals(root);
  setupClipReveals(root);
  setupQuoteScroll(root);
  setupScrollytelling(root);
  setupHorizontalTypologies(root);
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
