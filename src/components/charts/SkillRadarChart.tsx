'use client';

import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export interface SkillRadarData {
  skill?: string;
  subject?: string;
  userLevel?: number;
  current?: number;
  requiredLevel?: number;
  required?: number;
}

export const SkillRadarChart: React.FC<{ data: SkillRadarData[]; title?: string }> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-xs text-slate-500 text-center py-8">No skill data available for radar visualization.</div>;
  }

  const chartData = data.map((d) => ({
    skill: d.skill || d.subject || '',
    userLevel: d.userLevel ?? d.current ?? 0,
    requiredLevel: d.requiredLevel ?? d.required ?? 0,
  }));

  return (
    <div className="w-full h-64 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="skill" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 5]} stroke="#475569" />
          <Radar name="Employee Proficiency" dataKey="userLevel" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
          <Radar name="Required Level" dataKey="requiredLevel" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
