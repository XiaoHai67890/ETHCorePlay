import { PlotItem, ZoneKey, zones } from '../data/plotCatalog';

type GardenMapProps = {
  plots: PlotItem[];
  selectedPlotId?: string;
  onSelectPlot?: (plotId: string) => void;
  compact?: boolean;
};

const zoneColor: Record<ZoneKey, string> = {
  execution: '#4a8f61',
  consensus: '#5a76dc',
  tooling: '#2b7f9f',
  security: '#9b5d2e',
  scaling: '#6a5cb8'
};

export function GardenMap({ plots, selectedPlotId, onSelectPlot, compact = false }: GardenMapProps) {
  const zoneOrder = zones.map((z) => z.key);
  const grouped = zoneOrder.map((zoneKey) => ({
    zoneKey,
    items: plots.filter((p) => p.zone === zoneKey)
  }));

  const rowGap = compact ? 62 : 82;
  const rowStart = compact ? 48 : 62;
  const xStart = 110;
  const xGap = compact ? 120 : 136;
  const maxCols = compact ? 5 : 6;

  const points: Array<{ plot: PlotItem; x: number; y: number }> = [];
  const guides: Array<{ zoneKey: ZoneKey; y: number; label: string }> = [];
  let yCursor = rowStart;
  grouped.forEach((group) => {
    const rowsUsed = Math.max(1, Math.ceil(group.items.length / maxCols));
    for (let row = 0; row < rowsUsed; row += 1) {
      const y = yCursor + row * rowGap;
      guides.push({
        zoneKey: group.zoneKey,
        y,
        label: row === 0 ? zones.find((z) => z.key === group.zoneKey)?.title || group.zoneKey : ''
      });
    }
    group.items.forEach((plot, index) => {
      const row = Math.floor(index / maxCols);
      const col = index % maxCols;
      points.push({
        plot,
        x: xStart + col * xGap,
        y: yCursor + row * rowGap
      });
    });
    yCursor += rowsUsed * rowGap + (compact ? 26 : 34);
  });
  const height = Math.max(compact ? 360 : 520, yCursor + 24);

  const pointMap = points.reduce<Record<string, { x: number; y: number; zone: ZoneKey }>>((acc, p) => {
    acc[p.plot.id] = { x: p.x, y: p.y, zone: p.plot.zone };
    return acc;
  }, {});

  const lines = grouped.flatMap((group) => {
    return group.items.slice(1).map((item, idx) => ({
      from: group.items[idx].id,
      to: item.id
    }));
  });

  return (
    <section className="map-stage">
      <svg viewBox={`0 0 920 ${height}`} className="garden-map-svg" role="img" aria-label="Protocol garden map">
        {guides.map((guide, i) => {
          return (
            <g key={`${guide.zoneKey}-${i}`}>
              <line x1="30" y1={guide.y} x2="900" y2={guide.y} stroke="rgba(74,107,86,0.15)" strokeDasharray="6 6" />
              {guide.label ? (
                <text x="34" y={guide.y - 10} fontSize="12" fill="#567562">
                  {guide.label}
                </text>
              ) : null}
            </g>
          );
        })}

        {lines.map((line) => {
          const from = pointMap[line.from];
          const to = pointMap[line.to];
          if (!from || !to) return null;
          return (
            <line
              key={`${line.from}-${line.to}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="rgba(74,107,86,0.25)"
              strokeWidth="2"
            />
          );
        })}

        {points.map(({ plot, x, y }) => {
          const active = selectedPlotId === plot.id;
          return (
            <g
              key={plot.id}
              onClick={() => onSelectPlot?.(plot.id)}
              style={{ cursor: onSelectPlot ? 'pointer' : 'default' }}
            >
              <circle
                cx={x}
                cy={y}
                r={active ? 24 : 20}
                fill={zoneColor[plot.zone]}
                opacity={active ? 0.95 : 0.82}
                stroke={active ? '#1f4f35' : 'rgba(255,255,255,0.9)'}
                strokeWidth={active ? 3 : 2}
              />
              <text x={x} y={y + 40} textAnchor="middle" fontSize="11" fill="#335845">
                Lv{plot.levelId}
              </text>
            </g>
          );
        })}
      </svg>
    </section>
  );
}
