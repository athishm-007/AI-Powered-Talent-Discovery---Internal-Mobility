'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export const ReadinessGauge: React.FC<{ readyNow: number; ready6Months: number; developing: number }> = ({
  readyNow,
  ready6Months,
  developing,
}) => {
  const data = [
    { name: 'Ready Now', value: readyNow, color: '#10b981' },
    { name: 'Ready in 6 Months', value: ready6Months, color: '#06b6d4' },
    { name: 'Developing', value: developing, color: '#f59e0b' },
  ];

  const total = readyNow + ready6Months + developing;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="w-48 h-48 relative shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold text-white">{total}</span>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Talent Pool</span>
        </div>
      </div>

      <div className="space-y-3 flex-1 w-full text-xs">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-medium text-slate-200">{item.name}</span>
            </div>
            <span className="font-bold text-slate-100">{item.value} candidates</span>
          </div>
        ))}
      </div>
    </div>
  );
};
