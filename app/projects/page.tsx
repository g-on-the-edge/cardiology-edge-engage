'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import type { Project } from '@/types/database';

export default function ProjectsPage() {
  const { user, signOut, isLoading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      if (!user) return;

      const supabase = createClient();

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (!error && data) {
        setProjects(data);
      }
      setIsLoading(false);
    }

    if (!authLoading) {
      fetchProjects();
    }
  }, [user, authLoading]);

  const getPhaseColor = (phase: number) => {
    switch (phase) {
      case 1:
        return 'from-[#3AACCF] to-[#007FA3]';
      case 2:
        return 'from-[#FF9F40] to-[#FF8200]';
      case 3:
        return 'from-[#E85A6F] to-[#C41F3E]';
      default:
        return 'from-[#20B2A4] to-[#A8D4B8]';
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      planning: 'bg-[#3AACCF]/20 text-[#3AACCF] border-[#3AACCF]/30',
      active: 'bg-[#20B2A4]/20 text-[#A8D4B8] border-[#20B2A4]/30',
      paused: 'bg-[#FF9F40]/20 text-[#FF9F40] border-[#FF9F40]/30',
      completed: 'bg-[#A8D4B8]/20 text-[#A8D4B8] border-[#A8D4B8]/30',
      archived: 'bg-white/10 text-white/50 border-white/20',
    };
    return styles[status] || styles.active;
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#0F1D2F] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#20B2A4] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1D2F]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0F1D2F]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#20B2A4] to-[#A8D4B8] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-white font-semibold">Edge Engage</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
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
      <main className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Your Projects</h1>
              <p className="text-white/60">Manage your Edge Engage engagements</p>
            </div>
          </div>

          {projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
              <p className="text-white/60 mb-6 max-w-md mx-auto">
                You&apos;ll see your Edge Engage projects here once you&apos;re added to one. Contact your project administrator to get started.
              </p>
              <Link
                href="/engage-method-v2"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Methodology
              </Link>
            </motion.div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link
                    href={`/projects/${project.id}`}
                    className="block p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
                  >
                    {/* Phase indicator */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getPhaseColor(project.current_phase)} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                      <span className="text-white font-bold">P{project.current_phase}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#A8D4B8] transition-colors">
                      {project.name}
                    </h3>

                    {project.description && (
                      <p className="text-white/60 text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusBadge(project.status)}`}>
                        {project.status}
                      </span>

                      {project.gate_approved && (
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-[#20B2A4]/20 text-[#A8D4B8] border border-[#20B2A4]/30 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Gate Approved
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
