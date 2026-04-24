/*
 * Métadonnées des projets d'étude exposés en galerie.
 *
 * Source noms & territoires : dossiers _brief/client-assets/photos-projets/.
 * Textes : extraits du PDF "Process études Studio 2026" de Jonathan Oliveira
 * (voir _brief/client-docs/). Chaque extrait est marqué pour que le lecteur
 * comprenne qu'il s'agit d'un texte direct du concepteur, pas d'une invention.
 */

export interface ProjetMeta {
  nom: string;
  lieu: string;
  typologieSlug: string;
  statut: 'Étude' | 'Livré' | 'En chantier';
  resume: string;
}

// Indexé par slug de typologie/verticale
export const PROJETS_PAR_SLUG: Record<string, ProjetMeta> = {
  'coeur-urbain': {
    nom: 'Parenthèse exotique',
    lieu: 'Cœur de Brive-la-Gaillarde',
    typologieSlug: 'coeur-urbain',
    statut: 'Étude',
    resume:
      'Jardin confiné en secteur patrimonial, parenthèse nocturne luxuriante entre les murs de la vieille ville. Pergola architecturée, palette tropicale sélectionnée pour la tenue ombre-humidité, éclairage architectural millimétré sur la structure.',
  },
  'frange-urbaine': {
    nom: 'Restanque corrézienne',
    lieu: 'Hauteurs de Brive — frange urbaine',
    typologieSlug: 'frange-urbaine',
    statut: 'Étude',
    resume:
      "Propriété en restanque avec forts dénivelés, surplombant le paysage urbain. Structure d'ouvrages paysagers (soutènement, platelage, bassin), pin parasol conservé, palmier phare. Esthétique méditerranéenne assumée dans un contexte corrézien.",
  },
  'domaine-caractere': {
    nom: 'Domaine corrézien — Provence intérieure',
    lieu: 'Corrèze rurale',
    typologieSlug: 'domaine-caractere',
    statut: 'Étude',
    resume:
      "Demeure patrimoniale en pierre de couleur, jardin segmenté en zones (terrasse d'accueil, zones d'intimité, parc arboré). Stratégie de conception étalée pour rendre le jardin compréhensible sur l'ensemble du domaine, conservation des sujets arborés.",
  },
  'micro-urbain': {
    nom: 'Jungle Room — Agde',
    lieu: 'Agde (Hérault) — collaboration Atelier Laura Levadoux',
    typologieSlug: 'micro-urbain',
    statut: 'Livré',
    resume:
      "Logement atypique courte durée : hyper-densification végétale d'un volume restreint. Mur végétal immersif HSP 5 m, jardinières garde-corps, mezzanine végétalisée. Le végétal comme matériau structurant d'un espace lu comme une pièce à part entière.",
  },
  // Verticales
  restauration: {
    nom: 'Café de Paris',
    lieu: 'Brive-la-Gaillarde',
    typologieSlug: 'restauration',
    statut: 'Livré',
    resume:
      "Reprise de l'atmosphère d'un bistrot patrimonial par le végétal : mur végétal dense en fond de salle, suspensions rotin, feuillages tropicaux contre verrière. Conception coordonnée avec le design intérieur — le végétal devient signature de marque.",
  },
  'airbnb-locations-atypiques': {
    nom: 'Airbnb Jungle Room',
    lieu: 'Agde (Hérault)',
    typologieSlug: 'airbnb-locations-atypiques',
    statut: 'Livré',
    resume:
      "Location courte durée où le végétal devient l'argument commercial principal. Travail sur les ambiances photogéniques, la densité végétale structurante et la robustesse des essences (faible entretien, rotation locative soutenue).",
  },
  hotellerie: {
    nom: 'Références hôtellerie',
    lieu: 'Projets en études & acquis Airbnb',
    typologieSlug: 'hotellerie',
    statut: 'Étude',
    resume:
      "[À FOURNIR PAR JONATHAN : projet hôtelier dédié. Visuels actuels dérivés du projet Airbnb Jungle Room — atmosphère proche de l'hôtellerie boutique haut de gamme.]",
  },
};

// Extraits texte du PDF process études (source citée, pas d'invention)
export const PDF_EXTRAITS_TYPOLOGIES: Record<string, string> = {
  'micro-urbain':
    "Dans le contexte hyper-centre ville, la typologie concentre l'ensemble des propriétés possédant des espaces extérieurs réduits et très enclavés. Elle se caractérise par des terrasses, des roof tops ou même des patios intérieurs et extérieurs. L'identité principale de cette typologie repose sur la connexion étroite entre l'intérieur et l'extérieur, où l'espace extérieur se définit comme une pièce à part entière de l'habitation, en total prolongement de la pièce adjacente. La complexité repose sur le support ouvrage (terrasses, roof tops : étude structurelle approfondie) et les conditions spécifiques des patios (ombre forte, humidité accrue, faible disponibilité au sol pour fondations et développement racinaire).",
  'coeur-urbain':
    "Concentre des propriétés et habitations principalement anciennes, à fort caractère patrimonial local — l'architecture porte les marques de l'histoire de la ville. Les espaces extérieurs sont souvent très restreints (100 à 150 m² en moyenne), très enchevêtrés par les bâtiments alentours. Les contraintes internes (accès, disponibilité aérienne et pédologique, voisinage) et externes (proximité de monuments historiques, restrictions ABF, PLU) en font des espaces à très forte complexité. C'est une typologie de jardin très technique, très risquée, très précieuse et très stratégique. L'étude administrative constitue une grosse partie de la pré-étude. La conception est très millimétrée en phase projet pour assurer la pérennité des ouvrages existants avec ceux en création.",
  'frange-urbaine':
    "Concentre principalement des résidences principales, organisées en lotissements ou propriétés individuelles. Certaines jouent avec la limite urbain-rural mais une forte dominance nature urbaine est présente. On y trouve des jardins ouverts, souvent dans les hauteurs de la ville, surplombant le paysage urbain — points de vue et perspectives très recherchés par les propriétaires. La complexité réside dans le contexte environnemental et topographique, souvent en fort dénivelé : la structuration des jardins doit s'accompagner d'ouvrages considérables (soutènement, platelages) pour assurer fonctionnalité et pérennité. Territoire instable entre nature et ville, conception poussée sur les ouvrages paysagers.",
  'domaine-caractere':
    "Demeures d'exception — châteaux, manoirs, domaines — propriétés de renom chargées d'histoire avec un fort caractère patrimonial, en général en milieu rural. Se constitue également de demeures atypiques : granges rénovées, anciens bâtis industriels reconvertis, pépites architecturales régionales. Les jardins s'organisent naturellement en plusieurs zones géographiques — zones fonctionnelles proches de la demeure, zones transitoires, zones paysagères arborées lointaines. Segmenter la conception est une priorité pour conserver la compréhension du projet en phase pré-étude et étude. L'envergure des jardins nécessite un travail de fond long ; la réalisation sera forcément segmentée, impliquant une rémunération échelonnée dans le temps.",
};
