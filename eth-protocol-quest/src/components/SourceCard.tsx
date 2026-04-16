import type { SourceRef } from '../data/registry';

type SourceCardProps = {
  source: SourceRef;
};

export function SourceCard({ source }: SourceCardProps) {
  return (
    <article className="card source-card">
      <div className="source-card-head">
        <span className="meta-pill">{source.sourceType.toUpperCase()}</span>
        <span className="meta-pill meta-pill-muted">Authority L{source.authorityLevel}</span>
      </div>
      <h3>{source.sourceTitle}</h3>
      <p className="subtle">{source.noteZh}</p>
      <dl className="source-meta-list">
        <div>
          <dt>来源</dt>
          <dd>{source.provider}</dd>
        </div>
        <div>
          <dt>登记时间</dt>
          <dd>{source.lastCheckedAt}</dd>
        </div>
      </dl>
      <a className="btn btn-ghost" href={source.url} target="_blank" rel="noreferrer">
        查看上游入口
      </a>
    </article>
  );
}
