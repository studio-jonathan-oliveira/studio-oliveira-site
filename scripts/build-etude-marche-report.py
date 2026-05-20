"""Build Studio J Oliveira market study report — composed visual PDF.

Génère un rapport A4 15 pages style cabinet conseil moderne (BCG/McKinsey 2024) :
chaque page est composée pixel-near, data visualisée (barres de score, heatmap,
timeline, pyramide), pas de markdown converti — HTML/CSS sur-mesure.

Palette alignée DA Studio Oliveira actuelle (commit `refactor(architecture-paysagere):
noir/cream/rouge`) — pas la palette « vert mousse » de l'ancien export.

Usage : python3 scripts/build-etude-marche-report.py
Deps  : weasyprint, markdown (pip install).
Sortie: _brief/etude-de-marche/Etude-Marche-Studio-Oliveira.pdf
"""

from __future__ import annotations

import sys
from pathlib import Path

from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration


ROOT = Path(__file__).parent.parent
OUT_PDF = ROOT / "_brief" / "etude-de-marche" / "Etude-Marche-Studio-Oliveira.pdf"
OUT_HTML = ROOT / "_brief" / "etude-de-marche" / "_export.html"


# ============================================================================
# DATA — extraite de _brief/etude-de-marche/00-SYNTHESE-JONATHAN.md
# ============================================================================

ZONES = [
    {"rank": 1, "name": "Bordeaux + Bassin d'Arcachon", "short": "Bordeaux + Arcachon", "score": 15.0, "verdict": "Priorité 1", "color": "red"},
    {"rank": 2, "name": "Côte Basque (Biarritz/SJL)", "short": "Côte Basque", "score": 14.0, "verdict": "Priorité 1", "color": "red"},
    {"rank": 3, "name": "Périgord (Sarlat/Bergerac)", "short": "Périgord", "score": 13.0, "verdict": "Priorité 2 haute", "color": "ink"},
    {"rank": 4, "name": "Cognac + Charente", "short": "Cognac", "score": 11.5, "verdict": "Niche prestige", "color": "moss"},
    {"rank": 5, "name": "Brive + Corrèze", "short": "Brive", "score": 11.0, "verdict": "Local opportuniste", "color": "moss"},
    {"rank": 6, "name": "Limoges + Haute-Vienne", "short": "Limoges", "score": 11.0, "verdict": "Partenariat", "color": "moss"},
    {"rank": 7, "name": "La Rochelle / Île de Ré", "short": "La Rochelle / Ré", "score": 11.0, "verdict": "Saturée", "color": "moss"},
]

# Matrice typologie × foncier : ●●●● = 4, ●●● = 3, ●● = 2, ● = 1, ○ = 0
MATRIX = [
    ("Bordeaux centre",           4, 4, 3, 1),
    ("Bassin d'Arcachon",         1, 3, 4, 3),
    ("Médoc (vignobles)",         0, 1, 2, 4),
    ("Côte Basque",               4, 3, 4, 2),
    ("Périgord noir (Sarlat)",    0, 3, 3, 4),
    ("Bergerac vignobles",        0, 2, 2, 4),
    ("Cognac (maisons + AOP)",    0, 2, 2, 4),
    ("La Rochelle vieux port",    2, 3, 2, 1),
    ("Île de Ré",                 0, 4, 4, 2),
    ("Brive + bassin",            1, 2, 2, 2),
    ("Limoges agglo",             1, 3, 2, 2),
]

TIMELINE = [
    ("M1",  "RDV Marie-Céline Chavanne", "Périgord Sotheby's", "1 RDV obtenu"),
    ("M2",  "Bordeaux Sotheby's + Cap-Ferret", "Déplacement 2 j", "2 RDV / 1 mandat ouvert"),
    ("M3",  "Biarritz Sotheby's + Barnes", "Déplacement 2 j + nuit", "2 RDV obtenus"),
    ("M4",  "Book papier 3 agences Paris", "Daniel Féau, Garcin, Sotheby's", "1 RDV Paris"),
    ("M5",  "Pitch presse AD + M&J + Côté Sud", "Dossier presse 4 p.", "1 contact rédaction"),
    ("M6",  "Hôtels Périgord patrimoniaux", "Hautegente, Vieux Logis, Plaza", "1 B2B en discussion"),
    ("M7",  "Architectes Bassin d'Arcachon", "Mongiello, Bulle, Ledoux", "1 partenariat acté"),
    ("M8",  "Hôtel du Palais + Brindos", "Courrier formel direction", "1 dossier B2B haut"),
    ("M9",  "Châteaux Bergerac/Monbazillac", "Visite 2-3 directions", "1 mission domaine"),
    ("M10", "Maison & Objet Paris", "Visiteur + 8 RDV pré-agendés", "3 contacts Paris"),
    ("M11", "Suivi trimestriel prescripteurs", "Relance LinkedIn", "2 mandats actifs min."),
    ("M12", "Bilan + démarrage Phase 2", "Extensions zones secondaires", "Pipeline visible"),
]

# Top 10 contacts semaine 1 (priorité, nom, canal, objet, zone)
CONTACTS = [
    ("1", "Marie-Céline Chavanne", "Périgord Sotheby's IR — Périgueux",   "Tél. + RDV physique",      "Présentation studio + partenariat aval transactions"),
    ("1", "Direction Sotheby's IR Bordeaux", "Bordeaux Sotheby's",         "Mail + LinkedIn",          "Demande RDV Bordeaux pour book papier"),
    ("1", "Sotheby's + Barnes Cap-Ferret", "Bassin d'Arcachon",           "Mail + LinkedIn",          "Demande RDV Bassin"),
    ("2", "David Mercier", "Daniel Féau Châteaux — Paris",                 "LinkedIn + book papier",   "Mandat HNW parisien Sud-Ouest"),
    ("2", "Nathalie Garcin", "Emile Garcin — Paris",                       "LinkedIn + book papier",   "Mandat HNW parisien campagne"),
    ("2", "Manoir d'Hautegente", "Coly, Dordogne",                         "Mail personnalisé",        "Étude paysagère parc + Twinmotion"),
    ("2", "Marie Kalt", "AD France — Rédaction",                           "Dossier presse 4 p.",      "Pitch presse cas client Périgord"),
    ("3", "Trio architectes Brive", "Puybouffat / Clary2 / Intramuros",    "Visite physique cabinets", "Partenariat prescription paysage"),
    ("3", "La Chapelle Saint-Martin", "Nieul — R&C + 1★ Michelin",         "Mail + visite",            "Étude paysagère parc 40 ha"),
    ("3", "Hôtel du Palais Biarritz", "Hyatt Unbound — Direction expl.",   "Courrier formel",          "Rénovation/réinterprétation parc"),
]

VISIBILITY_LEVELS = [
    {
        "label": "Niveau 0",
        "title": "Démarrage zéro budget",
        "period": "Mois 1-3",
        "budget": "0 €",
        "color": "moss",
        "actions": [
            "Google Business Profile + 10 backlinks prescripteurs",
            "Site web : sitemap GSC + Bing Webmaster",
            "Instagram organique 3 posts/sem + hashtags géo",
            "Cold mail 10/sem prescripteurs (séquence 3 touches)",
            "Dossier presse 4 p. → 15 rédactions ciblées",
            "Témoignages 3-5 anciens clients HNW",
        ],
        "target": "Mois 3 : Google Business 4★+, 50 followers Insta, 5-10 réponses cold mail, 1-2 RDV ouverts",
    },
    {
        "label": "Niveau 1",
        "title": "Budget minimal",
        "period": "Mois 4-6",
        "budget": "130-180 €/mois",
        "color": "moss",
        "actions": [
            "Boost Insta 1 post/sem × 20-30 € (audience géo HNW SO)",
            "Google Ads 2 mots-clés transactionnels uniquement",
            "Listing Houzz Pro (gratuit → Premium si trafic)",
        ],
        "target": "≥ 1 lead qualifié/mois SINON couper",
    },
    {
        "label": "Niveau 2",
        "title": "Budget structurel",
        "period": "Mois 7-12",
        "budget": "300-450 €/mois",
        "color": "ink",
        "actions": [
            "Meta Ads ciblage CSP + intérêts déco luxe + géo SO",
            "Google Ads élargi 5-8 mots-clés par zone prioritaire",
            "Newsletter Mailchimp (gratuit ≤ 500 contacts)",
        ],
        "target": "3-5 leads qualifiés/mois, CAC < 200 €",
    },
    {
        "label": "Niveau 3",
        "title": "Scale",
        "period": "12 mois+",
        "budget": "500+ €/mois",
        "color": "red",
        "actions": [
            "Réinjection 5-10 % du ticket de chaque mission signée",
            "Activation seulement après 12 mois d'historique mesuré",
        ],
        "target": "CAC contrôlé < 10 % du ticket par typologie",
    },
]

