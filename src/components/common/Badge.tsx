import React from 'react';
import { RouteCategory, ROUTE_TAXONOMY } from '../../types/routing';
import { ReviewState } from '../../types/conversation';

interface RouteBadgeProps {
  category: RouteCategory;
  isManual?: boolean;
  size?: 'sm' | 'md';
}

export const RouteBadge: React.FC<RouteBadgeProps> = ({ category, isManual, size = 'sm' }) => {
  const meta = ROUTE_TAXONOMY[category] || {
    label: category,
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-semibold border ${meta.badgeColor} ${sizeClasses}`}
      title={isManual ? 'Manually assigned by sales manager' : 'Machine suggested route'}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
      {meta.label}
      {isManual && (
        <span
          className="text-[10px] uppercase tracking-wider font-bold bg-white/70 px-1 py-0.2 rounded border border-current/20 ml-0.5"
          title="Manual Override"
        >
          Manual
        </span>
      )}
    </span>
  );
};

interface ReviewBadgeProps {
  state: ReviewState;
}

export const ReviewBadge: React.FC<ReviewBadgeProps> = ({ state }) => {
  switch (state) {
    case 'reviewed':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Reviewed
        </span>
      );
    case 'analysis_stale':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          Analysis Stale
        </span>
      );
    case 'needs_more_info':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Needs Info
        </span>
      );
    case 'no_usable_transcript':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-slate-100 text-slate-600 border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          No Transcript
        </span>
      );
    case 'pending_review':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          Pending Review
        </span>
      );
  }
};
