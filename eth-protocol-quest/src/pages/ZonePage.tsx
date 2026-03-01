import { Link, useParams } from 'react-router-dom';
import { PlotCard } from '../components/ui/PlotCard';

const sample = [
  { id: 'el-core', title: 'EL 执行层核心', summary: '状态转移与 gas 机制', zone: 'Execution' as const, difficulty: 2 as const, timeMins: 35, tags: ['EVM', 'Gas'] },
  { id: 'cl-core', title: 'CL 共识层核心', summary: 'fork choice 与最终性', zone: 'Consensus' as const, difficulty: 2 as const, timeMins: 40, tags: ['Finality', 'Validator'] },
  { id: 'security-core', title: '安全专题', summary: '重组与审查阻力', zone: 'Security' as const, difficulty: 4 as const, timeMins: 45, tags: ['Reorg', 'Monitoring'] }
];

export function ZonePage() {
  const { zoneKey } = useParams();
  return (
    <main className="container">
      <Link to="/">← 首页</Link>
      <section className="card card-hover">
        <h2>{zoneKey || 'Zone'} 园区</h2>
        <p className="subtle">园区概览：地块数量 {sample.length} · 预计总时长 120+ 分钟</p>
        <div className="quick-links">
          <Link className="btn" to="/curriculum">Start path</Link>
          <Link className="btn btn-ghost" to="/map">Explore map</Link>
        </div>
      </section>
      <section className="grid">
        {sample.map((p) => <PlotCard key={p.id} {...p} progress={0.3} />)}
      </section>
    </main>
  );
}