# Données zoom 3 zones prioritaires
ZONE_FOCUS = {
    "bordeaux": {
        "rank": 1,
        "name": "Bordeaux + Bassin d'Arcachon",
        "score": 15.0,
        "tag": "Priorité 1 — moteur 12 mois",
        "intro": "Métropole HNW n°1 du Sud-Ouest : ~800 000 habitants, UNESCO, TGV Paris 2h05. Le Bassin (Cap-Ferret, Pyla) est la zone n°1 de résidences secondaires HNW du SO — prix m² Cap-Ferret jusqu'à 25 000 €/m².",
        "kpis": [
            ("≈ 70 %", "du potentiel pipeline 12 mois", "avec la Côte Basque"),
            ("2 200", "foyers IFI", "vs 59 à Brive"),
            ("25 000 €", "m² record Cap-Ferret", "supérieur à beaucoup de quartiers parisiens"),
        ],
        "targets": [
            {
                "n": "01",
                "name": "Sotheby's IR Bordeaux + Cap-Ferret",
                "lead": "Marie Mauclère + antenne Cap-Ferret",
                "pitch": "Étude paysagère + 4 vues Twinmotion en 4-6 semaines, joint aux mandats > 1,2 M€",
                "kpi": "5 mandats référencés sur 12 mois",
            },
            {
                "n": "02",
                "name": "Cluster architectes villas Bassin",
                "lead": "Mongiello + Plisson, Atelier Bulle, Atelier Ledoux",
                "pitch": "Partenariat APS-APD : vues 3D du jardin pour compléter rendus intérieur",
                "kpi": "4 collaborations actées sur 18 mois",
            },
            {
                "n": "03",
                "name": "B2B hôtellerie 5★ premium",
                "lead": "Sources de Caudalie · Ha(a)ïtza · La Co(o)rniche · Cordeillan-Bages",
                "pitch": "Mail personnalisé direction + moodboard Twinmotion avant/après",
                "kpi": "2 signatures sur 18 mois (référence forte)",
            },
        ],
        "first_action": "RDV physique agence Bordeaux Sotheby's. Book papier 16 p., 4 cas clients photos + Twinmotion. Aller à Bordeaux en personne — pas par mail.",
        "watchout": "Zone la plus saturée de l'étude. La bataille se gagne par qualité éditoriale du book, rapidité production Twinmotion, prescription agences.",
    },
    "cotebasque": {
        "rank": 2,
        "name": "Côte Basque — Biarritz, Saint-Jean-de-Luz, Anglet",
        "score": 14.0,
        "tag": "Priorité 1 — vaut le déplacement",
        "intro": "Marché HNW historique, international (Parisiens, Espagnols, célébrités, sportifs). Hôtellerie 5★ iconique : Hôtel du Palais Hyatt Unbound (rénov. 2021, 100 M€), Brindos Lac & Château R&C. Densité hôtelière premium > Bordeaux centre.",
        "kpis": [
            ("≈ 900", "foyers IFI à Biarritz", "15× plus que Brive"),
            ("3 h 40", "depuis Brive", "nuitée obligatoire"),
            ("100 M€", "rénov. Hôtel du Palais 2021", "parc à concevoir/repositionner"),
        ],
        "targets": [
            {
                "n": "01",
                "name": "Hôtel du Palais + Brindos R&C",
                "lead": "Direction d'exploitation",
                "pitch": "Courrier formel + book premium + 3 visuels Twinmotion réinterprétation parc",
                "kpi": "1 mission signée sur 24 mois (référence majeure)",
            },
            {
                "n": "02",
                "name": "Sotheby's + Barnes Côte Basque",
                "lead": "Gros bureaux Biarritz les deux",
                "pitch": "Partenariat prescription sur transactions ≥ 1,5 M€",
                "kpi": "3 mandats référencés sur 12 mois",
            },
            {
                "n": "03",
                "name": "Trio architectes contemporains",
                "lead": "Villas Bidart / Anglet / Arcangues",
                "pitch": "Partenariat APS-APD avec livraison Twinmotion",
                "kpi": "2 collaborations actées sur 18 mois",
            },
        ],
        "first_action": "Mail personnalisé directeur commercial Sotheby's + Barnes Biarritz. RDV physique mois suivant. Combiner avec nuit sur place + visite 4-5 quartiers cibles (Chiberta, Ilbarritz, Ciboure).",
        "watchout": "Distance 3h40 Brive — handicap opérationnel. Justifie nuitée systématique. Combiner les 2-3 RDV en un seul déplacement.",
    },
    "perigord": {
        "rank": 3,
        "name": "Périgord — Sarlat, Bergerac, Périgueux",
        "score": 13.0,
        "tag": "Priorité 2 haute — extension naturelle Brive",
        "intro": "Zone la plus proche de Brive (Sarlat 50 min, Périgueux 1h20, Bergerac 1h30). Foncier dominé par domaines & caractère : châteaux, manoirs, propriétés viticoles AOP. Forte densité expats HNW britanniques, néerlandais, belges, allemands.",
        "kpis": [
            ("50 min", "Brive → Sarlat", "extension naturelle"),
            ("≈ 15 %", "du potentiel pipeline 12 mois", "après Bordeaux + Basque"),
            ("1", "porte d'entrée prescripteur", "Marie-Céline Chavanne, Périgueux"),
        ],
        "targets": [
            {
                "n": "01",
                "name": "Périgord Sotheby's IR",
                "lead": "Marie-Céline Chavanne, 38 rue Taillefer, Périgueux",
                "pitch": "RDV physique. Étude paysagère + Twinmotion en aval des transactions > 500 k€",
                "kpi": "3 mandats référencés sur 12 mois",
            },
            {
                "n": "02",
                "name": "B2B hôtellerie patrimoniale",
                "lead": "Vieux Logis · Hautegente · Plaza Madeleine · Bellerive · Vigiers",
                "pitch": "Mail personnalisé + visite physique trajet groupé (3-4 hôtels / 2 jours)",
                "kpi": "1 mission signée sur 12 mois",
            },
            {
                "n": "03",
                "name": "Châteaux viticoles Bergerac / Monbazillac",
                "lead": "Tiregand · Tirecul-la-Gravière · La Jaubertie · Bélingard · Saussignac",
                "pitch": "Directeur d'exploitation + dossier presse œnotouristique",
                "kpi": "1 mission sur 18 mois",
            },
        ],
        "first_action": "Appel téléphonique Marie-Céline Chavanne pour RDV Périgueux. Book papier orienté Domaines & Caractère + cas client Twinmotion d'un domaine fictif d'inspiration périgourdine.",
        "watchout": "Pas un marché de volume — c'est un terrain de mise en bouche + ticket élevé. Patience commerciale obligatoire (cycles décision long).",
    },
}

SECONDARY_ZONES = [
    {
        "name": "Brive + Corrèze",
        "score": 11.0,
        "verdict": "Local opportuniste",
        "summary": "Zone siège mais pas le moteur. 59 foyers IFI seulement (vs 2 200 Bordeaux, 900 Biarritz). Maintenir présence locale minimale (SEO + GBP + 3 prescripteurs). Aucun concurrent positionné designer biophilique premium → angle libre.",
        "targets": "Trio architectes brivistes (Puybouffat, Clary2, Intramuros) · Manoir d'Hautegente · Maison des Chanoines · La Réserve de Brive",
        "effort": "3 jours/mois",
    },
    {
        "name": "Limoges + Haute-Vienne",
        "score": 11.0,
        "verdict": "Partenariat sous-traitance",
        "summary": "Zone bureau actif (Verneuil-sur-Vienne) mais marché HNW limité. Tissu prescripteur faible (pas d'antenne immo luxe nationale). Approche : sous-traitance Twinmotion en marque blanche plutôt que combat frontal.",
        "targets": "La Chapelle Saint-Martin (R&C + 1★ Michelin) · Rebeyrol · ALUPA · Compoz (partenaires)",
        "effort": "2 jours/mois",
    },
    {
        "name": "Cognac + Charente",
        "score": 11.5,
        "verdict": "Niche prestige par signature",
        "summary": "Pas de volume mais ticket unitaire élevé. 1 à 3 missions « maison cognac » ou « château AOP » sur 18 mois suffisent à transformer le book. Aucun concurrent positionné → angle libre.",
        "targets": "Directeurs marketing maisons : Hennessy · Martell · Rémy Martin · Camus + Domaine des Etangs (R&C Massignac)",
        "effort": "Seconde vague, angle ultra-spécialisé",
    },
    {
        "name": "La Rochelle / Île de Ré",
        "score": 11.0,
        "verdict": "Saturée — porte parisienne uniquement",
        "summary": "Île de Ré = anomalie HNW (prix médian Saint-Martin > 13 000 €/m²) mais marché club verrouillé par paysagistes locaux. Porte d'entrée = prescripteur parisien (Sotheby's, Barnes, Daniel Féau Île de Ré).",
        "targets": "Sotheby's Île de Ré uniquement (canal parisien) · Oléron émergent (à observer Phase 3 2027)",
        "effort": "Déplacement 2-3 j/trimestre",
    },
]

