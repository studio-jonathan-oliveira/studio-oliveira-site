# 🎞️ Pipeline de traitement des frames Twinmotion → Web

Ce document complète le brief principal. Il décrit la chaîne complète de traitement des séquences d'images rendues depuis Twinmotion par Jonathan, jusqu'à leur intégration en scroll-driven sur le site.

---

## ⚠️ IMPORTANT — Valider la chaîne avec des frames de test AVANT livraison client

**Jonathan n'a pas encore livré ses séquences Twinmotion.** Il faut donc que tu **génères toi-même un jeu de frames de test synthétiques** pour valider l'intégralité du pipeline (script de conversion + composant ScrollFrames + comportement scroll) **avant** qu'on reçoive les vrais assets.

### Ce que tu dois faire en priorité absolue

Crée un script `scripts/generate-test-frames.ts` qui génère **192 frames PNG synthétiques** de 1920×1080 simulant une animation de caméra. Ces frames doivent permettre de valider visuellement que le scroll fonctionne correctement (on doit voir clairement la progression image par image au scroll).

### Options de génération (choisis la plus simple qui fonctionne)

**Option A — Frames avec gradient progressif + numéro de frame (RECOMMANDÉE, simple et efficace)**

Utilise **sharp** pour générer des images avec :
- Un gradient de couleur qui évolue de la frame 1 à 192 (vert sombre `#1A2B1F` → vert clair `#3D5A3E` → crème `#F5F1EA`)
- Le **numéro de frame affiché en grand** au centre (ex: "042 / 192")
- Une **barre de progression horizontale** en bas de l'image qui avance frame par frame
- Un **cercle qui se déplace** de gauche à droite au fil des frames (pour valider visuellement la fluidité)

