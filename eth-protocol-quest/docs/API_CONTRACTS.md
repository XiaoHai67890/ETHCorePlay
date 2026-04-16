# ETHCorePlay Content / Sync API Contracts

状态：frozen for current phase  
适用范围：Content Service / Sync Service  
说明：当前前端已通过本地 registry-backed adapter 消费这些 contract。后续真实后端必须保持响应 shape 不变。

## 1. Content Service

### `GET /api/content/tracks`

返回 Track 列表摘要。

```ts
type Response = {
  generatedAt: string;
  total: number;
  items: Array<{
    slug: 'protocol-101' | 'cryptography' | 'lean-zkevm';
    titleZh: string;
    titleEn: string;
    oneLinerZh: string;
    difficultyLabel: string;
    moduleCount: number;
    sourceCount: number;
    recommendedEntryModuleSlug: string;
  }>;
}
```

### `GET /api/content/tracks/:slug`

返回 Track 详情。

```ts
type Response = {
  generatedAt: string;
  item: {
    slug: string;
    titleZh: string;
    titleEn: string;
    oneLinerZh: string;
    difficultyLabel: string;
    moduleCount: number;
    sourceCount: number;
    recommendedEntryModuleSlug: string;
    overviewZh: string;
    audienceZh: string;
    prerequisitesZh: string[];
    recommendedOrderZh: string[];
    outputRequirementsZh: string[];
    contributionExitZh: string;
    modules: ContentModuleSummary[];
    sources: SourceRefContract[];
  };
}
```

### `GET /api/content/modules/:slug`

返回 Module 详情。

```ts
type Response = {
  generatedAt: string;
  item: {
    slug: string;
    titleZh: string;
    titleEn: string;
    oneLinerZh: string;
    trackSlug: string;
    legacyChapterId?: string;
    solvesZh: string;
    summaryZh: string[];
    prerequisites: ContentModuleSummary[];
    commonPitfallsZh: string[];
    checkpointZh: string;
    outputTaskZh: string;
    glossaryTerms: string[];
    nodeSlugs: string[];
    nextModules: ContentModuleSummary[];
    sources: SourceRefContract[];
  };
}
```

### `GET /api/content/nodes/:slug`

返回 Knowledge Node 详情。

```ts
type Response = {
  generatedAt: string;
  item: {
    slug: string;
    titleZh: string;
    titleEn: string;
    summaryZh: string;
    trackSlug: string;
    moduleSlugs: string[];
    prerequisiteSlugs: string[];
    glossaryTerms: string[];
    relatedSpecZh: string[];
    relatedClientZh: string[];
    nextRecommended: string[];
    sources: SourceRefContract[];
  };
}
```

### `GET /api/content/glossary`

返回术语表列表。

```ts
type Response = {
  generatedAt: string;
  total: number;
  items: Array<{
    slug: string;
    termEn: string;
    termZh: string;
    aliases: string[];
    discouragedZh: string[];
    definitionZh: string;
    firstRecommendedReadingModuleSlug: string;
    firstRecommendedReadingTitleZh: string;
    trackSlug: string;
    relatedNodeSlugs: string[];
    relatedModuleSlugs: string[];
    relatedTermSlugs: string[];
    sources: SourceRefContract[];
  }>;
}
```

### `GET /api/content/glossary/:slug`

返回单个术语详情，shape 与 glossary list item 相同。

### `GET /api/content/search?q=...`

统一搜索接口。返回结果必须至少说明：

- 它是什么
- 属于哪个 Track
- 前置模块是什么
- 上游入口有哪些
- 推荐下一步是什么

```ts
type Response = {
  generatedAt: string;
  total: number;
  query: string;
  items: Array<{
    entityType: 'track' | 'module' | 'node' | 'glossary';
    slug: string;
    titleZh: string;
    titleEn?: string;
    summaryZh: string;
    href: string;
    trackSlug?: string;
    trackTitleZh?: string;
    prerequisiteLabelsZh: string[];
    nextRecommendedLabelZh?: string;
    sourceLabels: string[];
  }>;
}
```

## 2. Shared Content Object

### `SourceRefContract`

```ts
type SourceRefContract = {
  id: string;
  sourceType: 'course' | 'wiki' | 'repo';
  sourceTitle: string;
  provider: string;
  url: string;
  authorityLevel: 1;
  noteZh: string;
  lastCheckedAt: string;
}
```

## 3. Sync Service

### `GET /api/sync/sources`

返回上游 source snapshot，只允许表达“结构与索引同步”状态，不返回全文内容。

```ts
type Response = {
  generatedAt: string;
  total: number;
  items: Array<{
    sourceRefId: string;
    sourceTitle: string;
    sourceType: 'course' | 'wiki' | 'repo';
    provider: string;
    url: string;
    syncMode: 'structure-and-index-only';
    fingerprint: string;
    lastCheckedAt: string;
    syncStatus: 'in_sync' | 'diff_detected' | 'awaiting_review';
  }>;
}
```

### `GET /api/sync/diff`

返回待审核 diff。只有审核通过后，才允许进入生产内容索引。

```ts
type Response = {
  generatedAt: string;
  pendingCount: number;
  items: Array<{
    id: string;
    sourceRefId: string;
    entityType: 'track' | 'module' | 'node' | 'glossary' | 'source_ref';
    entitySlug: string;
    changeType: 'new' | 'updated' | 'review_required';
    upstreamPath: string;
    summaryZh: string;
    requiresReview: boolean;
    lastCheckedAt: string;
  }>;
}
```

## 4. Implementation Rule

- 前端页面只能通过 service adapter 消费这些 contract，不直接耦合底层 registry shape。
- 后续若替换为真实后端，请保持 endpoint 和响应 shape 不变。
- 若 contract 变更，必须同步更新：
  - `src/contracts/*.ts`
  - `docs/API_CONTRACTS.md`
  - 受影响页面与 service adapter
