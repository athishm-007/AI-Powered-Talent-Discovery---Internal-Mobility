import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, hoverable = true, children, ...props }) => {
  return (
    <div
      className={cn(
        'glass-panel rounded-xl p-6 border border-slate-800/80 bg-slate-900/60 text-slate-100 shadow-xl',
        hoverable && 'glass-panel-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
