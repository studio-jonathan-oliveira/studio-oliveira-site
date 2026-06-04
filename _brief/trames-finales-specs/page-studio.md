## ⚠️ RE-AUDIT 2026-06-04 (relecture par colonne col0→col2, bandes b0→b4)

Relecture HD tuile par tuile pour combler les états dépliés / colonnes latérales. La trame studio n'est **PAS** une page montrée en plusieurs états côte à côte : c'est **une seule page** découpée en colonnes (col0 = moitié gauche, col1 = bord droit + accordéon ouvert, col2 = marge droite = annotations designer). L'accordéon est dessiné **dans son état OUVERT, les 4 lignes déroulées simultanément** (vue de présentation), chaque ligne portant son descriptif complet + une icône **« × »** à droite.

Manques comblés (VERBATIM exact, casse/accents/fautes conservés) :

1. **ANNOTATION OUBLIÉE — intro « STUDIO » (col1_b1 + col2_b1)** : une 3ᵉ annotation d'animation, distincte, attachée au **bloc intro (photo bureau + texte)**, NON capturée dans la 1ʳᵉ spec. VERBATIM :

   > « ANIMATION DU TEXTE "STUDIO" EN APPARITION WAVY/VAGUE AVEC APPARITION/DISPARITION EN FONCTION DU SCROLL »
   > → Donc il y a **3 annotations wavy distinctes** (et non 2) : une sur le texte intro « STUDIO », une sur le **titre** de l'accordéon, une sur les **textes** (descriptifs). Voir Section 3bis ajoutée.

2. **ICÔNE ACCORDÉON OUVERT = « × » NET (col2_b2 / col2_b3)** : confirmation visuelle directe — dans l'état déroulé dessiné, **chaque** ligne porte un **« × » (croix noire)** aligné **à droite** (et non un « + »). En état fermé (col0), aucune icône n'est dessinée à gauche du titre côté col0 ; les icônes « + » apparaissent côté bord droit (col1_b2/b3) pour les lignes encore fermées. → modèle d'icône confirmé : **fermé « + », ouvert « × », icône à DROITE de la ligne**.

3. **ANNOTATION TITRE H2 ACCORDÉON — texte complet (col1_b2 + col2_b2)** VERBATIM intégral reconstitué bord-à-bord :

   > « ANIMATION DU TITRE EN APPARITION WAVY/VAGUE AVEC APPARITION/DISPARITION EN FONCTION DU SCROLL »

4. **ANNOTATION COMPORTEMENT ACCORDÉON — texte complet (col1_b2 + col2_b2)** VERBATIM intégral :

   > « DEROULE ACCORDEON, ANIMATION A L'IDENTIQUE DE CE QUI EXISTE CLIQUER SUR LE TITRE SUIVANT REFORME CELUI DU DESSUS AUTOMATIQUEMENT »

5. **ANNOTATION DESCRIPTIFS — texte complet (col1_b4 + col2_b4)** VERBATIM intégral :

   > « ANIMATION DES TEXTES EN APPARITION WAVY/VAGUE AVEC APPARITION/DISPARITION EN FONCTION DU SCROLL »

