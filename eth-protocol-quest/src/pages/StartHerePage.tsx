import { Link } from 'react-router-dom';
import { TrackHero } from '../components/TrackHero';
import {
  contributionActions,
  getModuleBySlug,
  getModulesForTrack,
  getTrackCompletion,
  personaRoutes,
  tracks
} from '../data/registry';
import { useProgressStore } from '../game/store';

function isModuleDone(progress?: { sourceRead: boolean; checkpointDone: boolean; outputSubmitted: boolean }) {
  return Boolean(progress?.sourceRead && progress?.checkpointDone && progress?.outputSubmitted);
}

export function StartHerePage() {
  const moduleProgress = useProgressStore((state) => state.moduleProgress);
  const completedModules = Object.entries(moduleProgress)
    .filter(([, progress]) => isModuleDone(progress))
    .map(([slug]) => slug);

  const recommendedTrack = tracks.find((track) => {
    const progress = getTrackCompletion(track.moduleSlugs, moduleProgress);
    return progress.completed < progress.total;
  }) || tracks[0];

  const nextRecommendedModule = getModulesForTrack(recommendedTrack.slug).find((module) => !isModuleDone(moduleProgress[module.slug])) || getModulesForTrack(recommendedTrack.slug)[0];
  const nextTasks = tracks
    .map((track) => getModulesForTrack(track.slug).find((module) => !isModuleDone(moduleProgress[module.slug])))
    .filter((module): module is NonNullable<typeof module> => Boolean(module))
    .slice(0, 3);
  const publicOutputs = Object.entries(moduleProgress)
    .filter(([, progress]) => progress.outputSubmitted && progress.outputLink)
    .map(([slug, progress]) => ({ module: getModuleBySlug(slug), outputLink: progress.outputLink || '' }))
    .filter((item): item is { module: NonNullable<typeof item.module>; outputLink: string } => Boolean(item.module))
    .slice(0, 3);

  return (
    <div className="container registry-shell">
      <section className="card page-hero">
        <p className="eyebrow">ETHCorePlay × EPF Wiki</p>
        <h1>中文编排层 + 学习执行层 + 贡献转化层</h1>
        <p className="page-lead">
          ETHCorePlay 不替代上游内容，只负责把 EPF 的权威课程、wiki 与协作入口组织成可学习、可追踪、可输出、可回流的中文产品。
        </p>
        <div className="chip-row">
          <span className="chip chip-soft">Authority First</span>
          <span className="chip chip-soft">Chinese-friendly</span>
          <span className="chip chip-soft">Execution over content dumping</span>
        </div>
        <div className="hero-action-row">
          <Link className="btn" to={`/tracks/${recommendedTrack.slug}`}>从 {recommendedTrack.titleZh} 开始</Link>
          {nextRecommendedModule ? <Link className="btn btn-ghost" to={`/modules/${nextRecommendedModule.slug}`}>继续当前推荐模块</Link> : null}
        </div>
      </section>

      <section className="section-stack">
        <div className="section-heading">
          <h2>你是谁</h2>
          <p className="subtle">首页只做入口判断，不把你淹没在内容瀑布流里。</p>
        </div>
        <div className="overview-grid">
          {personaRoutes.map((persona) => (
            <Link key={persona.id} className="card persona-card" to={persona.to}>
              <h3>{persona.label}</h3>
              <p className="subtle">{persona.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-stack">
        <div className="section-heading">
          <h2>当前推荐学习轨</h2>
          <p className="subtle">三条 Track 直接映射上游公开主线，而不是先堆文章。</p>
        </div>
        <div className="track-grid">
          {tracks.map((track) => {
            const progress = getTrackCompletion(track.moduleSlugs, moduleProgress);
            return (
              <TrackHero
                key={track.slug}
                track={track}
                completed={progress.completed}
                total={progress.total}
                percent={progress.percent}
              />
            );
          })}
        </div>
      </section>

      <section className="overview-grid">
        <article className="card">
          <div className="section-heading">
            <h2>当前完成度</h2>
            <p className="subtle">模块完成标准：已查看上游入口 + 完成 checkpoint + 提交 1 个输出。</p>
          </div>
          <div className="metric-board">
            <div className="metric-tile">
              <strong>{completedModules.length}</strong>
              <span>已完成模块</span>
            </div>
            <div className="metric-tile">
              <strong>{tracks.length}</strong>
              <span>顶层 Track</span>
            </div>
            <div className="metric-tile">
              <strong>{nextTasks.length}</strong>
              <span>待推进主任务</span>
            </div>
          </div>
        </article>

        <article className="card">
          <div className="section-heading">
            <h2>最近任务与输出</h2>
            <p className="subtle">优先把“下一个动作”讲清楚，再谈更多资源。</p>
          </div>
          <div className="stack-list">
            {nextTasks.map((module) => (
              <Link key={module.slug} className="task-row" to={`/modules/${module.slug}`}>
                <div>
                  <strong>{module.titleZh}</strong>
                  <p className="subtle">{module.oneLinerZh}</p>
                </div>
                <span className="meta-pill">下一步</span>
              </Link>
            ))}
            {!nextTasks.length ? <p className="subtle">当前三条 Track 已全部完成基础模块，可直接进入 Contribution Hub。</p> : null}
          </div>
          <div className="divider" />
          <div className="stack-list">
            {publicOutputs.map((item) => (
              <a key={item.module.slug} className="task-row" href={item.outputLink} target="_blank" rel="noreferrer">
                <div>
                  <strong>{item.module.titleZh}</strong>
                  <p className="subtle">{item.outputLink}</p>
                </div>
                <span className="meta-pill meta-pill-success">已挂载输出</span>
              </a>
            ))}
            {!publicOutputs.length ? <p className="subtle">还没有公开输出。先在模块页挂一条可验证的笔记、图解或分享链接。</p> : null}
          </div>
        </article>
      </section>

      <section className="section-stack">
        <div className="section-heading">
          <h2>贡献转化出口</h2>
          <p className="subtle">终局不是留在站内刷内容，而是回到 specs、client codebases 与协作入口。</p>
        </div>
        <div className="overview-grid">
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
        </div>
      </section>
    </div>
  );
}
