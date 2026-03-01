import { Link, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { PlotCard } from '../components/ui/PlotCard';
import { GardenLinksPanel } from '../components/ui/GardenLinksPanel';

const sample = [
  { id: 'el-core', title: 'EL 执行层核心', summary: '状态转移与 gas 机制', zone: 'Execution' as const, difficulty: 2 as const, timeMins: 35, tags: ['EVM', 'Gas'], status: 'learning' as const, progress: 0.5 },
  { id: 'cl-core', title: 'CL 共识层核心', summary: 'fork choice 与最终性', zone: 'Consensus' as const, difficulty: 2 as const, timeMins: 40, tags: ['Finality', 'Validator'], status: 'new' as const, progress: 0.2 },
  { id: 'security-core', title: '安全专题', summary: '重组与审查阻力', zone: 'Security' as const, difficulty: 4 as const, timeMins: 45, tags: ['Reorg', 'Monitoring'], status: 'bloomed' as const, progress: 1 },
  { id: 'engine-api-core', title: 'Engine API', summary: 'EL/CL 协同接口', zone: 'Tooling' as const, difficulty: 3 as const, timeMins: 38, tags: ['Client'], status: 'learning' as const, progress: 0.6 }
];

export function ZonePage() {
  const { zoneKey } = useParams();
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<'all' | '1-2' | '3-5'>('all');
  const [hasLab, setHasLab] = useState(false);
  const [sort, setSort] = useState<'recommended' | 'difficulty' | 'time'>('recommended');
  const [view, setView] = useState<'grid' | 'map-lite'>('grid');

  const list = useMemo(() => {
    let r = [...sample];
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((x) => `${x.title} ${x.summary} ${x.tags.join(' ')}`.toLowerCase().includes(q));
    }
    if (difficulty === '1-2') r = r.filter((x) => x.difficulty <= 2);
    if (difficulty === '3-5') r = r.filter((x) => x.difficulty >= 3);
    if (hasLab) r = r.filter((x) => x.tags.includes('Client') || x.tags.includes('Monitoring'));
    if (sort === 'difficulty') r.sort((a, b) => a.difficulty - b.difficulty);
    if (sort === 'time') r.sort((a, b) => (a.timeMins || 0) - (b.timeMins || 0));
    return r;
  }, [search, difficulty, hasLab, sort]);

  return (
    <main className="container">
      <Link to="/">← 首页</Link>
      <section className="card card-hover">
        <h2>{zoneKey || 'Zone'} 园区</h2>
        <p className="subtle">园区概览：地块数量 {sample.length} · 预计总时长 120+ 分钟</p>
        <div className="quick-links">
          <Link className="btn" to="/curriculum">Start path</Link>
          <Link className="btn btn-ghost" to="/map">Explore</Link>
        </div>
      </section>

      <section className="card card-hover" style={{ position: 'sticky', top: 72, zIndex: 20 }}>
        <h3>Zone Toolbar</h3>
        <div className="filter-row">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search plots" style={{ padding: 8, borderRadius: 10, border: '1px solid var(--border-default)' }} />
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)}>
            <option value="all">Difficulty: All</option>
            <option value="1-2">Difficulty: 1-2</option>
            <option value="3-5">Difficulty: 3-5</option>
          </select>
          <label><input type="checkbox" checked={hasLab} onChange={(e) => setHasLab(e.target.checked)} /> Has Lab</label>
          <select value={sort} onChange={(e) => setSort(e.target.value as any)}>
            <option value="recommended">Sort: Recommended</option>
            <option value="difficulty">Sort: Difficulty</option>
            <option value="time">Sort: Time</option>
          </select>
          <select value={view} onChange={(e) => setView(e.target.value as any)}>
            <option value="grid">View: Grid</option>
            <option value="map-lite">View: Map-lite</option>
          </select>
        </div>
      </section>

      {view === 'grid' ? (
        <section className="grid">
          {list.map((p) => <PlotCard key={p.id} {...p} />)}
        </section>
      ) : (
        <section className="card">
          <h3>Map-lite View</h3>
          <p className="subtle">当前命中 {list.length} 个地块。可切回 Grid 查看详情卡片。</p>
          <div className="chips">{list.map((x) => <span className="chip" key={x.id}>{x.title}</span>)}</div>
        </section>
      )}

      <section className="grid" style={{ gridTemplateColumns: '1fr 320px', alignItems: 'start' }}>
        <div />
        <GardenLinksPanel />
      </section>
    </main>
  );
}
