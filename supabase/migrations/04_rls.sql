-- STABLE Helper Function reading JWT claims
CREATE OR REPLACE FUNCTION is_hr_admin()
RETURNS boolean AS $$
  SELECT coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'hr_admin';
$$ LANGUAGE sql STABLE;

-- 1. REVOKE DEFAULT PRIVILEGES
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;

-- 2. ENABLE ROW LEVEL SECURITY ON ALL 26 TABLES
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE initiative_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_gap_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- 3. EXPLICIT COLUMN-LEVEL GRANTS TO AUTHENTICATED
GRANT SELECT ON departments, skills, skill_relations, roles, role_skills, learning_resources TO authenticated;
GRANT SELECT ON profiles, profile_snapshots, employee_skills, experiences, projects, learning_activities, match_results, skill_gap_analyses, roadmaps, roadmap_items, chat_sessions, chat_messages, recommendation_feedback, career_outcomes, audit_logs TO authenticated;

-- Column-limited SELECT on documents (no extracted_text client access)
GRANT SELECT (id, profile_id, file_name, r2_object_key, mime_type, parsed_at) ON documents TO authenticated;

-- Specific Column Write Grants
GRANT UPDATE (full_name, bio, avatar_url, role_title) ON profiles TO authenticated;
GRANT INSERT (profile_id, skill_id, proficiency_level, source), UPDATE (proficiency_level, source), DELETE ON employee_skills TO authenticated;
GRANT INSERT, UPDATE, DELETE ON experiences TO authenticated;
GRANT INSERT, UPDATE, DELETE ON projects TO authenticated;
GRANT INSERT, UPDATE, DELETE ON learning_activities TO authenticated;
GRANT INSERT (id, profile_id, file_name, r2_object_key, mime_type), DELETE ON documents TO authenticated;

GRANT INSERT, UPDATE, DELETE ON roles TO authenticated;
GRANT INSERT (role_id, skill_id, required_proficiency, importance_weight, is_required), UPDATE (required_proficiency, importance_weight, is_required), DELETE ON role_skills TO authenticated;
GRANT INSERT, UPDATE, DELETE ON initiatives TO authenticated;
GRANT INSERT, UPDATE, DELETE ON initiative_skills TO authenticated;
GRANT INSERT (title, provider, resource_url, type, estimated_hours, target_skill_id, difficulty_level), UPDATE (title, provider, resource_url, type, estimated_hours, target_skill_id, difficulty_level), DELETE ON learning_resources TO authenticated;
GRANT INSERT, UPDATE, DELETE ON departments, skills, skill_relations TO authenticated;

GRANT UPDATE (status) ON roadmap_items TO authenticated;
GRANT INSERT, UPDATE, DELETE ON chat_sessions TO authenticated;
GRANT INSERT, UPDATE, DELETE ON chat_messages TO authenticated;
GRANT INSERT (profile_id, item_type, item_id, is_helpful, reason), UPDATE (is_helpful, reason) ON recommendation_feedback TO authenticated;
GRANT INSERT ON career_outcomes TO authenticated;

-- 4. RLS POLICIES FOR EVERY TABLE

-- departments
CREATE POLICY p_departments_select ON departments FOR SELECT USING (true);
CREATE POLICY p_departments_admin ON departments FOR ALL USING ((select is_hr_admin())) WITH CHECK ((select is_hr_admin()));

-- profiles
CREATE POLICY p_profiles_select ON profiles FOR SELECT USING (user_id = (select auth.uid()) OR (select is_hr_admin()));
CREATE POLICY p_profiles_update ON profiles FOR UPDATE USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));

-- profile_snapshots
CREATE POLICY p_profile_snapshots_select ON profile_snapshots FOR SELECT USING (profile_id = (select auth.uid()) OR (select is_hr_admin()));

-- skills
CREATE POLICY p_skills_select ON skills FOR SELECT USING (true);
CREATE POLICY p_skills_admin ON skills FOR ALL USING ((select is_hr_admin())) WITH CHECK ((select is_hr_admin()));

-- skill_relations
CREATE POLICY p_skill_relations_select ON skill_relations FOR SELECT USING (true);
CREATE POLICY p_skill_relations_admin ON skill_relations FOR ALL USING ((select is_hr_admin())) WITH CHECK ((select is_hr_admin()));

-- employee_skills
CREATE POLICY p_employee_skills_select ON employee_skills FOR SELECT USING (profile_id = (select auth.uid()) OR (select is_hr_admin()));
CREATE POLICY p_employee_skills_insert ON employee_skills FOR INSERT WITH CHECK (source = 'explicit' AND profile_id = (select auth.uid()));
CREATE POLICY p_employee_skills_update ON employee_skills FOR UPDATE USING (profile_id = (select auth.uid())) WITH CHECK (source = 'explicit' AND profile_id = (select auth.uid()));
CREATE POLICY p_employee_skills_delete ON employee_skills FOR DELETE USING (profile_id = (select auth.uid()));

-- experiences
CREATE POLICY p_experiences_select ON experiences FOR SELECT USING (profile_id = (select auth.uid()) OR (select is_hr_admin()));
CREATE POLICY p_experiences_insert ON experiences FOR INSERT WITH CHECK (profile_id = (select auth.uid()));
CREATE POLICY p_experiences_update ON experiences FOR UPDATE USING (profile_id = (select auth.uid())) WITH CHECK (profile_id = (select auth.uid()));
CREATE POLICY p_experiences_delete ON experiences FOR DELETE USING (profile_id = (select auth.uid()));

