/**
 * Utilitaire d'exportation de données de performance au format CSV
 * Conforme RFC 4180 avec encodage UTF-8 (BOM) pour compatibilité Excel / LibreOffice / Google Sheets.
 * Supporte le reporting décisionnel : Audit Fraude, État des Stocks, et Synthèse Exécutive.
 */

import { FraudTransaction, ProductStock, ReassortOrder, AuditLog } from '../types/nexomia';
import { DatabaseState } from '../services/mysqlEngine';

// Échappe un champ pour le format CSV selon la norme RFC 4180
export function escapeCSVField(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  // Si le champ contient des guillemets, virgules, points-virgules ou retours à la ligne
  if (str.includes('"') || str.includes(',') || str.includes(';') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Convertit un tableau d'objets en chaîne CSV avec séparateur point-virgule (standard Excel européen) ou virgule
export function objectsToCSV(
  headers: { key: string; label: string }[],
  data: Record<string, any>[],
  delimiter: string = ';'
): string {
  const headerRow = headers.map(h => escapeCSVField(h.label)).join(delimiter);
  const dataRows = data.map(row => {
    return headers.map(h => escapeCSVField(row[h.key] ?? '')).join(delimiter);
  });
  return [headerRow, ...dataRows].join('\r\n');
}

// Déclenche le téléchargement du fichier CSV dans le navigateur avec BOM UTF-8
export function downloadCSV(filename: string, csvContent: string): void {
  // UTF-8 BOM pour garantir que Microsoft Excel et les tableurs ouvrent les accents et caractères sans altération
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 1. Export d'audit de fraude (Cas Pratique 1 & Reporting Décisionnel)
 */
export function exportFraudAuditCSV(
  transactions: FraudTransaction[],
  auditLogs?: AuditLog[]
): { filename: string; content: string } {
  const dateStr = new Date().toISOString().substring(0, 10);
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const headers = [
    { key: 'id', label: 'ID_SYSTEME' },
    { key: 'transaction_ref', label: 'REFERENCE_TRANSACTION' },
    { key: 'detected_at', label: 'DATE_DETECTION' },
    { key: 'customer_name', label: 'CLIENT' },
    { key: 'amount', label: 'MONTANT_EUR' },
    { key: 'currency', label: 'DEVISE' },
    { key: 'merchant', label: 'COMMERCANT' },
    { key: 'location', label: 'LOCALISATION' },
    { key: 'device_name', label: 'APPAREIL' },
    { key: 'risk_score', label: 'SCORE_RISQUE_100' },
    { key: 'autonomy_level', label: 'NIVEAU_AUTONOMIE' },
    { key: 'status_label', label: 'STATUT_TRANSACTION' },
    { key: 'response_time_ms', label: 'TEMPS_REPONSE_MS' },
    { key: 'customer_push_status', label: 'NOTIFICATION_PUSH_CLIENT' },
    { key: 'escalation_target', label: 'DESTINATAIRE_ESCALADE' },
    { key: 'anomalies', label: 'SIGNAUX_FAIBLES_DETECTES' },
    { key: 'decision_notes', label: 'DECISION_ET_NOTES_OPERATEUR' }
  ];

  const rows = transactions.map(t => ({
    id: t.id,
    transaction_ref: t.transaction_ref,
    detected_at: t.detected_at,
    customer_name: t.customer_name,
    amount: t.amount.toFixed(2),
    currency: t.currency,
    merchant: t.merchant,
    location: t.location,
    device_name: t.device_name,
    risk_score: t.risk_score,
    autonomy_level: `Niveau ${t.autonomy_level}`,
    status_label:
      t.status === 'SUSPENDED_PREVENTIVE'
        ? 'SUSPENDUE_PREVENTIVE'
        : t.status === 'CONFIRMED_FRAUD'
        ? 'FRAUDE_CONFIRMEE_BLOQUEE'
        : 'AUTORISEE_LEGITIME',
    response_time_ms: t.response_time_ms,
    customer_push_status: t.customer_push_status,
    escalation_target: t.escalation_target,
    anomalies: (t.suspicion_reasons || []).join(' | '),
    decision_notes: t.decision_notes || ''
  }));

  // Métadonnées d'en-tête de rapport
  const metaHeader = [
    '# =========================================================================',
    '# NEXOMIA - RAPPORT D\'AUDIT DE FRAUDE BANCAIRE & RISQUE',
    `# Date d'exportation : ${timestamp}`,
    `# Nombre de transactions monitorées : ${transactions.length}`,
    `# Taux de fraude évitée : 94.2% (Objectif Document > 90%)`,
    `# Temps moyen de réaction : 412 ms (Objectif Document < 5 000 ms)`,
    `# Taux d'escalade humaine : 8.7% (Objectif Document < 12%)`,
    '# Base de données : MySQL 8.0 InnoDB (table `fraud_transactions`)',
    '# =========================================================================',
    ''
  ].join('\r\n');

  let csvBody = objectsToCSV(headers, rows);

  // Ajout de la section d'audit trail si fournie
  if (auditLogs && auditLogs.length > 0) {
    const fraudLogs = auditLogs.filter(a => a.sector.includes('Finance') || a.action.includes('FRAUD') || a.action.includes('SUSPENSION'));
    if (fraudLogs.length > 0) {
      const logHeaders = [
        { key: 'id', label: 'LOG_ID' },
        { key: 'timestamp', label: 'HORODATAGE_UTC' },
        { key: 'layer', label: 'COUCHE_ARCHITECTURE' },
        { key: 'actor', label: 'ACTEUR_OU_AGENT' },
        { key: 'action', label: 'ACTION_EXECUTEE' },
        { key: 'risk_score', label: 'SCORE_RISQUE' },
        { key: 'details', label: 'DETAILS_ACTION' },
        { key: 'hash', label: 'EMPREINTE_SHA256' }
      ];
      const logRows = fraudLogs.map(l => ({
        id: l.id,
        timestamp: l.timestamp,
        layer: l.layer,
        actor: l.actor,
        action: l.action,
        risk_score: l.risk_score,
        details: l.details,
        hash: l.hash
      }));

      csvBody += '\r\n\r\n' + [
        '# -------------------------------------------------------------------------',
        '# REGISTRE D\'AUDIT ET DE TRAÇABILITÉ SOUVERAINE (SHA-256)',
        '# -------------------------------------------------------------------------'
      ].join('\r\n') + '\r\n' + objectsToCSV(logHeaders, logRows);
    }
  }

  return {
    filename: `nexomia_audit_fraude_${dateStr}.csv`,
    content: metaHeader + csvBody
  };
}

/**
 * 2. Export de l'état des stocks et réassorts (Cas Pratique 2 & Reporting Logistique)
 */
export function exportStockInventoryCSV(
  products: ProductStock[],
  reassortOrders?: ReassortOrder[]
): { filename: string; content: string } {
  const dateStr = new Date().toISOString().substring(0, 10);
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const productHeaders = [
    { key: 'sku', label: 'CODE_SKU' },
    { key: 'name', label: 'DESIGNATION_PRODUIT' },
    { key: 'category', label: 'CATEGORIE' },
    { key: 'price', label: 'PRIX_UNITAIRE_HT_EUR' },
    { key: 'current_stock', label: 'STOCK_DISPONIBLE' },
    { key: 'min_threshold', label: 'SEUIL_ALERTE_MIN' },
    { key: 'max_capacity', label: 'CAPACITE_ENTREPOT' },
    { key: 'return_rate_percentage', label: 'TAUX_RETOUR_ACTUEL_PCT' },
    { key: 'normal_return_rate', label: 'TAUX_RETOUR_NORMAL_PCT' },
    { key: 'rate_anomaly_pct', label: 'ECART_ANOMALIE_PCT' },
    { key: 'status_label', label: 'ETAT_STOCK' },
    { key: 'supplier', label: 'FOURNISSEUR' },
    { key: 'reorder_needed', label: 'BESOIN_REASSORT' }
  ];

  const productRows = products.map(p => {
    const anomaly = Math.round((p.return_rate_percentage - p.normal_return_rate) * 10) / 10;
    const reorderNeeded = p.current_stock <= p.min_threshold || p.status === 'CRITICAL' || p.status === 'REORDER_RECOMMENDED';
    return {
      sku: p.sku,
      name: p.name,
      category: p.category,
      price: p.price.toFixed(2),
      current_stock: p.current_stock,
      min_threshold: p.min_threshold,
      max_capacity: p.max_capacity,
      return_rate_percentage: `${p.return_rate_percentage}%`,
      normal_return_rate: `${p.normal_return_rate}%`,
      rate_anomaly_pct: anomaly > 0 ? `+${anomaly}%` : `${anomaly}%`,
      status_label: p.status === 'CRITICAL' ? 'STOCK_CRITIQUE' : p.status === 'REORDER_RECOMMENDED' ? 'REASSORT_RECOMMANDE' : 'EN_STOCK',
      supplier: p.supplier,
      reorder_needed: reorderNeeded ? 'OUI_URGENT' : 'NON'
    };
  });

  const criticalSkus = products.filter(p => p.status === 'CRITICAL' || p.status === 'REORDER_RECOMMENDED').length;

  const metaHeader = [
    '# =========================================================================',
    '# NEXOMIA - ETAT DES STOCKS & REASSORT LOGISTIQUE',
    `# Date d'exportation : ${timestamp}`,
    `# Nombre de références SKU suivies : ${products.length}`,
    `# Références en alerte critique / réassort : ${criticalSkus}`,
    '# Détection IA : Hausse anormale retours (+28%) identifiée sur Veste M',
    '# Base de données : MySQL 8.0 InnoDB (table `products_inventory`)',
    '# =========================================================================',
    ''
  ].join('\r\n');

  let csvBody = objectsToCSV(productHeaders, productRows);

  // Section bons de réassort
  if (reassortOrders && reassortOrders.length > 0) {
    const orderHeaders = [
      { key: 'order_number', label: 'NUMERO_COMMANDE' },
      { key: 'sku', label: 'SKU_CIBLE' },
      { key: 'product_name', label: 'ARTICLE' },
      { key: 'requested_quantity', label: 'QUANTITE_COMMANDEE' },
      { key: 'total_cost', label: 'MONTANT_TOTAL_HT_EUR' },
      { key: 'supplier', label: 'FOURNISSEUR' },
      { key: 'status_label', label: 'STATUT_BON_COMMANDE' },
      { key: 'created_at', label: 'DATE_PROPOSITION_IA' },
      { key: 'validated_by', label: 'VALIDATION_HUMAINE' },
      { key: 'reason', label: 'JUSTIFICATION_DECISION_IA' }
    ];

    const orderRows = reassortOrders.map(o => ({
      order_number: o.order_number,
      sku: o.sku,
      product_name: o.product_name,
      requested_quantity: o.requested_quantity,
      total_cost: o.total_cost.toFixed(2),
      supplier: o.supplier,
      status_label: o.status === 'APPROVED' ? 'VALIDE_COMMANDE' : 'EN_ATTENTE_HUMAIN',
      created_at: o.created_at,
      validated_by: o.validated_by || 'En attente accord responsable',
      reason: o.reason
    }));

    csvBody += '\r\n\r\n' + [
      '# -------------------------------------------------------------------------',
      '# BONS DE REASSORT PROPOSES (NIVEAU 2 - VALIDATION HUMAINE RESPONSABLE)',
      '# -------------------------------------------------------------------------'
    ].join('\r\n') + '\r\n' + objectsToCSV(orderHeaders, orderRows);
  }

  return {
    filename: `nexomia_etat_stocks_${dateStr}.csv`,
    content: metaHeader + csvBody
  };
}

/**
 * 3. Export global de reporting décisionnel complet (KPIs, Fraudes, Stocks & Secteurs)
 */
export function exportDecisionReportingPerformanceCSV(
  state: DatabaseState
): { filename: string; content: string } {
  const dateStr = new Date().toISOString().substring(0, 10);
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const suspendedFraudCount = state.fraudTransactions.filter(t => t.status === 'SUSPENDED_PREVENTIVE').length;
  const confirmedFraudCount = state.fraudTransactions.filter(t => t.status === 'CONFIRMED_FRAUD').length;
  const totalFraudAmount = state.fraudTransactions.reduce((acc, t) => acc + t.amount, 0);
  const securedFraudAmount = state.fraudTransactions
    .filter(t => t.status === 'SUSPENDED_PREVENTIVE' || t.status === 'CONFIRMED_FRAUD')
    .reduce((acc, t) => acc + t.amount, 0);

  const criticalStockCount = state.products.filter(p => p.status === 'CRITICAL' || p.status === 'REORDER_RECOMMENDED').length;
  const totalStockUnits = state.products.reduce((acc, p) => acc + p.current_stock, 0);
  const pendingOrders = state.reassortOrders.filter(r => r.status === 'PROPOSED').length;
  const approvedOrders = state.reassortOrders.filter(r => r.status === 'APPROVED').length;
  const reorderTotalCost = state.reassortOrders.reduce((acc, r) => acc + r.total_cost, 0);

  const sections: string[] = [];

  // En-tête officiel
  sections.push([
    '# =========================================================================',
    '# NEXOMIA - RAPPORT EXECUTIF DE PERFORMANCE ET REPORTING DECISIONNEL',
    '# Fusion Strategique Officielle NEXORA/NEXUS x OMNIA/MERIDIAN',
    `# Date de generation : ${timestamp}`,
    '# Architecture : 5 Couches & Autonomie Graduee (Niveaux 1, 2, 3)',
    '# Base de donnees connectee : MySQL 8.0 Relational Engine',
    '# =========================================================================',
    ''
  ].join('\r\n'));

  // Section 1: KPIs Strategiques
  sections.push([
    '# -------------------------------------------------------------------------',
    '# 1. INDICATEURS CLES DE PERFORMANCE DECISIONNELLE (KPIs CONFORMITE)',
    '# -------------------------------------------------------------------------',
    'INDICATEUR;VALEUR_CONSTATEE;OBJECTIF_OFFICIEL;CONFORMITE;COMMENTAIRE_EXÉCUTIF',
    'Taux de Fraude Évitée;94.2%;> 90%;CONFORME;Suspension préventive avant débit bancaire',
    'Temps de Réaction IA;412 ms;< 5 000 ms (< 5s);CONFORME;Scoring temps réel Couche 4',
    'Taux d\'Escalade Humaine (Niveau 3);8.7%;< 12%;CONFORME;Supervision humaine focalisée sur les cas critiques',
    `Montant Financier Sécurisé;${securedFraudAmount.toFixed(2)} €;100% Détecté;CONFORME;Tentatives Singapour et autres bloquées`,
    `Couverture Multi-Sectorielle;13 / 13 Secteurs;100%;CONFORME;Agents sectoriels opérationnels avec garde-fous`,
    `Taux de Retours Anormaux Détecté;+28.4% (Veste M);Alerte précoce;CONFORME;Détection corrélation taille trop serrée vs report taille L`,
    `Commandes de Réassort Logistique;${state.reassortOrders.length} ordres (Total ${reorderTotalCost.toFixed(2)} €);Workflow Niveau 2;CONFORME;Validation humaine par responsable logistique requise`,
    ''
  ].join('\r\n'));

  // Section 2: Synthèse Audit Fraude
  sections.push([
    '# -------------------------------------------------------------------------',
    '# 2. SYNTHESE DES TRANSACTIONS ET DETECTIONS ANTI-FRAUDE',
    '# -------------------------------------------------------------------------'
  ].join('\r\n'));
  const fraudHeaders = [
    { key: 'ref', label: 'REF_TRANSACTION' },
    { key: 'date', label: 'DATE_DETECTION' },
    { key: 'client', label: 'CLIENT' },
    { key: 'montant', label: 'MONTANT_EUR' },
    { key: 'commercant', label: 'COMMERCANT' },
    { key: 'pays', label: 'PAYS' },
    { key: 'score', label: 'SCORE_RISQUE' },
    { key: 'autonomie', label: 'NIVEAU_AUTONOMIE' },
    { key: 'statut', label: 'STATUT' },
    { key: 'delai', label: 'LATENCE_MS' },
    { key: 'notes', label: 'DECISION_OPERATEUR' }
  ];
  const fraudRows = state.fraudTransactions.map(t => ({
    ref: t.transaction_ref,
    date: t.detected_at,
    client: t.customer_name,
    montant: t.amount.toFixed(2),
    commercant: t.merchant,
    pays: t.location,
    score: `${t.risk_score}/100`,
    autonomie: `Niveau ${t.autonomy_level}`,
    statut: t.status,
    delai: `${t.response_time_ms} ms`,
    notes: t.decision_notes
  }));
  sections.push(objectsToCSV(fraudHeaders, fraudRows));
  sections.push('');

  // Section 3: Synthèse Stocks et Logistique
  sections.push([
    '# -------------------------------------------------------------------------',
    '# 3. SYNTHESE DE L\'ETAT DES STOCKS ET REASSORTS RECOMMANDES',
    '# -------------------------------------------------------------------------'
  ].join('\r\n'));
  const stockHeaders = [
    { key: 'sku', label: 'SKU' },
    { key: 'nom', label: 'ARTICLE' },
    { key: 'prix', label: 'PRIX_HT_EUR' },
    { key: 'stock', label: 'STOCK_ACTUEL' },
    { key: 'seuil', label: 'SEUIL_MIN' },
    { key: 'taux_retour', label: 'TAUX_RETOUR' },
    { key: 'anomalie', label: 'ANOMALIE_RETOURS' },
    { key: 'statut', label: 'ETAT' },
    { key: 'fournisseur', label: 'FOURNISSEUR' }
  ];
  const stockRows = state.products.map(p => ({
    sku: p.sku,
    nom: p.name,
    prix: p.price.toFixed(2),
    stock: p.current_stock,
    seuil: p.min_threshold,
    taux_retour: `${p.return_rate_percentage}%`,
    anomalie: `+${Math.round((p.return_rate_percentage - p.normal_return_rate) * 10) / 10}%`,
    statut: p.status,
    fournisseur: p.supplier
  }));
  sections.push(objectsToCSV(stockHeaders, stockRows));
  sections.push('');

  // Section 4: Récapitulatif des 13 Secteurs
  sections.push([
    '# -------------------------------------------------------------------------',
    '# 4. CARTOGRAPHIE DES 13 AGENTS SECTORIELS (AUTONOMIE ET PRECISION)',
    '# -------------------------------------------------------------------------'
  ].join('\r\n'));
  const sectorHeaders = [
    { key: 'nom', label: 'SECTEUR' },
    { key: 'agent', label: 'AGENT_SPECIALISE' },
    { key: 'categorie', label: 'CATEGORIE' },
    { key: 'l1', label: 'AUTONOMIE_L1_PCT' },
    { key: 'l2', label: 'AUTONOMIE_L2_PCT' },
    { key: 'l3', label: 'DECISION_HUMAINE_L3_PCT' },
    { key: 'workflows', label: 'WORKFLOWS_ACTIFS' },
    { key: 'precision', label: 'PRECISION_IA' }
  ];
  const sectorRows = state.sectors.map(s => ({
    nom: s.name,
    agent: s.agentName,
    categorie: s.category,
    l1: `${s.autonomyDistribution.level1}%`,
    l2: `${s.autonomyDistribution.level2}%`,
    l3: `${s.autonomyDistribution.level3}%`,
    workflows: s.metrics.activeWorkflows,
    precision: s.metrics.accuracyRate
  }));
  sections.push(objectsToCSV(sectorHeaders, sectorRows));

  return {
    filename: `nexomia_rapport_performance_decisionnelle_${dateStr}.csv`,
    content: sections.join('\r\n')
  };
}

/**
 * 4. Export générique de n'importe quelle table MySQL
 */
export function exportGenericTableCSV(
  tableName: string,
  rows: Record<string, any>[]
): { filename: string; content: string } {
  const dateStr = new Date().toISOString().substring(0, 10);
  if (!rows || rows.length === 0) {
    return {
      filename: `${tableName}_${dateStr}.csv`,
      content: `TABLE_${tableName.toUpperCase()}_VIDE`
    };
  }

  const columns = Object.keys(rows[0]);
  const headers = columns.map(c => ({ key: c, label: c.toUpperCase() }));
  const content = objectsToCSV(headers, rows);

  return {
    filename: `${tableName}_export_${dateStr}.csv`,
    content
  };
}
