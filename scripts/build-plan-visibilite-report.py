"""Build Studio J Oliveira visibility plan report — composed visual PDF.

Génère le PDF compagnon à `Etude-Marche-Studio-Oliveira.pdf` : un guide
opérationnel détaillé du plan visibilité, structuré canal par canal, avec
checklists, séquences, modèles génériques (à variables) et KPIs concrets.

Même DA que le rapport étude de marché — noir / cream / rouge signature,
Fraunces + Inter + JetBrains Mono. Cohérence visuelle du set documentaire.

Usage : python3 scripts/build-plan-visibilite-report.py
Deps  : weasyprint, markdown (pip install).
Sortie: _brief/etude-de-marche/Plan-Visibilite-Studio-Oliveira.pdf
"""

from __future__ import annotations

import sys
from pathlib import Path

from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration


ROOT = Path(__file__).parent.parent
OUT_PDF = ROOT / "_brief" / "etude-de-marche" / "Plan-Visibilite-Studio-Oliveira.pdf"
OUT_HTML = ROOT / "_brief" / "etude-de-marche" / "_export-visibilite.html"

TOTAL_PAGES = "18"


# ============================================================================
# DATA — pricing par typologie + CAC max calculé via règle 10 % du ticket
# ============================================================================

PRICING_GRID = [
    {"typo": "Micro-urbain",         "ticket": "1 200 €",        "cac_max": "120 €",  "leads_breakeven": "1 lead / 120 € pub"},
    {"typo": "Cœur urbain",          "ticket": "2 800 €",        "cac_max": "280 €",  "leads_breakeven": "1 lead / 280 € pub"},
    {"typo": "Frange urbaine",       "ticket": "4 250 €",        "cac_max": "425 €",  "leads_breakeven": "1 lead / 425 € pub"},
    {"typo": "Domaines & Caractère", "ticket": "6 500 €",        "cac_max": "650 €",  "leads_breakeven": "1 lead / 650 € pub"},
]

# 5 canaux gratuits permanents
PERMANENT_CHANNELS = [
    {
        "icon": "01",
        "name": "Google Business Profile",
        "objective": "Visibilité locale + autorité Maps",
        "effort": "4 h initial puis 30 min/sem",
        "freq": "1 post / sem · 5 photos / mois",
        "kpi": "Note ≥ 4★ · 10 avis Mois 3",
    },
    {
        "icon": "02",
        "name": "Instagram organique",
        "objective": "Notoriété DA + portfolio vivant",
        "effort": "5 h / sem (création + planif)",
        "freq": "3 posts / sem + 5 stories / sem",
        "kpi": "+ 50 followers qualifiés / mois",
    },
    {
        "icon": "03",
        "name": "Cold mail prescripteurs",
        "objective": "Pipeline B2B + agences immo",
        "effort": "4 h / sem (recherche + rédac)",
        "freq": "10 mails personnalisés / sem",
        "kpi": "Taux réponse ≥ 15 % · 1-2 RDV / mois",
    },
    {
        "icon": "04",
        "name": "Témoignages clients",
        "objective": "Preuve sociale + autorité",
        "effort": "6 h initial (récolte) + 2 h/trim",
        "freq": "1 nouveau témoignage / trim min.",
        "kpi": "5 témoignages publiés au Mois 6",
    },
    {
        "icon": "05",
        "name": "Référencement croisé partenaires",
        "objective": "Backlinks SEO + bouche-à-oreille",
        "effort": "1 h / partenaire",
        "freq": "Activer à chaque nouveau partenaire",
        "kpi": "10 backlinks qualitatifs Mois 6",
    },
]

# GBP checklist détaillée
GBP_CHECKLIST = [
    ("Création / revendication fiche", "Catégorie principale : Architecte paysagiste · Secondaires : Designer · Cabinet d'études", "1 h"),
    ("Photos pro upload", "20 photos initiales : 8 chantiers livrés (avant/après) · 4 portraits Jonathan en action · 4 détails de matières/végétal · 4 visuels Twinmotion", "2 h"),
    ("Description structurée", "150 mots : positionnement biophilique + 4 typologies + zone d'intervention SO + Twinmotion", "30 min"),
    ("Services listés", "Architecture paysagère · Étude paysagère · Conception jardin · Rendu Twinmotion · Suivi de chantier — 1 ligne descriptive chacun", "30 min"),
    ("Horaires + zone d'intervention", "Lun-ven 9h-18h · Zone : Brive 50 km + Bordeaux + Bassin + Côte Basque + Périgord", "10 min"),
    ("Posts hebdo programmés", "1 post / sem : alterner — photo chantier · plante du mois · process · témoignage client", "15 min / sem"),
    ("Backlinks initiaux (10)", "Architectes partenaires · hôtels clients · réseau Chambre Métiers · Studio site web · LinkedIn perso", "3 h"),
    ("Avis clients sollicités", "Demander à 5-10 anciens clients (mail personnel + lien direct) — viser 5 avis au Mois 3", "1 h"),
]

# Instagram : calendrier 4 semaines + templates posts
INSTA_WEEK = [
    ("Lundi",    "Photo chantier livré",     "Avant/après slider · Lieu · 2 lignes verbe Jonathan · 6 hashtags géo + 4 typo"),
    ("Mardi",    "—",                         "Repos algorithme (pas de post)"),
    ("Mercredi", "Plante du mois / matière", "Macro photo · 3 lignes botanique · usage chez Studio · 4-5 hashtags niche"),
    ("Jeudi",    "—",                         "Repos algorithme"),
    ("Vendredi", "Process / coulisses",      "Carrousel 4-6 slides · esquisse → Twinmotion → réalisé · ton documentaire"),
    ("Samedi",   "Story réelle (24h)",       "Photo brute terrain + sticker localisation + question stickers (engagement)"),
    ("Dimanche", "—",                         "Repos"),
]

INSTA_HASHTAGS = [
    ("Géo Brive + Corrèze",    "#paysagistebrive #correze #brivelagaillarde #jardincorreze"),
    ("Géo Bordeaux + Bassin",  "#paysagistebordeaux #jardincapferret #pylasurmer #arcachon #bordeauxgironde"),
    ("Géo Côte Basque",        "#paysagistebiarritz #jardinbiarritz #cotebasque #paysbasque"),
    ("Géo Périgord",           "#paysagisteperigord #jardinsarlat #dordogne #perigordnoir"),
    ("Typologie & marque",     "#designerpaysagiste #biophilique #architecturepaysagere #studiodoliveira"),
    ("Process / méta",         "#twinmotion #avantapres #jardinsurmesure #paysagepremium"),
]

# Cold mail : structure type + séquence 3 touches
COLD_MAIL_STRUCTURE = [
    {"n": "01", "section": "Objet (≤ 60 caractères)", "rule": "Concret + personnalisé. Pas de mots-clés \"opportunity\", \"partenariat\", \"collaboration\".", "ex": "Studio J Oliveira — proposition pour vos mandats > 1,2 M€"},
    {"n": "02", "section": "Accroche (1-2 lignes)",   "rule": "Référence précise à l'interlocuteur (un mandat récent, un article, une exposition).", "ex": "J'ai vu votre mandat récent à [QUARTIER] — [DÉTAIL OBSERVÉ DU JARDIN]."},
    {"n": "03", "section": "Proposition (3-4 lignes)", "rule": "Une seule offre. Quantifiée (durée, prix). Bénéfice client direct.", "ex": "Je propose à vos mandats premium une étude paysagère + 4 vues Twinmotion (4-6 sem., à partir de [PRIX]) en option valeur ajoutée."},
    {"n": "04", "section": "Preuve (1-2 lignes)",     "rule": "Un cas client réel ou un fait mesurable. Pas de \"nous sommes leader\".", "ex": "Récemment livré pour [CLIENT TYPE] — visuel ci-joint."},
    {"n": "05", "section": "Call-to-action (1 ligne)", "rule": "Demande unique, claire, sans pression.", "ex": "Êtes-vous dispo 20 min en visio la semaine du [DATE] ?"},
    {"n": "06", "section": "Signature",                "rule": "Nom + rôle + site + tel direct. Pas de fonction \"PDG\" (over-claim).", "ex": "Jonathan Oliveira · Designer paysagiste · studio-oliveira.fr · 05 XX XX XX XX"},
]

COLD_MAIL_SEQUENCE = [
    ("J+0",  "Touche 1 — Mail initial structuré (6 sections ci-contre)",                  "Taux ouverture attendu : 40-60 %"),
    ("J+5",  "Touche 2 — Relance courte (3 lignes) : \"je remonte ce mail au cas où\"",   "Taux ouverture cumulé : 60-75 %"),
    ("J+14", "Touche 3 — Relance valeur : 1 lien article ou cas client. Ferme la séquence.", "Taux réponse cumulé cible : ≥ 15 %"),
]

# Dossier presse — structure 4 pages A4
PRESS_KIT_STRUCTURE = [
    ("Page 1", "Cover éditoriale",           "Photo iconique (1 chantier livré pleine page) + titre + sous-titre + studio name + contact"),
    ("Page 2", "Le Studio en 4 chiffres",    "1 portrait Jonathan + bio 100 mots + 4 KPIs (zone, typologies, ans d'expérience, signature Twinmotion)"),
    ("Page 3", "1 cas client illustré",      "3-5 photos + Twinmotion · 200 mots verbe Jonathan · résultats · contact client si autorisé"),
    ("Page 4", "Contact + lectures",         "Coordonnées · liens cas clients sur site · 3 dates récentes (livraison, expo, presse) · invitation à pitcher"),
]

PRESS_TARGETS = [
    "AD France — Marie Kalt",
    "Maison & Jardin — Corine Allouch",
    "Maison Côté Sud (édition régionale)",
    "Elle Décoration — Danièle Gerkens",
    "Côté Maison",
    "Connaissance des Arts",
    "Le Figaro Magazine Propriétés",
    "Maison Côté Ouest",
    "Sud Ouest Magazine (régional)",
    "Côté Bordeaux (régional)",
    "La Maison de Bricolage (audiences HNW)",
    "Le Mag Maison & Jardin (Le Figaro)",
    "Marie Claire Maison",
    "Vivre Côté Paris",
    "Maison Madame Figaro",
]

