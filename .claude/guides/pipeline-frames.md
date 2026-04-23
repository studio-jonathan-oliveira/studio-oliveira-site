# Pipeline frames Twinmotion — guide condensé

Référentiel opérationnel pour implémenter et maintenir le scroll-driven photoréaliste. Condensé de [`_brief/pipeline-frames-scrolldriven.md`](../../_brief/pipeline-frames-scrolldriven.md) avec **corrections à apporter au composant `ScrollFrames.tsx`** fourni dans le doc source.

---

## Chaîne complète

```
Jonathan (Twinmotion)
  ↓ export 192 frames PNG 1920×1080 @ 24fps, motion blur OFF
  ↓ fichier `projet_[slug]_frames.zip` + `projet_[slug].mp4` bonus
  ↓ livraison via WeTransfer / Drive

Morgan → input/[slug]-frames/
  ↓ pnpm tsx scripts/process-frames.ts [slug] input/[slug]-frames input/[slug].mp4
  ↓ sharp + ffmpeg → 3 variantes

public/scrollframes/[slug]/
  ├── desktop/frame_0001.webp → frame_0192.webp  (1920×1080 q80 ~80 Ko/frame)
  ├── mobile/frame_0001.webp → frame_0192.webp   (960×540 q75 ~30 Ko/frame)
  ├── video/[slug]_720p.mp4                       (H.264 1280×720 ~5 Mo)
  ├── video/[slug]_720p.webm                      (VP9 alternatif)
  └── manifest.json                               (inventory)

  ↓ (optionnel en Phase 5+) upload Vercel Blob
  ↓ script scripts/upload-frames-cdn.ts

ScrollFrames.tsx (React island)
  ↓ détection device + connexion
  ↓ préchargement progressif + Canvas + GSAP ScrollTrigger
  ↓ rendu 60 fps scroll-scrub
```

---

## Scripts Node.js à implémenter

### `scripts/generate-test-frames.ts`

Produit 192 PNG 1920×1080 de test dans `input/test-project-frames/` — gradient vert → crème, numéro de frame en gros, barre de progression, cercle mobile. Permet de valider la chaîne avant les vrais assets Jonathan.

**Signature** :

```bash
pnpm tsx scripts/generate-test-frames.ts
```

Utilise `sharp` ou `node-canvas`. Code de référence dans `_brief/pipeline-frames-scrolldriven.md`.

### `scripts/process-frames.ts`

Signature :

```bash
pnpm tsx scripts/process-frames.ts <slug> <input-dir> [mp4-input]
# exemple :
pnpm tsx scripts/process-frames.ts villa-brive ./input/villa-brive-frames ./input/villa-brive.mp4
```

**Étapes internes** :

1. **Check ffmpeg installé** (`execSync('ffmpeg -version')`). Exit 1 si absent avec message d'install.
2. Lister et trier les frames PNG du dossier d'entrée (ordre numérique strict, `padStart(4, '0')`).
3. Pour chaque frame (batch de 8 en parallèle pour pas saturer la RAM) :
   - Desktop : resize 1920×1080 lanczos3 + `.webp({ quality: 80, effort: 6 })`
   - Mobile : resize 960×540 lanczos3 + `.webp({ quality: 75, effort: 6 })`
4. Si MP4 d'entrée fourni, transcoder en 2 versions :
   - `[slug]_720p.mp4` : H.264 1280×720 preset slow + `+faststart` + `yuv420p` + pas d'audio
   - `[slug]_720p.webm` : VP9 CRF 32 pas d'audio
5. Écrire `manifest.json` avec inventory.

## Composant `ScrollFrames.tsx` — corrections obligatoires

Le composant fourni dans `_brief/pipeline-frames-scrolldriven.md` a **5 trous à combler** :

### 1. `prefers-reduced-motion` non géré

```tsx
const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

useEffect(() => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  setPrefersReducedMotion(mq.matches);
  const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}, []);

if (prefersReducedMotion) {
  // Afficher frame statique (0 ou 96 milieu)
  return <img src={midFrameUrl} alt={alt} width={1920} height={1080} />;
}
```

### 2. Hydration mismatch sur `matchMedia`

Ne jamais appeler `window.matchMedia` au render initial. Toujours via `useEffect` avec valeur par défaut SSR-safe :

```tsx
const [isMobile, setIsMobile] = useState(false); // valeur SSR initiale neutre

useEffect(() => {
  const mq = window.matchMedia('(max-width: 768px)');
  setIsMobile(mq.matches);
  // ... listener change
}, []);
```

### 3. Fallback vidéo mobile non intégré

Par défaut sur mobile : charger la vidéo, pas les frames WebP. Scroll-scrub via `video.currentTime` :

```tsx
if (isMobile) {
  // Use <video> element + scroll-scrub via currentTime
  // Gains : 5-8 Mo total vs 20 Mo pour 192 WebP, 1 requête HTTP au lieu de 192
}
```

### 4. Détection connexion pour adaptive loading

```tsx
const conn = (navigator as any).connection?.effectiveType;
const useWebpFrames = conn === '4g' || conn === undefined; // 4G ou API non dispo
// Sinon (3g/slow-2g) : forcer vidéo même sur desktop
```

### 5. LCP preload première frame

Dans la page Astro qui utilise `<ScrollFrames />`, injecter dans le `<head>` :

```astro
<link
  rel="preload"
  as="image"
  href={`/scrollframes/${slug}/desktop/frame_0001.webp`}
  fetchpriority="high"
/>
```

## Budget perf par projet immersif

| Métrique                                        | Cible                   |
| ----------------------------------------------- | ----------------------- |
| Poids total desktop (192 WebP 1920×1080)        | ≤ 20 Mo                 |
| Poids total mobile (vidéo 720p)                 | ≤ 10 Mo                 |
| Poids total mobile (WebP 960×540 alternatif 4G) | ≤ 8 Mo                  |
| Time to first render (canvas)                   | < 1.5 s                 |
| FPS pendant scroll                              | 60 fps constants        |
| Lighthouse Perf (page `/conceptions/[slug]`)    | ≥ 85 (compromis assumé) |

## Règles d'or

1. **JAMAIS charger frames avant que le composant soit visible** — `client:visible` obligatoire sur `<ScrollFrames />`.
2. **Cap `devicePixelRatio` à 2** dans le canvas — sinon Retina double le travail GPU pour rien visuellement.
3. **Préchargement progressif** : scroll-scrub démarrable à **20%** des frames chargées (configurable, tester en 3G throttled).
4. **Mémoire** : 192 HTMLImageElement ≈ 20 Mo par projet en RAM. 3 projets = 60 Mo (OK). Pour 5+ projets, implémenter déchargement au sortie viewport.
5. **JAMAIS cumuler** hero vidéo + scroll-scrub sur la même page. Règle : `/` a hero vidéo. `/conceptions/[slug]` a 1 scroll-scrub. Pas les deux.
6. **Manifest.json** généré par le script = source de vérité du count de frames. Hardcoder `frameCount` dans la page Astro depuis `import manifest from '...'`.

## Check Jonathan côté production

Check-list d'export à destination de Jonathan : [`_brief/checklist-twinmotion-jonathan.md`](../../_brief/checklist-twinmotion-jonathan.md).

Point critique : **Motion blur doit être désactivé** dans Twinmotion. Sans ça, les frames individuelles ont des traînées et le scroll-scrub est inutilisable.
