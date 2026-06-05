# 🔜 REPRISE — RE-TRAITER LA HOME (brief autonome pour nouveau contexte)

> Écrit le 2026-06-04 fin de session. Morgan veut **re-traiter la home** (la refonte
> structurelle est faite ; objectif = se rapprocher du **pixel-perfect** de la trame).
> Ce fichier est auto-suffisant : tout est là pour reprendre sans relire toute la session.

## 0. État du repo (point de départ)

- Branche `main`, **arbre propre, tout poussé**. HEAD au départ : `52e361c`.
- `git fetch` AVANT toute édition (Jonathan upload parfois via web — règle projet).
- Build : `pnpm build` (PATH pnpm Windows : `C:\Users\Morgan\AppData\Local\Microsoft\WinGet\Links`).
- Lefthook : **`pnpm exec prettier --write <fichiers>` AVANT `git add`** sinon commit échoue silencieusement. Header commit ≤ 100 car. Commits en français, convention sémantique.
- Auto-deploy Vercel sur push : https://studio-oliveira-site.vercel.app/

## 1. La trame home (source de vérité)

- Fichier : `_assets/modif finales/home page.jpg` — **9827×5726 px**, grille **5 colonnes × 4 lignes**.
- Lecture des colonnes : **col2 = page au repos** (haut→bas) ; col0/col1 = états (menu ouvert, survols, blur) ; col3/col4 = **annotations designer** (animations) + état coloré (topbar noire survol / violette clic).
- Les **traits rouges** = cadre écran 1920×1080 (servent à juger tailles/proportions ; PAS du design).
- **Spec détaillée déjà écrite** : `_brief/trames-finales-specs/home-page.md` — contient « ANALYSE APPROFONDIE 2026-06-04 » (états + annotations verbatim) + « DELTAS vs index.astro ».
- Pour re-générer des **tuiles HD par colonne** (si besoin de relire au pixel) :
  ```js
  // node, sharp dispo dans node_modules. Découpe la home en colonnes HD.
  const sharp = require('C:/Users/Morgan/MyApps/jonathan-oliveira-site/node_modules/sharp');
  const SRC = 'C:/Users/Morgan/MyApps/jonathan-oliveira-site/_assets/modif finales/home page.jpg';
  // 5 colonnes, bandes verticales ~1500px, scale largeur 1500 → lisible.
  ```
  (cf. recette `colslice.js` utilisée en session — col2 = la page réelle.)

## 2. Fichier home + ce qui est DÉJÀ fait

Fichier : `src/pages/index.astro` (gros, ~1450 lignes). Hero délégué à `src/components/astro/HeroSwipe.astro`.

Sections (ordre actuel, conforme trame) :

1. **Hero** = `<HeroSwipe />` slideshow — **INCHANGÉ** (annotation trame « HERO INCHANGE »). Wordmark « Studio / J. Oliveira » en **crème** bas-gauche.
2. **Bande Valeurs** (`#identite`, beige) : 3 lignes « Architecture Design Contexte / Expérientiel Signature / Art de vivre Vivant Immersif », sentence case, cascade mot-par-mot (`data-words-fade`).
3. **Studio** (`#studio-presentation`, beige) : paragraphe ADN verbatim (« Créé en 2021, le STUDIO J. OLIVEIRA… »), CTA **pill** « Découvrir le STUDIO » (contour→noir survol, magnétique), cascade mot-par-mot.
4. **Stats** (`#stats`, beige) : 3 cartes (+10 Etudes / +10 ans / +3 régions) + sous-textes verbatim. Cartes Études & ans = **cliquables, hover NOIR, curseur label, magnétiques, pill interne** (Découvrir les projets / le parcours).
5. **Bandeau transition** : « Chaque étude appartient à une **typologie de jardin** ».
6. **Typologies** (`#typologies`, beige) : **RANGÉE de 4 cartes** (carousel retiré), noms sentence case, **sous-types visibles** (domaine = 5 : Châteaux Manoirs/Front de mer/Domaines/Viticoles/Aras), **flou au survol** + curseur « Découvrir ».
7. **Footer** global beige.

- **Topbar** sitewide (CTA Démarrer pleine largeur, survol noir / clic violet) ; **menu** liseret périphérique ; **curseur carré**.

## 3. Écarts connus au PIXEL-PERFECT (à retravailler sur la home)

⚠️ La home est fidèle en structure/contenu/DA mais **PAS calibrée au pixel**. À revoir contre la trame col2 @1920×1080 :

- **Tailles de police / espacements / rayons** : posés « à l'œil » (clamps), jamais mesurés contre le cadre rouge. → mesurer et caler.
- **Section Stats** : la trame montre un layout précis (carte Études ~60% largeur, +10 ans + +3 empilées à droite, variantes claire/sombre). Mon implémentation = 3 cartes égales en grille. → revoir le **bento exact**.
- **Images** = placeholders pour les cartes typologies (elles utilisent `/public/typologies/0X-*.{webp,jpg}` existants — OK) MAIS le reste attend les vrais visuels Jonathan.
- **Wordmark hero** : vérifier casse « Studio / J. Oliveira » (sentence case) dans HeroSwipe.
- Annotations à re-vérifier dans col3/col4 (états survol/clic exacts, positions).

## 4. Méthode recommandée pour la reprise

1. `git fetch` + confirmer HEAD.
2. Relire `home-page.md` (section ANALYSE APPROFONDIE + DELTAS) + re-générer tuiles HD col2 de la home.
3. Demander à Morgan **ce qu'il veut précisément re-traiter** sur la home (calibration pixel ? bento stats ? autre détail ?) avant de coder.
4. Itérer par petits commits (build + prettier + push), valider sur Vercel à chaque étape.

## 5. Reste global hors home (rappel)

Site entier en DA finale (beige/noir/violet, sentence case, zéro rouge). Reste **bloqué sur images Jonathan** : brancher visuels /projets (3 accordéons `data-zoom-src=""` vides) + galeries studio/realisations/conceptions. Cleanup optionnel : token rouge mort, variant cursor `is-on-red` mort, 2 titres `.dem-steps__title` encore uppercase.
