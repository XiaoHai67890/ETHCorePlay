import { Link, useParams } from 'react-router-dom';
import { ModuleTree } from '../components/ModuleTree';
import { SourceCard } from '../components/SourceCard';
import { TrackHero } from '../components/TrackHero';
import { getModulesForTrack, getTrackBySlug, getTrackCompletion, getTrackSources } from '../data/registry';
import { useProgressStore } from '../game/store';

export function TrackPage() {
  const { slug } = useParams();
  const moduleProgress = useProgressStore((state) => state.moduleProgress);
  const track = getTrackBySlug(slug);

  if (!track) {
    return (
      <div className="container registry-shell">
        <article className="card">
          <h1>Track 不存在</h1>
          <p className="subtle">当前只支持 Protocol 101、Cryptography、Lean Ethereum/zkEVM 三条主线。</p>
          <Link className="btn" to="/tracks">返回 Track 列表</Link>
        </article>
      </div>
    );
  }

  const modules = getModulesForTrack(track.slug);
  const sources = getTrackSources(track);
  const progress = getTrackCompletion(track.moduleSlugs, moduleProgress);
  const nextModule = modules.find((module) => !(moduleProgress[module.slug]?.sourceRead && moduleProgress[module.slug]?.checkpointDone && moduleProgress[module.slug]?.outputSubmitted)) || modules[0];

  return (
    <div className="container registry-shell">
      <TrackHero track={track} completed={progress.completed} total={progress.total} percent={progress.percent} />

      <section className="overview-grid">
        <article className="card">
          <div className="section-heading">
            <h2>Track 总览</h2>
            <p className="subtle">{track.overviewZh}</p>
          </div>
          <ul className="clean-list">
            <li>适合人群：{track.audienceZh}</li>
            <li>推荐难度：{track.difficultyLabel}</li>
            <li>贡献出口：{track.contributionExitZh}</li>
          </ul>
          {nextModule ? <Link className="btn" to={`/modules/${nextModule.slug}`}>继续当前推荐模块</Link> : null}
        </article>

        <article className="card">
          <div className="section-heading">
            <h2>先修要求</h2>
            <p className="subtle">先修关系必须显式展示，不能让学习者在内容海里盲走。</p>
          </div>
          <div className="chip-row">
            {track.prerequisitesZh.map((item) => (
              <span key={item} className="chip chip-soft">{item}</span>
            ))}
          </div>
          <div className="divider" />
          <div className="section-heading">
            <h2>产出要求</h2>
            <p className="subtle">模块完成不是“阅读完成”，而是阅读 + checkpoint + 输出。</p>
          </div>
          <ul className="clean-list">
            {track.outputRequirementsZh.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="section-stack">
        <div className="section-heading">
          <h2>模块树</h2>
          <p className="subtle">本页按上游课程结构排序，ETHCorePlay 只补中文导学、执行动作与回流路径。</p>
        </div>
        <ModuleTree modules={modules} moduleProgress={moduleProgress} />
      </section>

      <section className="section-stack">
        <div className="section-heading">
          <h2>上游权威入口</h2>
          <p className="subtle">所有内容都必须能回到上游来源；页面只显示已登记的一级权威源。</p>
        </div>
        <div className="overview-grid">
          {sources.map((source) => (
            <SourceCard key={source.id} source={source} />
          ))}
        </div>
      </section>
    </div>
  );
}