# Niveau 1 — Boost Insta + Google Ads
LEVEL_1_BOOST_INSTA = [
    {"criteria": "Engagement organique ≥ 5 %",      "detail": "Liker/commenter rate > 5 % sur les 24h après publication = post à booster"},
    {"criteria": "Audience géo précise",            "detail": "Rayon 30 km autour de Bordeaux + 30 km Cap-Ferret + 30 km Biarritz + 25 km Sarlat. Excure les zones rurales."},
    {"criteria": "Centres d'intérêts ciblés",      "detail": "Décoration intérieur · Architecture · Voyages luxe · Hôtellerie · Vin & œnologie · Art contemporain"},
    {"criteria": "Tranche d'âge",                   "detail": "35-65 ans (acquéreurs HNW majoritaires)"},
    {"criteria": "Budget par boost",                "detail": "20-30 € / post boosté · 5-7 jours · 1 post boosté / sem"},
]

LEVEL_1_GADS_KEYWORDS = [
    ("Bordeaux + Bassin",      "designer jardin cap-ferret · paysagiste pyla · architecte paysagiste bordeaux", "EXACT match uniquement"),
    ("Côte Basque",            "designer paysagiste biarritz · architecte jardin biarritz",                       "EXACT match uniquement"),
    ("Périgord",               "paysagiste périgord · designer jardin sarlat",                                      "EXACT match uniquement"),
    ("Brive local",            "paysagiste brive · architecte paysagiste corrèze",                                 "EXACT + PHRASE match"),
]

LEVEL_1_GADS_RULES = [
    "PAS de mots-clés génériques (\"paysagiste\", \"jardinier\") — trop chers + faible intent",
    "Quality Score Google Ads ≥ 7 sur tous les mots-clés actifs (sinon couper)",
    "Pages d'atterrissage typologies dédiées (1 mot-clé = 1 landing)",
    "Conversion tracking : appel téléphonique + soumission formulaire contact",
    "Audit hebdomadaire les 4 premières semaines, mensuel après",
]

# Niveau 2 — Meta Ads + Newsletter
LEVEL_2_META_AUDIENCES = [
    {"name": "Audience 1 — HNW SO résidence secondaire",
     "size": "50-80 k personnes",
     "criteria": "Géo : Bordeaux + Bassin + Côte Basque + Périgord · CSP++ · intérêts : Sotheby's, Barnes, Christie's, Maison & Objet, AD, Connaissance des Arts · âge 40-70"},
    {"name": "Audience 2 — Lookalike clients",
     "size": "1 % France (~500 k)",
     "criteria": "Source : liste mail clients existants (min 100 contacts) · pays France · lookalike 1 % (similarité la plus forte)"},
    {"name": "Audience 3 — Retargeting visiteurs site",
     "size": "Tous visiteurs 90 j",
     "criteria": "Pixel installé sur le site Astro · exclusion : pages /contact et /demarrer-un-projet (déjà engagés) · fréquence cap 3 / sem"},
]

LEVEL_2_META_CREAS = [
    "Reels 15-30 s — flythrough Twinmotion d'un projet livré (musique douce, pas de voix)",
    "Carrousel 5-8 slides — avant/après chantier (slider sur 1ère image)",
    "Image fixe — quote client + photo livraison",
    "Story sponsorisée — visite immersive 60 s avec lien swipe-up vers /architecture-paysagere",
]

NEWSLETTER_SECTIONS = [
    ("01", "Photo hero du mois",   "1 chantier en cours ou livré · 2 lignes contexte"),
    ("02", "Édito Jonathan",       "300 mots verbe propre · sujet du mois (plante, technique, retour terrain)"),
    ("03", "Process en images",    "3-4 photos process · esquisse → Twinmotion → réalité"),
    ("04", "À voir / à lire",      "1 expo, 1 livre, 1 article (curation Studio)"),
    ("05", "CTA discret",          "Lien vers le site ou \"répondez-moi si vous voulez en discuter\""),
]

# Niveau 3 — Scale
LEVEL_3_RULES = [
    "Activation <strong>uniquement</strong> après 12 mois d'historique mesuré (CAC, conversion, ticket moyen confirmés)",
    "Règle d'allocation : à chaque mission signée, <strong>5-10 % du ticket</strong> réinjecté en acquisition le mois suivant",
    "Exemple — 2 missions × 4 250 € = 8 500 € CA → 425-850 € de pub réinjecté mois M+1",
    "Plafond budget pub mensuel ≤ revenu net moyen sur 3 mois glissants (jamais plus)",
    "Re-audit canaux trimestriel : couper ceux dont CAC dépasse 10 % du ticket de la typologie",
]

# KPIs à suivre — par fréquence
KPIS_WEEKLY = [
    ("Cold mails envoyés",          "10 / sem"),
    ("Taux ouverture cold mail",    "≥ 40 %"),
    ("Taux réponse cold mail",      "≥ 15 %"),
    ("Posts Insta publiés",          "3 / sem"),
    ("Engagement rate Insta",        "≥ 4 %"),
    ("Posts GBP publiés",            "1 / sem"),
]

KPIS_MONTHLY = [
    ("Leads qualifiés générés",      "1-3 (M1-3) · 3-5 (M4-12)"),
    ("CAC moyen (toutes typo)",      "< 10 % du ticket typologie"),
    ("RDV obtenus",                  "≥ 2 / mois"),
    ("Nouveaux followers Insta",     "+ 50 / mois"),
    ("Note Google moyenne",          "≥ 4,5 ★"),
    ("Nouveaux backlinks SEO",       "+ 2 / mois"),
]

KPIS_QUARTERLY = [
    ("Missions signées",             "2-3 / trim"),
    ("Pipeline en cours (k€)",       "≥ 25 k€ / trim"),
    ("Taux conversion lead → RDV",   "≥ 25 %"),
    ("Taux conversion RDV → mission","≥ 30 %"),
    ("Témoignages publiés",          "+ 1 / trim"),
    ("Mentions presse / partenariats", "≥ 1 / trim"),
]

# Stack outils recommandés
TOOLS_STACK = [
    {"cat": "SEO local",     "tool": "Google Business Profile",   "price": "Gratuit",          "why": "Indispensable. Premier point de contact local."},
    {"cat": "SEO local",     "tool": "Google Search Console",     "price": "Gratuit",          "why": "Monitoring indexation site + requêtes entrantes."},
    {"cat": "SEO local",     "tool": "Bing Webmaster Tools",      "price": "Gratuit",          "why": "Bing = 5 % de la recherche, audience plus âgée HNW."},
    {"cat": "Analytics",     "tool": "Plausible (déjà installé)", "price": "9 $ / mois",       "why": "RGPD-friendly, pas de bandeau cookie. Trafic + sources."},
    {"cat": "Email",         "tool": "Mailchimp",                  "price": "Gratuit ≤ 500",    "why": "Newsletter mensuelle. Bascule payant uniquement si > 500 contacts."},
    {"cat": "CRM léger",     "tool": "Notion ou Sheets",           "price": "Gratuit",          "why": "Pipeline prescripteurs · suivi séquence cold mail · KPIs."},
    {"cat": "Cold mail",     "tool": "Apollo.io (option payante)", "price": "49 $ / mois plan basique", "why": "Trouve mails direction + séquençage automatisé. Sinon Hunter.io en mode manuel."},
    {"cat": "Réseaux",       "tool": "LinkedIn Sales Navigator",   "price": "79 $ / mois (essai 30 j)", "why": "Trouve les bonnes personnes en agence immo luxe / architectes."},
    {"cat": "Design rapide", "tool": "Canva Pro",                  "price": "12 € / mois",      "why": "Posts Insta, stories, dossier presse mise en page rapide."},
    {"cat": "Visuels",       "tool": "Lightroom Mobile",           "price": "12 € / mois",      "why": "Retouche photos chantier sur smartphone, presets cohérents DA."},
]

# Anti-patterns — erreurs à éviter
ANTIPATTERNS = [
    {"n": "01", "no": "Mass mailing à 200 prescripteurs", "yes": "10 mails / sem ultra-personnalisés. Taux réponse 15 % > taux réponse 1 % sur masse."},
    {"n": "02", "no": "Booster un post sans audience géo", "yes": "Toujours rayon 30 km + intérêts précis. Sinon = 80 % du budget gaspillé."},
    {"n": "03", "no": "Google Ads sur \"paysagiste\" générique", "yes": "Que des mots-clés transactionnels à intent local (\"designer jardin Cap-Ferret\")."},
    {"n": "04", "no": "Skipper la collecte de témoignages", "yes": "3-5 témoignages écrits + autorisation photo dès Mois 1. Preuve sociale > argument."},
    {"n": "05", "no": "Poster sur Insta sans cohérence DA", "yes": "Grille visuelle homogène. Preset Lightroom unique. Brouille = perte de crédibilité."},
    {"n": "06", "no": "Lancer le Niveau 2 avant que le Niveau 1 prouve un ROI", "yes": "Discipline d'activation : Niveau N+1 seulement si Niveau N a généré ≥ 3 leads / 2 missions sur 3 mois."},
    {"n": "07", "no": "Ne pas mesurer CAC", "yes": "Tracking conversions Google Ads + Plausible + colonne CAC dans le pipeline Notion."},
    {"n": "08", "no": "Publier sans calendrier éditorial", "yes": "Calendrier mensuel pré-planifié. Évite l'improvisation et les trous de 3 semaines."},
]

