'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function OAuthTestPage() {
  const [clientId, setClientId] = useState('test_app');
  const [redirectUri, setRedirectUri] = useState('http://localhost:3000/callback');
  const [scope, setScope] = useState('read projects:read');
  const [state, setState] = useState('');
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setState('test_state_' + Math.random().toString(36).substring(7));
    setOrigin(window.location.origin);
  }, []);

  const buildAuthUrl = () => {
    if (!origin) return '#';
    const baseUrl = `${origin}/oauth/consent`;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scope,
      state: state,
      response_type: 'code',
    });
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-[#0F1D2F] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-[#20B2A4] hover:text-[#A8D4B8] transition-colors">
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">OAuth 2.0 Test</h1>
        <p className="text-white/60 mb-8">
          Test the OAuth authorization flow by configuring parameters below and initiating the authorization request.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Authorization Parameters</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Client ID
              </label>
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#20B2A4]/50 focus:border-[#20B2A4]/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Redirect URI
              </label>
              <input
                type="text"
                value={redirectUri}
                onChange={(e) => setRedirectUri(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#20B2A4]/50 focus:border-[#20B2A4]/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Scope (space-separated)
              </label>
              <input
                type="text"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                placeholder="read projects:read files:read"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#20B2A4]/50 focus:border-[#20B2A4]/50"
              />
              <p className="mt-2 text-sm text-white/50">
                Available scopes: read, write, projects:read, projects:write, files:read, files:write, notifications:send
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                State (CSRF Token)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#20B2A4]/50 focus:border-[#20B2A4]/50"
                />
                <button
                  onClick={() => setState('test_state_' + Math.random().toString(36).substring(7))}
                  className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-white transition-all"
                >
                  Regenerate
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">Generated Authorization URL:</h3>
            <div className="p-4 bg-black/30 rounded-xl border border-white/10 mb-4 overflow-x-auto">
              <code className="text-sm text-[#A8D4B8] break-all">{buildAuthUrl()}</code>
            </div>

            <a
              href={buildAuthUrl()}
              className="inline-block px-8 py-4 bg-gradient-to-r from-[#20B2A4] to-[#3AACCF] hover:from-[#20B2A4]/90 hover:to-[#3AACCF]/90 text-white rounded-xl font-medium shadow-lg shadow-[#20B2A4]/20 transition-all"
            >
              Start Authorization Flow →
            </a>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Reference</h2>
          
          <div className="space-y-6 text-white/80">
            <div>
              <h3 className="font-semibold text-white mb-2">1. Authorization Request</h3>
              <p className="text-sm">User clicks authorize and is redirected to the consent page above.</p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">2. User Consent</h3>
              <p className="text-sm">User reviews permissions and clicks &quot;Authorize&quot; or &quot;Deny&quot;.</p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">3. Authorization Code</h3>
              <p className="text-sm mb-2">After approval, user is redirected to your redirect_uri with a code:</p>
              <code className="text-xs bg-black/30 px-3 py-2 rounded block">
                {redirectUri}?code=AUTHORIZATION_CODE&state={state}
              </code>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">4. Token Exchange</h3>
              <p className="text-sm mb-2">Exchange the code for an access token:</p>
              <pre className="text-xs bg-black/30 px-4 py-3 rounded overflow-x-auto">
{`POST /api/oauth/token
Content-Type: application/json

{
  "grant_type": "authorization_code",
  "code": "AUTHORIZATION_CODE",
  "client_id": "${clientId}",
  "client_secret": "YOUR_CLIENT_SECRET",
  "redirect_uri": "${redirectUri}"
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">5. API Access</h3>
              <p className="text-sm mb-2">Use the access token to make API requests:</p>
              <code className="text-xs bg-black/30 px-3 py-2 rounded block">
                Authorization: Bearer ACCESS_TOKEN
              </code>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <Link href="/docs/OAUTH.md" className="text-[#20B2A4] hover:text-[#A8D4B8] transition-colors text-sm">
              View Full OAuth Documentation →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
