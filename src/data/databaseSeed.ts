import {
  SectorDefinition,
  ArchitectureLayer,
  AutonomyLevelInfo,
  FraudTransaction,
  ProductStock,
  ReassortOrder,
  CustomerOmniProfile,
  MySQLTableSchema,
  AuditLog
} from '../types/nexomia';

export const AUTONOMY_LEVELS: AutonomyLevelInfo[] = [
  {
    level: 1,
    name: 'Niveau 1 – Automatique',
    tagline: 'Faible Risque - 100% Autonome',
    description: 'Exécution autonome des tâches routinières autorisées, réversibles et traçables.',
    examples: ['FAQ dynamique', 'Confirmation de RDV', 'Réémission de justificatif', 'Suivi & étiquette retour autonome'],
    humanRole: 'Supervision différée, audit a posteriori et tableaux de bord.',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  },
  {
    level: 2,
    name: 'Niveau 2 – Recommandé',
    tagline: 'Impact Moyen - Co-décision supervisée',
    description: "L'agent IA analyse le contexte et formule une recommandation d'action à un opérateur humain qui valide avant exécution.",
    examples: ['Remboursement partiel', 'Réassort de stock prédictif', 'Recommandation d\'offre ciblée', 'Suspension préventive'],
    humanRole: 'Validation humaine obligatoire en 1 clic avant émission d\'ordre engageant.',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  {
    level: 3,
    name: 'Niveau 3 – Humain Décide',
    tagline: 'Fort Impact - Contrôle souverain strict',
    description: "L'IA prépare la synthèse analytique complète. La décision finale reste entièrement humaine.",
    examples: ['Diagnostic médical & ordonnance', 'Octroi ou refus de crédit', 'Décision légale & administrative', 'Riposte cyber / sécurité'],
    humanRole: 'Décisionnaire unique souverain. L\'IA n\'agit qu\'en tant que copilote analytique.',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
  }
];

export const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    id: 1,
    name: 'Couche Interface & Relation',
    shortName: 'Omnicanal',
    description: 'Prise en charge omnicanale fluide et unifiée sans perte de contexte usager.',
    components: ['Web App React', 'WhatsApp Business API', 'SMS Gateway', 'Email Parse Engine', 'Voix & Téléphonie SIP', 'Réseaux Sociaux'],
    techStack: ['React 19', 'WebSockets', 'Meta Cloud API', 'WebRTC'],
    icon: 'MessageSquareShare',
    status: 'optimal'
  },
  {
    id: 2,
    name: 'Couche Perception & Ingestion',
    shortName: 'Perception (RAG)',
    description: 'Ingestion et normalisation des documents, flux de données autorisées, historiques et bases métiers via RAG.',
    components: ['Moteur RAG Hybride', 'Vector Embeddings', 'Extracteur OCR & PDF', 'Connecteurs SI (ERP, CRM)'],
    techStack: ['pgvector / HNSW', 'Unstructured Parser', 'OData & REST'],
    icon: 'ScanEye',
    status: 'optimal'
  },
  {
    id: 3,
    name: 'Couche Intelligence & Raisonnement',
    shortName: 'Raisonnement & LLM',
    description: 'Moteur décisionnel combinant modèles LLM multi-fournisseurs, règles métiers et contraintes éthiques sectorielles.',
    components: ['Orchestrateur Multi-LLM', 'Garde-fous hermétiques', 'Moteur de règles heuristiques', 'Analyseur contextuel'],
    techStack: ['Gemini 2.5 / Flash', 'Guardrails AI', 'Decision Rules Engine'],
    icon: 'BrainCircuit',
    status: 'optimal'
  },
  {
    id: 4,
    name: 'Couche Orchestration & Action Graduée',
    shortName: 'Orchestration & Risque',
    description: 'Exécution des workflows, calcul des scores de risque temps réel et exécution graduée sous contrôle humain.',
    components: ['Scoring Risque Dynamique (0-100)', 'Moteur d\'autonomie 3 Niveaux', 'File d\'escalade opérateur', 'Webhooks d\'action'],
    techStack: ['Temporal / Step Functions', 'Kafka Event Bus', 'Redis Score Cache'],
    icon: 'SlidersHorizontal',
    status: 'optimal'
  },
  {
    id: 5,
    name: 'Couche Gouvernance & Sécurité',
    shortName: 'Sécurité & Audit',
    description: 'Chiffrement global (AES-256 / TLS 1.3), contrôle d\'accès strict (RBAC), journalisation inaltérable et hébergement souverain.',
    components: ['Chiffrement AES-256-GCM', 'TLS 1.3 Strict', 'Audit Log Inaltérable SHA-256', 'Gestionnaire RBAC', 'Hébergement Souverain'],
    techStack: ['MySQL 8.0 Enterprise / Cloud SQL', 'HSM Vault', 'OAuth 2.0 / OIDC'],
    icon: 'ShieldCheck',
    status: 'optimal'
  }
];

