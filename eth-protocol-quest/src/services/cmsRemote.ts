import { supabase } from './cloudSync';

export async function cmsRemoteGet(key: 'glossary' | 'chapters' | 'assessments') {
  if (!supabase) return null;
  const { data, error } = await supabase.from('cms_content').select('payload').eq('key', key).single();
  if (error) return null;
  return data?.payload ?? null;
}

export async function cmsRemoteSet(key: 'glossary' | 'chapters' | 'assessments', payload: unknown) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('cms_content').upsert({ key, payload, updated_at: new Date().toISOString() });
  if (error) throw error;
}
