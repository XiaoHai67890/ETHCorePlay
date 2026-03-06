import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { glossary } from '../data/glossary';
import { foundationChapters } from '../data/curriculum/foundations';
import { deepDiveChapters } from '../data/curriculum/deepdives';

export function CommandK() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const rows = useMemo(() => {
    const chapters = [...foundationChapters, ...deepDiveChapters].map((c) => ({ group: 'Articles', title: c.title, desc: c.objective, href: `/curriculum#${c.id}` }));
    const terms = glossary.map((g) => ({ group: 'Terms', title: g.term, desc: g.desc, href: '/glossary' }));
    const paths = [
      { group: 'Paths', title: 'Beginner Trail', desc: 'EL/CL/EVM 主线', href: '/curriculum#el-core' },
      { group: 'Paths', title: 'Consensus Trail', desc: 'Fork choice / Finality', href: '/curriculum#cl-core' },
      { group: 'Paths', title: 'Research Trail', desc: 'Verkle / PBS / Future', href: '/curriculum#verkle-stateless-deep' }
    ];
    const topics = [
      { group: 'Topics', title: 'Execution Layer', desc: '执行层核心机制', href: '/curriculum#el-core' },
      { group: 'Topics', title: 'Consensus Layer', desc: '共识层与最终性', href: '/curriculum#cl-core' },
      { group: 'Topics', title: 'Rollups / L2', desc: '扩容与 DA', href: '/curriculum#l2-da-core' }
    ];
    const all = [...topics, ...paths, ...chapters, ...terms];
    const k = q.trim().toLowerCase();
    return (k ? all.filter((x) => `${x.title} ${x.desc}`.toLowerCase().includes(k)) : all).slice(0, 42);
  }, [q]);

  const grouped = useMemo(() => {
    const g: Record<string, typeof rows> = {};
    rows.forEach((r) => {
      (g[r.group] ||= []).push(r);
    });
    return g;
  }, [rows]);

  if (!open) return null;

  return (
    <div className="cmdk-overlay" onClick={() => setOpen(false)}>
      <div className="cmdk-panel" onClick={(e) => e.stopPropagation()}>
        <div className="card-title-row">
          <strong>Command-K Search</strong>
          <small className="subtle">ESC 关闭</small>
        </div>
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索 Topic / Path / Article / Term" style={{ width: '100%', marginTop: 8, padding: 10, borderRadius: 10, border: '1px solid var(--border-default)' }} />
        <div className="cmdk-results">
          {Object.entries(grouped).map(([group, items]) => (
            <section key={group} className="cmdk-group">
              <small className="subtle">{group}</small>
              <ul>
                {items.map((r) => (
                  <li key={`${group}-${r.title}`}>
                    <Link to={r.href} onClick={() => setOpen(false)}><strong>{r.title}</strong><div className="subtle">{r.desc}</div></Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          {!rows.length && <div className="notice">无匹配结果，试试相关术语或路径关键词。</div>}
        </div>
      </div>
    </div>
  );
}
