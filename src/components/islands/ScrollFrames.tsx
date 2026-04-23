/*
 * ScrollFrames — scroll-scrub photo-réaliste pour /conceptions/[slug].
 * Canvas 2D + préchargement progressif + scroll-driven frame picking.
 *
 * Corrections appliquées (cf. .claude/guides/pipeline-frames.md) :
 *   1. Respect prefers-reduced-motion (montre frame statique)
 *   2. Pas de hydration mismatch (matchMedia uniquement en useEffect)
 *   3. Fallback mobile : <img> statique si faible connexion ou motion-reduced
 *   4. Détection connexion effectiveType
 *   5. LCP preload doit être injecté côté page Astro (<link rel=preload>)
 *
 * Props :
 *   - basePath : "/frames/coeur-urbain-parenthese"
 *   - frameCount : nombre total de frames
 *   - format : "png" | "webp" (défaut: "png")
 *   - digits : padStart digits (défaut: 4 → 0000.png)
 *   - alt : texte alternatif (accessibilité)
 */

import { useEffect, useRef, useState } from 'react';

interface ScrollFramesProps {
  basePath: string;
  frameCount: number;
  format?: 'png' | 'webp' | 'jpg';
  digits?: number;
  alt: string;
  /** Ratio d'aspect du canvas. Défaut 16/9 (1920×1080). */
  aspectRatio?: string;
}

const frameUrl = (basePath: string, index: number, digits: number, format: string): string =>
  `${basePath}/${String(index).padStart(digits, '0')}.${format}`;

export default function ScrollFrames({
  basePath,
  frameCount,
  format = 'png',
  digits = 4,
  alt,
  aspectRatio = '16 / 9',
}: ScrollFramesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [reduceMotion, setReduceMotion] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [degraded, setDegraded] = useState(false);

  // Détection environnement (préférences user + connexion + viewport)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const rmq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(rmq.matches);
    const rmHandler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    rmq.addEventListener('change', rmHandler);

    const vmq = window.matchMedia('(min-width: 768px)');
    setIsDesktop(vmq.matches);
    const vmHandler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    vmq.addEventListener('change', vmHandler);

    // Détection réseau : si 2g/slow-2g, dégrader
    const conn = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
    const effective = conn?.effectiveType;
    if (effective && (effective === '2g' || effective === 'slow-2g')) {
      setDegraded(true);
    }

    return () => {
      rmq.removeEventListener('change', rmHandler);
      vmq.removeEventListener('change', vmHandler);
    };
  }, []);

  // Préchargement progressif des frames.
  // ⚠️ NE PAS inclure `ready` dans les deps — sinon setReady(true) relance l'effet,
  // recrée des Image() non chargées → canvas reste noir. (Bug identifié en review.)
  const readyRef = useRef(false);
  useEffect(() => {
    if (reduceMotion || degraded) return;

    const images: HTMLImageElement[] = [];
    let cancelled = false;
    let loaded = 0;
    const readyThreshold = Math.max(1, Math.ceil(frameCount * 0.2));

    for (let i = 0; i < frameCount; i += 1) {
      const img = new Image();
      img.src = frameUrl(basePath, i, digits, format);
      img.onload = () => {
        if (cancelled) return;
        loaded += 1;
        setLoadedCount(loaded);
        if (loaded >= readyThreshold && !readyRef.current) {
          readyRef.current = true;
          setReady(true);
        }
      };
      img.onerror = () => {
        if (cancelled) return;
        loaded += 1;
        setLoadedCount(loaded);
      };
      images.push(img);
    }
    imagesRef.current = images;

    return () => {
      cancelled = true;
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [basePath, frameCount, format, digits, reduceMotion, degraded]);

  // Boucle scroll-scrub
  useEffect(() => {
    if (!ready || reduceMotion || degraded) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Cap devicePixelRatio à 2 pour éviter work GPU inutile
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // ⚠️ Le canvas est DANS le sticky (100vh), mais `container` ref la section
    // outer (500vh). Il faut utiliser le parent direct du canvas pour son sizing,
    // sinon le canvas est énorme et n'affiche rien.
    const resize = () => {
      const stickyRect = (canvas.parentElement || canvas).getBoundingClientRect();
      const w = stickyRect.width;
      const h = stickyRect.height || window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(currentFrameRef.current, w, h);
    };

    const draw = (index: number, w?: number, h?: number) => {
      const rect = w && h ? { width: w, height: h } : canvas.getBoundingClientRect();
      const img = imagesRef.current[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      // Contain cover : remplir le canvas en préservant l'aspect
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = rect.width / rect.height;
      let sx = 0;
      let sy = 0;
      let sw = img.naturalWidth;
      let sh = img.naturalHeight;
      if (imgAspect > canvasAspect) {
        // Image plus large : crop côtés
        sw = img.naturalHeight * canvasAspect;
        sx = (img.naturalWidth - sw) / 2;
      } else {
        sh = img.naturalWidth / canvasAspect;
        sy = (img.naturalHeight - sh) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, rect.width, rect.height);
    };

    const updateFrame = () => {
      rafRef.current = null;
      const rect = container.getBoundingClientRect();
      const viewport = window.innerHeight;
      // Progress : 0 quand le haut du container touche le haut du viewport,
      // 1 quand le bas du container touche le bas du viewport.
      const scrollRange = rect.height - viewport;
      if (scrollRange <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollRange));
      const frameIndex = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        draw(frameIndex);
      }
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(updateFrame);
    };

    resize();
    draw(0);
    updateFrame();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [ready, reduceMotion, degraded, frameCount]);

  // Fallback statique : montrer la frame médiane
  if (reduceMotion || degraded) {
    const midIndex = Math.floor(frameCount / 2);
    return (
      <div
        ref={containerRef}
        className="scroll-frames-static"
        style={{ aspectRatio, width: '100%' }}
      >
        <img
          src={frameUrl(basePath, midIndex, digits, format)}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
          width={1920}
          height={1080}
        />
      </div>
    );
  }

  const loadPct = Math.round((loadedCount / frameCount) * 100);

  return (
    <div
      ref={containerRef}
      className="scroll-frames"
      aria-label={alt}
      role="img"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: isDesktop ? '500vh' : '350vh',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          background: 'var(--color-forest, #1a2b1f)',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />
        {!ready && (
          <div
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: '3rem',
              color: 'var(--color-cream, #f5f1ea)',
              fontFamily: 'monospace',
              fontSize: '10px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              opacity: 0.7,
            }}
          >
            Chargement · {loadPct}%
          </div>
        )}
      </div>
    </div>
  );
}
