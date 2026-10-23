import pptxgen from 'pptxgenjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Generating 5-slide presentation...');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';
pptx.author = 'Senior Full-Stack & Revenue Intelligence Lead';
pptx.company = 'SpendNest';
pptx.title = 'SpendNest Revenue Intelligence Inbox — Strategic Review & Technical Architecture';

// Define Color Palette
const COLORS = {
  navy: '0F172A',
  slateDark: '1E293B',
  slateMuted: '64748B',
  indigo: '4F46E5',
  indigoLight: 'EEF2FF',
  emerald: '059669',
  emeraldLight: 'ECFDF5',
  amber: 'D97706',
  amberLight: 'FFFBEB',
  white: 'FFFFFF',
  cardBg: 'F8FAFC',
  border: 'E2E8F0',
};

// SLIDE 1: Manager Problem & Core Findings
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.white };

  // Header tag & title
  slide.addText('SPENDNEST REVENUE INTELLIGENCE • EXECUTIVE SUBMISSION', {
    x: 0.8,
    y: 0.6,
    w: 8.0,
    h: 0.3,
    fontSize: 10,
    bold: true,
    color: COLORS.indigo,
  });
  slide.addText('1. The Manager Problem & Three Evidence-Backed Findings', {
    x: 0.8,
    y: 0.9,
    w: 11.5,
    h: 0.6,
    fontSize: 22,
    bold: true,
    color: COLORS.navy,
  });

  // Problem Box
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 1.6,
    w: 11.7,
    h: 1.1,
    fill: { color: COLORS.indigoLight },
    line: { color: COLORS.indigo, width: 1 },
  });
  slide.addText(
    'THE SALES MANAGER CHALLENGE: Sales managers inherit fragmented call logs, late transcripts (M07), and telephony classifications that contradict transcript reality. The inbox must separate raw source data from analytical deductions, maintain monotonic delivery revisions, and prevent false pipeline inflation.',
    {
      x: 1.0,
      y: 1.7,
      w: 11.3,
      h: 0.9,
      fontSize: 11,
      color: COLORS.slateDark,
      lineSpacing: 16,
    }
  );

  // Finding 1 Card
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 2.9,
    w: 3.7,
    h: 3.8,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.border, width: 1 },
  });
  slide.addText('Finding 1: Telephony Discordance', {
    x: 1.0,
    y: 3.1,
    w: 3.3,
    h: 0.4,
    fontSize: 13,
    bold: true,
    color: COLORS.navy,
  });
  slide.addText(
    '• Observed: Upstream switch tagged 11/30 calls connected. B11 and B14 were 0-speech unresponsive ghost connects. Conversely, C04 was tagged false despite a 95s voicemail.\n\n• Impact: Rewarding SDRs on switch flags distorts effort.\n\n• Citation: C04 text ("My understanding is information went to wrong email...").',
    {
      x: 1.0,
      y: 3.6,
      w: 3.3,
      h: 2.9,
      fontSize: 10.5,
      color: COLORS.slateDark,
      lineSpacing: 16,
    }
  );

  // Finding 2 Card
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 4.8,
    y: 2.9,
    w: 3.7,
    h: 3.8,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.border, width: 1 },
  });
  slide.addText('Finding 2: Prepaid Card Resistance', {
    x: 5.0,
    y: 3.1,
    w: 3.3,
    h: 0.4,
    fontSize: 13,
    bold: true,
    color: COLORS.navy,
  });
  slide.addText(
    '• Observed: Asterloom (M03) and Cedarwave (M04) strongly resisted advance pre-funding. Cedarwave has an INR 1.3 crore bank credit line and demanded credit card feed.\n\n• Impact: Threatens immediate churn.\n\n• Citation: M04 Turn 11 ("moving from prepaid to credit is the main issue for us").',
    {
      x: 5.0,
      y: 3.6,
      w: 3.3,
      h: 2.9,
      fontSize: 10.5,
      color: COLORS.slateDark,
      lineSpacing: 16,
    }
  );

  // Finding 3 Card
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 8.8,
    y: 2.9,
    w: 3.7,
    h: 3.8,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.border, width: 1 },
  });
  slide.addText('Finding 3: UI Caching Glitches', {
    x: 9.0,
    y: 3.1,
    w: 3.3,
    h: 0.4,
    fontSize: 13,
    bold: true,
    color: COLORS.navy,
  });
  slide.addText(
    '• Observed: Screen sharing revealed 4 software bugs: description edit save failure, recreate payment upload rejection, stuck reimbursements, and Mark as Paid caching previous INR 18,200.\n\n• Impact: Risk of duplicate payments.\n\n• Citation: M07 Turn 23 ("retaining previous amount rather than fetching next").',
    {
      x: 9.0,
      y: 3.6,
      w: 3.3,
      h: 2.9,
      fontSize: 10.5,
      color: COLORS.slateDark,
      lineSpacing: 16,
    }
  );
}

