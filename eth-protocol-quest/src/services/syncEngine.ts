import { pullState, pushState, getUser, cloudEnabled } from './cloudSync';

const SYNC_META_KEY = 'epq_sync_meta_v1';
const QUEUE_KEY = 'epq_sync_queue_v1';

type Meta = { lastPushedAt?: number; lastPulledAt?: number; lastHash?: string; retries?: number };

type QueueItem = { ts: number; payload: any };

function hash(obj: any) {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).slice(0, 64);
  } catch {
    return String(Date.now());
  }
}

function getMeta(): Meta {
  try { return JSON.parse(localStorage.getItem(SYNC_META_KEY) || '{}'); } catch { return {}; }
}
function setMeta(m: Meta) { localStorage.setItem(SYNC_META_KEY, JSON.stringify(m)); }

function getQueue(): QueueItem[] {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); } catch { return []; }
}
function setQueue(q: QueueItem[]) { localStorage.setItem(QUEUE_KEY, JSON.stringify(q.slice(-20))); }

function enqueue(payload: any) {
  const q = getQueue();
  q.push({ ts: Date.now(), payload });
  setQueue(q);
}

export async function syncPullMerge(currentState: any) {
  if (!cloudEnabled) return currentState;
  const user = await getUser();
  if (!user) return currentState;
  const remote = await pullState<any>().catch(() => null);
  if (!remote) return currentState;

  // optimistic merge policy: pick newest for major maps by updated timestamp fallback
  const merged = {
    ...currentState,
    ...remote,
    chapterResults: { ...(currentState.chapterResults || {}), ...(remote.chapterResults || {}) },
    studyMinutes: { ...(currentState.studyMinutes || {}), ...(remote.studyMinutes || {}) },
    curriculumDone: { ...(currentState.curriculumDone || {}), ...(remote.curriculumDone || {}) },
    curriculumChecklist: { ...(currentState.curriculumChecklist || {}), ...(remote.curriculumChecklist || {}) },
    curriculumExpanded: { ...(currentState.curriculumExpanded || {}), ...(remote.curriculumExpanded || {}) },
    onboardingTasks: { ...(currentState.onboardingTasks || {}), ...(remote.onboardingTasks || {}) }
  };

  const m = getMeta();
  m.lastPulledAt = Date.now();
  setMeta(m);
  return merged;
}

export async function syncPushRobust(payload: any) {
  if (!cloudEnabled) return { ok: false, reason: 'cloud-disabled' as const };
  const user = await getUser();
  if (!user) return { ok: false, reason: 'no-user' as const };

  const m = getMeta();
  const h = hash(payload);
  if (m.lastHash === h) return { ok: true, dedup: true };

  try {
    await pushState(payload);
    m.lastHash = h;
    m.lastPushedAt = Date.now();
    m.retries = 0;
    setMeta(m);

    // flush queue when success
    const q = getQueue();
    if (q.length) {
      for (const item of q) {
        await pushState(item.payload);
      }
      setQueue([]);
    }
    return { ok: true };
  } catch (e) {
    enqueue(payload);
    m.retries = (m.retries || 0) + 1;
    setMeta(m);
    return { ok: false, reason: String((e as any)?.message || e) };
  }
}

export function getSyncDiagnostics() {
  const m = getMeta();
  const q = getQueue();
  return { ...m, queue: q.length };
}
