import React, { useState } from 'react';
import { 
  ShoppingBag, 
  MessageSquare, 
  Smartphone, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  FileText, 
  QrCode, 
  Layers, 
  TrendingUp, 
  Box, 
  Truck, 
  UserCheck, 
  Database,
  RotateCcw,
  Bot,
  ExternalLink,
  Barcode,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { mysqlEngine } from '../services/mysqlEngine';
import { INITIAL_CUSTOMER_PROFILE } from '../data/databaseSeed';
import { downloadCSV, exportStockInventoryCSV } from '../utils/csvExport';

interface CommerceDemoViewProps {
  setActiveTab: (tab: string) => void;
}

export const CommerceDemoView: React.FC<CommerceDemoViewProps> = ({ setActiveTab }) => {
  const state = mysqlEngine.getState();
  const products = state.products;
  const reassortOrders = state.reassortOrders;

  // Active sub-channel in customer view ('WEB' | 'WHATSAPP')
  const [activeChannel, setActiveChannel] = useState<'WEB' | 'WHATSAPP'>('WHATSAPP');
  const [activeStep, setActiveStep] = useState<number>(4);
  const [whatsappInput, setWhatsappInput] = useState<string>('');
  const [isProcessingReturn, setIsProcessingReturn] = useState<boolean>(false);
  const [generatedLabel, setGeneratedLabel] = useState<{ labelId: string; trackingCode: string } | null>({
    labelId: 'RET-849201',
    trackingCode: 'FR-COLIS-98214055'
  });
  const [showLabelModal, setShowLabelModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Chat conversation history in WhatsApp
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string; hasLabel?: boolean }>>([
    {
      sender: 'user',
      text: 'Bonjour, je vous contacte suite à ma commande sur le site web. Je souhaiterais faire un retour pour ma veste All-Weather, la taille M est trop ajustée.',
      time: '11:42'
    },
    {
      sender: 'agent',
      text: 'Bonjour Alexandre ! Ravi de vous retrouver sur WhatsApp. J\'ai bien identifié votre commande CMD-2026-9941 passée il y a 4 jours (Veste All-Weather Gore-Pro, Taille M, 249,00 €). Vous êtes parfaitement dans le délai de 30 jours.',
      time: '11:42'
    },
    {
      sender: 'agent',
      text: 'Je viens de générer votre étiquette de retour prépayée Colissimo de façon 100% autonome. Vous pouvez la télécharger ci-dessous.',
      time: '11:43',
      hasLabel: true
    },
    {
      sender: 'agent',
      text: 'Souhaitez-vous que je vous réserve immédiatement la Taille L en échange ? Il ne reste actuellement que 8 pièces en stock.',
      time: '11:43'
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleExportStocksCSV = () => {
    const { filename, content } = exportStockInventoryCSV(products, reassortOrders);
    downloadCSV(filename, content);
    showToast(`État des stocks et ordres de réassort exportés en CSV (${products.length} références SKU) !`);
  };

  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsappInput.trim()) return;

    const userText = whatsappInput;
    setWhatsappInput('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userText, time: '11:45' }]);

    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        sender: 'agent',
        text: 'Votre demande a bien été prise en compte avec la mémoire contextuelle unifiée NEXOMIA.',
        time: '11:45'
      }]);
    }, 600);
  };

  const handleGenerateReturnAutonomously = () => {
    setIsProcessingReturn(true);
    setTimeout(() => {
      const res = mysqlEngine.processReturnRequest('NEX-JKT-882-M', 'Taille M trop serrée / échange taille L');
      setGeneratedLabel(res);
      setIsProcessingReturn(false);
      setShowLabelModal(true);
      showToast('Étiquette de retour autonome Niveau 1 émise et synchronisée dans MySQL !');
    }, 500);
  };

  // Human validation of Reassort proposal
  const handleApproveReassort = (orderId: string) => {
    mysqlEngine.approveReassortOrder(orderId, 'Sophie Delaunay');
    showToast('Bon de commande fournisseur PO-2026-889 validé ! Stock MySQL mis à jour (+150 unités).');
  };

  const currentOrder = reassortOrders[0];
  const jktM = products.find(p => p.sku === 'NEX-JKT-882-M');
  const jktL = products.find(p => p.sku === 'NEX-JKT-882-L');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-xl bg-slate-900 border border-indigo-500/50 text-white shadow-2xl flex items-center gap-3 animate-slide-in">
          <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 mb-2">
              Document §5.2 — Expérimentation Opérationnelle
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Cas Pratique 2 : Commerce & Vente – Relation Client Omnicanale et Gestion des Stocks
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-4xl">
              <strong>Objectif officiel :</strong> Assurer la continuité de l'expérience usager sans répétition 
              et optimiser la chaîne d'approvisionnement grâce à la détection de sur-retours et au réassort prédictif assisté.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportStocksCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md shadow-amber-600/20 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Exporter État des Stocks (CSV)</span>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition cursor-pointer"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Voir tables `products_inventory` & `reassort_orders`</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Steps Timeline (Strict from Section 5.2) */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
        <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4">
          Déroulement du Processus Transverse (4 Étapes)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeStep >= 1 ? 'bg-indigo-950/40 border-indigo-500/50' : 'bg-slate-950/40 border-slate-800 opacity-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-400">1. Interaction Omnicanale</span>
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center">
                1
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Web &rarr; WhatsApp</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Le client débute la consultation sur le web et poursuit sur WhatsApp sans rupture.
            </p>
          </div>

          {/* Step 2 */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeStep >= 2 ? 'bg-blue-950/40 border-blue-500/50' : 'bg-slate-950/40 border-slate-800 opacity-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-400">2. Mémoire & Auto (Niv. 1)</span>
              <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold flex items-center justify-center">
                2
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Étiquette 100% Autonome</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Identification automatique de l'historique d'achat et émission instantanée de l'étiquette retour.
            </p>
          </div>

          {/* Step 3 */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeStep >= 3 ? 'bg-amber-950/40 border-amber-500/50' : 'bg-slate-950/40 border-slate-800 opacity-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400">3. Impact Logistique (Niv. 2)</span>
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center">
                3
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Alerte Sur-Retours (+28%)</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Risque de rupture calculé sur la taille L équivalente. Recommandation automatique de réassort.
            </p>
          </div>

          {/* Step 4 */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeStep >= 4 ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-slate-950/40 border-slate-800 opacity-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400">4. Validation Humaine</span>
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-center">
                4
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Ordre Réassort 1-Clic</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Le responsable des ventes valide la commande de réassort de 150 unités proposée par l'agent.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Omnichannel Customer Experience | Right = Supply & Logistics Command Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Customer Side (Web vs WhatsApp Switcher) - 5 cols */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Canal Usager Actif (NEXORA Mémoire Unifiée)
              </span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setActiveChannel('WEB')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                    activeChannel === 'WEB' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Site Web E-commerce
                </button>
                <button
                  onClick={() => setActiveChannel('WHATSAPP')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                    activeChannel === 'WHATSAPP' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  WhatsApp Mobile
                </button>
              </div>
            </div>

            {/* If WEB Channel Active */}
            {activeChannel === 'WEB' && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-blue-400" />
                    <span className="font-bold text-white text-sm">NexShop Official Store</span>
                  </div>
                  <span className="text-xs text-slate-400">Compte : Alexandre Martin</span>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Commande CMD-2026-9941</div>
                    <div className="text-sm font-bold text-white mt-0.5">Veste All-Weather Gore-Pro (Taille M)</div>
                    <div className="text-xs text-emerald-400 mt-1">Livré le 24/09 &bull; Retour éligible (J+4)</div>
                  </div>
                  <span className="text-base font-extrabold text-white">249,00 €</span>
                </div>

                <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/30 text-xs text-slate-300">
                  💡 <em>Alexandre Martin quitte maintenant son ordinateur et ouvre WhatsApp pour demander son retour...</em>
                </div>

                <button
                  onClick={() => setActiveChannel('WHATSAPP')}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Basculer sur WhatsApp pour demander le retour</span>
                </button>
              </div>
            )}

            {/* If WHATSAPP Channel Active (Smartphone Shell) */}
            {activeChannel === 'WHATSAPP' && (
              <div className="rounded-[28px] bg-slate-950 border-2 border-slate-800 p-3 shadow-xl space-y-3 animate-fade-in">
                {/* WhatsApp header */}
                <div className="bg-emerald-950/60 p-3 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>NexShop Concierge [IA]</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      </div>
                      <div className="text-[10px] text-emerald-300">NEXORA Mémoire Contextuelle Active</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-500/30">
                    WhatsApp Pro
                  </span>
                </div>

                {/* Messages stream */}
                <div className="space-y-3 max-h-[360px] overflow-y-auto p-2">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`p-3 rounded-2xl max-w-[88%] text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-emerald-600 text-white rounded-tr-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                      }`}>
                        {msg.text}

                        {/* Interactive return label button embedded inside WhatsApp */}
                        {msg.hasLabel && (
                          <div className="mt-3 pt-2 border-t border-slate-800/80">
                            <button
                              onClick={() => setShowLabelModal(true)}
                              className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                            >
                              <QrCode className="w-4 h-4" />
                              <span>Afficher l'Étiquette Retour Colissimo (PDF)</span>
                            </button>
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-500 mt-0.5 px-1">{msg.time}</span>
                    </div>
                  ))}
                </div>

                {/* WhatsApp input bar */}
                <form onSubmit={handleSendCustomMessage} className="flex items-center gap-2 pt-1 border-t border-slate-800">
                  <input
                    type="text"
                    value={whatsappInput}
                    onChange={(e) => setWhatsappInput(e.target.value)}
                    placeholder="Écrire un message à l'agent NEXOMIA..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <div className="text-center">
                  <button
                    onClick={handleGenerateReturnAutonomously}
                    disabled={isProcessingReturn}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium underline cursor-pointer"
                  >
                    {isProcessingReturn ? 'Génération en cours...' : '🔄 Re-générer l\'étiquette de retour (Niveau 1)'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Supply, Logistics & Reassort Command Center - 7 cols */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    Cockpit Logistique & Stocks OMNIA (Niveau 2)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Détection d'anomalies de retours & recommandation de réassort prédictif
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportStocksCSV}
                  title="Exporter l'état des stocks et prévisions en CSV"
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Stocks CSV</span>
                </button>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Alerte Rupture Imminente
                </span>
              </div>
            </div>

            {/* Impact Analysis Cards (M vs L) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Veste M (High returns) */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-rose-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400">{jktM?.sku}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-rose-500/20 text-rose-300">
                    Sur-Retours +28.4%
                  </span>
                </div>
                <div className="text-sm font-bold text-white">{jktM?.name}</div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">Stock actuel : <strong className="text-white">{jktM?.current_stock}</strong> unités</span>
                  <span className="text-rose-400 font-bold">Taux: {jktM?.return_rate_percentage}% (Normal: 6.2%)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Analyse RAG : Motif dominant « taille trop serrée », report massif vers la Taille L.
                </p>
              </div>

              {/* Veste L (Critical stock) */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400">{jktL?.sku}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300">
                    Stock Critique (&lt; 10)
                  </span>
                </div>
                <div className="text-sm font-bold text-white">{jktL?.name}</div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">Stock actuel : <strong className="text-amber-400 font-bold">{jktL?.current_stock}</strong> unités</span>
                  <span className="text-slate-400">Seuil alerte : {jktL?.min_threshold}</span>
                </div>
                {/* Stock progress bar */}
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${Math.min(100, (jktL?.current_stock! / jktL?.max_capacity!) * 100)}%` }}
                    className="bg-amber-500 h-full"
                  />
                </div>
                <p className="text-[11px] text-amber-300 leading-snug">
                  Risque calculé : Rupture complète sous 48 heures sans réassort immédiat.
                </p>
              </div>
            </div>

            {/* Reassort Order Proposal (Niveau 2 -> Human Validation) */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-950 border border-indigo-500/40 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-1">
                    Proposition IA Niveau 2 &bull; {currentOrder?.order_number}
                  </div>
                  <h4 className="text-base font-bold text-white">
                    Bon de Réassort Fournisseur Automatisé
                  </h4>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                  currentOrder?.status === 'APPROVED' 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {currentOrder?.status === 'APPROVED' ? 'COMMANDÉ (FOURNISSEUR NOTIFIÉ)' : 'EN ATTENTE D\'ACCORD HUMAIN'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Article cible</span>
                  <span className="font-bold text-white mt-0.5 block truncate">Taille L ({currentOrder?.sku})</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Quantité requise</span>
                  <span className="font-bold text-white mt-0.5 block">+{currentOrder?.requested_quantity} unités</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Montant HT</span>
                  <span className="font-bold text-white mt-0.5 block">{currentOrder?.total_cost.toFixed(2)} €</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Fournisseur</span>
                  <span className="font-bold text-white mt-0.5 block truncate">{currentOrder?.supplier}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                <span className="font-semibold text-indigo-300">Justification décisionnelle de l'agent : </span>
                {currentOrder?.reason} {currentOrder?.risk_forecast}
              </div>

              {/* Human Approval Button */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-400">
                  {currentOrder?.status === 'APPROVED' ? (
                    <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      Validé par : {currentOrder.validated_by}
                    </span>
                  ) : (
                    <span>Contrôle humain souverain : Le responsable des ventes doit valider la commande.</span>
                  )}
                </div>

                {currentOrder?.status !== 'APPROVED' ? (
                  <button
                    onClick={() => handleApproveReassort(currentOrder?.id!)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Valider le Bon de Commande (+150 ex.)</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-medium cursor-not-allowed flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Commande transmise au Fournisseur</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Return Label PDF Modal */}
      {showLabelModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-base">Étiquette Colissimo Générée Autonome</h3>
              </div>
              <button
                onClick={() => setShowLabelModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Printable ticket style */}
            <div className="bg-white text-slate-900 p-5 rounded-xl space-y-3 font-mono text-xs border-2 border-dashed border-slate-400">
              <div className="flex items-center justify-between pb-2 border-b border-slate-300">
                <span className="font-extrabold text-sm tracking-wider">LA POSTE / COLISSIMO</span>
                <span className="font-bold text-[10px] bg-slate-200 px-2 py-0.5 rounded">RETOUR GRATUIT</span>
              </div>

              <div>
                <div className="text-[10px] text-slate-500 uppercase font-sans">Expéditeur :</div>
                <div className="font-bold font-sans">Alexandre Martin</div>
                <div className="text-[11px] font-sans">14 Rue de la Paix, 75002 Paris</div>
              </div>

              <div className="pt-1">
                <div className="text-[10px] text-slate-500 uppercase font-sans">Destinataire :</div>
                <div className="font-bold font-sans">NexShop Entrepôt Logistique & Retours</div>
                <div className="text-[11px] font-sans">Plateforme Nord - Quai 18, 59000 Lille</div>
              </div>

              <div className="py-2 text-center border-y border-slate-300">
                <div className="text-[10px] text-slate-500 font-sans">NUMÉRO D'ENVOI SUIVI :</div>
                <div className="font-bold text-sm tracking-widest">{generatedLabel?.trackingCode || 'FR-COLIS-98214055'}</div>
                <div className="flex justify-center mt-2">
                  <Barcode className="w-48 h-10 text-slate-900" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 font-sans">
                <span>Réf. Article : NEX-JKT-882-M</span>
                <span>CMD-2026-9941</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowLabelModal(false)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer"
              >
                Fermer l'Aperçu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