```typescript
// scripts/generate-test-frames.ts
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const FRAME_COUNT = 192;
const WIDTH = 1920;
const HEIGHT = 1080;
const OUTPUT_DIR = './input/test-project-frames';

// Interpolation linéaire entre 3 couleurs
function interpolateColor(t: number): string {
  const colors = [
    { r: 26, g: 43, b: 31 },    // #1A2B1F vert sombre
    { r: 61, g: 90, b: 62 },    // #3D5A3E vert moyen
    { r: 245, g: 241, b: 234 }, // #F5F1EA crème
  ];
  const segment = t * 2;
  const i = Math.min(Math.floor(segment), 1);
  const localT = segment - i;
  const c1 = colors[i];
  const c2 = colors[i + 1];
  const r = Math.round(c1.r + (c2.r - c1.r) * localT);
  const g = Math.round(c1.g + (c2.g - c1.g) * localT);
  const b = Math.round(c1.b + (c2.b - c1.b) * localT);
  return `rgb(${r},${g},${b})`;
}

async function generateFrame(frameNum: number): Promise<void> {
  const progress = (frameNum - 1) / (FRAME_COUNT - 1); // 0 → 1
  const bgColor = interpolateColor(progress);
  const circleX = 100 + progress * (WIDTH - 200);
  const textColor = progress > 0.6 ? '#1A2B1F' : '#F5F1EA';
  const progressBarWidth = progress * (WIDTH - 200);

  const svg = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${WIDTH}" height="${HEIGHT}" fill="${bgColor}"/>
      
      <!-- Grille de repère pour voir le mouvement -->
      <g stroke="${textColor}" stroke-width="1" opacity="0.15">
        ${Array.from({ length: 20 }, (_, i) => 
          `<line x1="${i * WIDTH / 20}" y1="0" x2="${i * WIDTH / 20}" y2="${HEIGHT}"/>`
        ).join('')}
        ${Array.from({ length: 10 }, (_, i) => 
          `<line x1="0" y1="${i * HEIGHT / 10}" x2="${WIDTH}" y2="${i * HEIGHT / 10}"/>`
        ).join('')}
      </g>
      
      <!-- Cercle mobile pour visualiser la progression -->
      <circle cx="${circleX}" cy="${HEIGHT / 2}" r="80" 
              fill="${textColor}" opacity="0.8"/>
      
      <!-- Numéro de frame central -->
      <text x="${WIDTH / 2}" y="${HEIGHT / 2 - 200}" 
            font-family="Arial" font-size="180" font-weight="bold"
            fill="${textColor}" text-anchor="middle">
        ${String(frameNum).padStart(3, '0')} / ${FRAME_COUNT}
      </text>
      
      <!-- Label "TEST FRAME" -->
      <text x="${WIDTH / 2}" y="${HEIGHT / 2 + 280}" 
            font-family="Arial" font-size="48" letter-spacing="8"
            fill="${textColor}" text-anchor="middle" opacity="0.6">
        TEST FRAME — SCROLL VALIDATION
      </text>
      
      <!-- Barre de progression -->
      <rect x="100" y="${HEIGHT - 80}" width="${WIDTH - 200}" height="12" 
            fill="${textColor}" opacity="0.2" rx="6"/>
      <rect x="100" y="${HEIGHT - 80}" width="${progressBarWidth}" height="12" 
            fill="${textColor}" rx="6"/>
      
      <!-- Pourcentage -->
      <text x="${WIDTH - 100}" y="${HEIGHT - 100}" 
            font-family="Arial" font-size="32" font-weight="bold"
            fill="${textColor}" text-anchor="end">
        ${Math.round(progress * 100)}%
      </text>
    </svg>
  `;

  const frameNumber = String(frameNum).padStart(4, '0');
  const outputPath = join(OUTPUT_DIR, `frame_${frameNumber}.png`);

  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  console.log(`🎨 Génération de ${FRAME_COUNT} frames de test...`);

  const startTime = Date.now();
  for (let i = 1; i <= FRAME_COUNT; i++) {
    await generateFrame(i);
    if (i % 20 === 0) console.log(`   ${i}/${FRAME_COUNT} frames générées`);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✅ ${FRAME_COUNT} frames générées en ${elapsed}s`);
  console.log(`📁 ${OUTPUT_DIR}`);
  console.log(`\nProchaine étape :`);
  console.log(`  pnpm tsx scripts/process-frames.ts test-project ${OUTPUT_DIR}\n`);
}

main().catch(console.error);
```

### Workflow de validation complet

1. **Générer les frames de test** : `pnpm tsx scripts/generate-test-frames.ts`
2. **Traiter avec le pipeline** : `pnpm tsx scripts/process-frames.ts test-project ./input/test-project-frames`
3. **Créer la page démo** `/src/pages/demo-scrollframes.astro` qui utilise le composant `<ScrollFrames projectSlug="test-project" frameCount={192} />`
4. **Vérifier en local** (`pnpm dev`) :
   - Les 192 frames s'affichent progressivement au scroll
   - Le cercle bouge de façon fluide de gauche à droite
   - Le numéro de frame défile sans saccade (check à 60fps via DevTools)
   - Pas de flash blanc entre frames
   - Fonctionne sur mobile (tester en responsive DevTools + vrai mobile via tunnel ngrok ou IP locale)
   - Le loader "Préparation de la scène · X%" s'affiche bien au chargement
   - `prefers-reduced-motion` affiche une frame statique sans scroll-scrub

### Critère de validation

**Tu ne déclares le pipeline validé que si** un utilisateur qui scrolle la page démo voit une progression parfaitement fluide du cercle et du numéro de frame, sans saut, sans ralentissement, sur desktop ET mobile. Si c'est le cas, tu sais qu'en branchant les vraies frames Twinmotion de Jonathan, ça fonctionnera identiquement.

### Option B — Si tu as accès à ffmpeg et veux des frames plus réalistes

Tu peux aussi générer une vidéo synthétique avec ffmpeg (pattern test avec mouvement + grain) puis l'extraire en frames. Mais l'option A est largement suffisante et plus rapide à mettre en place.

---

## 📥 Ce qu'on reçoit de Jonathan

Pour chaque projet mis en scène immersif :

- **Un dossier de ~192 fichiers PNG** nommés `frame_0001.png` → `frame_0192.png`
- **Résolution** : 1920 × 1080
- **Poids typique** : ~2-3 Mo par frame → **~400-600 Mo par dossier**
- **Un fichier MP4** (H.264, 1080p, 24fps) du même chemin caméra → ~15-30 Mo

---

## 🎯 Ce qu'on doit obtenir pour le web

Le pipeline doit produire **trois variantes** par projet :

### Variante 1 — Desktop (haute qualité)
- Format : **WebP** (qualité 80)
- Résolution : **1920 × 1080**
- Poids cible : **60-120 Ko/frame** → total ~15-20 Mo pour 192 frames
- Usage : scroll-scrub sur écrans desktop/tablette

### Variante 2 — Mobile (allégée)
- Format : **WebP** (qualité 75)
- Résolution : **960 × 540**
- Poids cible : **20-40 Ko/frame** → total ~5-8 Mo pour 192 frames
- Usage : scroll-scrub sur mobile si on tient aux séquences d'images

### Variante 3 — Mobile vidéo (fallback recommandé)
- Format : **MP4 (H.264)** + **WebM (VP9)** en alternatif
- Résolution : **1280 × 720**
- Poids cible : **3-8 Mo**
- Usage : scroll-scrub via `video.currentTime` sur mobile (plus efficace que frames)

---

## 🛠️ Script de conversion automatique

À placer dans `/scripts/process-frames.ts` du projet. Utilise **sharp** (ultra rapide, natif Node) pour les images et **fluent-ffmpeg** pour la vidéo.

### Installation

```bash
pnpm add -D sharp fluent-ffmpeg @types/fluent-ffmpeg tsx
```

Assure-toi que **ffmpeg** est installé sur la machine (requis par fluent-ffmpeg) :
- macOS : `brew install ffmpeg`
- Linux : `apt install ffmpeg`
- Windows : via chocolatey ou installateur officiel

### Script complet

```typescript
// scripts/process-frames.ts
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import { readdir, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, basename } from 'node:path';

// ═══════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════

const CONFIG = {
  desktop: {
    width: 1920,
    height: 1080,
    quality: 80,
    suffix: 'desktop',
  },
  mobile: {
    width: 960,
    height: 540,
    quality: 75,
    suffix: 'mobile',
  },
  video: {
    width: 1280,
    height: 720,
    videoBitrate: '1500k',
  },
};

// ═══════════════════════════════════════════════════════════
// PROCESS IMAGES (frames → WebP optimisé)
// ═══════════════════════════════════════════════════════════

async function processFrames(
  inputDir: string,
  outputBaseDir: string,
  variant: 'desktop' | 'mobile'
) {
  const { width, height, quality, suffix } = CONFIG[variant];
  const outputDir = join(outputBaseDir, suffix);

  if (!existsSync(outputDir)) await mkdir(outputDir, { recursive: true });

  const files = (await readdir(inputDir))
    .filter((f) => f.toLowerCase().endsWith('.png'))
    .sort(); // garantit l'ordre numérique

  console.log(`\n🎞️  [${variant}] Traitement de ${files.length} frames...`);

  let processed = 0;
  const startTime = Date.now();

  // Traitement parallèle par batch de 8 (évite la saturation RAM)
  const BATCH_SIZE = 8;
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (file, idx) => {
        const frameNumber = String(i + idx + 1).padStart(4, '0');
        const inputPath = join(inputDir, file);
        const outputPath = join(outputDir, `frame_${frameNumber}.webp`);

        await sharp(inputPath)
          .resize(width, height, { fit: 'cover', kernel: 'lanczos3' })
          .webp({ quality, effort: 6 }) // effort 6 = bon compromis qualité/vitesse
          .toFile(outputPath);

        processed++;
        if (processed % 20 === 0) {
          console.log(`   ${processed}/${files.length} frames traitées`);
        }
      })
    );
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ [${variant}] Terminé en ${elapsed}s → ${outputDir}`);
}

