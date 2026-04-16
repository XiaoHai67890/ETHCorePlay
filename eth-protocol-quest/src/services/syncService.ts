import type { SyncDiffResponse, SyncSourcesResponse } from '../contracts/sync';
import { sourceRefs } from '../data/registry';

function fingerprint(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return `fp_${Math.abs(hash)}`;
}

export async function listSyncSources(): Promise<SyncSourcesResponse> {
  const items = sourceRefs.map((source) => ({
    sourceRefId: source.id,
    sourceTitle: source.sourceTitle,
    sourceType: source.sourceType,
    provider: source.provider,
    url: source.url,
    syncMode: 'structure-and-index-only' as const,
    fingerprint: fingerprint(`${source.id}:${source.url}:${source.lastCheckedAt}`),
    lastCheckedAt: source.lastCheckedAt,
    syncStatus: source.id === 'repo-protocol-studies' ? 'awaiting_review' as const : 'in_sync' as const
  }));

  return {
    generatedAt: sourceRefs[0]?.lastCheckedAt || new Date().toISOString().slice(0, 10),
    total: items.length,
    items
  };
}

export async function getSyncDiff(): Promise<SyncDiffResponse> {
  const items = [
    {
      id: 'sync-diff-protocol-101-structure',
      sourceRefId: 'study-protocol-101',
      entityType: 'track' as const,
      entitySlug: 'protocol-101',
      changeType: 'review_required' as const,
      upstreamPath: '/course/protocol-101',
      summaryZh: '检测到 Protocol 101 课程结构指纹变化。当前策略只同步结构与索引，需人工复核模块树映射。',
      requiresReview: true,
      lastCheckedAt: '2026-04-17'
    },
    {
      id: 'sync-diff-cryptography-proof-systems',
      sourceRefId: 'study-cryptography',
      entityType: 'module' as const,
      entitySlug: 'proof-systems',
      changeType: 'updated' as const,
      upstreamPath: '/course/cryptography/proof-systems',
      summaryZh: 'Proof Systems 模块存在上游内容更新可能，需检查中文导学、术语与输出任务是否仍准确。',
      requiresReview: true,
      lastCheckedAt: '2026-04-17'
    },
    {
      id: 'sync-diff-lean-tooling-new',
      sourceRefId: 'repo-protocol-studies',
      entityType: 'source_ref' as const,
      entitySlug: 'repo-protocol-studies',
      changeType: 'new' as const,
      upstreamPath: '/eth-protocol-fellows/protocol-studies',
      summaryZh: '开源仓库存在新的协作线索，需要审核后再进入生产索引。',
      requiresReview: true,
      lastCheckedAt: '2026-04-17'
    }
  ];

  return {
    generatedAt: '2026-04-17',
    pendingCount: items.filter((item) => item.requiresReview).length,
    items
  };
}
