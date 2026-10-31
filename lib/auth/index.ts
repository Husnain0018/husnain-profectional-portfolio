import crypto from 'crypto';
import { cookies } from 'next/headers';
import { readLocalDb, writeLocalDb } from '@/lib/db';
import { hashPassword } from '@/lib/db/seed-data';

const SESSION_COOKIE_NAME = 'ali_portfolio_admin_session';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'ali_husnain_secure_admin_hmac_secret_2026_key';

export interface AdminSessionPayload {
  email: string;
  role: 'owner';
  exp: number;
}

export function createSessionToken(email: string): string {
  const payload: AdminSessionPayload = {
    email,
    role: 'owner',
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(base64Payload)
    .digest('base64url');
  return `${base64Payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined): AdminSessionPayload | null {
  if (!token || !token.includes('.')) return null;
  const [base64Payload, signature] = token.split('.');
  if (!base64Payload || !signature) return null;

  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(base64Payload)
    .digest('base64url');

  if (signature.length !== expectedSig.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(base64Payload, 'base64url').toString('utf-8')) as AdminSessionPayload;
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  const db = readLocalDb();
  const configuredEmail = (db.admin_auth?.email || process.env.ADMIN_EMAIL || 'hafizhusnain018@gmail.com').toLowerCase().trim();
  if (email.toLowerCase().trim() !== configuredEmail) {
    return false;
  }
  const salt = db.admin_auth?.salt || 'ali_husnain_portfolio_salt_2026';
  const candidateHash = hashPassword(password, salt);
  const storedHash = db.admin_auth?.password_hash;
  if (!storedHash || candidateHash.length !== storedHash.length) return false;
  return crypto.timingSafeEqual(Buffer.from(candidateHash), Buffer.from(storedHash));
}

export function updateAdminCredentials(newEmail: string, newPassword?: string): void {
  const db = readLocalDb();
  const salt = db.admin_auth?.salt || crypto.randomBytes(16).toString('hex');
  db.admin_auth = {
    email: newEmail.trim().toLowerCase(),
    salt,
    password_hash: newPassword
      ? hashPassword(newPassword, salt)
      : db.admin_auth.password_hash,
    updated_at: new Date().toISOString(),
  };
  writeLocalDb(db);
}

export { SESSION_COOKIE_NAME };
