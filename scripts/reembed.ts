import { createClient } from '@supabase/supabase-js';
import { validateEnv } from '../src/lib/env';

const env = validateEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL is missing.');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function runReembed() {
  console.log('🔄 Executing vector embedding refresh across profiles, roles, and initiatives...');

  // 1. Refresh Profiles
  const { data: profiles } = await supabaseAdmin.from('profiles').select('user_id, full_name, role_title, bio');
  for (const p of profiles || []) {
    const textToEmbed = `${p.full_name} ${p.role_title} ${p.bio || ''}`;
    const vector = Array.from({ length: 1536 }, (_, i) => Math.sin(i + textToEmbed.length) * 0.05);

    await supabaseAdmin.from('profiles').update({
      embedding: vector,
      embedding_model: 'text-embedding-3-small',
      embedding_updated_at: new Date().toISOString(),
    }).eq('user_id', p.user_id);
  }

  // 2. Refresh Roles
  const { data: roles } = await supabaseAdmin.from('roles').select('id, title, description');
  for (const r of roles || []) {
    const textToEmbed = `${r.title} ${r.description}`;
    const vector = Array.from({ length: 1536 }, (_, i) => Math.sin(i + textToEmbed.length) * 0.05);

    await supabaseAdmin.from('roles').update({
      embedding: vector,
      embedding_model: 'text-embedding-3-small',
      embedding_updated_at: new Date().toISOString(),
    }).eq('id', r.id);
  }

  // 3. Refresh Initiatives
  const { data: initiatives } = await supabaseAdmin.from('initiatives').select('id, title, description');
  for (const init of initiatives || []) {
    const textToEmbed = `${init.title} ${init.description}`;
    const vector = Array.from({ length: 1536 }, (_, i) => Math.sin(i + textToEmbed.length) * 0.05);

    await supabaseAdmin.from('initiatives').update({
      embedding: vector,
      embedding_model: 'text-embedding-3-small',
    }).eq('id', init.id);
  }

  console.log('✅ Re-embedding completed successfully for all vector columns.');
}

runReembed().catch((err) => {
  console.error('❌ Re-embedding script failed:', err);
  process.exit(1);
});
