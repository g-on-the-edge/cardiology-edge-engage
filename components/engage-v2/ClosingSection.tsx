'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

export default function ClosingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-10%' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create mailto link as fallback
    const subject = encodeURIComponent('Edge Engage Inquiry');
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );

    // Open mailto link
    window.location.href = `mailto:greg@ghsedge.com?subject=${subject}&body=${body}`;

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset after showing success
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <section
      ref={ref}
      className="min-h-screen w-full py-24 px-6 flex items-center justify-center relative overflow-hidden"
    >
      {/* Background - hopeful/sunrise feel */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F1D2F] via-[#1B365D]/30 to-[#0F1D2F]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#20B2A4]/10 via-transparent to-transparent" />

      {/* Subtle glow effects */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#20B2A4]/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#A8D4B8]/10 rounded-full blur-3xl"
      />

      <div className="max-w-4xl mx-auto relative z-10 w-full">
        {/* Completion indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="text-center mb-12"
        >
          {/* Success checkmarks */}
          <div className="flex justify-center gap-4 mb-8">
            {['Phase 1', 'Gate', 'Phase 2', 'Phase 3'].map((phase, index) => (
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={isInView ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-[#20B2A4] to-[#A8D4B8] flex items-center justify-center shadow-lg shadow-[#20B2A4]/30"
                >
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <span className="text-white/60 text-xs mt-2">{phase}</span>
              </motion.div>
            ))}
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/80">
              Ready to transform
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#A8D4B8] via-[#20B2A4] to-[#A8D4B8]">
              complexity into clarity?
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            Let&apos;s discuss how Edge Engage can help your organization achieve breakthrough results
          </motion.p>
        </motion.div>

        {/* Contact form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="max-w-xl mx-auto"
        >
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <h3 className="text-white font-semibold text-xl mb-6 text-center">
              Start the Conversation
            </h3>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-[#20B2A4]/20 border border-[#20B2A4]/30 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#A8D4B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-[#A8D4B8] font-medium">Your email client should open shortly</p>
                <p className="text-white/60 text-sm mt-2">If it doesn&apos;t, please email greg@ghsedge.com directly</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-white/60 text-sm mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#A8D4B8]/50 focus:ring-1 focus:ring-[#A8D4B8]/50 outline-none transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-white/60 text-sm mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#A8D4B8]/50 focus:ring-1 focus:ring-[#A8D4B8]/50 outline-none transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-white/60 text-sm mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#91BFA1]/50 focus:ring-1 focus:ring-[#91BFA1]/50 outline-none transition-all resize-none"
                    placeholder="Tell us about your challenge or opportunity..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#20B2A4] to-[#A8D4B8] text-white font-semibold text-lg shadow-lg shadow-[#20B2A4]/30 hover:shadow-xl hover:shadow-[#20B2A4]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Opening Email...
                    </span>
                  ) : (
                    'Schedule a Conversation'
                  )}
                </motion.button>
              </form>
            )}

            {/* Direct contact option */}
            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-white/40 text-sm">
                Or reach out directly at{' '}
                <a
                  href="mailto:greg@ghsedge.com"
                  className="text-[#A8D4B8] hover:text-[#A8D4B8]/80 transition-colors"
                >
                  greg@ghsedge.com
                </a>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Edge branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 text-white/30">
            <span className="text-sm">Powered by</span>
            <span className="font-bold text-[#A8D4B8]/60">EDGE</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