# Calendrier visibilité 12 mois — par mois, action visibilité principale
VIZ_TIMELINE = [
    ("M1",  "Niveau 0 — Setup",   "Création GBP + audit Insta + sitemap GSC/Bing + dossier presse v1", "0 €"),
    ("M2",  "Niveau 0 — Cold mail", "10 mails / sem · liste 50 prescripteurs activée", "0 €"),
    ("M3",  "Niveau 0 — Témoignages", "Récolte 3-5 témoignages clients + publication site/LinkedIn", "0 €"),
    ("M4",  "Niveau 1 — Boost Insta", "Démarrage 4 boosts × 20-30 € · audience géo HNW SO", "≈ 100 €"),
    ("M5",  "Niveau 1 — Google Ads", "Activation 2 mots-clés EXACT match par zone prioritaire", "≈ 130 €"),
    ("M6",  "Bilan trimestriel #1", "Audit canaux · GO/NO-GO Niveau 2 · ajustement zones", "≈ 130 €"),
    ("M7",  "Niveau 2 — Meta Ads",  "Audiences 1+2+3 lancées · créas Twinmotion · 200-300 € / mois", "≈ 350 €"),
    ("M8",  "Niveau 2 — Newsletter",  "Première édition vers 200+ contacts · format 5 sections", "≈ 350 €"),
    ("M9",  "Niveau 2 — Google Ads élargi", "5-8 mots-clés / zone · A/B testing landings", "≈ 400 €"),
    ("M10", "Bilan trimestriel #2", "Pipeline annualisé visible · GO/NO-GO Niveau 3", "≈ 400 €"),
    ("M11", "Optimisation",         "Re-audit fréquences/budgets · couper canaux CAC > 10 %", "≈ 400 €"),
    ("M12", "Bilan annuel + plan Y2", "Préparation scale Niveau 3 conditionnelle · ROI par canal", "≈ 400 €"),
]

# Take-aways finaux
TAKEAWAYS_VIZ = [
    ("01", "Discipline d'activation", "Niveau N+1 seulement si Niveau N a généré ≥ 3 leads / 2 missions sur 3 mois. Pas d'escalade aveugle."),
    ("02", "Personnalisation > volume", "10 cold mails / sem ultra-ciblés battent 200 mails génériques. Toujours."),
    ("03", "CAC < 10 % du ticket",     "Règle d'or non-négociable. Si dépassé, on coupe le canal et on diagnostique."),
    ("04", "Canaux gratuits, jamais lâchés", "GBP · Insta · cold mail · témoignages · partenaires = socle permanent même Niveau 3."),
    ("05", "Mesurer ou ne pas dépenser", "Pas de tracking conversions = pas de pub. Plausible + Google Ads conversions + CRM Notion."),
    ("06", "Visibilité = patience",    "Premiers résultats organiques à Mois 3. Pic d'efficacité à Mois 9-12. Tenir la cadence."),
]


# ============================================================================
# CSS — réutilisation de la palette du rapport étude de marché + extensions
# ============================================================================

