import React from 'react';
import { ProfileSnapshot } from '@/models/profile';
import { formatDate } from '@/lib/utils';
import { History, Sparkles, FileText, Briefcase } from 'lucide-react';

export const SkillEvolutionTimeline: React.FC<{ snapshots: ProfileSnapshot[] }> = ({ snapshots }) => {
  if (!snapshots || snapshots.length === 0) {
    return <div className="text-xs text-slate-500 py-4 text-center">No profile snapshot history recorded yet.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <History className="w-4 h-4 text-cyan-400" />
        <span>Profile Evolution Snapshots</span>
      </div>

      <div className="relative pl-6 space-y-6 border-l-2 border-slate-800">
        {snapshots.map((snap) => (
          <div key={snap.id} className="relative group">
            <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-slate-900 border-2 border-cyan-500 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-slate-900/60 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-cyan-400">Version {snap.version}</span>
                <span className="text-slate-500">{formatDate(snap.created_at)}</span>
              </div>

              <p className="text-slate-300 font-medium mb-2 capitalize">Trigger: {snap.trigger} update</p>
              
              <div className="flex gap-4 text-slate-400">
                <span>Explicit Skills: <strong className="text-slate-200">{snap.skills_summary?.explicit_count || 0}</strong></span>
                <span>Inferred Skills: <strong className="text-slate-200">{snap.skills_summary?.inferred_count || 0}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
