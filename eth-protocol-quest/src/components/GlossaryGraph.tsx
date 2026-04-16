import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

export type GlossaryGraphItem = {
  term: string;
  desc: string;
  relatedTerms?: string[];
  relatedLinks?: Array<{ label: string; href: string }>;
};

export function GlossaryGraph({ glossary }: { glossary: GlossaryGraphItem[] }) {
  const [active, setActive] = useState<GlossaryGraphItem | null>(null);
  const [zoom, setZoom] = useState(1);
  const [query, setQuery] = useState('');
  const [focusMode, setFocusMode] = useState(false);
  const [pinnedTerm, setPinnedTerm] = useState<string | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const items = useMemo(() => glossary.slice(0, 30), [glossary]);

  const pos = useMemo(() => {
    const cx = 410;
    const cy = 220;
    return items.map((g, i) => {
      const ring = i < 10 ? 92 : i < 20 ? 150 : 205;
      const a = (Math.PI * 2 * i) / Math.max(1, items.length);
      return { ...g, x: cx + Math.cos(a) * ring, y: cy + Math.sin(a) * ring };
    });
  }, [items]);

  const edges = useMemo(() => {
    const idx = new Map(pos.map((p, i) => [p.term, i]));
    const pairs = new Map<string, { a: number; b: number; w: number }>();
    pos.forEach((p, i) => {
      (p.relatedTerms || []).forEach((t) => {
        const j = idx.get(t);
        if (j == null || j === i) return;
        const a = Math.min(i, j);
        const b = Math.max(i, j);
        const key = `${a}-${b}`;
        const cur = pairs.get(key);
        pairs.set(key, { a, b, w: (cur?.w || 0) + 1 });
      });
    });
    return Array.from(pairs.values());
  }, [pos]);

  const located = useMemo(() => {
    const k = query.trim().toLowerCase();
    if (!k) return null;
    return pos.find((p) => `${p.term} ${p.desc}`.toLowerCase().includes(k)) || null;
  }, [query, pos]);

  const pinned = pinnedTerm ? pos.find((p) => p.term === pinnedTerm) || null : null;
  const panel = pinned || active || located;

  const activePaths = useMemo(() => {
    if (!panel) return [] as Array<{x1:number;y1:number;x2:number;y2:number}>;
    const src = pos.find((p) => p.term === panel.term);
    if (!src) return [];
    const rel = new Set(panel.relatedTerms || []);
    return pos.filter((p) => rel.has(p.term)).map((p) => ({ x1: src.x, y1: src.y, x2: p.x, y2: p.y }));
  }, [panel, pos]);

  return (
    <section className="card card-hover glossary-graph-card">
      <div className="card-title-row">
        <h3 className="section-title" style={{ margin: 0 }}>术语关系图谱（v2）</h3>
        <small className="subtle">节点 {pos.length} · 连线 {edges.length}</small>
      </div>

      <div className="glossary-graph-toolbar">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索术语（自动高亮）"
          style={{ flex: 1, minWidth: 220, padding: 10, borderRadius: 12, border: '1px solid var(--border-default)' }}
        />
        <button className={`chip-btn ${focusMode?'on':''}`} onClick={() => setFocusMode((v) => !v)}>{focusMode ? '聚焦模式：开' : '聚焦模式：关'}</button>
        <button className="btn btn-ghost" onClick={() => setPinnedTerm(null)}>取消固定节点</button>
        <div className="zoom-wrap">
          <small className="subtle">缩放</small>
          <input type="range" min={0.8} max={2.1} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} style={{ width: 150 }} />
        </div>
      </div>

      <div className="graph-layout">
        <div className="graph-canvas-wrap" onMouseDown={() => setDragging(true)} onMouseUp={() => setDragging(false)} onMouseLeave={() => setDragging(false)} onMouseMove={(e) => { if (!dragging) return; setPan((p) => ({ x: p.x + e.movementX * 0.35, y: p.y + e.movementY * 0.35 })); }}>
          <svg viewBox="0 0 820 460" className="glossary-graph-svg">
            <defs>
              <radialGradient id="graphBg" cx="50%" cy="45%" r="60%">
                <stop offset="0%" stopColor="rgba(98,126,234,0.08)" />
                <stop offset="55%" stopColor="rgba(47,168,121,0.05)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </radialGradient>
            </defs>
            <rect x="0" y="0" width="820" height="460" fill="url(#graphBg)" />
            <g transform={`translate(${410 - 410 * zoom + pan.x} ${230 - 230 * zoom + pan.y}) scale(${zoom})`}>

              {(focusMode && panel ? edges.filter((e)=> pos[e.a].term===panel.term || pos[e.b].term===panel.term) : edges).map((e, i) => (
                <line
                  key={i}
                  x1={pos[e.a].x}
                  y1={pos[e.a].y}
                  x2={pos[e.b].x}
                  y2={pos[e.b].y}
                  stroke="var(--border-default)"
                  strokeOpacity={Math.min(0.8, 0.22 + e.w * 0.25)}
                  strokeWidth={1 + e.w * 0.42}
                />
              ))}

              {activePaths.map((l, i) => (
                <line key={`ap-${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} className="related-path-line" />
              ))}

              {pos.map((p) => {
                const isActive = panel?.term === p.term;
                const isHit = !!query && `${p.term} ${p.desc}`.toLowerCase().includes(query.toLowerCase());
                return (
                  <g key={p.term} onMouseEnter={() => setActive(p)} onMouseLeave={() => setActive(null)} onClick={() => setPinnedTerm((old) => old===p.term?null:p.term)}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isActive ? 12 : isHit ? 10 : 8}
                      fill={isHit ? 'var(--brand-highlight)' : isActive ? 'var(--brand-garden)' : 'var(--brand-primary)'}
                      opacity="0.93"
                    />
                    <text x={p.x + 12} y={p.y + 4} fontSize="11" fill="var(--text-secondary)">{p.term.slice(0, 18)}</text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        <aside className="graph-panel">
          {!panel && <div className="subtle">点击或搜索节点，查看右侧学习面板。</div>}
          {panel && (
            <>
              <div className="card-title-row" style={{ alignItems: 'baseline' }}>
                <h4 style={{ margin: 0 }}>{panel.term}</h4>
                <span className="meta-pill">学习面板</span>
              </div>
              <p className="subtle" style={{ marginTop: 6 }}>{panel.desc}</p>

              {!!panel.relatedTerms?.length && (
                <div style={{ marginTop: 10 }}>
                  <small className="subtle">相关术语（Related Paths 已高亮）</small>
                  <div className="chips" style={{ marginTop: 6 }}>
                    {panel.relatedTerms.map((t) => <span className="chip" key={t}>{t}</span>)}
                  </div>
                </div>
              )}

              {!!panel.relatedLinks?.length && (
                <div style={{ marginTop: 12 }}>
                  <small className="subtle">快捷动作</small>
                  <div className="quick-links" style={{ marginTop: 8 }}>
                    {panel.relatedLinks.slice(0, 3).map((link) => (
                      <Link key={`${link.href}-${link.label}`} to={link.href} className="btn btn-ghost" style={{ padding: '6px 10px' }}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