CSS_STYLES = r"""
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700;9..144,900&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --ink: #0a0a0a;
  --ink-soft: #2a2d28;
  --cream: #f5f1ea;
  --cream-warm: #ecdfd0;
  --cream-deep: #e3d8c5;
  --moss: #70725b;
  --moss-soft: #a8a995;
  --red: #ff0d00;
  --red-soft: rgba(255, 13, 0, 0.12);
  --rule: rgba(10, 10, 10, 0.12);
  --rule-strong: rgba(10, 10, 10, 0.42);
}

@page { size: A4; margin: 0; }
* { box-sizing: border-box; }

html, body {
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 10pt;
  line-height: 1.5;
  color: var(--ink);
  background: var(--cream);
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
}

.page {
  width: 210mm;
  height: 297mm;
  page-break-after: always;
  position: relative;
  overflow: hidden;
  background: var(--cream);
}
.page:last-child { page-break-after: auto; }
.page--ink { background: var(--ink); color: var(--cream); }
.page--cream { background: var(--cream); color: var(--ink); }
.page--warm  { background: var(--cream-warm); color: var(--ink); }

.page-head {
  position: absolute;
  top: 14mm; left: 16mm; right: 16mm;
  display: flex; align-items: baseline; justify-content: space-between;
  font-family: 'Inter', sans-serif;
  font-size: 7.5pt;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  font-weight: 500;
}
.page-head .crumb { color: var(--moss); }
.page--ink .page-head .crumb { color: var(--moss-soft); }
.page-head .num { font-family: 'JetBrains Mono', monospace; font-weight: 500; letter-spacing: 0; color: var(--ink); }
.page--ink .page-head .num { color: var(--cream); }

.page-foot {
  position: absolute;
  bottom: 12mm; left: 16mm; right: 16mm;
  display: flex; align-items: baseline; justify-content: space-between;
  font-family: 'Inter', sans-serif;
  font-size: 7pt;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--moss);
}
.page--ink .page-foot { color: var(--moss-soft); }
.page-foot .pnum { font-family: 'JetBrains Mono', monospace; letter-spacing: 0; }

.body {
  position: absolute;
  top: 26mm; left: 16mm; right: 16mm; bottom: 22mm;
}

.eyebrow {
  font-family: 'Inter', sans-serif;
  font-size: 7.5pt;
  font-weight: 600;
  letter-spacing: 2.4px;
  text-transform: uppercase;
  color: var(--red);
}
.eyebrow--moss { color: var(--moss); }
.eyebrow--ink  { color: var(--ink); }

.h1 {
  font-family: 'Fraunces', serif;
  font-weight: 400;
  font-size: 32pt;
  line-height: 1.04;
  letter-spacing: -0.015em;
  font-variation-settings: "opsz" 144;
}

.h2 {
  font-family: 'Fraunces', serif;
  font-weight: 400;
  font-size: 22pt;
  line-height: 1.1;
  letter-spacing: -0.01em;
  font-variation-settings: "opsz" 72;
}

.h3 {
  font-family: 'Fraunces', serif;
  font-weight: 500;
  font-size: 14pt;
  line-height: 1.2;
}

.lede {
  font-family: 'Fraunces', serif;
  font-weight: 300;
  font-size: 12pt;
  line-height: 1.4;
}

.body-text { font-size: 9pt; line-height: 1.55; }
.body-text strong { font-weight: 600; }

.italic { font-style: italic; }
.red { color: var(--red); }
.moss { color: var(--moss); }

/* ===== COVER ===== */

.cover {
  background: var(--ink);
  color: var(--cream);
  padding: 22mm 18mm;
  display: flex; flex-direction: column; justify-content: space-between;
  height: 297mm;
}
.cover__top {
  display: flex; justify-content: space-between;
  font-family: 'Inter'; font-size: 8pt; letter-spacing: 2px; text-transform: uppercase;
}
.cover__top .brand { font-weight: 600; color: var(--cream); }
.cover__top .ref { color: var(--moss-soft); font-family: 'JetBrains Mono', monospace; letter-spacing: 0; }

.cover__eyebrow {
  font-family: 'Inter'; font-size: 9pt; font-weight: 600;
  letter-spacing: 3px; text-transform: uppercase; color: var(--red);
  margin-bottom: 10mm;
}
.cover__title {
  font-family: 'Fraunces', serif;
  font-weight: 300;
  font-variation-settings: "opsz" 144;
  font-size: 60pt;
  line-height: 0.96;
  letter-spacing: -0.025em;
  color: var(--cream);
}
.cover__title .em { font-style: italic; color: var(--red); }
.cover__subtitle {
  font-family: 'Fraunces', serif; font-weight: 300; font-style: italic;
  font-size: 18pt; line-height: 1.3;
  color: var(--moss-soft); margin-top: 14mm; max-width: 145mm;
}
.cover__rule { width: 60mm; height: 1px; background: var(--red); margin-top: 16mm; }
.cover__meta {
  display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12mm;
  margin-top: 8mm;
  font-family: 'Inter'; font-size: 8.5pt; color: var(--cream);
}
.cover__meta .k {
  font-size: 7pt; letter-spacing: 2px; text-transform: uppercase;
  color: var(--moss-soft); margin-bottom: 2mm; font-weight: 500;
}
.cover__meta .v { font-weight: 500; line-height: 1.4; }
.cover__bottom {
  display: flex; justify-content: space-between;
  font-family: 'Inter'; font-size: 7.5pt; letter-spacing: 2px;
  text-transform: uppercase; color: var(--moss-soft);
}

/* ===== EXEC SUMMARY KPI ===== */

.kpi-row {
  display: grid; grid-template-columns: 1fr 1fr 1fr;
  border-top: 1px solid var(--ink); border-bottom: 1px solid var(--ink);
  padding: 6mm 0;
}
.kpi-cell { padding: 0 5mm; border-right: 1px solid var(--rule); }
.kpi-cell:last-child { border-right: none; }
.kpi-cell .k {
  font-family: 'Inter'; font-size: 7pt; letter-spacing: 2px;
  text-transform: uppercase; color: var(--moss); font-weight: 600;
  margin-bottom: 3mm;
}
.kpi-cell .v {
  font-family: 'Fraunces', serif;
  font-variation-settings: "opsz" 144;
  font-weight: 400;
  font-size: 30pt; line-height: 1;
  letter-spacing: -0.025em;
}
.kpi-cell .v.em { color: var(--red); }
.kpi-cell .legend {
  font-family: 'Inter'; font-size: 8.5pt; color: var(--ink);
  margin-top: 3mm; line-height: 1.4;
}

/* ===== PRICING GRID (CAC max par typologie) ===== */

.pricing {
  width: 100%; border-collapse: collapse;
  margin: 0;
  font-family: 'Inter';
  font-size: 9pt;
}
.pricing thead th {
  font-family: 'Inter'; font-size: 7.5pt; font-weight: 600;
  letter-spacing: 1.2px; text-transform: uppercase;
  color: var(--moss);
  padding: 0 0 3mm 0;
  border-bottom: 1px solid var(--ink);
  text-align: left;
}
.pricing tbody td {
  padding: 4mm 0;
  border-bottom: 0.5px solid var(--rule);
}
.pricing tbody td.typo {
  font-family: 'Fraunces', serif; font-size: 12pt; font-weight: 500;
}
.pricing tbody td.ticket {
  font-family: 'JetBrains Mono', monospace; font-weight: 500; font-size: 11pt;
}
.pricing tbody td.cac {
  font-family: 'JetBrains Mono', monospace; font-weight: 500; font-size: 11pt;
  color: var(--red);
}
.pricing tbody td.breakeven {
  font-family: 'Inter'; font-size: 8.5pt; color: var(--moss);
}

/* ===== CHANNEL CARDS (5 canaux gratuits) ===== */

.channel-card {
  display: grid;
  grid-template-columns: 16mm 1fr;
  gap: 5mm;
  padding: 4mm 0;
  border-bottom: 0.5px solid var(--rule);
  align-items: start;
}
.channel-card:last-child { border-bottom: none; }
.channel-card .icon {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18pt; font-weight: 500;
  color: var(--red);
  line-height: 1;
}
.channel-card .nm {
  font-family: 'Fraunces', serif; font-size: 14pt; font-weight: 500;
  line-height: 1.1; letter-spacing: -0.005em;
  margin-bottom: 2mm;
}
.channel-card .grid-meta {
  display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 4mm;
  font-family: 'Inter'; font-size: 8pt;
  line-height: 1.4;
}
.channel-card .grid-meta .lbl {
  font-size: 7pt; letter-spacing: 1.2px; text-transform: uppercase;
  font-weight: 600; color: var(--moss); margin-bottom: 1mm;
}

/* ===== CHECKLIST / NUMBERED ROWS ===== */

.steps {
  margin: 0; padding: 0;
}
.step {
  display: grid;
  grid-template-columns: 10mm 1fr 24mm;
  gap: 4mm;
  padding: 2.4mm 0;
  border-bottom: 0.5px solid var(--rule);
  align-items: start;
}
.step:last-child { border-bottom: none; }
.step .n {
  font-family: 'JetBrains Mono', monospace; font-size: 10pt; font-weight: 500;
  color: var(--red);
}
.step .body-step {
  font-family: 'Inter'; font-size: 9pt; line-height: 1.45;
}
.step .body-step .ttl {
  font-family: 'Fraunces', serif; font-size: 11.5pt; font-weight: 500;
  line-height: 1.2; margin-bottom: 1mm;
}
.step .body-step .desc { color: var(--ink); }
.step .effort {
  font-family: 'JetBrains Mono', monospace; font-size: 8pt;
  text-align: right; color: var(--moss); letter-spacing: 0;
  margin-top: 1mm;
}

/* ===== TABLE GÉNÉRIQUE LIGNES ===== */

.row {
  display: grid;
  grid-template-columns: 14mm 1fr 50mm;
  gap: 4mm;
  padding: 2.4mm 0;
  border-bottom: 0.5px solid var(--rule);
  align-items: start;
}
.row .k {
  font-family: 'JetBrains Mono', monospace; font-size: 9pt; font-weight: 500;
  color: var(--red);
}
.row .v {
  font-family: 'Inter'; font-size: 9pt; line-height: 1.4;
}
.row .v strong { font-weight: 600; }
.row .meta {
  font-family: 'JetBrains Mono', monospace; font-size: 8pt; color: var(--moss);
  text-align: right;
}

/* ===== CALLOUT ===== */

.callout {
  background: var(--cream-warm);
  padding: 4mm 5mm;
  margin: 2mm 0;
  border-left: 2px solid var(--red);
}
.callout .k {
  font-family: 'Inter'; font-size: 7pt; font-weight: 600;
  letter-spacing: 1.5px; text-transform: uppercase;
  color: var(--red); margin-bottom: 1.5mm;
}
.callout .v {
  font-family: 'Fraunces', serif; font-size: 11pt; line-height: 1.35;
}
.callout--ink {
  background: var(--ink); color: var(--cream);
}
.callout--ink .v { color: var(--cream); }
.callout--ink .k { color: var(--red); }

/* ===== COLD MAIL : structure 6 sections + séquence ===== */

.mail-section {
  display: grid;
  grid-template-columns: 10mm 1fr;
  gap: 4mm;
  padding: 2.2mm 0;
  border-bottom: 0.5px solid var(--rule);
}
.mail-section .n {
  font-family: 'JetBrains Mono', monospace; font-size: 9pt; font-weight: 500;
  color: var(--red);
}
.mail-section .nm {
  font-family: 'Fraunces', serif; font-size: 11pt; font-weight: 500;
}
.mail-section .rule {
  font-family: 'Inter'; font-size: 8.5pt; color: var(--ink);
  margin-top: 1mm; line-height: 1.4;
}
.mail-section .ex {
  font-family: 'JetBrains Mono', monospace; font-size: 7.5pt;
  color: var(--moss); margin-top: 1.5mm; line-height: 1.4;
  padding: 1.5mm 3mm; background: var(--cream-warm);
  border-left: 1.5px solid var(--moss);
}
.mail-section .ex::before {
  content: "EX · "; color: var(--red); font-weight: 600; letter-spacing: 1px;
}

/* ===== INSTA WEEK CALENDAR ===== */

.insta-week {
  width: 100%; border-collapse: collapse;
  font-family: 'Inter'; font-size: 8.5pt;
}
.insta-week thead th {
  font-size: 7.5pt; font-weight: 600; letter-spacing: 1.2px;
  text-transform: uppercase; color: var(--moss);
  padding: 0 0 3mm 0; border-bottom: 1px solid var(--ink);
  text-align: left;
}
.insta-week tbody td {
  padding: 3mm 4mm 3mm 0;
  border-bottom: 0.5px solid var(--rule);
  vertical-align: top;
}
.insta-week .day {
  font-family: 'JetBrains Mono', monospace; font-weight: 500;
  width: 22mm;
}
.insta-week .theme {
  font-family: 'Fraunces', serif; font-size: 11pt; font-weight: 500;
  width: 50mm;
}
.insta-week .recipe { line-height: 1.4; }
.insta-week .day.rest, .insta-week .theme.rest {
  color: var(--moss-soft);
}

/* ===== HASHTAG BLOCKS ===== */

.hashtag-block {
  padding: 3mm 0;
  border-bottom: 0.5px solid var(--rule);
}
.hashtag-block:last-child { border-bottom: none; }
.hashtag-block .cat {
  font-family: 'Inter'; font-size: 7.5pt; font-weight: 600;
  letter-spacing: 1.2px; text-transform: uppercase;
  color: var(--moss); margin-bottom: 1mm;
}
.hashtag-block .tags {
  font-family: 'JetBrains Mono', monospace; font-size: 8.5pt;
  color: var(--ink); line-height: 1.5;
}

/* ===== AUDIENCE CARDS (Meta Ads) ===== */

.audience-card {
  border: 0.5px solid var(--rule-strong);
  padding: 4mm 5mm;
  margin-bottom: 3mm;
}
.audience-card .h {
  display: flex; justify-content: space-between; align-items: baseline;
  margin-bottom: 2mm;
}
.audience-card .nm {
  font-family: 'Fraunces', serif; font-size: 13pt; font-weight: 500;
}
.audience-card .sz {
  font-family: 'JetBrains Mono', monospace; font-size: 9pt;
  color: var(--red);
}
.audience-card .cr {
  font-family: 'Inter'; font-size: 8.5pt; line-height: 1.45;
}

/* ===== KPI TABLES ===== */

.kpi-table {
  width: 100%; border-collapse: collapse;
  font-family: 'Inter'; font-size: 9pt;
}
.kpi-table tbody td {
  padding: 2.5mm 0;
  border-bottom: 0.5px solid var(--rule);
}
.kpi-table tbody td.k {
  font-family: 'Inter'; font-size: 9pt;
}
.kpi-table tbody td.v {
  font-family: 'JetBrains Mono', monospace; font-weight: 500;
  font-size: 9pt; text-align: right; color: var(--red);
}

/* ===== TOOLS TABLE ===== */

.tools {
  width: 100%; border-collapse: collapse;
  font-family: 'Inter'; font-size: 8.5pt;
}
.tools thead th {
  font-size: 7pt; font-weight: 600; letter-spacing: 1.2px;
  text-transform: uppercase; color: var(--moss);
  padding: 0 0 3mm 0; border-bottom: 1px solid var(--ink);
  text-align: left;
}
.tools tbody td {
  padding: 2.6mm 4mm 2.6mm 0;
  border-bottom: 0.5px solid var(--rule);
  vertical-align: top;
}
.tools .cat {
  font-family: 'JetBrains Mono', monospace; font-size: 7.5pt;
  letter-spacing: 0.5px; color: var(--moss);
  width: 26mm; text-transform: uppercase;
}
.tools .tool {
  font-family: 'Fraunces', serif; font-size: 11pt; font-weight: 500;
  width: 48mm;
}
.tools .price {
  font-family: 'JetBrains Mono', monospace; font-size: 8.5pt;
  width: 30mm; color: var(--red); font-weight: 500;
}
.tools .why {
  font-family: 'Inter'; font-size: 8pt; line-height: 1.4;
}

/* ===== ANTIPATTERNS — 2 col yes / no ===== */

.anti-row {
  display: grid;
  grid-template-columns: 8mm 1fr 1fr;
  gap: 5mm;
  padding: 3mm 0;
  border-bottom: 0.5px solid var(--rule);
  align-items: start;
}
.anti-row .n {
  font-family: 'JetBrains Mono', monospace; font-size: 9pt; font-weight: 500;
  color: var(--red);
}
.anti-row .no, .anti-row .yes {
  font-family: 'Inter'; font-size: 8.5pt; line-height: 1.4;
  padding-left: 7mm;
  position: relative;
}
.anti-row .no::before, .anti-row .yes::before {
  position: absolute;
  left: 0; top: 0;
  font-family: 'JetBrains Mono', monospace; font-size: 7.5pt;
  font-weight: 600; letter-spacing: 1px;
}
.anti-row .no { color: var(--moss); }
.anti-row .no::before { content: "NON"; color: var(--moss); }
.anti-row .yes { color: var(--ink); }
.anti-row .yes::before { content: "OUI"; color: var(--red); }

/* ===== TIMELINE 12 mois ===== */

.viz-tl {
  border-top: 1px solid var(--ink);
}
.viz-tl-row {
  display: grid;
  grid-template-columns: 14mm 40mm 1fr 24mm;
  gap: 4mm;
  padding: 2.4mm 0;
  border-bottom: 0.5px solid var(--rule);
  align-items: start;
}
.viz-tl-row .m {
  font-family: 'JetBrains Mono', monospace; font-size: 10pt; font-weight: 500;
  color: var(--red);
}
.viz-tl-row .ph {
  font-family: 'Fraunces', serif; font-size: 11pt; font-weight: 500;
  line-height: 1.15;
}
.viz-tl-row .det {
  font-family: 'Inter'; font-size: 8.5pt; color: var(--ink); line-height: 1.4;
}
.viz-tl-row .bgt {
  font-family: 'JetBrains Mono', monospace; font-size: 8.5pt;
  text-align: right; color: var(--ink); font-weight: 500;
}

/* ===== TAKEAWAYS 6 blocs ===== */

.take-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 8mm;
}
.take-block {
  border-top: 2px solid var(--ink);
  padding-top: 4mm;
}
.take-block .n {
  font-family: 'JetBrains Mono', monospace; font-size: 11pt; font-weight: 500;
  color: var(--red);
}
.take-block .t {
  font-family: 'Fraunces', serif; font-size: 14pt; font-weight: 500;
  line-height: 1.15; margin: 2mm 0 3mm 0;
}
.take-block .d {
  font-family: 'Inter'; font-size: 9pt; line-height: 1.5;
}

/* ===== GADS KEYWORDS ROWS ===== */

.gads-row {
  display: grid;
  grid-template-columns: 50mm 1fr 36mm;
  gap: 4mm;
  padding: 3mm 0;
  border-bottom: 0.5px solid var(--rule);
  align-items: start;
}
.gads-row .zn {
  font-family: 'Fraunces', serif; font-size: 11pt; font-weight: 500;
}
.gads-row .kw {
  font-family: 'JetBrains Mono', monospace; font-size: 8.5pt;
  color: var(--ink); line-height: 1.5;
}
.gads-row .mt {
  font-family: 'Inter'; font-size: 8pt; font-weight: 600;
  letter-spacing: 0.5px; color: var(--red);
  text-transform: uppercase; text-align: right;
}
"""


