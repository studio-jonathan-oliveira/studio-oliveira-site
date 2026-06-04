# Spec — Accordéon « Etudes et Conceptions »

> Trame Jonathan : `accordeon-etude-et-conception` — originale 1943 × 18365 px (très haute), 1 colonne × 11 lignes (recouvrement 160 px). Source de vérité totale.
> Cette trame documente **un composant accordéon** (un bloc « Etudes et Conceptions ») et son sous-mécanisme de **lightbox d'agrandissement d'image**. Elle se lit comme une planche pédagogique : elle montre successivement l'état OUVERT, l'état FERMÉ, l'interaction de survol, puis une série d'exemples de la modale agrandie.

---

## 0. Palette & conventions de la trame

- **Fond du bloc accordéon (ouvert/fermé)** : NOIR `#000000`.
- **Texte / titres / icônes** : BEIGE `#EDE6D6`.
- **Cartes-modales (« Approche projet ») fond** : BEIGE `#EDE6D6`, texte NOIR.
- **Annotations designer** (en beige clair pâle, hors maquette, NE PAS rendre) :
  - `CLIC ACCORDEON ETUDES ET CONCEPTIONS` (r0, en tête)
  - `FLOU AU SURVOL + CLIC AGRANDISSEMENT` (r3)
  - `AGRANDISSEMENT DE L'IMAGE` / `TEXTE + CADRE AIMANTÉ AU CURSEUR` (r4)
