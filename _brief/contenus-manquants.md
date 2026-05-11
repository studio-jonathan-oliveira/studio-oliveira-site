# Contenus manquants

Liste exhaustive des contenus marqués `[À FOURNIR PAR JONATHAN : …]` dans le code et la doc. Mise à jour vivante par Claude à chaque fois qu'un placeholder est inséré.

**Règle de collaboration** : Claude ne rédige JAMAIS de contenu textuel, chiffres, claims ou tonalité éditoriale « à la place de Jonathan ». Tout manque = placeholder explicite + entrée dans cette liste.

---

## Format des entrées

```
### [IDENTIFIANT UNIQUE]
**Type** : texte court / texte long / photo / vidéo / quote client / chiffre
**Emplacement** : fichier ou page du site
**Volume attendu** : nombre de mots / dimensions photo / durée vidéo
**Contexte** : à quoi ça sert
**Deadline suggérée** : Phase X
```

---

## Contenus identifiés à ce stade

### HOME-STUDIO

**Type** : texte court
**Emplacement** : `src/pages/index.astro` section `#studio-presentation` (l. 414)
**Volume attendu** : 2 à 3 lignes, ~30-50 mots
**Contexte** : texte ADN du studio juste avant le CTA « Découvrir le Studio J Oliveira ». Doit présenter le studio, son ADN, sa manière de travailler les conceptions. Lu après #identite (mots-clés justify) — sert de transition narrative.
**Deadline suggérée** : avant mise en ligne mai 2026 — actuellement le bloc est rendu vide en prod (placeholder caché en dev only).

### HERO-VIDEO-HOME

**Type** : vidéo (séquence Twinmotion 5s en boucle)
**Emplacement** : `src/components/astro/HeroHome.astro` (Phase 1)
**Volume attendu** : 5 s, 1920×1080, 24 fps = 120 frames, MP4 H.264 + WebM VP9, < 1.5 Mo chacune
**Contexte** : hero d'accueil immersif, premier contact visuel avec l'univers Oliveira. Doit représenter un mouvement caméra contemplatif dans un jardin biophilique (vue extérieure glissant vers intérieur, ou inverse)
**Deadline suggérée** : avant Phase 7 (mise en ligne). Placeholder vidéo neutre acceptable en Phase 1.

### HERO-MANIFESTE-HOME

