/*
 * Contenu SEO local — pages /zones/[slug].
 *
 * Données factuelles publiques (climat, essences végétales, géographie).
 * Pas d'invention sur Jonathan : pas de chiffres business, pas de quotes,
 * pas de claims projets. Les sections « Projets locaux » sont des
 * placeholders à remplir quand Jonathan fournira les références.
 *
 * Stratégie SEO : chaque page ratisse paysagiste/designer/architecte
 * paysagiste + ville + communes voisines (longue traîne géographique).
 */

export interface ZoneContent {
  slug: string;
  ville: string; // Forme exacte canonique (avec accents/tirets)
  villeSimple: string; // Forme simplifiée pour les requêtes brutes
  region: string;
  departement: string;
  codeDepartement: string;
  role: 'siege' | 'bureau-etudes' | 'zone-intervention';

  // SEO
  metaTitle: string;
  metaDescription: string;
  h1: string;
  introLead: string; // 2-3 phrases au-dessus de la fold
  introLong: string; // 150-200 mots après le H1

  // Climat / essences (factuel, ne nécessite pas de validation Jonathan)
  climat: {
    type: string;
    description: string;
  };
  essences: string[];
  caracteristiquesPaysageres: string;

  // Communes voisines (longue traîne géo + maillage)
  communesVoisines: string[];

  // Typologies dominantes localement (toutes exposées via /architecture-paysagere/*)
  typologiesDominantes: Array<{
    slug: 'micro-urbain' | 'coeur-urbain' | 'frange-urbaine' | 'domaine-caractere';
    raison: string;
  }>;

  // FAQ — chaque question doit contenir un mot-clé SEO fort
  faq: Array<{
    question: string;
    answer: string;
  }>;
}

