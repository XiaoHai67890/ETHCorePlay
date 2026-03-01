import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { chapterMap } from '../data/chapterMap';
import { chapterAssessments } from '../data/chapterAssessments';
import { foundationChapters } from '../data/curriculum/foundations';
import { learningPaths } from '../data/learningPaths';
import { useProgressStore } from '../game/store';

type DoneMap = Record<string, boolean>;
const STORAGE_KEY = 'epq_curriculum_done_v1';

function chapterDomain(chapterId: string): 'EL' | 'CL' | 'EVM' | 'Networking' | 'Economics' | 'EIP' | 'Client' | 'Testing' | 'Security' | 'L2' {
  if (chapterId.startsWith('el-') || chapterId.includes('tx-')) return 'EL';
  if (chapterId.startsWith('cl-')) return 'CL';
  if (chapterId.startsWith('evm-')) return 'EVM';
  if (chapterId.includes('eip')) return 'EIP';
  if (chapterId.includes('engine') || chapterId.includes('client')) return 'Client';
  if (chapterId.includes('testing')) return 'Testing';
  if (chapterId.includes('security')) return 'Security';
  if (chapterId.includes('l2') || chapterId.includes('da')) return 'L2';
  return 'Client';
}

export function CurriculumPage() {
  const [done, setDone] = useState<DoneMap>({});
  const [onlyPending, setOnlyPending] = useState(false);
  const [answers, setAnswers] = useState<Record<string, Record<string, number>>>({});
  const [retryMode, setRetryMode] = useState<Record<string, boolean>>({});
  const {
    wrongBook,
    chapterResults,
    setChapterResult,
    knowledgeMap,
    setKnowledgeStatus
  } = useProgressStore();

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

  const setAnswer = (chapterId: string, qid: string, v: number) => {
    setAnswers((s) => ({ ...s, [chapterId]: { ...(s[chapterId] || {}), [qid]: v } }));
  };

  const submitAssessment = (chapterId: string, onlyWrong = false) => {
    const assessment = chapterAssessments.find((a) => a.chapterId === chapterId);
    if (!assessment) return;
    const prev = chapterResults[chapterId];
    const user = answers[chapterId] || {};

    const previousWrongIds = (prev && (prev as any).wrongIds) ? (prev as any).wrongIds as string[] : [];
    const baseQs = assessment.questions;
    const scopedQs = onlyWrong && previousWrongIds.length
      ? baseQs.filter((q) => previousWrongIds.includes(q.id))
      : baseQs;

    const score = scopedQs.reduce((acc, q) => acc + (user[q.id] === q.answerIndex ? 1 : 0), 0);
    const total = scopedQs.length || 1;
    const wrongIds = scopedQs.filter((q) => user[q.id] !== q.answerIndex).map((q) => q.id);
    const threshold = assessment.passThreshold;
    const passed = score / total >= threshold;

    setChapterResult(chapterId, { score, total, passed, threshold, wrongIds } as any);

    if (passed) {
      const domain = chapterDomain(chapterId);
      const target = knowledgeMap.find((n) => n.domain === domain && n.status !== 'done');
      if (target) setKnowledgeStatus(target.id, 'done');
      setRetryMode((s) => ({ ...s, [chapterId]: false }));
    }
  };

  const recommendation = useMemo(() => {
    const failed = Object.entries(chapterResults).filter(([, r]) => !r.passed).map(([cid]) => cid);
    if (failed.length) {
      const c = foundationChapters.find((x) => x.id === failed[0]);
      return `优先复习未通过章节：${c?.title ?? failed[0]}（先看误区，再做测评）。`;
    }
    if (wrongBook.length > 0) {
      return `你有 ${wrongBook.length} 条错题，建议先去错题本复习，再继续下一章。`;
    }
    const next = foundationChapters.find((c) => !done[c.id]);
    if (next) return `建议下一章学习：${next.title}`;
    return '你已完成全部章节，建议进入核心贡献者路径并提交第一份可验证贡献。';
  }, [chapterResults, wrongBook.length, done]);

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
        <h3>学习推荐引擎</h3>
        <p>{recommendation}</p>
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
              {chapterResults[c.id] ? ` · 章节测评 ${chapterResults[c.id].score}/${chapterResults[c.id].total} ${chapterResults[c.id].passed ? '✅通过' : '❌未通过'}` : ''}
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

      {chapters.map((chapter, idx) => {
        const assessment = chapterAssessments.find((a) => a.chapterId === chapter.id);
        return (
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

            {chapter.sections.map((sec) => (
              <div key={sec.heading} style={{ marginTop: 10 }}>
                <strong>{sec.heading}</strong>
                <ul>
                  {sec.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>
            ))}

            {assessment && (
              <div style={{ marginTop: 10, background: '#f7fbf8', border: '1px solid #d9eadf', borderRadius: 8, padding: 10 }}>
                <strong>章节测评（题库化评分）</strong>
                <p>通过门槛：{Math.round(assessment.passThreshold * 100)}%</p>
                {assessment.questions.map((q) => (
                  <div key={q.id} style={{ marginTop: 8 }}>
                    <div>{q.prompt}</div>
                    {q.options.map((opt, oi) => (
                      <label key={opt} style={{ display: 'block' }}>
                        <input
                          type="radio"
                          name={q.id}
                          checked={(answers[chapter.id] || {})[q.id] === oi}
                          onChange={() => setAnswer(chapter.id, q.id, oi)}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button className="btn" onClick={() => submitAssessment(chapter.id, false)}>提交章节测评</button>
                  <button className="btn" onClick={() => { setRetryMode((s) => ({ ...s, [chapter.id]: true })); submitAssessment(chapter.id, true); }}>
                    错题回放 + 二次测评
                  </button>
                </div>
                {chapterResults[chapter.id] && (
                  <p>
                    本章结果：{chapterResults[chapter.id].score}/{chapterResults[chapter.id].total}，
                    {chapterResults[chapter.id].passed ? '已通过' : '未通过'}
                    {((chapterResults[chapter.id] as any).wrongIds || []).length > 0 ? `，错题数：${(chapterResults[chapter.id] as any).wrongIds.length}` : ''}
                    {retryMode[chapter.id] ? '（已执行错题回放模式）' : ''}
                  </p>
                )}
              </div>
            )}

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
        );
      })}
    </main>
  );
}
