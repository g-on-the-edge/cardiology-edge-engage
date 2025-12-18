'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function OAuthConsentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // OAuth parameters from query string
  const clientId = searchParams.get('client_id');
  const redirectUri = searchParams.get('redirect_uri');
  const scope = searchParams.get('scope') || 'read';
  const state = searchParams.get('state');
  const responseType = searchParams.get('response_type') || 'code';

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      // Redirect to login with return URL
      const returnUrl = `/oauth/consent?${searchParams.toString()}`;
      router.push(`/login?redirect=${encodeURIComponent(returnUrl)}`);
      return;
    }

    setUser(user);
    setIsLoading(false);
  };

  const handleApprove = async () => {
    if (!clientId || !redirectUri) {
      setError('Missing required OAuth parameters');
      return;
    }

    setIsLoading(true);

    try {
      // Generate authorization code
      const authCode = generateAuthCode();

      // Store authorization in database
      const supabase = createClient();
      const { error: dbError } = await supabase.from('oauth_authorizations').insert({
        user_id: user.id,
        client_id: clientId,
        scope: scope,
        auth_code: authCode,
        redirect_uri: redirectUri,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
      });

      if (dbError) {
        console.error('Error storing authorization:', dbError);
        setError('Failed to grant authorization');
        setIsLoading(false);
        return;
      }

      // Redirect back to client with authorization code
      const separator = redirectUri.includes('?') ? '&' : '?';
      const params = new URLSearchParams({
        code: authCode,
        ...(state && { state }),
      });

      window.location.href = `${redirectUri}${separator}${params.toString()}`;
    } catch (err) {
      console.error('OAuth error:', err);
      setError('An error occurred during authorization');
      setIsLoading(false);
    }
  };

  const handleDeny = () => {
    if (redirectUri) {
      const separator = redirectUri.includes('?') ? '&' : '?';
      const params = new URLSearchParams({
        error: 'access_denied',
        error_description: 'User denied access',
        ...(state && { state }),
      });
      window.location.href = `${redirectUri}${separator}${params.toString()}`;
    } else {
      router.push('/');
    }
  };

  const generateAuthCode = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const getScopeDescription = (scope: string) => {
    const scopes = scope.split(' ');
    const descriptions: Record<string, string> = {
      read: 'View your profile and project information',
      write: 'Create and modify projects on your behalf',
      'projects:read': 'View your projects and project details',
      'projects:write': 'Create, update, and delete projects',
      'files:read': 'View files and assets in your projects',
      'files:write': 'Upload and manage files in your projects',
      'notifications:send': 'Send notifications to you',
    };

    return scopes.map(s => descriptions[s] || `Access to ${s}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F1D2F] flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1D2F] flex items-center justify-center px-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#20B2A4]/5 via-transparent to-[#3AACCF]/5" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#20B2A4] to-[#A8D4B8] flex items-center justify-center shadow-2xl shadow-[#20B2A4]/30 mx-auto mb-4"
          >
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </motion.div>
          <h1 className="text-2xl font-bold text-white mb-2">Authorize Application</h1>
          <p className="text-white/60">
            {clientId ? (
              <>
                <span className="font-medium text-[#A8D4B8]">{clientId}</span> wants to access your account
              </>
            ) : (
              'An application is requesting access'
            )}
          </p>
        </div>

        {/* Authorization Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm">{error}</p>
              </div>
            </motion.div>
          )}

          {/* User Info */}
          {user && (
            <div className="mb-6 pb-6 border-b border-white/10">
              <p className="text-sm text-white/60 mb-1">Signed in as:</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>
          )}

          {/* Permissions */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#A8D4B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              This application will be able to:
            </h3>
            <ul className="space-y-2">
              {getScopeDescription(scope).map((desc, index) => (
                <li key={index} className="flex items-start gap-3 text-white/80">
                  <svg className="w-5 h-5 text-[#20B2A4] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* OAuth Details (collapsible) */}
          {redirectUri && (
            <details className="mb-6 text-sm">
              <summary className="text-white/60 cursor-pointer hover:text-white/80 transition-colors">
                Technical details
              </summary>
              <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10 space-y-1 text-white/70">
                <p><span className="font-medium">Redirect URI:</span> {redirectUri}</p>
                <p><span className="font-medium">Scope:</span> {scope}</p>
                <p><span className="font-medium">Response Type:</span> {responseType}</p>
                {state && <p><span className="font-medium">State:</span> {state}</p>}
              </div>
            </details>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleDeny}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Deny
            </button>
            <button
              onClick={handleApprove}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#20B2A4] to-[#3AACCF] hover:from-[#20B2A4]/90 hover:to-[#3AACCF]/90 text-white rounded-xl font-medium shadow-lg shadow-[#20B2A4]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Authorizing...' : 'Authorize'}
            </button>
          </div>

          {/* Trust Notice */}
          <p className="mt-6 text-xs text-white/50 text-center">
            Only authorize applications you trust. By authorizing, you allow this application to access your data according to the permissions above.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-white/60 hover:text-white/80 transition-colors">
            Return to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
