# Check-list Twinmotion — à destination de Jonathan

Procédure d'export **obligatoire** pour que les rendus Twinmotion soient exploitables dans le pipeline scroll-driven du site. Une seule erreur (motion blur actif, mauvaise résolution, mauvais nommage) = rendu inutilisable, plusieurs heures perdues.

---

## ⚠️ Avant toute chose : séquence test 96 frames

**Ne pas lancer les rendus complets des 3 projets directement.** Commencer par **1 séquence test** d'un projet pilote :
- Durée : 4 secondes = **96 frames** (au lieu de 192)
- Même path caméra que le rendu final envisagé
- Tous les autres paramètres identiques à la liste ci-dessous

L'envoyer à Morgan → validation cadrage + colorimétrie + fluidité → feu vert pour lancer les rendus complets.

---

## Paramètres d'export — IMMUABLES

| Paramètre | Valeur |
|---|---|
| Type de média | **Sequence** (pas « Vidéo ») |
| Format de fichier | **PNG** |
| Résolution | **1920 × 1080** (Full HD — surtout pas 4K) |
| Frame rate | **24 fps** |
| Durée | **8 secondes** = **192 frames** (pour rendus complets projets) |
| Qualité de rendu | **Ultra** ou **Cinematic** |
| **Motion blur** | ❌ **DÉSACTIVÉ** — critique, sans exception |
| Depth of field | Au choix artistique (doux si activé) |
| Ambient occlusion | Activé (profondeur) |

---

## Chemin caméra — règles de narration

Mouvement **doux et continu**. **Pas de cut, pas de zoom brutal.** Caméra qui flotte.

Structure recommandée sur 8 secondes :
1. **0-2 s** : vue extérieure / entrée du lieu
2. **2-5 s** : glissement de pénétration dans l'espace
3. **5-7 s** : révélation du cœur du jardin (intérieur ou point fort)
4. **7-8 s** : détail ou plan rapproché sur élément signature

Si le projet n'a pas de « pénétration » évidente (ex : jardin ouvert), structure alternative :
1. **0-3 s** : plan large contemplatif
2. **3-6 s** : travelling latéral ou avant subtil
3. **6-8 s** : zoom caméra vers élément signature

---

## Nommage et livraison

### Pour chaque projet

1. **Dossier de frames** : `projet_[nom-du-lieu]_frames.zip`
   - Frames nommées automatiquement par Twinmotion : `frame_0001.png` → `frame_0192.png`
   - Poids attendu : ~300-500 Mo zippé
2. **Fichier MP4 bonus** : même chemin caméra, format Vidéo
   - Nom : `projet_[nom-du-lieu].mp4`
   - Codec : H.264
   - Résolution : 1920×1080
   - Frame rate : 24 fps
   - Poids attendu : ~15-30 Mo
3. **Petit texte descriptif** (dans le mail ou un fichier `.md` joint) :
   - Nom client (si diffusable publiquement)
   - Lieu
   - Année
   - Surface
   - Type d'intervention
   - 2-3 lignes sur le parti pris (tonalité éditoriale libre, Morgan reformulera)

### Canal de livraison

**À définir avec Morgan** — options : WeTransfer (lien 7 j), Google Drive partagé, Nextcloud.

---

## Priorité des rendus

Ordre de livraison recommandé :

1. **Séquence test 96 frames** (projet pilote) — pour valider la chaîne
2. **Séquence hero d'accueil** — 5 s, 120 frames, path caméra démonstratif de l'univers Oliveira. **Priorité absolue avant les 3 projets** pour permettre l'intégration de la home en Phase 1.
3. **3 séquences projets complètes** — 192 frames × 3 projets = ~9 h de rendu total

---

## Licence Twinmotion — rappel

Twinmotion est **100 % gratuit pour usage pro** depuis avril 2024 si CA < 1 M$ USD/an. Télécharger via **Epic Games Launcher**. Aucun watermark, pleine résolution, pas de licence à acheter.

---

## Pré-check avant export — ta check-list

- [ ] Motion blur désactivé (vérifier 2 fois — sinon rendu inutilisable)
- [ ] Résolution 1920 × 1080 (pas 4K, pas 2K)
- [ ] Frame rate 24 fps
- [ ] Durée 8 s pour rendu final (4 s / 96 frames pour test)
- [ ] Qualité Ultra ou Cinematic
- [ ] Format PNG (pas JPEG)
- [ ] Path caméra validé à l'œil nu sur preview avant lancement
- [ ] Dossier de sortie dédié (ne pas écraser d'autres exports)
- [ ] ~300-500 Mo de disque libre par projet
- [ ] Canal de livraison prévu avec Morgan

---

**Contact si bug ou doute** : Morgan (pas de lancement de rendu de 50 min sur un paramètre douteux — mieux vaut valider avant).
