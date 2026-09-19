import React from 'react';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const metadata = generatePageMetadata({
  title: 'Register | TalentLens',
  description: 'Create your TalentLens account to discover hidden skills, map internal career paths, and bridge skill gaps.',
});

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white mb-4 shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Create your Profile</h1>
          <p className="mt-2 text-sm text-slate-400">
            Join your organization&apos;s internal mobility platform
          </p>
        </div>

        <Card className="p-8 backdrop-blur-md bg-slate-900/80 border-slate-800">
          <form className="space-y-5" action="/api/v1/auth/register" method="POST">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/70 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                Work Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/70 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                placeholder="jane.doe@company.com"
              />
            </div>

            <div>
              <label htmlFor="roleTitle" className="block text-sm font-medium text-slate-300 mb-1">
                Current Role Title
              </label>
              <input
                id="roleTitle"
                name="roleTitle"
                type="text"
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/70 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                placeholder="Senior Data Analyst"
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-slate-300 mb-1">
                Department
              </label>
              <select
                id="department"
                name="departmentId"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/70 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              >
                <option value="dept-eng">Engineering & Infrastructure</option>
                <option value="dept-product">Product Management & Design</option>
                <option value="dept-data">Data Science & AI</option>
                <option value="dept-ops">Operations & People Ops</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/70 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                placeholder="Minimum 8 characters"
              />
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full shadow-lg shadow-indigo-600/20">
              Create TalentLens Account
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link href="/login" className="font-medium text-brand-400 hover:text-brand-300 underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
