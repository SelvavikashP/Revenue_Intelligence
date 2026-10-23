import { UnifiedRecord } from '../types/conversation';
import {
  DashboardMetrics,
  FollowUpItem,
  MetricDefinition,
  OrganizerActivityMetric,
  RepActivityMetric,
} from '../types/metrics';
import { RouteCategory } from '../types/routing';

export const METRIC_DEFINITIONS: Record<string, MetricDefinition> = {
  uniqueRecords: {
    id: 'uniqueRecords',
    label: 'Total Unique Records',
    formula: 'Count of distinct (source_type, source_id)',
    numerator: 'Unique logical records',
    denominator: 'N/A (Base count)',
    caveat: 'Re-imports and updates do not inflate this number. Total selected dataset is 44.',
  },
  transcriptCoverage: {
    id: 'transcriptCoverage',
    label: 'Usable Transcript Coverage',
    formula: '(Records with usable text) / (Total selected records) * 100',
    numerator: 'Calls with transcript + Meetings with >= 1 speaker turn',
    denominator: 'Total selected records in current filter',
    caveat: 'Initial batch has 17 texts; update batch brings M07, totaling 18. Other records intentionally have no usable text.',
  },
  connectionRate: {
    id: 'connectionRate',
    label: 'Source-Reported Connection Rate',
    formula: '(Calls with is_connected = true) / (Calls with non-null is_connected) * 100',
    numerator: 'Calls where upstream telephone switch recorded is_connected = true',
    denominator: 'Calls where is_connected is not null',
    caveat: 'Stored system classification only — NOT independently verified ground truth. B11 and B14 were reported connected but were unresponsive, while C04 was reported false despite a voicemail.',
  },
  reviewRequired: {
    id: 'reviewRequired',
    label: 'Records Requiring Review',
    formula: 'Count of records in pending_review, analysis_stale, or needs_more_info states',
    numerator: 'Unreviewed or stale records',
    denominator: 'Total unique records',
    caveat: 'When a late transcript arrives (M07), analysis is marked stale until confirmed by a manager.',
  },
  manualOverrides: {
    id: 'manualOverrides',
    label: 'Manual Route Overrides',
    formula: 'Count of records where manager explicitly saved a custom route',
    numerator: 'Records with manual_override = true',
    denominator: 'Total unique records',
    caveat: 'Manual overrides are strictly preserved across source revisions and application restarts.',
  },
};

