# Spec — Trame « accordeon realisations » (page /realisations)

> Source : maquette Jonathan, originale 2181 × 10081 px, 1 colonne × 6 lignes (tuiles r0→r5, recouvrement 160 px).
> Couleurs de référence projet : **NOIR #000000**, **BEIGE #EDE6D6**, **VIOLET #e0afff**.
> Traits **ROUGES** = repère écran 1920×1080 (proportions/fold), **PAS** du design.
> Règle : aucun texte inventé (verbatim ou `[ILLISIBLE]`). Images = placeholders.

---

## 0. Annotations designer (VERBATIM)

Texte beige clair (#EDE6D6) en gros titre, hors maquette, décrivant le comportement :

- En haut de r0 : **« CLIC ACCORDÉON RÉALISATIONS »**
- Au-dessus du bloc fermé (bas r3) : **« FLOU AU SURVOL + CLIC AGRANDISSEMENT »**
- Au-dessus de l'overlay plein écran (r5) : **« AGRANDISSEMENT DE L'IMAGE »**

Ces trois libellés décrivent les 3 états/comportements documentés par la trame :

1. le **clic** sur la barre d'accordéon « Réalisations » → déroulé,
2. le **survol** d'une carte (flou) + **clic** (agrandissement),
3. l'**image agrandie** en overlay plein écran (lightbox).

---

## 1. Vue d'ensemble de la page

La page /realisations est construite comme **UN accordéon unique** (pas une grille statique) :
une **barre/ligne d'en-tête noire « Réalisations »** qui, au **clic**, déroule une grande
**galerie de cartes projets** sur fond noir. C'est le même langage d'accordéon que le reste du
site (studio, étude & conception), appliqué à la liste des réalisations.

Trois états documentés :

| État            | Tuiles                                               | Description                                                                      |
| --------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------- |
| **A. Fermé**    | bas r3, r4                                           | Barre noire arrondie « Réalisations » + icône **`+`** à droite. Rien d'autre.    |
| **B. Ouvert**   | r1, r2, r3 (+ r4/r5 = variante avec moins de cartes) | Titre « Réalisations » + **`✕`** à droite. Galerie de cartes projets déployée.   |
| **C. Lightbox** | r5                                                   | Une image cliquée agrandie en **overlay plein écran** avec **`✕`** de fermeture. |

Fond global : **NOIR #000000** sur toute la zone accordéon. Texte : **BEIGE #EDE6D6**.

---

## 2. En-tête de la page (haut r0–r1)

- Tout en haut (r0), on aperçoit la **topbar du site** sur fond noir :
  - **Logo « oliveira »** en beige, écriture manuscrite/script (signature studio), avec un petit
    `®` ou `.` en exposant à droite. Position : haut-gauche.
  - À droite : **« MENU »** en gras beige UPPERCASE + **icône hamburger** (deux traits horizontaux).
  - Un **bloc/bouton flottant noir arrondi** centré, contenant **« Démarrer un projet »**
    (beige, gras, casse mixte). C'est le CTA flottant / barre sticky du haut (coins très arrondis,
    fond noir pur, détaché du bord). Largeur ≈ pleine largeur moins marges.

> Le repère rouge en r0 cale ce bloc supérieur sur le premier viewport 1920×1080.

---

## 3. État A — Accordéon FERMÉ

Visible en **bas de r3** et en **haut de r4**.

- **Barre / panneau noir** à coins fortement arrondis (rayon généreux, ~24–32 px), occupant la
  pleine largeur de la zone de contenu (avec marge latérale).
- **Titre à gauche : « Réalisations »**
  - Police : **heading du site (serif/display, type Gloock-like display)** — NON, ici c'est le
    grand titre display beige. Graisse forte, casse Capitale initiale (« Réalisations »).
  - Taille : très grande (titre de section, ~clamp 2.5–3.5 rem).
  - Couleur : **BEIGE #EDE6D6**.
- **Icône à droite : `+`** (plus)
  - Beige, fine, alignée verticalement au centre de la barre, en bord droit.
  - Sémantique : **`+` = déplier**.
