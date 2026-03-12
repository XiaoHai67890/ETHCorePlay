import { Link } from 'react-router-dom';
import { useProgressStore } from '../game/store';
import { getDailyQuests } from '../game/daily';
import { Card } from '../components/ui/Card';
import { GardenMap } from '../components/GardenMap';
import { plots, zones } from '../data/plotCatalog';

export function HomePage() {
  const { xp, unlockedLevel, completed, wrongBook } = useProgressStore();
  const daily = getDailyQuests();
  const completedCount = Object.values(completed).filter(Boolean).length;
  const featuredPlots = plots.filter((item) => item.featured).slice(0, 8);
  const nextPlots = plots.filter((item) => item.levelId <= unlockedLevel && !completed[item.levelId]).slice(0, 4);

  return (
    <main className="container">
      <div className="page-head">
        <h1>ETHCorePlay</h1>
      </div>

      <section className="home-hero">
        <Card>
          <div className="card-title-row">
            <h3 style={{ margin: 0 }}>地图</h3>
            <span className="meta-pill">Featured</span>
          </div>
          <GardenMap plots={featuredPlots} compact />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link to="/map" className="btn">进入地图</Link>
            <Link to="/search" className="btn btn-ghost">搜索</Link>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <h3>状态</h3>
            <div className="kpi-grid">
              <div className="kpi"><small>XP</small><br /><b>{xp}</b></div>
              <div className="kpi"><small>解锁</small><br /><b>Lv{unlockedLevel}</b></div>
              <div className="kpi"><small>通关</small><br /><b>{completedCount}</b></div>
              <div className="kpi"><small>错题</small><br /><b>{wrongBook.length}</b></div>
            </div>
          </Card>

          <Card>
            <h3>快捷入口</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Link to="/curriculum" className="btn btn-ghost">课程</Link>
              <Link to="/progress" className="btn btn-ghost">总览</Link>
              <Link to="/glossary" className="btn btn-ghost">术语</Link>
            </div>
          </Card>
        </div>
      </section>

      <section className="home-zones">
        {zones.map((zone) => (
          <article key={zone.key} className="card zone-card">
            <h3>{zone.title}</h3>
            <p className="subtle">{zone.subtitle}</p>
            <Link to={`/zone/${zone.key}`} className="btn btn-ghost">进入园区</Link>
          </article>
        ))}
      </section>

      <section className="home-lower">
        <Card>
          <h3>推荐地块</h3>
          <ul>
            {(nextPlots.length ? nextPlots : plots.slice(0, 4)).map((plot) => (
              <li key={plot.id}>
                <Link to={`/plot/${plot.id}`}>{plot.title}</Link> · 难度 {plot.difficulty}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3>每日任务</h3>
          <ul>{daily.map((d) => <li key={d}>{d}</li>)}</ul>
          <a className="btn btn-ghost" href="https://github.com/XiaoHai67890/ETHCorePlay/issues/new" target="_blank" rel="noreferrer">
            反馈
          </a>
        </Card>
      </section>
    </main>
  );
}