// SLIDE 2: Interface Choices & Deliberate Omissions
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.white };

  slide.addText('SPENDNEST REVENUE INTELLIGENCE • UX & PRODUCT DESIGN', {
    x: 0.8,
    y: 0.6,
    w: 8.0,
    h: 0.3,
    fontSize: 10,
    bold: true,
    color: COLORS.indigo,
  });
  slide.addText('2. Interface Choices & Deliberately Omitted Anti-Patterns', {
    x: 0.8,
    y: 0.9,
    w: 11.5,
    h: 0.6,
    fontSize: 22,
    bold: true,
    color: COLORS.navy,
  });

  // What We Built
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 1.7,
    w: 5.7,
    h: 5.0,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.border, width: 1 },
  });
  slide.addText('Enterprise Interface Choices We Implemented', {
    x: 1.1,
    y: 1.9,
    w: 5.1,
    h: 0.4,
    fontSize: 13,
    bold: true,
    color: COLORS.indigo,
  });
  slide.addText(
    '• Fixed Left Navigation: 7 dedicated views (Overview, Inbox, Brief, Routing, Exports, History, Settings) for rapid mental model formation.\n\n' +
      '• Slide-over Inspection Drawer: Allows deep transcript inspection, side-by-side machine suggestions vs manual controls, and raw JSON payload audit.\n\n' +
      '• Accessible Denominator Tooltips: Every headline KPI features an interactive definition explaining the exact formula, numerator, and denominator.\n\n' +
      '• Separate Rep & Organizer Views: Distinguishes call callers from calendar organizers, preventing invalid staff role assumptions.',
    {
      x: 1.1,
      y: 2.5,
      w: 5.1,
      h: 4.0,
      fontSize: 11,
      color: COLORS.slateDark,
      lineSpacing: 18,
    }
  );

  // What We Deliberately Left Out
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 6.8,
    y: 1.7,
    w: 5.7,
    h: 5.0,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.border, width: 1 },
  });
  slide.addText('Deliberately Rejected Choices & Omissions', {
    x: 7.1,
    y: 1.9,
    w: 5.1,
    h: 0.4,
    fontSize: 13,
    bold: true,
    color: COLORS.amber,
  });
  slide.addText(
    '• NO Fabricated Pipeline Totals: Rejected displaying synthetic dollar amounts because no authoritative CRM deal value table was supplied.\n\n' +
      '• NO Staff Performance Rankings: Refused employee leaderboards because the 44-record extract is an intentional test sample, not a representative census.\n\n' +
      '• NO Synthetic Summaries for Blank Audio: Background calls (B01-B20) explicitly show no substantive summaries rather than hallucinating intent.\n\n' +
      '• NO Playable Players for Invalid URLs: Acknowledged example.invalid links as test fixtures rather than implementing non-operational audio players.',
    {
      x: 7.1,
      y: 2.5,
      w: 5.1,
      h: 4.0,
      fontSize: 11,
      color: COLORS.slateDark,
      lineSpacing: 18,
    }
  );
}

