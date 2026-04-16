import type {
  ApiDetailResponse,
  ApiListResponse,
  ContentModuleDetail,
  ContentModuleSummary,
  ContentSearchResponse,
  ContentSearchResult,
  ContentTrackDetail,
  ContentTrackSummary,
  GlossaryTermContract,
  SourceRefContract
} from '../contracts/content';
import { registryGlossary } from '../data/registryGlossary';
import {
  getKnowledgeNodeBySlug,
  getModuleBySlug,
  getModuleDependencies,
  getModulesForTrack,
  getModuleSources,
  getNextModules,
  getNodeSources,
  sourceRefs,
  getTrackBySlug,
  getTrackSources,
  knowledgeNodes,
  modules,
  registryUpdatedAt,
  tracks
} from '../data/registry';

function toSourceContract(source: {
  id: string;
  sourceType: 'course' | 'wiki' | 'repo';
  sourceTitle: string;
  provider: string;
  url: string;
  authorityLevel: 1;
  noteZh: string;
  lastCheckedAt: string;
}): SourceRefContract {
  return { ...source };
}

function toModuleSummary(module: {
  slug: string;
  titleZh: string;
  titleEn: string;
  oneLinerZh: string;
  track: string;
  legacyChapterId?: string;
}): ContentModuleSummary {
  return {
    slug: module.slug,
    titleZh: module.titleZh,
    titleEn: module.titleEn,
    oneLinerZh: module.oneLinerZh,
    trackSlug: module.track as ContentModuleSummary['trackSlug'],
    legacyChapterId: module.legacyChapterId
  };
}

function trackTitleZh(trackSlug?: string) {
  return tracks.find((track) => track.slug === trackSlug)?.titleZh;
}

function buildSearchResult(
  input: Omit<ContentSearchResult, 'prerequisiteLabelsZh' | 'sourceLabels'> & {
    prerequisiteLabelsZh?: string[];
    sourceLabels?: string[];
  }
): ContentSearchResult {
  return {
    prerequisiteLabelsZh: input.prerequisiteLabelsZh || [],
    sourceLabels: input.sourceLabels || [],
    ...input
  };
}

function rankSearch(query: string, text: string, title: string) {
  const normalizedQuery = query.trim().toLowerCase().replace(/[-_/]+/g, ' ');
  const haystack = text.toLowerCase().replace(/[-_/]+/g, ' ');
  const normalizedTitle = title.toLowerCase().replace(/[-_/]+/g, ' ');

  if (!normalizedQuery) return 0;
  if (normalizedTitle === normalizedQuery) return 100;
  if (normalizedTitle.startsWith(normalizedQuery)) return 80;
  if (haystack.includes(normalizedQuery)) return 40;

  const queryParts = normalizedQuery.split(/\s+/).filter(Boolean);
  return queryParts.reduce((score, part) => score + (haystack.includes(part) ? 8 : 0), 0);
}

export async function listTracks(): Promise<ApiListResponse<ContentTrackSummary>> {
  const items = tracks.map((track) => ({
    slug: track.slug,
    titleZh: track.titleZh,
    titleEn: track.titleEn,
    oneLinerZh: track.oneLinerZh,
    difficultyLabel: track.difficultyLabel,
    moduleCount: track.moduleSlugs.length,
    sourceCount: track.sourceRefIds.length,
    recommendedEntryModuleSlug: track.moduleSlugs[0]
  }));

  return {
    generatedAt: registryUpdatedAt,
    total: items.length,
    items
  };
}

