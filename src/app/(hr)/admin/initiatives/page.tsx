'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function HRInitiativesPage() {
  const [initiatives] = useState([
    {
      id: 'init-01',
      title: 'AI Search & Vector DB Acceleration Q4',
      targetQuarter: '2026-Q4',
      status: 'active',
      demandedSkills: [
        { name: 'Vector Databases (Pgvector)', count: 6, availableInternalCount: 2 },
        { name: 'PyTorch Model Serving', count: 4, availableInternalCount: 3 },
      ],
      readinessRatio: 50,
    },
    {
      id: 'init-02',
      title: 'Zero-Trust Cloud Governance Modernization',
      targetQuarter: '2027-Q1',
      status: 'planning',
      demandedSkills: [
        { name: 'SOC2 Audit Automation', count: 3, availableInternalCount: 3 },
        { name: 'Kubernetes Network Policy', count: 5, availableInternalCount: 4 },
      ],
      readinessRatio: 87.5,
    },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Strategic Initiative Skill Demand Forecasting</h1>
          <p className="text-sm text-slate-400 mt-1">
            Module 3: Map upcoming company initiatives to workforce skill availability and mobility readiness.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => alert('New initiative form')}>
          + Add Strategic Initiative
        </Button>
      </div>

      <div className="space-y-6">
        {initiatives.map((init) => (
          <Card key={init.id} className="p-6 border-slate-800 bg-slate-900/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-slate-100">{init.title}</h3>
                  <Badge variant={init.status === 'active' ? 'emerald' : 'amber'}>
                    Target: {init.targetQuarter}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase block">Workforce Readiness</span>
                  <span className="text-lg font-extrabold text-brand-400">{init.readinessRatio}% Ready</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {init.demandedSkills.map((sk, idx) => (
                <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{sk.name}</span>
                  <span className="text-slate-400">
                    Demand: <strong className="text-amber-400">{sk.count}</strong> | Available Internal: <strong className="text-emerald-400">{sk.availableInternalCount}</strong>
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
