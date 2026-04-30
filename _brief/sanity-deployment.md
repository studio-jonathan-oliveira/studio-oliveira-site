# Déploiement Sanity Studio — procédure

> Procédure pour activer le CMS Sanity sur le site Studio J Oliveira.
> À exécuter UNE FOIS par Morgan, après quoi Jonathan peut éditer en autonomie.

**Dernière mise à jour** : 2026-04-30 — schemas alignés sur le contenu hardcodé actuel.

---

## État de préparation (côté code)

Tout est prêt côté code, sauf l'install des deps et la création du projet Sanity :

- ✅ Schemas Sanity écrits (`sanity/schemas/*.ts`) — 11 types
- ✅ Config studio (`sanity.config.ts`, `sanity.cli.ts`) à la racine
- ✅ Client Sanity dans Astro (`src/lib/sanity.ts`) avec fallback gracieux
- ✅ Queries GROQ (`src/lib/queries.ts`) — 12 queries
- ✅ Script de seed (`scripts/sanity-seed.ts`) qui pousse le contenu hardcodé existant
- ✅ Scripts npm dans `package.json` : `studio:dev`, `studio:build`, `studio:deploy`, `sanity:seed`
- ⚠️ Deps `sanity` + `@sanity/vision` ajoutées au package.json mais pas encore installées (à faire : `pnpm install`)
- ❌ Projet Sanity pas encore créé sur sanity.io
- ❌ `PUBLIC_SANITY_PROJECT_ID` pas encore défini dans `.env`

---

## Procédure complète (~15 min)

### 1. Installer les deps Sanity (Morgan, 1 min)

```bash
pnpm add sanity @sanity/vision styled-components
```

Ajoute `sanity` (CLI + Studio React), `@sanity/vision` (debug GROQ) et
`styled-components` (peer dependency Sanity v3+).

