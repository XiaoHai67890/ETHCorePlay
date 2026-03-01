import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Download, BookOpen, CheckCircle, Lightbulb, PartyPopper } from 'lucide-react';
import { useProgressStore } from '../../game/store';
import { chapterAssessments } from '../../data/chapterAssessments';
import { chapterChecklists } from '../../data/checklists';
import { chapterDependencies } from '../../data/dependencies';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface ChapterItemProps {
  chapter: any;
  index: number;
  isExpanded: boolean;
  isDone: boolean;
  onToggleExpand: () => void;
  onToggleDone: () => void;
  allChapters: any[];
  doneMap: Record<string, boolean>;
}

export function ChapterItem({ 
  chapter, 
  index, 
  isExpanded, 
  isDone, 
  onToggleExpand, 
  onToggleDone,
  allChapters,
  doneMap
}: ChapterItemProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [retryMode, setRetryMode] = useState(false);
  const [checklistState, setChecklistState] = useState<Record<number, boolean>>({});

  const {
    chapterResults,
    chapterMastery,
    studyMinutes,
    setChapterResult,
    addStudyMinutes,
    addStudyEvent,
    studyHistory,
    knowledgeMap,
    setKnowledgeStatus
  } = useProgressStore();

  const result = chapterResults[chapter.id] as any;
  const assessment = chapterAssessments.find((a) => a.chapterId === chapter.id);

  const toggleChecklist = (idx: number) => {
    setChecklistState((s) => ({ ...s, [idx]: !s[idx] }));
  };

  const setAnswer = (qid: string, v: number) => {
    setAnswers((s) => ({ ...s, [qid]: v }));
  };

  const chapterDomain = (chapterId: string) => {
    if (chapterId.startsWith('el-') || chapterId.includes('tx-')) return 'EL';
    if (chapterId.startsWith('cl-')) return 'CL';
    if (chapterId.startsWith('evm-')) return 'EVM';
    if (chapterId.includes('eip')) return 'EIP';
    if (chapterId.includes('engine') || chapterId.includes('client')) return 'Client';
    if (chapterId.includes('testing')) return 'Testing';
    if (chapterId.includes('security')) return 'Security';
    if (chapterId.includes('l2') || chapterId.includes('da')) return 'L2';
    return 'Client';
  };

  const submitAssessment = (onlyWrong = false) => {
    if (!assessment) return;
    const prev = chapterResults[chapter.id] as any;
    
    const previousWrongIds = prev?.wrongIds || [];
    const baseQs = assessment.questions;
    const scopedQs = onlyWrong && previousWrongIds.length
      ? baseQs.filter((q) => previousWrongIds.includes(q.id))
      : baseQs;

    const score = scopedQs.reduce((acc, q) => acc + (answers[q.id] === q.answerIndex ? 1 : 0), 0);
    const total = scopedQs.length || 1;
    const wrongIds = scopedQs.filter((q) => answers[q.id] !== q.answerIndex).map((q) => q.id);
    const threshold = assessment.passThreshold;
    const passed = score / total >= threshold;

    setChapterResult(chapter.id, { score, total, passed, threshold, wrongIds } as any);
    addStudyEvent(chapter.id, onlyWrong ? 'retest_submit' : 'assessment_submit', `score=${score}/${total}`);

    setChecklistState((s) => ({ ...s, 1: true, 0: true }));

    if (passed) {
      const domain = chapterDomain(chapter.id);
      const target = knowledgeMap.find((n) => n.domain === domain && n.status !== 'done');
      if (target) setKnowledgeStatus(target.id, 'done');
      setRetryMode(false);
    }
  };

  const adaptiveHint = () => {
    const r = chapterResults[chapter.id] as any;
    const m = chapterMastery[chapter.id] || '初学';
    const mins = studyMinutes[chapter.id] || 0;
    if (!r) return '建议先完成首次测评，建立基线分数。';
    const rate = r.score / Math.max(1, r.total);
    if (rate < 0.6) return '当前建议降难：先复习重点卡片+错题回放，再二测。';
    if (rate < 0.8) return '当前建议中难度：巩固术语与实战步骤后复测。';
    if (m === '巩固' && mins >= 30) return '当前建议升难：进入深层章节或贡献实操模板。';
    return '当前节奏合适：完成一次实战任务后进入下一章。';
  };

  const exportChapterReport = (format: 'json' | 'html' = 'json') => {
    const prevRate = result?.history && result.history.length >= 2 ? result.history[result.history.length - 2] : null;
    const currRate = result ? result.score / Math.max(1, result.total) : null;
    const checklist = chapterChecklists.find((x) => x.chapterId === chapter.id)?.items || [];
    const missing = checklist.filter((_, i) => !checklistState[i]);
    const deps = chapterDependencies[chapter.id] || [];
    const missingDeps = deps.filter((d) => !doneMap[d]).map((d) => allChapters.find((c) => c.id === d)?.title || d);
    const history = studyHistory[chapter.id] || [];

    const report = {
      chapter: chapter.title,
      objective: chapter.objective,
      status: isDone ? '已完成' : '进行中',
      mastery: chapterMastery[chapter.id] || '初学',
      studyMinutes: studyMinutes[chapter.id] || 0,
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
      a.download = `${chapter.id}-learning-report.json`;
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
    a.download = `${chapter.id}-learning-report.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card id={chapter.id} style={{ padding: '24px' }}>
      <div 
        className="accordion-header" 
        onClick={onToggleExpand}
      >
        <div>
          <h3 style={{ marginBottom: '8px' }}>{index + 1}. {chapter.title}</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Badge variant={isDone ? 'success' : 'neutral'}>
              {isDone ? '已完成' : '进行中'}
            </Badge>
            {result && (
              <Badge variant={result.passed ? 'success' : 'warning'}>
                测评: {result.score}/{result.total}
              </Badge>
            )}
          </div>
        </div>
        <div style={{ color: 'var(--primary)' }}>
          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="accordion-content">
              <p><strong>学习目标：</strong>{chapter.objective}</p>
              <p><strong>难度：</strong>{chapter.level} · <strong>掌握度：</strong>{chapterMastery[chapter.id] || '初学'} · <strong>学习时长：</strong>{studyMinutes[chapter.id] || 0} 分钟</p>
              
              <div style={{ background: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '8px', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <Lightbulb size={18} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ margin: 0, fontSize: '0.9rem' }}><strong>自适应建议：</strong>{adaptiveHint()}</p>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <Button variant="ghost" onClick={() => addStudyMinutes(chapter.id, 15)}>+15 分钟记录</Button>
                <label style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', background: 'rgba(255,255,255,0.6)', padding: '8px 16px', borderRadius: '99px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={isDone} onChange={onToggleDone} />
                  标记本章已完成
                </label>
              </div>

              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <strong>重点总结卡片</strong>
                  <ul style={{ marginTop: '8px' }}>
                    {chapter.sections.slice(0, 3).map((sec: any) => (
                      <li key={sec.heading}>{sec.heading}：{sec.points[0]}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>常见误区</strong>
                  <ul style={{ marginTop: '8px' }}>
                    {chapter.pitfalls.map((p: string) => <li key={p}>{p}</li>)}
                  </ul>
                </div>
              </div>

              {chapter.sections.map((sec: any) => (
                <div key={sec.heading} style={{ marginTop: '16px' }}>
                  <strong>{sec.heading}</strong>
                  <ul style={{ marginTop: '8px' }}>
                    {sec.points.map((p: string) => <li key={p}>{p}</li>)}
                  </ul>
                </div>
              ))}

              {assessment && (
                <div style={{ marginTop: '24px', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--primary-light)', borderRadius: '16px', padding: '24px' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <BookOpen size={20} /> 章节测评
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>通过门槛：{Math.round(assessment.passThreshold * 100)}%</p>
                  
                  {assessment.questions.map((q) => (
                    <div key={q.id} className="quiz-item">
                      <div style={{ fontWeight: 500, marginBottom: '12px' }}>{q.prompt}</div>
                      {q.options.map((opt, oi) => (
                        <label key={opt} className="option">
                          <input
                            type="radio"
                            name={q.id}
                            checked={answers[q.id] === oi}
                            onChange={() => setAnswer(q.id, oi)}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  ))}
                  
                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                    <Button onClick={() => submitAssessment(false)}>
                      <CheckCircle size={18} /> 提交测评
                    </Button>
                    <Button variant="ghost" onClick={() => { setRetryMode(true); submitAssessment(true); }}>
                      错题回放 + 二次测评
                    </Button>
                  </div>
                  
                  {result && (
                    <div style={{ marginTop: '16px', padding: '12px', background: result.passed ? '#daf4df' : '#fef3c7', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {result.passed ? <PartyPopper size={18} color="#2f6b47" /> : <Lightbulb size={18} color="#d97706" />}
                      <span>本章结果：{result.score}/{result.total}，{result.passed ? '已通过' : '未通过'}
                      {((result as any).wrongIds || []).length > 0 ? `，错题数：${(result as any).wrongIds.length}` : ''}</span>
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginTop: '24px' }}>
                <strong>学习完成清单（Checklist）</strong>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', marginBottom: '16px' }}>
                  <Button variant="ghost" onClick={() => exportChapterReport('json')}><Download size={16}/> JSON</Button>
                  <Button variant="ghost" onClick={() => exportChapterReport('html')}><Download size={16}/> HTML</Button>
                </div>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {(chapterChecklists.find((x) => x.chapterId === chapter.id)?.items || ['阅读本章','完成测评','完成1个练习']).map((item, i) => (
                    <li key={item} style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'inline-flex', gap: '12px', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={!!checklistState[i]}
                          onChange={() => toggleChecklist(i)}
                        />
                        {item}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
