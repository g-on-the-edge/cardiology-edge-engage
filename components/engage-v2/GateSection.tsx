'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function GateSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-20%' });

  const gateSteps = [
    {
      id: 'G.1',
      title: 'Executive Overview & Approval',
      description: 'Leadership reviews Phase I outcomes and validates the direction. This critical checkpoint ensures executive alignment and secures resources for the journey ahead.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: 'G.2',
      title: 'Key Stakeholder Overview',
      description: 'All key stakeholders are briefed and aligned. We ensure everyone understands the commitment, estimated timeline, and their role in the upcoming Discovery & Prioritization phase.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section
      ref={ref}
      className="min-h-screen w-full py-24 px-6 flex items-center justify-center bg-[#0F1D2F] relative overflow-hidden"
    >
      {/* Background - dramatic gate visual */}
      <div className="absolute inset-0">
        {/* Gradient gate effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#20B2A4]/10 to-transparent" />

        {/* Gate pillars visualization */}
        <div className="absolute left-0 top-0 bottom-0 w-1 md:w-2 bg-gradient-to-b from-transparent via-[#20B2A4]/30 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-1 md:w-2 bg-gradient-to-b from-transparent via-[#20B2A4]/30 to-transparent" />

        {/* Horizontal gate bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#20B2A4]/50 to-transparent"
        />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="absolute bottom-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#20B2A4]/50 to-transparent"
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Gate indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="text-center mb-12"
        >
          <div className="inline-flex flex-col items-center">
            {/* Gate icon */}
            <motion.div
              animate={isInView ? { y: [0, -5, 0] } : { y: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#20B2A4] to-[#A8D4B8] flex items-center justify-center shadow-2xl shadow-[#20B2A4]/30 mb-6"
            >
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </motion.div>

            <span className="text-[#A8D4B8] text-sm font-bold uppercase tracking-[0.3em] mb-2">
              Critical Checkpoint
            </span>

            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#A8D4B8] via-[#20B2A4] to-[#A8D4B8]">
                THE GATE
              </span>
            </h2>

            <p className="text-xl text-white/60 max-w-xl">
              Executive approval checkpoint between Phase 1 and Phase 2
            </p>
          </div>
        </motion.div>

        {/* Gate steps */}
        <div className="grid md:grid-cols-2 gap-6">
          {gateSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
              className="relative group"
            >
              <div className="p-6 rounded-2xl bg-white/5 border border-[#20B2A4]/20 hover:border-[#20B2A4]/40 transition-all duration-500 h-full">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#20B2A4]/10 to-[#A8D4B8]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  {/* Step header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#20B2A4]/20 to-[#A8D4B8]/20 border border-[#20B2A4]/30 flex items-center justify-center text-[#A8D4B8]">
                      {step.icon}
                    </div>
                    <div>
                      <span className="text-[#A8D4B8] text-xs font-bold uppercase tracking-wider">{step.id}</span>
                      <h3 className="text-white font-semibold text-lg">{step.title}</h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-white/60 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Approval indicator */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                    transition={{ duration: 0.4, delay: 1.2 + index * 0.2, type: 'spring' }}
                    className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#20B2A4]/20 border border-[#20B2A4]/30"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#20B2A4] flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[#A8D4B8] text-sm font-medium">Required for Phase 2</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Transition message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10">
            <svg className="w-5 h-5 text-[#A8D4B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="text-white/60">
              Upon approval, proceed to <span className="text-[#FF9F40] font-medium">Phase 2: Discovery & Prioritize</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
