-- 1. Profile Creation Trigger on Auth Signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role_title)
  VALUES (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', 'Employee'), 'Team Member');
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. Roadmap Item Status & Timestamp Trigger (BEFORE UPDATE)
CREATE OR REPLACE FUNCTION set_roadmap_item_completed_at()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    NEW.completed_at = now();
  ELSIF NEW.status != 'completed' THEN
    NEW.completed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_roadmap_item_status ON roadmap_items;
CREATE TRIGGER trg_roadmap_item_status
  BEFORE UPDATE ON roadmap_items
  FOR EACH ROW EXECUTE FUNCTION set_roadmap_item_completed_at();

-- 3. Roadmap Progress Recomputation Trigger (AFTER INSERT/UPDATE/DELETE)
CREATE OR REPLACE FUNCTION recompute_roadmap_progress()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE
  v_roadmap_id uuid;
  v_total int;
  v_completed int;
  v_pct float;
BEGIN
  v_roadmap_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.roadmap_id ELSE NEW.roadmap_id END;

  SELECT count(*), count(*) FILTER (WHERE status = 'completed')
  INTO v_total, v_completed
  FROM roadmap_items WHERE roadmap_id = v_roadmap_id;

  IF v_total > 0 THEN
    v_pct := (v_completed::float / v_total::float) * 100.0;
  ELSE
    v_pct := 0.0;
  END IF;

  UPDATE roadmaps SET
    overall_progress_pct = v_pct,
    status = CASE
      WHEN v_total = 0 THEN 'not_started'
      WHEN v_pct = 100.0 THEN 'completed'
      ELSE 'in_progress'
    END
  WHERE id = v_roadmap_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_roadmap_progress_sync ON roadmap_items;
CREATE TRIGGER trg_roadmap_progress_sync
  AFTER INSERT OR UPDATE OR DELETE ON roadmap_items
  FOR EACH ROW EXECUTE FUNCTION recompute_roadmap_progress();
