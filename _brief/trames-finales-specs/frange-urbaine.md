# Spec — Trame « Frange urbaine » (`/architecture-paysagere/frange-urbaine`)

Source de vérité : maquette Jonathan, originale 1924 x 13392 px, 1 colonne x 8 lignes (scroll vertical).
Tuiles analysées : `frange-urbaine__r0_c0.png` → `frange-urbaine__r7_c0.png` (recouvrement 160 px).

**Palette observée** : BEIGE fond `#EDE6D6`, NOIR texte/footer `#000000`. Aucun VIOLET visible sur cette trame. Aucune autre couleur signalée (les traits ROUGES sont les repères écran 1920x1080, pas du design).

**Important** : la trame ne montre ni le nouveau curseur carré, ni d'annotation designer écrite (pas de verbatim d'animation), ni d'accordéon ouvert. Les seuls accordéons visibles sont les « + » de la FAQ (fermés).

---

## 0 · TOPBAR + HEADER (r0)

Ordre de haut en bas, sur fond beige `#EDE6D6` :

1. **Barre « Démarrer un projet »** — bloc supérieur arrondi en bas (grand radius, coins inférieurs arrondis), pleine largeur.
   - Texte centré : **« Démarrer un projet »** — sans-serif, **gras (Bold)**, NOIR, casse Title (D + minuscules), taille moyenne (~ texte de nav). Centré horizontalement.
2. **Ligne header** sous la barre :
   - **Gauche** : logo wordmark **« oliveira »** manuscrit/script noir avec petit **®** en exposant à droite.
   - **Droite** : **« MENU »** en sans-serif **Bold** NOIR UPPERCASE + à sa droite l'icône burger (deux traits horizontaux noirs empilés).
   - Beaucoup d'air au-dessus du H1.

Filigrane : tout en haut de r0, hors cadre rouge, on devine en très clair (beige sur beige, quasi invisible) le texte **« FRANGE URBAINE »** en gros Bold UPPERCASE — élément décoratif watermark.

---

## 1 · HERO (r0 → r1)

Grammaire HERO commune aux 4 typologies. Sur cette trame, le hero est en BEIGE (pas de photo plein-bleed dans la maquette — fond uni).

### H1 (titre typologie)

- Deux lignes empilées, alignées **à GAUCHE**, NOIR (pas rouge dans la trame) :
  - Ligne 1 : **`Frange`**
  - Ligne 2 : **`urbaine`**
- Police sans-serif très **grasse (Black/Bold)**, casse Title (F majuscule, reste minuscules), énorme (occupe ~ moitié de la largeur, descend très bas), interligne serré (les deux lignes quasi collées, line-height ~0.95).
- Couleur NOIR `#000000`.

### Bloc 4 specs (sous le H1)

Quatre lignes, chacune en **flex space-between** : **label à GAUCHE**, **valeur collée au bord DROIT**. Chaque ligne séparée par un **trait fin** (séparateur horizontal, coin arrondi sur les blocs). Labels figés (taxonomie studio), valeurs propres à frange urbaine :

| Label (gauche, NOIR, sans-serif regular, ~moyen, casse Title) | Valeur (droite, NOIR/gris foncé, plus petit)                                                      |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `Secteur géographique`                                        | `Zone péri urbaine et province`                                                                   |
| `Moyenne surface jardin`                                      | `de 500 à 1500 m² (hors cas spécifique)`                                                          |
| `Type de jardin / propriété`                                  | `Jardins en pente / Jardins péri-urbains / Propriétés principales, secondaires et résidentielles` |
| `Complexité spatiale et environnementale`                     | `Accès / topographie / surface / environnement`                                                   |

> NOTE VERBATIM importante :
>
> - Le 3e label de la trame est **`Type de jardin / propriété`** (pas « Contexte environnemental »).
> - La 2e valeur est **`de 500 à 1500 m²`** (minuscule « de », borne basse 500).
> - La 3e valeur trame = `Jardins en pente / Jardins péri-urbains / Propriétés principales, secondaires et résidentielles`.

Marges : padding latéral généreux (gauche aligné au H1, droite aligné bord page). Interligne aéré entre les rows.

---

## 2 · IMAGE OPENER + « Définir » (r1 → r2)

Ordre :

