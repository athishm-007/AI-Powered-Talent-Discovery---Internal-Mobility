import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SkipToContent } from '@/components/ui/SkipToContent';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'TalentLens | AI-Powered Talent Discovery & Internal Mobility Web Platform',
  description: 'Enterprise AI platform for dynamic talent profiling, explainable internal role matching, skill gap analysis, and mobility roadmaps.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'TalentLens | Enterprise Internal Mobility Platform',
    description: 'Discover hidden employee skills and align internal talent with strategic company goals.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0F172A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark scroll-smooth`}>
      <body className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-brand-500 selection:text-white">
        <SkipToContent />
        <div id="main-content" className="relative flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
