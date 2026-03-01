import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useProgressStore } from '../game/store';
import { getDailyQuests } from '../game/daily';

const ONBOARDING_KEY = 'epq_onboarding_v1';

export function HomePage() {
  const { xp, unlockedLevel, chapterResults, wrongBook, badges, awardBadge } = useProgressStore();
  const daily = getDailyQuests();
  const passCount = Object.values(chapterResults).filter((r) => r.passed).length;
  const [tasks, setTasks] = useState<Record<string, boolean>>({ read: false, quiz: false, replay: false, report: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ONBOARDING_KEY);
      if (raw) setTasks(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(tasks));
    const allDone = Object.values(tasks).every(Boolean);
    if (allDone) awardBadge('Starter Badge');
  }, [tasks, awardBadge]);

  const toggleTask = (k: string) => setTasks((s) => ({ ...s, [k]: !s[k] }));

  return (
    <main className="container">
      <section className="hero">
        <div className="card">
          <h1 className="hero-title">ETHCorePlay · 把协议学习变成可持续成长</h1>
          <p>从 EL/CL/EVM 到 Engine API 与客户端测试，用章节、测评、错题回放和实战模板构建真实能力。</p>
          <div className="chips" style={{ margin: '10px 0 14px' }}>
            <span className="chip">Learning-first</span>
            <span className="chip">Assessment-driven</span>
            <span className="chip">Client Contribution Ready</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link to="/curriculum" className="btn">进入系统课程</Link>
            <Link to="/map" className="btn">开始闯关</Link>
            <Link to="/progress" className="btn">学习总览</Link>
            <a className="btn" href="https://github.com/XiaoHai67890/ETHCorePlay/issues/new" target="_blank" rel="noreferrer">提交反馈</a>
          </div>
        </div>

        <div className="card">
          <h3>学习仪表盘</h3>
          <div className="kpi-grid">
            <div className="kpi"><small>当前 XP</small><br/><b>{xp}</b></div>
            <div className="kpi"><small>已解锁关卡</small><br/><b>Lv{unlockedLevel}</b></div>
            <div className="kpi"><small>已通过测评</small><br/><b>{passCount}</b></div>
          </div>
          <p style={{ marginTop: 10 }}>错题池：<strong>{wrongBook.length}</strong> 条（建议先去总览页复盘）</p>
          <div className="notice">本周建议：优先完成 2 个章节测评 + 1 次错题回放，再进入深度实操章节。</div>
        </div>
      </section>

      <div className="card">
        <h3>内容覆盖（持续扩展）</h3>
        <ul>
          <li>执行层：状态树、Gas、交易执行语义、mempool 行为</li>
          <li>共识层：fork choice、finality、时钟与同步机制</li>
          <li>客户端工程：Engine API 对接、一致性测试、回归流水线</li>
          <li>贡献实操：Issue 拆解、失败测试先行、PR 证据链</li>
        </ul>
      </div>

      <div className="card">
        <h3>新手首日引导任务流</h3>
        <div className="task-item"><input type="checkbox" checked={!!tasks.read} onChange={() => toggleTask('read')} /><span>完成「EL 核心」章节阅读（15-20 分钟）</span></div>
        <div className="task-item"><input type="checkbox" checked={!!tasks.quiz} onChange={() => toggleTask('quiz')} /><span>提交第一次章节测评，建立基线分数</span></div>
        <div className="task-item"><input type="checkbox" checked={!!tasks.replay} onChange={() => toggleTask('replay')} /><span>执行一次错题回放，记录改进点</span></div>
        <div className="task-item"><input type="checkbox" checked={!!tasks.report} onChange={() => toggleTask('report')} /><span>导出首份学习报告（HTML）作为学习档案</span></div>
        {badges.includes('Starter Badge') && <p style={{ marginTop: 8 }}>🏅 已获得：<strong>Starter Badge</strong></p>}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link to="/curriculum#el-core" className="btn">开始首日任务</Link>
          <Link to="/progress" className="btn">查看错题与进度</Link>
        </div>
      </div>

      <div className="card">
        <h3>每日任务</h3>
        <ul>{daily.map((d) => <li key={d}>{d}</li>)}</ul>
      </div>
    </main>
  );
}
