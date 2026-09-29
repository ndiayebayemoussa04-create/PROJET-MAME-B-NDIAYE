import React from 'react';
import { 
  Layers, 
  ShieldCheck, 
  Database, 
  ArrowRightLeft, 
  Cpu, 
  Activity, 
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Landmark,
  Grid,
  Radio,
  Mic
} from 'lucide-react';
import { mysqlEngine } from '../services/mysqlEngine';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { language, setLanguage, t } = useLanguage();

  const handleReset = () => {
    if (confirm(language === 'wo' 
      ? 'Delloo dencukaayu MySQL ak porototip bi ci xew-xew bu jëkk ?' 
      : 'Réinitialiser l\'état du prototype et de la base de données MySQL aux données initiales ?')) {
      mysqlEngine.resetState();
      window.location.reload();
    }
  };

  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: Grid, badge: 'Hub' },
    { id: 'voice-chat', label: t.nav.voiceLive, icon: Radio, badge: 'gemini-3.8-live' },
    { id: 'sectors', label: t.nav.sectors, icon: Layers, badge: '13 Agents' },
    { id: 'demo-fraud', label: t.nav.demoFraud, icon: Landmark, badge: 'Niveau 1-3' },
    { id: 'demo-commerce', label: t.nav.demoCommerce, icon: ShoppingBag, badge: 'Reassort' },
    { id: 'architecture', label: t.nav.architecture, icon: Cpu, badge: '5 Couches' },
    { id: 'database', label: t.nav.database, icon: Database, badge: 'InnoDB 8.0' },
    { id: 'pricing-roadmap', label: t.nav.pricingRoadmap, icon: Sparkles, badge: '3 Ans' },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      {/* Top micro bar */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-white tracking-wide">{t.nav.officialFusion}</span>
          <span className="text-slate-400">|</span>
          <span className="text-blue-300 font-medium">NEXORA / NEXUS</span>
          <span className="text-slate-500">(Relation & Orchestration)</span>
          <span className="text-purple-300 font-bold">&times;</span>
          <span className="text-indigo-300 font-medium">OMNIA / MERIDIAN</span>
          <span className="text-slate-500">(Intelligence & RAG)</span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {/* Language Switcher Buttons (FR, WO, EN, ES, AR) */}
          <div className="flex items-center rounded-lg bg-slate-900 border border-slate-700/80 p-0.5 text-[11px] font-semibold overflow-x-auto">
            <button
              onClick={() => setLanguage('fr')}
              className={`px-1.5 py-0.5 rounded transition cursor-pointer flex items-center gap-1 ${
                language === 'fr' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Français"
            >
              <span>🇫🇷</span>
              <span>FR</span>
            </button>
            <button
              onClick={() => setLanguage('wo')}
              className={`px-1.5 py-0.5 rounded transition cursor-pointer flex items-center gap-1 ${
                language === 'wo' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Wolof"
            >
              <span>🇸🇳</span>
              <span>WO</span>
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.5 rounded transition cursor-pointer flex items-center gap-1 ${
                language === 'en' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="English"
            >
              <span>🇬🇧</span>
              <span>EN</span>
            </button>
            <button
              onClick={() => setLanguage('es')}
              className={`px-1.5 py-0.5 rounded transition cursor-pointer flex items-center gap-1 ${
                language === 'es' 
                  ? 'bg-amber-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Español"
            >
              <span>🇪🇸</span>
              <span>ES</span>
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`px-1.5 py-0.5 rounded transition cursor-pointer flex items-center gap-1 ${
                language === 'ar' 
                  ? 'bg-teal-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="العربية (Arabic)"
            >
              <span>🇸🇦</span>
              <span>عر</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.common.activeUnifiedCore}</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.common.mysqlConnected}</span>
          </div>
          <button 
            onClick={handleReset}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Réinitialiser toutes les données"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="text-[11px]">{t.nav.resetDemo}</span>
          </button>
        </div>
      </div>

      {/* Main branding & navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-indigo-400/30 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-lg tracking-wider text-white">N</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  NEXOMIA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Septembre 2026
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Plateforme d'IA Transversale & Multisectorielle
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex items-center gap-1 overflow-x-auto py-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm shadow-blue-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      isActive ? 'bg-blue-500/30 text-blue-200' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
