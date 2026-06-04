# Spec TRANSVERSALE UI — partis-pris sitewide (trames finales 2026-06-04)

Source de référence unique pour construire les éléments d'UI partagés. À appliquer
sur TOUTES les pages (sauf exceptions notées).

## Palette (verrouillée)

- NOIR `#000000` · BEIGE `#EDE6D6` · VIOLET `#e0afff`. Rouge = LEGACY en retrait.
- Le rouge sur les trames = gabarit écran 1920×1080, jamais du design.

## Angles arrondis — GÉNÉRALISÉS (retour Morgan 2026-06-04)

Parti-pris fort : presque toutes les surfaces/séparateurs sont **arrondis**.

- **Accordéons** : la carte/le trait qui délimite chaque ligne d'accordéon est
  **arrondi à droite** (extrémité droite du séparateur courbée ; le bloc se
  termine en coin arrondi). S'applique : FAQ typologies, accordéons /studio,
  3 accordéons /projets, accordéons /demarrer.
- **Footer** : carte à **coins HAUTS arrondis** qui remonte sur le fond.
  Footer = **BEIGE `#EDE6D6` + texte/logo NOIR** partout, SAUF `/demarrer-un-projet`
  (noir + violet). Logo en **tuile carrée arrondie** (noire, wordmark blanc).
- **Pastilles** (« Agrandir », CTA pill) : rounded-square / pill.
- **Vignettes galerie / cartes projets** : coins arrondis.
- **Lightbox** : image agrandie à coins arrondis.
- Radius généreux (type `--radius-lg` ≈ 1rem, voire plus sur grandes cartes/footer).
  À calibrer visuellement sur trame ; ne PAS rester sur les petits radius actuels.

## Curseur custom (fait — commit aa14f9d)

Carré à angles arrondis (radius ~7px) + petit point décalé bas-droite. 3 couleurs
selon le fond (ink sur clair / cream sur noir / ink sur violet).

## Accordéons — icône & comportement

- Icône **`+`** (fermé) → **`×`** (ouvert). 3 couleurs selon fond.
- **Single-open** : ouvrir un accordéon **referme automatiquement** le précédent
  (annotation /studio : « cliquer sur le titre suivant reforme celui du dessus
  automatiquement »).
- Animation d'ouverture = celle existante (height mesurée JS), + apparition
  **wavy/vague** du titre et des textes **pilotée par le scroll** (apparition/disparition).
- Sur certains accordéons : **flou de l'image de fond au clic** (annotation
  « FLOU IMAGE AU CLIC DE L'ACCORDEON » sur /demarrer).

## Animation « flou au survol + action au clic » (à construire — réutilisable)

Sur vignettes galerie / cartes projets :

- Survol → l'image se **floute** (coins arrondis conservés) + apparition d'une
  **pastille beige rounded-square « Agrandir »** (texte noir gras), positionnée
  **en haut à droite À L'INTÉRIEUR de la vignette** (galerie studio) ou centrée
  selon le contexte.
- Clic → **lightbox** : image agrandie à coins arrondis, alignée à gauche, `×`
  beige en haut. (Sur cartes typologies home : clic → navigation, label « Découvrir ».)

## Animation « infos aimantées au curseur » (à étendre — existe déjà)

Au survol de certains éléments, un bloc d'info apparaît **en haut-droite du
curseur** et le suit (lerp). Annotation « TEXTE + CADRE AIMANTÉ AU CURSEUR ».
Déjà implémenté (`cursor-tooltip` dans CustomCursor.astro) — à adapter couleur
(violet/ink, plus de rouge) et étendre aux nouveaux contextes.

## Topbar = CTA « Démarrer un projet » pleine largeur

- La topbar entière EST le CTA **« Démarrer un projet »** (Bold, casse mixte,
  centré). Logo `oliveira®` à gauche, **MENU + burger** (2 traits) à droite.
- États (annotation « SURVOL + CLIC TOP BARRE ») : repos / **survol → violet**
  (pilule/fond violet) / **clic → `/demarrer-un-projet`**.
- **Masquée pendant le hero plein écran**, devient fixe ensuite.
- Curseur custom visible dessus.

## Casse & typo

- Fin des UPPERCASE systématiques → **sentence case** (Première lettre majuscule,
  reste minuscule). Annotation : « passer tout en minuscule avec première lettre
  en majuscule uniquement ».
- Police = Inter (déjà en place). Graisses : Black/Bold (titres, labels) vs
  Light/Regular (corps).

## Hero home = INCHANGÉ

Annotation « HERO INCHANGE » → garder le **slideshow swipe existant** (pas de
refonte du hero home). L'animation texte « à conserver comme l'existant ».
