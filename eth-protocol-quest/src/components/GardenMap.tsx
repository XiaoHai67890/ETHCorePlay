import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

type Node = { id: string; name: string; zone: string; x: number; y: number };

const nodes: Node[] = [
  { id: 'el-core', name: 'Execution', zone: 'Execution', x: 80, y: 140 },
  { id: 'cl-core', name: 'Consensus', zone: 'Consensus', x: 220, y: 80 },
  { id: 'engine-api-core', name: 'Engine API', zone: 'Tooling', x: 380, y: 150 },
  { id: 'l2-da-core', name: 'Scaling', zone: 'Scaling', x: 520, y: 90 },
  { id: 'security-core', name: 'Security', zone: 'Security', x: 660, y: 160 }
];

export function GardenMap() {
  const [hover, setHover] = useState<Node | null>(null);
  const edges = useMemo(() => [[0,1],[1,2],[2,3],[2,4]], []);

  return (
    <div className="card card-hover">
      <h3 className="section-title">花园地图（SVG v0）</h3>
      <svg viewBox="0 0 760 230" style={{ width: '100%', height: 'auto', borderRadius: 12, background: 'var(--bg-elevated)' }}>
        {edges.map(([a,b],i) => (
          <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="var(--border-default)" strokeDasharray="5 4" />
        ))}
        {nodes.map((n) => (
          <g key={n.id} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(null)}>
            <circle cx={n.x} cy={n.y} r="18" fill="var(--brand-primary)" opacity="0.85" />
            <text x={n.x} y={n.y + 34} textAnchor="middle" fontSize="12" fill="var(--text-secondary)">{n.name}</text>
          </g>
        ))}
      </svg>
      {hover && <p className="subtle">{hover.name} · {hover.zone} · <Link to={`/plot/${hover.id}`}>打开地块</Link></p>}
    </div>
  );
}
