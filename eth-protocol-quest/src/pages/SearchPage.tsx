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
      ...glossary.map((g) => ({ type: '术语', title: g.term, desc: g.desc, href: '/glossary' })),
      ...[...foundationChapters, ...deepDiveChapters].map((c) => ({ type: '课程', title: c.title, desc: c.objective, href: `/curriculum#${c.id}` }))
    ];
    const k0 = q.trim().toLowerCase();
    const k = k0 ? `${k0} ${(aliases[k0] || []).join(' ')}` : '';
    if (!k) return all.slice(0, 40);
    return all.filter((x) => `${x.title} ${x.desc}`.toLowerCase().includes(k)).slice(0, 80);
  }, [q]);

  const onBlurSearch = () => { if (q.trim() && rows.length === 0) metricSearchMiss(q); };

  return (
    <main className="container">
      <Link to="/">← 首页</Link>
      <h2>统一搜索</h2>
      <section className="card">
        <input value={q} onBlur={onBlurSearch} onChange={(e) => setQ(e.target.value)} placeholder="搜索课程与术语（支持别名：pbs/blob/aa/verkle/mev）" style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid var(--border-default)' }} />
        <small className="subtle">结果：{rows.length}</small>
      </section>
      <section className="card">
        <ul>
          {rows.map((r, i) => <li key={`${r.title}-${i}`}><strong>[{r.type}]</strong> <a href={r.href}>{r.title}</a><div className="subtle">{r.desc}</div></li>)}
        </ul>
      </section>
    </main>
  );
}
