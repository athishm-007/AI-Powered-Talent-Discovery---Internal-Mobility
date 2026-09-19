import { createClient } from '@supabase/supabase-js';
import { validateEnv } from '../../src/lib/env';

const env = validateEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL is missing.');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function runSeed() {
  console.log('🚀 Starting TalentLens Enterprise Master Seed Pipeline...');

  const isReset = process.argv.includes('--reset');
  if (isReset) {
    console.log('🧹 Clearing seeded user accounts and associated records...');
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    for (const u of users?.users || []) {
      if (u.app_metadata?.seeded) {
        await supabaseAdmin.auth.admin.deleteUser(u.id);
      }
    }
    console.log('✅ Reset complete.');
    return;
  }

  // 1. Fetch departments and skills from database
  const { data: departments } = await supabaseAdmin.from('departments').select('*');
  const { data: skills } = await supabaseAdmin.from('skills').select('*');
  const { data: roles } = await supabaseAdmin.from('roles').select('*');
  const { data: learningResources } = await supabaseAdmin.from('learning_resources').select('*');

  if (!departments || departments.length === 0 || !skills || skills.length === 0) {
    console.error('❌ Error: Static DDL reference data missing. Please apply migrations and supabase/seed/seed.sql first.');
    process.exit(1);
  }

  // 2. Create HR Admin Account
  const adminPassword = env.SEED_ADMIN_PASSWORD || 'hradmin123';
  const employeePassword = env.SEED_EMPLOYEE_PASSWORD || 'employee123';

  console.log('👤 Provisioning HR Admin user (admin@talentlens.ai)...');
  let adminUserId: string;
  const { data: existingAdminList } = await supabaseAdmin.auth.admin.listUsers();
  const existingAdmin = existingAdminList?.users.find((u) => u.email === 'admin@talentlens.ai');

  if (existingAdmin) {
    adminUserId = existingAdmin.id;
    await supabaseAdmin.auth.admin.updateUserById(adminUserId, {
      password: adminPassword,
      app_metadata: { role: 'hr_admin', seeded: true },
    });
  } else {
    const { data: newAdmin, error: adminErr } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@talentlens.ai',
      password: adminPassword,
      email_confirm: true,
      user_metadata: { full_name: 'HR Admin (Enterprise)' },
      app_metadata: { role: 'hr_admin', seeded: true },
    });
    if (adminErr) throw adminErr;
    adminUserId = newAdmin.user.id;
  }

  await supabaseAdmin.from('profiles').upsert({
    user_id: adminUserId,
    email: 'admin@talentlens.ai',
    full_name: 'HR Admin (Enterprise)',
    role_title: 'HR Director & Talent Lead',
    department_id: departments[4]?.id || departments[0].id,
    future_potential_summary: 'Strategic HR Leadership & Organizational Mobility Architecture',
  });

  // 3. Create 40 Employee Accounts (including Alex Chen and Sarah Jenkins)
  console.log('👥 Provisioning 40 realistic employee profiles across departments...');
  const employeeNames = [
    { name: 'Alex Chen', email: 'alex.chen@talentlens.ai', title: 'Senior Software Engineer', deptIdx: 0 },
    { name: 'Sarah Jenkins', email: 'sarah.jenkins@talentlens.ai', title: 'Product Manager', deptIdx: 1 },
    { name: 'David Kumar', email: 'david.kumar@talentlens.ai', title: 'Data Scientist', deptIdx: 2 },
    { name: 'Elena Rostova', email: 'elena.rostova@talentlens.ai', title: 'Cyber Security Analyst', deptIdx: 3 },
    { name: 'Marcus Vance', email: 'marcus.vance@talentlens.ai', title: 'DevOps & Cloud Engineer', deptIdx: 0 },
    { name: 'Priya Sharma', email: 'priya.sharma@talentlens.ai', title: 'UX Specialist', deptIdx: 1 },
    { name: 'James Wilson', email: 'james.wilson@talentlens.ai', title: 'Backend Developer', deptIdx: 0 },
    { name: 'Linda Martinez', email: 'linda.martinez@talentlens.ai', title: 'AI Research Engineer', deptIdx: 2 },
    { name: 'Robert Taylor', email: 'robert.taylor@talentlens.ai', title: 'Security Engineer', deptIdx: 3 },
    { name: 'Sofia Garcia', email: 'sofia.garcia@talentlens.ai', title: 'Product Strategist', deptIdx: 1 },
  ];

  // Fill up to 40
  for (let i = 11; i <= 40; i++) {
    employeeNames.push({
      name: `Employee ${i} User`,
      email: `employee${i}@talentlens.ai`,
      title: i % 2 === 0 ? 'Full-Stack Developer' : 'Technical Specialist',
      deptIdx: i % departments.length,
    });
  }

  const createdProfileIds: string[] = [];

  for (const emp of employeeNames) {
    let uid: string;
    const existingUser = existingAdminList?.users.find((u) => u.email === emp.email);

    const isPrimaryDemo = emp.email.startsWith('alex.chen') || emp.email.startsWith('sarah.jenkins');
    const pwd = isPrimaryDemo ? employeePassword : `Pwd_${Math.random().toString(36).substring(2)}${Date.now()}`;

    if (existingUser) {
      uid = existingUser.id;
      await supabaseAdmin.auth.admin.updateUserById(uid, {
        password: isPrimaryDemo ? employeePassword : pwd,
        app_metadata: { role: 'employee', seeded: true },
      });
    } else {
      const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: emp.email,
        password: pwd,
        email_confirm: true,
        user_metadata: { full_name: emp.name },
        app_metadata: { role: 'employee', seeded: true },
      });
      if (createErr) continue;
      uid = newUser.user.id;
    }

    createdProfileIds.push(uid);

    await supabaseAdmin.from('profiles').upsert({
      user_id: uid,
      email: emp.email,
      full_name: emp.name,
      role_title: emp.title,
      department_id: departments[emp.deptIdx].id,
      bio: `Experienced ${emp.title} focused on enterprise innovation, scalable architecture, and continuous learning.`,
      future_potential_summary: `High potential for transition into Staff Leadership, Strategic AI Systems Architecture, and Enterprise Technical Product Leadership.`,
    });

    // Seed Experiences
    await supabaseAdmin.from('experiences').upsert([
      {
        profile_id: uid,
        title: emp.title,
        company: 'TalentLens Enterprise',
        start_date: '2023-01-15',
        description: `Leading key technical and product initiatives in ${departments[emp.deptIdx].name}.`,
        skills_used: ['TypeScript', 'React & Next.js', 'Node.js & Backend Architecture'],
      },
    ]);

    // Seed Projects
    await supabaseAdmin.from('projects').upsert([
      {
        profile_id: uid,
        title: 'Enterprise Platform Modernization',
        role_name: 'Lead Developer',
        description: 'Migrated monolithic service infrastructure to component-driven Next.js App Router and Supabase.',
        outcomes: 'Improved page load latency by 45% and enhanced cross-departmental collaboration.',
        technologies: ['TypeScript', 'Next.js', 'Postgres'],
      },
    ]);

    // Seed Explicit Skills
    for (let sIdx = 0; sIdx < Math.min(4, skills.length); sIdx++) {
      const targetSkill = skills[(sIdx + emp.deptIdx) % skills.length];
      await supabaseAdmin.from('employee_skills').upsert({
        profile_id: uid,
        skill_id: targetSkill.id,
        proficiency_level: Math.min(5, Math.max(2, (sIdx + emp.deptIdx) % 5 + 1)),
        source: 'explicit',
        confidence_score: 1.0,
        evidence_snippets: [`Verified in Project: Enterprise Platform Modernization (${targetSkill.name})`],
      });
    }

    // Create Initial Profile Snapshot
    await supabaseAdmin.from('profile_snapshots').insert({
      profile_id: uid,
      version: 1,
      skills_summary: { explicit_count: 4, inferred_count: 2 },
      trigger: 'manual',
    });
  }

  // 4. Generate Pre-computed Embeddings
  console.log('⚡ Generating pre-computed 1536-dimensional vector embeddings for profiles and roles...');
  for (const pid of createdProfileIds) {
    const dummyVector = Array.from({ length: 1536 }, (_, i) => Math.sin(i + pid.charCodeAt(0)) * 0.05);
    await supabaseAdmin.from('profiles').update({
      embedding: dummyVector,
      embedding_model: 'text-embedding-3-small',
      embedding_updated_at: new Date().toISOString(),
    }).eq('user_id', pid);
  }

  for (const role of roles || []) {
    const roleVector = Array.from({ length: 1536 }, (_, i) => Math.sin(i + role.title.charCodeAt(0)) * 0.05);
    await supabaseAdmin.from('roles').update({
      embedding: roleVector,
      embedding_model: 'text-embedding-3-small',
      embedding_updated_at: new Date().toISOString(),
    }).eq('id', role.id);
  }

  // 5. Seed Matches & Gap Analyses
  console.log('🎯 Seeding candidate match results and target role gap analyses...');
  for (let idx = 0; idx < createdProfileIds.length; idx++) {
    const pid = createdProfileIds[idx];
    for (let rIdx = 0; rIdx < (roles || []).length; rIdx++) {
      const role = roles![rIdx];
      // Vary match scores to distribute into READY_NOW, READY_6_MONTHS, DEVELOPING
      const overall = idx % 3 === 0 ? 0.85 : idx % 3 === 1 ? 0.68 : 0.45;
      await supabaseAdmin.from('match_results').upsert({
        profile_id: pid,
        role_id: role.id,
        overall_score: overall,
        skill_coverage_score: overall + 0.05 > 1 ? 0.95 : overall + 0.05,
        vector_similarity_score: overall,
        transferable_credit_score: 0.70,
        experience_relevance_score: 0.80,
        explanation_text: `Candidate demonstrates strong proficiency alignment (${Math.round(overall * 100)}%) with required skills including ${skills[0]?.name || 'TypeScript'}.`,
        cited_evidence_ids: [{ type: 'experience', id: 'exp-1', description: 'Enterprise Platform Modernization' }],
        matched_skills: [{ skill_id: skills[0]?.id || 's1', skill_name: skills[0]?.name || 'TypeScript', user_proficiency: 4, required_proficiency: 4, coverage_score: 1.0 }],
        missing_skills: idx % 3 === 0 ? [] : [{ skill_id: skills[1]?.id || 's2', skill_name: skills[1]?.name || 'Vector Search', user_proficiency: 2, required_proficiency: 4, severity: 'MODERATE', estimated_time_to_close: '3-4 weeks' }],
        is_stale: false,
      });

      if (rIdx === 0) {
        await supabaseAdmin.from('skill_gap_analyses').insert({
          profile_id: pid,
          target_role_id: role.id,
          gap_score: 1.0 - overall,
          missing_skills: idx % 3 === 0 ? [] : [
            {
              skill_id: skills[1]?.id || 's2',
              skill_name: skills[1]?.name || 'Vector Embeddings & RAG',
              category: 'Artificial Intelligence',
              user_proficiency: 2,
              required_proficiency: 4,
              severity: idx % 3 === 2 ? 'CRITICAL' : 'MODERATE',
              estimated_time_to_close: '3-4 weeks',
              recommended_resource_ids: [learningResources?.[0]?.id || 'l1'],
            },
          ],
        });

        // Seed Roadmaps with varied progress
        const pct = idx % 3 === 0 ? 80.0 : idx % 3 === 1 ? 55.0 : 20.0;
        const { data: newRoadmap } = await supabaseAdmin.from('roadmaps').insert({
          profile_id: pid,
          target_role_id: role.id,
          status: (pct as number) >= 100 ? 'completed' : 'in_progress',
          overall_progress_pct: pct,
        }).select().single();

        if (newRoadmap && learningResources?.[0]) {
          await supabaseAdmin.from('roadmap_items').insert([
            {
              roadmap_id: newRoadmap.id,
              phase: '0-3_months',
              title: `Master ${learningResources[0].title}`,
              description: 'Complete hands-on course modules and building demo pipeline.',
              resource_id: learningResources[0].id,
              status: pct > 50 ? 'completed' : 'in_progress',
              completed_at: pct > 50 ? new Date().toISOString() : null,
            },
            {
              roadmap_id: newRoadmap.id,
              phase: '3-6_months',
              title: 'Apply Skill to Internal Taskforce Project',
              description: 'Participate in cross-functional internal mobility opportunity.',
              resource_id: learningResources[1]?.id || learningResources[0].id,
              status: 'pending',
            },
          ]);
        }
      }
    }
  }

  // 6. Seed Distinct User Feedback & Outcomes
  console.log('💬 Seeding distinct user recommendation feedback and career outcomes...');
  for (let fIdx = 0; fIdx < Math.min(8, createdProfileIds.length); fIdx++) {
    const fPid = createdProfileIds[fIdx];
    const targetRole = roles![0];
    const targetResource = learningResources![0];

    await supabaseAdmin.from('recommendation_feedback').upsert({
      profile_id: fPid,
      item_type: 'match',
      item_id: targetRole.id,
      is_helpful: fIdx % 4 !== 0, // 75% positive helpful rate
      reason: 'Accurate skill match and clear evidence citations.',
    });

    if (fIdx % 2 === 0) {
      await supabaseAdmin.from('career_outcomes').insert({
        profile_id: fPid,
        outcome_type: fIdx === 0 ? 'applied' : 'completed_course',
        target_id: fIdx === 0 ? targetRole.id : targetResource.id,
        details: fIdx === 0 ? { stage: 'interest' } : { grade: 'A+' },
      });
    }
  }

  console.log('🎉 TalentLens Master Seed Execution Completed Successfully!');
}

runSeed().catch((err) => {
  console.error('❌ Master Seed Script Failed:', err);
  process.exit(1);
});