# Sources : 4 catégories, listing nominal pour la page Paris hub
PARIS_HUB = {
    "agences": {
        "title": "Agences immo luxe",
        "items": ["Daniel Féau Châteaux", "Belles Demeures (Le Figaro)", "Sotheby's IR Paris (3 antennes)", "Barnes Paris", "Engel & Völkers (10 antennes)", "Emile Garcin", "Vaneau · Marc Foujols · John Taylor", "Christie's · Coldwell Banker · Junot"],
        "approach": "Book papier + LinkedIn direction (Sales Navigator)",
    },
    "presse": {
        "title": "Presse déco & lifestyle",
        "items": ["AD France (Marie Kalt)", "Maison & Jardin (Corine Allouch)", "Maison Côté Sud", "Elle Décoration (Danièle Gerkens)", "Côté Maison · Connaissance des Arts", "Le Figaro Magazine Propriétés"],
        "approach": "Dossier presse 4 p. A4, photos HD, cas client précis",
    },
    "salons": {
        "title": "Salons à investir",
        "items": ["Maison & Objet — janv. + sept. 2027", "Jardins Jardin Tuileries — 27-31 mai 2026", "AD Intérieurs — oct. 2026", "Salon Patrimoine Culturel — 29 oct.-1 nov. 2026"],
        "approach": "Visiteur ciblé (pas exposant en année 1), 8-10 RDV pré-agendés",
    },
    "cercles": {
        "title": "Cercles HNW",
        "items": ["Cercle de l'Union Interalliée", "Polo de Paris", "France-Amériques Club"],
        "approach": "Accès uniquement par invitation membre (via prescripteur converti)",
    },
}

TAKEAWAYS = [
    ("01", "Positionnement libre", "Designer paysagiste biophilique signature d'auteur — angle vacant sur l'ensemble du Sud-Ouest. À occuper avant qu'un concurrent le revendique."),
    ("02", "Concentration", "Bordeaux + Bassin d'Arcachon = moteur 12 mois. Toutes les ressources marketing/prospection y vont en priorité."),
    ("03", "Déplacement Côte Basque", "Malgré la distance, ticket B2B élevé + prescripteurs activables + foncier diversifié. RDV à grouper en nuitée."),
    ("04", "Périgord = mise en bouche", "Extension naturelle de Brive (50 min), marché domaines mature, Sotheby's Chavanne déjà identifié et activable."),
    ("05", "Paris = amplificateur", "Pas une zone de service — un canal de sourcing. HNW parisiens alimentent toutes les zones SO via agences luxe + presse."),
    ("06", "Atouts à mettre en avant", "Twinmotion 3D photoréaliste + études vendues séparément = différenciants mesurables vs concurrents locaux."),
]

# ============================================================================
# CSS — système de design (charte Studio Oliveira : noir / cream / rouge)
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

@page {
  size: A4;
  margin: 0;
}

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

.page--ink   { background: var(--ink); color: var(--cream); }
.page--cream { background: var(--cream); color: var(--ink); }
.page--warm  { background: var(--cream-warm); color: var(--ink); }

/* Bandeau page header (numéro + section + titre court) */
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

/* Pied : nom du doc + page */
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

/* Couches contenus ----------------------------------------------- */

.body {
  position: absolute;
  top: 28mm; left: 16mm; right: 16mm; bottom: 24mm;
}

/* Typo ----------------------------------------------------------- */

.display {
  font-family: 'Fraunces', serif;
  font-weight: 400;
  font-optical-sizing: auto;
  font-variation-settings: "opsz" 144;
  line-height: 0.96;
  letter-spacing: -0.02em;
}

.h1 {
  font-family: 'Fraunces', serif;
  font-weight: 400;
  font-size: 36pt;
  line-height: 1.02;
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

.lede {
  font-family: 'Fraunces', serif;
  font-weight: 300;
  font-size: 13pt;
  line-height: 1.35;
  letter-spacing: -0.005em;
}

.body-text { font-size: 9.5pt; line-height: 1.55; }
.body-text strong { font-weight: 600; }

.label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 7.5pt;
  letter-spacing: 0.5px;
  color: var(--moss);
  text-transform: uppercase;
}

.italic { font-style: italic; }
.red { color: var(--red); }
.moss { color: var(--moss); }

hr.rule {
  border: none;
  height: 1px;
  background: var(--ink);
  margin: 0;
}
hr.rule--soft { background: var(--rule); }
hr.rule--cream { background: var(--cream); opacity: 0.3; }

/* ===== COVER ===== */

.cover {
  background: var(--ink);
  color: var(--cream);
  padding: 22mm 18mm;
  display: flex; flex-direction: column; justify-content: space-between;
  height: 297mm;
}

.cover__top {
  display: flex; justify-content: space-between; align-items: flex-start;
  font-family: 'Inter', sans-serif;
  font-size: 8pt;
  letter-spacing: 2px;
  text-transform: uppercase;
}
.cover__top .brand { font-weight: 600; color: var(--cream); }
.cover__top .ref { color: var(--moss-soft); font-family: 'JetBrains Mono', monospace; letter-spacing: 0; }

.cover__main { max-width: 165mm; }
.cover__eyebrow {
  font-family: 'Inter', sans-serif;
  font-size: 9pt;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--red);
  margin-bottom: 10mm;
}
.cover__title {
  font-family: 'Fraunces', serif;
  font-weight: 300;
  font-variation-settings: "opsz" 144;
  font-size: 64pt;
  line-height: 0.94;
  letter-spacing: -0.025em;
  color: var(--cream);
}
.cover__title .em {
  font-style: italic;
  font-weight: 300;
  color: var(--red);
}
.cover__subtitle {
  font-family: 'Fraunces', serif;
  font-weight: 300;
  font-style: italic;
  font-size: 18pt;
  line-height: 1.3;
  color: var(--moss-soft);
  margin-top: 14mm;
  max-width: 145mm;
}

.cover__rule { width: 60mm; height: 1px; background: var(--red); margin-top: 18mm; }

.cover__meta {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12mm;
  margin-top: 8mm;
  font-family: 'Inter', sans-serif;
  font-size: 8.5pt;
  color: var(--cream);
}
.cover__meta .k {
  font-size: 7pt;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--moss-soft);
  margin-bottom: 2mm;
  font-weight: 500;
}
.cover__meta .v { font-weight: 500; line-height: 1.4; }

.cover__bottom {
  display: flex; align-items: baseline; justify-content: space-between;
  font-family: 'Inter', sans-serif;
  font-size: 7.5pt;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--moss-soft);
}

/* ===== EXEC SUMMARY ===== */

.exec-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 5mm;
  height: 100%;
}

.exec-kpi-row {
  grid-column: span 12;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0;
  border-top: 1px solid var(--ink);
  border-bottom: 1px solid var(--ink);
  padding: 6mm 0;
}
.exec-kpi {
  padding: 0 6mm;
  border-right: 1px solid var(--rule);
}
.exec-kpi:last-child { border-right: none; }
.exec-kpi .k {
  font-family: 'Inter', sans-serif;
  font-size: 7pt;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--moss);
  font-weight: 600;
  margin-bottom: 4mm;
}
.exec-kpi .v {
  font-family: 'Fraunces', serif;
  font-variation-settings: "opsz" 144;
  font-weight: 400;
  font-size: 34pt;
  line-height: 1;
  letter-spacing: -0.025em;
}
.exec-kpi .v.em { color: var(--red); }
.exec-kpi .legend {
  font-family: 'Inter', sans-serif;
  font-size: 8.5pt;
  color: var(--ink);
  margin-top: 4mm;
  line-height: 1.4;
}

/* ===== ZONE RANKING BAR CHART ===== */