# ============================================================================
# HELPERS
# ============================================================================

def page_chrome(num: str, crumb: str) -> tuple[str, str]:
    head = (
        f'<div class="page-head"><div class="crumb">{crumb}</div>'
        f'<div class="num">{num} / {TOTAL_PAGES}</div></div>'
    )
    foot = (
        f'<div class="page-foot"><span>Studio J Oliveira — Plan visibilité 2026</span>'
        f'<span class="pnum">{num}</span></div>'
    )
    return head, foot


# ============================================================================
# PAGES
# ============================================================================

def page_cover() -> str:
    return """
<section class="page cover">
  <div class="cover__top">
    <div class="brand">Studio J Oliveira</div>
    <div class="ref">SO-PV-2026.05 · v1.0</div>
  </div>

  <div>
    <div class="cover__eyebrow">Plan visibilité — Mai 2026</div>
    <div class="cover__title">Vous avez du <span class="em">talent.</span><br/>Voici comment le rendre visible.</div>
    <div class="cover__subtitle">Guide opérationnel — 4 niveaux progressifs, 6 canaux clés, templates et KPIs concrets.</div>
    <div class="cover__rule"></div>
    <div class="cover__meta">
      <div><div class="k">Destinataire</div><div class="v">Jonathan Oliveira</div></div>
      <div><div class="k">Préparé par</div><div class="v">Morgan · Mai 2026</div></div>
      <div><div class="k">Compagnon</div><div class="v">Étude de marché Studio Oliveira (doc séparé) — référence des zones, segments et prescripteurs cités ici</div></div>
    </div>
  </div>

  <div class="cover__bottom">
    <div>Designer paysagiste biophilique — Sud-Ouest &amp; Paris</div>
    <div>Confidentiel — usage interne</div>
  </div>
</section>
"""


def page_executive() -> str:
    head, foot = page_chrome("02", "À retenir")
    return f"""
<section class="page page--cream">
  {head}
  <div class="body">
    <div class="eyebrow">Sommaire exécutif</div>
    <div class="h1" style="margin-top: 3mm; max-width: 175mm;">
      Quatre paliers,<br/>six canaux, <span class="italic">zéro improvisation.</span>
    </div>
    <div class="lede" style="margin-top: 5mm; max-width: 165mm;">
      <strong>La pub n'est pas une dépense — c'est un investissement proportionnel aux retours.</strong> Règle d'or : CAC cible &lt; 10 % du ticket par typologie. Pas d'escalade aveugle d'un palier à l'autre — chaque montée se justifie par un ROI mesuré sur le palier précédent.
    </div>

    <div class="kpi-row" style="margin-top: 12mm;">
      <div class="kpi-cell">
        <div class="k">Horizon mesuré</div>
        <div class="v em">12<span style="font-size: 16pt;"> mois</span></div>
        <div class="legend">Cycle complet : Niveau 0 (M1-3) → Niveau 1 (M4-6) → Niveau 2 (M7-12). Niveau 3 conditionnel.</div>
      </div>
      <div class="kpi-cell">
        <div class="k">Budget cumulé 12 mois</div>
        <div class="v">≈ 3 200 €</div>
        <div class="legend">Niveaux 0 + 1 + 2 cumulés sur les 12 premiers mois. CAC discipline non-négociable.</div>
      </div>
      <div class="kpi-cell">
        <div class="k">Leads qualifiés cibles</div>
        <div class="v em">25–35</div>
        <div class="legend">Cumul 12 mois — mix organique + payant. 3-5 leads qualifiés / mois à régime Niveau 2.</div>
      </div>
    </div>

    <div class="eyebrow eyebrow--moss" style="margin-top: 12mm;">CAC max acceptable par typologie</div>
    <table class="pricing" style="margin-top: 4mm;">
      <thead>
        <tr>
          <th>Typologie</th>
          <th>Ticket étude</th>
          <th>CAC max (10 %)</th>
          <th>Seuil break-even</th>
        </tr>
      </thead>
      <tbody>
        {''.join(f'<tr><td class="typo">{p["typo"]}</td><td class="ticket">{p["ticket"]}</td><td class="cac">{p["cac_max"]}</td><td class="breakeven">{p["leads_breakeven"]}</td></tr>' for p in PRICING_GRID)}
      </tbody>
    </table>

    <div class="callout callout--ink" style="margin-top: 8mm;">
      <div class="k">Discipline d'activation</div>
      <div class="v" style="font-size: 10pt;">Niveau N+1 lancé uniquement si Niveau N a généré ≥ <strong>3 leads qualifiés ou 2 missions</strong> sur les 3 derniers mois. Sinon : on reste, on ajuste, on ne dépense pas davantage.</div>
    </div>
  </div>
  {foot}
</section>
"""


def page_constat() -> str:
    head, foot = page_chrome("03", "Le constat")
    return f"""
<section class="page page--cream">
  {head}
  <div class="body">
    <div class="eyebrow">Le constat</div>
    <div class="h1" style="margin-top: 3mm; max-width: 175mm;">
      Le travail existe.<br/>Le public ne le voit <span class="italic">pas encore.</span>
    </div>
    <div class="lede" style="margin-top: 6mm; max-width: 168mm;">
      Le studio a un positionnement clair (designer paysagiste biophilique signature d'auteur), une zone d'intervention identifiée (Brive · Bordeaux · Bassin · Côte Basque · Périgord) et un outil rare (Twinmotion 3D). Trois angles concurrentiels libres sur l'ensemble du Sud-Ouest. Le chantier visibilité n'est pas <em>quoi dire</em> — c'est <em>comment être trouvé</em>.
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12mm; margin-top: 12mm;">
      <div>
        <div class="eyebrow eyebrow--moss">Ce qui est posé</div>
        <ul style="margin: 3mm 0 0 0; padding: 0; list-style: none; font-family: 'Inter'; font-size: 9pt; line-height: 1.7;">
          <li>—  Site web Astro premium (4 pages typologies indexables)</li>
          <li>—  Twinmotion 3D photoréaliste comme livrable</li>
          <li>—  Études vendues séparément (1 200 € → 6 500 €)</li>
          <li>—  Brief client formalisé · book papier en cours</li>
          <li>—  Réseau prescripteurs identifié (cf. étude marché)</li>
        </ul>
      </div>
      <div>
        <div class="eyebrow eyebrow--moss">Ce qui manque</div>
        <ul style="margin: 3mm 0 0 0; padding: 0; list-style: none; font-family: 'Inter'; font-size: 9pt; line-height: 1.7;">
          <li>—  Fiche Google Business Profile optimisée</li>
          <li>—  Présence Instagram organique régulière</li>
          <li>—  Séquence cold mail prescripteurs structurée</li>
          <li>—  3 à 5 témoignages clients publiés</li>
          <li>—  Plan presse + dossier presse 4 pages</li>
          <li>—  Tracking de conversion (CAC mesurable)</li>
        </ul>
      </div>
    </div>

    <div class="callout" style="margin-top: 10mm;">
      <div class="k">Logique du document</div>
      <div class="v" style="font-size: 10pt;">Ce guide suit la pyramide à 4 niveaux progressifs : <strong>Niveau 0</strong> (M1-3, budget zéro, fondations) → <strong>Niveau 1</strong> (M4-6, 130-180 €/mois, premiers leviers payants) → <strong>Niveau 2</strong> (M7-12, 300-450 €/mois, structurel) → <strong>Niveau 3</strong> (M12+, scale réinjecté du CA). Chaque niveau est détaillé canal par canal dans les pages qui suivent.</div>
    </div>
  </div>
  {foot}
</section>
"""


def page_5_channels() -> str:
    head, foot = page_chrome("04", "5 canaux gratuits permanents")
    cards = "".join(
        f"""<div class="channel-card">
          <div class="icon">{c["icon"]}</div>
          <div>
            <div class="nm">{c["name"]}</div>
            <div class="grid-meta">
              <div><div class="lbl">Objectif</div>{c["objective"]}</div>
              <div><div class="lbl">Effort</div>{c["effort"]}</div>
              <div><div class="lbl">Fréquence</div>{c["freq"]}</div>
              <div><div class="lbl">KPI cible</div>{c["kpi"]}</div>
            </div>
          </div>
        </div>"""
        for c in PERMANENT_CHANNELS
    )
    return f"""
<section class="page page--cream">
  {head}
  <div class="body">
    <div class="eyebrow">Socle permanent</div>
    <div class="h1" style="margin-top: 3mm; max-width: 175mm;">
      Cinq canaux <span class="italic">gratuits.</span><br/>Jamais lâchés, même au Niveau 3.
    </div>
    <div class="lede" style="margin-top: 5mm; max-width: 168mm;">
      Avant tout euro dépensé, c'est ici que la visibilité se construit. Ces cinq canaux restent actifs <strong>en permanence</strong>, du Niveau 0 jusqu'au scale. Couper l'un d'eux fragilise tout l'édifice.
    </div>

    <div style="margin-top: 10mm;">
      {cards}
    </div>
  </div>
  {foot}
</section>
"""


