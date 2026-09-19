import React from 'react';
import { Badge } from '../ui/Badge';
import { GapSeverity } from '@/models/gap';

export const GapSeverityBadge: React.FC<{ severity: GapSeverity }> = ({ severity }) => {
  const variant = severity === 'CRITICAL' ? 'rose' : severity === 'MODERATE' ? 'amber' : 'emerald';
  return <Badge variant={variant}>{severity}</Badge>;
};
