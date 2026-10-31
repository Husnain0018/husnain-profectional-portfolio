'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { AHMonogram } from '@/components/brand/Logo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('hafizhusnain018@gmail.com');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid credentials.');
        setLoading(false);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Network error while authenticating.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090B10] text-[#F5F7FC] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#A5B0C0] hover:text-[#6C8CFF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Website</span>
        </Link>

        <div className="rounded-3xl bg-[#151B25] border border-[rgba(255,255,255,0.09)] p-8 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6">
          <div className="flex items-center gap-3.5 pb-4 border-b border-[rgba(255,255,255,0.06)]">
            <AHMonogram className="w-12 h-12" />
            <div>
              <h1 className="font-heading text-lg font-bold text-[#F5F7FC]">
                Admin CMS Portal
              </h1>
              <p className="text-xs text-[#737F91]">
                Ali Husnain Content Management System
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold uppercase tracking-wider text-[#A5B0C0]"
              >
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#737F91] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#10141C] border border-[rgba(255,255,255,0.08)] text-sm text-[#F5F7FC] focus:outline-none focus:border-[#6C8CFF]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold uppercase tracking-wider text-[#A5B0C0]"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#737F91] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-password"
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#10141C] border border-[rgba(255,255,255,0.08)] text-sm text-[#F5F7FC] focus:outline-none focus:border-[#6C8CFF]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737F91] hover:text-white cursor-pointer"
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6C8CFF] to-[#A78BFA] text-white font-semibold text-sm shadow-[0_4px_16px_rgba(108,140,255,0.3)] hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] text-[11px] text-[#737F91] space-y-1">
            <p className="font-semibold text-[#A5B0C0]">
              Local Access:
            </p>
            <p>
              Configured Email: <code className="text-[#55D6BE]">hafizhusnain018@gmail.com</code>
            </p>
            <p>
              Initial Password: <code className="text-[#55D6BE]">AliAdmin@2026</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