def page_gbp() -> str:
    head, foot = page_chrome("05", "Niveau 0 — Google Business Profile")
    steps = "".join(
        f"""<div class="step">
          <div class="n">{i+1:02d}</div>
          <div>
            <div class="body-step">
              <div class="ttl">{title}</div>
              <div class="desc">{desc}</div>
            </div>
          </div>
          <div class="effort">{eff}</div>
        </div>"""
        for i, (title, desc, eff) in enumerate(GBP_CHECKLIST)
    )
    return f"""
<section class="page page--cream">
  {head}
  <div class="body">
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3mm;">
      <div class="eyebrow">Niveau 0 — Canal 1</div>
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 9pt; color: var(--moss); letter-spacing: 1px;">BUDGET 0 €</div>
    </div>
    <div class="h1" style="max-width: 175mm;">Google Business Profile</div>
    <div class="lede" style="margin-top: 5mm; max-width: 170mm;">
      C'est le <strong>premier point de contact local</strong> entre un prospect (HNW Brive, agent immo Bordeaux, hôtelier Périgord) et le Studio. Une fiche optimisée vaut un site secondaire — moteur de recommandation, autorité Maps, levier d'avis qualifiés.
    </div>

    <div class="eyebrow eyebrow--moss" style="margin-top: 10mm;">Checklist — à compléter dans l'ordre</div>
    <div class="steps" style="margin-top: 4mm; padding-top: 2mm; border-top: 1px solid var(--ink);">
      {steps}
    </div>

    <div class="callout callout--ink" style="margin-top: 6mm;">
      <div class="k">KPI à 3 mois</div>
      <div class="v" style="font-size: 10pt;">Note moyenne ≥ <strong>4,5 ★</strong> · <strong>10 avis</strong> publiés · <strong>20 photos</strong> · présence de 12 posts (1/sem). Pas d'avis &lt; 4★ non répondu sous 48 h.</div>
    </div>
  </div>
  {foot}
</section>
"""


def page_seo_local() -> str:
    head, foot = page_chrome("06", "Niveau 0 — SEO local du site")
    return f"""
<section class="page page--cream">
  {head}
  <div class="body">
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3mm;">
      <div class="eyebrow">Niveau 0 — Canal 2</div>
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 9pt; color: var(--moss); letter-spacing: 1px;">BUDGET 0 €</div>
    </div>
    <div class="h1" style="max-width: 175mm;">SEO local du site</div>
    <div class="lede" style="margin-top: 5mm; max-width: 170mm;">
      Le site Astro est déjà en place et techniquement propre. Le travail SEO local consiste à <strong>signaler aux moteurs</strong> les pages typologies, à les enrichir de schema.org, et à obtenir 10 backlinks qualitatifs initiaux.
    </div>

    <div class="eyebrow eyebrow--moss" style="margin-top: 12mm;">Setup technique (1 jour)</div>
    <div class="steps" style="margin-top: 4mm; padding-top: 2mm; border-top: 1px solid var(--ink);">
      <div class="step"><div class="n">01</div><div class="body-step"><div class="ttl">Sitemap.xml</div><div class="desc">Astro génère automatiquement <code style="font-family: 'JetBrains Mono', monospace; font-size: 8.5pt;">/sitemap-index.xml</code>. Vérifier que toutes les pages typologies + studio + projets sont incluses. Pas de pages "thank-you" indexées.</div></div><div class="effort">15 min</div></div>
      <div class="step"><div class="n">02</div><div class="body-step"><div class="ttl">Soumettre Google Search Console (GSC)</div><div class="desc">Créer compte GSC · vérifier propriété (méta tag dans le BaseLayout) · soumettre sitemap · activer monitoring trafic + requêtes entrantes.</div></div><div class="effort">30 min</div></div>
      <div class="step"><div class="n">03</div><div class="body-step"><div class="ttl">Soumettre Bing Webmaster Tools</div><div class="desc">Audience plus âgée HNW (~5 % du trafic). Import direct depuis GSC en 2 clics — pas de double config.</div></div><div class="effort">15 min</div></div>
      <div class="step"><div class="n">04</div><div class="body-step"><div class="ttl">Schema.org LocalBusiness</div><div class="desc">Ajouter JSON-LD dans <code style="font-family: 'JetBrains Mono'; font-size: 8.5pt;">BaseLayout.astro</code> : type <code style="font-family: 'JetBrains Mono'; font-size: 8.5pt;">LandscapeArchitect</code> · adresse · zone d'intervention · prix de départ · note Google. Outil de test : Schema.org validator.</div></div><div class="effort">2 h</div></div>
      <div class="step"><div class="n">05</div><div class="body-step"><div class="ttl">Pages typologies enrichies</div><div class="desc">Ajouter sur chaque page typologie : 1 H1 ciblé géo (« Designer micro-urbain à Bordeaux »), 3-5 cas clients miniatures, FAQ 4-6 questions, CTA Devis. Maillage interne croisé entre typologies.</div></div><div class="effort">1 j</div></div>
      <div class="step"><div class="n">06</div><div class="body-step"><div class="ttl">10 backlinks initiaux à obtenir</div><div class="desc">Architectes partenaires (3) · hôtels clients (2) · Chambre des Métiers Corrèze (1) · fournisseurs (2) · presse locale (1) · LinkedIn perso (1). Demande mail + lien à intégrer.</div></div><div class="effort">3 h</div></div>
    </div>

    <div class="callout callout--ink" style="margin-top: 6mm;">
      <div class="k">KPI à 3 mois</div>
      <div class="v" style="font-size: 10pt;">100 % pages typologies indexées Google · note Lighthouse SEO = <strong>100</strong> · 10 backlinks acquis · ≥ 5 requêtes longue-traîne en top 20 (mesuré via GSC).</div>
    </div>
  </div>
  {foot}
</section>
"""


def page_insta() -> str:
    head, foot = page_chrome("07", "Niveau 0 — Instagram organique")
    rows = "".join(
        f"""<tr><td class="day{' rest' if theme == '—' else ''}">{day}</td><td class="theme{' rest' if theme == '—' else ''}">{theme}</td><td class="recipe">{recipe}</td></tr>"""
        for day, theme, recipe in INSTA_WEEK
    )
    hashtag_blocks = "".join(
        f'<div class="hashtag-block"><div class="cat">{cat}</div><div class="tags">{tags}</div></div>'
        for cat, tags in INSTA_HASHTAGS
    )
    return f"""
<section class="page page--cream">
  {head}
  <div class="body">
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3mm;">
      <div class="eyebrow">Niveau 0 — Canal 3</div>
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 9pt; color: var(--moss); letter-spacing: 1px;">BUDGET 0 €</div>
    </div>
    <div class="h1" style="max-width: 175mm;">Instagram organique</div>
    <div style="margin-top: 5mm; max-width: 170mm; font-family: 'Inter'; font-size: 9pt; line-height: 1.45;">
      Instagram = portfolio vivant + notoriété DA. Cible : architectes, agents immo, particuliers HNW. La régularité bat le pic : <strong>3 posts/semaine sur 12 mois</strong> &gt; 30 posts en novembre puis silence.
    </div>

    <div class="eyebrow eyebrow--moss" style="margin-top: 8mm;">Calendrier hebdomadaire — recette stable</div>
    <table class="insta-week" style="margin-top: 3mm;">
      <thead><tr><th>Jour</th><th>Thème</th><th>Recette du post</th></tr></thead>
      <tbody>{rows}</tbody>
    </table>

    <div class="eyebrow eyebrow--moss" style="margin-top: 7mm;">Hashtags — combinaison ciblée par zone (max 12 par post)</div>
    <div style="margin-top: 3mm; padding-top: 2mm; border-top: 1px solid var(--ink);">
      {hashtag_blocks}
    </div>

    <div class="callout" style="margin-top: 4mm;">
      <div class="k">Bio Instagram — structure recommandée (150 caractères max)</div>
      <div class="v" style="font-family: 'JetBrains Mono'; font-size: 9pt; line-height: 1.5;">[Studio J Oliveira]<br/>Designer paysagiste biophilique · SO &amp; Paris<br/>Architecture paysagère · Twinmotion · Études dissociées<br/>↓ Devis : studio-oliveira.fr</div>
    </div>
  </div>
  {foot}
</section>
"""


def page_cold_mail() -> str:
    head, foot = page_chrome("08", "Niveau 0 — Cold mail")
    sections = "".join(
        f"""<div class="mail-section">
          <div class="n">{s["n"]}</div>
          <div>
            <div class="nm">{s["section"]}</div>
            <div class="rule">{s["rule"]}</div>
            <div class="ex">{s["ex"]}</div>
          </div>
        </div>"""
        for s in COLD_MAIL_STRUCTURE
    )
    seq_rows = "".join(
        f'<div class="row"><div class="k">{k}</div><div class="v">{v}</div><div class="meta">{m}</div></div>'
        for k, v, m in COLD_MAIL_SEQUENCE
    )
    return f"""
<section class="page page--cream">
  {head}
  <div class="body">
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3mm;">
      <div class="eyebrow">Niveau 0 — Canal 4</div>
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 9pt; color: var(--moss); letter-spacing: 1px;">BUDGET 0 €</div>
    </div>
    <div class="h1" style="max-width: 175mm;">Cold mail prescripteurs</div>
    <div style="margin-top: 4mm; max-width: 170mm; font-family: 'Inter'; font-size: 9pt; line-height: 1.45;">
      <strong>10 mails personnalisés par semaine.</strong> Pas de mass mailing — le taux de réponse à 15 % d'un envoi ciblé bat un envoi de masse à 1 %. Liste cible : 50 prescripteurs prioritaires identifiés dans l'étude de marché (agences immo, architectes, hôteliers).
    </div>

    <div class="eyebrow eyebrow--moss" style="margin-top: 7mm;">Structure d'un cold mail — 6 sections obligatoires</div>
    <div style="margin-top: 3mm; padding-top: 2mm; border-top: 1px solid var(--ink);">
      {sections}
    </div>

    <div class="eyebrow eyebrow--moss" style="margin-top: 6mm;">Séquence 3 touches — clore la conversation en 14 jours</div>
    <div style="margin-top: 3mm; padding-top: 2mm; border-top: 1px solid var(--ink);">
      {seq_rows}
    </div>
  </div>
  {foot}
</section>
"""


