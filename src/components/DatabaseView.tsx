import React, { useState } from 'react';
import { 
  Database, 
  Table, 
  Terminal, 
  Download, 
  Copy, 
  Check, 
  Play, 
  FileCode, 
  Server, 
  ShieldCheck, 
  Search,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { mysqlEngine, SQLQueryResult } from '../services/mysqlEngine';
import { MYSQL_DDL_SCRIPT } from '../data/databaseSeed';
import { 
  downloadCSV, 
  exportGenericTableCSV, 
  exportFraudAuditCSV, 
  exportStockInventoryCSV 
} from '../utils/csvExport';

export const DatabaseView: React.FC = () => {
  const tableSchemas = mysqlEngine.getTableSchemas();
  const [selectedTable, setSelectedTable] = useState<string>(tableSchemas[1]?.tableName || 'fraud_transactions');
  const [activeTab, setActiveTab] = useState<'DATA' | 'SCHEMA' | 'QUERY' | 'CONFIG'>('DATA');
  const [sqlInput, setSqlInput] = useState<string>('SELECT * FROM fraud_transactions WHERE risk_score > 50;');
  const [queryResult, setQueryResult] = useState<SQLQueryResult | null>(null);
  const [copiedDump, setCopiedDump] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const currentSchema = tableSchemas.find(t => t.tableName === selectedTable);
  const rawRows = mysqlEngine.getTableRows(selectedTable);

  const filteredRows = searchTerm 
    ? rawRows.filter(r => JSON.stringify(r).toLowerCase().includes(searchTerm.toLowerCase()))
    : rawRows;

  const handleExecuteQuery = (queryToRun?: string) => {
    const q = queryToRun || sqlInput;
    const res = mysqlEngine.executeSQL(q);
    setQueryResult(res);
  };

  const handleCopyDump = () => {
    const dump = mysqlEngine.exportMySQLDump();
    navigator.clipboard.writeText(dump);
    setCopiedDump(true);
    setTimeout(() => setCopiedDump(false), 3000);
  };

  const handleDownloadSQL = () => {
    const dump = mysqlEngine.exportMySQLDump();
    const blob = new Blob([dump], { type: 'application/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexomia_mysql_dump_${new Date().toISOString().substring(0, 10)}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCurrentTableCSV = () => {
    const state = mysqlEngine.getState();
    if (selectedTable === 'fraud_transactions') {
      const { filename, content } = exportFraudAuditCSV(state.fraudTransactions, state.auditLogs);
      downloadCSV(filename, content);
    } else if (selectedTable === 'products_inventory') {
      const { filename, content } = exportStockInventoryCSV(state.products, state.reassortOrders);
      downloadCSV(filename, content);
    } else {
      const rows = mysqlEngine.getTableRows(selectedTable);
      const { filename, content } = exportGenericTableCSV(selectedTable, rows);
      downloadCSV(filename, content);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 mb-2">
            MySQL 8.0 &bull; InnoDB Relational Storage Engine
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Base de Données Relationnelle MySQL
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Gestionnaire relationnel complet : tables en direct, exécution de requêtes SQL en temps réel, 
            schéma InnoDB et synchronisation continue avec les deux cas pratiques (Fraude et Stocks).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCurrentTableCSV}
            title={`Exporter la table ${selectedTable} au format CSV`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exporter Table ({selectedTable}) en CSV</span>
          </button>

          <button
            onClick={handleDownloadSQL}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger Dump .SQL</span>
          </button>

          <button
            onClick={handleCopyDump}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition cursor-pointer"
          >
            {copiedDump ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedDump ? 'Copié !' : 'Copier DDL'}</span>
          </button>
        </div>
      </div>

      {/* Main Container: Sidebar (Tables list) + Main View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar: Tables List (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tables MySQL (InnoDB)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                nexomia_db
              </span>
            </div>

            <div className="space-y-1">
              {tableSchemas.map(t => {
                const isSelected = selectedTable === t.tableName;
                return (
                  <button
                    key={t.tableName}
                    onClick={() => {
                      setSelectedTable(t.tableName);
                      setActiveTab('DATA');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Table className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                      <span className="font-mono truncate">{t.tableName}</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 shrink-0">
                      {t.rowCount}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <button
                onClick={() => setActiveTab('QUERY')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'QUERY'
                    ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Console SQL Interactive</span>
              </button>
            </div>
          </div>

          {/* Quick Engine Specs */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Propriétés SGBD</span>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Moteur par défaut :</span>
              <span className="font-mono text-cyan-400">InnoDB (ACID)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Encodage :</span>
              <span className="font-mono">utf8mb4_unicode_ci</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Chiffrement au repos :</span>
              <span className="font-mono text-emerald-400">AES-256 (TDE)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Port standard :</span>
              <span className="font-mono">3306</span>
            </div>
          </div>
        </div>

        {/* Right Content Area (9 cols) */}
        <div className="lg:col-span-9 space-y-4">
          {/* Sub-tabs header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('DATA')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'DATA' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Données de la Table ({filteredRows.length})
              </button>

              <button
                onClick={() => setActiveTab('SCHEMA')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'SCHEMA' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Structure & Colonnes ({currentSchema?.columns.length})
              </button>

              <button
                onClick={() => setActiveTab('QUERY')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'QUERY' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Console Requêtes SQL
              </button>

              <button
                onClick={() => setActiveTab('CONFIG')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'CONFIG' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Configuration & DSN
              </button>
            </div>

            {activeTab === 'DATA' && (
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filtrer les lignes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>

          {/* TAB 1: Table DATA view */}
          {activeTab === 'DATA' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <div>
                  <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                    <Table className="w-4 h-4 text-blue-400" />
                    <span>Table : {selectedTable}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{currentSchema?.description}</p>
                </div>
                <span className="text-xs text-emerald-400 font-mono">
                  Engine: {currentSchema?.engine}
                </span>
              </div>

              <div className="overflow-x-auto max-h-[520px]">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono tracking-wider sticky top-0 border-b border-slate-800">
                    <tr>
                      {filteredRows.length > 0 && Object.keys(filteredRows[0]).map((col) => (
                        <th key={col} className="px-4 py-3 font-semibold whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition">
                        {Object.values(row).map((val: any, cIdx) => (
                          <td key={cIdx} className="px-4 py-3 whitespace-nowrap font-mono text-[11px]">
                            {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Table SCHEMA view */}
          {activeTab === 'SCHEMA' && currentSchema && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 bg-slate-950/60">
                <h3 className="font-mono text-sm font-bold text-white">
                  DDL Schema : {currentSchema.tableName}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{currentSchema.description}</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Champ (Field)</th>
                      <th className="px-4 py-3">Type SQL</th>
                      <th className="px-4 py-3">Clé (Key)</th>
                      <th className="px-4 py-3">Null</th>
                      <th className="px-4 py-3">Défaut</th>
                      <th className="px-4 py-3">Commentaire</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                    {currentSchema.columns.map((col, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="px-4 py-2.5 font-bold text-white">{col.name}</td>
                        <td className="px-4 py-2.5 text-cyan-300">{col.type}</td>
                        <td className="px-4 py-2.5">
                          {col.isPrimary && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              PRIMARY
                            </span>
                          )}
                          {col.isForeign && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                              FK
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-slate-400">{col.nullable ? 'YES' : 'NO'}</td>
                        <td className="px-4 py-2.5 text-slate-500">{col.defaultValue || 'NULL'}</td>
                        <td className="px-4 py-2.5 font-sans text-slate-400">{col.comment || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Interactive SQL Query Console */}
          {activeTab === 'QUERY' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>Éditeur de Requête SQL</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">Dialecte : MySQL 8.0</span>
                </div>

                <textarea
                  value={sqlInput}
                  onChange={(e) => setSqlInput(e.target.value)}
                  rows={4}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  placeholder="SELECT * FROM fraud_transactions WHERE risk_score > 70;"
                />

                {/* Quick suggestions */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Exemples rapides :</span>
                  <button
                    onClick={() => {
                      const q = "SELECT * FROM fraud_transactions WHERE risk_score > 80;";
                      setSqlInput(q);
                      handleExecuteQuery(q);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 cursor-pointer font-mono"
                  >
                    Fraudes &gt; 80
                  </button>
                  <button
                    onClick={() => {
                      const q = "SELECT * FROM products_inventory WHERE status = 'CRITICAL' OR status = 'REORDER_RECOMMENDED';";
                      setSqlInput(q);
                      handleExecuteQuery(q);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 cursor-pointer font-mono"
                  >
                    Stocks Critiques
                  </button>
                  <button
                    onClick={() => {
                      const q = "SELECT * FROM reassort_orders;";
                      setSqlInput(q);
                      handleExecuteQuery(q);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 cursor-pointer font-mono"
                  >
                    Ordres Réassort
                  </button>
                  <button
                    onClick={() => {
                      const q = "SHOW TABLES;";
                      setSqlInput(q);
                      handleExecuteQuery(q);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 cursor-pointer font-mono"
                  >
                    SHOW TABLES
                  </button>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => handleExecuteQuery()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Exécuter Requête SQL</span>
                  </button>
                </div>
              </div>

              {/* Execution result box */}
              {queryResult && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl animate-fade-in">
                  <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-mono">
                      {queryResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                      )}
                      <span className={queryResult.success ? 'text-emerald-300' : 'text-rose-300'}>
                        {queryResult.message || queryResult.error}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Temps d'exécution : {queryResult.executionTimeMs} ms
                    </span>
                  </div>

                  {queryResult.success && queryResult.rows.length > 0 && (
                    <div className="overflow-x-auto max-h-[350px]">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider sticky top-0 border-b border-slate-800">
                          <tr>
                            {queryResult.columns.map((col) => (
                              <th key={col} className="px-4 py-2.5 font-bold">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300">
                          {queryResult.rows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-800/40">
                              {queryResult.columns.map((cName, cIdx) => (
                                <td key={cIdx} className="px-4 py-2 whitespace-nowrap text-[11px]">
                                  {typeof row[cName] === 'object' ? JSON.stringify(row[cName]) : String(row[cName] ?? 'NULL')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Configuration & DSN credentials */}
          {activeTab === 'CONFIG' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <div>
                <h3 className="font-bold text-white text-base">
                  Paramètres de Connexion MySQL pour Déploiement Production
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Variables d'environnement prêtes pour Cloud SQL for MySQL, AWS RDS, ou serveur dédié OVH/Scaleway.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 space-y-1">
                <div># Connexion MySQL Standard NEXOMIA</div>
                <div>DATABASE_URL="mysql://nexomia_admin:SuperSecret2026!@localhost:3306/nexomia_db?ssl-mode=REQUIRED"</div>
                <div>MYSQL_HOST="localhost"</div>
                <div>MYSQL_PORT="3306"</div>
                <div>MYSQL_USER="nexomia_admin"</div>
                <div>MYSQL_PASSWORD="****************"</div>
                <div>MYSQL_DATABASE="nexomia_db"</div>
                <div>MYSQL_SSL_CIPHER="TLS_AES_256_GCM_SHA384"</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <strong className="text-white block font-sans">Importation via ligne de commande :</strong>
                  <div className="font-mono text-slate-400 bg-slate-900 p-2 rounded border border-slate-800">
                    mysql -u nexomia_admin -p -h 127.0.0.1 nexomia_db &lt; nexomia_dump.sql
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <strong className="text-white block font-sans">Chiffrement AES-256 (TDE) :</strong>
                  <p className="text-slate-400 leading-relaxed">
                    Toutes les tables bénéficient du chiffrement transparent des données (TDE) avec rotation des clés HSM souveraines.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
