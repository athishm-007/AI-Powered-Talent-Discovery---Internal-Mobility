-- Static Reference Data DDL

-- Departments
INSERT INTO departments (id, name, code) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'Engineering & Technology', 'ENG'),
  ('d1000000-0000-0000-0000-000000000002', 'Product & Design', 'PRD'),
  ('d1000000-0000-0000-0000-000000000003', 'Data & Artificial Intelligence', 'DATA'),
  ('d1000000-0000-0000-0000-000000000004', 'Cyber Security & Infrastructure', 'SEC'),
  ('d1000000-0000-0000-0000-000000000005', 'People & Organizational Growth', 'HR')
ON CONFLICT (code) DO NOTHING;

-- Skills Taxonomy (Sample representation out of 80)
INSERT INTO skills (id, name, category, description) VALUES
  ('s1000000-0000-0000-0000-000000000001', 'TypeScript', 'Software Engineering', 'Strongly typed programming language for enterprise web applications'),
  ('s1000000-0000-0000-0000-000000000002', 'React & Next.js', 'Frontend Architecture', 'Modern Component-driven UI framework with SSR and streaming'),
  ('s1000000-0000-0000-0000-000000000003', 'Node.js & Backend Architecture', 'Backend Engineering', 'Scalable asynchronous event-driven server runtime'),
  ('s1000000-0000-0000-0000-000000000004', 'Python & Machine Learning', 'Data Science', 'Data processing, model training, and AI pipeline orchestration'),
  ('s1000000-0000-0000-0000-000000000005', 'Vector Embeddings & RAG', 'Artificial Intelligence', 'Semantic retrieval augmented generation and vector similarity search'),
  ('s1000000-0000-0000-0000-000000000006', 'SQL & Postgres Database Tuning', 'Data Infrastructure', 'Relational database design, query indexing, and schema design'),
  ('s1000000-0000-0000-0000-000000000007', 'Product Strategy & Roadmap Planning', 'Product Management', 'Market validation, feature prioritization, and vision alignment'),
  ('s1000000-0000-0000-0000-000000000008', 'Cloud Security & Compliance', 'Cyber Security', 'Enterprise threat modeling, IAM policy enforcement, and audit controls'),
  ('s1000000-0000-0000-0000-000000000009', 'UX Research & Design Systems', 'User Experience', 'Usability testing, design tokens, and accessible UI prototyping'),
  ('s1000000-0000-0000-0000-000000000010', 'Agile Leadership & Coaching', 'Engineering Operations', 'Scrum coaching, sprint planning, and cross-functional team delivery'),
  ('s1000000-0000-0000-0000-000000000011', 'GraphQL & REST API Design', 'Backend Engineering', 'Contract-driven API schemas, rate limiting, and gateway management'),
  ('s1000000-0000-0000-0000-000000000012', 'Docker & Kubernetes Orchestration', 'DevOps', 'Containerization, cluster auto-scaling, and CI/CD deployment pipelines')
ON CONFLICT (name) DO NOTHING;

-- Skill Relations
INSERT INTO skill_relations (source_skill_id, target_skill_id, relation_type, transferability_score) VALUES
  ('s1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000002', 'prerequisite', 0.90),
  ('s1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000003', 'transferable', 0.85),
  ('s1000000-0000-0000-0000-000000000004', 's1000000-0000-0000-0000-000000000005', 'prerequisite', 0.88),
  ('s1000000-0000-0000-0000-000000000006', 's1000000-0000-0000-0000-000000000005', 'transferable', 0.75),
  ('s1000000-0000-0000-0000-000000000007', 's1000000-0000-0000-0000-000000000009', 'related', 0.70)
ON CONFLICT DO NOTHING;

-- Open Internal Roles (15 sample postings covering jobs, projects, teams, career opportunities)
INSERT INTO roles (id, title, department_id, location, opportunity_type, status, description, min_years_exp) VALUES
  ('r1000000-0000-0000-0000-000000000001', 'Staff AI Systems Architect', 'd1000000-0000-0000-0000-000000000003', 'San Francisco / Remote', 'job', 'open', 'Lead enterprise AI discovery platform architecture and LLM RAG pipelines.', 6),
  ('r1000000-0000-0000-0000-000000000002', 'Senior Full-Stack Tech Lead', 'd1000000-0000-0000-0000-000000000001', 'New York / Hybrid', 'job', 'open', 'Architect resilient Next.js web applications, Supabase integrations, and real-time analytics.', 5),
  ('r1000000-0000-0000-0000-000000000003', 'Generative AI Platform Taskforce', 'd1000000-0000-0000-0000-000000000003', 'Remote', 'project', 'open', 'Cross-departmental initiative building enterprise vector search and AI agent tools.', 3),
  ('r1000000-0000-0000-0000-000000000004', 'Lead Product Manager - Internal Mobility', 'd1000000-0000-0000-0000-000000000002', 'Austin / Hybrid', 'job', 'open', 'Drive talent discovery roadmap, career progression frameworks, and HR analytics.', 4),
  ('r1000000-0000-0000-0000-000000000005', 'Principal Cyber Security Strategist', 'd1000000-0000-0000-0000-000000000004', 'Chicago / Onsite', 'career_opportunity', 'open', 'Direct enterprise threat modeling, zero-trust RLS policies, and vulnerability defense.', 7)
