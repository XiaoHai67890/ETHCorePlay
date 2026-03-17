import { KV } from '../../components';

async function getMeeting(id: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  return fetch(`${base}/api/meetings/${id}`, { cache: 'no-store' }).then((r) => r.json()).catch(() => null);
}

export default async function Page({ params }: any) {
  const meeting = await getMeeting(params.id);
  return (
    <main className="container">
      <h1 className="page-title">Meeting Detail · {params.id}</h1>
      {!meeting && <p className="sub">Meeting not found.</p>}
      {meeting && (
        <section className="card">
          <h3>{meeting.title || 'Untitled meeting'}</h3>
          <KV k="Series" v={meeting.series} />
          <KV k="When" v={meeting.meetingAt ? new Date(meeting.meetingAt).toLocaleString() : 'TBD'} />
          <p className="sub">后续会补 Agenda / Notes / Decisions / Action Items 的实体化展示。</p>
        </section>
      )}
    </main>
  );
}
