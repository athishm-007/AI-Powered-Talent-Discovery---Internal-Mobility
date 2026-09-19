'use client';

import React from 'react';
import { Badge } from '../ui/Badge';

export interface HeatmapItem {
  skill_name?: string;
  skill?: string;
  category?: string;
  department?: string;
  supply_level?: number;
  supplyCount?: number;
  demand_level?: number;
  demandCount?: number;
  gap_intensity?: 'CRITICAL' | 'MODERATE' | 'STABLE' | string;
}

export const HeatmapChart: React.FC<{ data: HeatmapItem[] }> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item, idx) => {
        const title = item.skill_name || item.skill || 'Skill Requirement';
        const subtitle = item.category || item.department || 'Department';
        const supply = item.supply_level !== undefined ? item.supply_level : (item.supplyCount || 0);
        const demand = item.demand_level !== undefined ? item.demand_level : (item.demandCount || 0);
        
        let intensity = item.gap_intensity;
        if (!intensity) {
          const delta = demand - supply;
          intensity = delta > 5 ? 'CRITICAL' : delta > 0 ? 'MODERATE' : 'STABLE';
        }

        const isCritical = intensity === 'CRITICAL';
        const isModerate = intensity === 'MODERATE';

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
                <h4 className="font-semibold text-sm text-white">{title}</h4>
                <p className="text-xs text-slate-400">{subtitle}</p>
              </div>
              <Badge variant={isCritical ? 'rose' : isModerate ? 'amber' : 'emerald'}>
                {intensity}
              </Badge>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Supply Index:</span>
                <span className="font-semibold text-cyan-400">{supply}</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full" style={{ width: `${Math.min(100, (supply / (demand || 10)) * 100)}%` }} />
              </div>

              <div className="flex justify-between text-slate-300 pt-1">
                <span>Demand Target:</span>
                <span className="font-semibold text-indigo-400">{demand}</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
