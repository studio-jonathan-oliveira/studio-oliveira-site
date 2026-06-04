# Spec — Trame Jonathan « MICRO URBAIN »

Page typologie `/architecture-paysagere/micro-urbain`.
Trame originale 6057 × 13299 px. Grille de découpe : 3 colonnes (c0/c1/c2) × 8 lignes (r0→r7), recouvrement 160 px.

## Lecture de la grille (IMPORTANT)

- **Le contenu RÉEL de la page est dans la colonne du MILIEU (c1)**, encadré par des **traits ROUGES** qui matérialisent le format **écran 1920×1080** (proportions, fold viewport — PAS du design, ne pas reproduire les traits).
- **Les colonnes latérales (c0 à gauche, c2 à droite) contiennent les ANNOTATIONS DESIGNER** : gros texte en **beige/peach très clair sur fond blanc** (descriptions d'animations) + une **réplique des accordéons FAQ en état OUVERT** (c2, fond beige) pour montrer le contenu déplié.
- Le contenu page s'arrête au footer (≈ ligne r5). **Les lignes r6 et r7 sont VIDES** (juste les lignes rouges de la grille) → la page est plus courte que la grille 8 lignes.

## Palette observée

- **NOIR #000000** : fond footer, fond galerie (implicite entre photos), texte titres sections + H1 hero + questions FAQ.
- **BEIGE / cream #EDE6D6** : fond DOMINANT de toute la page (hero, sections, FAQ). C'est la couleur de fond principale de la trame.
- Texte courant : **noir/anthracite sur beige**.
- **ROUGE** : uniquement les traits de grille (format 1920×1080) + le point « • » du marqueur de carrousel/marquee. Pas de zone rouge plein.
- **VIOLET #e0afff** : NON observé sur cette trame.
- Annotations designer : beige peach très pâle (#f2e7df env.) sur blanc.

> Divergence majeure avec l'implémentation actuelle qui est **noir + cream + accent rouge** (fonds noirs). La trame est au contraire **fond beige/cream dominant, texte noir**.

---

## SECTION 1 — HERO (r0→r1, colonne c1)

### Layout

Bloc hero sur **fond beige**, coins arrondis généreux (carte). Hauteur ≈ un écran.

- **Topbar interne haut centré** : « **Démarrer un projet** » — texte **noir, gras (bold), centré**, petit. (C'est une barre de contact pleine largeur en haut de page, fond beige légèrement plus clair, arrondie en bas.)
- **Header sous la topbar** :
  - Gauche : **logo « oliveira »** (wordmark manuscrit/script noir + symbole ®).
  - Droite : « **MENU** » bold noir + icône hamburger (deux traits horizontaux).
- **H1 split sur 2 lignes, en HAUT-GAUCHE** sous le header :
  - Ligne 1 : « **Micro** »
  - Ligne 2 : « **urbain** »
  - Casse : **Capitale initiale + bas de casse** (« Micro urbain », PAS tout en capitales).
  - Police : **sans-serif très grasse (Black/Heavy)**, noir.
  - Taille : énorme (≈ 1/3 hauteur viewport par ligne), line-height serré (~0.95).
  - Position : aligné à gauche, en haut (sous le header), PAS en bas.

> Note grammaire hero : la consigne « 4 labels constants gauche + valeurs droite, flex space-between SOUS le H1 » est respectée ici — voir bloc specs ci-dessous, qui est **directement enchaîné sous le H1, dans la continuité du hero** (pas une section noire séparée).

### Bloc 4 specs (sous le H1, fond beige, lignes séparées par filets fins)

Chaque ligne = **flex space-between**, label à gauche (noir, taille moyenne, regular), valeur à droite (noir, regular). Filet horizontal fin entre chaque ligne.

| Label (gauche) — VERBATIM               | Valeur (droite) — VERBATIM            |
| --------------------------------------- | ------------------------------------- |
| Secteur géographique                    | Hyper urbain                          |
| Moyenne surface jardin                  | Moins de 100 m² (hors cas spécifique) |
| Type de jardin / propriété              | Roof tops / Patios / Micro jardins    |
| Complexité spatiale et environnementale | Hauteur / accès / exposition / poids  |

> ATTENTION : le 3e label de la trame est « **Type de jardin / propriété** » (valeur « Roof tops / Patios / Micro jardins »), et le 4e est « **Complexité spatiale et environnementale** » (valeur « Hauteur / accès / exposition / poids »).
> L'implémentation actuelle utilise des libellés DIFFÉRENTS (« Contexte environnemental ») — voir DELTAS.

### Annotation designer (hero)

Colonnes latérales, beige peach pâle, capitales bold :

> **« ANIMATION DU TEXTE "STUDIO" EN APPARITION WAVY/VAGUE AVEC APPARITION/DISPARITION EN FONCTION DU SCROLL »**
> **« LE TITRE RESTE FIXE, PAS D'ANIMATION »**

Interprétation : c'est une annotation générique recopiée du template (mention « STUDIO »). Pour cette page elle signifie : **le titre H1 « Micro urbain » reste FIXE, sans animation**. (L'animation wavy/scroll concerne un autre titre/template — ici la consigne effective retenue est « pas d'animation sur le titre ».)

---

## SECTION 2 — « DÉFINIR » (r1→r2, colonne c1)

### Layout

Sur fond beige. **Galerie de 3 photos** puis **titre + texte**.

### Galerie (disposition exacte)

1. **Photo large pleine largeur** en haut (paysage) — terrasse/rooftop végétalisé, ciel nuageux dominant. [PLACEHOLDER image]
2. Sous elle, **diptyque 2 photos côte à côte** :
   - **Gauche** : photo **portrait plus PETITE/étroite** (~38% largeur) — vue plongeante terrasse en pente avec végétation + 2 petits éléments rouges (sièges/objets). [PLACEHOLDER]
   - **Droite** : photo **portrait/paysage plus GRANDE** (~54-60%) — patio tropical luxuriant, table + chaises en rotin, sol carrelé vert. [PLACEHOLDER]
3. Puis une **3e photo portrait** dessous (banc bois + sol galets/pavés + végétation) — coda verticale. [PLACEHOLDER]

(Total galerie « Définir » : photo large + diptyque + coda = rythme magazine, gouttières beige.)

### Titre + texte

- **Titre « Définir »** : sans-serif **gras (Bold)**, noir, **Capitale initiale + bas de casse**. Taille grande (titre de section ~3-4rem). Aligné à gauche, sous la galerie.
- **Texte courant** à DROITE du titre (ou décalé en colonne droite) : noir, regular, taille moyenne, lignes courtes.

**Texte VERBATIM (manifeste bloc 1 + 2)** :

> « La typologie micro urbaine se caractérise par des espaces de vie réduits, en hauteur ou encore enclavés entre les murs intérieurs du bâti. »
>
> « Ce sont des espaces fortement connectés à la vie des habitations, soit par des perspectives directes depuis l'intérieur, soit pas une accessibilité directe voir obligatoire depuis les circulations de l'intérieur vers l'extérieur. »

(Note : la trame est légèrement floue sur « connectés/connectes » et « accessibilité/accéssibilité » — l'implémentation actuelle conserve volontairement les fautes « connectes », « accéssibilité ». Verbatim conservé tel quel.)

---

## SECTION 3 — « COMPRENDRE » (r3, colonne c1)

### Layout

Toujours fond beige. Suite du diptyque/coda de photos en haut (banc + galets visible), puis **titre + texte**.

- **Titre « Comprendre »** : même style que « Définir » — sans-serif **gras**, noir, Capitale + bas de casse. Aligné à gauche.
- **Texte courant** dessous/à droite, noir regular, lignes longues.

**Texte VERBATIM (précision/manifeste)** :

> « Les contraintes liées à l'exposition aux vents forts et la portance structurelle pour les terrasses, l'ombre excessive et le taux élevé d'hygrométrie pour les patios, les accès difficiles à ces différents espaces, établissent des contraintes très spécifiques dans l'élaboration de l'étude et la réalisation des ouvrages. »

> Les titres « **Définir** » et « **Comprendre** » sont les **deux sous-titres éditoriaux de la trame** — ils n'existent PAS dans l'implémentation actuelle (qui a un manifeste sans titres visibles, juste `sr-only`). Voir DELTAS.

---

## SECTION 4 — MARQUEE « découvrir les projets » (r3→r4, colonne c1)

### Layout

Bande horizontale, fond beige (carte arrondie pleine largeur). Texte défilant répété :

**Texte VERBATIM** (répété en boucle, séparé par un point « • ») :

> « découvrir les projets • découvrir les projets • découvrir les projets • … »

- Police : sans-serif **grasse (Bold)**, **bas de casse** (« découvrir les projets »), noir.
- Taille : grande (~2-2.5rem).
- Séparateur : **point/puce « • »** (rond plein noir) entre chaque occurrence.
- Le mot répété sort des bords (déborde, masqué par overflow).

### Annotations designer (marquee)

Colonnes latérales, capitales bold peach :

> **« ANIMATION : DEFILEMENT A L'HORIZONTAL EN BOUCLE SANS FIN »**
> **« SURVOL + CLIC »**
> **« ARRET DE L'ANIMATION AU SURVOL »**

Comportement : marquee horizontal infini ; **au survol → l'animation s'arrête** ; **clic → navigue vers les projets**.

---

## SECTION 5 — FAQ (r4→r5, colonne c1 ; détail déplié en c2)

### Layout

Fond beige. **Titre « FAQ » massif** en haut-gauche, puis liste d'accordéons.

- **Titre « FAQ »** : sans-serif **très gras (Black/Heavy)**, noir, **CAPITALES**. Très grand (~hauteur titre hero, ~6-9rem).
- **Accordéons** : 3 questions, chacune sur une ligne pleine largeur, filet fin entre chaque.
  - Question à gauche : noir, **regular** (pas gras), taille moyenne-grande (~1.6-2rem), **Capitale initiale + bas de casse + « ? »**.
  - À droite : icône **« + »** (état fermé) noir, fin.
  - État OUVERT (montré en c2, fond beige légèrement assombri/carte) : question passe en **gras noir**, icône devient **« × »**, et la réponse s'affiche dessous en **petit texte noir regular**.

### Questions VERBATIM (état fermé, colonne c1)

1. « **Comment se compose une étude ?** »
2. « **Quels sont les livrables de l'étude ?** »
3. « **Quel est le prix de l'étude pour cette typologie ?** »

> NB : la 2e question de la trame est « **Quels sont les livrables de l'étude ?** ».
> L'implémentation actuelle a 3 questions DIFFÉRENTES en ordre/contenu (la 1re actuelle est « Pourquoi facturer une étude… ») — voir DELTAS.

### Réponses VERBATIM (état ouvert, colonne c2)

**Q1 — Comment se compose une étude ?** (titre répété en gras, état ouvert)

> « Il y a 3 phases : l'étude préliminaire, l'étude projet et le suivi de chantier.
>
> L'étude préliminaire : elle recadre le contexte du projet et structure les orientations de projet. C'est une synthèse de la commande et de la structuration des axes directeurs du projet avec une budgétisation des grands lots travaux.
>
> L'étude projet : elle rentre dans le détail de conception suite à la validation de l'étude préliminaire. Dans cette phase, le studio développe, organise, et consulte les entreprises et artisans pour le chiffrage précis des travaux.
>
> Le suivi de chantier : c'est la partie pilotage chantier. Elle est importante car elle permet de garantir un résultat final entre les intentions de projet et la réalisation. Le studio gère les compte rendus, le suivi financier ainsi que le pilotage des travaux avec les différentes entreprises sur le chantier. Vous payez une tranquilité d'esprit et de la disponibilité. »

**Q2 — Quels sont les livrables d'une étude ?** (intitulé déplié = « Quels sont les livrables **d'une** étude ? »)

> « Etude préliminaire : étude du contexte projet, étude réglementaire et urbanisme, étude fonctionnelle et besoins, synthèse graphique, etude estimative budgétaire.
>
> Etude projet : conception paysagère, étude végétales, dossier de consultation des entreprise, détails techniques, consultation des entreprises, dossier de réalisation.
>
> Suivi de chantier : comptes rendus de chantier, suivi d'avancement, validation des ouvrages, suivi financier, réception des travaux. »

(Verbatim conservé : « etude estimative », « étude végétales », « des entreprise ».)

**Q3 — Quel est le prix de l'étude pour cette typologie ?**

> « En fonction de la typologie des jardins, le studio a établit des forfaits de base.
>
> Viennent s'ajouter à ces forfaits de base :
>
> - des frais correspondant aux déplacements du studio (frais d'essence, péages, …)
> - la mission géomètre
>   en fonction de votre emplacement et des nécessité du projet et de l'étude.
>
> Pour connaître le montant exact de votre étude, je vous invite à me contacter (ou remplir le formulaire via l'onglet "démarrer un projet" en haut de la page) afin que nous puissions échanger ensemble et définir tous les paramètres liés à votre projet. »

(Verbatim conservé : « a établit », « des nécessité ».)

> Toute la FAQ est sur **fond beige, texte noir**. L'implémentation actuelle met la FAQ sur **fond ROUGE plein** avec gros titre « FAQ » + sous-titre « Questions fréquentes » → divergence. Voir DELTAS.

---

## SECTION 6 — FOOTER (r4→r5, colonne c1)

### Layout

**Carte arrondie sur fond NOIR #000000**, texte cream/blanc. Pleine largeur, coins arrondis haut.

- **Logo « oliveira »** dans un **carré beige arrondi** (badge), en haut-gauche.
- Sous le logo, bloc coordonnées :
  - « **Siège social Studio** » (bold blanc)
  - « 41 Rue Général Souham »
  - « 19100 BRIVE »
  - « 06 61 08 84 44 »
  - « contact.jonathanbiodesign@gmail.com »
- **Colonne nav à DROITE** (texte blanc, taille moyenne, alignée droite, regular) :
  - « Home »
  - « Studio »
  - « Projets »
  - « Démarrer un projet »
- **Bloc « Etudes par typologies de jardin »** (titre blanc, sous la nav droite) avec les 4 typologies en ligne :
  - « **Micro urbain** » (souligné/actif — gras), « Coeur urbain », « Frange urbaine », « Domaine & Caractère »
- **Bloc « Territoires d'intervention »** (titre bold blanc, à gauche) :
  - « National »
- Filet de séparation, puis ligne basse : « **Droits réservés, mentions légales, etc.** » (petit, blanc/gris).

(Verbatim footer conservé : « Etudes par typologies de jardin », « Domaine & Caractère ».)

---

## Récap ANIMATIONS (verbatim annotations designer)

1. **Hero / titre** : « LE TITRE RESTE FIXE, PAS D'ANIMATION » (l'annotation wavy « STUDIO » est un reliquat de template — ne s'applique pas au H1 « Micro urbain »).
2. **Marquee « découvrir les projets »** : « ANIMATION : DEFILEMENT A L'HORIZONTAL EN BOUCLE SANS FIN » + « SURVOL + CLIC / ARRET DE L'ANIMATION AU SURVOL ».
3. **Curseur custom** : carré à angles arrondis + point, 3 couleurs (spec transversale, non ré-annotée ici).
4. **Accordéons FAQ** : ouverture « + » → « × », réponse dépliée (état montré en c2).
5. Effet **flou-survol-image + action-clic** sur images : NON explicitement ré-annoté sur cette trame (galerie « Définir/Comprendre » sans hover annoté).

---

# DELTAS vs page actuelle

Fichiers concernés :

- `C:/Users/Morgan/MyApps/jonathan-oliveira-site/src/pages/architecture-paysagere/micro-urbain.astro`
- `C:/Users/Morgan/MyApps/jonathan-oliveira-site/src/components/astro/TypologieHero.astro`
- `C:/Users/Morgan/MyApps/jonathan-oliveira-site/src/components/astro/TypologieFaq.astro`

### 1. PALETTE / FOND (delta structurant)

- **Trame** : fond **beige/cream dominant**, texte **noir**, sections beige (hero, galerie, manifeste, FAQ). Seul le footer est noir.
- **Actuel** : tout en **fond NOIR** (`bg-[var(--color-black-deep)]` sur hero, galerie, manifeste, CTA) + **FAQ sur fond ROUGE plein**. Texte cream.
- → Inversion complète à prévoir : passer les sections en fond cream + texte ink.

### 2. HERO — position + casse du H1

- **Trame** : H1 « **Micro / urbain** » (Capitale + bas de casse) en **HAUT-GAUCHE**, police **Black/Heavy noir**, énorme.
- **Actuel** (`TypologieHero`) : H1 `['MICRO','URBAIN']` forcé en **CAPITALES**, **ROUGE**, **ExtraLight 200**, posé en **BAS-GAUCHE** sur photo plein-bleed, avec voile sombre.
- → Delta : casse, couleur (rouge vs noir), graisse (200 vs Black), position (bas vs haut). De plus la trame n'a **pas de photo hero plein-bleed** : le hero est sur fond beige, le H1 surmonte directement le bloc specs (pas de photo derrière le titre).

### 3. HERO — libellés des specs

- **Trame** : 3e label = « **Type de jardin / propriété** », 4e = « **Complexité spatiale et environnementale** ».
- **Actuel** (`TypologieHero` LABELS figés) : `['Secteur géographique', 'Moyenne surface jardin', 'Contexte environnemental', 'Complexité spatiale et environnementale']`.
- → Delta sur le **3e label** : actuel « Contexte environnemental » ≠ trame « Type de jardin / propriété ». (Les valeurs côté droite correspondent, mais le label diffère.)
- Specs sur fond beige texte noir (trame) vs fond noir texte cream (actuel).

### 4. SECTIONS ÉDITORIALES « Définir » + « Comprendre » MANQUANTES

- **Trame** : deux titres visibles « **Définir** » et « **Comprendre** » (Bold noir, Capitale+bas de casse) introduisant chacun un bloc de texte + galerie photos.
- **Actuel** : un seul bloc `manifeste` (bloc1 + bloc2 + precision) avec `<h2 class="sr-only">` invisible, sans titres « Définir »/« Comprendre », galerie séparée en amont.
- → Delta : ajouter les 2 titres éditoriaux et restructurer manifeste en 2 sections titrées. Le texte verbatim correspond globalement (bloc1+2 = « Définir », precision = « Comprendre »).

### 5. GALERIE — répartition

- **Trame** : galerie intégrée AUX sections « Définir »/« Comprendre » (large + diptyque + coda banc/galets, intercalée avec le texte).
- **Actuel** : galerie autonome (`mu-gallery`) AVANT le manifeste : 02-large-top + diptyque (03/04) + 05-roof coda. Disposition diptyque proche (38%/54%). Globalement compatible, mais l'ordre/intercalation texte diffère.

### 6. MARQUEE « découvrir les projets » MANQUANT

- **Trame** : bande marquee horizontale infinie « découvrir les projets • … » (Bold bas de casse noir), arrêt au survol, clic → projets. Annotation explicite.
- **Actuel** : AUCUN marquee. Il y a à la place une section CTA `mu-cta` avec titre justifié « DECOUVRIR LES PROJETS MICRO URBAIN » (capitales, ExtraLight, justify-multi) + pill rouge « Démarrer un projet ».
- → Delta majeur : remplacer/compléter par un vrai **marquee défilant** (texte « découvrir les projets » répété, bas de casse, séparé par « • », pause au hover, lien projets).

### 7. FAQ — fond + questions

- **Fond** : trame = **beige, texte noir** ; actuel = **rouge plein, texte cream** + titre « FAQ » massif + sous-titre « Questions fréquentes ». → Delta fond + sous-titre (la trame n'a pas de sous-titre « Questions fréquentes »).
- **Questions** :
  - Trame : (1) « Comment se compose une étude ? » (2) « Quels sont les livrables de l'étude ? » (3) « Quel est le prix de l'étude pour cette typologie ? »
  - Actuel : (1) « Pourquoi facturer une étude alors que beaucoup de paysagistes l'offrent ? » (2) « Comment se compose une étude ? » (3) « Quel est le prix de l'étude pour cette typologie ? »
  - → Delta : la trame n'a PAS la question « Pourquoi facturer… » et A « Quels sont les livrables de l'étude ? » (absente de l'actuel). L'ordre diffère. Réponses Q1/Q3 globalement alignées (mêmes verbatim) ; la réponse « livrables » existe dans la trame mais pas dans l'actuel.

### 8. CTA / PILL

- **Trame** : pas de section CTA distincte avec pill « Démarrer un projet » en bas de contenu ; le CTA vers projets EST le marquee. Le « Démarrer un projet » figure en topbar haut + dans le footer nav.
- **Actuel** : section `mu-cta` dédiée (titre justifié + pill rouge magnétique).
- → Delta : repenser le CTA en marquee (cf. point 6) ; le « Démarrer un projet » remonte en topbar + footer.

### 9. FOOTER

- **Trame** : footer noir riche — logo badge beige, « Siège social Studio » + adresse/tel/email, nav droite (Home/Studio/Projets/Démarrer un projet), bloc « Etudes par typologies de jardin » (4 typologies, Micro urbain actif), « Territoires d'intervention : National », « Droits réservés, mentions légales, etc. ».
- **Actuel** : footer global non inspecté ici (probablement `BaseLayout`/composant Footer partagé) — vérifier qu'il contient bien le bloc « Etudes par typologies de jardin » avec la typologie courante mise en avant + « Territoires d'intervention : National ». (À confronter au composant Footer du layout.)

### 10. ANIMATION TITRE

- **Trame** : « LE TITRE RESTE FIXE, PAS D'ANIMATION ».
- **Actuel** : H1 hero sans animation (OK) ; mais le CTA `mu-cta` utilise `data-justify-multi` (animation justify au scroll) — à supprimer si on bascule sur le marquee.
