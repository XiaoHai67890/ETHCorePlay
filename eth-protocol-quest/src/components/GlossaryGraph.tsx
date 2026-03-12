import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { Link } from 'react-router-dom';
import { type GlossaryItem, type GlossaryStatus } from '../data/glossary';

const MIN_ZOOM = 0.32;
const MAX_ZOOM = 2.55;

type LinkKind = 'primary' | 'chapter' | 'status';

const statusTones: Record<GlossaryStatus | 'General', { accent: string; soft: string; tag: string; halo: string }> = {
  Mainnet: { accent: '#2f7b51', soft: '#dcefe3', tag: '#eef8f1', halo: 'rgba(47, 123, 81, 0.22)' },
  Ecosystem: { accent: '#5a7be7', soft: '#e3e9ff', tag: '#eef2ff', halo: 'rgba(90, 123, 231, 0.2)' },
  Roadmap: { accent: '#8b6ec9', soft: '#eee6ff', tag: '#f4efff', halo: 'rgba(139, 110, 201, 0.2)' },
  Research: { accent: '#c5873f', soft: '#f8ead7', tag: '#fcf5eb', halo: 'rgba(197, 135, 63, 0.2)' },
  Concept: { accent: '#4d8ca3', soft: '#dceff4', tag: '#ecf7fa', halo: 'rgba(77, 140, 163, 0.18)' },
  Depends: { accent: '#8c6d5a', soft: '#efe4db', tag: '#f8f1eb', halo: 'rgba(140, 109, 90, 0.18)' },
  General: { accent: '#5f6f82', soft: '#e8edf2', tag: '#f4f7fa', halo: 'rgba(95, 111, 130, 0.18)' },
};

const statusOrder = Object.keys(statusTones) as Array<GlossaryStatus | 'General'>;

function clampZoom(value: number) {
  return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value));
}

function sortTerms(a: string, b: string) {
  return a.localeCompare(b, 'en');
}

function matchesQuery(item: GlossaryItem, keyword: string) {
  return `${item.term} ${item.desc} ${(item.relatedTerms || []).join(' ')}`.toLowerCase().includes(keyword);
}

function readZoom(chart: echarts.EChartsType | null) {
  const rawOption = chart?.getOption() as { series?: Array<{ zoom?: number }> } | undefined;
  return clampZoom(typeof rawOption?.series?.[0]?.zoom === 'number' ? rawOption.series[0].zoom : 0.9);
}

