import {
  FraudTransaction,
  ProductStock,
  ReassortOrder,
  AuditLog,
  SectorDefinition,
  MySQLTableSchema
} from '../types/nexomia';
import {
  SECTORS_DATA,
  INITIAL_FRAUD_TRANSACTIONS,
  INITIAL_PRODUCTS_STOCK,
  INITIAL_REASSORT_ORDERS,
  INITIAL_AUDIT_LOGS,
  MYSQL_TABLE_SCHEMAS,
  MYSQL_DDL_SCRIPT
} from '../data/databaseSeed';

export interface DatabaseState {
  sectors: SectorDefinition[];
  fraudTransactions: FraudTransaction[];
  products: ProductStock[];
  reassortOrders: ReassortOrder[];
  auditLogs: AuditLog[];
}

export interface SQLQueryResult {
  success: boolean;
  query: string;
  executionTimeMs: number;
  columns: string[];
  rows: Record<string, any>[];
  affectedRows?: number;
  message?: string;
  error?: string;
}

const STORAGE_KEY = 'nexomia_mysql_state_v1';

export class MySQLEngine {
  private state: DatabaseState;
  private listeners: (() => void)[] = [];

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): DatabaseState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {
      sectors: [...SECTORS_DATA],
      fraudTransactions: [...INITIAL_FRAUD_TRANSACTIONS],
      products: [...INITIAL_PRODUCTS_STOCK],
      reassortOrders: [...INITIAL_REASSORT_ORDERS],
      auditLogs: [...INITIAL_AUDIT_LOGS]
    };
  }

  public saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // ignore
    }
    this.notify();
  }

  public resetState() {
    this.state = {
      sectors: [...SECTORS_DATA],
      fraudTransactions: [...INITIAL_FRAUD_TRANSACTIONS],
      products: [...INITIAL_PRODUCTS_STOCK],
      reassortOrders: [...INITIAL_REASSORT_ORDERS],
      auditLogs: [...INITIAL_AUDIT_LOGS]
    };
    this.saveState();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  public getState(): DatabaseState {
    return this.state;
  }

  public getTableSchemas(): MySQLTableSchema[] {
    const schemas = [...MYSQL_TABLE_SCHEMAS];
    // update dynamic row counts
    schemas[0].rowCount = this.state.sectors.length;
    schemas[1].rowCount = this.state.fraudTransactions.length;
    schemas[2].rowCount = this.state.products.length;
    schemas[3].rowCount = this.state.reassortOrders.length;
    schemas[4].rowCount = 2; // sessions
    schemas[5].rowCount = this.state.auditLogs.length;
    return schemas;
  }

  public getTableRows(tableName: string): Record<string, any>[] {
    switch (tableName) {
      case 'nexomia_sectors':
        return this.state.sectors.map(s => ({
          id: s.id,
          name: s.name,
          category: s.category,
          agent_name: s.agentName,
          autonomy_l1_pct: s.autonomyDistribution.level1,
          autonomy_l2_pct: s.autonomyDistribution.level2,
          autonomy_l3_pct: s.autonomyDistribution.level3,
          active_workflows: s.metrics.activeWorkflows,
          accuracy_rate: s.metrics.accuracyRate
        }));
      case 'fraud_transactions':
        return this.state.fraudTransactions.map(f => ({
          id: f.id,
          transaction_ref: f.transaction_ref,
          customer_name: f.customer_name,
          amount: `${f.amount.toFixed(2)} ${f.currency}`,
          merchant: f.merchant,
          location: f.location,
          device: f.device_name,
          risk_score: f.risk_score,
          autonomy_level: `Niv. ${f.autonomy_level}`,
          status: f.status,
          response_time_ms: `${f.response_time_ms} ms`,
          push_status: f.customer_push_status
        }));
      case 'products_inventory':
        return this.state.products.map(p => ({
          id: p.id,
          sku: p.sku,
          name: p.name,
          category: p.category,
          price: `${p.price.toFixed(2)} €`,
          current_stock: p.current_stock,
          min_threshold: p.min_threshold,
          return_rate: `${p.return_rate_percentage}% (Normal: ${p.normal_return_rate}%)`,
          status: p.status,
          supplier: p.supplier
        }));
      case 'reassort_orders':
        return this.state.reassortOrders.map(r => ({
          id: r.id,
          order_number: r.order_number,
          sku: r.sku,
          product_name: r.product_name,
          requested_qty: r.requested_quantity,
          total_cost: `${r.total_cost.toFixed(2)} €`,
          triggered_by: r.triggered_by,
          status: r.status,
          created_at: r.created_at,
          validated_by: r.validated_by || 'En attente'
        }));
      case 'audit_logs':
        return this.state.auditLogs.map(a => ({
          id: a.id,
          timestamp: a.timestamp,
          layer: a.layer,
          sector: a.sector,
          action: a.action,
          actor: a.actor,
          autonomy_level: `Niveau ${a.autonomy_level}`,
          risk_score: `${a.risk_score}/100`,
          sha256_hash: a.hash.substring(0, 16) + '...'
        }));
      default:
        return [];
    }
  }

  // Add audit log helper
  public addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp' | 'hash'>) {
    const newLog: AuditLog = {
      ...log,
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 23),
      hash: Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2)
    };
    this.state.auditLogs.unshift(newLog);
    this.saveState();
  }

  // Cas Pratique 1: Evaluation / Insertion de transaction
  public evaluateAndInsertTransaction(tx: Omit<FraudTransaction, 'id' | 'detected_at' | 'response_time_ms'>): FraudTransaction {
    const startTime = performance.now();
    
    // Algorithme de scoring NEXOMIA
    let score = tx.risk_score;
    const level = score >= 80 ? 3 : score >= 40 ? 2 : 1;
    const status = score >= 80 ? 'SUSPENDED_PREVENTIVE' : 'APPROVED_LEGITIMATE';
    const responseTime = Math.round(performance.now() - startTime + Math.floor(Math.random() * 80 + 320));

    const newTx: FraudTransaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      risk_score: score,
      autonomy_level: level,
      status: status,
      detected_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      response_time_ms: responseTime,
      customer_push_status: score >= 80 ? 'SENT' : 'WAITING',
      decision_notes: score >= 80
        ? `Transaction suspendue en ${responseTime}ms par Niveau 1-2. Alerte escaladée en Niveau 3.`
        : `Transaction autorisée de manière autonome en ${responseTime}ms.`
    };

    this.state.fraudTransactions.unshift(newTx);
    
    this.addAuditLog({
      layer: 'Couche 4 (Orchestration & Action Graduée)',
      sector: 'Finance & Assurance',
      action: status === 'SUSPENDED_PREVENTIVE' ? 'SUSPENSION_PREVENTIVE' : 'AUTONOMOUS_APPROVAL',
      actor: 'NEX-Fraud Guardian [Agent IA]',
      autonomy_level: level,
      risk_score: score,
      details: `Transaction ${newTx.transaction_ref} (${newTx.amount} €) évaluée en ${responseTime}ms. Statut: ${status}.`
    });

    this.saveState();
    return newTx;
  }

  // Update status of a fraud transaction by human or user
  public updateFraudTransactionStatus(
    id: string,
    status: FraudTransaction['status'],
    pushStatus: FraudTransaction['customer_push_status'],
    operatorNote: string
  ) {
    const tx = this.state.fraudTransactions.find(t => t.id === id);
    if (!tx) return;

    tx.status = status;
    tx.customer_push_status = pushStatus;
    tx.decision_notes = operatorNote;

    this.addAuditLog({
      layer: 'Couche 5 (Gouvernance & Sécurité)',
      sector: 'Finance & Assurance',
      action: status === 'CONFIRMED_FRAUD' ? 'FRAUD_CONFIRMED_BLOCKED' : 'TRANSACTION_CLEARED',
      actor: 'Conseiller Anti-Fraude [Humain]',
      autonomy_level: 3,
      risk_score: tx.risk_score,
      details: `Transaction ${tx.transaction_ref} mise à jour: ${status}. Note: ${operatorNote}`
    });

    this.saveState();
  }

  // Cas Pratique 2: Générer étiquette retour et réassort
  public processReturnRequest(sku: string, reason: string): { labelId: string; trackingCode: string } {
    const labelId = `RET-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingCode = `FR-COLIS-${Math.floor(10000000 + Math.random() * 90000000)}`;

    // Update product return rate and stock
    const prod = this.state.products.find(p => p.sku === sku);
    if (prod) {
      prod.return_rate_percentage = Math.round((prod.return_rate_percentage + 1.2) * 10) / 10;
      if (prod.return_rate_percentage > 20) {
        prod.status = 'REORDER_RECOMMENDED';
      }
    }

    // Check substitute size L
    const substituteProd = this.state.products.find(p => p.sku === 'NEX-JKT-882-L');
    if (substituteProd && substituteProd.current_stock < 15) {
      substituteProd.status = 'CRITICAL';
    }

    this.addAuditLog({
      layer: 'Couche 1 & 4 (Interface & Autonomie)',
      sector: 'Commerce & Vente',
      action: 'RETURN_LABEL_AUTONOMOUS',
      actor: 'NEX-Retail Sentinel [Niveau 1]',
      autonomy_level: 1,
      risk_score: 12,
      details: `Étiquette de retour ${labelId} (${trackingCode}) émise pour SKU ${sku}. Motif: ${reason}.`
    });

    this.saveState();
    return { labelId, trackingCode };
  }

  // Valider réassort Niveau 2 -> Action Humaine
  public approveReassortOrder(orderId: string, approverName: string) {
    const order = this.state.reassortOrders.find(r => r.id === orderId);
    if (!order) return;

    order.status = 'APPROVED';
    order.validated_by = `${approverName} (Responsable Ventes & Logistique)`;
    order.validated_at = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Update product stock inventory
    const prod = this.state.products.find(p => p.id === order.product_id);
    if (prod) {
      prod.current_stock += order.requested_quantity;
      prod.status = 'IN_STOCK';
    }

    this.addAuditLog({
      layer: 'Couche 4 (Orchestration & Validation)',
      sector: 'Commerce & Vente',
      action: 'REASSORT_ORDER_VALIDATED',
      actor: `${approverName} [Humain - Resp. Ventes]`,
      autonomy_level: 2,
      risk_score: 68,
      details: `Bon de commande ${order.order_number} (${order.requested_quantity} ex. de ${order.product_name}) validé et transmis au fournisseur ${order.supplier}.`
    });

    this.saveState();
  }

  // Interactive SQL Query Engine
  public executeSQL(rawQuery: string): SQLQueryResult {
    const startTime = performance.now();
    const query = rawQuery.trim().replace(/;$/, '');
    const upper = query.toUpperCase();

    try {
      // 1. SELECT queries
      if (upper.startsWith('SELECT')) {
        let rows: Record<string, any>[] = [];
        let columns: string[] = [];

        if (upper.includes('FROM FRAUD_TRANSACTIONS')) {
          rows = this.getTableRows('fraud_transactions');
          // Filter if WHERE risk_score
          if (upper.includes('RISK_SCORE >')) {
            const match = upper.match(/RISK_SCORE\s*>\s*(\d+)/);
            if (match) {
              const threshold = parseInt(match[1], 10);
              rows = rows.filter(r => (parseInt(r.risk_score, 10) || 0) > threshold);
            }
          }
          if (upper.includes('STATUS =')) {
            if (upper.includes("'SUSPENDED_PREVENTIVE'")) {
              rows = rows.filter(r => r.status === 'SUSPENDED_PREVENTIVE');
            }
          }
        } else if (upper.includes('FROM PRODUCTS_INVENTORY') || upper.includes('FROM PRODUCTS')) {
          rows = this.getTableRows('products_inventory');
          if (upper.includes('STATUS =') || upper.includes('CRITICAL')) {
            rows = rows.filter(r => r.status === 'CRITICAL' || r.status === 'REORDER_RECOMMENDED');
          }
        } else if (upper.includes('FROM REASSORT_ORDERS')) {
          rows = this.getTableRows('reassort_orders');
        } else if (upper.includes('FROM AUDIT_LOGS')) {
          rows = this.getTableRows('audit_logs');
        } else if (upper.includes('FROM NEXOMIA_SECTORS') || upper.includes('FROM SECTORS')) {
          rows = this.getTableRows('nexomia_sectors');
        } else if (upper.includes('COUNT(*)') || upper.includes('SUM(')) {
          // Aggregate stats
          rows = [{
            total_sectors: this.state.sectors.length,
            total_fraud_monitored: this.state.fraudTransactions.length,
            fraud_suspended: this.state.fraudTransactions.filter(f => f.status === 'SUSPENDED_PREVENTIVE').length,
            critical_stock_skus: this.state.products.filter(p => p.status === 'CRITICAL').length,
            total_audit_events: this.state.auditLogs.length
          }];
        } else {
          // Default to all sectors
          rows = this.getTableRows('nexomia_sectors');
        }

        // Limit
        if (upper.includes('LIMIT')) {
          const limitMatch = upper.match(/LIMIT\s+(\d+)/);
          if (limitMatch) {
            rows = rows.slice(0, parseInt(limitMatch[1], 10));
          }
        }

        columns = rows.length > 0 ? Object.keys(rows[0]) : ['result'];

        return {
          success: true,
          query,
          executionTimeMs: Math.round((performance.now() - startTime + Math.random() * 4 + 1.2) * 100) / 100,
          columns,
          rows,
          message: `${rows.length} ligne(s) retournée(s) en ${Math.round((performance.now() - startTime) * 10) / 10} ms`
        };
      }

      // 2. UPDATE query simulation
      if (upper.startsWith('UPDATE')) {
        return {
          success: true,
          query,
          executionTimeMs: Math.round((performance.now() - startTime + 2) * 100) / 100,
          columns: ['status', 'message'],
          rows: [{ status: 'SUCCESS', message: 'Mise à jour effectuée avec succès dans MySQL InnoDB' }],
          affectedRows: 1,
          message: 'Query OK, 1 row affected (0.02 sec)'
        };
      }

      // 3. SHOW TABLES
      if (upper.startsWith('SHOW TABLES')) {
        const tables = this.getTableSchemas().map(t => ({ Tables_in_nexomia_db: t.tableName, Engine: t.engine, Rows: t.rowCount }));
        return {
          success: true,
          query,
          executionTimeMs: 1.1,
          columns: ['Tables_in_nexomia_db', 'Engine', 'Rows'],
          rows: tables,
          message: `${tables.length} tables in nexomia_db`
        };
      }

      return {
        success: false,
        query,
        executionTimeMs: 0.5,
        columns: [],
        rows: [],
        error: `Syntaxe SQL non reconnue ou non autorisée dans cette console sécurisée. Utilisez SELECT, SHOW TABLES ou les requêtes suggérées.`
      };
    } catch (err: any) {
      return {
        success: false,
        query,
        executionTimeMs: 0.5,
        columns: [],
        rows: [],
        error: err?.message || 'Erreur MySQL inconnue'
      };
    }
  }

  public exportMySQLDump(): string {
    let sql = MYSQL_DDL_SCRIPT;
    sql += '\n\n-- ========================================================\n';
    sql += '-- DONNÉES ENREGISTRÉES (DUMP COMPLET)\n';
    sql += '-- ========================================================\n\n';

    // Dump sectors
    sql += 'LOCK TABLES `nexomia_sectors` WRITE;\n';
    sql += 'INSERT INTO `nexomia_sectors` VALUES \n';
    const sectorValues = this.state.sectors.map(s => 
      `('${s.id}', '${s.name.replace(/'/g, "''")}', '${s.category.replace(/'/g, "''")}', '${s.agentName}', '${s.agentRepere.replace(/'/g, "''")}', '${s.humainValide.replace(/'/g, "''")}', ${s.autonomyDistribution.level1}, ${s.autonomyDistribution.level2}, ${s.autonomyDistribution.level3}, ${s.metrics.activeWorkflows}, ${s.metrics.accuracyRate}, NOW())`
    ).join(',\n');
    sql += sectorValues + ';\nUNLOCK TABLES;\n\n';

    // Dump fraud transactions
    sql += 'LOCK TABLES `fraud_transactions` WRITE;\n';
    sql += 'INSERT INTO `fraud_transactions` VALUES \n';
    const txValues = this.state.fraudTransactions.map(f => 
      `('${f.id}', '${f.transaction_ref}', '${f.customer_id}', '${f.customer_name.replace(/'/g, "''")}', ${f.amount}, '${f.currency}', '${f.merchant.replace(/'/g, "''")}', '${f.location}', '${f.country}', '${f.device_name}', ${f.device_trusted ? 1 : 0}, '${f.ip_address}', ${f.risk_score}, ${f.autonomy_level}, '${f.status}', '${f.detected_at}', ${f.response_time_ms}, '${JSON.stringify(f.suspicion_reasons)}', '${f.customer_push_status}')`
    ).join(',\n');
    sql += txValues + ';\nUNLOCK TABLES;\n\n';

    return sql;
  }

  // --- CSV Export Methods for Decision Reporting ---

  private escapeCSV(value: any): string {
    if (value === null || value === undefined) return '';
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes(';')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  }

  public exportFraudAuditCSV(): string {
    const headers = [
      'ID_Transaction',
      'Reference',
      'Date_Detection',
      'ID_Client',
      'Nom_Client',
      'Montant',
      'Devise',
      'Commercant',
      'Localisation',
      'Pays',
      'Appareil',
      'Appareil_De_Confiance',
      'Adresse_IP',
      'Score_Risque_OMNIA',
      'Niveau_Autonomie',
      'Statut_Decisionnel',
      'Temps_Reaction_MS',
      'Statut_Push_Mobile',
      'Motifs_Suspicion',
      'Notes_Arbitrage_Conseiller'
    ];

    const rows = this.state.fraudTransactions.map(t => [
      t.id,
      t.transaction_ref,
      t.detected_at,
      t.customer_id,
      t.customer_name,
      t.amount.toFixed(2),
      t.currency,
      t.merchant,
      t.location,
      t.country,
      t.device_name,
      t.device_trusted ? 'OUI' : 'NON',
      t.ip_address,
      t.risk_score,
      `Niveau_${t.autonomy_level}`,
      t.status,
      t.response_time_ms,
      t.customer_push_status,
      t.suspicion_reasons.join(' | '),
      t.decision_notes || ''
    ]);

    const csvContent = [
      headers.map(h => this.escapeCSV(h)).join(';'),
      ...rows.map(row => row.map(cell => this.escapeCSV(cell)).join(';'))
    ].join('\r\n');

    return csvContent;
  }

  public exportStockInventoryCSV(): string {
    const headers = [
      'SKU',
      'Designation_Produit',
      'Categorie',
      'Prix_Vente_EUR',
      'Cout_Unitaire_Achat_EUR',
      'Stock_Actuel',
      'Seuil_Critique_Alerte',
      'Capacite_Maximale',
      'Taux_Retour_Actuel_PCT',
      'Taux_Retour_Normal_PCT',
      'Statut_Stock',
      'Fournisseur_Principal',
      'Delai_Reassort_Jours',
      'Ordre_Reassort_Associe',
      'Quantite_Reassort_Commandee',
      'Cout_Total_Reassort_EUR',
      'Statut_Validation_Humaine'
    ];

    const rows = this.state.products.map(p => {
      const order = this.state.reassortOrders.find(r => r.product_id === p.id || r.sku === p.sku);
      return [
        p.sku,
        p.name,
        p.category,
        p.price.toFixed(2),
        p.unit_cost.toFixed(2),
        p.current_stock,
        p.min_threshold,
        p.max_capacity,
        p.return_rate_percentage.toFixed(1),
        p.normal_return_rate.toFixed(1),
        p.status,
        p.supplier,
        p.lead_time_days,
        order ? order.order_number : 'AUCUN',
        order ? order.requested_quantity : 0,
        order ? order.total_cost.toFixed(2) : '0.00',
        order ? order.status : 'N/A'
      ];
    });

    const csvContent = [
      headers.map(h => this.escapeCSV(h)).join(';'),
      ...rows.map(row => row.map(cell => this.escapeCSV(cell)).join(';'))
    ].join('\r\n');

    return csvContent;
  }

  public exportAuditLogsCSV(): string {
    const headers = [
      'ID_Audit',
      'Horodatage_UTC',
      'Couche_Architecture',
      'Secteur_Activite',
      'Action_Decisionnelle',
      'Acteur_Responsable',
      'Niveau_Autonomie',
      'Score_Risque',
      'Empreinte_Cryptographique_SHA256',
      'Details_Operationnels'
    ];

    const rows = this.state.auditLogs.map(a => [
      a.id,
      a.timestamp,
      a.layer,
      a.sector,
      a.action,
      a.actor,
      `Niveau_${a.autonomy_level}`,
      a.risk_score,
      a.hash,
      a.details
    ]);

    const csvContent = [
      headers.map(h => this.escapeCSV(h)).join(';'),
      ...rows.map(row => row.map(cell => this.escapeCSV(cell)).join(';'))
    ].join('\r\n');

    return csvContent;
  }

  public downloadCSVFile(content: string, filename: string): void {
    const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const mysqlEngine = new MySQLEngine();
