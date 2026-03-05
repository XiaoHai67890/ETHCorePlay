import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../game/store';

type LOD = 'zone' | 'plot' | 'edge';
type Node = { id: string; name: string; zone: string; x: number; y: number };

const nodes: Node[] = [
  { id: 'el-core', name: 'Execution', zone: 'Execution', x: 80, y: 140 },
  { id: 'cl-core', name: 'Consensus', zone: 'Consensus', x: 220, y: 80 },
  { id: 'engine-api-core', name: 'Engine API', zone: 'Tooling', x: 380, y: 150 },
  { id: 'l2-da-core', name: 'Scaling', zone: 'Scaling', x: 520, y: 90 },
  { id: 'security-core', name: 'Security', zone: 'Security', x: 660, y: 160 }
];

export function SVGRenderer() {
  const navigate = useNavigate();
  const { curriculumDone, lastVisitedChapter } = useProgressStore();
  const [hover, setHover] = useState<Node | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [query, setQuery] = useState('');
  const [pathMode, setPathMode] = useState<'newbie' | 'builder' | 'core'>('newbie');
  const dragging = useRef<{ on: boolean; x: number; y: number; px: number; py: number }>({ on: false, x: 0, y: 0, px: 0, py: 0 });
  const svgRef = useRef<SVGSVGElement | null>(null);

  const edges = useMemo(() => [[0, 1], [1, 2], [2, 3], [2, 4]], []);
  const lod: LOD = zoom < 0.9 ? 'zone' : zoom < 1.35 ? 'plot' : 'edge';

  const highlightedIds = useMemo(() => {
    const paths: Record<string, string[]> = {
      newbie: ['el-core', 'tx-lifecycle-core'],
      builder: ['engine-api-core', 'l2-da-core'],
      core: ['security-core', 'cl-core']
    };
    const pending = (paths[pathMode] || []).filter((id) => !curriculumDone[id]);
    return new Set([...(pending.length ? pending : paths[pathMode]), lastVisitedChapter || '']);
  }, [curriculumDone, lastVisitedChapter, pathMode]);

  const locateNode = () => {
    const k = query.trim().toLowerCase();
    if (!k) return;
    const hit = nodes.find((n) => `${n.id} ${n.name} ${n.zone}`.toLowerCase().includes(k));
    if (!hit) return;
    setPan({ x: 380 - hit.x * zoom, y: 115 - hit.y * zoom });
    setHover(hit);
  };

  const onWheel: React.WheelEventHandler<SVGSVGElement> = (e) => {
    e.preventDefault();
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const factor = e.deltaY < 0 ? 1.08 : 0.92;
    const next = Math.max(0.65, Math.min(2.2, zoom * factor));

    const wx = (mx - pan.x) / zoom;
    const wy = (my - pan.y) / zoom;

    setZoom(next);
    setPan({ x: mx - wx * next, y: my - wy * next });
  };

  return (
    <div className="card card-hover">
      <div className="card-title-row">
        <h3 className="section-title">花园地图（SVG）</h3>
        <small className="subtle">LOD 自动切换：{lod}</small>
      </div>
      <div className="filter-row">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索节点：execution / engine / security" style={{ padding: 8, borderRadius: 10, border: '1px solid var(--border-default)' }} />
        <button className="btn btn-ghost" onClick={locateNode}>定位节点</button>
        <button className="btn btn-ghost" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>重置视图</button>
        <select value={pathMode} onChange={(e) => setPathMode(e.target.value as any)} aria-label="学习路径">
          <option value="newbie">新手路径</option>
          <option value="builder">开发者路径</option>
          <option value="core">核心贡献路径</option>
        </select>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 760 230"
        style={{ width: '100%', height: 'auto', borderRadius: 12, background: 'var(--bg-elevated)', cursor: dragging.current.on ? 'grabbing' : 'grab' }}
        onWheel={onWheel}
        onMouseDown={(e) => { dragging.current = { on: true, x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }; }}
        onMouseMove={(e) => {
          if (!dragging.current.on) return;
          setPan({ x: dragging.current.px + (e.clientX - dragging.current.x), y: dragging.current.py + (e.clientY - dragging.current.y) });
        }}
        onMouseUp={() => { dragging.current.on = false; }}
        onMouseLeave={() => { dragging.current.on = false; }}
      >
        <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
          {lod === 'edge' && edges.map(([a, b], i) => (
            <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="var(--border-default)" strokeDasharray="5 4" />
          ))}

          {nodes.map((n) => {
            const highlighted = highlightedIds.has(n.id);
            return (
              <g
                key={n.id}
                tabIndex={0}
                role="button"
                aria-label={`打开 ${n.name}`}
                onClick={() => navigate(`/plot/${n.id}`)}
                onFocus={() => setHover(n)}
                onBlur={() => setHover(null)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/plot/${n.id}`); }}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(null)}
              >
                <circle cx={n.x} cy={n.y} r={lod === 'zone' ? 26 : 18} fill={highlighted ? 'var(--brand-garden)' : 'var(--brand-primary)'} opacity={highlighted ? 0.95 : 0.82} />
                {(lod !== 'zone' || hover?.id === n.id) && (
                  <text x={n.x} y={n.y + 34} textAnchor="middle" fontSize="12" fill="var(--text-secondary)">{n.name}</text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {hover && <p className="subtle">{hover.name} · {hover.zone} · <Link to={`/plot/${hover.id}`}>打开地块</Link></p>}
    </div>
  );
}
