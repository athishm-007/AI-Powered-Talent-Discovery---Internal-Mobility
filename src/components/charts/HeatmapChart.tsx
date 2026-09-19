'use client';

import React from 'react';
import { Badge } from '../ui/Badge';

export interface HeatmapItem {
  skill_name: string;
  category: string;
  supply_level: number;
  demand_level: number;
  gap_intensity: 'CRITICAL' | 'MODERATE' | 'STABLE';
}

export const HeatmapChart: React.FC<{ data: HeatmapItem[] }> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item, idx) => {
        const isCritical = item.gap_intensity === 'CRITICAL';
        const isModerate = item.gap_intensity === 'MODERATE';

        return (
          <div
            key={idx}
            className={`p-4 rounded-xl border transition-all ${
              isCritical
                ? 'bg-rose-950/20 border-rose-800/40 hover:border-rose-500/60'
                : isModerate
                ? 'bg-amber-950/20 border-amber-800/40 hover:border-amber-500/60'
                : 'bg-emerald-950/20 border-emerald-800/40 hover:border-emerald-500/60'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="font-semibold text-sm text-white">{item.skill_name}</h4>
                <p className="text-xs text-slate-400">{item.category}</p>
              </div>
              <Badge variant={isCritical ? 'rose' : isModerate ? 'amber' : 'emerald'}>
                {item.gap_intensity}
              </Badge>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Supply Index:</span>
                <span className="font-semibold text-cyan-400">{item.supply_level.toFixed(1)} / 5.0</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full" style={{ width: `${(item.supply_level / 5) * 100}%` }} />
              </div>

              <div className="flex justify-between text-slate-300 pt-1">
                <span>Demand Target:</span>
                <span className="font-semibold text-indigo-400">{item.demand_level.toFixed(1)} / 5.0</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full" style={{ width: `${(item.demand_level / 5) * 100}%` }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
