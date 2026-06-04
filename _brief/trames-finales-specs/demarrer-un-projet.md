# Spec — Trame « Démarrer un projet » (/demarrer-un-projet)

> Source de vérité : trame Jonathan, originale **5968 × 7937 px**, grille **3 colonnes × 5 lignes** (tuiles 2200 × 1900, recouvrement 160 px).
> Lecture exhaustive r0→r4 / c0→c2. Texte **verbatim** (jamais inventé). Images = placeholders.
>
> **AVERTISSEMENT PALETTE — changement majeur vs site actuel.**
> Cette trame n'est PAS en noir/rouge (palette actuelle du site). Elle est en **VIOLET clair `#e0afff` (fond dominant)** + **NOIR `#000000` (topbar/accents/dropdowns/CTA)** + **VIOLET sur noir pour les libellés d'accordéon ouverts**. Le BEIGE `#EDE6D6` n'apparaît PAS sur cette page (seul le texte fantôme des annotations designer est beige). C'est une refonte DA complète de la page.

---

## 0. Conventions de la trame

- **Traits ROUGES** = repères du designer matérialisant l'écran 1920×1080 (folds / proportions viewport). NE FONT PAS partie du design. Plusieurs folds visibles : la page est longue (≈ 4 écrans).
- **Texte fantôme beige** en haut/bas de certaines tuiles = **annotations designer** (comportements/animations), pas du contenu de page. Relevées verbatim ci-dessous.
- Page **mono-colonne en flux vertical** : hero → step 1 → step 2 → formulaire. Le « 2 colonnes » du brief antérieur concerne **uniquement le formulaire** (champs sur 2 colonnes) et les **vues accordéon ouvert/fermé montrées côte à côte sur la trame** (la colonne de gauche montre l'état fermé « + », la colonne de droite l'état ouvert « X » — ce sont 2 états du MÊME composant, pas 2 colonnes de page).

### Annotations designer relevées (VERBATIM)

- `SURVOL + CLIC TOP BARRE` — (r0_c2, haut) comportement de la barre de contact supérieure.
- `FLOU IMAGE AU CLIC DE L'ARCODEON` — (r0_c2 bas / r1_c2 haut) [sic « ARCODEON » = accordéon] flou de l'image de fond au clic/ouverture de l'accordéon.
- `MENUS DEROULE DES SECTIONS CONCERNEES` — (r3_c2 haut) les selects (menus déroulants) des champs concernés du formulaire.
- `SURVOL + CLIC CTA` — (r3_c0 bas) comportement du bouton ENVOYER au survol + clic.
- `MENU` — (r3_c2, fantôme) repère de l'overlay menu (composant sitewide, hors page).

---

## 1. TOPBAR de contact (barre supérieure)

État repos (r0_c1) : pilule arrondie pleine **VIOLET `#e0afff`**, pleine largeur, coins très arrondis en bas. Centrée dedans, le libellé **« Démarrer un projet »** en **NOIR**, police heading (Inter), **Bold**, casse Titre, petite taille, centré.

État survol/actif (r0_c2, r1_c2) : la pilule **s'inverse en NOIR `#000000`**, libellé **« Démarrer un projet »** passe en **clair (cream/blanc)**, même graisse Bold, même position centrée. → **Annotation `SURVOL + CLIC TOP BARRE`** : inversion couleur au survol + action au clic (renvoie vers la page courante / scroll formulaire).

Sous la topbar, **header sitewide** sur fond violet :

- Gauche : **logo `oliveira`** (lettrage manuscrit noir, le « v » stylisé) + `®`/`.` — noir.
- Droite : **`MENU`** (Bold, noir, uppercase) + icône hamburger (2 traits horizontaux noirs).

---

## 2. HERO (r0_c1 / r1)

- Fond **VIOLET `#e0afff`** plein, pleine hauteur d'écran.
- **H1 oversized** : deux lignes, **NOIR**, Inter **Bold (700)**, casse Titre, énorme, calé à GAUCHE, bas de hero :
  - Ligne 1 : **`Démarrer`**
  - Ligne 2 : **`votre projet`**
  - (taille ~ remplit la largeur ; line-height serré ; tracking serré)
- Pas de photo dans le hero (fond violet uni, contrairement au site actuel qui a une photo full-bleed).

---

## 3. SECTION « Comment ça marche ? » + ÉTAPE 1 (r1)

