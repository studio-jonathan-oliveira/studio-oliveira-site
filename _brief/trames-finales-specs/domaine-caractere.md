# Spec trame — « DOMAINE ET CARACTÈRE »

Page typologie `/architecture-paysagere/domaine-caractere`.
Trame Jonathan : 1927 × 13298 px, 1 colonne × 8 lignes (scroll vertical). Tuiles r0→r7, recouvrement 160 px.

**SOURCE DE VÉRITÉ.** Texte = verbatim. Images = placeholders. Traits rouges = repères écran 1920×1080 (proportions), pas du design.

---

## Palette observée

- **Fond global de la page** : BEIGE #EDE6D6 (toute la page, du hero jusqu'à la FAQ).
- **Footer** : NOIR #000000 (bloc bas arrondi).
- **Texte courant / titres** : NOIR #000000.
- **Pas de VIOLET #e0afff visible** sur cette trame (ni accordéons violets, ni curseur 3 couleurs représenté ici).
- Aucune autre couleur signalée hors photos.

> Différence majeure avec l'implémentation actuelle (fond noir / texte cream / H1 rouge) — voir DELTAS.

---

## SECTION 1 — TOPBAR + HERO (r0)

### 1.a Topbar (haut, dans une bande arrondie beige)

- Centre : **« Démarrer un projet »** — gras (bold), noir, sans-serif. Centré horizontalement.
- Gauche (sous la topbar, niveau logo) : **logo « oliveim »** (wordmark manuscrit/cursive olive, noir, avec ® en exposant).
- Droite : **« MENU »** gras noir + icône burger (2 traits horizontaux) à droite du mot.

### 1.b Hero H1

- Layout : H1 sur **2 lignes, aligné à GAUCHE**, en HAUT de page (sous le logo), occupe presque toute la largeur.
- Texte verbatim, **2 lignes** :
  - Ligne 1 : **« Domaine »**
  - Ligne 2 : **« & Caractère »**
- Casse : **Capitalisée** (Domaine / Caractère), PAS uppercase. L'accent grave sur « Caractère » est **présent** (è).
- Police : sans-serif **très grasse (Black / ExtraBold)**, noir #000000. Énorme (titre dominant pleine largeur).
- Interligne serré (les 2 lignes quasi collées).
- Filigrane : tout en haut de tuile, un texte fantôme **« DOMAINE ET CARACTÈRE »** en beige très légèrement plus clair / contour, uppercase gras (élément décoratif de débordement de section précédente / watermark).

### 1.c HERO SPECS — 4 lignes (grammaire commune aux 4 typologies)

Layout : liste de lignes pleine largeur, **flex space-between** (label à gauche, valeur collée bord droit), chaque ligne séparée d'un **fin trait** (séparateurs de cartes beige arrondies). Label = noir medium ; valeur = noir/gris plus léger, **petite taille** à droite.

Les **4 labels figés** (gauche) + **valeurs** (droite) verbatim :

1. **Secteur géographique** → `Urbain / péri urbain / province / campagne / front de mer`
2. **Moyenne surface jardin** → `plus de 1500 m² (hors cas spécifique)`
3. **Type de jardin / propriété** → `Châteaux / Manoirs / Maisons de caractère / Maisons d'architecte / Maison de campagne / Domaines familiaux / Bord de mer / Domaines viticoles / Aras / Gîtes / Maisons d'hôtes`
   _(valeur sur 2 lignes alignées à droite ; « Aras » verbatim — possiblement « Haras », mais lu « Aras »)_
4. **Complexité spatiale et environnementale** → `Surface / architecture et urbanisme`
   _(charnière r0/r1 ; label visible bas r0, valeur visible haut r1)_

> NB labels trame ≠ labels composant actuel : la trame dit **« Type de jardin / propriété »** (3e label), le composant code dit **« Contexte environnemental »**. Voir DELTAS.

---

## SECTION 2 — « Définir » + 1er diptyque (r1 → r2)

### 2.a Diptyque photos (2 images côte à côte)

- **2 photos portrait** côte à côte, largeur égale, gouttière fine entre les deux.
  - Gauche : pavillon/temple néoclassique à colonnes dans une végétation luxuriante (cyprès).
  - Droite : vue mer méditerranéenne sous pin parasol, maison à toit ocre en contrebas.

### 2.b Bloc titre + chapô « Définir »

