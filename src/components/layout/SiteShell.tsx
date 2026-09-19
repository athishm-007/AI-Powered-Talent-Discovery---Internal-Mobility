'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { SkipToContent } from '../ui/SkipToContent';

export interface SiteShellProps {
  user?: any;
  mode?: 'employee' | 'hr';
  children: React.ReactNode;
}

export const SiteShell: React.FC<SiteShellProps> = ({ user, mode = 'employee', children }) => {
  const role = user?.app_metadata?.role || mode || 'employee';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row antialiased">
      <SkipToContent />
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar user={user} />
        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
