/**
 * Login API Route for Crane Command Center
 *
 * Simple password-based authentication that sets a cookie.
 * Password is stored in COMMAND_CENTER_PASSWORD environment variable.
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Get password from environment
    const correctPassword = process.env.COMMAND_CENTER_PASSWORD;

    // Debug logging (temporary)
    console.log('[auth] Password env var exists:', !!correctPassword);
    console.log('[auth] Expected password length:', correctPassword?.length || 0);
    console.log('[auth] Received password length:', password?.length || 0);

    if (!correctPassword) {
      console.error('[auth] COMMAND_CENTER_PASSWORD not configured');
      return NextResponse.json(
        { error: 'Authentication not configured' },
        { status: 500 }
      );
    }

    // Validate password
    if (password !== correctPassword) {
      console.log('[auth] Password mismatch');
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    console.log('[auth] Password match - authentication successful');

    // Set auth cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: 'crane-command-auth',
      value: 'authenticated',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[auth] Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