6. **VERBATIM descriptifs accordéon — confirmés sur la moitié droite (col2_b2/b3)** :
   - Bati (fin) : « …gent et dorment naturellement. Cette structure essentielle … esthétique de toutes les architectures qui gravitent autour. » → confirme « définie le tempo esthétique de toutes les architectures qui gravitent autour. »
   - Biophilique : « …ne seule avec comme seul objectif : reproduire le … » → **double espace confirmé** entre « seule » et « avec » (le mot « architecture » n'est PAS répété).
   - Biophilique (fin) : « C'est cette architecture que le **Studio J. Oliveira** vous … » → **point après J confirmé** côté col2.

7. **Topbar « Démarrer un projet » — position (col0_b0)** : le libellé n'est **pas centré dans la page** mais positionné **vers le centre-droit** de la topbar (aligné à droite du logo). Gras noir confirmé. (Nuance vs spec qui disait « centré horizontalement ».)

8. **Footer nav droite — casse exacte (col1_b4)** : liens empilés alignés droite, **graisse fine (light)** : « Home », « Studio », « Projets », « …un projet » (= Démarrer un projet, tronqué par le découpage), puis bloc « …de jardin » (= Etudes par typologies de jardin) avec « Domaine & Caractère » visible. Confirme la nav Home/Studio/Projets/Démarrer + typologies.

9. **Parcours — colonne détail droite tronquée (col0_b3/b4)** : la colonne de détail à droite de la frise est **coupée par le découpage** (« Studio de… », « 4.5 ans / Entrep… paysag… », « 1 an / Diplômé… », « 2 an… / Diplômé… », « 1 an / avec mention »). Les valeurs complètes proviennent de la 1ʳᵉ spec (tableau Section 6) ; rien de neuf ni de contradictoire trouvé, mais **noter que « avec mention » est le suffixe répété** (« Diplômé avec mention ») pour Licence Pro / BTSA / BAC PRO (visible 3× en col1_b3 « avec mention »).

> Aucun autre texte caché, aucun violet #e0afff dessiné dans cette trame studio (les seules teintes : beige #EDE6D6, noir #000000, annotations en beige plus saturé/crème, rouge = guides). Pas de divergence de contenu vs la 1ʳᵉ spec hormis l'annotation « STUDIO » oubliée et la position topbar.

---

# Spec reconstruction — Page /studio (trame Jonathan)

> Source de vérité : trame « page studio » (orig. 4525×6823 px, 3 col × 4 lignes de tuiles, recouvrement 160 px).
> Toute mesure de proportion s'appuie sur le **cadre rouge = 1 écran 1920×1080** (les traits rouges ne sont PAS du design).
> Couleurs globales : **NOIR #000000**, **BEIGE/CREAM #EDE6D6**, **VIOLET #e0afff** (accents accordéon/curseur). Aucune autre couleur observée dans la trame de cette page (le footer est noir pur).
> Texte verbatim ci-dessous = OCR consolidé des tuiles. Les blocs en **beige clair sur beige** sont des **annotations d'animation du designer** (retranscrites en encadré « ANNOTATION »).

---

## Vue d'ensemble (ordre haut → bas)

1. **Topbar + Header** (fond beige) — pilule « Démarrer un projet » + logo Oliveira + MENU
2. **Hero « Bienvenue »** (fond beige) — H1 énorme « Bienvenue » noir, aligné bas-gauche
3. **Bloc texte d'intro + photo** (fond beige) — paragraphe gauche / photo bureau droite
4. **Titre manifeste** (fond beige) — « Composer avec toutes les architectures pour créer un ensemble uni. »
5. **Accordéon Architectures** (fond beige, 4 lignes) — Bati / d'Intérieur / Paysagère / Biophilique
6. **Parcours et Expérience** (fond beige) — H2 + photo gauche + frise 5 entrées droite
7. **Footer** (fond NOIR, plein-bleed, coins arrondis) — logo + NAP + nav + typologies

> **Différence majeure de DA vs la page actuelle** : la trame est **claire (beige) sur quasi toute la page**, texte **noir**. La page actuelle est en **noir/rouge/cream**. Voir DELTAS.

---

## Section 1 — Topbar + Header

- **Fond** : beige #EDE6D6. Le bloc commence par un **conteneur à coins arrondis** (rayon ~40 px) qui démarre en haut du cadre rouge (la page entière semble être une grande carte beige à coins arrondis).
- **Topbar centrée** (haut du cadre rouge) : libellé **« Démarrer un projet »**, **noir**, **gras (bold)**, taille petite (~16–18 px), centré horizontalement. C'est la barre de contact globale (ContactBar).
- **Header** (sous la topbar) :
  - **Gauche** : logo **« oliveir~ »** (logotype manuscrit/cursive noir, avec petit **®** en bas-droite). Hauteur ~40 px.
  - **Droite** : **« MENU »** noir gras + icône burger (deux traits horizontaux) à droite du mot.
- Proportion : topbar + header occupent ~le premier quart haut du premier écran rouge.

---

## Section 2 — Hero « Bienvenue »

- **Fond** : beige #EDE6D6.
- **Texte unique** : **« Bienvenue »**
  - Police : **sans-serif géométrique très grasse (Black/Heavy)** — proche d'un Helvetica/Inter Black.
  - **Casse** : Capitale initiale uniquement (« Bienvenue », pas UPPERCASE).
  - **Couleur** : NOIR #000000.
  - **Taille** : ÉNORME — la hauteur de cap fait ~⅓ de la hauteur du cadre rouge (≈ 300–340 px de cap height à l'échelle originale). Le mot s'étale sur ~65 % de la largeur.
  - **Position** : aligné **à gauche** (le « B » colle quasi au bord gauche), **bas du premier écran** (le mot occupe la moitié basse du 1ᵉ écran rouge, sous une grande zone vide en haut).
  - Interligne : N/A (un seul mot).
- Le bas du mot « Bienvenue » est très proche du trait rouge marquant la fin du 1ᵉʳ écran (1080 px).

---

## Section 3 — Bloc intro texte + photo

Layout 2 colonnes, commence juste sous la ligne de fin du 1ᵉʳ écran rouge.

### Colonne gauche — paragraphe d'intro

- **Couleur** : NOIR sur beige.
- **Police** : sans-serif **légère/regular** (corps de texte), taille ~22–24 px à l'échelle orig, interligne aéré (~1.5).
- **Largeur** : ~⅖ de la largeur (colonne étroite à gauche).
- **Texte VERBATIM** (suite continue, découpé sur 2 tuiles) :

> « Le studio J. Oliveira a été crée en fin 2021 à la suite de 4 ans d'expérience en tant que chef de projet et dessinateur projeteur dans une entreprise d'aménagements paysagers à Limoges.
>
> Fort d'une expérience de plus de 10 ans dans l'architecture paysagère et diplômé d'une Licence Pro conception paysagère, j'ai construit mon design autour de mon admiration pour les paysages naturels et immersifs ainsi que de la pluralité des architectures qui animent nos espaces de vie.
>
> Le design est un art qui lie fonctionnalité, ergonomie et esthétique. C'est dans cette dimension que le studio conçoit ses projets.
>
> Le végétal, quant à lui, représente le liant de l'ensemble des composantes spatiales pour créer cet environnement agréable et durable.
>
> Je construit, par une méthode précise, une réflexion et une structuration globale qui sécurise un résultat final pour garantir une expérience d'usage durable. »

> ⚠️ Nuances OCR (verbatim trame, fautes incluses telles que dessinées) :
>
> - « crée » (et non « créé »), « Je construit » (et non « Je construis »).
> - **« plus de 10 ans »** (la trame indique **10**, pas 9).
> - P5 commence par **« Je construit, par une méthode précise… »** (PAS « Ce qu'il faut bien comprendre, c'est que je ne vends pas qu'une étude. Je vends par une méthode… »).
> - P4 : **« le liant de l'ensemble des composantes spatiales »** (PAS « le liant de l'unité de l'ensemble »).

### Colonne droite — photo

- **Position** : moitié droite, alignée en haut du bloc texte, dépasse légèrement à droite jusqu'au bord du cadre rouge.
- **Ratio** : ~portrait/carré (≈ 4/5, hauteur > largeur).
- **Contenu** : **photo en plongée d'un bureau de travail** — vue de dessus/arrière d'une personne (Jonathan) assise tenant une tablette, devant un setup multi-écrans (PC + écran affichant un paysage/projet), clavier, souris, lampe d'appoint à droite, plante verte en bas-gauche. Ambiance chaude (lumière tungstène orangée), tons sombres. Placeholder : `studio/02-parcours.jpg` (photo de travail).

---

### Section 3bis — ANNOTATION animation du bloc intro (ajout RE-AUDIT 2026-06-04)

> **ANNOTATION (bloc intro « STUDIO »)** — VERBATIM (col1_b1 / col2_b1, en marge droite de la photo bureau) :
> « ANIMATION DU TEXTE "STUDIO" EN APPARITION WAVY/VAGUE AVEC APPARITION/DISPARITION EN FONCTION DU SCROLL »
> → Le paragraphe d'intro (et/ou le mot « STUDIO ») doit apparaître en **wavy/vague piloté par le scroll**, réversible (apparition ET disparition). Même grammaire d'animation que le titre H2 et les descriptifs accordéon.

---

## Section 4 — Titre manifeste (« Composer avec… »)

- **Fond** : beige.
- **Position** : sous le bloc intro, aligné **à gauche**, fin du 2ᵉ écran rouge.
- **Police** : sans-serif **grasse (Bold)**, NOIR.
- **Casse** : Capitale initiale + minuscules (PAS UPPERCASE).
- **Taille** : grande (titre de section), ~3 lignes.
- **Texte VERBATIM** (sur 3 lignes telles que cassées) :

> **« Composer avec toutes les
> architectures pour créer un
> ensemble uni. »**

- Interligne serré (~1.1).

> 📝 Diffère du manifeste actuel (« CHAQUE ESPACE SE COMPOSE D'UN EXISTANT… »). Ici c'est une phrase courte « Composer avec toutes les architectures pour créer un ensemble uni. »

---

## Section 5 — Accordéon « Architectures »

- **Fond** : beige.
- **Layout** : liste de **4 lignes** pleine largeur, séparées par des **filets fins noirs** (top + bottom border). Chaque ligne = grande carte à coins arrondis (le bloc accordéon entier est dans une carte beige arrondie).
- **Header de ligne** (état fermé) :
  - **Titre à gauche** : sans-serif **Bold**, NOIR, **Title Case**, taille ~40–48 px orig.
  - **Icône à droite** : **« + »** (plus) NOIR, gros, aligné à droite. → indique « dérouler ».
- **Header de ligne** (état ouvert, vu sur tuiles r2_c1/r2_c2) :
  - Icône devient **« × »** (croix) NOIR → indique « fermer ».
  - Sous le titre apparaît le **descriptif** : sans-serif **regular/léger**, NOIR, taille corps (~22 px orig), interligne ~1.5, pleine largeur de la carte.
- **Espacement vertical** des lignes fermées : généreux (~80–90 px de hauteur par ligne fermée).

### Les 4 lignes (titres VERBATIM + descriptifs VERBATIM ouverts)

**1. Architecture Bati** (note : « Bati » sans accent dans la trame)

> « L'architecture bâtie regroupe la dénomination de l'habitat, le lieu où les gens vivent, mangent et dorment naturellement. Cette structure essentielle orchestre la propriété comme un axe central de toutes les circulations et définie le tempo esthétique de toutes les architectures qui gravitent autour. »

**2. Architecture d'Intérieur** (Title Case avec « d'Intérieur » majuscule I)

> « Cette architecture qui anime nos quotidiens intérieurs tant dans le monde du pro que du perso est surement celle qui impacte le plus notre perception et interpretation de l'espace. Elle est le guide de votre personnalité et influence toutes les autres architectures connectées. »

**3. Architecture Paysagère**

> « A tort déconsidérée comme une architecture à part entière, elle se positionne bel et bien comme une structure de la vie à l'extérieur de l'environnement bati et connectée à l'entité de l'habitat. L'architecture paysagère accueille, reçoit, guide et prolonge toutes les expériences de vie de l'extérieur vers l'intérieur et de l'intérieur vers l'extérieur. »

**4. Architecture Biophilique**

> « C'est l'architecture la plus vivante de toutes car elle connecte toutes les architectures en une seule avec comme seul objectif : reproduire le contexte environnemental naturel pour apporter les bénéfices aux usagers des espaces non naturels. Elle prend, dans sa conception, les aspects naturels et les combine aux environnements humains pour rendre une synthèse expérientielle de l'habitat. C'est cette architecture que le Studio J. Oliveira vous propose à travers son design. »

> Nuances vs page actuelle : la trame écrit **« en une seule »** (sans le mot « architecture » répété — double espace visible avant « avec »), et **« Studio J. Oliveira »** (avec point après J).

### ANNOTATIONS animation (beige clair, r1_c1 / r1_c2)

> **ANNOTATION (titre du H2 accordéon)** — VERBATIM :
> « ANIMATION DU TITRE EN APPARITION WAVY/VAGUE AVEC APPARITION/DISPARITION EN FONCTION DU SCROLL »

> **ANNOTATION (comportement accordéon)** — VERBATIM :
> « DEROULE ACCORDEON, ANIMATION A L'IDENTIQUE DE CE QUI EXISTE CLIQUER SUR LE TITRE SUIVANT REFORME CELUI DU DESSUS AUTOMATIQUEMENT »
> → Confirme : **single-open** (ouvrir une ligne referme la précédente automatiquement). L'animation de déroulé doit rester identique à l'existant.

> **ANNOTATION (descriptifs)** — VERBATIM (r3_c1/r3_c2, sous le bloc) :
> « ANIMATION DES TEXTES EN APPARITION WAVY/VAGUE AVEC APPARITION/DISPARITION EN FONCTION DU SCROLL »

---

## Section 6 — Parcours et Expérience

- **Fond** : beige.
- **Titre H2** : **« Parcours et Expérience »**
  - Police : sans-serif **Bold**, NOIR, Title Case (PAS UPPERCASE, PAS justifié bord-à-bord).
  - Taille moyenne-grande (~60 px orig), aligné **à gauche**.
- **Layout 2 colonnes** :

### Colonne gauche — photo

- **Ratio** : portrait (≈ 3/4).
- **Contenu** : **photo d'un jardin/patio paysager** — allée de graviers, plantations, vue vers une maison/véranda au fond avec baies vitrées. Verdure dense. Placeholder : `studio/01-hero.jpg` (jardin).

### Colonne droite — frise / timeline

- **Layout** : liste de lignes, chaque ligne en **3 zones** :
  - Zone 1 (gauche, ~40 %) : **intitulé** sur 1–2 lignes, sans-serif regular NOIR, ~22 px.
  - Zone 2 (droite, ~40 %) : **détail/durée** en sans-serif **plus petit et gris/atténué** (~14–16 px), aligné colonne droite.
- Séparées par **filets fins** horizontaux.
- **5 entrées VERBATIM** (du plus récent au plus ancien) :

| Intitulé (gauche)                            | Détail (droite)                                        |
| -------------------------------------------- | ------------------------------------------------------ |
| **Création du studio** / 2021                | Studio de conception paysagère en indépendant          |
| **Chef de projet /** / Dessinateur projeteur | 4.5 ans / Entreprise d'aménagements paysagers, Limoges |
| **Licence Pro** / Conception paysagère       | 1 an / Diplômé avec mention                            |
| **BTSA** / Aménagements paysagers            | 2 ans / Diplômé avec mention                           |
| **BAC PRO** / Travaux paysagers              | 1 an / Diplômé avec mention                            |

> ⚠️ La trame ne montre **que 5 entrées** (Création studio → BAC PRO). Pas de « BAC ES » 6ᵉ ligne, pas de mention « Brive-la-Gaillarde » dans le détail création, et « 4.5 ans » écrit avec un point (pas « 4,5 »). L'intitulé est **« Création du studio » / 2021** (PAS « Création du Studio J Oliveira — 2021 »).

---

## Section 7 — Footer (NOIR)

- **Fond** : **NOIR pur #000000**, plein-bleed, **coins arrondis en haut** (grande carte noire qui « monte » sur le beige).
- **Texte** : CREAM/blanc #EDE6D6.
- **Layout 2 colonnes** :

### Haut-gauche

- **Logo** « oliveir~ » dans un **carré blanc à coins arrondis** (bloc logo inversé sur fond noir).

### Colonne gauche (sous logo)

- **« Siège social Studio »** (heading, gras petit, cream) puis adresse :
  > 41 Rue Général Souham
  > 19100 BRIVE
  > 06 61 08 84 44
  > contact.jonathanbiodesign@gmail.com
- Plus bas : **« Territoires d'intervention »** (heading) :
  > National
- Tout en bas-gauche : **« Droits réservés, mentions légales, etc. »** (petit, atténué).

### Colonne droite — navigation (alignée à droite, cream)

- Liens empilés, taille moyenne, alignés droite :
  > Home
  > Studio
  > Projets
  > Démarrer un projet
- Sous ce bloc, un sous-bloc **« Etudes par typologies de jardin »** (titre) avec 4 sous-liens en ligne, plus petits :
  > **Micro urbain** · Coeur urbain · Frange urbaine · Domaine & Caractère
  - « Micro urbain » a une **puce/carré** devant (item actif/premier).

> 📝 Footer trame = différent de l'actuel (l'actuel a Services + Studio empilés à droite, Bordeaux/Limoges en territoires). La trame montre **Territoires = « National »**, et une nav droite Home/Studio/Projets/Démarrer + bloc typologies de jardin. C'est un **footer global** (hors page studio à proprement parler) — à traiter avec Morgan.

---

## Specs transversales rappelées (contexte global)

- **Curseur sitewide** : nouveau curseur = **CARRÉ à angles arrondis + petit point**, 3 couleurs selon le fond (noir / cream / violet). (Page studio n'annote pas de couleur curseur spécifique.)
- **Infos qui suivent le curseur** (tooltip apparaissant **haut-droite** du curseur) : non annoté explicitement sur cette trame studio, mais pattern sitewide.
- **Flou au survol d'image + action au clic** : non annoté sur les photos de cette trame (les 2 photos studio ne portent pas d'annotation hover). À vérifier si appliqué sitewide.
- **Icônes accordéon** : **« + »** pour dérouler, **« × »** pour fermer (confirmé visuellement sur la trame, en noir sur fond beige).

---

# DELTAS vs page actuelle (`src/pages/studio.astro` + `ArchitecturesAccordion.tsx` + `Footer.astro`)

### A. Direction artistique globale (changement le plus lourd)

1. **Fond : beige #EDE6D6, texte NOIR sur TOUTE la page** dans la trame. Actuellement : Hero noir (`bg-black-deep`/cream), Manifeste rouge, Architectures rouge, Parcours noir. → **Inverser entièrement** : sections beige/clair, texte noir. (À confirmer avec Morgan : c'est un pivot DA majeur vs le noir/rouge actuel.)
2. **Plus de section rouge** dans la trame (ni manifeste rouge, ni accordéon rouge). Le rouge n'apparaît que comme **traits de cadrage** (= guides, pas design).
3. La page semble construite comme **une grande carte beige à coins arrondis** (header arrondi en haut, footer noir arrondi en bas).

### B. Hero

4. Le hero trame = **un seul mot géant « Bienvenue »** (capitale initiale, noir, bas-gauche, ~⅓ hauteur écran). Actuel : H1 = long paragraphe UPPERCASE cream sur fond noir + 5 paragraphes + photo dans le même hero.
5. Le **bloc des 5 paragraphes d'intro + la photo bureau** sont une **section distincte SOUS le hero** dans la trame (pas dans le hero). Actuel : tout dans le hero, photo à droite du texte.

### C. Texte intro (verbatim à corriger)

6. P1 : « a été **crée** en fin 2021 » (trame : crée). Actuel : « a été créé ».
7. P2 : **« plus de 10 ans »**. Actuel : « plus de 9 ans ».
8. P4 : **« le liant de l'ensemble des composantes spatiales »**. Actuel : « le liant de l'unité de l'ensemble ».
9. P5 : trame = **« Je construit, par une méthode précise, une réflexion et une structuration globale qui sécurise un résultat final pour garantir une expérience d'usage durable. »** Actuel = « Ce qu'il faut bien comprendre, c'est que je ne vends pas qu'une étude. Je vends par une méthode précise… ». → **Texte différent**, P5 à remplacer.

### D. Titre manifeste

10. Trame : **« Composer avec toutes les architectures pour créer un ensemble uni. »** (Bold, casse normale, noir). Actuel : blockquote rouge UPPERCASE « CHAQUE ESPACE SE COMPOSE D'UN EXISTANT ET D'UN DEVENIR… ». → **Phrase + style entièrement différents.**

### E. Accordéon

11. Titres : casse OK globalement, mais trame écrit **« Architecture d'Intérieur »** (I majuscule). Actuel : `Architecture d'intérieur` (i minuscule).
12. **Icône fermée = « + »**, ouverte = **« × » (croix)**. Actuel : un seul `+` qui **pivote à 45°** (rotate) pour faire la croix — visuellement proche mais ce n'est pas un vrai `×`. La trame montre un `+` net en fermé et un `×` net en ouvert (acceptable via rotate, mais à valider).
13. Couleur : trame = **noir sur beige**. Actuel : cream sur rouge.
14. Titres accordéon : trame = **Bold**. Actuel : `font-weight: 200` (ExtraLight, retour Morgan v7). → divergence graisse.
15. Descriptif Biophilique : trame **« en une seule avec comme seul objectif »** (sans « architecture » répété). Actuel : « en une seule architecture avec comme seul objectif ». → mot « architecture » en trop dans l'actuel.
16. Descriptif Biophilique fin : trame **« Studio J. Oliveira »** (point). Actuel : « Studio J Oliveira » (sans point).
17. **Animations annotées** (à implémenter / vérifier) : titre H2 en apparition **wavy/vague** liée au scroll ; **textes des panneaux** en apparition wavy/vague liée au scroll (apparition ET disparition). Actuel : wave reveal des mots à l'ouverture (CSS --i), mais **pas piloté par le scroll** ni réversible scroll. → à aligner sur l'annotation « apparition/disparition en fonction du scroll ».

### F. Parcours

18. Titre : trame = **« Parcours et Expérience »** Bold, casse normale, aligné gauche, taille moyenne. Actuel : `PARCOURS ET EXPERIENCE` UPPERCASE, **justify-multi bord-à-bord** (énorme, étalé). → trame ne montre PAS le justify géant ici.
19. **5 entrées** dans la trame, pas 6. Supprimer **« BAC ES »**.
20. Entrée 1 : trame = **« Création du studio » / « 2021 »** + détail « Studio de conception paysagère en indépendant ». Actuel : « Création du Studio J Oliveira — 2021 » + « Studio de design biophilique indépendant, Brive-la-Gaillarde ». → libellé + détail différents.
21. « 4.5 ans » (point) vs actuel « 4,5 ans » (virgule) — détail.
22. Intitulés trame : « Licence Pro / Conception paysagère », « BTSA / Aménagements paysagers », « BAC PRO / Travaux paysagers ». Actuel : « Licence Pro Conception et aménagement paysagers », « BTSA Aménagement paysagers », « Bac Pro Travaux paysagers ». → libellés à ajuster (et split intitulé/sous-titre sur 2 lignes).
23. Détails atténués (durée + diplôme) en **gris petit aligné à droite** : actuel a annee (uppercase bold) + detail (cream atténué) empilés/2 col — proche mais casse différente (trame intitulé pas en UPPERCASE).

### G. Header / Topbar

24. Topbar trame = **« Démarrer un projet »** centré, gras noir. Logo « oliveir~ » + ® gauche, « MENU » + burger droite. → vérifier que ContactBar/Header rendent ce libellé exact et en **noir sur beige** (vu la DA claire).

### H. Footer (global, hors page mais visible dans la trame)

25. Trame : Territoires = **« National »** (1 ligne). Actuel : Brive / Limoges / Bordeaux (3 liens).
26. Nav droite trame = **Home / Studio / Projets / Démarrer un projet** + bloc **« Etudes par typologies de jardin »** (Micro urbain · Coeur urbain · Frange urbaine · Domaine & Caractère). Actuel : Services (Architecture paysagère, …, PRO, Projets) + Studio (Le studio, Journal, Contact). → structure de nav du footer différente.
27. Logo footer trame = dans un **carré blanc arrondi**. Actuel : `logo-mark` + dot. → vérifier rendu.

### I. Curseur (sitewide)

28. Trame : curseur **carré arrondi + point**. Actuel : `CustomCursor` = **disque rond** (cursor-ring) + dot. → changer la forme en carré arrondi, conserver le tooltip haut-droite.
