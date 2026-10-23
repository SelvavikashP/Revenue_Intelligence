import React, { useState } from 'react';
import {
  Phone,
  Calendar,
  FileCheck2,
  AlertCircle,
  HelpCircle,
  SlidersHorizontal,
  UserCheck,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { UnifiedRecord } from '../../types/conversation';
import { calculateDashboardMetrics, getHighPriorityFollowUps, METRIC_DEFINITIONS } from '../../services/metricsCalculator';
import { MetricInfoTooltip } from '../common/Tooltip';
import { RouteBadge } from '../common/Badge';
import { ROUTE_TAXONOMY, RouteCategory } from '../../types/routing';

interface OverviewViewProps {
  records: UnifiedRecord[];
  onOpenRecord: (record: UnifiedRecord) => void;
  onNavigateToInboxWithFilter?: (filter: Partial<any>) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  records,
  onOpenRecord,
  onNavigateToInboxWithFilter,
}) => {
  // Working filters on overview
  const [selectedSourceType, setSelectedSourceType] = useState<'all' | 'call' | 'meeting'>('all');
  const [selectedPerson, setSelectedPerson] = useState<string>('all');

  // Filter records
  const filteredRecords = records.filter((r) => {
    if (selectedSourceType !== 'all' && r.source_type !== selectedSourceType) return false;
    if (selectedPerson !== 'all' && r.person_name !== selectedPerson) return false;
    return true;
  });

  const metrics = calculateDashboardMetrics(filteredRecords);
  const followUps = getHighPriorityFollowUps(records);

  // Distinct list of people for filter dropdown
  const allPeople = Array.from(new Set(records.map((r) => r.person_name))).filter(Boolean).sort();

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            Dashboard Filters:
          </div>

          {/* Source Type Filter */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
            <button
              onClick={() => setSelectedSourceType('all')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                selectedSourceType === 'all'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Types ({records.length})
            </button>
            <button
              onClick={() => setSelectedSourceType('call')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                selectedSourceType === 'call'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Calls ({records.filter((r) => r.source_type === 'call').length})
            </button>
            <button
              onClick={() => setSelectedSourceType('meeting')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                selectedSourceType === 'meeting'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Meetings ({records.filter((r) => r.source_type === 'meeting').length})
            </button>
          </div>

          {/* Person Filter */}
          <select
            value={selectedPerson}
            onChange={(e) => setSelectedPerson(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="all">All People ({allPeople.length} Reps & Organizers)</option>
            {allPeople.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {(selectedSourceType !== 'all' || selectedPerson !== 'all') && (
            <button
              onClick={() => {
                setSelectedSourceType('all');
                setSelectedPerson('all');
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline underline-offset-2 ml-1"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-semibold text-slate-900">{filteredRecords.length}</span> of{' '}
          <span className="font-semibold text-slate-900">{records.length}</span> records
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Unique Records */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
              Unique Records
              <MetricInfoTooltip {...METRIC_DEFINITIONS.uniqueRecords} />
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {metrics.totalUniqueRecords}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({metrics.totalCalls} Calls / {metrics.totalMeetings} Mtgs)
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Distinct (source_type, source_id) pairs
          </p>
        </div>

        {/* Metric 2: Usable Transcript Coverage */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
              Transcript Coverage
              <MetricInfoTooltip {...METRIC_DEFINITIONS.transcriptCoverage} />
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {metrics.transcriptCoveragePct.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-600 font-medium">
              ({metrics.usableTranscriptsCount} / {metrics.totalUniqueRecords})
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
            <span>Calls: {metrics.callsCoveragePct.toFixed(0)}%</span>
            <span>Mtgs: {metrics.meetingsCoveragePct.toFixed(0)}%</span>
          </div>
        </div>

        {/* Metric 3: Records Requiring Review */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
              Needs Review / Stale
              <MetricInfoTooltip {...METRIC_DEFINITIONS.reviewRequired} />
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-600 tracking-tight">
              {metrics.recordsRequiringReview}
            </span>
            <span className="text-xs text-slate-500 font-medium">pending confirmation</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Includes intake states & stale analyses
          </p>
        </div>

        {/* Metric 4: Manual Overrides */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
              Manual Overrides
              <MetricInfoTooltip {...METRIC_DEFINITIONS.manualOverrides} />
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-purple-700 tracking-tight">
              {metrics.manualOverrideCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">manager interventions</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Preserved across source updates
          </p>
        </div>
      </div>

      {/* Row 2: Connection Rate Analysis & Route Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connection Rate Deep Dive Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center">
              Source-Reported Connection Rate
              <MetricInfoTooltip {...METRIC_DEFINITIONS.connectionRate} />
            </h2>
            <span className="text-[10px] font-semibold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              Telephony Switch
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-slate-900">
                {metrics.sourceReportedConnectionRatePct.toFixed(1)}%
              </span>
              <span className="text-xs font-semibold text-slate-600">
                {metrics.sourceReportedConnectedCalls} / {metrics.sourceReportedEligibleCalls} Calls
              </span>
            </div>

            <div className="mt-3 space-y-1.5 text-xs text-slate-600 border-t border-slate-200/60 pt-3">
              <div className="flex justify-between">
                <span>Eligible denominator (\`is_connected !== null\`):</span>
                <span className="font-semibold text-slate-800">{metrics.sourceReportedEligibleCalls}</span>
              </div>
              <div className="flex justify-between">
                <span>Unknown / Null count:</span>
                <span className="font-semibold text-slate-800">{metrics.sourceReportedUnknownCalls}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Reported Connected (\`is_connected = true\`):</span>
                <span className="font-semibold">{metrics.sourceReportedConnectedCalls}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 p-2.5 bg-amber-50/70 rounded-lg border border-amber-200/70 text-[11px] text-amber-900 leading-relaxed">
            <span className="font-bold">⚠️ Critical Discrepancy Note:</span> This metric reflects upstream phone switch tags, NOT ground truth. Two calls (B11, B14) were tagged connected but were unresponsive zero-speech voicemails. Conversely, C04 was tagged \`false\` despite leaving a full sales voicemail.
          </div>
        </div>

        {/* Route Distribution Card */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Assigned Routing Categories</h2>
              <p className="text-xs text-slate-500">
                Breakdown of active routes across {filteredRecords.length} records (Primary route assignments)
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500">
              Assignments: {Object.values(metrics.routeAssignments).reduce((a, b) => a + b, 0)}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(Object.keys(ROUTE_TAXONOMY) as RouteCategory[]).map((cat) => {
              const meta = ROUTE_TAXONOMY[cat];
              const uniqueCount = metrics.uniqueRecordsByRoute[cat] || 0;
              const totalAssigned = metrics.routeAssignments[cat] || 0;
              return (
                <div
                  key={cat}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-800">{meta.label}</span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.accentColor }} />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-extrabold text-slate-900">{uniqueCount}</span>
                    <span className="text-[11px] text-slate-500">records</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Total tagged: {totalAssigned}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: High Priority Follow-Ups */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              High-Priority Manager Follow-Ups
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Actionable items derived directly from conversation transcripts with confirmed owners and evidence
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
            {followUps.length} Actions Listed
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {followUps.map((item) => {
            const matchedRecord = records.find((r) => r.record_ref === item.record_ref);
            return (
              <div
                key={item.record_ref}
                onClick={() => matchedRecord && onOpenRecord(matchedRecord)}
                className="p-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                      {item.record_ref}
                    </span>
                    <span className="font-bold text-sm text-slate-900">{item.entityName}</span>
                    <RouteBadge category={item.primaryRoute} />
                    {item.priority === 'high' && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded">
                        High Priority
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-medium text-slate-800">{item.title}</div>
                  <div className="text-xs text-slate-600">{item.action}</div>
                  <div className="text-[11px] text-slate-400 italic">
                    Evidence: &ldquo;{item.evidenceQuote}&rdquo; ({item.evidenceRef})
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                      Assigned Owner
                    </div>
                    <div className="text-xs font-bold text-slate-700">{item.owner}</div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 4: Team Activity Breakdown (Call Reps vs Meeting Organisers) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Call Representatives Activity */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-600" />
                Call Representatives Activity
              </h2>
              <p className="text-xs text-slate-500">
                Selected outbound & inbound calls grouped by rep account (started_at timestamp)
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {metrics.repsActivity.length} Reps
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Rep Name</th>
                  <th className="py-2.5 px-3 text-right">Total Calls</th>
                  <th className="py-2.5 px-3 text-right">Switch Connected</th>
                  <th className="py-2.5 px-3 text-right">Usable Text</th>
                  <th className="py-2.5 px-3 text-right">Talk Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.repsActivity.map((rep) => (
                  <tr key={rep.name} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {rep.name}
                      {rep.email && <span className="block text-[11px] text-slate-400 font-normal">{rep.email}</span>}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-800">{rep.totalCalls}</td>
                    <td className="py-2.5 px-3 text-right text-slate-600">{rep.connectedCalls}</td>
                    <td className="py-2.5 px-3 text-right text-indigo-600 font-semibold">{rep.usableTranscripts}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                      {Math.floor(rep.totalTalkTimeSeconds / 60)}m {rep.totalTalkTimeSeconds % 60}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Meeting Organisers Activity */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Calendar Meeting Organisers
              </h2>
              <p className="text-xs text-slate-500">
                Organisers from calendar records. Distinct from attendees or sales roles.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {metrics.organizersActivity.length} Organisers
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Organiser Email</th>
                  <th className="py-2.5 px-3 text-right">Meetings</th>
                  <th className="py-2.5 px-3 text-right">Recorded</th>
                  <th className="py-2.5 px-3 text-right">Usable Turns</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.organizersActivity.map((org) => (
                  <tr key={org.email} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 font-mono text-[11px]">
                      {org.email}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-800">{org.totalMeetings}</td>
                    <td className="py-2.5 px-3 text-right text-slate-600">{org.recordedMeetings}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-600 font-semibold">{org.usableTranscripts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
