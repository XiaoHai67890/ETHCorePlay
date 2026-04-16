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
  const [showAdvancedPanels, setShowAdvancedPanels] = useState(false);

  const trailCards = [
    {
      id: 'beginner',
      title: 'Beginner Trail',
      objective: '从账户、交易到状态变更，建立协议直觉',
      difficulty: 'Foundation',
      duration: '30-40 min',
      progress: passCount >= 1 ? '已起步' : '建议优先',
      prereq: '无需前置',
      to: '/curriculum#el-core',
      featured: true
    },
    {
      id: 'evm',
      title: 'EVM Trail',
      objective: '理解 Gas、状态变化与执行模型',
      difficulty: 'Intermediate',
      duration: '35-45 min',
      progress: curriculumDone['evm-core'] ? '已完成核心' : '进行中',
      prereq: '建议先完成 EL 核心',
      to: '/curriculum#evm-core'
    },
    {
      id: 'consensus',
      title: 'Consensus Trail',
      objective: '掌握 fork choice / finality / validator 机制',
      difficulty: 'Intermediate',
      duration: '40-50 min',
      progress: curriculumDone['cl-core'] ? '已完成核心' : '可开始',
      prereq: '建议了解基础网络同步',
      to: '/curriculum#cl-core'
    },
    {
      id: 'research',
      title: 'Research Trail',
      objective: 'Verkle、PBS、跨 Rollup 互操作专题',
      difficulty: 'Advanced',
      duration: '45-60 min',
      progress: passCount >= 5 ? '适合推进' : '建议完成前置后进入',
      prereq: '建议完成 EVM + Consensus',
      to: '/curriculum#verkle-stateless-deep'
    }
  ];

  const topicsIslands = [
    { id: 'execution', title: 'Execution Layer', desc: '交易执行、Gas、状态变化', to: '/curriculum#el-core', size: 'island-large' },
    { id: 'consensus', title: 'Consensus Layer', desc: 'fork choice、finality、验证者机制', to: '/curriculum#cl-core', size: 'island-medium' },
    { id: 'state', title: 'State / Trie', desc: '状态存储与证明结构', to: '/curriculum#el-deep-state-trie', size: 'island-medium' },
    { id: 'networking', title: 'P2P / Networking', desc: 'mempool 与传播拓扑', to: '/curriculum#tx-lifecycle-core', size: 'island-small' },
    { id: 'rollup', title: 'Rollups / L2', desc: 'DA 经济与跨层协同', to: '/curriculum#l2-da-core', size: 'island-small' },
    { id: 'future', title: 'Future Upgrades', desc: 'Verkle / PBS / Stateless', to: '/curriculum#verkle-stateless-deep', size: 'island-medium' }
  ];

  const crossPollination = [
    { from: 'Gas', to: 'Rollup Cost Model', bridge: 'affects', why: '状态访问路径直接影响 L2 成本结构', href: '/curriculum#evm-core' },
    { from: 'Fork Choice', to: 'Finality Guarantees', bridge: 'shapes', why: '最终性窗口由 fork-choice 信号共同决定', href: '/curriculum#cl-core' },
    { from: 'Blob DA', to: 'L2 Scaling Path', bridge: 'enables', why: '4844 的 blob 通道决定批处理经济上限', href: '/curriculum#eip4844-da-economics-deep' }
  ];

  const timelineMilestones = [
    { name: 'Frontier', summary: '初始执行语义与账户模型', emphasis: 'legacy' },
    { name: 'Byzantium / Istanbul', summary: 'Gas、opcode 与安全边界持续调整', emphasis: 'legacy' },
    { name: 'The Merge', summary: 'PoS 共识接管，执行/共识分层清晰', emphasis: 'major' },
    { name: 'EIP-4844', summary: 'Blob DA 推动 Rollup-centric 成本下降', emphasis: 'major' },
    { name: 'Future Upgrades', summary: 'Verkle、Stateless、PBS 研究演进（进行中）', emphasis: 'future' }
  ];

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
    <main className="container home-page">
      <section className="hero dashboard-grid section-block">
        <div className="card banner-glow card-hover garden-entrance fog-terrain garden-shell hero-primary">
          <p className="garden-kicker" style={{ marginBottom: 6 }}>Infinite Garden Entrance</p>
          <h1 className="hero-title">进入协议花园，<br />今天先生长一小步</h1>
          <p className="brand-tagline">下一步学习动作：<span className="hero-action-pill">{nextBestAction.label}</span></p>
          <p className="subtle">{t('etaMins', lang)}：<strong>{recommendationV3.eta} 分钟</strong></p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link to={nextBestAction.to} className="btn btn-garden" onClick={() => metricRecClick()}>进入花园</Link>
            <button className="btn btn-ghost" onClick={() => setShowSecondary((v) => !v)}>{showSecondary ? t('collapseSecondary', lang) : t('expandSecondary', lang)}</button>
          </div>
          <div className="sticky-action-bar">
            <Link to={nextBestAction.to} className="btn btn-garden" onClick={() => metricRecClick()}>进入花园</Link>
            <Link to={lastVisitedSection ? `/curriculum#${lastVisitedSection}` : '/curriculum#el-core'} className="btn btn-ghost">继续生长</Link>
          </div>
        </div>

        <aside className="card profile-intro-card card-hover hero-map-preview">
          <div className="card-title-row">
            <h3 style={{ margin: 0 }}>协议花园地图入口</h3>
            <span className="meta-pill">Garden Nodes</span>
          </div>
          <p className="subtle" style={{ marginTop: 6 }}>选择任意入口开始漫游，不必按单一路径推进。</p>
          <div className="garden-node-grid">
            <Link className="garden-node garden-node-featured" to="/curriculum#el-core"><strong>Execution</strong><small>执行语义 / 状态变化</small></Link>
            <Link className="garden-node" to="/curriculum#cl-core"><strong>Consensus</strong><small>Fork choice / Finality</small></Link>
            <Link className="garden-node" to="/curriculum#tx-lifecycle-core"><strong>Networking</strong><small>Mempool / Propagation</small></Link>
            <Link className="garden-node" to="/curriculum#eip-workflow-core"><strong>Governance</strong><small>EIP workflow</small></Link>
            <Link className="garden-node" to="/curriculum#security-core"><strong>Security</strong><small>威胁模型 / 防护</small></Link>
            <Link className="garden-node" to="/curriculum#verkle-stateless-deep"><strong>Research</strong><small>Verkle / Stateless</small></Link>
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



      <section className="card card-hover section-block garden-section garden-shell section-priority-high">
        <div className="card-title-row">
          <h3 className="section-title" style={{ margin: 0 }}>Learning Trails · 学习路径</h3>
          <small className="subtle">推荐从一条路径深入，再交叉探索其他分支</small>
        </div>
        <div className="grid trail-links" style={{ marginTop: 8 }}>
          {trailCards.map((trail) => (
            <article key={trail.id} className={`path-card trail-card ${trail.featured ? 'trail-card-featured' : ''}`}>
              <strong>{trail.title}</strong>
              <span className="cta-copy">{trail.objective}</span>
              <div className="trail-metas">
                <span className="meta-pill">难度 · {trail.difficulty}</span>
                <span className="meta-pill">时长 · {trail.duration}</span>
                <span className="meta-pill">进度 · {trail.progress}</span>
              </div>
              <small className="subtle">前置知识：{trail.prereq}</small>
              <div className="quick-links" style={{ marginTop: 8 }}><Link className="btn btn-ghost" to={trail.to}>进入路径</Link></div>
            </article>
          ))}
        </div>
      </section>


      <section className="card card-hover section-block section-muted">
        <div className="card-title-row">
          <h3 style={{ margin: 0 }}>内容层级视图</h3>
          <span className="meta-pill">降噪模式</span>
        </div>
        <p className="subtle" style={{ marginTop: 6 }}>在地图、层级、时间线三种视图间切换，按需展开进阶分析。</p>
        <div className="view-switch-row">
          <span className="meta-pill">地图模式</span>
          <span className="meta-pill">层级模式</span>
          <span className="meta-pill">时间线模式</span>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <button className="btn btn-ghost" onClick={() => setShowAdvancedPanels((v) => !v)}>{showAdvancedPanels ? '收起进阶区' : '展开进阶区'}</button>
          <Link className="btn btn-ghost" to="/curriculum">进入课程主线</Link>
          <Link className="btn btn-ghost" to="/progress">查看成长看板</Link>
        </div>
      </section>



      <section className="card card-hover garden-section garden-shell section-priority-high">
        <div className="card-title-row">
          <h3 className="section-title" style={{ margin: 0 }}>协议演化时间轴</h3>
          <span className="meta-pill">Protocol Evolution</span>
        </div>
        <div className="protocol-timeline protocol-rail" style={{ marginTop: 8 }}>
          {timelineMilestones.map((item) => (
            <article key={item.name} className={`protocol-milestone milestone-${item.emphasis}`}>
              <strong>{item.name}</strong>
              <small className="subtle">{item.summary}</small>
            </article>
          ))}
        </div>
      </section>


      <section className="card card-hover garden-section garden-shell section-muted">
        <div className="card-title-row">
          <h3 className="section-title" style={{ margin: 0 }}>Topics Islands · 知识岛屿</h3>
          <span className="meta-pill">Protocol Ecology</span>
        </div>
        <div className="grid islands-grid" style={{ marginTop: 8 }}>
          {topicsIslands.map((t) => (
            <article key={t.id} className={`path-card island-card ${t.size}`}>
              <strong>{t.title}</strong>
              <small className="subtle">{t.desc}</small>
              <div className="quick-links" style={{ marginTop: 8 }}><Link className="btn btn-ghost" to={t.to}>探索节点</Link></div>
            </article>
          ))}
        </div>
      </section>

      <section className="card card-hover garden-section garden-shell section-muted">
        <div className="card-title-row">
          <h3 className="section-title" style={{ margin: 0 }}>Cross-pollination · 交叉授粉推荐</h3>
          <span className="meta-pill">Related Paths</span>
        </div>
        <div className="cross-pollination-list" style={{ marginTop: 8 }}>
          {crossPollination.map((r) => (
            <article key={`${r.from}-${r.to}`} className="path-card pollination-card">
              <strong>{r.from}</strong>
              <span className="pollination-bridge">{r.bridge}</span>
              <strong>{r.to}</strong>
              <small className="subtle">{r.why}</small>
              <div className="quick-links" style={{ marginTop: 8 }}><Link className="btn btn-ghost" to={r.href}>查看相关节点</Link></div>
            </article>
          ))}
        </div>
      </section>

      <div className="stagger">
      <div className="card card-hover section-muted">
        <h3 className="section-title">Today’s Growth · 今日生长建议</h3>
        <div className="notice">{smartRecommendation}</div>
        <p style={{ marginTop: 8 }}><strong>今天建议：</strong>{recommendationV3.action}</p>
        <p className="subtle">完成后将解锁：更稳定的连续学习节奏与下一章节入口。</p>
        <p className="subtle">预计投入：{recommendationV3.eta} 分钟 · 收益分：{recommendationV3.score}</p>
        <div className="quick-links" style={{ marginTop: 10 }}>
          <Link to={nextBestAction.to} className="btn btn-garden">Continue today</Link>
        </div>
      </div>

      <div className="card card-hover section-muted">
        <h3 className="section-title">Growth Milestones · 生长印记</h3>
        <p className="subtle" style={{ marginTop: 6 }}>下一个里程碑：{nextBadgeHint}</p>
        <div className="badge-wall">
          {[
            { id: 'Starter Badge', label: 'Starter Seed' },
            { id: 'First Pass', label: 'First Root' },
            { id: 'Protocol Explorer', label: 'Protocol Explorer' },
            { id: 'Wrongbook Warrior', label: 'Rollup Wanderer' }
          ].map((badge) => (
            <div key={badge.id} className={`badge-item ${badges.includes(badge.id) ? 'badge-on' : 'badge-off'}`}>
              <strong>{badge.label}</strong>
              <small>{badges.includes(badge.id) ? '已解锁' : '未解锁'}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="card section-muted">
        <h3 className="section-title">内容覆盖（持续扩展）</h3>
        <ul>
          <li>执行层：状态树、Gas、交易执行语义、mempool 行为</li>
          <li>共识层：fork choice、finality、时钟与同步机制</li>
          <li>客户端工程：Engine API 对接、一致性测试、回归流水线</li>
          <li>贡献实操：Issue 拆解、失败测试先行、PR 证据链</li>
        </ul>
      </div>

      <section className="card card-hover section-priority-high">
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

      {showAdvancedPanels && (
      <>
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

      </>
      )}

      </div>

      <div className="card">
        <h3>每日任务</h3>
        <ul>{daily.map((d) => <li key={d}>{d}</li>)}</ul>
      </div>
    </main>
  );
}
