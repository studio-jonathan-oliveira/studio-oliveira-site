# Teaser lancement du site — package Remotion

Vidéo motion design (~22,5 s @30fps) pour annoncer le lancement du site sur
les réseaux. Package **séparé** du site (comme `/sanity/`) : aucune
dépendance ajoutée au `package.json` racine.

Sorties (sans musique — à ajouter au moment de la publication) :

- `_brief/client-assets/teaser-lancement-reel-9x16.mp4` — 1080×1920,
  Reels + Stories Instagram / TikTok
- `_brief/client-assets/teaser-lancement-feed-4x5.mp4` — 1080×1350,
  post feed Instagram

La mise en page verticale s'adapte au format via `useK()` (`src/ui.tsx`).

## Séquences

1. **Logo intro** — `public/brand/logo-animation.mp4` (tracé oliveim.) en
   blend `multiply` sur le beige de la marque, coupé avant l'end-card noir.
2. **Hero** — photo hero du site + wordmark « Studio / J. Oliveira »
   en mask-reveal, eyebrow « Design immersif & expérientiel ».
3. **Valeurs** — les 8 mots verbatim de la trame home en typographie
   cinétique Bold.
4. **Typologies** — 4 panneaux (images réelles), clip-reveal + liseret 1px
   courbure bas-droite qui se trace.
5. **Stats** — +10 études / +10 ans / +3 régions, compteurs animés.
6. **Annonce + CTA** — « Le nouveau site est en ligne. » + pill
   « Démarrer un projet » (noir → violet au clic, états topbar de la trame).
7. **Outro** — wordmark crème en intro-reveal + URL + crédit discret
   « Designed & created by Studio Margerit » (bas-droite).

Transitions entre scènes : rideaux verticaux dans la couleur de fond de la
scène suivante (easing `--ease-in-out-editorial`), même esprit que le site.

## Version 2.5D cinématographique (`Teaser3D` / `Teaser3DFeed`)

Plan-séquence continu (~30 s) : les mêmes stations deviennent des plans
flottants dans un monde CSS 3D (`src/three/core.tsx` = caméra virtuelle,
poses inverses, profondeur de champ) et une caméra voyage sans coupe :
push-in logo → dolly hero (parallaxe wordmark) → traversée en profondeur
du couloir des 8 valeurs → travelling galerie typologies (les cartes se
dissolvent au départ, sinon elles bloqueraient l'axe) → mur stats →
annonce + clic → pull-back final. Motion blur multi-échantillons
(`@remotion/motion-blur`, 10 samples — rendu ~10× plus long que la 2D),
micro-dérive « handheld », vignette + grain en couche optique.

Sorties : `teaser-lancement-3d-reel-9x16.mp4` / `teaser-lancement-3d-feed-4x5.mp4`
(`pnpm render:3d`).

Le langage motion reprend les tokens du site (`--ease-out-editorial`,
mask-reveal `[data-mask-line]`, keyframe `intro-reveal`, grain papier).
Les couleurs sont importées de `src/lib/brand-colors.ts` (aucun hex ici).
Les assets (fonts woff2, photos, logo) sont lus depuis le `/public` du site
(`Config.setPublicDir('../public')`) — pas de duplication.

## Rendu

```bash
cd teaser
pnpm install
pnpm studio        # prévisualisation interactive (localhost:3000)
pnpm render        # rendu MP4 → _brief/client-assets/
```

Si le téléchargement du navigateur headless de Remotion est bloqué
(environnements restreints), fournir un Chromium local :

```bash
npx remotion render src/index.ts Teaser ../_brief/client-assets/teaser-lancement-reel-9x16.mp4 \
  --crf 17 --browser-executable=/chemin/vers/chromium --timeout=180000 --concurrency=2
```
