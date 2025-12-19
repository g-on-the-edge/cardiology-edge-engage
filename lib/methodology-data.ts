// Static methodology structure for the Edge Engage Method

export interface Step {
  id: string;
  title: string;
  description: string;
  category: 'open' | 'narrow' | 'close';
  phase: number;
  audioSrc?: string;
}

export interface Deliverable {
  id: string;
  title: string;
  phase: number;
}

export const steps: Step[] = [
  // Phase 1: Define Outcomes & Guiding Principles
  {
    id: '1.1',
    title: 'Edge Engage Orientation',
    description: 'Overview of the Edge Engage Execution Methodology to set expectations for the journey ahead.',
    category: 'open',
    phase: 1,
  },
  {
    id: '1.2',
    title: 'Brainstorm Outcomes & Guiding Principles',
    description: 'Collaborative ideation to capture desired outcomes, strategic goals, and guiding principles.',
    category: 'open',
    phase: 1,
  },
  {
    id: '1.3',
    title: 'Prioritize & Align',
    description: 'Evaluate and rank outcomes based on strategic importance and feasibility. Align on guiding principles of the engagement.',
    category: 'narrow',
    phase: 1,
  },
  {
    id: '1.4',
    title: 'Commitment',
    description: 'Formal agreement and signoff on prioritized outcomes with clear metrics and accountability. Close on guiding principles.',
    category: 'close',
    phase: 1,
  },
  // Gate
  {
    id: 'G.1',
    title: 'Executive Overview & Approval',
    description: 'Leadership reviews Phase I outcomes and validates the direction. This critical checkpoint ensures executive alignment and secures resources.',
    category: 'close',
    phase: 0, // Gate is between phases
  },
  {
    id: 'G.2',
    title: 'Key Stakeholder Overview',
    description: 'All key stakeholders are briefed and aligned. Everyone understands the commitment, timeline, and their role in Phase 2.',
    category: 'close',
    phase: 0,
  },
  // Phase 2: Discovery & Prioritize
  {
    id: '2.1',
    title: 'Internal Scan',
    description: 'Deep dive into People, Process, Policy, Data, and Technology pain points. Gather all related data to help steer informed decisions.',
    category: 'open',
    phase: 2,
  },
  {
    id: '2.2',
    title: 'External Scan',
    description: 'Research best practices, successful models, and solution market landscape.',
    category: 'open',
    phase: 2,
  },
  {
    id: '2.3',
    title: 'Teach Back & Gap Analysis',
    description: 'Connect internal pain points with external solutions and identify gaps.',
    category: 'open',
    phase: 2,
    audioSrc: '/audio/teachback.mp3',
  },
  {
    id: '2.4',
    title: 'Brainstorm Solutions',
    description: 'Generate potential solutions based on gap analysis findings.',
    category: 'open',
    phase: 2,
  },
  {
    id: '2.5',
    title: 'Assessment of Solutions',
    description: 'Evaluate solutions using Impact vs Effort, Urgency, and Feasibility matrices.',
    category: 'narrow',
    phase: 2,
  },
  {
    id: '2.6',
    title: 'Prioritized Solutions',
    description: 'Final ranked list of vetted solutions with confirmed pain/solution fit.',
    category: 'close',
    phase: 2,
  },
  // Phase 3: Execution & Monitoring
  {
    id: '3.1',
    title: 'Execution Handoff',
    description: 'Transition prioritized solutions to appropriate execution methods (Projects, Agile, etc.).',
    category: 'open',
    phase: 3,
  },
  {
    id: '3.2',
    title: 'Implementation Monitoring',
    description: 'Track progress, identify blockers, and ensure alignment with planned outcomes.',
    category: 'narrow',
    phase: 3,
  },
  {
    id: '3.3',
    title: 'Outcomes Tracking',
    description: 'Measure results against defined metrics and ROI expectations.',
    category: 'close',
    phase: 3,
  },
];

export const deliverables: Deliverable[] = [
  // Phase 1
  { id: 'd1.1', title: 'Current Space & Past Work Catalogue', phase: 1 },
  { id: 'd1.2', title: 'Prioritized Outcomes Connected to Strategic Goals & Guiding Principles', phase: 1 },
  { id: 'd1.3', title: 'Current State Metrics & Scorecard', phase: 1 },
  { id: 'd1.4', title: 'Prioritized Metrics & 1-5 Year Targets', phase: 1 },
  // Phase 2
  { id: 'd2.1', title: 'Prioritized Pain Point Report', phase: 2 },
  { id: 'd2.2', title: 'Quick Wins Identified', phase: 2 },
  { id: 'd2.3', title: 'Gap Analysis Report', phase: 2 },
  { id: 'd2.4', title: 'Prioritized Best in Class Models', phase: 2 },
  { id: 'd2.5', title: 'Solution Validation Report', phase: 2 },
  { id: 'd2.6', title: 'Execution Roadmap', phase: 2 },
  // Phase 3
  { id: 'd3.1', title: 'Outcome & ROI Tracking Dashboard', phase: 3 },
  { id: 'd3.2', title: 'Scorecard Review Reports', phase: 3 },
  { id: 'd3.3', title: 'The Execution Roadmap', phase: 3 },
  { id: 'd3.4', title: 'Business / Care Plan', phase: 3 },
  { id: 'd3.5', title: 'Success Tracking & Reporting', phase: 3 },
];

export const phaseInfo = {
  1: {
    title: 'Define Outcomes & Guiding Principles',
    subtitle: 'Setting the foundation with clear, measurable objectives aligned to strategic goals',
    gradient: 'from-[#3AACCF] to-[#007FA3]',
    accentColor: 'bg-[#3AACCF]/10',
    textColor: 'text-[#3AACCF]',
  },
  2: {
    title: 'Discovery & Prioritize',
    subtitle: 'Finding pain points, exploring solutions, and prioritizing what matters most',
    gradient: 'from-[#FF9F40] to-[#FF8200]',
    accentColor: 'bg-[#FF9F40]/10',
    textColor: 'text-[#FF9F40]',
  },
  3: {
    title: 'Execution & Monitoring',
    subtitle: 'Bringing solutions to life and tracking outcomes to ensure success',
    gradient: 'from-[#E85A6F] to-[#C41F3E]',
    accentColor: 'bg-[#E85A6F]/10',
    textColor: 'text-[#E85A6F]',
  },
};

export function getStepsByPhase(phase: number): Step[] {
  return steps.filter(s => s.phase === phase);
}

export function getDeliverablesByPhase(phase: number): Deliverable[] {
  return deliverables.filter(d => d.phase === phase);
}

export function getGateSteps(): Step[] {
  return steps.filter(s => s.id.startsWith('G.'));
}
