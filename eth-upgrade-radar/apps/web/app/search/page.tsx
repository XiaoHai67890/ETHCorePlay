export const dynamic = 'force-dynamic';

async function search(q: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  return fetch(`${base}/api/search?q=${encodeURIComponent(q)}`, { cache: 'no-store' }).then((r) => r.json()).catch(() => ({ upgrades: [], eips: [], meetings: [], osHits: [] }));
}

export default async function Page({ searchParams }: any) {
  const q = searchParams?.q || '';
  const data = await search(q);

  return (
    <main className="container">
      <h1 className="page-title">Search</h1>
      <form className="card" style={{ marginBottom: 12 }}>
        <input name="q" defaultValue={q} className="search-input" placeholder="EIP / upgrade / meeting / client / devnet" />
      </form>

      <section className="grid grid-2">
        <article className="card">
          <h3>Upgrades ({data.upgrades?.length || 0})</h3>
          <ul className="list">{(data.upgrades || []).map((u: any) => <li key={u.slug}><a href={`/upgrade/${u.slug}`}>{u.name || u.slug}</a> <span className="chip">{u.status}</span></li>)}</ul>
        </article>

        <article className="card">
          <h3>EIPs ({data.eips?.length || 0})</h3>
          <ul className="list">{(data.eips || []).map((e: any) => <li key={e.number}><a href={`/eip/${e.number}`}>EIP-{e.number}</a> · {e.title}</li>)}</ul>
        </article>

        <article className="card">
          <h3>Meetings ({data.meetings?.length || 0})</h3>
          <ul className="list">{(data.meetings || []).map((m: any) => <li key={m.id}><a href={`/meeting/${m.id}`}>{m.title || m.id}</a></li>)}</ul>
        </article>

        <article className="card">
          <h3>OpenSearch Hits ({data.osHits?.length || 0})</h3>
          <ul className="list">{(data.osHits || []).slice(0, 12).map((h: any, i: number) => <li key={i}>{h.title || h.name || h.type || 'untitled'}<div className="sub">{h.summary || h.sourceRef || ''}</div></li>)}</ul>
        </article>
      </section>
    </main>
  );
}