export const SECTORS_DATA: SectorDefinition[] = [
  {
    id: 'commerce',
    name: 'Commerce & Vente',
    category: 'Économie & Finance',
    icon: 'ShoppingBag',
    agentName: 'NEX-Retail Sentinel',
    agentRepere: 'Demande, comportements d\'achat, recommandations et suivi des stocks.',
    humainValide: 'Le commerçant valide les réassorts et campagnes marketing.',
    autonomyDistribution: { level1: 65, level2: 25, level3: 10 },
    metrics: { activeWorkflows: 1420, dailyDecisions: 18450, riskAlerts: 14, accuracyRate: 98.4 },
    sampleAlert: {
      title: 'Sur-retours réf NEX-JKT-882 (+28%) - Risque rupture Taille L',
      riskScore: 68,
      level: 2,
      timestamp: 'Il y a 6 min'
    }
  },
  {
    id: 'finance',
    name: 'Finance & Assurance',
    category: 'Économie & Finance',
    icon: 'Landmark',
    agentName: 'NEX-Fraud Guardian',
    agentRepere: 'Transactions suspectes, signaux de fraude, analyse du risque crédit.',
    humainValide: 'Un conseiller valide les blocages de compte définitifs et octrois de prêt.',
    autonomyDistribution: { level1: 45, level2: 35, level3: 20 },
    metrics: { activeWorkflows: 3820, dailyDecisions: 48900, riskAlerts: 89, accuracyRate: 99.2 },
    sampleAlert: {
      title: 'Paiement 640 € à l\'étranger (Singapour) - Appareil inconnu',
      riskScore: 91,
      level: 3,
      timestamp: 'Il y a 2 min'
    }
  },
  {
    id: 'sante',
    name: 'Santé',
    category: 'Santé & Vivant',
    icon: 'HeartPulse',
    agentName: 'NEX-Care Assistant',
    agentRepere: 'Signaux faibles sur imagerie, biologie, rappels de traitement.',
    humainValide: 'Le médecin pose le diagnostic et prescrit la prise en charge.',
    autonomyDistribution: { level1: 30, level2: 20, level3: 50 },
    metrics: { activeWorkflows: 890, dailyDecisions: 7200, riskAlerts: 41, accuracyRate: 99.6 },
    sampleAlert: {
      title: 'Élévation anormale marqueurs bio-inflammatoires (Dossier #S-9921)',
      riskScore: 84,
      level: 3,
      timestamp: 'Il y a 14 min'
    }
  },
  {
    id: 'voyage',
    name: 'Voyage & Tourisme',
    category: 'Services & Mobilité',
    icon: 'Plane',
    agentName: 'NEX-Travel Concierge',
    agentRepere: 'Recherche, itinéraires sur mesure, alertes de perturbations météo/vols.',
    humainValide: 'Le voyageur ou l\'agent valide les annulations et modifications coûteuses.',
    autonomyDistribution: { level1: 70, level2: 20, level3: 10 },
    metrics: { activeWorkflows: 1150, dailyDecisions: 12400, riskAlerts: 8, accuracyRate: 97.9 },
    sampleAlert: {
      title: 'Alerte grève aiguilleurs Nice - Re-routing automatique proposé',
      riskScore: 54,
      level: 2,
      timestamp: 'Il y a 22 min'
    }
  },
  {
    id: 'industrie',
    name: 'Industrie',
    category: 'Industrie & Énergie',
    icon: 'Factory',
    agentName: 'NEX-Industrial Predictive',
    agentRepere: 'Détection d\'usure des pièces avant la panne (maintenance prédictive).',
    humainValide: 'L\'opérateur planifie l\'arrêt de production et les interventions techniques.',
    autonomyDistribution: { level1: 40, level2: 45, level3: 15 },
    metrics: { activeWorkflows: 640, dailyDecisions: 89000, riskAlerts: 19, accuracyRate: 98.8 },
    sampleAlert: {
      title: 'Vibrations anormales palier turbine T-04 (Usure estimée à 87%)',
      riskScore: 78,
      level: 2,
      timestamp: 'Il y a 45 min'
    }
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    category: 'Santé & Vivant',
    icon: 'Sprout',
    agentName: 'NEX-Agri Precision',
    agentRepere: 'Mesures d\'humidité du sol, prévision de maladies par parcelle.',
    humainValide: 'L\'agriculteur choisit la stratégie d\'irrigation et de traitement phytosanitaire.',
    autonomyDistribution: { level1: 50, level2: 35, level3: 15 },
    metrics: { activeWorkflows: 480, dailyDecisions: 34000, riskAlerts: 12, accuracyRate: 96.7 },
    sampleAlert: {
      title: 'Stress hydrique sévère détecté sur parcelle C-12 (Maïs grain)',
      riskScore: 62,
      level: 2,
      timestamp: 'Il y a 1h'
    }
  },
  {
    id: 'education',
    name: 'Éducation',
    category: 'Services & Mobilité',
    icon: 'GraduationCap',
    agentName: 'NEX-Tutor Adaptive',
    agentRepere: 'Détection des lacunes et rythme de progression de chaque élève.',
    humainValide: 'L\'enseignant cible le soutien pédagogique adapté et personnalise l\'apprentissage.',
    autonomyDistribution: { level1: 60, level2: 30, level3: 10 },
    metrics: { activeWorkflows: 2100, dailyDecisions: 15200, riskAlerts: 5, accuracyRate: 97.5 },
    sampleAlert: {
      title: 'Blocage conceptuel identifié sur calcul différentiel (Groupe 3B)',
      riskScore: 35,
      level: 1,
      timestamp: 'Il y a 3h'
    }
  },
  {
    id: 'energie',
    name: 'Énergie',
    category: 'Industrie & Énergie',
    icon: 'Zap',
    agentName: 'NEX-Grid Balancer',
    agentRepere: 'Écarts entre production renouvelable et demande sur le réseau en temps réel.',
    humainValide: 'Le gestionnaire valide les arbitrages de charge électrique et délestages.',
    autonomyDistribution: { level1: 50, level2: 35, level3: 15 },
    metrics: { activeWorkflows: 720, dailyDecisions: 120400, riskAlerts: 23, accuracyRate: 99.4 },
    sampleAlert: {
      title: 'Déficit prévisionnel 450 MW à 18h30 - Déclenchement batteries',
      riskScore: 74,
      level: 2,
      timestamp: 'Il y a 12 min'
    }
  },
  {
    id: 'transport',
    name: 'Transport',
    category: 'Services & Mobilité',
    icon: 'Truck',
    agentName: 'NEX-Mobility Traffic',
    agentRepere: 'État du trafic, météo et incidents en direct sur axes logistiques.',
    humainValide: 'Le régulateur autorise les réacheminements majeurs et plans d\'urgence.',
    autonomyDistribution: { level1: 55, level2: 30, level3: 15 },
    metrics: { activeWorkflows: 1890, dailyDecisions: 67000, riskAlerts: 31, accuracyRate: 98.1 },
    sampleAlert: {
      title: 'Congestion accident A6 Sud - Déviation de 18 camions fret',
      riskScore: 58,
      level: 2,
      timestamp: 'Il y a 18 min'
    }
  },
  {
    id: 'telecoms',
    name: 'Télécoms',
    category: 'Industrie & Énergie',
    icon: 'Radio',
    agentName: 'NEX-Telco Sentinel',
    agentRepere: 'Pannes d\'antennes relais et détection des schémas d\'appels frauduleux (SIM-swap).',
    humainValide: 'L\'ingénieur réseau confirme la reconfiguration d\'antenne ou l\'intervention sur site.',
    autonomyDistribution: { level1: 50, level2: 30, level3: 20 },
    metrics: { activeWorkflows: 940, dailyDecisions: 142000, riskAlerts: 17, accuracyRate: 99.0 },
    sampleAlert: {
      title: 'Tentative massive de spoofing SMS détectée sur cellule #IDF-441',
      riskScore: 89,
      level: 3,
      timestamp: 'Il y a 7 min'
    }
  },
  {
    id: 'securite',
    name: 'Sécurité',
    category: 'Souveraineté & Public',
    icon: 'ShieldAlert',
    agentName: 'NEX-Cyber Defender',
    agentRepere: 'Identification des schémas d\'intrusion cyber ou physique périmétrique.',
    humainValide: 'L\'équipe de sécurité déclenche la riposte tactique et l\'intervention policière.',
    autonomyDistribution: { level1: 20, level2: 30, level3: 50 },
    metrics: { activeWorkflows: 530, dailyDecisions: 210000, riskAlerts: 48, accuracyRate: 99.8 },
    sampleAlert: {
      title: 'Attaque par force brute distribuée sur passerelle API Nord',
      riskScore: 94,
      level: 3,
      timestamp: 'Il y a 4 min'
    }
  },
  {
    id: 'environnement',
    name: 'Environnement',
    category: 'Souveraineté & Public',
    icon: 'TreePine',
    agentName: 'NEX-Eco Guardian',
    agentRepere: 'Détection précoce de feux de forêt, déforestation illégale, suivi de la qualité de l\'eau.',
    humainValide: 'Les autorités compétentes engagent les moyens d\'intervention aériens et terrestres.',
    autonomyDistribution: { level1: 45, level2: 35, level3: 20 },
    metrics: { activeWorkflows: 390, dailyDecisions: 18000, riskAlerts: 9, accuracyRate: 97.8 },
    sampleAlert: {
      title: 'Anomalie thermique satellite (Zone Landes - Parcelle B7)',
      riskScore: 82,
      level: 3,
      timestamp: 'Il y a 32 min'
    }
  },
  {
    id: 'administration',
    name: 'Administration',
    category: 'Souveraineté & Public',
    icon: 'FileText',
    agentName: 'NEX-Civic Dossier',
    agentRepere: 'Tri automatique et pré-instruction des dossiers administratifs usagers.',
    humainValide: 'L\'agent public assermenté tranche la décision administrative légale finale.',
    autonomyDistribution: { level1: 50, level2: 30, level3: 20 },
    metrics: { activeWorkflows: 3100, dailyDecisions: 22400, riskAlerts: 16, accuracyRate: 99.1 },
    sampleAlert: {
      title: 'Dossier subvention #SUB-784 : Pièce justificative manquante détectée',
      riskScore: 28,
      level: 1,
      timestamp: 'Il y a 50 min'
    }
  }
];

