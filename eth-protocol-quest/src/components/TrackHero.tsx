import { Link } from 'react-router-dom';
import type { TrackRecord } from '../data/registry';

type TrackHeroProps = {
  track: TrackRecord;
  completed: number;
  total: number;
  percent: number;
};

export function TrackHero({ track, completed, total, percent }: TrackHeroProps) {
  return (
    <section className="card track-hero">
      <div className="track-hero-head">
        <div>
          <p className="eyebrow">{track.titleEn}</p>
          <h2>{track.titleZh}</h2>
        </div>
        <span className="meta-pill">{track.difficultyLabel}</span>
      </div>
      <p className="track-lead">{track.oneLinerZh}</p>
      <p className="subtle">{track.overviewZh}</p>

      <div className="progress-meter" aria-label={`${track.titleZh} progress`}>
        <span className="progress-meter-fill" style={{ width: `${percent}%` }} />
      </div>
      <p className="track-progress-label">已完成 {completed} / {total} 个模块</p>

      <div className="chip-row">
        {track.prerequisitesZh.map((item) => (
          <span key={item} className="chip chip-soft">{item}</span>
        ))}
      </div>

      <div className="track-hero-actions">
        <Link className="btn" to={`/tracks/${track.slug}`}>进入 Track</Link>
        <Link className="btn btn-ghost" to={`/modules/${track.moduleSlugs[0]}`}>从第一个模块开始</Link>
      </div>
    </section>
  );
}
