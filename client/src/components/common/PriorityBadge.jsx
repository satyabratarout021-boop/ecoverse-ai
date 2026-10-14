import React from 'react';
import { AlertCircle, AlertTriangle, Info, Flame } from 'lucide-react';

export const PriorityBadge = ({ priority, className = '' }) => {
  const getConfig = () => {
    switch (priority?.toLowerCase()) {
      case 'emergency':
        return {
          label: 'Emergency',
          bg: 'bg-red-950/80 border-red-500/50 text-red-300 animate-pulse',
          icon: Flame,
        };
      case 'high':
        return {
          label: 'High',
          bg: 'bg-orange-950/70 border-orange-500/40 text-orange-300',
          icon: AlertCircle,
        };
      case 'medium':
        return {
          label: 'Medium',
          bg: 'bg-yellow-950/60 border-yellow-500/30 text-yellow-300',
          icon: AlertTriangle,
        };
      case 'low':
      default:
        return {
          label: 'Low',
          bg: 'bg-slate-800/80 border-slate-700 text-slate-300',
          icon: Info,
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${config.bg} ${className}`}
    >
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </span>
  );
};
