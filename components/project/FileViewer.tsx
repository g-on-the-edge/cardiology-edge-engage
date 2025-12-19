'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import type { Asset } from '@/types/database';

interface FileViewerProps {
  asset: Asset;
  onClose: () => void;
}

export default function FileViewer({ asset, onClose }: FileViewerProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getSignedUrl() {
      // For external links, use the URL directly
      if (asset.metadata && (asset.metadata as any).source === 'external_link') {
        setSignedUrl(asset.url);
        setIsLoading(false);
        return;
      }

      // For uploaded files, get a signed URL from Supabase Storage
      if (asset.url) {
        const supabase = createClient();
        const { data, error } = await supabase.storage
          .from('project-assets')
          .createSignedUrl(asset.url, 3600); // 1 hour expiry

        if (error) {
          setError('Failed to load file');
          console.error('Signed URL error:', error);
        } else if (data) {
          setSignedUrl(data.signedUrl);
        }
      }
      setIsLoading(false);
    }

    getSignedUrl();
  }, [asset]);

  const isImage = asset.type === 'image' || asset.mime_type?.startsWith('image/');
  const isPdf = asset.type === 'document' && (asset.mime_type === 'application/pdf' || asset.name?.endsWith('.pdf'));
  const isVideo = asset.type === 'video' || asset.mime_type?.startsWith('video/');

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <svg className="animate-spin w-12 h-12 text-[#20B2A4]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      );
    }

    if (error || !signedUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-white/60">
          <svg className="w-16 h-16 mb-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>{error || 'Unable to load file'}</p>
          <a
            href={asset.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition-colors"
          >
            Open in New Tab
          </a>
        </div>
      );
    }

    if (isImage) {
      return (
        <div className="flex items-center justify-center h-full p-8">
          <img
            src={signedUrl}
            alt={asset.name}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>
      );
    }

    if (isPdf) {
      return (
        <iframe
          src={signedUrl}
          className="w-full h-full rounded-lg"
          title={asset.name}
        />
      );
    }

    if (isVideo) {
      // Check if it's an external video link (YouTube, Vimeo, etc.)
      if (asset.metadata && (asset.metadata as any).source === 'external_link') {
        // For YouTube/Vimeo, we could embed, but for now open externally
        return (
          <div className="flex flex-col items-center justify-center h-full text-white/60">
            <svg className="w-16 h-16 mb-4 text-[#E85A6F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="mb-4">External Video</p>
            <a
              href={signedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#E85A6F]/20 border border-[#E85A6F]/30 text-[#E85A6F] text-sm hover:bg-[#E85A6F]/30 transition-colors"
            >
              Open Video
            </a>
          </div>
        );
      }

      return (
        <div className="flex items-center justify-center h-full p-8">
          <video
            src={signedUrl}
            controls
            className="max-w-full max-h-full rounded-lg shadow-2xl"
          >
            Your browser does not support the video element.
          </video>
        </div>
      );
    }

    // For other file types, show download option
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/60">
        <svg className="w-16 h-16 mb-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <p className="mb-2">{asset.name}</p>
        <p className="text-sm text-white/40 mb-4">
          {asset.mime_type || 'Unknown file type'}
        </p>
        <a
          href={signedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition-colors"
        >
          Download File
        </a>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col"
        onClick={onClose}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b border-white/10 bg-[#1A2A3F]/90"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3">
            {getFileIcon(asset.type, asset.mime_type)}
            <span className="text-white font-medium truncate max-w-md">
              {asset.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {signedUrl && (
              <a
                href={signedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                title="Open in new tab"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className="flex-1 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {renderContent()}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function getFileIcon(type: Asset['type'], mimeType?: string | null) {
  const isPdf = type === 'document' || mimeType === 'application/pdf';

  if (type === 'image' || mimeType?.startsWith('image/')) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#A8D4B8]/20 flex items-center justify-center">
        <svg className="w-4 h-4 text-[#A8D4B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  if (isPdf) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#FF9F40]/20 flex items-center justify-center">
        <svg className="w-4 h-4 text-[#FF9F40]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
    );
  }

  if (type === 'video' || mimeType?.startsWith('video/')) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#E85A6F]/20 flex items-center justify-center">
        <svg className="w-4 h-4 text-[#E85A6F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  if (type === 'link') {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#3AACCF]/20 flex items-center justify-center">
        <svg className="w-4 h-4 text-[#3AACCF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
      <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    </div>
  );
}
