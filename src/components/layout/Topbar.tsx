import React from 'react';
import { Search, RotateCcw, Play, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

interface TopbarProps {
  title: string;
  subtitle?: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onDemoLoad: () => void;
  onResetClick: () => void;
  appliedRevisions: number[];
  totalRecords: number;
  usableTranscripts: number;
}

export const Topbar: React.FC<TopbarProps> = ({
  title,
  subtitle,
  searchQuery,
  onSearchChange,
  onDemoLoad,
  onResetClick,
  appliedRevisions,
  totalRecords,
  usableTranscripts,
}) => {
  const hasRev2 = appliedRevisions.includes(2);
  const hasRev1 = appliedRevisions.includes(1);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
      {/* Title & Context */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-900 tracking-tight">{title}</h1>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Asia/Kolkata (21 Aug 2026)
            </span>
          </div>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search records, entities, quotes, refs (e.g. M07, C01, Harborlight)..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Actions & Status Badges */}
      <div className="flex items-center gap-3">
        {/* Revision badges */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
          <Layers className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-500 font-medium">Revisions:</span>
          {hasRev1 ? (
            <span className="font-semibold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">
              Rev 1
            </span>
          ) : (
            <span className="text-slate-400 text-[10px]">None</span>
          )}
          {hasRev2 && (
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
              Rev 2 (Late M07)
            </span>
          )}
        </div>

        {/* Demo Load Action */}
        <button
          onClick={onDemoLoad}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors"
          title="Import both 01_initial and 02_update to open final post-update state"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          Demo Load (Final)
        </button>

        {/* Reset / Clean Start Action */}
        <button
          onClick={onResetClick}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          title="Clean start / reset IndexedDB state"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          Reset
        </button>
      </div>
    </header>
  );
};