- À GAUCHE : titre **« Définir »** — sans-serif **gras (Bold)**, noir, taille moyenne-grande, capitalisé.
- À DROITE du titre (colonne droite, ~2/3, aligné gauche), texte courant noir, taille body, interligne aéré :

  > « La typologie domaine et caractère est une typologie spéciale car elle considère une dimension architecturale très affirmée. »

- Puis (suite, même colonne droite, paragraphes séparés — r2 haut) :

  > « Châteaux, manoirs, propriétés familiales aux multiples dépendances, domaines atypiques et propriétés front de mer font partis des propriétés destinées à cette typologie. »

  > « L'aménagement de ces espaces s'imprègne très fortement de l'environnement, de l'architecture et des usagers qui sont résidents ou non-résidents. »

> Verbatim trame ≠ verbatim code actuel (le code a une version raccourcie/différente du bloc 2 et 3). Voir DELTAS.

---

## SECTION 3 — GALERIE photos pleine largeur (r2 → r5)

Succession verticale de photos **pleine largeur** (presque bord à bord, gouttières beige généreuses au-dessus/dessous), majoritairement format **paysage large**. Ordre de haut en bas observé dans les tuiles :

1. **(r2 bas)** Grande photo paysage pleine largeur : **villa italienne ocre** à étages, volets sombres, pergola/treille fleurie sur balustrade pierre.
2. **(r3 haut)** Grande photo paysage : **mur de soutènement en pierre ancienne** avec balustrade et végétation grimpante dense (lierre).
3. **(r3 bas → r4 haut)** Grande photo paysage : **jardin japonais zen** — pavillon traditionnel, buis/topiaires sculptés, massifs taillés.
4. **(r4 bas)** Grande photo paysage : **maison vernaculaire en pierre** sur prairie fleurie / oliviers, herbes folles.
5. **(r4 très bas → r5 haut)** **Diptyque 2 photos** côte à côte :
   - Gauche : **jardin Majorelle** — façade bleu cobalt, jaune, cactus/agaves sculpturaux, visiteurs en silhouette.
   - Droite : **allée forestière** bordée de pins parasols et haies taillées, chemin de terre en perspective.

Total photos galerie trame ≈ **6** (1 grande + 1 grande + 1 grande + 1 grande + diptyque de 2). Rythme : enchaînement de grandes paysages + un diptyque final, le tout sur fond beige.

> Pas de hover/flou annoté explicitement sur la galerie de cette trame (aucune annotation designer visible). Si curseur/flou-survol global s'applique, il n'est pas spécifié ici.

---

## SECTION 4 — « Comprendre » (r5 bas)

- À GAUCHE : titre **« Comprendre »** — sans-serif **gras (Bold)**, noir, même grammaire que « Définir ».
- En dessous / à droite du titre (texte courant noir, body, interligne aéré) :

  > « L'accent de cette typologie est porté sur un dialogue très précis entre architecture - environnement - usager avec une identité forte qui doit être gage d'un résultat logique et harmonieux d'un ensemble uni. »

---

## SECTION 5 — BANDEAU DÉFILANT « découvrir les projets » (r5 bas → r6 haut)

- Bande horizontale de texte répété, **gros, en CONTOUR (outline, non rempli)**, noir, lettres espacées :

  > « découvrir les projets ◦ découvrir les projets ◦ découvrir les projets ◦ … »

- Casse minuscule. Séparateur = petit rond/point « ◦ » entre les répétitions.
- **ANIMATION (déduite, type marquee)** : ruban texte qui défile horizontalement (pattern « découvrir les projets » répété et débordant des deux bords). _Pas d'annotation verbatim du designer ; comportement marquee inféré du débordement._

---

## SECTION 6 — FAQ (r6 → r7)

### 6.a Titre

- **« FAQ »** — sans-serif **très gras (Black)**, noir, ÉNORME, aligné à gauche (gros bloc).

### 6.b Accordéons

- Liste de lignes pleine largeur (cartes beige arrondies, fin séparateur entre chacune).
- Chaque ligne : **question à gauche** (noir, taille moyenne-grande, sans-serif regular/light), **bouton « + » à droite** (noir, fin).
- Toutes les questions **fermées** (état « + ») dans la trame.
- Questions verbatim (3) :
  1. **« Comment se compose une étude ? »** `+`
  2. **« Quels sont les livrables de l'étude ? »** `+`
  3. **« Quel est le prix de l'étude pour cette typologie ? »** `+`

