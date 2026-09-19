import React from 'react';
import { Badge } from '../ui/Badge';
import { GapSeverity } from '@/models/gap';

export type ExtendedGapSeverity = GapSeverity | 'high' | 'medium' | 'low' | string;

export const GapSeverityBadge: React.FC<{ severity: ExtendedGapSeverity }> = ({ severity }) => {
  const norm = severity.toUpperCase();
  const variant = (norm === 'CRITICAL' || norm === 'HIGH') ? 'rose' : (norm === 'MODERATE' || norm === 'MEDIUM') ? 'amber' : 'emerald';
  return <Badge variant={variant}>{severity}</Badge>;
};
