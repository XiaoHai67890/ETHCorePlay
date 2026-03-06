import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { glossary } from '../data/glossary';
import { foundationChapters } from '../data/curriculum/foundations';
import { deepDiveChapters } from '../data/curriculum/deepdives';
import { metricSearchMiss } from '../services/telemetry';

const aliases: Record<string, string[]> = {
  pbs: ['proposer builder separation', 'inclusion list'],
  blob: ['4844', 'data availability'],
  aa: ['account abstraction', '4337'],
  verkle: ['stateless', 'witness'],
  mev: ['mempool', 'builder relay']
};

export function SearchPage() {
  const [q, setQ] = useState('');
  const rows = useMemo(() => {
    const all = [
      ...glossary.map((g) => ({ group: 'Terms', type: '术语', title: g.term, desc: g.desc, href: '/glossary' })),
      ...[...foundationChapters, ...deepDiveChapters].map((c) => ({ group: 'Articles', type: '课程', title: c.title, desc: c.objective, href: `/curriculum#${c.id}` })),
      { group: 'Paths', type: '路径', title: 'Beginner Trail', desc: 'EL/CL/EVM 主线', href: '/curriculum#el-core' },
      { group: 'Paths', type: '路径', title: 'Consensus Trail', desc: 'Fork choice / Finality', href: '/curriculum#cl-core' },
      { group: 'Topics', type: '主题', title: 'Rollups / L2', desc: '扩容与 DA 机制', href: '/curriculum#l2-da-core' }
    ];
    const k0 = q.trim().toLowerCase();
    const k = k0 ? `${k0} ${(aliases[k0] || []).join(' ')}` : '';
    if (!k) return all.slice(0, 50);
    return all.filter((x) => `${x.title} ${x.desc}`.toLowerCase().includes(k)).slice(0, 90);
  }, [q]);

  const grouped = useMemo(() => {
    const g: Record<string, typeof rows> = {};
    rows.forEach((r) => ((g[r.group] ||= []).push(r)));
    return g;
  }, [rows]);

  const onBlurSearch = () => { if (q.trim() && rows.length === 0) metricSearchMiss(q); };

  return (
    <main className="container">
      <Link to="/">← 首页</Link>
      <h2>统一搜索</h2>
      <section className="card garden-shell">
        <div className="card-title-row"><strong>Command-K 风格搜索</strong><small className="subtle">快捷键：⌘/Ctrl + K</small></div>
        <input value={q} onBlur={onBlurSearch} onChange={(e) => setQ(e.target.value)} placeholder="搜索课程、术语、路径、主题（支持别名：pbs/blob/aa/verkle/mev）" style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid var(--border-default)', marginTop: 8 }} />
        <small className="subtle">结果：{rows.length}</small>
      </section>
      <section className="card">
        {Object.entries(grouped).map(([group, list]) => (
          <div key={group} style={{ marginBottom: 12 }}>
            <h4 style={{ marginBottom: 6 }}>{group}</h4>
            <ul>
              {list.map((r, i) => <li key={`${r.title}-${i}`}><strong>[{r.type}]</strong> <a href={r.href}>{r.title}</a><div className="subtle">{r.desc}</div></li>)}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}
