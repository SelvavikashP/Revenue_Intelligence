import React, { useState } from 'react';
import {
  X,
  Phone,
  Calendar,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  User,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { UnifiedRecord, ReviewState } from '../../types/conversation';
import { RouteCategory, ROUTE_TAXONOMY } from '../../types/routing';
import { RouteBadge, ReviewBadge } from '../common/Badge';

interface ConversationDrawerProps {
  record: UnifiedRecord | null;
  onClose: () => void;
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

export const ConversationDrawer: React.FC<ConversationDrawerProps> = ({
  record,
  onClose,
  onSaveOverride,
  onResetToSuggestion,
  onRefreshAnalysis,
}) => {
  if (!record) return null;

  // Active route selections in editor
  const currentPrimary =
    record.manual_override && record.primary_manual_route
      ? record.primary_manual_route
      : record.primary_suggested_route;

  const currentAdditionals =
    record.manual_override && record.manual_routes
      ? record.manual_routes.filter((r) => r !== currentPrimary)
      : record.suggested_routes.filter((r) => r !== currentPrimary);

  const [selectedPrimary, setSelectedPrimary] = useState<RouteCategory>(currentPrimary);
  const [selectedAdditionals, setSelectedAdditionals] = useState<RouteCategory[]>(currentAdditionals);
  const [notes, setNotes] = useState<string>(record.manager_notes || '');
  const [reviewState, setReviewState] = useState<ReviewState>(record.review_state);
  const [activeTab, setActiveTab] = useState<'overview' | 'transcript' | 'differentiated' | 'source_meta'>('overview');

  const toggleAdditionalRoute = (route: RouteCategory) => {
    if (selectedAdditionals.includes(route)) {
      setSelectedAdditionals(selectedAdditionals.filter((r) => r !== route));
    } else {
      setSelectedAdditionals([...selectedAdditionals, route]);
    }
  };

  const handleSave = () => {
    onSaveOverride(record, selectedPrimary, selectedAdditionals, notes, reviewState);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2 py-0.5 rounded shadow-xs">
              {record.record_ref}
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                {record.title_or_target}
                {record.source_type === 'call' ? (
                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Call ({record.direction || 'outbound'})
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Meeting
                  </span>
                )}
              </h2>
              <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>{record.person_name} ({record.person_role === 'call_rep' ? 'Sales Rep' : 'Meeting Organiser'})</span>
                <span>•</span>
                <span>Revision {record.applied_revision}</span>
                <span>•</span>
                <span>{record.activity_timestamp.slice(0, 16).replace('T', ' ')}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stale Analysis Alert Banner if applicable */}
        {record.analysis_stale && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-xs text-rose-800 font-medium">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                <strong>Analysis Stale:</strong> A newer source transcript arrived in Revision {record.applied_revision}. Prior analysis does not yet reflect the updated text.
              </span>
            </div>
            <button
              onClick={() => onRefreshAnalysis(record)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md shadow-xs transition-colors shrink-0"
            >
              <RefreshCw className="w-3 h-3" />
              Refresh Analysis
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-white shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Routing & Summary
          </button>
          <button
            onClick={() => setActiveTab('transcript')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'transcript'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Full Transcript {record.has_usable_transcript ? '(Available)' : '(None)'}
          </button>
          {record.has_usable_transcript && (
            <button
              onClick={() => setActiveTab('differentiated')}
              className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'differentiated'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Differentiated Breakdown
            </button>
          )}
          <button
            onClick={() => setActiveTab('source_meta')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'source_meta'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Raw Source Metadata
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW & ROUTING */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Executive Brief & Overview
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {record.analysis ? record.analysis.summary : (
                    <span className="text-slate-500 italic">
                      No usable transcript supplied in source delivery. Substantive analysis is withheld.
                    </span>
                  )}
                </p>
                <div className="mt-3 pt-3 border-t border-slate-200/60 flex flex-wrap items-center gap-3">
                  <span className="text-[11px] text-slate-500">
                    Review Status: <ReviewBadge state={record.review_state} />
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Active Route: <RouteBadge category={currentPrimary} isManual={record.manual_override} />
                  </span>
                </div>
              </div>

              {/* Evidence & Decision Details */}
              {record.analysis && record.analysis.routes.map((routeDetail) => (
                <div key={routeDetail.category} className="border border-slate-200 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RouteBadge category={routeDetail.category} size="md" />
                      <span className="text-xs text-slate-500 font-semibold">
                        Confidence: <strong className="text-slate-800 uppercase">{routeDetail.confidence}</strong>
                      </span>
                    </div>
                    {routeDetail.action_owner && (
                      <span className="text-xs text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded">
                        Owner: {routeDetail.action_owner}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-700 leading-relaxed font-medium">
                    {routeDetail.explanation}
                  </div>

                  <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100 text-xs text-indigo-900 font-medium">
                    <span className="font-bold">Next Action:</span> {routeDetail.next_action}
                  </div>

                  {/* Observed Facts vs Inferences */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Observed Facts (Ground Truth)
                      </div>
                      <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                        {routeDetail.observed_facts.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        Inferences (Interpretation)
                      </div>
                      <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                        {routeDetail.inferences.map((inf, i) => (
                          <li key={i}>{inf}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* What Evidence Does Not Establish */}
                  <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200/60 text-xs text-amber-900">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-1 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                      What The Evidence Does NOT Establish
                    </div>
                    <ul className="text-[11px] text-amber-800 space-y-1 list-disc list-inside">
                      {routeDetail.unestablished.map((u, i) => (
                        <li key={i}>{u}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Supporting Evidence Quotes */}
                  {routeDetail.evidence.length > 0 && (
                    <div className="pt-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Supporting Evidence Passages
                      </div>
                      <div className="space-y-2">
                        {routeDetail.evidence.map((ev, i) => (
                          <blockquote
                            key={i}
                            className="text-xs italic bg-slate-50 border-l-3 border-indigo-500 p-2.5 rounded-r text-slate-700"
                          >
                            &ldquo;{ev.quote}&rdquo;
                            <span className="block mt-1 font-mono text-[10px] text-slate-400 not-italic">
                              {ev.source_type === 'call'
                                ? `Call adapted text (${ev.record_ref})`
                                : `Turn ${ev.turn_number ?? 'N/A'} [${ev.timecode ?? ''}] - ${ev.speaker ?? 'Speaker'}`}
                            </span>
                          </blockquote>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Manager Routing Override & Notes Editor */}
              <div className="border-t border-slate-200 pt-6">
                <div className="bg-white border-2 border-indigo-100 rounded-xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-indigo-600" />
                      Manager Routing Decision & Notes
                    </h3>
                    {record.manual_override && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                        Manual Override Active
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Primary Route */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Primary Route:
                      </label>
                      <select
                        value={selectedPrimary}
                        onChange={(e) => setSelectedPrimary(e.target.value as RouteCategory)}
                        className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {(Object.keys(ROUTE_TAXONOMY) as RouteCategory[]).map((cat) => (
                          <option key={cat} value={cat}>
                            {ROUTE_TAXONOMY[cat].label}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Determines the primary destination folder in export.
                      </p>
                    </div>

                    {/* Review State */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Review State:
                      </label>
                      <select
                        value={reviewState}
                        onChange={(e) => setReviewState(e.target.value as ReviewState)}
                        className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="pending_review">Pending Review</option>
                        <option value="reviewed">Reviewed (Confirmed)</option>
                        <option value="needs_more_info">Needs More Information</option>
                        <option value="analysis_stale">Analysis Stale</option>
                        <option value="no_usable_transcript">No Usable Transcript</option>
                      </select>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Current verification status by sales leadership.
                      </p>
                    </div>
                  </div>

                  {/* Additional Routes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Additional Routes (Multi-Routing):
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(ROUTE_TAXONOMY) as RouteCategory[])
                        .filter((r) => r !== selectedPrimary)
                        .map((route) => {
                          const isSelected = selectedAdditionals.includes(route);
                          return (
                            <button
                              key={route}
                              type="button"
                              onClick={() => toggleAdditionalRoute(route)}
                              className={`text-xs px-2.5 py-1 rounded-md font-medium border transition-colors ${
                                isSelected
                                  ? 'bg-indigo-600 text-white border-indigo-600'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              + {ROUTE_TAXONOMY[route].label}
                            </button>
                          );
                        })}
                    </div>
                  </div>

                  {/* Manager Notes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Manager Review Notes:
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Enter coaching feedback, commercial context, or follow-up instructions..."
                      rows={3}
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    {record.manual_override ? (
                      <button
                        type="button"
                        onClick={() => onResetToSuggestion(record)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-semibold inline-flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset to Automated Suggestion
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        Suggested: {ROUTE_TAXONOMY[record.primary_suggested_route]?.label}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={handleSave}
                      className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-colors"
                    >
                      Save Review Decision
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FULL TRANSCRIPT */}
          {activeTab === 'transcript' && (
            <div className="space-y-4">
              {!record.has_usable_transcript ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <div className="text-sm font-bold text-slate-700">No Usable Transcript Supplied</div>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    This source record intentionally contains no usable audio text in this assessment package.
                    Original upstream summaries were withheld.
                  </p>
                  {record.meeting_payload?.recording_detail && (
                    <div className="mt-3 inline-block text-[11px] font-mono bg-white px-3 py-1.5 rounded border border-slate-200 text-slate-600">
                      Recording Detail: {record.meeting_payload.recording_detail}
                    </div>
                  )}
                </div>
              ) : record.source_type === 'call' ? (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
                    <span>Plain-Text Adapted Transcript</span>
                    <span>Duration: {record.duration_seconds}s</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-sans text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {record.full_transcript_text}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
                    <span>
                      Speaker Turns ({record.transcript_payload?.turns?.length || 0} turns)
                    </span>
                    <span>Timecoded Excerpts</span>
                  </div>
                  <div className="space-y-2.5">
                    {record.transcript_payload?.turns?.map((turn, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                              Turn {index + 1}
                            </span>
                            <span className="font-bold text-xs text-slate-900">{turn.speaker}</span>
                          </div>
                          <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {turn.timecode}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{turn.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DIFFERENTIATED BREAKDOWN */}
          {activeTab === 'differentiated' && record.analysis && (
            <div className="space-y-4">
              {record.analysis.differentiated.sales_coaching && (
                <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-200 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Sales Coaching Dimensions
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-800">Opening & Hook:</span>{' '}
                      <span className="text-slate-600">{record.analysis.differentiated.sales_coaching.opening}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">Discovery Depth:</span>{' '}
                      <span className="text-slate-600">{record.analysis.differentiated.sales_coaching.discovery}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">Objection Handling:</span>{' '}
                      <span className="text-slate-600">{record.analysis.differentiated.sales_coaching.objection_handling}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">Communication Quality:</span>{' '}
                      <span className="text-slate-600">{record.analysis.differentiated.sales_coaching.communication_effectiveness}</span>
                    </div>
                    <div className="pt-2 border-t border-amber-200/60 text-amber-900 font-medium">
                      <span className="font-bold">Coaching Recommendation:</span>{' '}
                      {record.analysis.differentiated.sales_coaching.coaching_recommendation}
                    </div>
                  </div>
                </div>
              )}

              {record.analysis.differentiated.deal_follow_up && (
                <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-200 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    Deal Follow-Up Dimensions
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-800">Prospect Interest:</span>{' '}
                      <span className="text-slate-600">{record.analysis.differentiated.deal_follow_up.prospect_interest}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">Unresolved Concerns:</span>{' '}
                      <span className="text-slate-600">{record.analysis.differentiated.deal_follow_up.unresolved_concerns}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">Timeline & Budget:</span>{' '}
                      <span className="text-slate-600">{record.analysis.differentiated.deal_follow_up.timeline_budget}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">Next Steps:</span>{' '}
                      <span className="text-slate-600">{record.analysis.differentiated.deal_follow_up.next_steps}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">Confirmed Owner:</span>{' '}
                      <span className="text-indigo-700 font-semibold">{record.analysis.differentiated.deal_follow_up.confirmed_owner || 'Unassigned'}</span>
                    </div>
                  </div>
                </div>
              )}

              {record.analysis.differentiated.customer_success && (
                <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
                    Customer Success & Bug Triage Dimensions
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-800">Support Needs:</span>{' '}
                      <span className="text-slate-600">{record.analysis.differentiated.customer_success.support_needs}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">Adoption Blockers:</span>{' '}
                      <span className="text-slate-600">{record.analysis.differentiated.customer_success.adoption_issues}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">Customer Commitments:</span>{' '}
                      <span className="text-slate-600">{record.analysis.differentiated.customer_success.customer_commitments}</span>
                    </div>
                    {record.analysis.differentiated.customer_success.technical_blockers?.length > 0 && (
                      <div>
                        <span className="font-bold text-slate-800">Reported Technical Blockers:</span>
                        <ul className="list-disc list-inside mt-1 text-slate-600">
                          {record.analysis.differentiated.customer_success.technical_blockers.map((b: string, i: number) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {record.analysis.differentiated.partner_follow_up && (
                <div className="p-4 bg-purple-50/40 rounded-xl border border-purple-200 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-600" />
                    Channel & Partner Dimensions
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-800">Partner Type:</span>{' '}
                      <span className="text-slate-600">{record.analysis.differentiated.partner_follow_up.partner_type}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">Commercial Model:</span>{' '}
                      <span className="text-slate-600">{record.analysis.differentiated.partner_follow_up.commercial_model}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">Referral Process:</span>{' '}
                      <span className="text-slate-600">{record.analysis.differentiated.partner_follow_up.referral_process}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">Next Steps:</span>{' '}
                      <span className="text-slate-600">{record.analysis.differentiated.partner_follow_up.next_steps}</span>
                    </div>
                  </div>
                </div>
              )}

              {record.analysis.differentiated.internal_vendor && (
                <div className="p-4 bg-slate-100 rounded-xl border border-slate-300 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Internal Operations / Vendor Dimensions
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-800">Interaction Type:</span>{' '}
                      <span className="text-slate-600 uppercase font-mono">{record.analysis.differentiated.internal_vendor.interaction_type}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">Tool / Vendor:</span>{' '}
                      <span className="text-slate-600">{record.analysis.differentiated.internal_vendor.supplier_or_tool}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">Pricing / Terms:</span>{' '}
                      <span className="text-slate-600">{record.analysis.differentiated.internal_vendor.pricing_model}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">Commitments:</span>{' '}
                      <span className="text-slate-600">{record.analysis.differentiated.internal_vendor.operational_commitments}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: RAW SOURCE METADATA */}
          {activeTab === 'source_meta' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                <strong>Data Contract Notice:</strong> The raw payload below contains the exact unadulterated source properties as received in Revision {record.applied_revision}. \`example.invalid\` URLs and \`PHONE-*\` tokens are anonymized testing fixtures, not operational links.
              </div>

              <div className="bg-slate-900 rounded-xl p-4 text-emerald-400 font-mono text-xs overflow-x-auto shadow-inner">
                <pre>{JSON.stringify(record.source_type === 'call' ? record.call_payload : record.meeting_payload, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
