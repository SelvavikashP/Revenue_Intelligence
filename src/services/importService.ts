import { DeliveryEnvelope, EnvelopeRecord, ImportBatchLog } from '../types/envelope';
import { UnifiedRecord, ReviewState, ProcessingState } from '../types/conversation';
import {
  getAllRecords,
  putRecordsBatch,
  addImportHistory,
  getUserOverrides,
  getRecordKey,
} from './db';
import { determineRoutesAndAnalysis } from './routingEngine';

export interface ImportResult {
  batch_id: string;
  revision: number;
  exported_at: string;
  total_in_envelope: number;
  inserted: number;
  updated: number;
  ignored: number;
  errors: string[];
  total_unique_records_after_import: number;
  usable_transcripts_after_import: number;
}

export function validateEnvelope(data: any): { valid: boolean; errors: string[]; envelope?: DeliveryEnvelope } {
  const errors: string[] = [];
  if (!data || typeof data !== 'object') {
    errors.push('File content is not a valid JSON object.');
    return { valid: false, errors };
  }
  if (!data.batch_id || typeof data.batch_id !== 'string') {
    errors.push('Missing or invalid batch_id.');
  }
  if (typeof data.revision !== 'number') {
    errors.push('Missing or invalid revision number.');
  }
  if (!data.exported_at || typeof data.exported_at !== 'string') {
    errors.push('Missing or invalid exported_at timestamp.');
  }
  if (!Array.isArray(data.records)) {
    errors.push('Missing or invalid records array.');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Validate individual record structures
  for (let i = 0; i < data.records.length; i++) {
    const r = data.records[i];
    if (!r.source_type || (r.source_type !== 'call' && r.source_type !== 'meeting')) {
      errors.push(`Record index ${i} has invalid source_type: ${r.source_type}. Expected 'call' or 'meeting'.`);
    }
    if (!r.source_id || typeof r.source_id !== 'string') {
      errors.push(`Record index ${i} has missing or non-string source_id.`);
    }
    if (!r.payload || typeof r.payload !== 'object') {
      errors.push(`Record index ${i} has missing payload.`);
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, errors: [], envelope: data as DeliveryEnvelope };
}

export function hasUsableTranscript(record: EnvelopeRecord): boolean {
  if (record.source_type === 'call') {
    const transcript = (record.payload as any).transcript;
    return typeof transcript === 'string' && transcript.trim().length > 0;
  } else {
    const turns = record.transcript_payload?.turns;
    return Array.isArray(turns) && turns.length > 0;
  }
}

export function buildUnifiedRecord(
  record: EnvelopeRecord,
  revision: number,
  exportedAt: string,
  existingRecord?: UnifiedRecord
): UnifiedRecord {
  const hasText = hasUsableTranscript(record);
  const { suggested_routes, primary_suggested_route, analysis } = determineRoutesAndAnalysis(
    record,
    hasText,
    revision
  );

  let person_name = 'Unknown';
  let person_role: 'call_rep' | 'meeting_organizer' = 'call_rep';
  let title_or_target = record.record_ref;
  let direction: string | null = null;
  let duration_seconds = 0;
  let activity_timestamp = exportedAt;
  let full_transcript_text: string | null = null;
  let transcript_excerpt = '';

  if (record.source_type === 'call') {
    const cp = record.payload as any;
    person_name = cp.rep_name || cp.rep_email || 'Unknown Call Rep';
    person_role = 'call_rep';
    title_or_target = `Call with ${cp.rep_name || 'Prospect'} (${cp.direction || 'outbound'})`;
    direction = cp.direction || null;
    duration_seconds = cp.duration_seconds || 0;
    activity_timestamp = cp.started_at || exportedAt;
    full_transcript_text = cp.transcript || null;
    if (full_transcript_text) {
      transcript_excerpt = full_transcript_text.slice(0, 140).trim() + (full_transcript_text.length > 140 ? '...' : '');
    }
  } else {
    const mp = record.payload as any;
    person_name = mp.organizer_email || 'Unknown Organizer';
    person_role = 'meeting_organizer';
    title_or_target = mp.title || 'Meeting';
    duration_seconds = mp.duration_seconds || 0;
    activity_timestamp = mp.starts_at || exportedAt;
    if (record.transcript_payload?.turns && record.transcript_payload.turns.length > 0) {
      full_transcript_text = record.transcript_payload.turns
        .map((t) => `${t.speaker} (${t.timecode}): ${t.text}`)
        .join('\n');
      const firstTurn = record.transcript_payload.turns[0].text;
      transcript_excerpt = firstTurn.slice(0, 140).trim() + (firstTurn.length > 140 ? '...' : '');
    }
  }

  // Processing state
  let processing_state: ProcessingState = 'completed';
  if (!hasText) {
    processing_state = record.record_ref === 'M07' && revision === 1 ? 'awaiting_transcript' : 'no_usable_text';
  }

  // Review state
  let review_state: ReviewState = hasText ? 'pending_review' : 'no_usable_transcript';

  // Check if text changed from an existing record (e.g. M07 late transcript!)
  let analysis_stale = false;
  if (existingRecord) {
    if (existingRecord.full_transcript_text !== full_transcript_text && hasText) {
      // Source text changed!
      analysis_stale = true;
      review_state = 'analysis_stale';
    } else {
      review_state = existingRecord.review_state;
    }
  }

  // Preserve user overrides if existing
  const manual_override = existingRecord ? existingRecord.manual_override : false;
  const manual_routes = existingRecord ? existingRecord.manual_routes : null;
  const primary_manual_route = existingRecord ? existingRecord.primary_manual_route : null;
  const manager_notes = existingRecord ? existingRecord.manager_notes : '';

  return {
    source_type: record.source_type,
    source_id: record.source_id,
    record_ref: record.record_ref,
    applied_revision: revision,
    exported_at: exportedAt,
    activity_timestamp,
    activity_date_kolkata: '2026-08-21',
    call_payload: record.source_type === 'call' ? (record.payload as any) : null,
    meeting_payload: record.source_type === 'meeting' ? (record.payload as any) : null,
    transcript_payload: record.transcript_payload,
    person_name,
    person_role,
    title_or_target,
    direction,
    duration_seconds,
    has_usable_transcript: hasText,
    transcript_excerpt,
    full_transcript_text,
    suggested_routes,
    primary_suggested_route,
    analysis_revision: revision,
    analysis_stale,
    analysis,
    manual_routes,
    primary_manual_route,
    manual_override,
    manager_notes,
    review_state,
    processing_state,
    updated_at: new Date().toISOString(),
  };
}

export async function processEnvelopeImport(envelope: DeliveryEnvelope): Promise<ImportResult> {
  const existingRecordsList = await getAllRecords();
  const existingMap = new Map<string, UnifiedRecord>();
  existingRecordsList.forEach((r) => {
    existingMap.set(getRecordKey(r.source_type, r.source_id), r);
  });

  const userOverridesMap = await getUserOverrides();

  let inserted = 0;
  let updated = 0;
  let ignored = 0;
  const errors: string[] = [];

  const recordsToPersist: UnifiedRecord[] = [];

  for (const record of envelope.records) {
    const key = getRecordKey(record.source_type, record.source_id);
    const existing = existingMap.get(key);

    if (existing) {
      // RULE: Ignore incoming revisions equal to or older than the last applied revision
      if (envelope.revision <= existing.applied_revision) {
        ignored++;
        continue;
      }

      // RULE: A newer revision replaces its entire source payload and transcript payload
      updated++;
      const updatedUnified = buildUnifiedRecord(record, envelope.revision, envelope.exported_at, existing);

      // Preserve explicit manual overrides
      if (existing.manual_override) {
        updatedUnified.manual_override = true;
        updatedUnified.manual_routes = existing.manual_routes;
        updatedUnified.primary_manual_route = existing.primary_manual_route;
        updatedUnified.manager_notes = existing.manager_notes;
        // Keep review_state marked as analysis_stale or pending_review because new source text arrived
        updatedUnified.review_state = 'analysis_stale';
        updatedUnified.analysis_stale = true;
      }

      existingMap.set(key, updatedUnified);
      recordsToPersist.push(updatedUnified);
    } else {
      // New record
      inserted++;
      const newUnified = buildUnifiedRecord(record, envelope.revision, envelope.exported_at);

      // Check if persistent user override existed in store
      const override = userOverridesMap.get(key);
      if (override) {
        newUnified.manual_override = true;
        newUnified.manual_routes = override.manual_routes;
        newUnified.primary_manual_route = override.primary_manual_route;
        newUnified.manager_notes = override.manager_notes;
        newUnified.review_state = override.review_state;
      }

      existingMap.set(key, newUnified);
      recordsToPersist.push(newUnified);
    }
  }

  // Persist updated & inserted records
  if (recordsToPersist.length > 0) {
    await putRecordsBatch(recordsToPersist);
  }

  // Log import history
  const historyLog: ImportBatchLog = {
    id: `import-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    batch_id: envelope.batch_id,
    revision: envelope.revision,
    exported_at: envelope.exported_at,
    imported_at: new Date().toISOString(),
    total_records_in_batch: envelope.records.length,
    inserted_records: inserted,
    updated_records: updated,
    ignored_records: ignored,
    errors,
  };
  await addImportHistory(historyLog);

  // Calculate totals after import
  const finalRecords = Array.from(existingMap.values());
  const usableCount = finalRecords.filter((r) => r.has_usable_transcript).length;

  return {
    batch_id: envelope.batch_id,
    revision: envelope.revision,
    exported_at: envelope.exported_at,
    total_in_envelope: envelope.records.length,
    inserted,
    updated,
    ignored,
    errors,
    total_unique_records_after_import: finalRecords.length,
    usable_transcripts_after_import: usableCount,
  };
}
