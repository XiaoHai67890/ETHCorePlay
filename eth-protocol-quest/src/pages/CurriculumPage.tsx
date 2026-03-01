import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { chapterMap } from '../data/chapterMap';
import { chapterAssessments } from '../data/chapterAssessments';
import { deepDiveChapters } from '../data/curriculum/deepdives';
import { chapterDependencies } from '../data/dependencies';
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
  const [query, setQuery] = useState('');
  const {
    wrongBook,
    chapterResults,
    chapterMastery,
    studyMinutes,
    setChapterResult,
    addStudyMinutes,
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

  const allChapters = useMemo(() => [...foundationChapters, ...deepDiveChapters], []);

  const chapters = useMemo(() => {
    const base = onlyPending ? allChapters.filter((c) => !done[c.id]) : allChapters;
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter((c) => {
      const blob = [
        c.title,
        c.objective,
        ...c.glossary,
        ...c.sections.flatMap((s) => [s.heading, ...s.points]),
        ...c.practice.flatMap((p) => [p.title, ...p.steps])
      ].join(' ').toLowerCase();
      return blob.includes(q);
    });
  }, [onlyPending, done, allChapters, query]);

  const completedCount = Object.values(done).filter(Boolean).length;
  const progressPct = Math.round((completedCount / allChapters.length) * 100);

  const toggleDone = (id: string) => setDone((s) => ({ ...s, [id]: !s[id] }));

  const setAnswer = (chapterId: string, qid: string, v: number) => {
    setAnswers((s) => ({ ...s, [chapterId]: { ...(s[chapterId] || {}), [qid]: v } }));
  };

  const submitAssessment = (chapterId: string, onlyWrong = false) => {
    const assessment = chapterAssessments.find((a) => a.chapterId === chapterId);
    if (!assessment) return;
    const prev = chapterResults[chapterId] as any;
    const user = answers[chapterId] || {};

    const previousWrongIds = prev?.wrongIds || [];
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
    const failed = Object.entries(chapterResults).filter(([, r]) => !r.passed);
    if (failed.length) {
      const ranked = failed
        .map(([cid, r]) => {
          const hist = ((r as any).history || []) as number[];
          const volatility = hist.length >= 2 ? Math.abs(hist[hist.length - 1] - hist[hist.length - 2]) : 0;
          return {
            cid,
            score: r.score / Math.max(1, r.total),
            wrong: (r as any).wrongIds?.length || 0,
            volatility,
            minutes: studyMinutes[cid] || 0
          };
        })
        .sort((a, b) => a.score - b.score || b.volatility - a.volatility || a.minutes - b.minutes);
      const top = ranked[0];
      const c = allChapters.find((x) => x.id === top.cid);
      return `优先复习低分章节：${c?.title ?? top.cid}（得分率 ${(top.score * 100).toFixed(0)}%，波动 ${(top.volatility * 100).toFixed(0)}%，学习时长 ${top.minutes} 分钟）。`;
    }
    if (wrongBook.length > 0) {
      const themes = ['Gas/费用', '共识最终性', '执行语义', '接口协同', '测试与安全'];
      const theme = themes[wrongBook.length % themes.length];
      return `建议先复习错题主题：${theme}（当前错题 ${wrongBook.length} 条），再进行二次测评。`;
    }
    const next = allChapters.find((c) => !done[c.id]);
    if (next) {
      const mins = studyMinutes[next.id] || 0;
      return `建议下一章学习：${next.title}（建议先投入 15~30 分钟，当前记录 ${mins} 分钟）。`;
    }
    return '你已完成全部章节，建议进入核心贡献者路径并提交第一份可验证贡献。';
  }, [chapterResults, wrongBook.length, done, allChapters, studyMinutes]);

  const pathBoard = useMemo(() => {
    const basicDone = ['el-core', 'cl-core', 'evm-core', 'tx-lifecycle-core'].filter((id) => done[id]).length;
    const builderDone = ['engine-api-core', 'eip-workflow-core', 'client-testing-core'].filter((id) => done[id]).length;
    const coreDone = ['testing-systems-core', 'security-core', 'l2-da-core', 'el-deep-state-trie', 'cl-deep-forkchoice-finality'].filter((id) => done[id]).length;
    return { basicDone, builderDone, coreDone };
  }, [done]);

  return (
    <main className="container">
      <Link to="/">← 首页</Link>
      <h2>系统化学习课程（基础→进阶）</h2>
      <p>学习优先：先完整掌握章节，再用闯关做检验。</p>

      <section className="card">
        <h3>章节知识点检索</h3>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="输入关键词：如 Engine API / Finality / Gas / Rollup"
          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #cde3d2' }}
        />
        <small>当前命中章节：{chapters.length}</small>
      </section>

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
        <h3>路径目标达成看板</h3>
        <ul>
          <li>基础路径：{pathBoard.basicDone}/4 章节完成</li>
          <li>开发者路径：{pathBoard.builderDone}/3 章节完成</li>
          <li>核心贡献者路径：{pathBoard.coreDone}/5 章节完成</li>
        </ul>
      </section>

      <section className="card">
        <h3>学习推荐引擎</h3>
        <p>{recommendation}</p>
      </section>

      <section className="card">
        <h3>内容内链接跳转</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn" onClick={() => setOnlyPending((v) => !v)}>
            {onlyPending ? '显示全部章节' : '仅看未完成章节'}
          </button>
          <Link to="/progress" className="btn">去错题本复习</Link>
          <Link to="/glossary" className="btn">去术语页复习</Link>
          <a className="btn" href="#el-core">跳 EL 核心</a>
          <a className="btn" href="#cl-core">跳 CL 核心</a>
          <a className="btn" href="#engine-api-core">跳 Engine API</a>
        </div>
      </section>

      <section className="card">
        <h3>课程导航与进度</h3>
        <p>总体进度：<strong>{completedCount}/{allChapters.length}</strong>（{progressPct}%）</p>
        <div style={{ background: '#e6f1e8', borderRadius: 10, height: 10, overflow: 'hidden', marginBottom: 10 }}>
          <div style={{ width: `${progressPct}%`, height: '100%', background: 'linear-gradient(90deg,#4a8f61,#5a76dc)' }} />
        </div>
        <ul>
          {allChapters.map((c, i) => (
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
            <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              <span style={{ padding: '2px 8px', borderRadius: 999, background: done[chapter.id] ? '#daf4df' : '#f3f5f7' }}>章节状态：{done[chapter.id] ? '已完成' : '进行中'}</span>
              <span style={{ padding: '2px 8px', borderRadius: 999, background: chapterResults[chapter.id]?.passed ? '#dbeafe' : '#fef3c7' }}>测评：{chapterResults[chapter.id] ? (chapterResults[chapter.id].passed ? '通过' : '待提高') : '未提交'}</span>
            </div>
            <p><strong>学习目标：</strong>{chapter.objective}</p>
            <p><strong>难度：</strong>{chapter.level}</p>
            <p><strong>掌握度：</strong>{chapterMastery[chapter.id] || '初学'} · <strong>学习时长：</strong>{studyMinutes[chapter.id] || 0} 分钟</p>
            <button className="btn" onClick={() => addStudyMinutes(chapter.id, 15)}>+15 分钟学习记录</button>

            <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <input type="checkbox" checked={!!done[chapter.id]} onChange={() => toggleDone(chapter.id)} />
              标记本章已完成
            </label>

            <div style={{ marginTop: 8 }}>
              <strong>前置依赖</strong>
              <div>{(chapterDependencies[chapter.id] || []).length ? (chapterDependencies[chapter.id] || []).map((d) => { const dep = allChapters.find((c) => c.id === d); return `${dep?.title || d}${done[d] ? ' ✅' : ' ⏳'}`; }).join(' / ') : '无（可直接学习）'}</div>
            </div>

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
