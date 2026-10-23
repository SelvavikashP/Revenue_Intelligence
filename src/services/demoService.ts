import { INITIAL_DELIVERY } from '../data/rawInitial';
import { UPDATE_DELIVERY } from '../data/rawUpdate';
import { processEnvelopeImport, ImportResult } from './importService';
import { clearAllDatabase, getAllRecords, putRecord, saveUserOverride, getRecordKey } from './db';
import { UnifiedRecord } from '../types/conversation';
import { RouteCategory } from '../types/routing';
import { ReviewState } from '../types/conversation';

export async function loadInitialBatchOnly(): Promise<ImportResult> {
  return processEnvelopeImport(INITIAL_DELIVERY);
}

export async function loadUpdateBatchOnly(): Promise<ImportResult> {
  return processEnvelopeImport(UPDATE_DELIVERY);
}

export async function loadFullDemoState(): Promise<{ initial: ImportResult; update: ImportResult }> {
  const initial = await processEnvelopeImport(INITIAL_DELIVERY);
  const update = await processEnvelopeImport(UPDATE_DELIVERY);
  return { initial, update };
}

export async function cleanResetAll(): Promise<void> {
  await clearAllDatabase();
}

export async function applyManualRouteOverride(
  record: UnifiedRecord,
  newPrimaryRoute: RouteCategory,
  additionalRoutes: RouteCategory[] = [],
  notes = '',
  reviewState: ReviewState = 'reviewed'
): Promise<UnifiedRecord> {
  const combinedRoutes = Array.from(new Set([newPrimaryRoute, ...additionalRoutes]));

  const updatedRecord: UnifiedRecord = {
    ...record,
    manual_override: true,
    primary_manual_route: newPrimaryRoute,
    manual_routes: combinedRoutes,
    manager_notes: notes || record.manager_notes,
    review_state: reviewState,
    updated_at: new Date().toISOString(),
  };

  // Persist record in records store
  await putRecord(updatedRecord);

  // Also persist in user_overrides store
  await saveUserOverride({
    record_key: getRecordKey(record.source_type, record.source_id),
    source_type: record.source_type,
    source_id: record.source_id,
    manual_routes: combinedRoutes,
    primary_manual_route: newPrimaryRoute,
    manager_notes: notes || record.manager_notes,
    review_state: reviewState,
    updated_at: new Date().toISOString(),
  });

  return updatedRecord;
}

export async function resetRouteToSuggestion(record: UnifiedRecord): Promise<UnifiedRecord> {
  const updatedRecord: UnifiedRecord = {
    ...record,
    manual_override: false,
    manual_routes: null,
    primary_manual_route: null,
    review_state: record.has_usable_transcript ? 'reviewed' : 'no_usable_transcript',
    updated_at: new Date().toISOString(),
  };

  await putRecord(updatedRecord);
  return updatedRecord;
}

export async function refreshStaleAnalysis(record: UnifiedRecord): Promise<UnifiedRecord> {
  const updatedRecord: UnifiedRecord = {
    ...record,
    analysis_stale: false,
    review_state: record.manual_override ? 'reviewed' : 'pending_review',
    updated_at: new Date().toISOString(),
  };

  await putRecord(updatedRecord);
  return updatedRecord;
}
