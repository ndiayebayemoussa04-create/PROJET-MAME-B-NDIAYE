import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Landmark, 
  HeartPulse, 
  Plane, 
  Factory, 
  Sprout, 
  GraduationCap, 
  Zap, 
  Truck, 
  Radio, 
  ShieldAlert, 
  TreePine, 
  FileText,
  UserCheck,
  Bot,
  AlertCircle,
  Activity,
  ArrowRight,
  Filter,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { mysqlEngine } from '../services/mysqlEngine';
import { SectorDefinition } from '../types/nexomia';

interface SectorsViewProps {
  setActiveTab: (tab: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  ShoppingBag,
  Landmark,
  HeartPulse,
  Plane,
  Factory,
  Sprout,
  GraduationCap,
  Zap,
  Truck,
  Radio,
  ShieldAlert,
  TreePine,
  FileText
};

export const SectorsView: React.FC<SectorsViewProps> = ({ setActiveTab }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [selectedSector, setSelectedSector] = useState<SectorDefinition | null>(null);
  
  const sectors = mysqlEngine.getState().sectors;

  const categories = [
    'Tous',
    'Économie & Finance',
    'Santé & Vivant',
    'Industrie & Énergie',
    'Services & Mobilité',
    'Souveraineté & Public'
  ];

  const filteredSectors = selectedCategory === 'Tous' 
    ? sectors 
    : sectors.filter(s => s.category === selectedCategory);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/30 mb-2">
            Document §3 — Architecture Spécialisée
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Couverture Multisectorielle (13 Secteurs)
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Chaque agent sectoriel dispose de règles propres et de garde-fous hermétiques sans altérer le noyau commun. 
            Découvrez la séparation stricte entre l'analyse automatisée de l'IA et la décision souveraine de l'humain.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="font-bold text-emerald-400">13</span> Agents Spécialisés Actifs
          </div>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-slate-500 shrink-0" />
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 13 Sectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSectors.map(sector => {
          const Icon = iconMap[sector.icon] || FileText;
          const isCommerce = sector.id === 'commerce';
          const isFinance = sector.id === 'finance';

          return (
            <div
              key={sector.id}
              onClick={() => setSelectedSector(sector)}
              className="group cursor-pointer rounded-xl border border-slate-800/90 bg-slate-900/50 hover:bg-slate-900/80 hover:border-slate-700 p-5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-blue-300 transition">
                        {sector.name}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {sector.category}
                      </span>
                    </div>
                  </div>

                  {(isCommerce || isFinance) && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Cas Démo
                    </span>
                  )}
                </div>

                {/* Agent Name */}
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-indigo-300 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/20">
                  <Bot className="w-3.5 h-3.5" />
                  <span>Agent : {sector.agentName}</span>
                </div>

                {/* Repère vs Valide Comparison */}
                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
                      <Bot className="w-3.5 h-3.5" />
                      <span>Ce que l'agent repère / analyse :</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {sector.agentRepere}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Ce que l'humain valide / décide :</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {sector.humainValide}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer: Metrics & Links */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="font-semibold text-white">{sector.metrics.accuracyRate}%</span> précision
                </div>

                {isFinance && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('demo-fraud');
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
                  >
                    <span>Tester le Cas 1</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}

                {isCommerce && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('demo-commerce');
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
                  >
                    <span>Tester le Cas 2</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}

                {!isFinance && !isCommerce && (
                  <span className="text-xs text-slate-500 flex items-center gap-1 group-hover:text-slate-300 transition">
                    Voir détails <ArrowRight className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sector Detail Modal */}
      {selectedSector && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {React.createElement(iconMap[selectedSector.icon] || FileText, { className: 'w-6 h-6' })}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedSector.name}</h2>
                  <p className="text-xs text-slate-400">{selectedSector.category} &bull; Agent: {selectedSector.agentName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSector(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                &times;
              </button>
            </div>

            {/* Split Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-2">
                  <Bot className="w-4 h-4" />
                  <span>Repérage & Analyse IA</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedSector.agentRepere}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                  <UserCheck className="w-4 h-4" />
                  <span>Validation & Décision Humaine</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedSector.humainValide}
                </p>
              </div>
            </div>

            {/* Autonomy Level breakdown */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Répartition de l'Autonomie Graduée
              </span>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div 
                  style={{ width: `${selectedSector.autonomyDistribution.level1}%` }} 
                  className="bg-emerald-500 h-full" 
                  title={`Niveau 1: ${selectedSector.autonomyDistribution.level1}%`}
                />
                <div 
                  style={{ width: `${selectedSector.autonomyDistribution.level2}%` }} 
                  className="bg-amber-500 h-full" 
                  title={`Niveau 2: ${selectedSector.autonomyDistribution.level2}%`}
                />
                <div 
                  style={{ width: `${selectedSector.autonomyDistribution.level3}%` }} 
                  className="bg-rose-500 h-full" 
                  title={`Niveau 3: ${selectedSector.autonomyDistribution.level3}%`}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Niv. 1 (Auto): {selectedSector.autonomyDistribution.level1}%
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Niv. 2 (Recommandé): {selectedSector.autonomyDistribution.level2}%
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Niv. 3 (Humain): {selectedSector.autonomyDistribution.level3}%
                </span>
              </div>
            </div>

            {/* Sample Live Alert */}
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-amber-300">Dernière Alerte Opérationnelle :</div>
                  <div className="text-sm font-medium text-slate-200">{selectedSector.sampleAlert.title}</div>
                </div>
              </div>
              <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-bold whitespace-nowrap">
                Risque {selectedSector.sampleAlert.riskScore}/100
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedSector(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition cursor-pointer"
              >
                Fermer
              </button>
              {selectedSector.id === 'finance' && (
                <button
                  onClick={() => {
                    setSelectedSector(null);
                    setActiveTab('demo-fraud');
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition cursor-pointer"
                >
                  Ouvrir Cas Démo Finance
                </button>
              )}
              {selectedSector.id === 'commerce' && (
                <button
                  onClick={() => {
                    setSelectedSector(null);
                    setActiveTab('demo-commerce');
                  }}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition cursor-pointer"
                >
                  Ouvrir Cas Démo Commerce
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