export async function getTrackDetail(slug: string): Promise<ApiDetailResponse<ContentTrackDetail> | null> {
  const track = getTrackBySlug(slug);
  if (!track) return null;

  const modulesForTrack = getModulesForTrack(track.slug).map(toModuleSummary);
  const item: ContentTrackDetail = {
    slug: track.slug,
    titleZh: track.titleZh,
    titleEn: track.titleEn,
    oneLinerZh: track.oneLinerZh,
    difficultyLabel: track.difficultyLabel,
    moduleCount: track.moduleSlugs.length,
    sourceCount: track.sourceRefIds.length,
    recommendedEntryModuleSlug: track.moduleSlugs[0],
    overviewZh: track.overviewZh,
    audienceZh: track.audienceZh,
    prerequisitesZh: track.prerequisitesZh,
    recommendedOrderZh: track.recommendedOrderZh,
    outputRequirementsZh: track.outputRequirementsZh,
    contributionExitZh: track.contributionExitZh,
    modules: modulesForTrack,
    sources: getTrackSources(track).map(toSourceContract)
  };

  return {
    generatedAt: registryUpdatedAt,
    item
  };
}

export async function getModuleDetail(slug: string): Promise<ApiDetailResponse<ContentModuleDetail> | null> {
  const module = getModuleBySlug(slug);
  if (!module) return null;

  const item: ContentModuleDetail = {
    ...toModuleSummary(module),
    solvesZh: module.solvesZh,
    summaryZh: module.summaryZh,
    prerequisites: getModuleDependencies(module).map(toModuleSummary),
    commonPitfallsZh: module.commonPitfallsZh,
    checkpointZh: module.checkpointZh,
    outputTaskZh: module.outputTaskZh,
    glossaryTerms: module.glossaryTerms,
    nodeSlugs: module.nodeSlugs,
    nextModules: getNextModules(module).map(toModuleSummary),
    sources: getModuleSources(module).map(toSourceContract)
  };

  return {
    generatedAt: registryUpdatedAt,
    item
  };
}

export async function getNodeDetail(slug: string) {
  const node = getKnowledgeNodeBySlug(slug);
  if (!node) return null;

  return {
    generatedAt: registryUpdatedAt,
    item: {
      slug: node.slug,
      titleZh: node.titleZh,
      titleEn: node.titleEn,
      summaryZh: node.summaryZh,
      trackSlug: node.track,
      moduleSlugs: node.moduleSlugs,
      prerequisiteSlugs: node.prerequisiteSlugs,
      glossaryTerms: node.glossaryTerms,
      relatedSpecZh: node.relatedSpecZh,
      relatedClientZh: node.relatedClientZh,
      nextRecommended: node.nextRecommended,
      sources: getNodeSources(node).map(toSourceContract)
    }
  };
}

export async function listGlossaryTerms(): Promise<ApiListResponse<GlossaryTermContract>> {
  const sourceMap = new Map(sourceRefs.map((source) => [source.id, source]));
  const items = registryGlossary.map((term) => {
    const module = getModuleBySlug(term.firstRecommendedReadingModuleSlug);
    return {
      slug: term.slug,
      termEn: term.termEn,
      termZh: term.termZh,
      aliases: term.aliases,
      discouragedZh: term.discouragedZh,
      definitionZh: term.definitionZh,
      firstRecommendedReadingModuleSlug: term.firstRecommendedReadingModuleSlug,
      firstRecommendedReadingTitleZh: module?.titleZh || term.firstRecommendedReadingModuleSlug,
      trackSlug: term.trackSlug,
      relatedNodeSlugs: term.relatedNodeSlugs,
      relatedModuleSlugs: term.relatedModuleSlugs,
      relatedTermSlugs: term.relatedTermSlugs,
      sources: term.sourceRefIds
        .map((sourceId) => sourceMap.get(sourceId) || null)
        .filter((source): source is NonNullable<typeof source> => Boolean(source))
        .map(toSourceContract)
    };
  });

  return {
    generatedAt: registryUpdatedAt,
    total: items.length,
    items
  };
}

export async function getGlossaryTermDetail(slug: string): Promise<ApiDetailResponse<GlossaryTermContract> | null> {
  const { items } = await listGlossaryTerms();
  const item = items.find((term) => term.slug === slug);
  if (!item) return null;

  return {
    generatedAt: registryUpdatedAt,
    item
  };
}

