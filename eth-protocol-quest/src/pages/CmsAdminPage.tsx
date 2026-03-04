import { Link } from 'react-router-dom';
import { useState } from 'react';
import { cloudEnabled } from '../services/cloudSync';
import { cmsRemoteGet, cmsRemoteSet } from '../services/cmsRemote';

export function CmsAdminPage() {
  const [keyName, setKeyName] = useState<'glossary' | 'chapters' | 'assessments'>('glossary');
  const [text, setText] = useState('[]');
  const [msg, setMsg] = useState('');

  const load = async () => {
    const data = await cmsRemoteGet(keyName);
    setText(JSON.stringify(data ?? [], null, 2));
    setMsg(data ? '已从 Supabase 读取' : '未读取到远端数据（可先保存）');
  };

  const save = async () => {
    try {
      const parsed = JSON.parse(text);
      await cmsRemoteSet(keyName, parsed);
      setMsg('已保存到 Supabase CMS');
    } catch (e: any) {
      setMsg(`保存失败：${String(e?.message || e)}`);
    }
  };

  return (
    <main className="container">
      <Link to="/">← 首页</Link>
      <h2>CMS 管理台（轻后台）</h2>
      <section className="card card-hover">
        <p className="subtle">用于在线维护课程/术语/测评 JSON。{!cloudEnabled && '（当前未配置 Supabase）'}</p>
        <div className="filter-row">
          <select value={keyName} onChange={(e) => setKeyName(e.target.value as any)}>
            <option value="glossary">glossary</option>
            <option value="chapters">chapters</option>
            <option value="assessments">assessments</option>
          </select>
          <button className="btn btn-ghost" onClick={load}>读取远端</button>
          <button className="btn" onClick={save}>保存远端</button>
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} style={{ width: '100%', minHeight: 380, marginTop: 8, borderRadius: 10, border: '1px solid var(--border-default)', padding: 10, fontFamily: 'ui-monospace' }} />
        <small className="subtle">{msg}</small>
      </section>
    </main>
  );
}
