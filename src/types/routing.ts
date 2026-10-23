import { SourceType } from './envelope';

export type RouteCategory =
  | 'sales_coaching'
  | 'deal_follow_up'
  | 'customer_success'
  | 'partner_follow_up'
  | 'internal_vendor'
  | 'manual_review';

export interface RouteMetadata {
  id: RouteCategory;
  label: string;
  shortDescription: string;
  badgeColor: string;
  accentColor: string;
}

export const ROUTE_TAXONOMY: Record<RouteCategory, RouteMetadata> = {
  sales_coaching: {
    id: 'sales_coaching',
    label: 'Sales Coaching',
    shortDescription: 'Rep performance evaluation, discovery structure, objection handling & coaching opportunities.',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    accentColor: '#d97706',
  },
  deal_follow_up: {
    id: 'deal_follow_up',
    label: 'Deal Follow-Up',
    shortDescription: 'Prospect qualification, pricing discussion, next steps, buying stakeholder alignment.',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    accentColor: '#2563eb',
  },
  customer_success: {
    id: 'customer_success',
    label: 'Customer Success',
    shortDescription: 'Existing client adoption, bug escalation, migration support & operational account reviews.',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    accentColor: '#059669',
  },
  partner_follow_up: {
    id: 'partner_follow_up',
    label: 'Partner Follow-Up',
    shortDescription: 'Advisory, channel partner agreements, referral commission structures & partner collateral.',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    accentColor: '#7c3aed',
  },
  internal_vendor: {
    id: 'internal_vendor',
    label: 'Internal / Vendor',
    shortDescription: 'Vendor evaluation, external software procurement, internal operations & training walkthroughs.',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    accentColor: '#475569',
  },
  manual_review: {
    id: 'manual_review',
    label: 'Manual Review',
    shortDescription: 'Ambiguous business intent, conflicting signals, unclassified outcome or insufficient transcript evidence.',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    accentColor: '#e11d48',
  },
};

export interface EvidenceCitation {
  record_ref: string;
  source_type: SourceType;
  turn_number?: number; // 1-based turn number for meetings
  timecode?: string;
  speaker?: string;
  quote: string;
  rationale?: string;
}

export interface RouteDetail {
  category: RouteCategory;
  explanation: string;
  confidence: 'high' | 'medium' | 'low' | 'ambiguous';
  evidence: EvidenceCitation[];
  next_action: string;
  action_owner: string | null;
  observed_facts: string[];
  inferences: string[];
  unestablished: string[];
}

export interface SalesCoachingAspects {
  opening: string;
  discovery: string;
  objection_handling: string;
  communication_effectiveness: string;
  coaching_recommendation: string;
}

export interface DealFollowUpAspects {
  prospect_interest: string;
  unresolved_concerns: string;
  timeline_budget: string;
  next_steps: string;
  confirmed_owner: string | null;
}

export interface CustomerSuccessAspects {
  support_needs: string;
  adoption_issues: string;
  customer_commitments: string;
  technical_blockers: string[];
}

export interface PartnerFollowUpAspects {
  partner_type: string;
  commercial_model: string;
  referral_process: string;
  next_steps: string;
}

export interface InternalVendorAspects {
  interaction_type: 'procurement' | 'operations' | 'training';
  supplier_or_tool: string;
  operational_commitments: string;
  pricing_model: string;
}

export interface ManualReviewAspects {
  ambiguity_reasons: string[];
  missing_information: string[];
  manager_decision_needed: string;
}

export interface DifferentiatedAnalysis {
  sales_coaching?: SalesCoachingAspects;
  deal_follow_up?: DealFollowUpAspects;
  customer_success?: CustomerSuccessAspects;
  partner_follow_up?: PartnerFollowUpAspects;
  internal_vendor?: InternalVendorAspects;
  manual_review?: ManualReviewAspects;
}

export interface ConversationAnalysis {
  summary: string;
  primary_route: RouteCategory;
  routes: RouteDetail[];
  differentiated: DifferentiatedAnalysis;
  evidence_citations: EvidenceCitation[];
  what_is_unestablished: string[];
  analysis_revision: number;
}
