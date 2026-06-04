# Spec — Trame « projet »

## ⚠️ RE-AUDIT 2026-06-04

Re-lecture colonne par colonne des 6 bandes HD (col0 b0→b2 = moitié GAUCHE de la composition ; col1 b0→b2 = moitié DROITE). Objectif : détecter du contenu raté dans les colonnes latérales / états dépliés.

**Conclusion structurelle (importante) :** cette trame ne montre la page que dans UN SEUL état — **les 3 accordéons sont FERMÉS**. Les « colonnes » col0/col1 ne sont PAS deux états côte à côte (fermé vs ouvert) : ce sont simplement la moitié gauche et la moitié droite de la **même** maquette unique. **Aucun état déplié, aucune liste de projets, aucune vignette/carte projet n'apparaît nulle part.** L'analyse initiale était donc correcte sur le fond ; le détail des listes dépliées reste bien à fournir par Jonathan.

Manques / imprécisions de la 1re spec, comblés ou confirmés en relisant la moitié DROITE (col1) — verbatim :

1. **Titre de planche (annotation hors-maquette, haut)** — RATÉ par la 1re spec. En haut de la planche, en capitales beiges discrètes : **« PAGE PROJET »** (col0_b0). À ajouter aux annotations designer.

2. **Icône « + » à droite des 3 accordéons — CONFIRMÉE présente** (col1_b1 + col1_b2). La 1re spec hésitait (l.77 « probablement rotation/croix — à confirmer », l.19/93 doute sur la présence). C'est levé : un **« + » cream** est bien rendu à droite de CHACUNE des 3 lignes (Etudes et Conceptions / Réalisations / Galerie Studio), centré verticalement, calé sur la marge droite du bloc. État fermé = « + » pour les 3. (col0 ne montrait que la moitié gauche, d'où l'absence apparente.)

3. **Header « MENU » + burger — CONFIRMÉ** (col1_b0). Le mot **MENU** (Bold, uppercase, cream) suivi de l'icône burger = **2 traits horizontaux** fins cream, en haut à droite du bloc hero. (Invisible sur col0 car hors de la moitié gauche.)

