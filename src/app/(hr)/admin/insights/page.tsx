'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { HeatmapChart } from '@/components/charts/HeatmapChart';
import { ReadinessGauge } from '@/components/charts/ReadinessGauge';
import { RecommendationQualityCard } from '@/components/features/RecommendationQualityCard';

export default function HRInsightsPage() {
  const [heatmapData] = useState([
    { department: 'Engineering & Infrastructure', skill: 'Distributed Systems', supplyCount: 34, demandCount: 20 },
    { department: 'Engineering & Infrastructure', skill: 'Cloud Architecture', supplyCount: 28, demandCount: 25 },
    { department: 'Engineering & Infrastructure', skill: 'Vector Databases', supplyCount: 6, demandCount: 18 },
    { department: 'Data Science & AI', skill: 'PyTorch / ML', supplyCount: 15, demandCount: 12 },
    { department: 'Data Science & AI', skill: 'Vector Databases', supplyCount: 9, demandCount: 15 },
    { department: 'Product Management & Design', skill: 'Product Strategy', supplyCount: 12, demandCount: 8 },
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100">Executive Workforce Analytics &amp; Talent Insights</h1>
        <p className="text-sm text-slate-400 mt-1">
          Module 4: Enterprise skill heatmap, talent availability pipeline, recommendation quality, and AI summary.
        </p>
      </div>

      {/* Top AI Executive Summary Box */}
      <Card className="p-6 border-slate-800 bg-slate-900/80 border-l-4 border-l-indigo-500">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100">AI Executive Talent Summary</h2>
              <Badge variant="indigo">Q3/Q4 Enterprise Report</Badge>
            </div>
            <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
              Company-wide internal mobility readiness is currently **78.4%**. The primary organizational bottleneck is in **Vector Databases &amp; LLM Orchestration**, where project demand outpaces verified internal supply by 3:1. However, cross-skilling 14 Senior Engineers in Engineering &amp; Infrastructure with existing Kafka background will close this gap within 8 weeks, saving ~$450,000 in external hiring costs.
            </p>
          </div>
        </div>
      </Card>

      {/* Heatmap & Gauges Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border-slate-800 bg-slate-900/80">
            <h3 className="text-base font-bold text-slate-100 mb-1">Department Skill Supply vs Demand Heatmap</h3>
            <p className="text-xs text-slate-400 mb-4">Color scale indicates net deficit (rose) vs surplus (emerald)</p>
            <HeatmapChart data={heatmapData} />
          </Card>
        </div>

        <div className="space-y-6">
          <RecommendationQualityCard positiveCount={142} negativeCount={9} netPercentage={94.0} />

          <Card className="p-6 border-slate-800 bg-slate-900/80 text-center">
            <h3 className="text-base font-bold text-slate-100 mb-1">Overall Mobility Readiness</h3>
            <p className="text-xs text-slate-400 mb-4">Enterprise workforce readiness score</p>
            <ReadinessGauge score={78} label="78.4% Overall Readiness" size={160} />
          </Card>
        </div>
      </div>
    </div>
  );
}
