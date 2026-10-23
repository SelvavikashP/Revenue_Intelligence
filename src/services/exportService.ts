import JSZip from 'jszip';
import { UnifiedRecord } from '../types/conversation';
import { ExportManifest, ExportManifestRecord } from '../types/export';
import { RouteCategory, ROUTE_TAXONOMY } from '../types/routing';
import { generateManagerBriefMarkdown } from './briefGenerator';

export async function createExportArchive(
  records: UnifiedRecord[],
  briefDateKolkata = '2026-08-21'
): Promise<{ zipBlob: Blob; filename: string; manifest: ExportManifest; fileCount: number }> {
  const zip = new JSZip();
  const manifestRecords: ExportManifestRecord[] = [];
  let fileCount = 0;

  // 1. Generate Manager Brief
  const managerBriefMd = generateManagerBriefMarkdown(records, briefDateKolkata);
  const briefPath = `export/manager_brief/${briefDateKolkata}.md`;
  zip.file(briefPath, managerBriefMd);
  fileCount++;

  // 2. Generate Route-specific output files for each record
  for (const record of records) {
    const activeRoutes: RouteCategory[] =
      record.manual_override && record.manual_routes ? record.manual_routes : record.suggested_routes;

    const output_paths: string[] = [];

    // If record has usable text, generate structured analysis markdown for each assigned route
    if (record.has_usable_transcript && record.analysis) {
      for (const route of activeRoutes) {
        const routeFolder = `export/${route}`;
        const filename = `${record.record_ref}_${route}.md`;
        const relativePath = `${routeFolder}/${filename}`;

        const routeDetail = record.analysis.routes.find((r) => r.category === route);
        const routeMeta = ROUTE_TAXONOMY[route];

        let content = `# SpendNest Revenue Intelligence Output: ${record.record_ref}\n\n`;
        content += `- **Record Reference:** ${record.record_ref}\n`;
        content += `- **Source Type:** ${record.source_type}\n`;
        content += `- **Source ID:** ${record.source_id}\n`;
        content += `- **Applied Revision:** ${record.applied_revision}\n`;
        content += `- **Activity Timestamp:** ${record.activity_timestamp} (Asia/Kolkata date: ${record.activity_date_kolkata})\n`;
        content += `- **Person / Role:** ${record.person_name} (${record.person_role})\n`;
        content += `- **Assigned Route:** ${routeMeta?.label || route}\n`;
        content += `- **Route Source:** ${record.manual_override ? 'Manual Manager Override' : 'Automated Routing Engine'}\n`;
        content += `- **Analysis Freshness:** ${record.analysis_stale ? 'STALE (Awaiting Refresh)' : 'Current (Fresh)'}\n`;
        content += `- **Review State:** ${record.review_state}\n\n`;

        content += `## Executive Summary\n${record.analysis.summary}\n\n`;

        if (routeDetail) {
          content += `## Route Decision & Evidence\n`;
          content += `- **Explanation:** ${routeDetail.explanation}\n`;
          content += `- **Confidence:** ${routeDetail.confidence.toUpperCase()}\n`;
          content += `- **Next Action:** ${routeDetail.next_action}\n`;
          content += `- **Owner:** ${routeDetail.action_owner || 'Unassigned'}\n\n`;

          content += `### Observed Facts (Ground Truth)\n`;
          routeDetail.observed_facts.forEach((f) => {
            content += `- ${f}\n`;
          });
          content += `\n`;

          content += `### Inferences (Analyst Interpretation)\n`;
          routeDetail.inferences.forEach((inf) => {
            content += `- ${inf}\n`;
          });
          content += `\n`;

          content += `### What Evidence Does NOT Establish\n`;
          routeDetail.unestablished.forEach((u) => {
            content += `- ${u}\n`;
          });
          content += `\n`;

          content += `### Supporting Evidence Passages\n`;
          routeDetail.evidence.forEach((ev) => {
            if (ev.source_type === 'call') {
              content += `> "${ev.quote}"\n> *— Call adapted text (${record.record_ref})*\n\n`;
            } else {
              content += `> "${ev.quote}"\n> *— Meeting turn ${ev.turn_number ?? 'N/A'} [${ev.timecode ?? ''}] (${record.record_ref})*\n\n`;
            }
          });
        }

        if (record.manager_notes) {
          content += `## Manager Notes\n${record.manager_notes}\n\n`;
        }

        content += `## Full Supplied Transcript\n\`\`\`\n${record.full_transcript_text || 'No transcript text.'}\n\`\`\`\n`;

        zip.file(relativePath, content);
        output_paths.push(relativePath);
        fileCount++;
      }
    } else {
      // Record without usable text -> output in manual_review or source_records
      const routeFolder = `export/manual_review`;
      const filename = `${record.record_ref}_no_text_intake.md`;
      const relativePath = `${routeFolder}/${filename}`;

      let content = `# SpendNest Intake Record: ${record.record_ref}\n\n`;
      content += `- **Record Reference:** ${record.record_ref}\n`;
      content += `- **Source Type:** ${record.source_type}\n`;
      content += `- **Source ID:** ${record.source_id}\n`;
      content += `- **Applied Revision:** ${record.applied_revision}\n`;
      content += `- **Activity Timestamp:** ${record.activity_timestamp}\n`;
      content += `- **Person:** ${record.person_name} (${record.person_role})\n`;
      content += `- **Processing State:** ${record.processing_state}\n`;
      content += `- **Review State:** ${record.review_state}\n\n`;
      content += `## Source Condition\nNo usable audio transcript was supplied in this assessment delivery. Original summary and classification reasons were deliberately withheld. Do not fabricate substantive analysis.\n\n`;
      content += `## Raw Payload Metadata\n\`\`\`json\n${JSON.stringify(
        record.source_type === 'call' ? record.call_payload : record.meeting_payload,
        null,
        2
      )}\n\`\`\`\n`;

      zip.file(relativePath, content);
      output_paths.push(relativePath);
      fileCount++;
    }

    // Also write raw source record json in export/source_records
    const sourcePath = `export/source_records/${record.source_type}s/${record.record_ref}_${record.source_id.slice(0, 8)}.json`;
    const sourceObj = {
      record_ref: record.record_ref,
      source_type: record.source_type,
      source_id: record.source_id,
      applied_revision: record.applied_revision,
      exported_at: record.exported_at,
      payload: record.source_type === 'call' ? record.call_payload : record.meeting_payload,
      transcript_payload: record.transcript_payload,
    };
    zip.file(sourcePath, JSON.stringify(sourceObj, null, 2));
    output_paths.push(sourcePath);
    fileCount++;

    manifestRecords.push({
      source_type: record.source_type,
      source_id: record.source_id,
      record_ref: record.record_ref,
      applied_revision: record.applied_revision,
      routes: activeRoutes,
      output_paths,
      processing_state: record.processing_state,
      review_state: record.review_state,
      manual_override: record.manual_override,
      analysis_revision: record.analysis_revision,
      analysis_stale: record.analysis_stale,
    });
  }

  // 3. Generate Manifest JSON
  const manifest: ExportManifest = {
    generated_at: new Date().toISOString(),
    export_scope: 'all_routed',
    total_records: records.length,
    total_files_generated: fileCount + 2, // +2 for manifest.json and manifest.csv
    manifest_records: manifestRecords,
  };
  zip.file('export/manifest.json', JSON.stringify(manifest, null, 2));
  fileCount++;

  // 4. Generate Manifest CSV
  const csvHeaders = [
    'source_type',
    'source_id',
    'record_ref',
    'applied_revision',
    'routes',
    'output_paths',
    'processing_state',
    'review_state',
    'manual_override',
    'analysis_revision',
    'analysis_stale',
  ];

  const csvRows = manifestRecords.map((m) => [
    m.source_type,
    m.source_id,
    m.record_ref,
    m.applied_revision,
    `"${m.routes.join(';')}"`,
    `"${m.output_paths.join(';')}"`,
    m.processing_state,
    m.review_state,
    m.manual_override,
    m.analysis_revision,
    m.analysis_stale,
  ]);

  const csvContent = [csvHeaders.join(','), ...csvRows.map((r) => r.join(','))].join('\n');
  zip.file('export/manifest.csv', csvContent);
  fileCount++;

  // Generate ZIP blob
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const filename = `SpendNest_Revenue_Intelligence_Export_${briefDateKolkata}.zip`;

  return { zipBlob, filename, manifest, fileCount };
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
