'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// Dark mode brand colors for structure levels
const structureLevels = [
  {
    title: 'Executive Sponsors',
    description: 'Senior leadership providing strategic direction and organizational authority',
    color: 'from-[#E85A6F] to-[#C41F3E]',
    bgColor: 'bg-[#E85A6F]/10',
    borderColor: 'border-[#E85A6F]/30',
    textColor: 'text-[#E85A6F]',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    title: 'Engagement Owners',
    description: 'Accountable leaders driving the engagement and ensuring outcomes are achieved',
    color: 'from-[#3AACCF] to-[#007FA3]',
    bgColor: 'bg-[#3AACCF]/10',
    borderColor: 'border-[#3AACCF]/30',
    textColor: 'text-[#3AACCF]',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: 'Designated Operations Team',
    description: 'Representatives from the Area of Responsibility (AOR) executing the work',
    color: 'from-[#20B2A4] to-[#A8D4B8]',
    bgColor: 'bg-[#20B2A4]/10',
    borderColor: 'border-[#20B2A4]/30',
    textColor: 'text-[#A8D4B8]',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Functional Support',
    description: 'Cross-functional expertise providing specialized guidance and resources',
    color: 'from-[#FF9F40] to-[#FF8200]',
    bgColor: 'bg-[#FF9F40]/10',
    borderColor: 'border-[#FF9F40]/30',
    textColor: 'text-[#FF9F40]',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    departments: ['Finance', 'Quality', 'ITDS', 'HR', 'Legal'],
  },
];

export default function EngagementStructure() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-10%' });

  return (
    <section
      ref={ref}
      className="min-h-screen w-full py-24 px-6 flex items-center justify-center bg-[#0F1D2F] relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_PATH || ''}/backgrounds/EdgeBackgroundSkyDivingIN.svg)`, backgroundSize: 'cover' }} />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Engagement Structure
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            The organizational framework that drives successful Edge Engage implementations
          </p>
        </motion.div>

        {/* Hierarchical structure */}
        <div className="space-y-4">
          {structureLevels.map((level, index) => (
            <motion.div
              key={level.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connecting line */}
              {index > 0 && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.15 }}
                  className="absolute -top-4 left-1/2 w-px h-4 bg-gradient-to-b from-white/20 to-white/5 origin-top"
                />
              )}

              <div className={`p-6 rounded-2xl ${level.bgColor} border ${level.borderColor} hover:border-white/30 transition-all duration-500 group`}>
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center text-white shadow-lg`}>
                    {level.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className={`${level.textColor} font-bold text-lg mb-1`}>
                      {level.title}
                    </h3>
                    <p className="text-white/60 text-sm">
                      {level.description}
                    </p>

                    {/* Departments grid for Functional Support */}
                    {level.departments && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={isInView ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="mt-4"
                      >
                        <div className="flex flex-wrap gap-2">
                          {level.departments.map((dept, deptIndex) => (
                            <motion.span
                              key={dept}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.3, delay: 0.9 + deptIndex * 0.1 }}
                              className={`px-3 py-1.5 rounded-lg ${level.bgColor} border ${level.borderColor} ${level.textColor} text-xs font-medium`}
                            >
                              {dept}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Level indicator */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full ${level.bgColor} border ${level.borderColor} flex items-center justify-center`}>
                    <span className={`${level.textColor} text-xs font-bold`}>{index + 1}</span>
                  </div>
                </div>

                {/* Hover glow */}
                <motion.div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${level.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Key message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10">
            <svg className="w-5 h-5 text-[#A8D4B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-white/80 font-medium">Clear accountability at every level</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
