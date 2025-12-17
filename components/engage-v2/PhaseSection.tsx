'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface Step {
  id: string;
  title: string;
  description: string;
  category: 'open' | 'narrow' | 'close';
}

interface Deliverable {
  title: string;
  icon?: React.ReactNode;
}

interface PhaseSectionProps {
  phaseNumber: 1 | 2 | 3;
  title: string;
  subtitle: string;
  steps: Step[];
  deliverables: Deliverable[];
  gradient: string;
  accentColor: string;
  textColor: string;
  children?: React.ReactNode;
}

// Dark mode brand colors for O-N-C categories
const categoryColors = {
  open: { bg: 'bg-[#A8D4B8]', text: 'text-[#A8D4B8]', border: 'border-[#A8D4B8]/30' },
  narrow: { bg: 'bg-[#FF9F40]', text: 'text-[#FF9F40]', border: 'border-[#FF9F40]/30' },
  close: { bg: 'bg-[#243B53]', text: 'text-[#F8FAFC]/70', border: 'border-[#243B53]/50' },
};

export default function PhaseSection({
  phaseNumber,
  title,
  subtitle,
  steps,
  deliverables,
  gradient,
  accentColor,
  textColor,
  children,
}: PhaseSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-10%' });

  return (
    <section
      ref={ref}
      className="min-h-screen w-full py-24 px-6 flex items-center justify-center bg-[#0F1D2F] relative overflow-hidden"
    >
      {/* Background accent */}
      <div className={`absolute inset-0 bg-gradient-to-b ${gradient} opacity-5`} />

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        {/* Phase header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${gradient} mb-4`}
          >
            <span className="text-white font-bold text-sm">PHASE {phaseNumber}</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              {title}
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            {subtitle}
          </p>
          
          {/* Animated tagline - only show for Phase 1 */}
          {phaseNumber === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-8 text-lg md:text-2xl font-light italic tracking-wide"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {['We', 'always', 'start', 'with', 'Outcomes'].map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.6 + (index * 0.15),
                    ease: 'easeOut'
                  }}
                  className={`inline-block ${
                    word === 'Outcomes' 
                      ? 'bg-clip-text text-transparent bg-gradient-to-r from-[#3AACCF] to-[#007FA3] font-semibold not-italic' 
                      : 'text-white/90'
                  }`}
                  style={{ marginRight: word === 'Outcomes' ? '0' : '0.35em' }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Steps column */}
          <div className="lg:col-span-2">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6 }}
              className={`${textColor} font-semibold text-sm uppercase tracking-wider mb-6`}
            >
              Process Steps
            </motion.h3>

            <div className="space-y-4">
              {steps.map((step, index) => {
                const colors = categoryColors[step.category];
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                  >
                    {/* Step number */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-sm">{step.id}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-white font-semibold">{step.title}</h4>
                      </div>
                      <p className="text-white/60 text-sm">{step.description}</p>
                    </div>

                    {/* Category label and indicator dot */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${colors.text} ${colors.border} border bg-white/5`}>
                        {step.category}
                      </span>
                      <div className={`w-3 h-3 rounded-full ${colors.bg} opacity-60 group-hover:opacity-100 transition-opacity`} />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Additional content (like Phase 2's internal/external scan) */}
            {children}
          </div>

          {/* Deliverables column */}
          <div>
            <motion.h3
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.6 }}
              className={`${textColor} font-semibold text-sm uppercase tracking-wider mb-6`}
            >
              Deliverables
            </motion.h3>

            <div className="space-y-3">
              {deliverables.map((deliverable, index) => (
                <motion.div
                  key={deliverable.title}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className={`p-4 rounded-xl ${accentColor} border border-[#2D4A6F] hover:border-white/20 transition-all`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                      {deliverable.icon || (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-white/80 text-sm font-medium">{deliverable.title}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Phase 1 specific component
export function Phase1Section() {
  const steps: Step[] = [
    {
      id: '1.1',
      title: 'Edge Engage Orientation',
      description: 'Overview of the Edge Engage Execution Methodology to set expectations for the journey ahead.',
      category: 'open',
    },
    {
      id: '1.2',
      title: 'Brainstorm Outcomes & Guiding Principles',
      description: 'Collaborative ideation to capture desired outcomes, strategic goals, and guiding principles.',
      category: 'open',
    },
    {
      id: '1.3',
      title: 'Prioritize & Align',
      description: 'Evaluate and rank outcomes based on strategic importance and feasibility. Align on guiding principles of the engagement.',
      category: 'narrow',
    },
    {
      id: '1.4',
      title: 'Commitment',
      description: 'Formal agreement and signoff on prioritized outcomes with clear metrics and accountability. Close on guiding principles.',
      category: 'close',
    },
  ];

  const deliverables: Deliverable[] = [
    { title: 'Current Space & Past Work Catalogue' },
    { title: 'Prioritized Outcomes Connected to Strategic Goals & Guiding Principles' },
    { title: 'Current State Metrics & Scorecard' },
    { title: 'Prioritized Metrics & 1-5 Year Targets' },
  ];

  return (
    <PhaseSection
      phaseNumber={1}
      title="Define Outcomes & Guiding Principles"
      subtitle="Setting the foundation with clear, measurable objectives aligned to strategic goals"
      steps={steps}
      deliverables={deliverables}
      gradient="from-[#3AACCF] to-[#007FA3]"
      accentColor="bg-[#3AACCF]/10"
      textColor="text-[#3AACCF]"
    />
  );
}

// Phase 2 specific component
export function Phase2Section() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-10%' });

  const discoverySteps: Step[] = [
    {
      id: '2.1',
      title: 'Internal Scan',
      description: 'Deep dive into People, Process, Policy, Data, and Technology pain points. Gather all related data to help steer informed decisions.',
      category: 'open',
    },
    {
      id: '2.2',
      title: 'External Scan',
      description: 'Research best practices, successful models, and solution market landscape.',
      category: 'open',
    },
    {
      id: '2.3',
      title: 'Teach Back & Gap Analysis',
      description: 'Connect internal pain points with external solutions and identify gaps.',
      category: 'open',
    },
    {
      id: '2.4',
      title: 'Brainstorm Solutions',
      description: 'Generate potential solutions based on gap analysis findings.',
      category: 'open',
    },
    {
      id: '2.5',
      title: 'Assessment of Solutions',
      description: 'Evaluate solutions using Impact vs Effort, Urgency, and Feasibility matrices.',
      category: 'narrow',
    },
    {
      id: '2.6',
      title: 'Prioritized Solutions',
      description: 'Final ranked list of vetted solutions with confirmed pain/solution fit.',
      category: 'close',
    },
  ];

  const deliverables: Deliverable[] = [
    { title: 'Prioritized Pain Point Report' },
    { title: 'Quick Wins Identified' },
    { title: 'Gap Analysis Report' },
    { title: 'Prioritized Best in Class Models' },
    { title: 'Solution Validation Report' },
    { title: 'Execution Roadmap' },
  ];

  return (
    <section
      ref={ref}
      className="min-h-screen w-full py-24 px-6 flex items-center justify-center bg-[#0F1D2F] relative overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FF9F40]/5 to-[#FF9F40]/10" />

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        {/* Phase header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF9F40] to-[#FF8200] mb-4"
          >
            <span className="text-white font-bold text-sm">PHASE 2</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Discovery & Prioritize
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Finding pain points, exploring solutions, and prioritizing what matters most
          </p>
        </motion.div>

        {/* Internal/External Scan Visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {/* Internal Scan */}
            <div className="p-6 rounded-xl bg-[#E85A6F]/10 border border-[#E85A6F]/20">
              <h4 className="text-[#E85A6F] font-bold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Internal Scan
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {['People', 'Process', 'Policy', 'Technology'].map((item) => (
                  <div key={item} className="px-3 py-2 rounded-lg bg-[#E85A6F]/10 text-[#F8FAFC]/80 text-sm text-center">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* External Scan */}
            <div className="p-6 rounded-xl bg-[#A8D4B8]/10 border border-[#A8D4B8]/20">
              <h4 className="text-[#A8D4B8] font-bold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                External Scan
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {['Best Practices', 'Success Models', 'Market Solutions', 'Industry Trends'].map((item) => (
                  <div key={item} className="px-3 py-2 rounded-lg bg-[#A8D4B8]/10 text-[#F8FAFC]/80 text-sm text-center">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Convergence arrow */}
          <div className="flex justify-center">
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center"
            >
              <svg className="w-8 h-8 text-[#FF9F40] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span className="text-[#FF9F40] text-sm font-medium">Gap Analysis</span>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Steps column */}
          <div className="lg:col-span-2">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6 }}
              className="text-[#FF9F40] font-semibold text-sm uppercase tracking-wider mb-6"
            >
              Process Steps
            </motion.h3>

            <div className="space-y-4">
              {discoverySteps.map((step, index) => {
                const colors = categoryColors[step.category];
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF9F40] to-[#FF8200] flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">{step.id}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-white font-semibold">{step.title}</h4>
                      </div>
                      <p className="text-white/60 text-sm">{step.description}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${colors.text} ${colors.border} border bg-white/5`}>
                        {step.category}
                      </span>
                      <div className={`w-3 h-3 rounded-full ${colors.bg} opacity-60 group-hover:opacity-100 transition-opacity`} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Deliverables column */}
          <div>
            <motion.h3
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.6 }}
              className="text-[#FF9F40] font-semibold text-sm uppercase tracking-wider mb-6"
            >
              Deliverables
            </motion.h3>

            <div className="space-y-3">
              {deliverables.map((deliverable, index) => (
                <motion.div
                  key={deliverable.title}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="p-4 rounded-xl bg-[#FF9F40]/10 border border-[#FF9F40]/20 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9F40] to-[#FF8200] flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="text-white/80 text-sm font-medium">{deliverable.title}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Phase 3 specific component
export function Phase3Section() {
  const steps: Step[] = [
    {
      id: '3.1',
      title: 'Execution Handoff',
      description: 'Transition prioritized solutions to appropriate execution methods (Projects, Agile, etc.).',
      category: 'open',
    },
    {
      id: '3.2',
      title: 'Implementation Monitoring',
      description: 'Track progress, identify blockers, and ensure alignment with planned outcomes.',
      category: 'narrow',
    },
    {
      id: '3.3',
      title: 'Outcomes Tracking',
      description: 'Measure results against defined metrics and ROI expectations.',
      category: 'close',
    },
  ];

  const deliverables: Deliverable[] = [
    { title: 'Outcome & ROI Tracking Dashboard' },
    { title: 'Scorecard Review Reports' },
    { title: 'The Execution Roadmap' },
    { title: 'Business / Care Plan' },
    { title: 'Success Tracking & Reporting' },
  ];

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-10%' });

  // Dark mode brand colors for execution methods
  const executionMethods = [
    { name: 'Projects', color: 'bg-[#3AACCF]/20 text-[#3AACCF] border-[#3AACCF]/30' },
    { name: 'Agile | Scrum', color: 'bg-[#243B53]/30 text-[#F8FAFC]/80 border-[#2D4A6F]/40' },
    { name: 'Cont. Process Improvement', color: 'bg-[#A8D4B8]/20 text-[#A8D4B8] border-[#A8D4B8]/30' },
    { name: 'Kanban', color: 'bg-[#20B2A4]/20 text-[#A8D4B8] border-[#20B2A4]/30' },
    { name: 'Edge Engage', color: 'bg-[#E85A6F]/20 text-[#E85A6F] border-[#E85A6F]/30', highlight: true },
  ];

  return (
    <section
      ref={ref}
      className="min-h-screen w-full py-24 px-6 flex items-center justify-center bg-[#0F1D2F] relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#E85A6F]/5 to-[#E85A6F]/10" />

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        {/* Phase header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#E85A6F] to-[#C41F3E] mb-4"
          >
            <span className="text-white font-bold text-sm">PHASE 3</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Execution & Monitoring
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Bringing solutions to life and tracking outcomes to ensure success
          </p>
        </motion.div>

        {/* Execution Methods Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <h4 className="text-white/60 text-sm uppercase tracking-wider text-center mb-4">
            Execution Methods Available
          </h4>
          <div className="flex flex-wrap justify-center gap-3">
            {executionMethods.map((method, index) => (
              <motion.div
                key={method.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className={`px-4 py-2 rounded-lg border ${method.color} ${method.highlight ? 'ring-2 ring-[#E85A6F]/50' : ''}`}
              >
                <span className="text-sm font-medium">{method.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Steps */}
          <div className="lg:col-span-2">
            <h3 className="text-[#E85A6F] font-semibold text-sm uppercase tracking-wider mb-6">
              Process Steps
            </h3>
            <div className="space-y-4">
              {steps.map((step, index) => {
                const colors = categoryColors[step.category];
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#E85A6F] to-[#C41F3E] flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">{step.id}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-white font-semibold">{step.title}</h4>
                      </div>
                      <p className="text-white/60 text-sm">{step.description}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${colors.text} ${colors.border} border bg-white/5`}>
                        {step.category}
                      </span>
                      <div className={`w-3 h-3 rounded-full ${colors.bg} opacity-60 group-hover:opacity-100 transition-opacity`} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Deliverables */}
          <div>
            <h3 className="text-[#E85A6F] font-semibold text-sm uppercase tracking-wider mb-6">
              Deliverables
            </h3>
            <div className="space-y-3">
              {deliverables.map((deliverable, index) => (
                <motion.div
                  key={deliverable.title}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="p-4 rounded-xl bg-[#E85A6F]/10 border border-[#E85A6F]/20 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E85A6F] to-[#C41F3E] flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <span className="text-white/80 text-sm font-medium">{deliverable.title}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