- Au survol de la barre → curseur custom (cf. §7) ; au **clic** → déroulé (état B).

---

## 4. État B — Accordéon OUVERT (galerie déployée)

C'est le cœur de la trame (r1 → r3).

### 4.1 En-tête de l'accordéon ouvert

- À gauche : **« Réalisations »** (même titre display beige, grand).
- À droite : **`✕`** (croix) beige — sémantique **`✕` = fermer**. Remplace le `+` de l'état fermé.

### 4.2 Disposition de la galerie

Grille de **cartes projets** sur fond noir, en **3 colonnes** (desktop 1920) :

- Cartes **rectangulaires verticales** (ratio ≈ 4/5 portrait) — photos de projets réels.
- Espacement : gouttières moyennes, rythme régulier.
- Chaque carte montre **une photo** + un **bloc d'infos texte superposé/accolé** (cf. 4.3) +
  un **bouton « Agrandir »** (cf. 4.4).
- Les rangées s'enchaînent verticalement (r1 → r2 → r3), plusieurs rangées de 3 cartes.
- Certaines cartes apparaissent **floutées** (état survol simulé dans la maquette, cf. annotation
  « FLOU AU SURVOL »).

### 4.3 Bloc d'infos par carte (VERBATIM)

Petit bloc texte beige (police body/mono, petit corps, interligne serré, casse mixte), placé
**en superposition sur la photo** (haut-droit de la carte) OU accolé. Structure répétée sur 4–5
lignes : **Titre du projet / Lieu-Pièce / (Réalisation, ANNÉE) / Ville**.

Projets identifiés dans la trame (verbatim, ponctuation/casse conservées) :

1. **Airbnb atypique**
   **Jungle Room**
   **Chammartz Suite**
   **Réalisation, 2024**
   **Uzerche**
   _(NB : l'orthographe oscille « Chammartz » / « Chammartz Suite » selon la tuile — à confirmer Jonathan)_

2. **Façade végétal**
   **Café de Paris**
   **Brasserie**
   **Réalisation, 2025**
   **Brive**

3. **Glycine artificielle 5m**
   **Atelier Elite Coiffure**
   **Réalisation, 2022**
   **Brive**

4. **Plafond aporé** _(probablement « Plafond paré » ou « ajouré » — [À CONFIRMER])_
   **Atelier Elite Coiffure**
   **Réalisation, 2026**
   **Brive**

5. **Mur en bouteille floral**
   **Café de Paris**
   **Brasserie**
   **Réalisation, 2025**
   **Brive**

6. **Jungle Work Box**
   **Schmidt Cuisine**
   **Réalisation, 2025**
   **Brive**

7. **Airbnb atypique**
   **Jungle Room**
   **Pool Suite** _(lit « ... Suite », 1ère ligne lieu [ILLISIBLE partiel])_
   **Réalisation, 2025**
   **Roanne**

8. **Mur végétalisé**
   **YG coiffure**
   **Réalisation, 2023**
   **Objat**

9. **Jardinet tropical**
   **Réalisation, 2021**
   **Limoges**

> Format d'info standardisé : `[Concept / geste]` · `[Lieu / établissement]` · `[Type]` ·
> `Réalisation, [année]` · `[Ville]`. Plusieurs cartes partagent le même projet
> (Café de Paris, Atelier Elite Coiffure, Jungle Room) mais avec un geste/photo différent.

### 4.4 Bouton « Agrandir »

- Sur **chaque carte** : un petit **bouton/pastille beige (#EDE6D6) à coins arrondis** posé sur la
  photo (généralement coin **bas-gauche** de la carte).
- Libellé verbatim : **« Agrandir »** (texte NOIR sur fond beige, petit corps, gras).
- Action : **clic → ouvre l'image en overlay plein écran** (état C, cf. annotation
  « CLIC AGRANDISSEMENT »).

---

## 5. État C — Lightbox / Agrandissement (r5)

Annotation : **« AGRANDISSEMENT DE L'IMAGE »**.

- **Overlay plein écran** : une **grande image projet** (ici la photo Jungle Room violette :
  ambiance jungle intérieure, lampe boule ambrée, baignoire d'angle, murs violet/lavande, fauteuil
  pouf bouclé — `[placeholder image projet, ratio ~16/9 paysage]`).
- L'image occupe quasiment tout l'écran, **coins arrondis**, posée sur fond noir.
- **`✕`** beige en **haut-droite** de l'image = fermeture du lightbox.
- Repère rouge cale l'image sur le viewport 1920×1080.
- Pas de légende texte visible sur l'overlay (image seule + croix).

---

## 6. Variante « accordéon ouvert court » (r4)

En r4, on revoit l'en-tête **« Réalisations » + `+`** (donc état avec icône `+`) MAIS avec **une
seule carte floutée** dessous (Airbnb atypique / Jungle Room / Chammartz Suite / 2024 / Uzerche),
photo très floutée + bouton « Agrandir ».

→ Illustre l'**état de survol/flou** : la carte sous le pointeur passe en **flou** (preview du
comportement « FLOU AU SURVOL »). Le panneau garde ses coins arrondis et son fond noir.

