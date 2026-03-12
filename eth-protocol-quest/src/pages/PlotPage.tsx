import { Link, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { plots } from '../data/plotCatalog';
import { levels } from '../data/levels';

export function PlotPage() {
  const { id } = useParams();
  const plot = useMemo(() => plots.find((item) => item.id === id), [id]);
  const level = useMemo(() => {
    if (!plot) return null;
    return levels.find((item) => item.id === plot.levelId) || null;
  }, [plot]);

  const related = useMemo(() => {
    if (!plot) return [];
    return plots.filter((item) => item.zone === plot.zone && item.id !== plot.id).slice(0, 4);
  }, [plot]);

  if (!plot || !level) {
    return (
      <main className="container">
        <p>找不到对应地块。</p>
        <Link className="btn" to="/map">返回地图</Link>
      </main>
    );
  }

  return (
    <main className="container container-wide">
      <div className="page-head">
        <nav className="breadcrumb" aria-label="breadcrumb">
          <Link to="/">首页</Link> / <Link to="/map">地图</Link> / <Link to={`/zone/${plot.zone}`}>园区</Link> / <span>{plot.title}</span>
        </nav>
      </div>

      <section className="tri-layout plot-page-layout">
        <aside className="card tri-left plot-toc">
          <h3>目录</h3>
          <ul>
            <li><a href="#goal">学习目标</a></li>
            <li><a href="#knowledge">关键知识点</a></li>
            <li><a href="#challenge">Boss 挑战</a></li>
            <li><a href="#quiz">自测题预览</a></li>
          </ul>
        </aside>

        <article className="tri-main">
          <section className="card">
            <div className="card-title-row">
              <h2 style={{ margin: 0 }}>{plot.title}</h2>
              <span className="meta-pill">难度 {plot.difficulty}</span>
            </div>
            <p>{plot.summary}</p>
            <div className="chips">
              <span className="chip">预计时长 {plot.timeMins} 分钟</span>
              {plot.tags.map((tag) => <span key={`${plot.id}-${tag}`} className="chip">{tag}</span>)}
            </div>
          </section>

          <section id="goal" className="card">
            <h3>学习目标</h3>
            <p>{level.goal}</p>
            <p className="subtle">{level.story}</p>
          </section>

          <section id="knowledge" className="card">
            <h3>关键知识点</h3>
            <ul>
              {level.knowledgeCards.map((card) => <li key={card}>{card}</li>)}
            </ul>
          </section>

          <section id="challenge" className="card">
            <h3>Boss 挑战</h3>
            <p>{level.bossChallenge}</p>
          </section>

          <section id="quiz" className="card">
            <h3>自测题预览</h3>
            <ol>
              {level.quiz.slice(0, 3).map((q) => (
                <li key={q.id}>
                  <strong>{q.prompt}</strong>
                  <div className="subtle">选项数：{q.options.length}</div>
                </li>
              ))}
            </ol>
          </section>
        </article>

        <aside className="card tri-right">
          <h3>操作</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link className="btn" to={`/level/${plot.levelId}`}>开始关卡训练</Link>
            <Link className="btn btn-ghost" to="/curriculum">查看课程路径</Link>
            <Link className="btn btn-ghost" to={`/zone/${plot.zone}`}>返回园区</Link>
          </div>

          {related.length > 0 ? (
            <section style={{ marginTop: 14 }}>
              <h4>同园区地块</h4>
              <ul>
                {related.map((item) => (
                  <li key={item.id}>
                    <Link to={`/plot/${item.id}`}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </aside>
      </section>
    </main>
  );
}

