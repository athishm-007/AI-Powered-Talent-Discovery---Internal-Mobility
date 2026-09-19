import React from 'react';
import { Metadata } from 'next';
import { SiteShell } from '@/components/layout/SiteShell';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiteShell mode="employee">
      {children}
    </SiteShell>
  );
}
