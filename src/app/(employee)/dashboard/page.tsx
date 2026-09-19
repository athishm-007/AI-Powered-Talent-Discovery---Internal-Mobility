'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SkillRadarChart } from '@/components/charts/SkillRadarChart';
import { ReadinessGauge } from '@/components/charts/ReadinessGauge';

export default function EmployeeDashboardPage() {
  const [profile] = useState({
    fullName: 'Alex Chen',
    roleTitle: 'Senior Software Engineer',
    department: 'Engineering & Infrastructure',
    bio: 'Backend & distributed systems specialist focused on scalable microservices and data pipelines.',
    futurePotential: 'Demonstrates exceptional potential for Tech Lead & Staff Architect roles with strong transferable domain knowledge in event-driven systems and cross-functional mentorship.',
    verifiedSkillsCount: 14,
    inferredSkillsCount: 8,
    activeRoadmapProgress: 65,
  });

  const [topMatches] = useState([
    {
      id: 'role-01',
      title: 'Principal Systems Architect',
      department: 'Infrastructure & Cloud Platform',
      score: 92,
      breakdown: { coverage: 95, vector: 90, transferable: 88, experience: 94 },
      evidenceCount: 7,
    },
    {
      id: 'role-02',
      title: 'AI Infrastructure Lead',
      department: 'Data Science & AI',
      score: 86,
      breakdown: { coverage: 82, vector: 88, transferable: 90, experience: 84 },
      evidenceCount: 5,
    },
    {
      id: 'role-03',
      title: 'Staff Microservices Engineer',
      department: 'Core Platform',
      score: 81,
      breakdown: { coverage: 85, vector: 80, transferable: 78, experience: 82 },
      evidenceCount: 4,
    },
  ]);

  const [radarData] = useState([
    { subject: 'Distributed Systems', current: 90, required: 85 },
    { subject: 'Cloud Native Arch', current: 85, required: 90 },
    { subject: 'Vector DB / RAG', current: 60, required: 80 },
    { subject: 'System Security', current: 75, required: 75 },
    { subject: 'Tech Leadership', current: 70, required: 85 },
    { subject: 'Cost Optimization', current: 65, required: 70 },
  ]);

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-brand-950/40 to-slate-900 border border-slate-800 p-6 md:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full filter blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <Badge variant="emerald">Verified Active Employee Profile</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">
              Welcome back, {profile.fullName}
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              {profile.roleTitle} &bull; <span className="text-slate-300 font-medium">{profile.department}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/opportunities">
              <Button variant="primary" size="md">
                Explore 14 Open Roles &rarr;
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="secondary" size="md">
                Edit Profile & Skills
              </Button>
            </Link>
          </div>
        </div>

        {/* Future Potential Insight Pill */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex items-start gap-3 bg-brand-950/30 p-4 rounded-xl border-l-4 border-l-brand-500">
          <div className="p-1.5 rounded-lg bg-brand-500/20 text-brand-400 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">AI Future Potential Insight</span>
            <p className="text-xs md:text-sm text-slate-300 mt-0.5 leading-relaxed">{profile.futurePotential}</p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center gap-4 border-slate-800 bg-slate-900/60">
          <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Top Role Match Score</p>
            <p className="text-2xl font-bold text-slate-100 mt-0.5">92%</p>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <span>&uarr; 4%</span> from last snapshot
            </span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 border-slate-800 bg-slate-900/60">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Verified Skills</p>
            <p className="text-2xl font-bold text-slate-100 mt-0.5">{profile.verifiedSkillsCount}</p>
            <span className="text-[11px] text-slate-400">+ {profile.inferredSkillsCount} AI-inferred skills</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 border-slate-800 bg-slate-900/60">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Active Roadmap</p>
            <p className="text-2xl font-bold text-slate-100 mt-0.5">{profile.activeRoadmapProgress}%</p>
            <span className="text-[11px] text-amber-400">Phase 2: Technical Mastery</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 border-slate-800 bg-slate-900/60">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">AI Mobility Coach</p>
            <p className="text-sm font-bold text-slate-100 mt-0.5">Ready for Q&amp;A</p>
            <Link href="/assistant" className="text-[11px] text-purple-400 hover:underline">
              Launch Chat Assistant &rarr;
            </Link>
          </div>
        </Card>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Recommended Roles */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Top Internal Opportunity Matches</h2>
              <p className="text-xs text-slate-400">Scored via multi-dimensional skill, vector &amp; transferable experience algorithms</p>
            </div>
            <Link href="/opportunities">
              <Button variant="ghost" size="sm" className="text-xs">
                View All Opportunities &rarr;
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {topMatches.map((match) => (
              <Card key={match.id} className="p-6 border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-100">{match.title}</h3>
                      <Badge variant="brand">{match.score}% Match</Badge>
                    </div>
                    <p className="text-xs text-slate-400">{match.department}</p>
                  </div>
                  <Link href={`/opportunities/${match.id}`}>
                    <Button variant="secondary" size="sm">
                      View Match Breakdown &rarr;
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-slate-800/80 text-xs">
                  <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block">Skill Coverage</span>
                    <span className="font-semibold text-slate-200">{match.breakdown.coverage}%</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block">Vector Similarity</span>
                    <span className="font-semibold text-slate-200">{match.breakdown.vector}%</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block">Transferable Skills</span>
                    <span className="font-semibold text-slate-200">{match.breakdown.transferable}%</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block">Citations</span>
                    <span className="font-semibold text-brand-400">{match.evidenceCount} verified snippets</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Active Roadmap Section */}
          <Card className="p-6 border-slate-800 bg-slate-900/80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">Current Phase: Technical Mastery (Months 3-6)</h3>
                  <p className="text-xs text-slate-400">Roadmap target: Principal Systems Architect</p>
                </div>
              </div>
              <Link href="/roadmap">
                <Button variant="ghost" size="sm" className="text-xs">
                  Full Roadmap &rarr;
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brand-600 bg-slate-900 border-slate-700" />
                  <span className="text-xs text-slate-300 line-through">Complete AWS Solutions Architect Advanced Exam Prep</span>
                </div>
                <Badge variant="emerald">Completed</Badge>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 rounded text-brand-600 bg-slate-900 border-slate-700" />
                  <span className="text-xs text-slate-200">Shadow Cloud Architecture Review Committee Meetings</span>
                </div>
                <Badge variant="amber">In Progress</Badge>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 rounded text-brand-600 bg-slate-900 border-slate-700" />
                  <span className="text-xs text-slate-300">Deliver 1 Internal Tech Talk on Distributed Consensus</span>
                </div>
                <Badge variant="slate">Upcoming</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column (1 col): Skill Radar & Readiness */}
        <div className="space-y-6">
          <Card className="p-6 border-slate-800 bg-slate-900/80">
            <h3 className="text-base font-bold text-slate-100 mb-1">Skill Radar vs Target Role</h3>
            <p className="text-xs text-slate-400 mb-4">Comparing your current proficiency vs. Principal Systems Architect requirements</p>
            <SkillRadarChart data={radarData} title="" />
          </Card>

          <Card className="p-6 border-slate-800 bg-slate-900/80 text-center">
            <h3 className="text-base font-bold text-slate-100 mb-1">Target Readiness Gauge</h3>
            <p className="text-xs text-slate-400 mb-4">Time-to-readiness estimate</p>
            <ReadinessGauge score={88} label="Estimated readiness: 3-4 months" size={160} />
            <p className="text-xs text-slate-400 mt-4">
              Closing 2 critical gaps in <span className="text-slate-200 font-medium">Vector DBs</span> and <span className="text-slate-200 font-medium">Tech Leadership</span> will elevate match score to 98%.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
