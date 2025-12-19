'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import type { Project, ScorecardMetric } from '@/types/database';

export default function ScorecardPage() {
  const { id } = useParams();
  const { user, signOut } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [metrics, setMetrics] = useState<ScorecardMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
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

      // Fetch scorecard metrics for this project
      const { data: metricsData } = await supabase
        .from('scorecard_metrics')
        .select('*')
        .eq('project_id', id)
        .order('category', { ascending: true });

      if (metricsData) {
        setMetrics(metricsData);
      }

      setIsLoading(false);
    }

    fetchData();
  }, [id]);

  const getTrendIcon = (trend: string | null) => {
    switch (trend) {
      case 'up':
        return (
          <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        );
      case 'down':
        return (
          <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        );
      case 'stable':
        return (
          <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const calculateProgress = (current: number | null, baseline: number | null, target: number | null) => {
    if (current === null || baseline === null || target === null) return 0;
    if (target === baseline) return 100;
    const progress = ((current - baseline) / (target - baseline)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

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

  // Group metrics by category
  const groupedMetrics = metrics.reduce((acc, metric) => {
    const category = metric.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(metric);
    return acc;
  }, {} as Record<string, ScorecardMetric[]>);

  return (
    <div className="min-h-screen bg-[#0F1D2F]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0F1D2F]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/projects/${id}`} className="text-white/60 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-white font-semibold">{project.name}</h1>
              <p className="text-white/50 text-sm">Scorecard</p>
            </div>
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
      <main className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Metrics */}
          {metrics.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-white/60 text-lg mb-2">No metrics defined</h3>
              <p className="text-white/40 text-sm">
                Scorecard metrics will appear here once they are set up for this project.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedMetrics).map(([category, categoryMetrics]) => (
                <div key={category}>
                  <h2 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-4">{category}</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {categoryMetrics.map((metric, index) => (
                      <motion.div
                        key={metric.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="p-4 rounded-xl bg-white/5 border border-white/10"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-white font-medium">{metric.name}</h3>
                            {metric.description && (
                              <p className="text-white/50 text-sm mt-1">{metric.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(metric.trend)}
                          </div>
                        </div>

                        <div className="flex items-end gap-2 mb-3">
                          <span className="text-3xl font-bold text-white">
                            {metric.current_value ?? '-'}
                          </span>
                          {metric.unit && (
                            <span className="text-white/50 text-sm mb-1">{metric.unit}</span>
                          )}
                        </div>

                        {/* Progress bar */}
                        {metric.target_1year !== null && (
                          <div className="mb-3">
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#20B2A4] to-[#A8D4B8] rounded-full transition-all"
                                style={{ width: `${calculateProgress(metric.current_value, metric.baseline_value, metric.target_1year)}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Targets */}
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div>
                            <span className="text-white/40">Baseline</span>
                            <p className="text-white/70">{metric.baseline_value ?? '-'}</p>
                          </div>
                          <div>
                            <span className="text-white/40">1 Year</span>
                            <p className="text-white/70">{metric.target_1year ?? '-'}</p>
                          </div>
                          <div>
                            <span className="text-white/40">3 Year</span>
                            <p className="text-white/70">{metric.target_3year ?? '-'}</p>
                          </div>
                          <div>
                            <span className="text-white/40">5 Year</span>
                            <p className="text-white/70">{metric.target_5year ?? '-'}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