.bar-row {
  display: grid;
  grid-template-columns: 8mm 60mm 1fr 30mm 35mm;
  gap: 4mm;
  align-items: center;
  padding: 4mm 0;
  border-bottom: 0.5px solid var(--rule);
}
.bar-row:last-child { border-bottom: none; }
.bar-row .rank {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  font-size: 12pt;
  color: var(--ink);
}
.bar-row .zone {
  font-family: 'Fraunces', serif;
  font-size: 13pt;
  font-weight: 500;
  letter-spacing: -0.005em;
  line-height: 1.1;
}
.bar-row .bar-wrap {
  height: 6mm;
  background: var(--cream-deep);
  position: relative;
  border-radius: 0;
}
.bar-row .bar {
  height: 100%;
  background: var(--ink);
}
.bar-row .bar--red { background: var(--red); }
.bar-row .bar--moss { background: var(--moss); }
.bar-row .score {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  font-size: 14pt;
  text-align: right;
  letter-spacing: -0.5px;
}
.bar-row .score sub {
  font-family: 'Inter', sans-serif;
  font-size: 8pt;
  color: var(--moss);
  letter-spacing: 1px;
}
.bar-row .verdict {
  font-family: 'Inter', sans-serif;
  font-size: 8pt;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-weight: 600;
  color: var(--moss);
}
.bar-row .verdict.red { color: var(--red); }

/* ===== HEATMAP ===== */

.heatmap {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
}
.heatmap th, .heatmap td {
  padding: 0;
  vertical-align: middle;
  text-align: center;
}
.heatmap thead th {
  font-family: 'Inter', sans-serif;
  font-size: 7.5pt;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--moss);
  padding: 0 0 4mm 0;
  border-bottom: 1px solid var(--ink);
}
.heatmap thead th.zone-col { text-align: left; padding-left: 0; width: 50mm; }
.heatmap tbody tr td.zone-name {
  font-family: 'Fraunces', serif;
  font-size: 10pt;
  font-weight: 500;
  text-align: left;
  padding: 4mm 4mm 4mm 0;
  border-bottom: 0.5px solid var(--rule);
}
.heatmap tbody td.cell {
  border-bottom: 0.5px solid var(--rule);
  height: 12mm;
  width: 12.5%;
}
.heatmap tbody td.cell .cell-inner {
  width: 18mm; height: 9mm;
  margin: 0 auto;
  display: flex; align-items: center; justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9pt;
  font-weight: 500;
  letter-spacing: 0.5px;
}
.cell-4 { background: var(--ink); color: var(--cream); }
.cell-3 { background: var(--ink); color: var(--cream); opacity: 0.78; }
.cell-2 { background: var(--cream-deep); color: var(--ink); }
.cell-1 { background: var(--cream-warm); color: var(--moss); }
.cell-0 { background: transparent; color: var(--moss-soft); border: 0.5px solid var(--rule); }

/* ===== ZONE FOCUS PAGE ===== */

.focus-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8mm;
  height: 100%;
}

.focus-kpis {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0;
  border-top: 1px solid var(--ink);
  border-bottom: 1px solid var(--ink);
}
.focus-kpi {
  padding: 5mm 4mm;
  border-right: 1px solid var(--rule);
}
.focus-kpi:last-child { border-right: none; }
.focus-kpi .v {
  font-family: 'Fraunces', serif;
  font-variation-settings: "opsz" 144;
  font-weight: 400;
  font-size: 22pt;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--red);
}
.focus-kpi .k {
  font-family: 'Inter', sans-serif;
  font-size: 7.5pt;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-top: 2mm;
  line-height: 1.3;
}
.focus-kpi .sub {
  font-family: 'Inter', sans-serif;
  font-size: 7pt;
  color: var(--moss);
  margin-top: 1mm;
  letter-spacing: 0.5px;
  line-height: 1.3;
}

.target-card {
  border-left: 2px solid var(--ink);
  padding: 3mm 0 3mm 4mm;
  margin: 0 0 4mm 0;
}
.target-card .nb {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  font-size: 9pt;
  color: var(--red);
  letter-spacing: 0.5px;
  margin-bottom: 1mm;
}
.target-card .nm {
  font-family: 'Fraunces', serif;
  font-weight: 500;
  font-size: 12pt;
  line-height: 1.15;
  margin-bottom: 0.5mm;
}
.target-card .ld {
  font-family: 'Inter', sans-serif;
  font-size: 8pt;
  color: var(--moss);
  margin-bottom: 2mm;
  line-height: 1.35;
}
.target-card .pt {
  font-family: 'Inter', sans-serif;
  font-size: 8.5pt;
  line-height: 1.45;
  margin-bottom: 1.5mm;
}
.target-card .kpi {
  font-family: 'JetBrains Mono', monospace;
  font-size: 7.5pt;
  letter-spacing: 0.5px;
  color: var(--ink);
  border-top: 0.5px solid var(--rule);
  padding-top: 1.5mm;
}
.target-card .kpi::before { content: "KPI · "; color: var(--moss); }

.callout {
  background: var(--cream-warm);
  padding: 4mm 5mm;
  margin: 2mm 0;
  border-left: 2px solid var(--red);
}
.callout .k {
  font-family: 'Inter', sans-serif;
  font-size: 7pt;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--red);
  margin-bottom: 1.5mm;
}
.callout .v {
  font-family: 'Fraunces', serif;
  font-size: 11pt;
  line-height: 1.35;
  font-weight: 400;
}
.callout--ink {
  background: var(--ink);
  color: var(--cream);
  border-left-color: var(--red);
}
.callout--ink .v { color: var(--cream); }
.callout--ink .k { color: var(--red); }

/* ===== SECONDARY CARDS ===== */

.cards-2x2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6mm;
  height: 100%;
}
.zone-card {
  border: 1px solid var(--ink);
  padding: 6mm 6mm;
  display: flex; flex-direction: column;
  background: var(--cream);
}
.zone-card .head {
  display: flex; justify-content: space-between; align-items: baseline;
  margin-bottom: 3mm;
  padding-bottom: 3mm;
  border-bottom: 0.5px solid var(--rule);
}
.zone-card .nm {
  font-family: 'Fraunces', serif;
  font-size: 14pt;
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.005em;
}
.zone-card .sc {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13pt;
  font-weight: 500;
  color: var(--ink);
}
.zone-card .sc sub { font-size: 8pt; color: var(--moss); letter-spacing: 1px; }
.zone-card .vd {
  font-family: 'Inter', sans-serif;
  font-size: 7.5pt;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 600;
  color: var(--red);
  margin-bottom: 3mm;
}
.zone-card .sm {
  font-family: 'Inter', sans-serif;
  font-size: 8.5pt;
  line-height: 1.5;
  flex: 1;
  margin-bottom: 3mm;
}
.zone-card .tg {
  font-family: 'Inter', sans-serif;
  font-size: 7.5pt;
  line-height: 1.45;
  color: var(--moss);
  padding-top: 2.5mm;
  border-top: 0.5px solid var(--rule);
}
.zone-card .tg strong { color: var(--ink); font-weight: 600; }
.zone-card .ef {
  font-family: 'JetBrains Mono', monospace;
  font-size: 7pt;
  letter-spacing: 0.5px;
  color: var(--ink);
  margin-top: 1.5mm;
}

/* ===== PARIS HUB ===== */

.paris-hub {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5mm 8mm;
}
.hub-block {
  border-top: 2px solid var(--ink);
  padding-top: 4mm;
}
.hub-block .ttl {
  font-family: 'Fraunces', serif;
  font-size: 14pt;
  font-weight: 500;
  margin-bottom: 1mm;
}
.hub-block .ap {
  font-family: 'Inter', sans-serif;
  font-size: 7.5pt;
  font-weight: 500;
  color: var(--red);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 3mm;
}
.hub-block ul {
  list-style: none; padding: 0; margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 8.5pt;
  line-height: 1.55;
}
.hub-block li { padding: 0.5mm 0; }
.hub-block li::before { content: "—  "; color: var(--moss); }

.paris-actions {
  border-top: 1px solid var(--ink);
  padding-top: 4mm;
  margin-top: 4mm;
}
.paris-action {
  display: grid;
  grid-template-columns: 14mm 1fr 28mm;
  gap: 4mm;
  align-items: baseline;
  padding: 2mm 0;
  border-bottom: 0.5px solid var(--rule);
}
.paris-action:last-child { border-bottom: none; }
.paris-action .m {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  font-size: 9pt;
  color: var(--red);
}
.paris-action .act {
  font-family: 'Inter', sans-serif;
  font-size: 9pt;
  line-height: 1.4;
}
.paris-action .bgt {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8pt;
  text-align: right;
  letter-spacing: 0;
  color: var(--ink);
  font-weight: 500;
}

/* ===== TIMELINE 12 MONTHS ===== */

