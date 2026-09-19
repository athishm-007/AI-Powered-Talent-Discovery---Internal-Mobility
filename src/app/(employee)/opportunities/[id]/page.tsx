'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FeedbackButtons } from '@/components/features/FeedbackButtons';
import { EvidenceCitationCard } from '@/components/features/EvidenceCitationCard';

export default function OpportunityDetailPage() {
  const [expressed, setExpressed] = useState(false);

  const role = {
    id: 'role-01',
    title: 'Principal Systems Architect',
    department: 'Infrastructure & Cloud Platform',
    location: 'Hybrid (San Francisco, CA)',
    level: 'Principal (L7)',
    overallScore: 92,
    breakdown: {
      coverage: { score: 95, weight: 0.35, weighted: 33.25, label: 'Skill Coverage (w1 = 0.35)' },
      vector: { score: 90, weight: 0.25, weighted: 22.50, label: 'Experience Vector Similarity (w2 = 0.25)' },
      transferable: { score: 88, weight: 0.20, weighted: 17.60, label: 'Transferable Skill Synergy (w3 = 0.20)' },
      experience: { score: 94, weight: 0.20, weighted: 18.80, label: 'Role Recency & Seniority (w4 = 0.20)' },
    },
    evidence: [
      {
        sourceTitle: 'Project: Enterprise High-Throughput Event Bus (2025-2026)',
        snippet: 'Designed and deployed multi-region Kafka cluster handling 100k msg/sec with zero loss across AWS regions.',
        confidence: 0.96,
        relevanceScore: 0.94,
      },
      {
        sourceTitle: 'Verified Certification: AWS Solutions Architect Pro',
        snippet: 'Demonstrated mastery of distributed cloud resilience, IAM policy boundary enforcement, and VPC peering.',
        confidence: 1.0,
        relevanceScore: 0.92,
      },
      {
        sourceTitle: 'AI Inferred Transferable Skill: Technical Mentorship',
        snippet: 'Led bi-weekly architecture RFC reviews with 12 junior software engineers over 18 months.',
        confidence: 0.89,
        relevanceScore: 0.88,
      },
    ],
    reasoningText: 'Alex Chen is a 92% match for Principal Systems Architect. Their verified mastery of Distributed Systems (L5) and Cloud Architecture directly satisfies 95% of target hard requirements. Their recent leadership of the high-throughput Event Bus project provides empirical vector evidence of complex architecture ownership. Minor skill gap identified in Vector Databases (Pgvector), which can be closed via a 3-month focused roadmap.',
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/opportunities" className="hover:text-slate-200 transition-colors">
          &larr; Back to Opportunities
        </Link>
        <span>/</span>
        <span className="text-slate-200">{role.title}</span>
      </div>

      {/* Header Banner */}
      <Card className="p-6 md:p-8 border-slate-800 bg-slate-900/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant="brand">{role.department}</Badge>
              <span className="text-xs text-slate-400">{role.location} &bull; {role.level}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">{role.title}</h1>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Overall Hybrid Score</span>
              <span className="text-3xl font-extrabold text-emerald-400">{role.overallScore}% Match</span>
            </div>
            <Button
              variant={expressed ? 'emerald' : 'primary'}
              size="lg"
              onClick={() => setExpressed(true)}
              className="shadow-lg shadow-brand-600/20"
            >
              {expressed ? '✓ Interest Registered' : 'Express Interest in Role'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Explainable Match Formula & Evidence Citations */}
        <div className="lg:col-span-2 space-y-8">
          {/* Explainable AI Reasoning Card */}
          <Card className="p-6 border-slate-800 bg-slate-900/80">
            <h2 className="text-base font-bold text-slate-100 mb-2">AI Match Explanation &amp; Reasoning</h2>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              {role.reasoningText}
            </p>

            {/* Interactive Feedback Buttons */}
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Was this AI match explanation helpful?</span>
              <FeedbackButtons targetType="role_match" targetId={role.id} />
            </div>
          </Card>

          {/* Detailed Mathematical Scoring Breakdown */}
          <Card className="p-6 border-slate-800 bg-slate-900/80">
            <h2 className="text-base font-bold text-slate-100 mb-1">Mathematical Weight Breakdown</h2>
            <p className="text-xs text-slate-400 mb-4">
              Composite match computed via w1*Coverage + w2*Vector + w3*Transferable + w4*Recency
            </p>

            <div className="space-y-4">
              {Object.entries(role.breakdown).map(([key, item]) => (
                <div key={key} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="text-slate-100">{item.score}% ({item.weighted.toFixed(2)} pts)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-brand-600 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-right">
              <span className="text-xs text-slate-400">Total Summed Score: </span>
              <span className="text-base font-bold text-emerald-400">{role.overallScore}.15 / 100</span>
            </div>
          </Card>

          {/* Evidence Citation Cards */}
          <Card className="p-6 border-slate-800 bg-slate-900/80 space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-100">Grounded Evidence Citations</h2>
              <p className="text-xs text-slate-400">Empirical snippets from your profile backing up this match recommendation</p>
            </div>

            <div className="space-y-3">
              {role.evidence.map((ev, idx) => (
                <EvidenceCitationCard
                  key={idx}
                  sourceTitle={ev.sourceTitle}
                  snippet={ev.snippet}
                  confidence={ev.confidence}
                  relevanceScore={ev.relevanceScore}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column (1 col): Skill Gap Fast Summary & Next Steps */}
        <div className="space-y-6">
          <Card className="p-6 border-slate-800 bg-slate-900/80">
            <h3 className="text-base font-bold text-slate-100 mb-2">Skill Gaps to Close</h3>
            <p className="text-xs text-slate-400 mb-4">Requirements for 100% role readiness</p>

            <div className="space-y-3">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-200">Vector Databases (Pgvector)</span>
                  <Badge variant="amber">Moderate Gap</Badge>
                </div>
                <p className="text-[11px] text-slate-400">Current: L3 &bull; Target: L4 (Time to close: ~6 weeks)</p>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-200">Tech Committee Leadership</span>
                  <Badge variant="slate">Minor Gap</Badge>
                </div>
                <p className="text-[11px] text-slate-400">Current: L3 &bull; Target: L4 (Time to close: ~4 weeks)</p>
              </div>
            </div>

            <Link href="/skill-gaps" className="block mt-4">
              <Button variant="secondary" size="sm" className="w-full">
                Open Full Gap Comparator Matrix &rarr;
              </Button>
            </Link>
          </Card>

          <Card className="p-6 border-slate-800 bg-slate-900/80 text-center">
            <h3 className="text-base font-bold text-slate-100 mb-2">Ready to Apply?</h3>
            <p className="text-xs text-slate-400 mb-4">
              Expressing interest notifies HR Admin and creates a candidate discovery entry.
            </p>
            <Button
              variant={expressed ? 'emerald' : 'primary'}
              size="md"
              onClick={() => setExpressed(true)}
              className="w-full"
            >
              {expressed ? '✓ Expressed Interest' : 'Submit Internal Application'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
