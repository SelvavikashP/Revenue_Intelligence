import { UnifiedRecord } from '../types/conversation';

export function generateManagerBriefMarkdown(records: UnifiedRecord[], dateKolkata = '2026-08-21'): string {
  const total = records.length;
  const calls = records.filter((r) => r.source_type === 'call');
  const meetings = records.filter((r) => r.source_type === 'meeting');
  const usableCalls = calls.filter((c) => c.has_usable_transcript).length;
  const usableMeetings = meetings.filter((m) => m.has_usable_transcript).length;
  const usableTotal = usableCalls + usableMeetings;

  return `# SpendNest Sales & Revenue Intelligence Manager Brief
**Date of Record:** ${dateKolkata} (Asia/Kolkata Timezone)  
**Report Generated:** ${new Date().toISOString()}  
**Sample Coverage:** 44 selected interaction records (30 telephone calls, 14 scheduled calendar meetings)

---

## 1. Executive Summary & Activity Overview

On 21 August 2026, the SpendNest commercial and operational teams recorded **44 unique source interactions**:
- **Telephone Calls:** 30 records (10 with adapted substantive conversation text, 20 background dials without audio).
- **Calendar Meetings:** 14 records (${usableMeetings} with usable speaker turns, ${14 - usableMeetings} without speech or cancelled).
- **Usable Transcript Coverage:** ${usableTotal} of ${total} records (${((usableTotal / (total || 1)) * 100).toFixed(1)}%).
- **Upstream Connection Rate (Calls):** 11 of 30 calls (36.7%) recorded as \`is_connected = true\` by the phone system. However, 2 of those (B11, B14) were single-speaker unresponsive calls with zero speech, while C04 was classified as \`is_connected = false\` despite leaving a full 95-second sales voicemail.

> **Methodological Boundary:** This briefing derives exclusively from the 44 adapted source records in this delivery. This is a selected interaction sample for workflow evaluation, NOT a complete team census or representative employee performance ranking. No cross-rep rankings or unverified revenue pipeline calculations are made.

---

## 2. High-Impact Strategic Conversations

### A. Customer Retention & Migration Threat: Cedarwave Distribution (M04)
- **Account Context:** Existing SpendNest customer with multi-user corporate spend. Current card programme is being terminated due to network acceptance issues.
- **The Core Issue:** Customer stated unequivocally: *"moving from prepaid to credit is the main issue for us. At some stage we will have to consider another option for that."* (Turn 11).
- **Strategic Opportunity:** Cedarwave holds an existing **INR 1.3 crore corporate bank credit line** (Turn 22). They proposed SpendNest act as an expense management software layer over their bank cards.
- **Immediate Action:** Check technical and programme feasibility of ingesting Cedarwave's bank credit card feed. Do not force another prepaid wallet programme without this bridge.

### B. High-Urgency Software Bug Triage: Willowfield Trust (M07)
- **Account Context:** Active operational customer screen-sharing 4 critical UI workflow bugs with Team member A.
- **Bug 1 (Description Save Failure):** Editing event-payment description appears to save, but main screen continues showing old text (Turn 3).
- **Bug 2 (Attachment Upload Blocker):** "Recreate payment" screen rejects file uploads; temporary workaround verified via Bill Pay inbox (Turn 10-13).
- **Bug 3 (Stuck Reimbursements):** Released reimbursement transactions stuck indefinitely in "Processing" state (Turn 19).
- **Bug 4 (Form Cache Glitch):** "Mark as paid" retains previous item's INR 18,200 amount rather than refreshing for the next item (Turn 23).
- **Immediate Action:** Escalate all 4 bugs with captured screen recordings to engineering. Send status update to customer within 2 hours as promised.

### C. Commercial Pipeline & Pricing Hurdle: Asterloom Systems (M03)
- **Account Context:** 65-employee prospect reimbursing INR 10–13 lakh monthly.
- **Discovery Finding:** Customer initially believed corporate cards carried a credit facility; learned domestic cards require advance wallet pre-funding (Turn 6).
- **Price Objection:** Customer challenged why annual price increased from INR 26,000 to INR 39,000. Team member A clarified the INR 13,000 difference is a one-time accounting integration setup (Turn 24).
- **Immediate Action:** Deliver an itemized proposal clearly distinguishing recurring annual SaaS subscription from one-time onboarding setup for CFO review (Turn 28).

### D. Scalable Channel Partnership: Harborpath Advisory (M01)
- **Account Context:** Advisory firm assisting foreign companies with US business formation.
- **Agreement Reached:** Partner A agreed to begin onboarding (Turn 12) under SpendNest's partner commission model: **USD 260 activation fee** per approved account, plus tiered spend bonuses ($195 for $6.5k-$32.5k, $390 up to $130k).
- **Operational Requirement:** Partner explicitly rejected manual email intros (Turn 20: *"It cannot depend on me manually writing every email"*). SpendNest agreed to deploy a dedicated tracking link.
- **Immediate Action:** Issue partner memorandum and deliver unique registration link with shared tracking sheet.

---

## 3. Practical Follow-Up Priorities

| Priority | Entity / Account | Reference | Owner | Action Item | Target Due |
|---|---|---|---|---|---|
| **P0 (Urgent)** | Willowfield Trust | M07 | Team member A (CS) | Send 2-hour bug escalation update; verify stuck reimbursement batch release | Immediate |
| **P0 (Urgent)** | Brookmint Holdings | M09 | Team member A (CS/Eng) | Resolve production bug where freshly generated password reset tokens expire instantly | Immediate |
| **P1 (High)** | Cedarwave Distribution | M04 | Team member A (CS) | Confirm bank credit card transaction feed feasibility; schedule department reassignment session | Monday |
| **P1 (High)** | Asterloom Systems | M03 | Team member A (AE) | Deliver itemized cards proposal (INR 26k subscription + INR 13k setup) for CFO review | Monday |
| **P1 (High)** | Harborpath Advisory | M01 | Team member A (Partner) | Send signed partnership memorandum and unique referral tracking link | Monday |
| **P2 (Medium)** | Frontline Locations Group | C08 | Meera (SDR) | Email tailored multi-location proposal to People Ops lead at contact08@example.com | Monday |
| **P2 (Medium)** | Willowbank Advisory | C07 | Dev (SDR) | Send virtual business account proposal via chat app; conduct Monday follow-up call | Monday |
| **P2 (Medium)** | Milan (API Access) | C03 | Kiran (SDR) | Send email titled "Developer access and event notifications — follow-up"; call Monday morning | Monday |

---

## 4. Sales Coaching Opportunities

1. **Cold Call Permission & Positioning (Arun - C01):**
   - *Observation:* Arun pitched "ways to automate finance operations" to Pranav at Harborlight Advisory, provoking immediate pushback: *"This number is for my work, not for people to sell things to me."*
   - *Coaching Focus:* Roleplay 30-second permission-based openings. Validate industry relevance before presenting generic automation solutions.
2. **Recognizing Entrenched Competitors & Knowing When to Exit (Meera - C06 & C10):**
   - *Observation:* On C06 (120+ stores), prospect clearly stated head office visibility was already solved, but Meera continued probing feature questions. On C10, prospect agreed to messaging info but refused phone callbacks; Meera pushed for a Monday call anyway.
   - *Coaching Focus:* Train SDRs to recognize firm prospect boundaries. When an enterprise has in-house tools or requests asynchronous materials, respect that boundary rather than forcing calendar commitments.
3. **Overcoming Audio & Roaming Friction (Kiran - C03):**
   - *Observation:* Handled severe line static and mobile roaming calmly without interrupting Milan. Secured an exact agreed subject line and callback time.
   - *Coaching Focus:* Share C03 as a model example of adapting to poor phone connectivity without losing prospect goodwill.

---

## 5. Three Important Evidence-Backed Findings

### Finding 1: Telephony Connection Status Discordance
- **What was observed:** Upstream phone records classified 11 of 30 calls as connected (\`is_connected = true\`). However, inspecting transcripts reveals that 2 of those calls (B11 and B14) were single-speaker unresponsive calls with 0 speech and 0 conversation (\`is_conversation = false\`). Conversely, call C04 was tagged as \`is_connected = false\` and \`is_conversation = false\` despite rep Arun delivering a comprehensive 95-second voicemail regarding an active deal.
- **Why it matters:** Basing SDR connect-rate bonuses or pipeline activity metrics on raw telephone switch flags inflates false activity while missing genuine outreach efforts.
- **Supporting Evidence:**
  - B11: \`is_connected: true\`, \`is_conversation: false\`, \`observed_outcome: "unresponsive"\` (Duration: 26s, Talk: 26s, Speaker count: 1).
  - C04: \`is_connected: false\`, \`is_conversation: false\`, \`observed_outcome: "voicemail"\` (Duration: 95s; Quote: *"My understanding is that our information first went to the wrong email address... Please call me back"*).
- **Product Impact:** On the **Overview Dashboard**, the connection rate card explicitly isolates source-reported switch numbers from transcript-verified conversations, detailing the denominator and unknown counts with accessible warning tooltips.
- **Uncertainty Remaining:** Telephony switch carrier detection algorithms and exact IVR pickup triggers are upstream black boxes not provided in this extract.

### Finding 2: Enterprise Friction with Prepaid-Only Cards
- **What was observed:** In both major commercial card interactions (Asterloom M03 and Cedarwave M04), enterprise finance leaders expressed strong surprise and resistance toward the domestic prepaid funding model.
- **Why it matters:** Established businesses with existing credit lines (such as Cedarwave's INR 1.3 crore facility) reject tying up corporate working capital in advance wallet deposits. Positioning SpendNest purely as a prepaid card issuer creates unnecessary deal stall and severe account churn risk.
- **Supporting Evidence:**
  - M03 Turn 6: *"Wait, these are prepaid? I had thought about a corporate credit card. So we put money in before anyone spends, and there is no credit facility on these domestic cards?"*
  - M04 Turn 11: *"moving from prepaid to credit is the main issue for us. At some stage we will have to consider another option for that."*
  - M04 Turn 22: *"We already have a corporate credit line of about INR 1.3 crore... If your platform can sit in between, we should understand that route."*
- **Product Impact:** In the **Routing & Analysis Engine**, M04 is assigned to \`customer_success\` with an urgent retention alert rather than a standard migration tag. A dedicated objection handling section was added to the \`deal_follow_up\` view.
- **Uncertainty Remaining:** Technical feasibility of SpendNest's bank card settlement feed has not been confirmed by engineering.

### Finding 3: Client-Side UI Caching & Token Expiry Defects
- **What was observed:** Live customer troubleshooting sessions revealed severe client-side state caching bugs: description edits failing to update on save (M07 Turn 3), document upload rejection on Recreate Payment (M07 Turn 10-13), Mark as Paid retaining previous item's amount (M07 Turn 23), and password reset tokens expiring instantly upon receipt (M09 Turn 21).
- **Why it matters:** These are not cosmetic issues; when Mark as Paid caches INR 18,200 from a previous transaction, finance users risk double-paying or recording erroneous ledger settlements.
- **Supporting Evidence:**
  - M07 Turn 23: *"Let me confirm: it is retaining the previous amount rather than fetching the next payment's value."*
  - M09 Turn 21: *"It says the token has expired. This is the fresh message we just received."*
- **Product Impact:** In the **Conversation Detail** and **Routing Review** screens, M07 and M09 are highlighted with high-severity engineering bug tags, and next steps require immediate ticket logging rather than standard customer training.
- **Uncertainty Remaining:** Whether the Mark as Paid defect stems from React component re-rendering cache or backend session state has not yet been diagnosed.

---

## 6. Ambiguous Cases Requiring Human Judgment

1. **C05 (StoreHarbor Presentation Request):**
   - *Ambiguity:* Prospect operates multi-location stores and uses StoreHarbor. Asked for a presentation: *"What I suggest is that you send me your presentation. If we ever decide to change the providers we already have, we could consider it then."*
   - *Judgment:* A request for a presentation is frequently an executive brush-off. It should NOT be entered into CRM as an active qualified opportunity. Nurture as displacement collateral only.
2. **C09 (Vedant Outreach to Business Head Rishabh):**
   - *Ambiguity:* Vedant pointed rep to Business Head Mr. Rishabh on LinkedIn, but explicitly stated: *"No, please don't use my name."*
   - *Judgment:* Rep must not cite Vedant as an internal referral. Cold outreach must be framed around multi-location retail expense control independently.
`;
}
