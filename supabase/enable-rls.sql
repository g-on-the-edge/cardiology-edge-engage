-- Enable Row Level Security (RLS) and Add Security Policies
-- Run this to secure your existing tables

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.step_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gate_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scorecard_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scorecard_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_clients ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view member projects" ON public.projects;
DROP POLICY IF EXISTS "Users can create projects" ON public.projects;
DROP POLICY IF EXISTS "Project owners can update" ON public.projects;
DROP POLICY IF EXISTS "View project members" ON public.project_members;
DROP POLICY IF EXISTS "Owners can manage members" ON public.project_members;
DROP POLICY IF EXISTS "Members can view step progress" ON public.step_progress;
DROP POLICY IF EXISTS "Contributors can update step progress" ON public.step_progress;
DROP POLICY IF EXISTS "Members can view deliverables" ON public.deliverables;
DROP POLICY IF EXISTS "Contributors can manage deliverables" ON public.deliverables;
DROP POLICY IF EXISTS "Members can view assets" ON public.assets;
DROP POLICY IF EXISTS "Contributors can add assets" ON public.assets;
DROP POLICY IF EXISTS "Asset owner can update" ON public.assets;
DROP POLICY IF EXISTS "Members can view attachments" ON public.asset_attachments;
DROP POLICY IF EXISTS "Contributors can add attachments" ON public.asset_attachments;
DROP POLICY IF EXISTS "Members can view activities" ON public.activities;
DROP POLICY IF EXISTS "System can insert activities" ON public.activities;
DROP POLICY IF EXISTS "Members can view comments" ON public.comments;
DROP POLICY IF EXISTS "Contributors can add comments" ON public.comments;
DROP POLICY IF EXISTS "Comment owner can update" ON public.comments;
DROP POLICY IF EXISTS "Members can view meetings" ON public.meetings;
DROP POLICY IF EXISTS "Contributors can manage meetings" ON public.meetings;
DROP POLICY IF EXISTS "View meeting attendees" ON public.meeting_attendees;
DROP POLICY IF EXISTS "Manage meeting attendees" ON public.meeting_attendees;
DROP POLICY IF EXISTS "View action items" ON public.meeting_action_items;
DROP POLICY IF EXISTS "Manage action items" ON public.meeting_action_items;
DROP POLICY IF EXISTS "View decisions" ON public.meeting_decisions;
DROP POLICY IF EXISTS "Manage decisions" ON public.meeting_decisions;
DROP POLICY IF EXISTS "Members can view approvals" ON public.gate_approvals;
DROP POLICY IF EXISTS "Sponsors can approve gates" ON public.gate_approvals;
DROP POLICY IF EXISTS "Members can view metrics" ON public.scorecard_metrics;
DROP POLICY IF EXISTS "Contributors can manage metrics" ON public.scorecard_metrics;
DROP POLICY IF EXISTS "Members can view history" ON public.scorecard_history;
DROP POLICY IF EXISTS "Contributors can add history" ON public.scorecard_history;

-- RLS Policies

-- Users: Users can read all users, update their own profile
CREATE POLICY "Users can view all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Projects: Users can see projects they're members of
CREATE POLICY "Users can view member projects" ON public.projects FOR SELECT
  USING (id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can create projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Project owners can update" ON public.projects FOR UPDATE
  USING (id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid() AND role IN ('owner', 'sponsor')));

-- Project members: Users can see members of their projects
CREATE POLICY "View project members" ON public.project_members FOR SELECT
  USING (project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid()));
CREATE POLICY "Owners can manage members" ON public.project_members FOR ALL
  USING (project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid() AND role IN ('owner', 'sponsor')));

-- Step progress: Project members can view and update
CREATE POLICY "Members can view step progress" ON public.step_progress FOR SELECT
  USING (project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid()));
CREATE POLICY "Contributors can update step progress" ON public.step_progress FOR ALL
  USING (project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid() AND role IN ('owner', 'sponsor', 'contributor')));

-- Deliverables: Similar to step progress
CREATE POLICY "Members can view deliverables" ON public.deliverables FOR SELECT
  USING (project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid()));
CREATE POLICY "Contributors can manage deliverables" ON public.deliverables FOR ALL
  USING (project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid() AND role IN ('owner', 'sponsor', 'contributor')));

-- Assets: Project members can view, contributors can add
CREATE POLICY "Members can view assets" ON public.assets FOR SELECT
  USING (project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid()));
CREATE POLICY "Contributors can add assets" ON public.assets FOR INSERT
  WITH CHECK (project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid() AND role IN ('owner', 'sponsor', 'contributor')));
CREATE POLICY "Asset owner can update" ON public.assets FOR UPDATE
  USING (uploaded_by = auth.uid() OR project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid() AND role IN ('owner', 'sponsor')));

