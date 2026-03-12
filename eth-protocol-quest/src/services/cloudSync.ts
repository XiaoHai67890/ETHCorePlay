import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const cloudEnabled = Boolean(url && anon);
export const supabase = cloudEnabled ? createClient(url!, anon!) : null;

export async function signInWithOtp(email: string) {
  if (!supabase) throw new Error('Cloud sync is not configured');
  return supabase.auth.signInWithOtp({ email });
}

export async function getUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function pushState(payload: unknown) {
  if (!supabase) throw new Error('Cloud sync is not configured');
  const user = await getUser();
  if (!user) throw new Error('Please login first');
  const { error } = await supabase.from('user_sync').upsert({ user_id: user.id, payload, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export async function pullState<T = any>(): Promise<T | null> {
  if (!supabase) throw new Error('Cloud sync is not configured');
  const user = await getUser();
  if (!user) throw new Error('Please login first');
  const { data, error } = await supabase.from('user_sync').select('payload').eq('user_id', user.id).single();
  if (error) return null;
  return (data?.payload as T) || null;
}