// ═══════════════════════════════════════════════════════════
// PROCESS VIDEO (MP4 source → MP4 + WebM web-optimisés)
// ═══════════════════════════════════════════════════════════

async function processVideo(inputPath: string, outputDir: string) {
  const { width, height, videoBitrate } = CONFIG.video;
  if (!existsSync(outputDir)) await mkdir(outputDir, { recursive: true });

  const name = basename(inputPath, '.mp4');
  const mp4Out = join(outputDir, `${name}_720p.mp4`);
  const webmOut = join(outputDir, `${name}_720p.webm`);

  console.log(`\n🎥  Compression vidéo ${name}...`);

  // MP4 H.264 — compatible partout
  await new Promise<void>((resolve, reject) => {
    ffmpeg(inputPath)
      .videoCodec('libx264')
      .size(`${width}x${height}`)
      .videoBitrate(videoBitrate)
      .outputOptions([
        '-preset slow', // meilleure compression
        '-movflags +faststart', // lecture progressive dès le début du téléchargement
        '-pix_fmt yuv420p', // compatibilité max
        '-an', // pas d'audio
      ])
      .on('end', () => resolve())
      .on('error', reject)
      .save(mp4Out);
  });
  console.log(`   ✅ MP4 → ${mp4Out}`);

  // WebM VP9 — meilleure compression sur navigateurs modernes
  await new Promise<void>((resolve, reject) => {
    ffmpeg(inputPath)
      .videoCodec('libvpx-vp9')
      .size(`${width}x${height}`)
      .videoBitrate(videoBitrate)
      .outputOptions(['-crf 32', '-b:v 0', '-an'])
      .on('end', () => resolve())
      .on('error', reject)
      .save(webmOut);
  });
  console.log(`   ✅ WebM → ${webmOut}`);
}

