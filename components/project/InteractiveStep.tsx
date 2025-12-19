'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Step } from '@/lib/methodology-data';
import type { StepProgress, Asset } from '@/types/database';
import StatusBadge from './StatusBadge';
import AssetButton from './AssetButton';

const categoryColors = {
  open: { bg: 'bg-[#A8D4B8]', text: 'text-[#A8D4B8]', border: 'border-[#A8D4B8]/30' },
  narrow: { bg: 'bg-[#FF9F40]', text: 'text-[#FF9F40]', border: 'border-[#FF9F40]/30' },
  close: { bg: 'bg-[#243B53]', text: 'text-[#F8FAFC]/70', border: 'border-[#243B53]/50' },
};

interface InteractiveStepProps {
  step: Step;
  progress: StepProgress | null;
  assets: Asset[];
  gradient: string;
  onStatusChange: (stepId: string, status: StepProgress['status']) => void;
  onViewAssets: (stepId: string) => void;
  onAddAsset: (stepId: string) => void;
  isInView: boolean;
  index: number;
}

export default function InteractiveStep({
  step,
  progress,
  assets,
  gradient,
  onStatusChange,
  onViewAssets,
  onAddAsset,
  isInView,
  index,
}: InteractiveStepProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const colors = categoryColors[step.category];
  const status = progress?.status || 'not_started';

  const statusOptions: { value: StepProgress['status']; label: string }[] = [
    { value: 'not_started', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'blocked', label: 'Blocked' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group ${
        status === 'completed' ? 'border-[#20B2A4]/30' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Step number */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ${
          status === 'completed' ? 'ring-2 ring-[#20B2A4]/50' : ''
        }`}>
          {status === 'completed' ? (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <span className="text-white font-bold text-sm">{step.id}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h4 className={`font-semibold ${status === 'completed' ? 'text-white/70' : 'text-white'}`}>
              {step.title}
            </h4>
            <StatusBadge status={status} />
          </div>
          <p className={`text-sm ${status === 'completed' ? 'text-white/40' : 'text-white/60'}`}>
            {step.description}
          </p>

          {/* Audio player for steps with audio */}
          {step.audioSrc && (
            <audio
              controls
              className="mt-3 w-full h-10 rounded-lg"
              style={{ filter: 'invert(1) hue-rotate(180deg) brightness(0.9)' }}
            >
              <source src={step.audioSrc} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}

          {/* Action bar - always visible but more prominent on hover */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <AssetButton
              count={assets.length}
              onClick={() => onViewAssets(step.id)}
              onAdd={() => onAddAsset(step.id)}
            />

            {/* Status dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white/60 hover:text-white text-xs font-medium"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Update Status
                <svg className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-1 py-1 bg-[#1A2A3F] border border-white/20 rounded-lg shadow-xl z-20 min-w-[140px]"
                >
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onStatusChange(step.id, option.value);
                        setIsExpanded(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs hover:bg-white/10 transition-colors ${
                        status === option.value ? 'text-[#A8D4B8]' : 'text-white/70'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Comment indicator */}
            <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white/60 hover:text-white text-xs font-medium">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>0</span>
            </button>
          </div>
        </div>

        {/* Category label and indicator */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${colors.text} ${colors.border} border bg-white/5`}>
            {step.category}
          </span>
          <div className={`w-3 h-3 rounded-full ${colors.bg} opacity-60 group-hover:opacity-100 transition-opacity`} />
        </div>
      </div>

      {/* Assets preview - show if there are assets */}
      {assets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-white/10"
        >
          <div className="flex items-center gap-2 flex-wrap">
            {assets.slice(0, 3).map((asset) => (
              <div
                key={asset.id}
                className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs"
              >
                {asset.type === 'link' && (
                  <svg className="w-3 h-3 text-[#3AACCF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                )}
                {asset.type === 'document' && (
                  <svg className="w-3 h-3 text-[#FF9F40]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                {asset.type === 'video' && (
                  <svg className="w-3 h-3 text-[#E85A6F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
                <span className="text-white/70 truncate max-w-[120px]">{asset.name}</span>
              </div>
            ))}
            {assets.length > 3 && (
              <span className="text-white/50 text-xs">+{assets.length - 3} more</span>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
