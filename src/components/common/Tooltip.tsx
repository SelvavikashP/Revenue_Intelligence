import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface MetricInfoTooltipProps {
  label: string;
  formula: string;
  numerator: string;
  denominator: string;
  caveat?: string;
}

export const MetricInfoTooltip: React.FC<MetricInfoTooltipProps> = ({
  label,
  formula,
  numerator,
  denominator,
  caveat,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative inline-flex items-center ml-1.5">
      <button
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible(!visible)}
        aria-label={`Definition for ${label}`}
        className="text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {visible && (
        <div
          role="tooltip"
          className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 p-3 bg-slate-900 text-slate-100 text-xs rounded-lg shadow-xl border border-slate-700 pointer-events-none animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="font-semibold text-white mb-1">{label}</div>
          <div className="space-y-1 text-slate-300">
            <div>
              <span className="text-slate-400 font-mono text-[11px]">Formula:</span> {formula}
            </div>
            <div>
              <span className="text-slate-400 font-mono text-[11px]">Numerator:</span> {numerator}
            </div>
            <div>
              <span className="text-slate-400 font-mono text-[11px]">Denominator:</span> {denominator}
            </div>
            {caveat && (
              <div className="pt-1 mt-1 border-t border-slate-800 text-amber-300 text-[11px] leading-tight">
                ⚠️ {caveat}
              </div>
            )}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
};
