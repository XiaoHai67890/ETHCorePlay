import { Sprout, Leaf, TreePine } from 'lucide-react';

interface LearningPathNodeProps {
  path: {
    id: string;
    title: string;
    audience: string;
    milestones: string[];
  };
  index: number;
  progress: number;
  total: number;
}

export function LearningPathNode({ path, index, progress, total }: LearningPathNodeProps) {
  const isCompleted = progress >= total;

  const getPathIcon = (idx: number) => {
    if (idx === 0) return <Sprout size={24} />;
    if (idx === 1) return <Leaf size={24} />;
    return <TreePine size={24} />;
  };

  return (
    <div className="garden-node">
      <div className="garden-icon" style={{ background: isCompleted ? '#daf4df' : '#fff' }}>
        {getPathIcon(index)}
      </div>
      <div className="garden-card-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <strong style={{ fontSize: '1.2rem', color: 'var(--primary-hover)', display: 'block' }}>{path.title}</strong>
            <small style={{ color: 'var(--text-muted)' }}>{path.audience}</small>
          </div>
          <div className={`badge ${isCompleted ? 'badge-success' : 'badge-neutral'}`}>
            {progress} / {total} 章节
          </div>
        </div>
        <ul style={{ marginTop: '12px', marginBottom: 0 }}>
          {path.milestones.map((m) => (
            <li key={m} style={{ fontSize: '0.9rem' }}>{m}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
