import { Link } from 'react-router-dom';
import { MapRenderer } from '../components/map/MapRenderer';

export function MapPage() {
  return (
    <main className="container">
      <Link to="/">← 首页</Link>
      <h2>Garden Map</h2>
      <p className="subtle">知识节点、关系路径与学习叙事入口。</p>
      <MapRenderer mode="svg" />
    </main>
  );
}
