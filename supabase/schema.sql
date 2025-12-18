-- Edge Engage Project Workspace Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone_number TEXT,  -- For Twilio SMS notifications
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'owner', 'member', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('planning', 'active', 'paused', 'completed', 'archived')),
  current_phase INTEGER DEFAULT 1 CHECK (current_phase BETWEEN 1 AND 3),
  gate_approved BOOLEAN DEFAULT FALSE,
  gate_approved_at TIMESTAMPTZ,
  gate_approved_by UUID REFERENCES public.users(id),
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project members (many-to-many relationship)
CREATE TABLE public.project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'contributor' CHECK (role IN ('sponsor', 'owner', 'contributor', 'viewer')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Step progress tracking
CREATE TABLE public.step_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  step_id TEXT NOT NULL,  -- e.g., '1.1', '2.3', 'G.1'
  phase INTEGER NOT NULL,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'blocked')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES public.users(id),
  notes TEXT,
  UNIQUE(project_id, step_id)
);

-- Deliverables tracking
CREATE TABLE public.deliverables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  phase INTEGER NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'draft', 'review', 'approved')),
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assets (files, links, documents)
CREATE TABLE public.assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  uploaded_by UUID REFERENCES public.users(id),
  type TEXT NOT NULL CHECK (type IN ('file', 'link', 'video', 'document', 'image')),
  name TEXT NOT NULL,
  description TEXT,
  url TEXT,  -- For links or Supabase Storage path
  mime_type TEXT,
  file_size INTEGER,
  thumbnail_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asset attachments (linking assets to steps/deliverables/etc)
CREATE TABLE public.asset_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE NOT NULL,
  attachable_type TEXT NOT NULL CHECK (attachable_type IN ('step', 'deliverable', 'meeting', 'comment')),
  attachable_id TEXT NOT NULL,  -- Could be step_id like '1.1' or UUID
  attached_by UUID REFERENCES public.users(id),
  attached_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity log (timeline/history)
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,  -- e.g., 'step_completed', 'asset_added', 'comment_added'
  entity_type TEXT,  -- 'step', 'deliverable', 'asset', 'meeting'
  entity_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id),
  commentable_type TEXT NOT NULL CHECK (commentable_type IN ('step', 'deliverable', 'asset', 'meeting')),
  commentable_id TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id),  -- For threaded replies
  content TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_by UUID REFERENCES public.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meetings
CREATE TABLE public.meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  meeting_type TEXT CHECK (meeting_type IN ('kickoff', 'phase_review', 'gate_review', 'discovery', 'standup', 'retrospective', 'other')),
  scheduled_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  location TEXT,
  meeting_link TEXT,
  summary TEXT,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meeting attendees
CREATE TABLE public.meeting_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id),
  attendance_status TEXT DEFAULT 'invited' CHECK (attendance_status IN ('invited', 'accepted', 'declined', 'attended', 'absent')),
  role TEXT,  -- 'facilitator', 'note_taker', 'attendee'
  UNIQUE(meeting_id, user_id)
);

-- Meeting action items
CREATE TABLE public.meeting_action_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE NOT NULL,
  assigned_to UUID REFERENCES public.users(id),
  description TEXT NOT NULL,
  due_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meeting decisions
CREATE TABLE public.meeting_decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE NOT NULL,
  decision TEXT NOT NULL,
  rationale TEXT,
  decided_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gate approvals (sign-offs)
CREATE TABLE public.gate_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  gate_step_id TEXT NOT NULL,  -- 'G.1' or 'G.2'
  approved_by UUID REFERENCES public.users(id),
  signature TEXT,  -- Typed name or reference to signature asset
  comments TEXT,
  approved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, gate_step_id, approved_by)
);

-- Scorecard metrics
CREATE TABLE public.scorecard_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,  -- 'quality', 'financial', 'operational', 'satisfaction'
  unit TEXT,  -- 'percentage', 'count', 'currency', 'days'
  baseline_value DECIMAL,
  target_1year DECIMAL,
  target_3year DECIMAL,
  target_5year DECIMAL,
  current_value DECIMAL,
  trend TEXT CHECK (trend IN ('up', 'down', 'stable', 'unknown')),
  last_updated TIMESTAMPTZ,
  updated_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications tracking
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('file_upload', 'phase_completed', 'project_assignment', 'gate_passed', 'comment_added', 'general')),
  message TEXT NOT NULL,
  sent_via TEXT CHECK (sent_via IN ('sms', 'email', 'both')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'read')),
  metadata JSONB DEFAULT '{}',
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification preferences
CREATE TABLE public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  via_sms BOOLEAN DEFAULT TRUE,
  via_email BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id, type)
);

-- Scorecard value history
CREATE TABLE public.scorecard_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_id UUID REFERENCES public.scorecard_metrics(id) ON DELETE CASCADE NOT NULL,
  value DECIMAL NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  recorded_by UUID REFERENCES public.users(id),
  notes TEXT
);

-- Create indexes for better query performance
CREATE INDEX idx_project_members_project ON public.project_members(project_id);
CREATE INDEX idx_project_members_user ON public.project_members(user_id);
CREATE INDEX idx_step_progress_project ON public.step_progress(project_id);
CREATE INDEX idx_assets_project ON public.assets(project_id);
CREATE INDEX idx_asset_attachments_asset ON public.asset_attachments(asset_id);
CREATE INDEX idx_asset_attachments_target ON public.asset_attachments(attachable_type, attachable_id);
CREATE INDEX idx_activities_project ON public.activities(project_id);
CREATE INDEX idx_activities_created ON public.activities(created_at DESC);
CREATE INDEX idx_comments_project ON public.comments(project_id);
CREATE INDEX idx_comments_target ON public.comments(commentable_type, commentable_id);
CREATE INDEX idx_meetings_project ON public.meetings(project_id);
CREATE INDEX idx_meetings_scheduled ON public.meetings(scheduled_at);

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

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_deliverables_updated_at BEFORE UPDATE ON public.deliverables FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON public.meetings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Create storage bucket for project assets
INSERT INTO storage.buckets (id, name, public) VALUES ('project-assets', 'project-assets', false);

-- Storage policies
CREATE POLICY "Project members can view assets" ON storage.objects FOR SELECT
  USING (bucket_id = 'project-assets' AND (storage.foldername(name))[1] IN (
    SELECT project_id::text FROM public.project_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Contributors can upload assets" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-assets' AND (storage.foldername(name))[1] IN (
    SELECT project_id::text FROM public.project_members WHERE user_id = auth.uid() AND role IN ('owner', 'sponsor', 'contributor')
  ));

CREATE POLICY "Asset uploader can delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'project-assets' AND auth.uid()::text = (storage.foldername(name))[2]);
