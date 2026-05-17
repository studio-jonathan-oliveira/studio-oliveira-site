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

/*
 * Optims mobile uniquement (Morgan 2026-05-17) — sur desktop on garde le
 * comportement historique (callbacks directs, will-change permanent). Sur
 * mobile / tablette tactile on rAF-throttle les callbacks scroll et on
 * toggle le will-change au viewport pour ne pas saturer le compositeur
 * iPhone (ProMotion 120Hz × N writes par frame → jank).
 *
 * Détection : pointer coarse (touch) OU viewport < 1024px. On évalue à
 * l'init et sur resize via matchMedia.
 */
const MOBILE_MQ = '(pointer: coarse), (max-width: 1023px)';
let IS_MOBILE = typeof window !== 'undefined' ? window.matchMedia(MOBILE_MQ).matches : false;
if (typeof window !== 'undefined') {
  window.matchMedia(MOBILE_MQ).addEventListener('change', (e) => {
    IS_MOBILE = e.matches;
  });
}

/*
 * rAF-batched scroll callback — Motion `scroll()` invoque le callback à chaque
 * scroll event (iPhone ProMotion : jusqu'à 120Hz). Quand le callback écrit
 * dans le DOM (style.transform sur plusieurs nodes), ça sature le compositeur
 * mobile. On garde uniquement le dernier progress reçu et on flush à la frame
 * suivante. Sur desktop : passthrough, callback direct (comportement original).
 */
function rafThrottle(cb: (progress: number) => void): (progress: number) => void {
  if (!IS_MOBILE) return cb;
  let pending = false;
  let last = 0;
  return (progress: number) => {
    last = progress;
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      cb(last);
    });
  };
}

/*
 * Toggle `will-change` au passage dans le viewport. Poser `will-change` en
 * permanence sur des dizaines de nodes (words, chars) sature la mémoire GPU
 * iPhone : chaque node devient une couche composée même hors-écran.
 * Sur desktop : pose `will-change` une seule fois (comportement original).
 */
function toggleWillChange(host: HTMLElement, nodes: HTMLElement[], value: string) {
  if (!IS_MOBILE) {
    nodes.forEach((n) => {
      n.style.willChange = value;
    });
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.some((e) => e.isIntersecting);
      const next = visible ? value : 'auto';
      nodes.forEach((n) => {
        n.style.willChange = next;
      });
    },
    { rootMargin: '200px 0px 200px 0px' },
  );
  observer.observe(host);
}

type RevealVariant = 'up' | 'fade' | 'slide-left' | 'slow' | 'image-rise';

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
  // Pattern designbyad (videos scroll_home + scroll_projet) : les images
  // entrent de façon cinématique avec mask clip-path + translate + scale.
  // L'effet « monte d'en bas comme si elle venait d'ailleurs » (brief Morgan).
  // Combiné avec un wrapper [data-rise-mask] pour le clip CSS (cf global.css).
  'image-rise': {
    from: { opacity: 0, y: 120, scale: 1.08 },
    to: { opacity: 1, y: 0, scale: 1 },
    duration: 1.8,
  },
};

function applyInitial(el: HTMLElement, from: Record<string, number | string>) {
  // État initial inline pour éviter tout flash entre rendu HTML et animation
  if ('opacity' in from) el.style.opacity = String(from.opacity);
  // Compose translate + scale (image-rise utilise les trois axes)
  const parts: string[] = [];
  if ('y' in from) parts.push(`translateY(${from.y}px)`);
  if ('x' in from) parts.push(`translateX(${from.x}px)`);
  if ('scale' in from) parts.push(`scale(${from.scale})`);
  if (parts.length) el.style.transform = parts.join(' ');
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
    // Multiplier 520 (vs 280 avant) — Morgan 2026-04-25 : « casser les codes,
    // super vivant et fluide ». Factor typique 0.2 → ±104px d'amplitude,
    // 0.4 → ±208px. Sections concernées sont overflow-hidden.
    scroll(
      rafThrottle((progress: number) => {
        const offset = (progress - 0.5) * factor * 520;
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      }),
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

    const split = new SplitType(el, { types });
    const targets = types === 'lines' ? split.lines : types === 'words' ? split.words : split.chars;
    if (!targets || targets.length === 0) return;

    const targetEls = targets.map((t) => t as HTMLElement);
    targetEls.forEach((t) => {
      t.style.display = 'inline-block';
      t.style.transform = 'translateY(110%)';
    });
    if (getComputedStyle(el).overflow === 'visible') {
      el.style.overflow = 'hidden';
      el.style.paddingBottom = '0.1em';
    }
    toggleWillChange(el, targetEls, 'transform');

    // Scroll-driven RÉVERSIBLE (feedback Morgan 2026-04-24).
    // Window compacte 0.15 → 0.35 : les textes se révèlent dès que le target
    // entre dans le viewport (évite « il faut scroll beaucoup pour les voir
    // s'afficher entier, sinon ils tombent »). Stagger court entre targets.
    scroll(
      rafThrottle((progress: number) => {
        const count = targetEls.length;
        targetEls.forEach((t, i) => {
          const localStart = 0.15 + (i / Math.max(count, 1)) * 0.08;
          const localEnd = localStart + 0.18;
          const local = Math.max(0, Math.min(1, (progress - localStart) / (localEnd - localStart)));
          const translateY = (1 - local) * 110;
          t.style.transform = `translateY(${translateY}%)`;
        });
      }),
      { target: el, offset: ['start end', 'end start'] as never },
    );
  });
}

