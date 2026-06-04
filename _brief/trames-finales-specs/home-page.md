# Spec — HOME PAGE (page d'accueil)

## ⚠️ ANALYSE APPROFONDIE 2026-06-04

> Relecture exhaustive des tuiles HD `C:/tmp/colslices/home__col{0..4}_b{0..4}.png` (5 colonnes × 5 blocs).
> **Lecture des colonnes** : col2 = la PAGE telle qu'elle se rend (état repos, top→bas). col0 / col1 = états alternatifs (menu ouvert, survols, blur). col3 / col4 = colonnes d'ANNOTATIONS designer (instructions d'animation, à NE PAS rendre) + un état coloré (topbar violette clic, topbar noire survol).
> Toutes les annotations ci-dessous sont **verbatim** (casse/fautes incluses : « CURDEUR », « UVEC », « APPARAIT »).

### Palette confirmée

- **NOIR** `#000000` : cartes stats sombres, footer, topbar au survol, pills CTA noires.
- **BEIGE** `#EDE6D6` : fond de page, topbar au repos, cartes claires, pastille logo footer.
- **VIOLET** `#e0afff` : topbar au CLIC + logo `oliveim.` + `MENU` au clic (col4_b0 montre topbar pill violette texte noir, logo violet, MENU violet).

### Ordre vertical réel (col2, haut→bas)

1. **Topbar** : pill beige pleine largeur `Démarrer un projet` (centré) + logo `oliveim.` (gauche) + `MENU ☰` (droite). Sur le hero le logo/MENU sont en crème.
2. **HERO** plein écran : photo jardin/terrasse tropicale au crépuscule (canapé + 2 personnes, bassin/piscine premier plan, pergola bois). Wordmark crème bas-gauche `Studio` / `J. Oliveira` (sentence case, énorme). Annotation col3_b0 : **« HERO INCHANGE »** + **« ANIMATION TEXTE A CONSERVER COMME L'EXISTANT »**.
3. **Bande VALEURS** (fond beige, Bold noir, sentence case) sur 3 lignes :
   - `Architecture   Design   Contexte`
   - `Expérientiel   Signature`
   - `Art de vivre   Vivant   Immersif`
     Annotation col4 : **« ANIMATION DES TEXTES EN APPARITION WAVY/VAGUE AVEC APPARITION/DISPARITION EN FONCTION DU SCROLL »**.
4. **STUDIO — paragraphe ADN** (light noir, justifié), VERBATIM :
   > « Créé en 2021, le STUDIO J. OLIVEIRA est spécialisé en design immersif et expérientiel. De la conception au suivi de chantier, il conçoit et structure des espaces de vie en prenant en compte le dialogue bâti - environnement - humain. Chaque projet tente ainsi de concevoir des espaces logiques, cohérents et ergonomiques où le végétal se tisse en harmonie avec son environnement, pour créer l'expérience de ses usagers. »
   - CTA pill **à contour** `Découvrir le STUDIO` + curseur carré `■.`.
   - Annotation col3_b1 : **« ANIMATION DU TEXTE "STUDIO" EN APPARITION WAVY/VAGUE AVEC APPARITION/DISPARITION EN FONCTION DU SCROLL »** + **« CLIC + SURVOL CTA / BLOC AIMANTE AU CURDEUR DURANT LE SURVOL »**.
   - État survol CTA (col3_b1) : pill devient **NOIRE pleine**, texte crème `Découvrir le STUDIO`, magnétique au curseur.
5. **BLOC STATS** — 3 cartes (fond beige de section) :
   - **Carte `+10 Etudes`** (≈60% largeur). Variante claire (col1_b2) : carte beige contour, `+10` géant noir, `Etudes` Bold, sous-texte `réalisées par le studio depuis sa création`, pill noire `Découvrir les projets`. Variante survol (col2_b2) : carte **NOIRE**, texte crème, sous-texte reformulé `Conçues par le studio depuis sa création`.
   - **Carte `+10 ans`** : col2_b2 noire / col3_b2 beige contour. `+10` + `ans` (petit, collé). Sous-texte `D'expérience dans le domaine de l'architecture paysagère`. Pill noire `Découvrir le parcours`.
   - **Carte `+3`** (col2_b2, sous +10 ans, fond beige) : `+3` outline, sous-texte `Régions d'intervention du studio sur toute la France depuis sa création`.
   - Annotations (col1_b1 / col3_b1-b2 / col4_b1) :
     - **« SURVOL + CLIC / LIEN VERS LA PAGE PROJET / AU SURVOL LE CURSEUR S'ALLONGE ET FAIT APPARAITRE "DECOUVRIR LES PROJETS" / BLOC AIMANTE AU CURDEUR DURANT LE SURVOL »** (carte Études)
     - **« AU SURVOL LE CURSEUR SE TRANSFORME ET FAIT APPARAITRE "DECOUVRIR LE PARCOURS" / BLOC AIMANTE AU CURDEUR DURANT LE SURVOL »** (carte +10 ans)
6. **BANDEAU transition** (carte beige contour fin) : `Chaque étude appartient à une ` **`typologie de jardin`** (2 derniers mots en Bold).
7. **TYPOLOGIES — intro** (light noir justifié), VERBATIM :
   > « L'architecture bâtie, le contexte environnemental et géographique ainsi que les contraintes structurelles de chaque type de propriété ont été classifiés selon une nomenclature précise et définissent l'étude paysagère adaptée au contexte de votre projet. **Découvrez votre typologie de jardin.** »
8. **TYPOLOGIES — 4 cartes en RANGÉE** (PAS 5, pas d'« Architecture publique »). Chaque carte = **nom (Bold) + LISTE de sous-types** au-dessus d'une image carrée. Listes verbatim (col1_b2) :
   - **Micro urbain** : `Roof Tops` / `Patios` / `Micros jardins`
   - **Coeur urbain** : `Cours urbaines` / `Jardins confinés` / `Jardins de ville`
   - **Frange urbaine** : `Jardins péri-urbains` / `Propriétés principales,` / `secondaires et résidentielles`
   - **Domaine & Caractère** : `Châteaux, Manoirs` / `Front de mer` / `Domaines` / `Viticoles` / `Aras` _(probable `Haras` — à confirmer)_
   - Annotation col1_b2 : **« FLOU SURVOL + CLIC / CHANGEMENT "CHOISIR" PAR "DECOUVRIR" »**. État survol (col1_b3/b4) : image **floutée (blur)** + pill noire `Découvrir` centrée. Donc le libellé bulle/curseur est **`Choisir` au repos → `Découvrir` au survol**.
9. **FOOTER** noir : pastille beige arrondie contenant logo `oliveim.` noir. Colonne gauche crème : `Siège social Studio` / `41 Rue Général Souham` / `19100 BRIVE` / `06 61 08 84 44` / `contact.jonathanbiodesign@gmail.com` ; `Territoires d'intervention` / `National` ; bas `Droits réservés, mentions légales, etc.`. Colonne droite (nav crème alignée droite) : `Home` / `Studio` / `Projets` / `Démarrer un projet` / `Etudes par typologies de jardin` (+ curseur carré `■`) / mini-liste `Micro urbain  Coeur urbain  Frange urbaine  Domaine & Caractère`.

### Topbar — 3 états confirmés

- **Repos** (col2_b0) : pill **beige** texte noir `Démarrer un projet`, logo/MENU crème sur hero.
- **Survol** (col3_b0) : pill **NOIRE** texte crème. Annotation : **« SURVOL TOP BARRE / LA TOP BARRE N'APPARAIT PAS QUAND LE HERO EST EN PLEIN ECRAN / APPARAIT FIXE QUAND ON QUITTE L'AFFICHAGE HERO EN PLEIN ECRAN »**.
- **Clic** (col4_b0) : pill **VIOLET** texte noir, logo + MENU violets. Annotation : **« CLIC TOP BARRE / RENVOIE VERS LA PAGE "DEMARRER UN PROJET" »**.

### Menu ouvert (col1_b0)

- Annotation : **« MENU OUVERT / LA TOP BARRE APPARAIT UVEC UN LEGER LISERET PERIPHERIQUE »**.
- Overlay noir, liseret clair. Logo `oliveim.` crème + `Fermer X`. Nav droite : `■. Home` (Bold actif) / `Studio` / `Projets` / `Démarrer un projet`. Puis `Etudes par typologie de jardin` + 4 pills contour : `Micro urbain` `Coeur urbain` / `Frange urbaine` `Domaine & Caractère`. (col0_b0 : topbar en état menu-ouvert = `Fermer X` + curseur carré.)

### Règle de casse globale (col3_b0-b1, col4_b1)

- **« PASSER TOUT EN MINUSCULE AVEC PREMIERE DE EN MAJUSCULE UNIQUEMENT »** → sentence case (PAS d'UPPERCASE) sur les contenus.

---

> Source de vérité : trame Jonathan « home page » (9827×5726 px), découpée en grille 5×4 (recouvrement 160px).
> Cette maquette est **large/annotée** : panneaux côte à côte montrant plusieurs ÉTATS du même composant (au repos, au survol, au clic) + des annotations rouges décrivant les animations.
> Les **traits rouges** = cadre d'un viewport 1920×1080 (servent à juger la taille/proportion above-the-fold). Ne sont PAS des éléments de design.

## Palette (rappel global)

- **NOIR / gris très sombre** : `#000000` (cartes, top barre survolée, footer, bulles CTA noires).
- **BEIGE / crème** : `#EDE6D6` (fond de page principal, cartes claires, top barre au repos).
- **VIOLET / lilas** : `#e0afff` (NOUVELLE couleur sitewide — remplace le rouge/latérite de l'actuel pour la top barre CLIQUÉE et le logo en état « survol/actif »). À confirmer code exact auprès de Jonathan.
- Texte courant : noir `#000000` sur beige ; crème `#EDE6D6` sur noir/violet.

## Typographies observées

- **Sans-serif** unique partout (type Inter, conforme à la stack). Deux graisses dominantes :
  - **Bold / 700** : titres énormes des « valeurs » (Art de vivre, Vivant, Immersif…), chiffres `+10`, mots-clés, libellés CTA.
  - **ExtraLight / 200 ou Light / 300** : paragraphes ADN studio, sous-textes des stats, intro typologies, le mot `ans`, `Etudes` en variante crème sur noir.
- **Logo `oliveim.`** : wordmark manuscrit/script propre à la marque (image, pas une font).
- Annotations designer = Bold UPPERCASE en beige clair (texte d'instruction, NE PAS rendre).

## Règle de casse globale (annotation verbatim, tuiles r0_c3/r0_c4)

> « ANIMATION TEXTE A CONSERVER COMME L'EXISTANT »
> « PENSER TOUT EN MINUSCULE AVEC PREMIERE DE EN MAJUSCULE UNIQUEMENT »

→ Les textes de contenu doivent passer en **minuscules avec seulement la première lettre en majuscule** (sentence case), PAS en UPPERCASE. (Casse à corriger sur plusieurs blocs actuellement en UPPERCASE.)

---

# STRUCTURE VERTICALE DE LA PAGE

Ordre des sections (déduit du flux de la trame, haut → bas) :

1. Top barre flottante / Header (états multiples)
2. Menu fullscreen overlay (état ouvert)
3. Hero plein écran (image villa + wordmark `Studio J. Oliveira`)
4. Bandeau « valeurs » défilant (Architecture · Design · Contexte · Expérientiel · Signature · Art de vivre · Vivant · Immersif)
5. Section STUDIO (texte ADN « Art de vivre… Créé en 2021… » + CTA « Découvrir le STUDIO »)
6. Bloc STATS (cartes `+10 Etudes`, `+10 ans`, `+3 régions`) + CTA « Découvrir les projets » / « Découvrir le parcours »
7. Bandeau « Chaque étude appartient à une **typologie de jardin** »
8. Section TYPOLOGIES (4 cartes : Micro urbain / Cœur urbain / Frange urbaine / Domaine & Caractère) avec listes de sous-types + effet flou-au-survol
9. Footer global (logo, NAP, Territoires, navigation : Home / Studio / Projets / Démarrer un projet, mini-liste typologies)

---

## 0. CURSEUR CUSTOM (sitewide, visible dans la trame)

- Forme : **carré à coins arrondis** avec un **petit point/dot en bas-droite** (visible plusieurs fois : `■.` à côté du logo top barre, sous « Micro urbain », à côté des CTA noirs).
- 3 déclinaisons couleur selon le fond (noir / blanc / violet).
- Remplace l'ancien curseur rond.

---

## 1. TOP BARRE / HEADER (états multiples sur la trame)

La trame montre **plusieurs états empilés** du même composant top barre.

### État A — repos (tuile r0_c0)

- **Pilule horizontale beige `#EDE6D6`**, coins très arrondis, largeur quasi pleine (marges latérales), centrée en haut.
- À gauche : **logo `oliveim.`** en noir.
- Au centre : le **curseur carré** noir `■.` (illustratif).
- À droite : **`Fermer`** (Bold, noir) + **`X`** (icône fermeture).
  - NOTE : « Fermer / X » apparaît ici car c'est l'état top barre quand le **menu est ouvert** (cf. annotation r0_c0 « CLIC + SURVOL FERMETURE MENU »).

### État B — top barre au repos, menu fermé (tuiles r0_c2, r0_c3)

- Sur fond hero (image), top barre = libellé **`Démarrer un projet`** à gauche/centre + **`MENU ☰`** à droite (Bold).
- Logo `oliveim.` à gauche.

### État C — top barre SURVOLÉE (tuiles r0_c3, r0_c4)

- Annotation verbatim (r0_c3) :
  > « SURVOL TOP BARRE — LA TOP BARRE N'APPARAIT PAS QUAND LE HERO EST EN PLEIN ECRAN — APPARAIT FIXE QUAND ON QUITTE L'AFFICHAGE HERO EN PLEIN ECRAN »
- État repos : **pilule NOIRE** `#000000`, texte crème, libellé centré **`Démarrer un projet`**.
- État survol : **pilule VIOLET `#e0afff`** (à droite), même libellé `Démarrer un projet` en noir → la barre vire au violet au survol.
- Annotation (r0_c4) :
  > « CLIC TOP BARRE — RENVOIE VERS LA PAGE "DEMARRER UN PROJET" »
- Donc : la top barre EST un gros CTA « Démarrer un projet » qui pointe vers `/demarrer-un-projet`. Survol = pilule violette ; clic = navigation.
- Logo en état violet : wordmark `oliveim.` rendu en **violet** (visible r0_c3 / r0_c4).

### Comportement de scroll (synthèse des annotations)

- Top barre **masquée** tant que le hero est en plein écran (above the fold).
- Top barre **apparaît fixe** dès qu'on a quitté le hero plein écran.
- `MENU ☰` à droite ouvre l'overlay menu fullscreen.
- Le gros bouton central `Démarrer un projet` → `/demarrer-un-projet`.

---

## 2. MENU FULLSCREEN (état ouvert — tuile r0_c1)

- Annotation : « MENU OUVERT — LA TOP BARRE APPARAIT AVEC UN LEGER LISERET PERIPHERIQUE ».
- Overlay **plein écran NOIR** `#000000`, coins arrondis, **léger liseret/contour périphérique** clair.
- En haut : logo `oliveim.` (crème) à gauche ; à droite **`Fermer  X`**.
- Liste de navigation **alignée à droite**, texte crème :
  - **`Home`** (en gras / actif, précédé d'un petit curseur carré `■`)
  - `Studio`
  - `Projets`
  - `Démarrer un projet`
- Séparateur, puis libellé : **`Etudes par typologie de jardin`** (light).
- Sous-tags en **pilules à contour** (boutons arrondis bordés crème) :
  - `Micro urbain` `Coeur urbain`
  - `Frange urbaine` `Domaine & Caractère`

> NOTE casse : « Coeur » écrit sans œ dans la trame. À uniformiser avec « Cœur » (verbatim trame = `Coeur urbain`).

---

## 3. HERO PLEIN ÉCRAN (tuile r0_c2)

- **Pleine hauteur viewport** (le cadre rouge confirme : hero occupe tout le 1920×1080).
- **Image de fond plein-bleed** : photo d'un **jardin/terrasse tropicale au crépuscule** — végétation luxuriante, salon d'extérieur (canapé, deux personnes assises), bassin/piscine au premier plan, pergola bois. Ratio plein écran (cover). Placeholder : visuel lifestyle premium végétal.
- Overlay top : top barre `Démarrer un projet` (gauche) + `MENU ☰` (droite) + logo `oliveim.` (gauche, ici en crème sur l'image).
- **Wordmark titre** superposé bas-gauche, énorme, crème :
  - Ligne 1 : `Studio` (light/regular)
  - Ligne 2 : `J. Oliveira`
  - (le `J. Oliveira` est le bloc le plus grand, débordant légèrement)
- C'est le H1 visuel ; H1 SEO sr-only conservé.

---

## 4. BANDEAU « VALEURS » (tuiles r0_c2, r0_c3, r1_c3)

- Sous le hero, sur fond **beige `#EDE6D6`**, série de **mots énormes Bold noir** disposés en lignes, façon nuage/bandeau :
  - `Architecture` `Design` `Contexte`
  - `Expérientiel` `Signature`
  - `Art de vivre` `Vivant` `Immersif`
- Typo : Bold, très grande taille (titre monumental), noir sur beige.
- Disposition multi-colonnes / multi-lignes irrégulière (pas un simple centrage).
- Animation probable : apparition wavy/scroll (cf. annotations de la section suivante) — à confirmer, ici pas d'annotation directe mais cohérent avec le pattern justify/wavy.

---

## 5. SECTION STUDIO — texte ADN (tuiles r1_c2, r1_c3)

- Fond **beige `#EDE6D6`**.
- **Titre** : repris des mots `Art de vivre` / `Vivant` / `Immersif` en Bold noir énorme en haut (le bandeau valeurs sert d'accroche au-dessus du paragraphe).
- **Paragraphe ADN** verbatim (light, justifié, noir) :

  > « Créé en 2021, le STUDIO J. OLIVEIRA est spécialisé en design immersif et expérientiel. De la conception au suivi de chantier, il conçoit et structure des espaces de vie en prenant en compte le dialogue bâti - environnement - humain. Chaque projet tente ainsi de concevoir des espaces logiques, cohérents et ergonomiques où le végétal se tisse en harmonie avec son environnement, pour créer l'expérience de ses usagers. »

- **CTA** sous le paragraphe, centré : pilule **à contour fin** (bordée noir, fond beige) → **`Découvrir le STUDIO`** (Bold noir) + curseur carré `■.` à droite.
- Annotation (tuiles r1_c4 / r2_c3) :
  > « ANIMATION DU TEXTE "STUDIO" EN APPARITION WAVY/VAGUE — APPARITION/DISPARITION EN FONCTION DU SCROLL »
  > « CLIC + SURVOL CTA — BLOC AIMANTÉ AU CURDEUR DURANT LE SURVOL »
- État survol du CTA (tuile r1_c4 / r2_c0) : la pilule devient **NOIRE pleine** `#000000`, texte crème `Découvrir le STUDIO`, et le **bloc est aimanté au curseur** (magnetic) pendant le survol.

---

## 6. BLOC STATS (tuiles r1_c1, r1_c3, r1_c4)

Cartes de chiffres-clés, fond beige, deux variantes (claire et sombre) montrées côte à côte = états repos/survol.

### Carte « Études » (variante claire au repos)

- **Carte beige** `#EDE6D6` arrondie, large, horizontale.
- Contenu :
  - **`+10`** en chiffre Bold noir GÉANT (le `+` plus petit collé à gauche du `10`).
  - À droite du chiffre : **`Etudes`** (Bold noir) + sous-texte light : `réalisées par le studio depuis sa création`.
  - Petite pilule **noire** `Découvrir les projets` (crème) à droite.

### Carte « Études » (variante sombre = survol)

- Même carte mais **fond NOIR** `#000000`, chiffre + `Etudes` en **crème** ; sous-texte ici reformulé `Conçues par le studio depuis sa création` (variante).
- Annotation (tuile r1_c1 / r1_c4) verbatim :
  > « SURVOL + CLIC — LIEN VERS LA PAGE PROJET — AU SURVOL, LE CURSEUR S'ALLONGE ET FAIT APPARAITRE "DECOUVRIR LES PROJETS" — BLOC AIMANTÉ AU CURSEUR DURANT LE SURVOL »

### Carte « +10 ans » (tuile r1_c4)

- Carte **noire** `#000000` arrondie, crème :
  - **`+10`** Bold crème + **`ans`** en light/petit collé en bas-droite du `10`.
  - Sous-texte : `D'expérience dans le domaine de l'architecture paysagère`.

### Carte « +3 régions » (tuile r1_c4)

- Sous la précédente, sur fond beige :
  - **`+3`** Bold noir (chiffre, plus fin/outline).
  - Sous-texte : `Régions d'intervention du studio sur toute la France depuis sa création`.

### CTA « Découvrir le parcours » (tuile r1_c4)

- Pilule **noire** `Découvrir le parcours` (crème) rattachée à la carte « +10 ans ».
- Annotation (tuile r1_c3 / r1_c4) verbatim :
  > « SURVOL + CLIC — LIEN VERS LA PAGE PROJET — AU SURVOL, LE CURSEUR SE TRANSFORME ET FAIT APPARAITRE "DECOUVRIR LE PARCOURS" — BLOC AIMANTÉ AU CURSEUR DURANT LE SURVOL »

> Layout stats : grande carte Études à gauche (≈ 60% largeur) + colonne droite empilée (+10 ans au-dessus, +3 régions en dessous). Sur fond beige de section.

---

## 7. BANDEAU « typologie de jardin » (tuile r1_c3)

- Carte **beige arrondie à contour fin**, pleine largeur :
  - Texte light noir : `Chaque étude appartient à une ` + **`typologie de jardin`** (les deux derniers mots en **Bold**).
- Sert de transition vers la section Typologies.

---

## 8. SECTION TYPOLOGIES (tuiles r2_c0, r2_c1, r2_c2 ; répétées r3)

Intro + 4 cartes typologie en ligne.

### Intro (tuile r2_c2)

- Paragraphe light noir, justifié :
  > « L'architecture bâtie, le contexte environnemental et géographique ainsi que les contraintes structurelles de chaque type de propriété ont été classifiés selon une nomenclature précise et définissent l'étude paysagère adaptée au contexte de votre projet. **Découvrez votre typologie de jardin.** »
  > (la dernière phrase en **Bold**.)

### Les 4 cartes (tuiles r2_c1, r2_c2, r3_c1, r3_c2)

Disposées **en ligne horizontale** (4 visibles), chacune = **titre + liste de sous-types au-dessus d'une image carrée**.

1. **Micro urbain**
   - Sous-types (light, au-dessus de l'image) :
     - `Roof Tops`
     - `Patios`
     - `Micros jardins`
   - Image carrée (jardin/terrasse). Petite pilule noire `Découvrir` overlay.

2. **Cœur urbain** (écrit `Coeur urbain`)
   - Sous-types (Bold) :
     - `Cours urbaines`
     - `Jardins confinés`
     - `Jardins de ville`
   - Image carrée (cour/jardin avec bassin).

3. **Frange urbaine**
   - Sous-types (Bold) :
     - `Jardins péri-urbains`
     - `Propriétés principales,`
     - `secondaires et résidentielles`
   - Image carrée (jardin paysager au crépuscule, palmiers).

4. **Domaine & Caractère**
   - Sous-types (Bold) :
     - `Châteaux, Manoirs`
     - `Front de mer`
     - `Domaines`
     - `Viticoles`
     - `Aras` _(probablement `Haras` — [À VÉRIFIER avec Jonathan])_
   - Image carrée (manoir / grande propriété, allées géométriques).

### Animation typologies (annotation verbatim, tuile r2_c1)

> « FLOU SURVOL + CLIC — CHANGEMENT "CHOISIR" PAR "DECOUVRIR" »

- **Au survol** de l'image d'une carte : l'**image se floute** (blur) — visible sur les images floutées des tuiles r2_c0 / r3_c0 (« Micro urbain » avec image floue + pilule noire `Découvrir` au centre).
- Le **libellé du curseur/pilule passe de `Choisir` à `Découvrir`** au survol.
- **Au clic** : navigation vers la page typologie (`/architecture-paysagere/{slug}`).
- Pilule noire `Découvrir` apparaît centrée sur l'image floutée pendant le survol.

> Différence clé vs actuel : ici **4 cartes seulement** (pas 5 — pas d'« Architecture publique » dans cette trame home), pas de carousel scroll-horizontal pinné mais une **rangée de 4 cartes** avec **flou au survol** ; le CTA passe `Choisir` → `Découvrir`.

---

## 9. FOOTER GLOBAL (tuiles r2_c2, r3_c1, r3_c2)

- Fond **NOIR** `#000000`, coins arrondis en haut (la carte footer est elle-même arrondie).
- **Haut-gauche** : carte/pastille beige arrondie contenant le **logo `oliveim.`** noir.
- **Colonne gauche** (texte crème) :
  - **`Siège social Studio`** (Bold)
    - `41 Rue Général Souham`
    - `19100 BRIVE`
    - `06 61 08 84 44`
    - `contact.jonathanbiodesign@gmail.com`
  - **`Territoires d'intervention`** (Bold)
    - `National`
  - Bas : mention `Droits réservés, mentions légales, etc.`
- **Colonne droite** — navigation, **alignée à droite**, crème, grande :
  - `Home`
  - `Studio`
  - `Projets`
  - `Démarrer un projet`
  - Sous-titre : **`Etudes par typologies de jardin`** (light), avec un petit curseur carré `■` devant.
  - Ligne de mini-liens typologies : `Micro urbain` · `Coeur urbain` · `Frange urbaine` · `Domaine & Caractère`

> Le footer reprend la même nav principale que le menu (Home/Studio/Projets/Démarrer un projet) + la mini-liste des 4 typologies.

---

# RÉCAP DES ANIMATIONS (verbatim regroupé)

- **Top barre** : masquée pendant hero plein écran, apparaît fixe ensuite ; survol → vire **violet** ; clic → `/demarrer-un-projet`. « LISERET PERIPHERIQUE » sur la top barre quand menu ouvert.
- **Texte STUDIO** : « apparition WAVY/VAGUE — apparition/disparition en fonction du scroll ».
- **CTA (Découvrir le STUDIO / les projets / le parcours)** : « bloc aimanté au curseur durant le survol » (magnetic) ; survol → pilule noire pleine ; le **curseur s'allonge/se transforme et fait apparaître le libellé** (« Découvrir les projets » / « Découvrir le parcours »).
- **Cartes stats** : survol+clic → lien page projet/parcours, curseur allongé, bloc aimanté.
- **Cartes typologies** : « FLOU survol + clic » → image se floute, curseur/pilule passe de **`Choisir` → `Découvrir`**, clic = navigation.
- **Curseur** : carré arrondi + dot, 3 couleurs selon fond.
- **Casse** : « tout en minuscule avec première lettre en majuscule uniquement » (sentence case partout).

---

# DELTAS vs page actuelle (`src/pages/index.astro`)

Comparaison avec l'implémentation existante (ne rien modifier — analyse seule).

### Couleurs / DA

- **Accent VIOLET `#e0afff` à introduire** en remplacement du rouge/latérite actuel pour : la top barre survolée (pilule violette) et le wordmark logo en état actif. L'actuel utilise `--color-red` (manifeste) et `--color-laterite` (dots). → nouvelle variable de thème à créer.
- Casse : l'actuel met `#identite`, `htypo-name`, `manifeste-bold` en **UPPERCASE**. La trame demande **sentence case** (« minuscule + première lettre majuscule »). → revoir `text-transform` sur identité, noms typologies, ouverture manifeste.

### Top barre / Header (NOUVEAU comportement)

- Actuel : pas de top barre (retirée 2026-04-27, remplacée par gradient + Header auto-hide), hero a un `MENU` via Header global.
- Trame : **top barre flottante = gros CTA `Démarrer un projet`** (pilule noire → violette au survol → clic vers `/demarrer-un-projet`), masquée en hero plein écran, fixe ensuite, avec `MENU ☰` à droite + logo. → composant top barre à (re)créer.
- Menu ouvert : « léger liseret périphérique » sur la top barre — détail à ajouter.

### Menu fullscreen

- Actuel (`MenuPrimary.astro`) : 5 sections (Architecture paysagère, Architecture végétale d'intérieur, LCD atypique, Pros, Projets) + sous-listes + CTA.
- Trame home : menu réduit à **`Home / Studio / Projets / Démarrer un projet`** + bloc **`Etudes par typologie de jardin`** avec 4 pilules (Micro urbain, Coeur urbain, Frange urbaine, Domaine & Caractère).
  → Divergence forte : soit la trame montre une version simplifiée, soit le menu doit être revu. **À clarifier avec Morgan/Jonathan** (probable que la trame ne montre qu'un sous-ensemble). Le bouton `Fermer X` est conforme.

### Hero

- Actuel : `<HeroSwipe />` = slideshow swipe 5 images, wordmark `STUDIO J. OLIVEIRA`.
- Trame : hero **image fixe unique** (jardin tropical crépuscule) + wordmark `Studio J. Oliveira` (sentence case, pas UPPERCASE) bas-gauche.
  → vérifier si on garde le swipe ou image unique ; corriger la casse du wordmark.

### Section IDENTITÉ (3 lignes mots-clés)

- Actuel : 3 lignes UPPERCASE justify-multi (`ARCHITECTURE PAYSAGE DESIGN` / `ERGONOMIE BIOPHILIE CONCEPTION` / `VEGETAL PILOTAGE`) sur fond NOIR.
- Trame : un **bandeau « valeurs » sur fond BEIGE** avec d'AUTRES mots : `Architecture · Design · Contexte · Expérientiel · Signature · Art de vivre · Vivant · Immersif` (Bold noir, sentence case).
  → contenu des mots-clés CHANGE, fond passe noir → beige, casse change. Animation wavy/vague conservée.

### Section STUDIO

- Actuel : fond NOIR, texte ADN UPPERCASE-ish en 4 lignes (« Le Studio J. Oliveira est un studio de design spatial… ») + CTA `Découvrir le studio`.
- Trame : fond **BEIGE**, **nouveau texte verbatim** (« Créé en 2021, le STUDIO J. OLIVEIRA est spécialisé en design immersif et expérientiel… ») + CTA `Découvrir le STUDIO` (pilule contour → noire pleine au survol, magnetic).
  → texte ADN à REMPLACER (verbatim trame), fond noir→beige, libellé CTA `studio`→`STUDIO`.

### NOUVELLE section STATS (absente de l'actuel)

- Aucun bloc stats dans l'index actuel.
- Trame : ajouter **bloc stats** : carte `+10 Etudes` (claire/sombre au survol, CTA `Découvrir les projets`), carte `+10 ans` (`D'expérience… architecture paysagère`, CTA `Découvrir le parcours`), carte `+3` régions (`sur toute la France`). Avec curseur allongé + magnetic.
  → **section entièrement nouvelle à créer.**

### NOUVEAU bandeau « typologie de jardin »

- Trame : carte beige contour fin « Chaque étude appartient à une **typologie de jardin** ».
  → l'actuel a un texte intro typologies différent ; ajouter ce bandeau transition.

### Section TYPOLOGIES

- Actuel : **carousel horizontal pinné** (scroll-driven), **5 cartes** (Micro urbain, Cœur urbain, Frange urbaine, Domaine & Caractère, **Architecture publique**), image carrée + nom uniquement, **pas d'animation au hover**, CTA curseur = `Choisir`/`Explorer`, fond NOIR.
- Trame : **4 cartes seulement** (pas d'Architecture publique), disposées en **rangée** (pas forcément carousel pinné), chaque carte = **nom + LISTE de sous-types** au-dessus d'une image, **FLOU au survol** + pilule `Découvrir`, CTA passe **`Choisir` → `Découvrir`** (au lieu de Choisir/Explorer), fond **BEIGE**.
  → retirer Architecture publique du home, ajouter listes de sous-types par carte, ajouter effet **blur au hover**, changer libellé CTA, passer fond noir→beige. Taglines à remplacer par les listes verbatim (Roof Tops/Patios/Micros jardins ; Cours urbaines/Jardins confinés/Jardins de ville ; Jardins péri-urbains/Propriétés principales, secondaires et résidentielles ; Châteaux, Manoirs/Front de mer/Domaines/Viticoles/[H]aras).
- Intro typologies : remplacer par le verbatim trame (« L'architecture bâtie, le contexte environnemental et géographique… Découvrez votre typologie de jardin. »).

### Section MANIFESTE

- Actuel : section manifeste rouge plein-bleed (« Je ne vends pas qu'une étude… »), placée AVANT typologies.
- Trame : **AUCUN bloc manifeste rouge visible** dans cette trame home.
  → possible suppression / déplacement du manifeste de la home. **À confirmer avec Morgan** (peut-être hors-cadre de la trame fournie).

### Footer

- Actuel (`Footer.astro`) : 2 colonnes, gauche Siège + Territoires (Brive/Limoges/…), droite Services (Architecture paysagère, Architecture végétal d'intérieur, LCD, PRO, Projets) + Studio (Le studio/Journal/Contact).
- Trame : colonne droite = **Home / Studio / Projets / Démarrer un projet** + `Etudes par typologies de jardin` + mini-liste 4 typologies. Territoires = **`National`** (au lieu de la liste de villes). Logo `oliveim.` dans pastille beige arrondie.
  → simplifier nav droite (4 entrées + typologies), Territoires → « National », ajouter mini-liste typologies, conserver NAP gauche.

### Curseur

- Actuel : `CustomCursor.astro` (à vérifier forme). Trame impose **carré arrondi + dot**, 3 couleurs selon fond.
  → vérifier/adapter la forme du curseur custom.

---

## Points à clarifier avec Jonathan / Morgan

1. Code hexa exact du **violet** (`#e0afff` estimé).
2. `Aras` vs `Haras` (typologie Domaine & Caractère).
3. Le **menu fullscreen** : version réduite (4 entrées) volontaire, ou la trame ne montre qu'un extrait ?
4. **Manifeste rouge** : supprimé de la home ou hors-cadre de la trame ?
5. Hero : image fixe unique (trame) ou conserver le slideshow swipe ?
6. `Coeur` vs `Cœur` (la trame écrit `Coeur` sans ligature).

---

## DELTAS vs index.astro actuel

> Comparaison ligne-à-ligne avec `src/pages/index.astro` (état 2026-06-04). Liste actionnable, du plus structurant au détail.

### Ordre des sections

- **Actuel** : Hero → Identité → Studio → **Stats** → Typologies. (Pas de bande Valeurs, pas de bandeau transition.)
- **Trame** : Hero → **Valeurs** → Studio → Stats → **Bandeau transition** → Typologies → Footer.
- → Insérer la bande **Valeurs** entre Hero et Studio ; insérer le **bandeau « Chaque étude appartient à une typologie de jardin »** entre Stats et Typologies.

### 1. Section IDENTITÉ → à REMPLACER par bande VALEURS

- Actuel : `#identite`, 3 lignes **UPPERCASE** justify-multi : `ARCHITECTURE PAYSAGE DESIGN` / `ERGONOMIE BIOPHILIE CONCEPTION` / `VEGETAL PILOTAGE`.
- Trame : **mots différents**, Bold **sentence case** : `Architecture Design Contexte` / `Expérientiel Signature` / `Art de vivre Vivant Immersif`.
- → Mots faux + casse fausse. Remplacer les 3 lignes par les 8 valeurs, retirer `text-transform: uppercase`. Animation wavy/vague conservée.

### 2. Section STUDIO → texte ADN FAUX

- Actuel (lignes 222-233) : « Le Studio J. Oliveira est un studio de design spatial spécialisé dans l'aménagement environnemental immersif et expérientiel. Sa mission est d'étudier et concevoir des espaces extérieurs comme intérieurs en dialogue avec le bâti, l'environnement et l'humain, de la conception jusqu'au pilotage chantier. »
- Trame : **texte entièrement différent** → « Créé en 2021, le STUDIO J. OLIVEIRA est spécialisé en design immersif et expérientiel. De la conception au suivi de chantier, il conçoit et structure des espaces de vie… pour créer l'expérience de ses usagers. » (cf. §4 ci-dessus, verbatim).
- → Remplacer le paragraphe par le verbatim trame.
- CTA actuel : `Découvrir le studio` (minuscule), `href="/studio"`. Trame : `Découvrir le STUDIO` (STUDIO en capitales). État survol = pill noire pleine + magnétique (déjà magnetic={0.3}, OK).

### 3. Section STATS → incomplète

- Actuel (lignes 261-278) : 3 items inline `+10 Études` / `+10 ans` / `+3 régions`, un seul lien `/projets`, label curseur `DÉCOUVRIR`. **Pas de cartes, pas de sous-textes, pas de variantes claire/sombre, pas de séparation Études vs parcours.**
- Trame : **3 cartes distinctes** avec sous-textes verbatim + 2 CTA différents :
  - Carte `+10 Etudes` → `réalisées par le studio depuis sa création` (variante claire) / `Conçues par le studio depuis sa création` (variante survol noire) + pill `Découvrir les projets` → `/projets`.
  - Carte `+10 ans` → `D'expérience dans le domaine de l'architecture paysagère` + pill `Découvrir le parcours` → page parcours/studio.
  - Carte `+3` → `Régions d'intervention du studio sur toute la France depuis sa création`.
- → Refonte complète : layout cartes (grande Études gauche + colonne droite +10ans/+3), sous-textes, états clair/sombre au survol, curseur allongé qui révèle « Découvrir les projets » / « Découvrir le parcours », magnétique. (Note : `Études` actuel ≠ `Etudes` trame, sans accent.)

### 4. Bandeau transition → ABSENT

- Aucun équivalent dans l'actuel.
- → Ajouter carte beige contour `Chaque étude appartient à une **typologie de jardin**` entre Stats et Typologies. (L'actuel a fusionné cette phrase dans `.htypo-intro` ligne 302-306 — texte différent et reformulé.)

### 5. Section TYPOLOGIES → plusieurs écarts

- **Intro** (lignes 302-306) : texte actuel reformulé/raccourci ≠ verbatim trame. → Remplacer par le verbatim (§7).
- **Nombre** : l'actuel commente « 5 typos / 4 visibles + 5e cropée » et gère `architecture-publique` (htypo-name--light, cursor EXPLORER, padding rail calibré 5 panels). MAIS le tableau `typologies` (lignes 30-59) ne contient que **4 entrées** → l'architecture-publique est déjà absente des données. ✅ conforme trame (4 cartes). Nettoyer les commentaires/CSS résiduels qui parlent de 5 panels / EXPLORER.
- **Taglines** (lignes 35-57) : actuellement **UPPERCASE et abrégées** :
  - `ROOF TOPS / PATIOS / MICRO JARDINS` → trame : `Roof Tops` / `Patios` / `Micros jardins`
  - `COURS / JARDINS CONFINÉS / JARDINS DE VILLE` → trame : `Cours urbaines` / `Jardins confinés` / `Jardins de ville`
  - `JARDINS PÉRI URBAINS / PROPRIÉTÉS PRINCIPALES / ET SECONDAIRES` → trame : `Jardins péri-urbains` / `Propriétés principales,` / `secondaires et résidentielles`
  - `CHÂTEAUX & MANOIRS / PROPRIÉTÉS FAMILIALES / PROPRIÉTÉS PATRIMONIALES` → trame : `Châteaux, Manoirs` / `Front de mer` / `Domaines` / `Viticoles` / `Aras`
  - → Réécrire les 4 taglines (sentence case + listes verbatim), domaine-caractère passe à 5 sous-types.
- **Layout** : actuel = carousel horizontal **pinné scroll-driven** (htypo-section 320vh, sticky). Trame = simple **rangée de 4 cartes** visibles. → À trancher : la trame ne montre pas de pin, juste 4 cartes alignées. Probable simplification en grille/rangée.
- **CTA hover** : actuel `cta: 'Découvrir'` constant (label curseur). Trame : **`Choisir` au repos → `Découvrir` au survol** (annotation « CHANGEMENT "CHOISIR" PAR "DECOUVRIR" »). → label repos manquant.
- **Noms** : `htypo-name` est en `text-transform: uppercase` (ligne 1238) → trame demande sentence case. `Cœur urbain` (ligature) vs trame `Coeur urbain`.
- **Blur au survol** : déjà présent (lignes 1273-1278). ✅ conforme.
- **Fond** : actuel beige ✅ (data-theme light). Conforme.

### 6. Hero → globalement conforme (« HERO INCHANGE »)

- L'annotation dit **« HERO INCHANGE »** → garder le `<HeroSwipe />` actuel. ✅
- Seul écart : le wordmark visuel. Vérifier qu'il est en **sentence case** `Studio` / `J. Oliveira` (trame) et non `STUDIO J. OLIVEIRA` UPPERCASE (à contrôler dans HeroSwipe.astro).

### 7. Topbar → à (re)créer

- Actuel : pas de topbar (retirée, gradient + Header auto-hide).
- Trame : **topbar = gros CTA `Démarrer un projet`** pleine largeur, masquée en hero plein écran / fixe après, 3 états (beige repos → noir survol → violet clic), logo + `MENU ☰`. → composant à créer.

### 8. Footer → divergences

- Territoires : actuel = liste villes ; trame = **`National`**.
- Nav droite : actuel = services (Architecture paysagère, etc.) ; trame = **Home / Studio / Projets / Démarrer un projet** + `Etudes par typologies de jardin` + mini-liste 4 typologies.
- Logo dans **pastille beige arrondie**. NAP gauche conforme (vérifier `Siège social Studio`).

### 9. Couleur VIOLET → à introduire

- Variable de thème `#e0afff` absente (l'actuel utilise `--color-laterite` / `--color-red`). → créer le token, l'appliquer sur topbar clic + logo/MENU clic.

### 10. MANIFESTE → confirmé ABSENT de la trame home

- L'actuel a déjà retiré le manifeste rouge de la home (remplacé par Stats). ✅ La trame ne montre aucun manifeste. (CSS `.manifeste-*` résiduel dans le `<style>` à nettoyer.)

### Récap priorités

1. Bande **Valeurs** (mots + casse) ← faux contenu.
2. Texte **Studio** ADN ← faux contenu.
3. **Stats** en cartes + sous-textes + 2 CTA ← incomplet.
4. **Taglines typologies** (listes verbatim + sentence case + 5e sous-type domaine).
5. Bandeau transition typologie.
6. CTA typologies `Choisir → Découvrir`.
7. Casse sentence-case globale (identité/typo names/wordmark).
8. Topbar CTA `Démarrer un projet` 3 états + violet.
9. Footer (National + nav simplifiée + pastille logo).
