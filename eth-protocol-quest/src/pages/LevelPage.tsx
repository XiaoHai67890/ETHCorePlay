import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { levels } from '../data/levels';
import { useProgressStore } from '../game/store';
import { ArrowLeft, CheckCircle, XCircle, PartyPopper, AlertCircle } from 'lucide-react';

export function LevelPage() {
  const { id } = useParams();
  const levelId = Number(id);
  const level = useMemo(() => levels.find((l) => l.id === levelId), [levelId]);
  const { unlockedLevel, completeLevel, completed, addWrongQuestion } = useProgressStore();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!level) return <main className="container"><p>关卡不存在。</p></main>;
  if (level.id > unlockedLevel) return <main className="container"><p>该关卡尚未解锁。</p></main>;

  const score = level.quiz.reduce((acc, q) => acc + (answers[q.id] === q.answerIndex ? 1 : 0), 0);
  const pass = score >= Math.ceil(level.quiz.length * 0.7);

  const onSubmit = () => {
    setSubmitted(true);
    level.quiz.forEach((q) => {
      if (answers[q.id] !== q.answerIndex) {
        addWrongQuestion({
          levelId: level.id,
          questionId: q.id,
          prompt: q.prompt,
          explanation: q.explanation,
          ts: Date.now()
        });
      }
    });
    if (pass && !completed[level.id]) completeLevel(level.id, 100);
  };

  return (
    <main className="container">
      <Link to="/map" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <ArrowLeft size={16} /> 返回地图
      </Link>
      <h2>{level.title}</h2>
      <p>{level.story}</p>
      <div className="card">
        <h3>知识卡</h3>
        <ul>{level.knowledgeCards.map((k) => <li key={k}>{k}</li>)}</ul>
      </div>

      <div className="card">
        <h3>测验</h3>
        {level.quiz.map((q) => (
          <div key={q.id} className="quiz-item">
            <p><strong>{q.prompt}</strong></p>
            {q.options.map((opt, i) => (
              <label key={opt} className="option">
                <input
                  type="radio"
                  name={q.id}
                  checked={answers[q.id] === i}
                  onChange={() => setAnswers((s) => ({ ...s, [q.id]: i }))}
                />
                {opt}
              </label>
            ))}
            {submitted && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '8px', padding: '8px 12px', background: answers[q.id] === q.answerIndex ? '#daf4df' : '#fef3c7', borderRadius: '8px' }}>
                {answers[q.id] === q.answerIndex ? (
                  <><CheckCircle size={16} color="#2f6b47" style={{ flexShrink: 0, marginTop: '2px' }} /> <span style={{ color: '#1f4f35', fontSize: '0.9rem' }}>正确</span></>
                ) : (
                  <><XCircle size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} /> <span style={{ color: '#92400e', fontSize: '0.9rem' }}>{q.explanation}</span></>
                )}
              </div>
            )}
          </div>
        ))}

        <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button className="btn" onClick={onSubmit}>提交关卡</button>
          {submitted && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: pass ? '#daf4df' : '#fef3c7', borderRadius: '999px', fontWeight: 500, color: pass ? '#1f4f35' : '#92400e' }}>
              {pass ? <PartyPopper size={18} /> : <AlertCircle size={18} />}
              得分：{score}/{level.quiz.length} {pass ? '通关' : '未达标（70%）'}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3>Boss 挑战</h3>
        <p>{level.bossChallenge}</p>
      </div>
    </main>
  );
}
