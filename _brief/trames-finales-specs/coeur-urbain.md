# Spec trame — « Cœur urbain » (/architecture-paysagere/coeur-urbain)

**Source** : trame Jonathan, originale 1927 × 13298 px, 1 colonne × 8 tuiles (r0→r7), recouvrement 160px. Page haute, scroll vertical classique.
**Palette détectée** : NOIR `#000000`, BEIGE `#EDE6D6` (fond dominant), BLANC (logo footer / texte sur noir). Rouge = traits de gabarit écran 1920×1080 (NON design). Pas de violet ni d'autre couleur sur cette page.
**Police** : sans-serif unique (Inter du projet). Deux extrêmes de graisse : **Black/Bold** (H1, « Définir », « Comprendre », « FAQ », labels en gras footer) et **Light/Regular** (corps, specs, menu footer, items FAQ).

---

## SECTION 1 — HERO (tuile r0, ~0 → ~1080px ; le bloc texte hero borné par 2 traits rouges = 1 écran)

**Layout** : pleine largeur, fond BEIGE uni. Conteneur à coins arrondis (la maquette montre une « carte » beige arrondie englobant topbar + H1).

Ordre de haut en bas :

1. **Filigrane / pré-titre** tout en haut, centré horizontalement, hors carte : « **COEUR URBAIN** » en capitales, graisse Bold, couleur beige légèrement plus claire que le fond (effet watermark à peine visible, presque ton sur ton). Décoratif.
2. **Topbar** (dans la carte arrondie) :
   - Centre : « **Démarrer un projet** » — sans-serif, **Bold**, casse mixte (D et p minuscule après), noir, taille moyenne (~lien de nav). Centré horizontalement.
   - Gauche : **logo `oliveira`** (wordmark manuscrit/script noir + `.` ou `®` après). En bas-gauche de la zone topbar.
   - Droite : « **MENU** » Bold noir + icône **burger** (deux traits horizontaux) à droite du mot.
3. **H1** posé bas-gauche de la carte, sur 2 lignes :

   ```
   Coeur
   urbain
   ```

   - Casse : **« Coeur » / « urbain »** — Capitale initiale sur la 1re ligne seulement, reste minuscule. (NOTE : diverge du code actuel qui force `COEUR / URBAIN` tout-capitale en rouge.)
   - Graisse : **Black / très gras**.
   - Couleur : **NOIR** (pas rouge).
   - Taille : énorme (~280px de hauteur de bloc 2 lignes), domine l'écran.
   - line-height très serré (~0.9), aligné à gauche, marge gauche identique au logo.
   - Alignement : bas-gauche.

**Spec hero (grammaire des 4 typologies)** : ici le hero NE contient PAS les 4 labels/valeurs en overlay. Les specs sont dans une section séparée juste en dessous (cohérent avec le composant actuel `<TypologieHero>` qui sépare hero / specs).

---

## SECTION 2 — SPECS (4 lignes label↔valeur) (tuile r0 bas + r1 haut, ~1080 → ~1700px)

**Layout** : pleine largeur, fond BEIGE. 4 rangées empilées, chacune en **flex space-between** : **label à gauche, valeur collée au bord droit**. Trait de séparation fin (visible comme bord de carte arrondie) sous chaque rangée. Padding vertical généreux par rangée.

| #   | Label (gauche, Regular, noir)               | Valeur (droite, Regular, noir, alignée à droite)     |
| --- | ------------------------------------------- | ---------------------------------------------------- |
| 1   | **Secteur géographique**                    | Zone urbaine / Coeur de ville et alentours           |
| 2   | **Moyenne surface jardin**                  | de 100 à 500 m² (hors cas spécifique)                |
| 3   | **Type de jardin / propriété**              | Cours urbaines / Jardins confinés / Jardins de ville |
| 4   | **Complexité spatiale et environnementale** | Accès / exposition / réseaux souterrains / urbanisme |

**Verbatim labels (trame)** :

- `Secteur géographique`
- `Moyenne surface jardin`
- `Type de jardin / propriété`
- `Complexité spatiale et environnementale`