.tl-grid {
  display: grid;
  grid-template-columns: 14mm 38mm 1fr 50mm;
  gap: 0;
  align-items: stretch;
  border-top: 1px solid var(--ink);
}
.tl-row {
  display: grid;
  grid-template-columns: 14mm 50mm 1fr 50mm;
  gap: 0;
  border-bottom: 0.5px solid var(--rule);
  padding: 2.4mm 0;
  align-items: start;
}
.tl-row > div { padding-right: 3mm; }
.tl-row .month {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10pt;
  font-weight: 500;
  color: var(--red);
  padding-top: 0.5mm;
}
.tl-row .action {
  font-family: 'Fraunces', serif;
  font-size: 11pt;
  font-weight: 500;
  line-height: 1.15;
  letter-spacing: -0.005em;
}
.tl-row .detail {
  font-family: 'Inter', sans-serif;
  font-size: 8.5pt;
  color: var(--moss);
  line-height: 1.4;
}
.tl-row .kpi {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8pt;
  color: var(--ink);
  letter-spacing: 0.3px;
  text-align: right;
  padding-right: 0;
}

/* ===== VISIBILITY — 4 cartes empilées (progression d'intensité) ===== */

.vl {
  border: 1px solid var(--ink);
  padding: 4mm 5mm;
  margin-bottom: 3mm;
}
.vl.lv-0 { background: var(--cream); border-left: 2px solid var(--moss-soft); }
.vl.lv-1 { background: var(--cream); border-left: 4px solid var(--moss); }
.vl.lv-2 { background: var(--cream-warm); border-left: 4px solid var(--ink); }
.vl.lv-3 { background: var(--ink); color: var(--cream); border-color: var(--ink); border-left: 4px solid var(--red); }

.vl-inner {
  display: flex;
  align-items: flex-start;
}
.vl-head {
  width: 48mm;
  padding-right: 4mm;
}
.vl-head .lbl {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8pt;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--red);
}
.vl-head .ttl {
  font-family: 'Fraunces', serif;
  font-size: 14pt;
  font-weight: 500;
  margin-top: 1mm;
  line-height: 1.1;
}
.vl-head .pd {
  font-family: 'Inter', sans-serif;
  font-size: 7.5pt;
  color: var(--moss);
  margin-top: 1mm;
  letter-spacing: 0.5px;
}
.vl.lv-3 .vl-head .pd { color: var(--moss-soft); }

.vl-actions {
  flex: 1;
  padding: 0 5mm;
  font-family: 'Inter', sans-serif;
  font-size: 8.5pt;
  line-height: 1.55;
}
.vl-actions ul { list-style: none; padding: 0; margin: 0; }
.vl-actions li { padding: 0.4mm 0; }
.vl-actions li::before { content: "—  "; color: var(--moss); }
.vl.lv-3 .vl-actions li::before { color: var(--moss-soft); }

.vl-budget {
  width: 32mm;
  padding-left: 5mm;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  font-size: 12pt;
  text-align: right;
  color: var(--ink);
  border-left: 1px solid var(--rule);
}
.vl.lv-3 .vl-budget { color: var(--red); border-left-color: rgba(245,241,234,0.2); }

.vl-target {
  font-family: 'Inter', sans-serif;
  font-size: 7.5pt;
  color: var(--moss);
  font-style: italic;
  padding-top: 2mm;
  margin-top: 2.5mm;
  border-top: 0.5px solid var(--rule);
}
.vl.lv-3 .vl-target { color: var(--moss-soft); border-top-color: rgba(245,241,234,0.2); }

/* ===== TOP 10 CONTACTS ===== */

.contact-row {
  display: grid;
  grid-template-columns: 10mm 56mm 1fr 56mm;
  gap: 4mm;
  align-items: start;
  padding: 2.6mm 0;
  border-bottom: 0.5px solid var(--rule);
}
.contact-row:last-child { border-bottom: none; }
.contact-row.priority-1 { background: var(--red-soft); padding-left: 3mm; }
.contact-row .pr {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  font-size: 9pt;
  color: var(--red);
  letter-spacing: 1px;
  padding-top: 0.5mm;
}
.contact-row.priority-2 .pr { color: var(--ink); }
.contact-row.priority-3 .pr { color: var(--moss); }
.contact-row .nm {
  font-family: 'Fraunces', serif;
  font-size: 12pt;
  font-weight: 500;
  line-height: 1.15;
}
.contact-row .org {
  font-family: 'Inter', sans-serif;
  font-size: 8pt;
  color: var(--moss);
  margin-top: 1mm;
  line-height: 1.35;
}
.contact-row .obj {
  font-family: 'Inter', sans-serif;
  font-size: 8.5pt;
  line-height: 1.45;
}
.contact-row .ch {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8pt;
  color: var(--ink);
  letter-spacing: 0;
  text-align: right;
  padding-top: 1mm;
}

/* ===== TAKEAWAYS 6 BLOCS ===== */

.take-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8mm;
}
.take-block {
  border-top: 2px solid var(--ink);
  padding-top: 4mm;
}
.take-block .n {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11pt;
  font-weight: 500;
  color: var(--red);
}
.take-block .t {
  font-family: 'Fraunces', serif;
  font-size: 15pt;
  font-weight: 500;
  line-height: 1.15;
  margin: 2mm 0 3mm 0;
  letter-spacing: -0.005em;
}
.take-block .d {
  font-family: 'Inter', sans-serif;
  font-size: 9pt;
  line-height: 1.5;
}

/* ===== BACK / SOURCES ===== */

.sources {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8mm;
}
.sources .col h4 {
  font-family: 'Inter', sans-serif;
  font-size: 7.5pt;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--red);
  margin: 0 0 3mm 0;
  padding-bottom: 2mm;
  border-bottom: 1px solid var(--ink);
}
.sources .col ul {
  list-style: none; padding: 0; margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 8.5pt;
  line-height: 1.6;
  color: var(--ink);
}
.sources .col li { padding: 0.5mm 0; }
"""


# ============================================================================
# HELPERS — fragments réutilisables
# ============================================================================

def page_chrome(num: str, crumb: str, page_total: str = "15") -> tuple[str, str]:
    """Retourne (head_html, foot_html) pour une page intérieure."""
    head = (
        f'<div class="page-head"><div class="crumb">{crumb}</div>'
        f'<div class="num">{num} / {page_total}</div></div>'
    )
    foot = (
        f'<div class="page-foot"><span>Studio J Oliveira — Étude de marché 2026</span>'
        f'<span class="pnum">{num}</span></div>'
    )
    return head, foot


def heatmap_cell_value(v: int) -> str:
    label = {0: "○", 1: "●", 2: "●●", 3: "●●●", 4: "●●●●"}[v]
    return f'<div class="cell-inner">{label}</div>'


# ============================================================================
# PAGES
# ============================================================================

def page_cover() -> str:
    return """
<section class="page cover">
  <div class="cover__top">
    <div class="brand">Studio J Oliveira</div>
    <div class="ref">SO-EM-2026.05 · v1.0</div>
  </div>

  <div class="cover__main">
    <div class="cover__eyebrow">Étude de marché — Mai 2026</div>
    <div class="cover__title">Où prospecter,<br/>qui contacter,<br/><span class="em">comment se faire connaître.</span></div>
    <div class="cover__subtitle">Synthèse opérationnelle — 8 zones analysées, 3 segments cibles, 1 plan d'action 12 mois.</div>
    <div class="cover__rule"></div>
    <div class="cover__meta">
      <div><div class="k">Destinataire</div><div class="v">Jonathan Oliveira</div></div>
      <div><div class="k">Préparé par</div><div class="v">Morgan · Mai 2026</div></div>
      <div><div class="k">Sources</div><div class="v">INSEE · Notaires de France · Atout France · Relais &amp; Châteaux · CNOA · Sotheby's · Barnes · presse spécialisée</div></div>
    </div>
  </div>

  <div class="cover__bottom">
    <div>Designer paysagiste biophilique — Sud-Ouest &amp; Paris</div>
    <div>Confidentiel — usage interne</div>
  </div>
</section>
"""


def page_executive() -> str:
    head, foot = page_chrome("02", "Sommaire exécutif")
    return f"""
