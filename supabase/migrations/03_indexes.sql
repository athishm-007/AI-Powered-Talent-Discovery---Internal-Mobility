-- HNSW Vector Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_embedding_hnsw ON profiles USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_roles_embedding_hnsw ON roles USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_initiatives_embedding_hnsw ON initiatives USING hnsw (embedding vector_cosine_ops);

-- Foreign Key Indexes for Query Optimization
CREATE INDEX IF NOT EXISTS idx_profiles_department ON profiles(department_id);
CREATE INDEX IF NOT EXISTS idx_employee_skills_profile ON employee_skills(profile_id);
CREATE INDEX IF NOT EXISTS idx_employee_skills_skill ON employee_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_experiences_profile ON experiences(profile_id);
CREATE INDEX IF NOT EXISTS idx_projects_profile ON projects(profile_id);
CREATE INDEX IF NOT EXISTS idx_learning_activities_profile ON learning_activities(profile_id);
CREATE INDEX IF NOT EXISTS idx_documents_profile ON documents(profile_id);

CREATE INDEX IF NOT EXISTS idx_roles_department ON roles(department_id);
CREATE INDEX IF NOT EXISTS idx_role_skills_role ON role_skills(role_id);
CREATE INDEX IF NOT EXISTS idx_role_skills_skill ON role_skills(skill_id);

CREATE INDEX IF NOT EXISTS idx_initiatives_department ON initiatives(department_id);
CREATE INDEX IF NOT EXISTS idx_initiative_skills_initiative ON initiative_skills(initiative_id);

CREATE INDEX IF NOT EXISTS idx_match_results_profile ON match_results(profile_id);
CREATE INDEX IF NOT EXISTS idx_match_results_role ON match_results(role_id);
CREATE INDEX IF NOT EXISTS idx_match_results_score ON match_results(profile_id, overall_score DESC);

CREATE INDEX IF NOT EXISTS idx_gap_analyses_profile ON skill_gap_analyses(profile_id);
CREATE INDEX IF NOT EXISTS idx_gap_analyses_role ON skill_gap_analyses(target_role_id);

CREATE INDEX IF NOT EXISTS idx_learning_resources_skill ON learning_resources(target_skill_id);
CREATE INDEX IF NOT EXISTS idx_roadmaps_profile ON roadmaps(profile_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_roadmap ON roadmap_items(roadmap_id);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_feedback_profile ON recommendation_feedback(profile_id);
CREATE INDEX IF NOT EXISTS idx_outcomes_profile ON career_outcomes(profile_id);
CREATE INDEX IF NOT EXISTS idx_rate_limits_key ON rate_limits(key);
