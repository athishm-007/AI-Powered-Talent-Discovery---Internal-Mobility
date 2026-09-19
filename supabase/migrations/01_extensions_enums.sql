-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Idempotent Enums DDL
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'explicit_inferred_enum') THEN
        CREATE TYPE explicit_inferred_enum AS ENUM ('explicit', 'inferred');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'skill_relation_enum') THEN
        CREATE TYPE skill_relation_enum AS ENUM ('transferable', 'prerequisite', 'related');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'opportunity_type_enum') THEN
        CREATE TYPE opportunity_type_enum AS ENUM ('job', 'project', 'team', 'career_opportunity');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'snapshot_trigger_enum') THEN
        CREATE TYPE snapshot_trigger_enum AS ENUM ('resume', 'experience', 'project', 'learning', 'manual');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'initiative_skill_source_enum') THEN
        CREATE TYPE initiative_skill_source_enum AS ENUM ('hr_defined', 'ai_predicted');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'resource_type_enum') THEN
        CREATE TYPE resource_type_enum AS ENUM ('course', 'certification', 'project', 'learning_activity');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'roadmap_phase_enum') THEN
        CREATE TYPE roadmap_phase_enum AS ENUM ('0-3_months', '3-6_months', '6-12_months');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'roadmap_status_enum') THEN
        CREATE TYPE roadmap_status_enum AS ENUM ('not_started', 'in_progress', 'completed');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'roadmap_item_status_enum') THEN
        CREATE TYPE roadmap_item_status_enum AS ENUM ('pending', 'in_progress', 'completed');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'chat_sender_enum') THEN
        CREATE TYPE chat_sender_enum AS ENUM ('user', 'assistant');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'recommendation_item_type_enum') THEN
        CREATE TYPE recommendation_item_type_enum AS ENUM ('match', 'gap', 'resource', 'roadmap');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'outcome_type_enum') THEN
        CREATE TYPE outcome_type_enum AS ENUM ('applied', 'promoted', 'moved', 'completed_course');
    END IF;
END $$;
