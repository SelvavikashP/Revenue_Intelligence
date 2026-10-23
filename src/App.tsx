import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { OverviewView } from './components/overview/OverviewView';
import { InboxView } from './components/inbox/InboxView';
import { ConversationDrawer } from './components/inbox/ConversationDrawer';
import { ManagerBriefView } from './components/brief/ManagerBriefView';
import { RoutingReviewView } from './components/routing/RoutingReviewView';
import { ExportsView } from './components/exports/ExportsView';
import { ImportsView } from './components/imports/ImportsView';
import { SettingsView } from './components/settings/SettingsView';
import { Modal } from './components/common/Modal';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { UnifiedRecord, ReviewState } from './types/conversation';
import { RouteCategory } from './types/routing';
import { ImportBatchLog } from './types/envelope';
import {
  getAllRecords,
  getImportHistory,
  clearAllDatabase,
} from './services/db';
import {
  loadFullDemoState,
  applyManualRouteOverride,
  resetRouteToSuggestion,
  refreshStaleAnalysis,
} from './services/demoService';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [records, setRecords] = useState<UnifiedRecord[]>([]);
  const [importHistory, setImportHistory] = useState<ImportBatchLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDrawerRecord, setSelectedDrawerRecord] = useState<UnifiedRecord | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'> & { id?: string }) => {
    const id = toast.id || `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Refresh records and history from IndexedDB
  const refreshData = useCallback(async () => {
    try {
      const all = await getAllRecords();
      const history = await getImportHistory();
      setRecords(all);
      setImportHistory(history);

      // If drawer is currently open, refresh the open record reference
      if (selectedDrawerRecord) {
        const updated = all.find(
          (r) =>
            r.source_type === selectedDrawerRecord.source_type &&
            r.source_id === selectedDrawerRecord.source_id
        );
        if (updated) setSelectedDrawerRecord(updated);
      }
    } catch (err: any) {
      console.error('Error loading data from IndexedDB:', err);
      showToast({
        type: 'error',
        title: 'Database Load Error',
        message: err.message || 'Failed to read records from browser IndexedDB.',
      });
    }
  }, [selectedDrawerRecord, showToast]);

  // Initial load: if DB empty, load demo state so app opens directly in post-update state!
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const existing = await getAllRecords();
        if (existing.length === 0) {
          // Automatic demo load into final post-update state
          await loadFullDemoState();
        }
        await refreshData();
      } catch (err: any) {
        console.error('Init error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  // Demo Load handler (re-imports both batches)
  const handleDemoLoad = async () => {
    try {
      setIsLoading(true);
      const { initial, update } = await loadFullDemoState();
      await refreshData();
      showToast({
        type: 'success',
        title: 'Demo State Loaded',
        message: `Applied ${initial.batch_id} (Rev 1) and ${update.batch_id} (Rev 2). Loaded 44 unique records with 18 usable transcripts.`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Demo Load Failed',
        message: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clean Reset handler
  const handleResetConfirm = async () => {
    try {
      await clearAllDatabase();
      await refreshData();
      setIsResetModalOpen(false);
      setSelectedDrawerRecord(null);
      showToast({
        type: 'info',
        title: 'Clean Start Initialized',
        message: 'All records, user overrides, and import logs have been cleared from IndexedDB.',
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Reset Failed',
        message: err.message,
      });
    }
  };

  // Manual Override save handler
  const handleSaveOverride = async (
    record: UnifiedRecord,
    primaryRoute: RouteCategory,
    additionalRoutes: RouteCategory[],
    notes: string,
    reviewState: ReviewState
  ) => {
    try {
      const updated = await applyManualRouteOverride(
        record,
        primaryRoute,
        additionalRoutes,
        notes,
        reviewState
      );
      await refreshData();
      setSelectedDrawerRecord(updated);
      showToast({
        type: 'success',
        title: `Manual Route Saved for ${record.record_ref}`,
        message: `Assigned primary route: ${primaryRoute}. Override will persist across all future source updates.`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Save Override Failed',
        message: err.message,
      });
    }
  };

  // Reset to suggestion handler
  const handleResetToSuggestion = async (record: UnifiedRecord) => {
    try {
      const updated = await resetRouteToSuggestion(record);
      await refreshData();
      setSelectedDrawerRecord(updated);
      showToast({
        type: 'info',
        title: `Reset to Suggestion for ${record.record_ref}`,
        message: `Reverted to machine-suggested route (${record.primary_suggested_route}).`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Reset Route Failed',
        message: err.message,
      });
    }
  };

  // Refresh stale analysis handler
  const handleRefreshAnalysis = async (record: UnifiedRecord) => {
    try {
      const updated = await refreshStaleAnalysis(record);
      await refreshData();
      setSelectedDrawerRecord(updated);
      showToast({
        type: 'success',
        title: `Analysis Refreshed for ${record.record_ref}`,
        message: `Analysis marked fresh for current source revision ${record.applied_revision}.`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Refresh Analysis Failed',
        message: err.message,
      });
    }
  };

  // Calculated high-level counts
  const totalRecords = records.length;
  const usableCount = records.filter((r) => r.has_usable_transcript).length;
  const reviewCount = records.filter(
    (r) =>
      r.review_state === 'pending_review' ||
      r.review_state === 'analysis_stale' ||
      r.review_state === 'needs_more_info'
  ).length;
  const manualOverrideCount = records.filter((r) => r.manual_override).length;
  const staleCount = records.filter((r) => r.analysis_stale).length;
  const appliedRevisions = Array.from(new Set(records.map((r) => r.applied_revision)));

  const tabTitles: Record<ActiveTab, { title: string; subtitle: string }> = {
    overview: {
      title: 'Revenue Intelligence Overview',
      subtitle: 'Executive KPIs, verified denominators, telephony connect rates, and high-priority action items.',
    },
    inbox: {
      title: 'Conversation Inbox Workspace',
      subtitle: 'Searchable directory of 44 source interactions with transcript coverage and routing statuses.',
    },
    brief: {
      title: 'Manager Brief — 21 August 2026',
      subtitle: 'Evidence-backed review across all 18 conversations post-update with three key findings.',
    },
    routing: {
      title: 'Routing & Quality Review Workspace',
      subtitle: 'Evaluate automated suggestions against human decisions. Preserves all overrides across deliveries.',
    },
    exports: {
      title: 'Export Archive Generator',
      subtitle: 'Package verifiable output files, manifests (JSON/CSV), and manager briefs into a downloadable ZIP.',
    },
    imports: {
      title: 'Import Engine & Delivery History',
      subtitle: 'Replay deliveries, inspect audit logs, and execute the M07 late-transcript acceptance test.',
    },
    settings: {
      title: 'Data Dictionary & Taxonomy Glossary',
      subtitle: 'Authoritative field definitions, formula explanations, and data contract constraints.',
    },
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* Fixed Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        reviewCount={reviewCount}
        totalRecords={totalRecords}
        usableCount={usableCount}
        manualOverrideCount={manualOverrideCount}
        staleCount={staleCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <Topbar
          title={tabTitles[activeTab].title}
          subtitle={tabTitles[activeTab].subtitle}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (activeTab !== 'inbox' && q.trim()) {
              setActiveTab('inbox');
            }
          }}
          onDemoLoad={handleDemoLoad}
          onResetClick={() => setIsResetModalOpen(true)}
          appliedRevisions={appliedRevisions}
          totalRecords={totalRecords}
          usableTranscripts={usableCount}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-slate-400 gap-2">
              <span className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">Syncing IndexedDB...</span>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <OverviewView
                  records={records}
                  onOpenRecord={(r) => setSelectedDrawerRecord(r)}
                  onNavigateToInboxWithFilter={() => setActiveTab('inbox')}
                />
              )}

              {activeTab === 'inbox' && (
                <InboxView
                  records={records}
                  onOpenRecord={(r) => setSelectedDrawerRecord(r)}
                  initialSearchQuery={searchQuery}
                />
              )}

              {activeTab === 'brief' && (
                <ManagerBriefView
                  records={records}
                  onOpenRecord={(r) => setSelectedDrawerRecord(r)}
                />
              )}

              {activeTab === 'routing' && (
                <RoutingReviewView
                  records={records}
                  onOpenRecord={(r) => setSelectedDrawerRecord(r)}
                  onSaveOverride={handleSaveOverride}
                  onResetToSuggestion={handleResetToSuggestion}
                  onRefreshAnalysis={handleRefreshAnalysis}
                />
              )}

              {activeTab === 'exports' && (
                <ExportsView records={records} onShowToast={showToast} />
              )}

              {activeTab === 'imports' && (
                <ImportsView
                  history={importHistory}
                  onRefreshData={refreshData}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'settings' && <SettingsView />}
            </>
          )}
        </main>
      </div>

      {/* Conversation Detail Slide-over Drawer */}
      <ConversationDrawer
        record={selectedDrawerRecord}
        onClose={() => setSelectedDrawerRecord(null)}
        onSaveOverride={handleSaveOverride}
        onResetToSuggestion={handleResetToSuggestion}
        onRefreshAnalysis={handleRefreshAnalysis}
      />

      {/* Clean Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Confirm Clean Start / Database Reset"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900 leading-relaxed">
              <strong>Warning:</strong> This will delete all 44 records, manual routing decisions, notes, and import logs from browser IndexedDB. You can reload the dataset anytime using &ldquo;Demo Load&rdquo; or importing batches manually.
            </div>
          </div>
          <p className="text-xs text-slate-600">
            Are you sure you want to initialize a clean-start state?
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsResetModalOpen(false)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleResetConfirm}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Confirm Reset
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
