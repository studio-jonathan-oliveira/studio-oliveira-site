# BRIEF PROJET — Refonte site Jonathan Oliveira (Studio Designer Végétal)

## 🎯 Contexte & positionnement

Tu vas concevoir et développer la refonte complète du site de **Jonathan Oliveira**, designer végétal / biophilic designer basé en France. Son métier : concevoir des univers végétalisés d'intérieur et d'extérieur (jardins intérieurs, murs végétaux, aménagements biophiliques pour particuliers haut de gamme, hôtels, restaurants, bureaux).

**Site actuel** : `https://www.jonathanoliveira.fr` — structure basique type Wix/Squarespace, insuffisante pour son positionnement.

**Positionnement à traduire visuellement** : premium, artisanal, contemplatif, sensoriel. On vise l'univers de marques comme _Aesop_, _Hermès Jardins_, _Maison Pierre Hermé_ côté raffinement, croisé avec la puissance immersive de sites comme _Apple AirPods_, _Lusion Studio_, _Active Theory_. Pas de "site d'artisan jardinier" — on est sur du **design studio de luxe**.

**Objectif business** : générer des demandes de devis qualifiées de clients premium (particuliers fortunés, hôtellerie, restauration haut de gamme, architectes d'intérieur). Le site doit être un outil de conversion ET une œuvre en soi (effet waouh pour partage, portfolio ambassadeur).

---

## 🛠️ Stack technique imposée

- **Framework** : Astro 5+ (content-driven, SSG, optimal SEO + perf)
- **UI / composants interactifs** : React 19 en islands (`client:load` / `client:visible` / `client:idle` selon criticité)
- **Styling** : Tailwind CSS v4 + variables CSS custom pour design tokens
- **Animations 2D** : GSAP + ScrollTrigger (licence Business si usage commercial — à vérifier) OU **Motion** (ex-Framer Motion, gratuit) pour 90% des cas
- **3D** : Three.js + React Three Fiber + Drei + Theatre.js (pour scroll-driven 3D scripté)
- **CMS** : **Sanity.io** (free tier suffisant, studio embarqué, excellente DX, structured content parfait pour portfolio + blog). Alternative si refus : Decap CMS (Git-based, gratuit total).
- **Hébergement** : Vercel (edge, analytics, Core Web Vitals monitoring intégré)
- **Formulaires** : Astro Actions + Resend pour les emails transactionnels
- **Analytics** : Plausible (RGPD-friendly, pas de bannière cookie = UX propre) + Google Search Console
- **Gestion médias lourds** : Cloudinary ou Bunny.net (transforms on-the-fly, CDN vidéo optimisé)

**Package manager** : pnpm.
**Node** : ≥ 20 LTS.

---

## 📐 Architecture des pages

```
/                         → Accueil (hero 3D immersif + manifeste + 3 projets phares + CTA)
/studio                   → À propos (parcours, philosophie biophilique, équipe)
/creations                → Portfolio (grille filtrable : intérieur / extérieur / pro / particulier)
/creations/[slug]         → Page projet (case study immersif, scroll 3D si dispo, galerie, détails)
/savoir-faire             → Services détaillés (design végétal, entretien, biophilie corporate…)
/savoir-faire/[slug]      → Page service avec CTA dédié
/journal                  → Blog / articles (SEO carburant)
/journal/[slug]           → Article
/contact                  → Formulaire qualifié + coordonnées + map
/mentions-legales
/confidentialite
```

**URLs FR obligatoires** — pas de `/about`, `/works`, `/blog`. Le français premium fait partie de l'identité.

---

## 🎨 Direction artistique

**Palette** :

- Fond principal : `#F5F1EA` (crème chaud, papier)
- Texte principal : `#1A2B1F` (vert très sombre, presque noir)
- Accent 1 : `#3D5A3E` (vert profond, feuillage)
- Accent 2 : `#8B7355` (brun terre, bois)
- Accent lumière : `#D4B896` (or végétal, pour détails premium)

**Typographie** :

- Titres : **Tenor Sans** ou **Cormorant Garamond** (serif élégante, éditoriale)
- Corps : **Inter** ou **Geist** (sans-serif moderne, lisibilité optimale)
- Signature/détails : **Caveat** ou écriture manuscrite custom pour accents artisanaux
- Échelle typographique fluide avec `clamp()` partout — pas de breakpoints rigides sur le texte

**Grille & espacements** :

- Généreux, aérés, inspiration éditoriale magazine (Kinfolk, Cereal)
- Marges latérales respiratoires
- Sections pleine hauteur de viewport sur pages clés
- Éviter absolument l'aspect "bento box tech startup"

**Règles visuelles** :

- Photos végétales plein cadre, pas de fond blanc ni ombres portées ringardes
- Micro-animations partout (hover, apparition, parallax subtil)
- **Grain de papier léger** sur le fond (overlay noise SVG ~2% opacité) pour texture artisanale
- Transitions de page : fondu + léger slide, jamais brutal (View Transitions API d'Astro)
- Curseur custom optionnel sur desktop (cercle organique qui réagit au hover)

---

## 🌿 Expériences immersives (le cœur du site)

### Hero d'accueil

Scène 3D React Three Fiber : feuillage qui s'anime lentement (shader wind subtil), caméra qui dérive en fonction de la souris/gyroscope mobile. En-dessous, le nom "Studio Jonathan Oliveira" en grand, animé en reveal lettré au chargement. CTA discret "Découvrir les créations".

**Fallback mobile bas de gamme / reduced-motion** : image hero statique ultra-soignée + vidéo en boucle légère (< 2 Mo, WebM/AV1).

### Scroll-driven sur pages projets

**Note critique sur les formats 3D** : SketchUp (.skp) et Twinmotion (.tm) ne sont PAS lisibles nativement dans un navigateur. Deux pipelines à prévoir selon ce que Jonathan fournit :

**Pipeline A — 3D interactive (si exports GLTF possibles)** :

1. Jonathan exporte depuis SketchUp via le plugin "Export GLB/GLTF" ou passe par Blender comme intermédiaire
2. Optimisation obligatoire via `gltf-transform` CLI : draco compression + texture resize + mesh simplification (objectif < 5 Mo par scène)
3. Intégration R3F + Theatre.js pour scripter la caméra sur le scroll
4. LOD automatique via `<Detailed>` de Drei
5. Suspense + loader custom végétal pendant le chargement

**Pipeline B — Photoréalisme Twinmotion (plus probable, plus beau)** :

1. Jonathan exporte depuis Twinmotion une **séquence d'images** (path animation rendue frame par frame, typiquement 120-240 frames à 1920×1080)
2. OU une **vidéo** qu'on lit en scroll-scrub (technique Apple)
3. Pour les séquences image : pré-chargement via Canvas, dessin de la frame correspondant au % de scroll, GSAP ScrollTrigger pour piloter
4. Optimisation : WebP ou AVIF, ~50-80 Ko par frame, lazy loading progressif
5. Version mobile : 60 frames max en résolution réduite, ou vidéo directement

**Prévoir les deux pipelines dans le code**, décision frame par frame selon ce que Jonathan arrive à exporter.

### Galerie projet

Scroll horizontal sur desktop (translateX piloté par scrollY), retour au vertical sur mobile. Photos plein écran avec légendes éditoriales discrètes. Navigation clavier (←/→).

### Transitions inter-pages

View Transitions API d'Astro pour continuité visuelle entre liste projets → détail projet (image qui se "zoom" en fondu).

### Sections "reste du site" en 2D animé

- Apparitions au scroll avec masques/reveals (GSAP SplitText pour les titres)
- Parallax léger sur les images (pas plus de 15% de translation)
- Hover sur cartes projets : zoom image + crossfade + légende qui apparaît
- **Jamais d'animation gratuite** — chaque mouvement doit servir la narration

---

## 🔍 SEO (priorité absolue)

### Technique

- Rendu statique Astro (SSG) → HTML pur servi, crawl optimal
- Core Web Vitals cibles : LCP < 2s, INP < 200ms, CLS < 0.05
- Images en `<Image>` d'Astro (AVIF + WebP fallback, lazy, dimensions explicites)
- Preload des fonts critiques, `font-display: swap`
- Structured data JSON-LD sur chaque type de page :
  - `LocalBusiness` + `ProfessionalService` sur home & contact
  - `CreativeWork` ou `Project` sur pages projets
  - `Article` sur posts de blog
  - `BreadcrumbList` partout
  - `Person` pour Jonathan sur /studio
- `sitemap.xml` auto via `@astrojs/sitemap`
- `robots.txt` propre
- Balises `hreflang` si bilingue envisagé (à confirmer)
- Canonical systématique
- Open Graph + Twitter Cards custom par page (pas de fallback générique)

### Sémantique & mots-clés

Mots-clés prioritaires à travailler dans les contenus (à intégrer naturellement, pas de bourrage) :

- Principaux : "designer végétal", "biophilic design France", "jardin d'intérieur sur mesure", "mur végétal", "aménagement végétal haut de gamme"
- Longue traîne : "designer végétal [ville]", "créateur jardin intérieur hôtel", "aménagement biophilique bureau", "paysagiste designer"
- Géo-ciblage : à confirmer selon zone d'intervention de Jonathan (Brive-la-Gaillarde, Paris, Limousin, Nouvelle-Aquitaine, national ?)

### Contenus SEO

- 5 pages services optimisées (1 H1, hiérarchie Hn propre, 600-1000 mots chacune)
- 3 articles de blog fondateurs (pillars) : "Qu'est-ce que le design biophilique", "Comment choisir les plantes d'un jardin d'intérieur", "Bénéfices d'un aménagement végétal en entreprise"
- Page contact avec FAQ schema
- Alt texts descriptifs sur toutes les images (décrire la plante, le projet, le lieu)

### Local SEO

- Fiche Google Business Profile à lier (Jonathan doit en créer une si pas déjà)
- NAP (Nom, Adresse, Téléphone) cohérent partout
- Schema `LocalBusiness` avec `areaServed`

---

## 📱 Responsive & accessibilité

- Mobile-first strict, testé sur iPhone SE (petite largeur) et iPhone 16 Pro Max
- Touch targets ≥ 44px
- Menu mobile : drawer full-screen avec transitions soignées, pas un burger fade-in cheap
- Tous les interactifs clavier-accessibles, focus rings visibles mais stylés
- Contraste WCAG AA minimum, AAA sur le texte courant
- `prefers-reduced-motion` respecté : toutes les animations désactivables
- `prefers-color-scheme` : évaluer si dark mode pertinent (pas obligatoire pour un site éditorial crème, peut nuire au parti pris)
- Navigation au clavier fluide, skip links présents
- Alt texts, aria-labels, landmarks propres

---

## 📝 Sanity CMS — Schemas à créer

```typescript
// schemas/project.ts
- title (string, required)
- slug (slug, required)
- client (string)
- location (string)
- year (number)
- category (reference → category : 'interieur' | 'exterieur' | 'pro' | 'particulier')
- coverImage (image with hotspot, required)
- gallery (array of images with captions)
- twinmotionVideo (file, optional)
- modelUrl (url or file, optional — pour GLB)
- scrollFrames (array of images, optional — pour pipeline Twinmotion frame-sequence)
- description (portable text, rich)
- challenge (portable text)
- solution (portable text)
- outcomeStats (array de stats : m² traités, nb de plantes, durée projet)
- featured (boolean, pour home)
- seoTitle, seoDescription, ogImage

// schemas/service.ts
- title, slug, icon, shortDescription
- fullContent (portable text), pricing range (optional), ctaLabel
- relatedProjects (array of references)

// schemas/article.ts
- title, slug, excerpt, coverImage, author, publishedAt, readingTime
- content (portable text avec embeds custom : image, quote, gallery, video)
- tags, seo

// schemas/siteSettings.ts (singleton)
- siteName, tagline, logo, defaultOg
- contact : email, phone, address, social links
- legal : siret, mentions, cgv

// schemas/testimonial.ts
- quote, author, role, company, avatar, associatedProject
```

Portable Text custom blocks : image légendée, citation stylée, galerie inline, vidéo embed.

---

## 🔐 Formulaire de contact qualifié

Champs :

1. Nom / Prénom
2. Email / Téléphone
3. Type de projet (select : résidentiel intérieur / résidentiel extérieur / professionnel / autre)
4. Surface approximative (select par tranches)
5. Budget envisagé (select par tranches — qualifie les leads, filtre les curieux)
6. Date souhaitée
7. Message libre
8. Upload optionnel (plans, photos du lieu) — max 10 Mo, max 3 fichiers

**Validation** : Zod côté client + serveur. Astro Actions avec anti-spam Turnstile (Cloudflare, gratuit, pas Recaptcha). Envoi via Resend à l'adresse de Jonathan + email de confirmation automatique au prospect (template soigné, pas un mail de système cheap).

**RGPD** : case à cocher consentement, lien politique de confidentialité, mention finalité et durée de conservation.

---

## ⚡ Performance — critères de validation

- **Lighthouse** (mobile, throttled) : Performance ≥ 90, Accessibility ≥ 95, Best Practices = 100, SEO = 100
- **PageSpeed Insights** réel : toutes les métriques dans le vert
- Bundle JS initial < 80 Ko compressé (hors 3D, qui doit être lazy-loadé par page)
- Pas de CLS sur aucune page
- 3D : skeleton/loader pendant chargement, jamais de saut de layout
- Images : toujours en AVIF + fallback WebP, dimensions explicites, lazy (sauf LCP)

---

## 📦 Livrables attendus

1. Codebase Astro propre, commentée en français, commits sémantiques conventionnels
2. README complet : installation, dev, build, déploiement, structure Sanity, procédure ajout projet
3. Guide d'utilisation Sanity (PDF ou page Notion) à destination de Jonathan, avec captures
4. Checklist pré-lancement (redirections 301 depuis ancien site, GSC, sitemap soumis, etc.)
5. Documentation du pipeline 3D/Twinmotion (comment exporter correctement depuis ses outils)
6. Fichiers source des assets si créés (SVG logo retouché, noise texture, etc.)

---

## 🚀 Ordre de développement suggéré

1. **Fondations** : init Astro, Tailwind, structure dossiers, design tokens, composants de base (Button, Link, Container, Typography)
2. **Sanity** : schemas, studio, données de seed (2-3 projets factices)
3. **Layout global** : header, footer, navigation mobile, View Transitions
4. **Page d'accueil sans 3D** d'abord, version 2D animée complète
5. **Page projet détaillée** (template), avec une vraie data
6. **Page portfolio** (liste filtrable)
7. **Pages services, studio, contact**
8. **Blog** (liste + article)
9. **Intégration 3D hero** (R3F + feuillage animé)
10. **Pipeline Twinmotion scroll-frames** sur une page projet pilote
11. **Audit perf + SEO + accessibilité**, itérations
12. **Contenu réel** (remplacement des placeholders par données Jonathan)
13. **Tests cross-device, cross-browser**
14. **Déploiement Vercel** + configuration domaine + redirections 301

---

## ⚠️ Points d'attention critiques

- **Ne jamais charger Three.js sur les pages qui n'en ont pas besoin**. Splittage par route obligatoire.
- **Prefetch intelligent** : précharger la page projet au hover sur la carte du portfolio.
- **Fallbacks partout** : si WebGL indispo, si reduced-motion activé, si connexion lente — toujours une expérience qui reste premium.
- **Le site ne doit JAMAIS faire "site d'agence web 2020"** avec transitions clichés (fade-in standard, hover scale 1.05 partout). Cherche la singularité.
- **Le premium vient de la retenue** : une animation juste, bien timée, vaut mille effets. En cas de doute, enlève.
- **Tester sur vrai mobile milieu de gamme** (pas seulement DevTools), pas juste iPhone pro.

---

## 🎯 Critères de succès final

Quand le site est livré, il doit :

1. Donner envie à un architecte d'intérieur parisien haut de gamme de contacter Jonathan dans les 60 secondes
2. Être partagé spontanément sur LinkedIn / Instagram pour son esthétique
3. Ranker top 3 sur "designer végétal [zone]" sous 6 mois post-lancement
4. Avoir un taux de conversion formulaire ≥ 3% (benchmark premium craft)
5. Être une référence qu'on pourrait montrer sur Awwwards / CSSDA

---

**Commence par me confirmer que tu as bien lu l'ensemble du brief, puis propose-moi ton plan d'exécution détaillé avant d'écrire la moindre ligne de code.** Questionne-moi sur les zones d'ombre (format 3D exact disponible, zone géographique d'intervention, timeline, etc.) avant de démarrer.