1. **Image 1 — paysage horizontal** centrée, NON pleine largeur (gouttières beige gauche/droite). Ratio ~ 4/3 / paysage. Coins du conteneur arrondis.
   - Contenu (placeholder) : villa méditerranéenne blanche, baies vitrées, jardin dense au premier plan (cactus colonnaire, palmiers, agaves), ciel bleu. Photo réaliste couleur.

2. **Bloc texte « Définir »** — disposition 2 colonnes :
   - **Colonne gauche** : titre **`Définir`** — sans-serif **Bold** NOIR, casse Title, taille moyenne-grande (~ 2.5-3rem). Aligné en haut.
   - **Colonne droite** (commence ~ 1/3 de la largeur) : paragraphe corps de texte NOIR, regular, ~ 1rem, interligne aéré (~1.5). VERBATIM :

   > La typologie frange urbaine se caractérise par de grands espaces de vie extérieurs dont les propriétés animent les couronnes extérieures du tissu urbain vers la province.

3. **Suite du paragraphe** (toujours colonne droite, deuxième bloc, léger espacement) — VERBATIM :

   > Ces propriétés familiales offrent des points de vue à fort potentiel sur les paysages environnants et le jardin est une pièce à part entière d'usage intensif, souvent composées d'un espace de stationnement et d'accueil à l'avant et d'un jardin destiné à la vie de famille à l'arrière.

   > NOTE : la trame dit `à l'avant` … `jardin destiné à la vie de famille à l'arrière` (formulation différente de la page actuelle).

---

## 3 · GALERIE (r2 → r5)

Galerie « magazine », fond beige, gouttières beige généreuses, aucun bord-à-bord, conteneurs à coins légèrement arrondis. Ordre haut→bas :

1. **Image 2 — grand paysage** centré, presque pleine largeur (gouttières fines). Paysage horizontal.
   - Contenu : ciel bleu dominant en haut, palmiers en silhouette, villa beige/jaune à toit tuile en bas, végétation. (r2)

