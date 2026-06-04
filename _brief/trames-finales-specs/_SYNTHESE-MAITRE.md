# Synthèse maître — Refonte finale Jonathan (trames "modif finales")

Source de vérité : `_assets/modif finales/*.jpg` (11 trames). Analyse pixel-perfect via 11 agents.
Date : 2026-06-04.

## PALETTE FINALE (confirmée — seulement 3 couleurs)

- **NOIR / gris sombre** `#000000`
- **BEIGE** `#EDE6D6`
- **VIOLET / lilas** `#e0afff` (nouvel accent, REMPLACE le rouge/latérite)
- ⚠️ Le **ROUGE** sur les maquettes n'est PAS du design = traits délimitant un écran 1920×1080 (repère de taille). À ignorer en tant que couleur.
- Aucune autre couleur détectée sur l'ensemble des trames.

## SPECS TRANSVERSALES SITEWIDE (à construire une fois, appliquer partout)

1. **Curseur custom = carré à angles arrondis + petit point (dot)** en bas-droite. Même mouvement de suivi qu'actuellement. 3 déclinaisons couleur selon le fond (noir / blanc / violet). Remplace l'ancien rond.
2. **Accordéons** : icône **`+`** (fermé) → **`×`** (ouvert). 3 couleurs selon fond. Single-open probable.
3. **Animation "flou au survol + action au clic"** sur images : survol → image floutée + pastille/bouton beige (« Agrandir » / « Découvrir » / etc.) → clic → action (lightbox, navigation…). Présente sur galeries, cartes projets, accordéons.
4. **Animation "infos qui suivent le curseur"** : au survol de certains éléments, un bloc d'info apparaît en haut-droite du curseur et le suit (déjà existant sur scroll horizontal typologies, à étendre). Annoté « TEXTE + CADRE AIMANTÉ AU CURSEUR ».
5. **Topbar = gros CTA "Démarrer un projet"** + **MENU** à droite + logo. Masquée pendant hero plein écran, fixe ensuite, survol → violet.
6. **Footer refondu** : Territoires = « National », nav Home/Studio/Projets/Démarrer un projet + bloc « Etudes par typologies de jardin » (4 typologies). Certaines trames le montrent en beige/noir (à confirmer sitewide).
7. **Casse** : sentence case (Première lettre majuscule, reste minuscule) — fin des UPPERCASE systématiques.

## DA GLOBALE

Bascule vers **fond BEIGE #EDE6D6 + texte NOIR**, accent **VIOLET**. Abandon total du rouge/latérite et des fonds noirs dominants (le noir reste pour footer + certains heros/pages comme /demarrer). Plusieurs pages typologies qui étaient noir/rouge repassent en beige/noir.

---

## PAR PAGE (deltas condensés)

### HOME (`index.astro`)

- Topbar CTA "Démarrer un projet" (nouveau). Sections Identité + Studio : noir → **beige**.
- Identité : bandeau valeurs Bold (Architecture · Design · Contexte · Expérientiel · Signature · Art de vivre · Vivant · Immersif).
- Studio : nouveau texte ADN verbatim, CTA magnétique pilule.
- **NOUVELLE section STATS** : +10 Études / +10 ans / +3 régions, curseur qui s'allonge + bloc aimanté + CTA.
- Typologies : **4 cartes** (suppr. Architecture publique), beige, sous-types listés, **flou au survol** + CTA Découvrir.
- Manifeste rouge : absent de la trame (à confirmer suppression).

### STUDIO (`studio.astro`)

