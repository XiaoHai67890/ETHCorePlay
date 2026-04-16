import type { TrackSlug } from '../data/registry';

export type ContentEntityType = 'track' | 'module' | 'node' | 'glossary';
export type AuthorityLevel = 1;
export type ContentSourceType = 'course' | 'wiki' | 'repo';

export type ApiListResponse<T> = {
  generatedAt: string;
  total: number;
  items: T[];
};

export type ApiDetailResponse<T> = {
  generatedAt: string;
  item: T;
};

export type SourceRefContract = {
  id: string;
  sourceType: ContentSourceType;
  sourceTitle: string;
  provider: string;
  url: string;
  authorityLevel: AuthorityLevel;
  noteZh: string;
  lastCheckedAt: string;
};

export type ContentTrackSummary = {
  slug: TrackSlug;
  titleZh: string;
  titleEn: string;
  oneLinerZh: string;
  difficultyLabel: string;
  moduleCount: number;
  sourceCount: number;
  recommendedEntryModuleSlug: string;
};

export type ContentModuleSummary = {
  slug: string;
  titleZh: string;
  titleEn: string;
  oneLinerZh: string;
  trackSlug: TrackSlug;
  legacyChapterId?: string;
};

export type ContentTrackDetail = ContentTrackSummary & {
  overviewZh: string;
  audienceZh: string;
  prerequisitesZh: string[];
  recommendedOrderZh: string[];
  outputRequirementsZh: string[];
  contributionExitZh: string;
  modules: ContentModuleSummary[];
  sources: SourceRefContract[];
};

export type ContentModuleDetail = ContentModuleSummary & {
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

export type ContentNodeDetail = {
  slug: string;
  titleZh: string;
  titleEn: string;
  summaryZh: string;
  trackSlug: TrackSlug;
  moduleSlugs: string[];
  prerequisiteSlugs: string[];
  glossaryTerms: string[];
  relatedSpecZh: string[];
  relatedClientZh: string[];
  nextRecommended: string[];
  sources: SourceRefContract[];
};

export type GlossaryTermContract = {
  slug: string;
  termEn: string;
  termZh: string;
  aliases: string[];
  discouragedZh: string[];
  definitionZh: string;
  firstRecommendedReadingModuleSlug: string;
  firstRecommendedReadingTitleZh: string;
  trackSlug: TrackSlug;
  relatedNodeSlugs: string[];
  relatedModuleSlugs: string[];
  relatedTermSlugs: string[];
  sources: SourceRefContract[];
};

export type ContentSearchResult = {
  entityType: ContentEntityType;
  slug: string;
  titleZh: string;
  titleEn?: string;
  summaryZh: string;
  href: string;
  trackSlug?: TrackSlug;
  trackTitleZh?: string;
  prerequisiteLabelsZh: string[];
  nextRecommendedLabelZh?: string;
  sourceLabels: string[];
};

export type ContentSearchResponse = {
  generatedAt: string;
  total: number;
  query: string;
  items: ContentSearchResult[];
};

export const CONTENT_API_ROUTES = {
  listTracks: '/api/content/tracks',
  getTrack: (slug: string) => `/api/content/tracks/${slug}`,
  getModule: (slug: string) => `/api/content/modules/${slug}`,
  getNode: (slug: string) => `/api/content/nodes/${slug}`,
  listGlossary: '/api/content/glossary',
  getGlossaryTerm: (slug: string) => `/api/content/glossary/${slug}`,
  search: '/api/content/search'
} as const;
