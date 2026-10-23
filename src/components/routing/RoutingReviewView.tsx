import React, { useState } from 'react';
import {
  GitPullRequest,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Save,
  Clock,
  Sparkles,
  User,
  RefreshCw,
  Search,
} from 'lucide-react';
import { UnifiedRecord, ReviewState } from '../../types/conversation';
import { RouteCategory, ROUTE_TAXONOMY } from '../../types/routing';
import { RouteBadge, ReviewBadge } from '../common/Badge';

interface RoutingReviewViewProps {
  records: UnifiedRecord[];
  onOpenRecord: (record: UnifiedRecord) => void;
  onSaveOverride: (
    record: UnifiedRecord,
    primaryRoute: RouteCategory,
    additionalRoutes: RouteCategory[],
    notes: string,
    reviewState: ReviewState
  ) => void;
  onResetToSuggestion: (record: UnifiedRecord) => void;
  onRefreshAnalysis: (record: UnifiedRecord) => void;
}

export const RoutingReviewView: React.FC<RoutingReviewViewProps> = ({
  records,
  onOpenRecord,
  onSaveOverride,
  onResetToSuggestion,
  onRefreshAnalysis,
}) => {
  const [filterState, setFilterState] = useState<'all' | 'needs_attention' | 'overridden' | 'stale'>('all');
  const [search, setSearch] = useState('');

  // Editable local state buffer per record key
  const [editBuffers, setEditBuffers] = useState<
    Record<string, { primary: RouteCategory; notes: string; reviewState: ReviewState }>
  >({});

  const getRecordKey = (r: UnifiedRecord) => `${r.source_type}:${r.source_id}`;

  const getEditState = (r: UnifiedRecord) => {
    const key = getRecordKey(r);
    if (editBuffers[key]) return editBuffers[key];
    const currentPrimary =
      r.manual_override && r.primary_manual_route ? r.primary_manual_route : r.primary_suggested_route;
    return {
      primary: currentPrimary,
      notes: r.manager_notes || '',
      reviewState: r.review_state,
    };
  };

  const updateEditBuffer = (
    key: string,
    updates: Partial<{ primary: RouteCategory; notes: string; reviewState: ReviewState }>
  ) => {
    setEditBuffers((prev) => {
      const current = prev[key] || {
        primary: 'manual_review',
        notes: '',
        reviewState: 'pending_review',
      };
      return {
        ...prev,
        [key]: { ...current, ...updates },
      };
    });
  };

  // Filter records
  const filteredRecords = records.filter((r) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        r.record_ref.toLowerCase().includes(q) ||
        r.person_name.toLowerCase().includes(q) ||
        r.title_or_target.toLowerCase().includes(q) ||
        r.manager_notes.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (filterState === 'needs_attention') {
      return (
        r.review_state === 'pending_review' ||
        r.review_state === 'analysis_stale' ||
        r.review_state === 'needs_more_info'
      );
    }
    if (filterState === 'overridden') return r.manual_override;
    if (filterState === 'stale') return r.analysis_stale;
    return true;
  });

  // KPI stats
  const staleCount = records.filter((r) => r.analysis_stale).length;
  const pendingCount = records.filter((r) => r.review_state === 'pending_review').length;
  const reviewedCount = records.filter((r) => r.review_state === 'reviewed').length;
  const overrideCount = records.filter((r) => r.manual_override).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Workspace Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GitPullRequest className="w-5 h-5 text-indigo-600" />
            Routing & Quality Review Workspace
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare machine suggestions against manager decisions. A source update never silently erases a manual override.
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setFilterState('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold border transition-colors ${
              filterState === 'all'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            All ({records.length})
          </button>
          <button
            onClick={() => setFilterState('needs_attention')}
            className={`px-3 py-1.5 rounded-lg font-semibold border transition-colors ${
              filterState === 'needs_attention'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            Needs Review ({pendingCount})
          </button>
          {staleCount > 0 && (
            <button
              onClick={() => setFilterState('stale')}
              className={`px-3 py-1.5 rounded-lg font-semibold border transition-colors ${
                filterState === 'stale'
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
              }`}
            >
              Stale Analysis ({staleCount})
            </button>
          )}
          <button
            onClick={() => setFilterState('overridden')}
            className={`px-3 py-1.5 rounded-lg font-semibold border transition-colors ${
              filterState === 'overridden'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100'
            }`}
          >
            Manual Overrides ({overrideCount})
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by ref, company, person, or notes..."
          className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Review Cards Grid */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            No records match the selected review criteria.
          </div>
        ) : (
          filteredRecords.map((r) => {
            const key = getRecordKey(r);
            const state = getEditState(r);
            const routeDetail = r.analysis?.routes.find((rd) => rd.category === r.primary_suggested_route);

            return (
              <div
                key={key}
                className={`bg-white rounded-xl border transition-all p-5 shadow-xs space-y-4 ${
                  r.analysis_stale
                    ? 'border-rose-300 ring-1 ring-rose-100'
                    : r.manual_override
                    ? 'border-purple-200'
                    : 'border-slate-200'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                      {r.record_ref}
                    </span>
                    <div>
                      <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        {r.title_or_target}
                        <span className="text-[11px] font-normal text-slate-400 font-mono">
                          (Rev {r.applied_revision})
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {r.person_name} ({r.person_role === 'call_rep' ? 'Sales Rep' : 'Calendar Organiser'})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <ReviewBadge state={r.review_state} />
                    {r.manual_override && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                        Manual Override
                      </span>
                    )}
                    {r.analysis_stale && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200 animate-pulse">
                        Stale Text
                      </span>
                    )}
                    <button
                      onClick={() => onOpenRecord(r)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold p-1 ml-1"
                      title="Open complete detail drawer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Stale Text Notification Banner if M07 updated */}
                {r.analysis_stale && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between text-xs text-rose-900">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>
                        <strong>Late Source Text Arrived:</strong> Newer transcript was applied in Revision {r.applied_revision}. Please review new transcript and refresh analysis.
                      </span>
                    </div>
                    <button
                      onClick={() => onRefreshAnalysis(r)}
                      className="px-2.5 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-md shrink-0 shadow-xs"
                    >
                      Refresh Analysis
                    </button>
                  </div>
                )}

                {/* Comparison Grid: Machine Suggestion vs Manager Decision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column: Machine Suggestion & Evidence */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        Machine Suggestion
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">
                        Confidence: <strong>{routeDetail?.confidence || 'High'}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <RouteBadge category={r.primary_suggested_route} size="md" />
                      {r.suggested_routes.length > 1 && (
                        <span className="text-[11px] text-slate-400">
                          +{r.suggested_routes.length - 1} secondary
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      {routeDetail?.explanation || (
                        <span className="italic text-slate-400">
                          {r.has_usable_transcript
                            ? 'Rule-based suggested route.'
                            : 'No usable transcript supplied in source batch.'}
                        </span>
                      )}
                    </p>

                    {/* Evidence Quote Passage */}
                    {routeDetail?.evidence && routeDetail.evidence.length > 0 && (
                      <div className="pt-2 border-t border-slate-200/60">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Source Evidence Passage:
                        </span>
                        <blockquote className="text-xs italic bg-white p-2.5 rounded border border-slate-200 text-slate-700">
                          &ldquo;{routeDetail.evidence[0].quote}&rdquo;
                          <span className="block mt-1 font-mono text-[10px] text-slate-400 not-italic">
                            {routeDetail.evidence[0].source_type === 'call'
                              ? `Call adapted text`
                              : `Turn ${routeDetail.evidence[0].turn_number} [${routeDetail.evidence[0].timecode}]`}
                          </span>
                        </blockquote>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Manager Decision & Editable Notes */}
                  <div className="p-4 bg-white rounded-xl border-2 border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-indigo-600" />
                        Manager Route Decision
                      </span>
                      {r.manual_override ? (
                        <span className="text-[10px] font-bold text-purple-700">Custom Route Active</span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Following Suggestion</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Primary Route:
                        </label>
                        <select
                          value={state.primary}
                          onChange={(e) =>
                            updateEditBuffer(key, { primary: e.target.value as RouteCategory })
                          }
                          className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-1.5"
                        >
                          {(Object.keys(ROUTE_TAXONOMY) as RouteCategory[]).map((cat) => (
                            <option key={cat} value={cat}>
                              {ROUTE_TAXONOMY[cat].label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Review Status:
                        </label>
                        <select
                          value={state.reviewState}
                          onChange={(e) =>
                            updateEditBuffer(key, { reviewState: e.target.value as ReviewState })
                          }
                          className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-1.5"
                        >
                          <option value="pending_review">Pending Review</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="needs_more_info">Needs Info</option>
                          <option value="analysis_stale">Analysis Stale</option>
                          <option value="no_usable_transcript">No Transcript</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Manager Review Notes:
                      </label>
                      <input
                        type="text"
                        value={state.notes}
                        onChange={(e) => updateEditBuffer(key, { notes: e.target.value })}
                        placeholder="Add coaching comment or decision reason..."
                        className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                      />
                    </div>

                    {/* Save & Reset buttons */}
                    <div className="flex items-center justify-between pt-1">
                      {r.manual_override ? (
                        <button
                          type="button"
                          onClick={() => onResetToSuggestion(r)}
                          className="text-xs text-rose-600 hover:text-rose-800 font-semibold inline-flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Reset to Suggestion
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            onSaveOverride(r, r.primary_suggested_route, [], state.notes, 'reviewed');
                          }}
                          className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Mark Reviewed
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          onSaveOverride(r, state.primary, [], state.notes, state.reviewState);
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs inline-flex items-center gap-1"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save Decision
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
