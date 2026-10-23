import { CallPayload, MeetingPayload, MeetingTranscriptPayload, SourceType } from './envelope';
import { ConversationAnalysis, RouteCategory } from './routing';

export type ReviewState =
  | 'pending_review'
  | 'reviewed'
  | 'needs_more_info'
  | 'analysis_stale'
  | 'no_usable_transcript';

export type ProcessingState =
  | 'completed'
  | 'no_usable_text'
  | 'awaiting_transcript';

export interface UnifiedRecord {
  // Identity: EXACTLY (source_type, source_id)
  source_type: SourceType;
  source_id: string;
  record_ref: string; // Reading reference, convenience only

  // Revisions & Timestamps
  applied_revision: number;
  exported_at: string;
  activity_timestamp: string; // started_at for calls, starts_at for meetings
  activity_date_kolkata: string; // YYYY-MM-DD in Asia/Kolkata timezone

  // Source Payloads (Replaced in full on higher revision)
  call_payload: CallPayload | null;
  meeting_payload: MeetingPayload | null;
  transcript_payload: MeetingTranscriptPayload | null;

  // Normalized Fields for Presentation & Filtering
  person_name: string; // rep_name for calls, organizer_email for meetings
  person_role: 'call_rep' | 'meeting_organizer';
  title_or_target: string;
  direction: string | null;
  duration_seconds: number;
  has_usable_transcript: boolean;
  transcript_excerpt: string;
  full_transcript_text: string | null;

  // Automated Routing & Analysis (Kept separate from source payload)
  suggested_routes: RouteCategory[];
  primary_suggested_route: RouteCategory;
  analysis_revision: number;
  analysis_stale: boolean;
  analysis: ConversationAnalysis | null;

  // User-Managed Overrides & Review State (Preserved on source revision changes!)
  manual_routes: RouteCategory[] | null;
  primary_manual_route: RouteCategory | null;
  manual_override: boolean;
  manager_notes: string;
  review_state: ReviewState;
  processing_state: ProcessingState;
  updated_at: string;
}

export interface ConversationFilterState {
  searchQuery: string;
  sourceType: 'all' | 'call' | 'meeting';
  person: string; // 'all' or specific name/email
  routeCategory: 'all' | RouteCategory;
  transcriptAvailability: 'all' | 'has_transcript' | 'no_transcript';
  reviewState: 'all' | ReviewState;
  manualOverrideOnly: boolean;
  analysisFreshness: 'all' | 'fresh' | 'stale';
  sortBy: 'date_desc' | 'date_asc' | 'review_priority' | 'ref_asc';
}
