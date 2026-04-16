import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SourceCard } from '../components/SourceCard';
import {
  getKnowledgeNodeBySlug,
  getModuleBySlug,
  getModuleDependencies,
  getModuleSources,
  getNextModules
} from '../data/registry';
import { useProgressStore } from '../game/store';

export function ModulePage() {
  const { slug } = useParams();
  const module = getModuleBySlug(slug);
  const moduleProgress = useProgressStore((state) => (module ? state.moduleProgress[module.slug] : undefined));
  const setModuleSourceRead = useProgressStore((state) => state.setModuleSourceRead);
  const setModuleCheckpointDone = useProgressStore((state) => state.setModuleCheckpointDone);
  const setModuleOutput = useProgressStore((state) => state.setModuleOutput);
  const [outputLink, setOutputLink] = useState(moduleProgress?.outputLink || '');

  useEffect(() => {
    setOutputLink(moduleProgress?.outputLink || '');
  }, [moduleProgress?.outputLink]);

  if (!module) {
    return (
      <div className="container registry-shell">
        <article className="card">
          <h1>Module 不存在</h1>
          <p className="subtle">请从 Track 页面重新进入已登记的模块。</p>
          <Link className="btn" to="/tracks">返回 Track 列表</Link>
        </article>
      </div>
    );
  }

  const sources = getModuleSources(module);
  const dependencies = getModuleDependencies(module);
  const nextModules = getNextModules(module);
  const nodes = module.nodeSlugs
    .map((nodeSlug) => getKnowledgeNodeBySlug(nodeSlug))
    .filter((node): node is NonNullable<typeof node> => Boolean(node));
  const isCompleted = Boolean(moduleProgress?.sourceRead && moduleProgress?.checkpointDone && moduleProgress?.outputSubmitted);

  return (
    <div className="container registry-shell">
      <section className="card page-hero">
        <p className="eyebrow">{module.titleEn}</p>
        <h1>{module.titleZh}</h1>
        <p className="page-lead">{module.oneLinerZh}</p>
        <div className="chip-row">
          <span className={`meta-pill ${isCompleted ? 'meta-pill-success' : ''}`}>{isCompleted ? '模块已完成' : '模块进行中'}</span>
          <span className="meta-pill meta-pill-muted">{module.track}</span>
        </div>
      </section>

      <section className="overview-grid">
        <article className="card">
          <div className="section-heading">
            <h2>模块说明</h2>
            <p className="subtle">{module.solvesZh}</p>
          </div>
          <ul className="clean-list">
            {module.summaryZh.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {module.legacyChapterId ? (
            <div className="inline-actions">
              <Link className="btn btn-ghost" to={`/curriculum#${module.legacyChapterId}`}>查看现有站内章节基础</Link>
            </div>
          ) : null}
        </article>

        <article className="card">
          <div className="section-heading">
            <h2>执行状态</h2>
            <p className="subtle">模块完成定义已经固定，不允许用“只读过”冒充完成。</p>
          </div>
          <div className="execution-checklist">
            <button
              className={`check-card ${moduleProgress?.sourceRead ? 'check-card-done' : ''}`}
              onClick={() => setModuleSourceRead(module.slug, !moduleProgress?.sourceRead)}
            >
              <strong>1. 已查看上游入口</strong>
              <span>确认已经回到原课程 / wiki / repo 入口。</span>
            </button>
            <button
              className={`check-card ${moduleProgress?.checkpointDone ? 'check-card-done' : ''}`}
              onClick={() => setModuleCheckpointDone(module.slug, !moduleProgress?.checkpointDone)}
            >
              <strong>2. 已完成 checkpoint</strong>
              <span>不是看过，而是能够复述与解释。</span>
            </button>
            <div className={`check-card ${moduleProgress?.outputSubmitted ? 'check-card-done' : ''}`}>
              <strong>3. 已提交 1 个输出</strong>
              <span>挂载公开链接或备注，再标记已提交。</span>
              <input
                className="field-input"
                type="text"
                value={outputLink}
                onChange={(event) => setOutputLink(event.target.value)}
                placeholder="https://... 或公开输出说明"
              />
              <div className="inline-actions">
                <button className="btn btn-ghost" onClick={() => setModuleOutput(module.slug, Boolean(outputLink.trim()), outputLink.trim())}>
                  保存输出记录
                </button>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="overview-grid">
        <article className="card">
          <div className="section-heading">
            <h2>前置依赖</h2>
            <p className="subtle">如果前置没有打通，模块页必须把依赖说清楚，而不是让用户自己猜。</p>
          </div>
          {dependencies.length ? (
            <div className="chip-row">
              {dependencies.map((dependency) => (
                <Link key={dependency.slug} className="chip chip-link" to={`/modules/${dependency.slug}`}>
                  {dependency.titleZh}
                </Link>
              ))}
            </div>
          ) : (
            <p className="subtle">这个模块可以直接开始。</p>
          )}
        </article>

        <article className="card">
          <div className="section-heading">
            <h2>术语与误区</h2>
            <p className="subtle">ETHCorePlay 负责补中文术语与误区提示，不重写上游正文。</p>
          </div>
          <div className="chip-row">
            {module.glossaryTerms.map((term) => (
              <span key={term} className="chip chip-soft">{term}</span>
            ))}
          </div>
          <ul className="clean-list">
            {module.commonPitfallsZh.map((pitfall) => (
              <li key={pitfall}>{pitfall}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="overview-grid">
        <article className="card">
          <div className="section-heading">
            <h2>Checkpoint</h2>
            <p className="subtle">请先能说清楚，再往下走。</p>
          </div>
          <p className="module-prompt">{module.checkpointZh}</p>
        </article>

        <article className="card">
          <div className="section-heading">
            <h2>输出任务</h2>
            <p className="subtle">每个模块至少要沉淀 1 个可验证输出。</p>
          </div>
          <p className="module-prompt">{module.outputTaskZh}</p>
        </article>
      </section>

      <section className="section-stack">
        <div className="section-heading">
          <h2>上游权威入口</h2>
          <p className="subtle">模块页只负责导学和执行，不负责替代原始内容。</p>
        </div>
        <div className="overview-grid">
          {sources.map((source) => (
            <SourceCard key={source.id} source={source} />
          ))}
        </div>
      </section>

      {nodes.length ? (
        <section className="section-stack">
          <div className="section-heading">
            <h2>相关 Knowledge Nodes</h2>
            <p className="subtle">节点页负责展示细粒度对象，不重复造长正文。</p>
          </div>
          <div className="overview-grid">
            {nodes.map((node) => (
              <Link key={node.slug} className="card persona-card" to={`/nodes/${node.slug}`}>
                <h3>{node.titleZh}</h3>
                <p className="subtle">{node.summaryZh}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {nextModules.length ? (
        <section className="section-stack">
          <div className="section-heading">
            <h2>下一模块</h2>
            <p className="subtle">模块顺序按 Track 编排，不做模糊推荐。</p>
          </div>
          <div className="overview-grid">
            {nextModules.map((nextModule) => (
              <Link key={nextModule.slug} className="card persona-card" to={`/modules/${nextModule.slug}`}>
                <h3>{nextModule.titleZh}</h3>
                <p className="subtle">{nextModule.oneLinerZh}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
