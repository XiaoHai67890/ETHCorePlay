import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { chapterMap } from '../data/chapterMap';
import { chapterAssessments as localAssessments } from '../data/chapterAssessments';
import { deepDiveChapters } from '../data/curriculum/deepdives';
import { chapterDependencies } from '../data/dependencies';
import { chapterTemplateMapping } from '../data/templateMapping';
import { chapterChecklists } from '../data/checklists';
import { practiceTemplates } from '../data/practiceTemplates';
import { foundationChapters } from '../data/curriculum/foundations';
import { learningPaths } from '../data/learningPaths';
import { chapterSources } from '../data/chapterSources';
import { metricChapterComplete, metricRetryImprovement, telemetrySnapshot } from '../services/telemetry';
import { loadCmsJson } from '../services/cms';
import { useProgressStore } from '../game/store';
import { getLang } from '../services/i18n';

type DoneMap = Record<string, boolean>;
const COLLAPSED_KEY = 'epq_curriculum_collapsed_domains_v1';

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
  const lang = getLang();
  const [onlyPending, setOnlyPending] = useState(false);
  const [answers, setAnswers] = useState<Record<string, Record<string, number>>>({});
  const [retryMode, setRetryMode] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [domainFilter, setDomainFilter] = useState<'all' | 'EL' | 'CL' | 'EVM' | 'EIP' | 'Client' | 'Testing' | 'Security' | 'L2'>('all');
  const [sortMode, setSortMode] = useState<'default' | 'difficulty' | 'progress'>('default');
  const [collapsedDomains, setCollapsedDomains] = useState<Record<string, boolean>>({});
  const [milestoneToast, setMilestoneToast] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const [cmsChapters, setCmsChapters] = useState([...foundationChapters, ...deepDiveChapters]);
  const [cmsAssessments, setCmsAssessments] = useState(localAssessments);
  const [chapterFeedback, setChapterFeedback] = useState<Record<string, string>>({});
  const {
    wrongBook,
    chapterResults,
    chapterMastery,
    studyMinutes,
    setChapterResult,
    addStudyMinutes,
    addStudyEvent,
    studyHistory,
    knowledgeMap,
    setKnowledgeStatus,
    badges,
    awardBadge,
    setLastVisitedChapter,
    setLastVisitedSection,
    curriculumDone: done,
    curriculumChecklist: checklistState,
    curriculumExpanded: expandedChapters,
    setCurriculumDone,
    toggleCurriculumChecklist,
    markCurriculumChecklist,
    toggleCurriculumExpanded
  } = useProgressStore();


  useEffect(() => {
    loadCmsJson('chapters', [...foundationChapters, ...deepDiveChapters]).then((d: any) => setCmsChapters(d));
    loadCmsJson('assessments', localAssessments).then((d: any) => setCmsAssessments(d));
  }, []);

  const allChapters = useMemo(() => cmsChapters, [cmsChapters]);


  useEffect(() => {
    try {
      const raw = localStorage.getItem(COLLAPSED_KEY);
      if (raw) setCollapsedDomains(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(COLLAPSED_KEY, JSON.stringify(collapsedDomains));
  }, [collapsedDomains]);


  const chapters = useMemo(() => {
    let base = onlyPending ? allChapters.filter((c) => !done[c.id]) : allChapters;
    if (levelFilter !== 'all') base = base.filter((c) => c.level === levelFilter);
    if (domainFilter !== 'all') base = base.filter((c) => chapterDomain(c.id) === domainFilter);
    const q0 = query.trim().toLowerCase();
    const aliases: Record<string, string> = { pbs: 'proposer builder separation', blob: '4844 data availability', aa: 'account abstraction 4337', verkle: 'stateless witness', mev: 'builder relay proposer', eof: 'pectra bytecode format', lst: 'liquid staking token', lrt: 'liquid restaking token', yt: '以太坊 yi tai fang', gx: '共识 gong shi', zx: '执行 zhi xing' };
    const q = q0 ? `${q0} ${(aliases[q0] || '')}`.trim() : '';
    let result = !q ? base : base.filter((c) => {
      const blob = [
        c.title,
        c.objective,
        ...c.glossary,
        ...c.sections.flatMap((s) => [s.heading, ...s.points]),
        ...c.practice.flatMap((p) => [p.title, ...p.steps])
      ].join(' ').toLowerCase();
      return blob.includes(q);
    });

    if (sortMode === 'difficulty') {
      const w = { basic: 1, beginner: 1, intermediate: 2, advanced: 3 } as const;
      result = [...result].sort((a, b) => w[a.level as keyof typeof w] - w[b.level as keyof typeof w]);
    }
    if (sortMode === 'progress') {
      result = [...result].sort((a, b) => Number(done[b.id]) - Number(done[a.id]));
    }
    return result;
  }, [onlyPending, done, allChapters, query, levelFilter, domainFilter, sortMode]);

  useEffect(() => {
    setVisibleCount(8);
  }, [query, levelFilter, domainFilter, sortMode, onlyPending]);

  const chapterQualityBoard = useMemo(() => {
    return allChapters.map((c) => {
      const quality = chapterQuality(c.id);
      const deps = chapterDependencies[c.id] || [];
      const prereqHit = deps.length ? Math.round((deps.filter((d) => done[d]).length / deps.length) * 100) : 100;
      const pitfallCount = c.pitfalls.length;
      return { id: c.id, title: c.title, quality: quality.score, stability: quality.stability, prereqHit, pitfallCount, level: c.level };
    });
  }, [allChapters, done, chapterResults]);

  const telemetry = useMemo(() => telemetrySnapshot(), [chapterResults, done, wrongBook.length]);

  const completedCount = Object.values(done).filter(Boolean).length;
  const progressPct = Math.round((completedCount / allChapters.length) * 100);

  const toggleDone = (id: string) => { const next = !done[id]; setCurriculumDone(id, next); if (next) metricChapterComplete(id); };

  const toggleChecklist = (chapterId: string, idx: number) => toggleCurriculumChecklist(chapterId, idx);

  const toggleExpand = (chapterId: string) => toggleCurriculumExpanded(chapterId);

  const exportChapterReport = (chapterId: string, format: 'json' | 'html' = 'json') => {
    const chapter = allChapters.find((c) => c.id === chapterId);
    if (!chapter) return;
    const result = chapterResults[chapterId] as any;
    const prevRate = result?.history && result.history.length >= 2 ? result.history[result.history.length - 2] : null;
    const currRate = result ? result.score / Math.max(1, result.total) : null;
    const checklist = chapterChecklists.find((x) => x.chapterId === chapterId)?.items || [];
    const state = checklistState[chapterId] || {};
    const missing = checklist.filter((_, i) => !state[i]);
    const deps = chapterDependencies[chapterId] || [];
    const missingDeps = deps.filter((d) => !done[d]).map((d) => allChapters.find((c) => c.id === d)?.title || d);
    const history = studyHistory[chapterId] || [];

    const report = {
      chapter: chapter.title,
      objective: chapter.objective,
      status: done[chapterId] ? '已完成' : '进行中',
      mastery: chapterMastery[chapterId] || '初学',
      studyMinutes: studyMinutes[chapterId] || 0,
      assessment: result || null,
      compare: {
        prevRate,
        currRate,
        delta: prevRate != null && currRate != null ? currRate - prevRate : null
      },
      missingChecklist: missing,
      missingDependencies: missingDeps,
      history,
      timestamp: new Date().toISOString()
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${chapterId}-learning-report.json`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${chapter.title} 学习报告</title>
<style>body{font-family:Inter,Arial,sans-serif;padding:24px;color:#1a2b20}.card{border:1px solid #cfe5d5;border-radius:10px;padding:12px;margin:10px 0}h1,h2{color:#22543a}li{margin:4px 0}</style></head><body>
<h1>${chapter.title} 学习报告</h1>
<div class='card'><p><b>目标：</b>${chapter.objective}</p><p><b>状态：</b>${report.status}</p><p><b>掌握度：</b>${report.mastery}</p><p><b>学习时长：</b>${report.studyMinutes} 分钟</p></div>
<div class='card'><h2>测评</h2><p>${result ? `得分 ${result.score}/${result.total}，${result.passed ? '通过' : '未通过'}` : '暂无测评'}</p><p>${prevRate != null && currRate != null ? `对比上次：${(prevRate*100).toFixed(0)}% → ${(currRate*100).toFixed(0)}%（变化 ${(currRate-prevRate>=0?'+':'') + ((currRate-prevRate)*100).toFixed(0)}%）` : '对比上次：暂无历史数据'}</p></div>
<div class='card'><h2>缺项</h2><ul>${missing.map((m) => `<li>${m}</li>`).join('') || '<li>无</li>'}</ul><p><b>缺失前置：</b>${missingDeps.join(' / ') || '无'}</p></div>
<div class='card'><h2>学习历史时间线</h2><ul>${history.map((h: any) => `<li>${new Date(h.ts).toLocaleString()} - ${h.action} ${h.detail || ''}</li>`).join('') || '<li>暂无</li>'}</ul></div>
</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chapterId}-learning-report.html`;
    a.click();
    URL.revokeObjectURL(url);
  };


  const adaptiveHint = (chapterId: string) => {
    const r = chapterResults[chapterId] as any;
    const m = chapterMastery[chapterId] || '初学';
    const mins = studyMinutes[chapterId] || 0;
    if (!r) return '建议先完成首次测评，建立基线分数。';
    const rate = r.score / Math.max(1, r.total);
    if (rate < 0.6) return '当前建议降难：先复习重点卡片+错题回放，再二测。';
    if (rate < 0.8) return '当前建议中难度：巩固术语与实战步骤后复测。';
    if (m === '巩固' && mins >= 30) return '当前建议升难：进入深层章节或贡献实操模板。';
    return '当前节奏合适：完成一次实战任务后进入下一章。';
  };

  const generateWeeklyPlan = () => {
    const pending = allChapters.filter((c) => !done[c.id]).slice(0, 7);
    const fallback = allChapters.slice(0, 7);
    const target = pending.length ? pending : fallback;
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    return days.map((d, i) => {
      const c = target[i % target.length];
      return `${d}：学习《${c.title}》30-45分钟 + 章节测评1次 + 错题回放10分钟`;
    });
  };

  const saveChapterFeedback = (chapterId: string, text: string) => {
    setChapterFeedback((m) => ({ ...m, [chapterId]: text }));
    try {
      const key = 'epq_chapter_feedback_v1';
      const old = JSON.parse(localStorage.getItem(key) || '{}');
      old[chapterId] = { text, ts: Date.now() };
      localStorage.setItem(key, JSON.stringify(old));
    } catch {}
  };

  const setAnswer = (chapterId: string, qid: string, v: number) => {
    setAnswers((s) => ({ ...s, [chapterId]: { ...(s[chapterId] || {}), [qid]: v } }));
  };

  const submitAssessment = (chapterId: string, onlyWrong = false) => {
    const assessment = cmsAssessments.find((a: any) => a.chapterId === chapterId);
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

    const prevScore = (chapterResults[chapterId] as any)?.score || 0;
    setChapterResult(chapterId, { score, total, passed, threshold, wrongIds } as any);
    metricRetryImprovement(score - prevScore);
    addStudyEvent(chapterId, onlyWrong ? 'retest_submit' : 'assessment_submit', `score=${score}/${total}`);

    // Checklist 联动：提交测评后自动勾选“完成章节测评”项（索引1）
    markCurriculumChecklist(chapterId, 1, true);
    markCurriculumChecklist(chapterId, 0, true);

    if (passed) {
      // 通过后自动提示可勾选“完成实战任务”（索引2由用户确认）
      const domain = chapterDomain(chapterId);
      const target = knowledgeMap.find((n) => n.domain === domain && n.status !== 'done');
      if (target) setKnowledgeStatus(target.id, 'done');
      setRetryMode((s) => ({ ...s, [chapterId]: false }));
    }
  };


  const dependencyAlerts = useMemo(() => {
    return allChapters
      .filter((c) => !done[c.id])
      .map((c) => {
        const deps = chapterDependencies[c.id] || [];
        const missing = deps.filter((d) => !done[d]);
        return { id: c.id, title: c.title, missing };
      })
      .filter((x) => x.missing.length > 0)
      .slice(0, 3);
  }, [allChapters, done]);

  const weeklyPlan = useMemo(() => generateWeeklyPlan(), [allChapters, done]);

  useEffect(() => {
    const passed = Object.values(chapterResults).filter((r) => r.passed).length;
    if (passed >= 1) awardBadge('First Pass');
    if (passed >= 5) awardBadge('Protocol Explorer');
    if (wrongBook.length >= 10) awardBadge('Wrongbook Warrior');
  }, [chapterResults, wrongBook.length, awardBadge]);

  function chapterQuality(chapterId: string) {
    const r = chapterResults[chapterId] as any;
    if (!r) return { score: 0, stability: 0, recencyWrong: 0 };
    const hist = (r.history || []).slice(-3) as number[];
    const avg = hist.length ? hist.reduce((a, b) => a + b, 0) / hist.length : r.score / Math.max(1, r.total);
    const vol = hist.length >= 2 ? Math.abs(hist[hist.length - 1] - hist[0]) : 0;
    const recencyWrong = (r.wrongIds || []).length;
    const stability = Math.max(0, Math.round((1 - vol) * 100) - recencyWrong * 5);
    return { score: Math.round(avg * 100), stability, recencyWrong };
  }

  useEffect(() => {
    const foundationDone = ['el-core', 'cl-core', 'evm-core', 'tx-lifecycle-core'].every((id) => done[id]);
    const builderDone = ['engine-api-core', 'eip-workflow-core', 'client-testing-core'].every((id) => done[id]);
    if (foundationDone && !badges.includes('Path Milestone: Foundation')) {
      awardBadge('Path Milestone: Foundation');
      setMilestoneToast('🎉 里程碑达成：基础路径完成');
      setTimeout(() => setMilestoneToast(null), 2400);
    }
    if (builderDone && !badges.includes('Path Milestone: Builder')) {
      awardBadge('Path Milestone: Builder');
      setMilestoneToast('🚀 里程碑达成：开发者路径完成');
      setTimeout(() => setMilestoneToast(null), 2400);
    }
  }, [done, badges, awardBadge]);

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

  const domainBoard = useMemo(() => {
    const board: Record<string, { total: number; done: number }> = {};
    allChapters.forEach((c) => {
      const d = chapterDomain(c.id);
      if (!board[d]) board[d] = { total: 0, done: 0 };
      board[d].total += 1;
      if (done[c.id]) board[d].done += 1;
    });
    return board;
  }, [allChapters, done]);

  const avgScore = useMemo(() => {
    const vals = Object.values(chapterResults).map((r) => Math.round((r.score / Math.max(1, r.total)) * 100));
    if (!vals.length) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }, [chapterResults]);

  const pathBoard = useMemo(() => {
    const basicDone = ['el-core', 'cl-core', 'evm-core', 'tx-lifecycle-core'].filter((id) => done[id]).length;
    const builderDone = ['engine-api-core', 'eip-workflow-core', 'client-testing-core'].filter((id) => done[id]).length;
    const coreDone = ['testing-systems-core', 'security-core', 'l2-da-core', 'el-deep-state-trie', 'cl-deep-forkchoice-finality'].filter((id) => done[id]).length;
    return { basicDone, builderDone, coreDone };
  }, [done]);

  return (
    <main className="container">
      <Link to="/">← 首页</Link>
      <h2>{lang==='zh'?'系统化学习课程（基础→进阶）':'Curriculum (Foundation → Advanced)'}</h2>
      <p className="subtle">Garden &gt; Trails &gt; Chapters · 你可以从不同路径进入同一知识点。</p>
      <p>{lang==='zh'?'学习优先：先完整掌握章节，再用闯关做检验。':'Learning first: master chapters, then validate with assessments.'}</p>
      {milestoneToast && <div className="toast milestone-burst">{milestoneToast}</div>}

      <section className="card">
        <h3>课程质量体系看板</h3>
        <div className="grid">
          {chapterQualityBoard.slice(0, 10).map((r) => (
            <article key={r.id} className="level" style={{ cursor: 'default' }}>
              <strong>{r.title}</strong>
              <small>难度曲线：{r.level} · 先修命中率：{r.prereqHit}% · 误区数：{r.pitfallCount}</small>
              <small>质量：{r.quality} · 稳定度：{r.stability}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>可观测性与运营指标</h3>
        <div className="chips">
          <span className="chip">章节完成事件：{Object.values(telemetry.chapterCompletion || {}).reduce((a:any,b:any)=>a+b,0)}</span>
          <span className="chip">错题复测提升样本：{(telemetry.retryImprovement || []).length}</span>
          <span className="chip">推荐动作点击：{telemetry.recClicks || 0}</span>
          <span className="chip">搜索失败词：{Object.keys(telemetry.searchMiss || {}).length}</span>
        </div>
      </section>

      <section className="card">
        <h3>章节知识点检索</h3>
        <div className="filter-row">
          <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value as any)}>
            <option value="all">全部难度</option><option value="beginner">beginner</option><option value="intermediate">intermediate</option><option value="advanced">advanced</option>
          </select>
          <select value={domainFilter} onChange={(e) => setDomainFilter(e.target.value as any)}>
            <option value="all">全部领域</option><option value="EL">EL</option><option value="CL">CL</option><option value="EVM">EVM</option><option value="EIP">EIP</option><option value="Client">Client</option><option value="Testing">Testing</option><option value="Security">Security</option><option value="L2">L2</option>
          </select>
          <select value={sortMode} onChange={(e) => setSortMode(e.target.value as any)}>
            <option value="default">默认排序</option><option value="difficulty">按难度</option><option value="progress">按完成状态</option>
          </select>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="输入关键词：如 Engine API / Finality / Gas / Rollup"
          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #cde3d2' }}
        />
        <small>当前命中章节：{chapters.length}（支持别名检索：pbs/blob/aa/verkle/mev/eof/lst/lrt）</small>
      </section>

      <section className="card">
        <h3>学习概览快照</h3>
        <div className="chips">
          <span className="chip">完成章节：{completedCount}/{allChapters.length}</span>
          <span className="chip">平均测评分：{avgScore}%</span>
          <span className="chip">错题数：{wrongBook.length}</span>
          <span className="chip">已获徽章：{badges.length}</span>
        </div>
      </section>

      <section className="card">
        <h3>学习路径推荐</h3>
        <div className="notice" style={{ marginBottom: 8 }}>Related Paths：如果你在执行层卡住，可以切到共识或客户端工程路径再回跳。</div>
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
        <h3>按领域分组折叠</h3>
        {Object.entries(domainBoard).map(([d, stat]) => (
          <div key={d} style={{ marginBottom: 8 }}>
            <div className="accordion-header">
              <strong>{d}：{stat.done}/{stat.total}</strong>
              <button className="btn btn-ghost" onClick={() => setCollapsedDomains((s) => ({ ...s, [d]: !s[d] }))}>{collapsedDomains[d] ? '展开' : '收起'}</button>
            </div>
            {!collapsedDomains[d] && <small>建议：{stat.done < stat.total ? '优先补齐该领域基础章节' : '可进入该领域深度专题'}</small>}
          </div>
        ))}
      </section>

      <section className="card">
        <h3>路径目标达成看板</h3>
        <ul>
          <li>基础路径：{pathBoard.basicDone}/4 章节完成</li>
          <li>开发者路径：{pathBoard.builderDone}/3 章节完成</li>
          <li>核心贡献者路径：{pathBoard.coreDone}/5 章节完成</li>
        </ul>
        <p>动态提示：{pathBoard.basicDone < 4 ? '先补齐基础四章，再进入开发者路径。' : pathBoard.builderDone < 3 ? '你已完成基础路径，建议推进 Engine/EIP/客户端测试。' : pathBoard.coreDone < 5 ? '进入核心贡献者路径，优先完成测试/安全/L2DA与深层章节。' : '三条路径均达成，建议开始持续开源贡献。'}</p>
      </section>


      <section className="card">
        <h3>章节学习目标完成率统计</h3>
        <ul>
          {allChapters.map((c) => {
            const checklist = chapterChecklists.find((x) => x.chapterId === c.id)?.items || ['阅读本章','完成测评','完成1个练习'];
            const st = checklistState[c.id] || {};
            const doneCount = checklist.filter((_, i) => !!st[i]).length;
            const pct = Math.round((doneCount / checklist.length) * 100);
            return <li key={c.id}>{c.title}：{doneCount}/{checklist.length}（{pct}%）</li>;
          })}
        </ul>
      </section>

      <section className="card">
        <h3>学习提醒节奏建议（轻/中/重）</h3>
        <ul>
          <li><strong>轻量：</strong>每日 20 分钟（1个知识点 + 1题复习）</li>
          <li><strong>中量：</strong>每日 45 分钟（1节内容 + 1次测评 + 错题回放）</li>
          <li><strong>重量：</strong>每日 90 分钟（内容学习 + 实战练习 + 复盘输出）</li>
        </ul>
      </section>

      <section className="card">
        <h3>学习推荐引擎</h3>
        <p>{recommendation}</p>
        {dependencyAlerts.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <strong>前置依赖缺失告警</strong>
            <ul>
              {dependencyAlerts.map((a) => (
                <li key={a.id}>{a.title} 缺少前置：{a.missing.map((m) => allChapters.find((c) => c.id === m)?.title || m).join(' / ')}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="card">
        <h3>学习目标自动生成（周计划）</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
          <button className="btn" onClick={() => {
            const blob = new Blob([weeklyPlan.join('\n')], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'weekly-plan.txt';
            a.click();
            URL.revokeObjectURL(url);
          }}>导出周计划</button>
        </div>
        <ol>
          {weeklyPlan.map((line) => <li key={line}>{line}</li>)}
        </ol>
      </section>


      <section className="card">
        <h3>专题进阶内容（新增）</h3>
        <div className="grid">
          <div className="level">
            <strong>跨客户端调试 Playbook</strong>
            <small>定位一致性差异</small>
            <ul>
              <li>统一测试向量与输入快照</li>
              <li>并行执行并收集差异日志</li>
              <li>把差异沉淀为回归测试集</li>
            </ul>
          </div>
          <div className="level">
            <strong>从规范到实现</strong>
            <small>EIP 与客户端代码对齐</small>
            <ul>
              <li>先抽取 MUST/SHOULD 行为约束</li>
              <li>再建立测试断言映射</li>
              <li>最后补“失败样例”防回归</li>
            </ul>
          </div>
          <div className="level">
            <strong>贡献者首个 14 天计划</strong>
            <small>从阅读到首个 PR</small>
            <ul>
              <li>D1-D3: 环境与复现链路</li>
              <li>D4-D9: 小范围修复 + 测试</li>
              <li>D10-D14: PR 迭代与复盘</li>
            </ul>
          </div>
        </div>
      </section>


      <section className="card">
        <h3>Badge 中心</h3>
        <ul>
          <li><strong>Starter Badge</strong>：完成首日四项任务</li>
          <li><strong>First Pass</strong>：通过任意 1 个章节测评</li>
          <li><strong>Protocol Explorer</strong>：累计通过 5 个章节测评</li>
          <li><strong>Wrongbook Warrior</strong>：累计错题记录达到 10 条</li>
        </ul>
        <p>已获得：{badges.length ? badges.join(' · ') : '暂无'}</p>
      </section>

      <section className="card">
        <h3>课程使用建议（FAQ）</h3>
        <ul>
          <li><strong>Q:</strong> 先看章节还是先刷题？<br/><strong>A:</strong> 先读章节重点卡片，再做测评，最后错题回放。</li>
          <li><strong>Q:</strong> 什么时候适合进入深度章节？<br/><strong>A:</strong> 基础路径完成且均分 ≥ 75% 时再进入。</li>
          <li><strong>Q:</strong> 如何准备首个客户端贡献？<br/><strong>A:</strong> 先做测试夹具与回归模板，再选小 issue 实战。</li>
        </ul>
      </section>

      <section className="card">
        <h3>内容内链接跳转</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn" onClick={() => setOnlyPending((v) => !v)}>
            {onlyPending ? '显示全部章节' : '仅看未完成章节'}
          </button>
          <Link to="/progress" className="btn">去错题本复习</Link>
          <Link to="/glossary" className="btn">去术语页复习</Link>
          <a className="btn" href="#el-core" onClick={() => setLastVisitedSection('el-core-sec-0')}>跳 EL 核心</a>
          <a className="btn" href="#cl-core" onClick={() => setLastVisitedSection('cl-core-sec-0')}>跳 CL 核心</a>
          <a className="btn" href="#engine-api-core" onClick={() => setLastVisitedSection('engine-api-core-sec-0')}>跳 Engine API</a>
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

      <section className="card">
        <h3>客户端与测试实践模板库</h3>
        {practiceTemplates.map((t) => (
          <div key={t.id} style={{ marginBottom: 10 }}>
            <strong>[{t.category}] {t.title}</strong>
            <div><em>适用场景：</em>{t.whenToUse}</div>
            <ol>{t.template.map((line) => <li key={line}>{line}</li>)}</ol>
          </div>
        ))}
      </section>

      {chapters.slice(0, visibleCount).map((chapter, idx) => {
        const assessment = cmsAssessments.find((a: any) => a.chapterId === chapter.id);
        return (
          <section key={chapter.id} id={chapter.id} className="card">
            <div className="accordion-header">
              <h3 style={{ margin: 0 }}>{idx + 1}. {chapter.title}</h3>
              <button className="btn btn-ghost" onClick={() => { setLastVisitedChapter(chapter.id); toggleExpand(chapter.id); }}>{expandedChapters[chapter.id] ? '收起详情' : '展开详情'}</button>
            </div>
            <div className="chapter-meta-row">
              <span className="meta-pill">章节状态：{done[chapter.id] ? '已完成' : '进行中'}</span>
              <span className="meta-pill">测评：{chapterResults[chapter.id] ? (chapterResults[chapter.id].passed ? '通过' : '待提高') : '未提交'}</span>
              <span className="meta-pill">领域：{chapterDomain(chapter.id)}</span>
            </div>
            <div className="gradient-divider" />
            <p><strong>学习目标：</strong>{chapter.objective}</p>
            <p><strong>难度：</strong>{chapter.level}</p>
            <p><strong>掌握度：</strong>{chapterMastery[chapter.id] || '初学'} · <strong>学习时长：</strong>{studyMinutes[chapter.id] || 0} 分钟</p>
            <p><strong>质量评分：</strong>{chapterQuality(chapter.id).score} · <strong>稳定度：</strong>{chapterQuality(chapter.id).stability}</p>
            <p><strong>难度自适应提示：</strong>{adaptiveHint(chapter.id)}</p>
            <button className="btn" onClick={() => addStudyMinutes(chapter.id, 15)}>+15 分钟学习记录</button>

            <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <input type="checkbox" checked={!!done[chapter.id]} onChange={() => toggleDone(chapter.id)} />
              标记本章已完成
            </label>

            {expandedChapters[chapter.id] && (
              <>
            <div className="taskflow" style={{ marginTop: 8 }}>
              <strong>任务流（学什么→做什么→怎么测→完成奖励）</strong>
              <div className="chips" style={{ marginTop: 6 }}>
                <span className="chip">1) 学什么：掌握 {chapter.objective}</span>
                <span className="chip">2) 做什么：完成 1 个实战任务</span>
                <span className="chip">3) 怎么测：提交章节测评</span>
                <span className="chip">4) 完成奖励：解锁章节完成徽记</span>
              </div>
            </div>

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

            {chapter.sections.map((sec, si) => (
              <div key={sec.heading} id={`${chapter.id}-sec-${si}`} style={{ marginTop: 10 }}>
                <strong>{sec.heading}</strong>
                <button className="btn btn-ghost" style={{ marginLeft: 8, padding: '4px 8px' }} onClick={() => setLastVisitedSection(`${chapter.id}-sec-${si}`)}>记录到此小节</button>
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
              <strong>本章推荐实践模板</strong>
              <ul>
                {(chapterTemplateMapping[chapter.id] || []).map((tid) => {
                  const t = practiceTemplates.find((x) => x.id === tid);
                  return <li key={tid}>{t ? `${t.title}（${t.whenToUse}）` : tid}</li>;
                })}
                {(chapterTemplateMapping[chapter.id] || []).length === 0 && <li>暂无模板映射</li>}
              </ul>
            </div>

            <div style={{ marginTop: 10 }}>
              <strong>学习完成清单（Checklist）</strong>
              <small style={{ display: 'block', margin: '4px 0 8px' }}>提示：提交测评后会自动勾选“完成章节测评”。若仍有缺项，请按缺项完成对应动作。</small>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><button className="btn" onClick={() => exportChapterReport(chapter.id, 'json')}>导出报告 JSON</button><button className="btn" onClick={() => exportChapterReport(chapter.id, 'html')}>导出报告 HTML</button></div>
              <ul>
                {(chapterChecklists.find((x) => x.chapterId === chapter.id)?.items || ['阅读本章','完成测评','完成1个练习']).map((item, i) => (
                  <li key={item}>
                    <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        checked={!!(checklistState[chapter.id] || {})[i]}
                        onChange={() => toggleChecklist(chapter.id, i)}
                      />
                      {item}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: 10 }}>
              <strong>学习历史时间线（复习轨迹）</strong>
              <ul>
                {(studyHistory[chapter.id] || []).slice(-6).map((h, idx) => (
                  <li key={`${h.ts}-${idx}`}>{new Date(h.ts).toLocaleString()} - {h.action} {h.detail || ''}</li>
                ))}
                {(studyHistory[chapter.id] || []).length === 0 && <li>暂无学习记录（可点击 +15 分钟 或提交测评后生成）</li>}
              </ul>
            </div>

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

            <div style={{ marginTop: 10 }}>
              <strong>反馈闭环</strong>
              <label htmlFor={`fb-${chapter.id}`} className="subtle" style={{ display: 'block' }}>这一章最卡你的点是什么？</label>
              <textarea id={`fb-${chapter.id}`} value={chapterFeedback[chapter.id] || ''} onChange={(e) => saveChapterFeedback(chapter.id, e.target.value)} placeholder="例如：finality 与 fork-choice 的关系" style={{ width: '100%', minHeight: 68, borderRadius: 10, border: '1px solid var(--border-default)', padding: 8 }} />
            </div>
              </>
            )}
          </section>
        );
      })}

      {visibleCount < chapters.length && (
        <section className="card" style={{ textAlign: 'center' }}>
          <p>已显示 {visibleCount}/{chapters.length} 章节（轻量渲染模式）</p>
          <button className="btn" onClick={() => setVisibleCount((v) => Math.min(v + 8, chapters.length))}>加载更多章节</button>
        </section>
      )}
    </main>
  );
}