export async function searchContent(query: string): Promise<ContentSearchResponse> {
  const normalizedQuery = query.trim().toLowerCase();
  const trackResults = tracks.map((track) =>
    buildSearchResult({
      entityType: 'track',
      slug: track.slug,
      titleZh: track.titleZh,
      titleEn: track.titleEn,
      summaryZh: track.oneLinerZh,
      href: `/tracks/${track.slug}`,
      trackSlug: track.slug,
      trackTitleZh: track.titleZh,
      sourceLabels: getTrackSources(track).map((source) => source.sourceTitle)
    })
  );

  const moduleResults = modules.map((module) => {
    const nextModule = getNextModules(module)[0];
    return buildSearchResult({
      entityType: 'module',
      slug: module.slug,
      titleZh: module.titleZh,
      titleEn: module.titleEn,
      summaryZh: module.oneLinerZh,
      href: `/modules/${module.slug}`,
      trackSlug: module.track,
      trackTitleZh: trackTitleZh(module.track),
      prerequisiteLabelsZh: getModuleDependencies(module).map((dependency) => dependency.titleZh),
      nextRecommendedLabelZh: nextModule?.titleZh,
      sourceLabels: getModuleSources(module).map((source) => source.sourceTitle)
    });
  });

  const nodeResults = knowledgeNodes.map((node) =>
    buildSearchResult({
      entityType: 'node',
      slug: node.slug,
      titleZh: node.titleZh,
      titleEn: node.titleEn,
      summaryZh: node.summaryZh,
      href: `/nodes/${node.slug}`,
      trackSlug: node.track,
      trackTitleZh: trackTitleZh(node.track),
      prerequisiteLabelsZh: node.prerequisiteSlugs
        .map((moduleSlug) => getModuleBySlug(moduleSlug)?.titleZh)
        .filter((title): title is string => Boolean(title)),
      nextRecommendedLabelZh: node.nextRecommended
        .map((moduleSlug) => getModuleBySlug(moduleSlug)?.titleZh)
        .filter((title): title is string => Boolean(title))[0],
      sourceLabels: getNodeSources(node).map((source) => source.sourceTitle)
    })
  );

  const glossaryPayload = await listGlossaryTerms();
  const glossaryResults = glossaryPayload.items.map((term) =>
    buildSearchResult({
      entityType: 'glossary',
      slug: term.slug,
      titleZh: `${term.termZh} / ${term.termEn}`,
      titleEn: term.termEn,
      summaryZh: term.definitionZh,
      href: `/glossary?term=${term.slug}`,
      trackSlug: term.trackSlug,
      trackTitleZh: trackTitleZh(term.trackSlug),
      prerequisiteLabelsZh: [term.firstRecommendedReadingTitleZh],
      nextRecommendedLabelZh: term.relatedModuleSlugs
        .map((moduleSlug) => getModuleBySlug(moduleSlug)?.titleZh)
        .filter((title): title is string => Boolean(title))[0],
      sourceLabels: term.sources.map((source) => source.sourceTitle)
    })
  );

  const allResults = [...trackResults, ...moduleResults, ...nodeResults, ...glossaryResults];
  const ranked = normalizedQuery
    ? allResults
        .map((result) => {
          const extra = result.entityType === 'glossary'
            ? registryGlossary.find((term) => term.slug === result.slug)?.aliases.join(' ') || ''
            : '';
          const score = rankSearch(
            normalizedQuery,
            `${result.titleZh} ${result.titleEn || ''} ${result.summaryZh} ${result.prerequisiteLabelsZh.join(' ')} ${result.sourceLabels.join(' ')} ${extra}`,
            `${result.titleZh} ${result.titleEn || ''}`
          );
          return { result, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score || a.result.titleZh.localeCompare(b.result.titleZh))
        .map((item) => item.result)
    : allResults.slice(0, 30);

  return {
    generatedAt: registryUpdatedAt,
    total: ranked.length,
    query,
    items: ranked.slice(0, 80)
  };
}
