import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full text-center space-y-6 border-slate-800 bg-slate-900">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-500/10 text-brand-400 font-extrabold text-2xl">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-100">Page Not Found</h1>
          <p className="text-xs text-slate-400">
            The page or mobility route you are looking for doesn&apos;t exist or has been relocated.
          </p>
        </div>

        <Link href="/" className="block">
          <Button variant="primary" size="md" className="w-full">
            Return to Homepage
          </Button>
        </Link>
      </Card>
    </div>
  );
}
