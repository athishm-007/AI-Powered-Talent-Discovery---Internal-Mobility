'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog } from '../ui/Dialog';
import { Search, LayoutDashboard, User, Briefcase, GitCompare, Map, Bot, ShieldCheck, Users, Target, BarChart3 } from 'lucide-react';

export const CommandPalette: React.FC<{ isOpen: boolean; onClose: () => void; role: 'employee' | 'hr_admin' }> = ({
  isOpen,
  onClose,
  role,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered via Topbar state
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const items = role === 'hr_admin'
    ? [
        { href: '/admin', label: 'HR Overview', icon: ShieldCheck },
        { href: '/admin/talent', label: 'Talent Discovery Search', icon: Users },
        { href: '/admin/roles', label: 'Role Catalog Manager', icon: Briefcase },
        { href: '/admin/initiatives', label: 'HR Strategic Initiatives', icon: Target },
        { href: '/admin/insights', label: 'Workforce Insights & Heatmap', icon: BarChart3 },
      ]
    : [
        { href: '/dashboard', label: 'Employee Dashboard', icon: LayoutDashboard },
        { href: '/profile', label: 'My Dynamic Skill Profile', icon: User },
        { href: '/opportunities', label: 'Internal Role Marketplace', icon: Briefcase },
        { href: '/skill-gaps', label: 'Skill Gap Matrix', icon: GitCompare },
        { href: '/roadmap', label: 'Mobility Roadmap', icon: Map },
        { href: '/assistant', label: 'AI Career Assistant', icon: Bot },
      ];

  const filtered = items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Platform Command Palette">
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or page name..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            autoFocus
          />
        </div>

        <div className="space-y-1 max-h-60 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-xs text-slate-500 text-center py-4">No matching commands found.</div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => handleSelect(item.href)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors text-left"
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{item.label}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </Dialog>
  );
};
