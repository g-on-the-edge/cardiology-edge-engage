'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AssetButtonProps {
  count: number;
  onClick: () => void;
  onAdd: () => void;
}

export default function AssetButton({ count, onClick, onAdd }: AssetButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={onClick}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#3AACCF]/30 transition-all text-white/60 hover:text-white text-xs font-medium"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
        <span>{count}</span>
        <span className="sr-only">assets</span>
      </button>

      <AnimatePresence>
        {isHovered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, x: -5 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -5 }}
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            className="absolute -right-8 top-0 p-1.5 rounded-lg bg-[#20B2A4]/20 border border-[#20B2A4]/30 hover:bg-[#20B2A4]/30 transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-[#A8D4B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
