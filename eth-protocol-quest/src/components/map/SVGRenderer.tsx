import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../game/store';
import { CustomSelect } from '../CustomSelect';

type LOD = 'zone' | 'plot' | 'edge';
type Node = { id: string; name: string; zone: string; x: number; y: number };
type EdgeType = 'depends' | 'related' | 'research';

const nodes: Node[] = [
  { id: 'el-core', name: 'Execution', zone: 'Execution', x: 80, y: 140 },
  { id: 'cl-core', name: 'Consensus', zone: 'Consensus', x: 210, y: 80 },
  { id: 'evm-core', name: 'EVM', zone: 'Execution', x: 180, y: 180 },
  { id: 'engine-api-core', name: 'Engine API', zone: 'Tooling', x: 350, y: 150 },
  { id: 'tx-lifecycle-core', name: 'Networking', zone: 'P2P', x: 340, y: 70 },
  { id: 'l2-da-core', name: 'Scaling', zone: 'Scaling', x: 510, y: 95 },
  { id: 'security-core', name: 'Security', zone: 'Security', x: 650, y: 155 },
  { id: 'verkle-stateless-deep', name: 'Verkle', zone: 'Research', x: 620, y: 70 }
];

const edgeDefs: Array<{ a: number; b: number; type: EdgeType }> = [
  { a: 0, b: 1, type: 'depends' },
  { a: 0, b: 2, type: 'depends' },
  { a: 1, b: 3, type: 'related' },
  { a: 2, b: 3, type: 'related' },
  { a: 3, b: 4, type: 'depends' },
  { a: 3, b: 5, type: 'depends' },
  { a: 5, b: 6, type: 'related' },
  { a: 5, b: 7, type: 'research' },
  { a: 1, b: 7, type: 'research' }
];
const pathModeOptions = [
  { value: 'newbie', label: '新手路径', hint: '基础节点优先' },
  { value: 'builder', label: '开发者路径', hint: '偏工程实现' },
  { value: 'core', label: '核心贡献路径', hint: '高阶链路与治理' }
];

export function SVGRenderer() {
  const navigate = useNavigate();
  const { curriculumDone, lastVisitedChapter } = useProgressStore();
  const [hover, setHover] = useState<Node | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [query, setQuery] = useState('');
  const [pathMode, setPathMode] = useState<'newbie' | 'builder' | 'core'>('newbie');
  const [edgeTypeFilter, setEdgeTypeFilter] = useState<Record<EdgeType, boolean>>({ depends: true, related: true, research: true });
  const dragging = useRef<{ on: boolean; x: number; y: number; px: number; py: number }>({ on: false, x: 0, y: 0, px: 0, py: 0 });
  const svgRef = useRef<SVGSVGElement | null>(null);

  const edges = useMemo(() => edgeDefs.filter((e) => edgeTypeFilter[e.type]), [edgeTypeFilter]);
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

  const currentNode = nodes.find((n) => n.id === lastVisitedChapter) || null;
  const nextNode = nodes.find((n) => highlightedIds.has(n.id) && n.id !== currentNode?.id) || null;

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

  const edgeStyle = (type: EdgeType) => {
    if (type === 'depends') return { stroke: 'var(--brand-primary)', dash: '2 0' };
    if (type === 'related') return { stroke: 'var(--brand-garden)', dash: '5 4' };
    return { stroke: 'var(--brand-highlight)', dash: '2 6' };
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
        <CustomSelect
          value={pathMode}
          onChange={(next) => setPathMode(next as any)}
          options={pathModeOptions}
          ariaLabel="学习路径"
        />
      </div>

      <div className="chips" style={{ marginBottom: 8 }}>
        <span className="chip">图例：</span>
        <button className={`chip-btn ${edgeTypeFilter.depends ? 'on' : ''}`} onClick={() => setEdgeTypeFilter((s) => ({ ...s, depends: !s.depends }))}>depends</button>
        <button className={`chip-btn ${edgeTypeFilter.related ? 'on' : ''}`} onClick={() => setEdgeTypeFilter((s) => ({ ...s, related: !s.related }))}>related</button>
        <button className={`chip-btn ${edgeTypeFilter.research ? 'on' : ''}`} onClick={() => setEdgeTypeFilter((s) => ({ ...s, research: !s.research }))}>research</button>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 760 250"
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
          {lod === 'edge' && edges.map((e, i) => {
            const st = edgeStyle(e.type);
            return <line key={i} x1={nodes[e.a].x} y1={nodes[e.a].y} x2={nodes[e.b].x} y2={nodes[e.b].y} stroke={st.stroke} strokeDasharray={st.dash} strokeOpacity="0.85" />;
          })}

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

      <div className="notice" style={{ marginTop: 8 }}>
        <div><strong>You are here：</strong>{currentNode ? `${currentNode.name}（${currentNode.zone}）` : '尚未定位，建议先完成第一章'}</div>
        <div><strong>Next recommended：</strong>{nextNode ? `${nextNode.name}` : '已完成当前路径节点'} · <span className="subtle">Why this: 与当前路径依赖最短</span></div>
        <div><strong>完成后解锁：</strong>{pathMode === 'newbie' ? '开发者路径章节' : pathMode === 'builder' ? '核心贡献路径章节' : '高级实战节点'}</div>
      </div>
      <section className="card" style={{ marginTop: 10 }}>
        <div className="card-title-row"><strong>地图学习快照</strong><span className="meta-pill">Map Insights</span></div>
        <div className="chips" style={{ marginTop: 8 }}>
          <span className="chip">节点：{nodes.length}</span>
          <span className="chip">关系：{edges.length}</span>
          <span className="chip">当前路径：{pathMode}</span>
        </div>
        <div className="quick-links" style={{ marginTop: 8 }}>
          <Link className="btn btn-ghost" to="/curriculum#el-core">执行层入口</Link>
          <Link className="btn btn-ghost" to="/curriculum#cl-core">共识层入口</Link>
          <Link className="btn btn-ghost" to="/curriculum#verkle-stateless-deep">研究入口</Link>
        </div>
      </section>
      {hover && <p className="subtle">{hover.name} · {hover.zone} · <Link to={`/plot/${hover.id}`}>开始学习</Link></p>}
    </div>
  );
}
