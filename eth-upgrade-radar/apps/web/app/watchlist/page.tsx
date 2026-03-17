export const dynamic = 'force-dynamic';

async function getSubs() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  return fetch(`${base}/api/subscriptions`, { cache: 'no-store' }).then((r) => r.json()).catch(() => []);
}

export default async function Page() {
  const subs = await getSubs();
  return (
    <main className="container">
      <h1 className="page-title">Watchlist / Alerts</h1>

      <section className="card" style={{ marginBottom: 12 }}>
        <h3>Quick Subscribe (API Payload)</h3>
        <p className="sub">当前页面先提供可复制的创建格式，下一轮我会加可直接提交的表单。</p>
        <pre>{`POST /api/subscriptions\n{\n  "channel": "telegram|discord|webhook|email|rss",\n  "target": "<chat_id|webhook_url|email>",\n  "filter": { "entityType": "upgrade", "entityId": "fusaka" }\n}`}</pre>
      </section>

      <section className="card">
        <h3>Subscriptions ({subs.length || 0})</h3>
        <ul className="list">
          {(subs || []).map((s: any) => (
            <li key={s.id}>
              <b>{s.channel}</b> · {s.target}
              <div className="sub">filter: {JSON.stringify(s.filter || {})}</div>
            </li>
          ))}
        </ul>
        <p className="sub">RSS feed: <code>/api/subscriptions/rss.xml</code></p>
      </section>
    </main>
  );
}