> Trame = ces 3 questions. Le code actuel a 3 Q/R mais la **1re** diffère : code = « Pourquoi facturer une étude alors que beaucoup de paysagistes l'offrent ? » ; trame = « Comment se compose une étude ? ». Et la trame ajoute « Quels sont les livrables de l'étude ? » (absente du code). Voir DELTAS.
> Réponses non visibles (accordéons fermés) → réponses verbatim [À FOURNIR PAR JONATHAN] si différentes du code.
> « + »/« X » : la trame ne montre que « + » (fermé). Pas de variante violette visible ici.

---

## SECTION 7 — FOOTER (r6 bas → r7)

Bloc **NOIR #000000** arrondi en haut, pleine largeur.

### 7.a Logo

- Pastille beige arrondie carrée en haut-gauche contenant le **logo « oliveim »** noir (®).

### 7.b Colonne gauche (texte beige/cream sur noir)

- **« Siège social Studio »** — gras.
  - `41 Rue Général Souham`
  - `19100 BRIVE`
  - `06 61 08 84 44`
  - `contact.jonathanbiodesign@gmail.com`
- **« Territoires d'intervention »** — gras.
  - `National`
- Bas : `Droits réservés, mentions légales, etc.` — petit, gris/cream.

### 7.c Colonne droite — navigation (texte beige/cream sur noir, light, aligné à droite)

Liste verticale alignée à droite :

- `Home`
- `Studio`
- `Projets`
- `Démarrer un projet`

### 7.d Sous-bloc « Etudes par typologies de jardin » (centre-droite bas)

