'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function HRRolesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [roles, setRoles] = useState([
    {
      id: 'role-01',
      title: 'Principal Systems Architect',
      department: 'Infrastructure & Cloud Platform',
      status: 'active',
      applicantCount: 4,
    },
    {
      id: 'role-02',
      title: 'AI Infrastructure Lead',
      department: 'Data Science & AI',
      status: 'active',
      applicantCount: 2,
    },
    {
      id: 'role-03',
      title: 'Staff Microservices Engineer',
      department: 'Core Platform',
      status: 'active',
      applicantCount: 1,
    },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Internal Role Postings Management</h1>
          <p className="text-sm text-slate-400 mt-1">
            Module 2: Manage job profiles, weight matrices, and internal vacancy listings.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setShowAddModal(true)} className="shadow-lg shadow-brand-600/20">
          + Create Internal Role Posting
        </Button>
      </div>

      {/* Role Catalog Table / Cards */}
      <div className="space-y-4">
        {roles.map((r) => (
          <Card key={r.id} className="p-6 border-slate-800 bg-slate-900/80 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold text-slate-100">{r.title}</h3>
                <Badge variant="emerald">Active Posting</Badge>
              </div>
              <p className="text-xs text-slate-400">{r.department} &bull; {r.applicantCount} internal applicants</p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm" onClick={() => alert(`Editing configuration for ${r.title}`)}>
                Edit Weights
              </Button>
              <Button variant="ghost" size="sm" className="text-rose-400 hover:text-rose-300">
                Close Posting
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-6 border-slate-800 bg-slate-900 space-y-4">
            <h2 className="text-lg font-bold text-slate-100">Create Internal Role Posting</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setRoles((prev) => [
                  ...prev,
                  {
                    id: `role-${Date.now()}`,
                    title: 'New Internal Staff Specialist',
                    department: 'Infrastructure & Cloud Platform',
                    status: 'active',
                    applicantCount: 0,
                  },
                ]);
                setShowAddModal(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-medium text-slate-300 mb-1">Role Title</label>
                <input required type="text" placeholder="e.g. Lead MLOps Engineer" className="w-full p-2.5 bg-slate-950 border border-slate-700/70 rounded-lg text-slate-100 text-xs" />
              </div>
              <div>
                <label className="block font-medium text-slate-300 mb-1">Department</label>
                <input required type="text" placeholder="e.g. Data Science & AI" className="w-full p-2.5 bg-slate-950 border border-slate-700/70 rounded-lg text-slate-100 text-xs" />
              </div>
              <div>
                <label className="block font-medium text-slate-300 mb-1">Key Required Skill IDs (Comma separated)</label>
                <input required type="text" placeholder="sk-1, sk-3, sk-8" className="w-full p-2.5 bg-slate-950 border border-slate-700/70 rounded-lg text-slate-100 text-xs" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <Button type="button" variant="secondary" size="sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Publish Posting
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