export function calculateDashboardMetrics(records: UnifiedRecord[]): DashboardMetrics {
  const totalUniqueRecords = records.length;
  const calls = records.filter((r) => r.source_type === 'call');
  const meetings = records.filter((r) => r.source_type === 'meeting');

  const totalCalls = calls.length;
  const totalMeetings = meetings.length;

  const callsWithTranscript = calls.filter((c) => c.has_usable_transcript).length;
  const meetingsWithTranscript = meetings.filter((m) => m.has_usable_transcript).length;
  const usableTranscriptsCount = callsWithTranscript + meetingsWithTranscript;

  const transcriptCoveragePct = totalUniqueRecords > 0 ? (usableTranscriptsCount / totalUniqueRecords) * 100 : 0;
  const callsCoveragePct = totalCalls > 0 ? (callsWithTranscript / totalCalls) * 100 : 0;
  const meetingsCoveragePct = totalMeetings > 0 ? (meetingsWithTranscript / totalMeetings) * 100 : 0;

  const recordsRequiringReview = records.filter(
    (r) => r.review_state === 'pending_review' || r.review_state === 'analysis_stale' || r.review_state === 'needs_more_info'
  ).length;

  const missingOrUnusableTextCount = records.filter((r) => !r.has_usable_transcript).length;
  const manualOverrideCount = records.filter((r) => r.manual_override).length;

  // Source-reported connection rate (Calls only)
  let sourceReportedConnectedCalls = 0;
  let sourceReportedEligibleCalls = 0;
  let sourceReportedUnknownCalls = 0;

  calls.forEach((c) => {
    const isConn = c.call_payload?.is_connected;
    if (isConn === true) {
      sourceReportedConnectedCalls++;
      sourceReportedEligibleCalls++;
    } else if (isConn === false) {
      sourceReportedEligibleCalls++;
    } else {
      sourceReportedUnknownCalls++;
    }
  });

  const sourceReportedConnectionRatePct =
    sourceReportedEligibleCalls > 0
      ? (sourceReportedConnectedCalls / sourceReportedEligibleCalls) * 100
      : 0;

  // Route breakdown
  const routeAssignments: Record<RouteCategory, number> = {
    sales_coaching: 0,
    deal_follow_up: 0,
    customer_success: 0,
    partner_follow_up: 0,
    internal_vendor: 0,
    manual_review: 0,
  };

  const uniqueRecordsByRoute: Record<RouteCategory, number> = {
    sales_coaching: 0,
    deal_follow_up: 0,
    customer_success: 0,
    partner_follow_up: 0,
    internal_vendor: 0,
    manual_review: 0,
  };

  records.forEach((r) => {
    // All routes tagged on this record
    const activeRoutes = r.manual_override && r.manual_routes ? r.manual_routes : r.suggested_routes;
    activeRoutes.forEach((route) => {
      routeAssignments[route] = (routeAssignments[route] || 0) + 1;
    });

    // Primary route for unique distribution
    const primaryRoute =
      r.manual_override && r.primary_manual_route ? r.primary_manual_route : r.primary_suggested_route;
    if (primaryRoute) {
      uniqueRecordsByRoute[primaryRoute] = (uniqueRecordsByRoute[primaryRoute] || 0) + 1;
    }
  });

  // Call Rep activity breakdown
  const repMap = new Map<string, RepActivityMetric>();
  calls.forEach((c) => {
    const name = c.person_name || 'Unknown Rep';
    const email = c.call_payload?.rep_email || null;
    const existing = repMap.get(name) || {
      name,
      email,
      totalCalls: 0,
      connectedCalls: 0,
      usableTranscripts: 0,
      totalTalkTimeSeconds: 0,
    };

    existing.totalCalls++;
    if (c.call_payload?.is_connected) {
      existing.connectedCalls++;
    }
    if (c.has_usable_transcript) {
      existing.usableTranscripts++;
    }
    existing.totalTalkTimeSeconds += c.call_payload?.talk_time_seconds || 0;

    repMap.set(name, existing);
  });
  const repsActivity = Array.from(repMap.values()).sort((a, b) => b.totalCalls - a.totalCalls);

  // Meeting Organizer activity breakdown
  const orgMap = new Map<string, OrganizerActivityMetric>();
  meetings.forEach((m) => {
    const email = m.person_name || 'Unknown Organizer';
    const existing = orgMap.get(email) || {
      email,
      totalMeetings: 0,
      usableTranscripts: 0,
      recordedMeetings: 0,
      cancelledMeetings: 0,
    };

    existing.totalMeetings++;
    if (m.has_usable_transcript) {
      existing.usableTranscripts++;
    }
    if (m.meeting_payload?.recording_status === 'recorded') {
      existing.recordedMeetings++;
    } else if (m.meeting_payload?.recording_status === 'cancelled') {
      existing.cancelledMeetings++;
    }

    orgMap.set(email, existing);
  });
  const organizersActivity = Array.from(orgMap.values()).sort((a, b) => b.totalMeetings - a.totalMeetings);

  return {
    totalUniqueRecords,
    totalCalls,
    totalMeetings,
    usableTranscriptsCount,
    transcriptCoveragePct,
    callsCoveragePct,
    meetingsCoveragePct,
    recordsRequiringReview,
    missingOrUnusableTextCount,
    manualOverrideCount,
    sourceReportedConnectedCalls,
    sourceReportedEligibleCalls,
    sourceReportedUnknownCalls,
    sourceReportedConnectionRatePct,
    routeAssignments,
    uniqueRecordsByRoute,
    repsActivity,
    organizersActivity,
  };
}

