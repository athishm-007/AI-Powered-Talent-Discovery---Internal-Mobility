-- 1. departments
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. profiles
CREATE TABLE IF NOT EXISTS profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  role_title text NOT NULL DEFAULT 'Team Member',
  bio text,
  avatar_url text,
  future_potential_summary text,
  embedding vector(1536),
  embedding_model text,
  embedding_updated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. profile_snapshots
CREATE TABLE IF NOT EXISTS profile_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  version int NOT NULL,
  skills_summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  trigger snapshot_trigger_enum NOT NULL DEFAULT 'manual',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. skills
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. skill_relations
CREATE TABLE IF NOT EXISTS skill_relations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  target_skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  relation_type skill_relation_enum NOT NULL DEFAULT 'transferable',
  transferability_score float NOT NULL DEFAULT 0.5 CHECK (transferability_score >= 0.0 AND transferability_score <= 1.0),
  UNIQUE (source_skill_id, target_skill_id)
);

-- 6. employee_skills
CREATE TABLE IF NOT EXISTS employee_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  proficiency_level int NOT NULL DEFAULT 1 CHECK (proficiency_level >= 1 AND proficiency_level <= 5),
  source explicit_inferred_enum NOT NULL DEFAULT 'explicit',
  confidence_score float NOT NULL DEFAULT 1.0 CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
  evidence_snippets jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (profile_id, skill_id)
);

-- 7. experiences
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  title text NOT NULL,
  company text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  description text NOT NULL DEFAULT '',
  skills_used text[] NOT NULL DEFAULT '{}'::text[]
);

-- 8. projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  title text NOT NULL,
  role_name text NOT NULL,
  description text NOT NULL DEFAULT '',
  outcomes text,
  technologies text[] NOT NULL DEFAULT '{}'::text[]
);

-- 9. learning_activities
CREATE TABLE IF NOT EXISTS learning_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  title text NOT NULL,
  activity_type text NOT NULL,
  status text NOT NULL DEFAULT 'completed',
  completion_date date,
  skills_acquired text[] NOT NULL DEFAULT '{}'::text[]
);

-- 10. documents
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  file_name text NOT NULL,
  r2_object_key text NOT NULL UNIQUE,
  mime_type text NOT NULL,
  extracted_text text,
  parsed_at timestamptz,
  CHECK (r2_object_key LIKE profile_id::text || '/' || id::text || '/%')
);

-- 11. roles
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
  location text NOT NULL,
  opportunity_type opportunity_type_enum NOT NULL DEFAULT 'job',
  status text NOT NULL DEFAULT 'open',
  description text NOT NULL,
  min_years_exp int NOT NULL DEFAULT 0 CHECK (min_years_exp >= 0),
  embedding vector(1536),
  embedding_model text,
  embedding_updated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 12. role_skills
CREATE TABLE IF NOT EXISTS role_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  required_proficiency int NOT NULL DEFAULT 1 CHECK (required_proficiency >= 1 AND required_proficiency <= 5),
  importance_weight float NOT NULL DEFAULT 0.5 CHECK (importance_weight >= 0.0 AND importance_weight <= 1.0),
  feedback_modifier float NOT NULL DEFAULT 1.0 CHECK (feedback_modifier >= 0.5 AND feedback_modifier <= 1.5),
  is_required boolean NOT NULL DEFAULT true,
  UNIQUE (role_id, skill_id)
);

-- 13. initiatives
CREATE TABLE IF NOT EXISTS initiatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  target_quarter text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
  embedding vector(1536),
  embedding_model text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 14. initiative_skills
CREATE TABLE IF NOT EXISTS initiative_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  initiative_id uuid NOT NULL REFERENCES initiatives(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  required_count int NOT NULL DEFAULT 1 CHECK (required_count > 0),
  target_proficiency int NOT NULL DEFAULT 1 CHECK (target_proficiency >= 1 AND target_proficiency <= 5),
  source initiative_skill_source_enum NOT NULL DEFAULT 'hr_defined',
  rationale text
);

-- 15. match_results
CREATE TABLE IF NOT EXISTS match_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  overall_score float NOT NULL CHECK (overall_score >= 0.0 AND overall_score <= 1.0),
  skill_coverage_score float NOT NULL CHECK (skill_coverage_score >= 0.0 AND skill_coverage_score <= 1.0),
  vector_similarity_score float NOT NULL CHECK (vector_similarity_score >= 0.0 AND vector_similarity_score <= 1.0),
  transferable_credit_score float NOT NULL CHECK (transferable_credit_score >= 0.0 AND transferable_credit_score <= 1.0),
  experience_relevance_score float NOT NULL CHECK (experience_relevance_score >= 0.0 AND experience_relevance_score <= 1.0),
  explanation_text text NOT NULL,
  cited_evidence_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  matched_skills jsonb NOT NULL DEFAULT '[]'::jsonb,
  missing_skills jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_stale boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (profile_id, role_id)
);

-- 16. skill_gap_analyses
CREATE TABLE IF NOT EXISTS skill_gap_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  target_role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  gap_score float NOT NULL CHECK (gap_score >= 0.0 AND gap_score <= 1.0),
  missing_skills jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 17. learning_resources
CREATE TABLE IF NOT EXISTS learning_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  provider text NOT NULL,
  resource_url text NOT NULL,
  type resource_type_enum NOT NULL DEFAULT 'course',
  estimated_hours int NOT NULL DEFAULT 1 CHECK (estimated_hours > 0),
  target_skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE RESTRICT,
  difficulty_level text NOT NULL DEFAULT 'Intermediate',
  weight_modifier float NOT NULL DEFAULT 1.0 CHECK (weight_modifier >= 0.5 AND weight_modifier <= 1.5)
);

-- 18. roadmaps
CREATE TABLE IF NOT EXISTS roadmaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  target_role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  status roadmap_status_enum NOT NULL DEFAULT 'in_progress',
  overall_progress_pct float NOT NULL DEFAULT 0.0 CHECK (overall_progress_pct >= 0.0 AND overall_progress_pct <= 100.0),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 19. roadmap_items
CREATE TABLE IF NOT EXISTS roadmap_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id uuid NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  phase roadmap_phase_enum NOT NULL DEFAULT '0-3_months',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  resource_id uuid REFERENCES learning_resources(id) ON DELETE SET NULL,
  status roadmap_item_status_enum NOT NULL DEFAULT 'pending',
  completed_at timestamptz
);

-- 20. chat_sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Career Assistant Session',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 21. chat_messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender chat_sender_enum NOT NULL DEFAULT 'user',
  content text NOT NULL,
  cited_sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 22. recommendation_feedback
CREATE TABLE IF NOT EXISTS recommendation_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  item_type recommendation_item_type_enum NOT NULL,
  item_id uuid NOT NULL,
  is_helpful boolean NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (profile_id, item_type, item_id)
);

-- 23. career_outcomes
CREATE TABLE IF NOT EXISTS career_outcomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  outcome_type outcome_type_enum NOT NULL,
  target_id uuid NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  logged_at timestamptz NOT NULL DEFAULT now()
);

-- 24. ai_cache
CREATE TABLE IF NOT EXISTS ai_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  input_hash text NOT NULL UNIQUE,
  provider text NOT NULL,
  prompt_type text NOT NULL,
  response_json jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 25. audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 26. rate_limits
CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  window_start timestamptz NOT NULL DEFAULT now(),
  count int NOT NULL DEFAULT 1
);
