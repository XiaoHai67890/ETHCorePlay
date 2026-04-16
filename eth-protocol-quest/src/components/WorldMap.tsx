import { Link } from 'react-router-dom';
import { levels } from '../data/levels';
import { useProgressStore } from '../game/store';

export function WorldMap() {
  const { unlockedLevel, completed } = useProgressStore();

  return (
    <section className="card">
      <h2>协议大陆地图</h2>
      <div className="grid">
        {levels.map((l) => {
          const locked = l.id > unlockedLevel;
          return (
            <Link key={l.id} to={`/level/${l.id}`} className={`level ${locked ? 'locked' : ''}`}>
              <strong>Lv{l.id}</strong>
              <span>{l.title}</span>
              <small>{completed[l.id] ? '✅ 已通关' : locked ? '🔒 未解锁' : '🟢 可挑战'}</small>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