**Verbatim valeurs (trame)** :

- `Zone urbaine / Coeur de ville et alentours`
- `de 100 à 500 m² (hors cas spécifique)`
- `Cours urbaines / Jardins confinés / Jardins de ville`
- `Accès / exposition / réseaux souterrains / urbanisme` _(le 4e label « réseaux souterrains » au pluriel ; fin partiellement coupée en bord de tuile mais lisible : « …/ urbanisme »)_

> IMPORTANT — les libellés des labels 3 et 4 diffèrent du composant `<TypologieHero>` actuel (qui code `Contexte environnemental` en label 3). Voir DELTAS.

---

## SECTION 3 — GALERIE (tuiles r1 bas → r5 haut)

**Layout** : pleine largeur, fond BEIGE (PAS noir comme dans le code actuel). Rythme magazine, gouttières beige généreuses, aucun bord-à-bord. Suite verticale de blocs photo.

Disposition observée de haut en bas (placeholders) :

1. **Diptyque haut — 2 portraits côte à côte, hauteur ÉGALE** (pas de quinconce marqué) :
   - Gauche : portrait — ruelle/jardinet contre maison de ville en briques, verdure dense, mobilier.
   - Droite : portrait — patio/cour avec escalier, lierre couvrant un mur, mange-debout/tabourets bois sous arche.
   - Les deux ~même hauteur, ~50/50, alignés haut.

