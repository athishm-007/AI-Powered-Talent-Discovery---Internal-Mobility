import React from 'react';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const metadata = generatePageMetadata({
  title: 'Sign In | TalentLens',
  description: 'Sign in to access your AI talent profile, internal career opportunities, skill gap analysis, and mobility roadmap.',
});

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white mb-4 shadow-lg shadow-brand-500/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457-.39-2.823-1.07-4" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Sign in to TalentLens</h1>
          <p className="mt-2 text-sm text-slate-400">
            Unlock AI-powered internal mobility and personalized skill evolution
          </p>
        </div>

        <Card className="p-8 backdrop-blur-md bg-slate-900/80 border-slate-800">
          <form className="space-y-6" action="/api/v1/auth/login" method="POST">
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
                defaultValue="alex.chen@company.com"
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
                defaultValue="DemoPass123!"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/70 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm transition-all"
              />
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full shadow-lg shadow-brand-600/20">
              Sign In to Account
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-3 text-slate-500 font-medium">Quick Demo Quick-Access</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="/dashboard?demo=employee"
                className="inline-flex items-center justify-center px-3 py-2 border border-slate-700 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 hover:border-slate-600 text-center transition-all"
              >
                ⚡ Employee Portal
              </a>
              <a
                href="/admin?demo=hr"
                className="inline-flex items-center justify-center px-3 py-2 border border-slate-700 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 hover:border-slate-600 text-center transition-all"
              >
                🔑 HR Admin Portal
              </a>
            </div>
          </form>
        </Card>

        <p className="text-center text-xs text-slate-400">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-brand-400 hover:text-brand-300 underline underline-offset-4">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
