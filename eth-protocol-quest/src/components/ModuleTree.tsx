import { Link } from 'react-router-dom';
import { getModuleDependencies, type ModuleRecord } from '../data/registry';

type ModuleTreeProps = {
  modules: ModuleRecord[];
  moduleProgress: Record<string, { sourceRead: boolean; checkpointDone: boolean; outputSubmitted: boolean }>;
};

function isModuleDone(progress?: { sourceRead: boolean; checkpointDone: boolean; outputSubmitted: boolean }) {
  return Boolean(progress?.sourceRead && progress?.checkpointDone && progress?.outputSubmitted);
}

export function ModuleTree({ modules, moduleProgress }: ModuleTreeProps) {
  const completed = new Set(
    Object.entries(moduleProgress)
      .filter(([, progress]) => isModuleDone(progress))
      .map(([slug]) => slug)
  );

  return (
    <div className="module-tree">
      {modules.map((module, index) => {
        const dependencies = getModuleDependencies(module);
        const locked = dependencies.some((dependency) => !completed.has(dependency.slug));
        const done = completed.has(module.slug);

        return (
          <article key={module.slug} className={`card module-tree-item ${locked ? 'module-tree-item-locked' : ''}`}>
            <div className="module-tree-order">{index + 1}</div>
            <div className="module-tree-body">
              <div className="module-tree-head">
                <div>
                  <p className="eyebrow">{module.titleEn}</p>
                  <h3>{module.titleZh}</h3>
                </div>
                <span className={`meta-pill ${done ? 'meta-pill-success' : locked ? 'meta-pill-muted' : ''}`}>
                  {done ? '已完成' : locked ? '待前置' : '可开始'}
                </span>
              </div>
              <p className="subtle">{module.oneLinerZh}</p>
              {dependencies.length > 0 ? (
                <div className="chip-row">
                  {dependencies.map((dependency) => (
                    <Link key={dependency.slug} to={`/modules/${dependency.slug}`} className="chip chip-link">
                      前置：{dependency.titleZh}
                    </Link>
                  ))}
                </div>
              ) : null}
              <div className="module-tree-actions">
                <Link className="btn btn-ghost" to={`/modules/${module.slug}`}>查看模块</Link>
                {module.legacyChapterId ? (
                  <Link className="btn btn-ghost" to={`/curriculum#${module.legacyChapterId}`}>查看现有站内章节</Link>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
