'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export interface ReadinessGaugeProps {
  score?: number;
  label?: string;
  size?: number;
  readyNow?: number;
  ready6Months?: number;
  developing?: number;
}

export const ReadinessGauge: React.FC<ReadinessGaugeProps> = ({
  score = 78,
  label,
  size = 160,
  readyNow,
  ready6Months,
  developing,
}) => {
  if (readyNow !== undefined || ready6Months !== undefined || developing !== undefined) {
    const rNow = readyNow || 14;
    const r6Mo = ready6Months || 22;
    const dev = developing || 8;
    const data = [
      { name: 'Ready Now', value: rNow, color: '#10b981' },
      { name: 'Ready in 6 Months', value: r6Mo, color: '#06b6d4' },
      { name: 'Developing', value: dev, color: '#f59e0b' },
    ];
    const total = rNow + r6Mo + dev;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="w-48 h-48 relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
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
  }

  // Single score circular gauge view
  const strokeDash = (score / 100) * 283;

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="#1e293b" strokeWidth="8" fill="transparent" />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#06b6d4"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray="283"
            strokeDashoffset={283 - strokeDash}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-slate-100">{score}%</span>
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Readiness</span>
        </div>
      </div>
      {label && <p className="text-xs font-semibold text-cyan-400">{label}</p>}
    </div>
  );
};