export const INITIAL_FRAUD_TRANSACTIONS: FraudTransaction[] = [
  {
    id: 'tx-001',
    transaction_ref: 'TX-2026-0928-8812',
    customer_id: 'CUST-0421',
    customer_name: 'Alexandre Martin',
    amount: 640.00,
    currency: 'EUR',
    merchant: 'Marina Bay Luxury Tech Pte - Singapour',
    location: 'Singapour (SG)',
    country: 'SG',
    device_name: 'Apple iPhone 16 Pro (Non répertorié)',
    device_trusted: false,
    ip_address: '103.252.114.22',
    risk_score: 91,
    autonomy_level: 3,
    status: 'SUSPENDED_PREVENTIVE',
    detected_at: '2026-09-28 11:42:15',
    response_time_ms: 412,
    suspicion_reasons: [
      'Montant inhabituel (640 € vs médiane habituelle 42 €)',
      'Géolocalisation hors Union Européenne (Singapour) sans déclaration voyage',
      'Empreinte matérielle (Hardware Fingerprint) inconnue',
      'Délai physique impossible : dernière transaction à Paris il y a 47 minutes'
    ],
    escalation_target: 'Conseiller Anti-Fraude Niv. 3 & Client Push Notification',
    customer_push_status: 'SENT',
    decision_notes: 'Transaction suspendue en 412ms par Niveau 1-2. Alerte transmise au centre de sécurité.'
  },
  {
    id: 'tx-002',
    transaction_ref: 'TX-2026-0928-8790',
    customer_id: 'CUST-0118',
    customer_name: 'Camille Leroy',
    amount: 14.50,
    currency: 'EUR',
    merchant: 'Boulangerie Artisanale Saint-Germain',
    location: 'Paris (FR)',
    country: 'FR',
    device_name: 'Apple Watch Ultra (Appairée)',
    device_trusted: true,
    ip_address: '194.2.14.88',
    risk_score: 4,
    autonomy_level: 1,
    status: 'APPROVED_LEGITIMATE',
    detected_at: '2026-09-28 11:39:04',
    response_time_ms: 68,
    suspicion_reasons: [],
    escalation_target: 'Aucune (Exécution automatique)',
    customer_push_status: 'WAITING',
    decision_notes: 'Paiement NFC de proximité, cohérence totale de localisation.'
  },
  {
    id: 'tx-003',
    transaction_ref: 'TX-2026-0928-8755',
    customer_id: 'CUST-0943',
    customer_name: 'Sophie Bernard',
    amount: 1250.00,
    currency: 'EUR',
    merchant: 'CryptoPay Gate Tallinn',
    location: 'Tallinn (EE)',
    country: 'EE',
    device_name: 'Chrome on Linux (Tor exit node)',
    device_trusted: false,
    ip_address: '185.220.101.5',
    risk_score: 96,
    autonomy_level: 3,
    status: 'CONFIRMED_FRAUD',
    detected_at: '2026-09-28 11:15:22',
    response_time_ms: 320,
    suspicion_reasons: [
      'Adresse IP correspondant à un nœud de sortie Tor connu',
      'Plateforme crypto à haut risque',
      'Test préalable de 3 micro-débits rejetés en 40 secondes'
    ],
    escalation_target: 'Conseiller Anti-Fraude & Pôle Judiciaire',
    customer_push_status: 'DENIED_USER',
    decision_notes: 'Client a formellement rejeté la tentative sur son smartphone. Carte bloquée.'
  },
  {
    id: 'tx-004',
    transaction_ref: 'TX-2026-0928-8640',
    customer_id: 'CUST-0771',
    customer_name: 'Julien Dubois',
    amount: 185.00,
    currency: 'EUR',
    merchant: 'SNCF Connect TGV Inoui',
    location: 'Lyon (FR)',
    country: 'FR',
    device_name: 'MacBook Pro M3 (Enregistré)',
    device_trusted: true,
    ip_address: '82.127.54.12',
    risk_score: 12,
    autonomy_level: 1,
    status: 'APPROVED_LEGITIMATE',
    detected_at: '2026-09-28 10:55:18',
    response_time_ms: 85,
    suspicion_reasons: [],
    escalation_target: 'Aucune (Exécution automatique)',
    customer_push_status: 'WAITING',
    decision_notes: 'Billet de train acheté depuis le navigateur usuel avec 3D-Secure biométrique.'
  }
];