<section class="page page--cream">
  {head}
  <div class="body">
    <div class="eyebrow">À retenir en une page</div>
    <div class="h1" style="margin-top: 4mm; max-width: 165mm;">
      Bordeaux + le Bassin sont, de très loin,<br/>la zone <span class="red italic">n°1.</span>
    </div>

    <div class="lede" style="margin-top: 12mm; max-width: 155mm; color: var(--ink);">
      La Côte Basque arrive en n°2, le Périgord en n°3. Brive, Limoges, Cognac et La Rochelle / Île de Ré sont <strong>secondaires</strong> — niche prestige, marché saturé ou volume HNW insuffisant pour s'y battre.
    </div>

    <div class="exec-kpi-row" style="margin-top: 18mm;">
      <div class="exec-kpi">
        <div class="k">Poids pipeline</div>
        <div class="v em">≈&nbsp;70 %</div>
        <div class="legend">Bordeaux + Côte Basque pèsent à elles deux 70 % du potentiel pipeline 12 mois.</div>
      </div>
      <div class="exec-kpi">
        <div class="k">Objectif 12 mois</div>
        <div class="v">8–12</div>
        <div class="legend">missions signées (mix B2C HNW + B2B premium), dont 3-4 à valeur de référence forte pour le book.</div>
      </div>
      <div class="exec-kpi">
        <div class="k">Angles libres</div>
        <div class="v">3</div>
        <div class="legend">Designer biophilique auteur · études vendues séparément · Twinmotion 3D photoréaliste.</div>
      </div>
    </div>

    <div class="eyebrow eyebrow--moss" style="margin-top: 14mm;">Trois actions dès la semaine 1</div>
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6mm; margin-top: 4mm;">
      <div style="border-left: 2px solid var(--ink); padding-left: 4mm;">
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 8pt; color: var(--red); letter-spacing: 1px;">01</div>
        <div class="h3" style="margin-top: 1mm;">RDV Marie-Céline Chavanne</div>
        <div style="font-size: 8.5pt; color: var(--moss); margin-top: 2mm; line-height: 1.4;">Périgord Sotheby's IR — Périgueux (50 min de Brive).</div>
      </div>
      <div style="border-left: 2px solid var(--ink); padding-left: 4mm;">
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 8pt; color: var(--red); letter-spacing: 1px;">02</div>
        <div class="h3" style="margin-top: 1mm;">Book + dossier presse</div>
        <div style="font-size: 8.5pt; color: var(--moss); margin-top: 2mm; line-height: 1.4;">Direction Sotheby's / Barnes / Daniel Féau Bordeaux + Cap-Ferret.</div>
      </div>
      <div style="border-left: 2px solid var(--ink); padding-left: 4mm;">
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 8pt; color: var(--red); letter-spacing: 1px;">03</div>
        <div class="h3" style="margin-top: 1mm;">Pitch presse AD + M&amp;J</div>
        <div style="font-size: 8.5pt; color: var(--moss); margin-top: 2mm; line-height: 1.4;">Marie Kalt (AD) · Corine Allouch (Maison &amp; Jardin) avec cas client Périgord / Bassin.</div>
      </div>
    </div>
  </div>
  {foot}
</section>
"""


def page_zone_ranking() -> str:
    head, foot = page_chrome("03", "Classement des 8 zones")
    rows = []
    max_score = 20.0
    for z in ZONES:
        pct = (z["score"] / max_score) * 100
        bar_class = {"red": "bar--red", "ink": "", "moss": "bar--moss"}[z["color"]]
        verdict_class = "red" if z["color"] == "red" else ""
        trophy = "★" if z["rank"] <= 2 else f'{z["rank"]:02d}'
        rows.append(f"""
<div class="bar-row">
  <div class="rank">{trophy}</div>
  <div class="zone">{z["name"]}</div>
  <div class="bar-wrap"><div class="bar {bar_class}" style="width: {pct:.1f}%;"></div></div>
  <div class="score">{z["score"]:g}<sub> / 20</sub></div>
  <div class="verdict {verdict_class}">{z["verdict"]}</div>
</div>""")
    paris_row = """
<div class="bar-row" style="margin-top: 4mm; padding-top: 6mm; border-top: 1px solid var(--ink);">
  <div class="rank" style="color: var(--moss);">—</div>
  <div class="zone"><span class="italic" style="font-weight: 400;">Paris</span> <span style="font-size: 9pt; color: var(--moss); font-family: 'Inter';">canal sourcing prescripteurs</span></div>
  <div class="bar-wrap"><div class="bar bar--moss" style="width: 80%; opacity: 0.5;"></div></div>
  <div class="score">8<sub> / 10</sub></div>
  <div class="verdict">Canal n°1</div>
</div>
"""
    return f"""
<section class="page page--cream">
  {head}
  <div class="body">
    <div class="eyebrow">Classement</div>
    <div class="h1" style="margin-top: 4mm; max-width: 170mm;">
      Sept zones, un classement <span class="italic">tranché.</span>
    </div>
    <div class="lede" style="margin-top: 6mm; max-width: 155mm; color: var(--ink);">
      Scoring /20 sur 5 axes pondérés : volume demande HNW (/6), B2B premium (/4), prescripteurs (/3), concurrence inversée (/4), accessibilité depuis Brive (/3). Détail dans `00-METHODOLOGIE.md`.
    </div>

    <div style="margin-top: 14mm;">
      {''.join(rows)}
      {paris_row}
    </div>

    <div class="callout" style="margin-top: 8mm;">
      <div class="k">Lecture rapide</div>
      <div class="v">Bordeaux + Côte Basque pèsent <strong>~ 70 %</strong> du pipeline 12 mois. Périgord = 15 %. Les 4 zones restantes cumulées = 15 %. Paris est l'<em>amplificateur</em> transverse.</div>
    </div>
  </div>
  {foot}
</section>
"""


def page_heatmap() -> str:
    head, foot = page_chrome("04", "Matrice typologie × foncier")
    body_rows = []
    for name, mu, cu, fr, dc in MATRIX:
        body_rows.append(f"""
<tr>
  <td class="zone-name">{name}</td>
  <td class="cell"><div class="cell-{mu}">{heatmap_cell_value(mu)}</div></td>
  <td class="cell"><div class="cell-{cu}">{heatmap_cell_value(cu)}</div></td>
  <td class="cell"><div class="cell-{fr}">{heatmap_cell_value(fr)}</div></td>
  <td class="cell"><div class="cell-{dc}">{heatmap_cell_value(dc)}</div></td>
</tr>""")
    return f"""
<section class="page page--cream">
  {head}
  <div class="body">
    <div class="eyebrow">Là où vendre quoi</div>
    <div class="h2" style="margin-top: 4mm; max-width: 175mm;">
      Une typologie ne se vend pas avec la même intensité <span class="italic">d'une zone à l'autre.</span>
    </div>

    <table class="heatmap" style="margin-top: 8mm;">
      <thead>
        <tr>
          <th class="zone-col">Zone</th>
          <th>Micro-urbain</th>
          <th>Cœur urbain</th>
          <th>Frange urbaine</th>
          <th>Domaines &amp; Caractère</th>
        </tr>
      </thead>
      <tbody>
        {''.join(body_rows)}
      </tbody>
    </table>

    <div style="display: flex; gap: 8mm; margin-top: 5mm; font-family: 'Inter'; font-size: 7.5pt; color: var(--moss); letter-spacing: 0.5px;">
      <span><strong style="color: var(--ink);">●●●●</strong> Fort</span>
      <span>●●● Bon</span>
      <span>●● Moyen</span>
      <span>● Faible</span>
      <span style="color: var(--moss-soft);">○ Nul</span>
    </div>

    <div class="callout callout--ink" style="margin-top: 6mm;">
      <div class="k">Implication directe</div>
      <div class="v" style="font-size: 10pt; line-height: 1.4;">Bordeaux centre : <strong>micro-urbain</strong> + <strong>cœur urbain</strong>. Sarlat/Cognac : <strong>domaines &amp; caractère</strong>. Île de Ré : <strong>cœur urbain</strong> + <strong>frange</strong>. Pricing étude : 1 200 € en micro-urbain → 6 500 € en domaines.</div>
    </div>
  </div>
  {foot}
</section>
"""


def page_zone_focus(slug: str, num: str) -> str:
    z = ZONE_FOCUS[slug]
    head, foot = page_chrome(num, f"Zoom — {z['name']}")
    kpi_html = "".join(
        f'<div class="focus-kpi"><div class="v">{v}</div><div class="k">{k}</div><div class="sub">{s}</div></div>'
        for v, k, s in z["kpis"]
    )
    targets_html = "".join(
        f"""<div class="target-card">
          <div class="nb">{t['n']}</div>
          <div class="nm">{t['name']}</div>
          <div class="ld">{t['lead']}</div>
          <div class="pt">{t['pitch']}</div>
          <div class="kpi">{t['kpi']}</div>
        </div>"""
        for t in z["targets"]
    )
    return f"""