// ═══════════════════════════════════════════════════════════
// GÉNÉRATION D'UN MANIFEST JSON
// ═══════════════════════════════════════════════════════════

async function generateManifest(projectName: string, outputBaseDir: string) {
  const desktopFrames = (await readdir(join(outputBaseDir, 'desktop'))).sort();
  const mobileFrames = (await readdir(join(outputBaseDir, 'mobile'))).sort();

  const manifest = {
    project: projectName,
    generatedAt: new Date().toISOString(),
    frames: {
      desktop: {
        count: desktopFrames.length,
        basePath: `/scrollframes/${projectName}/desktop/`,
        pattern: 'frame_{0000}.webp',
      },
      mobile: {
        count: mobileFrames.length,
        basePath: `/scrollframes/${projectName}/mobile/`,
        pattern: 'frame_{0000}.webp',
      },
    },
    video: {
      mp4: `/scrollframes/${projectName}/video/${projectName}_720p.mp4`,
      webm: `/scrollframes/${projectName}/video/${projectName}_720p.webm`,
    },
  };

  const manifestPath = join(outputBaseDir, 'manifest.json');
  await Bun.write(manifestPath, JSON.stringify(manifest, null, 2)).catch(
    async () => {
      // fallback node si pas de Bun
      const { writeFile } = await import('node:fs/promises');
      await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    }
  );
  console.log(`\n📄 Manifest → ${manifestPath}`);
}

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════

async function main() {
  const [, , projectName, framesDir, videoFile] = process.argv;

  if (!projectName || !framesDir) {
    console.error(`
Usage:
  pnpm tsx scripts/process-frames.ts <project-name> <frames-dir> [video-file]

Exemples:
  pnpm tsx scripts/process-frames.ts villa-brive ./input/villa-brive-frames
  pnpm tsx scripts/process-frames.ts villa-brive ./input/villa-brive-frames ./input/villa-brive.mp4
    `);
    process.exit(1);
  }

  const outputBaseDir = join('public', 'scrollframes', projectName);

  await processFrames(framesDir, outputBaseDir, 'desktop');
  await processFrames(framesDir, outputBaseDir, 'mobile');

  if (videoFile && existsSync(videoFile)) {
    await processVideo(videoFile, join(outputBaseDir, 'video'));
  }

  await generateManifest(projectName, outputBaseDir);

  console.log('\n🌿 Pipeline terminé avec succès.\n');
}

