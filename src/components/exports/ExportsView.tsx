import React, { useState } from 'react';
import {
  Download,
  FolderTree,
  FileCheck2,
  FileCode,
  FileSpreadsheet,
  CheckCircle2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { UnifiedRecord } from '../../types/conversation';
import { createExportArchive, triggerDownload } from '../../services/exportService';
import { ExportManifest } from '../../types/export';

interface ExportsViewProps {
  records: UnifiedRecord[];
  onShowToast: (toast: any) => void;
}

export const ExportsView: React.FC<ExportsViewProps> = ({ records, onShowToast }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [lastManifest, setLastManifest] = useState<ExportManifest | null>(null);
  const [activePreview, setActivePreview] = useState<'manifest_json' | 'manifest_csv' | 'folder_tree'>('folder_tree');

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { zipBlob, filename, manifest, fileCount } = await createExportArchive(records);
      setLastManifest(manifest);
      triggerDownload(zipBlob, filename);
      onShowToast({
        id: `export-${Date.now()}`,
        type: 'success',
        title: 'Export Generated Successfully',
        message: `Created ${filename} containing ${fileCount} verified files across all active routes.`,
      });
    } catch (err: any) {
      onShowToast({
        id: `export-err-${Date.now()}`,
        type: 'error',
        title: 'Export Failed',
        message: err.message || 'An error occurred during ZIP creation.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-150">
      {/* Export Action Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded border border-emerald-200">
              Deterministic Packaging Engine
            </span>
            <span className="text-xs text-slate-500 font-medium">JSZip Offline Generator</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Download Revenue Intelligence Export Archive
          </h2>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            Exports all active routed outputs, the 21 August manager brief, raw source payloads, and verifiable machine-readable manifests (<code className="font-mono bg-slate-100 px-1">manifest.json</code> and <code className="font-mono bg-slate-100 px-1">manifest.csv</code>) matching Section 11 of the assignment specification.
          </p>
        </div>

        <button
          onClick={handleExport}
          disabled={isExporting || records.length === 0}
          className="px-5 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 rounded-xl shadow-md transition-all flex items-center gap-2.5 shrink-0"
        >
          {isExporting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Compressing ZIP...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Generate &amp; Download ZIP
            </>
          )}
        </button>
      </div>

      {/* Specifications Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Relative Paths Only
          </div>
          <p className="text-slate-500 leading-relaxed">
            All manifest paths use relative roots (<code className="font-mono text-[11px]">export/...</code>) without machine-specific absolute folder paths.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Every Output Exists
          </div>
          <p className="text-slate-500 leading-relaxed">
            100% of listed manifest file destinations are generated and validated within the ZIP before archive packaging.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Multi-Route Linking
          </div>
          <p className="text-slate-500 leading-relaxed">
            Conversations with multiple routes output to each relevant destination folder, referencing the identical source record identity.
          </p>
        </div>
      </div>

      {/* Output Structure & Manifest Previews */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Preview Tabs */}
        <div className="px-6 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePreview('folder_tree')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activePreview === 'folder_tree'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              Folder Structure View
            </button>
            <button
              onClick={() => setActivePreview('manifest_json')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activePreview === 'manifest_json'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              manifest.json Preview
            </button>
            <button
              onClick={() => setActivePreview('manifest_csv')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activePreview === 'manifest_csv'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              manifest.csv Preview
            </button>
          </div>

          <span className="text-[11px] font-semibold text-slate-500">
            Active Records to Package: <strong className="text-slate-900">{records.length}</strong>
          </span>
        </div>

        {/* Tab 1: Folder Tree View */}
        {activePreview === 'folder_tree' && (
          <div className="p-6 font-mono text-xs text-slate-700 space-y-2 bg-slate-900 text-emerald-400 overflow-x-auto">
            <div>export/</div>
            <div>├── manifest.json <span className="text-slate-400 font-sans text-[11px]">// Complete schema of all outputs &amp; revisions</span></div>
            <div>├── manifest.csv <span className="text-slate-400 font-sans text-[11px]">// CSV format manifest</span></div>
            <div>├── manager_brief/</div>
            <div>│   └── 2026-08-21.md <span className="text-slate-400 font-sans text-[11px]">// Executive manager brief</span></div>
            <div>├── sales_coaching/ <span className="text-slate-400 font-sans text-[11px]">// C01, C06, C10, M03 coaching dossiers</span></div>
            <div>│   ├── C01_sales_coaching.md</div>
            <div>│   ├── C06_sales_coaching.md</div>
            <div>│   └── C10_sales_coaching.md</div>
            <div>├── deal_follow_up/ <span className="text-slate-400 font-sans text-[11px]">// C03, C04, C05, C08, C09, M03, M06 dossiers</span></div>
            <div>│   ├── C03_deal_follow_up.md</div>
            <div>│   ├── C08_deal_follow_up.md</div>
            <div>│   ├── M03_deal_follow_up.md</div>
            <div>│   └── M06_deal_follow_up.md</div>
            <div>├── customer_success/ <span className="text-slate-400 font-sans text-[11px]">// M04 (Cedarwave), M07 (Willowfield bugs), M09</span></div>
            <div>│   ├── M04_customer_success.md</div>
            <div>│   ├── M07_customer_success.md</div>
            <div>│   └── M09_customer_success.md</div>
            <div>├── partner_follow_up/ <span className="text-slate-400 font-sans text-[11px]">// C07 (Willowbank), M01 (Harborpath agreement)</span></div>
            <div>│   ├── C07_partner_follow_up.md</div>
            <div>│   └── M01_partner_follow_up.md</div>
            <div>├── internal_vendor/ <span className="text-slate-400 font-sans text-[11px]">// M02 (LedgerBridge e-invoicing), M10 (training)</span></div>
            <div>│   ├── M02_internal_vendor.md</div>
            <div>│   └── M10_internal_vendor.md</div>
            <div>├── manual_review/ <span className="text-slate-400 font-sans text-[11px]">// 26 unclassified / no-speech records (B01-B20, etc.)</span></div>
            <div>└── source_records/ <span className="text-slate-400 font-sans text-[11px]">// Raw unadulterated JSON payloads</span></div>
            <div>    ├── calls/ (30 JSON files)</div>
            <div>    └── meetings/ (14 JSON files)</div>
          </div>
        )}

        {/* Tab 2: manifest.json Preview */}
        {activePreview === 'manifest_json' && (
          <div className="p-6 font-mono text-xs bg-slate-900 text-emerald-400 overflow-x-auto max-h-96">
            <pre>
              {JSON.stringify(
                {
                  generated_at: new Date().toISOString(),
                  export_scope: 'all_routed',
                  sample_manifest_records: records.slice(0, 5).map((r) => ({
                    source_type: r.source_type,
                    source_id: r.source_id,
                    record_ref: r.record_ref,
                    applied_revision: r.applied_revision,
                    routes: r.manual_override && r.manual_routes ? r.manual_routes : r.suggested_routes,
                    output_paths: [
                      `export/${r.primary_suggested_route}/${r.record_ref}_${r.primary_suggested_route}.md`,
                      `export/source_records/${r.source_type}s/${r.record_ref}_${r.source_id.slice(0, 8)}.json`,
                    ],
                    processing_state: r.processing_state,
                    review_state: r.review_state,
                    manual_override: r.manual_override,
                    analysis_revision: r.analysis_revision,
                    analysis_stale: r.analysis_stale,
                  })),
                  total_records: records.length,
                },
                null,
                2
              )}
            </pre>
          </div>
        )}

        {/* Tab 3: manifest.csv Preview */}
        {activePreview === 'manifest_csv' && (
          <div className="p-6 font-mono text-xs bg-slate-900 text-slate-200 overflow-x-auto max-h-96">
            <div className="text-emerald-400 font-bold mb-2">
              source_type,source_id,record_ref,applied_revision,routes,output_paths,processing_state,review_state,manual_override,analysis_revision,analysis_stale
            </div>
            {records.slice(0, 8).map((r) => (
              <div key={r.source_id} className="whitespace-pre">
                {r.source_type},{r.source_id.slice(0, 8)}...,{r.record_ref},{r.applied_revision},
                &quot;{r.suggested_routes.join(';')}&quot;,&quot;export/{r.primary_suggested_route}/{r.record_ref}.md&quot;,
                {r.processing_state},{r.review_state},{String(r.manual_override)},{r.analysis_revision},{String(r.analysis_stale)}
              </div>
            ))}
            <div className="text-slate-500 italic mt-2">... and {records.length - 8} more rows</div>
          </div>
        )}
      </div>
    </div>
  );
};
