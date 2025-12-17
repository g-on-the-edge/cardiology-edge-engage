export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          status: 'planning' | 'active' | 'paused' | 'completed' | 'archived';
          current_phase: number;
          gate_approved: boolean;
          gate_approved_at: string | null;
          gate_approved_by: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          status?: 'planning' | 'active' | 'paused' | 'completed' | 'archived';
          current_phase?: number;
          gate_approved?: boolean;
          gate_approved_at?: string | null;
          gate_approved_by?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          status?: 'planning' | 'active' | 'paused' | 'completed' | 'archived';
          current_phase?: number;
          gate_approved?: boolean;
          gate_approved_at?: string | null;
          gate_approved_by?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'admin' | 'owner' | 'member' | 'viewer';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'owner' | 'member' | 'viewer';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'owner' | 'member' | 'viewer';
          created_at?: string;
          updated_at?: string;
        };
      };
      project_members: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          role: 'sponsor' | 'owner' | 'contributor' | 'viewer';
          joined_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          role?: 'sponsor' | 'owner' | 'contributor' | 'viewer';
          joined_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          user_id?: string;
          role?: 'sponsor' | 'owner' | 'contributor' | 'viewer';
          joined_at?: string;
        };
      };
      step_progress: {
        Row: {
          id: string;
          project_id: string;
          step_id: string;
          phase: number;
          status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
          started_at: string | null;
          completed_at: string | null;
          completed_by: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          project_id: string;
          step_id: string;
          phase: number;
          status?: 'not_started' | 'in_progress' | 'completed' | 'blocked';
          started_at?: string | null;
          completed_at?: string | null;
          completed_by?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          project_id?: string;
          step_id?: string;
          phase?: number;
          status?: 'not_started' | 'in_progress' | 'completed' | 'blocked';
          started_at?: string | null;
          completed_at?: string | null;
          completed_by?: string | null;
          notes?: string | null;
        };
      };
      deliverables: {
        Row: {
          id: string;
          project_id: string;
          phase: number;
          title: string;
          status: 'pending' | 'in_progress' | 'draft' | 'review' | 'approved';
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          phase: number;
          title: string;
          status?: 'pending' | 'in_progress' | 'draft' | 'review' | 'approved';
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          phase?: number;
          title?: string;
          status?: 'pending' | 'in_progress' | 'draft' | 'review' | 'approved';
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      assets: {
        Row: {
          id: string;
          project_id: string;
          uploaded_by: string | null;
          type: 'file' | 'link' | 'video' | 'document' | 'image';
          name: string;
          description: string | null;
          url: string | null;
          mime_type: string | null;
          file_size: number | null;
          thumbnail_url: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          uploaded_by?: string | null;
          type: 'file' | 'link' | 'video' | 'document' | 'image';
          name: string;
          description?: string | null;
          url?: string | null;
          mime_type?: string | null;
          file_size?: number | null;
          thumbnail_url?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          uploaded_by?: string | null;
          type?: 'file' | 'link' | 'video' | 'document' | 'image';
          name?: string;
          description?: string | null;
          url?: string | null;
          mime_type?: string | null;
          file_size?: number | null;
          thumbnail_url?: string | null;
          metadata?: Json;
          created_at?: string;
        };
      };
      asset_attachments: {
        Row: {
          id: string;
          asset_id: string;
          attachable_type: 'step' | 'deliverable' | 'meeting' | 'comment';
          attachable_id: string;
          attached_by: string | null;
          attached_at: string;
        };
        Insert: {
          id?: string;
          asset_id: string;
          attachable_type: 'step' | 'deliverable' | 'meeting' | 'comment';
          attachable_id: string;
          attached_by?: string | null;
          attached_at?: string;
        };
        Update: {
          id?: string;
          asset_id?: string;
          attachable_type?: 'step' | 'deliverable' | 'meeting' | 'comment';
          attachable_id?: string;
          attached_by?: string | null;
          attached_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          project_id: string;
          user_id: string | null;
          action: string;
          entity_type: string | null;
          entity_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id?: string | null;
          action: string;
          entity_type?: string | null;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          user_id?: string | null;
          action?: string;
          entity_type?: string | null;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          project_id: string;
          user_id: string | null;
          commentable_type: 'step' | 'deliverable' | 'asset' | 'meeting';
          commentable_id: string;
          parent_id: string | null;
          content: string;
          is_resolved: boolean;
          resolved_by: string | null;
          resolved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id?: string | null;
          commentable_type: 'step' | 'deliverable' | 'asset' | 'meeting';
          commentable_id: string;
          parent_id?: string | null;
          content: string;
          is_resolved?: boolean;
          resolved_by?: string | null;
          resolved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          user_id?: string | null;
          commentable_type?: 'step' | 'deliverable' | 'asset' | 'meeting';
          commentable_id?: string;
          parent_id?: string | null;
          content?: string;
          is_resolved?: boolean;
          resolved_by?: string | null;
          resolved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      meetings: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          meeting_type: 'kickoff' | 'phase_review' | 'gate_review' | 'discovery' | 'standup' | 'retrospective' | 'other' | null;
          scheduled_at: string | null;
          duration_minutes: number | null;
          location: string | null;
          meeting_link: string | null;
          summary: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          meeting_type?: 'kickoff' | 'phase_review' | 'gate_review' | 'discovery' | 'standup' | 'retrospective' | 'other' | null;
          scheduled_at?: string | null;
          duration_minutes?: number | null;
          location?: string | null;
          meeting_link?: string | null;
          summary?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          meeting_type?: 'kickoff' | 'phase_review' | 'gate_review' | 'discovery' | 'standup' | 'retrospective' | 'other' | null;
          scheduled_at?: string | null;
          duration_minutes?: number | null;
          location?: string | null;
          meeting_link?: string | null;
          summary?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      meeting_attendees: {
        Row: {
          id: string;
          meeting_id: string;
          user_id: string | null;
          attendance_status: 'invited' | 'accepted' | 'declined' | 'attended' | 'absent';
          role: string | null;
        };
        Insert: {
          id?: string;
          meeting_id: string;
          user_id?: string | null;
          attendance_status?: 'invited' | 'accepted' | 'declined' | 'attended' | 'absent';
          role?: string | null;
        };
        Update: {
          id?: string;
          meeting_id?: string;
          user_id?: string | null;
          attendance_status?: 'invited' | 'accepted' | 'declined' | 'attended' | 'absent';
          role?: string | null;
        };
      };
      meeting_action_items: {
        Row: {
          id: string;
          meeting_id: string;
          assigned_to: string | null;
          description: string;
          due_date: string | null;
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          meeting_id: string;
          assigned_to?: string | null;
          description: string;
          due_date?: string | null;
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          meeting_id?: string;
          assigned_to?: string | null;
          description?: string;
          due_date?: string | null;
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          completed_at?: string | null;
          created_at?: string;
        };
      };
      meeting_decisions: {
        Row: {
          id: string;
          meeting_id: string;
          decision: string;
          rationale: string | null;
          decided_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          meeting_id: string;
          decision: string;
          rationale?: string | null;
          decided_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          meeting_id?: string;
          decision?: string;
          rationale?: string | null;
          decided_by?: string | null;
          created_at?: string;
        };
      };
      gate_approvals: {
        Row: {
          id: string;
          project_id: string;
          gate_step_id: string;
          approved_by: string | null;
          signature: string | null;
          comments: string | null;
          approved_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          gate_step_id: string;
          approved_by?: string | null;
          signature?: string | null;
          comments?: string | null;
          approved_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          gate_step_id?: string;
          approved_by?: string | null;
          signature?: string | null;
          comments?: string | null;
          approved_at?: string;
        };
      };
      scorecard_metrics: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          description: string | null;
          category: string | null;
          unit: string | null;
          baseline_value: number | null;
          target_1year: number | null;
          target_3year: number | null;
          target_5year: number | null;
          current_value: number | null;
          trend: 'up' | 'down' | 'stable' | 'unknown' | null;
          last_updated: string | null;
          updated_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          description?: string | null;
          category?: string | null;
          unit?: string | null;
          baseline_value?: number | null;
          target_1year?: number | null;
          target_3year?: number | null;
          target_5year?: number | null;
          current_value?: number | null;
          trend?: 'up' | 'down' | 'stable' | 'unknown' | null;
          last_updated?: string | null;
          updated_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          description?: string | null;
          category?: string | null;
          unit?: string | null;
          baseline_value?: number | null;
          target_1year?: number | null;
          target_3year?: number | null;
          target_5year?: number | null;
          current_value?: number | null;
          trend?: 'up' | 'down' | 'stable' | 'unknown' | null;
          last_updated?: string | null;
          updated_by?: string | null;
          created_at?: string;
        };
      };
      scorecard_history: {
        Row: {
          id: string;
          metric_id: string;
          value: number;
          recorded_at: string;
          recorded_by: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          metric_id: string;
          value: number;
          recorded_at?: string;
          recorded_by?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          metric_id?: string;
          value?: number;
          recorded_at?: string;
          recorded_by?: string | null;
          notes?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Convenience types
export type Project = Tables<'projects'>;
export type User = Tables<'users'>;
export type ProjectMember = Tables<'project_members'>;
export type StepProgress = Tables<'step_progress'>;
export type Deliverable = Tables<'deliverables'>;
export type Asset = Tables<'assets'>;
export type AssetAttachment = Tables<'asset_attachments'>;
export type Activity = Tables<'activities'>;
export type Comment = Tables<'comments'>;
export type Meeting = Tables<'meetings'>;
export type MeetingAttendee = Tables<'meeting_attendees'>;
export type MeetingActionItem = Tables<'meeting_action_items'>;
export type MeetingDecision = Tables<'meeting_decisions'>;
export type GateApproval = Tables<'gate_approvals'>;
export type ScorecardMetric = Tables<'scorecard_metrics'>;
export type ScorecardHistory = Tables<'scorecard_history'>;
