'use client';

import { motion } from 'framer-motion';

type Status = 'not_started' | 'in_progress' | 'completed' | 'blocked';

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md';
}

const statusConfig: Record<Status, { label: string; color: string; bgColor: string; borderColor: string }> = {
  not_started: {
    label: 'Not Started',
    color: 'text-white/50',
    bgColor: 'bg-white/5',
    borderColor: 'border-white/20',
  },
  in_progress: {
    label: 'In Progress',
    color: 'text-[#FF9F40]',
    bgColor: 'bg-[#FF9F40]/10',
    borderColor: 'border-[#FF9F40]/30',
  },
  completed: {
    label: 'Completed',
    color: 'text-[#A8D4B8]',
    bgColor: 'bg-[#20B2A4]/10',
    borderColor: 'border-[#20B2A4]/30',
  },
  blocked: {
    label: 'Blocked',
    color: 'text-[#E85A6F]',
    bgColor: 'bg-[#E85A6F]/10',
    borderColor: 'border-[#E85A6F]/30',
  },
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 rounded-lg border ${sizeClasses} ${config.color} ${config.bgColor} ${config.borderColor} font-medium`}
    >
      {status === 'completed' && (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {status === 'in_progress' && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF9F40] animate-pulse" />
      )}
      {status === 'blocked' && (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )}
      {config.label}
    </motion.span>
  );
}
