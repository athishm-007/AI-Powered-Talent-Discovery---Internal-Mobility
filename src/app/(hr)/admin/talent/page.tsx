'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function ReverseTalentDiscoveryPage() {
  const [skillSearch, setSkillSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  const candidates = [
    {
      id: 'emp-01',
      fullName: 'Alex Chen',
      roleTitle: 'Senior Software Engineer',
      department: 'Engineering & Infrastructure',
      expressedInterest: true,
      topSkills: ['Distributed Systems', 'Go / Golang', 'Apache Kafka', 'Pgvector (L3)'],
      matchScore: 92,
    },
    {
      id: 'emp-02',
      fullName: 'Sarah Jenkins',
      roleTitle: 'Data Engineer L5',
      department: 'Data Science & AI',
      expressedInterest: true,
      topSkills: ['PyTorch', 'Vector Databases', 'Python', 'Spark'],
      matchScore: 86,
    },
    {
      id: 'emp-03',
      fullName: 'Marcus Vance',
      roleTitle: 'Cloud Security Engineer',
      department: 'Engineering & Infrastructure',
      expressedInterest: false,
      topSkills: ['Zero-Trust', 'SOC2 Audit', 'Kubernetes Security'],
      matchScore: 81,
    },
  ];

  const filteredCandidates = candidates.filter((c) => {
    const matchesSkill = skillSearch === '' || c.topSkills.some((s) => s.toLowerCase().includes(skillSearch.toLowerCase())) ||
      c.fullName.toLowerCase().includes(skillSearch.toLowerCase());
    const matchesDept = selectedDept === 'all' || c.department === selectedDept;
    return matchesSkill && matchesDept;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100">Reverse Talent Discovery &amp; Search</h1>
        <p className="text-sm text-slate-400 mt-1">
          Module 1 &amp; 2: Search internal employees by explicit and AI-inferred skills across the organization.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <Card className="p-4 border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-96">
          <input
            type="text"
            placeholder="Filter by skill (e.g., Pgvector, Kafka, Go)..."
            value={skillSearch}
            onChange={(e) => setSkillSearch(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700/70 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-3">
          <label className="text-xs font-medium text-slate-400">Department:</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700/70 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Departments</option>
            <option value="Engineering & Infrastructure">Engineering &amp; Infrastructure</option>
            <option value="Data Science & AI">Data Science &amp; AI</option>
          </select>
        </div>
      </Card>

      {/* Candidate List */}
      <div className="space-y-4">
        {filteredCandidates.map((cand) => (
          <Card key={cand.id} className="p-6 border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-slate-100">{cand.fullName}</h3>
                  <Badge variant="indigo">{cand.roleTitle}</Badge>
                  {cand.expressedInterest && (
                    <Badge variant="emerald">★ Expressed Interest</Badge>
                  )}
                </div>
                <p className="text-xs text-slate-400">{cand.department}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase block">Fit Score</span>
                  <span className="text-lg font-extrabold text-brand-400">{cand.matchScore}%</span>
                </div>
                <Button variant="secondary" size="sm" onClick={() => alert(`Viewing detailed internal profile for ${cand.fullName}`)}>
                  View Profile &rarr;
                </Button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap gap-2">
              {cand.topSkills.map((sk) => (
                <span key={sk} className="text-xs px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-md text-slate-300">
                  {sk}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
