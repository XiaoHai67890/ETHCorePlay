import { Link } from 'react-router-dom';
import { levels } from '../data/levels';
import { useProgressStore } from '../game/store';
import { Lock, CheckCircle, Play } from 'lucide-react';

export function WorldMap() {
  const { unlockedLevel, completed } = useProgressStore();

  return (
    <section className="card">
      <h2>协议大陆地图</h2>
      <div className="grid">
        {levels.map((l) => {
          const locked = l.id > unlockedLevel;
          const isCompleted = completed[l.id];
          return (
            <Link key={l.id} to={`/level/${l.id}`} className={`level ${locked ? 'locked' : ''}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Lv{l.id}</strong>
                {locked ? <Lock size={18} className="opacity-50" /> : isCompleted ? <CheckCircle size={18} color="#4a8f61" /> : <Play size={18} color="#5a76dc" />}
              </div>
              <span>{l.title}</span>
              <small>{isCompleted ? '已通关' : locked ? '未解锁' : '可挑战'}</small>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
