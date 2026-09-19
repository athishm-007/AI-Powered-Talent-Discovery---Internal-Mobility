'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/Button';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const Header: React.FC<{ user?: any }> = ({ user }) => {
  const pathname = usePathname();
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-slate-950 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            TL
          </div>
          <span className="font-bold text-xl text-white tracking-tight">TalentLens</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#profiling" className="hover:text-cyan-400 transition-colors">AI Profiling</a>
          <a href="#matching" className="hover:text-cyan-400 transition-colors">Explainable Matching</a>
          <a href="#roadmap" className="hover:text-cyan-400 transition-colors">Skill Gaps & Roadmap</a>
          <a href="#assistant" className="hover:text-cyan-400 transition-colors">Assistant & Insights</a>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Link href={user.app_metadata?.role === 'hr_admin' ? '/admin' : '/dashboard'}>
              <Button variant="primary" size="sm" className="gap-2">
                <span>Member Area</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm" className="gap-1.5">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
