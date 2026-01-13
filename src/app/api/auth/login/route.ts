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

    if (!correctPassword) {
      console.error('[auth] COMMAND_CENTER_PASSWORD not configured');
      return NextResponse.json(
        { error: 'Authentication not configured' },
        { status: 500 }
      );
    }

    // Validate password
    if (password !== correctPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

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