def page_press_witness() -> str:
    head, foot = page_chrome("09", "Niveau 0 — Presse + témoignages")
    press_rows = "".join(
        f"""<div class="step">
          <div class="n">{page_n.split()[1]}</div>
          <div><div class="body-step"><div class="ttl">{title}</div><div class="desc">{desc}</div></div></div>
          <div class="effort"></div>
        </div>"""
        for page_n, title, desc in PRESS_KIT_STRUCTURE
    )
    targets_html = "".join(f"<li>{t}</li>" for t in PRESS_TARGETS)
    return f"""
<section class="page page--cream">
  {head}
  <div class="body">
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3mm;">
      <div class="eyebrow">Niveau 0 — Canaux 5 + 6</div>
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 9pt; color: var(--moss); letter-spacing: 1px;">BUDGET 0 €</div>
    </div>
    <div class="h1" style="max-width: 175mm;">Presse + témoignages</div>

    <div style="display: grid; grid-template-columns: 1.3fr 1fr; gap: 10mm; margin-top: 8mm;">
      <div>
        <div class="eyebrow eyebrow--moss">Dossier presse 4 pages — structure</div>
        <div class="steps" style="margin-top: 3mm; padding-top: 2mm; border-top: 1px solid var(--ink);">
          {press_rows}
        </div>

        <div class="callout" style="margin-top: 5mm;">
          <div class="k">Recommandations clients — process simple</div>
          <div class="v" style="font-size: 9.5pt; line-height: 1.45;">Demande mail à 5-10 anciens clients HNW : « 3-5 lignes de retour libre + autorisation photo du chantier ». Joindre 1 photo livraison. Délai 7 j. Publier sur site + LinkedIn + presse kit.</div>
        </div>
      </div>

      <div>
        <div class="eyebrow eyebrow--moss">15 rédactions cibles</div>
        <ul style="margin: 3mm 0 0 0; padding: 0; list-style: none; font-family: 'Inter'; font-size: 8.5pt; line-height: 1.7; border-top: 1px solid var(--ink); padding-top: 2mm;">
          {targets_html}
        </ul>
      </div>
    </div>

    <div class="callout callout--ink" style="margin-top: 6mm;">
      <div class="k">KPI à 3 mois</div>
      <div class="v" style="font-size: 10pt;"><strong>5 témoignages</strong> publiés sur le site · dossier presse v1 envoyé aux 15 rédactions · ≥ <strong>1 contact rédaction</strong> obtenu (réponse rédacteur en chef ou attaché de presse).</div>
    </div>
  </div>
  {foot}
</section>
"""


def page_level1() -> str:
    head, foot = page_chrome("10", "Niveau 1 — Premiers leviers payants")
    boost_steps = "".join(
        f"""<div class="step">
          <div class="n">{i+1:02d}</div>
          <div><div class="body-step"><div class="ttl">{c["criteria"]}</div><div class="desc">{c["detail"]}</div></div></div>
          <div class="effort"></div>
        </div>"""
        for i, c in enumerate(LEVEL_1_BOOST_INSTA)
    )
    gads_rows = "".join(
        f'<div class="gads-row"><div class="zn">{z}</div><div class="kw">{k}</div><div class="mt">{m}</div></div>'
        for z, k, m in LEVEL_1_GADS_KEYWORDS
    )
    rules_html = "".join(f"<li>{r}</li>" for r in LEVEL_1_GADS_RULES)
    return f"""
<section class="page page--cream">
  {head}
  <div class="body">
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3mm;">
      <div class="eyebrow">Niveau 1 — Mois 4-6</div>
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 9pt; color: var(--red); letter-spacing: 1px;">130-180 €/MOIS</div>
    </div>
    <div class="h1" style="max-width: 175mm;">Premiers leviers payants</div>
    <div style="margin-top: 4mm; max-width: 168mm; font-family: 'Inter'; font-size: 9pt; line-height: 1.45;">
      Activation <strong>seulement si</strong> Niveau 0 a généré ≥ 3 leads qualifiés / 2 missions sur les 3 mois précédents. Sinon : on consolide, on n'augmente pas.
    </div>

    <div class="eyebrow eyebrow--moss" style="margin-top: 8mm;">Boost Instagram — 5 critères de qualification</div>
    <div class="steps" style="margin-top: 3mm; padding-top: 2mm; border-top: 1px solid var(--ink);">
      {boost_steps}
    </div>

    <div class="eyebrow eyebrow--moss" style="margin-top: 6mm;">Google Ads ultra-ciblé — mots-clés par zone</div>
    <div style="margin-top: 3mm; padding-top: 2mm; border-top: 1px solid var(--ink);">
      {gads_rows}
    </div>

    <div class="callout" style="margin-top: 4mm;">
      <div class="k">5 règles Google Ads non-négociables</div>
      <ul style="margin: 1.5mm 0 0 0; padding-left: 5mm; font-family: 'Inter'; font-size: 8.5pt; line-height: 1.5;">
        {rules_html}
      </ul>
    </div>
  </div>
  {foot}
</section>
"""


def page_level2_meta() -> str:
    head, foot = page_chrome("11", "Niveau 2 — Meta Ads + Newsletter")
    aud_cards = "".join(
        f"""<div class="audience-card">
          <div class="h">
            <div class="nm">{a["name"]}</div>
            <div class="sz">{a["size"]}</div>
          </div>
          <div class="cr">{a["criteria"]}</div>
        </div>"""
        for a in LEVEL_2_META_AUDIENCES
    )
    creas_html = "".join(f"<li>{c}</li>" for c in LEVEL_2_META_CREAS)
    nl_rows = "".join(
        f'<div class="row"><div class="k">{n}</div><div class="v"><strong>{t}</strong> — {d}</div><div class="meta"></div></div>'
        for n, t, d in NEWSLETTER_SECTIONS
    )
    return f"""
<section class="page page--cream">
  {head}
  <div class="body">
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3mm;">
      <div class="eyebrow">Niveau 2 — Mois 7-12</div>
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 9pt; color: var(--red); letter-spacing: 1px;">300-450 €/MOIS</div>
    </div>
    <div class="h1" style="max-width: 175mm;">Meta Ads + Newsletter</div>
    <div style="margin-top: 4mm; max-width: 168mm; font-family: 'Inter'; font-size: 9pt; line-height: 1.45;">
      Activation après Niveau 1 prouvé. Meta Ads (Insta/Facebook) = structurel. Newsletter mensuelle = entretien de la base prospects + clients.
    </div>

    <div class="eyebrow eyebrow--moss" style="margin-top: 8mm;">Meta Ads — 3 audiences à activer en parallèle</div>
    <div style="margin-top: 3mm;">
      {aud_cards}
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8mm; margin-top: 3mm;">
      <div>
        <div class="eyebrow eyebrow--moss">Créas types — 4 formats</div>
        <ul style="margin: 3mm 0 0 0; padding-left: 5mm; font-family: 'Inter'; font-size: 8.5pt; line-height: 1.55;">
          {creas_html}
        </ul>
      </div>
      <div>
        <div class="eyebrow eyebrow--moss">Newsletter — 5 sections fixes</div>
        <div style="margin-top: 3mm; padding-top: 2mm; border-top: 1px solid var(--ink);">
          {nl_rows}
        </div>
      </div>
    </div>
  </div>
  {foot}
</section>
"""


def page_level3() -> str:
    head, foot = page_chrome("12", "Niveau 3 — Scale conditionnel")
    rules_html = "".join(f"<li>{r}</li>" for r in LEVEL_3_RULES)
    return f"""
<section class="page page--ink">
  {head}
  <div class="body">
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3mm;">
      <div class="eyebrow">Niveau 3 — Mois 12+</div>
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 9pt; color: var(--red); letter-spacing: 1px;">500+ €/MOIS</div>
    </div>
    <div class="h1" style="max-width: 175mm; color: var(--cream);">
      Scale — <span class="italic" style="color: var(--red);">réinjecté du CA généré.</span>
    </div>
    <div style="margin-top: 6mm; max-width: 170mm; font-family: 'Fraunces'; font-weight: 300; font-style: italic; font-size: 14pt; line-height: 1.35; color: var(--moss-soft);">
      Le Niveau 3 n'est pas une promesse, c'est une conséquence. Il s'active <strong style="color: var(--cream); font-style: normal;">seulement après 12 mois d'historique mesuré</strong> et reste mécaniquement plafonné par le CA généré.
    </div>

    <div style="margin-top: 14mm; padding-top: 6mm; border-top: 1px solid rgba(245,241,234,0.2);">
      <div class="eyebrow eyebrow--moss" style="color: var(--moss-soft);">Cinq règles d'allocation</div>
      <ul style="margin: 4mm 0 0 0; padding-left: 5mm; font-family: 'Inter'; font-size: 9.5pt; line-height: 1.7; color: var(--cream);">
        {rules_html}
      </ul>
    </div>

    <div style="background: rgba(255,13,0,0.15); border-left: 2px solid var(--red); padding: 4mm 5mm; margin-top: 10mm;">
      <div style="font-family: 'Inter'; font-size: 7pt; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--red); margin-bottom: 1.5mm;">Garde-fou</div>
      <div style="font-family: 'Fraunces', serif; font-size: 12pt; line-height: 1.35; color: var(--cream);">
        Si une typologie a un CAC observé &gt; 10 % du ticket, on coupe le canal sur cette typologie. <strong style="color: var(--red);">Pas de débat.</strong> On rediagnostique : ciblage, créa, landing, offre.
      </div>
    </div>
  </div>
  {foot}
</section>
"""


