'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function OpportunitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  const [roles] = useState([
    {
      id: 'role-01',
      title: 'Principal Systems Architect',
      department: 'Infrastructure & Cloud Platform',
      location: 'Hybrid (San Francisco, CA)',
      level: 'Principal (L7)',
      score: 92,
      requiredSkills: ['Distributed Systems', 'Cloud Native Arch', 'System Security'],
      description: 'Lead technical design of high-throughput microservice infrastructure and cross-cloud topology.',
    },
    {
      id: 'role-02',
      title: 'AI Infrastructure Lead',
      department: 'Data Science & AI',
      location: 'Remote',
      level: 'Lead (L6)',
      score: 86,
      requiredSkills: ['Vector Databases', 'PyTorch', 'Model Serving'],
      description: 'Own enterprise LLM orchestration pipeline, vector search cluster, and fine-tuning cluster.',
    },
    {
      id: 'role-03',
      title: 'Staff Microservices Engineer',
      department: 'Core Platform',
      location: 'On-site (New York, NY)',
      level: 'Staff (L6)',
      score: 81,
      requiredSkills: ['Go / Golang', 'Apache Kafka', 'PostgreSQL'],
      description: 'Scale core billing and transaction pipeline processing 50,000 requests/sec.',
    },
    {
      id: 'role-04',
      title: 'Senior Product Manager - Mobility',
      department: 'Product Management & Design',
      location: 'Hybrid (Austin, TX)',
      level: 'Senior (L5)',
      score: 74,
      requiredSkills: ['Product Strategy', 'Data Analytics', 'Stakeholder Management'],
      description: 'Drive internal mobility product strategy, employee career roadmap features, and HR analytics.',
    },
    {
      id: 'role-05',
      title: 'Staff Security & Compliance Specialist',
      department: 'Operations & People Ops',
      location: 'Remote',
      level: 'Staff (L6)',
      score: 68,
      requiredSkills: ['SOC2 Compliance', 'System Security', 'Audit Logging'],
      description: 'Ensure SOC2 Type II compliance, zero-trust backend architecture, and automated threat monitoring.',
    },
  ]);

  const filteredRoles = roles.filter((role) => {
    const matchesSearch = role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'all' || role.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100">Internal Role &amp; Project Catalog</h1>
        <p className="text-sm text-slate-400 mt-1">
          Module 2: AI-driven explainable internal matching based on skills, experience vector similarity, and career goals.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-96 relative">
          <input
            type="text"
            placeholder="Search roles, skills, or key terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700/70 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <svg className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="w-full sm:w-auto flex items-center gap-3">
          <label className="text-xs font-medium text-slate-400 shrink-0">Filter Department:</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-950 border border-slate-700/70 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Departments</option>
            <option value="Infrastructure & Cloud Platform">Infrastructure &amp; Cloud Platform</option>
            <option value="Data Science & AI">Data Science &amp; AI</option>
            <option value="Core Platform">Core Platform</option>
            <option value="Product Management & Design">Product Management &amp; Design</option>
          </select>
        </div>
      </Card>

      {/* Role Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRoles.map((role) => (
          <Card key={role.id} className="p-6 border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{role.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{role.department} &bull; {role.location}</p>
                </div>
                <Badge variant={role.score >= 85 ? 'emerald' : role.score >= 75 ? 'brand' : 'amber'}>
                  {role.score}% Match
                </Badge>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{role.description}</p>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {role.requiredSkills.map((sk) => (
                  <span key={sk} className="text-[11px] px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-slate-400">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">{role.level}</span>
              <Link href={`/opportunities/${role.id}`}>
                <Button variant="secondary" size="sm">
                  View Full Breakdown &rarr;
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
