const KEY = 'epq_telemetry_v1';

type Metrics = {
  chapterCompletion: Record<string, number>;
  retryImprovement: number[];
  recClicks: number;
  searchMiss: Record<string, number>;
};

function read(): Metrics {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {} as Metrics;
  }
}

function write(v: Metrics) {
  localStorage.setItem(KEY, JSON.stringify(v));
}

export function metricChapterComplete(chapterId: string) {
  const m = read();
  m.chapterCompletion = m.chapterCompletion || {};
  m.chapterCompletion[chapterId] = (m.chapterCompletion[chapterId] || 0) + 1;
  write(m);
}

export function metricRetryImprovement(delta: number) {
  const m = read();
  m.retryImprovement = m.retryImprovement || [];
  m.retryImprovement.push(delta);
  m.retryImprovement = m.retryImprovement.slice(-100);
  write(m);
}

export function metricRecClick() {
  const m = read();
  m.recClicks = (m.recClicks || 0) + 1;
  write(m);
}

export function metricSearchMiss(term: string) {
  const t = term.trim().toLowerCase();
  if (!t) return;
  const m = read();
  m.searchMiss = m.searchMiss || {};
  m.searchMiss[t] = (m.searchMiss[t] || 0) + 1;
  write(m);
}

export function telemetrySnapshot(): Metrics {
  const m = read();
  return {
    chapterCompletion: m.chapterCompletion || {},
    retryImprovement: m.retryImprovement || [],
    recClicks: m.recClicks || 0,
    searchMiss: m.searchMiss || {}
  };
}
