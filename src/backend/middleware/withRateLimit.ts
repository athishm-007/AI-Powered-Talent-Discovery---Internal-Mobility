import { createSupabaseAdminClient } from '@/lib/supabase/admin';

const inMemoryStore = new Map<string, { count: number; windowStart: number }>();

export async function checkRateLimit(key: string, maxRequests: number = 30, windowSeconds: number = 60): Promise<boolean> {
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin.rpc('check_rate_limit', {
      p_key: key,
      p_max: maxRequests,
      p_window_seconds: windowSeconds,
    });

    if (!error && typeof data === 'boolean') {
      return data;
    }
  } catch {
    // Fallback to in-memory store for local dev
  }

  const now = Date.now();
  const record = inMemoryStore.get(key);

  if (!record || now - record.windowStart > windowSeconds * 1000) {
    inMemoryStore.set(key, { count: 1, windowStart: now });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count += 1;
  return true;
}
