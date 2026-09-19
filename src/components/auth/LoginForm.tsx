'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('alex.chen@company.com');
  const [password, setPassword] = useState('DemoPass123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // In demo mode or general login, route to dashboard or admin based on email
      const isHrAdmin = email.toLowerCase().includes('admin') || email.toLowerCase().includes('hr');
      const targetPath = isHrAdmin ? '/admin?demo=hr' : '/dashboard?demo=employee';
      
      // Delay briefly for visual feedback
      setTimeout(() => {
        router.push(targetPath);
      }, 400);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 backdrop-blur-md bg-slate-900/80 border-slate-800 shadow-2xl">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3.5 text-xs text-rose-300 bg-rose-950/60 border border-rose-800/80 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
            Work Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/70 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm transition-all"
            placeholder="name@company.com"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
              Password
            </label>
            <a href="#" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
              Forgot password?
            </a>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/70 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm transition-all"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
          className="w-full shadow-lg shadow-cyan-500/30 bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-extrabold text-base py-3 border-none transition-all duration-200"
        >
          {loading ? 'Signing In...' : 'Sign In to Account'}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-900 px-3 text-slate-500 font-medium">Quick Demo Access</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/dashboard?demo=employee"
            className="inline-flex items-center justify-center px-3 py-2.5 border border-slate-700/80 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700 hover:border-cyan-500/50 text-center transition-all"
          >
            ⚡ Employee Portal
          </Link>
          <Link
            href="/admin?demo=hr"
            className="inline-flex items-center justify-center px-3 py-2.5 border border-slate-700/80 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700 hover:border-cyan-500/50 text-center transition-all"
          >
            🔑 HR Admin Portal
          </Link>
        </div>
      </form>
    </Card>
  );
}