// SLIDE 3: Routing Architecture & Difficult Decision
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.white };

  slide.addText('SPENDNEST REVENUE INTELLIGENCE • ROUTING & DECISION ARCHITECTURE', {
    x: 0.8,
    y: 0.6,
    w: 8.0,
    h: 0.3,
    fontSize: 10,
    bold: true,
    color: COLORS.indigo,
  });
  slide.addText('3. Routing Taxonomy & The Difficult Case (M04 vs C05)', {
    x: 0.8,
    y: 0.9,
    w: 11.5,
    h: 0.6,
    fontSize: 22,
    bold: true,
    color: COLORS.navy,
  });

  // Taxonomy grid
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 1.7,
    w: 11.7,
    h: 1.8,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.border, width: 1 },
  });
  slide.addText('Core Six-Category Destination Taxonomy', {
    x: 1.0,
    y: 1.85,
    w: 5.0,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: COLORS.navy,
  });
  slide.addText(
    '1. sales_coaching: Rep performance, objection handling, discovery structure (e.g. C01, C06, C10)\n' +
      '2. deal_follow_up: Prospect interest, budget objection, buying process next steps (e.g. C03, C08, M03, M06)\n' +
      '3. customer_success: Client retention, adoption hurdles, critical bug triage (e.g. M04, M07, M09)\n' +
      '4. partner_follow_up: Advisory channels, referral commission agreements (e.g. C07, M01)\n' +
      '5. internal_vendor: Upstream software procurement & back-office operations training (e.g. M02, M10)\n' +
      '6. manual_review: Ambiguous intent, missing audio, or conflicting business signals (e.g. B01-B20)',
    {
      x: 1.0,
      y: 2.2,
      w: 11.3,
      h: 1.2,
      fontSize: 10,
      color: COLORS.slateDark,
      lineSpacing: 16,
    }
  );

  // Difficult Case Box
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 3.7,
    w: 11.7,
    h: 3.0,
    fill: { color: COLORS.indigoLight },
    line: { color: COLORS.indigo, width: 1 },
  });
  slide.addText('The Difficult Routing Case: Cedarwave Distribution (M04)', {
    x: 1.0,
    y: 3.9,
    w: 8.0,
    h: 0.4,
    fontSize: 13,
    bold: true,
    color: COLORS.indigo,
  });
  slide.addText(
    '• The Ambiguity: Scheduled as a routine card programme migration. However, the customer immediately revealed they were deeply dissatisfied with prepaid funding and actively evaluating leaving SpendNest for bank credit cards.\n\n' +
      '• The Dual Routing Choice: Machine classified as migration; manager intervention routed primary to customer_success (P1 Churn Retention) with secondary deal_follow_up (software-layer upsell over bank cards).\n\n' +
      '• The Preserved Override: When late delivery batches arrive, the manager\'s manual override remains permanently active while automated suggestions update dynamically.',
    {
      x: 1.0,
      y: 4.4,
      w: 11.3,
      h: 2.1,
      fontSize: 11,
      color: COLORS.slateDark,
      lineSpacing: 18,
    }
  );
}

// SLIDE 4: Validation & Traceability
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.white };

  slide.addText('SPENDNEST REVENUE INTELLIGENCE • DATA CONTRACT & VERIFICATION', {
    x: 0.8,
    y: 0.6,
    w: 8.0,
    h: 0.3,
    fontSize: 10,
    bold: true,
    color: COLORS.indigo,
  });
  slide.addText('4. Data Contract Verification, Denominators & Evidence Audit', {
    x: 0.8,
    y: 0.9,
    w: 11.5,
    h: 0.6,
    fontSize: 22,
    bold: true,
    color: COLORS.navy,
  });

  // Table of 4 verified metrics
  slide.addTable(
    [
      [
        { text: 'Metric', options: { bold: true, fill: '1E293B', color: 'FFFFFF' } },
        { text: 'Initial (Rev 1)', options: { bold: true, fill: '1E293B', color: 'FFFFFF' } },
        { text: 'Post-Update (Rev 2)', options: { bold: true, fill: '1E293B', color: 'FFFFFF' } },
        { text: 'Verified Formula & Denominator', options: { bold: true, fill: '1E293B', color: 'FFFFFF' } },
      ],
      [
        { text: 'Unique Records' },
        { text: '44' },
        { text: '44' },
        { text: 'Count of distinct (source_type, source_id). Idempotent on re-import.' },
      ],
      [
        { text: 'Usable Transcripts' },
        { text: '17' },
        { text: '18' },
        { text: 'Calls with text + Meetings with >= 1 speaker turn. M07 added in rev 2.' },
      ],
      [
        { text: 'Transcript Coverage' },
        { text: '38.6% (17/44)' },
        { text: '40.9% (18/44)' },
        { text: 'Usable texts divided by total selected records in filter.' },
      ],
      [
        { text: 'Reported Connect Rate' },
        { text: '36.7% (11/30)' },
        { text: '36.7% (11/30)' },
        { text: 'Calls where is_connected: true / calls with non-null is_connected.' },
      ],
      [
        { text: 'M07 Revision State' },
        { text: 'Rev 1 (0 turns)' },
        { text: 'Rev 2 (27 turns)' },
        { text: 'Replaces payload entirely. Overrides preserved; stale analysis flagged.' },
      ],
    ],
    {
      x: 0.8,
      y: 1.7,
      w: 11.7,
      h: 2.8,
      fontSize: 10,
      border: { pt: 0.5, color: COLORS.border },
    }
  );

  // Evidence passage quote box
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 4.8,
    w: 11.7,
    h: 1.9,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.border, width: 1 },
  });
  slide.addText('Exact Evidence Passage Traceability Standard', {
    x: 1.0,
    y: 5.0,
    w: 8.0,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: COLORS.navy,
  });
  slide.addText(
    '• Meeting Passages: Explicitly cite record_ref and 1-based turn number (e.g. M07 Turn 23 [00:17:50], M03 Turn 24 [00:30:43]).\n' +
      '• Call Passages: Explicitly cite record_ref and exact adapted quote (e.g. C01 "Our processes are already very automated").\n' +
      '• Verifiable Manifest: Every path listed in manifest.json corresponds 1-to-1 with a generated file inside the ZIP archive.',
    {
      x: 1.0,
      y: 5.4,
      w: 11.3,
      h: 1.1,
      fontSize: 10.5,
      color: COLORS.slateDark,
      lineSpacing: 16,
    }
  );
}