4. **Les 3 annotations « CLIC ACCORDEON … » sont bien en face des lignes, dans la marge droite** (col1_b1 montre les 3 d'un coup, col1_b2 répète « CLIC ACCORDEON GALERIE STUDIO »). Verbatim re-vérifié, exactement en capitales beiges :
   - « **CLIC ACCORDEON ETUDES ET CONCEPTIONS** »
   - « **CLIC ACCORDEON REALISATIONS** »
   - « **CLIC ACCORDEON GALERIE STUDIO** »
     (Pas de « S » à REALISATION → c'est bien « REALISATIONS ». Aucun accent dans les annotations.)

5. **Footer colonne droite — fin de la ligne typologies CONFIRMÉE** (col1_b2) : la 4e typologie se termine par **« …Caractère »** (rendu « Caractère » en petit, regular), confirmant **« Domaine & Caractère »**. Les libellés nav droite (Home / Studio / Projets / Démarrer un projet) re-confirmés (fragments « me / dio / jets / ojet » + titre « …rdin » = « jardin » de « Etudes par typologies de jardin »).

**Aucun nouveau contenu éditorial découvert** (pas de liste de projets, pas de cartes, pas de texte d'intro caché, pas de divergence couleur/typo nouvelle). Les seuls vrais ajouts sont : l'annotation de planche « PAGE PROJET » et la **confirmation** que le marqueur des accordéons est « + » (pas « × »).

---

## Identification

**Page = INDEX « Projets » (hub portefeuille), PAS une page de détail.**

Le contenu de la trame le prouve sans ambiguïté :

- H1 géant « **Projets** » en hero noir
- 3 lignes d'accordéons « + » : **Etudes et Conceptions**, **Réalisations**, **Galerie Studio**
- Annotations designer en marge droite : « CLIC ACCORDEON ETUDES ET CONCEPTIONS », « CLIC ACCORDEON REALISATIONS », « CLIC ACCORDEON GALERIE STUDIO »
- Footer beige complet en bas

C'est donc l'équivalent de `src/pages/projets/index.astro`. Ce n'est PAS `realisations/[slug]`,
`conceptions/[slug]` ni une carte projet. Nouveauté structurelle majeure : Jonathan passe d'un
modèle **2 cards (Réalisations / Conceptions)** à un modèle **3 accordéons dépliables**
(« Etudes et Conceptions », « Réalisations », « Galerie Studio »).

Remarque : la trame ne montre PAS le contenu déplié des accordéons (état fermé seulement).
Le comportement est annoté « CLIC ACCORDEON … » → le détail de chaque liste de projets reste
à fournir par Jonathan.

---

## Palette constatée

- **Fond hero + accordéons** : NOIR #000000 (noir profond, pas le forest vert habituel)
- **Texte hero/accordéons** : BEIGE #EDE6D6 (cream)
- **Footer** : fond BEIGE #EDE6D6, texte NOIR #000000
- Aucune autre couleur (pas de violet #e0afff sur cette trame, pas de rouge design — les filets rouges = repères écran 1920×1080)

---

## Section 1 — Topbar flottante « Démarrer un projet »

- En haut, **barre noire à coins arrondis** (radius ~24px en bas), détachée du bord (marge latérale + marge haute) — c'est la ContactBar/topbar flottante sitewide.
- Centrée : texte **« Démarrer un projet »**
  - Casse : Capitale initiale seulement (« Démarrer un projet »)
  - Graisse : **Bold (700)**
  - Couleur : cream #EDE6D6 sur noir
  - Taille : petit (~16-18px), label de barre
- Cette barre se superpose au bloc hero noir en dessous (deux couches noires à coins arrondis distinctes, l'une chevauche l'autre).

## Section 2 — Header (logo + MENU)

Sous la topbar, sur le bloc hero noir :

- **Gauche** : logo **« oliveira »** wordmark manuscrit (signature), en cream, suivi du symbole **®** discret. Hauteur ~40px.
- **Droite** : libellé **« MENU »** (Bold, uppercase, cream) + icône burger = **2 traits horizontaux** fins cream à droite du mot.
- Header transparent par-dessus le hero noir (full-width, aligné aux marges du bloc).

## Section 3 — Hero « Projets »

- Bloc **noir plein** à coins arrondis (radius haut ~32px), pleine largeur (avec marges latérales).
- **H1 « Projets »**
  - Police : heading (Inter / var(--font-heading))
  - Graisse : **Bold / ExtraBold** (très grasse — contraste fort vs ExtraLight habituel)
  - Casse : Capitale initiale (« Projets »)
  - Taille : **énorme** — occupe ~45% de la hauteur du bloc, ~font-size clamp ~ 12–16rem
  - Couleur : cream #EDE6D6
  - Position : **bas-gauche** du bloc hero, calé sur la marge gauche
  - Interligne serré (~1.0)
- Reste du bloc vide (noir).

## Section 4 — Accordéons (3 lignes empilées)

Trois lignes-accordéons pleine largeur, fond noir, séparées par un **filet cream fin** (1px) en haut de chaque ligne. Chaque ligne est un grand bloc noir à coins arrondis légers.

Pour chaque ligne :

- **Libellé à gauche** (calé marge gauche)
  - Police heading, graisse **Bold (700)**
  - Casse : Capitale initiale
  - Couleur : cream #EDE6D6
  - Taille : très grand (~ clamp 3–5rem), même échelle d'une ligne à l'autre
- **Icône « + » à droite** (calée marge droite)
  - Symbole **+** cream, fin, taille moyenne (~2rem)
  - État fermé = « + ». (Convention projet : ouvert = bascule, ici probablement rotation/croix — à confirmer, l'island actuel garde « + » sans devenir « X »)
- Hauteur de ligne généreuse (~padding vertical important, lignes hautes ~180-220px à l'état fermé)

Ordre + VERBATIM des libellés :

1. **Etudes et Conceptions** `+`
2. **Réalisations** `+`
3. **Galerie Studio** `+`

### Annotations designer (marge droite, hors maquette — comportements)

VERBATIM, en majuscules beiges (notes designer, pas du contenu affiché) :

- « **CLIC ACCORDEON ETUDES ET CONCEPTIONS** » → en face de la ligne 1
- « **CLIC ACCORDEON REALISATIONS** » → en face de la ligne 2
- « **CLIC ACCORDEON GALERIE STUDIO** » → en face de la ligne 3

Comportement = **chaque ligne est un accordéon cliquable** ; le clic déplie son contenu
(liste de projets — non montrée dans la trame). Animation attendue = pattern accordéon maison
(height JS-measured, dépliage/repliage, wave reveal mot par mot — cf. `FaqAccordion`).

> Note nomenclature : « Etudes et Conceptions » remplace « Conceptions », et une 3e catégorie
> « Galerie Studio » apparaît. La structure passe de 2 → 3 entrées.

## Section 5 — Curseur custom

Curseur global du site (non dessiné explicitement ici mais règle transversale) :

- **Carré à angles arrondis + point**, 3 couleurs selon le thème de section.
- Sur fond noir (hero/accordéons) → variante cream ; sur footer beige → variante ink.
- Animation infos-suivent-curseur (libellé section en haut-droite) au survol.
- Flou-survol-image + action-clic : à appliquer si des vignettes projet apparaissent dans les
  accordéons dépliés (contenu non visible sur cette trame).

## Section 6 — Footer (fond beige #EDE6D6, texte noir)

Bloc beige à coins arrondis, pleine largeur. Layout **2 colonnes** :

### Colonne gauche

- **Logo** : carré noir à coins arrondis (~tuile/icône) contenant le wordmark « oliveira » cream + ®. Ratio carré (~1:1, ~230px).
- **« Siège social Studio »** — Bold, noir, ~Capitale initiale
  - `41 Rue Général Souham`
  - `19100 BRIVE`
  - `06 61 08 84 44`
  - `contact.jonathanbiodesign@gmail.com`
  - (corps : graisse légère/regular, noir, petit)
- **« Territoires d'intervention »** — Bold, noir
  - `National` ← VERBATIM (NB : diffère du Footer actuel qui liste Brive/Limoges/Bordeaux)

### Colonne droite (alignée à droite, gros texte ExtraLight)

Liste de liens nav, police heading **ExtraLight (200)**, noir, alignés à droite, grande taille (~3rem), interligne aéré :

- `Home`
- `Studio`
- `Projets`
- `Démarrer un projet`

Puis, en dessous, sur toute la largeur droite :

- Titre **« Etudes par typologies de jardin »** (ExtraLight, grand, ~3rem)
- Ligne des 4 typologies (plus petit, ~1.3rem, espacé) :
  - **Micro urbain** (en Bold + petit carré noir « ▪ » + point devant — marqueur actif/puce)
  - `Coeur urbain`
  - `Frange urbaine`
  - `Domaine & Caractère`

### Bas de footer

- Filet noir fin séparateur pleine largeur.
- Mention : **« Droits réservés, mentions légales, etc. »** (petit, regular, noir) — VERBATIM (placeholder légal, à remplacer par vrai bloc légal).

---

## Synthèse des contenus VERBATIM

| Zone                  | Texte exact                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------ |
| Topbar                | Démarrer un projet                                                                         |
| Header                | MENU                                                                                       |
| H1 hero               | Projets                                                                                    |
| Accordéon 1           | Etudes et Conceptions                                                                      |
| Accordéon 2           | Réalisations                                                                               |
| Accordéon 3           | Galerie Studio                                                                             |
| Footer gauche titre 1 | Siège social Studio                                                                        |
| Footer adresse        | 41 Rue Général Souham / 19100 BRIVE / 06 61 08 84 44 / contact.jonathanbiodesign@gmail.com |
| Footer gauche titre 2 | Territoires d'intervention                                                                 |
| Footer territoires    | National                                                                                   |
| Footer droite nav     | Home / Studio / Projets / Démarrer un projet                                               |
| Footer droite titre   | Etudes par typologies de jardin                                                            |
| Footer typologies     | Micro urbain / Coeur urbain / Frange urbaine / Domaine & Caractère                         |
| Footer légal          | Droits réservés, mentions légales, etc.                                                    |

Annotations comportement (non affichées) : CLIC ACCORDEON ETUDES ET CONCEPTIONS / CLIC ACCORDEON REALISATIONS / CLIC ACCORDEON GALERIE STUDIO.

---

## DELTAS vs actuel

Fichier actuel : `src/pages/projets/index.astro` (lu intégralement). Footer : `src/components/astro/Footer.astro`. Accordéon dispo : `src/components/islands/FaqAccordion.tsx` + `src/components/astro/TypologieFaq.astro`.

**Structure de page — refonte complète :**

1. **Fond hero** : actuel = `var(--color-forest)` (vert) + image de fond + dégradé. Trame = **NOIR plein #000000, sans image**. → Supprimer l'`<Image>` de fond et le voile dégradé ; passer le hero en noir uni à coins arrondis.
2. **H1** : actuel = « Réalisations / & conceptions. » sur 2 lignes, ExtraLight + italique, mask-reveal, position basse-gauche. Trame = **un seul mot « Projets »**, **graisse Bold/ExtraBold** (pas ExtraLight), bas-gauche. → Remplacer le H1, changer la graisse en bold.
3. **Eyebrow** : actuel = `Portefeuille · Projets` (font-mono). Trame = **aucun eyebrow** au-dessus du H1. → Supprimer.
4. **Paragraphe d'intro** : actuel = « Deux portefeuilles parallèles… ». Trame = **absent**. → Supprimer.
5. **Bloc 2 cards** (`projets-split`, Réalisations + Conceptions avec images, veil, numéros 01/02, CTA « Parcourir ») : **n'existe plus** dans la trame. → Remplacer par **3 accordéons empilés** :
   - `Etudes et Conceptions` (+)
   - `Réalisations` (+)
   - `Galerie Studio` (+)
     Fond noir, libellé bold cream à gauche, « + » cream à droite, filets cream entre lignes. Réutiliser la mécanique de `FaqAccordion` (height JS-measured, single-open) mais adapter le style (lignes hero-scale, pas Q/R) — créer un composant type `ProjetsAccordion` ou généraliser l'accordéon studio. Contenu déplié = **à fournir par Jonathan** (`[À FOURNIR PAR JONATHAN : liste des projets par catégorie pour chaque accordéon]`).
6. **Nouvelle catégorie « Galerie Studio »** : n'existe nulle part actuellement. → Définir cible (route `/galerie` ? section ?) avec Jonathan.
7. **Nomenclature** : « Conceptions » → « **Etudes et Conceptions** » dans cette page. (les routes `/conceptions` et `/realisations` existent toujours.)
8. **Section « branches du studio »** + **Section CTA final « Un projet à étudier ? »** (avec `CtaLink` « Démarrer un projet ») : **absentes** de la trame. → À supprimer ou confirmer leur conservation hors-cadre (la trame montre seulement hero + accordéons + footer).

**Footer — déltas :** 9. **Couleurs** : Footer actuel = fond `--color-black-deep` (noir) + texte cream. Trame = **fond BEIGE #EDE6D6 + texte NOIR**. → Inverser le thème du footer sur cette maquette (à valider : est-ce le footer global qui change, ou seulement ici ? La trame studio/home utilisait un footer noir — vérifier avec Morgan si Jonathan veut désormais un footer beige sitewide). 10. **Colonne droite — libellés nav** : actuel = `Services` (Architecture paysagère, Architecture végétal d'intérieur, LCD atypiques, PRO, Projets) + `Studio` (Le studio, Journal, Contact). Trame = **Home / Studio / Projets / Démarrer un projet** + bloc **« Etudes par typologies de jardin »** (Micro urbain / Coeur urbain / Frange urbaine / Domaine & Caractère). → Refonte des listes du footer droite. 11. **Territoires** : actuel = 3 zones (Brive / Limoges / Bordeaux). Trame = **« National »** seul. → Remplacer (cohérence SEO local à arbitrer — impact GBP, à valider avec Morgan). 12. **Mentions** : actuel = `© {year} Studio J Oliveira — Tous droits réservés. Mentions légales · Confidentialité`. Trame = placeholder **« Droits réservés, mentions légales, etc. »** → garder la version actuelle (plus complète) ; le placeholder trame est juste indicatif. 13. **Logo footer** : actuel = wordmark cream masqué, h-~50px. Trame = **tuile carrée noire** contenant le wordmark cream. → Ajouter le conteneur carré noir arrondi autour du logo en version footer beige.

**Topbar / Header :** 14. Topbar « Démarrer un projet » + Header logo/MENU : déjà existants sitewide (ContactBar + Header). Vérifier que sur fond hero noir le rendu correspond (cream sur noir, coins arrondis). Probablement OK, pas de delta majeur.

**Curseur :** 15. Pas de changement requis — curseur custom global déjà en place ; vérifier les bascules de couleur sur noir (hero/accordéons) et beige (footer).

**Contenu manquant à logger (`_brief/contenus-manquants.md`) :**

- Listes de projets déplié pour chaque accordéon (Etudes et Conceptions / Réalisations / Galerie Studio).
- Définition de « Galerie Studio » (route, contenu, finalité).
- Arbitrage « National » vs zones locales au footer (SEO).
