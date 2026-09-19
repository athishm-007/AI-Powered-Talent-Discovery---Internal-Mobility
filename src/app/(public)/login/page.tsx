import React from 'react';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import { LoginForm } from '@/components/auth/LoginForm';

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

        <LoginForm />

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
