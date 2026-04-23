# Questions ouvertes — à trancher

Questions bloquantes ou structurantes restant à résoudre. Classées par urgence (1 = bloque la phase en cours, 3 = à résoudre avant mise en ligne).

---

## Priorité 1 — bloquantes Phase 0 / Phase 1

### 1.1 — Accès Google Search Console de `jonathanoliveira.fr` actuel

**Pourquoi** : préparer la table de correspondance 301 pour éviter la perte de positions SEO existantes lors du switch DNS. Sans accès, je crawlerai avec Screaming Frog, mais je perdrai les URLs déjà désindexées dont la réputation subsiste encore (liens externes, etc.).
**Action attendue** : Jonathan partage l'accès GSC, ou tu confirmes qu'on se contente du crawl Screaming Frog.

### 1.2 — Charte graphique 43 Mo

**Pourquoi** : le PDF `client-assets/logo-identite/Charte graphique - Oliveira def.pdf` n'est pas lisible programmatiquement (pdftoppm échoue). Sans elle, je ne peux pas figer les couleurs hex officielles, les règles typo, les variantes logo autorisées.
**Action attendue** : Jonathan fournit un PDF allégé (< 10 Mo) OU un export PNG des 5-10 planches clés (palette RVB/hex, typos officielles, règles logo, iconographie, grilles). OU on extrait à la main sur ta machine via Acrobat.
**Couleurs connues à ce stade** : `#6F7E4E` (vert mousse, coffret), `#A94930` (rouge latérite, coffret). Logo wordmark `oliveira` en vert mousse avec calligraphie organique (marquée ®).

---

## Priorité 2 — bloquantes Phase 2 / Phase 3

### 2.1 — Canal de livraison frames Twinmotion

**Pourquoi** : Jonathan va envoyer 3 dossiers de 300-500 Mo de frames PNG. Il faut un canal stable.
**Options** : WeTransfer (lien 7 jours, simple), Google Drive partagé (persistant), Nextcloud (auto-hébergé si tu en as un).
**Action attendue** : ton choix, puis partage à Jonathan via [`checklist-twinmotion-jonathan.md`](checklist-twinmotion-jonathan.md).

### 2.2 — Livraison séquence hero d'accueil

**Pourquoi** : le hero d'accueil = vidéo Twinmotion 5s en loop. Sans cet asset, Phase 1 avance avec placeholder vidéo neutre (dev débloqué) mais Phase 7 (mise en ligne) ne peut pas livrer l'expérience finale.
**Action attendue** : Jonathan rend une séquence hero courte (5s, 120 frames, path caméra démonstratif de son univers) **avant** les 3 séquences projets. C'est la priorité n°1 côté rendu.

### 2.3 — Rédaction des ~37 000 mots de contenu inaugural

**Pourquoi** : 8 pages piliers (~22k mots) + 5 articles blog (~9k mots) + 4 pages locales (~6k mots). C'est le point bloquant historique n°1 sur ce type de projet.
**Options** :

- **(a) Jonathan rédige tout** avec des outlines H2/H3 + mots-clés fournis par Claude — respect strict de la règle « jamais inventer de contenu ».
- **(b) Ghost-writer externe** recruté par Jonathan (copywriter éditorial, 500-1500 €/article).
- **(c) Claude livre des ébauches** que Jonathan corrige — dérogation assumée à la règle « jamais inventer de contenu ». Risque : ton qui sonne AI, à relire aux petits oignons.
  **Action attendue** : ton choix + planning retroplanning de livraison contraint (ex : 1 page pilier validée par semaine à partir du 1er mai).

---

## Priorité 3 — à résoudre avant mise en ligne

### 3.1 — Fonts typographiques officielles

**Pourquoi** : ma proposition = Cormorant Garamond (serif titres) + Inter (sans corps). À valider contre la charte officielle Jonathan (probablement dans le PDF 43 Mo).
**Action attendue** : confirmation ou nom des fonts officielles.

### 3.2 — Témoignages clients / social proof

**Pourquoi** : schema.org `Review` + section social proof sur home + pages typologies. Sans quotes clients, on n'a qu'une preuve visuelle (photos projets).
**Action attendue** : Jonathan fournit 3-5 quotes clients (nom, titre si B2B, quote 1-3 phrases, photo client si consentement).

### 3.3 — Domaine email pro

**Pourquoi** : actuellement `contact.jonathanbiodesign@gmail.com` (process). Email pro `contact@jonathanoliveira.fr` plus crédible pour un studio premium + requis pour Resend FROM address + schema `LocalBusiness`.
**Action attendue** : Jonathan configure un mail pro sur le domaine (Fastmail, Infomaniak, OVH Mail — je recommande Fastmail pour la fiabilité).

### 3.4 — Google Business Profile

**Pourquoi** : pivot SEO local pour `/zones/brive-la-gaillarde`. Lien NAP cohérent entre GBP et site essentiel.
**Action attendue** : vérification que la fiche GBP existe, est à jour, et que les coordonnées (41 rue Général Souham, 19100 Brive-la-Gaillarde, 06 61 08 84 44) sont identiques.

### 3.5 — Coordonnées Bordeaux / Limoges / Toulouse

**Pourquoi** : les pages `/zones/*` ont besoin d'ancrages locaux. Brive = siège. Limoges = bureau Verneuil-sur-Vienne (adresse exacte à récupérer). Bordeaux = « point central d'études, pas de bureau fixe encore » (à documenter tel quel). Toulouse = prospection (à documenter tel quel).
**Action attendue** : Jonathan confirme les adresses précises utilisables en LocalBusiness multi-sites, ou confirme que seul Brive est schematisé.

### 3.6 — RGPD / mentions légales

**Pourquoi** : SIRET, représentant légal, hébergeur, conditions de conservation des données formulaire. Contenu à rédiger par Jonathan ou son avocat.
**Action attendue** : Jonathan fournit texte des mentions légales et politique de confidentialité, ou valide un template à customiser.
