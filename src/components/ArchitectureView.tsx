import React, { useState } from 'react';
import { 
  Layers, 
  ShieldCheck, 
  Cpu, 
  SlidersHorizontal, 
  ScanEye, 
  MessageSquareShare, 
  BrainCircuit, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { ARCHITECTURE_LAYERS, AUTONOMY_LEVELS } from '../data/databaseSeed';
import { mysqlEngine } from '../services/mysqlEngine';

export const ArchitectureView: React.FC = () => {
  const [testRiskScore, setTestRiskScore] = useState<number>(75);
  const auditLogs = mysqlEngine.getState().auditLogs;

  const currentLevel = testRiskScore >= 80 ? 3 : testRiskScore >= 40 ? 2 : 1;

  const iconMap: Record<string, React.ElementType> = {
    MessageSquareShare,
    ScanEye,
    BrainCircuit,
    SlidersHorizontal,
    ShieldCheck
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 mb-2">
          Document §2 & §4 — Socle Technologique & Gouvernance
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Architecture Technique & Autonomie Graduée
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-4xl">
          Le système repose sur 5 couches stables et modulaires ainsi qu'un modèle d'autonomie paramétrable calculé à partir d'un score de risque contextuel (0 à 100).
        </p>
      </div>

      {/* 5 Architecture Layers (Section 2) */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-400" />
          <span>2. Architecture Technique du Système (5 Couches Stables)</span>
        </h2>

        <div className="space-y-3.5">
          {ARCHITECTURE_LAYERS.map((layer) => {
            const Icon = iconMap[layer.icon] || Cpu;
            return (
              <div
                key={layer.id}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                        Couche {layer.id}
                      </span>
                      <h3 className="font-bold text-white text-base">{layer.name}</h3>
                    </div>
                    <p className="text-sm text-slate-300 mt-1 leading-relaxed max-w-3xl">
                      {layer.description}
                    </p>

                    {/* Components pills */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      {layer.components.map((comp, idx) => (
                        <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tech Stack badges */}
                <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-1.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Technologies :</span>
                  <div className="flex flex-wrap gap-1">
                    {layer.techStack.map((tech, idx) => (
                      <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-500/30">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Autonomie Graduée (Section 4) */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
            <span>4. Maîtrise des Risques et Autonomie Graduée</span>
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            NEXOMIA intègre un modèle d'autonomie paramétrable calculé à partir d'un score de risque contextuel (0 - 100).
          </p>
        </div>

        {/* 3 Autonomy Levels Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {AUTONOMY_LEVELS.map((lvl) => {
            const isSelected = currentLevel === lvl.level;
            return (
              <div
                key={lvl.level}
                className={`p-5 rounded-2xl border transition-all ${
                  isSelected
                    ? `${lvl.badgeColor} shadow-xl scale-[1.02] bg-slate-900/90`
                    : 'border-slate-800 bg-slate-950/60 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="font-extrabold text-white text-base">{lvl.name}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    Niveau {lvl.level}
                  </span>
                </div>

                <div className="text-xs font-bold text-indigo-300 mt-2">{lvl.tagline}</div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{lvl.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Exemples types :</span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {lvl.examples.map((ex, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                  <strong className="text-white block text-[10px] uppercase mb-0.5">Rôle Humain :</strong>
                  {lvl.humanRole}
                </div>
              </div>
            );
          })}
        </div>

        {/* Risk Score Interactive Tester */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-bold text-white text-sm">Simulateur de Score de Risque Dynamique</h4>
              <p className="text-xs text-slate-400">Déplacez le curseur pour visualiser le niveau d'autonomie appliqué</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Score calculé :</span>
              <span className="text-2xl font-black text-white px-3 py-1 rounded-xl bg-blue-500/20 border border-blue-500/40">
                {testRiskScore} / 100
              </span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={testRiskScore}
            onChange={(e) => setTestRiskScore(parseInt(e.target.value, 10))}
            className="w-full accent-blue-500 cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>0 (Faible risque)</span>
            <span>40 (Seuil Niveau 2)</span>
            <span>80 (Seuil Niveau 3)</span>
            <span>100 (Risque critique)</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300">
              Politique d'exécution activée : <strong className="text-white">
                {currentLevel === 1 && 'Niveau 1 – Tâche routinière exécutée en totale autonomie par l\'IA'}
                {currentLevel === 2 && 'Niveau 2 – L\'IA formule une proposition d\'action validable en 1 clic par l\'opérateur'}
                {currentLevel === 3 && 'Niveau 3 – Synthèse préparée par l\'IA, décision souveraine exclusivement entre les mains de l\'humain'}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Audit Log Stream (Couche 5 Gouvernance) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">
              Journal Inaltérable d'Audit & Traçabilité (Couche 5 &bull; SHA-256)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {auditLogs.length} événements enregistrés
          </span>
        </div>

        <div className="space-y-2">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400">{log.timestamp}</span>
                  <span className="font-bold text-blue-400">[{log.sector}]</span>
                  <span className="font-semibold text-white">{log.action}</span>
                </div>
                <div className="text-slate-300 mt-1">{log.details}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  {log.hash.substring(0, 12)}...
                </span>
                <span className="text-[11px] font-bold text-amber-400">Niv. {log.autonomy_level}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