-- Asset attachments
CREATE POLICY "Members can view attachments" ON public.asset_attachments FOR SELECT
  USING (asset_id IN (SELECT id FROM public.assets WHERE project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid())));
CREATE POLICY "Contributors can add attachments" ON public.asset_attachments FOR INSERT
  WITH CHECK (asset_id IN (SELECT id FROM public.assets WHERE project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid() AND role IN ('owner', 'sponsor', 'contributor'))));

-- Activities: Members can view
CREATE POLICY "Members can view activities" ON public.activities FOR SELECT
  USING (project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid()));
CREATE POLICY "System can insert activities" ON public.activities FOR INSERT
  WITH CHECK (project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid()));

-- Comments: Members can view and add
CREATE POLICY "Members can view comments" ON public.comments FOR SELECT
  USING (project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid()));
CREATE POLICY "Contributors can add comments" ON public.comments FOR INSERT
  WITH CHECK (project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid() AND role IN ('owner', 'sponsor', 'contributor')));
CREATE POLICY "Comment owner can update" ON public.comments FOR UPDATE
  USING (user_id = auth.uid());

-- Meetings: Members can view, contributors can manage
CREATE POLICY "Members can view meetings" ON public.meetings FOR SELECT
  USING (project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid()));
CREATE POLICY "Contributors can manage meetings" ON public.meetings FOR ALL
  USING (project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid() AND role IN ('owner', 'sponsor', 'contributor')));

-- Meeting related tables follow same pattern
CREATE POLICY "View meeting attendees" ON public.meeting_attendees FOR SELECT
  USING (meeting_id IN (SELECT id FROM public.meetings WHERE project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid())));
CREATE POLICY "Manage meeting attendees" ON public.meeting_attendees FOR ALL
  USING (meeting_id IN (SELECT id FROM public.meetings WHERE project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid() AND role IN ('owner', 'sponsor', 'contributor'))));

CREATE POLICY "View action items" ON public.meeting_action_items FOR SELECT
  USING (meeting_id IN (SELECT id FROM public.meetings WHERE project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid())));
CREATE POLICY "Manage action items" ON public.meeting_action_items FOR ALL
  USING (meeting_id IN (SELECT id FROM public.meetings WHERE project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid() AND role IN ('owner', 'sponsor', 'contributor'))));

CREATE POLICY "View decisions" ON public.meeting_decisions FOR SELECT
  USING (meeting_id IN (SELECT id FROM public.meetings WHERE project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid())));
CREATE POLICY "Manage decisions" ON public.meeting_decisions FOR ALL
  USING (meeting_id IN (SELECT id FROM public.meetings WHERE project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid() AND role IN ('owner', 'sponsor', 'contributor'))));

-- Gate approvals: Only sponsors/owners can approve
CREATE POLICY "Members can view approvals" ON public.gate_approvals FOR SELECT
  USING (project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid()));
CREATE POLICY "Sponsors can approve gates" ON public.gate_approvals FOR INSERT
  WITH CHECK (project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid() AND role IN ('owner', 'sponsor')));

-- Scorecard: Members can view, contributors can update
CREATE POLICY "Members can view metrics" ON public.scorecard_metrics FOR SELECT
  USING (project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid()));
CREATE POLICY "Contributors can manage metrics" ON public.scorecard_metrics FOR ALL
  USING (project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid() AND role IN ('owner', 'sponsor', 'contributor')));

CREATE POLICY "Members can view history" ON public.scorecard_history FOR SELECT
  USING (metric_id IN (SELECT id FROM public.scorecard_metrics WHERE project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid())));
CREATE POLICY "Contributors can add history" ON public.scorecard_history FOR INSERT
  WITH CHECK (metric_id IN (SELECT id FROM public.scorecard_metrics WHERE project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid() AND role IN ('owner', 'sponsor', 'contributor'))));

-- Notifications: Users can only see their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT
  WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Notification preferences: Users can manage their own preferences
CREATE POLICY "Users can view own preferences" ON public.notification_preferences FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "Users can manage own preferences" ON public.notification_preferences FOR ALL
  USING (user_id = auth.uid());

-- OAuth: Users can only see their own OAuth data
CREATE POLICY "Users can view own authorizations" ON public.oauth_authorizations FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "System can create authorizations" ON public.oauth_authorizations FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own tokens" ON public.oauth_tokens FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "System can manage tokens" ON public.oauth_tokens FOR ALL
  USING (true);

-- OAuth clients: Admins and creators can manage
CREATE POLICY "Users can view clients" ON public.oauth_clients FOR SELECT
  USING (true);
CREATE POLICY "Creators can manage clients" ON public.oauth_clients FOR ALL
  USING (created_by = auth.uid());