main().catch((err) => {
  console.error('❌ Erreur:', err);
  process.exit(1);
});
```

### Utilisation

```bash
# Après avoir reçu les fichiers de Jonathan, les placer dans /input/
# Puis lancer :
pnpm tsx scripts/process-frames.ts villa-brive ./input/villa-brive-frames ./input/villa-brive.mp4
```

Résultat dans `/public/scrollframes/villa-brive/` :
```
desktop/    → 192 WebP 1920×1080 (~15 Mo total)
mobile/     → 192 WebP 960×540   (~6 Mo total)
video/      → MP4 + WebM 720p    (~8 Mo)
manifest.json
```

---

## 🎬 Intégration scroll-driven côté frontend

### Principe général

On ne fait **pas** de `<img>` classiques en flex. On utilise un **`<canvas>`** sur lequel on dessine la frame correspondant au pourcentage de scroll. Technique éprouvée (Apple l'utilise sur toutes ses pages produit).

### Pourquoi canvas et pas une série d'images cachées

- Un `<canvas>` = 1 seul élément DOM peu importe le nombre de frames
- On garde le contrôle total sur le rendu (redimensionnement, effets, transitions)
- Pas de flash blanc entre les frames
- Performance GPU bien meilleure

### Composant React (island Astro)

Crée `src/components/ScrollFrames.tsx` :

```tsx
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollFramesProps {
  projectSlug: string;
  frameCount: number;
  className?: string;
}

export default function ScrollFrames({
  projectSlug,
  frameCount,
  className = '',
}: ScrollFramesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);

  // Détection mobile pour choisir la variante
  const isMobile =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 768px)').matches;
  const variant = isMobile ? 'mobile' : 'desktop';

  // Préchargement progressif des frames
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    const basePath = `/scrollframes/${projectSlug}/${variant}`;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(4, '0');
      img.src = `${basePath}/frame_${frameNum}.webp`;
      img.onload = () => {
        loadedCount++;
        setLoaded(loadedCount);
        // On active le scroll-scrub dès que 20% des frames sont chargées
        if (loadedCount === Math.ceil(frameCount * 0.2)) setReady(true);
      };
      images.push(img);
    }

    imagesRef.current = images;
  }, [projectSlug, frameCount, variant]);

  // Mise en place du scroll-scrub
  useEffect(() => {
    if (!ready || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Taille canvas = première image
    const firstImg = imagesRef.current[0];
    const setCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap à 2x pour perf
      canvas.width = firstImg.naturalWidth * dpr;
      canvas.height = firstImg.naturalHeight * dpr;
      canvas.style.aspectRatio = `${firstImg.naturalWidth} / ${firstImg.naturalHeight}`;
    };
    setCanvasSize();

    // État de l'animation
    const state = { frame: 0 };

    const renderFrame = (index: number) => {
      const img = imagesRef.current[index];
      if (img && img.complete) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    };

    renderFrame(0);

    // ScrollTrigger : la séquence se joue pendant 2× la hauteur du viewport
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=200%',
      pin: true,
      scrub: 0.5, // léger smoothing pour éviter les à-coups
      onUpdate: (self) => {
        const targetFrame = Math.round(self.progress * (frameCount - 1));
        if (targetFrame !== state.frame) {
          state.frame = targetFrame;
          renderFrame(targetFrame);
        }
      },
    });

    // Resize handler
    const onResize = () => {
      setCanvasSize();
      renderFrame(state.frame);
    };
    window.addEventListener('resize', onResize);

    return () => {
      trigger.kill();
      window.removeEventListener('resize', onResize);
    };
  }, [ready, frameCount]);

  const progress = Math.round((loaded / frameCount) * 100);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-screen overflow-hidden bg-[#1A2B1F] ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[#D4B896] text-sm tracking-widest uppercase">
            Préparation de la scène · {progress}%
          </div>
        </div>
      )}
    </div>
  );
}
```

### Utilisation dans une page Astro projet

```astro
---
import ScrollFrames from '../components/ScrollFrames';
---

