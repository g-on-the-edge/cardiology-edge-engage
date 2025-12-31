-- Cleanup Script: Remove tables from wrong project (AOR system)
-- Created: 2025-12-22
-- Reason: Tables were accidentally created from a different project
--
-- Run this in Supabase SQL Editor to remove the incorrect tables

-- Drop the AOR (Areas of Responsibility) tables
-- These must be dropped in order due to foreign key dependencies
DROP TABLE IF EXISTS public.aor_presence CASCADE;
DROP TABLE IF EXISTS public.aor_versions CASCADE;
DROP TABLE IF EXISTS public.aor_communication CASCADE;
DROP TABLE IF EXISTS public.aor_scorecard CASCADE;
DROP TABLE IF EXISTS public.aor_strategic_planning CASCADE;
DROP TABLE IF EXISTS public.aor_people_capacity CASCADE;
DROP TABLE IF EXISTS public.aor_scope CASCADE;
DROP TABLE IF EXISTS public.aor_collaborators CASCADE;
DROP TABLE IF EXISTS public.aor_operating_models CASCADE;

-- Drop organization-related tables from wrong project
DROP TABLE IF EXISTS public.shared_accountability_requests CASCADE;
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.org_memberships CASCADE;
DROP TABLE IF EXISTS public.departments CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;
DROP TABLE IF EXISTS public.organizations CASCADE;

-- Verification: Run this after cleanup to confirm only correct tables remain
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