/**
 * Justified spread — signature designbyad.com.au (vidéo scroll_home.mp4
 * frame 3+5) : un bloc texte est groupé à gauche au début, puis ses mots
 * s'ÉCARTENT vers leur position justify pleine-largeur au fil du scroll.
 * Effet "le bloc s'étire en se calant aux bords" — pas d'oscillation,
 * juste un spread directionnel.
 *
 * Mécanique : on mesure la position justify naturelle (offsetLeft de chaque
 * .word), puis on remap vers la position "left-aligned compact" en
 * appliquant un translateX inverse proportionnel à (1 - progress). Quand
 * progress=1, plus aucun translate → mots à leur place justify natif.
 *
 * Usage : <p data-justify-scroll>Mots ici</p>
 *
 * Options :
 *   - data-justify-amp="0.6"  (intensité du regroupement initial, 0→1, default 0.7)
 */
function setupJustifiedScroll(root: ParentNode) {
  const nodes = root.querySelectorAll<HTMLElement>('[data-justify-scroll]');
  nodes.forEach((el) => {
    if (el.dataset.justifyDone) return;
    el.dataset.justifyDone = 'true';

    // data-justify-amp historique en px (10-32) → on remappe en intensité 0-1.
    // Les anciennes valeurs px sont écrasées par data-justify-spread si fourni.
    const rawAmp = parseFloat(el.dataset.justifySpread || el.dataset.justifyAmp || '20');
    // Si valeur > 1, on suppose ancien format px → ratio (px/40 cap 0.95)
    const intensity = rawAmp > 1 ? Math.min(0.95, rawAmp / 40) : Math.min(0.95, rawAmp);
    // Window custom : data-justify-window="0.0,0.45" (start,end progress)
    // → spread atteint l'état final à 45% du scroll au lieu de 75%.
    // Default = "0.1,0.75" (spread déployé tranquillement).
    const winAttr = el.dataset.justifyWindow || '0.1,0.75';
    const winParts = winAttr.split(',').map((s) => parseFloat(s.trim()));
    const wStart = Number.isFinite(winParts[0]) ? (winParts[0] as number) : 0.1;
    const wEnd = Number.isFinite(winParts[1]) ? (winParts[1] as number) : 0.75;

    if (getComputedStyle(el).textAlign !== 'justify') {
      el.style.textAlign = 'justify';
    }

    const split = new SplitType(el, { types: 'words' });
    const words = split.words as HTMLElement[] | null;
    if (!words || words.length < 3) return;

    words.forEach((w) => {
      w.style.display = 'inline-block';
      // Empêche le navigateur de couper un mot à un hyphen littéral
      // (ex: "sur-mesure", "micro-urbain") — feedback Morgan 2026-04-27.
      w.style.whiteSpace = 'nowrap';
    });
    toggleWillChange(el, words, 'transform');

    // Mesure des positions justify naturelles (état final).
    // On laisse le navigateur calculer la justify, puis on capture par mot.
    let justifyLefts: number[] = [];
    let leftLefts: number[] = [];

    function measure() {
      // Capture justify
      el.style.textAlignLast = 'justify';
      justifyLefts = words!.map((w) => w.offsetLeft);
      // Capture left-aligned (text-align left temporairement via word-spacing 0)
      // On simule un "compact left" en collant les mots avec word-spacing 0
      // mais ça ne marche pas vraiment — solution : mesurer en text-align left.
      const prevAlign = el.style.textAlign;
      const prevLast = el.style.textAlignLast;
      el.style.textAlign = 'left';
      el.style.textAlignLast = 'left';
      // Force reflow
      void el.offsetHeight;
      leftLefts = words!.map((w) => w.offsetLeft);
      el.style.textAlign = prevAlign || 'justify';
      el.style.textAlignLast = prevLast || 'justify';
      void el.offsetHeight;
    }

    measure();
    // Re-measure une fois les fonts custom (Inter Variable, Gloock) chargées —
    // sinon les mesures initiales sont basées sur la fallback system-ui et
    // le translate inverse devient incorrect quand la vraie fonte arrive.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => measure());
    }

    // Re-measure on resize (debounced)
    let resizeT = 0;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeT);
      resizeT = window.setTimeout(measure, 200);
    });

    scroll(
      rafThrottle((progress: number) => {
        // Window paramétrable via data-justify-window (default 0.1 → 0.75).
        const t = Math.max(0, Math.min(1, (progress - wStart) / Math.max(0.01, wEnd - wStart)));
        const closure = (1 - t) * intensity;
        words.forEach((w, i) => {
          const dx = (leftLefts[i] ?? 0) - (justifyLefts[i] ?? 0);
          // Plus on est tôt dans le scroll, plus on tire vers la position
          // left-aligned (compact, gauche). En fin de scroll, plus de translate.
          w.style.transform = `translate3d(${dx * closure}px, 0, 0)`;
        });
      }),
      { target: el, offset: ['start end', 'end start'] as never },
    );
  });
}

