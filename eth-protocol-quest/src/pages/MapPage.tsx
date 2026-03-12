import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useProgressStore } from '../game/store';
import { GardenMap } from '../components/GardenMap';
import { plots, zones, ZoneKey } from '../data/plotCatalog';
import { levels } from '../data/levels';

export function MapPage() {
  const { unlockedLevel, completed } = useProgressStore();
  const [query, setQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState<'all' | ZoneKey>('all');
  const [difficulty, setDifficulty] = useState<'all' | '1-2' | '3-5'>('all');
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null);

  const filteredPlots = useMemo(() => {
    let list = [...plots];
    if (zoneFilter !== 'all') list = list.filter((item) => item.zone === zoneFilter);
    if (difficulty === '1-2') list = list.filter((item) => item.difficulty <= 2);
    if (difficulty === '3-5') list = list.filter((item) => item.difficulty >= 3);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((item) => `${item.title} ${item.summary} ${item.tags.join(' ')}`.toLowerCase().includes(q));
    }
    return list;
  }, [query, zoneFilter, difficulty]);

  useEffect(() => {
    if (!filteredPlots.length) {
      setSelectedPlotId(null);
      return;
    }
    if (!selectedPlotId || !filteredPlots.some((item) => item.id === selectedPlotId)) {
      setSelectedPlotId(filteredPlots[0].id);
    }
  }, [filteredPlots, selectedPlotId]);

  const selectedPlot = useMemo(
    () => filteredPlots.find((item) => item.id === selectedPlotId) || null,
    [filteredPlots, selectedPlotId]
  );

  const selectedLevel = useMemo(
    () => (selectedPlot ? levels.find((item) => item.slug === selectedPlot.id) || null : null),
    [selectedPlot]
  );

  const visibleUnlocked = filteredPlots.filter((item) => item.levelId <= unlockedLevel).length;
  const visibleCompleted = filteredPlots.filter((item) => !!completed[item.levelId]).length;
  const visibleActionable = filteredPlots.filter((item) => item.levelId <= unlockedLevel && !completed[item.levelId]).length;

  const zoneStats = useMemo(
    () =>
      zones.map((zone) => {
        const total = plots.filter((item) => item.zone === zone.key).length;
        const visible = filteredPlots.filter((item) => item.zone === zone.key).length;
        const done = plots.filter((item) => item.zone === zone.key && completed[item.levelId]).length;
        return { ...zone, total, visible, done };
      }),
    [completed, filteredPlots]
  );

  const relatedPlots = useMemo(() => {
    if (!selectedPlot) return [];
    return plots.filter((item) => item.zone === selectedPlot.zone && item.id !== selectedPlot.id).slice(0, 4);
  }, [selectedPlot]);

  return (
    <main className="container container-wide">
      <div className="page-head">
        <nav className="breadcrumb" aria-label="breadcrumb">
          <Link to="/">首页</Link> / <span>地图</span>
        </nav>
        <h2>协议地图工作台</h2>
      </div>

      <section className="map-workbench">
        <aside className="card map-sidebar">
          <section className="map-panel-block">
            <h3>筛选器</h3>
            <div className="layout-filters">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索地块" />
              <select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value as any)}>
                <option value="all">全部园区</option>
                {zones.map((zone) => (
                  <option key={zone.key} value={zone.key}>
                    {zone.title}
                  </option>
                ))}
              </select>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)}>
                <option value="all">全部难度</option>
                <option value="1-2">低难度 (1-2)</option>
                <option value="3-5">中高难度 (3-5)</option>
              </select>
            </div>
          </section>

          <section className="map-panel-block">
            <h3>可见范围概览</h3>
            <div className="kpi-grid compact">
              <div className="kpi"><small>命中</small><br /><b>{filteredPlots.length}</b></div>
              <div className="kpi"><small>可挑战</small><br /><b>{visibleUnlocked}</b></div>
              <div className="kpi"><small>已通关</small><br /><b>{visibleCompleted}</b></div>
              <div className="kpi"><small>待推进</small><br /><b>{visibleActionable}</b></div>
            </div>
          </section>

          <section className="map-panel-block">
            <h3>园区状态</h3>
            <div className="zone-list">
              {zoneStats.map((zone) => (
                <button
                  key={zone.key}
                  className={`zone-item ${zoneFilter === zone.key ? 'active' : ''}`}
                  onClick={() => setZoneFilter(zoneFilter === zone.key ? 'all' : zone.key)}
                >
                  <div>
                    <strong>{zone.title}</strong>
                    <small>显示 {zone.visible}/{zone.total}</small>
                  </div>
                  <small>{zone.done} 已完成</small>
                </button>
              ))}
            </div>
          </section>
        </aside>

        <section className="card map-center">
          <div className="card-title-row">
            <h3 style={{ margin: 0 }}>地图主舞台</h3>
            <span className="meta-pill">命中 {filteredPlots.length} / {plots.length}</span>
          </div>
          <GardenMap
            plots={filteredPlots}
            selectedPlotId={selectedPlotId || undefined}
            onSelectPlot={setSelectedPlotId}
          />
        </section>

        <aside className="card map-detail">
          <section className="map-panel-block">
            <h3>详情面板</h3>
            {!selectedPlot ? (
              <p className="subtle">当前筛选无地块。</p>
            ) : (
              <>
                <strong>{selectedPlot.title}</strong>
                <p className="subtle">{selectedPlot.summary}</p>
                <div className="chips">
                  <span className="chip">难度 {selectedPlot.difficulty}</span>
                  <span className="chip">时长 {selectedPlot.timeMins}m</span>
                  <span className="chip">Lv{selectedPlot.levelId}</span>
                </div>
                <p>
                  状态：
                  {completed[selectedPlot.levelId] ? ' 已通关' : selectedPlot.levelId <= unlockedLevel ? ' 可挑战' : ' 未解锁'}
                </p>
              </>
            )}
          </section>

          {selectedLevel ? (
            <section className="map-panel-block">
              <h3>学习目标</h3>
              <p>{selectedLevel.goal}</p>
              <small className="subtle">Boss：{selectedLevel.bossChallenge}</small>
            </section>
          ) : null}

          <section className="map-panel-block">
            <h3>行动</h3>
            {!selectedPlot ? (
              <p className="subtle">未选择地块。</p>
            ) : (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Link className="btn" to={`/plot/${selectedPlot.id}`}>查看地块</Link>
                <Link className="btn btn-ghost" to={`/level/${selectedPlot.levelId}`}>进入关卡</Link>
                <Link className="btn btn-ghost" to={`/zone/${selectedPlot.zone}`}>进入园区</Link>
              </div>
            )}
          </section>

          {relatedPlots.length > 0 ? (
            <section className="map-panel-block">
              <h3>同园区相关地块</h3>
              <ul>
                {relatedPlots.map((plot) => (
                  <li key={plot.id}>
                    <button className="inline-link-btn" onClick={() => setSelectedPlotId(plot.id)}>
                      {plot.title}
                    </button>
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
