import React from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Calendar,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { UnifiedRecord } from '../../types/conversation';
import { RouteBadge } from '../common/Badge';

interface ManagerBriefViewProps {
  records: UnifiedRecord[];
  onOpenRecord: (record: UnifiedRecord) => void;
}

export const ManagerBriefView: React.FC<ManagerBriefViewProps> = ({
  records,
  onOpenRecord,
}) => {
  const openByRef = (ref: string) => {
    const found = records.find((r) => r.record_ref === ref);
    if (found) onOpenRecord(found);
  };

  const usableCount = records.filter((r) => r.has_usable_transcript).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-2 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded border border-indigo-200">
              Executive Briefing
            </span>
            <span className="text-xs text-slate-500 font-medium">Asia/Kolkata (21 August 2026)</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
            Revenue Intelligence Manager Brief
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Synthesizing all 18 adapted conversations across sales coaching, customer retention, partnership growth, and bug triage.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-900">{usableCount} Conversations Covered</div>
            <div className="text-[11px] text-slate-400">Post-update delivery state</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Methodological Boundary Callout */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800">Analytical Boundary:</strong> This briefing derives strictly from the 44 adapted source interactions in this assessment extract. It is a selected interaction sample for workflow and systems evaluation, NOT a whole-team census. We deliberately refrain from cross-rep performance rankings, quotas, or pipeline value claims that the source records do not support.
        </div>
      </div>

      {/* Section 1: Three Key Evidence-Backed Findings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Three Critical Evidence-Backed Findings
          </h3>
          <span className="text-xs text-slate-400 font-medium">Verified against source turns</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Finding 1 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h4 className="font-bold text-sm text-slate-900">
                  Telephony Switch &quot;Connected&quot; Status Conflicts with Substantive Reality
                </h4>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => openByRef('B11')}
                  className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                >
                  B11
                </button>
                <button
                  onClick={() => openByRef('B14')}
                  className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                >
                  B14
                </button>
                <button
                  onClick={() => openByRef('C04')}
                  className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                >
                  C04
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
              <div>
                <strong className="text-slate-900">What Was Observed:</strong> Upstream phone switch marked 11 of 30 calls as connected. However, B11 and B14 were single-speaker unresponsive calls with zero speech (<code className="font-mono bg-slate-100 px-1">is_conversation: false</code>). Conversely, C04 was tagged as not connected (<code className="font-mono bg-slate-100 px-1">is_connected: false</code>) despite rep Arun delivering a comprehensive 95-second voicemail.
              </div>
              <div>
                <strong className="text-slate-900">Why It Matters:</strong> Rewarding SDRs or measuring conversion on telephone switch flags falsely inflates ghost connections while ignoring actual voicemail pipeline outreach.
              </div>
            </div>

            <blockquote className="text-xs italic bg-slate-50 border-l-2 border-indigo-500 p-2.5 rounded-r text-slate-700">
              &ldquo;My understanding is that our information first went to the wrong email address... Please call me back to let me know where things stand.&rdquo;
              <span className="block mt-1 font-mono text-[10px] text-slate-400 not-italic">
                — Call C04 adapted text (Tagged is_connected: false by switch)
              </span>
            </blockquote>

            <div className="text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <span>
                <strong>System Rule Influenced:</strong> Overview Dashboard isolates switch connection metrics with explicit denominator tooltips.
              </span>
              <span className="text-amber-700 font-medium">
                Uncertain: Telephony carrier IVR pickup heuristics.
              </span>
            </div>
          </div>

          {/* Finding 2 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h4 className="font-bold text-sm text-slate-900">
                  Prepaid-Only Domestic Cards Create Severe Adoption Friction & Churn Threat
                </h4>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => openByRef('M03')}
                  className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                >
                  M03
                </button>
                <button
                  onClick={() => openByRef('M04')}
                  className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                >
                  M04
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
              <div>
                <strong className="text-slate-900">What Was Observed:</strong> Both Asterloom (M03) and Cedarwave (M04) expressed surprise and resistance toward prepaid cards. Cedarwave explicitly warned they would leave SpendNest unless corporate credit is supported.
              </div>
              <div>
                <strong className="text-slate-900">Why It Matters:</strong> Forcing mid-market clients with existing bank credit lines (Cedarwave has INR 1.3 crore) into advance prepaid deposits creates immediate deal failure and account churn.
              </div>
            </div>

            <blockquote className="text-xs italic bg-slate-50 border-l-2 border-indigo-500 p-2.5 rounded-r text-slate-700">
              &ldquo;Okay, I have confirmed it: moving from prepaid to credit is the main issue for us. At some stage we will have to consider another option for that.&rdquo;
              <span className="block mt-1 font-mono text-[10px] text-slate-400 not-italic">
                — Meeting M04 Turn 11 (00:07:17)
              </span>
            </blockquote>

            <div className="text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <span>
                <strong>System Rule Influenced:</strong> M04 routed to Customer Success with high-churn retention workflow; M03 AE notes require CFO credit explanation.
              </span>
              <span className="text-amber-700 font-medium">
                Uncertain: Bank partner transaction feed certification timeline.
              </span>
            </div>
          </div>

          {/* Finding 3 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h4 className="font-bold text-sm text-slate-900">
                  Critical UI Form Caching Defects Threaten Financial Settlement Integrity
                </h4>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => openByRef('M07')}
                  className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                >
                  M07
                </button>
                <button
                  onClick={() => openByRef('M09')}
                  className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                >
                  M09
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
              <div>
                <strong className="text-slate-900">What Was Observed:</strong> Willowfield demonstrated that &quot;Mark as Paid&quot; retains the previous item&apos;s amount (INR 18,200) instead of fetching the next record (M07 Turn 23). In M09, fresh password reset links expired instantly upon delivery.
              </div>
              <div>
                <strong className="text-slate-900">Why It Matters:</strong> Caching previous financial values in transaction forms risks accounting misattribution and duplicate payouts.
              </div>
            </div>

            <blockquote className="text-xs italic bg-slate-50 border-l-2 border-indigo-500 p-2.5 rounded-r text-slate-700">
              &ldquo;The amount from the previous item appears in the next one. Each time I have to cancel, leave it and open Mark as paid again before it shows the right information.&rdquo;
              <span className="block mt-1 font-mono text-[10px] text-slate-400 not-italic">
                — Meeting M07 Turn 22 (00:17:33)
              </span>
            </blockquote>

            <div className="text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <span>
                <strong>System Rule Influenced:</strong> M07 classified as high-priority Bug Triage with 2-hour SLA tracker in Customer Success.
              </span>
              <span className="text-amber-700 font-medium">
                Uncertain: Frontend React state vs backend session caching root cause.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Account Priorities & Follow-Up Map */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Practical Account Follow-Up Priorities
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => openByRef('M07')}
            className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 hover:bg-rose-50/60 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-xs font-bold text-rose-800">M07 • Willowfield Trust</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                P0 Urgent
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900">Resolve 4 Software Defects</div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Engineering tickets needed for description save failure, Recreate Payment upload bug, stuck reimbursements, and Mark as Paid stale cache. Update customer in 2 hours.
            </p>
            <div className="mt-2 text-[11px] font-semibold text-rose-700 flex items-center gap-1 group-hover:underline">
              Inspect M07 Transcript <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          <div
            onClick={() => openByRef('M04')}
            className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 hover:bg-amber-50/60 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-xs font-bold text-amber-800">M04 • Cedarwave Distribution</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                P1 High
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900">Prevent Account Churn via Bank Feed</div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Verify if SpendNest can connect Cedarwave&apos;s existing INR 1.3 crore bank credit line as a software layer before physical card network terminates.
            </p>
            <div className="mt-2 text-[11px] font-semibold text-amber-700 flex items-center gap-1 group-hover:underline">
              Inspect M04 Transcript <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          <div
            onClick={() => openByRef('M03')}
            className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 hover:bg-blue-50/60 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-xs font-bold text-blue-800">M03 • Asterloom Systems</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                P1 High
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900">Deliver Itemized CFO Proposal</div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Send formal proposal explicitly separating recurring annual subscription (INR 26k) from one-time accounting setup (INR 13k) for CFO review.
            </p>
            <div className="mt-2 text-[11px] font-semibold text-blue-700 flex items-center gap-1 group-hover:underline">
              Inspect M03 Transcript <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          <div
            onClick={() => openByRef('M01')}
            className="p-4 rounded-xl border border-purple-200 bg-purple-50/30 hover:bg-purple-50/60 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-xs font-bold text-purple-800">M01 • Harborpath Advisory</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                P1 High
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900">Execute Partner Memorandum & Link</div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Deliver partner agreement memorandum and issue unique tracking link with shared commission tracking sheet (USD 260 activation + spend bonuses).
            </p>
            <div className="mt-2 text-[11px] font-semibold text-purple-700 flex items-center gap-1 group-hover:underline">
              Inspect M01 Transcript <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Coaching & Ambiguous Cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Coaching */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Practical Coaching Takeaways
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <strong className="text-slate-900 block mb-0.5">Arun (C01): Cold Outreach Permission</strong>
              Pitched generic automation to Pranav before qualifying, causing defensive reaction. Coach on opening with permission-based positioning.
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <strong className="text-slate-900 block mb-0.5">Meera (C06 & C10): Boundary Recognition</strong>
              Pushed for scheduled callbacks when prospects indicated existing tools or requested asynchronous review. Train rep on respecting customer boundaries.
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <strong className="text-slate-900 block mb-0.5">Kiran (C03): Calm Technical Recovery</strong>
              Excellent composure when prospect faced mobile roaming issues. Model example of adapting to prospect line trouble without losing trust.
            </div>
          </div>
        </div>

        {/* Ambiguous Cases */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Ambiguous Cases Requiring Human Judgment
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <strong className="text-slate-900 block mb-0.5">C05: StoreHarbor Presentation Request</strong>
              Prospect agreed to receive presentation: &ldquo;If we ever decide to change providers...&rdquo; This is an informational brush-off, NOT active purchase intent.
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <strong className="text-slate-900 block mb-0.5">C09: Vedant Referral to Rishabh</strong>
              Vedant pointed rep to Business Head Rishabh but explicitly forbade using his name: &ldquo;No, please don&apos;t use my name.&rdquo; Must conduct independent cold outreach.
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <strong className="text-slate-900 block mb-0.5">M02: LedgerBridge Timeline Slip</strong>
              LedgerBridge e-invoicing vendor target is Q4, but product lead noted Q1 is likely. Do not peg receivables marketing commitments to Q4 without engineering confirmation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
