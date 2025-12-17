'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function FrameworkSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-20%' });

  return (
    <section
      ref={ref}
      className="min-h-screen w-full py-24 px-6 flex items-center justify-center bg-[#0F1D2F] relative overflow-hidden"
    >
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
              Our Framework
            </span>
          </h2>
          <p className="text-lg sm:text-2xl md:text-3xl font-light whitespace-nowrap">
            <span className="text-[#A8D4B8]">OPEN</span>
            <span className="text-white/40 mx-1.5 sm:mx-3">—</span>
            <span className="text-[#FF9F40]">NARROW</span>
            <span className="text-white/40 mx-1.5 sm:mx-3">—</span>
            <span className="text-[#F8FAFC]/70">CLOSE</span>
          </p>
        </motion.div>

        {/* Visual representation - Using official Open Narrow Close image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-16"
        >
          <motion.img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/methodology/Open_Narrow_Close.png`}
            alt="Open Narrow Close Framework"
            className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto"
            animate={isInView ? { scale: [1, 1.02, 1] } : { scale: 1 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Descriptions */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* OPEN description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <div className="w-12 h-12 rounded-full bg-[#A8D4B8]/20 border border-[#A8D4B8]/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#A8D4B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-[#A8D4B8] font-bold text-lg mb-2">OPEN</h3>
            <p className="text-white/60">
              <span className="text-white/80 font-medium">Comfortable.</span> Ideas, opinions, and information shared through conversation and brainstorming.
            </p>
          </motion.div>

          {/* NARROW description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-center"
          >
            <div className="w-12 h-12 rounded-full bg-[#FF9F40]/20 border border-[#FF9F40]/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#FF9F40]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-[#FF9F40] font-bold text-lg mb-2">NARROW</h3>
            <p className="text-white/60">
              <span className="text-white/80 font-medium">More Focused.</span> Organize and evaluate the information in order to develop a better understanding.
            </p>
          </motion.div>

          {/* CLOSE description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-center"
          >
            <div className="w-12 h-12 rounded-full bg-[#243B53]/50 border border-[#2D4A6F] flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#F8FAFC]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-[#F8FAFC]/70 font-bold text-lg mb-2">CLOSE</h3>
            <p className="text-white/60">
              <span className="text-white/80 font-medium">Consensus.</span> Decision is made, understood, and agreed upon. Solidarity across the team.
            </p>
          </motion.div>
        </div>

        {/* Applied to each phase indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-16"
        >
          <p className="text-white/40 text-sm uppercase tracking-widest mb-4">This framework applies to each phase</p>
          <div className="flex items-center justify-center gap-4">
            <span className="px-3 py-1 rounded-lg bg-[#3AACCF]/20 text-[#3AACCF] text-sm font-medium border border-[#3AACCF]/30">Phase 1</span>
            <span className="px-3 py-1 rounded-lg bg-[#FF9F40]/20 text-[#FF9F40] text-sm font-medium border border-[#FF9F40]/30">Phase 2</span>
            <span className="px-3 py-1 rounded-lg bg-[#E85A6F]/20 text-[#E85A6F] text-sm font-medium border border-[#E85A6F]/30">Phase 3</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
