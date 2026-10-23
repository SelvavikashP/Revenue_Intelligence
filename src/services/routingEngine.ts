import { RouteCategory, RouteDetail, ConversationAnalysis } from '../types/routing';
import { PRE_GENERATED_ANALYSES } from '../data/analysisCatalog';
import { EnvelopeRecord } from '../types/envelope';

export interface RouteResolution {
  suggested_routes: RouteCategory[];
  primary_suggested_route: RouteCategory;
  analysis: ConversationAnalysis | null;
}

export function determineRoutesAndAnalysis(
  record: EnvelopeRecord,
  hasUsableTranscript: boolean,
  currentRevision: number
): RouteResolution {
  // Rule: Do NOT fabricate substantive analysis for records without usable text!
  if (!hasUsableTranscript) {
    return {
      suggested_routes: ['manual_review'],
      primary_suggested_route: 'manual_review',
      analysis: null,
    };
  }

  // Check pre-generated catalog by record_ref or source_id
  const catalogEntry = PRE_GENERATED_ANALYSES[record.record_ref];
  if (catalogEntry) {
    const analysis: ConversationAnalysis = {
      summary: catalogEntry.summary,
      primary_route: catalogEntry.primary_route,
      routes: catalogEntry.routes as RouteDetail[],
      differentiated: catalogEntry.differentiated,
      evidence_citations: catalogEntry.evidence_citations,
      what_is_unestablished: catalogEntry.what_is_unestablished,
      analysis_revision: currentRevision,
    };

    return {
      suggested_routes: catalogEntry.suggested_routes,
      primary_suggested_route: catalogEntry.primary_route,
      analysis,
    };
  }

  // Deterministic fallback for any other text
  const text =
    record.source_type === 'call'
      ? (record.payload as any).transcript || ''
      : (record.transcript_payload?.turns || []).map((t) => t.text).join(' ');

  const lower = text.toLowerCase();
  const routes: RouteCategory[] = [];

  if (lower.includes('partner') || lower.includes('referral') || lower.includes('commission')) {
    routes.push('partner_follow_up');
  }
  if (lower.includes('bug') || lower.includes('issue') || lower.includes('not working') || lower.includes('error')) {
    routes.push('customer_success');
  }
  if (lower.includes('pricing') || lower.includes('quote') || lower.includes('proposal') || lower.includes('budget')) {
    routes.push('deal_follow_up');
  }
  if (lower.includes('vendor') || lower.includes('supplier') || lower.includes('training')) {
    routes.push('internal_vendor');
  }
  if (routes.length === 0) {
    routes.push('manual_review');
  }

  const primary = routes[0];

  const analysis: ConversationAnalysis = {
    summary: 'Automated heuristic analysis based on transcript keywords.',
    primary_route: primary,
    routes: [
      {
        category: primary,
        explanation: `Keyword match identified potential category: ${primary}.`,
        confidence: 'medium',
        next_action: 'Manager review required to confirm routing.',
        action_owner: 'Manager',
        observed_facts: ['Conversation contains relevant domain keywords.'],
        inferences: ['Heuristic matching.'],
        unestablished: ['Detailed buyer intent unverified.'],
        evidence: [],
      },
    ],
    differentiated: {},
    evidence_citations: [],
    what_is_unestablished: ['Automated classification without manual verification.'],
    analysis_revision: currentRevision,
  };

  return {
    suggested_routes: routes,
    primary_suggested_route: primary,
    analysis,
  };
}
