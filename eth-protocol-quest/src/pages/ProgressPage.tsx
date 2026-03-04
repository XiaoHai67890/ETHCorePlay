import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgressStore } from '../game/store';
import { cloudEnabled, signInWithOtp } from '../services/cloudSync';
import { getSyncDiagnostics, syncPullMerge, syncPushRobust } from '../services/syncEngine';
import { exportElementPng } from '../components/ui/ShareReportCard';

export function ProgressPage() {
  const storeState = useProgressStore();
  const { xp, completed, wrongBook, clearWrongBook, knowledgeMap, setKnowledgeStatus } = storeState;
  const [email, setEmail] = useState('');
  const [syncMsg, setSyncMsg] = useState('');

  const doneCount = useMemo(() => Object.values(completed).filter(Boolean).length, [completed]);
  const totalNodes = knowledgeMap.length || 1;
  const doneNodes = knowledgeMap.filter((n) => n.status === 'done').length;
  const completionPct = Math.round((doneNodes / totalNodes) * 100);
  const wrongClusters = useMemo(() => {
    const pick = (t: string) => /gas|fee/i.test(t) ? 'Gas' : /final|fork|ghost/i.test(t) ? 'Finality' : /security|reorg|mev|censor/i.test(t) ? 'Security' : 'General';
    return wrongBook.reduce((acc: Record<string, number>, w) => { const k = pick(`${w.prompt} ${w.explanation}`); acc[k] = (acc[k] || 0) + 1; return acc; }, {});
  }, [wrongBook]);

  useEffect(() => {
    if (!cloudEnabled) return;

    // on first load: pull & merge
    syncPullMerge(useProgressStore.getState()).then((merged) => {
      localStorage.setItem('epq-progress-v2', JSON.stringify({ state: merged, version: 2 }));
      setSyncMsg('已完成云端拉取合并（刷新后生效）');
    }).catch(() => {});

    const runPush = () => {
      syncPushRobust(useProgressStore.getState()).then((r: any) => {
        if (!r.ok) setSyncMsg(`云同步待重试：${r.reason || 'unknown'}`);
      });
    };

    const id = setInterval(runPush, 45000);
    const onUnload = () => { runPush(); };
    window.addEventListener('beforeunload', onUnload);
    return () => {
      clearInterval(id);
      window.removeEventListener('beforeunload', onUnload);
    };
  }, [cloudEnabled]);

  const domainGroups = useMemo(() => {
    return knowledgeMap.reduce<Record<string, typeof knowledgeMap>>((acc, n) => {
      if (!acc[n.domain]) acc[n.domain] = [];
      acc[n.domain].push(n);
      return acc;
    }, {});
  }, [knowledgeMap]);

  return (
    <main className="container">
      <Link to="/">← 首页</Link>
      <h2>学习进度总览</h2>

      <section className="card card-hover" id="progress-share-card">
        <div className="kpi-grid">
          <div className="kpi"><small>总 XP</small><br/><b>{xp}</b></div>
          <div className="kpi"><small>已通关</small><br/><b>{doneCount} 关</b></div>
          <div className="kpi"><small>错题数量</small><br/><b>{wrongBook.length}</b></div>
        </div>
        <div style={{ marginTop: 10 }}>
          <small>知识图谱完成度：{doneNodes}/{totalNodes}（{completionPct}%）</small>
          <div className="progress-rail" style={{ marginTop: 6 }}><div className="progress-fill" style={{ width: `${completionPct}%` }} /></div>
        </div>
        <small className="subtle">同步诊断：{JSON.stringify(getSyncDiagnostics())}</small>
        {syncMsg && <div className="notice" style={{ marginTop: 8 }}>{syncMsg}</div>}
      </section>


      <section className="card card-hover">
        <div className="card-title-row"><h3 style={{ margin: 0 }}>云端同步（账号体系）</h3>{!cloudEnabled && <span className="meta-pill">未配置 Supabase</span>}</div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <input placeholder="email for magic link" value={email} onChange={(e)=>setEmail(e.target.value)} style={{ padding:8, borderRadius:10, border:'1px solid var(--border-default)' }} />
          <button className="btn btn-ghost" onClick={() => signInWithOtp(email).then(()=>alert('Magic link sent')).catch((e)=>alert(String(e)))}>登录</button>
          <button className="btn" onClick={() => syncPushRobust(useProgressStore.getState()).then((r:any)=>alert(r.ok?'已推送云端':'已加入重试队列')).catch((e)=>alert(String(e)))}>推送云端</button>
          <button className="btn btn-ghost" onClick={async () => { const merged = await syncPullMerge(useProgressStore.getState()); localStorage.setItem('epq-progress-v2', JSON.stringify({ state: merged, version:2 })); alert('已拉取并合并，请刷新页面'); }}>拉取云端</button>
          <button className="btn btn-ghost" onClick={() => exportElementPng('progress-share-card', 'ethcoreplay-progress.png')}>导出分享卡（PNG）</button>
        </div>
        <small className="subtle">同步诊断：{JSON.stringify(getSyncDiagnostics())}</small>
        {syncMsg && <div className="notice" style={{ marginTop: 8 }}>{syncMsg}</div>}
      </section>

      <section className="card card-hover">
        <h3 style={{ margin: 0 }}>错题聚类（针对性复习包）</h3>
        <div className="chips" style={{ marginTop: 8 }}>
          {Object.entries(wrongClusters).map(([k,v]) => <span className="chip" key={k}>{k}: {v}</span>)}
          {Object.keys(wrongClusters).length===0 && <span className="chip">暂无错题聚类</span>}
        </div>
        <small className="subtle">同步诊断：{JSON.stringify(getSyncDiagnostics())}</small>
        {syncMsg && <div className="notice" style={{ marginTop: 8 }}>{syncMsg}</div>}
      </section>
      <section className="card card-hover">
        <div className="card-title-row">
          <h3 style={{ margin: 0 }}>知识图谱（协议全栈）</h3>
          <span className="meta-pill">可直接修改学习状态</span>
        </div>
        <div className="grid">
          {Object.entries(domainGroups).map(([domain, nodes]) => {
            const done = nodes.filter((n) => n.status === 'done').length;
            return (
              <article key={domain} className="level" style={{ cursor: 'default' }}>
                <strong>{domain}</strong>
                <small>完成度：{done}/{nodes.length}</small>
                <ul>
                  {nodes.map((n) => (
                    <li key={n.id} style={{ marginBottom: 6 }}>
                      <span>{n.title}</span>
                      <select value={n.status} onChange={(e) => setKnowledgeStatus(n.id, e.target.value as any)} style={{ marginLeft: 8 }}>
                        <option value="todo">todo</option>
                        <option value="learning">learning</option>
                        <option value="done">done</option>
                      </select>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
        <small className="subtle">同步诊断：{JSON.stringify(getSyncDiagnostics())}</small>
        {syncMsg && <div className="notice" style={{ marginTop: 8 }}>{syncMsg}</div>}
      </section>

      <section className="card card-hover">
        <div className="card-title-row">
          <h3 style={{ margin: 0 }}>错题本</h3>
          {wrongBook.length > 0 && <button className="btn btn-ghost" onClick={clearWrongBook}>清空错题本</button>}
        </div>
        {wrongBook.length === 0 ? (
          <div className="notice">暂无错题，继续闯关吧。建议去课程页做一次章节复测。</div>
        ) : (
          <ul>
            {wrongBook.map((w) => (
              <li key={`${w.levelId}-${w.questionId}`}>
                <strong>[Lv{w.levelId}]</strong> {w.prompt}<br/>
                <small>{w.explanation}</small>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
