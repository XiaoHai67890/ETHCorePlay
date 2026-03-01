import { Link, useParams } from 'react-router-dom';

export function PlotPage() {
  const { id } = useParams();
  return (
    <main className="container">
      <Link to="/curriculum">← 返回课程</Link>
      <section className="card card-hover">
        <div className="card-title-row">
          <h2 style={{ margin: 0 }}>Plot: {id}</h2>
          <span className="meta-pill">Spec / EIP / Client</span>
        </div>
        <p className="subtle">Plot Page 模板：Intuition → Definition → Mechanism → Failure Modes → MiniLab → QuickQuiz</p>
      </section>

      <section className="card">
        <h3>MiniLab</h3>
        <ol>
          <li>执行最小可跑步骤</li>
          <li>记录预期输出</li>
          <li>对照异常路径并复盘</li>
        </ol>
      </section>
    </main>
  );
}