<section class="page page--cream">
  {head}
  <div class="body">
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6mm;">
      <div class="eyebrow">Zoom — Zone n°{z['rank']}</div>
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 9pt; letter-spacing: 1px; color: var(--moss);">SCORE {z['score']:g}/20</div>
    </div>
    <div class="h1" style="max-width: 175mm;">{z['name']}</div>
    <div style="font-family: 'Inter', sans-serif; font-size: 8pt; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--red); margin-top: 4mm;">{z['tag']}</div>

    <div class="lede" style="margin-top: 8mm; max-width: 175mm; color: var(--ink);">
      {z['intro']}
    </div>

    <div class="focus-kpis" style="margin-top: 10mm;">{kpi_html}</div>

    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5mm; margin-top: 10mm;">
      {targets_html}
    </div>

    <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 6mm; margin-top: 6mm;">
      <div class="callout">
        <div class="k">Action semaine 1</div>
        <div class="v">{z['first_action']}</div>
      </div>
      <div style="border: 1px solid var(--rule-strong); padding: 4mm 5mm;">
        <div style="font-family: 'Inter'; font-size: 7pt; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--moss); margin-bottom: 1.5mm;">Vigilance</div>
        <div style="font-family: 'Inter'; font-size: 8.5pt; line-height: 1.45;">{z['watchout']}</div>
      </div>
    </div>
  </div>
  {foot}
</section>
"""


def page_secondary_zones() -> str:
    head, foot = page_chrome("08", "Zones secondaires")
    cards = "".join(
        f"""<div class="zone-card">
          <div class="head">
            <div class="nm">{c['name']}</div>
            <div class="sc">{c['score']:g}<sub> /20</sub></div>
          </div>
          <div class="vd">{c['verdict']}</div>
          <div class="sm">{c['summary']}</div>
          <div class="tg"><strong>Cibles :</strong> {c['targets']}<div class="ef">Effort estimé : {c['effort']}</div></div>
        </div>"""
        for c in SECONDARY_ZONES
    )
    return f"""
<section class="page page--cream">
  {head}
  <div class="body">
    <div class="eyebrow">Quatre zones, quatre rôles</div>
    <div class="h1" style="margin-top: 4mm; max-width: 175mm;">
      Pas le moteur — mais des relais <span class="italic">à entretenir.</span>
    </div>
    <div class="lede" style="margin-top: 6mm; max-width: 165mm; color: var(--ink);">
      Volumes HNW trop faibles, marchés saturés ou tissus prescripteurs limités. Maintenir une présence calibrée sans en faire le centre du chiffre d'affaires.
    </div>

    <div class="cards-2x2" style="margin-top: 12mm; height: calc(100% - 60mm);">
      {cards}
    </div>
  </div>
  {foot}
</section>
"""


def page_paris_hub() -> str:
    head, foot = page_chrome("09", "Paris — canal n°1 de sourcing")
    blocks = "".join(
        f"""<div class="hub-block">
          <div class="ttl">{v['title']}</div>
          <div class="ap">{v['approach']}</div>
          <ul>{''.join(f'<li>{x}</li>' for x in v['items'])}</ul>
        </div>"""
        for v in PARIS_HUB.values()
    )
    actions = [
        ("M1",  "Trio Paris : book papier + relance LinkedIn — David Mercier (Daniel Féau), Nathalie Garcin (Garcin), Sotheby's Propriétés", "≈ 800 €"),
        ("M2",  "Dossier presse AD France (Marie Kalt) + Le Figaro Propriétés", "≈ 200 €"),
        ("M3",  "Maison &amp; Objet janvier 2027 — visiteur ciblé + 8-10 RDV pré-agendés (architectes + agences luxe)", "≈ 1 500 €"),
        ("M4",  "Vernissage Studio à Paris — 30-40 prescripteurs (espace soirée + traiteur léger + projection Twinmotion 30 min)", "≈ 5 000 €"),
        ("M6-12",  "Invitation Cercle Union Interalliée via prescripteur converti (effort relationnel)", "0 €"),
    ]
    act_html = "".join(
        f'<div class="paris-action"><div class="m">{m}</div><div class="act">{a}</div><div class="bgt">{b}</div></div>'
        for m, a, b in actions
    )
    return f"""
<section class="page page--cream">
  {head}
  <div class="body">
    <div class="eyebrow">Paris</div>
    <div class="h2" style="margin-top: 3mm; max-width: 180mm;">
      <span class="italic">Pas</span> une zone de service. Le canal n°1 de <span class="red">sourcing prescripteurs.</span>
    </div>
    <div style="margin-top: 4mm; max-width: 170mm; font-family: 'Inter'; font-size: 9pt; line-height: 1.45;">
      Vous ne ferez pas de chantier à Paris. Mais les HNW parisiens qui achètent en résidence secondaire SO <strong>sont sourcés depuis Paris</strong>. Quatre catégories d'acteurs à activer en parallèle.
    </div>

    <div class="paris-hub" style="margin-top: 6mm;">
      {blocks}
    </div>

    <div class="eyebrow eyebrow--moss" style="margin-top: 6mm;">Top 5 actions Paris sur 12 mois — budget cumulé ≈ 7 500 €</div>
    <div class="paris-actions">
      {act_html}
    </div>
  </div>
  {foot}
</section>
"""


def page_timeline() -> str:
    head, foot = page_chrome("10", "Plan de prospection 12 mois")
    rows = "".join(
        f'<div class="tl-row"><div class="month">{m}</div><div class="action">{a}</div><div class="detail">{d}</div><div class="kpi">{k}</div></div>'
        for m, a, d, k in TIMELINE
    )
    return f"""
<section class="page page--cream">
  {head}
  <div class="body">
    <div class="eyebrow">Calendrier opérationnel</div>
    <div class="h1" style="margin-top: 3mm; max-width: 175mm;">
      Un mois, une action <span class="italic">structurante.</span>
    </div>
    <div style="margin-top: 4mm; max-width: 170mm; font-family: 'Inter'; font-size: 9pt; line-height: 1.45;">
      Calendrier resserré, focalisé sur les zones prioritaires. À ajuster selon votre rythme et vos retours terrain.
    </div>

    <div style="margin-top: 8mm; border-top: 1px solid var(--ink);">
      {rows}
    </div>

    <div class="callout callout--ink" style="margin-top: 5mm;">
      <div class="k">Objectif 12 mois</div>
      <div class="v"><strong>8 à 12 missions signées</strong> — mix B2C HNW + B2B premium, dont 3-4 à valeur de référence forte pour le book.</div>
    </div>
  </div>
  {foot}
</section>
"""


def page_visibility() -> str:
    head, foot = page_chrome("11", "Plan visibilité — 4 niveaux progressifs")
    lvls = []
    for i, lv in enumerate(VISIBILITY_LEVELS):
        lis = "".join(f"<li>{a}</li>" for a in lv["actions"])
        lvls.append(f"""<div class="vl lv-{i}">
          <div class="vl-inner">
            <div class="vl-head">
              <div class="lbl">{lv['label']}</div>
              <div class="ttl">{lv['title']}</div>
              <div class="pd">{lv['period']}</div>
            </div>
            <div class="vl-actions"><ul>{lis}</ul></div>
            <div class="vl-budget">{lv['budget']}</div>
          </div>
          <div class="vl-target">{lv['target']}</div>
        </div>""")
    return f"""
<section class="page page--cream">
  {head}
  <div class="body">
    <div class="eyebrow">Plan visibilité</div>
    <div class="h2" style="margin-top: 3mm; max-width: 180mm;">
      Quatre paliers, une <span class="italic">progression conditionnée.</span>
    </div>
    <div style="margin-top: 4mm; max-width: 175mm; font-family: 'Inter'; font-size: 9pt; line-height: 1.45;">
      <strong>La pub n'est pas une dépense — c'est un investissement proportionnel aux retours.</strong> CAC cible &lt; 10 % du ticket : max 120 € pour un lead micro-urbain à 1 200 €, max 650 € pour un lead domaines à 6 500 €.
    </div>

    <div style="margin-top: 6mm;">
      {''.join(lvls)}
    </div>

    <div style="margin-top: 4mm; font-family: 'Inter'; font-size: 7pt; letter-spacing: 0.5px; color: var(--moss); font-style: italic; line-height: 1.4;">
      Canaux gratuits toujours actifs en parallèle : Google Business Profile · Instagram organique · cold mail prescripteurs · témoignages clients · référencement croisé partenaires.
    </div>
  </div>
  {foot}
</section>
"""


def page_top_contacts() -> str:
    head, foot = page_chrome("12", "Top 10 contacts — semaine 1")
    rows = "".join(
        f'<div class="contact-row priority-{p}"><div class="pr">P{p}</div><div><div class="nm">{n}</div><div class="org">{o}</div></div><div class="obj">{obj}</div><div class="ch">{c}</div></div>'
        for p, n, o, c, obj in CONTACTS
    )
    return f"""
