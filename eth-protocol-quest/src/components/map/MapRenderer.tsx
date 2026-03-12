import { SVGRenderer } from './SVGRenderer';

export function MapRenderer({ mode='svg' }: { mode?: 'svg' | 'canvas' }) {
  if (mode === 'canvas') {
    return <div className="card">CanvasRenderer 预留（Sprint 3）</div>;
  }
  return <SVGRenderer />;
}
