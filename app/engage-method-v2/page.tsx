'use client';

import { useEffect, useState, useRef } from 'react';
import { useScroll } from 'framer-motion';

// Import all sections
import ProgressiveBuilder, { SectionId } from '@/components/engage-v2/ProgressiveBuilder';
import HeroSection from '@/components/engage-v2/HeroSection';
import ChallengeSection from '@/components/engage-v2/ChallengeSection';
import PrinciplesSection from '@/components/engage-v2/PrinciplesSection';
import FrameworkSection from '@/components/engage-v2/FrameworkSection';
import { Phase1Section, Phase2Section, Phase3Section } from '@/components/engage-v2/PhaseSection';
import GateSection from '@/components/engage-v2/GateSection';
import EngagementStructure from '@/components/engage-v2/EngagementStructure';
import ClosingSection from '@/components/engage-v2/ClosingSection';

// Section configuration for scroll tracking
const sections: { id: SectionId; threshold: number }[] = [
  { id: 'hero', threshold: 0 },
  { id: 'challenge', threshold: 0.08 },
  { id: 'principles', threshold: 0.18 },
  { id: 'framework', threshold: 0.28 },
  { id: 'phase1', threshold: 0.38 },
  { id: 'gate', threshold: 0.48 },
  { id: 'phase2', threshold: 0.58 },
  { id: 'phase3', threshold: 0.70 },
  { id: 'structure', threshold: 0.82 },
  { id: 'closing', threshold: 0.92 },
];

export default function EngageMethodV2Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [showBuilder, setShowBuilder] = useState(false);

  // Track scroll progress and determine active section
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (progress) => {
      // Show builder after scrolling past hero
      setShowBuilder(progress > 0.05);

      // Determine active section based on scroll progress
      for (let i = sections.length - 1; i >= 0; i--) {
        if (progress >= sections[i].threshold) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  // Intersection Observer for more precise section detection
  useEffect(() => {
    const observerOptions = {
      root: containerRef.current,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0,
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('data-section') as SectionId;
          if (sectionId) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all section elements
    const sectionElements = containerRef.current?.querySelectorAll('[data-section]');
    sectionElements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative bg-[#0F1D2F] min-h-screen">
      {/* Progressive Builder - Sticky header that builds as you scroll */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          showBuilder ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
        }`}
      >
        <ProgressiveBuilder
          scrollProgress={scrollYProgress}
          activeSection={activeSection}
        />
      </div>

      {/* Main scrollable content */}
      <div
        ref={containerRef}
        className="relative h-screen overflow-y-auto overflow-x-hidden scroll-smooth"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Hero Section */}
        <div data-section="hero">
          <HeroSection />
        </div>

        {/* Challenge Section - Cynefin Matrix */}
        <div data-section="challenge">
          <ChallengeSection />
        </div>

        {/* Principles of Success */}
        <div data-section="principles">
          <PrinciplesSection />
        </div>

        {/* Open-Narrow-Close Framework */}
        <div data-section="framework">
          <FrameworkSection />
        </div>

        {/* Phase 1: Define Outcomes */}
        <div data-section="phase1">
          <Phase1Section />
        </div>

        {/* Gate: Executive Approval */}
        <div data-section="gate">
          <GateSection />
        </div>

        {/* Phase 2: Discovery & Prioritize */}
        <div data-section="phase2">
          <Phase2Section />
        </div>

        {/* Phase 3: Execution & Monitoring */}
        <div data-section="phase3">
          <Phase3Section />
        </div>

        {/* Engagement Structure */}
        <div data-section="structure">
          <EngagementStructure />
        </div>

        {/* Closing / CTA */}
        <div data-section="closing">
          <ClosingSection />
        </div>
      </div>

      {/* Scroll progress indicator (bottom of screen) */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-white/5 z-50">
        <div
          className="h-full transition-all duration-150"
          style={{
            background: 'linear-gradient(to right, #3AACCF, #20B2A4, #FF9F40, #E85A6F)',
            width: `${Math.min(100, (sections.findIndex(s => s.id === activeSection) + 1) / sections.length * 100)}%`,
          }}
        />
      </div>

      {/* Section indicator dots (right side) */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => {
              const element = document.querySelector(`[data-section="${section.id}"]`);
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeSection === section.id
                ? 'bg-[#A8D4B8] scale-150'
                : 'bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to ${section.id} section`}
          />
        ))}
      </div>
    </div>
  );
}
