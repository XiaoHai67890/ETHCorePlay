import { cmsRemoteGet } from './cmsRemote';

export async function loadCmsJson<T>(name: string, fallback: T): Promise<T> {
  try {
    const remote = await cmsRemoteGet(name as any);
    if (remote) return remote as T;
    const res = await fetch(`/cms/${name}.json`, { cache: 'no-store' });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}