---

## 7. Curseur custom (rappel transversal)

- Forme : **carré à angles arrondis + point** (3 couleurs selon contexte).
- Comportement **infos-suivent-curseur** (tooltip haut-droite) : très probablement actif au survol
  des cartes (afficher titre/lieu/année qui suit le pointeur) — cohérent avec le bloc d'infos.
- Sur fond noir, le curseur passe en variante claire (beige).

---

## 8. Animations (VERBATIM + déduit)

| Annotation designer                          | Élément                | Comportement                                                                                                     |
| -------------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **« CLIC ACCORDÉON RÉALISATIONS »**          | Barre « Réalisations » | Clic sur la barre (icône `+`) → **déroulé de l'accordéon** révélant la galerie de cartes. Re-clic (`✕`) → repli. |
| **« FLOU AU SURVOL + CLIC AGRANDISSEMENT »** | Carte projet           | **Survol → l'image se floute** (blur). **Clic (bouton « Agrandir »)→ agrandissement** (lightbox).                |
| **« AGRANDISSEMENT DE L'IMAGE »**            | Lightbox               | Image ouverte en **overlay plein écran**, `✕` haut-droite pour fermer.                                           |
| (transversal) infos-suivent-curseur          | Cartes                 | Tooltip d'infos qui suit le curseur (probable).                                                                  |

Mécanique d'accordéon attendue (cohérente avec le DS du site) : **hauteur JS-measured**
(`scrollHeight`), transition open/close, icône `+` ↔ `✕`.

---

## 9. Typographie & couleurs (récap)

- **Fond accordéon / page** : NOIR #000000.
- **Titre « Réalisations »** : display heading beige, grande taille, gras, capitale initiale.
- **Infos cartes** : beige #EDE6D6, petit corps (body/mono), interligne serré, casse mixte.
- **Bouton « Agrandir »** : fond beige #EDE6D6, texte noir, pastille arrondie, petit gras.
- **Icônes** `+` / `✕` : beige, fines, en bord droit de la barre.
- **Logo / MENU / Démarrer un projet** : beige sur noir.
- **VIOLET #e0afff** : présent uniquement dans les **photos** (ambiance Jungle Room), pas en UI.
- Aucune couleur UI hors palette détectée.

---

## DELTAS vs page actuelle

Page actuelle : `c:/Users/Morgan/MyApps/jonathan-oliveira-site/src/pages/realisations/index.astro`
(+ `[slug].astro` pour le détail projet). Composants accordéon existants :
`FaqAccordion.tsx`, `ArchitecturesAccordion.tsx` (JS-measured height). Données :
`src/data/mock-projects.ts`. Curseur : `CustomCursor.astro`.

**Écarts structurels majeurs :**