Sur **photo de fond sombre** (placeholder image : intérieur végétalisé / salon, plantes denses au premier plan, personnes en arrière-plan flouté). Le bloc violet du hero se termine, l'image sombre prend le relais.

- **Sur-titre / question** : **`Comment ça marche ?`** — NOIR (sur le bas du bloc violet), Inter **ExtraLight (200)**, casse Titre, grande taille, calé à gauche. (le « ? » précédé d'une espace : `marche ?`)
- **Gros chiffre `1`** : VIOLET clair, Inter ExtraLight, oversized, calé à gauche, en watermark/semi-transparent sur la photo.
- **Liste d'accordéons (état FERMÉ)** — sur l'image sombre, à droite du chiffre. Chaque ligne : libellé **VIOLET clair** Inter **Bold**, casse Titre, + icône **`+`** VIOLET à l'extrême droite, séparateur fin sous chaque ligne. Ordre :
  1. **`Comprendre le projet`** `+`
  2. **`Structurer la commande`** `+`
  3. **`Qualifier l'étude adaptée`** `+`

### Accordéons ÉTAPE 1 — état OUVERT (r1_c2 / r2_c2)

Annotation : **`FLOU IMAGE AU CLIC DE L'ARCODEON`** → quand un accordéon s'ouvre, **l'image de fond se floute** (backdrop blur) derrière le panneau. Le panneau ouvert = fond **NOIR/sombre flouté**, titre **VIOLET clair Bold**, icône **`X`** (croix) VIOLET à droite (remplace le `+`), trait de séparation sous le titre. Corps de texte en **clair/violet pâle** Inter Light, plusieurs paragraphes.

**1. Comprendre le projet** (verbatim) :

> Le studio réserve le premier échange pour comprendre le projet dans son contexte environnemental et géographique.
>
> Les infos lui permettent de définir précisément la typologie de votre propriété.
>
> Munissez vous d'un plan de votre propriété (si vous en avez), sinon calculez les surfaces correspondant aux emprises de votre projet.

**2. Structurer la commande** (verbatim) :

> Une fois le contexte compris et défini, le studio écoute vos besoins, vos envies, vos souhaits.
>
> Ce moment sert à structurer l'approche sensible et réaliste de votre projet, déceler ses potentiels et contraintes, projeter grossièrement les lignes directrices de l'aménagement.
>
> Préparez de votre côté un dossier des ambiances, souhaits, tendances et inspirations qui vous font rêver. Le jardin doit être à votre image et le studio doit le cerner pour s'en rapprocher.

**3. Qualifier l'étude adaptée** (verbatim) :

> L'ensemble des informations récoltées vont permettre au studio de qualifier l'étude adaptée.
>
> Avec votre localisation géographique, le studio vous estimera également les frais complémentaires à intégrer à l'étude. Tout est expliqué lors de cet appel de qualification.
>
> Vous repartez avec des informations claires et précises pour lancer votre projet.

---

## 4. ÉTAPE 2 (r2)

- Sur photo de fond sombre (placeholder : deux personnes de dos, manteau gris clair / veste noire, échange en intérieur végétalisé).
- **Gros chiffre `2`** : VIOLET clair, Inter ExtraLight, oversized, calé à gauche.
- **Liste d'accordéons (état FERMÉ)** — mêmes styles que l'étape 1 :
  1. **`Le point`** `+`
  2. **`La validation`** `+`

### Accordéons ÉTAPE 2 — état OUVERT (r2_c2)

**1. Le point** (verbatim) :

> Après un temps de réflexion, ce second échange permet de répondre aux dernières interrogations concernant l'étude.
>
> Le studio prend le temps de vous accompagner et d'ajuster les derniers détails pour composer la meilleure solution à votre projet.

**2. La validation** (verbatim) :

> Cet échange permet enfin de valider les termes du contrat d'étude et de de démarrer [sic « de de »] les étapes suivantes de l'étude.
>
> La validation de l'étude déclenche le premier déplacement du studio, pour l'approche sensible et technique sur site et commencer la phase étude préliminaire.

---

## 5. BLOC FORMULAIRE (r2 bas → r4)

### En-tête du bloc

- Fond **VIOLET `#e0afff`** plein.
- Titre sur 2 lignes, **NOIR**, Inter **Bold**, casse Titre, oversized, calé à gauche :
  > **Anticipez le premier échange :**
  > **parlez-moi de votre projet**

### Le formulaire — disposition 2 colonnes

Tous les **labels** : **NOIR**, Inter **Bold**, casse Titre, taille moyenne, avec **word-spacing aéré** (espacement entre mots large, signature DA Jonathan). Chaque champ = **label au-dessus + ligne underline fine** (champ underline-only, fond transparent violet). Séparateurs : fines lignes horizontales.

Ordre et grille (gauche / droite) :

| Ligne | Colonne gauche                                                       | Colonne droite                               |
| ----- | -------------------------------------------------------------------- | -------------------------------------------- |
| 1     | **`Nom complet`** (texte, pleine largeur)                            | —                                            |
| 2     | **`Email`** (texte/email)                                            | **`Téléphone`** (texte/tel)                  |
| 3     | **`Localisation`** (texte)                                           | **`Surface`** (**SELECT**)                   |
| 4     | **`Budget Travaux`** (**SELECT**)                                    | **`Période Travaux Souhaitée`** (**SELECT**) |
| 5     | **`Joindre des docs (PDF, JPG, PNG, ...)`** (upload, pleine largeur) | —                                            |

> NB : `Nom complet` et `Joindre des docs` sont en pleine largeur ; les autres sont appariés 2 par ligne.

### SELECTS — menus déroulants (annotation `MENUS DEROULE DES SECTIONS CONCERNEES`)

État fermé : valeur par défaut affichée en **NOIR Bold** sous le label (texte de la 1ʳᵉ option visible).
État ouvert : **panneau NOIR `#000000`**, options en **VIOLET clair**, Inter **Bold**, une option par ligne, séparateurs fins. Chaque option « typologie » a un suffixe descriptif entre parenthèses en graisse plus légère.

**SELECT `Surface`** — valeur fermée affichée : `Moins de 100 m²  (base typologie Micro Urbain)`. Options (verbatim) :

1. `Moins de 100 m²  (base typologie Micro Urbain)`
2. `Entre 100 m² et 500 m² €  (base typologie Coeur Urbain)` [sic « € » présent dans la trame sur une surface]
3. `Entre 500 m² et 1500 m² €  (base typologie Frange Urbaine)` [sic « € »]
4. `Plus de 1500 m²  (base typologie Domaine & Caractère)`

> Note : les `€` après les m² sur les options 2 et 3 sont vraisemblablement des coquilles de la trame, mais relevés verbatim. Mapping explicite **surface → typologie de jardin** (Micro Urbain / Coeur Urbain / Frange Urbaine / Domaine & Caractère).

**SELECT `Budget Travaux`** — valeur fermée affichée : `Moins de 20 000 €  (base typologie Micro Urbain)`. Options (verbatim) :

1. `Moins de 20 000 €  (base typologie Micro Urbain)`
2. `Entre 20 000 € et 50 000 €  (base typologie Coeur Urbain)`
3. `Entre 50 000 € et 90 000 €  (base typologie Frange Urbaine)`
4. `Plus de 90 000 €  (base typologie Domaine & Caractère)`
5. `Aucune notion de budget réaliste, on en discute ensemble`

**SELECT `Période Travaux Souhaitée`** — valeur fermée affichée : `Saison estivale de l'année en cours`. Options (verbatim) :

1. `Saison estivale de l'année en cours`
2. `Saison automnale / hivernale de l'année en cours`
3. `Saison printannière / estivale de l'année prochaine` [sic « printannière »]
4. `Saison automnale / hivernale de l'année prochaine`
5. `Par phases à déterminer ensemble`

### Champ upload

- Label : **`Joindre des docs (PDF, JPG, PNG, ...)`** (NOIR Bold, word-spacing aéré), pleine largeur, underline simple sous le label (zone de dépôt).

### Bouton ENVOYER (annotation `SURVOL + CLIC CTA`)

- État repos (r3_c1) : **bouton pilule à contour fin noir, fond violet**, libellé **`ENVOYER AU STUDIO`** NOIR Bold uppercase, **centré** sous le formulaire. À sa droite, un **petit carré noir à coins arrondis + point** = le **nouveau curseur** (carré arrondi + point, contextuel 3 couleurs selon fond).
- État survol/actif (r3_c0) : le bouton **s'inverse en NOIR plein**, libellé `ENVOYER AU STUDIO` passe en **VIOLET clair** Bold uppercase. Le curseur carré-noir reste collé en bas-droite.
- **Comportement : magnétique** (le bouton suit légèrement le curseur au survol) — cohérent avec l'annotation `SURVOL + CLIC CTA` + grammaire magnétique du site. Libellé = **`ENVOYER AU STUDIO`** (plus long que l'actuel `ENVOYER`).

