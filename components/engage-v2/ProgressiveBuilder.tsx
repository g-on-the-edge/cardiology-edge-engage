'use client';

import { motion, useTransform, MotionValue } from 'framer-motion';

// Section identifiers for tracking progress
export type SectionId =
  | 'hero'
  | 'challenge'
  | 'execution-model'
  | 'principles'
  | 'framework'
  | 'phase1'
  | 'gate'
  | 'phase2'
  | 'phase3'
  | 'structure'
  | 'closing';

interface ProgressiveBuilderProps {
  scrollProgress: MotionValue<number>;
  activeSection: SectionId;
}

// The signature feature - a sticky header that builds out as users scroll
export default function ProgressiveBuilder({ scrollProgress, activeSection }: ProgressiveBuilderProps) {
  // Map sections to visibility thresholds
  const sectionOrder: SectionId[] = [
    'hero', 'challenge', 'execution-model', 'principles', 'framework',
    'phase1', 'gate', 'phase2', 'phase3', 'structure', 'closing'
  ];

  const currentIndex = sectionOrder.indexOf(activeSection);

  // Determine what's visible based on active section
  const showFramework = currentIndex >= sectionOrder.indexOf('challenge');
  const showPhase1 = currentIndex >= sectionOrder.indexOf('framework');
  const showGate = currentIndex >= sectionOrder.indexOf('gate');
  const showPhase2 = currentIndex >= sectionOrder.indexOf('phase2');
  const showPhase3 = currentIndex >= sectionOrder.indexOf('phase3');
  const showOutcomes = currentIndex >= sectionOrder.indexOf('closing');

  // Phase 1 steps fill as we progress through phase1
  const phase1Progress = activeSection === 'phase1' ? 1 : (currentIndex > sectionOrder.indexOf('phase1') ? 1 : 0);
  const phase2Progress = activeSection === 'phase2' ? 1 : (currentIndex > sectionOrder.indexOf('phase2') ? 1 : 0);
  const phase3Progress = activeSection === 'phase3' ? 1 : (currentIndex > sectionOrder.indexOf('phase3') ? 1 : 0);
  const gateComplete = currentIndex > sectionOrder.indexOf('gate');

  // Overall progress for the progress bar
  const overallProgress = useTransform(scrollProgress, [0, 1], [0, 100]);

  return (
    <div className="sticky top-0 z-50 bg-[#0F1D2F]/95 backdrop-blur-xl border-b border-[#2D4A6F]">
      <div className="max-w-6xl mx-auto px-4 py-3">
        {/* Home button - positioned on the left */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <a
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 group"
          >
            <svg
              className="w-5 h-5 text-white/70 group-hover:text-white transition-colors"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <span className="text-sm text-white/70 group-hover:text-white transition-colors hidden sm:inline">
              Home
            </span>
          </a>
        </div>

        {/* Main builder visualization */}
        <div className="flex items-center justify-center gap-1 md:gap-2">

          {/* Phase 1 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: showFramework ? 1 : 0.3,
              scale: showFramework ? 1 : 0.9
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <div className={`
              px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide
              transition-all duration-500
              ${activeSection === 'phase1'
                ? 'bg-gradient-to-r from-[#3AACCF] to-[#007FA3] text-white ring-2 ring-[#3AACCF]/50'
                : showPhase1
                  ? 'bg-[#3AACCF]/20 text-[#3AACCF] border border-[#3AACCF]/30'
                  : 'bg-[#1B365D] text-[#94A3B8] border border-[#2D4A6F]'
              }
            `}>
              Phase 1
            </div>

            {/* O-N-C buckets */}
            {showPhase1 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex gap-0.5 mt-1"
              >
                <ONCBucket type="open" filled={phase1Progress >= 0.25} count={2} active={activeSection === 'phase1'} />
                <ONCBucket type="narrow" filled={phase1Progress >= 0.5} count={1} active={activeSection === 'phase1'} />
                <ONCBucket type="close" filled={phase1Progress >= 0.75} count={1} active={activeSection === 'phase1'} />
              </motion.div>
            )}
          </motion.div>

          {/* Arrow 1 */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: showGate ? 1 : 0.2, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>

          {/* Gate */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: showGate ? 1 : 0.3,
              scale: showGate ? 1 : 0.9
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <div className={`
              px-2 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide
              transition-all duration-500
              ${activeSection === 'gate'
                ? 'bg-gradient-to-r from-[#20B2A4] to-[#00685E] text-white ring-2 ring-[#20B2A4]/50'
                : gateComplete
                  ? 'bg-[#20B2A4]/20 text-[#20B2A4] border border-[#20B2A4]/30'
                  : 'bg-[#1B365D] text-[#94A3B8] border border-[#2D4A6F]'
              }
            `}>
              Gate
            </div>
            {showGate && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, type: 'spring' }}
                className="mt-1 flex gap-0.5"
              >
                {gateComplete ? (
                  <>
                    <div className="w-4 h-4 rounded-full bg-[#20B2A4] flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-[#20B2A4] flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 rounded-full bg-white/10 border border-white/20" />
                    <div className="w-4 h-4 rounded-full bg-white/10 border border-white/20" />
                  </>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Arrow 2 */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: showPhase2 ? 1 : 0.2, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>

          {/* Phase 2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: showPhase2 ? 1 : 0.3,
              scale: showPhase2 ? 1 : 0.9
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <div className={`
              px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide
              transition-all duration-500
              ${activeSection === 'phase2'
                ? 'bg-gradient-to-r from-[#FF9F40] to-[#FF8200] text-white ring-2 ring-[#FF9F40]/50'
                : phase2Progress > 0
                  ? 'bg-[#FF9F40]/20 text-[#FF9F40] border border-[#FF9F40]/30'
                  : 'bg-[#1B365D] text-[#94A3B8] border border-[#2D4A6F]'
              }
            `}>
              Phase 2
            </div>

            {showPhase2 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex gap-0.5 mt-1"
              >
                <ONCBucket type="open" filled={phase2Progress >= 0.33} count={4} active={activeSection === 'phase2'} />
                <ONCBucket type="narrow" filled={phase2Progress >= 0.66} count={1} active={activeSection === 'phase2'} />
                <ONCBucket type="close" filled={phase2Progress >= 1} count={1} active={activeSection === 'phase2'} />
              </motion.div>
            )}
          </motion.div>

          {/* Arrow 3 */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: showPhase3 ? 1 : 0.2, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>

          {/* Phase 3 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: showPhase3 ? 1 : 0.3,
              scale: showPhase3 ? 1 : 0.9
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <div className={`
              px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide
              transition-all duration-500
              ${activeSection === 'phase3'
                ? 'bg-gradient-to-r from-[#E85A6F] to-[#C41F3E] text-white ring-2 ring-[#E85A6F]/50'
                : phase3Progress > 0
                  ? 'bg-[#E85A6F]/20 text-[#E85A6F] border border-[#E85A6F]/30'
                  : 'bg-[#1B365D] text-[#94A3B8] border border-[#2D4A6F]'
              }
            `}>
              Phase 3
            </div>

            {showPhase3 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex gap-0.5 mt-1"
              >
                <ONCBucket type="open" filled={phase3Progress >= 0.5} count={1} active={activeSection === 'phase3'} />
                <ONCBucket type="narrow" filled={phase3Progress >= 0.75} count={1} active={activeSection === 'phase3'} />
                <ONCBucket type="close" filled={phase3Progress >= 1} count={1} active={activeSection === 'phase3'} />
              </motion.div>
            )}
          </motion.div>

          {/* Arrow 4 */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: showOutcomes ? 1 : 0.2, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>

          {/* Outcomes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: showOutcomes ? 1 : 0.3,
              scale: showOutcomes ? 1 : 0.9
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <motion.div
              className={`
                w-10 h-10 rotate-45 rounded-lg flex items-center justify-center
                transition-all duration-500
                ${showOutcomes
                  ? 'bg-gradient-to-br from-[#A8D4B8] to-[#20B2A4] shadow-lg shadow-[#A8D4B8]/30'
                  : 'bg-[#1B365D] border border-[#2D4A6F]'
                }
              `}
              animate={showOutcomes ? {
                boxShadow: ['0 0 20px rgba(168, 212, 184, 0.3)', '0 0 40px rgba(168, 212, 184, 0.5)', '0 0 20px rgba(168, 212, 184, 0.3)']
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg
                className={`w-5 h-5 -rotate-45 ${showOutcomes ? 'text-white' : 'text-white/30'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </motion.div>
            <span className={`text-[10px] mt-1 font-medium ${showOutcomes ? 'text-[#A8D4B8]' : 'text-[#94A3B8]'}`}>
              ROI
            </span>
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full"
            style={{
              width: overallProgress,
              background: 'linear-gradient(to right, #3AACCF, #20B2A4, #FF9F40, #E85A6F)'
            }}
          />
        </div>
      </div>
    </div>
  );
}

// O-N-C Bucket component
function ONCBucket({
  type,
  filled,
  count,
  active
}: {
  type: 'open' | 'narrow' | 'close';
  filled: boolean;
  count: number;
  active: boolean;
}) {
  // Dark mode brand colors
  const colors = {
    open: { bg: 'bg-[#A8D4B8]', border: 'border-[#A8D4B8]/30', text: 'text-[#A8D4B8]' },
    narrow: { bg: 'bg-[#FF9F40]', border: 'border-[#FF9F40]/30', text: 'text-[#FF9F40]' },
    close: { bg: 'bg-[#243B53]', border: 'border-[#2D4A6F]', text: 'text-[#F8FAFC]/70' },
  };

  const color = colors[type];

  return (
    <div className={`
      flex flex-col items-center px-1 py-0.5 rounded
      ${active ? 'bg-white/5' : ''}
    `}>
      <span className={`text-[8px] font-bold uppercase ${color.text}`}>
        {type.charAt(0)}
      </span>
      <div className="flex gap-0.5 mt-0.5">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: filled ? 1 : 0.5 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${filled ? color.bg : `bg-white/10 border ${color.border}`}
            `}
          />
        ))}
      </div>
    </div>
  );
}
