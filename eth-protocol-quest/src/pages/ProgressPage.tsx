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
  const {
    xp = 0,
    completed = {},
    wrongBook = [],
    clearWrongBook = () => {},
    knowledgeMap = [],
    setKnowledgeStatus = () => {},
    badges = [],
    studyHistory = {}
  } = (storeState || {}) as any;
  const lang = getLang();
  const [email, setEmail] = useState('');
  const [syncMsg, setSyncMsg] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'learning' | 'done'>('all');
  const [highValueOnly, setHighValueOnly] = useState(false);

  const doneCount = useMemo(() => Object.values(completed).filter(Boolean).length, [completed]);
  const safeKnowledgeMap = Array.isArray(knowledgeMap) ? knowledgeMap : [];
  const totalNodes = safeKnowledgeMap.length || 1;
  const doneNodes = safeKnowledgeMap.filter((n) => n?.status === 'done').length;
  const completionPct = Math.round((doneNodes / totalNodes) * 100);
  const growthStage = completionPct < 25 ? 'Seed' : completionPct < 50 ? 'Sprout' : completionPct < 75 ? 'Branch' : 'Bloom';

  const wrongClusters = useMemo(() => {
    const pick = (text: string) =>
      /gas|fee/i.test(text) ? 'Gas' : /final|fork|ghost/i.test(text) ? 'Finality' : /security|reorg|mev|censor/i.test(text) ? 'Security' : 'General';
    return wrongBook.reduce((acc: Record<string, number>, w) => {
      const key = pick(`${w.prompt} ${w.explanation}`);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [wrongBook]);

  useEffect(() => {
    if (!cloudEnabled) return;
    syncPullMerge(useProgressStore.getState())
      .then((merged) => {
        localStorage.setItem('epq-progress-v2', JSON.stringify({ state: merged, version: 2 }));
        setSyncMsg('已完成云端拉取合并（刷新后生效）');
      })
      .catch(() => {});

    const runPush = () => {
      syncPushRobust(useProgressStore.getState()).then((result: any) => {
        if (!result.ok) setSyncMsg(`云同步待重试：${result.reason || 'unknown'}`);
      });
    };

    const id = setInterval(runPush, 45000);
    const onUnload = () => {
      runPush();
    };

    window.addEventListener('beforeunload', onUnload);
    return () => {
      clearInterval(id);
      window.removeEventListener('beforeunload', onUnload);
    };
  }, []);

  const streakDays = useMemo(() => {
    const daySet = new Set<string>();
    Object.values(studyHistory || {}).forEach((entries: any) => {
      if (!Array.isArray(entries)) return;
      entries.forEach((entry: any) => {
        if (!entry?.ts) return;
        daySet.add(new Date(entry.ts).toDateString());
      });
    });

    const days = Array.from(daySet).sort((a, b) => +new Date(a) - +new Date(b));
    let best = 0;
    let current = 0;
    let prev: number | null = null;

    for (const day of days) {
      const ts = new Date(day).setHours(0, 0, 0, 0);
      current = prev == null || ts - prev === 86400000 ? current + 1 : 1;
      prev = ts;
      best = Math.max(best, current);
    }

    return best;
  }, [studyHistory]);

  const weeklyDone = Math.min(doneCount, 7);
  const avgScore = useMemo(() => {
    const finished = safeKnowledgeMap.filter((node) => node.status === 'done').length;
    return Math.round((finished / totalNodes) * 100);
  }, [safeKnowledgeMap, totalNodes]);

  const diagText = useMemo(() => {
    try {
      return JSON.stringify(getSyncDiagnostics());
    } catch {
      return '{"sync":"unavailable"}';
    }
  }, [syncMsg]);

  const executableCards = useMemo(() => {
    const rows = safeKnowledgeMap.map((node) => {
      const clusterBonus = /gas|final|security|mev/i.test(node.title) ? 2 : 0;
      const score = (node.status === 'todo' ? 3 : node.status === 'learning' ? 2 : 0) + clusterBonus;
      return { ...node, score };
    });

    let output = rows.filter((row) => (statusFilter === 'all' ? true : row.status === statusFilter));
    if (highValueOnly) output = output.filter((row) => row.score >= 3);
    return output.sort((a, b) => b.score - a.score || Number(a.status === 'done') - Number(b.status === 'done'));
  }, [safeKnowledgeMap, statusFilter, highValueOnly]);

  const clusterRows = Object.entries(wrongClusters).sort((a, b) => b[1] - a[1]);
  const leadCluster = clusterRows[0]?.[0] || 'General';

  return (
    <main className="container container-wide">
      <div className="page-head progress-page-head">
        <nav className="breadcrumb" aria-label="breadcrumb">
          <Link to="/">首页</Link> / <span>{t('progressTitle', lang)}</span>
        </nav>
        <h2>{t('progressTitle', lang)}</h2>
        <p className="subtle">{t('progressDesc', lang)}</p>
      </div>

      <section className="progress-hero">
        <article className="card progress-hero-card" id="progress-share-card">
          <div className="card-title-row">
            <div>
              <p className="home-kicker">Progress Snapshot</p>
              <h3 style={{ marginBottom: 6 }}>总览应该先告诉你现在处在哪个阶段</h3>
            </div>
            <span className="meta-pill">{growthStage}</span>
          </div>
          <p className="subtle progress-hero-copy">
            当前完成度 {completionPct}% 。如果你今天只做一件事，优先清理 <strong>{leadCluster}</strong> 相关阻塞，再回到课程主线。
          </p>
          <div className="progress-rail">
            <div className="progress-fill" style={{ width: `${completionPct}%` }} />
          </div>
          <div className="growth-track">
            {['Seed', 'Sprout', 'Branch', 'Bloom'].map((stage) => (
              <span key={stage} className={`growth-chip ${stage === growthStage ? 'on' : ''}`}>
                {stage}
              </span>
            ))}
          </div>
        </article>

        <div className="progress-hero-metrics">
          <article className="card progress-metric-card">
            <small>总 XP</small>
            <b>{xp}</b>
            <span>已完成关卡 {doneCount}</span>
          </article>
          <article className="card progress-metric-card">
            <small>知识图谱</small>
            <b>{doneNodes}/{totalNodes}</b>
            <span>节点完成度</span>
          </article>
          <article className="card progress-metric-card">
            <small>错题池</small>
            <b>{wrongBook.length}</b>
            <span>优先清理高频错误</span>
          </article>
          <article className="card progress-metric-card">
            <small>连续学习</small>
            <b>{streakDays} 天</b>
            <span>本周完成 {weeklyDone} 章</span>
          </article>
        </div>
      </section>

      <section className="progress-shell">
        <div className="progress-main-column">
          <article className="card progress-section-card">
            <div className="card-title-row">
              <h3 style={{ margin: 0 }}>行动看板</h3>
              <span className="meta-pill">Prioritized</span>
            </div>
            <div className="filter-row">
              <button className={`chip-btn ${statusFilter === 'all' ? 'on' : ''}`} onClick={() => setStatusFilter('all')}>
                全部
              </button>
              <button className={`chip-btn ${statusFilter === 'todo' ? 'on' : ''}`} onClick={() => setStatusFilter('todo')}>
                待处理
              </button>
              <button className={`chip-btn ${statusFilter === 'learning' ? 'on' : ''}`} onClick={() => setStatusFilter('learning')}>
                进行中
              </button>
              <button className={`chip-btn ${statusFilter === 'done' ? 'on' : ''}`} onClick={() => setStatusFilter('done')}>
                已完成
              </button>
              <button className={`chip-btn ${highValueOnly ? 'on' : ''}`} onClick={() => setHighValueOnly((value) => !value)}>
                仅看高收益
              </button>
            </div>
            <div className="knowledge-grid">
              {executableCards.slice(0, 12).map((node) => (
                <article key={node.id} className="knowledge-card">
                  <div className="card-title-row">
                    <strong>{node.title}</strong>
                    <span className="meta-pill">{node.status}</span>
                  </div>
                  <p className="subtle progress-card-copy">
                    领域：{node.domain} · 收益分：{node.score}
                  </p>
                  <div className="quick-links">
                    <button className="btn btn-ghost" onClick={() => setKnowledgeStatus(node.id, 'learning' as any)}>
                      继续学习
                    </button>
                    <Link className="btn btn-ghost" to="/curriculum">
                      去课程
                    </Link>
                    <Link className="btn btn-ghost" to="/map">
                      去地图
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="card progress-section-card" id="growth-share-card">
            <div className="card-title-row">
              <h3 style={{ margin: 0 }}>{t('growthCard', lang)}</h3>
              <span className="meta-pill">Weekly</span>
            </div>
            <div className="kpi-grid">
              <div className="kpi">
                <small>本周完成章节</small>
                <br />
                <b>{weeklyDone}</b>
              </div>
              <div className="kpi">
                <small>徽章数</small>
                <br />
                <b>{badges.length}</b>
              </div>
              <div className="kpi">
                <small>完成率</small>
                <br />
                <b>{avgScore}%</b>
              </div>
              <div className="kpi">
                <small>连续学习</small>
                <br />
                <b>{streakDays} 天</b>
              </div>
            </div>
            <div className="quick-links progress-share-actions">
              <button className="btn btn-ghost" onClick={() => exportElementPng('growth-share-card', 'ethcoreplay-weekly-growth.png')}>
                导出周报图
              </button>
              <button
                className="btn"
                onClick={() => {
                  const text = encodeURIComponent(`ETHCorePlay 周报：本周完成 ${weeklyDone} 章，徽章 ${badges.length}，连续学习 ${streakDays} 天。`);
                  window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
                }}
              >
                {t('oneClickShare', lang)} X
              </button>
              <button
                className="btn"
                onClick={() => {
                  const text = encodeURIComponent(`ETHCorePlay 周报：本周完成 ${weeklyDone} 章，徽章 ${badges.length}，连续学习 ${streakDays} 天。`);
                  window.open(`https://t.me/share/url?url=https://ethcoreplay.cc.cd&text=${text}`, '_blank');
                }}
              >
                {t('oneClickShare', lang)} Telegram
              </button>
              <button
                className="btn"
                onClick={() => {
                  const text = `ETHCorePlay 周报：本周完成 ${weeklyDone} 章，徽章 ${badges.length}，连续学习 ${streakDays} 天。`;
                  navigator.clipboard?.writeText(text);
                  alert('已复制微信分享文案');
                }}
              >
                {t('oneClickShare', lang)} 微信
              </button>
            </div>
          </article>
        </div>

        <aside className="progress-side-column">
          <article className="card progress-side-card">
            <div className="card-title-row">
              <h3 style={{ margin: 0 }}>错题聚类</h3>
              <span className="meta-pill">Focus</span>
            </div>
            {clusterRows.length === 0 ? (
              <p className="subtle">暂无错题，继续推进主线。</p>
            ) : (
              <ul className="progress-cluster-list">
                {clusterRows.map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}</strong>
                    <span>{value} 条</span>
                  </li>
                ))}
              </ul>
            )}
          </article>

          <article className="card progress-side-card">
            <div className="card-title-row">
              <h3 style={{ margin: 0 }}>错题本</h3>
              {wrongBook.length > 0 ? (
                <button className="btn btn-ghost" onClick={clearWrongBook}>
                  清空
                </button>
              ) : null}
            </div>
            {wrongBook.length === 0 ? (
              <div className="notice">暂无错题，建议去课程页做一次章节复测。</div>
            ) : (
              <ul className="progress-wrong-list">
                {wrongBook.slice(0, 6).map((item) => (
                  <li key={`${item.levelId}-${item.questionId}`}>
                    <strong>[Lv{item.levelId}]</strong> {item.prompt}
                    <small>{item.explanation}</small>
                  </li>
                ))}
              </ul>
            )}
          </article>

          <article className="card progress-side-card">
            <div className="card-title-row">
              <h3 style={{ margin: 0 }}>云端同步</h3>
              {!cloudEnabled ? <span className="meta-pill">未配置</span> : null}
            </div>
            <div className="progress-sync-form">
              <input
                id="sync-email"
                aria-label="同步账号邮箱"
                placeholder="email for magic link"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="quick-links">
                <button className="btn btn-ghost" onClick={() => signInWithOtp(email).then(() => alert('Magic link sent')).catch((e) => alert(String(e)))}>
                  登录
                </button>
                <button className="btn" onClick={() => syncPushRobust(useProgressStore.getState()).then((r: any) => alert(r.ok ? '已推送云端' : '已加入重试队列')).catch((e) => alert(String(e)))}>
                  推送
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={async () => {
                    const merged = await syncPullMerge(useProgressStore.getState());
                    localStorage.setItem('epq-progress-v2', JSON.stringify({ state: merged, version: 2 }));
                    alert('已拉取并合并，请刷新页面');
                  }}
                >
                  拉取
                </button>
              </div>
              <small className="subtle">同步诊断：{diagText}</small>
              {syncMsg ? <div className="notice">{syncMsg}</div> : null}
            </div>
          </article>
        </aside>
      </section>
    </main>
  );
}