- Titre **« Etudes par typologies de jardin »** — sans-serif light, grand.
- 4 entrées en ligne dessous (petites) :
  - **« Micro urbain »** — en **gras** + petite **puce carrée beige** devant (= page active/en cours indiquée). _(Note : sur la trame « Micro urbain » est la typo marquée active — vestige de template ; sur la vraie page domaine-caractère ce serait « Domaine & Caractère » l'actif.)_
  - `Coeur urbain`
  - `Frange urbaine`
  - `Domaine & Caractère`

---

## Récapitulatif specs HERO (les 4, format demandé)

| #   | Label (figé, gauche)                    | Valeur (droite) — verbatim trame                                                                                                                                               |
| --- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Secteur géographique                    | Urbain / péri urbain / province / campagne / front de mer                                                                                                                      |
| 2   | Moyenne surface jardin                  | plus de 1500 m² (hors cas spécifique)                                                                                                                                          |
| 3   | **Type de jardin / propriété**          | Châteaux / Manoirs / Maisons de caractère / Maisons d'architecte / Maison de campagne / Domaines familiaux / Bord de mer / Domaines viticoles / Aras / Gîtes / Maisons d'hôtes |
| 4   | Complexité spatiale et environnementale | Surface / architecture et urbanisme                                                                                                                                            |

---

## DELTAS vs page actuelle

Fichiers : `src/pages/architecture-paysagere/domaine-caractere.astro`, `src/components/astro/TypologieHero.astro`, `src/components/astro/TypologieFaq.astro`.

### Couleurs / direction artistique (delta majeur)

- **Trame = page entière sur BEIGE #EDE6D6, texte NOIR.** Implémentation actuelle = fond **noir** (`--color-black-deep`), texte **cream**, hero en **photo plein-bleed**. La trame ne montre PAS de photo hero plein écran : le hero est typographique (H1 noir géant sur beige). → Repositionnement DA complet à arbitrer avec Morgan/Jonathan.

### Hero

- **H1** : trame = `Domaine` / `& Caractère` **capitalisé, noir, gras Black, aligné gauche/haut**. Code = `['DOMAINES &', 'CARACTERE']` **uppercase, rouge, ExtraLight 200, bas-gauche en overlay photo**. → Casse, graisse, couleur, position toutes différentes. Note aussi : trame singulier « Domaine », code pluriel « DOMAINES ».
- **Pas de photo hero** dans la trame (vs `01-hero.jpg` plein-bleed actuel + voile).
- **Specs sous le hero** : trame sur **beige**, valeurs/labels noir ; code sur **noir**, cream.

### Specs — labels & valeurs

- 3e label : trame **« Type de jardin / propriété »** vs code **« Contexte environnemental »** (LABEL FIGÉ dans `TypologieHero.astro` ligne 53). → Le label figé du composant ne correspond pas à la trame.
- Valeur 1 : trame `Urbain / péri urbain / province / campagne / front de mer` vs code `'Urbain / péri urbain / province / campagne'` (manque « / front de mer »).
- Valeur 2 : trame `plus de 1500 m² (hors cas spécifique)` vs code `'Plus de 1500 m²'` (manque « (hors cas spécifique) »).
- Valeur 3 : trame longue liste `Châteaux / Manoirs / … / Maisons d'hôtes` vs code `'Architecture spécifique / multiples dépendances / valeur patrimoniale forte'` (totalement différent).
- Valeur 4 : trame `Surface / architecture et urbanisme` = code identique. ✔

### Sections « Définir » & « Comprendre » (absentes du code)

- La trame structure le contenu autour de **2 titres-jalons** : **« Définir »** (intro + chapô) et **« Comprendre »** (precision). Le code n'a **aucun titre de section** : tout est dans un `dc-manifeste` (3 paras + 1 precision) sans heading visible (le H2 est `sr-only`). → Ajouter les titres « Définir » / « Comprendre » et répartir le texte sous eux.
- Le 1er diptyque (temple + vue mer) précède « Définir » dans la trame ; dans le code la galerie est un bloc unique après le hero, puis manifeste séparé. La trame **entrelace** photos et texte (diptyque → Définir → grandes photos → diptyque → Comprendre).

### Manifeste — verbatim

- **bloc2** trame : « Châteaux, manoirs, propriétés familiales aux multiples dépendances, **domaines atypiques et propriétés front de mer** font partis des propriétés destinées à cette typologie. » vs code (raccourci) : « Châteaux, manoirs, propriétés familiales aux multiples dépendances font partis des propriétés destinées à cette typologie. » → texte tronqué dans le code.
- **bloc3** trame : « L'aménagement **de ces espaces** s'imprègne très fortement de l'environnement, de l'architecture et des usagers **qui sont résidents ou non-résidents.** » vs code : « L'aménagement **des espaces** … et des usagers **résidents ou de passage.** » → divergence verbatim.
- **precision** (« Comprendre ») : identique trame/code. ✔

### Galerie

- Trame ≈ 6 photos (4 grandes paysages + 1 diptyque), photos différentes de l'ordre/structure codé (5 blocs / 7 photos : 02-villa, 03-maison, diptyque 04+05, 06-maison, diptyque 07+08). → Composition et nombre à réaligner sur la trame (et la trame mélange une image de mur de soutènement pierre + jardin japonais non présentes telles quelles dans le mapping actuel).

### Bandeau marquee « découvrir les projets »

- **Absent du code.** Trame = ruban texte outline défilant entre « Comprendre » et la FAQ. → À créer.

### FAQ

- Trame : 3 questions = `Comment se compose une étude ?` / `Quels sont les livrables de l'étude ?` / `Quel est le prix de l'étude pour cette typologie ?`.
- Code : 3 questions = `Pourquoi facturer une étude… ?` / `Comment se compose une étude ?` / `Quel est le prix de l'étude pour cette typologie ?`.
- → Q1 trame absente du code (« Quels sont les livrables de l'étude ? ») ; Q1 code (« Pourquoi facturer… ») absente de la trame. Réponses à fournir par Jonathan pour la nouvelle question.
- Titre **« FAQ »** géant : à vérifier que `TypologieFaq` affiche bien ce titre Black aligné gauche (la trame le veut très imposant).

### CTA final (pill rouge)

- Le code a un CTA section 5 « DECOUVRIR LES PROJETS DOMAINES & CARACTERE » + pill rouge « Démarrer un projet ». La **trame** matérialise « découvrir les projets » via le **marquee** (section 5 ci-dessus) et ne montre **pas** de pill rouge isolée avant le footer. → Le titre justifié géant + pill rouge actuels ne figurent pas tels quels dans la trame ; le « découvrir les projets » est traité en bandeau défilant.

### Footer

- Globalement aligné (logo pastille, siège social, territoires, nav droite Home/Studio/Projets/Démarrer, sous-bloc « Etudes par typologies de jardin » avec 4 typos). À vérifier que la typo active marquée (puce carrée) pointe bien « Domaine & Caractère » et non « Micro urbain » (la trame montre « Micro urbain » actif — résidu de template).