// SLIDE 5: Trade-offs & Limitations
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.white };

  slide.addText('SPENDNEST REVENUE INTELLIGENCE • ENGINEERING TRADEOFFS & ROADMAP', {
    x: 0.8,
    y: 0.6,
    w: 8.0,
    h: 0.3,
    fontSize: 10,
    bold: true,
    color: COLORS.indigo,
  });
  slide.addText('5. Accepted Trade-offs, AI Usage, Limitations & Future Roadmap', {
    x: 0.8,
    y: 0.9,
    w: 11.5,
    h: 0.6,
    fontSize: 22,
    bold: true,
    color: COLORS.navy,
  });

  // Left card: Tradeoffs & AI
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 1.7,
    w: 5.7,
    h: 5.0,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.border, width: 1 },
  });
  slide.addText('Accepted Trade-offs & AI Usage', {
    x: 1.1,
    y: 1.9,
    w: 5.1,
    h: 0.4,
    fontSize: 13,
    bold: true,
    color: COLORS.indigo,
  });
  slide.addText(
    '• Deterministic Model vs. Live LLM API Calls:\n' +
      '  Accepted Trade-off: Embedded pre-generated analysis catalog and rule-based heuristics rather than live external model calls. This guarantees 100% offline functionality, zero API latency, zero secret leakage, and sub-second test execution.\n\n' +
      '• AI Usage Disclosure:\n' +
      '  Coding assistants used for UI scaffolding, TypeScript typing, and transcript extraction. All analytical conclusions and citations were manually verified against source turns.',
    {
      x: 1.1,
      y: 2.5,
      w: 5.1,
      h: 4.0,
      fontSize: 10.5,
      color: COLORS.slateDark,
      lineSpacing: 17,
    }
  );

  // Right card: Limitations & Next Steps
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 6.8,
    y: 1.7,
    w: 5.7,
    h: 5.0,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.border, width: 1 },
  });
  slide.addText('Known Limitations & Future Improvements', {
    x: 7.1,
    y: 1.9,
    w: 5.1,
    h: 0.4,
    fontSize: 13,
    bold: true,
    color: COLORS.emerald,
  });
  slide.addText(
    '• Single-Day Sample Limitation:\n' +
      '  All selected activity falls on 21 August 2026. Date filtering operates over this single local day; temporal multi-week trend lines are not established.\n\n' +
      '• Future Production Roadmap:\n' +
      '  1. Direct Telephony Webhook Ingestion: Real-time stream processing of PBX events with automatic audio diarization.\n' +
      '  2. CRM Bi-directional Sync: Pushing verified deal next steps into Salesforce/HubSpot opportunity tables.\n' +
      '  3. Audio Player Integration: Once actual audio blobs are supplied, embed waveform timeline scrubbing.',
    {
      x: 7.1,
      y: 2.5,
      w: 5.1,
      h: 4.0,
      fontSize: 10.5,
      color: COLORS.slateDark,
      lineSpacing: 17,
    }
  );
}

const outputPath = path.join(__dirname, '../SpendNest_Revenue_Intelligence_Presentation.pptx');
await pptx.writeFile({ fileName: outputPath });

console.log(`Successfully generated presentation at ${outputPath}`);
