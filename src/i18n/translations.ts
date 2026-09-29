export type Language = 'fr' | 'wo' | 'en' | 'es' | 'ar';

export interface Translations {
  nav: {
    dashboard: string;
    voiceLive: string;
    sectors: string;
    demoFraud: string;
    demoCommerce: string;
    architecture: string;
    database: string;
    pricingRoadmap: string;
    resetDemo: string;
    officialFusion: string;
  };
  dashboard: {
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    heroDesc: string;
    ctaVoice: string;
    ctaFraud: string;
    ctaCommerce: string;
    ctaDatabase: string;
    kpiFraudAvoided: string;
    kpiReactionTime: string;
    kpiEscalation: string;
    kpiSectors: string;
    synergyTitle: string;
    synergyDesc: string;
    nexoraTitle: string;
    omniaTitle: string;
    casesTitle: string;
    casesDesc: string;
    case1Title: string;
    case1Desc: string;
    case2Title: string;
    case2Desc: string;
    launchDemo: string;
    sectionsTitle: string;
  };
  voice: {
    badge: string;
    title: string;
    subtitle: string;
    statusConnected: string;
    statusConnecting: string;
    statusReady: string;
    orbListening: string;
    orbSpeaking: string;
    orbStart: string;
    orbConnecting: string;
    instructionListening: string;
    instructionSpeaking: string;
    instructionIdle: string;
    startMicBtn: string;
    stopMicBtn: string;
    voiceLabel: string;
    presetHeading: string;
    transcriptTitle: string;
    synthBanner: string;
    inputPlaceholder: string;
    sendBtn: string;
    presets: {
      q1: string;
      q2: string;
      q3: string;
      q4: string;
    };
  };
  common: {
    activeUnifiedCore: string;
    mysqlConnected: string;
    riskScore: string;
    level: string;
    level1: string;
    level2: string;
    level3: string;
    humanDecision: string;
    autonomous: string;
    recommended: string;
    exportCSV: string;
    exportFraudCSV: string;
    exportStockCSV: string;
    exportAuditCSV: string;
    reportingTitle: string;
    reportingDesc: string;
  };
}

