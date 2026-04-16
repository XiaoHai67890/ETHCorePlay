import { Link, useParams } from 'react-router-dom';
import { GardenLinksPanel } from '../components/ui/GardenLinksPanel';
import { useMemo, useState } from 'react';
import { plotContentMap } from '../data/plotContent';

export function PlotPage() {
  const { id } = useParams();
  const data = useMemo(() => (id ? plotContentMap[id] : undefined), [id]);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const quiz = data?.sections.quiz || [
    { q: '该知识点最核心的工程收益是？', opts: ['更可观测', '更花哨', '更复杂'], ans: 0 }
  ];
  const score = quiz.reduce((a, x, i) => a + (answers[i] === x.ans ? 1 : 0), 0);

  return (
    <main className="container">
      <Link to="/curriculum">← 返回课程</Link>
      <section className="card card-hover">
        <div className="card-title-row">
          <h2 style={{ margin: 0 }}>Plot: {data?.title || id}</h2>
          <span className="meta-pill">Spec / EIP / Client</span>
        </div>
        <p className="subtle">{data?.subtitle || '固定模板：Intuition → Definition → Mechanism → Failure Modes → MiniLab → QuickQuiz'}</p>
      </section>

      <section className="grid" style={{ gridTemplateColumns: '220px 1fr 300px', alignItems: 'start' }}>
        <aside className="card card-hover" style={{ position: 'sticky', top: 76 }}>
          <h3>TOC</h3>
          <ul>
            <li><a href="#intuition">Intuition</a></li>
            <li><a href="#definition">Definition</a></li>
            <li><a href="#mechanism">Mechanism</a></li>
            <li><a href="#failure">Failure Modes</a></li>
            <li><a href="#lab">MiniLab</a></li>
            <li><a href="#quiz">QuickQuiz</a></li>
          </ul>
        </aside>

        <article>
          <section id="intuition" className="card"><h3>Intuition Story</h3><p className="subtle">{data?.sections.intuition || '用直觉类比解释该机制为什么存在。'}</p></section>
          <section id="definition" className="card"><h3>Precise Definition</h3><p className="subtle">{data?.sections.definition || '给出规范化定义与边界。'}</p></section>
          <section id="mechanism" className="card"><h3>Mechanism Breakdown</h3><p className="subtle">{data?.sections.mechanism || '列状态机/流程图和关键输入输出。'}</p></section>
          <section id="failure" className="card"><h3>Failure Modes & Security</h3><p className="subtle">{data?.sections.failure || '列常见故障/攻击面与缓解策略。'}</p></section>

          <section id="lab" className="card">
            <h3>MiniLab</h3>
            <ol>
              {(data?.sections.miniLab || ['执行最小可跑步骤', '记录预期输出', '异常分支复盘']).map((x) => <li key={x}>{x}</li>)}
            </ol>
            <button className="btn">Copy Lab Steps</button>
          </section>

          <section id="quiz" className="card">
            <h3>QuickQuiz</h3>
            {quiz.map((it, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <strong>{i + 1}. {it.q}</strong>
                {it.opts.map((o, oi) => (
                  <label key={o} style={{ display: 'block' }}>
                    <input type="radio" name={`q-${i}`} checked={answers[i] === oi} onChange={() => setAnswers((s) => ({ ...s, [i]: oi }))} /> {o}
                  </label>
                ))}
              </div>
            ))}
            <p>得分：{score}/{quiz.length}</p>
          </section>
        </article>

        <aside style={{ position: 'sticky', top: 76, display: 'grid', gap: 10 }}>
          <section className="card card-hover">
            <h3>Prereqs</h3>
            <ul>{(data?.prereqs || ['el-core']).map((x) => <li key={x}>{x}</li>)}</ul>
          </section>
          <GardenLinksPanel />
          <section className="card card-hover">
            <h3>Notes</h3>
            <p className="subtle">记录你自己的实现坑点与例子。</p>
          </section>
        </aside>
      </section>
    </main>
  );
}