export function GlossaryGraph({ glossary }: { glossary: GlossaryItem[] }) {
  const [query, setQuery] = useState('');
  const [focusMode, setFocusMode] = useState(false);
  const [zoom, setZoom] = useState(0.9);
  const [pinnedTerm, setPinnedTerm] = useState<string | null>(null);
  const chartHostRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.EChartsType | null>(null);
  const deferredQuery = useDeferredValue(query);

  const graph = useMemo(() => {
    const items = [...glossary].sort((a, b) => sortTerms(a.term, b.term));
    const byTerm = new Map(items.map((item) => [item.term, item]));
    const neighbors = new Map<string, Set<string>>();
    const linkMap = new Map<string, { source: string; target: string; weight: number; kinds: Set<LinkKind>; sharedChapters: number }>();

    items.forEach((item) => neighbors.set(item.term, new Set()));

    const registerLink = (sourceTerm: string, targetTerm: string, kind: LinkKind, weight = 1, sharedChapters = 0) => {
      if (!byTerm.has(sourceTerm) || !byTerm.has(targetTerm) || sourceTerm === targetTerm) return;
      const source = sourceTerm < targetTerm ? sourceTerm : targetTerm;
      const target = sourceTerm < targetTerm ? targetTerm : sourceTerm;
      const key = `${source}__${target}`;
      const current = linkMap.get(key);

      if (current) {
        current.kinds.add(kind);
        current.weight += weight;
        current.sharedChapters = Math.max(current.sharedChapters, sharedChapters);
      } else {
        linkMap.set(key, {
          source,
          target,
          weight,
          kinds: new Set([kind]),
          sharedChapters,
        });
      }

      neighbors.get(source)?.add(target);
      neighbors.get(target)?.add(source);
    };

    items.forEach((item) => {
      (item.relatedTerms || []).forEach((related) => {
        registerLink(item.term, related, 'primary', 1);
      });
    });

    for (let index = 0; index < items.length; index += 1) {
      for (let offset = index + 1; offset < items.length; offset += 1) {
        const current = items[index];
        const next = items[offset];
        const sharedChapters = (current.relatedChapters || []).filter((chapterId) => (next.relatedChapters || []).includes(chapterId));
        if (sharedChapters.length > 0) {
          registerLink(current.term, next.term, 'chapter', 0.45 + sharedChapters.length * 0.2, sharedChapters.length);
        }
      }
    }

    const statusBuckets = new Map<string, string[]>();
    items.forEach((item) => {
      const status = item.status || 'General';
      if (status === 'General') return;
      const bucket = statusBuckets.get(status) || [];
      bucket.push(item.term);
      statusBuckets.set(status, bucket);
    });

    statusBuckets.forEach((terms) => {
      const ordered = [...terms].sort(sortTerms);
      ordered.forEach((term, index) => {
        if (ordered[index + 1]) registerLink(term, ordered[index + 1], 'status', 0.28);
        if (ordered[index + 2]) registerLink(term, ordered[index + 2], 'status', 0.16);
      });
    });

    const degrees = new Map(items.map((item) => [item.term, neighbors.get(item.term)?.size || 0]));
    return { items, byTerm, neighbors, links: Array.from(linkMap.values()), degrees };
  }, [glossary]);

  useEffect(() => {
    if (pinnedTerm && !graph.byTerm.has(pinnedTerm)) setPinnedTerm(null);
  }, [graph.byTerm, pinnedTerm]);

  const searchKey = deferredQuery.trim().toLowerCase();
  const matchedTerms = useMemo(
    () => (searchKey ? graph.items.filter((item) => matchesQuery(item, searchKey)).map((item) => item.term) : []),
    [graph.items, searchKey]
  );
  const matchedSet = useMemo(() => new Set(matchedTerms), [matchedTerms]);
  const locatedTerm = matchedTerms[0] || null;
  const currentTerm = pinnedTerm || locatedTerm;
  const panel = currentTerm ? graph.byTerm.get(currentTerm) || null : null;

  const highlightSet = useMemo(() => {
    const highlighted = new Set<string>(matchedTerms);
    if (!currentTerm) return highlighted;
    highlighted.add(currentTerm);
    (graph.neighbors.get(currentTerm) || new Set()).forEach((term) => highlighted.add(term));
    return highlighted;
  }, [currentTerm, graph.neighbors, matchedTerms]);

  const panelRelatedTerms = useMemo(
    () => (panel ? [...(graph.neighbors.get(panel.term) || new Set())].sort(sortTerms) : []),
    [graph.neighbors, panel]
  );

  const chartData = useMemo(
    () =>
      graph.items.map((item) => {
        const status = item.status || 'General';
        const tone = statusTones[status];
        const degree = graph.degrees.get(item.term) || 0;
        const isCurrent = currentTerm === item.term;
        const isHit = matchedSet.has(item.term);
        const shouldDim = !!(focusMode && currentTerm && !highlightSet.has(item.term));
        const showLabel = isCurrent || isHit || degree >= 3;

        return {
          id: item.term,
          name: item.term,
          value: degree,
          category: statusOrder.indexOf(status),
          fixed: pinnedTerm === item.term,
          symbolSize: isCurrent ? 33 : isHit ? 28 : 18 + Math.min(degree, 5) * 2.2,
          itemStyle: {
            color: isCurrent ? tone.accent : isHit ? tone.soft : '#ffffff',
            borderColor: tone.accent,
            borderWidth: isCurrent ? 3 : 2.2,
            shadowBlur: isCurrent ? 28 : 14,
            shadowColor: tone.halo,
            opacity: shouldDim ? 0.16 : 1,
          },
          label: {
            show: showLabel,
            position: 'right',
            distance: 10,
            color: isCurrent ? '#111827' : '#364152',
            fontWeight: isCurrent ? 700 : 500,
            fontSize: isCurrent ? 13 : 12,
            backgroundColor: 'rgba(255,255,255,0.88)',
            borderColor: 'rgba(229,231,235,0.92)',
            borderWidth: 1,
            borderRadius: 8,
            padding: [4, 8],
            overflow: 'truncate',
            width: 150,
            opacity: shouldDim ? 0.18 : 1,
          },
        };
      }),
    [currentTerm, focusMode, graph.degrees, graph.items, highlightSet, matchedSet, pinnedTerm]
  );

  const chartLinks = useMemo(
    () =>
      graph.links.map((link) => {
        const touchesCurrent = currentTerm && (link.source === currentTerm || link.target === currentTerm);
        const touchesHighlighted = highlightSet.has(link.source) && highlightSet.has(link.target);
        const shouldDim = !!(focusMode && currentTerm && !touchesHighlighted);
        const isPrimary = link.kinds.has('primary');
        const isChapter = link.kinds.has('chapter');

        return {
          source: link.source,
          target: link.target,
          value: link.weight,
          lineStyle: {
            color: touchesCurrent
              ? 'rgba(59, 130, 246, 0.82)'
              : isPrimary
                ? 'rgba(128, 147, 168, 0.84)'
                : isChapter
                  ? 'rgba(122, 157, 118, 0.72)'
                  : 'rgba(164, 174, 190, 0.58)',
            width: touchesCurrent ? 2.7 : isPrimary ? 1.8 + link.weight * 0.38 : isChapter ? 1.45 + link.weight * 0.28 : 1.15 + link.weight * 0.22,
            opacity: shouldDim ? 0.18 : touchesCurrent ? 0.98 : isPrimary ? 0.88 : isChapter ? 0.62 : 0.46,
            curveness: isPrimary ? 0.08 : isChapter ? 0.12 : 0.16,
            type: isPrimary ? 'solid' : 'dashed',
          },
        };
      }),
    [currentTerm, focusMode, graph.links, highlightSet]
  );

  useEffect(() => {
    if (!chartHostRef.current) return;

    const chart = echarts.init(chartHostRef.current, undefined, { renderer: 'svg' });
    chartRef.current = chart;

    const onNodeClick = (params: any) => {
      if (params.dataType !== 'node') return;
      const term = String(params.data.id);
      setPinnedTerm((current) => (current === term ? null : term));
    };

    const onBlankClick = (event: any) => {
      if (!event.target) setPinnedTerm(null);
    };

    const onGraphRoam = () => {
      const nextZoom = readZoom(chart);
      setZoom((current) => (Math.abs(current - nextZoom) > 0.001 ? nextZoom : current));
    };

    chart.on('click', onNodeClick);
    chart.on('graphRoam', onGraphRoam);
    chart.getZr().on('click', onBlankClick);

    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(chartHostRef.current);

    return () => {
      observer.disconnect();
      chart.getZr().off('click', onBlankClick);
      chart.off('click', onNodeClick);
      chart.off('graphRoam', onGraphRoam);
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    chart.setOption(
      {
        animationDuration: 0,
        animationDurationUpdate: 0,
        tooltip: { show: false },
        series: [
          {
            id: 'glossary-force',
            type: 'graph',
            layout: 'force',
            roam: true,
            draggable: true,
            zoom: clampZoom(zoom),
            left: 20,
            right: 20,
            top: 20,
            bottom: 20,
            scaleLimit: { min: MIN_ZOOM, max: MAX_ZOOM },
            force: {
              initLayout: 'circular',
              repulsion: 420,
              gravity: 0.045,
              edgeLength: [84, 132],
              friction: 0.18,
              layoutAnimation: false,
            },
            nodeScaleRatio: 0.72,
            lineStyle: {
              color: 'rgba(128, 147, 168, 0.84)',
              width: 1.9,
              curveness: 0.06,
              opacity: 0.88,
            },
            emphasis: {
              focus: 'adjacency',
              scale: true,
              lineStyle: { width: 2.35, opacity: 0.92 },
            },
            data: chartData,
            links: chartLinks,
          },
        ],
      },
      { lazyUpdate: true }
    );
  }, [chartData, chartLinks, graph.items.length]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    chart.setOption(
      {
        series: [
          {
            id: 'glossary-force',
            zoom: clampZoom(zoom),
          },
        ],
      },
      { lazyUpdate: true }
    );
  }, [zoom]);

  const panelTone = panel ? statusTones[panel.status || 'General'] : statusTones.General;
  const hasNodes = graph.items.length > 0;

  return (
    <section className="card card-hover glossary-graph-card">
      <div className="glossary-graph-head">
        <div className="glossary-graph-title">
          <span className="glossary-graph-mark" aria-hidden="true" />
          <div>
            <h3 className="section-title" style={{ margin: 0 }}>术语关系图谱</h3>
            <p className="subtle glossary-graph-subtitle">Force layout · whiteboard grid · 术语关系动态聚合</p>
          </div>
        </div>
        <div className="glossary-graph-stats">
          <span>节点 {graph.items.length}</span>
          <span>连线 {graph.links.length}</span>
          <span>命中 {matchedTerms.length}</span>
        </div>
      </div>

      <div className="glossary-graph-toolbar">
        <div className="glossary-graph-search-wrap">
          <span className="glossary-graph-search-icon" aria-hidden="true">⌕</span>
          <input
            className="glossary-graph-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索术语（自动高亮）"
          />
        </div>

        <div className="graph-toolbar-actions">
          <button className={`graph-toolbar-btn ${focusMode ? 'is-on' : ''}`} onClick={() => setFocusMode((value) => !value)}>
            {focusMode ? '聚焦模式：开' : '聚焦模式：关'}
          </button>
          <button className="graph-toolbar-btn" onClick={() => setPinnedTerm(null)}>取消固定节点</button>
        </div>

        <label className="graph-toolbar-slider">
          <span className="subtle">缩放</span>
          <input type="range" min={MIN_ZOOM} max={MAX_ZOOM} step={0.01} value={zoom} onChange={(e) => setZoom(clampZoom(Number(e.target.value)))} />
        </label>
      </div>

      <div className="graph-layout">
        <div className="graph-canvas-stage">
          <div ref={chartHostRef} className="graph-canvas-wrap" />
        </div>

        <aside className="graph-panel">
          {!hasNodes && <div className="graph-panel-empty">当前筛选条件下没有可展示的术语节点。</div>}

          {hasNodes && !panel && (
            <div className="graph-panel-empty">
              <div className="graph-panel-empty-icon" aria-hidden="true" />
              <div className="graph-panel-empty-copy">
                <strong>点击图谱中的节点</strong>
                <span>右侧会显示术语简介、关联概念和对应章节入口。</span>
              </div>
            </div>
          )}

          {hasNodes && panel && (
            <div className="graph-panel-note">
              <div className="card-title-row" style={{ alignItems: 'center', gap: 10 }}>
                <h4 style={{ margin: 0 }}>{panel.term}</h4>
                <span
                  className="graph-panel-status"
                  style={{
                    borderColor: panelTone.accent,
                    background: panelTone.tag,
                    color: panelTone.accent,
                  }}
                >
                  {panel.status || 'General'}
                </span>
              </div>

              <p className="graph-panel-desc">{panel.desc}</p>

              <div className="graph-panel-block">
                <small className="subtle">关联节点</small>
                <div className="graph-panel-pills">
                  {panelRelatedTerms.length > 0 ? (
                    panelRelatedTerms.map((term) => (
                      <button key={term} className="graph-panel-pill" onClick={() => setPinnedTerm(term)}>
                        {term}
                      </button>
                    ))
                  ) : (
                    <span className="subtle">暂无直接关联节点</span>
                  )}
                </div>
              </div>

              {!!panel.relatedChapters?.length && (
                <div className="graph-panel-links">
                  {panel.relatedChapters.slice(0, 4).map((chapterId) => (
                    <Link key={chapterId} to={`/curriculum#${chapterId}`} className="graph-panel-link">
                      相关章节：{chapterId}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
