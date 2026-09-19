'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SkillEvolutionTimeline } from '@/components/features/SkillEvolutionTimeline';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    fullName: 'Alex Chen',
    email: 'alex.chen@company.com',
    roleTitle: 'Senior Software Engineer',
    department: 'Engineering & Infrastructure',
    bio: 'Backend & distributed systems specialist focused on scalable microservices, Kubernetes, and high-throughput data processing.',
  });

  const [skills, setSkills] = useState([
    { id: 's-1', name: 'Distributed Systems', level: 5, source: 'explicit', confidence: 1.0, verifiedAt: '2026-01-15' },
    { id: 's-2', name: 'Go / Golang', level: 5, source: 'explicit', confidence: 1.0, verifiedAt: '2026-02-10' },
    { id: 's-3', name: 'Kubernetes Platform', level: 4, source: 'explicit', confidence: 0.95, verifiedAt: '2026-03-01' },
    { id: 's-4', name: 'Apache Kafka', level: 4, source: 'inferred', confidence: 0.88, evidence: 'Extracted from Project: Real-time Event Streaming Architecture' },
    { id: 's-5', name: 'Vector Databases (Pgvector)', level: 3, source: 'inferred', confidence: 0.82, evidence: 'Inferred from Learning Log: Vector Embeddings & RAG' },
    { id: 's-6', name: 'PostgreSQL Optimization', level: 4, source: 'explicit', confidence: 0.92, verifiedAt: '2025-11-20' },
  ]);

  const [evolutionTimeline] = useState([
    {
      date: 'Sep 2026',
      title: 'Inferred Vector Search Proficiency',
      description: 'Extracted Pgvector indexing experience from internal search optimization project',
      type: 'inferred' as const,
      skillName: 'Vector Databases',
    },
    {
      date: 'Jul 2026',
      title: 'Explicit Certification Verified',
      description: 'AWS Certified Solutions Architect Professional added to verified credentials',
      type: 'explicit' as const,
      skillName: 'Cloud Architecture',
    },
    {
      date: 'May 2026',
      title: 'System Inferred Kafka Mastery',
      description: 'Detected event-driven design pattern ownership across 4 repository commits',
      type: 'inferred' as const,
      skillName: 'Apache Kafka',
    },
  ]);

  const [parsingDocument, setParsingDocument] = useState(false);
  const [parseSuccess, setParseSuccess] = useState(false);

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setParsingDocument(true);
    setTimeout(() => {
      setParsingDocument(false);
      setParseSuccess(true);
      setSkills((prev) => [
        ...prev,
        { id: `s-new-${Date.now()}`, name: 'GraphQL Gateway', level: 4, source: 'inferred', confidence: 0.91, evidence: 'Parsed from uploaded resume document' },
      ]);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Page Title Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100">Dynamic AI Skill Profile</h1>
        <p className="text-sm text-slate-400 mt-1">
          Module 1: Continuously evolving profile combining explicit experience and AI-inferred skills.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Personal Bio, Explicit vs Inferred Skills, Experience Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Overview Card */}
          <Card className="p-6 border-slate-800 bg-slate-900/80">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-100">Basic Information</h2>
              <Badge variant="indigo">Verified Employee</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/70 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Work Email</label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full px-3 py-2 bg-slate-950/50 border border-slate-800 rounded-lg text-slate-400 text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Role Title</label>
                <input
                  type="text"
                  value={profile.roleTitle}
                  onChange={(e) => setProfile({ ...profile, roleTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/70 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Department</label>
                <input
                  type="text"
                  disabled
                  value={profile.department}
                  className="w-full px-3 py-2 bg-slate-950/50 border border-slate-800 rounded-lg text-slate-400 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-400 mb-1">Professional Bio</label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/70 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </Card>

          {/* Skills Management (Explicit & Inferred) */}
          <Card className="p-6 border-slate-800 bg-slate-900/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-100">Skill Portfolio</h2>
                <p className="text-xs text-slate-400">Explicitly listed vs. AI-extracted hidden &amp; transferable skills</p>
              </div>
              <Button variant="secondary" size="sm">
                + Add Manual Skill
              </Button>
            </div>

            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill.id} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-200">{skill.name}</span>
                      {skill.source === 'explicit' ? (
                        <Badge variant="emerald">Explicit</Badge>
                      ) : (
                        <Badge variant="purple">AI-Inferred ({Math.round(skill.confidence * 100)}% conf)</Badge>
                      )}
                    </div>
                    {skill.evidence && (
                      <p className="text-xs text-slate-400 italic">{skill.evidence}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <div
                          key={lvl}
                          className={`w-2.5 h-6 rounded-sm ${
                            lvl <= skill.level ? 'bg-brand-500' : 'bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-300 w-8 text-right">Lvl {skill.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Experience & Projects Form */}
          <Card className="p-6 border-slate-800 bg-slate-900/80">
            <h2 className="text-base font-bold text-slate-100 mb-4">Add Project &amp; Work History</h2>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Work experience saved!'); }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Project Name / Role</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Enterprise RAG Pipeline Migration"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700/70 rounded-lg text-slate-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Timeframe</label>
                  <input
                    type="text"
                    placeholder="e.g., Jan 2026 - Present"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700/70 rounded-lg text-slate-100 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Key Impact &amp; Technologies Used</label>
                <textarea
                  rows={2}
                  placeholder="Architected vector indexing using Pgvector and OpenAI embeddings..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/70 rounded-lg text-slate-100 text-sm"
                />
              </div>
              <Button type="submit" variant="primary" size="sm">
                Save &amp; Trigger AI Profiling Re-scan
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Column (1 col): Resume Parsing Dropzone & Skill Evolution Timeline */}
        <div className="space-y-8">
          {/* Resume / Document Parser Upload Card */}
          <Card className="p-6 border-slate-800 bg-slate-900/80">
            <h2 className="text-base font-bold text-slate-100 mb-1">AI Resume &amp; Doc Parser</h2>
            <p className="text-xs text-slate-400 mb-4">
              Upload PDF or DOCX resume to auto-extract hidden &amp; transferable skills into your profile.
            </p>

            <div className="border-2 border-dashed border-slate-700 hover:border-brand-500 rounded-xl p-6 text-center bg-slate-950/40 transition-colors relative cursor-pointer">
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleDocumentUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="p-3 rounded-full bg-brand-500/10 text-brand-400 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-200">
                {parsingDocument ? 'Analyzing document with AI...' : 'Drop resume file or click to browse'}
              </p>
              <p className="text-xs text-slate-500 mt-1">Supports PDF, DOCX (Max 10MB)</p>
            </div>

            {parseSuccess && (
              <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Parsed successfully! Added 1 new inferred skill: <strong>GraphQL Gateway</strong>.</span>
              </div>
            )}
          </Card>

          {/* Skill Evolution Timeline Component */}
          <Card className="p-6 border-slate-800 bg-slate-900/80">
            <h2 className="text-base font-bold text-slate-100 mb-1">Continuous Skill Evolution</h2>
            <p className="text-xs text-slate-400 mb-4">Historical record of profile updates over time</p>
            <SkillEvolutionTimeline items={evolutionTimeline} />
          </Card>
        </div>
      </div>
    </div>
  );
}