1. **Pas d'accordéon du tout.** La page actuelle est une **grille statique 2 colonnes**
   (`<ul class="grid ... md:grid-cols-2">`) de cartes liens — la trame demande **UN accordéon**
   (barre « Réalisations » fermée avec `+`, ouverte avec `✕`) qui **déroule** la galerie.
   → À introduire : composant accordéon (réutiliser le pattern `ArchitecturesAccordion`/
   `FaqAccordion` height JS-measured, icône `+`/`✕`).

2. **Thème inversé.** Actuel = `variant="cream"` (fond crème #EDE6D6, texte forest/ink).
   Trame = **fond NOIR, texte BEIGE**. Inversion complète du thème de la page.

3. **Hero différent.** Actuel : gros hero « Projets / ABOUTIS. » + paragraphe + bande keywords
   (« Projets · Aboutis · Livrés · Contexte · Réel »). La trame ne montre **pas** ce hero — elle
   montre directement le CTA flottant « Démarrer un projet », le logo, MENU, puis la barre
   accordéon « Réalisations ». → Hero à repenser/supprimer ou réduire.

4. **3 colonnes vs 2.** Trame = **grille 3 colonnes** (desktop). Actuel = 2 colonnes
   (`md:grid-cols-2`). → Passer à 3.

5. **Bloc d'infos sur la photo.** Trame = infos (titre/lieu/type/réalisation+année/ville)
   **superposées sur la photo** (haut-droit) en petit corps beige. Actuel = infos **sous** la
   photo (`typologyLabel · location · year` mono + `<h2>` dessous). → Repositionner en overlay.

6. **Bouton « Agrandir » + lightbox MANQUANTS.** Trame = pastille beige « Agrandir » sur chaque
   carte → **lightbox plein écran avec `✕`**. Actuel = la carte est un simple **lien** vers
   `/realisations/[slug]` (page détail), **pas** de lightbox. → Ajouter overlay d'agrandissement
   d'image (carré/croix de fermeture) — nouveau comportement à construire.
   _(Décision produit à trancher avec Morgan : lightbox image SEULE (trame) vs lien page détail
   (actuel). La trame penche clairement « lightbox ».)_

7. **Flou au survol MANQUANT.** Trame = `blur` sur l'image au survol. Actuel = `scale(1.02)`
   (`group-hover:scale-[1.02]`). → Remplacer/ajouter un filtre `blur` au hover.

8. **Données / verbatim.** Les titres trame (Airbnb atypique·Jungle Room·Chammartz Suite·2024·
   Uzerche ; Café de Paris Brasserie·2025·Brive ; Atelier Elite Coiffure·2022 & 2026·Brive ;
   Schmidt Cuisine·2025·Brive ; Jungle Room·Roanne·2025 ; YG coiffure·Objat·2023 ; Jardinet
   tropical·Limoges·2021) **ne matchent pas** les mocks actuels (Jungle Room — Agde 2024,
   Café de Paris [à valider], Schmit Cuisine, Airbnb…). Lieux/années/orthographes divergent
   fortement. → **mock-projects.ts à reseed sur le verbatim trame** (et faire valider l'orthographe
   « Chammartz », « Plafond aporé/paré », « Schmidt vs Schmit » par Jonathan).

9. **Format libellé infos.** Trame = `Concept · Établissement · Type · "Réalisation, ANNÉE" ·
Ville` (4–5 lignes). Actuel = `typologyLabel · location · year` (1 ligne) + titre. →
   Restructurer le modèle d'affichage de carte (ajouter champ « geste/concept » distinct du titre).

10. **CTA flottant « Démarrer un projet ».** Présent en haut de la trame (bloc noir arrondi
    flottant). À vérifier vs `ContactBar.astro` / sticky existant — la trame le veut en **panneau
    noir arrondi détaché** en tête de page.

**Inchangé / réutilisable :**

- Logo « oliveira », MENU hamburger, curseur custom → déjà en place (`Header.astro`,
  `CustomCursor.astro`).
- Pattern accordéon height-JS (`ArchitecturesAccordion`/`FaqAccordion`) → base technique
  réutilisable pour l'accordéon réalisations.
- Source de données Sanity + fallback mock → conservée, à re-seeder.