export const translations: Record<Language, Translations> = {
  fr: {
    nav: {
      dashboard: 'Tableau de Bord',
      voiceLive: 'Voix Live',
      sectors: '13 Secteurs',
      demoFraud: 'Cas 1 : Fraude',
      demoCommerce: 'Cas 2 : Omnicanal',
      architecture: 'Architecture',
      database: 'Base MySQL',
      pricingRoadmap: 'Offres & Roadmap',
      resetDemo: 'Réinitialiser Démo',
      officialFusion: 'FUSION OFFICIELLE ET STRATÉGIQUE',
    },
    dashboard: {
      heroBadge: 'NEXOMIA : Document de Fusion Officiel et Stratégique',
      heroTitle: "Plateforme d'Intelligence Artificielle",
      heroSubtitle: 'Transversale & Multisectorielle',
      heroDesc: "La fusion opérationnelle et technologique de NEXORA / NEXUS (Relation & Orchestration) et OMNIA / MERIDIAN (Intelligence & Analyse Sectorielle) crée un socle unifié pour orchestrer la donnée, la décision et l'action sous contrôle humain.",
      ctaVoice: 'Conversation Vocale (gemini-3.8-live)',
      ctaFraud: 'Cas 1 : Anti-Fraude',
      ctaCommerce: 'Cas 2 : Omnicanal & Stocks',
      ctaDatabase: 'MySQL InnoDB',
      kpiFraudAvoided: 'Fraudes Évitées',
      kpiReactionTime: 'Temps de Réaction',
      kpiEscalation: "Taux d'Escalade Humaine",
      kpiSectors: 'Agents Sectoriels',
      synergyTitle: '1.1 Pourquoi fusionner NEXORA/NEXUS et OMNIA/MERIDIAN ?',
      synergyDesc: 'Une infrastructure unique reliant conversation omnicanale, analyse décisionnelle, recommandation métier et action supervisée.',
      nexoraTitle: 'Apport de NEXORA / NEXUS (Relation & Orchestration)',
      omniaTitle: 'Apport de OMNIA / MERIDIAN (Intelligence & RAG)',
      casesTitle: '5. Deux Cas Pratiques Opérationnels Immédiats',
      casesDesc: 'Cliquez sur une rubrique pour lancer l’expérimentation interactive avec données en direct',
      case1Title: 'Cas 1 : Finance & Assurance – Détection de Fraude Carte Bancaire',
      case1Desc: 'Tentative de paiement de 640 € à l’étranger depuis un appareil inconnu. Suspension immédiate en < 1s et escalade Niveau 3 vers conseiller.',
      case2Title: 'Cas 2 : Commerce & Vente – Relation Omnicanale & Gestion des Stocks',
      case2Desc: 'Continuité du parcours Web vers WhatsApp pour un retour produit autonome (Niveau 1) et réassort prédictif validé par l’humain (Niveau 2).',
      launchDemo: 'Lancer la démo',
      sectionsTitle: 'Rubriques Stratégiques et Opérationnelles Cliquables',
    },
    voice: {
      badge: 'Nouveau • Modèle gemini-3.8-live (Live API)',
      title: 'Conversation Vocale en Temps Réel',
      subtitle: 'Dialoguez de vive voix avec la plateforme NEXOMIA grâce à l’API gemini-3.8-live en 5 langues (Français, Wolof, Anglais, Espagnol, Arabe).',
      statusConnected: 'En Direct (16/24 kHz)',
      statusConnecting: 'Connexion en cours...',
      statusReady: 'Prêt à connecter',
      orbListening: 'À l’écoute',
      orbSpeaking: 'L’IA Parle',
      orbStart: 'Démarrer',
      orbConnecting: 'Connexion',
      instructionListening: 'Parlez librement dans votre micro, l’IA écoute et répond instantanément dans votre langue.',
      instructionSpeaking: 'NEXOMIA vous répond en direct (parlez à tout moment pour l’interrompre)...',
      instructionIdle: 'Cliquez sur le micro pour démarrer la session vocale en direct avec gemini-3.8-live.',
      startMicBtn: 'Activer Microphone & Parler',
      stopMicBtn: 'Couper le Microphone / Déconnecter',
      voiceLabel: 'Voix :',
      presetHeading: 'Suggestions de questions à poser vocalement :',
      transcriptTitle: 'Transcription & Historique Vocal',
      synthBanner: 'En cours de synthèse vocale :',
      inputPlaceholder: 'Posez une question à voix haute, ou tapez ici...',
      sendBtn: 'Envoyer',
      presets: {
        q1: 'Explique-moi la tentative de fraude de 640 € à Singapour.',
        q2: 'Pourquoi la veste NEX-JKT-882 taille M a-t-elle un taux de retour de 28% ?',
        q3: 'Quelles sont les décisions réservées à l’humain dans le secteur Santé ?',
        q4: 'Comment fonctionne la séparation des 5 couches de l’architecture NEXOMIA ?',
      },
    },
    common: {
      activeUnifiedCore: 'Noyau Unifié Actif',
      mysqlConnected: 'MySQL 8.0 InnoDB (Connecté)',
      riskScore: 'Score de Risque',
      level: 'Niveau',
      level1: 'Niveau 1 – Automatique',
      level2: 'Niveau 2 – Recommandé',
      level3: 'Niveau 3 – Humain Décide',
      humanDecision: 'Décision Humaine',
      autonomous: '100% Autonome',
      recommended: 'Recommandé',
      exportCSV: 'Exporter en CSV',
      exportFraudCSV: 'Exporter Audit Fraude (CSV)',
      exportStockCSV: 'Exporter État des Stocks (CSV)',
      exportAuditCSV: 'Exporter Registre d’Audit (CSV)',
      reportingTitle: 'Reporting Décisionnel & Export de Données',
      reportingDesc: 'Exportez les données certifiées de performance pour faciliter les comités exécutifs et l’aide à la décision.',
    },
  },
  wo: {
    nav: {
      dashboard: 'Tàbbalu Njiit',
      voiceLive: 'Kàddu Live',
      sectors: '13 Wàll yi',
      demoFraud: 'Pànc 1 : Sacc Kàrt',
      demoCommerce: 'Pànc 2 : Jaay ak Delloo',
      architecture: 'Tabbikoom',
      database: 'Dencukaay MySQL',
      pricingRoadmap: 'Njëg ak Yoon wi',
      resetDemo: 'Delloo ci xew-xew bu jëkk',
      officialFusion: 'BENNOO GU MAG AK MBIRUM STRATÉGIE',
    },
    dashboard: {
      heroBadge: 'NEXOMIA : Kayitu Bennoo gu Mag gu NEXORA ak OMNIA',
      heroTitle: 'Plaatformu Xel mu Ràññeeku',
      heroSubtitle: 'Mbooleem Wàll ak Xam-xam yu Tàccoo',
      heroDesc: 'Bennoo gu tar ci diggante NEXORA / NEXUS (Jokkoo ak Dogal yu Gaaw) ak OMNIA / MERIDIAN (Xam-xam bu Xóot ak Saytu) ngir teggil nit ki ci boppu dogal yépp te aar xibaar yi.',
      ctaVoice: 'Waxal ak Xel mi (gemini-3.8-live)',
      ctaFraud: 'Pànc 1 : Aar Kàrt yi',
      ctaCommerce: 'Pànc 2 : Jaay ak Mbaal',
      ctaDatabase: 'Dencukaay MySQL',
      kpiFraudAvoided: 'Sacc gu nu Teey',
      kpiReactionTime: 'Gaawaayu Tontu gi',
      kpiEscalation: 'Dogalu Nit ki',
      kpiSectors: '13 Wàll yu Doxal',
      synergyTitle: '1.1 Lu waral bennoo bi ci diggante NEXORA ak OMNIA ?',
      synergyDesc: 'Bennoo gi day lëkkale waxtaan ci bés bu nekk, saytu bu xóot, digal yu mat sëuk ak teggil nit ki ci boppu wàll yépp.',
      nexoraTitle: 'Liy joge ci NEXORA / NEXUS (Waxtaan ak Jokkalente)',
      omniaTitle: 'Liy joge ci OMNIA / MERIDIAN (Xel mu Ràññeeku ak RAG)',
      casesTitle: '5. Ñaari Pànc yu Am Solo yu Doxal Léegi-Léegi',
      casesDesc: 'Bësal benn wàll ngir seet naka lay doxee ak xibaar yu dëggu ci dencukaayu MySQL',
      case1Title: 'Pànc 1 : Xaalis ak Kàrt – Teey sacc bu amee ci bitim réew',
      case1Desc: 'Jéem a jële 640 € ci Singapour ak jumtukaay bu bees. Teey ko ci ndànk lu ëppul 1 saa (412 ms) te yëgal borom ak njiit li.',
      case2Title: 'Pànc 2 : Jaay ak Kër-jaay – WhatsApp ak Delloo Bagas yi',
      case2Desc: 'Jokkoo gu tàccoo diggante Site Web ak WhatsApp ngir delloo mbubb mu reyul te maye kayitu dellosi ci boppam (Tolloo 1), ba yéwéni mbaal mu bees (Tolloo 2).',
      launchDemo: 'Doxalal Pànc bi',
      sectionsTitle: 'Mbooleem Wàll yi nga mën a Bës',
    },
    voice: {
      badge: 'Lii bees na • Jumtukaay gemini-3.8-live (Wax bu Gaaw)',
      title: 'Waxtaan ak Kàddu ci Saa yu Dëggu (Wolof / Français / English...)',
      subtitle: 'Waxtaanal ci kàddu ak NEXOMIA ci làkku Wolof ak yeneen làkk yi ak jumtukaayu gemini-3.8-live.',
      statusConnected: 'Doxal na ci Kàddu (16/24 kHz)',
      statusConnecting: 'Mungi lëkkalente...',
      statusReady: 'Wàjjar na ngir wax',
      orbListening: 'Mungiy déglu...',
      orbSpeaking: 'NEXOMIA mungi wax...',
      orbStart: 'Dóor Wax ji',
      orbConnecting: 'Lëkkalente...',
      instructionListening: 'Waxal ci sa mikrofon ci Wolof mbaa Farañse, xel mi mungi déglu te dina tontu léegi-léegi.',
      instructionSpeaking: 'NEXOMIA mungi lay tontu ci kàddu (waxal saa yu la neexee ngir dagg ko)...',
      instructionIdle: 'Bësal butoŋu mikrofon bi ngir dóor waxtaan ci kàddu ak gemini-3.8-live.',
      startMicBtn: 'Takk Mikrofon bi & Waxal',
      stopMicBtn: 'Fey Mikrofon bi / Dagg ko',
      voiceLabel: 'Kàddu gi :',
      presetHeading: 'Laat yi nga mën a laaj ci kàddu ci Wolof :',
      transcriptTitle: 'Kayitu Waxtaan bi ak Bind gi',
      synthBanner: 'Mungiy génne kàddu gi :',
      inputPlaceholder: 'Laajal ci sa kàddu, mbaa nga bind ko fii ci Wolof...',
      sendBtn: 'Yónnee',
      presets: {
        q1: 'Naka la nuy faggowee sacc alal bu 640 € bi amee ci Singapour ?',
        q2: 'Lu waral mbubbu Gore-Pro M bi am 28% ci delloosi ?',
        q3: 'Yan dogal la nit rekk mën a jël ci wàllu wér-gu-yaram ?',
        q4: 'Naka la jëmmalukaay NEXOMIA bi doxee ci juroomi kër yi ?',
      },
    },
    common: {
      activeUnifiedCore: 'Noyau bi mungi Doxal',
      mysqlConnected: 'Dencukaayu MySQL 8.0 Lëkkale na',
      riskScore: 'Mboyju Gàcc gi',
      level: 'Tolloo',
      level1: 'Tolloo 1 – Ci Boppam',
      level2: 'Tolloo 2 – Xelal Njiit li',
      level3: 'Tolloo 3 – Nit ki rekk a dogal',
      humanDecision: 'Dogalu Nit',
      autonomous: '100% Ci boppam',
      recommended: 'Digal bu am solo',
      exportCSV: 'Génne ci CSV',
      exportFraudCSV: 'Génne Saytu Sacc gi (CSV)',
      exportStockCSV: 'Génne Xibaaru Mbaal mi (CSV)',
      exportAuditCSV: 'Génne Kayitu Saytu gi (CSV)',
      reportingTitle: 'Génne Xibaar ngir Dogal yi',
      reportingDesc: 'Génneel xibaar yi dëggu ngir njiit yi mën a jël dogal yu jub te gaaw.',
    },
  },
  en: {
    nav: {
      dashboard: 'Dashboard',
      voiceLive: 'Live Voice',
      sectors: '13 Sectors',
      demoFraud: 'Case 1: Fraud',
      demoCommerce: 'Case 2: Omnichannel',
      architecture: 'Architecture',
      database: 'MySQL Database',
      pricingRoadmap: 'Pricing & Roadmap',
      resetDemo: 'Reset Demo',
      officialFusion: 'OFFICIAL STRATEGIC MERGER',
    },
    dashboard: {
      heroBadge: 'NEXOMIA: Official Strategic Merger Document',
      heroTitle: 'Cross-Sector Artificial Intelligence',
      heroSubtitle: 'Platform & Decision Engine',
      heroDesc: 'The operational and technological merger of NEXORA / NEXUS (Relation & Orchestration) and OMNIA / MERIDIAN (Intelligence & Sector Analysis) creates a unified foundation to orchestrate data, decision, and action under human control.',
      ctaVoice: 'Voice Conversation (gemini-3.8-live)',
      ctaFraud: 'Case 1: Anti-Fraud',
      ctaCommerce: 'Case 2: Omnichannel & Stock',
      ctaDatabase: 'MySQL InnoDB',
      kpiFraudAvoided: 'Fraud Prevented',
      kpiReactionTime: 'Reaction Time',
      kpiEscalation: 'Human Escalation Rate',
      kpiSectors: 'Sector Agents',
      synergyTitle: '1.1 Why merge NEXORA/NEXUS and OMNIA/MERIDIAN?',
      synergyDesc: 'A unique infrastructure connecting omnichannel conversation, decision analytics, domain recommendation, and supervised action.',
      nexoraTitle: 'NEXORA / NEXUS Contribution (Relation & Orchestration)',
      omniaTitle: 'OMNIA / MERIDIAN Contribution (Intelligence & RAG)',
      casesTitle: '5. Two Operational Practical Cases',
      casesDesc: 'Click on a section to launch interactive testing with live MySQL database records',
      case1Title: 'Case 1: Finance & Insurance – Card Fraud Detection',
      case1Desc: 'Attempted payment of €640 abroad from an unknown device. Immediate preventive suspension in < 1s and Level 3 escalation to advisor.',
      case2Title: 'Case 2: Retail & Commerce – Omnichannel & Stock Management',
      case2Desc: 'Seamless Web-to-WhatsApp continuity for autonomous return (Level 1) and predictive replenishment approved by humans (Level 2).',
      launchDemo: 'Launch demo',
      sectionsTitle: 'Clickable Strategic and Operational Sections',
    },
    voice: {
      badge: 'New • gemini-3.8-live Model (Live API)',
      title: 'Real-Time Voice Conversation',
      subtitle: 'Talk directly with NEXOMIA platform using gemini-3.8-live API in English, French, Wolof, Spanish, or Arabic.',
      statusConnected: 'Live Streaming (16/24 kHz)',
      statusConnecting: 'Connecting...',
      statusReady: 'Ready to connect',
      orbListening: 'Listening',
      orbSpeaking: 'NEXOMIA Speaking',
      orbStart: 'Start',
      orbConnecting: 'Connecting',
      instructionListening: 'Speak freely into your microphone in English, the AI listens and responds instantly.',
      instructionSpeaking: 'NEXOMIA is answering live (speak anytime to interrupt)...',
      instructionIdle: 'Click the microphone to start real-time voice session with gemini-3.8-live.',
      startMicBtn: 'Turn On Mic & Speak',
      stopMicBtn: 'Mute Mic / Disconnect',
      voiceLabel: 'Voice:',
      presetHeading: 'Suggested spoken questions in English:',
      transcriptTitle: 'Transcript & Voice History',
      synthBanner: 'Synthesizing voice response:',
      inputPlaceholder: 'Ask a question out loud, or type here...',
      sendBtn: 'Send',
      presets: {
        q1: 'Explain the €640 fraud attempt in Singapore.',
        q2: 'Why does the NEX-JKT-882 size M jacket have a 28% return rate?',
        q3: 'What decisions are strictly reserved for humans in Healthcare?',
        q4: 'How does the 5-layer architecture of NEXOMIA work?',
      },
    },
    common: {
      activeUnifiedCore: 'Unified Core Active',
      mysqlConnected: 'MySQL 8.0 InnoDB (Connected)',
      riskScore: 'Risk Score',
      level: 'Level',
      level1: 'Level 1 – Autonomous',
      level2: 'Level 2 – Recommended',
      level3: 'Level 3 – Human Decides',
      humanDecision: 'Human Decision',
      autonomous: '100% Autonomous',
      recommended: 'Recommended',
      exportCSV: 'Export to CSV',
      exportFraudCSV: 'Export Fraud Audit (CSV)',
      exportStockCSV: 'Export Stock Inventory (CSV)',
      exportAuditCSV: 'Export Audit Logs (CSV)',
      reportingTitle: 'Decision Reporting & Data Export',
      reportingDesc: 'Export verified performance metrics to accelerate management reviews and executive decision-making.',
    },
  },
  es: {
    nav: {
      dashboard: 'Panel de Control',
      voiceLive: 'Voz en Vivo',
      sectors: '13 Sectores',
      demoFraud: 'Caso 1: Fraude',
      demoCommerce: 'Caso 2: Omnicanal',
      architecture: 'Arquitectura',
      database: 'Base MySQL',
      pricingRoadmap: 'Precios y Hoja de Ruta',
      resetDemo: 'Reiniciar Demo',
      officialFusion: 'FUSIÓN ESTRATÉGICA OFICIAL',
    },
    dashboard: {
      heroBadge: 'NEXOMIA: Documento Oficial de Fusión Estratégica',
      heroTitle: 'Plataforma de Inteligencia Artificial',
      heroSubtitle: 'Transversal y Multisectorial',
      heroDesc: 'La fusión tecnológica y operativa de NEXORA / NEXUS (Relación y Orquestación) y OMNIA / MERIDIAN (Inteligencia y Análisis Sectorial) crea una base unificada para orquestar datos, decisiones y acciones bajo control humano.',
      ctaVoice: 'Conversación de Voz (gemini-3.8-live)',
      ctaFraud: 'Caso 1: Anti-Fraude',
      ctaCommerce: 'Caso 2: Omnicanal y Stock',
      ctaDatabase: 'MySQL InnoDB',
      kpiFraudAvoided: 'Fraudes Evitados',
      kpiReactionTime: 'Tiempo de Reacción',
      kpiEscalation: 'Tasa de Escalado Humano',
      kpiSectors: 'Agentes Sectoriales',
      synergyTitle: '1.1 ¿Por qué fusionar NEXORA/NEXUS y OMNIA/MERIDIAN?',
      synergyDesc: 'Infraestructura única que une conversación omnicanal, análisis de decisiones, recomendaciones y acción supervisada.',
      nexoraTitle: 'Aporte de NEXORA / NEXUS (Relación y Orquestación)',
      omniaTitle: 'Aporte de OMNIA / MERIDIAN (Inteligencia y RAG)',
      casesTitle: '5. Dos Casos Prácticos Operacionales Inmediatos',
      casesDesc: 'Haga clic en una sección para iniciar la prueba interactiva con datos reales en MySQL',
      case1Title: 'Caso 1: Finanzas y Seguros – Detección de Fraude con Tarjeta',
      case1Desc: 'Intento de pago de 640 € en el extranjero desde dispositivo no reconocido. Suspensión preventiva en < 1s y escalado Nivel 3 al asesor.',
      case2Title: 'Caso 2: Comercio y Retail – Relación Omnicanal y Stock',
      case2Desc: 'Continuidad de la Web a WhatsApp para devolución autónoma (Nivel 1) y reabastecimiento predictivo validado por humanos (Nivel 2).',
      launchDemo: 'Iniciar demostración',
      sectionsTitle: 'Secciones Estratégicas y Operacionales',
    },
    voice: {
      badge: 'Nuevo • Modelo gemini-3.8-live (Live API)',
      title: 'Conversación de Voz en Tiempo Real',
      subtitle: 'Hable en directo con NEXOMIA mediante la API gemini-3.8-live en español, francés, wolof, inglés o árabe.',
      statusConnected: 'En Vivo (16/24 kHz)',
      statusConnecting: 'Conectando...',
      statusReady: 'Listo para conectar',
      orbListening: 'Escuchando',
      orbSpeaking: 'NEXOMIA Hablando',
      orbStart: 'Iniciar',
      orbConnecting: 'Conectando',
      instructionListening: 'Hable libremente a su micrófono en español, la IA escucha y responde al instante.',
      instructionSpeaking: 'NEXOMIA responde en vivo (hable en cualquier momento para interrumpir)...',
      instructionIdle: 'Haga clic en el micrófono para iniciar la sesión de voz con gemini-3.8-live.',
      startMicBtn: 'Activar Micrófono y Hablar',
      stopMicBtn: 'Silenciar Micrófono / Desconectar',
      voiceLabel: 'Voz:',
      presetHeading: 'Preguntas sugeridas para hablar en español:',
      transcriptTitle: 'Transcripción e Historial de Voz',
      synthBanner: 'Sintetizando respuesta de voz:',
      inputPlaceholder: 'Haga una pregunta en voz alta o escriba aquí...',
      sendBtn: 'Enviar',
      presets: {
        q1: 'Explícame el intento de fraude de 640 € en Singapur.',
        q2: '¿Por qué la chaqueta NEX-JKT-882 talla M tiene un 28% de devoluciones?',
        q3: '¿Qué decisiones están reservadas exclusivamente a humanos en Salud?',
        q4: '¿Cómo funciona la arquitectura de 5 capas de NEXOMIA?',
      },
    },
    common: {
      activeUnifiedCore: 'Núcleo Unificado Activo',
      mysqlConnected: 'MySQL 8.0 InnoDB (Conectado)',
      riskScore: 'Puntuación de Riesgo',
      level: 'Nivel',
      level1: 'Nivel 1 – Autónomo',
      level2: 'Nivel 2 – Recomendado',
      level3: 'Nivel 3 – Decisión Humana',
      humanDecision: 'Decisión Humana',
      autonomous: '100% Autónomo',
      recommended: 'Recomendado',
      exportCSV: 'Exportar a CSV',
      exportFraudCSV: 'Exportar Auditoría de Fraude (CSV)',
      exportStockCSV: 'Exportar Estado de Stock (CSV)',
      exportAuditCSV: 'Exportar Registro de Auditoría (CSV)',
      reportingTitle: 'Informes de Decisión y Exportación CSV',
      reportingDesc: 'Exporte métricas de rendimiento certificadas para facilitar comités ejecutivos y toma de decisiones.',
    },
  },
  ar: {
    nav: {
      dashboard: 'لوحة القيادة',
      voiceLive: 'صوت مباشر',
      sectors: 'القطاعات الـ 13',
      demoFraud: 'الحالة 1: الاحتيال',
      demoCommerce: 'الحالة 2: قنوات متعددة',
      architecture: 'الهندسة التقنية',
      database: 'قاعدة بيانات MySQL',
      pricingRoadmap: 'العروض وخارطة الطريق',
      resetDemo: 'إعادة ضبط العرض',
      officialFusion: 'الاندماج الاستراتيجي الرسمي',
    },
    dashboard: {
      heroBadge: 'نيكسوميا: وثيقة الاندماج الاستراتيجي الرسمي',
      heroTitle: 'منصة الذكاء الاصطناعي',
      heroSubtitle: 'متعددة القطاعات والشاملة',
      heroDesc: 'ينشئ الاندماج التشغيلي والتكنولوجي بين NEXORA / NEXUS (العلاقات والتنسيق) و OMNIA / MERIDIAN (الذكاء والتحليل القطاعي) قاعدة موحدة لتنسيق البيانات والقرارات والإجراءات تحت الإشراف البشري.',
      ctaVoice: 'محادثة صوتية مباشرة (gemini-3.8-live)',
      ctaFraud: 'الحالة 1: مكافحة الاحتيال',
      ctaCommerce: 'الحالة 2: القنوات المتعددة والمخزون',
      ctaDatabase: 'قاعدة MySQL InnoDB',
      kpiFraudAvoided: 'احتيال تم تفاديه',
      kpiReactionTime: 'سرعة الاستجابة',
      kpiEscalation: 'نسبة التصعيد للبشر',
      kpiSectors: 'وكلاء القطاعات',
      synergyTitle: '1.1 لماذا تم دمج NEXORA/NEXUS و OMNIA/MERIDIAN؟',
      synergyDesc: 'بنية تحتية فريدة تجمع بين المحادثة متعددة القنوات، التحليل القراري، التوصيات المتخصصة والعمل الخاضع للإشراف.',
      nexoraTitle: 'مساهمة NEXORA / NEXUS (العلاقات والتنسيق)',
      omniaTitle: 'مساهمة OMNIA / MERIDIAN (الذكاء و RAG)',
      casesTitle: '5. حالتان تطبيقيتان فوريتان',
      casesDesc: 'انقر على أي قسم لبدء التجربة التفاعلية باستخدام بيانات حية في قاعدة MySQL',
      case1Title: 'الحالة 1: المالية والتأمين – كشف الاحتيال المصرفي',
      case1Desc: 'محاولة دفع 640 يورو في الخارج من جهاز غير معروف. تعليق وقائي فوري في أقل من ثانية وتصعيد إلى المستوى 3 للمستشار.',
      case2Title: 'الحالة 2: التجارة والبيع – خدمة متعددة القنوات وإدارة المخزون',
      case2Desc: 'استمرارية المسار من الويب إلى واتساب للإرجاع الذاتي (المستوى 1) وتجديد المخزون التنبؤي بموافقة بشرية (المستوى 2).',
      launchDemo: 'بدء العرض التفاعلي',
      sectionsTitle: 'الأقسام الاستراتيجية والتشغيلية',
    },
    voice: {
      badge: 'جديد • نموذج gemini-3.8-live (Live API)',
      title: 'محادثة صوتية فورية ومباشرة',
      subtitle: 'تحدث بصوتك مباشرة مع منصة NEXOMIA عبر gemini-3.8-live بالعربية والولوفية والفرنسية والإنجليزية والإسبانية.',
      statusConnected: 'متصل ومباشر (16/24 kHz)',
      statusConnecting: 'جارٍ الاتصال...',
      statusReady: 'جاهز للاتصال',
      orbListening: 'يستمع إليك...',
      orbSpeaking: 'نيكسوميا يتحدث...',
      orbStart: 'ابدأ التحدث',
      orbConnecting: 'جارٍ الربط...',
      instructionListening: 'تحدث بحرية في الميكروفون باللغة العربية، الذكاء الاصطناعي يستمع ويجيب فوراً.',
      instructionSpeaking: 'نيكسوميا يجيبك مباشرة (يمكنك التحدث في أي وقت لمقاطعته)...',
      instructionIdle: 'انقر على الميكروفون لبدء الجلسة الصوتية الفورية مع gemini-3.8-live.',
      startMicBtn: 'تشغيل الميكروفون والتحدث',
      stopMicBtn: 'كتم الميكروفون / إنهاء',
      voiceLabel: 'الصوت:',
      presetHeading: 'أسئلة مقترحة للتحدث باللغة العربية:',
      transcriptTitle: 'سجل النسخ النصي والصوتي',
      synthBanner: 'جارٍ توليد الصوت المباشر:',
      inputPlaceholder: 'اطرح سؤالك بصوتك، أو اكتب هنا بالعربية...',
      sendBtn: 'إرسال',
      presets: {
        q1: 'اشرح لي محاولة الاحتيال بمبلغ 640 يورو في سنغافورة.',
        q2: 'لماذا سترة Gore-Pro M تسجل نسبة إرجاع 28%؟',
        q3: 'ما هي القرارات المحصورة بالبشر في قطاع الصحة؟',
        q4: 'كيف تعمل الطبقات الخمس في هندسة NEXOMIA التقنية؟',
      },
    },
    common: {
      activeUnifiedCore: 'النواة الموحدة نشطة',
      mysqlConnected: 'MySQL 8.0 متصل',
      riskScore: 'مستوى الخطورة',
      level: 'المستوى',
      level1: 'المستوى 1 – ذاتي بالكامل',
      level2: 'المستوى 2 – موصى به',
      level3: 'المستوى 3 – قرار بشري',
      humanDecision: 'قرار بشري',
      autonomous: '100% ذاتي',
      recommended: 'موصى به',
      exportCSV: 'تصدير بتنسيق CSV',
      exportFraudCSV: 'تصدير تدقيق الاحتيال (CSV)',
      exportStockCSV: 'تصدير حالة المخزون (CSV)',
      exportAuditCSV: 'تصدير سجل التدقيق (CSV)',
      reportingTitle: 'تقارير اتخاذ القرار وتصدير البيانات',
      reportingDesc: 'تصدير بيانات الأداء المعتمدة لدعم اللجان التنفيذية وتسهيل اتخاذ القرار الاستراتيجي.',
    },
  },
};
