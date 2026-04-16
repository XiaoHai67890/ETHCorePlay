import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import type { GlossaryTermContract } from '../contracts/content';
import { GlossaryGraph, type GlossaryGraphItem } from '../components/GlossaryGraph';
import { getModuleBySlug, getTrackBySlug, tracks } from '../data/registry';
import { listGlossaryTerms } from '../services/contentService';

export function GlossaryPage() {
  const [searchParams] = useSearchParams();
  const initialTerm = searchParams.get('term') || '';
  const [query, setQuery] = useState(initialTerm);
  const [trackFilter, setTrackFilter] = useState<'all' | (typeof tracks)[number]['slug']>('all');
  const [terms, setTerms] = useState<GlossaryTermContract[]>([]);

  useEffect(() => {
    listGlossaryTerms().then((response) => setTerms(response.items));
  }, []);

  useEffect(() => {
    if (initialTerm) setQuery(initialTerm);
  }, [initialTerm]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return terms.filter((term) => {
      const matchesTrack = trackFilter === 'all' || term.trackSlug === trackFilter;
      const haystack = [
        term.slug,
        term.termEn,
        term.termZh,
        term.aliases.join(' '),
        term.definitionZh,
        term.firstRecommendedReadingTitleZh
      ].join(' ').toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      return matchesTrack && matchesQuery;
    });
  }, [query, terms, trackFilter]);

  const graphItems = useMemo<GlossaryGraphItem[]>(() => {
    return filtered.map((term) => ({
      term: term.termEn,
      desc: term.definitionZh,
      relatedTerms: term.relatedTermSlugs
        .map((slug) => terms.find((item) => item.slug === slug)?.termEn)
        .filter((label): label is string => Boolean(label)),
      relatedLinks: [
        {
          label: `模块：${term.firstRecommendedReadingTitleZh}`,
          href: `/modules/${term.firstRecommendedReadingModuleSlug}`
        },
        ...term.relatedModuleSlugs.slice(0, 2).map((moduleSlug) => ({
          label: `继续：${getModuleBySlug(moduleSlug)?.titleZh || moduleSlug}`,
          href: `/modules/${moduleSlug}`
        }))
      ]
    }));
  }, [filtered, terms]);

  const grouped = useMemo(() => {
    const buckets = new Map<string, GlossaryTermContract[]>();
    filtered.forEach((term) => {
      const key = /^[A-Za-z]/.test(term.termEn) ? term.termEn[0].toUpperCase() : '#';
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key)?.push(term);
    });

    return Array.from(buckets.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  return (
    <main className="container registry-shell">
      <section className="card page-hero">
        <p className="eyebrow">Glossary Registry</p>
        <h1>术语系统</h1>
        <p className="page-lead">
          术语不是附属物，而是华语协议学习的核心资产。当前页面已经切到 registry-backed content service，后续后端只需要实现同一份 contract。
        </p>
      </section>

      <section className="card">
        <div className="section-heading">
          <h2>搜索与过滤</h2>
          <p className="subtle">每个术语必须至少说明英文原词、中文译法、第一推荐阅读位置、所属 Track 和相关节点。</p>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索术语，例如 engine api / finality / leanSpec / BLS"
          className="field-input"
        />
        <div className="chip-row" style={{ marginTop: 12 }}>
          <button className={`chip-btn ${trackFilter === 'all' ? 'on' : ''}`} onClick={() => setTrackFilter('all')}>All</button>
          {tracks.map((track) => (
            <button
              key={track.slug}
              className={`chip-btn ${trackFilter === track.slug ? 'on' : ''}`}
              onClick={() => setTrackFilter(track.slug)}
            >
              {track.titleZh}
            </button>
          ))}
        </div>
        <small className="subtle">当前术语：{filtered.length}/{terms.length}</small>
      </section>

      <GlossaryGraph glossary={graphItems} />

      <section className="card">
        <div className="chip-row" style={{ marginBottom: 10 }}>
          {grouped.map(([key]) => <a key={key} href={`#g-${key}`} className="chip">{key}</a>)}
        </div>

        {grouped.map(([key, list]) => (
          <section key={key} id={`g-${key}`} style={{ marginBottom: 18 }}>
            <h3 style={{ marginBottom: 8 }}>{key}</h3>
            <div className="overview-grid">
              {list.map((term) => {
                const track = getTrackBySlug(term.trackSlug);
                const firstModule = getModuleBySlug(term.firstRecommendedReadingModuleSlug);

                return (
                  <article key={term.slug} className="card source-card">
                    <div className="source-card-head">
                      <strong>{term.termZh}</strong>
                      <span className="meta-pill">{term.termEn}</span>
                    </div>
                    <p className="subtle">{term.definitionZh}</p>
                    <dl className="source-meta-list">
                      <div>
                        <dt>所属 Track</dt>
                        <dd>{track?.titleZh || term.trackSlug}</dd>
                      </div>
                      <div>
                        <dt>第一推荐阅读</dt>
                        <dd>{term.firstRecommendedReadingTitleZh}</dd>
                      </div>
                    </dl>
                    {!!term.aliases.length && (
                      <div>
                        <small className="subtle">别名</small>
                        <div className="chip-row" style={{ marginTop: 6 }}>
                          {term.aliases.map((alias) => <span key={alias} className="chip chip-soft">{alias}</span>)}
                        </div>
                      </div>
                    )}
                    {!!term.discouragedZh.length && (
                      <div>
                        <small className="subtle">不推荐译法</small>
                        <div className="chip-row" style={{ marginTop: 6 }}>
                          {term.discouragedZh.map((item) => <span key={item} className="chip">{item}</span>)}
                        </div>
                      </div>
                    )}
                    <div className="chip-row">
                      {term.relatedNodeSlugs.map((nodeSlug) => (
                        <Link key={nodeSlug} to={`/nodes/${nodeSlug}`} className="chip chip-link">节点：{nodeSlug}</Link>
                      ))}
                    </div>
                    <div className="inline-actions">
                      {firstModule ? <Link className="btn btn-ghost" to={`/modules/${firstModule.slug}`}>开始阅读</Link> : null}
                      {track ? <Link className="btn btn-ghost" to={`/tracks/${track.slug}`}>查看 Track</Link> : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </section>
    </main>
  );
}
