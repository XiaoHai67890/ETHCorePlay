import { Link } from 'react-router-dom';
import { contributionActions, getModulesForTrack, getTrackCompletion, tracks } from '../data/registry';
import { useProgressStore } from '../game/store';

export function ContributionHubPage() {
  const moduleProgress = useProgressStore((state) => state.moduleProgress);

  return (
    <div className="container registry-shell">
      <section className="card page-hero">
        <p className="eyebrow">Contribution Hub</p>
        <h1>从学习执行走向公开输出和协作入口</h1>
        <p className="page-lead">
          ETHCorePlay 的终点不是站内刷内容，而是把学习者送回上游资料、公开输出、client 入口和协作环境。
        </p>
      </section>

      <section className="overview-grid">
        {contributionActions.map((action) => {
          const isInternal = action.href.startsWith('/');
          const content = (
            <>
              <h3>{action.title}</h3>
              <p className="subtle">{action.description}</p>
            </>
          );

          return isInternal ? (
            <Link key={action.title} className="card persona-card" to={action.href}>
              {content}
            </Link>
          ) : (
            <a key={action.title} className="card persona-card" href={action.href} target="_blank" rel="noreferrer">
              {content}
            </a>
          );
        })}
      </section>

      <section className="overview-grid">
        <article className="card">
          <div className="section-heading">
            <h2>公开输出清单</h2>
            <p className="subtle">输出不求大，但必须可验证、可链接、可回看。</p>
          </div>
          <ul className="clean-list">
            <li>200 字摘要</li>
            <li>术语解释卡片</li>
            <li>结构图 / 依赖图</li>
            <li>1 个源码或 spec 入口定位</li>
            <li>1 次公开分享或分享记录</li>
            <li>1 条 wiki / repo 贡献建议</li>
          </ul>
        </article>

        <article className="card">
          <div className="section-heading">
            <h2>EPF 申请相关输出</h2>
            <p className="subtle">学习轨迹只有在能展示成结构化产出时才有申请价值。</p>
          </div>
          <ul className="clean-list">
            <li>结构化学习路径截图或记录</li>
            <li>至少 1 个完成模块的公开输出链接</li>
            <li>术语或节点图谱产出</li>
            <li>下一步准备阅读的 spec / client 入口</li>
          </ul>
        </article>
      </section>

      <section className="section-stack">
        <div className="section-heading">
          <h2>按 Track 继续推进</h2>
          <p className="subtle">Contribution Hub 不是单独漂浮的页面，它必须接回具体 Track。</p>
        </div>
        <div className="overview-grid">
          {tracks.map((track) => {
            const progress = getTrackCompletion(track.moduleSlugs, moduleProgress);
            const nextModule = getModulesForTrack(track.slug).find((module) => !(moduleProgress[module.slug]?.sourceRead && moduleProgress[module.slug]?.checkpointDone && moduleProgress[module.slug]?.outputSubmitted));

            return (
              <article key={track.slug} className="card">
                <h3>{track.titleZh}</h3>
                <p className="subtle">{track.contributionExitZh}</p>
                <p className="subtle">当前完成 {progress.completed} / {progress.total}</p>
                <div className="inline-actions">
                  <Link className="btn btn-ghost" to={`/tracks/${track.slug}`}>查看 Track</Link>
                  {nextModule ? <Link className="btn btn-ghost" to={`/modules/${nextModule.slug}`}>继续下一模块</Link> : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
