'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { steps, deliverables, phaseInfo, getStepsByPhase, getDeliverablesByPhase, getGateSteps } from '@/lib/methodology-data';
import type { Project, StepProgress, Asset, AssetAttachment } from '@/types/database';
import InteractiveStep from '@/components/project/InteractiveStep';
import AssetModal from '@/components/project/AssetModal';
import FileViewer from '@/components/project/FileViewer';

export default function MethodologyPage() {
  const { id } = useParams();
  const { user, signOut } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [stepProgress, setStepProgress] = useState<Record<string, StepProgress>>({});
  const [stepAssets, setStepAssets] = useState<Record<string, Asset[]>>({});
  const [deliverableAssets, setDeliverableAssets] = useState<Record<string, Asset[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<{ type: 'view' | 'add'; targetId: string; targetType: 'step' | 'deliverable' } | null>(null);
  const [viewingAsset, setViewingAsset] = useState<Asset | null>(null);

  // Refs for scroll tracking
  const phase1Ref = useRef<HTMLDivElement>(null);
  const gateRef = useRef<HTMLDivElement>(null);
  const phase2Ref = useRef<HTMLDivElement>(null);
  const phase3Ref = useRef<HTMLDivElement>(null);

  const phase1InView = useInView(phase1Ref, { once: true, amount: 0.1 });
  const gateInView = useInView(gateRef, { once: true, amount: 0.1 });
  const phase2InView = useInView(phase2Ref, { once: true, amount: 0.1 });
  const phase3InView = useInView(phase3Ref, { once: true, amount: 0.1 });

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

      // Fetch step progress
      const { data: progressData } = await supabase
        .from('step_progress')
        .select('*')
        .eq('project_id', id);

      if (progressData) {
        const progressMap: Record<string, StepProgress> = {};
        (progressData as StepProgress[]).forEach((p) => {
          progressMap[p.step_id] = p;
        });
        setStepProgress(progressMap);
      }

      // Fetch step assets with attachments
      const { data: stepAttachmentsData } = await supabase
        .from('asset_attachments')
        .select(`
          *,
          asset:assets(*)
        `)
        .eq('attachable_type', 'step');

      if (stepAttachmentsData) {
        const assetsMap: Record<string, Asset[]> = {};
        stepAttachmentsData.forEach((att: any) => {
          if (att.asset) {
            if (!assetsMap[att.attachable_id]) {
              assetsMap[att.attachable_id] = [];
            }
            assetsMap[att.attachable_id].push(att.asset);
          }
        });
        setStepAssets(assetsMap);
      }

      // Fetch deliverable assets with attachments
      const { data: deliverableAttachmentsData } = await supabase
        .from('asset_attachments')
        .select(`
          *,
          asset:assets(*)
        `)
        .eq('attachable_type', 'deliverable');

      if (deliverableAttachmentsData) {
        const assetsMap: Record<string, Asset[]> = {};
        deliverableAttachmentsData.forEach((att: any) => {
          if (att.asset) {
            if (!assetsMap[att.attachable_id]) {
              assetsMap[att.attachable_id] = [];
            }
            assetsMap[att.attachable_id].push(att.asset);
          }
        });
        setDeliverableAssets(assetsMap);
      }

      setIsLoading(false);
    }

    fetchData();
  }, [id]);

  const handleStatusChange = async (stepId: string, status: StepProgress['status']) => {
    if (!id || !user) return;

    const supabase = createClient();
    const now = new Date().toISOString();
    const phase = stepId.startsWith('G.') ? 0 : parseInt(stepId.split('.')[0]);

    const existingProgress = stepProgress[stepId];

    if (existingProgress) {
      // Update existing
      const { error } = await supabase
        .from('step_progress')
        .update({
          status,
          started_at: status === 'in_progress' ? now : existingProgress.started_at,
          completed_at: status === 'completed' ? now : null,
          completed_by: status === 'completed' ? user.id : null,
        })
        .eq('id', existingProgress.id);

      if (!error) {
        setStepProgress((prev) => ({
          ...prev,
          [stepId]: {
            ...existingProgress,
            status,
            started_at: status === 'in_progress' ? now : existingProgress.started_at,
            completed_at: status === 'completed' ? now : null,
            completed_by: status === 'completed' ? user.id : null,
          },
        }));
      }
    } else {
      // Create new
      const { data, error } = await supabase
        .from('step_progress')
        .insert({
          project_id: id as string,
          step_id: stepId,
          phase,
          status,
          started_at: status === 'in_progress' ? now : null,
          completed_at: status === 'completed' ? now : null,
          completed_by: status === 'completed' ? user.id : null,
        })
        .select()
        .single();

      if (!error && data) {
        setStepProgress((prev) => ({
          ...prev,
          [stepId]: data,
        }));
      }
    }

    // Log activity
    await supabase.from('activities').insert({
      project_id: id as string,
      user_id: user.id,
      action: `Updated step ${stepId} status to ${status}`,
      entity_type: 'step',
      entity_id: stepId,
      metadata: { status },
    });
  };

  const handleViewAssets = (targetId: string, targetType: 'step' | 'deliverable' = 'step') => {
    setActiveModal({ type: 'view', targetId, targetType });
  };

  const handleAddAsset = (targetId: string, targetType: 'step' | 'deliverable' = 'step') => {
    setActiveModal({ type: 'add', targetId, targetType });
  };

  const handleViewFile = (asset: Asset) => {
    setViewingAsset(asset);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F1D2F] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#20B2A4] border-t-transparent rounded-full" />
      </div>
    );
  }

  const gateSteps = getGateSteps();

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
              <h1 className="text-white font-semibold">{project?.name}</h1>
              <p className="text-white/50 text-sm">Interactive Methodology</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/engage-method-v2"
              target="_blank"
              className="text-white/60 hover:text-white text-sm transition-colors inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Full Method
            </Link>
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
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* Phase 1 */}
        <section ref={phase1Ref}>
          <PhaseHeader
            phase={1}
            info={phaseInfo[1]}
            isInView={phase1InView}
          />
          <div className="grid lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-4">
              <h3 className={`${phaseInfo[1].textColor} font-semibold text-sm uppercase tracking-wider mb-6`}>
                Process Steps
              </h3>
              {getStepsByPhase(1).map((step, index) => (
                <InteractiveStep
                  key={step.id}
                  step={step}
                  progress={stepProgress[step.id] || null}
                  assets={stepAssets[step.id] || []}
                  gradient={phaseInfo[1].gradient}
                  onStatusChange={handleStatusChange}
                  onViewAssets={handleViewAssets}
                  onAddAsset={handleAddAsset}
                  isInView={phase1InView}
                  index={index}
                />
              ))}
            </div>
            <div>
              <h3 className={`${phaseInfo[1].textColor} font-semibold text-sm uppercase tracking-wider mb-6`}>
                Deliverables
              </h3>
              <div className="space-y-3">
                {getDeliverablesByPhase(1).map((deliverable, index) => (
                  <DeliverableCard
                    key={deliverable.id}
                    deliverable={deliverable}
                    assets={deliverableAssets[deliverable.id] || []}
                    gradient={phaseInfo[1].gradient}
                    accentColor={phaseInfo[1].accentColor}
                    isInView={phase1InView}
                    index={index}
                    onAddAsset={() => handleAddAsset(deliverable.id, 'deliverable')}
                    onViewFile={handleViewFile}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Gate */}
        <section ref={gateRef} className="py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex flex-col items-center">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#20B2A4] to-[#A8D4B8] flex items-center justify-center shadow-2xl shadow-[#20B2A4]/30 mb-4"
              >
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </motion.div>
              <span className="text-[#A8D4B8] text-xs font-bold uppercase tracking-[0.3em] mb-2">
                Critical Checkpoint
              </span>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#A8D4B8] via-[#20B2A4] to-[#A8D4B8]">
                THE GATE
              </h2>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {gateSteps.map((step, index) => (
              <InteractiveStep
                key={step.id}
                step={step}
                progress={stepProgress[step.id] || null}
                assets={stepAssets[step.id] || []}
                gradient="from-[#20B2A4] to-[#A8D4B8]"
                onStatusChange={handleStatusChange}
                onViewAssets={handleViewAssets}
                onAddAsset={handleAddAsset}
                isInView={gateInView}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Phase 2 */}
        <section ref={phase2Ref}>
          <PhaseHeader
            phase={2}
            info={phaseInfo[2]}
            isInView={phase2InView}
          />
          <div className="grid lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-4">
              <h3 className={`${phaseInfo[2].textColor} font-semibold text-sm uppercase tracking-wider mb-6`}>
                Process Steps
              </h3>
              {getStepsByPhase(2).map((step, index) => (
                <InteractiveStep
                  key={step.id}
                  step={step}
                  progress={stepProgress[step.id] || null}
                  assets={stepAssets[step.id] || []}
                  gradient={phaseInfo[2].gradient}
                  onStatusChange={handleStatusChange}
                  onViewAssets={handleViewAssets}
                  onAddAsset={handleAddAsset}
                  isInView={phase2InView}
                  index={index}
                />
              ))}
            </div>
            <div>
              <h3 className={`${phaseInfo[2].textColor} font-semibold text-sm uppercase tracking-wider mb-6`}>
                Deliverables
              </h3>
              <div className="space-y-3">
                {getDeliverablesByPhase(2).map((deliverable, index) => (
                  <DeliverableCard
                    key={deliverable.id}
                    deliverable={deliverable}
                    assets={deliverableAssets[deliverable.id] || []}
                    gradient={phaseInfo[2].gradient}
                    accentColor={phaseInfo[2].accentColor}
                    isInView={phase2InView}
                    index={index}
                    onAddAsset={() => handleAddAsset(deliverable.id, 'deliverable')}
                    onViewFile={handleViewFile}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Phase 3 */}
        <section ref={phase3Ref}>
          <PhaseHeader
            phase={3}
            info={phaseInfo[3]}
            isInView={phase3InView}
          />
          <div className="grid lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-4">
              <h3 className={`${phaseInfo[3].textColor} font-semibold text-sm uppercase tracking-wider mb-6`}>
                Process Steps
              </h3>
              {getStepsByPhase(3).map((step, index) => (
                <InteractiveStep
                  key={step.id}
                  step={step}
                  progress={stepProgress[step.id] || null}
                  assets={stepAssets[step.id] || []}
                  gradient={phaseInfo[3].gradient}
                  onStatusChange={handleStatusChange}
                  onViewAssets={handleViewAssets}
                  onAddAsset={handleAddAsset}
                  isInView={phase3InView}
                  index={index}
                />
              ))}
            </div>
            <div>
              <h3 className={`${phaseInfo[3].textColor} font-semibold text-sm uppercase tracking-wider mb-6`}>
                Deliverables
              </h3>
              <div className="space-y-3">
                {getDeliverablesByPhase(3).map((deliverable, index) => (
                  <DeliverableCard
                    key={deliverable.id}
                    deliverable={deliverable}
                    assets={deliverableAssets[deliverable.id] || []}
                    gradient={phaseInfo[3].gradient}
                    accentColor={phaseInfo[3].accentColor}
                    isInView={phase3InView}
                    index={index}
                    onAddAsset={() => handleAddAsset(deliverable.id, 'deliverable')}
                    onViewFile={handleViewFile}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Asset Modal */}
      {activeModal && (
        <AssetModal
          projectId={id as string}
          targetType={activeModal.targetType}
          targetId={activeModal.targetId}
          mode={activeModal.type}
          assets={activeModal.targetType === 'step'
            ? (stepAssets[activeModal.targetId] || [])
            : (deliverableAssets[activeModal.targetId] || [])}
          onClose={() => setActiveModal(null)}
          onAssetAdded={(asset) => {
            if (activeModal.targetType === 'step') {
              setStepAssets((prev) => ({
                ...prev,
                [activeModal.targetId]: [...(prev[activeModal.targetId] || []), asset],
              }));
            } else {
              setDeliverableAssets((prev) => ({
                ...prev,
                [activeModal.targetId]: [...(prev[activeModal.targetId] || []), asset],
              }));
            }
          }}
        />
      )}

      {/* File Viewer */}
      {viewingAsset && (
        <FileViewer
          asset={viewingAsset}
          onClose={() => setViewingAsset(null)}
        />
      )}
    </div>
  );
}

// Phase Header Component
function PhaseHeader({ phase, info, isInView }: { phase: number; info: typeof phaseInfo[1]; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${info.gradient} mb-4`}
      >
        <span className="text-white font-bold text-sm">PHASE {phase}</span>
      </motion.div>
      <h2 className="text-3xl md:text-4xl font-bold mb-3">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
          {info.title}
        </span>
      </h2>
      <p className="text-lg text-white/60 max-w-2xl mx-auto">
        {info.subtitle}
      </p>
    </motion.div>
  );
}

// Deliverable Card Component
function DeliverableCard({
  deliverable,
  assets,
  gradient,
  accentColor,
  isInView,
  index,
  onAddAsset,
  onViewFile,
}: {
  deliverable: { id: string; title: string };
  assets: Asset[];
  gradient: string;
  accentColor: string;
  isInView: boolean;
  index: number;
  onAddAsset: () => void;
  onViewFile: (asset: Asset) => void;
}) {
  const getAssetIcon = (asset: Asset) => {
    const isPdf = asset.type === 'document' || asset.mime_type === 'application/pdf' || asset.name?.endsWith('.pdf');
    const isImage = asset.type === 'image' || asset.mime_type?.startsWith('image/');
    const isVideo = asset.type === 'video' || asset.mime_type?.startsWith('video/');

    if (isPdf) {
      return (
        <svg className="w-4 h-4 text-[#FF9F40]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
    if (isImage) {
      return (
        <svg className="w-4 h-4 text-[#A8D4B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    if (isVideo) {
      return (
        <svg className="w-4 h-4 text-[#E85A6F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    }
    if (asset.type === 'link') {
      return (
        <svg className="w-4 h-4 text-[#3AACCF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
      className={`p-4 rounded-xl ${accentColor} border border-white/10 hover:border-white/20 transition-all group`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <span className="text-white/80 text-sm font-medium flex-1">{deliverable.title}</span>
        <button
          onClick={onAddAsset}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
          title="Add asset"
        >
          <svg className="w-3.5 h-3.5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Asset icons row */}
      {assets.length > 0 && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10 flex-wrap">
          {assets.map((asset) => (
            <button
              type="button"
              key={asset.id}
              onClick={() => onViewFile(asset)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group/asset"
              title={asset.name}
            >
              {getAssetIcon(asset)}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
