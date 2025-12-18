import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { grant_type, code, client_id, client_secret, redirect_uri } = body;

    // Validate grant type
    if (grant_type !== 'authorization_code') {
      return NextResponse.json(
        { error: 'unsupported_grant_type', error_description: 'Only authorization_code grant type is supported' },
        { status: 400 }
      );
    }

    // Validate required parameters
    if (!code || !client_id || !redirect_uri) {
      return NextResponse.json(
        { error: 'invalid_request', error_description: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Look up authorization code
    const { data: authorization, error: authError } = await supabase
      .from('oauth_authorizations')
      .select('*')
      .eq('auth_code', code)
      .eq('client_id', client_id)
      .eq('redirect_uri', redirect_uri)
      .single();

    if (authError || !authorization) {
      return NextResponse.json(
        { error: 'invalid_grant', error_description: 'Invalid or expired authorization code' },
        { status: 400 }
      );
    }

    // Check if code is expired
    if (new Date(authorization.expires_at) < new Date()) {
      // Delete expired authorization
      await supabase.from('oauth_authorizations').delete().eq('id', authorization.id);
      
      return NextResponse.json(
        { error: 'invalid_grant', error_description: 'Authorization code has expired' },
        { status: 400 }
      );
    }

    // Check if code has already been used
    if (authorization.used) {
      return NextResponse.json(
        { error: 'invalid_grant', error_description: 'Authorization code has already been used' },
        { status: 400 }
      );
    }

    // Mark code as used
    await supabase
      .from('oauth_authorizations')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('id', authorization.id);

    // Generate access token
    const accessToken = generateToken();
    const refreshToken = generateToken();

    // Store tokens
    const { error: tokenError } = await supabase.from('oauth_tokens').insert({
      user_id: authorization.user_id,
      client_id: client_id,
      access_token: accessToken,
      refresh_token: refreshToken,
      scope: authorization.scope,
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
    });

    if (tokenError) {
      console.error('Error storing token:', tokenError);
      return NextResponse.json(
        { error: 'server_error', error_description: 'Failed to generate access token' },
        { status: 500 }
      );
    }

    // Return tokens
    return NextResponse.json({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: refreshToken,
      scope: authorization.scope,
    });
  } catch (error) {
    console.error('OAuth token error:', error);
    return NextResponse.json(
      { error: 'server_error', error_description: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

function generateToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
