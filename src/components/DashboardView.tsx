import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShoppingBag, 
  Layers, 
  Database, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle,
  Zap,
  TrendingUp,
  Clock,
  SlidersHorizontal,
  FileSpreadsheet,
  Globe2,
  Lock,
  Cpu,
  Mic,
  Radio,
  Download,
  FileText,
  Check,
  BarChart3
} from 'lucide-react';
import { mysqlEngine } from '../services/mysqlEngine';
import { useLanguage } from '../context/LanguageContext';
import { 
  downloadCSV, 
  exportFraudAuditCSV, 
  exportStockInventoryCSV, 
  exportDecisionReportingPerformanceCSV 
} from '../utils/csvExport';

interface DashboardViewProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab }) => {
  const { language, t } = useLanguage();
  const state = mysqlEngine.getState();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [recentExport, setRecentExport] = useState<string | null>(null);

  const suspendedCount = state.fraudTransactions.filter(t => t.status === 'SUSPENDED_PREVENTIVE').length;
  const criticalStockCount = state.products.filter(p => p.status === 'CRITICAL' || p.status === 'REORDER_RECOMMENDED').length;
  const pendingReassortCount = state.reassortOrders.filter(r => r.status === 'PROPOSED').length;

  const showToast = (msg: string, exportType?: string) => {
    setToastMessage(msg);
    if (exportType) setRecentExport(exportType);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleExportFraud = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const { filename, content } = exportFraudAuditCSV(state.fraudTransactions, state.auditLogs);
    downloadCSV(filename, content);
    showToast(
      language === 'wo' 
        ? 'Saytu sacc gi génn na ci CSV ak dencukaayu MySQL !' 
        : language === 'en'
        ? 'Fraud audit exported to CSV successfully!'
        : language === 'es'
        ? '¡Auditoría de fraude exportada a CSV con éxito!'
        : language === 'ar'
        ? 'تم تصدير تدقيق الاحتيال بتنسيق CSV بنجاح!'
        : 'Données d\'audit fraude exportées en CSV avec succès !',
      'fraud'
    );
  };

