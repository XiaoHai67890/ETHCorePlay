import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useProgressStore } from '../game/store';

export function ProgressPage() {
  const { xp, completed, wrongBook, clearWrongBook, knowledgeMap, setKnowledgeStatus } = useProgressStore();

  const completedLevels = useMemo(() => Object.values(completed).filter(Boolean).length, [completed]);
  const totalNodes = knowledgeMap.length || 1;
  const doneNodes = knowledgeMap.filter((node) => node.status === 'done').length;
  const completionPct = Math.round((doneNodes / totalNodes) * 100);

  const domainGroups = useMemo(() => {
    return knowledgeMap.reduce<Record<string, typeof knowledgeMap>>((acc, node) => {
      if (!acc[node.domain]) acc[node.domain] = [];
      acc[node.domain].push(node);
      return acc;
    }, {});
  }, [knowledgeMap]);

  const weakDomains = useMemo(() => {
    return Object.entries(domainGroups)
      .map(([domain, nodes]) => {
        const done = nodes.filter((node) => node.status === 'done').length;
        const pct = Math.round((done / nodes.length) * 100);
        return { domain, pct, total: nodes.length, done };
      })
      .sort((a, b) => a.pct - b.pct);
  }, [domainGroups]);

  return (
    <main className="container container-wide">
      <div className="page-head">
        <nav className="breadcrumb" aria-label="breadcrumb">
          <Link to="/">首页</Link> / <span>总览</span>
        </nav>
        <h2>总览</h2>
      </div>

      <section className="tri-layout progress-layout">
        <aside className="card tri-left">
          <h3>KPI</h3>
          <div className="kpi-grid compact">
            <div className="kpi"><small>总 XP</small><br /><b>{xp}</b></div>
            <div className="kpi"><small>关卡</small><br /><b>{completedLevels}</b></div>
            <div className="kpi"><small>节点</small><br /><b>{doneNodes}/{totalNodes}</b></div>
            <div className="kpi"><small>错题</small><br /><b>{wrongBook.length}</b></div>
          </div>
          <div style={{ marginTop: 10 }}>
            <small>完成度 {completionPct}%</small>
            <div className="progress-rail" style={{ marginTop: 6 }}>
              <div className="progress-fill" style={{ width: `${completionPct}%` }} />
            </div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link className="btn btn-ghost" to="/curriculum">课程</Link>
            <Link className="btn btn-ghost" to="/map">地图</Link>
          </div>
        </aside>

        <article className="card tri-main">
          <h3>领域明细</h3>
          <div className="domain-stack">
            {Object.entries(domainGroups).map(([domain, nodes]) => (
              <details key={domain} open>
                <summary>
                  <strong>{domain}</strong> · {nodes.filter((node) => node.status === 'done').length}/{nodes.length}
                </summary>
                <ul>
                  {nodes.map((node) => (
                    <li key={node.id} className="domain-item">
                      <span>{node.title}</span>
                      <select value={node.status} onChange={(e) => setKnowledgeStatus(node.id, e.target.value as any)}>
                        <option value="todo">todo</option>
                        <option value="learning">learning</option>
                        <option value="done">done</option>
                      </select>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </article>

        <aside className="card tri-right">
          <h3>优先领域</h3>
          <ol>
            {weakDomains.slice(0, 5).map((row) => (
              <li key={row.domain}>
                {row.domain}：{row.pct}%（{row.done}/{row.total}）
              </li>
            ))}
          </ol>

          <section style={{ marginTop: 14 }}>
            <div className="card-title-row">
              <h4 style={{ margin: 0 }}>错题</h4>
              {wrongBook.length > 0 ? (
                <button className="btn btn-ghost" onClick={clearWrongBook}>清空</button>
              ) : null}
            </div>
            {wrongBook.length === 0 ? (
              <p className="subtle">暂无错题。</p>
            ) : (
              <ul>
                {wrongBook.slice(0, 6).map((item) => (
                  <li key={`${item.levelId}-${item.questionId}`}>
                    <strong>Lv{item.levelId}</strong> {item.prompt}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </section>
    </main>
  );
}