export const INITIAL_PRODUCTS_STOCK: ProductStock[] = [
  {
    id: 'prod-001',
    sku: 'NEX-JKT-882-M',
    name: 'Veste All-Weather Gore-Pro (Taille M)',
    category: 'Vêtements Techniques',
    price: 249.00,
    current_stock: 42,
    min_threshold: 30,
    max_capacity: 250,
    return_rate_percentage: 28.4,
    normal_return_rate: 6.2,
    supplier: 'AlpineTech Gear SA',
    lead_time_days: 4,
    unit_cost: 95.00,
    status: 'REORDER_RECOMMENDED'
  },
  {
    id: 'prod-002',
    sku: 'NEX-JKT-882-L',
    name: 'Veste All-Weather Gore-Pro (Taille L - Substitution)',
    category: 'Vêtements Techniques',
    price: 249.00,
    current_stock: 8,
    min_threshold: 25,
    max_capacity: 250,
    return_rate_percentage: 4.8,
    normal_return_rate: 6.2,
    supplier: 'AlpineTech Gear SA',
    lead_time_days: 4,
    unit_cost: 95.00,
    status: 'CRITICAL'
  },
  {
    id: 'prod-003',
    sku: 'NEX-SNK-401',
    name: 'Sneakers Trail Urban Shield',
    category: 'Chaussures',
    price: 159.00,
    current_stock: 114,
    min_threshold: 40,
    max_capacity: 300,
    return_rate_percentage: 5.1,
    normal_return_rate: 5.5,
    supplier: 'Nordic Footwear Ltd',
    lead_time_days: 7,
    unit_cost: 58.00,
    status: 'IN_STOCK'
  },
  {
    id: 'prod-004',
    sku: 'NEX-BAG-099',
    name: 'Sac à Dos Modulaire Étanche 35L',
    category: 'Bagagerie',
    price: 119.00,
    current_stock: 67,
    min_threshold: 20,
    max_capacity: 180,
    return_rate_percentage: 2.2,
    normal_return_rate: 3.5,
    supplier: 'PackCraft Industries',
    lead_time_days: 5,
    unit_cost: 44.00,
    status: 'IN_STOCK'
  }
];

export const INITIAL_CUSTOMER_PROFILE: CustomerOmniProfile = {
  id: 'CUST-0421',
  first_name: 'Alexandre',
  last_name: 'Martin',
  email: 'a.martin.pro@nexomia-sample.fr',
  phone: '+33 6 42 89 12 04',
  tier: 'VIP',
  cross_channel_id: 'OMNI-UID-7729-FR',
  last_orders: [
    {
      order_id: 'CMD-2026-9941',
      date: '2026-09-24',
      product_name: 'Veste All-Weather Gore-Pro (Taille M)',
      sku: 'NEX-JKT-882-M',
      size: 'M',
      amount: 249.00,
      return_eligible: true
    },
    {
      order_id: 'CMD-2026-8810',
      date: '2026-08-14',
      product_name: 'Sneakers Trail Urban Shield',
      sku: 'NEX-SNK-401',
      size: '43',
      amount: 159.00,
      return_eligible: false
    }
  ]
};