  const handleExportStocks = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const { filename, content } = exportStockInventoryCSV(state.products, state.reassortOrders);
    downloadCSV(filename, content);
    showToast(
      language === 'wo'
        ? 'Xibaaru mbaal mi génn na ci CSV !'
        : language === 'en'
        ? 'Stock inventory and reorders exported to CSV successfully!'
        : language === 'es'
        ? '¡Estado de stock y reabastecimiento exportado a CSV!'
        : language === 'ar'
        ? 'تم تصدير حالة المخزون وأوامر التجديد بتنسيق CSV!'
        : 'État des stocks et réassorts exportés en CSV avec succès !',
      'stocks'
    );
  };

  const handleExportFullReporting = () => {
    const { filename, content } = exportDecisionReportingPerformanceCSV(state);
    downloadCSV(filename, content);
    showToast(
      language === 'wo'
        ? 'Kaye gu mat sëuk gu dogal yi génn na ci CSV !'
        : language === 'en'
        ? 'Executive decision performance report exported to CSV!'
        : language === 'es'
        ? '¡Informe ejecutivo de decisión exportado a CSV!'
        : language === 'ar'
        ? 'تم تصدير تقرير الأداء التنفيذي الشامل بتنسيق CSV!'
        : 'Rapport complet de performance décisionnelle exporté en CSV !',
      'full'
    );
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Toast Alert on CSV Export */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-xl bg-slate-900 border border-emerald-500/60 text-white shadow-2xl flex items-center gap-3 animate-slide-in">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">Export CSV Confirmé</div>
            <div className="text-sm font-medium">{toastMessage}</div>
          </div>
        </div>
      )}

      {/* Executive Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            {t.dashboard.heroBadge}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {t.dashboard.heroTitle} <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              {t.dashboard.heroSubtitle}
            </span>
          </h1>

          <p className="mt-4 text-base md:text-lg text-slate-300 leading-relaxed">
            {t.dashboard.heroDesc}
          </p>

          {/* Quick CTA buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('voice-chat')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition cursor-pointer"
            >
              <Mic className="w-4 h-4 animate-pulse" />
              <span>{t.dashboard.ctaVoice}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => setActiveTab('demo-fraud')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md transition cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{t.dashboard.ctaFraud}</span>
            </button>

            <button
              onClick={() => setActiveTab('demo-commerce')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold text-sm border border-indigo-400/30 transition cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t.dashboard.ctaCommerce}</span>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition cursor-pointer"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span>{t.dashboard.ctaDatabase}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Target KPIs from Document */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t.dashboard.kpiFraudAvoided}</span>
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">94.2 %</span>
            <span className="text-xs font-medium text-emerald-400">
              {language === 'wo' ? 'Tolluway > 90%' : language === 'en' ? 'Target > 90%' : language === 'es' ? 'Objetivo > 90%' : language === 'ar' ? 'الهدف > 90%' : 'Objectif > 90%'}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {language === 'wo' ? 'Teey laata defar xalis' : language === 'en' ? 'Blocked prior to execution' : language === 'es' ? 'Bloqueo previo a la ejecución' : language === 'ar' ? 'حظر وقائي قبل التنفيذ' : 'Blocage avant exécution transactionnelle'}
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t.dashboard.kpiReactionTime}</span>
            <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">412 ms</span>
            <span className="text-xs font-medium text-blue-400">
              {language === 'wo' ? 'Tolluway < 5s' : language === 'en' ? 'Target < 5s' : language === 'es' ? 'Objetivo < 5s' : language === 'ar' ? 'الهدف < 5 ث' : 'Objectif < 5 s'}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {language === 'wo' ? 'Xam-xam bu gaaw te teey' : language === 'en' ? 'Real-time contextual scoring' : language === 'es' ? 'Puntuación y suspensión preventiva' : language === 'ar' ? 'تقييم سياقي وتعليق فوري' : 'Scoring contextuel & suspension préventive'}
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t.dashboard.kpiEscalation}</span>
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <SlidersHorizontal className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">8.7 %</span>
            <span className="text-xs font-medium text-amber-400">
              {language === 'wo' ? 'Tolluway < 12%' : language === 'en' ? 'Target < 12%' : language === 'es' ? 'Objetivo < 12%' : language === 'ar' ? 'الهدف < 12%' : 'Objectif < 12%'}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {language === 'wo' ? 'Tolloo 3 ngir dogal yu am solo' : language === 'en' ? 'Level 3 reserved for high impact' : language === 'es' ? 'Nivel 3 reservado a alto impacto' : language === 'ar' ? 'المستوى 3 مخصص للحالات الحرجة' : 'Niveau 3 réservé aux cas à fort impact'}
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t.dashboard.kpiSectors}</span>
            <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">13 / 13</span>
            <span className="text-xs font-medium text-purple-400">
              {language === 'wo' ? 'Mat na sëuk 100%' : language === 'en' ? '100% Coverage' : language === 'es' ? '100% Cobertura' : language === 'ar' ? 'تغطية 100%' : 'Couverture 100%'}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {language === 'wo' ? 'Jaay, Xaalis, Wér-gu-yaram, Usin, etc.' : language === 'en' ? 'Retail, Finance, Healthcare, Industry...' : language === 'es' ? 'Comercio, Finanzas, Salud, Industria...' : language === 'ar' ? 'التجارة، المالية، الصحة، الصناعة...' : 'Commerce, Finance, Santé, Industrie, etc.'}
          </p>
        </div>
      </div>

      {/* Synergie Stratégique Section (Document 1.1) */}
      <div className="border border-slate-800 rounded-2xl bg-slate-900/40 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400" />
              1.1 Pourquoi fusionner NEXORA/NEXUS et OMNIA/MERIDIAN ?
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Une infrastructure unique reliant conversation omnicanale, analyse décisionnelle, recommandation métier et action supervisée.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
              Mémoire contextuelle partagée
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* NEXORA Column */}
          <div className="p-5 rounded-xl border border-blue-900/40 bg-gradient-to-br from-blue-950/30 to-slate-900/40">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider text-blue-400">Apport de NEXORA / NEXUS</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">Relation & Orchestration</span>
            </div>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span><strong>Expérience multimodale :</strong> Prise en charge native texte, voix et image.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span><strong>Mémoire longue durée :</strong> Continuité absolue du parcours usager sans répétition.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span><strong>Connecteurs natifs SI :</strong> CRM, ERP, messageries instantanées (WhatsApp, SMS).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span><strong>Workflows & escalade :</strong> Automatisation fluide et redirection vers l'humain.</span>
              </li>
            </ul>
          </div>

          {/* OMNIA Column */}
          <div className="p-5 rounded-xl border border-purple-900/40 bg-gradient-to-br from-purple-950/30 to-slate-900/40">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider text-purple-400">Apport de OMNIA / MERIDIAN</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Intelligence & Analyse Sectorielle</span>
            </div>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                <span><strong>Moteur RAG documentaire :</strong> Analyse approfondie des bases documentaires et règles métiers.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                <span><strong>Raisonnement sur données brutes :</strong> Détection de signaux faibles et anomalies complexes.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                <span><strong>Agents experts & garde-fous :</strong> Isolation hermétique des règles par industrie.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                <span><strong>Gouvernance souveraine :</strong> Chiffrement AES-256, conformité et traçabilité SHA-256.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Module Officiel de Reporting Décisionnel & Export CSV */}
      <div className="border border-indigo-500/30 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-900 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 mb-2">
              <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
              <span>{t.common.reportingTitle}</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Exportation des Données de Performance Décisionnelle</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                CSV Standard RFC 4180 & UTF-8
              </span>
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              {t.common.reportingDesc}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportFullReporting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Rapport Décisionnel Complet (CSV)</span>
            </button>
          </div>
        </div>

        {/* 3 Export Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* Pillar 1: Audit Fraude */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-rose-500/30 flex flex-col justify-between hover:border-rose-500/60 transition group">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  Audit Anti-Fraude
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                  {state.fraudTransactions.length} tx
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-2">
                Transactions, Scoring & Alertes
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Historique certifié des tentatives de fraude, latences de blocage (&lt;1s), scores de risque et traçabilité SHA-256.
              </p>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-300">
                <span className="font-semibold text-rose-400">{suspendedCount} sous alerte</span>
                <span>&bull;</span>
                <span className="text-emerald-400 font-semibold">94.2% évitées</span>
              </div>
            </div>

            <button
              onClick={handleExportFraud}
              className="mt-4 w-full py-2 px-3 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer group-hover:bg-rose-600 group-hover:text-white"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.common.exportFraudCSV}</span>
            </button>
          </div>

          {/* Pillar 2: État des Stocks */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-amber-500/30 flex flex-col justify-between hover:border-amber-500/60 transition group">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4" />
                  État des Stocks & Logistique
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  {state.products.length} SKUs
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-2">
                Inventaire, Taux Retours & Réassorts
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Niveaux de stocks en temps réel, alertes de rupture, anomalies prédictives de retours (+28%) et bons de commande Niveau 2.
              </p>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-300">
                <span className="font-semibold text-amber-400">{criticalStockCount} alertes réassort</span>
                <span>&bull;</span>
                <span className="text-indigo-300 font-semibold">{pendingReassortCount} bon en attente</span>
              </div>
            </div>

            <button
              onClick={handleExportStocks}
              className="mt-4 w-full py-2 px-3 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer group-hover:bg-amber-600 group-hover:text-white"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.common.exportStockCSV}</span>
            </button>
          </div>

          {/* Pillar 3: Vue Synthèse Exécutive */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-indigo-500/30 flex flex-col justify-between hover:border-indigo-500/60 transition group">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4" />
                  Synthèse 13 Secteurs
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                  13 Agents
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-2">
                Gouvernance & Autonomie Graduée
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Tableau de bord consolidé pour comités de direction : KPIs d'autonomie (L1, L2, L3), précision IA et intégrité opérationnelle.
              </p>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-300">
                <span className="font-semibold text-indigo-300">100% conformité</span>
                <span>&bull;</span>
                <span className="text-cyan-400 font-semibold">MySQL 8.0 direct</span>
              </div>
            </div>

            <button
              onClick={handleExportFullReporting}
              className="mt-4 w-full py-2 px-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer group-hover:bg-indigo-600 group-hover:text-white"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger Rapport Décisionnel (CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Les Deux Cas Pratiques Expérimentaux (Document Section 5) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">5. Deux Cas Pratiques Opérationnels Immédiats</h2>
            <p className="text-sm text-slate-400">Cliquez sur une rubrique pour lancer l'expérimentation interactive avec données en direct</p>
          </div>
          <span className="text-xs text-blue-400 font-medium">Temps réel & base MySQL connectée</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Cas 1 */}
          <div 
            onClick={() => setActiveTab('demo-fraud')}
            className="group cursor-pointer rounded-2xl border border-blue-800/40 bg-gradient-to-b from-blue-950/20 to-slate-900/80 p-6 hover:border-blue-500/60 hover:shadow-xl hover:shadow-blue-500/10 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 group-hover:bg-blue-500/20 transition">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportFraud}
                    title="Exporter les transactions d'audit fraude en CSV"
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">CSV</span>
                  </button>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    Score Risque 91/100
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mt-4 group-hover:text-blue-300 transition">
                Cas 1 : Finance & Assurance – Détection de Fraude Carte Bancaire
              </h3>
              <p className="text-sm text-slate-300 mt-2 line-clamp-3">
                Tentative de paiement de <strong>640 € à l'étranger</strong> depuis un appareil inconnu. Suspension immédiate en &lt; 1s, 
                croisement contextuel instantané et escalade Niveau 3 vers conseiller anti-fraude + notification push client.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-white">{suspendedCount}</span> transactions sous alerte
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportFraud}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Audit CSV</span>
                </button>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                  Lancer la démo <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>

          {/* Card Cas 2 */}
          <div 
            onClick={() => setActiveTab('demo-commerce')}
            className="group cursor-pointer rounded-2xl border border-indigo-800/40 bg-gradient-to-b from-indigo-950/20 to-slate-900/80 p-6 hover:border-indigo-500/60 hover:shadow-xl hover:shadow-indigo-500/10 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 group-hover:bg-indigo-500/20 transition">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportStocks}
                    title="Exporter l'état des stocks et réassorts en CSV"
                    className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">CSV</span>
                  </button>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Niveau 1-2 Gradué
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mt-4 group-hover:text-indigo-300 transition">
                Cas 2 : Commerce & Vente – Relation Omnicanale & Gestion des Stocks
              </h3>
              <p className="text-sm text-slate-300 mt-2 line-clamp-3">
                Continuité du parcours du site Web vers WhatsApp pour un retour produit autonome (Niveau 1). 
                Détection prédictive d'une hausse anormale des retours (+28%) et proposition de réassort automatique validée par l'humain (Niveau 2).
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-amber-400">{pendingReassortCount}</span> ordre de réassort en attente
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportStocks}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Stocks CSV</span>
                </button>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
                  Lancer la démo <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clickable Feature Cards for Other Rubriques */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Rubriques Stratégiques et Opérationnelles Cliquables</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Rubrique Voix Live */}
          <div 
            onClick={() => setActiveTab('voice-chat')}
            className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40 hover:border-emerald-500/60 cursor-pointer transition group"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                <Mic className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Live API</span>
            </div>
            <h4 className="font-bold text-white mt-3 group-hover:text-emerald-300 transition">Voix gemini-3.8-live</h4>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Interaction audio temps réel bidirectionnelle avec interruption à la volée.
            </p>
          </div>

          {/* Rubrique 13 Secteurs */}
          <div 
            onClick={() => setActiveTab('sectors')}
            className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/60 hover:border-slate-700 cursor-pointer transition group"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Document §3</span>
            </div>
            <h4 className="font-bold text-white mt-3 group-hover:text-blue-300 transition">Couverture 13 Secteurs</h4>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Cartographie complète : repérage agent IA vs décision humaine pour chaque secteur.
            </p>
          </div>

          {/* Rubrique Architecture */}
          <div 
            onClick={() => setActiveTab('architecture')}
            className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/60 hover:border-slate-700 cursor-pointer transition group"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Document §2 & §4</span>
            </div>
            <h4 className="font-bold text-white mt-3 group-hover:text-indigo-300 transition">Architecture 5 Couches</h4>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              De l'interface omnicanale à la gouvernance avec modèle d'autonomie graduée à 3 niveaux.
            </p>
          </div>

          {/* Rubrique MySQL Engine */}
          <div 
            onClick={() => setActiveTab('database')}
            className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/60 hover:border-slate-700 cursor-pointer transition group"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                <Database className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">MySQL 8.0</span>
            </div>
            <h4 className="font-bold text-white mt-3 group-hover:text-cyan-300 transition">Base MySQL & SQL</h4>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              6 tables relationnelles InnoDB, console de requêtes et dump SQL exportable.
            </p>
          </div>

          {/* Rubrique Pricing & Roadmap */}
          <div 
            onClick={() => setActiveTab('pricing-roadmap')}
            className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/60 hover:border-slate-700 cursor-pointer transition group"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Document §6 & §7</span>
            </div>
            <h4 className="font-bold text-white mt-3 group-hover:text-purple-300 transition">Offres & Roadmap</h4>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Starter, Business, Enterprise et jalons de déploiement à 3 ans.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
