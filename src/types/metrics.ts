import { RouteCategory } from './routing';

export interface MetricDefinition {
  id: string;
  label: string;
  formula: string;
  numerator: string;
  denominator: string;
  caveat: string;
}

export interface RepActivityMetric {
  name: string;
  email: string | null;
  totalCalls: number;
  connectedCalls: number;
  usableTranscripts: number;
  totalTalkTimeSeconds: number;
}

export interface OrganizerActivityMetric {
  email: string;
  totalMeetings: number;
  usableTranscripts: number;
  recordedMeetings: number;
  cancelledMeetings: number;
}

export interface DashboardMetrics {
  totalUniqueRecords: number;
  totalCalls: number;
  totalMeetings: number;
  usableTranscriptsCount: number;
  transcriptCoveragePct: number;
  callsCoveragePct: number;
  meetingsCoveragePct: number;
  recordsRequiringReview: number;
  missingOrUnusableTextCount: number;
  manualOverrideCount: number;

  // Source-reported connection metric
  sourceReportedConnectedCalls: number;
  sourceReportedEligibleCalls: number; // is_connected !== null
  sourceReportedUnknownCalls: number; // is_connected === null
  sourceReportedConnectionRatePct: number;

  // Route breakdown
  routeAssignments: Record<RouteCategory, number>;
  uniqueRecordsByRoute: Record<RouteCategory, number>;

  // Activity breakdown
  repsActivity: RepActivityMetric[];
  organizersActivity: OrganizerActivityMetric[];
}

export interface FollowUpItem {
  record_ref: string;
  source_type: 'call' | 'meeting';
  source_id: string;
  entityName: string;
  primaryRoute: RouteCategory;
  priority: 'high' | 'medium' | 'low';
  title: string;
  action: string;
  owner: string;
  evidenceQuote: string;
  evidenceRef: string;
}