**Type** : texte court
**Statut** : ✅ v1 posée à partir du PDF (« J'étudie et conçois des espaces à vivre... »). À valider/affiner par Jonathan.
**Emplacement** : `src/pages/index.astro` — section hero.
**Volume attendu** : 2-4 phrases (40-80 mots)
**Contexte** : manifeste condensé du studio. Ton éditorial Aesop/Kinfolk, pas « agence web ». Doit évoquer le design biophilique, l'approche architecture/humain/environnement.

### STUDIO-PAGE-CONTENU

**Type** : texte long
**Statut** : ✅ v1 posée à partir du PDF (intro, démarche biophilique 3 §, méthode 3 étapes). À enrichir éventuellement — actuellement ~300 mots, cible 1200-1800.
**Emplacement** : `/studio`
**Contexte** : page à propos premium. Puise dans `PROCESS ETUDES STUDIO 2026.pdf` (parcours, ADN biophilique, méthode vente).
**Reste à faire** : étoffer la section démarche avec les 14 modèles biophiliques (Terrapin Bright Green) ; photos studio ; quote ouverture personnelle.

### TYPOLOGIE-\*-CONTENU (× 4)

**Type** : texte long
**Emplacement** : `/conception-jardin/micro-urbain`, `/conception-jardin/coeur-urbain`, `/conception-jardin/frange-urbaine`, `/conception-jardin/domaine-caractere`
**Volume attendu** : 1500 mots chacune
**Contexte** : chaque page typologie doit contenir le H1 SEO (requête cherchée), H2 propriétaire (nom Jonathan), description du contexte, complexités techniques, exemples de livrables, fourchette tarifaire, FAQ (5-7 questions).
**Deadline suggérée** : avant Phase 4.

### HUB-CONCEPTION-JARDIN

**Type** : texte long
**Statut** : 🟡 intro v1 posée (80 mots, mots Jonathan PDF). Process et FAQ déjà rédigés. Reste le corps pilier SEO 1500 mots.
**Emplacement** : `/conception-jardin`
**Volume attendu** : 1500-2000 mots (corps)
**Contexte** : pilier SEO majeur. « Qu'est-ce que la conception de jardin ? Pourquoi un designer plutôt qu'un paysagiste traditionnel ? Présentation des 4 typologies. »
**Deadline suggérée** : avant Phase 4.

### HUB-AMENAGEMENT-INTERIEUR

**Type** : texte long
**Emplacement** : `/amenagement-vegetal-interieur`
**Volume attendu** : 1500 mots
**Contexte** : pilier secondaire. Présentation du service décors végétalisés (plantes naturelles + artificielles), cibles pros (hôtellerie/resto/bureaux/commerces), Airbnb atypiques.
**Deadline suggérée** : avant Phase 4.

### SPOKE-INTERIEUR-\* (× 5)

**Type** : texte long
**Emplacement** : `/amenagement-vegetal-interieur/{hotellerie,restauration,bureaux,commerces,airbnb-locations-atypiques}`
**Volume attendu** : 1000-1500 mots chacune
**Contexte** : spokes du hub intérieur. Chacun ciblé sur une vertical avec cas types, contraintes métier, exemples.
**Deadline suggérée** : Phase 4.

### ZONES-\* (× 4)

**Type** : texte long
**Emplacement** : `/zones/brive-la-gaillarde`, `/zones/bordeaux`, `/zones/limoges`, `/zones/toulouse`
**Volume attendu** : 1500 mots chacune (2000 pour Brive, page pilier)
**Contexte** : SEO local. Climat local, essences adaptées, typologies dominantes sur le territoire, projets réalisés ou zone de prospection. **Doit être unique, pas copier-coller**.
**Deadline suggérée** : Phase 4.

### JOURNAL-ARTICLES-LANCEMENT (× 5)

**Type** : texte long
**Emplacement** : `/journal/*`
**Volume attendu** : 1500-2000 mots chacun
**Contexte** : voir plan-seo.md §3.5. Articles piliers pour amorcer l'indexation Google. Biophilie, designer vs paysagiste, prix conception jardin 2026, essences corréziennes, jardin intérieur haussmannien.
**Deadline suggérée** : Phase 4.

### PROJETS-SCROLLFRAMES (× 3)

**Type** : séquences Twinmotion
**Emplacement** : `/conceptions/[slug]`
**Volume attendu** : 192 frames PNG 1920×1080 à 24 fps (= 8 s) par projet. Voir `checklist-twinmotion-jonathan.md`.
**Contexte** : expérience immersive des 3 projets phares conçus en Twinmotion.
**Deadline suggérée** : Phase 7 (avant mise en ligne). Test 96 frames en Phase 3 pour valider la chaîne.

### PROJETS-TEXTES (× N)

**Type** : texte court par projet
**Emplacement** : chaque page `/realisations/[slug]` et `/conceptions/[slug]`
**Volume attendu** : titre, client (si diffusable), lieu, année, surface, type intervention, parti pris 2-3 paragraphes (200-400 mots)
**Contexte** : storytelling éditorial des projets. Mentionné dans le tuto Twinmotion (« Petit texte descriptif … pour remplissage page projet »).
**Deadline suggérée** : Phase 4 pour les 3-5 projets phares, continu ensuite.

### TEMOIGNAGES-CLIENTS

**Type** : quotes clients
**Emplacement** : home + pages typologies + portfolio
**Volume attendu** : 3-5 quotes (nom, rôle/entreprise si B2B, quote 1-3 phrases, accord diffusion). Optionnellement photo client.
**Contexte** : social proof + schema.org `Review`.
**Deadline suggérée** : avant Phase 6 (audit SEO).

### PHOTOS-STUDIO

**Type** : photos lieu physique Brive
**Emplacement** : `/studio`, `/contact`, `/zones/brive-la-gaillarde`
**Volume attendu** : 3-5 photos haute résolution (min. 2000 px longueur) du studio 41 rue Général Souham
**Contexte** : ancrage géographique + authenticité lieu physique
**Deadline suggérée** : Phase 2-3.

### MENTIONS-LEGALES

**Type** : texte long légal
**Emplacement** : `/mentions-legales`
**Contexte** : SIRET, représentant légal, hébergeur Vercel, propriété intellectuelle.
**Deadline suggérée** : avant Phase 7.

### POLITIQUE-CONFIDENTIALITE

**Type** : texte long légal
**Emplacement** : `/confidentialite`
**Contexte** : traitement données formulaire contact, durée conservation, sous-traitants (Resend, Vercel Blob, Turnstile), droits RGPD, DPO.
**Deadline suggérée** : avant Phase 7.

---

## Ajouts Phase F/G (2026-04-23)

### FAQ-ARCHITECTURE-PAYSAGERE-4-NOUVELLES

**Type** : texte éditorial Jonathan
**Emplacement** : `src/pages/architecture-paysagere/index.astro` (FAQ étoffée de 4 → 8 questions)
**Volume attendu** : 4 réponses de 80 à 180 mots chacune
**Questions à traiter** :

1. « Quelle est la différence entre designer végétal et paysagiste ? » (120-180 mots, positionnement studio concepteur vs artisan exécutant)
2. « Le design biophilique, c'est du greenwashing ? » (100-150 mots, référence 14 principes Browning-Ryan-Clancy, distinction avec décoration végétale)
3. « Vous êtes basé à Brive mais vous intervenez à Bordeaux, Limoges, Toulouse — comment ça marche ? » (80-120 mots, déplacements, visites, outils collaboratifs)
4. « Peut-on voir un projet réalisé avant de commencer ? » (80-120 mots, visite sur demande qualifiée, portfolio Twinmotion, journal)

**Contexte** : 5 objections prospects identifiées dans audit UX 2026-04-23 §4, à adresser pour conversion HNW.
**Deadline suggérée** : avant mise en ligne fin mai 2026.

### IMAGES-5-CHAPITRES-ARCHITECTURE-PAYSAGERE

**Type** : photos macro thématiques (5)
**Emplacement** : `src/pages/architecture-paysagere/index.astro` sections chapitres
**Volume attendu** : 5 images 1920×1080 min, WebP/JPEG, qualité éditoriale premium
**Thèmes** :

1. **Végétal** : détail macro feuillage / port plante / texture feuille (placeholder actuel = typologie frange-urbaine)
2. **Matières** : pierre taillée / bois brut / acier corten / gravier (placeholder = domaine-caractere)
3. **Textures** : mousse sur pierre / herbe / bois érodé détail tactile (placeholder = coeur-urbain)
4. **Luminaires** : jardin éclairé à la tombée du jour / luminaire détail (placeholder = micro-urbain)
5. **Modèles biophiliques** : visuel conceptuel des 14 principes Browning-Ryan-Clancy (placeholder = hero-biophilie)

**Contexte** : refonte style Polestar demandée PDF l.775-777.
**Deadline suggérée** : avant mise en ligne fin mai 2026.

### META-DESCRIPTION-STUDIO — ✅ COMPLÉTÉ Phase E

Remplacé par description factuelle générée sur les faits du PDF (biophilie, Brive, 2021). À re-valider par Jonathan si besoin.

---

## Refonte Jonathan 30-04 (issue GitHub #3)

### HOME-STUDIO-PRESENTATION

**Type** : texte court
**Emplacement** : `src/pages/index.astro` — section `#studio-presentation` (juste après IDENTITÉ).
**Volume attendu** : 2 à 3 lignes max (60-100 mots).
**Contexte** : présentation du studio, de son ADN, manière de travailler ses conceptions. Affiché sur fond latérite, texte crème centré, MAJ. Suivi d'un CTA magnétique « Découvrir le Studio J Oliveira » → `/studio`.
**État** : placeholder visible « TEXTE EXPLICATIF ET PRESENTATION DU STUDIO… ».
**Deadline suggérée** : avant mise en ligne fin mai 2026.

### ARCHITECTURE-PUBLIQUE-PAGE

**Type** : texte structuré (hero + 3 piliers)
**Emplacement** : `src/pages/architecture-paysagere/architecture-publique.astro`
**Volume attendu** :

- Hero intro : 3-4 lignes (positionnement marché public)
- 3 piliers (Génie végétal / Design biophilique / Secteur public) : 2-3 lignes chacun
  **Contexte** : nouvelle 5e typologie ajoutée le 30-04 (capture typologies-01.png). Page dédiée au marché public — collectivités, MOA publique, appels d'offres. Ton plus institutionnel que les autres typologies particuliers.
  **État** : placeholders visibles dans la page.
  **Deadline suggérée** : avant mise en ligne fin mai 2026.

### ARCHITECTURE-PUBLIQUE-IMAGE

**Type** : photo (visuel d'illustration carousel home + hero page)
**Emplacement** : `src/assets/typologies/architecture-publique.webp` à créer ; référencé dans `src/pages/index.astro` (typologies array, 5e entrée).
**Volume attendu** : photo paysage 1280×960 min, 4:3, optimisée WebP < 200 Ko.
**Contexte** : actuellement le carousel home et la page utilisent `domaine-caractere.webp` comme placeholder. À remplacer par un visuel propre représentatif (espace public végétalisé, parc institutionnel, génie végétal).
**Deadline suggérée** : avant mise en ligne fin mai 2026.

### FORMULAIRE-CONTACT

**Type** : texte court (message de confirmation succès)
**Emplacement** : `src/components/islands/ContactForm.tsx` — bloc state success
**Volume attendu** : 1 à 2 phrases (~20-40 mots)
**Contexte** : message affiché après envoi réussi du formulaire. Doit engager l'utilisateur sur le délai de réponse réel de Jonathan (« sous 48 h », « sous 2 jours ouvrés »…) et la suite (appel de qualification 15-25 min). Placeholder actuel : « Nous revenons vers vous sous quelques jours ouvrés pour engager l'appel de qualification. »
**Deadline suggérée** : avant mise en ligne fin mai 2026.

---

**Mise à jour** : à compléter à chaque nouveau placeholder inséré dans le code ou la doc.
