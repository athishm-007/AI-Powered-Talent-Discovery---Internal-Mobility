'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, Briefcase, GitCompare, Map, Bot, ShieldCheck, Users, Target, BarChart3 } from 'lucide-react';

export const Sidebar: React.FC<{ role?: 'employee' | 'hr_admin' }> = ({ role = 'employee' }) => {
  const pathname = usePathname();

  const employeeLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/profile', label: 'My Skill Profile', icon: User },
    { href: '/opportunities', label: 'Role Marketplace', icon: Briefcase },
    { href: '/skill-gaps', label: 'Skill Gap Matrix', icon: GitCompare },
    { href: '/roadmap', label: 'Mobility Roadmap', icon: Map },
    { href: '/assistant', label: 'AI Career Assistant', icon: Bot },
  ];

  const hrLinks = [
    { href: '/admin', label: 'HR Command Center', icon: ShieldCheck },
    { href: '/admin/talent', label: 'Talent Discovery Search', icon: Users },
    { href: '/admin/roles', label: 'Role Catalog Manager', icon: Briefcase },
    { href: '/admin/initiatives', label: 'HR Strategic Initiatives', icon: Target },
    { href: '/admin/insights', label: 'Workforce Insights', icon: BarChart3 },
  ];

  const links = role === 'hr_admin' ? hrLinks : employeeLinks;

  return (
    <aside className="hidden lg:flex w-64 glass-panel bg-slate-950/90 border-r border-slate-800/80 flex-col justify-between p-4 sticky top-0 h-screen">
      <div>
        <Link href="/" className="flex items-center gap-2.5 px-3 py-3 mb-6 border-b border-slate-800/80">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-slate-950 text-sm shadow-md shadow-cyan-500/20">
            TL
          </div>
          <div>
            <span className="font-bold text-base text-white tracking-tight">TalentLens</span>
            <span className="block text-[10px] text-cyan-400 uppercase font-semibold tracking-wider">
              {role === 'hr_admin' ? 'HR Portal' : 'Member Area'}
            </span>
          </div>
        </Link>

        <nav className="space-y-1" aria-label="Desktop Sidebar Navigation">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800/80 px-3 text-xs text-slate-500">
        <div className="font-semibold text-slate-400">Enterprise AI Engine</div>
        <div className="text-[11px] text-emerald-400">● Hybrid Match Active</div>
      </div>
    </aside>
  );
};