2. **Image 3 — grand paysage** centré (même largeur que l'image 2).
   - Contenu : villa hispanique à étage, perron/escalier, pelouse en pente (fairway/golf) avec muret en pierre sèche, bordure piscine bleue au premier plan. (r3)

3. **Diptyque (2 images côte à côte)** :
   - **Gauche** : portrait vertical — jardin japonais zen, pas japonais minéraux sur bassin, érables/feuillages verts denses. (r3 bas → r4)
   - **Droite** : portrait vertical — mur blanc + escalier extérieur à balustres jaunes, bougainvilliers roses en cascade, philodendrons/monstera, pots en terre cuite. (r4)
   - Les deux images de hauteur ~ égale, gouttière centrale beige.

4. **Image 4 — grand paysage** centré, presque pleine largeur.
   - Contenu : patio/terrasse outdoor contemporain — canapé d'angle gris sous pergola, parasol blanc, dalles de pierre alternées avec bandes d'herbe, arbre sculptural au centre, maison vitrée à droite, jungle tropicale en fond. (r4 bas → r5)

5. **Image 5 — grand paysage** centré (sous « Comprendre », voir section 4) :
   - Contenu : galerie/coursive contemporaine à structure verticale claire, bassin miroir sombre au sol, arbre au feuillage dense traversant, intérieur visible à gauche, jungle à droite. (r5)

> Disposition résumée : **2 grands paysages** → **1 diptyque portraits** → **1 grand paysage** → (titre « Comprendre ») → **1 grand paysage**. Soit ~ 6 visuels au total dans le flux galerie/texte.

---

## 4 · « Comprendre » (r5 → r6)

Même grammaire que « Définir » : 2 colonnes.

- **Colonne gauche** : titre **`Comprendre`** — sans-serif **Bold** NOIR, casse Title, taille moyenne-grande.
- **Colonne droite** : paragraphe NOIR regular, interligne aéré. VERBATIM (deux fragments de r5 + r6 réassemblés) :

  > La complexité de cette typologie repose principalement sur la topographie du jardin, souvent en pente qu'il faut re-modeler pour améliorer l'usage et la fonctionnalité de l'espace. La typologie est rythmée par des structures qui viennent impacter à la fois l'usage du site et le paysage dans son ensemble.

  > NOTE : la trame écrit `re-modeler` (avec trait d'union).

---

## 5 · BANDEAU MARQUEE « découvrir les projets » (r6)

Entre le bloc « Comprendre » et la FAQ : **bande défilante (marquee)** pleine largeur.

- Texte répété en boucle : **`découvrir les projets ◦ découvrir les projets ◦ découvrir les projets`** (séparateur = petit cercle/point `◦`).
- Style : sans-serif, **contour seulement (outline / texte évidé)** — lettres beige avec contour noir fin, **PAS de remplissage** (effet « stroke text »). Casse minuscule (« découvrir les projets »). Très grand (lettres ~ 80-100 px de haut).
- Implique une **ANIMATION de défilement horizontal** (marquee) — non annotée mais évidente par la troncature des mots aux deux bords (« vrir les projets » à gauche, « projet » coupé à droite).

---

## 6 · FAQ (r6 → r7)

Fond **BEIGE** `#EDE6D6` (PAS rouge). Ordre :

1. **Titre `FAQ`** — sans-serif **Black/Bold** NOIR, ÉNORME (lettres ~ 200 px), casse UPPERCASE, aligné à gauche (avec un retrait gauche). Pas de sous-titre « Questions fréquentes » visible sous le titre dans la trame.

2. **Liste d'accordéons** (fermés) — chaque ligne pleine largeur, séparée par un trait fin, coins arrondis :
   - Texte question à gauche : sans-serif **regular/light** NOIR, taille moyenne-grande (~ 1.5-1.8rem), casse Title, ponctuation `?` précédée d'une espace (`… ?`).
   - **« + »** à l'extrême droite, NOIR, gras (indicateur accordéon fermé → s'ouvrirait en « X »).

   Questions VERBATIM (3 visibles) :
   1. `Comment se compose une étude ?`
   2. `Quels sont les livrables de l'étude ?`
   3. `Quel est le prix de l'étude pour cette typologie ?`

   > NOTE : la trame montre **3 questions**, et la 2e est **`Quels sont les livrables de l'étude ?`** (question absente de la page actuelle). Aucune question « Pourquoi facturer une étude… » dans la trame.
   > Réponses non visibles (accordéons fermés) → contenu réponses [À FOURNIR / déjà détenu côté page].

---

## 7 · FOOTER (r7)

Grand bloc **NOIR** `#000000` pleine largeur, coins supérieurs arrondis, texte BEIGE/cream. Layout 2 zones :

**Zone gauche :**

- **Logo** dans une tuile arrondie beige (carré à coins arrondis ~ icône app) : wordmark **« oliveira »** script NOIR + **®**.
- **`Siège social Studio`** — sans-serif **Bold** cream.
  - `41 Rue Général Souham`
  - `19100 BRIVE`
  - `06 61 08 84 44`
  - `contact.jonathanbiodesign@gmail.com`
    (lignes regular, cream, petites)
- **`Territoires d'intervention`** — sans-serif **Bold** cream.
  - `National` (regular, cream)

**Zone droite (liens nav, alignés à droite, sans-serif light/regular cream, casse Title, grande taille) :**

- `Home`
- `Studio`
- `Projets`
- `Démarrer un projet`
- **`Etudes par typologies de jardin`** (titre de groupe, plus grand)
  - sous-liens sur une ligne : **`Micro urbain`** (en **gras**, précédé d'un petit carré/puce `▪.`) · `Coeur urbain` · `Frange urbaine` · `Domaine & Caractère` (regular, plus petits, espacés).

**Bas du footer :** ligne fine séparatrice puis **`Droits réservés, mentions légales, etc.`** — petit, cream atténué, aligné à gauche.

> NOTE : dans le footer de la trame frange-urbaine, c'est **« Micro urbain »** qui est en gras/actif (puce) — probablement un artefact de la trame source (copiée depuis la page micro-urbain). Sur la vraie page frange, l'actif devrait être « Frange urbaine ».

---

## DELTAS vs page actuelle

Page : `src/pages/architecture-paysagere/frange-urbaine.astro` + composants partagés `TypologieHero.astro`, `TypologieFaq.astro`, `FaqAccordion`.

### Hero / specs

1. **3e label** : page utilise `Contexte environnemental` (label figé dans `TypologieHero.astro` ligne 53). **Trame = `Type de jardin / propriété`**. Divergence de taxonomie.
2. **Valeur surface** : page = `De 300 à 1500 m² (hors cas spécifique)`. **Trame = `de 500 à 1500 m² (hors cas spécifique)`** (500 vs 300, « de » minuscule).
3. **Valeur type** : page = `Jardins en pente / propriétés principales, secondaires ou résidentielles`. **Trame = `Jardins en pente / Jardins péri-urbains / Propriétés principales, secondaires et résidentielles`** (ajoute « Jardins péri-urbains », « et » vs « ou »).
4. **Couleur H1** : page met le H1 en **ROUGE** bas-gauche sur photo plein-bleed + voile. **Trame = H1 NOIR sur fond beige uni**, pas de photo en arrière-plan du hero. (À confirmer avec Morgan : la trame pourrait simplement ne pas représenter la photo.)
5. **Casse H1** : page force `text-transform: uppercase` (`FRANGE` / `URBAINE`). **Trame = casse Title** (`Frange` / `urbaine`).

### Structure manifeste

6. La page a **une seule section « Manifeste »** (bloc1 + bloc2 fade-words, puis precision) sur fond NOIR cream. **La trame éclate le manifeste en DEUX blocs titrés** intercalés dans la galerie : **`Définir`** (bloc1 + bloc2) puis **`Comprendre`** (precision), tous deux sur **fond BEIGE** en layout 2 colonnes (titre gauche / texte droite). Refonte structurelle.
7. **Fond manifeste** : page = noir/cream. Trame = beige/noir.
8. **Verbatim bloc2** : page dit `…d'un jardin arrière destiné à la vie de la famille.`. **Trame = `…à l'avant et d'un jardin destiné à la vie de famille à l'arrière.`** (mention « à l'avant », « à l'arrière », « vie de famille »).
9. **Verbatim precision** : page = `remodeler`. **Trame = `re-modeler`** (trait d'union).

### Galerie

10. Page = 6 images (`02-palmiers` opener large, `03-maison` large, diptyque portraits 04/05, diptyque landscapes 06/07). **Trame** : ordre/rythme différent — 2 grands paysages, 1 **diptyque portraits** (japonais + escalier bougainvilliers), 1 grand paysage (patio), puis 1 grand paysage (coursive/bassin) **après** le titre « Comprendre ». Pas de « diptyque landscapes 50/50 » en fin ; les images sont entrelacées avec les blocs texte Définir/Comprendre.
11. **Image opener** : trame insère une image (villa méditerranéenne) **avant** le bloc « Définir », au sein du flux hero→texte (section 2). Page n'a pas cette image inter-hero/manifeste.

### Marquee

12. **Manquant sur la page** : la trame a un **bandeau marquee défilant « découvrir les projets ◦ … »** en texte outline (stroke) entre Comprendre et FAQ. La page n'a pas de marquee ; elle a à la place un CTA `DECOUVRIR LES PROJETS FRANGE URBAINE` en `justify` **après** la FAQ (vers `/realisations`). Casse différente (UPPERCASE page vs minuscule trame), style différent (justify plein vs outline défilant).

### FAQ

13. **Fond FAQ** : page = **ROUGE** plein (`TypologieFaq` `data-theme="red"`, titre + sous-titre « Questions fréquentes »). **Trame = BEIGE**, titre `FAQ` noir, **pas de sous-titre** visible. Inversion totale de la DA FAQ.
14. **Accordéons** : page « + » sur fond rouge. Trame « + » NOIR sur beige.
15. **Questions** : page a 3 Q dont la 1re = `Pourquoi facturer une étude alors que beaucoup de paysagistes l'offrent ?`. **Trame** 3 Q = `Comment se compose une étude ?` / `Quels sont les livrables de l'étude ?` / `Quel est le prix de l'étude pour cette typologie ?`. La question « Quels sont les livrables de l'étude ? » **n'existe pas** dans la page actuelle ; la question « Pourquoi facturer… » **n'est pas** dans la trame.

### CTA / fin

16. Page : section CTA finale fond NOIR + pill rouge `Démarrer un projet` (flèche). **Trame** : pas de section CTA dédiée distincte — le « découvrir les projets » est le marquee (cf. delta 12), et la fin de page est directement le **footer**.

### Footer

17. Footer trame = grand bloc NOIR à coins arrondis, logo en tuile beige, 2 colonnes (coordonnées gauche / nav droite avec sous-groupe « Etudes par typologies de jardin »). À vérifier vs le `Footer` partagé du site (non lu ici) — la trame en donne le contenu exact verbatim ci-dessus (section 7).
18. Footer trame : sous-lien actif = **Micro urbain** (artefact de copie). Sur frange, l'actif attendu = Frange urbaine.

---

_Aucun fichier projet modifié. Spec écrite depuis la seule lecture des tuiles + sources._