/**
 * Justify multi-line — variante de setupJustifiedScroll pour un BLOC composé
 * de plusieurs lignes indépendantes qui s'animent EN CASCADE selon le scroll
 * d'un target externe (utile quand le bloc lui-même est dans un sticky parent).
 *
 * Usage :
 *   <blockquote data-justify-multi data-justify-target=".pull-quote-section">
 *     <p data-justify-line>LIGNE 1</p>
 *     <p data-justify-line>LIGNE 2</p>
 *   </blockquote>
 *
 * Options :
 *   - data-justify-target="..."        sélecteur du parent scroll (défaut : el)
 *   - data-justify-amp="55"            intensité (1-100, default 55)
 *   - data-justify-line-step="0.12"    décalage de window entre lignes
 *   - data-justify-line-window="0.3"   taille de window par ligne
 *
 * Easing cubic-out → mouvement smooth, jamais brutal (Morgan 2026-04-28).
 */
function setupJustifyMulti(root: ParentNode) {
  const groups = root.querySelectorAll<HTMLElement>('[data-justify-multi]');
  groups.forEach((group) => {
    if (group.dataset.justifyMultiDone) return;
    group.dataset.justifyMultiDone = 'true';

    const targetSel = group.dataset.justifyTarget;
    const target = targetSel ? document.querySelector<HTMLElement>(targetSel) : group;
    if (!target) return;

    const lines = Array.from(group.querySelectorAll<HTMLElement>('[data-justify-line]'));
    if (lines.length === 0) return;

    /*
     * Mobile fallback (Morgan 2026-05-17 : lag scroll iPhone même avec rAF
     * throttle) — l'effet spread écrit `style.transform` sur ~20 mots à
     * chaque frame de scroll, ce qui sature le compositeur iPhone même
     * après les optims précédentes. Sur mobile on bascule sur un simple
     * fade-in à l'entrée viewport, one-shot, aucun calcul pendant le scroll.
     * Le texte arrive directement en position justify finale avec un
     * fondu propre — le rendu final est identique, seul l'effet « spread »
     * en cours de scroll est sacrifié. Desktop intact.
     */
    if (IS_MOBILE) {
      lines.forEach((line, i) => {
        line.style.opacity = '0';
        line.style.transform = 'translateY(12px)';
        line.style.transition =
          'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
        line.style.transitionDelay = `${i * 0.08}s`;
      });
      inView(
        group,
        () => {
          lines.forEach((line) => {
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
          });
          return undefined;
        },
        { margin: '0px 0px -10% 0px' },
      );
      return;
    }

    const rawAmp = parseFloat(group.dataset.justifyAmp || '55');
    const intensity = rawAmp > 1 ? Math.min(0.85, rawAmp / 65) : Math.min(0.85, rawAmp);
    const lineStep = parseFloat(group.dataset.justifyLineStep || '0.12');
    const lineWindow = parseFloat(group.dataset.justifyLineWindow || '0.3');

    /*
     * Direction par ligne (refonte 2026-04-30 IDENTITÉ Jonathan) :
     *   data-justify-direction="from-left"  → mots compactés à gauche au début,
     *                                         dernier mot s'écarte vers la droite.
     *   data-justify-direction="from-right" → mots compactés à droite au début,
     *                                         premier mot s'écarte vers la gauche.
     *   défaut : from-left (comportement historique).
     */
    type Direction = 'from-left' | 'from-right';
    interface LineData {
      words: HTMLElement[];
      justifyLefts: number[];
      compactLefts: number[];
      direction: Direction;
      measure: () => void;
    }

    const linesData: LineData[] = lines.map((line) => {
      if (getComputedStyle(line).textAlign !== 'justify') {
        line.style.textAlign = 'justify';
      }
      const split = new SplitType(line, { types: 'words' });
      const words = (split.words as HTMLElement[] | null) || [];
      words.forEach((w) => {
        w.style.display = 'inline-block';
        w.style.whiteSpace = 'nowrap';
      });
      toggleWillChange(line, words, 'transform');

      const direction: Direction =
        line.dataset.justifyDirection === 'from-right' ? 'from-right' : 'from-left';

      const data: LineData = {
        words,
        justifyLefts: [],
        compactLefts: [],
        direction,
        measure: () => {},
      };

      data.measure = () => {
        // Mesure justify (final)
        line.style.textAlignLast = 'justify';
        void line.offsetHeight;
        data.justifyLefts = words.map((w) => w.offsetLeft);

        // Mesure compact selon direction (initial avant scroll)
        const prevAlign = line.style.textAlign;
        const prevLast = line.style.textAlignLast;
        const compact = direction === 'from-right' ? 'right' : 'left';
        line.style.textAlign = compact;
        line.style.textAlignLast = compact;
        void line.offsetHeight;
        data.compactLefts = words.map((w) => w.offsetLeft);
        line.style.textAlign = prevAlign || 'justify';
        line.style.textAlignLast = prevLast || 'justify';
        void line.offsetHeight;
      };

      data.measure();
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => data.measure());
      }
      return data;
    });

    let resizeT = 0;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeT);
      resizeT = window.setTimeout(() => linesData.forEach((d) => d.measure()), 200);
    });

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    scroll(
      rafThrottle((progress: number) => {
        linesData.forEach(({ words, justifyLefts, compactLefts }, idx) => {
          const wStart = idx * lineStep;
          const wEnd = wStart + lineWindow;
          const t = Math.max(0, Math.min(1, (progress - wStart) / Math.max(0.01, wEnd - wStart)));
          const eased = easeOutCubic(t);
          const closure = (1 - eased) * intensity;
          words.forEach((w, i) => {
            const dx = (compactLefts[i] ?? 0) - (justifyLefts[i] ?? 0);
            w.style.transform = `translate3d(${dx * closure}px, 0, 0)`;
          });
        });
      }),
      { target: target, offset: ['start end', 'end start'] as never },
    );
  });
}

