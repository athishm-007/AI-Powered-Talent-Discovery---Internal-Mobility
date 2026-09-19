'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function HRAdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 md:p-8 overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant="indigo">HR Portal &bull; Admin Mode</Badge>
              <span className="text-xs text-slate-400">Enterprise Talent Operations</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">
              TalentLens HR Command Center
            </h1>
            <p className="text-sm text-slate-400">
              Manage talent discovery, internal mobility matching, skill demand forecasting, and analytics.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin/talent">
              <Button variant="primary" size="md">
                Reverse Candidate Search &rarr;
              </Button>
            </Link>
            <Link href="/admin/roles">
              <Button variant="secondary" size="md">
                + Post Internal Role
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <p className="text-xs font-medium text-slate-400">Active Talent Profiles</p>
          <p className="text-2xl font-extrabold text-slate-100 mt-1">420</p>
          <span className="text-xs text-emerald-400">100% profiled via AI engine</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <p className="text-xs font-medium text-slate-400">Internal Openings</p>
          <p className="text-2xl font-extrabold text-slate-100 mt-1">18 Roles</p>
          <span className="text-xs text-indigo-400">Across 4 departments</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <p className="text-xs font-medium text-slate-400">Recommendation Quality</p>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">94.2%</p>
          <span className="text-xs text-slate-400">Netted positive user feedback</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <p className="text-xs font-medium text-slate-400">Strategic Initiatives</p>
          <p className="text-2xl font-extrabold text-amber-400 mt-1">3 Active</p>
          <span className="text-xs text-slate-400">Forecasted skill demand</span>
        </Card>
      </div>

      {/* Grid: High Demand Skills vs Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Internal Candidates expressing interest */}
          <Card className="p-6 border-slate-800 bg-slate-900/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-100">Recent Employee Interest Expressed</h2>
                <p className="text-xs text-slate-400">Internal candidates ready for mobility reviews</p>
              </div>
              <Link href="/admin/talent">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All Candidates &rarr;
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 text-sm">Alex Chen</span>
                    <Badge variant="emerald">92% Match</Badge>
                  </div>
                  <p className="text-xs text-slate-400">Role: Principal Systems Architect &bull; Senior Software Engineer</p>
                </div>
                <Link href="/admin/talent">
                  <Button variant="secondary" size="sm" className="hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/40">
                    Review Candidate Profile
                  </Button>
                </Link>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 text-sm">Sarah Jenkins</span>
                    <Badge variant="brand">86% Match</Badge>
                  </div>
                  <p className="text-xs text-slate-400">Role: AI Infrastructure Lead &bull; Data Engineer L5</p>
                </div>
                <Link href="/admin/talent">
                  <Button variant="secondary" size="sm" className="hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/40">
                    Review Candidate Profile
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column (1 col): HR Portal Navigation Links */}
        <div className="space-y-6">
          <Card className="p-6 border-slate-800 bg-slate-900/80 space-y-3">
            <h3 className="text-base font-bold text-slate-100">HR Admin Suite</h3>
            
            <Link href="/admin/talent" className="block p-3 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors">
              <span className="text-xs font-bold text-slate-200 block">🔍 Reverse Talent Discovery</span>
              <span className="text-[11px] text-slate-400">Find employees by required skill sets &amp; vectors</span>
            </Link>

            <Link href="/admin/roles" className="block p-3 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors">
              <span className="text-xs font-bold text-slate-200 block">📋 Role Catalog &amp; Postings</span>
              <span className="text-[11px] text-slate-400">Publish open positions and set skill weights</span>
            </Link>

            <Link href="/admin/initiatives" className="block p-3 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors">
              <span className="text-xs font-bold text-slate-200 block">🎯 Strategic Initiatives</span>
              <span className="text-[11px] text-slate-400">Forecast organizational skill gaps and hiring demand</span>
            </Link>

            <Link href="/admin/insights" className="block p-3 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors">
              <span className="text-xs font-bold text-slate-200 block">📊 Executive Workforce Analytics</span>
              <span className="text-[11px] text-slate-400">Heatmaps, recommendation quality &amp; AI summary</span>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
