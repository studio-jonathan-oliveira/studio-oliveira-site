# Setup unique — puis plus aucune maintenance

> Écrit le 12 août 2026. Objectif : **une seule connexion à Vercel**, après quoi tout
> se déploie tout seul et Morgan n'a plus besoin du compte de Jonathan.
> Contexte : le projet appartient à l'équipe OLIVEIRA, Morgan n'en est pas membre, et
> l'ajouter demanderait un abonnement Pro — écarté.

**Conséquence actuelle :** tout déploiement déclenché par un commit de Morgan est refusé
par Vercel (« not a member of this team ») et compté comme un échec, ce qui envoie un mail
à Jonathan. Les corrections SEO fusionnées dans `main` ne sont donc **pas en ligne**.

---

## Ce qui rend le « zéro maintenance » possible

Un **Deploy Hook** est une URL secrète appartenant au projet Vercel, pas à un utilisateur.
Un `POST` dessus déclenche un déploiement. Comme elle n'est rattachée à aucun compte
GitHub, elle échappe au contrôle d'appartenance à l'équipe.

Une seule URL sert **trois usages** :

1. **GitHub Actions** — tout push sur `main` déploie (`.github/workflows/vercel-deploy.yml`)
2. **Sanity** — Jonathan publie du contenu, le site se reconstruit seul
3. **Manuel** — `./scripts/deploy.sh` depuis la machine de Morgan

Le point 2 était déjà prévu dans `deploiement-sanity.md` §A.6 mais jamais mis en place.
Sans lui, le site étant statique, **toute publication de Jonathan resterait invisible**
jusqu'à un déploiement manuel.

---

## Étape 0 — Avant de se connecter à Vercel (Morgan seul, ~5 min)

Faire ça **d'abord** : ça évite d'avoir à créer une variable d'environnement côté Vercel,
et donc de devoir y retourner.

