# SpendNest — Revenue Intelligence Inbox

A production-style, offline-capable B2B SaaS application for sales leadership to inspect incoming calls, calendar meetings, transcripts, and routing classifications, conduct quality reviews, and generate verifiable export archives.

Built for the **Revenue Intelligence Inbox** assignment based on `data/01_initial.json` and `data/02_update.json`.

- **Live Production URL (Render):** [https://spendnest-revenue-intelligence.onrender.com](https://spendnest-revenue-intelligence.onrender.com)
- **GitHub Repository:** [https://github.com/SelvavikashP/Revenue_Intelligence](https://github.com/SelvavikashP/Revenue_Intelligence)
- **Render Dashboard:** [https://dashboard.render.com/static/srv-dbdicurrjlhs73ddgf8g](https://dashboard.render.com/static/srv-dbdicurrjlhs73ddgf8g)

---

## 1. Quick Startup Guide

The application is completely self-contained, runs locally in any modern browser using IndexedDB, and requires no external API keys, database servers, or paid cloud services.

### Prerequisites
- Node.js v18+ (tested on Node v24.17.0)
- npm v9+

### Installation & Launch
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open browser at http://localhost:3000 (or the port Vite outputs)
```

### Production Build & Preview
```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

### Running Automated Test Suite
```bash
# Run all 15 acceptance criteria tests in Vitest
npm test
```

---

## 2. Default Application State & Quick Actions

- **Default Launch State:** When opened for the first time, the application automatically loads the final post-update state (both Batch 1 and Batch 2 applied), presenting all **44 unique records** and **18 usable transcripts** immediately.
- **One-Click Demo Load:** The **"Demo Load (Final)"** button in the top navigation bar re-applies both deliveries in sequential order at any time.
- **Clean Start / Reset:** The **"Reset"** button in the top bar clears all IndexedDB stores (`records`, `user_overrides`, `import_history`) after confirming in an accessible dialog, allowing reviewers to replay the import sequence from scratch.

---

## 3. How to Reproduce the Mandatory Replay & M07 Acceptance Test

The assignment requires verifying that a user-managed routing override survives a source revision update and that M07 receives its newer transcript without inflating the unique record count:

| Step | Action | Expected Verification |
|---|---|---|
| **Step 1: Clean Start** | Click **Reset** in top bar and confirm. | Records count drops to 0. |
| **Step 2: Initial Import** | Navigate to **Import History** tab and click **Import 01_initial.json (Rev 1)**. | Exactly **44 unique records** loaded. **17 usable transcripts** (10 calls, 7 meetings). M07 has `applied_revision: 1` and 0 transcript turns. |
| **Step 3: Idempotency Re-Import** | Click **Import 01_initial.json (Rev 1)** again. | Records count remains exactly **44**. 44 records reported as **Ignored**. Metrics do not inflate. |
| **Step 4: Set Manual Route on M07** | Go to **Routing & Review** (or Inbox), find **M07**, change primary route to **Customer Success**, enter notes (e.g. *"Customer demonstrated 4 critical bugs"*), and click **Save Decision**. | **M07** displays the purple **Manual Override** badge. |
| **Step 5: Apply Update Delivery** | In **Import History**, click **Apply 02_update.json (Rev 2)**. | M07 updates to `applied_revision: 2`. Usable transcripts increase from **17 to 18**. Total records remain **44**. |
| **Step 6: Verify Override & Transcript** | Open **M07** in drawer. | **Manual route (`customer_success`) remains active**. The new **27-turn transcript** is visible. Analysis is flagged with a **Stale Analysis** banner until refreshed. |
| **Step 7: Refresh or Restart Browser** | Press F5 or restart the dev server. | All data, M07's 27-turn transcript, and the manual override persist completely from browser IndexedDB. |
| **Step 8: Monotonic Reversion Protection** | In **Import History**, click **Import 01_initial.json (Rev 1)** again. | All 44 records ignored. M07 remains at Revision 2 with its updated transcript and manual override intact. |

---

## 4. Key Metric Definitions & Verified Denominators

| Metric | Verified Value | Mathematical Formula & Denominator | Caveat / Interpretation |
|---|---|---|---|
| **Total Unique Records** | **44** | Count of distinct `(source_type, source_id)` tuples. | 30 Calls + 14 Meetings. Re-imports do not inflate. |
| **Usable Transcripts** | **18** *(post-update)* | Count of calls with plain text + meetings with &ge; 1 turn. | 17 initially; M07 adds the 18th in update delivery. |
| **Transcript Coverage** | **40.9%** (18/44) | Usable Transcripts / Total Selected Records (44) * 100. | Calls: 10/30 (33.3%). Meetings: 8/14 (57.1%). |
| **Reported Connect Rate** | **36.7%** (11/30) | Calls with `is_connected = true` / Calls with non-null `is_connected`. | **Upstream telephony switch tag only**. B11 & B14 were 0-speech ghost connects; C04 was tagged false despite a voicemail. |
| **Needs Review / Stale** | Dynamic | Count in `pending_review`, `analysis_stale`, or `needs_more_info`. | Prioritizes unverified intake and updated source text. |
| **Manual Overrides** | Dynamic | Count of records where `manual_override = true`. | Preserved across deliveries. |

---

## 5. Export Archive & Manifest Structure

Clicking **"Generate & Download ZIP"** in the **Exports** tab produces `SpendNest_Revenue_Intelligence_Export_2026-08-21.zip` generated client-side with JSZip:

```text
export/
├── manifest.json              # Machine-readable schema of all outputs and applied revisions
├── manifest.csv               # CSV format manifest for spreadsheet auditing
├── manager_brief/
│   └── 2026-08-21.md          # Complete executive manager briefing in Asia/Kolkata timezone
├── sales_coaching/            # Structured coaching dossiers (C01, C06, C10)
├── deal_follow_up/            # Commercial qualification & next-step files (C03, C08, M03, M06)
├── customer_success/          # Retention & bug triage dossiers (M04, M07, M09)
├── partner_follow_up/         # Strategic partnership files (C07, M01)
├── internal_vendor/           # Procurement & training walkthroughs (M02, M10)
├── manual_review/             # Intake state records for conversations without usable text
└── source_records/            # Raw unadulterated source payloads (30 calls, 14 meetings)
    ├── calls/
    └── meetings/
```

- **Manifest Verifiability:** 100% of paths in `manifest.json` and `manifest.csv` correspond strictly to files packaged inside the ZIP.
- **Multi-Route Linking:** Conversations assigned multiple destinations output to each respective route folder referencing the identical source identity.

---

## 6. Analysis Approach & AI Disclosure

- **Embedded Deterministic Catalog:** To ensure 100% offline reproducibility, zero API key dependencies, and instantaneous unit tests, analyses for all 18 conversations are structured into a deterministic catalog (`PRE_GENERATED_ANALYSES`).
- **Dynamic Heuristic Fallback:** Any new or uncataloged transcript is processed dynamically by a keyword routing engine.
- **AI Tooling Disclosure:** AI coding assistants were utilized for UI scaffolding, TypeScript interfaces, and parsing raw transcript excerpts. All analytical conclusions and evidence citations were manually verified against the conversation records.

---

## 7. Submission Deliverables Included in this Package

1. **Editable Source Code:** Fully typed React + TypeScript + Vite project with `package.json` and lockfile.
2. **Automated Vitest Test Suite:** `src/tests/dataIntegrity.test.ts` passing all 15 contract requirements.
3. **Real Sample Export ZIP:** [`SpendNest_Revenue_Intelligence_Export_2026-08-21.zip`](./SpendNest_Revenue_Intelligence_Export_2026-08-21.zip).
4. **Five-Slide Presentation:** [`SpendNest_Revenue_Intelligence_Presentation.pptx`](./SpendNest_Revenue_Intelligence_Presentation.pptx).
5. **Architectural Decisions:** Detailed rationale and findings in [`DECISIONS.md`](./DECISIONS.md).

---

## 8. Checklist for 3-Minute Spoken Narration Screen Recording

Prepare your screen capture using the following structured script:

- [ ] **0:00 - 0:30 (Manager Overview & Core Metric):**
  - Open application on **Overview** dashboard.
  - Explain the **Source-Reported Connection Rate** metric (36.7%, 11/30 calls). Hover over the info tooltip and explain why this reflects upstream telephony switch tags rather than ground truth (cite B11/B14 ghost connects vs C04 voicemail).
- [ ] **0:30 - 1:15 (Difficult Routing Decision):**
  - Navigate to **Conversation Inbox** or **Routing & Review**.
  - Open **M04 (Cedarwave Distribution)**. Explain why this was difficult: scheduled as a routine card migration, but the customer revealed strong resistance to prepaid cards and threatened churn unless their INR 1.3 crore bank credit line could be integrated.
  - Show the primary routing to **Customer Success** (P1 Churn Retention) and secondary to **Deal Follow-Up**.
- [ ] **1:15 - 2:15 (Replay & M07 Acceptance Test):**
  - Navigate to **Import History**.
  - Demonstrate idempotency: click **Import 01_initial.json** again — show that record count stays at 44 and 44 records are ignored.
  - Show **M07** before update (0 transcript turns). Set a manual route override (e.g. `customer_success`) with a custom manager note and save.
  - Apply **02_update.json (Rev 2)**.
  - Show that M07 now has its **27-turn transcript**, but the **manual override is preserved**. Note the **Analysis Stale** alert.
- [ ] **2:15 - 2:45 (Persistence & Export Archive):**
  - Press **F5 (Refresh)** to prove that state, transcripts, and manual overrides persist in IndexedDB.
  - Navigate to **Exports** tab, click **Generate & Download ZIP**, open the ZIP and show `manifest.json` and route folders.
- [ ] **2:45 - 3:00 (Summary & Manager Brief):**
  - Open **Manager Brief** for 21 August 2026. Highlight Finding 3 (M07 UI caching bugs in Mark as Paid) and wrap up.

---

## 9. Approximate Effort & Known Limitations

- **Approximate Time Spent:** ~7.5 hours of engineering, analysis, and verification.
- **Known Limitations:**
  - Single-day dataset extract (all activity occurs on 21 August 2026).
  - External recording URLs use the `.invalid` TLD per data contract; playable audio streams are not present.
  - No live CRM API integration (intentionally avoided to prevent external dependency or credential requirements).