- **Traits ROUGES** = repères écran 1920×1080, proportions uniquement. Pas du design.
- **Aucune couleur VIOLET (#e0afff) détectée** dans cette trame (le violet annoncé en contexte global n'apparaît pas ici).
- **Curseur custom** : carré à angles arrondis + point, visible en bas-gauche des cartes « Approche projet » (petit carré beige + point) → confirme le nouveau curseur.

---

## 1. Topbar (contexte, r0) — déjà existant sitewide

En haut du bloc accordéon ouvert, on retrouve la topbar standard du site, sur fond noir :

- **Gauche** : logo `oliveira` (signature manuscrite beige) + `®`.
- **Centre** : `Démarrer un projet` — beige, **bold**, ~20 px, capitale initiale seulement.
- **Droite** : `MENU` (bold, espacé) + icône hamburger (1 trait + 1 trait, beige).

Ce n'est pas l'objet de la trame (topbar globale déjà en prod). Documenté pour situer le contexte.

---

## 2. ÉTAT OUVERT de l'accordéon (r0 bas → r2)

L'annotation `CLIC ACCORDEON ETUDES ET CONCEPTIONS` indique : au clic sur l'en-tête, l'accordéon se déploie et révèle ci-dessous.

### 2.1 En-tête de l'accordéon (ouvert)

- Conteneur **noir**, **coins arrondis** généreux (gros radius, ~40–48 px) en haut.
- **Titre** : `Etudes et Conceptions`
  - Police **serif display** (même famille que les grands titres du site — Gloock/heading), beige `#EDE6D6`.
  - Casse : **Capitales initiales** (« Etudes et Conceptions », pas tout en majuscules).
  - Très grande taille (~64–72 px à l'échelle trame), graisse regular, **word-spacing large** (lettres aérées).
  - Aligné **à gauche**, dans le padding interne du bloc.
- **Icône d'état (ouvert)** : `×` (croix de fermeture) beige, **alignée à droite**, à hauteur du titre. → Ouvert = `×` (cliquer pour fermer).

### 2.2 Contenu déployé — GRILLE de cartes-projets (r1 → r2)

Sous l'en-tête, fond noir, une **grille 2 colonnes** de cartes-projets (vignettes paysage).

- **Disposition** : 2 colonnes, gouttière généreuse (~40–60 px), lignes empilées verticalement. Cartes en **quinconce léger** (la colonne droite est décalée vers le bas d'environ une demi-hauteur de carte par rapport à la gauche → effet masonry/décalé).
- **Format des vignettes** : rectangulaires paysage (~16:10), coins légèrement arrondis, **[IMAGE — placeholder]** (rendus Twinmotion photoréalistes de jardins).
- **Overlay texte** sur chaque vignette (coin **haut-gauche** de l'image, texte beige par-dessus la photo, 4 lignes) :
  - Ligne 1 : **type de projet** (regular)
  - Ligne 2 : **sous-titre / nature** (regular)
  - Ligne 3 : `Conception, ANNÉE`
  - Ligne 4 : **lieu**
  - Police : sans-serif légère (Inter / la « light » du site), beige, interligne serré.
- **Badge `Agrandir`** : petite **pastille beige arrondie** (carré à coins très arrondis, ~64×64) posée **en bas-gauche** de chaque vignette, contenant le mot `Agrandir` en **noir, bold, petit** (~13 px). C'est l'affordance de clic-agrandissement.

#### Cartes listées (verbatim, ordre haut→bas, gauche→droite) :

| #     | Ligne 1 (type)        | Ligne 2 (nature)                                     | Ligne 3               | Ligne 4 (lieu)                                                           |
| ----- | --------------------- | ---------------------------------------------------- | --------------------- | ------------------------------------------------------------------------ |
| 1 (G) | `Coeur urbain`        | `Jardin de ville`                                    | `Conception, 2024`    | `Corrèze`                                                                |
| 2 (D) | `Frange urbaine`      | `Jardin familial`                                    | `Conception, 2026`    | `Corrèze`                                                                |
| 3 (G) | `Domaine & Caractère` | `Domaine familial`                                   | `Conception, 2023`    | `Corrèze`                                                                |
| 4 (D) | `Jardin Forêt`        | `Projet Public`                                      | `Conception, 2023`    | `Polyclinique Chénieux` / `Limoges` _(5 lignes ici : lieu sur 2 lignes)_ |
| 5 (G) | `Micro urbain`        | `Patio extérieur`                                    | `Conception, 2022`    | `Corrèze`                                                                |
| 6 (D) | `Airbnb atypique`     | `Collab. archi. d'intérieur`                         | `Co-conception, 2025` | `Agde`                                                                   |
| 7 (G) | `Airbnb atypique`     | `Conception, 2026` _(pas de ligne nature distincte)_ | —                     | `Valenciennes`                                                           |
| 8 (D) | `Micro urbain`        | `Terrasse d'appartement`                             | `Conception, 2021`    | `Haute-Vienne`                                                           |
| 9 (G) | `Domaine & Caractère` | `Château classé XIIIs.`                              | `Conception, 2024`    | `Corrèze`                                                                |

> Note : l'ordre exact des paires gauche/droite suit le décalage quinconce ; le designer liste 9 projets au total. Reproduire l'ordre du tableau.

---

## 3. ÉTAT FERMÉ de l'accordéon + interaction survol (r3)

Annotation : `FLOU AU SURVOL + CLIC AGRANDISSEMENT`.

### 3.1 En-tête de l'accordéon (fermé)

- Même conteneur noir, **coins arrondis** (haut + bas, le bloc est une « pilule » fermée).
- **Titre** identique : `Etudes et Conceptions` (serif display, beige, ~64–72 px, capitales initiales, word-spacing large), aligné gauche.
- **Icône d'état (fermé)** : `+` beige, alignée à droite. → Fermé = `+` (cliquer pour ouvrir).

### 3.2 Mécanique d'icône

- **Fermé → `+`** ; **Ouvert → `×`**.
- L'icône bascule `+ ↔ ×` au toggle (rotation/cross-fade probable, comme l'accordéon studio existant qui fait tourner le `+` à 45°). Ici la trame montre deux glyphes distincts (`+` et `×`) → préférer un **morph/swap `+`→`×`**.

### 3.3 Comportement de survol de carte (`FLOU AU SURVOL`)

Sous l'en-tête fermé, r3 montre **une seule carte** isolée (Coeur urbain) en démonstration :

- Au **survol** d'une vignette : la photo passe en **flou** (blur), l'overlay texte (type/nature/année/lieu) **reste net** par-dessus, et le badge `Agrandir` (pastille beige, mot noir bold) devient l'appel à l'action.
- **Clic** sur la carte / `Agrandir` → ouverture de la **lightbox agrandie** (section 4).

---

## 4. LIGHTBOX « AGRANDISSEMENT DE L'IMAGE » (r4 → r10)

Annotation : `AGRANDISSEMENT DE L'IMAGE` + `TEXTE + CADRE AIMANTÉ AU CURSEUR`.

Au clic sur `Agrandir`, l'image s'ouvre en **grand format** (modale / lightbox plein bloc), fond clair (la trame sort du bloc noir : fond blanc/cream autour).

### 4.1 Structure de la modale agrandie

- **Image grand format** : large vignette paysage, **coins arrondis** (~24–32 px), occupe la quasi-totalité de la largeur. **[IMAGE — placeholder]**.
- **Carte texte « Approche projet »** superposée **par-dessus l'image**, posée en **coin haut-gauche** (parfois positionnée plus bas selon l'exemple) :
  - Fond **beige `#EDE6D6`**, coins **arrondis** (~16–20 px), padding interne confortable.
  - **Titre** : `Approche projet` — **noir, bold**, sans-serif, ~22 px, casse capitale initiale, **word-spacing un peu large** (« Approche projet »).
  - **Corps** : paragraphe(s) **justifié(s)** (texte aligné des 2 côtés, espaces inter-mots variables), noir/gris foncé, sans-serif léger, petite taille (~13–14 px), interligne aéré (~1.6).
- **Bouton fermeture** : `×` beige, **coin haut-droit** de la modale (hors carte texte, sur le fond clair au-dessus de l'image).
- **Curseur custom** visible : petit **carré beige arrondi + point** en bas-gauche de la carte (signature du nouveau curseur).

### 4.2 Annotation « TEXTE + CADRE AIMANTÉ AU CURSEUR »

Comportement attendu de la lightbox :

- Le **cadre** de l'image agrandie et/ou la **carte texte** sont **aimantés au curseur** (effet magnétique / parallax léger : la carte ou le cadre suit/s'oriente vers la position du curseur, façon « infos suivent le curseur » du contexte global).
- Confirme l'animation **infos-suivent-curseur** mentionnée en contexte global.

### 4.3 Texte « Approche projet » — verbatim lisible (exemple r4, projet Micro urbain / Terrasse Limoges)

> **Approche projet**
>
> Conception d'une terrasse en hauteur, enclavée entre la batisse d'un appartement architectural en plein centre de Limoges.
> Mur végétalisé structuré pour atténuer les sons de la route, composition végétale des bacs existants, disposition des pots arborés et choix du mobiliers ont été les directives de ce projet.

_(Texte justifié. Orthographe verbatim conservée : « batisse », « mobiliers ».)_

### 4.4 Autres occurrences de la lightbox (r5 → r10)

La trame enchaîne **plusieurs exemples** de la modale agrandie, chacun = 1 image grand format + 1 carte `Approche projet` + `×`. Le corps de texte de ces autres exemples est **[ILLISIBLE]** à l'échelle de la trame (texte gris très petit, non déchiffrable) → placeholder. Liste des occurrences observées :

- r5 : 2 modales empilées (piscine + jardin pluie) — texte `Approche projet` présent, corps [ILLISIBLE].
- r6 : modale jardin en pente + enfant au ballon ; puis modale château/statue. Corps [ILLISIBLE].
- r7 : modale jardin contre-jour rayons + passants ; début modale murs végétal/lierre. Corps [ILLISIBLE].
- r8 : modale patio gazon + suspension osier ; modale intérieur bureau/plantes. Corps [ILLISIBLE].
- r9 : modale couloir terracotta (carte texte ici **en haut-droite**, variation de position). Corps [ILLISIBLE].
- r10 : fin couloir terracotta ; grande modale **allée de palmiers / jardin méditerranéen** (`×` haut-droit), carte `Approche projet` haut-gauche. Corps [ILLISIBLE].

> Toutes les modales partagent la **même grammaire** : image arrondie plein-format + carte beige `Approche projet` (titre bold noir + corps justifié) + bouton `×` beige haut-droit + curseur carré. La position de la carte varie (haut-gauche majoritaire, parfois haut-droite) — probablement **alternance** ou **placement aimanté selon le curseur**.

---

## 5. Récapitulatif du mécanisme (à implémenter)

1. **Bloc accordéon** « Etudes et Conceptions » (section noire, coins arrondis).
   - État fermé : en-tête seule, icône `+` à droite.
   - Clic en-tête → ouverture (anime la hauteur, comme l'accordéon studio existant), icône → `×`.
2. **Contenu ouvert** : grille 2 colonnes en quinconce de **9 cartes-projets** (vignette + overlay texte 4 lignes haut-gauche + badge `Agrandir` bas-gauche).
3. **Survol carte** : photo → **flou**, overlay reste net, `Agrandir` mis en avant.
4. **Clic `Agrandir`** → **lightbox** : image agrandie arrondie + carte beige `Approche projet` (titre bold noir + corps **justifié**) + bouton `×` haut-droit.
5. **Lightbox** : carte/cadre **aimantés au curseur** (effet magnétique). Curseur = carré arrondi + point.
6. **Fermeture lightbox** : `×` haut-droit. **Fermeture accordéon** : `×` en-tête.

### Typographie résumée

- Titre accordéon `Etudes et Conceptions` : serif display (Gloock/heading), beige, ~64–72 px, capitale initiale, word-spacing large.
- Overlay cartes (type/nature/`Conception, AAAA`/lieu) : sans-serif light, beige, interligne serré.
- Badge `Agrandir` : sans-serif bold, noir sur pastille beige, ~13 px.
- Carte `Approche projet` titre : sans-serif bold, noir, ~22 px.
- Carte `Approche projet` corps : sans-serif light, noir, ~13–14 px, **justifié**, interligne ~1.6.

### Couleurs résumées

- Accordéon (header + zone grille) : fond `#000000`, texte/icônes `#EDE6D6`.
- Overlay sur photos : texte `#EDE6D6`.
- Cartes `Approche projet` + badge `Agrandir` : fond `#EDE6D6`, texte `#000000`.

---

## DELTAS vs page actuelle

**Statut : ce composant N'EXISTE PAS dans le code. À CRÉER.** Aucune page ni island ne reproduit l'accordéon « Etudes et Conceptions » de la trame.

Inventaire de l'existant pertinent :

- **`src/pages/conceptions/index.astro`** : page placeholder. Hero « Études en cours, RENDUES IMMERSIVES » + bande keywords + section liste vide (fetch Sanity `section: 'conceptions'`, état vide = encart « En préparation »). **Aucune grille de cartes, aucun accordéon, aucune lightbox.** Le contenu (9 projets, overlays, années, lieux) de la trame n'y figure pas.
- **`src/components/islands/ArchitecturesAccordion.tsx`** : accordéon React single-open existant, mais **texte seul** (titre + paragraphe wave-reveal). Sert de **base technique** (mesure de hauteur via ref + `useLayoutEffect`, anime `height` 0↔scrollHeight, icône `+`). Réutilisable pour la mécanique d'ouverture mais **ne gère ni grille de cartes, ni flou-survol, ni lightbox, ni icône `+`→`×`**.
- **`src/pages/studio.astro`** : héberge `ArchitecturesAccordion` (section « Architectures », thème rouge). C'est le **candidat d'emplacement** le plus probable du nouveau bloc « Etudes et Conceptions » (topbar identique visible en r0, siblings de trames `accordeon-galerie-studio` et `accordeon-realisations` → suite de blocs accordéon d'une même page, vraisemblablement /studio ou une nouvelle page « galerie/portfolio »).
- **Cartes-projets / overlays** : le pattern « vignette + overlay 4 lignes + badge » existe en germe sur `realisations/index.astro` (galerie quinconce) mais sans badge `Agrandir`, sans flou-survol, sans lightbox `Approche projet`.
- **Lightbox / modale d'agrandissement** : **inexistante** dans le repo. Pas de composant lightbox, pas de « cadre aimanté au curseur » sur image.
- **Effet flou-au-survol d'image** : **inexistant**.
- **Curseur carré custom** : `CustomCursor.astro` existe → vérifier qu'il porte la variante carré-arrondi-+-point (signature trame).

### À produire pour matcher la trame

1. Nouvel island React `EtudesConceptionsAccordion` (ou extension d'`ArchitecturesAccordion`) : header noir coins arrondis, titre serif `Etudes et Conceptions`, icône **`+` (fermé) → `×` (ouvert)**, animation hauteur.
2. Grille 2 colonnes quinconce de **9 cartes** (données = tableau §2.2), overlay 4 lignes haut-gauche, badge `Agrandir` bas-gauche.
3. Effet **flou au survol** de la vignette (overlay net).
4. **Lightbox** au clic `Agrandir` : image agrandie arrondie + carte beige `Approche projet` (titre bold + corps justifié) + `×` haut-droit + **cadre/carte aimantés au curseur**.
5. Contenu éditorial « Approche projet » : seul le texte du projet Limoges (§4.3) est lisible dans la trame → **les 8 autres corps sont [À FOURNIR PAR JONATHAN]** (logger dans `_brief/contenus-manquants.md`).