/**
 * Char drift — variante char-by-char de data-justify-scroll. Chaque LETTRE
 * d'un mot oscille indépendamment autour de sa position naturelle pendant
 * le scroll. Utilisé sur le H1 hero "paysagiste" en Gloock italic — sensation
 * de typographie vivante, pas figée. Première et dernière lettre ancrées
 * pour préserver la silhouette du mot.
 *
 * Usage : <span data-char-drift data-char-drift-amp="14">paysagiste</span>
 */
function setupCharDrift(root: ParentNode) {
  const nodes = root.querySelectorAll<HTMLElement>('[data-char-drift]');
  nodes.forEach((el) => {
    if (el.dataset.charDriftDone) return;
    el.dataset.charDriftDone = 'true';

    const ampX = parseFloat(el.dataset.charDriftAmp || '12');
    const ampY = parseFloat(el.dataset.charDriftAmpY || '8');
    const seed = parseInt(el.dataset.charDriftSeed || '23', 10);

    const split = new SplitType(el, { types: 'chars' });
    const chars = split.chars;
    if (!chars || chars.length < 3) return;

    function mulberry32(a: number) {
      return () => {
        let t = (a += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }
    const rng = mulberry32(seed);
    const offsetsX = chars.map(() => (rng() - 0.5) * 2);
    const offsetsY = chars.map(() => (rng() - 0.5) * 2);
    const phases = chars.map(() => rng() * 0.5);

    const charEls = chars.map((c) => c as HTMLElement);
    charEls.forEach((c) => {
      c.style.display = 'inline-block';
    });
    toggleWillChange(el, charEls, 'transform');

    scroll(
      rafThrottle((progress: number) => {
        charEls.forEach((c, i) => {
          if (i === 0 || i === charEls.length - 1) {
            c.style.transform = '';
            return;
          }
          const phase = phases[i] ?? 0;
          const t = Math.max(0, Math.min(1, (progress - 0.05 + phase * 0.3) / 0.85));
          const eased = Math.sin(t * Math.PI);
          const ox = offsetsX[i] ?? 0;
          const oy = offsetsY[i] ?? 0;
          c.style.transform = `translate3d(${eased * ampX * ox}px, ${eased * ampY * oy}px, 0)`;
        });
      }),
      { target: el, offset: ['start end', 'end start'] as never },
    );
  });
}

/**
 * Scroll rise — pattern designbyad (vidéo scroll_home.mp4) : un élément se
 * déplace continuellement vers le haut pendant sa traversée du viewport
 * (translate Y de +amp à -amp). Sensation que l'image « monte plus tôt que
 * le scroll » et continue à monter après → dynamisme constant.
 *
 * Distinct de data-parallax (générique avec compose 0.5 baseline) : ici
 * amplitude pure et symétrique, pensé pour images cinématiques.
 *
 * Usage : <figure data-scroll-rise data-scroll-rise-amp="80">
 * Combinable avec data-reveal="image-rise" sur <img> enfant.
 */
function setupScrollRise(root: ParentNode) {
  const nodes = root.querySelectorAll<HTMLElement>('[data-scroll-rise]');
  nodes.forEach((el) => {
    if (el.dataset.scrollRiseDone) return;
    el.dataset.scrollRiseDone = 'true';
    const amp = parseFloat(el.dataset.scrollRiseAmp || '80');
    toggleWillChange(el, [el], 'transform');
    scroll(
      rafThrottle((progress: number) => {
        // progress 0 = bord bas viewport touche haut élément ;
        // progress 1 = bord haut viewport touche bas élément.
        // y = (1 - 2*p) * amp : +amp → -amp au passage = monte plus vite
        // que le scroll, l'image quitte le viewport plus tôt que prévu.
        const y = (1 - 2 * progress) * amp;
        el.style.transform = `translate3d(0, ${y}px, 0)`;
      }),
      { target: el, offset: ['start end', 'end start'] as never },
    );
  });
}

/**
 * Horizontal wheel — sur un container [data-wheel-horizontal] avec overflow-x:auto,
 * convertit le scroll vertical de la souris en scroll horizontal natif.
 * Les trackpads horizontaux passent à travers (deltaX déjà non-nul).
 * Désactive sur touch / reduce-motion (pas besoin, swipe natif marche).
 */
function setupWheelHorizontal(root: ParentNode) {
  const rails = root.querySelectorAll<HTMLElement>('[data-wheel-horizontal]');
  rails.forEach((rail) => {
    if (rail.dataset.wheelHorizDone) return;
    rail.dataset.wheelHorizDone = 'true';
    if (!window.matchMedia('(hover: hover)').matches) return;

    rail.addEventListener(
      'wheel',
      (e: WheelEvent) => {
        // Si l'utilisateur fait du wheel vertical (deltaY dominant), on
        // convertit en horizontal. Si trackpad horizontal (deltaX != 0),
        // on laisse le natif.
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
        // Bord gauche + scroll vers le haut, ou bord droit + scroll vers le bas
        // → laisser passer pour ne pas piéger le scroll de page.
        const atStart = rail.scrollLeft <= 0 && e.deltaY < 0;
        const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 1 && e.deltaY > 0;
        if (atStart || atEnd) return;
        e.preventDefault();
        rail.scrollBy({ left: e.deltaY, behavior: 'auto' });
      },
      { passive: false },
    );
  });
}

/**
 * Image reveal — pattern designbyad.com.au (vidéo scroll_home f_007→f_009) :
 * l'image se "déroule du haut" plus vite que le scroll. Quand l'image entre
 * en bas du viewport, son clip-path inset(100% 0 0 0) s'ouvre vers 0%
 * sur une fenêtre courte (progress / 0.32) → l'image est ENTIÈREMENT visible
 * bien avant d'avoir atteint le centre du viewport. Sensation "elle arrive
 * plus vite que le scroll".
 *
 * Réversible : se referme si on remonte. Easing ease-out pour atteindre vite
 * l'état révélé puis ralentir.
 *
 * Le wrapper doit avoir overflow:hidden pour que le clip soit visible.
 */
function setupImageReveals(root: ParentNode) {
  const nodes = root.querySelectorAll<HTMLElement>('[data-img-reveal]');
  nodes.forEach((el) => {
    if (el.dataset.imgRevealDone) return;
    el.dataset.imgRevealDone = 'true';
    // Threshold custom possible via data-img-reveal-speed (default 0.75).
    // Morgan 2026-04-27 (passe 2) : « retarder un peu encore pour que ce
    // soit encore plus frappant ».
    const speed = parseFloat(el.dataset.imgRevealSpeed || '0.75');
    // Pattern designbyad asymétrique (frames scroll_projet f_006) : l'image
    // entre depuis hors-grille (translateX) et glisse vers sa position en
    // même temps que le clip se déroule. Variante via data-img-reveal-offset
    // ("left" = part de la gauche, "right" = part de la droite). Default 0.
    const offsetDir = el.dataset.imgRevealOffset; // "left" | "right" | undefined
    const offsetAmp = parseFloat(el.dataset.imgRevealOffsetAmp || '40'); // px
    const startX = offsetDir === 'left' ? -offsetAmp : offsetDir === 'right' ? offsetAmp : 0;
    el.style.clipPath = 'inset(100% 0 0 0)';
    if (startX !== 0) el.style.transform = `translate3d(${startX}px, 0, 0)`;
    toggleWillChange(el, [el], startX !== 0 ? 'clip-path, transform' : 'clip-path');
    scroll(
      rafThrottle((progress: number) => {
        const linear = Math.max(0, Math.min(1, progress / speed));
        // Ease-out cubic : se révèle vite au début, achève doucement
        const eased = 1 - Math.pow(1 - linear, 3);
        const inset = (1 - eased) * 100;
        el.style.clipPath = `inset(${inset}% 0 0 0)`;
        if (startX !== 0) {
          const x = (1 - eased) * startX;
          el.style.transform = `translate3d(${x}px, 0, 0)`;
        }
      }),
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
      rafThrottle((progress: number) => {
        const scale = 1 + progress * 0.22;
        const translate = progress * -40;
        const brightness = 1 - progress * 0.45;
        const blur = progress * 6;
        el.style.transform = `translate3d(0, ${translate}px, 0) scale(${scale})`;
        el.style.filter = `brightness(${brightness}) blur(${blur}px)`;
      }),
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
      rafThrottle((progress: number) => {
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
      }),
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
    });
    chapters.forEach((c, i) => {
      c.style.opacity = i === 0 ? '1' : '0';
      c.style.transform = i === 0 ? 'translateY(0px)' : 'translateY(30px)';
    });
    toggleWillChange(section, slides, 'opacity, transform');
    toggleWillChange(section, chapters, 'opacity, transform');

    scroll(
      rafThrottle((progress: number) => {
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
      }),
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

    // Dwell — durées sticky en début et fin de scroll horizontal.
    // Refonte v5 (Jonathan : « ça doit commencer à bouger en horizontale
    // que quand on voit entièrement les images du carousel ») : DWELL_START
    // remonté 0.18 → 0.32 → on a vraiment le temps de voir les 4 premiers
    // panneaux + 5e cropée avant que la translation horizontale démarre.
    // DWELL_END remonté 2026-05-02 (Morgan) : la dernière typologie reste
    // sticky longtemps à l'emplacement de la première avant de relâcher
    // → effet « la dernière revient à la place de la première » très net.
    const DWELL_START = 0.32;
    const DWELL_END = 0.28;
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

        // Parallax image inverse dans le cadre — pattern designbyad (feedback
        // Morgan « augmenter l'effet de parallax sur les images dans leur cadres »).
        // Amplitude doublée 140 → 280px. Image reste en place visuellement
        // pendant que le cadre glisse → sensation profondeur forte.
        // Texte : pas de parallax horizontal (retiré — causait les "textes
        // figés à moitié" — il se déplace naturellement avec le rail).
        const vw = window.innerWidth;
        layers.forEach((layer) => {
          if (!layer.frame) return;
          const rect = layer.frame.getBoundingClientRect();
          const posRight = Math.max(0, Math.min(1, rect.right / vw));
          const centered = posRight - 0.5;
          const imgShift = centered * 280;
          if (layer.image) {
            layer.image.style.transform = `translate3d(${-imgShift}px, 0, 0)`;
          }
          if (layer.text) {
            // Reset : le texte ne subit plus de parallax horizontal forcé
            layer.text.style.transform = '';
          }
        });

        ticks.forEach((tick, i) => {
          tick.classList.toggle('is-active', i === activeIndex);
          tick.classList.toggle('is-passed', i < activeIndex);
        });
        // Marque aussi le panel actif pour que la card visuelle puisse
        // s'agrandir (CSS .htypo-panel.is-active .htypo-visual).
        panels.forEach((panel, i) => {
          panel.classList.toggle('is-active', i === activeIndex);
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

/**
 * Words fade — pattern simple : chaque mot d'un [data-words-fade] entre en
 * fade-in stagger au scroll quand la cible passe dans le viewport.
 * Refonte manifeste home 2026-04-28 (Jonathan : « plutôt un texte qui
 * apparait finalement »). Remplace setupJustifyMulti sur le manifeste.
 *
 * Usage : <p data-words-fade>Mon texte…</p>
 *
 * Options :
 *   - data-words-fade-stagger="0.05"  (s, pas entre mots)
 *   - data-words-fade-window="0.0,0.55"  (start,end progress)
 */
function setupWordsFade(root: ParentNode) {
  const nodes = root.querySelectorAll<HTMLElement>('[data-words-fade]');
  nodes.forEach((el) => {
    if (el.dataset.wordsFadeDone) return;
    el.dataset.wordsFadeDone = 'true';

    /*
     * Mobile fallback (Morgan 2026-05-17 : lag scroll iPhone même avec rAF
     * throttle) — l'animation mot-par-mot scroll-driven écrit opacity +
     * transform sur N mots à chaque frame, ce qui sature le compositeur
     * iPhone. Sur mobile on remplace par un fade-in du bloc entier à
     * l'entrée viewport, one-shot. Le rendu final est identique.
     */
    if (IS_MOBILE) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
      el.style.transition =
        'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
      inView(
        el,
        () => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          return undefined;
        },
        { margin: '0px 0px -10% 0px' },
      );
      return;
    }

    const split = new SplitType(el, { types: 'words' });
    const words = (split.words as HTMLElement[] | null) || [];
    if (words.length === 0) return;

    words.forEach((w) => {
      w.style.display = 'inline-block';
      w.style.opacity = '0';
      w.style.transform = 'translateY(10px)';
    });
    toggleWillChange(el, words, 'opacity, transform');

    const winRaw = (el.dataset.wordsFadeWindow || '0.0,0.55').split(',');
    const winStart = parseFloat(winRaw[0] ?? '0') || 0;
    const winEnd = parseFloat(winRaw[1] ?? '0.55') || 0.55;
    const stagger = parseFloat(el.dataset.wordsFadeStagger || '0.04');

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    scroll(
      rafThrottle((progress: number) => {
        const count = words.length;
        words.forEach((w, i) => {
          const localStart = winStart + i * stagger;
          const localEnd = Math.min(winEnd, localStart + 0.18);
          const t = Math.max(
            0,
            Math.min(1, (progress - localStart) / Math.max(0.01, localEnd - localStart)),
          );
          const eased = easeOutCubic(t);
          w.style.opacity = String(eased);
          w.style.transform = `translateY(${(1 - eased) * 10}px)`;
        });
        // Avoid out-of-bound when many words: clip stagger to fit window
        void count;
      }),
      { target: el, offset: ['start end', 'end start'] as never },
    );
  });
}

function enhance(root: ParentNode = document) {
  setupHeroSequence(root);
  setupSplitReveals(root);
  setupJustifiedScroll(root);
  setupJustifyMulti(root);
  setupWordsFade(root);
  setupCharDrift(root);
  setupWheelHorizontal(root);
  setupScrollRise(root);
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
