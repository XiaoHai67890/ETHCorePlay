import { Link } from 'react-router-dom';
import { glossary } from '../data/glossary';
import { useMemo, useState } from 'react';

export function GlossaryPage() {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return glossary;
    return glossary.filter((g) => `${g.term} ${g.desc}`.toLowerCase().includes(k));
  }, [q]);

  return (
    <main className="container">
      <Link to="/">← 首页</Link>
      <h2>协议术语花名册</h2>
      <section className="card card-hover">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索术语：如 blob / pbs / paymaster / finality"
          style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid var(--border-default)' }}
        />
        <small className="subtle">当前术语：{filtered.length}/{glossary.length}</small>
      </section>

      <div className="card">
        <ul>
          {filtered.map((g) => (
            <li key={g.term} style={{ marginBottom: 12 }}>
              <strong>{g.term}</strong>
              <div className="subtle">{g.desc}</div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