<section class="relative">
  <ScrollFrames
    projectSlug="villa-brive"
    frameCount={192}
    client:visible
  />
</section>
```

`client:visible` → le composant ne se charge que quand la section entre dans le viewport. Économise de la bande passante sur les pages portfolio où plusieurs projets coexistent.

---

## 🔁 Alternative vidéo pour mobile (recommandé)

Plutôt que de charger 192 WebP sur mobile, on peut utiliser la vidéo directement avec scroll-scrub via `video.currentTime`. C'est **significativement plus léger** (5-8 Mo vs 6+ Mo mais avec 192 requêtes HTTP).

```tsx
// Variante mobile optimale : scroll sur une vidéo
useEffect(() => {
  if (!isMobile || !videoRef.current) return;

  const video = videoRef.current;
  video.pause();

  ScrollTrigger.create({
    trigger: containerRef.current,
    start: 'top top',
    end: '+=200%',
    pin: true,
    scrub: 0.5,
    onUpdate: (self) => {
      if (video.duration) {
        video.currentTime = self.progress * video.duration;
      }
    },
  });
}, [isMobile]);
```

Le choix entre "frames mobile" et "vidéo mobile" peut se faire au cas par cas, ou on peut laisser le système choisir selon `navigator.connection.effectiveType` (4g = frames, 3g = vidéo).

---

## ⚡ Points de vigilance perf

1. **Ne JAMAIS précharger les frames avant que le composant soit visible** → utiliser `IntersectionObserver` ou `client:visible` d'Astro.

2. **Capper le devicePixelRatio à 2** dans le canvas — sinon sur écrans Retina on double inutilement le travail GPU.

3. **Préchargement progressif** : ne pas attendre 100% des frames chargées pour démarrer. 20% suffit, le reste continue en arrière-plan.

4. **Mémoire** : 192 `HTMLImageElement` gardés en RAM, à 60-120 Ko chacun, ça fait ~20 Mo par projet chargé. Sur une page avec 3 projets visibles, on atteint 60 Mo — acceptable mais pas davantage. Si plus de projets, implémenter un système de déchargement quand le composant sort du viewport.

5. **Fallback reduced-motion** : respecter `prefers-reduced-motion: reduce` — afficher seulement la frame 0 ou la frame 96 (milieu) en image statique, sans animation scroll.

6. **Lighthouse** : ce type d'implémentation peut dégrader le LCP si mal fait. Le canvas doit avoir ses dimensions explicites (aspect-ratio) pour éviter le CLS. La première frame doit être chargée en priorité (preload avec `fetchpriority="high"` sur la frame 0001).

---

## 📊 Budget perf attendu par projet

| Métrique | Cible |
|---|---|
| Poids total desktop | < 20 Mo |
| Poids total mobile (frames) | < 8 Mo |
| Poids total mobile (vidéo) | < 10 Mo |
| Time to first render | < 1.5 s |
| FPS pendant scroll | 60 fps constant |
| Lighthouse Performance (page projet) | ≥ 85 (le scroll-scrub est un feature premium, on accepte un léger compromis vs page statique) |

---

## 🗂️ Structure finale dans le projet

```
/scripts/
  process-frames.ts         ← le script ci-dessus

/input/                     ← gitignored, dossier de travail local
  villa-brive-frames/
  villa-brive.mp4

/public/scrollframes/       ← généré par le script
  villa-brive/
    desktop/frame_0001.webp → frame_0192.webp
    mobile/frame_0001.webp → frame_0192.webp
    video/villa-brive_720p.mp4
    video/villa-brive_720p.webm
    manifest.json
  autre-projet/
    ...

/src/components/
  ScrollFrames.tsx          ← le composant React
```

**Important** : `/input/` doit être dans `.gitignore` (trop lourd pour Git). Les dossiers générés dans `/public/scrollframes/` sont commit ou mieux, envoyés sur un CDN externe (Cloudinary, Bunny.net, Vercel Blob) si le volume devient gros.
