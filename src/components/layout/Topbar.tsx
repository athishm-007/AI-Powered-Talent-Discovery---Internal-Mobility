'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Search, LogOut, ShieldCheck, User, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MobileDrawer } from '../ui/MobileDrawer';
import { CommandPalette } from './CommandPalette';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export const Topbar: React.FC<{ user?: any }> = ({ user }) => {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Detect active role from path or prop
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const isHrPath = path.startsWith('/admin');
  const role = isHrPath ? 'hr_admin' : (user?.app_metadata?.role || 'employee');
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';

  const handleSignOut = async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch {}
    window.location.href = '/login';
  };

  const handleDemoSwitch = async (targetRole: 'hr_admin' | 'employee') => {
    const email = targetRole === 'hr_admin' ? 'admin@talentlens.ai' : 'alex.chen@company.com';
    try {
      await fetch('/api/v1/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: targetRole, email }),
      });
    } catch {}

    const targetUrl = targetRole === 'hr_admin' ? '/admin?demo=hr' : '/dashboard?demo=employee';
    window.location.href = targetUrl;
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDrawerOpen(true)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white"
            aria-label="Open mobile navigation menu"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsPaletteOpen(true)}
            className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search platform...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-800 rounded border border-slate-700">
              ⌘K
            </kbd>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {isDemo && (
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-lg p-1 shadow-inner">
              <span className="text-[11px] font-semibold text-slate-400 px-2 hidden sm:inline">Demo Switcher:</span>
              <button
                type="button"
                onClick={() => handleDemoSwitch('employee')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  role === 'employee' ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Alex (Employee)
              </button>
              <button
                type="button"
                onClick={() => handleDemoSwitch('hr_admin')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  role === 'hr_admin' ? 'bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Admin (HR)
              </button>
            </div>
          )}

          <Badge variant={role === 'hr_admin' ? 'indigo' : 'cyan'} className="capitalize gap-1">
            {role === 'hr_admin' ? <ShieldCheck className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            {role === 'hr_admin' ? 'HR Admin' : 'Employee'}
          </Badge>

          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-slate-200">{user?.user_metadata?.full_name || user?.email || 'User'}</div>
            <div className="text-[10px] text-slate-500">{user?.email}</div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} role={role} />
      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} role={role} />
    </>
  );
};
