import { Link } from 'react-router-dom';

export type PlotCardProps = {
  id: string;
  title: string;
  summary?: string;
  zone: 'Consensus' | 'Execution' | 'Networking' | 'Scaling' | 'Security' | 'Tooling';
  difficulty: 1 | 2 | 3 | 4 | 5;
  timeMins?: number;
  tags?: string[];
  prereqs?: { id: string; title: string }[];
  status?: 'new' | 'learning' | 'bloomed';
  progress?: number;
  onOpen?: (id: string) => void;
  onBookmark?: (id: string) => void;
};

export function PlotCard(props: PlotCardProps) {
  const { id, title, summary, zone, difficulty, timeMins, tags = [], prereqs = [], status = 'new', progress = 0, onOpen, onBookmark } = props;
  const statusText = status === 'new' ? 'Not started' : status === 'learning' ? 'In progress' : 'Bloomed';

  return (
    <article className="card card-hover plot-card">
      <div className="card-title-row">
        <strong>{title}</strong>
        <span className="meta-pill">{statusText}</span>
      </div>
      <div className="stat-chips">
        <span className="stat-chip">{zone}</span>
        <span className="stat-chip">难度 {difficulty}/5</span>
        {timeMins ? <span className="stat-chip">约 {timeMins} 分钟</span> : null}
      </div>
      {summary ? <p className="subtle" style={{ margin: '6px 0 8px' }}>{summary}</p> : null}
      {tags.length > 0 && <div className="chips">{tags.slice(0, 4).map((t) => <span className="chip" key={t}>{t}</span>)}{tags.length > 4 ? <span className="chip">+{tags.length - 4}</span> : null}</div>}
      {prereqs.length > 0 && <small style={{ display: 'block', marginTop: 8 }}>先修：{prereqs.slice(0, 2).map((p) => p.title).join(' / ')}</small>}
      <div style={{ marginTop: 10 }}><div className="progress-rail"><div className="progress-fill" style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%` }} /></div></div>
      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        <Link to={`/plot/${id}`} className="btn" onClick={() => onOpen?.(id)}>Continue</Link>
        <button className="btn btn-ghost" onClick={() => onBookmark?.(id)}>Bookmark</button>
      </div>
    </article>
  );
}
