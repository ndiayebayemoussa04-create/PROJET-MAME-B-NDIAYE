import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Smartphone, 
  UserCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  CreditCard, 
  Laptop, 
  ArrowRight, 
  RotateCcw, 
  Database,
  Send,
  Zap,
  Info,
  Lock,
  XCircle,
  TrendingDown,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { mysqlEngine } from '../services/mysqlEngine';
import { FraudTransaction } from '../types/nexomia';
import { downloadCSV, exportFraudAuditCSV } from '../utils/csvExport';

interface FraudDemoViewProps {
  setActiveTab: (tab: string) => void;
}

export const FraudDemoView: React.FC<FraudDemoViewProps> = ({ setActiveTab }) => {
  const transactions = mysqlEngine.getState().fraudTransactions;
  // Current active transaction (default to tx-001 from document)
  const [selectedTxId, setSelectedTxId] = useState<string>(transactions[0]?.id || 'tx-001');
  const [activeStep, setActiveStep] = useState<number>(4); // Completed through step 4
  const [operatorNote, setOperatorNote] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Custom simulation inputs
  const [customAmount, setCustomAmount] = useState<number>(640);
  const [customMerchant, setCustomMerchant] = useState<string>('Marina Bay Luxury Tech Pte - Singapour');
  const [customLocation, setCustomLocation] = useState<string>('Singapour (SG)');
  const [customDevice, setCustomDevice] = useState<string>('Apple iPhone 16 Pro (Non répertorié)');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const currentTx = transactions.find(t => t.id === selectedTxId) || transactions[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleExportCSV = () => {
    const auditLogs = mysqlEngine.getState().auditLogs;
    const { filename, content } = exportFraudAuditCSV(transactions, auditLogs);
    downloadCSV(filename, content);
    showToast(`Audit Fraude complet exporté en CSV (${transactions.length} transactions, traçabilité SHA-256) !`);
  };

  // Client smartphone response
  const handleClientResponse = (response: 'CONFIRMED_USER' | 'DENIED_USER') => {
    if (!currentTx) return;

    if (response === 'DENIED_USER') {
      mysqlEngine.updateFraudTransactionStatus(
        currentTx.id,
        'CONFIRMED_FRAUD',
        'DENIED_USER',
        'Le client a formellement rejeté la tentative depuis son mobile. Carte bloquée par précaution.'
      );
      showToast('Client : "Non, ce n\'est pas moi" reçu. Fraude confirmée et enregistrée dans MySQL !');
    } else {
      mysqlEngine.updateFraudTransactionStatus(
        currentTx.id,
        'APPROVED_LEGITIMATE',
        'CONFIRMED_USER',
        'Le client a confirmé être l\'auteur légitime de l\'achat à l\'étranger.'
      );
      showToast('Client : "C\'est bien moi" reçu. Transaction débloquée avec succès.');
    }
  };

  // Human Fraud Analyst actions
  const handleAnalystDecision = (status: FraudTransaction['status']) => {
    if (!currentTx) return;
    const note = operatorNote || (status === 'CONFIRMED_FRAUD' 
      ? 'Opposition définitive confirmée par le conseiller anti-fraude Niveau 3.'
      : 'Suspension levée après contrôle contextuel et validation client.');
    
    mysqlEngine.updateFraudTransactionStatus(
      currentTx.id,
      status,
      currentTx.customer_push_status,
      note
    );
    setOperatorNote('');
    showToast(`Décision conseiller enregistrée dans la table MySQL 'fraud_transactions' (${status})`);
  };

  // Run new simulated fraud transaction
  const handleRunSimulation = (amount: number, merchant: string, location: string, device: string, score: number) => {
    setIsSimulating(true);
    setActiveStep(1);

    setTimeout(() => {
      setActiveStep(2);
      setTimeout(() => {
        setActiveStep(3);
        setTimeout(() => {
          const newTx = mysqlEngine.evaluateAndInsertTransaction({
            transaction_ref: `TX-2026-0928-${Math.floor(1000 + Math.random() * 9000)}`,
            customer_id: 'CUST-0421',
            customer_name: 'Alexandre Martin',
            amount: amount,
            currency: 'EUR',
            merchant: merchant,
            location: location,
            country: location.includes('Singapour') ? 'SG' : location.includes('Tallinn') ? 'EE' : 'FR',
            device_name: device,
            device_trusted: score < 40,
            ip_address: score > 70 ? '103.252.114.22' : '194.2.14.88',
            risk_score: score,
            autonomy_level: score >= 80 ? 3 : score >= 40 ? 2 : 1,
            status: score >= 80 ? 'SUSPENDED_PREVENTIVE' : 'APPROVED_LEGITIMATE',
            suspicion_reasons: score >= 80 ? [
              `Montant de ${amount} € inhabituel`,
              `Localisation anormale (${location})`,
              `Appareil non répertorié (${device})`
            ] : [],
            escalation_target: score >= 80 ? 'Conseiller Anti-Fraude Niv. 3 & Push Client' : 'Exécution automatique',
            customer_push_status: score >= 80 ? 'SENT' : 'WAITING'
          });

          setSelectedTxId(newTx.id);
          setActiveStep(4);
          setIsSimulating(false);
          showToast(`Nouvelle transaction injectée et persistée dans MySQL (Score ${score}/100) !`);
        }, 300);
      }, 400);
    }, 400);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-xl bg-slate-900 border border-emerald-500/50 text-white shadow-2xl flex items-center gap-3 animate-slide-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30 mb-2">
              Document §5.1 — Expérimentation Opérationnelle
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Cas Pratique 1 : Finance & Assurance – Détection de Fraude par Carte Bancaire
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-4xl">
              <strong>Objectif officiel :</strong> Bloquer les transactions frauduleuses avant leur exécution en moins de 5 secondes. 
              Suspension immédiate par Niveau 1-2 (&lt; 1s) et escalade Niveau 3 vers conseiller et client push.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Exporter Audit Fraude (CSV)</span>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition cursor-pointer"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Voir table `fraud_transactions`</span>
            </button>
          </div>
        </div>
      </div>

      {/* Target KPIs Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase font-semibold text-slate-400">Fraudes Évitées</div>
            <div className="text-2xl font-bold text-white">94.2 %</div>
            <div className="text-[11px] text-emerald-400 font-medium">Objectif Document : &gt; 90 %</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase font-semibold text-slate-400">Temps de Réaction</div>
            <div className="text-2xl font-bold text-white">{currentTx?.response_time_ms || 412} ms</div>
            <div className="text-[11px] text-blue-400 font-medium">Objectif Document : &lt; 5 s</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase font-semibold text-slate-400">Taux d'Escalade Humaine</div>
            <div className="text-2xl font-bold text-white">8.7 %</div>
            <div className="text-[11px] text-amber-400 font-medium">Objectif Document : &lt; 12 %</div>
          </div>
        </div>
      </div>

      {/* 4 Steps Timeline Visualizer (Strict from Section 5.1) */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
        <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4">
          Déroulement du Processus d'Autonomie Graduée (4 Étapes)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeStep >= 1 
              ? 'bg-blue-950/40 border-blue-500/50 shadow-sm shadow-blue-500/10' 
              : 'bg-slate-950/40 border-slate-800/80 opacity-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-400">1. Détection Signal</span>
              <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold flex items-center justify-center">
                1
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Tentative de paiement</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Paiement de 640 € à l'étranger depuis un appareil inconnu non répertorié.
            </p>
          </div>

          {/* Step 2 */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeStep >= 2 
              ? 'bg-purple-950/40 border-purple-500/50 shadow-sm shadow-purple-500/10' 
              : 'bg-slate-950/40 border-slate-800/80 opacity-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-400">2. Croisement & Score</span>
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold flex items-center justify-center">
                2
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Score de Risque 91/100</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Croisement profil usager, géoloc impossible et règles anti-fraude OMNIA.
            </p>
          </div>

          {/* Step 3 */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeStep >= 3 
              ? 'bg-amber-950/40 border-amber-500/50 shadow-sm shadow-amber-500/10' 
              : 'bg-slate-950/40 border-slate-800/80 opacity-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400">3. Action Graduée</span>
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center">
                3
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Suspension Immédiate</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Niveau 1-2 : Blocage préventif en moins de 1 seconde (412 ms).
            </p>
          </div>

          {/* Step 4 */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeStep >= 4 
              ? 'bg-rose-950/40 border-rose-500/50 shadow-sm shadow-rose-500/10' 
              : 'bg-slate-950/40 border-slate-800/80 opacity-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-400">4. Escalade Humaine</span>
              <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold flex items-center justify-center">
                4
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Conseiller & Push Client</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Niveau 3 : Alerte transmise au superviseur & push interactif sur mobile.
            </p>
          </div>
        </div>
      </div>

      {/* Preset scenario triggers */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mr-2">
          Scénarios à injecter :
        </span>
        <button
          onClick={() => handleRunSimulation(640, 'Marina Bay Luxury Tech Pte - Singapour', 'Singapour (SG)', 'Apple iPhone 16 Pro (Non répertorié)', 91)}
          disabled={isSimulating}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition cursor-pointer"
        >
          🚨 Cas Officiel : 640 € Singapour (Risque 91/100)
        </button>
        <button
          onClick={() => handleRunSimulation(1250, 'CryptoPay Gate Tallinn', 'Tallinn (EE)', 'Chrome Linux (Tor Node)', 96)}
          disabled={isSimulating}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950 text-red-300 border border-red-800 hover:bg-red-900 transition cursor-pointer"
        >
          ⚠️ Crypto Tallinn 1250 € (Risque 96/100)
        </button>
        <button
          onClick={() => handleRunSimulation(14.50, 'Boulangerie Saint-Germain', 'Paris (FR)', 'Apple Watch Ultra (Appairée)', 4)}
          disabled={isSimulating}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 transition cursor-pointer"
        >
          ✅ Achat Quotidien : 14.50 € Paris (Risque 4/100)
        </button>
        <button
          onClick={() => handleRunSimulation(185, 'SNCF Connect TGV', 'Lyon (FR)', 'MacBook Pro M3 (Enregistré)', 12)}
          disabled={isSimulating}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-950 text-blue-300 border border-blue-800 hover:bg-blue-900 transition cursor-pointer"
        >
          🚄 Billet Train : 185 € Lyon (Risque 12/100)
        </button>
      </div>

      {/* Main Dual View: Analyst Workstation (Left) & Client Smartphone Simulator (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Fraud Analyst Workstation (8 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Console Conseiller Anti-Fraude (Niveau 3)</h3>
                  <p className="text-xs text-slate-400">Poste de supervision opérationnelle & décision souveraine</p>
                </div>
              </div>

              {/* Status Badge & Export */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  title="Exporter le registre d'audit en CSV"
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Audit CSV</span>
                </button>

                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  currentTx?.status === 'SUSPENDED_PREVENTIVE'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : currentTx?.status === 'CONFIRMED_FRAUD'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {currentTx?.status === 'SUSPENDED_PREVENTIVE' && 'SUSPENDUE PRÉVENTIVEMENT'}
                  {currentTx?.status === 'CONFIRMED_FRAUD' && 'FRAUDE CONFIRMÉE & BLOQUÉE'}
                  {currentTx?.status === 'APPROVED_LEGITIMATE' && 'AUTORISÉE & LÉGITIME'}
                </span>
              </div>
            </div>

            {/* Current Transaction Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">Référence & Client</div>
                <div className="text-sm font-bold text-white mt-1">{currentTx?.transaction_ref}</div>
                <div className="text-xs text-blue-400 mt-0.5">{currentTx?.customer_name} ({currentTx?.customer_id})</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">Montant & Devise</div>
                <div className="text-xl font-extrabold text-white mt-0.5">
                  {currentTx?.amount.toFixed(2)} {currentTx?.currency}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Commerçant : {currentTx?.merchant}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>Localisation & Réseau</span>
                </div>
                <div className="text-sm font-semibold text-rose-300 mt-1">{currentTx?.location}</div>
                <div className="text-xs text-slate-500 mt-0.5">IP: {currentTx?.ip_address}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Empreinte Matérielle</span>
                </div>
                <div className="text-sm font-semibold text-slate-200 mt-1">{currentTx?.device_name}</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {currentTx?.device_trusted ? '✅ Appareil de confiance' : '⚠️ Jamais répertorié'}
                </div>
              </div>
            </div>

            {/* Risk Gauge & Suspicion Reasons */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Score de Risque OMNIA / MERIDIAN
                </span>
                <span className="text-lg font-black text-rose-400">
                  {currentTx?.risk_score} / 100
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${currentTx?.risk_score}%` }}
                  className={`h-full transition-all duration-500 ${
                    currentTx?.risk_score! >= 80 
                      ? 'bg-rose-500' 
                      : currentTx?.risk_score! >= 40 
                      ? 'bg-amber-500' 
                      : 'bg-emerald-500'
                  }`}
                />
              </div>

              {/* Suspicion reasons list */}
              {currentTx?.suspicion_reasons && currentTx.suspicion_reasons.length > 0 ? (
                <div className="mt-3 space-y-1.5">
                  <span className="text-xs font-semibold text-rose-300">Signaux d'anomalie détectés :</span>
                  {currentTx.suspicion_reasons.map((reason, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Aucune anomalie détectée. Profil transactionnel nominal.</span>
                </div>
              )}
            </div>

            {/* Decision Notes & Action buttons */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-400 block">
                Note d'arbitrage du Conseiller (Traçabilité Audit Log SHA-256) :
              </label>
              <input
                type="text"
                value={operatorNote}
                onChange={(e) => setOperatorNote(e.target.value)}
                placeholder="Ex: Confirmation frauduleuse suite au refus client ou vérification téléphonique..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handleAnalystDecision('CONFIRMED_FRAUD')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Confirmer la Fraude & Bloquer Carte</span>
                </button>

                <button
                  onClick={() => handleAnalystDecision('APPROVED_LEGITIMATE')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Lever la Suspension (Légitime)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Client Smartphone Simulator (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm rounded-[36px] bg-slate-950 border-4 border-slate-800 p-4 shadow-2xl relative">
            {/* Top speaker & camera notch */}
            <div className="flex justify-center mb-3">
              <div className="w-24 h-4 bg-slate-800 rounded-full flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                <div className="w-8 h-1 rounded-full bg-slate-700"></div>
              </div>
            </div>

            {/* Smartphone screen */}
            <div className="bg-slate-900 rounded-[26px] p-4 border border-slate-800 min-h-[480px] flex flex-col justify-between">
              {/* Phone Header */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800">
                  <span>11:42</span>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-white">Banque Connect</span>
                    <span className="text-[10px] text-emerald-400">5G</span>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <div className="inline-flex p-3 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 mb-2">
                    <ShieldAlert className="w-7 h-7 animate-pulse" />
                  </div>
                  <h4 className="text-base font-bold text-white">Alerte Sécurité Urgente</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Système NEXOMIA &bull; Détection temps réel
                  </p>
                </div>

                {/* Push Notification Card */}
                <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-rose-500/40 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                      Suspension Préventive
                    </span>
                    <span className="text-[10px] text-slate-500">Il y a 1 min</span>
                  </div>

                  <div className="mt-2 text-xs font-semibold text-white">
                    Paiement suspect de {currentTx?.amount.toFixed(2)} {currentTx?.currency}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-1">
                    Commerçant : <strong>{currentTx?.merchant}</strong>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Lieu : {currentTx?.location} &bull; Appareil non reconnu
                  </div>

                  <div className="mt-3 p-2 rounded bg-rose-950/40 border border-rose-800/40 text-[11px] text-rose-200">
                    🔒 La transaction a été suspendue avant tout débit pour protéger votre compte.
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs font-medium text-slate-300">
                    Êtes-vous à l'origine de cette tentative de paiement ?
                  </p>
                </div>
              </div>

              {/* Client Action Buttons */}
              <div className="space-y-2 mt-4">
                <button
                  onClick={() => handleClientResponse('DENIED_USER')}
                  className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Non ! Bloquer ma carte immédiatement</span>
                </button>

                <button
                  onClick={() => handleClientResponse('CONFIRMED_USER')}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Oui, je confirme cet achat</span>
                </button>
              </div>

              {/* Mobile Footer Status */}
              <div className="text-center text-[10px] text-slate-500 pt-2 border-t border-slate-800/60">
                Statut Push : <strong className="text-slate-300">{currentTx?.customer_push_status}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