export function getHighPriorityFollowUps(records: UnifiedRecord[]): FollowUpItem[] {
  const followUps: FollowUpItem[] = [];

  // M07 (Willowfield)
  const m07 = records.find((r) => r.record_ref === 'M07');
  if (m07 && m07.has_usable_transcript) {
    followUps.push({
      record_ref: 'M07',
      source_type: 'meeting',
      source_id: m07.source_id,
      entityName: 'Willowfield Trust',
      primaryRoute: 'customer_success',
      priority: 'high',
      title: 'Triage 4 Critical Software UI Bugs',
      action: 'File urgent bug tickets: Description edit failure, upload rejection in Recreate payment, stuck reimbursements, and Mark as Paid cache bug.',
      owner: 'Team member A (CS / Product)',
      evidenceQuote: 'It is retaining the previous amount rather than fetching the next payment\'s value.',
      evidenceRef: 'Turn 23 (00:17:50)',
    });
  }

  // M04 (Cedarwave)
  const m04 = records.find((r) => r.record_ref === 'M04');
  if (m04) {
    followUps.push({
      record_ref: 'M04',
      source_type: 'meeting',
      source_id: m04.source_id,
      entityName: 'Cedarwave Distribution',
      primaryRoute: 'customer_success',
      priority: 'high',
      title: 'Retain Account: Assess Bank Credit Line Feed',
      action: 'Confirm technical feasibility of ingesting Cedarwave\'s INR 1.3 crore bank credit line into SpendNest before card network shutdown.',
      owner: 'Team member A (CS / Programme)',
      evidenceQuote: 'moving from prepaid to credit is the main issue for us. At some stage we will have to consider another option for that.',
      evidenceRef: 'Turn 11 (00:07:17)',
    });
  }

  // M03 (Asterloom)
  const m03 = records.find((r) => r.record_ref === 'M03');
  if (m03) {
    followUps.push({
      record_ref: 'M03',
      source_type: 'meeting',
      source_id: m03.source_id,
      entityName: 'Asterloom Systems',
      primaryRoute: 'deal_follow_up',
      priority: 'high',
      title: 'Send Itemized Proposal for CFO Review',
      action: 'Send cards proposal explicitly breaking out INR 26k annual recurring subscription from INR 13k one-time accounting setup.',
      owner: 'Team member A (AE)',
      evidenceQuote: 'Our CFO approves the larger payments. We need to explain the proposal to them...',
      evidenceRef: 'Turn 28 (00:34:43)',
    });
  }

  // M01 (Harborpath)
  const m01 = records.find((r) => r.record_ref === 'M01');
  if (m01) {
    followUps.push({
      record_ref: 'M01',
      source_type: 'meeting',
      source_id: m01.source_id,
      entityName: 'Harborpath Advisory',
      primaryRoute: 'partner_follow_up',
      priority: 'medium',
      title: 'Deliver Partner Memorandum & Unique Referral Link',
      action: 'Send memorandum for signature and provide unique onboarding link with shared tracking sheet.',
      owner: 'Team member A (Partnerships)',
      evidenceQuote: 'No, let us get the partner onboarding started.',
      evidenceRef: 'Turn 12 (00:10:26)',
    });
  }

  // M09 (Northkite / Brookmint)
  const m09 = records.find((r) => r.record_ref === 'M09');
  if (m09) {
    followUps.push({
      record_ref: 'M09',
      source_type: 'meeting',
      source_id: m09.source_id,
      entityName: 'Brookmint Holdings',
      primaryRoute: 'customer_success',
      priority: 'high',
      title: 'Fix Instant Token Expiration Bug',
      action: 'Investigate production auth issue where freshly sent password reset tokens immediately show as expired.',
      owner: 'Team member A (Engineering / CS)',
      evidenceQuote: 'It says the token has expired. This is the fresh message we just received.',
      evidenceRef: 'Turn 21 (00:13:54)',
    });
  }

  // C08 (Raghav / People Ops)
  const c08 = records.find((r) => r.record_ref === 'C08');
  if (c08) {
    followUps.push({
      record_ref: 'C08',
      source_type: 'call',
      source_id: c08.source_id,
      entityName: 'Frontline Locations Group',
      primaryRoute: 'deal_follow_up',
      priority: 'medium',
      title: 'Contact People Ops Lead at contact08@example.com',
      action: 'Send proposal for multi-location expense and instant-payments platform referencing conversation with Raghav.',
      owner: 'Meera (SDR)',
      evidenceQuote: 'If you send him a proposal and say you spoke with me, he can take a look.',
      evidenceRef: 'Call Adapted Text',
    });
  }

  // C07 (Willowbank Advisory)
  const c07 = records.find((r) => r.record_ref === 'C07');
  if (c07) {
    followUps.push({
      record_ref: 'C07',
      source_type: 'call',
      source_id: c07.source_id,
      entityName: 'Willowbank Advisory',
      primaryRoute: 'partner_follow_up',
      priority: 'medium',
      title: 'Send Chat Proposal & Dial Monday',
      action: 'Send virtual account partnership proposal via messaging app to Mr. Aditya and follow up Monday.',
      owner: 'Dev (SDR)',
      evidenceQuote: 'could you message me on our chat app and send whatever proposal you have?... call on Monday',
      evidenceRef: 'Call Adapted Text',
    });
  }

  return followUps;
}