- Toute la page **beige/noir**. Hero = un seul mot géant **« Bienvenue »** (bas-gauche). Intro 5 paragraphes + photo = section séparée sous hero.
- Corrections verbatim intro (crée/10 ans/l'ensemble/P5 réécrit). Manifeste réécrit (« Composer avec toutes les architectures… »).
- Accordéon Architectures : noir/beige, titres **Bold**, `+`→`×`, apparition wavy pilotée scroll.
- Parcours : **5 entrées** (suppr. BAC ES), titre Bold casse normale.
- **+ Nouveau bloc « Galerie Studio » en accordéon** (voir trame accordeon-galerie-studio).

### GALERIE STUDIO (accordéon, nouveau bloc /studio)

- Accordéon « Galerie Studio » (`×` ouvert) + « Réalisations » (`+` fermé) — noir/beige.
- Ouvert : grille **3 colonnes** vignettes portrait ~3/4, léger quinconce.
- Hover : **flou + pastille « Agrandir »** → lightbox (image agrandie gauche, `×` haut).

### DÉMARRER UN PROJET (`demarrer-un-projet`)

- Palette **VIOLET + NOIR** (pas beige). Hero H1 noir « Démarrer / votre projet » sur violet.
- « Comment ça marche ? » → Étape 1 (chiffre 1, 3 accordéons) → Étape 2 (chiffre 2, 2 accordéons) → formulaire.
- Accordéons libellés violets `+`/`×`, « FLOU IMAGE AU CLIC DE L'ACCORDÉON ».
- Formulaire 2 colonnes : Nom (full) / Email · Tél / Localisation · Surface / Budget · Période / Joindre docs (full).
- **Surface, Budget, Période = SELECTS** (options verbatim relevées, mapping surface→typologies). Bouton **« ENVOYER AU STUDIO »** pilule magnétique inversion noir/violet.

### TYPOLOGIES (coeur-urbain, micro-urbain, frange-urbaine, domaine-caractere)

Grammaire commune :

- **Fond BEIGE / texte NOIR** partout (retour DA — abandon noir/rouge + photo plein-bleed).
- Hero typographique : H1 noir **Black**, casse Title (« Coeur / urbain »), **pas de photo**, fond beige.
- 4 specs label/valeur (flex space-between). **3e label corrigé : « Type de jardin / propriété »** (au lieu de « Contexte environnemental »).
- Sections **« Définir »** et **« Comprendre »** (titres jalons Bold) intercalées dans galerie magazine.
- **Marquee** « découvrir les projets ◦ … » texte outline défilant, stop au survol, clic → projets (remplace CTA full-width).
- FAQ **beige/noir** (pas rouge), accordéon `+`/`×`. Jeu de questions modifié : ajout « Quels sont les livrables de l'étude ? », retrait « Pourquoi facturer une étude… » (réponses à fournir par Jonathan).
- Valeurs specs / manifestes : corrections verbatim par page (voir specs détaillées).

### PROJETS (index `projets/index.astro`)

- Hero **noir plein**, H1 « Projets » Bold/ExtraBold bas-gauche (suppr. eyebrow + intro + image).
- Cœur : suppr. les 2 cards → **3 accordéons** : « Etudes et Conceptions », « Réalisations », « Galerie Studio » (libellé bold cream, `+`, filets).
- Footer beige/noir.

### RÉALISATIONS (`realisations`, accordéon)

- Page = **accordéon unique** fond noir/beige (pas grille statique).
- « Réalisations » `+`→`×` déroule galerie **3 colonnes** cartes projets.
- Cartes : bloc infos beige superposé (Titre/Établissement/Type/Réalisation ANNÉE/Ville).
- Hover : **flou + bouton « Agrandir »** → lightbox plein écran (`×` haut-droite).
- ~9 cartes verbatim relevées (à reseed dans mock-projects.ts).

### ÉTUDES ET CONCEPTIONS (accordéon — PAGE/SECTION À CRÉER)

- N'existe pas (conceptions/index = placeholder). À créer (probablement dans /projets via accordéon, et/ou page dédiée).
- Accordéon « Etudes et Conceptions » noir/beige `+`→`×`.
- Ouvert : grille 2 colonnes quinconce ~9 cartes projets (vignette Twinmotion + overlay 4 lignes : type/nature/Conception AAAA/lieu + badge « Agrandir »).
- Hover : flou (overlay net). Lightbox : image arrondie + carte beige « Approche projet » (titre bold + corps justifié) aimantée au curseur, `×` haut-droite.
- Verbatim partiel (1 « Approche projet » lisible, autres à fournir par Jonathan).

### PROJET (trame « projet ») = en réalité l'INDEX Projets (cf. ci-dessus).

---

## DÉCISIONS MORGAN (2026-06-04) — VERROUILLÉES

1. **Territoires = « National »** : OUI. (⚠️ garder les pages /zones pour le SEO local malgré le footer « National ».)
2. **Manifeste rouge home** : supprimé OUI — MAIS remplacé/complété par la **nouvelle section Stats « +10 Études » etc.**
3. **Footer beige/noir partout** : OUI sitewide, SAUF `/demarrer-un-projet` qui est **noir + violet**.
4. **Bascule DA typologies** noir/rouge → beige/noir : OUI validé.
5. **Images** : Morgan fournit sous-dossiers 01-/02- → placeholders en attendant.

## QUESTIONS OUVERTES (pour Morgan / Jonathan)

1. **Manifeste rouge home** : supprimé ? (absent de la trame)
2. **Footer beige/noir** : sitewide ou par page ?
3. **Territoires = « National »** : on abandonne les zones locales Brive/Bordeaux/Limoges en footer ? (⚠️ impact SEO local — les pages /zones restent ?)
4. **Réponses FAQ** manquantes (« Quels sont les livrables de l'étude ? ») → Jonathan.
5. **Textes « Approche projet »** des cartes conceptions → Jonathan.
6. **Sections home/projets hors trame** (manifeste, branches studio, CTA final) : garder ou supprimer ?
7. Validation **bascule DA typologies** noir/rouge → beige/noir (gros changement).
8. Images : sous-dossiers 01-…, 02-… à fournir par Morgan (placeholders en attendant).