def page_timeline() -> str:
    head, foot = page_chrome("13", "Calendrier visibilité 12 mois")
    rows = "".join(
        f'<div class="viz-tl-row"><div class="m">{m}</div><div class="ph">{p}</div><div class="det">{d}</div><div class="bgt">{b}</div></div>'
        for m, p, d, b in VIZ_TIMELINE
    )
    return f"""
<section class="page page--cream">
  {head}
  <div class="body">
    <div class="eyebrow">Calendrier 12 mois</div>
    <div class="h1" style="margin-top: 3mm; max-width: 175mm;">
      Un mois, une priorité visibilité.
    </div>
    <div style="margin-top: 4mm; max-width: 170mm; font-family: 'Inter'; font-size: 9pt; line-height: 1.45;">
      Vue intégrée des actions visibilité par mois, avec le budget cumulé à mesure que les paliers s'activent. À lire en complément du calendrier prospection (cf. étude de marché).
    </div>

    <div class="viz-tl" style="margin-top: 8mm;">
      {rows}
    </div>

    <div class="callout callout--ink" style="margin-top: 4mm;">
      <div class="k">Budget cumulé 12 mois</div>
      <div class="v" style="font-size: 10pt;">≈ <strong>3 200 €</strong> dépensés sur les 12 mois — concentrés sur les 6 derniers (Niveau 1 + Niveau 2). Niveau 0 = 100 % organique, 0 € sortie de cash.</div>
    </div>
  </div>
  {foot}
</section>
"""


def page_kpis() -> str:
    head, foot = page_chrome("14", "KPIs à suivre")
    def make_table(items):
        return "".join(f'<tr><td class="k">{k}</td><td class="v">{v}</td></tr>' for k, v in items)
    return f"""
<section class="page page--cream">
  {head}
  <div class="body">
    <div class="eyebrow">Mesurer</div>
    <div class="h1" style="margin-top: 3mm; max-width: 175mm;">
      Trois rythmes, <span class="italic">trois tableaux.</span>
    </div>
    <div style="margin-top: 4mm; max-width: 170mm; font-family: 'Inter'; font-size: 9pt; line-height: 1.45;">
      Sans mesure, pas de pilotage. Trois cadences à tenir : <strong>hebdo</strong> (activité), <strong>mensuel</strong> (résultat), <strong>trimestriel</strong> (pipeline + ajustement strat).
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8mm; margin-top: 10mm;">
      <div>
        <div class="eyebrow eyebrow--moss">Hebdomadaire — activité</div>
        <table class="kpi-table" style="margin-top: 3mm; padding-top: 2mm; border-top: 1px solid var(--ink);">
          <tbody>{make_table(KPIS_WEEKLY)}</tbody>
        </table>
      </div>
      <div>
        <div class="eyebrow eyebrow--moss">Mensuel — résultat</div>
        <table class="kpi-table" style="margin-top: 3mm; padding-top: 2mm; border-top: 1px solid var(--ink);">
          <tbody>{make_table(KPIS_MONTHLY)}</tbody>
        </table>
      </div>
      <div>
        <div class="eyebrow eyebrow--moss">Trimestriel — pipeline</div>
        <table class="kpi-table" style="margin-top: 3mm; padding-top: 2mm; border-top: 1px solid var(--ink);">
          <tbody>{make_table(KPIS_QUARTERLY)}</tbody>
        </table>
      </div>
    </div>

    <div class="callout" style="margin-top: 10mm;">
      <div class="k">Où tenir ces KPIs</div>
      <div class="v" style="font-size: 9.5pt; line-height: 1.45;">Un seul tableur (Google Sheets ou Notion) — 3 onglets. Saisie hebdo bloquée le vendredi matin (30 min). Sans cette discipline, on pilote à l'instinct → CAC explose à terme.</div>
    </div>
  </div>
  {foot}
</section>
"""


def page_tools() -> str:
    head, foot = page_chrome("15", "Stack outils recommandés")
    rows = "".join(
        f'<tr><td class="cat">{t["cat"]}</td><td class="tool">{t["tool"]}</td><td class="price">{t["price"]}</td><td class="why">{t["why"]}</td></tr>'
        for t in TOOLS_STACK
    )
    return f"""
<section class="page page--cream">
  {head}
  <div class="body">
    <div class="eyebrow">Stack technique</div>
    <div class="h1" style="margin-top: 3mm; max-width: 175mm;">
      Dix outils, <span class="italic">huit gratuits ou quasi.</span>
    </div>
    <div style="margin-top: 4mm; max-width: 170mm; font-family: 'Inter'; font-size: 9pt; line-height: 1.45;">
      Pas de stack pléthorique. Chaque outil a une fonction précise et un coût justifié. Budget total stack à plein régime : ≈ <strong>165 €/mois</strong> (Plausible + Mailchimp + Apollo + LinkedIn + Canva + Lightroom).
    </div>

    <table class="tools" style="margin-top: 10mm;">
      <thead>
        <tr><th>Catégorie</th><th>Outil</th><th>Prix</th><th>Pourquoi</th></tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>

    <div class="callout callout--ink" style="margin-top: 6mm;">
      <div class="k">Stack minimum vital (M1)</div>
      <div class="v" style="font-size: 10pt;">GBP + GSC + Bing + Plausible + Sheets/Notion. <strong>5 outils, 9 $/mois</strong> (Plausible). Le reste s'ajoute en fonction de la traction.</div>
    </div>
  </div>
  {foot}
</section>
"""


def page_antipatterns() -> str:
    head, foot = page_chrome("16", "Erreurs à éviter")
    rows = "".join(
        f"""<div class="anti-row">
          <div class="n">{a["n"]}</div>
          <div class="no">{a["no"]}</div>
          <div class="yes">{a["yes"]}</div>
        </div>"""
        for a in ANTIPATTERNS
    )
    return f"""
<section class="page page--cream">
  {head}
  <div class="body">
    <div class="eyebrow">Anti-patterns</div>
    <div class="h1" style="margin-top: 3mm; max-width: 175mm;">
      Huit erreurs <span class="italic">qui coûtent cher.</span>
    </div>
    <div style="margin-top: 4mm; max-width: 170mm; font-family: 'Inter'; font-size: 9pt; line-height: 1.45;">
      Liste des comportements à proscrire, avec le réflexe à substituer. Lue avant chaque sprint trimestriel comme garde-fou.
    </div>

    <div style="margin-top: 10mm; padding-top: 3mm; border-top: 1px solid var(--ink);">
      {rows}
    </div>
  </div>
  {foot}
</section>
"""


def page_takeaways() -> str:
    head, foot = page_chrome("17", "Take-aways")
    blocks = "".join(
        f'<div class="take-block"><div class="n">{n}</div><div class="t">{t}</div><div class="d">{d}</div></div>'
        for n, t, d in TAKEAWAYS_VIZ
    )
    return f"""
<section class="page page--cream">
  {head}
  <div class="body">
    <div class="eyebrow">Take-aways</div>
    <div class="h1" style="margin-top: 3mm; max-width: 175mm;">
      Six règles à <span class="italic">tatouer.</span>
    </div>
    <div style="margin-top: 4mm; max-width: 170mm; font-family: 'Inter'; font-size: 9pt; line-height: 1.45;">
      Le détail de ce guide se résume à six règles. Si vous deviez n'en retenir que celles-ci, le 80/20 du plan visibilité est là.
    </div>

    <div class="take-grid" style="margin-top: 14mm;">
      {blocks}
    </div>
  </div>
  {foot}
</section>
"""


def page_colophon() -> str:
    return """
<section class="page page--ink" style="display: flex; flex-direction: column; justify-content: space-between;">
  <div style="padding: 22mm 18mm 0 18mm; flex: 1; display: flex; align-items: center; justify-content: center;">
    <div style="max-width: 155mm;">
      <div style="font-family: 'Inter'; font-size: 8pt; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: var(--red);">Fin du document</div>
      <div style="font-family: 'Fraunces'; font-variation-settings: 'opsz' 144; font-weight: 300; font-size: 36pt; color: var(--cream); margin-top: 8mm; line-height: 0.98;">
        Tenir la cadence trois mois, <span class="italic" style="color: var(--red);">mesurer,</span><br/>ajuster, recommencer.
      </div>
      <div style="font-family: 'Fraunces', serif; font-weight: 300; font-style: italic; font-size: 18pt; color: #a8a995; margin-top: 8mm; line-height: 1.3;">
        La visibilité n'est pas une campagne — c'est une discipline.
      </div>
    </div>
  </div>

  <div style="padding: 18mm; display: flex; justify-content: space-between; font-family: 'Inter'; font-size: 7.5pt; color: var(--moss-soft); letter-spacing: 1.5px; text-transform: uppercase;">
    <div>Studio J Oliveira — 41 rue Général Souham, 19100 Brive-la-Gaillarde</div>
    <div style="font-family: 'JetBrains Mono'; letter-spacing: 0;">SO-PV-2026.05 · 18 / 18</div>
  </div>
</section>
"""


# ============================================================================
# ASSEMBLY
# ============================================================================

def build_html() -> str:
    pages = [
        page_cover(),         # 1
        page_executive(),     # 2
        page_constat(),       # 3
        page_5_channels(),    # 4
        page_gbp(),           # 5
        page_seo_local(),     # 6
        page_insta(),         # 7
        page_cold_mail(),     # 8
        page_press_witness(), # 9
        page_level1(),        # 10
        page_level2_meta(),   # 11
        page_level3(),        # 12
        page_timeline(),      # 13
        page_kpis(),          # 14
        page_tools(),         # 15
        page_antipatterns(),  # 16
        page_takeaways(),     # 17
        page_colophon(),      # 18
    ]
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Studio J Oliveira — Plan visibilité 2026</title>
</head>
<body>
{chr(10).join(pages)}
</body>
</html>
"""


def main() -> int:
    html = build_html()
    OUT_HTML.write_text(html, encoding="utf-8")

    font_config = FontConfiguration()
    HTML(string=html, base_url=str(ROOT)).write_pdf(
        target=str(OUT_PDF),
        stylesheets=[CSS(string=CSS_STYLES, font_config=font_config)],
        font_config=font_config,
        presentational_hints=True,
    )
    size_kb = OUT_PDF.stat().st_size // 1024
    print(f"✓ PDF généré : {OUT_PDF} ({size_kb} KB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
