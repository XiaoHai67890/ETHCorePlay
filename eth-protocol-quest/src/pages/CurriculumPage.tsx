import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { foundationChapters } from '../data/curriculum/foundations';

type DoneMap = Record<string, boolean>;
const STORAGE_KEY = 'epq_curriculum_done_v1';

export function CurriculumPage() {
  const [done, setDone] = useState<DoneMap>({});
  const [onlyPending, setOnlyPending] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
  }, [done]);

  const chapters = useMemo(
    () => (onlyPending ? foundationChapters.filter((c) => !done[c.id]) : foundationChapters),
    [onlyPending, done]
  );

  const completedCount = Object.values(done).filter(Boolean).length;
  const progressPct = Math.round((completedCount / foundationChapters.length) * 100);

  const toggleDone = (id: string) => setDone((s) => ({ ...s, [id]: !s[id] }));

  return (
    <main className="container">
      <Link to="/">← 首页</Link>
      <h2>系统化学习课程（基础→进阶）</h2>
      <p>学习优先：先完整掌握章节，再用闯关做检验。</p>

      <section className="card">
        <h3>课程导航与进度</h3>
        <p>总体进度：<strong>{completedCount}/{foundationChapters.length}</strong>（{progressPct}%）</p>
        <div style={{ background: '#e6f1e8', borderRadius: 10, height: 10, overflow: 'hidden', marginBottom: 10 }}>
          <div style={{ width: `${progressPct}%`, height: '100%', background: 'linear-gradient(90deg,#4a8f61,#5a76dc)' }} />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn" onClick={() => setOnlyPending((v) => !v)}>
            {onlyPending ? '显示全部章节' : '仅看未完成章节'}
          </button>
          <Link to="/progress" className="btn">去错题本复习</Link>
          <Link to="/glossary" className="btn">去术语页复习</Link>
        </div>
        <ul>
          {foundationChapters.map((c, i) => (
            <li key={c.id}>
              <a href={`#${c.id}`}>{i + 1}. {c.title}</a> {done[c.id] ? '✅' : '🕓'}
            </li>
          ))}
        </ul>
      </section>

      {chapters.map((chapter, idx) => (
        <section key={chapter.id} id={chapter.id} className="card">
          <h3>{idx + 1}. {chapter.title}</h3>
          <p><strong>学习目标：</strong>{chapter.objective}</p>
          <p><strong>难度：</strong>{chapter.level}</p>

          <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <input type="checkbox" checked={!!done[chapter.id]} onChange={() => toggleDone(chapter.id)} />
            标记本章已完成
          </label>

          {chapter.sections.map((sec) => (
            <div key={sec.heading} style={{ marginTop: 10 }}>
              <strong>{sec.heading}</strong>
              <ul>
                {sec.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          ))}

          <div style={{ marginTop: 10 }}>
            <strong>常见误区</strong>
            <ul>
              {chapter.pitfalls.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>

          <div style={{ marginTop: 10 }}>
            <strong>术语清单</strong>
            <div>{chapter.glossary.join(' · ')}</div>
          </div>

          <div style={{ marginTop: 10 }}>
            <strong>实战练习步骤</strong>
            {chapter.practice.map((task) => (
              <div key={task.title} style={{ marginTop: 6 }}>
                <em>{task.title}</em>
                <ol>
                  {task.steps.map((s) => <li key={s}>{s}</li>)}
                </ol>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
