'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

interface InviteModalProps {
  projectId: string;
  projectName: string;
  isOpen: boolean;
  onClose: () => void;
  onInvited: () => void;
}

export default function InviteModal({ projectId, projectName, isOpen, onClose, onInvited }: InviteModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'contributor' | 'viewer' | 'owner'>('contributor');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();

      // First, find the user by email in auth.users (via the users table)
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (userError || !userData) {
        setError('User not found. They need to sign up first at this site before they can be added.');
        setIsLoading(false);
        return;
      }

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', userData.id)
        .single();

      if (existingMember) {
        setError('This user is already a member of this project.');
        setIsLoading(false);
        return;
      }

      // Add the user as a project member
      const { error: insertError } = await supabase
        .from('project_members')
        .insert({
          project_id: projectId,
          user_id: userData.id,
          role: role,
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        setError('Failed to add team member. Please try again.');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setEmail('');
      onInvited();

      // Close modal after a brief delay
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);

    } catch (err) {
      console.error('Error inviting user:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#1a2942] rounded-2xl w-full max-w-md border border-white/10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Invite Team Member</h2>
                <p className="text-white/50 text-sm mt-1">Add someone to {projectName}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleInvite} className="p-6 space-y-4">
            {/* Email input */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@example.com"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#20B2A4] transition-colors"
              />
            </div>

            {/* Role select */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'viewer', label: 'Viewer', desc: 'Can view only' },
                  { value: 'contributor', label: 'Contributor', desc: 'Can edit' },
                  { value: 'owner', label: 'Owner', desc: 'Full access' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRole(option.value as typeof role)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      role === option.value
                        ? 'bg-[#20B2A4]/20 border-[#20B2A4] text-white'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <span className="block font-medium text-sm">{option.label}</span>
                    <span className="block text-xs opacity-60 mt-0.5">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Success message */}
            {success && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Team member added successfully!
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full py-3 rounded-lg bg-[#20B2A4] text-white font-medium hover:bg-[#1a9a8e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Team Member
                </>
              )}
            </button>
          </form>

          {/* Help text */}
          <div className="px-6 pb-6">
            <p className="text-white/40 text-xs text-center">
              The person must have already signed up at this site before you can add them.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
