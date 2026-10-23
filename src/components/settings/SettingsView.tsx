import React from 'react';
import { BookOpen, HelpCircle, CheckCircle2, ShieldAlert, Layers, Database } from 'lucide-react';
import { METRIC_DEFINITIONS } from '../../services/metricsCalculator';
import { ROUTE_TAXONOMY, RouteCategory } from '../../types/routing';

export const SettingsView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
            System Knowledge Base
          </span>
          <span className="text-xs text-slate-500 font-medium">Source: DATA_DICTIONARY.md &amp; DATA_CONTRACT.md</span>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
          Settings, Data Definitions &amp; Taxonomy Glossary
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Authoritative definitions, formula denominators, identity constraints, and business domain glossary for SpendNest Revenue Intelligence.
        </p>
      </div>

      {/* Section 1: Metric Formulas & Denominators Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" />
            Headline Metric Definitions &amp; Denominators
          </h3>
          <span className="text-[11px] font-semibold text-slate-500">Mathematical Formulations</span>
        </div>

        <div className="divide-y divide-slate-100">
          {Object.values(METRIC_DEFINITIONS).map((m) => (
            <div key={m.id} className="p-4 space-y-1.5 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">{m.label}</span>
                <code className="text-xs font-mono bg-slate-100 text-indigo-700 px-2 py-0.5 rounded">
                  {m.formula}
                </code>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
                <div>
                  <strong className="text-slate-700">Numerator:</strong> {m.numerator}
                </div>
                <div>
                  <strong className="text-slate-700">Denominator:</strong> {m.denominator}
                </div>
              </div>
              <div className="text-[11px] text-amber-800 bg-amber-50/60 p-2 rounded border border-amber-200/60 mt-1">
                ⚠️ <strong className="font-semibold">Caveat / Boundary:</strong> {m.caveat}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Routing Taxonomy Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            Routing Taxonomy Definitions &amp; Destination Policies
          </h3>
          <span className="text-[11px] font-semibold text-slate-500">6 Core Output Destinations</span>
        </div>

        <div className="divide-y divide-slate-100">
          {(Object.keys(ROUTE_TAXONOMY) as RouteCategory[]).map((cat) => {
            const meta = ROUTE_TAXONOMY[cat];
            return (
              <div key={cat} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{meta.label}</span>
                    <code className="text-[11px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {cat}
                    </code>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{meta.shortDescription}</p>
                </div>
                <div className="text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0">
                  export/{cat}/
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Data Contract & Import Rules */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Data Contract Rules (Source of Truth)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-semibold">1. Identity Definition</strong>
            Identity is strictly the tuple <code className="font-mono bg-white px-1">(source_type, source_id)</code>. Never key records by title, phone tokens, record_ref, or array positions.
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-semibold">2. Monotonic Revisions</strong>
            Initial revision is 1; update delivery is revision 2. Same or older revisions are ignored. Re-importing Revision 1 after Revision 2 never rolls back existing data.
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-semibold">3. Full Payload Replacement</strong>
            A newer revision replaces the entire source payload and transcript payload, including null fields. It is NOT a partial field merge.
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-semibold">4. Preserving Human Overrides</strong>
            User-managed routing decisions, review states, and notes are decoupled from source fields and strictly preserved when source records update.
          </div>
        </div>
      </div>

      {/* Section 4: SpendNest Business Glossary */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          SpendNest Business Terms &amp; Persona Glossary
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <strong className="text-slate-900 block font-semibold">SDR (Sales Dev Rep)</strong>
            Starts or qualifies outbound dials. Job titles not supplied for all callers; grouped by rep_name.
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <strong className="text-slate-900 block font-semibold">AE (Account Executive)</strong>
            Leads commercial demonstrations. Note: Meeting organisers are NOT automatically AEs or attendees.
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <strong className="text-slate-900 block font-semibold">CS (Customer Success)</strong>
            Manages existing accounts, migration transitions, and bug escalations (e.g. Cedarwave M04, Willowfield M07).
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <strong className="text-slate-900 block font-semibold">Prepaid vs. Credit</strong>
            Spending pre-deposited company funds vs. spending against a bank credit limit. Domestic SpendNest cards are prepaid.
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <strong className="text-slate-900 block font-semibold">AP / AR Automation</strong>
            Accounts Payable (paying suppliers) vs. Accounts Receivable (issuing invoices and collecting customer payments).
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <strong className="text-slate-900 block font-semibold">KYC / KYB Verification</strong>
            Know Your Customer / Business regulatory identity checks required before activating cards or wallets.
          </div>
        </div>
      </div>
    </div>
  );
};