<section class="page page--cream">
  {head}
  <div class="body">
    <div class="eyebrow">Top 10 — semaine 1</div>
    <div class="h2" style="margin-top: 3mm; max-width: 180mm;">
      <span class="italic">Deux</span> contacts par semaine. Les dix traités d'ici fin du mois 1.
    </div>
    <div style="margin-top: 4mm; max-width: 170mm; font-family: 'Inter'; font-size: 9pt; line-height: 1.45;">
      Pas de mass mailing. Chaque approche est personnalisée, avec un angle spécifique à l'interlocuteur. Trois niveaux de priorité — <span class="red"><strong>P1 (rouge)</strong></span> à activer en premier.
    </div>

    <div style="margin-top: 6mm; border-top: 1px solid var(--ink);">
      {rows}
    </div>
  </div>
  {foot}
</section>
"""


def page_takeaways() -> str:
    head, foot = page_chrome("13", "Take-aways")
    blocks = "".join(
        f'<div class="take-block"><div class="n">{n}</div><div class="t">{t}</div><div class="d">{d}</div></div>'
        for n, t, d in TAKEAWAYS
    )
    return f"""
<section class="page page--cream">
  {head}
  <div class="body">
    <div class="eyebrow">Take-aways</div>
    <div class="h1" style="margin-top: 4mm; max-width: 175mm;">
      Six choses à garder<br/>en tête <span class="italic">à partir d'aujourd'hui.</span>
    </div>

    <div class="take-grid" style="margin-top: 16mm;">
      {blocks}
    </div>

    <div class="callout callout--ink" style="margin-top: 12mm;">
      <div class="k">Ce qui reste à faire de votre côté</div>
      <div class="v" style="font-size: 10pt; line-height: 1.5;">
        Valider la liste des 10 contacts prioritaires + bloquer 2 demi-journées/semaine pour la prospection · Préparer un <strong>book papier 16 pages</strong> avec 3 à 5 cas clients (un par typologie idéalement) · Mettre en place la fiche Google Business Profile · Définir avec Morgan un point trimestriel (M3 / M6 / M9 / M12).
      </div>
    </div>
  </div>
  {foot}
</section>
"""


def page_back() -> str:
    head, foot = page_chrome("14", "Méthodologie & sources")
    return f"""
<section class="page page--ink">
  {head}
  <div class="body">
    <div class="eyebrow">Méthodologie</div>
    <div class="h1" style="margin-top: 4mm; max-width: 175mm; color: var(--cream);">
      Sourcing, scoring, <span class="italic" style="color: var(--red);">limites assumées.</span>
    </div>

    <div style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 12mm; margin-top: 14mm;">
      <div>
        <div class="eyebrow eyebrow--moss" style="color: var(--moss-soft);">Scoring /20 — 5 axes pondérés</div>
        <ul style="list-style: none; padding: 0; margin: 4mm 0 0 0; font-family: 'Inter'; font-size: 9pt; line-height: 1.7; color: var(--cream);">
          <li>—  Axe A — Volume demande HNW <span style="font-family: 'JetBrains Mono'; color: var(--moss-soft);">/6</span></li>
          <li>—  Axe B — B2B premium (hôtels, restos étoilés, bureaux) <span style="font-family: 'JetBrains Mono'; color: var(--moss-soft);">/4</span></li>
          <li>—  Axe C — Densité prescripteurs activables <span style="font-family: 'JetBrains Mono'; color: var(--moss-soft);">/3</span></li>
          <li>—  Axe D — Concurrence inversée (moins = mieux) <span style="font-family: 'JetBrains Mono'; color: var(--moss-soft);">/4</span></li>
          <li>—  Axe E — Accessibilité depuis Brive <span style="font-family: 'JetBrains Mono'; color: var(--moss-soft);">/3</span></li>
        </ul>

        <div class="eyebrow eyebrow--moss" style="color: var(--moss-soft); margin-top: 10mm;">Règle absolue</div>
        <div style="font-family: 'Fraunces'; font-style: italic; font-size: 14pt; line-height: 1.3; margin-top: 3mm; color: var(--cream); max-width: 90mm;">
          Aucune invention. Sourcing systématique. <span class="moss">[DONNÉE À CONFIRMER]</span> quand non trouvable.
        </div>
      </div>

      <div>
        <div class="eyebrow eyebrow--moss" style="color: var(--moss-soft);">Sources</div>
        <ul style="list-style: none; padding: 0; margin: 4mm 0 0 0; font-family: 'Inter'; font-size: 8.5pt; line-height: 1.7; color: var(--cream);">
          <li>—  INSEE Filosofi — foyers fiscaux IFI par commune</li>
          <li>—  Notaires de France · MeilleursAgents — prix m²</li>
          <li>—  PERVAL — volumes transactions &gt; 800 k€</li>
          <li>—  Atout France · AirDNA — hôtellerie premium</li>
          <li>—  Relais &amp; Châteaux · Châteaux &amp; Hôtels Collection · Teritoria</li>
          <li>—  CNOA — annuaires architectes par département</li>
          <li>—  Sotheby's IR · Barnes · Daniel Féau · Emile Garcin · Engel &amp; Völkers</li>
          <li>—  AD France · Maison &amp; Jardin · Côté Sud · Connaissance des Arts</li>
          <li>—  Recherches Google Maps + presse spécialisée régionale</li>
        </ul>

        <div class="eyebrow eyebrow--moss" style="color: var(--moss-soft); margin-top: 10mm;">Data gaps loggés à combler — Phase 2</div>
        <ul style="list-style: none; padding: 0; margin: 4mm 0 0 0; font-family: 'Inter'; font-size: 8.5pt; line-height: 1.6; color: var(--cream);">
          <li>—  INSEE Filosofi foyers &gt; 100 k€ commune-par-commune</li>
          <li>—  PERVAL volumes transactions &gt; 800 k€ département-par-département</li>
          <li>—  AirDNA tarification Airbnb premium</li>
          <li>—  CNOA architectes nominatifs par département</li>
          <li>—  Family offices / CGP locaux Sud-Ouest</li>
          <li>—  Statuts d'exploitation hôtels cités (à vérifier en direct)</li>
        </ul>
      </div>
    </div>

    <div style="position: absolute; bottom: 22mm; left: 16mm; right: 16mm; padding-top: 6mm; border-top: 0.5px solid rgba(245,241,234,0.2);">
      <div style="display: flex; justify-content: space-between; align-items: baseline; font-family: 'Inter'; font-size: 8pt; color: var(--moss-soft);">
        <div>Étude versionnée dans le repo : <span style="font-family: 'JetBrains Mono';">_brief/etude-de-marche/</span></div>
        <div style="letter-spacing: 1.5px; text-transform: uppercase;">v1.0 — Mai 2026</div>
      </div>
    </div>
  </div>
  {foot}
</section>
"""


def page_colophon() -> str:
    return """
<section class="page page--ink" style="display: flex; flex-direction: column; justify-content: space-between;">
  <div style="padding: 22mm 18mm 0 18mm; flex: 1; display: flex; align-items: center; justify-content: center;">
    <div style="max-width: 150mm; text-align: left;">
      <div style="font-family: 'Inter'; font-size: 8pt; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: var(--red);">Fin du document</div>
      <div class="display" style="font-size: 38pt; color: var(--cream); margin-top: 8mm; line-height: 0.98; max-width: 150mm;">
        Vous avez du <span class="italic" style="color: var(--red);">talent</span> — il manquait la visibilité.<br/>
        <span style="font-style: italic; color: var(--moss-soft); font-size: 22pt; display: inline-block; margin-top: 6mm;">À partir d'aujourd'hui, c'est rattrapable.</span>
      </div>
    </div>
  </div>

  <div style="padding: 18mm; display: flex; justify-content: space-between; align-items: baseline; font-family: 'Inter'; font-size: 7.5pt; color: var(--moss-soft); letter-spacing: 1.5px; text-transform: uppercase;">
    <div>Studio J Oliveira — 41 rue Général Souham, 19100 Brive-la-Gaillarde</div>
    <div style="font-family: 'JetBrains Mono'; letter-spacing: 0;">SO-EM-2026.05 · 15 / 15</div>
  </div>
</section>
"""


# ============================================================================
# ASSEMBLY
# ============================================================================

def build_html() -> str:
    pages = [
        page_cover(),                          # 1
        page_executive(),                      # 2
        page_zone_ranking(),                   # 3
        page_heatmap(),                        # 4
        page_zone_focus("bordeaux", "05"),     # 5
        page_zone_focus("cotebasque", "06"),   # 6
        page_zone_focus("perigord", "07"),     # 7
        page_secondary_zones(),                # 8
        page_paris_hub(),                      # 9
        page_timeline(),                       # 10
        page_visibility(),                     # 11
        page_top_contacts(),                   # 12
        page_takeaways(),                      # 13
        page_back(),                           # 14
        page_colophon(),                       # 15
    ]
    pages_html = "\n".join(pages)
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Studio J Oliveira — Étude de marché 2026</title>
</head>
<body>
{pages_html}
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
