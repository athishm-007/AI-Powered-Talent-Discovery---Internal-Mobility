import React from 'react';
import { CitedEvidence } from '@/models/matching';
import { Badge } from '../ui/Badge';
import { FileText, Briefcase, Award } from 'lucide-react';

export const EvidenceCitationCard: React.FC<{ citations: CitedEvidence[] }> = ({ citations }) => {
  if (!citations || citations.length === 0) return null;

  return (
    <div className="space-y-2 mt-4 pt-4 border-t border-slate-800/80">
      <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
        <FileText className="w-3.5 h-3.5 text-cyan-400" />
        <span>Retrieved Evidence Citations:</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {citations.map((cite, idx) => (
          <div key={idx} className="glass-panel p-2.5 rounded-lg border border-slate-800 text-xs flex items-center gap-2 bg-slate-900/60">
            {cite.type === 'experience' && <Briefcase className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
            {cite.type === 'project' && <Award className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
            <div>
              <span className="font-semibold text-slate-200">[{cite.type.toUpperCase()} #{cite.id.substring(0, 6)}]</span>
              <span className="text-slate-400 ml-1.5">{cite.description || 'Verified achievement'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
