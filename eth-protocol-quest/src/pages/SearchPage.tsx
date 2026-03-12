import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { glossary } from '../data/glossary';
import { foundationChapters } from '../data/curriculum/foundations';
import { deepDiveChapters } from '../data/curriculum/deepdives';
import { plots, searchAliases } from '../data/plotCatalog';

type SearchType = '术语' | '课程' | '地块';

type SearchRow = {
  type: SearchType;
  title: string;
  desc: string;
  href: string;
};

export function SearchPage() {
  const [q, setQ] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | SearchType>('all');
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const rows = useMemo<SearchRow[]>(() => {
    const chapterRows: SearchRow[] = [...foundationChapters, ...deepDiveChapters].map((chapter) => ({
      type: '课程',
      title: chapter.title,
      desc: chapter.objective,
      href: `/curriculum#${chapter.id}`
    }));
    const glossaryRows: SearchRow[] = glossary.map((item) => ({
      type: '术语',
      title: item.term,
      desc: item.desc,
      href: '/glossary'
    }));
    const plotRows: SearchRow[] = plots.map((plot) => ({
      type: '地块',
      title: plot.title,
      desc: plot.summary,
      href: `/plot/${plot.id}`
    }));

    const all = [...plotRows, ...chapterRows, ...glossaryRows];
    const key = q.trim().toLowerCase();
    let result = all;
    if (key) {
      const aliasBlob = (searchAliases[key] || []).join(' ');
      const search = `${key} ${aliasBlob}`.trim();
      result = all.filter((row) => `${row.title} ${row.desc}`.toLowerCase().includes(search));
    }
    if (typeFilter !== 'all') result = result.filter((row) => row.type === typeFilter);
    return result.slice(0, 100);
  }, [q, typeFilter]);

  useEffect(() => {
    if (!rows.length) {
      setActiveKey(null);
      return;
    }
    const exists = rows.some((row, idx) => `${row.type}-${row.title}-${idx}` === activeKey);
    if (!exists) setActiveKey(`${rows[0].type}-${rows[0].title}-0`);
  }, [rows, activeKey]);

  const groupedCount = useMemo(() => {
    return rows.reduce<Record<SearchType, number>>(
      (acc, row) => {
        acc[row.type] += 1;
        return acc;
      },
      { 地块: 0, 课程: 0, 术语: 0 }
    );
  }, [rows]);

  const activeRow = useMemo(() => {
    if (!activeKey) return null;
    return rows.find((row, idx) => `${row.type}-${row.title}-${idx}` === activeKey) || null;
  }, [rows, activeKey]);

  return (
    <main className="container container-wide">
      <div className="page-head">
        <nav className="breadcrumb" aria-label="breadcrumb">
          <Link to="/">首页</Link> / <span>搜索</span>
        </nav>
        <h2>搜索</h2>
      </div>

      <section className="tri-layout search-layout">
        <aside className="card tri-left">
          <h3>筛选</h3>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="输入关键词"
            aria-label="搜索"
          />
          <div className="search-type-stack">
            <button className={`search-type-btn ${typeFilter === 'all' ? 'active' : ''}`} onClick={() => setTypeFilter('all')}>
              全部 <span>{rows.length}</span>
            </button>
            <button className={`search-type-btn ${typeFilter === '地块' ? 'active' : ''}`} onClick={() => setTypeFilter('地块')}>
              地块 <span>{groupedCount['地块']}</span>
            </button>
            <button className={`search-type-btn ${typeFilter === '课程' ? 'active' : ''}`} onClick={() => setTypeFilter('课程')}>
              课程 <span>{groupedCount['课程']}</span>
            </button>
            <button className={`search-type-btn ${typeFilter === '术语' ? 'active' : ''}`} onClick={() => setTypeFilter('术语')}>
              术语 <span>{groupedCount['术语']}</span>
            </button>
          </div>
        </aside>

        <section className="card tri-main">
          <h3>结果</h3>
          {rows.length === 0 ? (
            <p className="subtle">无结果。</p>
          ) : (
            <ul className="search-list">
              {rows.map((row, idx) => {
                const key = `${row.type}-${row.title}-${idx}`;
                return (
                  <li key={key}>
                    <button
                      className={`search-item ${activeKey === key ? 'active' : ''}`}
                      onClick={() => setActiveKey(key)}
                    >
                      <div className="search-item-head">
                        <strong>{row.title}</strong>
                        <span className="meta-pill">{row.type}</span>
                      </div>
                      <small className="subtle">{row.desc}</small>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <aside className="card tri-right">
          <h3>详情</h3>
          {!activeRow ? (
            <p className="subtle">未选择结果。</p>
          ) : (
            <>
              <span className="meta-pill">{activeRow.type}</span>
              <h4 style={{ margin: '8px 0' }}>{activeRow.title}</h4>
              <p>{activeRow.desc}</p>
              <Link className="btn" to={activeRow.href}>打开</Link>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}

