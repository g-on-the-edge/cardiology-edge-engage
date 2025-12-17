'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// Dark mode brand colors
const principles = [
  {
    title: 'TRUST THE PROCESS',
    subtitle: 'Ambiguous. Painful. Shocking.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    color: 'from-[#E85A6F] to-[#C41F3E]',
  },
  {
    title: 'OPEN TO GIVE UP CONTROL',
    subtitle: 'This is by design.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    color: 'from-[#243B53] to-[#1B365D]',
  },
  {
    title: 'PREPARED TO TAKE TWO STEPS BACK',
    subtitle: 'To get one step forward.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    ),
    color: 'from-[#3AACCF] to-[#007FA3]',
  },
  {
    title: 'COMMIT TO REAL-TIME ESCALATION',
    subtitle: 'Honor Commitment.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: 'from-[#FF9F40] to-[#FF8200]',
  },
  {
    title: 'COMMIT TO A CADENCE OF ACCOUNTABILITY',
    subtitle: 'Showing Up.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'from-[#20B2A4] to-[#A8D4B8]',
  },
];

export default function PrinciplesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-10%' });

  return (
    <section
      ref={ref}
      className="min-h-screen w-full py-24 px-6 flex items-center justify-center bg-[#0F1D2F] relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#E85A6F]/5 to-transparent" />

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
              Principles of Success
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Leaders must act as champions through these guiding principles
          </p>
        </motion.div>

        {/* Principles cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.title}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.9 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`
                relative group p-6 rounded-2xl
                bg-white/5 border border-white/10
                hover:bg-white/10 hover:border-white/20
                transition-all duration-500
                ${index === 4 ? 'md:col-span-2 lg:col-span-1 lg:col-start-2' : ''}
              `}
            >
              {/* Gradient accent line */}
              <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${principle.color} opacity-60 group-hover:opacity-100 transition-opacity`} />

              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${principle.color} p-3 mb-4 text-white shadow-lg`}>
                {principle.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-2">
                {principle.title}
              </h3>
              <p className="text-white/60">
                {principle.subtitle}
              </p>

              {/* Hover glow effect */}
              <motion.div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${principle.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}
              />
            </motion.div>
          ))}
        </div>

        {/* Footer message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            <span className="text-white/80 font-medium">Leaders must act as champions</span> through these guiding principles
          </p>
        </motion.div>
      </div>
    </section>
  );
}