export const INITIAL_REASSORT_ORDERS: ReassortOrder[] = [
  {
    id: 'RO-2026-0928-01',
    order_number: 'PO-2026-889',
    product_id: 'prod-002',
    product_name: 'Veste All-Weather Gore-Pro (Taille L - Substitution)',
    sku: 'NEX-JKT-882-L',
    requested_quantity: 150,
    unit_cost: 95.00,
    total_cost: 14250.00,
    supplier: 'AlpineTech Gear SA',
    triggered_by: 'NEXOMIA_AGENT_LEVEL_2',
    reason: 'Sur-retours sur Taille M (+28%) se reportant sur Taille L. Risque de rupture sous 48h (stock restant: 8 unités).',
    risk_forecast: 'Perte de chiffre d\'affaires estimée à 37 350 € sans réassort immédiat.',
    status: 'PROPOSED',
    created_at: '2026-09-28 11:43:00'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-09-28 11:42:15.412',
    layer: 'Couche 4 (Orchestration)',
    sector: 'Finance & Assurance',
    action: 'SUSPENSION_PREVENTIVE',
    actor: 'NEX-Fraud Guardian [Agent IA]',
    autonomy_level: 2,
    risk_score: 91,
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    details: 'Transaction TX-2026-0928-8812 suspendue en 412ms (Score 91/100). Déclenchement escalade Niveau 3.'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-09-28 11:42:15.580',
    layer: 'Couche 1 (Interface & Relation)',
    sector: 'Finance & Assurance',
    action: 'CLIENT_NOTIFICATION_PUSH',
    actor: 'NEXORA Messaging Hub',
    autonomy_level: 1,
    risk_score: 91,
    hash: '7d1a54127b222502f5b79b5fb0803061152a44f92b37e23c65dd00f93a421a32',
    details: 'Notification push transmise à l\'application bancaire mobile d\'Alexandre Martin.'
  },
  {
    id: 'AUD-003',
    timestamp: '2026-09-28 11:43:10.104',
    layer: 'Couche 3 (Intelligence & Raisonnement)',
    sector: 'Commerce & Vente',
    action: 'LOGISTIC_ANOMALY_DETECTION',
    actor: 'OMNIA Retail Engine',
    autonomy_level: 2,
    risk_score: 68,
    hash: 'a12b43f901239847120aefbcc441902401824701294801284901824012840192',
    details: 'Hausse anormale de retours détectée sur NEX-JKT-882-M (+28.4%). Calcul de réassort automatique sur Taille L.'
  },
  {
    id: 'AUD-004',
    timestamp: '2026-09-28 11:43:12.890',
    layer: 'Couche 4 (Orchestration)',
    sector: 'Commerce & Vente',
    action: 'REASSORT_PROPOSAL_GENERATED',
    actor: 'NEX-Retail Sentinel [Agent IA]',
    autonomy_level: 2,
    risk_score: 68,
    hash: '9f83c12a78103984729184029471928471928471928471928471928471928471',
    details: 'Bon de commande PO-2026-889 proposé (150 unités, 14 250 €) en attente de validation par Responsable Ventes.'
  }
];

