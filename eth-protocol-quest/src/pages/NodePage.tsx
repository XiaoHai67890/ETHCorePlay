import { Link, useParams } from 'react-router-dom';
import { SourceCard } from '../components/SourceCard';
import {
  getKnowledgeNodeBySlug,
  getModuleBySlug,
  getNodeSources
} from '../data/registry';

export function NodePage() {
  const { slug } = useParams();
  const node = getKnowledgeNodeBySlug(slug);

  if (!node) {
    return (
      <div className="container registry-shell">
        <article className="card">
          <h1>Knowledge Node 不存在</h1>
          <p className="subtle">请从已登记的模块或 Track 页面进入节点。</p>
          <Link className="btn" to="/tracks">返回 Track 列表</Link>
        </article>
      </div>
    );
  }

  const modules = node.moduleSlugs
    .map((moduleSlug) => getModuleBySlug(moduleSlug))
    .filter((module): module is NonNullable<typeof module> => Boolean(module));
  const prerequisiteModules = node.prerequisiteSlugs
    .map((moduleSlug) => getModuleBySlug(moduleSlug))
    .filter((module): module is NonNullable<typeof module> => Boolean(module));
  const nextModules = node.nextRecommended
    .map((moduleSlug) => getModuleBySlug(moduleSlug))
    .filter((module): module is NonNullable<typeof module> => Boolean(module));
  const sources = getNodeSources(node);

  return (
    <div className="container registry-shell">
      <section className="card page-hero">
        <p className="eyebrow">{node.titleEn}</p>
        <h1>{node.titleZh}</h1>
        <p className="page-lead">{node.summaryZh}</p>
        <div className="chip-row">
          <span className="meta-pill">{node.track}</span>
          {node.glossaryTerms.map((term) => (
            <span key={term} className="chip chip-soft">{term}</span>
          ))}
        </div>
      </section>

      <section className="overview-grid">
        <article className="card">
          <div className="section-heading">
            <h2>它属于哪个模块</h2>
            <p className="subtle">搜索结果不只返回单页，而要告诉学习者它在哪条主线、哪个模块里。</p>
          </div>
          <div className="stack-list">
            {modules.map((module) => (
              <Link key={module.slug} className="task-row" to={`/modules/${module.slug}`}>
                <div>
                  <strong>{module.titleZh}</strong>
                  <p className="subtle">{module.oneLinerZh}</p>
                </div>
                <span className="meta-pill">所属模块</span>
              </Link>
            ))}
          </div>
        </article>

        <article className="card">
          <div className="section-heading">
            <h2>前置与下一步</h2>
            <p className="subtle">节点页要把依赖关系和推荐下一步讲清楚。</p>
          </div>
          <div className="stack-list">
            {prerequisiteModules.map((module) => (
              <Link key={module.slug} className="task-row" to={`/modules/${module.slug}`}>
                <div>
                  <strong>{module.titleZh}</strong>
                  <p className="subtle">前置模块</p>
                </div>
                <span className="meta-pill meta-pill-muted">前置</span>
              </Link>
            ))}
            {nextModules.map((module) => (
              <Link key={module.slug} className="task-row" to={`/modules/${module.slug}`}>
                <div>
                  <strong>{module.titleZh}</strong>
                  <p className="subtle">推荐继续推进</p>
                </div>
                <span className="meta-pill">下一步</span>
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="overview-grid">
        <article className="card">
          <div className="section-heading">
            <h2>相关规范方向</h2>
            <p className="subtle">这里只做方向提示，不在站内重写原始规范。</p>
          </div>
          <ul className="clean-list">
            {node.relatedSpecZh.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="card">
          <div className="section-heading">
            <h2>关联客户端 / 工具</h2>
            <p className="subtle">帮助学习者把节点理解回流到真实实现和工具入口。</p>
          </div>
          <ul className="clean-list">
            {node.relatedClientZh.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="section-stack">
        <div className="section-heading">
          <h2>上游权威入口</h2>
          <p className="subtle">节点级页面同样只能引用已登记的一级权威源。</p>
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
