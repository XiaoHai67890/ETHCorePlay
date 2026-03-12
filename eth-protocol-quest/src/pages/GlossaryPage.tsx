import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { glossary } from '../data/glossary';

type GlossaryItem = (typeof glossary)[number];

export function GlossaryPage() {
  const [query, setQuery] = useState('');
  const [activeTerm, setActiveTerm] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return glossary;
    return glossary.filter((item) => `${item.term} ${item.desc}`.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    if (!filtered.length) {
      setActiveTerm(null);
      return;
    }
    if (!activeTerm || !filtered.some((item) => item.term === activeTerm)) {
      setActiveTerm(filtered[0].term);
    }
  }, [filtered, activeTerm]);

  const letters = useMemo(() => {
    const set = new Set<string>();
    filtered.forEach((item) => set.add(item.term[0].toUpperCase()));
    return Array.from(set).sort();
  }, [filtered]);

  const activeItem = useMemo<GlossaryItem | null>(
    () => filtered.find((item) => item.term === activeTerm) || null,
    [filtered, activeTerm]
  );

  return (
    <main className="container container-wide">
      <div className="page-head">
        <nav className="breadcrumb" aria-label="breadcrumb">
          <Link to="/">首页</Link> / <span>术语</span>
        </nav>
        <h2>协议术语</h2>
      </div>

      <section className="tri-layout glossary-layout">
        <aside className="card tri-left">
          <h3>索引</h3>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索术语"
            aria-label="搜索术语"
          />
          <div className="chips" style={{ marginTop: 10 }}>
            {letters.map((letter) => (
              <button key={letter} className="chip-btn" onClick={() => {
                const target = filtered.find((item) => item.term.toUpperCase().startsWith(letter));
                if (target) setActiveTerm(target.term);
              }}>
                {letter}
              </button>
            ))}
          </div>
          <small className="subtle">共 {filtered.length} 项</small>
        </aside>

        <section className="card tri-main">
          <h3>列表</h3>
          <ul className="term-list">
            {filtered.map((item) => (
              <li key={item.term}>
                <button
                  className={`term-item ${activeTerm === item.term ? 'active' : ''}`}
                  onClick={() => setActiveTerm(item.term)}
                >
                  <strong>{item.term}</strong>
                  <div className="subtle">{item.desc}</div>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <aside className="card tri-right">
          <h3>详情</h3>
          {!activeItem ? (
            <p className="subtle">无匹配术语。</p>
          ) : (
            <>
              <strong>{activeItem.term}</strong>
              <p>{activeItem.desc}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Link className="btn btn-ghost" to="/search">去搜索</Link>
                <Link className="btn btn-ghost" to="/curriculum">去课程</Link>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}

