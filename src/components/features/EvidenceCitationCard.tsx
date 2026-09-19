import React from 'react';
import { CitedEvidence } from '@/models/matching';
import { Badge } from '../ui/Badge';
import { FileText, Briefcase, Award, CheckCircle } from 'lucide-react';

export interface EvidenceCitationCardProps {
  citations?: CitedEvidence[];
  sourceTitle?: string;
  snippet?: string;
  confidence?: number;
  relevanceScore?: number;
}

export const EvidenceCitationCard: React.FC<EvidenceCitationCardProps> = ({
  citations,
  sourceTitle,
  snippet,
  confidence,
  relevanceScore,
}) => {
  if (citations && citations.length > 0) {
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
  }

  return (
    <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200">{sourceTitle || 'Profile Evidence Snippet'}</span>
        </div>
        {relevanceScore !== undefined && (
          <Badge variant="cyan">{Math.round(relevanceScore * 100)}% Match Relevance</Badge>
        )}
      </div>
      {snippet && <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">{snippet}</p>}
      {confidence !== undefined && (
        <div className="text-[10px] text-slate-500 text-right">
          Confidence score: {(confidence * 100).toFixed(0)}%
        </div>
      )}
    </div>
  );
};
