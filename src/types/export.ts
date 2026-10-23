import { RouteCategory } from './routing';
import { ProcessingState, ReviewState } from './conversation';
import { SourceType } from './envelope';

export interface ExportManifestRecord {
  source_type: SourceType;
  source_id: string;
  record_ref: string;
  applied_revision: number;
  routes: RouteCategory[];
  output_paths: string[];
  processing_state: ProcessingState;
  review_state: ReviewState;
  manual_override: boolean;
  analysis_revision: number;
  analysis_stale: boolean;
}

export interface ExportManifest {
  generated_at: string;
  export_scope: 'all_routed' | 'filtered' | 'selected';
  total_records: number;
  total_files_generated: number;
  manifest_records: ExportManifestRecord[];
}
