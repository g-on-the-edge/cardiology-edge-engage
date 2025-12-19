'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import type { Project, StepProgress, Activity } from '@/types/database';
import InviteModal from '@/components/project/InviteModal';

interface ProjectStats {
  totalSteps: number;
  completedSteps: number;
  assetsCount: number;
  meetingsCount: number;
}

export default function ProjectPage() {
  const { id } = useParams();
  const { user, signOut } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [stats, setStats] = useState<ProjectStats>({ totalSteps: 13, completedSteps: 0, assetsCount: 0, meetingsCount: 0 });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      if (!id) return;

      const supabase = createClient();

      // Fetch project
      const { data: projectData } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (projectData) {
        setProject(projectData);
      }

      // Fetch step progress count
      const { count: completedCount } = await supabase
        .from('step_progress')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', id)
        .eq('status', 'completed');

      // Fetch assets count
      const { count: assetsCount } = await supabase
        .from('assets')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', id);

      // Fetch meetings count
      const { count: meetingsCount } = await supabase
        .from('meetings')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', id);

      // Fetch recent activity
      const { data: activityData } = await supabase
        .from('activities')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalSteps: 13, // 4 + 6 + 3 steps
        completedSteps: completedCount || 0,
        assetsCount: assetsCount || 0,
        meetingsCount: meetingsCount || 0,
      });

      if (activityData) {
        setRecentActivity(activityData);
      }

      setIsLoading(false);
    }

    fetchProject();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F1D2F] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#20B2A4] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0F1D2F] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Project not found</h1>
          <Link href="/projects" className="text-[#20B2A4] hover:underline">
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round((stats.completedSteps / stats.totalSteps) * 100);

  const navItems = [
    { href: `/projects/${id}/methodology`, label: 'View Execution Method Steps', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { href: `/projects/${id}/assets`, label: 'Execution Method Assets', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z', count: stats.assetsCount },
    { href: `/projects/${id}/meetings`, label: 'Meetings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', count: stats.meetingsCount },
    { href: `/projects/${id}/scorecard`, label: 'Scorecard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { href: `/projects/${id}/activity`, label: 'Activity', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  return (
    <div className="min-h-screen bg-[#0F1D2F]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0F1D2F]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/projects" className="text-white/60 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-white font-semibold">{project.name}</h1>
              <p className="text-white/50 text-sm">Phase {project.current_phase}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#20B2A4] text-white text-sm hover:bg-[#1a9a8e] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Invite Team
            </button>
            <span className="text-white/60 text-sm">{user?.email}</span>
            <button
              onClick={signOut}
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Stats cards */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            {/* Progress */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60 text-sm">Overall Progress</span>
                <span className="text-2xl font-bold text-white">{progressPercent}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-[#20B2A4] to-[#A8D4B8] rounded-full"
                />
              </div>
              <p className="text-white/50 text-xs mt-2">{stats.completedSteps} of {stats.totalSteps} steps completed</p>
            </div>

            {/* Current Phase */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-white/60 text-sm">Current Phase</span>
              <div className="flex items-center gap-3 mt-2">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                  project.current_phase === 1 ? 'from-[#3AACCF] to-[#007FA3]' :
                  project.current_phase === 2 ? 'from-[#FF9F40] to-[#FF8200]' :
                  'from-[#E85A6F] to-[#C41F3E]'
                } flex items-center justify-center`}>
                  <span className="text-white font-bold">{project.current_phase}</span>
                </div>
                <span className="text-white font-semibold">
                  {project.current_phase === 1 ? 'Define Outcomes' :
                   project.current_phase === 2 ? 'Discovery' : 'Execution'}
                </span>
              </div>
            </div>

            {/* Gate Status */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-white/60 text-sm">Gate Status</span>
              <div className="flex items-center gap-3 mt-2">
                {project.gate_approved ? (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-[#20B2A4]/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#A8D4B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[#A8D4B8] font-semibold">Approved</span>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-[#FF9F40]/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#FF9F40]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-[#FF9F40] font-semibold">Pending</span>
                  </>
                )}
              </div>
            </div>

            {/* Assets */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-white/60 text-sm">Total Assets</span>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-10 h-10 rounded-xl bg-[#3AACCF]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#3AACCF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-white font-semibold text-2xl">{stats.assetsCount}</span>
              </div>
            </div>
          </div>

          {/* Navigation cards */}
          <div className="grid gap-4 md:grid-cols-5 mb-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#20B2A4]/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3 group-hover:bg-[#20B2A4]/20 transition-colors">
                    <svg className="w-6 h-6 text-white/60 group-hover:text-[#A8D4B8] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                    </svg>
                  </div>
                  <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="mt-1 text-xs text-white/50">{item.count} items</span>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold">Recent Activity</h3>
              <Link
                href={`/projects/${id}/activity`}
                className="text-[#20B2A4] text-sm hover:underline"
              >
                View all
              </Link>
            </div>

            {recentActivity.length === 0 ? (
              <p className="text-white/50 text-center py-8">No activity yet. Start by adding assets or updating step progress.</p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-sm">{activity.action}</p>
                      <p className="text-white/40 text-xs mt-1">
                        {new Date(activity.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>

      {/* Invite Modal */}
      <InviteModal
        projectId={id as string}
        projectName={project.name}
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvited={() => {
          // Optionally refresh data or show notification
        }}
      />
    </div>
  );
}
