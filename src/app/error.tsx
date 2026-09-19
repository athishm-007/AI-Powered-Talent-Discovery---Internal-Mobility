'use client';

import React, { useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled UI exception:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full text-center space-y-6 border-slate-800 bg-slate-900">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 font-extrabold text-2xl">
          ⚠️
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-100">Something went wrong</h1>
          <p className="text-xs text-slate-400">
            An internal application error occurred while processing this request.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => reset()} className="w-full">
          Try Again
        </Button>
      </Card>
    </div>
  );
}
