import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  Clock, 
  DollarSign, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Building2, 
  Cpu
} from 'lucide-react';
import { PRICING_OFFERS, ROADMAP_DATA } from '../data/databaseSeed';

export const PricingRoadmapView: React.FC = () => {
  const [selectedOffer, setSelectedOffer] = useState<string>('business');

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30 mb-2">
          Document §6 & §7 — Modèle Économique & Trajectoire
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Modèle Économique, Offres & Feuille de Route 3 Ans
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-4xl">
          Découvrez la tarification officielle NEXOMIA adaptée aux PME, ETI et Grands Comptes, ainsi que la trajectoire 
          pluriannuelle de montée en charge et de passage à l'échelle.
        </p>
      </div>

      {/* 6. MODÈLE ÉCONOMIQUE ET OFFRES */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>6. Modèle Économique et Offres Commerciales</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Formules graduées en fonction de l'omnicanalité, du RAG et de l'intégration sectorielle.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">Facturation mensuelle sans engagement</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_OFFERS.map((offer) => {
            const isSelected = selectedOffer === offer.id;
            return (
              <div
                key={offer.id}
                onClick={() => setSelectedOffer(offer.id)}
                className={`rounded-2xl border p-6 flex flex-col justify-between transition-all cursor-pointer relative ${
                  offer.popular
                    ? 'bg-gradient-to-b from-indigo-950/40 to-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10 scale-[1.02]'
                    : isSelected
                    ? 'bg-slate-900 border-blue-500 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {offer.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
                    Recommandé ETI & Croissance
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-extrabold text-white">{offer.name}</h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {offer.target}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-4 flex items-baseline gap-1">
                    {offer.price !== null ? (
                      <>
                        <span className="text-4xl font-black text-white">{offer.price} €</span>
                        <span className="text-xs text-slate-400 font-medium">/ {offer.period}</span>
                      </>
                    ) : (
                      <span className="text-3xl font-black text-white">{offer.priceLabel}</span>
                    )}
                  </div>

                  <p className="mt-3 text-xs text-slate-300 leading-relaxed min-h-[36px]">
                    {offer.description}
                  </p>

                  {/* Features list */}
                  <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2.5 text-xs text-slate-300">
                    {offer.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800/60">
                  <button
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      offer.popular
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <span>{offer.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. FEUILLE DE ROUTE DE DÉPLOIEMENT (3 ANS) */}
      <div className="space-y-6 pt-4 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <span>7. Feuille de Route de Déploiement (3 Ans)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Trajectoire opérationnelle validée par le comité exécutif de fusion.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Livré
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span> En cours (Pilote)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span> Planifié
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROADMAP_DATA.map((item, idx) => {
            const isCompleted = item.status === 'COMPLETED';
            const isCurrent = item.status === 'CURRENT';

            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-blue-950/30 border-blue-500/60 shadow-lg shadow-blue-500/10'
                    : isCompleted
                    ? 'bg-slate-900/90 border-emerald-500/40'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-extrabold text-indigo-300">{item.phase}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : isCurrent
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {isCompleted ? 'Complété' : isCurrent ? 'En cours (68%)' : 'Planifié'}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base mt-2">{item.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed min-h-[48px]">
                  {item.description}
                </p>

                {/* Progress bar */}
                <div className="mt-3 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${item.progress}%` }}
                    className={`h-full ${isCompleted ? 'bg-emerald-500' : isCurrent ? 'bg-blue-500' : 'bg-slate-600'}`}
                  />
                </div>

                {/* Milestones check list */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                  {item.milestones.map((m, mIdx) => (
                    <div key={mIdx} className="flex items-start gap-2 text-xs">
                      <span className={`mt-0.5 shrink-0 ${m.done ? 'text-emerald-400' : 'text-slate-600'}`}>
                        {m.done ? '✓' : '○'}
                      </span>
                      <span className={m.done ? 'text-slate-200' : 'text-slate-400'}>{m.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
