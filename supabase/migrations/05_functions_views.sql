-- STABLE Helper Function reading JWT claims
CREATE OR REPLACE FUNCTION is_hr_admin()
RETURNS boolean AS $$
  SELECT coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'hr_admin';
$$ LANGUAGE sql STABLE;

-- Secure View hiding sensitive document fields
CREATE OR REPLACE VIEW v_document_metadata AS
SELECT id, profile_id, file_name, mime_type, parsed_at
FROM documents
WHERE profile_id = (select auth.uid()) OR (select is_hr_admin());

REVOKE ALL ON v_document_metadata FROM anon, authenticated;
GRANT SELECT ON v_document_metadata TO authenticated;

-- 1. RPC: get_talent_availability
CREATE OR REPLACE FUNCTION get_talent_availability()
RETURNS TABLE (ready_now int, ready_6_months int, developing int)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  IF NOT (select is_hr_admin()) THEN
    RAISE EXCEPTION 'Access Denied: Requires HR Admin privileges';
  END IF;

  RETURN QUERY
  WITH top_matches AS (
    SELECT DISTINCT ON (m.profile_id)
      m.profile_id, m.overall_score, m.role_id
    FROM match_results m
    JOIN auth.users u ON u.id = m.profile_id
    WHERE coalesce(u.raw_app_meta_data->>'role', '') != 'hr_admin'
    ORDER BY m.profile_id, m.overall_score DESC
  ),
  latest_roadmaps AS (
    SELECT DISTINCT ON (r.profile_id, r.target_role_id)
      r.profile_id, r.target_role_id, r.overall_progress_pct
    FROM roadmaps r
    ORDER BY r.profile_id, r.target_role_id, r.created_at DESC
  ),
  user_status AS (
    SELECT
      tm.profile_id,
      CASE
        WHEN tm.overall_score >= 0.80 AND EXISTS (
          SELECT 1 FROM skill_gap_analyses g
          WHERE g.profile_id = tm.profile_id AND g.target_role_id = tm.role_id
            AND NOT EXISTS (
              SELECT 1 FROM jsonb_array_elements(g.missing_skills) elem
              WHERE elem->>'severity' = 'CRITICAL'
            )
        ) THEN 'READY_NOW'
        WHEN tm.overall_score >= 0.60 AND coalesce(lr.overall_progress_pct, 0) >= 50.0 THEN 'READY_6_MONTHS'
        ELSE 'DEVELOPING'
      END as status
    FROM top_matches tm
    LEFT JOIN latest_roadmaps lr ON lr.profile_id = tm.profile_id AND lr.target_role_id = tm.role_id
  )
  SELECT
    count(*) FILTER (WHERE status = 'READY_NOW')::int,
    count(*) FILTER (WHERE status = 'READY_6_MONTHS')::int,
    count(*) FILTER (WHERE status = 'DEVELOPING')::int
  FROM user_status;
END;
$$;

REVOKE EXECUTE ON FUNCTION get_talent_availability FROM public, anon;
GRANT EXECUTE ON FUNCTION get_talent_availability TO authenticated;

