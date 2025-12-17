'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function ChallengeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-20%' });

  // Dark mode brand colors
  const quadrants = [
    { label: 'Cause & Effect', position: 'bottom-left', methods: 'Continuous Process Improvement', color: 'from-[#A8D4B8]/20 to-[#20B2A4]/20' },
    { label: 'Complicated', position: 'bottom-right', methods: 'Projects, Agile', color: 'from-[#3AACCF]/20 to-[#3AACCF]/30' },
    { label: 'Socially Complicated', position: 'top-left', methods: 'Projects', color: 'from-[#243B53]/50 to-[#243B53]/60' },
    { label: 'Complex', position: 'top-right', methods: 'Agile & Scrum', color: 'from-[#FF9F40]/20 to-[#FF9F40]/30', highlight: true },
    { label: 'Chaos', position: 'corner', methods: 'House of Pain', color: 'from-[#E85A6F]/30 to-[#E85A6F]/40', chaos: true },
  ];

  return (
    <section
      ref={ref}
      className="min-h-screen w-full py-24 px-6 flex items-center justify-center bg-[#0F1D2F] relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_PATH || ''}/backgrounds/EdgeBackgroundSkyDivingIN.svg)`, backgroundSize: 'cover' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              When is Edge Engage Used?
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            The Cynefin framework helps identify when traditional methods fail and breakthrough disruption is needed
          </p>
        </motion.div>

        {/* Cynefin Matrix */}
        <div className="relative max-w-3xl mx-auto">
          {/* Axis labels */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute -left-32 md:-left-48 top-1/2 -translate-y-1/2 -rotate-90 origin-center"
          >
            <div className="flex flex-col items-center">
              <span className="text-white/40 text-xs uppercase tracking-widest whitespace-nowrap">Agreement (amongst stakeholders)</span>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-white/60 text-xs">Clear</span>
                <div className="w-20 h-px bg-gradient-to-r from-white/20 to-white/60" />
                <span className="text-white/60 text-xs">Vague</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute -bottom-12 left-1/2 -translate-x-1/2"
          >
            <div className="flex flex-col items-center">
              <span className="text-white/40 text-xs uppercase tracking-widest">Certainty (about cause & effect)</span>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-white/60 text-xs">Known</span>
                <div className="w-20 h-px bg-gradient-to-r from-white/60 to-white/20" />
                <span className="text-white/60 text-xs">Unknown</span>
              </div>
            </div>
          </motion.div>

          {/* Matrix Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-2 p-4"
          >
            {/* Socially Complicated - Top Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="aspect-square bg-gradient-to-br from-[#243B53]/50 to-[#243B53]/60 border border-[#2D4A6F] rounded-xl p-4 flex flex-col justify-between"
            >
              <span className="text-[#F8FAFC]/80 font-medium text-sm">Socially Complicated</span>
              <div className="mt-auto">
                <span className="text-white/40 text-xs">Projects</span>
              </div>
            </motion.div>

            {/* Complex + Chaos - Top Right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="aspect-square relative"
            >
              {/* Complex area */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF9F40]/10 to-[#FF9F40]/20 border border-[#FF9F40]/30 rounded-xl p-4 flex flex-col justify-between">
                <span className="text-[#FF9F40] font-medium text-sm">Complex</span>
                <div className="mt-auto">
                  <span className="text-white/40 text-xs">Agile & Scrum</span>
                </div>
              </div>

              {/* Chaos corner */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-[#E85A6F]/20 to-[#E85A6F]/30 border-t border-r border-[#E85A6F]/30 rounded-tr-xl flex items-start justify-end p-2"
              >
                <span className="text-[#E85A6F] font-medium text-xs">Chaos</span>
              </motion.div>

              {/* Edge Engage indicator */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{ duration: 0.5, delay: 1, type: 'spring' }}
                className="absolute top-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2"
              >
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 bg-gradient-to-br from-[#20B2A4] to-[#A8D4B8] rounded-xl shadow-lg shadow-[#20B2A4]/30 flex items-center justify-center"
                  >
                    <span className="text-white font-bold text-xs text-center leading-tight">EDGE<br />ENGAGE</span>
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2"
                  >
                    <svg className="w-6 h-6 text-[#A8D4B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Cause & Effect - Bottom Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="aspect-square bg-gradient-to-br from-[#A8D4B8]/10 to-[#20B2A4]/20 border border-[#A8D4B8]/30 rounded-xl p-4 flex flex-col justify-between"
            >
              <span className="text-[#A8D4B8] font-medium text-sm">Cause & Effect</span>
              <div className="mt-auto">
                <span className="text-white/40 text-xs">Continuous Process Improvement</span>
              </div>
            </motion.div>

            {/* Complicated - Bottom Right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="aspect-square bg-gradient-to-br from-[#3AACCF]/10 to-[#3AACCF]/20 border border-[#3AACCF]/30 rounded-xl p-4 flex flex-col justify-between"
            >
              <span className="text-[#3AACCF] font-medium text-sm">Complicated</span>
              <div className="mt-auto">
                <span className="text-white/40 text-xs">Projects, Agile</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Quantity of People indicator line */}
          <motion.div
            initial={{ opacity: 0, pathLength: 0 }}
            animate={isInView ? { opacity: 1, pathLength: 1 } : { opacity: 0, pathLength: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute -bottom-2 -left-2 w-[calc(100%+1rem)] h-[calc(100%+1rem)] pointer-events-none"
          >
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" preserveAspectRatio="none">
              <motion.path
                d="M 100 0 L 0 100"
                stroke="url(#redGradient)"
                strokeWidth="0.5"
                strokeDasharray="4 2"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 1.5, delay: 1.2 }}
              />
              <defs>
                <linearGradient id="redGradient" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#E85A6F" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#E85A6F" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute bottom-0 left-0 text-[#E85A6F] text-xs transform -rotate-45 origin-bottom-left translate-y-4">
              Quantity of People →
            </span>
          </motion.div>
        </div>

        {/* Key message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-center mt-20"
        >
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            When <span className="text-[#FF9F40] font-medium">what solution</span> is vague and{' '}
            <span className="text-[#FF9F40] font-medium">how to deliver</span> is unknown,{' '}
            <span className="text-[#A8D4B8] font-semibold">Edge Engage</span> provides the breakthrough
          </p>
        </motion.div>
      </div>
    </section>
  );
}
