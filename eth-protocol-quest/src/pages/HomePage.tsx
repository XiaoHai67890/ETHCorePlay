import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useProgressStore } from '../game/store';
import { getDailyQuests } from '../game/daily';
import { Card } from '../components/ui/Card';
import { GardenMap } from '../components/GardenMap';
import { plots, zones } from '../data/plotCatalog';

export function HomePage() {
  const { xp, unlockedLevel, completed, wrongBook, badges, chapterResults, studyMinutes } = useProgressStore();
  const daily = getDailyQuests();

  const completedCount = Object.values(completed).filter(Boolean).length;
  const passedCount = Object.values(chapterResults).filter((item) => item.passed).length;
  const totalStudyMinutes = Object.values(studyMinutes || {}).reduce((sum, minutes) => sum + minutes, 0);

  const featuredPlots = useMemo(() => plots.filter((item) => item.featured).slice(0, 8), []);
  const nextPlots = useMemo(
    () => plots.filter((item) => item.levelId <= unlockedLevel && !completed[item.levelId]).slice(0, 4),
    [completed, unlockedLevel]
  );

  const activeZones = useMemo(
    () =>
      zones.map((zone) => {
        const zonePlots = plots.filter((item) => item.zone === zone.key);
        const done = zonePlots.filter((item) => completed[item.levelId]).length;
        return {
          ...zone,
          total: zonePlots.length,
          done
        };
      }),
    [completed]
  );

  return (
    <main className="container container-wide">
      <div className="page-head home-page-head">
        <p className="home-kicker">Ethereum Protocol Garden</p>
        <h1>把课程、地图和进度放回同一条学习路径里</h1>
        <p className="home-intro subtle">
          这版首页不再堆 dashboard。它只做一件事：让你从地图进入协议花园，然后用最短路径继续今天该推进的地块。
        </p>
      </div>

      <section className="home-hero">
        <Card className="home-hero-panel">
          <div className="card-title-row">
            <div>
              <p className="home-kicker">Main Map</p>
              <h2 style={{ marginBottom: 8 }}>从地图进入，而不是从信息噪音进入</h2>
            </div>
            <span className="meta-pill">Featured Plots</span>
          </div>

          <p className="subtle home-copy">
            花园地图现在是首页主角。先决定你今天要去哪个园区，再进入具体地块和关卡，不用先被一堆指标压住。
          </p>

          <div className="home-map-shell">
            <GardenMap plots={featuredPlots} compact />
          </div>

          <div className="home-actions">
            <Link to="/map" className="btn">
              打开完整地图
            </Link>
            <Link to="/curriculum" className="btn btn-ghost">
              继续课程主线
            </Link>
            <Link to="/search" className="btn btn-ghost">
              搜索术语 / 地块
            </Link>
          </div>
        </Card>

        <div className="home-side-stack">
          <Card className="home-status-panel">
            <div className="card-title-row">
              <h3 style={{ margin: 0 }}>生长状态</h3>
              <span className="meta-pill">Snapshot</span>
            </div>
            <div className="kpi-grid">
              <div className="kpi">
                <small>XP</small>
                <br />
                <b>{xp}</b>
              </div>
              <div className="kpi">
                <small>解锁层级</small>
                <br />
                <b>Lv{unlockedLevel}</b>
              </div>
              <div className="kpi">
                <small>通过测评</small>
                <br />
                <b>{passedCount}</b>
              </div>
              <div className="kpi">
                <small>学习时长</small>
                <br />
                <b>{totalStudyMinutes}m</b>
              </div>
            </div>
            <p className="subtle home-note">已完成关卡 {completedCount}，错题 {wrongBook.length}，徽章 {badges.length}。</p>
          </Card>

          <Card className="home-status-panel">
            <div className="card-title-row">
              <h3 style={{ margin: 0 }}>下一步</h3>
              <span className="meta-pill">Action Queue</span>
            </div>
            <ul className="home-inline-list">
              {(nextPlots.length ? nextPlots : plots.slice(0, 4)).map((plot) => (
                <li key={plot.id}>
                  <Link to={`/plot/${plot.id}`}>{plot.title}</Link>
                  <small>难度 {plot.difficulty} · {plot.timeMins} 分钟</small>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <section className="home-zones">
        {activeZones.map((zone) => (
          <article key={zone.key} className="card zone-card home-zone-card">
            <p className="home-kicker">Zone</p>
            <h3>{zone.title}</h3>
            <p className="subtle">{zone.subtitle}</p>
            <div className="zone-card-meta">
              <span>{zone.done}/{zone.total} 已推进</span>
              <span>{zone.total - zone.done} 待探索</span>
            </div>
            <Link to={`/zone/${zone.key}`} className="btn btn-ghost">
              进入园区
            </Link>
          </article>
        ))}
      </section>

      <section className="home-lower">
        <Card className="home-lower-card">
          <div className="card-title-row">
            <h3 style={{ margin: 0 }}>推荐地块</h3>
            <span className="meta-pill">Curated</span>
          </div>
          <ul className="home-inline-list">
            {(nextPlots.length ? nextPlots : plots.slice(0, 4)).map((plot) => (
              <li key={plot.id}>
                <Link to={`/plot/${plot.id}`}>{plot.title}</Link>
                <small>{plot.summary}</small>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="home-lower-card">
          <div className="card-title-row">
            <h3 style={{ margin: 0 }}>今日任务</h3>
            <span className="meta-pill">Daily</span>
          </div>
          <ul className="home-inline-list">
            {daily.map((item) => (
              <li key={item}>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="home-actions">
            <Link to="/progress" className="btn btn-ghost">
              查看总览
            </Link>
            <Link to="/glossary" className="btn btn-ghost">
              复习术语
            </Link>
          </div>
        </Card>
      </section>
    </main>
  );
}