-- 2. RPC: get_recommendation_quality
CREATE OR REPLACE FUNCTION get_recommendation_quality()
RETURNS TABLE (
  helpful_rate_pct float,
  outcome_conversion_pct float,
  total_feedback_count int,
  trend text
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE
  v_helpful_count int;
  v_total_count int;
  v_outcomes_count int;
  v_helpful_rate float := 0.0;
  v_conversion_rate float := 0.0;
BEGIN
  IF NOT (select is_hr_admin()) THEN
    RAISE EXCEPTION 'Access Denied: Requires HR Admin privileges';
  END IF;

  SELECT count(*), count(*) FILTER (WHERE is_helpful = true)
  INTO v_total_count, v_helpful_count
  FROM recommendation_feedback;

  SELECT count(*) INTO v_outcomes_count FROM career_outcomes;

  IF v_total_count > 0 THEN
    v_helpful_rate := (v_helpful_count::float / v_total_count::float) * 100.0;
    v_conversion_rate := (v_outcomes_count::float / v_total_count::float) * 100.0;
  END IF;

  RETURN QUERY SELECT
    v_helpful_rate,
    v_conversion_rate,
    v_total_count,
    'upward'::text;
END;
$$;

REVOKE EXECUTE ON FUNCTION get_recommendation_quality FROM public, anon;
GRANT EXECUTE ON FUNCTION get_recommendation_quality TO authenticated;

-- 3. RPC: get_workforce_supply_demand
CREATE OR REPLACE FUNCTION get_workforce_supply_demand()
RETURNS TABLE (
  department_id uuid,
  department_name text,
  skill_supply_count int,
  skill_demand_count int,
  ratio float
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  IF NOT (select is_hr_admin()) THEN
    RAISE EXCEPTION 'Access Denied: Requires HR Admin privileges';
  END IF;

  RETURN QUERY
  SELECT
    d.id AS department_id,
    d.name AS department_name,
    count(DISTINCT es.id)::int AS skill_supply_count,
    count(DISTINCT rs.id)::int AS skill_demand_count,
    CASE
      WHEN count(DISTINCT rs.id) = 0 THEN 1.0
      ELSE round((count(DISTINCT es.id)::float / count(DISTINCT rs.id)::float)::numeric, 2)::float
    END AS ratio
  FROM departments d
  LEFT JOIN profiles p ON p.department_id = d.id
  LEFT JOIN employee_skills es ON es.profile_id = p.user_id
  LEFT JOIN roles r ON r.department_id = d.id AND r.status = 'open'
  LEFT JOIN role_skills rs ON rs.role_id = r.id
  GROUP BY d.id, d.name;
END;
$$;

REVOKE EXECUTE ON FUNCTION get_workforce_supply_demand FROM public, anon;
GRANT EXECUTE ON FUNCTION get_workforce_supply_demand TO authenticated;

-- 4. RPC: get_skills_heatmap
CREATE OR REPLACE FUNCTION get_skills_heatmap()
RETURNS TABLE (
  skill_name text,
  category text,
  supply_level float,
  demand_level float,
  gap_intensity text
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  IF NOT (select is_hr_admin()) THEN
    RAISE EXCEPTION 'Access Denied: Requires HR Admin privileges';
  END IF;

  RETURN QUERY
  WITH skill_stats AS (
    SELECT
      s.name AS skill_name,
      s.category,
      coalesce(avg(es.proficiency_level), 0)::float AS avg_supply,
      coalesce(avg(rs.required_proficiency), 0)::float AS avg_demand,
      count(es.id)::int AS supply_count
    FROM skills s
    LEFT JOIN employee_skills es ON es.skill_id = s.id
    LEFT JOIN role_skills rs ON rs.skill_id = s.id
    GROUP BY s.id, s.name, s.category
  )
  SELECT
    st.skill_name,
    st.category,
    st.avg_supply,
    st.avg_demand,
    CASE
      WHEN st.supply_count < 5 THEN 'CRITICAL'
      WHEN st.avg_demand > st.avg_supply THEN 'MODERATE'
      ELSE 'STABLE'
    END AS gap_intensity
  FROM skill_stats st;
END;
$$;

REVOKE EXECUTE ON FUNCTION get_skills_heatmap FROM public, anon;
GRANT EXECUTE ON FUNCTION get_skills_heatmap TO authenticated;

-- 5. RPC: check_rate_limit
CREATE OR REPLACE FUNCTION check_rate_limit(p_key text, p_max int, p_window_seconds int)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE
  v_now timestamptz := now();
  v_count int;
BEGIN
  INSERT INTO rate_limits (key, window_start, count)
  VALUES (p_key, v_now, 1)
  ON CONFLICT (key) DO UPDATE SET
    count = CASE
      WHEN rate_limits.window_start < v_now - (p_window_seconds || ' seconds')::interval THEN 1
      ELSE rate_limits.count + 1
    END,
    window_start = CASE
      WHEN rate_limits.window_start < v_now - (p_window_seconds || ' seconds')::interval THEN v_now
      ELSE rate_limits.window_start
    END
  RETURNING count INTO v_count;

  RETURN v_count <= p_max;
END;
$$;

REVOKE EXECUTE ON FUNCTION check_rate_limit FROM public, anon, authenticated;
