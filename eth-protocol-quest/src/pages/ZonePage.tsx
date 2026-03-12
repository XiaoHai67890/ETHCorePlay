import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { CustomSelect } from '../components/CustomSelect';
import { plots, zoneMap, ZoneKey } from '../data/plotCatalog';
import { levels } from '../data/levels';

const validZoneKeys = new Set<ZoneKey>(['execution', 'consensus', 'tooling', 'security', 'scaling']);
const zoneDifficultyOptions = [
  { value: 'all', label: '全部难度', hint: '显示当前园区所有地块' },
  { value: '1-2', label: '低难度 (1-2)', hint: '先清基础块' },
  { value: '3-5', label: '中高难度 (3-5)', hint: '直接看进阶块' }
];
const zoneSortOptions = [
  { value: 'recommended', label: '推荐排序', hint: '按默认学习顺序' },
  { value: 'difficulty', label: '按难度排序', hint: '从轻到重展开' },
  { value: 'time', label: '按时长排序', hint: '优先短时任务' }
];

export function ZonePage() {
  const { zoneKey } = useParams();
  const resolvedZone = validZoneKeys.has(zoneKey as ZoneKey) ? (zoneKey as ZoneKey) : null;
  const zone = resolvedZone ? zoneMap[resolvedZone] : null;

  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState<'all' | '1-2' | '3-5'>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'difficulty' | 'time'>('recommended');
  const [activePlotId, setActivePlotId] = useState<string | null>(null);

  const zonePlots = useMemo(() => {
    if (!resolvedZone) return [];
    let list = plots.filter((item) => item.zone === resolvedZone);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((item) => `${item.title} ${item.summary} ${item.tags.join(' ')}`.toLowerCase().includes(q));
    }
    if (difficulty === '1-2') list = list.filter((item) => item.difficulty <= 2);
    if (difficulty === '3-5') list = list.filter((item) => item.difficulty >= 3);
    if (sortBy === 'difficulty') list = [...list].sort((a, b) => a.difficulty - b.difficulty);
    if (sortBy === 'time') list = [...list].sort((a, b) => a.timeMins - b.timeMins);
    return list;
  }, [resolvedZone, query, difficulty, sortBy]);

  useEffect(() => {
    if (!zonePlots.length) {
      setActivePlotId(null);
      return;
    }
    if (!activePlotId || !zonePlots.some((item) => item.id === activePlotId)) {
      setActivePlotId(zonePlots[0].id);
    }
  }, [zonePlots, activePlotId]);

  const activePlot = useMemo(() => zonePlots.find((item) => item.id === activePlotId) || null, [zonePlots, activePlotId]);
  const activeLevel = useMemo(() => {
    if (!activePlot) return null;
    return levels.find((item) => item.id === activePlot.levelId) || null;
  }, [activePlot]);

  if (!zone) {
    return (
      <main className="container">
        <p>找不到对应园区。</p>
        <Link className="btn" to="/map">返回地图</Link>
      </main>
    );
  }

  return (
    <main className="container container-wide">
      <div className="page-head">
        <nav className="breadcrumb" aria-label="breadcrumb">
          <Link to="/">首页</Link> / <Link to="/map">地图</Link> / <span>{zone.title}</span>
        </nav>
        <h2>{zone.title}</h2>
      </div>

      <section className="tri-layout zone-layout">
        <aside className="card tri-left">
          <h3>筛选</h3>
          <div className="layout-filters">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索 plot"
              aria-label="搜索 plot"
            />
            <CustomSelect
              value={difficulty}
              onChange={(next) => setDifficulty(next as any)}
              options={zoneDifficultyOptions}
              ariaLabel="筛选难度"
              fullWidth
            />
            <CustomSelect
              value={sortBy}
              onChange={(next) => setSortBy(next as any)}
              options={zoneSortOptions}
              ariaLabel="排序方式"
              fullWidth
            />
          </div>
          <small className="subtle">结果 {zonePlots.length}</small>
        </aside>

        <section className="card tri-main">
          <h3>地块列表</h3>
          <ul className="plot-list">
            {zonePlots.map((item) => (
              <li key={item.id}>
                <button
                  className={`plot-list-item ${activePlotId === item.id ? 'active' : ''}`}
                  onClick={() => setActivePlotId(item.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>Lv{item.levelId} · {item.title}</strong>
                    <span className="meta-pill">难度 {item.difficulty}</span>
                  </div>
                  <small className="subtle">{item.summary}</small>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <aside className="card tri-right">
          <h3>详情</h3>
          {!activePlot ? (
            <p className="subtle">无地块。</p>
          ) : (
            <>
              <strong>{activePlot.title}</strong>
              <p>{activePlot.summary}</p>
              <div className="chips">
                <span className="chip">时长 {activePlot.timeMins}m</span>
                {activePlot.tags.map((tag) => <span key={`${activePlot.id}-${tag}`} className="chip">{tag}</span>)}
              </div>
              {activeLevel ? <small className="subtle">目标：{activeLevel.goal}</small> : null}
              <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Link className="btn" to={`/plot/${activePlot.id}`}>查看地块</Link>
                <Link className="btn btn-ghost" to={`/level/${activePlot.levelId}`}>进入关卡</Link>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}

