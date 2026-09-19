'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { User, Sparkles, CheckCircle, ShieldCheck, X, Briefcase, Award } from 'lucide-react';

export default function ReverseTalentDiscoveryPage() {
  const { showToast } = useToast();
  const [skillSearch, setSkillSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [activeCandidate, setActiveCandidate] = useState<any | null>(null);

  const candidates = [
    {
      id: 'emp-01',
      fullName: 'Alex Chen',
      roleTitle: 'Senior Software Engineer',
      targetRole: 'Principal Systems Architect',
      department: 'Engineering & Infrastructure',
      expressedInterest: true,
      topSkills: ['Distributed Systems', 'Go / Golang', 'Apache Kafka', 'Pgvector (L3)'],
      matchScore: 92,
      yearsExp: 6,
      bio: 'Senior Backend Engineer leading high-throughput distributed message streaming infrastructure. Expert in Go microservices and event-driven architectures.',
      evidence: ['Led Kafka Event Bus refactor (10M msgs/sec)', 'Designed pgvector RAG pipeline'],
    },
    {
      id: 'emp-02',
      fullName: 'Sarah Jenkins',
      roleTitle: 'Data Engineer L5',
      targetRole: 'AI Infrastructure Lead',
      department: 'Data Science & AI',
      expressedInterest: true,
      topSkills: ['PyTorch', 'Vector Databases', 'Python', 'Spark'],
      matchScore: 86,
      yearsExp: 5,
      bio: 'Data Engineer specializing in large-scale vector similarity indexing, GPU pipeline optimization, and automated feature store architectures.',
      evidence: ['Optimized HNSW vector index search speed by 40%', 'Managed multi-node Spark ETL workflows'],
    },
    {
      id: 'emp-03',
      fullName: 'Marcus Vance',
      roleTitle: 'Cloud Security Engineer',
      targetRole: 'Staff Security Operations Engineer',
      department: 'Engineering & Infrastructure',
      expressedInterest: false,
      topSkills: ['Zero-Trust', 'SOC2 Audit', 'Kubernetes Security'],
      matchScore: 81,
      yearsExp: 7,
      bio: 'Cloud Security Architect focusing on Kubernetes zero-trust policies, automated compliance verification, and enterprise IAM frameworks.',
      evidence: ['Achieved SOC2 Type II compliance audit', 'Deployed Cilium Service Mesh eBPF security policies'],
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
            placeholder="Filter by skill or name (e.g., Pgvector, Kafka, Alex)..."
            value={skillSearch}
            onChange={(e) => setSkillSearch(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700/70 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-3">
          <label className="text-xs font-medium text-slate-400">Department:</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700/70 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
          <Card key={cand.id} className="p-6 border-slate-800 bg-slate-900/80 hover:border-cyan-500/30 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-slate-100">{cand.fullName}</h3>
                  <Badge variant="indigo">{cand.roleTitle}</Badge>
                  {cand.expressedInterest && (
                    <Badge variant="emerald">★ Expressed Interest</Badge>
                  )}
                </div>
                <p className="text-xs text-slate-400">{cand.department} &bull; {cand.yearsExp} Years Exp</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase block">Fit Score</span>
                  <span className="text-lg font-extrabold text-cyan-400">{cand.matchScore}%</span>
                </div>
                <Button variant="primary" size="sm" onClick={() => setActiveCandidate(cand)} className="gap-1.5 shadow-md shadow-cyan-500/20">
                  <span>Review Candidate Profile</span>
                  <span>&rarr;</span>
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

      {/* Candidate Profile Review Modal */}
      {activeCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <Card className="w-full max-w-2xl bg-slate-900 border-slate-700 shadow-2xl p-6 space-y-6 relative overflow-hidden">
            <button
              onClick={() => setActiveCandidate(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-cyan-500/20 shrink-0">
                {activeCandidate.fullName.substring(0, 2)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-100">{activeCandidate.fullName}</h2>
                  <Badge variant="emerald">{activeCandidate.matchScore}% AI Match</Badge>
                </div>
                <p className="text-sm text-cyan-400 font-medium">{activeCandidate.roleTitle} &rarr; Target: {activeCandidate.targetRole}</p>
                <p className="text-xs text-slate-400">{activeCandidate.department} &bull; {activeCandidate.yearsExp} Years Verified Tenure</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Candidate Executive Bio</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{activeCandidate.bio}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-cyan-400" /> Verified Skill Matrix &amp; Vector Alignment
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeCandidate.topSkills.map((sk: string) => (
                  <span key={sk} className="text-xs px-3 py-1.5 bg-cyan-950/50 border border-cyan-500/30 text-cyan-200 rounded-lg font-medium flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Cited Project Evidence
              </h4>
              <ul className="space-y-1.5">
                {activeCandidate.evidence.map((ev: string, idx: number) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-center gap-2 bg-slate-950/40 p-2 rounded-lg border border-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                    {ev}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  showToast(`Interview invite sent to ${activeCandidate.fullName}`, 'info');
                  setActiveCandidate(null);
                }}
              >
                Schedule Interview
              </Button>
              <Button
                variant="emerald"
                size="md"
                onClick={() => {
                  showToast(`Mobility application approved for ${activeCandidate.fullName}!`, 'success');
                  setActiveCandidate(null);
                }}
                className="gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Approve Mobility Review</span>
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
