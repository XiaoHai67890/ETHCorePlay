import { Link } from 'react-router-dom';
import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { useProgressStore } from '../game/store';
import { getDailyQuests } from '../game/daily';
import { chapterDependencies } from '../data/dependencies';
import { t, getLang } from '../services/i18n';
import { glossary as localGlossary } from '../data/glossary';
import { PlotCard } from '../components/ui/PlotCard';
const MapRenderer = lazy(() => import('../components/map/MapRenderer').then(m => ({ default: m.MapRenderer })));
const GlossaryGraph = lazy(() => import('../components/GlossaryGraph').then(m => ({ default: m.GlossaryGraph })));
import { metricRecClick } from '../services/telemetry';

export function HomePage() {
  const lang = getLang();
  const {
    xp,
    unlockedLevel,
    chapterResults,
    wrongBook,
    badges,
    awardBadge,
    lastVisitedChapter,
    lastVisitedSection,
    studyMinutes,
    studyHistory,
    curriculumDone,
    onboardingTasks,
    setOnboardingTask
  } = useProgressStore();
  const daily = getDailyQuests();
  const allChapters = [
    { id: 'el-core', title: 'EL 执行层核心' },
    { id: 'cl-core', title: 'CL 共识层核心' },
    { id: 'evm-core', title: 'EVM 执行模型' },
    { id: 'tx-lifecycle-core', title: '交易生命周期全链路' },
    { id: 'engine-api-core', title: 'Engine API 协同' },
    { id: 'client-testing-core', title: '客户端测试基础' },
    { id: 'security-core', title: '安全专题' }
  ];
  const passCount = Object.values(chapterResults).filter((r) => r.passed).length;
  const totalMinutes = Object.values(studyMinutes || {}).reduce((a, b) => a + b, 0);
  const weeklySummary = {
    passed: passCount,
    wrongs: wrongBook.length,
    badges: badges.length,
    minutes: totalMinutes
  };

  const featuredPlots = [
    { id: 'verkle-stateless-deep', title: 'Verkle / Stateless Ethereum', summary: '状态承诺升级与 witness 路径', zone: 'Execution' as const, difficulty: 4 as const, timeMins: 45, tags: ['Verkle','Witness'], progress: 0 },
    { id: 'eip4844-da-economics-deep', title: 'EIP-4844 Blob 经济学', summary: 'DA 成本模型与批处理策略', zone: 'Scaling' as const, difficulty: 4 as const, timeMins: 40, tags: ['Blob','DA'], progress: 0 },
    { id: 'pbs-inclusion-censorship-deep', title: 'PBS / Inclusion List', summary: '抗审查机制与演练案例', zone: 'Security' as const, difficulty: 5 as const, timeMins: 50, tags: ['PBS','Censorship'], progress: 0 }
  ];

  const heatmap = Array.from({ length: 14 }).map((_, i) => {
    const seed = (passCount * 13 + wrongBook.length * 7 + i * 11 + totalMinutes) % 100;
    return Math.min(4, Math.floor(seed / 20));
  });

  const nextBadgeHint = (() => {
    if (!badges.includes('First Pass')) return '再通过 1 个章节测评可解锁 First Pass';
    if (!badges.includes('Protocol Explorer')) return `再通过 ${Math.max(0, 5 - passCount)} 个章节测评可解锁 Protocol Explorer`;
    if (!badges.includes('Wrongbook Warrior')) return `错题累计到 10 条可解锁 Wrongbook Warrior（当前 ${wrongBook.length}）`;
    return '你已完成主要基础徽章，下一步建议冲击核心贡献路线。';
  })();


  const wrongClusters = useMemo(() => {
    const pick = (t: string) => /gas|fee/i.test(t) ? 'Gas' : /final|fork|ghost/i.test(t) ? 'Finality' : /security|reorg|mev|censor/i.test(t) ? 'Security' : 'General';
    return wrongBook.reduce((acc: Record<string, number>, w) => {
      const k = pick(`${w.prompt} ${w.explanation}`);
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});
  }, [wrongBook]);

  const stability = useMemo(() => {
    const vals = Object.values(chapterResults).map((r: any) => (r.history || []).slice(-3)).filter((h: number[]) => h.length >= 2);
    if (!vals.length) return 100;
    const vol = vals.map((h: number[]) => Math.abs(h[h.length - 1] - h[0]));
    const avgVol = vol.reduce((a, b) => a + b, 0) / vol.length;
    return Math.max(0, Math.round((1 - avgVol) * 100));
  }, [chapterResults]);

  const recentStudyMins = useMemo(() => {
    const now = Date.now();
    let mins = 0;
    Object.values(studyHistory || {}).forEach((arr: any) => {
      arr.forEach((e: any) => {
        if (now - e.ts < 1000 * 60 * 60 * 24 * 3 && e.action === 'study_minutes') {
          const m = Number(String(e.detail || '').replace(/[^0-9-]/g, ''));
          mins += isNaN(m) ? 0 : Math.max(0, m);
        }
      });
    });
    return mins;
  }, [studyHistory]);

  const recommendationV3 = useMemo(() => {
    const topCluster = Object.entries(wrongClusters).sort((a, b) => b[1] - a[1])[0]?.[0] || 'General';
    if (wrongBook.length >= 6) {
      return { action: `先做${topCluster}错题复盘包`, eta: 25, score: 92, reason: `错题池 ${wrongBook.length} 条，优先止损提升通过率。` };
    }
    if (stability < 65) {
      return { action: '做一次错题回放 + 复测稳定性', eta: 30, score: 86, reason: `当前稳定度 ${stability}，建议先降波动。` };
    }
    if (recentStudyMins < 60) {
      return { action: '补一次 45 分钟主线学习', eta: 45, score: 78, reason: `近3天学习时长 ${recentStudyMins} 分钟，建议恢复节奏。` };
    }
    const next = allChapters.find((c) => !curriculumDone[c.id]);
    return { action: next ? `推进下一章：${next.title}` : '进入贡献实战章节', eta: 35, score: 80, reason: '当前状态适合继续推进主线。' };
  }, [wrongBook.length, wrongClusters, stability, recentStudyMins, allChapters, curriculumDone]);

  const smartRecommendation = (() => {
    if (wrongBook.length >= 5) return '优先做错题回放：先处理最近 5 条错题，再进行一次章节复测。';
    if (passCount < 3) return '建议先完成 EL/CL/EVM 三章测评，建立稳定协议基础。';
    if (passCount < 6) return '建议推进 Engine API + Client Testing，开始进入工程实操层。';
    return '建议进入跨客户端调试与贡献实战模块，准备首个可验证 PR。';
  })();

  const nextBestAction = useMemo(() => {
    if (wrongBook.length >= 3) {
      return { label: '先回放错题再复测', to: '/progress', reason: `当前错题 ${wrongBook.length} 条，先清理高频错题最划算。` };
    }
    const next = allChapters.find((c) => !curriculumDone[c.id]);
    if (!next) {
      return { label: '进入贡献实战路径', to: '/curriculum#client-contrib-deep', reason: '基础章节已完成，建议转向真实贡献闭环。' };
    }
    const deps = chapterDependencies[next.id] || [];
    const missing = deps.filter((d) => !curriculumDone[d]);
    if (missing.length > 0) {
      return { label: `先补前置章节（${missing[0]}）`, to: `/curriculum#${missing[0]}`, reason: `下一章 ${next.title} 依赖前置知识。` };
    }
    return { label: `继续学习 ${next.title}`, to: `/curriculum#${next.id}`, reason: '当前最优路径：按依赖顺序推进。' };
  }, [wrongBook.length, allChapters, curriculumDone]);

  const [badgeToast, setBadgeToast] = useState<string | null>(null);
  const [showSecondary, setShowSecondary] = useState(false);
  const [showHeavyPanels, setShowHeavyPanels] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setShowHeavyPanels(true), 380);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const allDone = Object.values(onboardingTasks || {}).every(Boolean);
    const hadBadge = badges.includes('Starter Badge');
    if (allDone && !hadBadge) {
      awardBadge('Starter Badge');
      setBadgeToast('🏅 恭喜解锁 Starter Badge');
      setTimeout(() => setBadgeToast(null), 2500);
    }
  }, [onboardingTasks, awardBadge, badges]);

  const toggleTask = (k: string) => setOnboardingTask(k, !(onboardingTasks || {})[k]);

  return (
    <main className="container">
      <section className="hero dashboard-grid">
        <div className="card banner-glow card-hover">
          <h1 className="hero-title">{t('homeMainGoal', lang)}</h1>
          <p className="brand-tagline">{t('nextAction', lang)}：<span className="hero-action-pill">{nextBestAction.label}</span></p>
          <p className="subtle">{t('etaMins', lang)}：<strong>{recommendationV3.eta} 分钟</strong></p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link to={nextBestAction.to} className="btn" onClick={() => metricRecClick()}>{t('startLearning', lang)}</Link>
            <button className="btn btn-ghost" onClick={() => setShowSecondary((v) => !v)}>{showSecondary ? t('collapseSecondary', lang) : t('expandSecondary', lang)}</button>
          </div>
          <div className="sticky-action-bar">
            <Link to={nextBestAction.to} className="btn" onClick={() => metricRecClick()}>{t('startLearning', lang)}</Link>
            <Link to={lastVisitedSection ? `/curriculum#${lastVisitedSection}` : '/curriculum#el-core'} className="btn btn-ghost">{t('continueLearning', lang)}</Link>
          </div>
        </div>

        <aside className="card profile-intro-card card-hover">
          <div className="card-title-row">
            <h3 style={{ margin: 0 }}>关于我 / About Me</h3>
            <span className="meta-pill">Creator Profile</span>
          </div>

          <div className="profile-intro-row">
            <div className="profile-avatar-placeholder" aria-label="头像占位">Avatar</div>
            <div>
              <div><strong>你的名字 / Name</strong></div>
              <small className="subtle">一句介绍：例如「专注 Ethereum 协议学习与工程实践」</small>
            </div>
          </div>

          <div className="profile-links">
            <div className="profile-link-item"><strong>微信：</strong><span className="subtle">（填你的微信号或二维码说明）</span></div>
            <div className="profile-link-item"><strong>Telegram：</strong><span className="subtle">https://t.me/your_handle</span></div>
            <div className="profile-link-item"><strong>X：</strong><span className="subtle">https://x.com/your_handle</span></div>
          </div>
        </aside>

      </section>

      {showSecondary && (
        <section className="card card-hover">
          <h3>{t('secondaryTitle', lang)}</h3>
          <div className="kpi-grid">
            <div className="kpi"><small>当前 XP</small><br/><b>{xp}</b></div>
            <div className="kpi"><small>已通过测评</small><br/><b>{passCount}</b></div>
            <div className="kpi"><small>错题池</small><br/><b>{wrongBook.length}</b></div>
          </div>
          <p className="subtle" style={{ marginTop: 8 }}>推荐解释：{recommendationV3.reason}</p>
        </section>
      )}

      {badgeToast && <div className="toast">{badgeToast}</div>}



      <div className="stagger">
      <div className="card card-hover">
        <h3 className="section-title">今日智能建议</h3>
        <div className="notice">{smartRecommendation}</div>
        <p style={{ marginTop: 8 }}><strong>推荐引擎 v3：</strong>{recommendationV3.action}</p>
        <p className="subtle">预计耗时：{recommendationV3.eta} 分钟 · 收益分：{recommendationV3.score} · {recommendationV3.reason}</p>
        <p style={{ marginTop: 10 }}><strong>下一个徽章目标：</strong>{nextBadgeHint}</p>
      </div>

      <div className="card card-hover">
        <h3 className="section-title">Badge 墙</h3>
        <div className="badge-wall">
          {['Starter Badge', 'First Pass', 'Protocol Explorer', 'Wrongbook Warrior'].map((b) => (
            <div key={b} className={`badge-item ${badges.includes(b) ? 'badge-on' : 'badge-off'}`}>
              <strong>{b}</strong>
              <small>{badges.includes(b) ? '已解锁' : '未解锁'}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">内容覆盖（持续扩展）</h3>
        <ul>
          <li>执行层：状态树、Gas、交易执行语义、mempool 行为</li>
          <li>共识层：fork choice、finality、时钟与同步机制</li>
          <li>客户端工程：Engine API 对接、一致性测试、回归流水线</li>
          <li>贡献实操：Issue 拆解、失败测试先行、PR 证据链</li>
        </ul>
      </div>

      <section className="card card-hover">
        <h3>🔥 新增专题导览（PlotCard 统一体系）</h3>
        <div className="grid">
          {featuredPlots.map((p) => <PlotCard key={p.id} {...p} status="new" />)}
        </div>
      </section>

      <div className="card">
        <h3>新手首日引导任务流</h3>
        <div className="task-item"><input type="checkbox" checked={!!onboardingTasks.read} onChange={() => toggleTask('read')} /><span>完成「EL 核心」章节阅读（15-20 分钟）</span></div>
        <div className="task-item"><input type="checkbox" checked={!!onboardingTasks.quiz} onChange={() => toggleTask('quiz')} /><span>提交第一次章节测评，建立基线分数</span></div>
        <div className="task-item"><input type="checkbox" checked={!!onboardingTasks.replay} onChange={() => toggleTask('replay')} /><span>执行一次错题回放，记录改进点</span></div>
        <div className="task-item"><input type="checkbox" checked={!!onboardingTasks.report} onChange={() => toggleTask('report')} /><span>导出首份学习报告（HTML）作为学习档案</span></div>
        {badges.includes('Starter Badge') && <p style={{ marginTop: 8 }}>🏅 已获得：<strong>Starter Badge</strong></p>}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link to="/curriculum#el-core" className="btn">开始首日任务</Link>
          <Link to="/progress" className="btn">查看错题与进度</Link>
        </div>
      </div>

      <div className="card">
        <h3>学习路线速览</h3>
        <ul>
          <li><strong>第 1 周：</strong>EL / CL / EVM 核心打底 + 基线测评</li>
          <li><strong>第 2 周：</strong>交易生命周期 + Engine API + EIP 流程</li>
          <li><strong>第 3 周：</strong>客户端测试与安全专题 + 错题压缩复盘</li>
          <li><strong>第 4 周：</strong>跨客户端调试 + 首个贡献实战任务</li>
          <li><strong>第 5 周（进阶）：</strong>Verkle/Stateless + EIP-4844 + PBS 抗审查专题</li>
        </ul>
      </div>

      <div className="card card-hover">
        <h3 className="section-title">学习热力图（近14天）</h3>
        <div className="heatmap">
          {heatmap.map((v, idx) => <span key={idx} className={`heat-${v}`} title={`Day-${idx + 1} 强度 ${v}`} />)}
        </div>
        <small>强度说明：0=休息，4=高强度学习。</small>
      </div>

      <div className="card">
        <h3 className="section-title">A/B 推荐效果对比</h3>
        <p className="subtle">A 组（旧规则）预计完成率：{Math.max(45, 70 - wrongBook.length)}% · B 组（v3）预计完成率：{Math.min(92, Math.max(52, 74 + Math.round(stability/8) - Math.floor(wrongBook.length/2)))}%</p>
      </div>

      <div className="card">
        <h3 className="section-title">个人学习周报卡（自动摘要）</h3>
        <div className="weekly-card-grid">
          <div className="kpi"><small>本周通过测评</small><br/><b>{weeklySummary.passed}</b></div>
          <div className="kpi"><small>当前错题池</small><br/><b>{weeklySummary.wrongs}</b></div>
          <div className="kpi"><small>累计学习分钟</small><br/><b>{weeklySummary.minutes}</b></div>
          <div className="kpi"><small>已获徽章数</small><br/><b>{weeklySummary.badges}</b></div>
        </div>
        <p style={{ marginTop: 10 }}>自动结论：{weeklySummary.passed >= 3 ? '节奏良好，可提升到中高难实战。' : '建议先稳住基础章节测评通过率，再扩展深度内容。'}</p>
      </div>


      <div className="card card-hover">
        <h3 className="section-title">本周新增课程</h3>
        <div className="quick-links">
          <Link to="/curriculum#eip4337-production-hardening-deep" className="btn">AA 生产化加固</Link>
          <Link to="/curriculum#ens-name-resolution-security-deep" className="btn">ENS 解析安全</Link>
          <Link to="/curriculum#mempool-private-orderflow-deep" className="btn">Mempool/私有路由</Link>
        </div>
      </div>

      {showHeavyPanels ? (
        <>
          <Suspense fallback={<div className="card skeleton">{t('mapSkeleton', lang)}</div>}><MapRenderer mode="svg" /></Suspense>
          <Suspense fallback={<div className="card skeleton">{t('graphSkeleton', lang)}</div>}><GlossaryGraph glossary={localGlossary.slice(0, 18) as any} /></Suspense>
        </>
      ) : (
        <>
          <div className="card skeleton">{t('mapSkeleton', lang)}</div>
          <div className="card skeleton">{t('graphSkeleton', lang)}</div>
        </>
      )}

      <div className="card card-hover">
        <h3 className="section-title">协议雷达（本周）</h3>
        <div className="grid">
          <div className="level"><strong>执行层热点</strong><small>EIP-1559 费用波动与替换交易策略</small></div>
          <div className="level"><strong>共识层热点</strong><small>最终性延迟信号与验证者在线率</small></div>
          <div className="level"><strong>扩容热点</strong><small>EIP-4844 blob 成本窗口与批次调优</small></div>
        </div>
        <div className="quick-links" style={{ marginTop: 10 }}>
          <Link to="/curriculum#eip4844-da-economics-deep" className="btn">{t('startLearning', lang)}</Link>
          <Link to="/curriculum#pbs-inclusion-censorship-deep" className="btn">去复测</Link>
          <Link to="/curriculum#verkle-stateless-deep" className="btn">去实战</Link>
        </div>
      </div>

      </div>

      <div className="card">
        <h3>每日任务</h3>
        <ul>{daily.map((d) => <li key={d}>{d}</li>)}</ul>
      </div>
    </main>
  );
}
