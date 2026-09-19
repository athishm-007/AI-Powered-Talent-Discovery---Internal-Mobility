import React from 'react';
import { RecommendationQuality } from '@/models/insights';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ThumbsUp, TrendingUp, Target } from 'lucide-react';

export const RecommendationQualityCard: React.FC<{ quality: RecommendationQuality }> = ({ quality }) => {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ThumbsUp className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-base text-white">Recommendation Quality Index</h3>
        </div>
        <Badge variant={quality.trend === 'upward' ? 'emerald' : 'slate'} className="capitalize gap-1">
          <TrendingUp className="w-3.5 h-3.5" />
          {quality.trend} Trend
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        <div className="glass-panel p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="text-xs text-slate-400 mb-1">Helpful Feedback Rate</div>
          <div className="text-2xl font-bold text-cyan-400">{quality.helpful_rate_pct.toFixed(1)}%</div>
          <div className="text-[10px] text-slate-500 mt-1">Based on {quality.total_feedback_count} ratings</div>
        </div>

        <div className="glass-panel p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="text-xs text-slate-400 mb-1">Outcome Conversion Rate</div>
          <div className="text-2xl font-bold text-emerald-400">{quality.outcome_conversion_pct.toFixed(1)}%</div>
          <div className="text-[10px] text-slate-500 mt-1">Logged interest & moves</div>
        </div>

        <div className="glass-panel p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="text-xs text-slate-400 mb-1">Re-weighting Status</div>
          <div className="text-sm font-semibold text-indigo-300 mt-1">Active Algorithm</div>
          <div className="text-[10px] text-slate-500 mt-1">feedback_modifier clamped [0.5, 1.5]</div>
        </div>
      </div>
    </Card>
  );
};
