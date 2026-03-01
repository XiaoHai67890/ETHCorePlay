import { Link } from 'react-router-dom';
import { foundationChapters } from '../data/curriculum/foundations';

export function CurriculumPage() {
  return (
    <main className="container">
      <Link to="/">← 首页</Link>
      <h2>系统化学习课程（基础→进阶）</h2>
      <p>本页以“学习优先”为目标，闯关仅作为检验，不替代系统学习。</p>

      {foundationChapters.map((chapter, idx) => (
        <section key={chapter.id} className="card">
          <h3>{idx + 1}. {chapter.title}</h3>
          <p><strong>学习目标：</strong>{chapter.objective}</p>
          <p><strong>难度：</strong>{chapter.level}</p>

          {chapter.sections.map((sec) => (
            <div key={sec.heading} style={{ marginTop: 10 }}>
              <strong>{sec.heading}</strong>
              <ul>
                {sec.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          ))}

          <div style={{ marginTop: 10 }}>
            <strong>常见误区</strong>
            <ul>
              {chapter.pitfalls.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>

          <div style={{ marginTop: 10 }}>
            <strong>术语清单</strong>
            <div>{chapter.glossary.join(' · ')}</div>
          </div>

          <div style={{ marginTop: 10 }}>
            <strong>实战练习步骤</strong>
            {chapter.practice.map((task) => (
              <div key={task.title} style={{ marginTop: 6 }}>
                <em>{task.title}</em>
                <ol>
                  {task.steps.map((s) => <li key={s}>{s}</li>)}
                </ol>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