2. **Bloc « Définir » + paragraphe** intercalé sous le diptyque haut (texte à GAUCHE/centre, voir Section 4 — c'est le manifeste « Définir »).

3. **Photo large paysage pleine largeur** : jungle intérieur-extérieur très verte (bananiers, terrasse couverte, canapé orange visible). Ratio ~paysage large, pleine largeur.

4. **Diptyque — 2 portraits** :
   - Gauche : maison contemporaine claire au fond d'un jardin de graviers, personne assise.
   - Droite : terrasse de restaurant/cour en briques rouges, tables rondes + chaises bistrot fer forgé noir sous végétation.

5. **Diptyque — 2 visuels** :
   - Gauche (portrait, plus petit) : piscine turquoise bordée d'héliconia rouge.
   - Droite (paysage/portrait grand) : porche/seuil contemporain béton ouvrant sur patio de briques végétalisé, poteau métallique central.

6. **Photo large pleine largeur** : vue plongeante sur un **érable jaune/orange** au-dessus d'une terrasse/table — c'est la coda chromatique (signature automnale).

7. **Photo (suite coda) plongée terrasse pavée** : table + chaise vues du dessus, feuillages, dallage gris — enchaîne avec le bloc « Comprendre ».

> Le nombre exact et le ratio précis varient ; placeholders. L'essentiel : galerie sur **fond beige**, rythme = diptyque / large / diptyque / diptyque / large, avec **deux blocs de texte intercalés** (« Définir » puis « Comprendre »).

**Animations galerie attendues (contexte global)** : flou-survol + infos-suivent-curseur en haut-droite du curseur carré arrondi. Aucune annotation verbatim visible sur cette trame pour la galerie.

---

## SECTION 4 — MANIFESTE « Définir » (tuile r1 bas → r2)

**Layout** : titre **« Définir »** placé en bas-GAUCHE sous le diptyque haut ; paragraphe de corps à sa DROITE (colonne droite, ~2/3 largeur). Fond BEIGE, texte NOIR.

- **Titre** : `Définir` — **Black/très gras**, casse mixte (D majuscule), noir, taille moyenne-grande. Accent é présent.
- **Corps** (Regular, noir, interligne ~1.5, aligné gauche, colonne droite) — VERBATIM :

  > La typologie coeur urbaine se caractérise par des espaces de vie extérieurs, enclavés et confinés. Elle représente des cours arrières à l'habitat souvent minéralisées, en prolongement de l'habitat intérieur, des entrées de propriétés traversants sous les bâtiments ou de simples zones d'accueil des convives avec de potentiels stationnements.

  > Ce sont des espaces généralement cosy de part leur enclavement mais perturbés par le manque de place disponible au sol et en hauteur.

  _(Deux paragraphes séparés par un saut de ligne. Fautes/tournures conservées verbatim : « coeur urbaine », « cours arrières », « traversants », « de part ». Note : trame dit « avec **de** potentiels stationnements », le code actuel a « avec **des** potentiels ».)_

---

## SECTION 5 — MANIFESTE « Comprendre » (tuile r5)

**Layout** : titre **« Comprendre »** bas-GAUCHE sous la coda photo plongée, paragraphe juste en dessous (aligné gauche, pleine colonne gauche ~2/3). Fond BEIGE, texte NOIR.

- **Titre** : `Comprendre` — **Black/très gras**, casse mixte, noir, taille = celle de « Définir ».
- **Corps** (Regular, noir, interligne ~1.5, aligné gauche) — VERBATIM :

  > La complexité de cette typologie repose principalement sur la disponibilité des sols, saturés par les réseaux souterrains, ainsi que l'ensoleillement, souvent coupé par les bâtiments environnants, rendant ces espaces complexes dans leurs aménagements structurels et naturels.

  _(Note : trame = « repose principalement sur **la disponibilité des sols**, saturés… ». Le code actuel `precision` omet « la disponibilité des » → « repose principalement sur les sols, saturés ». Voir DELTAS.)_

> STRUCTURE MANIFESTE — la trame scinde le manifeste en **DEUX blocs titrés distincts** : « Définir » (bloc1+bloc2) en haut de galerie, puis « Comprendre » (la précision) en bas de galerie. Le code actuel regroupe tout dans une seule section `#manifeste` sans titres visibles (h2 en `sr-only`) APRÈS la galerie. Delta majeur de structure.

---

## SECTION 6 — FAQ (tuiles r6 → r7 haut)

**Layout** : pleine largeur, fond **BEIGE** (PAS rouge), texte NOIR. (Delta majeur vs `<TypologieFaq>` actuel qui est sur fond rouge.)

Ordre :

1. **Marquee / bandeau défilant** en haut de la section : texte répété en **contour (outline) noir, lettres évidées**, casse minuscule, espacé :
   - VERBATIM motif : `découvrir les projets ◦ découvrir les projets ◦ découvrir les projets`
   - Séparateur entre répétitions = petit rond/point `◦`.
   - Style : grandes lettres outline (stroke only, intérieur beige), défilement horizontal (marquee). Animation : défile en boucle.

2. **Titre « FAQ »** : `FAQ` — **Black/très gras**, NOIR, énorme (style heading hero, ~240px), aligné à gauche avec une marge gauche importante (pas collé au bord). Casse capitale.

3. **Accordéon FAQ** : rangées pleine largeur, fond beige, séparées par des traits de carte arrondie. Chaque rangée = **question à gauche** (Regular, noir, taille moyenne-grande) + **« + » à droite** (signe plus, noir, gras, fermé). Pas de flèche image ici — c'est un **« + »** noir (qui devient « X » à l'ouverture, cf. contexte accordéons +/X).

   Questions VERBATIM (dans cet ordre dans la trame) :
   1. `Comment se compose une étude ?`
   2. `Quels sont les livrables de l'étude ?`
   3. `Quel est le prix de l'étude pour cette typologie ?`

   > Note : la trame liste **3 questions** dont **« Quels sont les livrables de l'étude ? »** (2e). Le code actuel a 3 questions mais DIFFÉRENTES : `Pourquoi facturer une étude…` / `Comment se compose une étude ?` / `Quel est le prix…`. La question « Quels sont les livrables de l'étude ? » n'existe pas dans le code, et « Pourquoi facturer… » n'est pas dans la trame. Voir DELTAS.

**Icône accordéon** : `+` (plus) noir, gras, aligné à droite de chaque rangée. État ouvert → bascule en `X` (croix). Le code actuel utilise un `+` qui ne bascule pas en X (rotation seulement) ; et `<TypologieFaq>` actuel n'a pas de marquee ni de titre noir sur beige.

---

