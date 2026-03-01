import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { chapterMap } from '../data/chapterMap';
import { foundationChapters } from '../data/curriculum/foundations';
import { learningPaths } from '../data/learningPaths';

type DoneMap = Record<string, boolean>;
type QuizResultMap = Record<string, { score: number; total: number }>;
const STORAGE_KEY = 'epq_curriculum_done_v1';
const QUIZ_KEY = 'epq_curriculum_quiz_v1';

export function CurriculumPage() {
  const [done, setDone] = useState<DoneMap>({});
  const [onlyPending, setOnlyPending] = useState(false);
  const [answers, setAnswers] = useState<Record<string, Record<string, number>>>({});
  const [quizResults, setQuizResults] = useState<QuizResultMap>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(JSON.parse(raw));
      const rawQuiz = localStorage.getItem(QUIZ_KEY);
      if (rawQuiz) setQuizResults(JSON.parse(rawQuiz));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
  }, [done]);

  useEffect(() => {
    localStorage.setItem(QUIZ_KEY, JSON.stringify(quizResults));
  }, [quizResults]);

  const chapters = useMemo(
    () => (onlyPending ? foundationChapters.filter((c) => !done[c.id]) : foundationChapters),
    [onlyPending, done]
  );

  const completedCount = Object.values(done).filter(Boolean).length;
  const progressPct = Math.round((completedCount / foundationChapters.length) * 100);

  const toggleDone = (id: string) => setDone((s) => ({ ...s, [id]: !s[id] }));

  const setAnswer = (chapterId: string, qid: string, v: number) => {
    setAnswers((s) => ({ ...s, [chapterId]: { ...(s[chapterId] || {}), [qid]: v } }));
  };

  const submitChapterQuiz = (chapterId: string) => {
    const chapter = foundationChapters.find((c) => c.id === chapterId);
    if (!chapter) return;
    const a = answers[chapterId] || {};
    const score = chapter.practice.length > 0
      ? chapter.sections.reduce((acc, _s, idx) => acc + (a[`c-${chapterId}-${idx}`] === 0 ? 1 : 0), 0)
      : 0;
    const total = chapter.sections.length;
    setQuizResults((s) => ({ ...s, [chapterId]: { score, total } }));
  };

  return (
    <main className="container">
      <Link to="/">← 首页</Link>
      <h2>系统化学习课程（基础→进阶）</h2>
      <p>学习优先：先完整掌握章节，再用闯关做检验。</p>

      <section className="card">
        <h3>学习路径推荐</h3>
        <div className="grid">
          {learningPaths.map((path) => (
            <div key={path.id} className="level">
              <strong>{path.title}</strong>
              <small>{path.audience}</small>
              <ul>
                {path.milestones.map((m) => <li key={m}>{m}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

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
              {quizResults[c.id] ? ` · 测评 ${quizResults[c.id].score}/${quizResults[c.id].total}` : ''}
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h3>章节→术语→练习（知识图谱映射）</h3>
        {chapterMap.map((n) => (
          <div key={n.chapterId} style={{ marginBottom: 10 }}>
            <strong>{n.chapterTitle}</strong>
            <div><em>术语：</em>{n.keyTerms.join(' · ')}</div>
            <div><em>练习：</em>{n.practiceTitles.join(' / ')}</div>
          </div>
        ))}
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

          <div style={{ marginTop: 8 }}>
            <strong>重点总结卡片</strong>
            <ul>
              {chapter.sections.slice(0, 3).map((sec) => (
                <li key={sec.heading}>{sec.heading}：{sec.points[0]}</li>
              ))}
            </ul>
          </div>

          {chapter.sections.map((sec, i) => (
            <div key={sec.heading} style={{ marginTop: 10 }}>
              <strong>{sec.heading}</strong>
              <ul>
                {sec.points.map((p) => <li key={p}>{p}</li>)}
              </ul>

              <div style={{ background: '#f7fbf8', border: '1px solid #d9eadf', borderRadius: 8, padding: 8 }}>
                <div><em>章节测评题（单选）</em></div>
                <div>“{sec.heading}”最核心目标是？</div>
                {['建立正确边界与流程理解', '记住所有参数默认值', '只关注 UI 交互'].map((opt, oi) => (
                  <label key={opt} style={{ display: 'block' }}>
                    <input
                      type="radio"
                      name={`c-${chapter.id}-${i}`}
                      checked={(answers[chapter.id] || {})[`c-${chapter.id}-${i}`] === oi}
                      onChange={() => setAnswer(chapter.id, `c-${chapter.id}-${i}`, oi)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button className="btn" onClick={() => submitChapterQuiz(chapter.id)}>提交本章节测评</button>

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
