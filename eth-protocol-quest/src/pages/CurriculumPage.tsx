import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { foundationChapters } from '../data/curriculum/foundations';
import { deepDiveChapters } from '../data/curriculum/deepdives';
import { chapterDependencies } from '../data/dependencies';

type DoneMap = Record<string, boolean>;
const STORAGE_KEY = 'epq_curriculum_done_v3';

export function CurriculumPage() {
  const [done, setDone] = useState<DoneMap>({});
  const [onlyPending, setOnlyPending] = useState(false);
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);

  const allChapters = useMemo(() => [...foundationChapters, ...deepDiveChapters], []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {
      // ignore bad storage
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
  }, [done]);

  const chapters = useMemo(() => {
    let base = onlyPending ? allChapters.filter((c) => !done[c.id]) : allChapters;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      base = base.filter((chapter) => {
        const haystack = [chapter.title, chapter.objective, ...chapter.glossary].join(' ').toLowerCase();
        return haystack.includes(q);
      });
    }
    return base;
  }, [allChapters, done, onlyPending, query]);

  useEffect(() => {
    if (!chapters.length) {
      setActiveId(null);
      return;
    }
    if (!activeId || !chapters.some((c) => c.id === activeId)) setActiveId(chapters[0].id);
  }, [chapters, activeId]);

  const activeChapter = useMemo(
    () => chapters.find((chapter) => chapter.id === activeId) || null,
    [chapters, activeId]
  );

  const completedCount = Object.values(done).filter(Boolean).length;
  const progressPct = allChapters.length ? Math.round((completedCount / allChapters.length) * 100) : 0;

  const toggleDone = (id: string) => {
    setDone((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const pendingCount = allChapters.length - completedCount;

  return (
    <main className="container container-wide">
      <div className="page-head">
        <nav className="breadcrumb" aria-label="breadcrumb">
          <Link to="/">首页</Link> / <span>课程</span>
        </nav>
        <h2>课程</h2>
      </div>

      <section className="tri-layout curriculum-layout">
        <aside className="card tri-left curriculum-sidebar">
          <h3>章节目录</h3>
          <div className="layout-filters">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索章节"
              aria-label="搜索章节"
            />
            <button className="btn btn-ghost" onClick={() => setOnlyPending((v) => !v)}>
              {onlyPending ? '显示全部' : '仅看未完成'}
            </button>
          </div>
          <div className="curriculum-list">
            {chapters.map((chapter, idx) => (
              <button
                key={chapter.id}
                className={`curriculum-item ${activeId === chapter.id ? 'active' : ''}`}
                onClick={() => setActiveId(chapter.id)}
              >
                <span>{idx + 1}. {chapter.title}</span>
                <small>{done[chapter.id] ? '已完成' : chapter.level}</small>
              </button>
            ))}
          </div>
        </aside>

        <article className="card tri-main curriculum-content">
          {!activeChapter ? (
            <p className="subtle">暂无章节。</p>
          ) : (
            <>
              <div className="card-title-row">
                <h3 style={{ margin: 0 }}>{activeChapter.title}</h3>
                <span className="meta-pill">{activeChapter.level}</span>
              </div>
              <p>{activeChapter.objective}</p>

              <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                <input
                  type="checkbox"
                  checked={!!done[activeChapter.id]}
                  onChange={() => toggleDone(activeChapter.id)}
                />
                标记本章已完成
              </label>

              <section style={{ marginTop: 16 }}>
                <h4>章节结构</h4>
                {activeChapter.sections.map((section, i) => (
                  <details key={`${activeChapter.id}-sec-${i}`} open={i === 0}>
                    <summary>{section.heading}</summary>
                    <ul>
                      {section.points.map((point) => <li key={point}>{point}</li>)}
                    </ul>
                  </details>
                ))}
              </section>

              <section style={{ marginTop: 16 }}>
                <h4>实战任务</h4>
                {activeChapter.practice.map((task) => (
                  <div key={task.title} className="practice-block">
                    <strong>{task.title}</strong>
                    <ol>
                      {task.steps.map((step) => <li key={step}>{step}</li>)}
                    </ol>
                  </div>
                ))}
              </section>
            </>
          )}
        </article>

        <aside className="card tri-right curriculum-sidepanel">
          <h3>概览</h3>
          <div className="kpi-grid compact">
            <div className="kpi"><small>完成</small><br /><b>{completedCount}</b></div>
            <div className="kpi"><small>待完成</small><br /><b>{pendingCount}</b></div>
          </div>
          <div style={{ marginTop: 10 }}>
            <small>总体进度 {progressPct}%</small>
            <div className="progress-rail" style={{ marginTop: 6 }}>
              <div className="progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          {activeChapter ? (
            <section style={{ marginTop: 14 }}>
              <h4>当前章节</h4>
              <p>{activeChapter.title}</p>
              <div className="chips">
                {(chapterDependencies[activeChapter.id] || []).length ? (
                  (chapterDependencies[activeChapter.id] || []).map((dep) => (
                    <span key={`${activeChapter.id}-${dep}`} className="chip">前置 {dep}</span>
                  ))
                ) : (
                  <span className="chip">无前置</span>
                )}
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Link className="btn btn-ghost" to="/map">地图</Link>
                <Link className="btn btn-ghost" to="/progress">总览</Link>
              </div>
            </section>
          ) : null}
        </aside>
      </section>
    </main>
  );
}

