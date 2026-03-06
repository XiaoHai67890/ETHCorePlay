// @ts-nocheck
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgressStore } from '../game/store';
import { cloudEnabled, signInWithOtp } from '../services/cloudSync';
import { getSyncDiagnostics, syncPullMerge, syncPushRobust } from '../services/syncEngine';
import { exportElementPng } from '../components/ui/ShareReportCard';
import { getLang, t } from '../services/i18n';

export function ProgressPage() {
  const storeState = useProgressStore();
  const { xp, completed, wrongBook, clearWrongBook, knowledgeMap, setKnowledgeStatus, badges, studyHistory } = storeState as any;
  const lang = getLang();
  const [email, setEmail] = useState('');
  const [syncMsg, setSyncMsg] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'learning' | 'done'>('all');
  const [highValueOnly, setHighValueOnly] = useState(false);

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
    return () => { clearInterval(id); window.removeEventListener('beforeunload', onUnload); };
  }, []);

  const streakDays = useMemo(() => {
    const daySet = new Set<string>();
    Object.values(studyHistory || {}).forEach((arr: any) => (arr || []).forEach((e: any) => daySet.add(new Date(e.ts).toDateString())));
    const days = Array.from(daySet).sort((a, b) => +new Date(a) - +new Date(b));
    let best = 0, cur = 0, prev: number | null = null;
    for (const d of days) {
      const ts = new Date(d).setHours(0,0,0,0);
      if (prev == null || ts - prev === 86400000) cur += 1; else cur = 1;
      prev = ts;
      best = Math.max(best, cur);
    }
    return best;
  }, [studyHistory]);

  const weeklyDone = Math.min(doneCount, 7);

  const executableCards = useMemo(() => {
    const rows = knowledgeMap.map((n) => {
      const clusterBonus = /gas|final|security|mev/i.test(n.title) ? 2 : 0;
      const score = (n.status === 'todo' ? 3 : n.status === 'learning' ? 2 : 0) + clusterBonus;
      return { ...n, score };
    });
    let out = rows.filter((r) => statusFilter === 'all' ? true : r.status === statusFilter);
    if (highValueOnly) out = out.filter((r) => r.score >= 3);
    return out.sort((a, b) => b.score - a.score || Number(a.status === 'done') - Number(b.status === 'done'));
  }, [knowledgeMap, statusFilter, highValueOnly]);

  return (
    <main className="container">
      <Link to="/">← 首页</Link>
      <h2>{t('progressTitle', lang)}</h2>
      <p className="subtle">{t('progressDesc', lang)}</p>

      <section className="card card-hover" id="progress-share-card">
        <div className="card-title-row"><h3 style={{ margin: 0 }}>核心指标</h3><span className="meta-pill">Progress Snapshot</span></div>
        <div className="kpi-grid">
          <div className="kpi"><small>总 XP</small><br/><b>{xp}</b></div>
          <div className="kpi"><small>已通关</small><br/><b>{doneCount} 关</b></div>
          <div className="kpi"><small>错题数量</small><br/><b>{wrongBook.length}</b></div>
        </div>
        <div style={{ marginTop: 10 }}>
          <small>知识图谱完成度：{doneNodes}/{totalNodes}（{completionPct}%）</small>
          <div className="progress-rail" style={{ marginTop: 6 }}><div className="progress-fill" style={{ width: `${completionPct}%` }} /></div>
        </div>
      </section>


      <section className="card card-hover" id="growth-share-card">
        <div className="card-title-row"><h3 style={{ margin: 0 }}>{t('growthCard', lang)}</h3><span className="meta-pill">Weekly</span></div>
        <div className="kpi-grid">
          <div className="kpi"><small>本周完成章节</small><br/><b>{weeklyDone}</b></div>
          <div className="kpi"><small>徽章数</small><br/><b>{(badges || []).length}</b></div>
          <div className="kpi"><small>连续学习天数</small><br/><b>{streakDays}</b></div>
        </div>
        <div className="quick-links" style={{ marginTop: 8 }}>
          <button className="btn btn-ghost" onClick={() => exportElementPng('growth-share-card', 'ethcoreplay-weekly-growth.png')}>导出周报图</button>
          <button className="btn" onClick={() => {
            const text = encodeURIComponent(`ETHCorePlay 周报：本周完成 ${weeklyDone} 章，徽章 ${(badges || []).length}，连续学习 ${streakDays} 天。`);
            window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
          }}>{t('oneClickShare', lang)} X</button>
          <button className="btn" onClick={() => {
            const text = encodeURIComponent(`ETHCorePlay 周报：本周完成 ${weeklyDone} 章，徽章 ${(badges || []).length}，连续学习 ${streakDays} 天。`);
            window.open(`https://t.me/share/url?url=https://ethcoreplay.cc.cd&text=${text}`, '_blank');
          }}>{t('oneClickShare', lang)} Telegram</button>
          <button className="btn" onClick={() => {
            const text = `ETHCorePlay 周报：本周完成 ${weeklyDone} 章，徽章 ${(badges || []).length}，连续学习 ${streakDays} 天。`;
            navigator.clipboard?.writeText(text);
            alert('已复制微信分享文案');
          }}>{t('oneClickShare', lang)} 微信</button>
        </div>
      </section>

      <section className="card card-hover">
        <h3 style={{ margin: 0 }}>可执行看板（待处理优先）</h3>
        <div className="filter-row">
          <button className={`chip-btn ${statusFilter==='all'?'on':''}`} onClick={() => setStatusFilter('all')}>全部</button>
          <button className={`chip-btn ${statusFilter==='todo'?'on':''}`} onClick={() => setStatusFilter('todo')}>待处理</button>
          <button className={`chip-btn ${statusFilter==='learning'?'on':''}`} onClick={() => setStatusFilter('learning')}>进行中</button>
          <button className={`chip-btn ${statusFilter==='done'?'on':''}`} onClick={() => setStatusFilter('done')}>已完成</button>
          <button className={`chip-btn ${highValueOnly?'on':''}`} onClick={() => setHighValueOnly(v => !v)}>仅高收益未完成</button>
        </div>
        <div className="knowledge-grid">
          {executableCards.slice(0, 18).map((n) => (
            <article key={n.id} className="knowledge-card">
              <div className="card-title-row"><strong>{n.title}</strong><span className="meta-pill">{n.status}</span></div>
              <small className="subtle">领域：{n.domain} · 收益分：{n.score}</small>
              <div className="quick-links" style={{ marginTop: 8 }}>
                <button className="btn btn-ghost" onClick={() => setKnowledgeStatus(n.id, 'learning' as any)}>继续学习</button>
                <Link className="btn btn-ghost" to="/curriculum">去复测</Link>
                <Link className="btn btn-ghost" to="/curriculum">去实战</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card card-hover">
        <div className="card-title-row"><h3 style={{ margin: 0 }}>云端同步（账号体系）</h3>{!cloudEnabled && <span className="meta-pill">未配置 Supabase</span>}</div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <input id="sync-email" aria-label="同步账号邮箱" placeholder="email for magic link" value={email} onChange={(e)=>setEmail(e.target.value)} style={{ padding:8, borderRadius:10, border:'1px solid var(--border-default)' }} />
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
