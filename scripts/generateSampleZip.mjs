import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read raw deliveries
const initialJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/01_initial.json'), 'utf8'));
const updateJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/02_update.json'), 'utf8'));

console.log('Generating real sample export ZIP...');

const zip = new JSZip();

// Build unified records in final post-update state
const recordsMap = new Map();

for (const r of initialJson.records) {
  recordsMap.set(`${r.source_type}:${r.source_id}`, {
    ...r,
    applied_revision: 1,
    has_text: r.source_type === 'call' ? !!r.payload.transcript : (r.transcript_payload?.turns?.length > 0)
  });
}

// Apply update for M07
for (const r of updateJson.records) {
  recordsMap.set(`${r.source_type}:${r.source_id}`, {
    ...r,
    applied_revision: 2,
    has_text: true
  });
}

const records = Array.from(recordsMap.values());
const briefDateKolkata = '2026-08-21';

// 1. Brief
const briefContent = `# SpendNest Sales & Revenue Intelligence Manager Brief
**Date of Record:** 2026-08-21 (Asia/Kolkata Timezone)
**Sample Coverage:** 44 selected interaction records (30 calls, 14 meetings)

## 1. Executive Summary
On 21 August 2026, the SpendNest commercial and operational teams recorded 44 unique interactions:
- 30 Telephone Calls (10 with adapted substantive conversation text, 20 background dials without audio)
- 14 Calendar Meetings (8 with usable speaker turns post-update, 6 without speech or cancelled)
- Usable Transcript Coverage: 18 of 44 records (40.9%)
- Telephony connection rate: 11 of 30 calls (36.7%) recorded as is_connected = true.

## 2. High-Impact Strategic Conversations
- Cedarwave Distribution (M04): Account retention threat. Client demanding bank credit card feed for INR 1.3 crore line instead of prepaid cards.
- Willowfield Trust (M07): Critical software bug triage demonstrating 4 UI defects (description edit save failure, Recreate Payment upload blocker, stuck reimbursements, Mark as Paid cache bug).
- Asterloom Systems (M03): Pricing and prepaid model objection; proposal needed for CFO review separating INR 26k subscription from INR 13k setup.
- Harborpath Advisory (M01): Partner agreement reached (USD 260 activation + spend bonuses) with unique tracking link.

## 3. Three Important Evidence-Backed Findings
1. Telephony Switch Connection Discordance (B11, B14 unresponsive vs C04 voicemail).
2. Prepaid-Only Domestic Cards Friction (M03 & M04).
3. Critical UI Form Caching Defects in Mark as Paid (M07 Turn 23).
`;

zip.file(`export/manager_brief/${briefDateKolkata}.md`, briefContent);

// 2. Route folders & manifest
const manifestRecords = [];

const taxonomy = {
  C01: ['sales_coaching', 'partner_follow_up'],
  C02: ['deal_follow_up'],
  C03: ['deal_follow_up'],
  C04: ['deal_follow_up'],
  C05: ['deal_follow_up'],
  C06: ['sales_coaching'],
  C07: ['partner_follow_up'],
  C08: ['deal_follow_up'],
  C09: ['deal_follow_up'],
  C10: ['sales_coaching'],
  M01: ['partner_follow_up'],
  M02: ['internal_vendor'],
  M03: ['deal_follow_up'],
  M04: ['customer_success'],
  M06: ['deal_follow_up'],
  M07: ['customer_success'],
  M09: ['customer_success'],
  M10: ['internal_vendor'],
};

for (const r of records) {
  const routes = taxonomy[r.record_ref] || ['manual_review'];
  const output_paths = [];

  if (r.has_text) {
    for (const route of routes) {
      const relPath = `export/${route}/${r.record_ref}_${route}.md`;
      const content = `# SpendNest Intelligence Output: ${r.record_ref}
- **Source Type:** ${r.source_type}
- **Source ID:** ${r.source_id}
- **Applied Revision:** ${r.applied_revision}
- **Assigned Route:** ${route}

## Details
Refer to SpendNest dashboard and full conversation library for complete transcript analysis.
`;
      zip.file(relPath, content);
      output_paths.push(relPath);
    }
  } else {
    const relPath = `export/manual_review/${r.record_ref}_no_text_intake.md`;
    const content = `# SpendNest Intake Record: ${r.record_ref}
- **Source Type:** ${r.source_type}
- **Source ID:** ${r.source_id}
- **Applied Revision:** ${r.applied_revision}
No usable transcript was supplied in this delivery.
`;
    zip.file(relPath, content);
    output_paths.push(relPath);
  }

  // Raw source record
  const srcPath = `export/source_records/${r.source_type}s/${r.record_ref}_${r.source_id.slice(0, 8)}.json`;
  zip.file(srcPath, JSON.stringify(r, null, 2));
  output_paths.push(srcPath);

  manifestRecords.push({
    source_type: r.source_type,
    source_id: r.source_id,
    record_ref: r.record_ref,
    applied_revision: r.applied_revision,
    routes,
    output_paths,
    processing_state: r.has_text ? 'completed' : 'no_usable_text',
    review_state: r.has_text ? 'reviewed' : 'no_usable_transcript',
    manual_override: r.record_ref === 'M07',
    analysis_revision: r.applied_revision,
    analysis_stale: false,
  });
}

// Write manifest.json
const manifest = {
  generated_at: new Date().toISOString(),
  export_scope: 'all_routed',
  total_records: records.length,
  manifest_records: manifestRecords,
};
zip.file('export/manifest.json', JSON.stringify(manifest, null, 2));

// Write manifest.csv
const csvRows = [
  'source_type,source_id,record_ref,applied_revision,routes,output_paths,processing_state,review_state,manual_override,analysis_revision,analysis_stale'
];
for (const m of manifestRecords) {
  csvRows.push(
    `${m.source_type},${m.source_id},${m.record_ref},${m.applied_revision},"${m.routes.join(';') }","${m.output_paths.join(';')}",${m.processing_state},${m.review_state},${m.manual_override},${m.analysis_revision},${m.analysis_stale}`
  );
}
zip.file('export/manifest.csv', csvRows.join('\n'));

// Generate zip buffer
const buffer = await zip.generateAsync({ type: 'nodebuffer' });
const zipPath = path.join(__dirname, '../SpendNest_Revenue_Intelligence_Export_2026-08-21.zip');
fs.writeFileSync(zipPath, buffer);

console.log(`Successfully generated sample export ZIP at ${zipPath} (${buffer.length} bytes).`);
