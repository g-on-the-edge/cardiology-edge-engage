'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import type { Project, Asset } from '@/types/database';
import FileViewer from '@/components/project/FileViewer';

export default function AssetsPage() {
  const { id } = useParams();
  const { user, signOut } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingAsset, setViewingAsset] = useState<Asset | null>(null);
  const [filter, setFilter] = useState<'all' | 'file' | 'document' | 'image' | 'video' | 'link'>('all');

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

      // Fetch all assets for this project
      const { data: assetsData } = await supabase
        .from('assets')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });

      if (assetsData) {
        setAssets(assetsData);
      }

      setIsLoading(false);
    }

    fetchData();
  }, [id]);

  const getAssetIcon = (assetType: string) => {
    switch (assetType) {
      case 'file':
      case 'document':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'image':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'video':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'link':
      default:
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
    }
  };

  const getAssetColor = (assetType: string) => {
    switch (assetType) {
      case 'file':
      case 'document':
        return 'bg-orange-500/20 text-orange-400';
      case 'image':
        return 'bg-green-500/20 text-green-400';
      case 'video':
        return 'bg-rose-500/20 text-rose-400';
      case 'link':
      default:
        return 'bg-cyan-500/20 text-cyan-400';
    }
  };

  const filteredAssets = filter === 'all'
    ? assets
    : assets.filter(a => a.type === filter);

  const handleAssetClick = (asset: Asset) => {
    if (asset.type === 'link' && asset.url) {
      window.open(asset.url, '_blank');
    } else {
      setViewingAsset(asset);
    }
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
              <p className="text-white/50 text-sm">Assets</p>
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
          {/* Filter tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {(['all', 'document', 'image', 'video', 'link'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-[#20B2A4] text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {filterType === 'all' ? 'All' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}s
                {filterType === 'all' && ` (${assets.length})`}
                {filterType !== 'all' && ` (${assets.filter(a => a.type === filterType || (filterType === 'document' && a.type === 'file')).length})`}
              </button>
            ))}
          </div>

          {/* Assets grid */}
          {filteredAssets.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-white/60 text-lg mb-2">No assets found</h3>
              <p className="text-white/40 text-sm">
                {filter === 'all'
                  ? 'Add assets through the Methodology page by attaching files to steps or deliverables.'
                  : `No ${filter} assets have been added yet.`}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAssets.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <button
                    onClick={() => handleAssetClick(asset)}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#20B2A4]/30 transition-all text-left group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getAssetColor(asset.type)}`}>
                        {getAssetIcon(asset.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate group-hover:text-[#A8D4B8] transition-colors">
                          {asset.name}
                        </h3>
                        {asset.description && (
                          <p className="text-white/50 text-sm mt-1 line-clamp-2">
                            {asset.description}
                          </p>
                        )}
                        <p className="text-white/30 text-xs mt-2">
                          {new Date(asset.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="text-white/30 group-hover:text-white/60 transition-colors">
                        {asset.type === 'link' ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      {/* File Viewer Modal */}
      {viewingAsset && (
        <FileViewer
          asset={viewingAsset}
          onClose={() => setViewingAsset(null)}
        />
      )}
    </div>
  );
}
