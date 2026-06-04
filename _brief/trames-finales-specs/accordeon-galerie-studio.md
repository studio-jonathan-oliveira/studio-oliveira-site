# Spec — Accordéon « Galerie Studio » (page /studio)

> Source de vérité : trame Jonathan `accordeon-galerie-studio` (1978×10083 px, 1 col × 6 lignes).
> Tuiles lues r0→r5 (recouvrement 160 px). Aucun texte inventé ; verbatim ou `[ILLISIBLE]`.
> Les traits ROUGES = délimitation écran 1920×1080 (proportions/fold viewport), PAS du design.

---

## 0. Vue d'ensemble

La trame présente un **nouveau bloc accordéon « Galerie Studio »** destiné à la page `/studio`
(en plus de l'accordéon « Architectures » déjà en place). Elle illustre la galerie dans ses
**deux états** ainsi que le **lightbox d'agrandissement** :

1. **r0** — annotation de section + contexte topbar (logo `oliveira` + `MENU`, item `Démarrer un projet`). Fond NOIR.
2. **r1** — accordéon **OUVERT** : en-tête `Galerie Studio` + icône `×` (fermer) + début de la grille d'images (3 colonnes).
3. **r2** — suite de la grille ouverte (lignes 2-3-4 de vignettes).
4. **r3** — fin de la grille ouverte (dernières vignettes) puis **second accordéon FERMÉ** annoté.
5. **r4** — annotation `FLOU AU SURVOL + CLIC AGRANDISSEMENT` + en-tête `Réalisations` avec icône `+` (état FERMÉ) + une vignette floutée au survol avec bulle `Agrandir`.
6. **r5** — annotation `AGRANDISSEMENT DE L'IMAGE` + lightbox plein écran (image agrandie à gauche + `×` de fermeture).

**Annotation globale de la trame (r0, en haut, hors cadre noir) :**
`CLIC ACCORDEON GALERIE STUDIO` (texte beige clair sur blanc — légende designer).

---

## 1. Couleurs

| Rôle                         | Valeur                            | Usage observé                                            |
| ---------------------------- | --------------------------------- | -------------------------------------------------------- |
| Fond bloc / cartes accordéon | NOIR `#000000`                    | conteneur galerie, panneaux                              |
| Texte / titres / icônes      | BEIGE `#EDE6D6`                   | `Galerie Studio`, `Réalisations`, `+`, `×`, logo, `MENU` |
| Bulle « Agrandir »           | BEIGE `#EDE6D6` plein, texte NOIR | pastille hover sur vignette                              |
| Annotations designer         | BEIGE clair translucide sur blanc | légendes hors-cadre (non rendues)                        |

Aucune couleur **VIOLET `#e0afff`** n'apparaît dans CETTE trame (le violet du brief global
n'est pas utilisé ici — à signaler : la galerie reste strictement noir/beige).
**Aucune autre couleur** détectée. (Les vignettes sont des photos — couleurs propres aux médias.)

---

## 2. Contexte de page (r0)

- Cadre noir à coins arrondis (≈ carte arrondie en haut), occupant la largeur centrale.
- **Topbar** (verbatim) :
  - Gauche : logo wordmark `oliveira` (signature manuscrite blanche/beige + `®`).
  - Centre/haut : item de menu `Démarrer un projet` — **Bold**, beige, casse `Title Case`.
  - Droite : `MENU` (Bold, beige, UPPERCASE) suivi d'un trait horizontal (burger 1 trait).
- Le reste de r0 est noir (zone de scroll avant la galerie).

> Remarque : la topbar/menu est l'élément global existant (Header sitewide), reproduit ici
> par Jonathan pour situer le bloc. La spec galerie commence en r1.

---

## 3. Accordéon « Galerie Studio » — ÉTAT OUVERT (r1 → r3)

### 3.1 En-tête de l'accordéon (r1)

- Titre verbatim : **`Galerie Studio`**
  - Police : `var(--font-heading)` (Inter), **graisse Bold (700)**.
  - Casse : **Title Case** (« Galerie Studio », exactement comme l'accordéon Architectures
    respecte le Title Case Jonathan — PAS d'UPPERCASE).
  - Couleur : beige `#EDE6D6`.
  - Taille : grande (≈ titre de section, comparable aux titres accordéon).
  - Alignement : gauche.
- Icône à droite de l'en-tête : **`×`** (croix de FERMETURE) — beige, fine.
  - Indique que l'accordéon est **ouvert** (toggle `+` ↔ `×`).
- Une **ligne de séparation** (filet fin beige translucide) court sous l'en-tête, pleine largeur.

### 3.2 Grille d'images déployée (r1 bas → r3)

Disposition de l'état ouvert : **grille de vignettes en 3 colonnes**.

- **Colonnes : 3**, gouttières régulières, marges latérales sensibles (les vignettes ne touchent
  pas les bords du cadre).
- **Ratio vignette : portrait ≈ 3/4** (légèrement plus haut que large), uniforme.
- **Alignement vertical irrégulier (masonry léger / décalage)** : les colonnes ne sont pas
  parfaitement alignées en hauteur — certaines vignettes sont décalées verticalement (effet
  galerie magazine en quinconce). À confirmer : décalage modéré, pas un vrai masonry chaotique.
- **Nombre de vignettes total observé : ~16** (placeholders) réparties sur ~6 rangées :
  - r1 : rangée 1 (3 vignettes) + rangée 2 amorcée (3 vignettes).
    - Vignette (1,1) montre déjà la **bulle `Agrandir`** au survol (état hover capturé).
    - Vignette (1,2) = photo d'une plaque murale avec le logo `oliveira`.
  - r2 : rangées 2-3-4 (≈ 3 vignettes par rangée).
  - r3 : rangée finale — **3 vignettes en haut** puis une rangée incomplète :
    - une rangée à **3 vignettes**, puis une **dernière rangée partielle** (1 vignette seule
      en colonne 1 en bas de la galerie ouverte).

> **Placeholders images** (contenu = photos studio Jonathan, non décrites comme contenu éditorial) :
> ambiances végétales/biophiliques, scènes de chantier/atelier, portraits au travail, écrans
> de conception, plaque-logo `oliveira`, suspensions tressées, etc. → traiter comme placeholders
> `[IMAGE studio NN]` ; ce qui compte = **nombre, position, ratio, disposition**.

### 3.3 Comportement d'ouverture

- Clic sur l'en-tête (icône `+`) → l'accordéon se **déploie** et révèle la grille 3 colonnes.
- L'icône bascule `+` → `×`.
- Animation d'ouverture : **height animée** (cohérent avec l'accordéon Architectures existant :
  `height` mesurée 0 → scrollHeight, easing spring-out). La grille apparaît dans le panneau déployé.
- Fermeture : clic sur `×` → repli (height → 0), icône `×` → `+`.

---

## 4. Accordéon « Réalisations » — ÉTAT FERMÉ + hover vignette (r3 bas → r4)

### 4.1 En-tête fermé (r4)

- Titre verbatim : **`Réalisations`**
  - Police Inter **Bold (700)**, **Title Case**, beige.
  - **Taille notablement plus grande** ici (titre affiché en gros dans la maquette annotée —
    rendu d'illustration ; en pratique = même échelle que `Galerie Studio`).
- Icône à droite : **`+`** (PLUS — état FERMÉ).
- Filet de séparation beige translucide sous l'en-tête.

> Donc le système = **plusieurs accordéons empilés** (au moins `Galerie Studio` et `Réalisations`),
> chacun avec en-tête + `+`/`×`, contenant une grille de vignettes. Comportement attendu :
> single-open probable (cohérent avec ArchitecturesAccordion), à confirmer avec Jonathan.

### 4.2 Annotation animation (r4, verbatim)

**`FLOU AU SURVOL + CLIC AGRANDISSEMENT`** (légende designer, beige clair).

### 4.3 État hover d'une vignette (r4)

- La vignette survolée passe en **FLOU** (blur appliqué sur l'image).
- Au centre de la vignette : **bulle/pastille `Agrandir`**
  - Verbatim : `Agrandir`.
  - Forme : rectangle/pastille à **angles arrondis**, fond **beige `#EDE6D6` plein**.
  - Texte : NOIR, petite taille, **gras**, casse `Title Case`.
  - Centrée sur la vignette.
- Cette même bulle `Agrandir` est aussi visible sur la 1ère vignette de la galerie (r1) → le hover
  s'applique **à chaque vignette de chaque accordéon**.

### 4.4 Comportement (verbatim → traduction)

- **Survol image** → l'image se **floute** + apparition de la pastille `Agrandir`.
- **Clic image** → ouvre l'**agrandissement** (lightbox, cf. §5).

---

## 5. Lightbox / Agrandissement (r5)

### 5.1 Annotation (r5, verbatim)

**`AGRANDISSEMENT DE L'IMAGE`** (légende designer, beige clair).

### 5.2 Composition du lightbox

- **Overlay plein écran** sombre/noir (le cadre rouge = bord viewport 1920×1080).
- **Image agrandie** positionnée à **GAUCHE** (pas centrée plein écran) :
  - Vignette agrandie en **portrait** (ratio ≈ 3/4), **coins arrondis**, marge depuis le bord gauche.
  - L'image affichée = la photo cliquée, en net (plus de flou).
- **Icône de fermeture `×`** : beige, en **haut, décalée vers le centre/droite** par rapport à
  l'image (à ≈ ⅓ depuis la gauche, au-dessus du niveau haut de l'image agrandie).
  - Clic `×` → ferme le lightbox, retour à la galerie.
- Le reste de l'overlay (droite) est vide/sombre.

> À confirmer Jonathan : présence éventuelle d'une légende/texte à droite de l'image dans le
> lightbox (zone droite vide dans la trame → probablement réservée, ou simple overlay sombre).

---

## 6. Curseur & infos-suivent-curseur

- La trame ne montre **PAS explicitement** le nouveau curseur carré-arrondi-à-point dans ces tuiles.
- L'annotation `FLOU AU SURVOL + CLIC AGRANDISSEMENT` + la pastille `Agrandir` jouent le rôle
  d'**affordance de clic** sur la galerie (équivalent fonctionnel de l'« infos-suivent-curseur »).
- À signaler / confirmer : si le curseur custom est actif sitewide, il doit cohabiter avec la
  pastille `Agrandir` (ne pas doubler l'info). Aucune occurrence d'« infos haut-droite » visible ici.

---

## 7. Récapitulatif typographique

| Élément                                              | Police          | Graisse   | Casse      | Couleur                | Taille (relative)      |
| ---------------------------------------------------- | --------------- | --------- | ---------- | ---------------------- | ---------------------- |
| En-tête accordéon (`Galerie Studio`, `Réalisations`) | Inter (heading) | Bold 700  | Title Case | beige `#EDE6D6`        | grande (titre section) |
| Icône `+` / `×`                                      | Inter           | léger/fin | —          | beige                  | grande                 |
| Pastille `Agrandir`                                  | Inter (body)    | Bold      | Title Case | NOIR sur beige         | petite                 |
| Annotations designer                                 | —               | —         | UPPERCASE  | beige clair            | légende (non rendu)    |
| Filet séparateur                                     | —               | —         | —          | beige translucide ~28% | 1 px                   |

---

## 8. Synthèse mécanisme accordéon-galerie

1. Page `/studio` : pile d'accordéons à en-tête (`Galerie Studio`, `Réalisations`, …),
   chacun en NOIR, titre Bold Title Case beige + icône `+`/`×` à droite, filet séparateur.
2. **Fermé** = `+`. **Ouvert** = `×` + déploiement (height animée) d'une **grille 3 colonnes**
   de vignettes portrait (~3/4), disposition en léger quinconce.
3. **Hover vignette** = `FLOU AU SURVOL` (blur) + pastille `Agrandir` beige centrée.
4. **Clic vignette** = lightbox `AGRANDISSEMENT DE L'IMAGE` : overlay sombre, image agrandie
   à gauche (portrait, coins arrondis), `×` de fermeture en haut.

---

## DELTAS vs page/section actuelle

Fichiers actuels lus :

- `C:/Users/Morgan/MyApps/jonathan-oliveira-site/src/pages/studio.astro`
- `C:/Users/Morgan/MyApps/jonathan-oliveira-site/src/components/islands/ArchitecturesAccordion.tsx`

### Ce qui existe déjà (réutilisable)

- **Pattern accordéon** complet et adapté : `ArchitecturesAccordion.tsx` (single-open,
  `height` mesurée 0↔scrollHeight, icône `+` qui rotate à 45° → effet `×`, wave-reveal mots).
  Les styles `.studio-architectures__*` (summary, icon, collapse, panel) sont directement
  réexploitables pour un accordéon galerie.
- **Tokens couleur** noir/beige (`--color-black-deep`, `--color-cream`) déjà en place.
- **Pattern galerie quinconce** existe ailleurs dans le repo (galerie magazine /realisations,
  typologies) → source d'inspiration pour la grille 3 colonnes décalée.
- **Blur/flou hover** : déjà présent dans plusieurs composants (cf. grep `flou`/`blur` :
  `motion-enhance.ts`, `index.astro`, `HeroSwipe`, etc.).

### Ce qui MANQUE (à créer) — deltas concrets

1. **Aucune section « Galerie Studio » sur `/studio`.** La page comporte 4 sections (Bienvenue,
   Manifeste, Architectures, Parcours). → **Ajouter un bloc accordéon galerie** (probablement
   entre Architectures et Parcours, ou après Parcours — position à valider avec Jonathan).

2. **Aucun accordéon contenant une grille d'images.** L'accordéon actuel ne déploie que du
   texte (`description`). → Étendre/dupliquer `ArchitecturesAccordion` en un
   `GalerieAccordion` dont le panneau contient une **grille 3 colonnes de vignettes** au lieu
   d'un paragraphe.

3. **Icône `+` → `×` :** l'actuel utilise un `+` qui `rotate(45deg)` (visuellement un ×).
   La trame montre un **vrai `×`** quand ouvert. → Soit garder le rotate (rendu identique),
   soit basculer le glyphe `+`/`×` explicitement (préférence Jonathan : la trame dessine `×`).

4. **Hover flou + pastille `Agrandir` :** inexistant sur galerie studio. → Créer l'état hover
   (filter blur sur l'image + overlay pastille beige `Agrandir` centrée, texte noir Bold).
   Verbatim annotation : `FLOU AU SURVOL + CLIC AGRANDISSEMENT`.

5. **Lightbox d'agrandissement :** aucun composant lightbox sur `/studio`. → Créer un overlay
   `AGRANDISSEMENT DE L'IMAGE` : fond sombre plein écran, image agrandie alignée à gauche
   (portrait, coins arrondis), bouton `×` de fermeture en haut. Gérer ouverture au clic vignette,
   fermeture `×` / Échap / clic overlay, focus-trap a11y.

6. **Second accordéon « Réalisations » :** la trame suggère **plusieurs accordéons-galeries**
   empilés (`Galerie Studio` + `Réalisations`). → Prévoir une liste d'accordéons galerie
   (composant générique paramétré par `{ titre, images[] }`), single-open probable. À confirmer :
   le titre « Réalisations » sur `/studio` recoupe la page `/realisations` existante — clarifier
   avec Jonathan si c'est un accordéon ou un lien.

7. **Coins arrondis sur vignettes + lightbox :** la DA actuelle des galeries studio/typologies
   est en angles droits. La trame montre des **coins arrondis** sur la pastille `Agrandir` et
   l'image du lightbox. → Aligner le radius (à valider, possible incohérence avec le reste du site).

8. **Contenu images :** placeholders — Jonathan doit fournir les **photos de la galerie studio**
   (nombre, ordre). Logger dans `_brief/contenus-manquants.md` si non fournies.

### Points à confirmer avec Jonathan / Morgan

- Position du bloc galerie dans la pile `/studio`.
- Single-open ou multi-open pour les accordéons galerie.
- « Réalisations » = accordéon-galerie sur /studio OU lien vers la page /realisations ?
- Présence d'une légende texte à droite dans le lightbox.
- Radius arrondis : exception DA ou à généraliser.
- Curseur custom vs pastille `Agrandir` (éviter doublon d'affordance).
