'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LayoutDashboard, User, Briefcase, GitCompare, Map, Bot, ShieldCheck, Users, Target, BarChart3 } from 'lucide-react';
import { Button } from './Button';

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'employee' | 'hr_admin';
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose, role }) => {
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
    { href: '/admin', label: 'HR Overview', icon: ShieldCheck },
    { href: '/admin/talent', label: 'Talent Search', icon: Users },
    { href: '/admin/roles', label: 'Role Catalog', icon: Briefcase },
    { href: '/admin/initiatives', label: 'HR Initiatives', icon: Target },
    { href: '/admin/insights', label: 'Workforce Insights', icon: BarChart3 },
  ];

  const links = role === 'hr_admin' ? hrLinks : employeeLinks;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-72 glass-panel bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between shadow-2xl z-10"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-slate-950">
                    TL
                  </div>
                  <span className="font-bold text-lg text-white">TalentLens</span>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="space-y-1.5" aria-label="Mobile Drawer Navigation">
                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-slate-800 text-xs text-slate-500 text-center">
              TalentLens Platform v1.0
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
