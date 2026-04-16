import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { ContentSearchResult } from '../contracts/content';
import { metricSearchMiss } from '../services/telemetry';
import { searchContent } from '../services/contentService';

const searchAliases: Record<string, string[]> = {
  pbs: ['proposer builder separation'],
  blob: ['kzg commitment', 'data availability'],
  witness: ['stateless witness'],
  bls: ['bls signature'],
  lean: ['leanspec'],
  zkevm: ['zk evm']
};

function groupedLabel(entityType: ContentSearchResult['entityType']) {
  if (entityType === 'track') return 'Tracks';
  if (entityType === 'module') return 'Modules';
  if (entityType === 'node') return 'Knowledge Nodes';
  return 'Glossary';
}

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<ContentSearchResult[]>([]);

  useEffect(() => {
    const expandedQuery = query.trim()
      ? `${query.trim()} ${(searchAliases[query.trim().toLowerCase()] || []).join(' ')}`.trim()
      : '';

    searchContent(expandedQuery).then((response) => setResults(response.items));
  }, [query]);

  const grouped = useMemo(() => {
    const buckets = new Map<string, ContentSearchResult[]>();
    results.forEach((result) => {
      const label = groupedLabel(result.entityType);
      if (!buckets.has(label)) buckets.set(label, []);
      buckets.get(label)?.push(result);
    });
    return Array.from(buckets.entries());
  }, [results]);

  const onBlurSearch = () => {
    if (query.trim() && results.length === 0) metricSearchMiss(query);
  };

  return (
    <main className="container registry-shell">
      <section className="card page-hero">
        <p className="eyebrow">Unified Search</p>
        <h1>统一搜索</h1>
        <p className="page-lead">
          搜索结果不只返回“某一页”，而要回答它是什么、属于哪个 Track、前置模块是什么、上游入口在哪、推荐下一步是什么。
        </p>
      </section>

      <section className="card">
        <div className="section-heading">
          <h2>Search Registry</h2>
          <p className="subtle">当前页面已经从旧静态搜索改为 content service contract-backed 搜索。</p>
        </div>
        <input
          value={query}
          onBlur={onBlurSearch}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索 Track / Module / Node / Glossary（支持别名：pbs / blob / witness / bls / lean / zkevm）"
          className="field-input"
        />
        <small className="subtle">结果：{results.length}</small>
      </section>

      <section className="section-stack">
        {grouped.map(([group, list]) => (
          <article key={group} className="card">
            <div className="section-heading">
              <h2>{group}</h2>
              <p className="subtle">按 contract 统一返回，页面不再直接拼散落数据。</p>
            </div>
            <div className="stack-list">
              {list.map((result) => (
                <Link key={`${result.entityType}-${result.slug}`} className="task-row" to={result.href}>
                  <div style={{ minWidth: 0 }}>
                    <div className="chip-row" style={{ marginBottom: 6 }}>
                      <span className="meta-pill">{result.entityType}</span>
                      {result.trackTitleZh ? <span className="chip chip-soft">{result.trackTitleZh}</span> : null}
                    </div>
                    <strong>{result.titleZh}</strong>
                    <p className="subtle" style={{ margin: '6px 0 0' }}>{result.summaryZh}</p>
                    <div className="chip-row" style={{ marginTop: 8 }}>
                      {result.prerequisiteLabelsZh.map((label) => (
                        <span key={label} className="chip chip-soft">前置：{label}</span>
                      ))}
                      {result.nextRecommendedLabelZh ? <span className="chip">下一步：{result.nextRecommendedLabelZh}</span> : null}
                      {result.sourceLabels.map((label) => <span key={label} className="chip chip-soft">来源：{label}</span>)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </article>
        ))}

        {!grouped.length ? (
          <article className="card">
            <h2>没有命中结果</h2>
            <p className="subtle">当前 registry 没有匹配项。请尝试英文原词、模块名或 Track 名称。</p>
          </article>
        ) : null}
      </section>
    </main>
  );
}
