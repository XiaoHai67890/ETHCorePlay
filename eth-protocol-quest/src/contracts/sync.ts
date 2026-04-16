export type SyncEntityType = 'track' | 'module' | 'node' | 'glossary' | 'source_ref';
export type SyncChangeType = 'new' | 'updated' | 'review_required';
export type SyncStatus = 'in_sync' | 'diff_detected' | 'awaiting_review';

export type SyncSourceSnapshot = {
  sourceRefId: string;
  sourceTitle: string;
  sourceType: 'course' | 'wiki' | 'repo';
  provider: string;
  url: string;
  syncMode: 'structure-and-index-only';
  fingerprint: string;
  lastCheckedAt: string;
  syncStatus: SyncStatus;
};

export type SyncDiffItem = {
  id: string;
  sourceRefId: string;
  entityType: SyncEntityType;
  entitySlug: string;
  changeType: SyncChangeType;
  upstreamPath: string;
  summaryZh: string;
  requiresReview: boolean;
  lastCheckedAt: string;
};

export type SyncDiffResponse = {
  generatedAt: string;
  pendingCount: number;
  items: SyncDiffItem[];
};

export type SyncSourcesResponse = {
  generatedAt: string;
  total: number;
  items: SyncSourceSnapshot[];
};

export const SYNC_API_ROUTES = {
  listSources: '/api/sync/sources',
  getDiff: '/api/sync/diff'
} as const;
