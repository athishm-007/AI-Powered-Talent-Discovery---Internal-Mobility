'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { GapSeverityBadge } from '@/components/features/GapSeverityBadge';
import { FeedbackButtons } from '@/components/features/FeedbackButtons';

export default function SkillGapsPage() {
  const [selectedTargetRole, setSelectedTargetRole] = useState('role-01');

  const targetRoles = [
    { id: 'role-01', title: 'Principal Systems Architect' },
    { id: 'role-02', title: 'AI Infrastructure Lead' },
    { id: 'role-03', title: 'Staff Microservices Engineer' },
  ];

  const gapMatrix = [
    {
      id: 'gap-01',
      skillName: 'Vector Databases (Pgvector / Pinecone)',
      currentLevel: 3,
      targetLevel: 5,
      severity: 'high' as const,
      timeToClose: '6 weeks',
      recommendedResource: {
        title: 'Deep Dive: Vector Embeddings & Indexing with Pgvector',
        provider: 'Internal Tech Academy',
        url: '#',
        duration: '12 hours',
      },
      initiativeHint: 'Strategic Initiative: AI Search Acceleration Q4 demands 3 engineers with Pgvector mastery.',
    },
    {
      id: 'gap-02',
      skillName: 'Tech Architecture Review Leadership',
      currentLevel: 3,
      targetLevel: 4,
      severity: 'medium' as const,
      timeToClose: '4 weeks',
      recommendedResource: {
        title: 'Staff Engineer Leadership & RFC Writing Masterclass',
        provider: 'Pluralsight Leadership',
        url: '#',
        duration: '8 hours',
      },
      initiativeHint: 'Initiative: System Modernization 2026 offers co-leadership positions.',
    },
    {
      id: 'gap-03',
      skillName: 'Zero-Trust Cloud Security Architecture',
      currentLevel: 4,
      targetLevel: 5,
      severity: 'low' as const,
      timeToClose: '2 weeks',
      recommendedResource: {
        title: 'AWS Certified Security Specialty Advanced Prep',
        provider: 'A Cloud Guru',
        url: '#',
        duration: '15 hours',
      },
      initiativeHint: undefined,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100">Skill Gap Matrix &amp; Action Plan</h1>
        <p className="text-sm text-slate-400 mt-1">
          Module 3: Objective gap analysis comparing current proficiency levels against target role requirements.
        </p>
      </div>

      {/* Selector for Target Role */}
      <Card className="p-6 border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-100">Select Target Role to Analyze</h2>
          <p className="text-xs text-slate-400">View real-time skill gaps and curated closing resources</p>
        </div>
        <select
          value={selectedTargetRole}
          onChange={(e) => setSelectedTargetRole(e.target.value)}
          className="px-4 py-2.5 bg-slate-950 border border-slate-700/70 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
        >
          {targetRoles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title}
            </option>
          ))}
        </select>
      </Card>

      {/* Gap Comparator Matrix Table / Cards */}
      <div className="space-y-4">
        {gapMatrix.map((gap) => (
          <Card key={gap.id} className="p-6 border-slate-800 bg-slate-900/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-slate-100">{gap.skillName}</h3>
                  <GapSeverityBadge severity={gap.severity} />
                </div>
                <p className="text-xs text-slate-400">Estimated time to close: <strong className="text-slate-200">{gap.timeToClose}</strong></p>
              </div>

              <div className="flex items-center gap-4 bg-slate-950/60 p-3 rounded-lg border border-slate-800 shrink-0">
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 uppercase block">Current</span>
                  <span className="text-sm font-extrabold text-amber-400">Lvl {gap.currentLevel}</span>
                </div>
                <span className="text-slate-600 font-bold">&rarr;</span>
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 uppercase block">Target</span>
                  <span className="text-sm font-extrabold text-emerald-400">Lvl {gap.targetLevel}</span>
                </div>
              </div>
            </div>

            {/* Strategic Initiative Hint if available */}
            {gap.initiativeHint && (
              <div className="p-3 bg-brand-950/30 border border-brand-900/60 rounded-lg text-xs text-brand-300 flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{gap.initiativeHint}</span>
              </div>
            )}

            {/* Recommended Learning Resource */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Recommended Course</span>
                <h4 className="text-xs font-semibold text-slate-200">{gap.recommendedResource.title}</h4>
                <p className="text-[11px] text-slate-500">{gap.recommendedResource.provider} &bull; {gap.recommendedResource.duration}</p>
              </div>

              <div className="flex items-center gap-3">
                <FeedbackButtons targetType="learning_resource" targetId={gap.recommendedResource.title} />
                <Button variant="secondary" size="sm" onClick={() => alert(`Enrolling in ${gap.recommendedResource.title}`)}>
                  Start Course &rarr;
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