1. [search.google.com/search-console](https://search.google.com/search-console)
   → _Ajouter une propriété_ → **Préfixe d'URL** → `https://www.studiojonathanoliveira.fr`
2. Méthode de validation : choisir **Fichier HTML** (et non la balise meta).
   Google fournit un fichier nommé `googleXXXXXXXX.html`.
3. Déposer ce fichier dans **`public/`** à la racine du dépôt, committer, pousser sur `main`.
   Il sera servi à `https://www.studiojonathanoliveira.fr/googleXXXXXXXX.html`.

_Ne pas cliquer sur « Valider » tout de suite : le fichier ne sera en ligne qu'après
l'étape 1.5._

> **Pourquoi le fichier plutôt que la balise meta ?** La balise passe par la variable
> `PUBLIC_GOOGLE_SITE_VERIFICATION`, qui ne se pose que dans Vercel. Le fichier se dépose
> par un commit. Une dépendance de moins au compte de Jonathan.
> Le support de la balise reste câblé dans `BaseLayout.astro` si besoin un jour.

---

## Étape 1 — La session Vercel unique (compte Jonathan, ~10 min)

À faire d'une traite. Tout ce qui suit est dans **Vercel → le projet**.

**1.1 — Créer le Deploy Hook**
_Settings_ → _Git_ → _Deploy Hooks_ → **Create Hook**

- Nom : `auto-deploy`
- Branche : `main`
  → **Copier l'URL générée et la mettre de côté.** Elle ne sera plus réaffichable en clair
  plus tard sans en recréer une.

**1.2 — Vérifier la protection anti-bot**
_Settings_ → _Firewall_ (ou _Security_) → **Attack Challenge Mode** doit être **désactivé**.
S'il est actif, il challenge Googlebot et rend toute indexation impossible.
_(Constaté désactivé le 12/08, mais à reconfirmer pendant qu'on y est.)_

**1.3 — Confirmer la nature des échecs**
_Deployments_ → ouvrir un déploiement en échec. Vérifier qu'il s'agit bien d'un refus
d'autorisation (« not a member of this team ») et non d'une erreur de build.
**Noter depuis quelle date** ces échecs apparaissent : s'ils sont antérieurs au 12/08,
le site ne se déployait plus depuis un moment, ce qui expliquerait l'absence d'indexation.

**1.4 — Relever les variables d'environnement existantes**
_Settings_ → _Environment Variables_. Photographier la liste des **noms** (pas les
valeurs). Sert à savoir ce qui est déjà en place : `PUBLIC_SANITY_PROJECT_ID`,
`SANITY_API_TOKEN`, `RESEND_*`, `PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`,
`PUBLIC_SITE_URL`. **Vérifier que `PUBLIC_SITE_URL` vaut bien
`https://www.studiojonathanoliveira.fr`** — si elle porte l'ancien domaine, la corriger,
c'est le même bug que celui trouvé dans la CI.

**1.5 — Déclencher un déploiement**
_Deployments_ → le plus récent → menu `···` → **Redeploy**.
Déclenché par un membre de l'équipe, il passe forcément. Met en ligne les corrections SEO
**et** le fichier de validation Google de l'étape 0.

**1.6 — Réduire les mails d'échec (optionnel, confort de Jonathan)**
_Settings_ → _Notifications_ : baisser les alertes de déploiement en échec.

---

## Étape 2 — Sanity (Morgan, navigateur, ~2 min)

[sanity.io/manage](https://www.sanity.io/manage) → le projet → _API_ → **Webhooks** →
_Create webhook_ :

- URL : l'URL du Deploy Hook de l'étape 1.1
- Dataset : `production`
- Trigger on : _Create_, _Update_, _Delete_

→ Jonathan publie, le site se reconstruit seul. **C'est ce qui supprime l'essentiel de la
maintenance.**

---

## Étape 3 — GitHub (Morgan seul, ~2 min)

1. _Settings_ → _Secrets and variables_ → _Actions_ → **New repository secret**
   - Nom : `VERCEL_DEPLOY_HOOK_URL`
   - Valeur : l'URL du Deploy Hook
2. Fusionner la branche **`feat/deploy-hook`** (workflow + script de déploiement).
3. Tester : onglet _Actions_ → _Déploiement Vercel_ → **Run workflow**.
   Un déploiement doit apparaître dans Vercel.

À partir de là, tout push sur `main` déploie automatiquement.

---

## Étape 4 — Terminer Search Console (Morgan seul, ~10 min)

1. Search Console → **Valider** (le fichier est maintenant en ligne)
2. _Sitemaps_ → soumettre `sitemap-index.xml`
3. _Inspection d'URL_ → l'accueil → **Tester l'URL en direct**
   → seul test qui montre ce que **Googlebot** voit réellement
4. **Demander une indexation** : accueil, puis `/zones/brive-la-gaillarde`
5. [Bing Webmaster Tools](https://www.bing.com/webmasters) → import direct depuis
   Search Console. Bing alimente Copilot et ChatGPT Search.

---

## Vérification finale

```bash
curl -s https://www.studiojonathanoliveira.fr/robots.txt | grep -i sitemap
# attendu : Sitemap: https://www.studiojonathanoliveira.fr/sitemap-index.xml

curl -s https://www.studiojonathanoliveira.fr/zones/brive-la-gaillarde \
  | grep -oic "conception paysag"
# attendu : 4   (0 = le déploiement n'est pas passé)
```

---

## Ce qui nécessitera encore Vercel un jour

À dire honnêtement plutôt que de laisser croire à une indépendance totale :

- **Changer une variable d'environnement** (rotation du token Sanity, clés Resend ou
  Turnstile). Rare, mais impossible autrement.
- **Lire les logs quand un build échoue.** Le hook déclenche le déploiement mais ne montre
  pas pourquoi il casse. En cas d'échec, il faudra les yeux de Jonathan — ou un accès.
- **Changer le domaine.**

Pour tout le reste — code, contenu, référencement — le setup ci-dessus suffit.

---

## Ce qu'il ne faut pas faire

- **Ne jamais committer l'URL du Deploy Hook.** Quiconque la détient peut déclencher un
  déploiement. Elle vit dans les secrets GitHub et dans le webhook Sanity, nulle part
  ailleurs.
- **Ne pas rendre le dépôt public** pour contourner le problème d'équipe : `_brief/`
  contient la grille tarifaire et l'analyse stratégique de Jonathan.
