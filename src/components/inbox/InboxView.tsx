import React, { useState, useMemo } from 'react';
import {
  Phone,
  Calendar,
  FileCheck2,
  FileX2,
  Filter,
  ArrowUpDown,
  Search,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { UnifiedRecord, ReviewState } from '../../types/conversation';
import { RouteCategory, ROUTE_TAXONOMY } from '../../types/routing';
import { RouteBadge, ReviewBadge } from '../common/Badge';

interface InboxViewProps {
  records: UnifiedRecord[];
  onOpenRecord: (record: UnifiedRecord) => void;
  initialSearchQuery?: string;
}

export const InboxView: React.FC<InboxViewProps> = ({
  records,
  onOpenRecord,
  initialSearchQuery = '',
}) => {
  // Filter States
  const [search, setSearch] = useState(initialSearchQuery);
  const [sourceType, setSourceType] = useState<'all' | 'call' | 'meeting'>('all');
  const [person, setPerson] = useState<string>('all');
  const [routeCategory, setRouteCategory] = useState<'all' | RouteCategory>('all');
  const [transcriptFilter, setTranscriptFilter] = useState<'all' | 'usable' | 'none'>('all');
  const [reviewStateFilter, setReviewStateFilter] = useState<'all' | ReviewState>('all');
  const [manualOverrideOnly, setManualOverrideOnly] = useState(false);
  const [freshnessFilter, setFreshnessFilter] = useState<'all' | 'fresh' | 'stale'>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'priority' | 'ref_asc'>('priority');

  // People dropdown options
  const people = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.person_name))).filter(Boolean).sort();
  }, [records]);

  // Filtered and Sorted Records
  const filteredRecords = useMemo(() => {
    return records
      .filter((r) => {
        // Search text matching
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchRef = r.record_ref.toLowerCase().includes(q);
          const matchTitle = r.title_or_target.toLowerCase().includes(q);
          const matchPerson = r.person_name.toLowerCase().includes(q);
          const matchTranscript = r.full_transcript_text?.toLowerCase().includes(q);
          const matchNotes = r.manager_notes.toLowerCase().includes(q);
          const matchSummary = r.analysis?.summary.toLowerCase().includes(q);
          if (!matchRef && !matchTitle && !matchPerson && !matchTranscript && !matchNotes && !matchSummary) {
            return false;
          }
        }

        // Source Type
        if (sourceType !== 'all' && r.source_type !== sourceType) return false;

        // Person
        if (person !== 'all' && r.person_name !== person) return false;

        // Route Category
        if (routeCategory !== 'all') {
          const activeRoutes = r.manual_override && r.manual_routes ? r.manual_routes : r.suggested_routes;
          if (!activeRoutes.includes(routeCategory)) return false;
        }

        // Transcript
        if (transcriptFilter === 'usable' && !r.has_usable_transcript) return false;
        if (transcriptFilter === 'none' && r.has_usable_transcript) return false;

        // Review State
        if (reviewStateFilter !== 'all' && r.review_state !== reviewStateFilter) return false;

        // Manual Override Only
        if (manualOverrideOnly && !r.manual_override) return false;

        // Freshness
        if (freshnessFilter === 'stale' && !r.analysis_stale) return false;
        if (freshnessFilter === 'fresh' && r.analysis_stale) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') {
          return new Date(b.activity_timestamp).getTime() - new Date(a.activity_timestamp).getTime();
        }
        if (sortBy === 'date_asc') {
          return new Date(a.activity_timestamp).getTime() - new Date(b.activity_timestamp).getTime();
        }
        if (sortBy === 'ref_asc') {
          return a.record_ref.localeCompare(b.record_ref);
        }
        if (sortBy === 'priority') {
          // Priority: Stale analysis first, then pending_review, then others
          const rank = (rec: UnifiedRecord) => {
            if (rec.analysis_stale) return 0;
            if (rec.review_state === 'pending_review') return 1;
            if (rec.review_state === 'needs_more_info') return 2;
            if (rec.has_usable_transcript) return 3;
            return 4;
          };
          return rank(a) - rank(b);
        }
        return 0;
      });
  }, [
    records,
    search,
    sourceType,
    person,
    routeCategory,
    transcriptFilter,
    reviewStateFilter,
    manualOverrideOnly,
    freshnessFilter,
    sortBy,
  ]);

  const resetAllFilters = () => {
    setSearch('');
    setSourceType('all');
    setPerson('all');
    setRouteCategory('all');
    setTranscriptFilter('all');
    setReviewStateFilter('all');
    setManualOverrideOnly(false);
    setFreshnessFilter('all');
    setSortBy('priority');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Search and Filters Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Filter Group 1: Source & Search */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative min-w-[200px] flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter table..."
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Type selector */}
            <select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value as any)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
            >
              <option value="all">All Types</option>
              <option value="call">Calls Only (30)</option>
              <option value="meeting">Meetings Only (14)</option>
            </select>

            {/* Person selector */}
            <select
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
            >
              <option value="all">All People ({people.length})</option>
              {people.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            {/* Route Category selector */}
            <select
              value={routeCategory}
              onChange={(e) => setRouteCategory(e.target.value as any)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
            >
              <option value="all">All Routes</option>
              {(Object.keys(ROUTE_TAXONOMY) as RouteCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {ROUTE_TAXONOMY[cat].label}
                </option>
              ))}
            </select>

            {/* Transcript filter */}
            <select
              value={transcriptFilter}
              onChange={(e) => setTranscriptFilter(e.target.value as any)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
            >
              <option value="all">Transcript: All</option>
              <option value="usable">Usable Text Only</option>
              <option value="none">Missing / No Text</option>
            </select>

            {/* Review state */}
            <select
              value={reviewStateFilter}
              onChange={(e) => setReviewStateFilter(e.target.value as any)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
            >
              <option value="all">Review: All</option>
              <option value="pending_review">Pending Review</option>
              <option value="analysis_stale">Analysis Stale</option>
              <option value="reviewed">Reviewed</option>
              <option value="needs_more_info">Needs Info</option>
              <option value="no_usable_transcript">No Usable Transcript</option>
            </select>
          </div>

          {/* Sort Selector & Reset */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-medium text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold"
            >
              <option value="priority">Review Priority</option>
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="ref_asc">Record Ref (A-Z)</option>
            </select>

            <button
              onClick={resetAllFilters}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1.5 rounded hover:bg-indigo-50 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Quick Toggles */}
        <div className="flex items-center gap-4 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
            <input
              type="checkbox"
              checked={manualOverrideOnly}
              onChange={(e) => setManualOverrideOnly(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
            />
            <span>Show Only Manual Overrides</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
            <input
              type="checkbox"
              checked={freshnessFilter === 'stale'}
              onChange={(e) => setFreshnessFilter(e.target.checked ? 'stale' : 'all')}
              className="rounded text-rose-600 focus:ring-rose-500 w-3.5 h-3.5"
            />
            <span>Show Only Stale Analysis</span>
          </label>

          <span className="ml-auto text-slate-400 text-[11px]">
            Found <strong>{filteredRecords.length}</strong> matching records
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-3.5">Ref</th>
                <th className="py-3 px-3.5">Type & Target / Title</th>
                <th className="py-3 px-3.5">Rep / Organiser</th>
                <th className="py-3 px-3.5">Date & Time (Kolkata)</th>
                <th className="py-3 px-3.5 text-center">Transcript</th>
                <th className="py-3 px-3.5 text-center">Revision</th>
                <th className="py-3 px-3.5">Active Route</th>
                <th className="py-3 px-3.5">Review State</th>
                <th className="py-3 px-3.5 text-center">Freshness</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No conversation records match your current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => {
                  const activeRoute =
                    r.manual_override && r.primary_manual_route
                      ? r.primary_manual_route
                      : r.primary_suggested_route;

                  return (
                    <tr
                      key={`${r.source_type}:${r.source_id}`}
                      onClick={() => onOpenRecord(r)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* Ref */}
                      <td className="py-3 px-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-colors">
                          {r.record_ref}
                        </span>
                      </td>

                      {/* Type & Title */}
                      <td className="py-3 px-3.5 max-w-xs">
                        <div className="font-semibold text-slate-900 truncate" title={r.title_or_target}>
                          {r.title_or_target}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono truncate">
                          ID: {r.source_id.slice(0, 8)}...
                        </div>
                      </td>

                      {/* Rep / Organizer */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">{r.person_name}</div>
                        <div className="text-[10px] text-slate-400">
                          {r.person_role === 'call_rep' ? 'Sales Rep' : 'Calendar Organiser'}
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3 px-3.5 whitespace-nowrap text-slate-600">
                        <div>21 Aug 2026</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {r.activity_timestamp.slice(11, 16)} UTC
                        </div>
                      </td>

                      {/* Transcript */}
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        {r.has_usable_transcript ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <FileCheck2 className="w-3 h-3" /> Usable
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            <FileX2 className="w-3 h-3" /> None
                          </span>
                        )}
                      </td>

                      {/* Revision */}
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        <span
                          className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                            r.applied_revision === 2
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          Rev {r.applied_revision}
                        </span>
                      </td>

                      {/* Active Route */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <RouteBadge category={activeRoute} isManual={r.manual_override} />
                      </td>

                      {/* Review State */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <ReviewBadge state={r.review_state} />
                      </td>

                      {/* Freshness */}
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        {r.analysis_stale ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Stale
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-slate-400">Fresh</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <span className="text-xs font-semibold text-indigo-600 group-hover:underline inline-flex items-center gap-0.5">
                          View <ExternalLink className="w-3 h-3" />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
