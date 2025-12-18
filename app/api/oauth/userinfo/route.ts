import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Extract bearer token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'invalid_token', error_description: 'Missing or invalid Authorization header' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7); // Remove "Bearer "

    const supabase = await createClient();

    // Look up access token
    const { data: token, error: tokenError } = await supabase
      .from('oauth_tokens')
      .select('*')
      .eq('access_token', accessToken)
      .single();

    if (tokenError || !token) {
      return NextResponse.json(
        { error: 'invalid_token', error_description: 'Invalid access token' },
        { status: 401 }
      );
    }

    // Check if token is expired
    if (new Date(token.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'invalid_token', error_description: 'Access token has expired' },
        { status: 401 }
      );
    }

    // Get user information
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, full_name, avatar_url, phone_number, role')
      .eq('id', token.user_id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'server_error', error_description: 'Failed to retrieve user information' },
        { status: 500 }
      );
    }

    // Return user info based on scope
    const scopes = token.scope.split(' ');
    const userInfo: any = {
      sub: user.id,
      email: user.email,
    };

    if (scopes.includes('profile') || scopes.includes('read')) {
      userInfo.name = user.full_name;
      userInfo.picture = user.avatar_url;
    }

    if (scopes.includes('phone')) {
      userInfo.phone_number = user.phone_number;
    }

    return NextResponse.json(userInfo);
  } catch (error) {
    console.error('OAuth userinfo error:', error);
    return NextResponse.json(
      { error: 'server_error', error_description: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