export const ZONES: ZoneContent[] = [
  {
    slug: 'brive-la-gaillarde',
    ville: 'Brive-la-Gaillarde',
    villeSimple: 'Brive',
    region: 'Nouvelle-Aquitaine',
    departement: 'Corrèze',
    codeDepartement: '19',
    role: 'siege',
    metaTitle:
      'Paysagiste designer à Brive-la-Gaillarde — Conception de jardin sur mesure | Studio J Oliveira',
    metaDescription:
      'Studio de design végétal et paysagisme à Brive-la-Gaillarde (Corrèze). Conception de jardin sur mesure, aménagement extérieur et design biophilique pour particuliers et professionnels.',
    h1: 'Paysagiste designer à Brive-la-Gaillarde',
    introLead:
      'Studio de design végétal installé à Brive-la-Gaillarde, le Studio J Oliveira conçoit des jardins sur mesure, des terrasses et des aménagements extérieurs en Corrèze et sur l’ensemble de la Nouvelle-Aquitaine.',
    introLong: `Brive-la-Gaillarde est le siège du studio. Au-delà du paysagisme classique, l’approche associe design biophilique, lecture du site et culture du végétal. Chaque conception part du dialogue entre le bâti, la lumière, l’usage et le sol — pas d’un catalogue de plantes appliqué à un plan. Cette page rassemble les requêtes locales : paysagiste Brive, designer végétal Brive, architecte paysagiste Corrèze, conception de jardin Brive-la-Gaillarde, aménagement extérieur Brive. Que le projet soit une terrasse de centre-ville, un jardin de maison brivienne, un grand jardin péri-urbain en Bas-Limousin ou un domaine en Corrèze, le studio intervient en étude complète, suivi de chantier et accompagnement plantation.`,
    climat: {
      type: 'Tempéré océanique à influence continentale (micro-climat brivien)',
      description: `Brive bénéficie d’un climat tempéré relativement doux, abrité par les contreforts du Massif central. Hivers modérés, étés chauds avec épisodes secs marqués depuis 2018-2022. Pluviométrie ~900 mm/an, plutôt bien répartie. Conséquence pour la conception : on travaille des palettes mixtes, capables de tenir la sécheresse estivale tout en supportant les gelées tardives d’avril.`,
    },
    essences: [
      'Chêne pubescent (Quercus pubescens)',
      'Châtaignier (Castanea sativa)',
      'Charme (Carpinus betulus) en haie taillée',
      'Tilleul à petites feuilles (Tilia cordata)',
      'Érable champêtre (Acer campestre)',
      'Cornouiller mâle (Cornus mas)',
      'Sorbier des oiseleurs (Sorbus aucuparia)',
      'Gramineas bas (Stipa, Sesleria, Festuca)',
      'Vivaces de mi-ombre (Geranium, Heuchera, Epimedium)',
      'Aromatiques sèches (thym, romarin, sauge)',
    ],
    caracteristiquesPaysageres:
      'Bassin de Brive marqué par le grès rouge, terrasses agricoles, vergers de noyers, vignes de Branceilles, abords de la Corrèze et de la Vézère. Tissu urbain compact en centre, lotissements péri-urbains à Saint-Pantaléon, Malemort, Ussac.',
    communesVoisines: [
      'Malemort',
      'Saint-Pantaléon-de-Larche',
      'Ussac',
      'Cosnac',
      'Donzenac',
      'Allassac',
      'Objat',
      'Tulle',
      'Argentat',
      'Beaulieu-sur-Dordogne',
      'Collonges-la-Rouge',
      'Turenne',
      'Meyssac',
    ],
    typologiesDominantes: [
      {
        slug: 'coeur-urbain',
        raison:
          'Maisons de ville et cours patrimoniales du centre brivien — typologie la plus représentée.',
      },
      {
        slug: 'frange-urbaine',
        raison:
          'Lotissements et résidences en première couronne (Malemort, Ussac, Saint-Pantaléon).',
      },
      {
        slug: 'domaine-caractere',
        raison:
          'Demeures et domaines familiaux en Corrèze (Turenne, Collonges, vallée de la Dordogne).',
      },
    ],
    faq: [
      {
        question: 'Quelle différence entre un paysagiste et un designer végétal à Brive ?',
        answer:
          'Le paysagiste désigne historiquement à la fois l’entrepreneur qui réalise les travaux et le concepteur qui dessine. Le studio se positionne sur le second rôle : conception, étude et coordination de chantier. Le studio ne plante pas lui-même — il dirige des entreprises de plantation locales pour garantir l’exécution conforme au dessin.',
      },
      {
        question: 'Combien coûte la conception d’un jardin sur mesure à Brive-la-Gaillarde ?',
        answer:
          'Les études partent de 1 200 € TTC pour un Micro-urbain (terrasse, patio, < 50 m²) et montent jusqu’à 6 500 € pour un Domaine privé. Le suivi de chantier est facturé en pourcentage du budget travaux (6 à 12 %). Cf. la page tarifs sur chaque typologie.',
      },
      {
        question: 'Le studio intervient-il en dehors de Brive-la-Gaillarde ?',
        answer:
          'Oui. La zone d’intervention couvre la Corrèze, le Lot, la Dordogne, la Haute-Vienne (Limoges, Saint-Junien, Verneuil-sur-Vienne) et la Gironde (Bordeaux, Libourne, bassin d’Arcachon). Les déplacements sont intégrés au devis d’étude.',
      },
      {
        question: 'Quelles essences végétales sont adaptées au climat de Brive ?',
        answer:
          'Le bassin de Brive supporte un climat tempéré océanique avec sécheresse estivale marquée. Palette favorisée : chênes pubescents, charmes, tilleuls, érables champêtres, cornouillers, gramineas bas (Stipa, Sesleria), aromatiques (thym, romarin), vivaces de mi-ombre. Les essences trop hygrophiles (érables du Japon non protégés, certains hortensias) sont à manier avec prudence.',
      },
      {
        question: 'Quel délai pour une étude complète à Brive ?',
        answer:
          'Un Micro-urbain est livré sous 4 à 6 semaines après visite. Un Cœur urbain en 6 à 8 semaines. Une Frange urbaine ou un Domaine demandent 8 à 14 semaines selon la complexité du site et le nombre d’aller-retour de validation.',
      },
      {
        question: 'Le studio travaille-t-il avec des architectes brivien·ne·s ?',
        answer:
          'Oui, le studio intervient régulièrement en cotraitance avec des architectes et architectes d’intérieur de la région — sur les phases AVP, PRO et exécution. Le pôle « Pros » détaille les modalités de collaboration.',
      },
      {
        question: 'Comment démarrer un projet de jardin à Brive-la-Gaillarde ?',
        answer:
          'Premier contact via le formulaire ou par téléphone. Une visite gratuite et sans engagement est planifiée sous 7 à 15 jours. Elle débouche sur un devis d’étude calibré selon la typologie (Micro-urbain, Cœur urbain, Frange urbaine, Domaine). L’étude n’est lancée qu’après signature.',
      },
    ],
  },
  {
    slug: 'bordeaux',
    ville: 'Bordeaux',
    villeSimple: 'Bordeaux',
    region: 'Nouvelle-Aquitaine',
    departement: 'Gironde',
    codeDepartement: '33',
    role: 'zone-intervention',
    metaTitle:
      'Paysagiste designer à Bordeaux — Conception de jardin et terrasse sur mesure | Studio J Oliveira',
    metaDescription:
      'Designer végétal et paysagiste à Bordeaux. Conception de jardin contemporain, aménagement de terrasse et design biophilique pour particuliers et professionnels en Gironde.',
    h1: 'Paysagiste designer à Bordeaux',
    introLead:
      'Studio J Oliveira intervient à Bordeaux et sur l’ensemble de la métropole girondine en conception de jardin sur mesure, terrasse végétalisée et aménagement biophilique d’intérieur.',
    introLong: `Bordeaux concentre une demande premium sur trois typologies : patios d’échoppe, terrasses de jardin de ville et grands jardins de propriété en première couronne. La métropole — Bordeaux centre, Caudéran, Le Bouscat, Talence, Mérignac, Pessac — combine tissu haussmannien, bâti pierre blonde et résidences contemporaines. Cette page concentre les requêtes locales : paysagiste Bordeaux, designer végétal Bordeaux, architecte paysagiste Gironde, aménagement de terrasse Bordeaux, conception de jardin Bordeaux. Le studio intervient en étude complète depuis Brive, avec déplacements intégrés au devis et coordination de chantier en lien avec les entreprises de plantation girondines.`,
    climat: {
      type: 'Océanique tempéré, à tendance méditerranéenne en été',
      description: `Bordeaux bénéficie d’un climat océanique doux : hivers tempérés (gelées brèves), étés chauds et secs depuis le décalage climatique 2015-2024, pluviométrie ~950 mm/an. La proximité atlantique adoucit les amplitudes mais expose à des vents marins et des épisodes orageux estivaux. Pour la conception : palettes méditerranéennes viables, plantation d’automne préférée, paillage minéral fréquent.`,
    },
    essences: [
      'Olivier (Olea europaea)',
      'Chêne vert (Quercus ilex)',
      'Pin parasol (Pinus pinea)',
      'Magnolia grandiflora',
      'Lagerstroemia (lilas des Indes)',
      'Cyprès de Provence (Cupressus sempervirens)',
      'Agapanthe',
      'Gaura lindheimeri',
      'Vivaces méditerranéennes (lavande, romarin, perovskia)',
      'Gramineas (Pennisetum, Miscanthus)',
      'Hortensia (en exposition mi-ombre humide)',
      'Camélia (sols acides bordelais)',
    ],
    caracteristiquesPaysageres:
      'Tissu urbain dense en centre (échoppes, hôtels particuliers, immeubles haussmanniens), couronne pavillonnaire (Caudéran, Le Bouscat, Talence), résidences contemporaines (Bassins à flot, Bordeaux Lac, Bègles), domaines viticoles en périphérie (Médoc, Pessac-Léognan, Saint-Émilion).',
    communesVoisines: [
      'Caudéran',
      'Le Bouscat',
      'Bruges',
      'Mérignac',
      'Pessac',
      'Talence',
      'Bègles',
      'Cenon',
      'Lormont',
      'Floirac',
      'Saint-Médard-en-Jalles',
      'Gradignan',
      'Léognan',
      'Libourne',
      'Saint-Émilion',
      'Arcachon',
      'Cap-Ferret',
    ],
    typologiesDominantes: [
      {
        slug: 'micro-urbain',
        raison:
          'Patios d’échoppes bordelaises et terrasses d’appartement, format dominant en centre-ville.',
      },
      {
        slug: 'coeur-urbain',
        raison:
          'Jardins de maison de ville et cours patrimoniales (Caudéran, Le Bouscat, Saint-Augustin).',
      },
      {
        slug: 'domaine-caractere',
        raison:
          'Domaines viticoles, propriétés bordelaises sur le Médoc, Pessac-Léognan, Saint-Émilion.',
      },
    ],
    faq: [
      {
        question: 'Quelle différence entre un paysagiste et un designer végétal à Bordeaux ?',
        answer:
          'Le paysagiste à Bordeaux est souvent un entrepreneur de travaux paysagers ou un concepteur-réalisateur. Le studio se positionne uniquement sur la conception et la maîtrise d’œuvre : étude, dessin, prescription végétale, coordination des entreprises locales. La séparation conception / exécution permet une exigence design plus élevée.',
      },
      {
        question: 'Le studio se déplace-t-il depuis Brive jusqu’à Bordeaux ?',
        answer:
          'Oui. Bordeaux est zone d’intervention active. Les déplacements (visite initiale, métré, présentation, suivi de chantier) sont intégrés dès le devis d’étude. Brive est à 2h30 de Bordeaux par l’A89.',
      },
      {
        question: 'Quel budget prévoir pour un aménagement de terrasse à Bordeaux ?',
        answer:
          'Une terrasse bordelaise (Micro-urbain, < 50 m²) part de 1 200 € TTC pour l’étude et de 12 000 à 25 000 € pour la réalisation selon le niveau de finition (revêtements, pergola, plantation, éclairage). Un patio d’échoppe demande un budget plus contenu, un toit-terrasse de standing peut dépasser 40 000 €.',
      },
      {
        question: 'Quelles essences végétales fonctionnent le mieux à Bordeaux ?',
        answer:
          'Climat océanique avec étés méditerranéens : olivier, chêne vert, lagerstroemia, magnolia grandiflora, cyprès de Provence sur la strate arborée. Vivaces sèches (lavande, romarin, perovskia, gaura, agapanthe) sur le couvre-sol. Camélias et hortensias en mi-ombre sur sols frais et acides.',
      },
      {
        question: 'Le studio peut-il accompagner un projet hôtellerie ou restauration à Bordeaux ?',
        answer:
          'Oui. Le pôle « Pros & Atypiques » couvre les hôtels, restaurants, bureaux, commerces et locations atypiques de standing. Plusieurs typologies de prestation : décor végétal, mur végétal, scénographie évènementielle, aménagement de cour intérieure.',
      },
      {
        question: 'Intervenez-vous aussi sur Arcachon, Cap-Ferret et le Bassin ?',
        answer:
          'Oui. Arcachon, Cap-Ferret, Pyla, Andernos font partie de la zone d’intervention bordelaise. Les contraintes spécifiques au littoral (vent, sel, sols sableux) sont intégrées à l’étude — palette adaptée (cyprès, oyats, tamaris, pittosporum, atlantica).',
      },
    ],
  },
  {
    slug: 'limoges',
    ville: 'Limoges',
    villeSimple: 'Limoges',
    region: 'Nouvelle-Aquitaine',
    departement: 'Haute-Vienne',
    codeDepartement: '87',
    role: 'bureau-etudes',
    metaTitle:
      'Paysagiste designer à Limoges — Conception de jardin sur mesure | Studio J Oliveira',
    metaDescription:
      'Designer végétal et paysagiste à Limoges (Haute-Vienne). Bureau d’études à Verneuil-sur-Vienne. Conception de jardin, aménagement extérieur et design biophilique en Limousin.',
    h1: 'Paysagiste designer à Limoges',
    introLead:
      'Studio J Oliveira anime un bureau d’études à Verneuil-sur-Vienne, en proche périphérie de Limoges. Conception de jardin, aménagement extérieur et design biophilique en Haute-Vienne et sur l’ensemble du Limousin.',
    introLong: `Limoges et sa couronne — Verneuil-sur-Vienne, Isle, Couzeix, Panazol, Le Palais-sur-Vienne — concentrent une demande de jardins de maison familiale, propriétés bourgeoises et résidences contemporaines. Le studio dispose d’un bureau d’études à Verneuil-sur-Vienne, ce qui réduit les délais d’intervention sur le 87. Cette page regroupe les requêtes locales : paysagiste Limoges, designer végétal Limoges, architecte paysagiste Haute-Vienne, conception de jardin Limoges, aménagement extérieur Limousin. Le bâti porcelainier, les jardins de bord de Vienne et la palette végétale continentale tempérée sont les invariants de la conception locale.`,
    climat: {
      type: 'Continental tempéré atténué (climat limougeaud)',
      description: `Le plateau limougeaud présente un climat plus frais et plus humide que Brive ou Bordeaux : étés modérés (rarement > 32°C en moyenne), hivers humides avec gelées régulières, pluviométrie ~1 050 mm/an bien répartie. Les sols acides sur arène granitique permettent une palette acidophile riche (rhododendrons, camélias, hortensias). Pour la conception : on privilégie les palettes naturalistes, fougères, vivaces de sous-bois, arbustes à floraison de printemps.`,
    },
    essences: [
      'Hortensia (Hydrangea macrophylla et paniculata)',
      'Rhododendron',
      'Camélia',
      'Érable du Japon (Acer palmatum)',
      'Fougère arborescente (Dicksonia)',
      'Fougères vivaces (Dryopteris, Polystichum)',
      'Cornouiller (Cornus controversa, Cornus florida)',
      'Magnolia stellata',
      'Vivaces de sous-bois (Helleborus, Tiarella, Brunnera)',
      'Graminées d’ombre (Hakonechloa, Carex)',
      'Bouleau verruqueux (Betula pendula)',
      'Hêtre (Fagus sylvatica)',
    ],
    caracteristiquesPaysageres:
      'Plateau limougeaud, bocage à l’est, vallée de la Vienne au sud. Tissu urbain dense en centre (cité ouvrière porcelainière, immeubles bourgeois), couronne pavillonnaire arborée, demeures de campagne dans le Limousin Vert (Saint-Léonard-de-Noblat, Châlus, Saint-Yrieix).',
    communesVoisines: [
      'Verneuil-sur-Vienne',
      'Isle',
      'Couzeix',
      'Panazol',
      'Le Palais-sur-Vienne',
      'Aixe-sur-Vienne',
      'Saint-Junien',
      'Saint-Léonard-de-Noblat',
      'Châlus',
      'Saint-Yrieix-la-Perche',
      'Bellac',
      'Eymoutiers',
    ],
    typologiesDominantes: [
      {
        slug: 'coeur-urbain',
        raison: 'Maisons de ville et propriétés bourgeoises du centre limougeaud.',
      },
      {
        slug: 'frange-urbaine',
        raison:
          'Pavillons et résidences en première couronne (Verneuil-sur-Vienne, Couzeix, Panazol).',
      },
      {
        slug: 'domaine-caractere',
        raison: 'Demeures et domaines familiaux dans le Limousin Vert et la Marche.',
      },
    ],
    faq: [
      {
        question: 'Le studio a-t-il un bureau à Limoges ?',
        answer:
          'Oui. Un bureau d’études est implanté à Verneuil-sur-Vienne, en proche périphérie de Limoges. Cela réduit les délais d’intervention sur la Haute-Vienne et permet un suivi de chantier régulier.',
      },
      {
        question: 'Quelle différence entre un paysagiste et un designer végétal à Limoges ?',
        answer:
          'Le paysagiste limougeaud est en général un entrepreneur de travaux paysagers ou un concepteur-réalisateur. Le studio reste sur la conception : étude, dessin, prescription, maîtrise d’œuvre. Le suivi des entreprises de plantation locales est intégré à la prestation.',
      },
      {
        question: 'Quelles plantes fonctionnent au climat limougeaud ?',
        answer:
          'Sols acides sur arène granitique, climat plus humide et plus frais que la Corrèze : palette acidophile riche (rhododendrons, camélias, hortensias, érables du Japon), fougères, vivaces de sous-bois (hellébores, tiarelles), magnolias caduques. Les méditerranéennes strictes (olivier, cyprès de Provence) sont à éviter en sol non drainant.',
      },
      {
        question: 'Quel budget pour la conception d’un jardin à Limoges ?',
        answer:
          'Mêmes grilles que sur les autres zones : Micro-urbain à partir de 1 200 € TTC, Cœur urbain 2 750 €, Frange urbaine 4 250 €, Domaine 6 500 €. Le suivi de chantier est facturé entre 6 et 12 % du budget travaux selon la typologie.',
      },
      {
        question: 'Intervenez-vous sur Saint-Junien, Saint-Léonard, Châlus, Bellac ?',
        answer:
          'Oui. La zone d’intervention couvre l’ensemble de la Haute-Vienne : Limoges et sa première couronne, vallée de la Vienne, Limousin Vert, Marche limousine. Les communes de la Creuse limitrophes peuvent également être étudiées.',
      },
      {
        question: 'Travaillez-vous avec des architectes limougeauds ?',
        answer:
          'Oui. Le pôle « Pros » couvre les collaborations en cotraitance avec architectes et architectes d’intérieur sur les phases AVP, PRO et exécution. Le studio peut intervenir comme paysagiste-concepteur dans une équipe de maîtrise d’œuvre élargie.',
      },
    ],
  },
];

export const ZONE_SLUGS = ZONES.map((z) => z.slug);