export const MYSQL_TABLE_SCHEMAS: MySQLTableSchema[] = [
  {
    tableName: 'nexomia_sectors',
    description: 'Configuration et état des 13 agents sectoriels intelligents NEXOMIA',
    engine: 'InnoDB',
    charset: 'utf8mb4_unicode_ci',
    rowCount: 13,
    columns: [
      { name: 'id', type: 'VARCHAR(32)', nullable: false, isPrimary: true, comment: 'Identifiant unique secteur' },
      { name: 'name', type: 'VARCHAR(128)', nullable: false, comment: 'Désignation du secteur d\'activité' },
      { name: 'category', type: 'VARCHAR(64)', nullable: false, comment: 'Famille métier' },
      { name: 'agent_name', type: 'VARCHAR(64)', nullable: false, comment: 'Nom de code de l\'agent IA' },
      { name: 'agent_repere', type: 'TEXT', nullable: false, comment: 'Capacités de détection de l\'IA' },
      { name: 'humain_valide', type: 'TEXT', nullable: false, comment: 'Décision réservée au contrôle humain' },
      { name: 'autonomy_l1_pct', type: 'TINYINT UNSIGNED', nullable: false, defaultValue: '50' },
      { name: 'autonomy_l2_pct', type: 'TINYINT UNSIGNED', nullable: false, defaultValue: '30' },
      { name: 'autonomy_l3_pct', type: 'TINYINT UNSIGNED', nullable: false, defaultValue: '20' },
      { name: 'active_workflows', type: 'INT UNSIGNED', nullable: false, defaultValue: '0' },
      { name: 'accuracy_rate', type: 'DECIMAL(4,2)', nullable: false, defaultValue: '98.50' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
    ]
  },
  {
    tableName: 'fraud_transactions',
    description: 'Flux des transactions financières sous surveillance avec scoring anti-fraude',
    engine: 'InnoDB',
    charset: 'utf8mb4_unicode_ci',
    rowCount: 4,
    columns: [
      { name: 'id', type: 'VARCHAR(36)', nullable: false, isPrimary: true },
      { name: 'transaction_ref', type: 'VARCHAR(64)', nullable: false, comment: 'Référence bancaire normalisée' },
      { name: 'customer_id', type: 'VARCHAR(36)', nullable: false, isForeign: true },
      { name: 'customer_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'amount', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'currency', type: 'CHAR(3)', nullable: false, defaultValue: 'EUR' },
      { name: 'merchant', type: 'VARCHAR(128)', nullable: false },
      { name: 'location', type: 'VARCHAR(128)', nullable: false },
      { name: 'country', type: 'CHAR(2)', nullable: false },
      { name: 'device_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'device_trusted', type: 'BOOLEAN', nullable: false, defaultValue: '0' },
      { name: 'ip_address', type: 'VARCHAR(45)', nullable: false },
      { name: 'risk_score', type: 'TINYINT UNSIGNED', nullable: false, comment: 'Score de risque de 0 à 100' },
      { name: 'autonomy_level', type: 'TINYINT UNSIGNED', nullable: false, comment: 'Niveau 1, 2 ou 3' },
      { name: 'status', type: 'ENUM(\'SUSPENDED_PREVENTIVE\',\'CONFIRMED_FRAUD\',\'APPROVED_LEGITIMATE\',\'CLEARED_BY_USER\',\'PENDING_HUMAN\')', nullable: false },
      { name: 'detected_at', type: 'DATETIME', nullable: false },
      { name: 'response_time_ms', type: 'INT UNSIGNED', nullable: false, comment: 'Temps de détection/action en ms' },
      { name: 'suspicion_reasons', type: 'JSON', nullable: true },
      { name: 'customer_push_status', type: 'ENUM(\'SENT\',\'CONFIRMED_USER\',\'DENIED_USER\',\'WAITING\')', nullable: false }
    ]
  },
  {
    tableName: 'products_inventory',
    description: 'Inventaire des références et suivi analytique des taux de retours',
    engine: 'InnoDB',
    charset: 'utf8mb4_unicode_ci',
    rowCount: 4,
    columns: [
      { name: 'id', type: 'VARCHAR(36)', nullable: false, isPrimary: true },
      { name: 'sku', type: 'VARCHAR(64)', nullable: false, comment: 'Code référence article unique' },
      { name: 'name', type: 'VARCHAR(128)', nullable: false },
      { name: 'category', type: 'VARCHAR(64)', nullable: false },
      { name: 'price', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'current_stock', type: 'INT', nullable: false },
      { name: 'min_threshold', type: 'INT', nullable: false },
      { name: 'max_capacity', type: 'INT', nullable: false },
      { name: 'return_rate_percentage', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'normal_return_rate', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'supplier', type: 'VARCHAR(128)', nullable: false },
      { name: 'lead_time_days', type: 'TINYINT UNSIGNED', nullable: false },
      { name: 'unit_cost', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'status', type: 'ENUM(\'IN_STOCK\',\'LOW_STOCK\',\'CRITICAL\',\'REORDER_RECOMMENDED\')', nullable: false }
    ]
  },
  {
    tableName: 'reassort_orders',
    description: 'Bons de commande de réassort prédictif générés par Niveau 2 et validés par l\'humain',
    engine: 'InnoDB',
    charset: 'utf8mb4_unicode_ci',
    rowCount: 1,
    columns: [
      { name: 'id', type: 'VARCHAR(36)', nullable: false, isPrimary: true },
      { name: 'order_number', type: 'VARCHAR(64)', nullable: false },
      { name: 'product_id', type: 'VARCHAR(36)', nullable: false, isForeign: true },
      { name: 'product_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'sku', type: 'VARCHAR(64)', nullable: false },
      { name: 'requested_quantity', type: 'INT UNSIGNED', nullable: false },
      { name: 'unit_cost', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'total_cost', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'supplier', type: 'VARCHAR(128)', nullable: false },
      { name: 'triggered_by', type: 'VARCHAR(64)', nullable: false },
      { name: 'reason', type: 'TEXT', nullable: false },
      { name: 'risk_forecast', type: 'TEXT', nullable: false },
      { name: 'status', type: 'ENUM(\'PROPOSED\',\'APPROVED\',\'IN_PRODUCTION\',\'DELIVERED\',\'REJECTED\')', nullable: false },
      { name: 'created_at', type: 'DATETIME', nullable: false },
      { name: 'validated_by', type: 'VARCHAR(128)', nullable: true },
      { name: 'validated_at', type: 'DATETIME', nullable: true }
    ]
  },
  {
    tableName: 'omnichannel_sessions',
    description: 'Mémoire partagée et continuité de parcours multi-canaux (NEXORA)',
    engine: 'InnoDB',
    charset: 'utf8mb4_unicode_ci',
    rowCount: 2,
    columns: [
      { name: 'id', type: 'VARCHAR(36)', nullable: false, isPrimary: true },
      { name: 'customer_id', type: 'VARCHAR(36)', nullable: false, isForeign: true },
      { name: 'channel', type: 'ENUM(\'WEB\',\'WHATSAPP\',\'SMS\',\'EMAIL\')', nullable: false },
      { name: 'session_token', type: 'VARCHAR(128)', nullable: false },
      { name: 'context_summary', type: 'TEXT', nullable: false },
      { name: 'last_product_interacted', type: 'VARCHAR(64)', nullable: true },
      { name: 'active_order_ref', type: 'VARCHAR(64)', nullable: true },
      { name: 'started_at', type: 'DATETIME', nullable: false },
      { name: 'last_activity_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP' }
    ]
  },
  {
    tableName: 'audit_logs',
    description: 'Journal inaltérable de gouvernance et traçabilité décisionnelle (Couche 5)',
    engine: 'InnoDB',
    charset: 'utf8mb4_unicode_ci',
    rowCount: 4,
    columns: [
      { name: 'id', type: 'VARCHAR(36)', nullable: false, isPrimary: true },
      { name: 'timestamp', type: 'DATETIME(3)', nullable: false },
      { name: 'layer', type: 'VARCHAR(64)', nullable: false },
      { name: 'sector', type: 'VARCHAR(64)', nullable: false },
      { name: 'action', type: 'VARCHAR(64)', nullable: false },
      { name: 'actor', type: 'VARCHAR(128)', nullable: false },
      { name: 'autonomy_level', type: 'TINYINT UNSIGNED', nullable: false },
      { name: 'risk_score', type: 'TINYINT UNSIGNED', nullable: false },
      { name: 'sha256_hash', type: 'CHAR(64)', nullable: false, comment: 'Empreinte cryptographique inaltérable' },
      { name: 'details', type: 'TEXT', nullable: false }
    ]
  }
];

export const MYSQL_DDL_SCRIPT = `-- ========================================================
-- NEXOMIA PLATFORM - SCHEMA DATABASE MYSQL 8.0 / MARIADB
-- Fusion Stratégique NEXORA / NEXUS & OMNIA / MERIDIAN
-- Date de génération : Septembre 2026
-- Compatibilité : MySQL 8.0+, MariaDB 10.6+, Cloud SQL for MySQL
-- Moteur : InnoDB | Chiffrement au repos : AES-256
-- ========================================================

CREATE DATABASE IF NOT EXISTS \`nexomia_db\`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE \`nexomia_db\`;

-- 1. Table des 13 agents sectoriels
CREATE TABLE IF NOT EXISTS \`nexomia_sectors\` (
  \`id\` VARCHAR(32) NOT NULL,
  \`name\` VARCHAR(128) NOT NULL,
  \`category\` VARCHAR(64) NOT NULL,
  \`agent_name\` VARCHAR(64) NOT NULL,
  \`agent_repere\` TEXT NOT NULL,
  \`humain_valide\` TEXT NOT NULL,
  \`autonomy_l1_pct\` TINYINT UNSIGNED NOT NULL DEFAULT 50,
  \`autonomy_l2_pct\` TINYINT UNSIGNED NOT NULL DEFAULT 30,
  \`autonomy_l3_pct\` TINYINT UNSIGNED NOT NULL DEFAULT 20,
  \`active_workflows\` INT UNSIGNED NOT NULL DEFAULT 0,
  \`accuracy_rate\` DECIMAL(4,2) NOT NULL DEFAULT 98.50,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  INDEX \`idx_sector_category\` (\`category\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table des transactions et scoring anti-fraude (Cas Pratique 1)
CREATE TABLE IF NOT EXISTS \`fraud_transactions\` (
  \`id\` VARCHAR(36) NOT NULL,
  \`transaction_ref\` VARCHAR(64) NOT NULL UNIQUE,
  \`customer_id\` VARCHAR(36) NOT NULL,
  \`customer_name\` VARCHAR(128) NOT NULL,
  \`amount\` DECIMAL(12,2) NOT NULL,
  \`currency\` CHAR(3) NOT NULL DEFAULT 'EUR',
  \`merchant\` VARCHAR(128) NOT NULL,
  \`location\` VARCHAR(128) NOT NULL,
  \`country\` CHAR(2) NOT NULL,
  \`device_name\` VARCHAR(128) NOT NULL,
  \`device_trusted\` BOOLEAN NOT NULL DEFAULT 0,
  \`ip_address\` VARCHAR(45) NOT NULL,
  \`risk_score\` TINYINT UNSIGNED NOT NULL,
  \`autonomy_level\` TINYINT UNSIGNED NOT NULL,
  \`status\` ENUM('SUSPENDED_PREVENTIVE','CONFIRMED_FRAUD','APPROVED_LEGITIMATE','CLEARED_BY_USER','PENDING_HUMAN') NOT NULL,
  \`detected_at\` DATETIME NOT NULL,
  \`response_time_ms\` INT UNSIGNED NOT NULL,
  \`suspicion_reasons\` JSON NULL,
  \`customer_push_status\` ENUM('SENT','CONFIRMED_USER','DENIED_USER','WAITING') NOT NULL DEFAULT 'WAITING',
  PRIMARY KEY (\`id\`),
  INDEX \`idx_fraud_risk\` (\`risk_score\`, \`status\`),
  INDEX \`idx_fraud_customer\` (\`customer_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table des stocks et indicateurs logistiques (Cas Pratique 2)
CREATE TABLE IF NOT EXISTS \`products_inventory\` (
  \`id\` VARCHAR(36) NOT NULL,
  \`sku\` VARCHAR(64) NOT NULL UNIQUE,
  \`name\` VARCHAR(128) NOT NULL,
  \`category\` VARCHAR(64) NOT NULL,
  \`price\` DECIMAL(10,2) NOT NULL,
  \`current_stock\` INT NOT NULL,
  \`min_threshold\` INT NOT NULL,
  \`max_capacity\` INT NOT NULL,
  \`return_rate_percentage\` DECIMAL(5,2) NOT NULL,
  \`normal_return_rate\` DECIMAL(5,2) NOT NULL,
  \`supplier\` VARCHAR(128) NOT NULL,
  \`lead_time_days\` TINYINT UNSIGNED NOT NULL,
  \`unit_cost\` DECIMAL(10,2) NOT NULL,
  \`status\` ENUM('IN_STOCK','LOW_STOCK','CRITICAL','REORDER_RECOMMENDED') NOT NULL,
  PRIMARY KEY (\`id\`),
  INDEX \`idx_prod_sku\` (\`sku\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table des propositions et ordres de réassort (Cas Pratique 2)
CREATE TABLE IF NOT EXISTS \`reassort_orders\` (
  \`id\` VARCHAR(36) NOT NULL,
  \`order_number\` VARCHAR(64) NOT NULL UNIQUE,
  \`product_id\` VARCHAR(36) NOT NULL,
  \`product_name\` VARCHAR(128) NOT NULL,
  \`sku\` VARCHAR(64) NOT NULL,
  \`requested_quantity\` INT UNSIGNED NOT NULL,
  \`unit_cost\` DECIMAL(10,2) NOT NULL,
  \`total_cost\` DECIMAL(12,2) NOT NULL,
  \`supplier\` VARCHAR(128) NOT NULL,
  \`triggered_by\` VARCHAR(64) NOT NULL,
  \`reason\` TEXT NOT NULL,
  \`risk_forecast\` TEXT NOT NULL,
  \`status\` ENUM('PROPOSED','APPROVED','IN_PRODUCTION','DELIVERED','REJECTED') NOT NULL,
  \`created_at\` DATETIME NOT NULL,
  \`validated_by\` VARCHAR(128) NULL,
  \`validated_at\` DATETIME NULL,
  PRIMARY KEY (\`id\`),
  FOREIGN KEY (\`product_id\`) REFERENCES \`products_inventory\`(\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table des sessions et continuité omnicanale (NEXORA)
CREATE TABLE IF NOT EXISTS \`omnichannel_sessions\` (
  \`id\` VARCHAR(36) NOT NULL,
  \`customer_id\` VARCHAR(36) NOT NULL,
  \`channel\` ENUM('WEB','WHATSAPP','SMS','EMAIL') NOT NULL,
  \`session_token\` VARCHAR(128) NOT NULL,
  \`context_summary\` TEXT NOT NULL,
  \`last_product_interacted\` VARCHAR(64) NULL,
  \`active_order_ref\` VARCHAR(64) NULL,
  \`started_at\` DATETIME NOT NULL,
  \`last_activity_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  INDEX \`idx_omni_cust\` (\`customer_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table du journal inaltérable de gouvernance et sécurité (Couche 5)
CREATE TABLE IF NOT EXISTS \`audit_logs\` (
  \`id\` VARCHAR(36) NOT NULL,
  \`timestamp\` DATETIME(3) NOT NULL,
  \`layer\` VARCHAR(64) NOT NULL,
  \`sector\` VARCHAR(64) NOT NULL,
  \`action\` VARCHAR(64) NOT NULL,
  \`actor\` VARCHAR(128) NOT NULL,
  \`autonomy_level\` TINYINT UNSIGNED NOT NULL,
  \`risk_score\` TINYINT UNSIGNED NOT NULL,
  \`sha256_hash\` CHAR(64) NOT NULL,
  \`details\` TEXT NOT NULL,
  PRIMARY KEY (\`id\`),
  INDEX \`idx_audit_time\` (\`timestamp\`),
  INDEX \`idx_audit_action\` (\`action\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

export const PRICING_OFFERS = [
  {
    id: 'starter',
    name: 'Starter',
    target: 'PME / Mono-canal',
    price: 490,
    period: 'mois',
    description: 'Chatbot texte + FAQ dynamique sur 1 canal (Web ou WhatsApp). Automatisation de base.',
    features: [
      '1 canal au choix (Web ou WhatsApp)',
      'Chatbot conversationnel texte standard',
      'FAQ dynamique & apprentissage de base',
      'Exécution autonome Niveau 1 (FAQ, justificatifs)',
      'Jusqu\'à 2 500 conversations / mois',
      'Support par email standard (48h)'
    ],
    popular: false,
    cta: 'Démarrer avec Starter'
  },
  {
    id: 'business',
    name: 'Business',
    target: 'ETI / Multi-canal',
    price: 1990,
    period: 'mois',
    description: 'Voix, texte et image. Mémoire contextuelle, RAG documentaire, connecteur CRM/ERP et module anti-fraude.',
    features: [
      'Omnicanal complet (Web, WhatsApp, Voix, SMS, Email)',
      'Perception multimodale (Texte, Voix, Image, Documents)',
      'Mémoire contextuelle longue durée usager',
      'Moteur RAG documentaire avancé',
      'Connecteurs natifs CRM & ERP (Salesforce, SAP, Zendesk)',
      'Module Anti-Fraude temps réel (< 1 seconde)',
      'Autonomie graduée Niveaux 1 & 2 avec console superviseur',
      'Support prioritaire 24/7 & SLA 99.9%'
    ],
    popular: true,
    cta: 'Choisir l\'offre Business'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    target: 'Grands Comptes & Souverain',
    price: null,
    priceLabel: 'Sur devis',
    period: '',
    description: 'Modules sectoriels sur mesure, hébergement souverain dédié, SLA garanti et accompagnement personnalisé.',
    features: [
      'Déploiement sur mesure des 13 agents sectoriels',
      'Hébergement souverain dédié (SecNumCloud / On-premise)',
      'Garde-fous hermétiques & règles métiers propriétaires',
      'Chiffrement HSM personnalisé & clé client dédiée',
      'Garantie de non-entraînement des modèles sur vos données',
      'Gouvernance & journal inaltérable certifié',
      'Directeur de compte & ingénieur IA dédié',
      'SLA garanti 99.99% avec pénalités contractuelles'
    ],
    popular: false,
    cta: 'Contacter la Direction Grands Comptes'
  }
];

export const ROADMAP_DATA = [
  {
    phase: 'Mois 0 – 6',
    title: 'MVP & Cadrage',
    status: 'COMPLETED',
    progress: 100,
    description: 'Construction du noyau unifié, module RAG, premier connecteur SI et console de supervision.',
    milestones: [
      { text: 'Fusion des socles technologiques NEXORA (relation) et OMNIA (intelligence)', done: true },
      { text: 'Développement du moteur RAG hybride multi-sources', done: true },
      { text: 'Conception des 5 couches d\'architecture technique', done: true },
      { text: 'Première console de supervision unifiée & connecteur ERP/CRM', done: true }
    ]
  },
  {
    phase: 'Mois 6 – 12',
    title: 'Pilote Supervisé',
    status: 'CURRENT',
    progress: 68,
    description: 'Test en conditions réelles sur le cas pilote Finance (anti-fraude) en mode surveillance puis blocage partiel.',
    milestones: [
      { text: 'Expérimentation Cas Pratique 1 : Anti-fraude bancaire en temps réel', done: true },
      { text: 'Validation du temps de réaction sous 500 ms (objectif < 5s atteint)', done: true },
      { text: 'Déploiement du modèle d\'autonomie graduée (Niveau 1, 2, 3)', done: true },
      { text: 'Passage du mode passif au blocage préventif automatisé supervisé', done: false }
    ]
  },
  {
    phase: 'Année 2',
    title: 'Passage à l\'Échelle',
    status: 'PLANNED',
    progress: 15,
    description: 'Extension à 2 ou 3 secteurs supplémentaires (Commerce, Tourisme), automatisation des tâches de niveau 1.',
    milestones: [
      { text: 'Déploiement à grande échelle Cas Pratique 2 : Commerce omnicanal & gestion des stocks', done: false },
      { text: 'Intégration du secteur Voyage & Tourisme avec alertes de perturbations', done: false },
      { text: 'Automatisation à 100% des tâches Niveau 1 (FAQ, étiquettes retour, rééditions)', done: false },
      { text: 'Génération prédictive des réassorts fournisseurs avec accord 1-clic', done: false }
    ]
  },
  {
    phase: 'Année 3',
    title: 'Expansion Écosystème',
    status: 'PLANNED',
    progress: 0,
    description: 'Déploiement multi-secteurs complet sous gouvernance commune et interconnectivité des agents.',
    milestones: [
      { text: 'Activation complète des 13 agents sectoriels interconnectés', done: false },
      { text: 'Mémoire partagée transverse usager entre banques, commerces, santé et transports', done: false },
      { text: 'Certification souveraineté européenne et audit inaltérable complet', done: false },
      { text: 'Ouverture de l\'API NEXOMIA aux partenaires industriels tiers', done: false }
    ]
  }
];
