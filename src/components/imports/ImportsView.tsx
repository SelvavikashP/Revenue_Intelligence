import React, { useState } from 'react';
import {
  History,
  Upload,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { ImportBatchLog } from '../../types/envelope';
import { loadInitialBatchOnly, loadUpdateBatchOnly } from '../../services/demoService';
import { processEnvelopeImport, validateEnvelope } from '../../services/importService';

interface ImportsViewProps {
  history: ImportBatchLog[];
  onRefreshData: () => void;
  onShowToast: (toast: any) => void;
}

export const ImportsView: React.FC<ImportsViewProps> = ({
  history,
  onRefreshData,
  onShowToast,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleRunInitial = async () => {
    setIsProcessing(true);
    try {
      const res = await loadInitialBatchOnly();
      onRefreshData();
      onShowToast({
        id: `import-${Date.now()}`,
        type: 'success',
        title: `Batch ${res.batch_id} (Rev ${res.revision}) Processed`,
        message: `Inserted: ${res.inserted}, Updated: ${res.updated}, Ignored: ${res.ignored}. Total records: ${res.total_unique_records_after_import}.`,
      });
    } catch (err: any) {
      onShowToast({
        id: `import-err-${Date.now()}`,
        type: 'error',
        title: 'Import Failed',
        message: err.message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRunUpdate = async () => {
    setIsProcessing(true);
    try {
      const res = await loadUpdateBatchOnly();
      onRefreshData();
      onShowToast({
        id: `import-${Date.now()}`,
        type: 'success',
        title: `Batch ${res.batch_id} (Rev ${res.revision}) Applied`,
        message: `M07 updated with late transcript! Inserted: ${res.inserted}, Updated: ${res.updated}, Ignored: ${res.ignored}. Usable texts: ${res.usable_transcripts_after_import}.`,
      });
    } catch (err: any) {
      onShowToast({
        id: `import-err-${Date.now()}`,
        type: 'error',
        title: 'Update Import Failed',
        message: err.message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = JSON.parse(text);
        const { valid, errors, envelope } = validateEnvelope(parsed);
        if (!valid || !envelope) {
          setUploadError(`Validation failed: ${errors.join(', ')}`);
          return;
        }

        const res = await processEnvelopeImport(envelope);
        onRefreshData();
        onShowToast({
          id: `custom-import-${Date.now()}`,
          type: 'success',
          title: `Custom Batch ${res.batch_id} Imported`,
          message: `Inserted: ${res.inserted}, Updated: ${res.updated}, Ignored: ${res.ignored}.`,
        });
      } catch (err: any) {
        setUploadError(`File parsing failed: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            Import Engine &amp; Replay History
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Idempotent batch ingestion, revision conflict resolution, and immutable audit logs.
          </p>
        </div>

        {/* Quick Batch Runner Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRunInitial}
            disabled={isProcessing}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5"
            title="Import or re-import data/01_initial.json (Revision 1)"
          >
            <Play className="w-3.5 h-3.5 fill-current text-indigo-600" />
            Import 01_initial.json (Rev 1)
          </button>

          <button
            onClick={handleRunUpdate}
            disabled={isProcessing}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            title="Apply data/02_update.json (Revision 2 - Late M07 transcript)"
          >
            <Layers className="w-3.5 h-3.5" />
            Apply 02_update.json (Rev 2)
          </button>
        </div>
      </div>

      {/* M07 Acceptance Workflow Guide */}
      <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-indigo-600" />
          Mandatory Section 8: M07 Late-Transcript &amp; Manual-Override Verification Steps
        </h3>
        <p className="text-xs text-indigo-800 leading-relaxed">
          The test contract requires verifying that a user-managed routing override on M07 survives the update delivery, that M07 receives its late 27-turn transcript without duplicate record creation, and that reimporting Revision 1 does not roll back the newer revision:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs pt-1">
          <div className="p-3 bg-white rounded-lg border border-indigo-100">
            <span className="font-bold text-indigo-900 block mb-0.5">1. Initial Import</span>
            <span className="text-slate-600">44 unique records, 17 usable transcripts. M07 has no text.</span>
          </div>
          <div className="p-3 bg-white rounded-lg border border-indigo-100">
            <span className="font-bold text-indigo-900 block mb-0.5">2. Set M07 Override</span>
            <span className="text-slate-600">Change M07 route in Routing &amp; Review and click Save.</span>
          </div>
          <div className="p-3 bg-white rounded-lg border border-indigo-100">
            <span className="font-bold text-indigo-900 block mb-0.5">3. Apply 02_update</span>
            <span className="text-slate-600">M07 gets 27 turns. Manual route preserved; analysis marked stale.</span>
          </div>
          <div className="p-3 bg-white rounded-lg border border-indigo-100">
            <span className="font-bold text-indigo-900 block mb-0.5">4. Repeat Initial</span>
            <span className="text-slate-600">Import Rev 1 again. Record count stays 44; M07 stays at Rev 2.</span>
          </div>
        </div>
      </div>

      {/* Custom JSON File Upload */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <Upload className="w-4 h-4 text-slate-500" />
          Import External Delivery Envelope (.json)
        </h3>
        <p className="text-xs text-slate-500">
          Upload any JSON delivery envelope matching the assessment envelope schema. The engine checks revision ordering and validates <code className="font-mono">(source_type, source_id)</code> identity.
        </p>

        <div className="flex items-center gap-3">
          <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors">
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            Select JSON File...
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
          {uploadError && (
            <span className="text-xs text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {uploadError}
            </span>
          )}
        </div>
      </div>

      {/* History Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Import History Log ({history.length} operations)
          </h3>
          <span className="text-[11px] text-slate-400">Stored in IndexedDB import_history</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3.5">Batch ID</th>
                <th className="py-2.5 px-3.5 text-center">Revision</th>
                <th className="py-2.5 px-3.5">Imported At</th>
                <th className="py-2.5 px-3.5 text-right">In Batch</th>
                <th className="py-2.5 px-3.5 text-right">Inserted</th>
                <th className="py-2.5 px-3.5 text-right">Updated</th>
                <th className="py-2.5 px-3.5 text-right">Ignored</th>
                <th className="py-2.5 px-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No import runs recorded yet. Click &ldquo;Demo Load&rdquo; or &ldquo;Import 01_initial.json&rdquo; above.
                  </td>
                </tr>
              ) : (
                history
                  .slice()
                  .reverse()
                  .map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3.5 font-mono font-bold text-slate-900">
                        {log.batch_id}
                      </td>
                      <td className="py-2.5 px-3.5 text-center">
                        <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded font-bold">
                          Rev {log.revision}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-500 font-mono text-[11px]">
                        {log.imported_at.slice(0, 19).replace('T', ' ')}
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-medium text-slate-800">
                        {log.total_records_in_batch}
                      </td>
                      <td className="py-2.5 px-3.5 text-right text-emerald-700 font-semibold">
                        +{log.inserted_records}
                      </td>
                      <td className="py-2.5 px-3.5 text-right text-indigo-700 font-semibold">
                        {log.updated_records > 0 ? `~${log.updated_records}` : '0'}
                      </td>
                      <td className="py-2.5 px-3.5 text-right text-slate-400 font-medium">
                        {log.ignored_records}
                      </td>
                      <td className="py-2.5 px-3.5 text-center">
                        {log.errors.length === 0 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Success
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Errors ({log.errors.length})
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
