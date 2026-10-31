import { NextRequest, NextResponse } from 'next/server';
import {
  verifyAdminCredentials,
  createSessionToken,
  getAdminSession,
  updateAdminCredentials,
  SESSION_COOKIE_NAME,
} from '@/lib/auth';
import { checkRateLimit } from '@/lib/validations';
import { getSupabaseAdminClient } from '@/lib/db';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    user: { email: session.email, role: session.role },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password, newEmail, newPassword } = body;

    if (action === 'logout') {
      const res = NextResponse.json({ success: true });
      res.cookies.delete(SESSION_COOKIE_NAME);
      return res;
    }

    if (action === 'update_credentials') {
      const session = await getAdminSession();
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
      }
      if (!newEmail || !String(newEmail).includes('@')) {
        return NextResponse.json({ error: 'Valid admin email is required.' }, { status: 400 });
      }
      if (newPassword && String(newPassword).length < 8) {
        return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 });
      }
      updateAdminCredentials(String(newEmail), newPassword ? String(newPassword) : undefined);
      const newToken = createSessionToken(String(newEmail).trim().toLowerCase());
      const res = NextResponse.json({
        success: true,
        message: 'Administrator account credentials updated.',
        email: String(newEmail).trim().toLowerCase(),
      });
      res.cookies.set(SESSION_COOKIE_NAME, newToken, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
      return res;
    }

    // Default action: login
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    const rate = checkRateLimit(`admin-login:${ip}`, 10, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Try again in ${rate.retryAfterSeconds}s.` },
        { status: 429 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    let isValid = verifyAdminCredentials(String(email), String(password));

    // Also allow Supabase Auth verification if configured
    if (!isValid) {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: String(email),
          password: String(password),
        });
        if (!error && data?.user?.email) {
          isValid = true;
        }
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid administrator email or password.' },
        { status: 401 }
      );
    }

    const token = createSessionToken(String(email).trim().toLowerCase());
    const res = NextResponse.json({
      success: true,
      user: { email: String(email).trim().toLowerCase(), role: 'owner' },
    });

    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error('Error in POST /api/admin/auth:', err);
    return NextResponse.json(
      { error: 'Authentication request failed.' },
      { status: 500 }
    );
  }
}
