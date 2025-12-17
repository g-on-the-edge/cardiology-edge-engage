'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/providers/AuthProvider';
import type { Asset } from '@/types/database';

interface AssetModalProps {
  projectId: string;
  targetType: 'step' | 'deliverable' | 'meeting';
  targetId: string;
  mode: 'view' | 'add';
  assets: Asset[];
  onClose: () => void;
  onAssetAdded: (asset: Asset) => void;
}

export default function AssetModal({
  projectId,
  targetType,
  targetId,
  mode: initialMode,
  assets,
  onClose,
  onAssetAdded,
}: AssetModalProps) {
  const { user } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [isUploading, setIsUploading] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkName, setLinkName] = useState('');
  const [linkDescription, setLinkDescription] = useState('');
  const [uploadType, setUploadType] = useState<'link' | 'file'>('link');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl || !linkName || !user) return;

    setIsUploading(true);
    const supabase = createClient();

    // Determine link type
    let type: Asset['type'] = 'link';
    if (linkUrl.includes('youtube.com') || linkUrl.includes('vimeo.com') || linkUrl.includes('loom.com') || linkUrl.includes('zoom.us')) {
      type = 'video';
    } else if (linkUrl.includes('docs.google.com') || linkUrl.includes('sharepoint') || linkUrl.endsWith('.pdf')) {
      type = 'document';
    }

    // Create asset
    const { data: asset, error } = await supabase
      .from('assets')
      .insert({
        project_id: projectId,
        uploaded_by: user.id,
        type,
        name: linkName,
        description: linkDescription || null,
        url: linkUrl,
        metadata: { source: 'external_link' },
      })
      .select()
      .single();

    if (!error && asset) {
      // Create attachment
      await supabase.from('asset_attachments').insert({
        asset_id: asset.id,
        attachable_type: targetType,
        attachable_id: targetId,
        attached_by: user.id,
      });

      // Log activity
      await supabase.from('activities').insert({
        project_id: projectId,
        user_id: user.id,
        action: `Added ${type} "${linkName}" to ${targetType} ${targetId}`,
        entity_type: 'asset',
        entity_id: asset.id,
        metadata: { target_type: targetType, target_id: targetId },
      });

      onAssetAdded(asset);
      setLinkUrl('');
      setLinkName('');
      setLinkDescription('');
      setMode('view');
    }

    setIsUploading(false);
  };

  const handleFileUpload = async (file: File) => {
    if (!user) return;

    setIsUploading(true);
    const supabase = createClient();

    // Upload to Supabase Storage
    const filePath = `${projectId}/${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('project-assets')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      setIsUploading(false);
      return;
    }

    // Determine file type
    let type: Asset['type'] = 'file';
    if (file.type.startsWith('image/')) {
      type = 'image';
    } else if (file.type === 'application/pdf' || file.type.includes('document') || file.type.includes('word')) {
      type = 'document';
    } else if (file.type.startsWith('video/')) {
      type = 'video';
    }

    // Create asset record
    const { data: asset, error } = await supabase
      .from('assets')
      .insert({
        project_id: projectId,
        uploaded_by: user.id,
        type,
        name: file.name,
        url: filePath,
        mime_type: file.type,
        file_size: file.size,
        metadata: { source: 'upload' },
      })
      .select()
      .single();

    if (!error && asset) {
      // Create attachment
      await supabase.from('asset_attachments').insert({
        asset_id: asset.id,
        attachable_type: targetType,
        attachable_id: targetId,
        attached_by: user.id,
      });

      // Log activity
      await supabase.from('activities').insert({
        project_id: projectId,
        user_id: user.id,
        action: `Uploaded ${type} "${file.name}" to ${targetType} ${targetId}`,
        entity_type: 'asset',
        entity_id: asset.id,
        metadata: { target_type: targetType, target_id: targetId },
      });

      onAssetAdded(asset);
      setMode('view');
    }

    setIsUploading(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const getAssetIcon = (type: Asset['type']) => {
    switch (type) {
      case 'link':
        return (
          <svg className="w-5 h-5 text-[#3AACCF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      case 'document':
        return (
          <svg className="w-5 h-5 text-[#FF9F40]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'video':
        return (
          <svg className="w-5 h-5 text-[#E85A6F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'image':
        return (
          <svg className="w-5 h-5 text-[#A8D4B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#1A2A3F] border border-white/20 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-white font-semibold">
                {mode === 'view' ? 'Assets' : 'Add Asset'}
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-white/10 text-white/60 text-xs">
                {targetId}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {mode === 'view' && (
                <button
                  onClick={() => setMode('add')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#20B2A4]/20 border border-[#20B2A4]/30 text-[#A8D4B8] text-sm font-medium hover:bg-[#20B2A4]/30 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </button>
              )}
              {mode === 'add' && assets.length > 0 && (
                <button
                  onClick={() => setMode('view')}
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  View Assets
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-[60vh]">
            {mode === 'view' ? (
              assets.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </div>
                  <p className="text-white/60 mb-4">No assets attached yet</p>
                  <button
                    onClick={() => setMode('add')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#20B2A4]/20 border border-[#20B2A4]/30 text-[#A8D4B8] text-sm font-medium hover:bg-[#20B2A4]/30 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add First Asset
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {assets.map((asset) => (
                    <a
                      key={asset.id}
                      href={asset.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        {getAssetIcon(asset.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate group-hover:text-[#A8D4B8] transition-colors">
                          {asset.name}
                        </p>
                        {asset.description && (
                          <p className="text-white/50 text-sm truncate">{asset.description}</p>
                        )}
                        <p className="text-white/30 text-xs mt-1">
                          {new Date(asset.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <svg className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              )
            ) : (
              <div className="space-y-6">
                {/* Upload type selector */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setUploadType('link')}
                    className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                      uploadType === 'link'
                        ? 'bg-[#20B2A4]/20 border border-[#20B2A4]/30 text-[#A8D4B8]'
                        : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    Add Link
                  </button>
                  <button
                    onClick={() => setUploadType('file')}
                    className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                      uploadType === 'file'
                        ? 'bg-[#20B2A4]/20 border border-[#20B2A4]/30 text-[#A8D4B8]'
                        : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    Upload File
                  </button>
                </div>

                {uploadType === 'link' ? (
                  <form onSubmit={handleAddLink} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        URL
                      </label>
                      <input
                        type="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://..."
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#20B2A4]/50 focus:border-[#20B2A4]/50 transition-all"
                      />
                      <p className="text-white/40 text-xs mt-1">
                        Google Drive, SharePoint, Zoom recording, YouTube, etc.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={linkName}
                        onChange={(e) => setLinkName(e.target.value)}
                        placeholder="Meeting Recording - Jan 15"
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#20B2A4]/50 focus:border-[#20B2A4]/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Description (optional)
                      </label>
                      <textarea
                        value={linkDescription}
                        onChange={(e) => setLinkDescription(e.target.value)}
                        placeholder="Brief description..."
                        rows={2}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#20B2A4]/50 focus:border-[#20B2A4]/50 transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isUploading || !linkUrl || !linkName}
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#20B2A4] to-[#A8D4B8] text-white font-semibold rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#20B2A4]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isUploading ? (
                        <>
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Adding...
                        </>
                      ) : (
                        'Add Link'
                      )}
                    </button>
                  </form>
                ) : (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                      dragActive
                        ? 'border-[#20B2A4] bg-[#20B2A4]/10'
                        : 'border-white/20 hover:border-white/30'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                      className="hidden"
                    />

                    {isUploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <svg className="animate-spin w-8 h-8 text-[#20B2A4]" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p className="text-white/60">Uploading...</p>
                      </div>
                    ) : (
                      <>
                        <svg className="w-12 h-12 text-white/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-white/60 mb-2">Drag and drop a file here, or</p>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors"
                        >
                          Browse Files
                        </button>
                        <p className="text-white/30 text-xs mt-4">
                          PDF, images, videos, documents up to 50MB
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
