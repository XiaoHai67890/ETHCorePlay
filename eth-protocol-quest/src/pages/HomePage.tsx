import { Link } from 'react-router-dom';
import { useProgressStore } from '../game/store';
import { getDailyQuests } from '../game/daily';

export function HomePage() {
  const { xp, unlockedLevel } = useProgressStore();
  const daily = getDailyQuests();

  return (
    <main className="container">
      <h1>Ethereum Protocol Quest</h1>
      <p>以“无限花园”风格闯关学习以太坊协议：从执行层到共识层、从 EIP 到客户端测试。</p>
      <div className="card">
        <p>当前 XP：<strong>{xp}</strong></p>
        <p>已解锁关卡：<strong>Lv{unlockedLevel}</strong></p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link to="/map" className="btn">开始闯关</Link>
          <Link to="/progress" className="btn">学习总览</Link>
          <Link to="/curriculum" className="btn">系统课程</Link>
          <a className="btn" href="https://github.com/XiaoHai67890/ETHCorePlay/issues/new" target="_blank" rel="noreferrer">提交反馈</a>
        </div>
      </div>

      <div className="card">
        <h3>每日任务</h3>
        <ul>{daily.map((d) => <li key={d}>{d}</li>)}</ul>
      </div>
    </main>
  );
}