-- projects
CREATE POLICY p_projects_select ON projects FOR SELECT USING (profile_id = (select auth.uid()) OR (select is_hr_admin()));
CREATE POLICY p_projects_insert ON projects FOR INSERT WITH CHECK (profile_id = (select auth.uid()));
CREATE POLICY p_projects_update ON projects FOR UPDATE USING (profile_id = (select auth.uid())) WITH CHECK (profile_id = (select auth.uid()));
CREATE POLICY p_projects_delete ON projects FOR DELETE USING (profile_id = (select auth.uid()));

-- learning_activities
CREATE POLICY p_learning_activities_select ON learning_activities FOR SELECT USING (profile_id = (select auth.uid()) OR (select is_hr_admin()));
CREATE POLICY p_learning_activities_insert ON learning_activities FOR INSERT WITH CHECK (profile_id = (select auth.uid()));
CREATE POLICY p_learning_activities_update ON learning_activities FOR UPDATE USING (profile_id = (select auth.uid())) WITH CHECK (profile_id = (select auth.uid()));
CREATE POLICY p_learning_activities_delete ON learning_activities FOR DELETE USING (profile_id = (select auth.uid()));

-- documents
CREATE POLICY p_documents_select ON documents FOR SELECT USING (profile_id = (select auth.uid()));
CREATE POLICY p_documents_insert ON documents FOR INSERT WITH CHECK (profile_id = (select auth.uid()) AND r2_object_key LIKE (select auth.uid())::text || '/' || id::text || '/%');
CREATE POLICY p_documents_delete ON documents FOR DELETE USING (profile_id = (select auth.uid()));

-- roles
CREATE POLICY p_roles_select ON roles FOR SELECT USING (status = 'open' OR (select is_hr_admin()));
CREATE POLICY p_roles_admin ON roles FOR ALL USING ((select is_hr_admin())) WITH CHECK ((select is_hr_admin()));

-- role_skills
CREATE POLICY p_role_skills_select ON role_skills FOR SELECT USING (true);
CREATE POLICY p_role_skills_admin ON role_skills FOR ALL USING ((select is_hr_admin())) WITH CHECK ((select is_hr_admin()));

-- initiatives
CREATE POLICY p_initiatives_select ON initiatives FOR SELECT USING ((select is_hr_admin()));
CREATE POLICY p_initiatives_admin ON initiatives FOR ALL USING ((select is_hr_admin())) WITH CHECK ((select is_hr_admin()));

-- initiative_skills
CREATE POLICY p_initiative_skills_select ON initiative_skills FOR SELECT USING ((select is_hr_admin()));
CREATE POLICY p_initiative_skills_admin ON initiative_skills FOR ALL USING ((select is_hr_admin())) WITH CHECK ((select is_hr_admin()));

-- match_results
CREATE POLICY p_match_results_select ON match_results FOR SELECT USING (profile_id = (select auth.uid()) OR (select is_hr_admin()));

-- skill_gap_analyses
CREATE POLICY p_gap_analyses_select ON skill_gap_analyses FOR SELECT USING (profile_id = (select auth.uid()) OR (select is_hr_admin()));

-- learning_resources
CREATE POLICY p_learning_resources_select ON learning_resources FOR SELECT USING (true);
CREATE POLICY p_learning_resources_admin ON learning_resources FOR ALL USING ((select is_hr_admin())) WITH CHECK ((select is_hr_admin()));

-- roadmaps
CREATE POLICY p_roadmaps_select ON roadmaps FOR SELECT USING (profile_id = (select auth.uid()) OR (select is_hr_admin()));

-- roadmap_items
CREATE POLICY p_roadmap_items_select ON roadmap_items FOR SELECT USING (EXISTS (SELECT 1 FROM roadmaps WHERE id = roadmap_items.roadmap_id AND profile_id = (select auth.uid())) OR (select is_hr_admin()));
CREATE POLICY p_roadmap_items_update ON roadmap_items FOR UPDATE USING (EXISTS (SELECT 1 FROM roadmaps WHERE id = roadmap_items.roadmap_id AND profile_id = (select auth.uid()))) WITH CHECK (EXISTS (SELECT 1 FROM roadmaps WHERE id = roadmap_items.roadmap_id AND profile_id = (select auth.uid())));

-- chat_sessions
CREATE POLICY p_chat_sessions_all ON chat_sessions FOR ALL USING (profile_id = (select auth.uid())) WITH CHECK (profile_id = (select auth.uid()));

-- chat_messages
CREATE POLICY p_chat_messages_all ON chat_messages FOR ALL USING (EXISTS (SELECT 1 FROM chat_sessions WHERE id = chat_messages.session_id AND profile_id = (select auth.uid()))) WITH CHECK (EXISTS (SELECT 1 FROM chat_sessions WHERE id = chat_messages.session_id AND profile_id = (select auth.uid())));

-- recommendation_feedback
CREATE POLICY p_recommendation_feedback_select ON recommendation_feedback FOR SELECT USING (profile_id = (select auth.uid()));
CREATE POLICY p_recommendation_feedback_insert ON recommendation_feedback FOR INSERT WITH CHECK (profile_id = (select auth.uid()));
CREATE POLICY p_recommendation_feedback_update ON recommendation_feedback FOR UPDATE USING (profile_id = (select auth.uid())) WITH CHECK (profile_id = (select auth.uid()));

-- career_outcomes
CREATE POLICY p_career_outcomes_select ON career_outcomes FOR SELECT USING (profile_id = (select auth.uid()) OR ((select is_hr_admin()) AND outcome_type = 'applied' AND details->>'stage' = 'interest'));
CREATE POLICY p_career_outcomes_insert ON career_outcomes FOR INSERT WITH CHECK (profile_id = (select auth.uid()));

-- audit_logs
CREATE POLICY p_audit_logs_select ON audit_logs FOR SELECT USING ((select is_hr_admin()));

-- ai_cache & rate_limits: NO RLS policies (deny all user access)
