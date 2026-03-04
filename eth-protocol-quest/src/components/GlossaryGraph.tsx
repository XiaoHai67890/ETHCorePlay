import { useMemo, useState } from 'react';
import { type GlossaryItem } from '../data/glossary';
import { Link } from 'react-router-dom';

export function GlossaryGraph({ glossary }: { glossary: GlossaryItem[] }) {
  const [hover, setHover] = useState<GlossaryItem | null>(null);
  const [zoom, setZoom] = useState(1);

  const items = useMemo(() => glossary.slice(0, 24), [glossary]);
  const pos = useMemo(() => {
    const cx = 410, cy = 220, r = 150;
    return items.map((g, i) => {
      const a = (Math.PI * 2 * i) / Math.max(1, items.length);
      return { ...g, x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
    });
  }, [items]);

  const edges = useMemo(() => {
    const idx = new Map(pos.map((p, i) => [p.term, i]));
    const e: Array<[number, number]> = [];
    pos.forEach((p, i) => {
      (p.relatedTerms || []).forEach((t) => {
        const j = idx.get(t);
        if (j != null && i < j) e.push([i, j]);
      });
    });
    return e;
  }, [pos]);

  return (
    <section className="card card-hover">
      <div className="card-title-row">
        <h3 className="section-title" style={{ margin: 0 }}>术语关系图谱（可探索）</h3>
        <small className="subtle">节点 {pos.length} · 连线 {edges.length}</small>
      </div>
      <input type="range" min={0.8} max={1.8} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} style={{ width: '100%', margin: '8px 0' }} />
      <svg viewBox="0 0 820 460" style={{ width: '100%', height: 'auto', borderRadius: 12, background: 'var(--bg-elevated)' }}>
        <g transform={`translate(${410 - 410 * zoom} ${230 - 230 * zoom}) scale(${zoom})`}>
          {edges.map(([a, b], i) => (
            <line key={i} x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y} stroke="var(--border-default)" strokeOpacity="0.65" />
          ))}
          {pos.map((p, i) => {
            const active = hover?.term === p.term;
            return (
              <g key={p.term} onMouseEnter={() => setHover(p)} onMouseLeave={() => setHover(null)}>
                <circle cx={p.x} cy={p.y} r={active ? 12 : 9} fill={active ? 'var(--brand-garden)' : 'var(--brand-primary)'} opacity="0.9" />
                <text x={p.x + 12} y={p.y + 4} fontSize="11" fill="var(--text-secondary)">{p.term.slice(0, 18)}</text>
              </g>
            );
          })}
        </g>
      </svg>

      {hover && (
        <div className="notice" style={{ marginTop: 8 }}>
          <strong>{hover.term}</strong>
          <div className="subtle">{hover.desc}</div>
          {!!hover.relatedTerms?.length && <div className="chips" style={{ marginTop: 6 }}>{hover.relatedTerms.map((t) => <span className="chip" key={t}>{t}</span>)}</div>}
          {!!hover.relatedChapters?.length && <div className="quick-links" style={{ marginTop: 6 }}>{hover.relatedChapters.map((cid) => <Link key={cid} to={`/curriculum#${cid}`} className="btn btn-ghost" style={{ padding: '4px 10px' }}>{cid}</Link>)}</div>}
        </div>
      )}
    </section>
  );
}