---

## 6. Curseur (sitewide, visible ici)

Carré aux **angles arrondis + point central**, 3 couleurs selon le fond (sur violet → noir ; sur noir → violet/clair). Visible posé en bas-droite du CTA ENVOYER. L'animation « infos-suivent-curseur » et « flou-survol-image » s'appliquent (flou explicitement annoté sur les accordéons).

---

## 7. Récap couleurs

- **Violet clair `#e0afff`** : fond hero, fond header, fond bloc formulaire, libellés d'accordéon, chiffres `1`/`2`, options de select ouvertes, libellé CTA inversé.
- **Noir `#000000`** : H1, titres formulaire, labels formulaire, topbar inversée, panneaux de select ouverts, accordéons ouverts (fond), curseur (sur violet), contour + état actif du CTA.
- **Clair (cream/blanc)** : texte sur fonds noirs (topbar inversée, corps d'accordéon ouvert).
- **Aucun rouge, aucun beige** dans le design (le beige n'est que le texte d'annotation designer).

---

## DELTAS vs page actuelle

Fichiers actuels :

- `src/pages/demarrer-un-projet.astro`
- `src/components/astro/DemarrerHero.astro`
- `src/components/astro/DemarrerSteps.astro`
- `src/components/astro/DemarrerRedBlock.astro`
- `src/components/astro/DemarrerContactCta.astro`
- `src/components/islands/DemarrerForm.tsx`
- `src/actions/index.ts` (BUDGET_OPTIONS / PERIODE_OPTIONS / schema)

### Δ1 — PALETTE (refonte totale)

La page actuelle est **ink/noir + rouge `#ff0d00` + cream `#f5f1ea`**. La trame est **violet `#e0afff` + noir**. Aucun token `--color-violet` n'existe (`global.css`). → Créer le token violet, **basculer** hero (actuellement photo full-bleed sombre → fond violet uni), steps (fond `--color-black-deep` → image sombre + accents violets), et surtout le bloc formulaire (`DemarrerRedBlock` fond `--color-red` → fond violet `#e0afff`, texte noir).

### Δ2 — HERO

- Actuel : photo full-bleed 100svh + H1 `sr-only` (invisible) + bloc intro ink 2 paragraphes (`accroche` Bold / `invite` ExtraLight).
- Trame : **fond violet uni**, **H1 VISIBLE oversized noir** sur 2 lignes `Démarrer` / `votre projet`, calé bas-gauche. Pas de photo hero, pas de bloc intro 2-paragraphes. → H1 doit devenir visuel (gros titre), supprimer la photo hero, repenser le bloc intro.

### Δ3 — SECTION « Comment ça marche ? »

- Trame ajoute un sur-titre **`Comment ça marche ?`** (ExtraLight) + **gros chiffres `1` / `2`** en watermark violet par étape. Le composant actuel `DemarrerSteps` utilise eyebrow `L'appel de` + titre `Qualification`/`Validation` (oversized). → La trame n'utilise PAS « L'appel de Qualification/Validation » : elle utilise des **chiffres 1/2** + question globale. Eyebrow/titres à revoir.

### Δ4 — TEXTES D'ACCORDÉON (verbatim trame ≠ verbatim en place)

Le site contient une version « corrigée/réécrite » des réponses (commentaire `.astro` revendique des corrections de coquilles). La trame contient une formulation **différente**, plus courte. Exemples :

- Titre actuel `Qualifier l'étude adaptée` → identique. Mais corps actuel parle de « définir la typologie exacte » / « marche à suivre » ; **trame** = « qualifier l'étude adaptée » + « estimera les frais complémentaires ». **Textes à resynchroniser sur le verbatim trame** (section 3 & 4 ci-dessus) — décision éditoriale à confirmer avec Jonathan (les deux versions divergent).
- Titre `Le point` : corps actuel « lever des points flous ou encore des doutes » ; trame « répondre aux dernières interrogations ». Divergent.
- `La validation` : trame contient `de de démarrer` (coquille) — à NE PAS reproduire littéralement mais signaler.

### Δ5 — FORMULAIRE : champ SURFACE devient un SELECT

- Actuel : `surface` = **input texte libre** (`placeholder="ex. 350 m²"`, `z.string()` dans le schema).
- Trame : `Surface` = **SELECT** avec 4 options mappées sur les typologies (Micro Urbain / Coeur Urbain / Frange Urbaine / Domaine & Caractère). → Convertir l'input en `<select>` + ajouter `SURFACE_OPTIONS` dans `actions/index.ts` + enum Zod + label e-mail.

### Δ6 — FORMULAIRE : options BUDGET totalement différentes

- Actuel `BUDGET_OPTIONS` : `Moins de 10 000 €`, `10 000 – 30 000 €`, `30 000 – 60 000 €`, `60 000 €+` (?), `À cadrer ensemble`.
- Trame : `Moins de 20 000 €`, `Entre 20 000 € et 50 000 €`, `Entre 50 000 € et 90 000 €`, `Plus de 90 000 €`, `Aucune notion de budget réaliste, on en discute ensemble` — **et chaque option (sauf la dernière) suffixée `(base typologie …)`**. → Remplacer intégralement `BUDGET_OPTIONS` (valeurs + labels + suffixes typologie).

### Δ7 — FORMULAIRE : options PÉRIODE totalement différentes

- Actuel `PERIODE_OPTIONS` : `Moins de 3 mois`, `3 à 6 mois`, …, `Pas de date fixée`.
- Trame : périodes par **saisons** : `Saison estivale de l'année en cours`, `Saison automnale / hivernale de l'année en cours`, `Saison printannière / estivale de l'année prochaine`, `Saison automnale / hivernale de l'année prochaine`, `Par phases à déterminer ensemble`. → Remplacer intégralement `PERIODE_OPTIONS`.

### Δ8 — Labels formulaire (casse + libellés)

- Actuel : labels **UPPERCASE** (`labelClass` = `uppercase`), libellés `Budget travaux`, `Période travaux souhaitée`, `Joindre des documents (PDF, JPG, PNG — max 3 Mo au total)`.
- Trame : labels en **Casse Titre** (pas uppercase) avec **word-spacing aéré**, libellés exacts `Budget Travaux`, `Période Travaux Souhaitée`, `Joindre des docs (PDF, JPG, PNG, ...)`. → Retirer `uppercase`, ajuster libellés + letter/word-spacing.

### Δ9 — Bouton ENVOYER

- Actuel : **lien underline** `ENVOYER` + flèche, cream, centré, magnétique (`bindMagnetic`).
- Trame : **bouton pilule** (contour noir / fond violet) libellé **`ENVOYER AU STUDIO`**, inversion noir-plein + texte violet au survol, magnétique. → Changer le style (pilule vs underline), le libellé (`ENVOYER` → `ENVOYER AU STUDIO`), et l'inversion de couleurs au survol. Magnétique conservé.

### Δ10 — En-tête du bloc formulaire

- Actuel : `DemarrerRedBlock` affiche `invite` = phrase longue UPPERCASE Bold sur fond rouge (`Anticipez le premier échange avec le studio : parlez-nous de votre projet en amont…`), avec `data-words-fade`.
- Trame : titre **oversized noir Casse Titre** sur 2 lignes `Anticipez le premier échange :` / `parlez-moi de votre projet` (« parlez-**moi** », 1ʳᵉ personne, pas « parlez-nous »). → Le bloc devient un grand titre, pas un bandeau uppercase ; pronom `moi` (verbatim trame) vs `nous` (actuel). Fond violet, pas rouge.

### Δ11 — Topbar « Démarrer un projet »

- Trame : topbar pilule violette dédiée affichant `Démarrer un projet`, **s'inverse en noir au survol** (`SURVOL + CLIC TOP BARRE`). À vérifier vs `ContactBar.astro` actuel (composant modifié en working tree) — aligner le comportement d'inversion sur cette page.

### Δ12 — Flou image au clic d'accordéon

- Trame annote `FLOU IMAGE AU CLIC DE L'ARCODEON` : l'image de fond derrière les accordéons se **floute** à l'ouverture. `DemarrerSteps` actuel a une photo aside statique (sticky) sans flou conditionnel à l'ouverture. → Ajouter un effet `backdrop-blur` / flou de l'image quand un accordéon est ouvert.

### Δ13 — Curseur

- Trame impose le **nouveau curseur carré arrondi + point** (3 couleurs selon fond). À vérifier que `CustomCursor` est bien dans cette forme (la mémoire indique un curseur custom existant — confirmer forme carrée arrondie vs forme actuelle).

---

_Fin de spec. Aucun fichier projet modifié._