> Note : ces deps ont été initialement ajoutées au `package.json` puis retirées
> car Vercel rebuild échouait avec `pnpm install` (versions à arbitrer au
> moment de l'install effective). Les ajouter manuellement résout le pin.

### 2. Créer le projet Sanity (Morgan, 2 min)

```bash
pnpm dlx sanity@latest init --create-project "Studio J Oliveira" --dataset production
```

L'assistant te demandera :

- Login (email Google ou GitHub) — à faire avec un compte Morgan, on le transférera à Jonathan plus tard via les permissions
- Confirmation du nom de projet : `Studio J Oliveira`
- Confirmation du dataset : `production`
- Output template : choisir `Clean project with no predefined schemas` (les schemas sont déjà là)

Le CLI va afficher le **`projectId`** (format : 8 caractères alphanumériques, ex `abc12345`).

### 3. Configurer `.env` (Morgan, 1 min)

Dans `.env` (et dans Vercel → Settings → Environment Variables) :

```env
PUBLIC_SANITY_PROJECT_ID=<projectId-recupere-etape-2>
PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=<token-genere-etape-4>
```

### 4. Générer un API token (Morgan, 1 min)

Aller sur https://www.sanity.io/manage → projet "Studio J Oliveira" → API → Tokens.

Créer un token :

- Nom : `seed-and-build`
- Permissions : **Editor** (suffit pour le seed et le build SSG)
- Copier le token, le coller dans `.env` (`SANITY_API_TOKEN`) et dans Vercel.

### 5. Configurer CORS (Morgan, 1 min)

Toujours dans sanity.io/manage → API → CORS Origins, ajouter :

- `http://localhost:3333` (studio dev)
- `http://localhost:4321` (Astro dev)
- `https://www.jonathanoliveira.fr` (prod)
- `https://studio-oliveira-site.vercel.app` (preview Vercel)
- `https://studio-oliveira.sanity.studio` (studio déployé, après étape 7)

Cocher "Allow credentials" sur chacun.

### 6. Pousser le contenu initial (Morgan, 30 sec)

```bash
pnpm sanity:seed
```

Importe dans Sanity :

- 1 doc `siteSettings` (NAP, contact, légal, horaires)
- 4 docs `typology` (Micro-urbain, Cœur urbain, Frange urbaine, Domaines & Caractère)
- 5 docs `service` (verticales pro : hôtellerie, resto, bureaux, commerces, Airbnb)
- 3 docs `location` (Brive, Bordeaux, Limoges) avec FAQ, climat, communes voisines, références aux typologies

Idempotent (`createOrReplace`). **Ne PAS relancer après que Jonathan ait commencé à éditer**, sinon écrasement.

### 7. Lancer le studio en local (Morgan, 30 sec)

```bash
pnpm studio:dev
```

Ouvre `http://localhost:3333`. Tu dois voir :

- Paramètres du site (singleton, déjà rempli)
- 4 typologies pré-remplies
- 5 verticales pro
- 3 zones d'intervention avec FAQ et essences

Vérifier que tout est OK, ajouter quelques images de couverture si tu veux.

### 8. Déployer le studio (Morgan, 1 min)

```bash
pnpm studio:deploy
```

Le CLI demande un `studioHost` (défaut `studio-oliveira` configuré dans `sanity.cli.ts`). Le studio sera disponible sur :

```
https://studio-oliveira.sanity.studio
```

Donner cette URL à Jonathan. Il se connectera avec son email (à inviter en étape 9).

### 9. Inviter Jonathan en éditeur (Morgan, 1 min)

sanity.io/manage → projet → Members → Invite member :

- Email : `jonathan.oliveira@…` (à confirmer avec lui)
- Rôle : **Editor** (peut éditer le contenu mais pas changer la structure ni les permissions)

Jonathan reçoit un mail, clique, accède au studio.

### 10. Tutoriel Jonathan (Morgan, à planifier)

Loom ou doc vidéo ~10 min couvrant :

- Login studio
- Modifier le NAP / contact (siteSettings)
- Modifier le texte d'une zone (Brive par exemple)
- Ajouter un projet de réalisation avec photos
- Publier un article de journal
- Workflow Drafts → Publish

---

## Webhook Vercel rebuild (à faire après que tout est en ligne)

Pour que les modifs Jonathan déclenchent un rebuild automatique du site (sinon il faut attendre le prochain `pnpm build`) :

1. Vercel → Project → Settings → Git → Deploy Hooks → Create Hook (ex `sanity-content-update`, branch `main`).
2. Copier l'URL du hook.
3. sanity.io/manage → API → Webhooks → Create Webhook :
   - Name : `Vercel rebuild on publish`
   - URL : (URL du hook Vercel)
   - Trigger on : `Create`, `Update`, `Delete`
   - Filter : `_type in ["siteSettings", "typology", "service", "project", "article", "author", "location", "testimonial"]`
   - Secret : générer une clé aléatoire, la mettre aussi dans `.env` (`SANITY_WEBHOOK_SECRET`)

Délai entre publish dans Sanity et site live : ~30 secondes (build Vercel).

---

## Migration du contenu hardcodé vers Sanity (Phase 5)

Une fois Sanity actif et Jonathan validé :

- Remplacer les imports `src/data/zones-content.ts` par des queries `locationBySlugQuery`
- Remplacer les imports `src/lib/site-config.ts` par `siteSettingsQuery`
- Garder `site-config.ts` comme fallback dev jusqu'à confirmation que tout passe en prod
- Supprimer les data hardcodées une fois la prod stable depuis 2 semaines

---

## Coûts

Plan **Free** Sanity suffit largement :

- 3 utilisateurs (Morgan + Jonathan + 1 backup)
- 10 GB d'assets (bien plus qu'il n'en faut)
- 100k API requests / mois (largement OK avec build SSG + cache CDN)
- Datasets illimités

Si on dépasse un jour : plan Growth à 99 $/mois (improbable avant 50k visiteurs uniques / mois).

---

## Notes techniques

- **Singleton siteSettings** : `__experimental_actions: ['update', 'publish']` empêche la création de docs multiples. Plus la config `templates` dans `sanity.config.ts` qui retire `siteSettings` du menu "create new".
- **Schemas alignés** : `location` a été aligné sur la structure `src/data/zones-content.ts` (champs : `ville`, `villeSimple`, `departement`, `codeDepartement`, `role`, `h1`, `introLead`, `introLong`, `climatType`, `climatDescription`, `caracteristiquesPaysageres`, `essences`, `communesVoisines`, `typologiesDominantes` (référence), `faq`, `seo`).
- **References** : les typologies dominantes des zones pointent vers les docs `typology` via `_ref`. Le seed crée d'abord les typologies puis les locations pour que les références soient résolues.