## SECTION 7 — FOOTER (tuile r7)

**Layout** : grand bloc **NOIR** à coins arrondis, texte CREAM/blanc. Repose sur fond beige (carte arrondie noire).

Contenu observé :

- **Logo** `oliveira` en haut-gauche, dans une **pastille beige arrondie** (logo noir sur carré beige aux angles arrondis).
- **Colonne gauche** (texte cream) :
  - `Siège social Studio` — **Bold**.
  - `41 Rue Général Souham`
  - `19100 BRIVE`
  - `06 61 08 84 44`
  - `contact.jonathanbiodesign@gmail.com`
  - (espace)
  - `Territoires d'intervention` — **Bold**.
  - `National`
  - En bas : `Droits réservés, mentions légales, etc.` (petit, Regular).
- **Colonne droite — menu principal** (Light, cream, aligné à droite, grande taille) :
  - `Home`
  - `Studio`
  - `Projets`
  - `Démarrer un projet`
- **Bloc « Etudes par typologies de jardin »** (centre-droit bas) :
  - Titre : `Etudes par typologies de jardin` — grande taille Light cream.
  - Sous-liens (plus petits, Regular cream) sur une ligne :
    - `Micro urbain` — **en Bold** + petit carré/dot devant (`▪.`) = item actif/courant marqueur.
    - `Coeur urbain`
    - `Frange urbaine`
    - `Domaine & Caractère`
  - VERBATIM des 4 typologies : `Micro urbain`, `Coeur urbain`, `Frange urbaine`, `Domaine & Caractère`.

  > Note : sur la trame coeur-urbain, c'est **« Micro urbain » qui apparaît en gras + marqueur** (probable artefact de la trame source dupliquée depuis micro-urbain). Sur la page réelle coeur-urbain, le marqueur actif devrait être sur « Coeur urbain ».

---

## RÉCAP CURSEUR & ANIMATIONS (contexte global)

- **Curseur custom** : carré à angles arrondis + point, 3 couleurs selon fond (beige → ink ; noir → cream ; rouge → ink). Sur cette page : beige domine (curseur foncé), footer noir (curseur clair). Pas de section rouge dans la trame.
- **Infos-suivent-curseur** : attendu au survol des photos de galerie (haut-droite du curseur).
- **Flou-survol-image + action-clic** : attendu sur les visuels galerie.
- **Marquee FAQ** : « découvrir les projets ◦ » outline défilant (annotation implicite = bandeau animé).
- **Accordéons FAQ** : `+` ↔ `X`.

---

## DELTAS vs page actuelle

Fichiers : `src/pages/architecture-paysagere/coeur-urbain.astro`, `src/components/astro/TypologieHero.astro`, `src/components/astro/TypologieFaq.astro`, `src/components/islands/FaqAccordion.tsx`.

### Hero

1. **H1 casse + couleur** : trame = `Coeur` / `urbain` (Capitale initiale, minuscules, **NOIR**, Black). Code = `COEUR` / `URBAIN` (tout-capitale, **ROUGE**, ExtraLight 200) posé en overlay bas-gauche sur photo. → La trame n'a PAS de photo hero : fond beige uni, H1 noir énorme. **Divergence DA totale** (à confirmer avec Morgan : la trame revient-elle sur le hero photo validé v4 ?).
2. **Pas de photo hero** dans la trame (fond beige). Code = photo plein-bleed 100svh + voile. → Confirmer le choix.
3. **Topbar dans le hero** : trame montre « Démarrer un projet » centré + logo + « MENU » burger DANS la carte hero beige. Le code délègue ça au Header global (BaseLayout) — vérifier cohérence visuelle (Header sur fond beige clair, pas sur photo).

### Specs (TypologieHero LABELS + page valeurs)