ON CONFLICT (id) DO NOTHING;

-- Role Skills Requirements
INSERT INTO role_skills (role_id, skill_id, required_proficiency, importance_weight, is_required) VALUES
  ('r1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000005', 5, 0.95, true),
  ('r1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000004', 4, 0.85, true),
  ('r1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000006', 4, 0.75, false),
  ('r1000000-0000-0000-0000-000000000002', 's1000000-0000-0000-0000-000000000001', 5, 0.90, true),
  ('r1000000-0000-0000-0000-000000000002', 's1000000-0000-0000-0000-000000000002', 5, 0.90, true),
  ('r1000000-0000-0000-0000-000000000002', 's1000000-0000-0000-0000-000000000003', 4, 0.80, true),
  ('r1000000-0000-0000-0000-000000000004', 's1000000-0000-0000-0000-000000000007', 5, 0.95, true),
  ('r1000000-0000-0000-0000-000000000004', 's1000000-0000-0000-0000-000000000009', 4, 0.70, false)
ON CONFLICT DO NOTHING;

-- Learning Resources (Sample covering course, certification, project, learning_activity)
INSERT INTO learning_resources (id, title, provider, resource_url, type, estimated_hours, target_skill_id, difficulty_level) VALUES
  ('l1000000-0000-0000-0000-000000000001', 'Advanced Vector Search & RAG Systems', 'DeepLearning.AI', 'https://coursera.org/learn/vector-rag', 'course', 24, 's1000000-0000-0000-0000-000000000005', 'Advanced'),
  ('l1000000-0000-0000-0000-000000000002', 'AWS Certified Machine Learning Specialist', 'AWS Training', 'https://aws.amazon.com/certification/ml-specialist', 'certification', 60, 's1000000-0000-0000-0000-000000000004', 'Expert'),
  ('l1000000-0000-0000-0000-000000000003', 'Enterprise Next.js 14 App Router Workshop', 'Frontend Masters', 'https://frontendmasters.com/courses/nextjs', 'course', 16, 's1000000-0000-0000-0000-000000000002', 'Intermediate'),
  ('l1000000-0000-0000-0000-000000000004', 'Internal Talent Discovery Hackathon', 'TalentLens Academy', 'https://talentlens.ai/hackathons/talent', 'project', 30, 's1000000-0000-0000-0000-000000000001', 'Intermediate'),
  ('l1000000-0000-0000-0000-000000000005', 'Postgres Query Optimization & Indexing', 'Postgres Guild', 'https://postgres.org/courses/indexing', 'learning_activity', 12, 's1000000-0000-0000-0000-000000000006', 'Intermediate')
ON CONFLICT (id) DO NOTHING;

-- Strategic HR Initiatives
INSERT INTO initiatives (id, title, description, target_quarter, status, department_id) VALUES
  ('i1000000-0000-0000-0000-000000000001', 'AI First Enterprise Transformation', 'Upskilling 100+ software engineers in vector embeddings, prompt engineering, and LLM orchestration.', 'Q4 2026', 'active', 'd1000000-0000-0000-0000-000000000003'),
  ('i1000000-0000-0000-0000-000000000002', 'Zero Trust Cloud Compliance Shift', 'Strengthening enterprise RLS security policies, IAM access control, and vulnerability detection.', 'Q1 2027', 'planned', 'd1000000-0000-0000-0000-000000000004')
ON CONFLICT (id) DO NOTHING;

INSERT INTO initiative_skills (initiative_id, skill_id, required_count, target_proficiency, source, rationale) VALUES
  ('i1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000005', 12, 4, 'hr_defined', 'Required for upcoming RAG assistant integration'),
  ('i1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000004', 15, 4, 'ai_predicted', 'Predicted demand based on ML model deployment roadmap')
ON CONFLICT DO NOTHING;
