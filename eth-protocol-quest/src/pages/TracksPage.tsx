import { TrackHero } from '../components/TrackHero';
import { SourceCard } from '../components/SourceCard';
import { getTrackCompletion, getTrackSources, tracks } from '../data/registry';
import { useProgressStore } from '../game/store';

export function TracksPage() {
  const moduleProgress = useProgressStore((state) => state.moduleProgress);

  return (
    <div className="container registry-shell">
      <section className="card page-hero">
        <p className="eyebrow">Track Registry</p>
        <h1>三条公开主线，三套中文执行入口</h1>
        <p className="page-lead">
          ETHCorePlay 当前冻结范围只做三条主线的结构化映射：Protocol 101、Cryptography、Lean Ethereum/zkEVM。所有 Track 都必须回到 study.epf.wiki、epf.wiki 和 protocol-studies。
        </p>
      </section>

      <section className="track-grid">
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
      </section>

      <section className="overview-grid">
        <article className="card">
          <div className="section-heading">
            <h2>整合原则</h2>
            <p className="subtle">同步的是结构与索引，不是整站镜像，也不是站内再造一套真源。</p>
          </div>
          <ul className="clean-list">
            <li>权威优先：所有模块都必须能回到上游原始来源。</li>
            <li>中文友好：优先提供中文导学、术语、误区与输出任务。</li>
            <li>结构优先：先映射课程结构，再补模块树和知识节点。</li>
            <li>回流优先：让学习者从“看资料”走向“做输出、做贡献”。</li>
          </ul>
        </article>

        <article className="card">
          <div className="section-heading">
            <h2>当前交付范围</h2>
            <p className="subtle">本轮实现严格限制在 Phase 1，不做全文镜像、不改技术栈、不发散产品边界。</p>
          </div>
          <ul className="clean-list">
            <li>首页 / Start Here</li>
            <li>Track 页</li>
            <li>Module 页</li>
            <li>Knowledge Node 页</li>
            <li>Contribution Hub</li>
            <li>基础模块执行状态</li>
          </ul>
        </article>
      </section>

      <section className="section-stack">
        <div className="section-heading">
          <h2>一级权威源</h2>
          <p className="subtle">这里只展示你文档里定义的一级权威源，不引入新的主内容来源。</p>
        </div>
        <div className="overview-grid">
          {getTrackSources(tracks[0]).map((source) => (
            <SourceCard key={source.id} source={source} />
          ))}
        </div>
      </section>
    </div>
  );
}
