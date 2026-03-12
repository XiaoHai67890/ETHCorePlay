import { Link } from 'react-router-dom';
import { glossary as localGlossary, type GlossaryStatus } from '../data/glossary';
import { useEffect, useMemo, useState } from 'react';
import { loadCmsJson } from '../services/cms';
import { GlossaryGraph } from '../components/GlossaryGraph';

const statusOrder: GlossaryStatus[] = ['Mainnet', 'Ecosystem', 'Roadmap', 'Research', 'Concept', 'Depends', 'General'];
const chapterHref = (id: string) => `/curriculum#${id}`;

export function GlossaryPage() {
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<GlossaryStatus | 'All'>('All');
  const [glossary, setGlossary] = useState(localGlossary);

  useEffect(() => {
    loadCmsJson('glossary', localGlossary).then((rows: any[]) => {
      const normalized = (rows || []).map((g) => ({ ...g, status: g.status || 'General' }));
      setGlossary(normalized);
    });
  }, []);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    return glossary.filter((g: any) => {
      const passText = !k || `${g.term} ${g.desc}`.toLowerCase().includes(k);
      const passStatus = statusFilter === 'All' || g.status === statusFilter;
      return passText && passStatus;
    });
  }, [q, glossary, statusFilter]);

  const grouped = useMemo(() => {
    const buckets: Record<string, typeof filtered> = {};
    filtered.forEach((g: any) => {
      const c = /^[A-Za-z]/.test(g.term) ? g.term[0].toUpperCase() : '#';
      if (!buckets[c]) buckets[c] = [];
      buckets[c].push(g);
    });
    return Object.entries(buckets).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  return (
    <main className="container">
      <Link to="/">← 首页</Link>
      <h2>协议术语花名册</h2>
      <section className="card card-hover">
        <label htmlFor="glossary-search" className="subtle">搜索术语</label>
        <input id="glossary-search" aria-label="搜索术语"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索术语：如 blob / pbs / paymaster / finality"
          style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid var(--border-default)' }}
        />
        <div className="chips" style={{ marginTop: 8 }}>
          <button className={`chip-btn ${statusFilter === 'All' ? 'on' : ''}`} onClick={() => setStatusFilter('All')}>All</button>
          {statusOrder.map((s) => (
            <button key={s} aria-pressed={statusFilter === s} className={`chip-btn ${statusFilter === s ? 'on' : ''}`} onClick={() => setStatusFilter(s)}>{s}</button>
          ))}
        </div>
        <small className="subtle">当前术语：{filtered.length}/{glossary.length}</small>
      </section>

      <GlossaryGraph glossary={filtered as any} />

      <div className="card card-hover">
        <div className="chips" style={{ marginBottom: 10 }}>
          {grouped.map(([k]) => <a key={k} href={`#g-${k}`} className="chip">{k}</a>)}
        </div>
        {grouped.map(([k, list]) => (
          <section key={k} id={`g-${k}`} style={{ marginBottom: 14 }}>
            <h3 style={{ marginBottom: 8 }}>{k}</h3>
            <div className="grid">
              {list.map((g: any) => (
                <article key={g.term} className="level" style={{ cursor: 'default' }}>
                  <div className="card-title-row">
                    <strong>{g.term}</strong>
                    <span className={`status-badge ${String(g.status || 'General').toLowerCase()}`}>{g.status || 'General'}</span>
                  </div>
                  <small>{g.desc}</small>
                  {!!g.relatedTerms?.length && (
                    <div className="chips" style={{ marginTop: 6 }}>
                      {g.relatedTerms.map((t: string) => <span key={t} className="chip">↔ {t}</span>)}
                    </div>
                  )}
                  {!!g.relatedChapters?.length && (
                    <div className="quick-links" style={{ marginTop: 6 }}>
                      {g.relatedChapters.map((cid: string) => <Link key={cid} to={chapterHref(cid)} className="btn btn-ghost" style={{ padding: '4px 10px' }}>相关章节：{cid}</Link>)}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
