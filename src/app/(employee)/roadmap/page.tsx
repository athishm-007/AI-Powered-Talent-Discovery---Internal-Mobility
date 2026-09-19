'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { OutcomesLogModal } from '@/components/features/OutcomesLogModal';
import { FeedbackButtons } from '@/components/features/FeedbackButtons';

export default function RoadmapPage() {
  const [showLogModal, setShowLogModal] = useState(false);

  const [roadmap, setRoadmap] = useState({
    title: 'Personalized Mobility Roadmap to Principal Systems Architect',
    targetRole: 'Principal Systems Architect',
    overallProgress: 65,
    phases: [
      {
        phaseName: 'Phase 1: Foundation & Skill Gap Bridging (Months 0-3)',
        timeframe: 'Months 0-3',
        status: 'completed' as const,
        milestones: [
          { id: 'm-1', title: 'Complete AWS Solutions Architect Advanced Exam Prep', status: 'completed' },
          { id: 'm-2', title: 'Deep Dive: Vector Embeddings & Indexing with Pgvector', status: 'completed' },
          { id: 'm-3', title: 'Publish RFC on Distributed Event Bus Scaling', status: 'completed' },
        ],
      },
      {
        phaseName: 'Phase 2: Applied Technical Mastery & Shadowing (Months 3-6)',
        timeframe: 'Months 3-6',
        status: 'in_progress' as const,
        milestones: [
          { id: 'm-4', title: 'Shadow Cloud Architecture Review Committee Meetings', status: 'in_progress' },
          { id: 'm-5', title: 'Deliver 1 Internal Tech Talk on Distributed Consensus', status: 'pending' },
          { id: 'm-6', title: 'Lead Architecture Migration for Search Acceleration Microservice', status: 'pending' },
        ],
      },
      {
        phaseName: 'Phase 3: Role Transition & Leadership Readiness (Months 6-12)',
        timeframe: 'Months 6-12',
        status: 'upcoming' as const,
        milestones: [
          { id: 'm-7', title: 'Co-lead Q1 2027 Infrastructure Budgeting & Capacity Planning', status: 'pending' },
          { id: 'm-8', title: 'Formal Interview & Transition Panel with HR Leadership', status: 'pending' },
        ],
      },
    ],
  });

  const toggleMilestone = (phaseIdx: number, mId: string) => {
    setRoadmap((prev) => {
      const newPhases = [...prev.phases];
      const milestone = newPhases[phaseIdx].milestones.find((m) => m.id === mId);
      if (milestone) {
        milestone.status = milestone.status === 'completed' ? 'pending' : 'completed';
      }
      return { ...prev, phases: newPhases };
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Personalized Mobility Roadmap</h1>
          <p className="text-sm text-slate-400 mt-1">
            Module 3: Phased career progression timeline tailored to your target role readiness.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setShowLogModal(true)}
          className="shadow-lg shadow-brand-600/20"
        >
          + Log Career Outcome / Promotion
        </Button>
      </div>

      {/* Progress Bar Card */}
      <Card className="p-6 border-slate-800 bg-slate-900/80">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-base font-bold text-slate-100">{roadmap.title}</h2>
            <p className="text-xs text-slate-400">Target Role: <span className="text-brand-400 font-semibold">{roadmap.targetRole}</span></p>
          </div>
          <span className="text-2xl font-extrabold text-brand-400">{roadmap.overallProgress}%</span>
        </div>

        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-brand-600 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${roadmap.overallProgress}%` }}
          />
        </div>
      </Card>

      {/* Phased Roadmap Timeline */}
      <div className="space-y-6">
        {roadmap.phases.map((phase, pIdx) => (
          <Card key={pIdx} className="p-6 border-slate-800 bg-slate-900/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-brand-500/10 text-brand-400 text-xs font-bold">
                  {phase.timeframe}
                </span>
                <h3 className="text-base font-bold text-slate-100">{phase.phaseName}</h3>
              </div>
              <Badge
                variant={
                  phase.status === 'completed'
                    ? 'emerald'
                    : phase.status === 'in_progress'
                    ? 'amber'
                    : 'slate'
                }
              >
                {phase.status === 'completed' ? 'Completed Phase' : phase.status === 'in_progress' ? 'Active Phase' : 'Upcoming Phase'}
              </Badge>
            </div>

            <div className="space-y-2.5 pt-2">
              {phase.milestones.map((m) => (
                <div
                  key={m.id}
                  onClick={() => toggleMilestone(pIdx, m.id)}
                  className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={m.status === 'completed'}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-brand-600 bg-slate-900 border-slate-700 cursor-pointer"
                    />
                    <span className={`text-xs ${m.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                      {m.title}
                    </span>
                  </div>
                  <Badge variant={m.status === 'completed' ? 'emerald' : m.status === 'in_progress' ? 'amber' : 'slate'}>
                    {m.status}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-500">Was this phase roadmap guidance accurate?</span>
              <FeedbackButtons targetType="roadmap_item" targetId={phase.phaseName} />
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Trigger for Career Outcomes */}
      {showLogModal && (
        <OutcomesLogModal
          isOpen={showLogModal}
          onClose={() => setShowLogModal(false)}
          onSuccess={() => {
            alert('Career outcome recorded! Thank you for helping improve AI career recommendations.');
          }}
        />
      )}
    </div>
  );
}