4. **Label 3** : trame = `Type de jardin / propriété`. Code `<TypologieHero>` = `Contexte environnemental`. → **À corriger** (label figé erroné).
5. **Valeur 3** : trame = `Cours urbaines / Jardins confinés / Jardins de ville` (Capitales sur chaque terme). Code `valeurs[2]` = `Cours urbaines / jardins confinés / jardins de ville` (minuscules). → Casse à aligner.
6. **Valeur 1** : trame = `Zone urbaine / Coeur de ville et alentours` (C majuscule à Coeur). Code = `Zone urbaine / cœur de ville et alentours` (cœur ligaturé minuscule). → Casse + ligature à aligner.
7. **Valeur 4** : trame = `Accès / exposition / réseaux souterrains / urbanisme` (souterrain**s** pluriel). Code = `réseaux souterrain` (singulier). → Corriger.
8. **Spec sur fond beige** dans la trame ; code sur fond noir (`bg-black-deep`, texte cream). → Divergence DA (beige vs noir).

### Galerie

9. **Fond** : trame = BEIGE. Code = `bg-[var(--color-black-deep)]` (noir). → Divergence DA majeure.
10. **Ordre / intercalation texte** : trame intercale les blocs « Définir » et « Comprendre » DANS la galerie (texte entre les photos). Code = galerie monobloc puis manifeste séparé après. → Restructuration.
11. Diptyque haut trame = 2 portraits hauteur égale ~50/50 ; code = quinconce 0.7fr/1fr décalé. → Layout à revoir si fidélité voulue.

### Manifeste

12. **Structure** : trame = deux sections titrées **« Définir »** et **« Comprendre »** (titres Black visibles). Code = une section `#manifeste`, titre `sr-only`, fond noir/cream APRÈS la galerie. → Ajouter les 2 titres visibles + scinder + fond beige/noir.
13. **Texte précision** : trame = « …repose principalement sur **la disponibilité des sols**, saturés… ». Code = « …repose principalement sur **les sols**, saturés… ». → Réintégrer « la disponibilité des ».
14. **bloc1** : trame = « avec **de** potentiels stationnements » ; code = « avec **des** potentiels stationnements ». → Aligner verbatim.

### FAQ

15. **Fond** : trame = BEIGE, titre FAQ NOIR, texte noir. Code `<TypologieFaq>` = fond **ROUGE**, texte cream, `data-theme="red"`. → Divergence DA majeure (beige vs rouge).
16. **Questions** : trame = 3 Q `Comment se compose une étude ?` / `Quels sont les livrables de l'étude ?` / `Quel est le prix de l'étude pour cette typologie ?`. Code = `Pourquoi facturer une étude…` / `Comment se compose une étude ?` / `Quel est le prix…`. → La trame **ajoute « Quels sont les livrables de l'étude ? »** et **retire « Pourquoi facturer… »**. Question livrables absente du code → contenu réponse à fournir par Jonathan (logger dans `_brief/contenus-manquants.md`).
17. **Marquee** : trame a un bandeau `découvrir les projets ◦ …` outline défilant au-dessus de FAQ. Code `<TypologieFaq>` = pas de marquee (juste titre FAQ + sous-titre « Questions fréquentes »). → Ajouter marquee. Et le sous-titre « Questions fréquentes » du code n'apparaît PAS dans la trame.
18. **Icône** : trame = `+` qui devient `X`. Code FaqAccordion = `+` (rotation, pas bascule X) — cohérent textuellement, à vérifier visuellement (couleur noir sur beige vs cream sur rouge).

### CTA

19. **Section CTA « DECOUVRIR LES PROJETS COEUR URBAIN » + pill rouge** existe dans le code mais **n'apparaît PAS** comme telle dans la trame — la trame remplace ce CTA par le **marquee « découvrir les projets »** placé AVANT la FAQ. → Le CTA full-width justifié + pill « Démarrer un projet » est peut-être à supprimer/remplacer par le marquee. À confirmer avec Morgan.

### Footer

20. Footer trame conforme au footer global du site (logo pastille beige, coordonnées, menu Home/Studio/Projets/Démarrer, bloc « Etudes par typologies de jardin » avec marqueur sur la typologie courante). Vérifier que le footer global marque bien **« Coeur urbain »** actif sur cette page (la trame montre « Micro urbain » actif = artefact source). RAS structurel sinon.
