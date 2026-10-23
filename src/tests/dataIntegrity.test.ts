import { describe, it, expect, beforeEach } from 'vitest';
import { INITIAL_DELIVERY } from '../data/rawInitial';
import { UPDATE_DELIVERY } from '../data/rawUpdate';
import {
  processEnvelopeImport,
  hasUsableTranscript,
} from '../services/importService';
import {
  getAllRecords,
  clearAllDatabase,
  getRecordKey,
} from '../services/db';
import {
  applyManualRouteOverride,
  resetRouteToSuggestion,
  refreshStaleAnalysis,
} from '../services/demoService';
import { calculateDashboardMetrics } from '../services/metricsCalculator';
import { createExportArchive } from '../services/exportService';
import JSZip from 'jszip';

describe('Revenue Intelligence Inbox Data Integrity & Contract Tests', () => {
  beforeEach(async () => {
    await clearAllDatabase();
  });

  // Test 1: Initial import produces 44 unique records
  it('1. Initial import produces 44 unique records (30 calls, 14 meetings)', async () => {
    const res = await processEnvelopeImport(INITIAL_DELIVERY);
    expect(res.inserted).toBe(44);
    expect(res.total_unique_records_after_import).toBe(44);

    const records = await getAllRecords();
    expect(records.length).toBe(44);

    const calls = records.filter((r) => r.source_type === 'call');
    const meetings = records.filter((r) => r.source_type === 'meeting');
    expect(calls.length).toBe(30);
    expect(meetings.length).toBe(14);
  });

  // Test 2: Repeated initial import leaves count at 44
  it('2. Repeated initial import leaves the unique record count at 44 (idempotency)', async () => {
    await processEnvelopeImport(INITIAL_DELIVERY);
    const repeatRes = await processEnvelopeImport(INITIAL_DELIVERY);

    expect(repeatRes.inserted).toBe(0);
    expect(repeatRes.updated).toBe(0);
    expect(repeatRes.ignored).toBe(44);
    expect(repeatRes.total_unique_records_after_import).toBe(44);

    const records = await getAllRecords();
    expect(records.length).toBe(44);
  });

  // Test 3: Shuffling record order does not change the result
  it('3. Shuffling record order does not change the outcome', async () => {
    const shuffledRecords = [...INITIAL_DELIVERY.records].sort(() => Math.random() - 0.5);
    const shuffledEnvelope = {
      ...INITIAL_DELIVERY,
      records: shuffledRecords,
    };

    const res = await processEnvelopeImport(shuffledEnvelope);
    expect(res.total_unique_records_after_import).toBe(44);

    const records = await getAllRecords();
    expect(records.length).toBe(44);
  });

  // Test 4: Applying update leaves 44 unique records
  it('4. Applying update delivery leaves 44 unique records (not 45)', async () => {
    await processEnvelopeImport(INITIAL_DELIVERY);
    const updateRes = await processEnvelopeImport(UPDATE_DELIVERY);

    expect(updateRes.updated).toBe(1); // M07 updated
    expect(updateRes.inserted).toBe(0);
    expect(updateRes.total_unique_records_after_import).toBe(44);

    const records = await getAllRecords();
    expect(records.length).toBe(44);
  });

  // Test 5: Usable transcript count changes from 17 to 18
  it('5. Usable transcript count changes from 17 initially to 18 after update', async () => {
    const initialRes = await processEnvelopeImport(INITIAL_DELIVERY);
    expect(initialRes.usable_transcripts_after_import).toBe(17);

    const updateRes = await processEnvelopeImport(UPDATE_DELIVERY);
    expect(updateRes.usable_transcripts_after_import).toBe(18);

    const records = await getAllRecords();
    const usable = records.filter((r) => r.has_usable_transcript);
    expect(usable.length).toBe(18);
  });

  // Test 6: M07 receives its newer transcript
  it('6. M07 receives its newer 27-turn transcript in revision 2', async () => {
    await processEnvelopeImport(INITIAL_DELIVERY);
    let records = await getAllRecords();
    const m07Initial = records.find((r) => r.record_ref === 'M07');
    expect(m07Initial).toBeDefined();
    expect(m07Initial!.has_usable_transcript).toBe(false);
    expect(m07Initial!.applied_revision).toBe(1);

    await processEnvelopeImport(UPDATE_DELIVERY);
    records = await getAllRecords();
    const m07Updated = records.find((r) => r.record_ref === 'M07');
    expect(m07Updated!.has_usable_transcript).toBe(true);
    expect(m07Updated!.applied_revision).toBe(2);
    expect(m07Updated!.transcript_payload?.turns.length).toBe(27);
  });

  // Test 7: M07 manual route survives update
  it('7. M07 manual route override survives the update delivery', async () => {
    await processEnvelopeImport(INITIAL_DELIVERY);
    let records = await getAllRecords();
    const m07 = records.find((r) => r.record_ref === 'M07')!;

    // Manager manually overrides M07 route to 'customer_success' with custom notes
    await applyManualRouteOverride(
      m07,
      'customer_success',
      ['manual_review'],
      'Customer demonstrated 4 critical bugs during screen share.'
    );

    // Apply revision 2 update
    await processEnvelopeImport(UPDATE_DELIVERY);

    records = await getAllRecords();
    const m07AfterUpdate = records.find((r) => r.record_ref === 'M07')!;

    // Verification: Manual override must be preserved!
    expect(m07AfterUpdate.manual_override).toBe(true);
    expect(m07AfterUpdate.primary_manual_route).toBe('customer_success');
    expect(m07AfterUpdate.manager_notes).toContain('4 critical bugs');
    // Transcript must also be updated
    expect(m07AfterUpdate.has_usable_transcript).toBe(true);
    expect(m07AfterUpdate.applied_revision).toBe(2);
  });

  // Test 8: Reimporting revision 1 after revision 2 does not roll back M07
  it('8. Reimporting revision 1 after revision 2 does not roll back M07', async () => {
    await processEnvelopeImport(INITIAL_DELIVERY);
    await processEnvelopeImport(UPDATE_DELIVERY);

    // Re-import revision 1
    const reimportRes = await processEnvelopeImport(INITIAL_DELIVERY);
    expect(reimportRes.ignored).toBe(44); // Rev 1 is <= existing revisions

    const records = await getAllRecords();
    const m07 = records.find((r) => r.record_ref === 'M07')!;
    expect(m07.applied_revision).toBe(2);
    expect(m07.has_usable_transcript).toBe(true);
    expect(m07.transcript_payload?.turns.length).toBe(27);
  });

  // Test 9: State persists across reload
  it('9. State persists in storage', async () => {
    await processEnvelopeImport(INITIAL_DELIVERY);
    await processEnvelopeImport(UPDATE_DELIVERY);

    const records = await getAllRecords();
    expect(records.length).toBe(44);
    const m07 = records.find((r) => r.record_ref === 'M07')!;
    expect(m07.applied_revision).toBe(2);
  });

  // Test 10: Source text update invalidates or marks analysis stale
  it('10. Source text update marks analysis stale until refreshed', async () => {
    await processEnvelopeImport(INITIAL_DELIVERY);
    let records = await getAllRecords();
    const m07 = records.find((r) => r.record_ref === 'M07')!;

    // Set manual override before update
    await applyManualRouteOverride(m07, 'customer_success', [], 'Initial note');

    // Update arrives with new transcript
    await processEnvelopeImport(UPDATE_DELIVERY);

    records = await getAllRecords();
    const m07Updated = records.find((r) => r.record_ref === 'M07')!;
    expect(m07Updated.analysis_stale).toBe(true);
    expect(m07Updated.review_state).toBe('analysis_stale');

    // Explicit refresh action
    await refreshStaleAnalysis(m07Updated);
    records = await getAllRecords();
    const m07Refreshed = records.find((r) => r.record_ref === 'M07')!;
    expect(m07Refreshed.analysis_stale).toBe(false);
  });

  // Test 11: Missing transcripts do not receive fabricated summaries
  it('11. Records with missing transcripts do not receive fabricated summaries', async () => {
    await processEnvelopeImport(INITIAL_DELIVERY);
    const records = await getAllRecords();

    const backgroundCalls = records.filter((r) => r.record_ref.startsWith('B'));
    expect(backgroundCalls.length).toBe(20);

    for (const b of backgroundCalls) {
      expect(b.has_usable_transcript).toBe(false);
      expect(b.analysis).toBeNull();
      expect(b.processing_state).toBe('no_usable_text');
      expect(b.primary_suggested_route).toBe('manual_review');
    }
  });

  // Test 12: Dashboard counts use correct denominators
  it('12. Dashboard metrics use correct formulas and denominators', async () => {
    await processEnvelopeImport(INITIAL_DELIVERY);
    await processEnvelopeImport(UPDATE_DELIVERY);

    const records = await getAllRecords();
    const metrics = calculateDashboardMetrics(records);

    expect(metrics.totalUniqueRecords).toBe(44);
    expect(metrics.totalCalls).toBe(30);
    expect(metrics.totalMeetings).toBe(14);
    expect(metrics.usableTranscriptsCount).toBe(18);

    // Coverage denominator is 44: 18 / 44 = 40.909...
    expect(metrics.transcriptCoveragePct).toBeCloseTo((18 / 44) * 100, 1);

    // Connection rate denominator is eligible calls (30 calls with non-null is_connected)
    // 11 connected calls / 30 calls = 36.67%
    expect(metrics.sourceReportedEligibleCalls).toBe(30);
    expect(metrics.sourceReportedConnectedCalls).toBe(11);
    expect(metrics.sourceReportedUnknownCalls).toBe(0);
    expect(metrics.sourceReportedConnectionRatePct).toBeCloseTo((11 / 30) * 100, 1);
  });

  // Test 13: Multiple routes do not inflate unique record count
  it('13. Multi-route assignment does not inflate unique record count', async () => {
    await processEnvelopeImport(INITIAL_DELIVERY);
    let records = await getAllRecords();
    const c01 = records.find((r) => r.record_ref === 'C01')!;

    // Assign multiple routes
    await applyManualRouteOverride(c01, 'sales_coaching', ['partner_follow_up', 'deal_follow_up']);

    records = await getAllRecords();
    const metrics = calculateDashboardMetrics(records);

    expect(metrics.totalUniqueRecords).toBe(44);
    const totalAssignments = Object.values(metrics.routeAssignments).reduce((a, b) => a + b, 0);
    expect(totalAssignments).toBeGreaterThan(44); // Multiple route tags assigned
  });

  // Test 14: Exported manifest paths correspond to files in ZIP
  it('14. Exported manifest paths correspond 1-to-1 with files in generated ZIP', async () => {
    await processEnvelopeImport(INITIAL_DELIVERY);
    await processEnvelopeImport(UPDATE_DELIVERY);

    const records = await getAllRecords();
    const { zipBlob, manifest, fileCount } = await createExportArchive(records);

    expect(manifest.manifest_records.length).toBe(44);

    // Read back zip with JSZip
    const zip = await JSZip.loadAsync(zipBlob);

    // Check manifest.json exists in zip
    expect(zip.file('export/manifest.json')).not.toBeNull();
    expect(zip.file('export/manifest.csv')).not.toBeNull();
    expect(zip.file('export/manager_brief/2026-08-21.md')).not.toBeNull();

    // Verify every single output_path in every manifest record exists in the zip!
    for (const rec of manifest.manifest_records) {
      expect(rec.output_paths.length).toBeGreaterThan(0);
      for (const path of rec.output_paths) {
        const fileInZip = zip.file(path);
        expect(fileInZip, `Path ${path} must exist in ZIP`).not.toBeNull();
      }
    }
  });

  // Test 15: Manual reset to suggestion works only when explicitly requested
  it('15. Manual reset to suggestion reverts override only upon explicit request', async () => {
    await processEnvelopeImport(INITIAL_DELIVERY);
    let records = await getAllRecords();
    const c03 = records.find((r) => r.record_ref === 'C03')!;

    // Set override
    await applyManualRouteOverride(c03, 'sales_coaching');
    records = await getAllRecords();
    expect(records.find((r) => r.record_ref === 'C03')!.manual_override).toBe(true);

    // Explicit reset
    await resetRouteToSuggestion(records.find((r) => r.record_ref === 'C03')!);
    records = await getAllRecords();
    const c03Reset = records.find((r) => r.record_ref === 'C03')!;
    expect(c03Reset.manual_override).toBe(false);
    expect(c03Reset.primary_suggested_route).toBe('deal_follow_up');
  });
});
