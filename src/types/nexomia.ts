/**
 * Types definitions for NEXOMIA Platform
 * Document officiel Septembre 2026
 */

export type AutonomyLevel = 1 | 2 | 3;

export interface AutonomyLevelInfo {
  level: AutonomyLevel;
  name: string;
  tagline: string;
  description: string;
  examples: string[];
  humanRole: string;
  badgeColor: string;
}

export interface SectorDefinition {
  id: string;
  name: string;
  category: 'Économie & Finance' | 'Santé & Vivant' | 'Industrie & Énergie' | 'Services & Mobilité' | 'Souveraineté & Public';
  icon: string;
  agentName: string;
  agentRepere: string; // Ce que l'agent repère / analyse
  humainValide: string; // Ce que l'humain valide / décide
  autonomyDistribution: {
    level1: number; // %
    level2: number; // %
    level3: number; // %
  };
  metrics: {
    activeWorkflows: number;
    dailyDecisions: number;
    riskAlerts: number;
    accuracyRate: number;
  };
  sampleAlert: {
    title: string;
    riskScore: number;
    level: AutonomyLevel;
    timestamp: string;
  };
}

export interface ArchitectureLayer {
  id: number;
  name: string;
  shortName: string;
  description: string;
  components: string[];
  techStack: string[];
  icon: string;
  status: 'active' | 'optimal';
}

export interface FraudTransaction {
  id: string;
  transaction_ref: string;
  customer_id: string;
  customer_name: string;
  amount: number;
  currency: string;
  merchant: string;
  location: string;
  country: string;
  device_name: string;
  device_trusted: boolean;
  ip_address: string;
  risk_score: number;
  autonomy_level: AutonomyLevel;
  status: 'SUSPENDED_PREVENTIVE' | 'CONFIRMED_FRAUD' | 'APPROVED_LEGITIMATE' | 'CLEARED_BY_USER' | 'PENDING_HUMAN';
  detected_at: string;
  response_time_ms: number;
  suspicion_reasons: string[];
  escalation_target: string;
  customer_push_status: 'SENT' | 'CONFIRMED_USER' | 'DENIED_USER' | 'WAITING';
  decision_notes?: string;
}

export interface ProductStock {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  current_stock: number;
  min_threshold: number;
  max_capacity: number;
  return_rate_percentage: number;
  normal_return_rate: number;
  supplier: string;
  lead_time_days: number;
  unit_cost: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'CRITICAL' | 'REORDER_RECOMMENDED';
}

export interface ReassortOrder {
  id: string;
  order_number: string;
  product_id: string;
  product_name: string;
  sku: string;
  requested_quantity: number;
  unit_cost: number;
  total_cost: number;
  supplier: string;
  triggered_by: 'NEXOMIA_AGENT_LEVEL_2' | 'MANUAL';
  reason: string;
  risk_forecast: string;
  status: 'PROPOSED' | 'APPROVED' | 'IN_PRODUCTION' | 'DELIVERED' | 'REJECTED';
  created_at: string;
  validated_by?: string;
  validated_at?: string;
}

export interface OmnichannelMessage {
  id: string;
  channel: 'WEB' | 'WHATSAPP' | 'SMS' | 'EMAIL';
  sender: 'user' | 'agent' | 'human_advisor';
  content: string;
  timestamp: string;
  metadata?: {
    actionType?: 'ORDER_LOOKUP' | 'RETURN_LABEL_GENERATED' | 'STOCK_ALERT' | 'ESCALATION';
    returnLabelUrl?: string;
    productRef?: string;
    trackingCode?: string;
  };
}

export interface CustomerOmniProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  tier: 'VIP' | 'STANDARD' | 'PREMIUM';
  cross_channel_id: string;
  last_orders: {
    order_id: string;
    date: string;
    product_name: string;
    sku: string;
    size: string;
    amount: number;
    return_eligible: boolean;
  }[];
  active_return_label?: {
    label_id: string;
    tracking_number: string;
    carrier: string;
    pdf_ready: boolean;
  };
}

export interface MySQLTableSchema {
  tableName: string;
  description: string;
  engine: string;
  charset: string;
  columns: {
    name: string;
    type: string;
    nullable: boolean;
    isPrimary?: boolean;
    isForeign?: boolean;
    defaultValue?: string;
    comment?: string;
  }[];
  rowCount: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  layer: string;
  sector: string;
  action: string;
  actor: string;
  autonomy_level: AutonomyLevel;
  risk_score: number;
  hash: string;
  details: string;
}
