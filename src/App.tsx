/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { SectorsView } from './components/SectorsView';
import { FraudDemoView } from './components/FraudDemoView';
import { CommerceDemoView } from './components/CommerceDemoView';
import { ArchitectureView } from './components/ArchitectureView';
import { DatabaseView } from './components/DatabaseView';
import { PricingRoadmapView } from './components/PricingRoadmapView';
import { VoiceConversationView } from './components/VoiceConversationView';
import { mysqlEngine } from './services/mysqlEngine';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Database, ShieldCheck, Sparkles, Layers } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [, setDbVersion] = useState<number>(0);
  const { t } = useLanguage();

  // Re-render when MySQL state changes (fraud eval, stock re-assort, etc.)
  useEffect(() => {
    const unsubscribe = mysqlEngine.subscribe(() => {
      setDbVersion(v => v + 1);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <DashboardView setActiveTab={setActiveTab} />}
        {activeTab === 'voice-chat' && <VoiceConversationView />}
        {activeTab === 'sectors' && <SectorsView setActiveTab={setActiveTab} />}
        {activeTab === 'demo-fraud' && <FraudDemoView setActiveTab={setActiveTab} />}
        {activeTab === 'demo-commerce' && <CommerceDemoView setActiveTab={setActiveTab} />}
        {activeTab === 'architecture' && <ArchitectureView />}
        {activeTab === 'database' && <DatabaseView />}
        {activeTab === 'pricing-roadmap' && <PricingRoadmapView />}
      </main>

      {/* Executive Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 mt-16 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xs">
              N
            </div>
            <div>
              <span className="font-bold text-white">NEXOMIA</span> &bull; Plateforme d'IA Transversale & Multisectorielle
              <div className="text-[11px] text-slate-500">
                Fusion Stratégique NEXORA / NEXUS & OMNIA / MERIDIAN &bull; Septembre 2026
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className="hover:text-white transition cursor-pointer"
            >
              {t.nav.dashboard}
            </button>
            <button 
              onClick={() => setActiveTab('voice-chat')} 
              className="text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
            >
              {t.nav.voiceLive}
            </button>
            <button 
              onClick={() => setActiveTab('sectors')} 
              className="hover:text-white transition cursor-pointer"
            >
              {t.nav.sectors}
            </button>
            <button 
              onClick={() => setActiveTab('demo-fraud')} 
              className="hover:text-white transition cursor-pointer"
            >
              {t.nav.demoFraud}
            </button>
            <button 
              onClick={() => setActiveTab('demo-commerce')} 
              className="hover:text-white transition cursor-pointer"
            >
              {t.nav.demoCommerce}
            </button>
            <button 
              onClick={() => setActiveTab('database')} 
              className="text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
            >
              {t.nav.database}
            </button>
          </div>

          <div className="text-[11px] text-slate-500">
            Chiffrement souverain AES-256 / TLS 1.3 &bull; Conformité RGPD & AI Act &bull; Wolof & Français
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
