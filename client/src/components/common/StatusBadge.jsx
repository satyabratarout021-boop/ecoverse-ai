import React from 'react';
import { Clock, UserCheck, Play, CheckCircle2, ShieldCheck, RefreshCw, XCircle } from 'lucide-react';

export const StatusBadge = ({ status, className = '' }) => {
  const getConfig = () => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {
          label: 'Pending',
          bg: 'bg-amber-950/70 border-amber-500/30 text-amber-300',
          dot: 'bg-amber-400',
          icon: Clock,
        };
      case 'assigned':
        return {
          label: 'Assigned',
          bg: 'bg-sky-950/70 border-sky-500/30 text-sky-300',
          dot: 'bg-sky-400',
          icon: UserCheck,
        };
      case 'in_progress':
        return {
          label: 'In Progress',
          bg: 'bg-indigo-950/70 border-indigo-500/30 text-indigo-300',
          dot: 'bg-indigo-400 animate-pulse',
          icon: Play,
        };
      case 'resolved':
        return {
          label: 'Resolved',
          bg: 'bg-emerald-950/70 border-emerald-500/30 text-emerald-300',
          dot: 'bg-emerald-400',
          icon: CheckCircle2,
        };
      case 'verified':
        return {
          label: 'Verified & Closed',
          bg: 'bg-teal-950/70 border-teal-500/30 text-teal-300',
          dot: 'bg-teal-400',
          icon: ShieldCheck,
        };
      case 'reopened':
        return {
          label: 'Reopened',
          bg: 'bg-orange-950/70 border-orange-500/30 text-orange-300',
          dot: 'bg-orange-400',
          icon: RefreshCw,
        };
      case 'rejected':
        return {
          label: 'Rejected',
          bg: 'bg-rose-950/70 border-rose-500/30 text-rose-300',
          dot: 'bg-rose-400',
          icon: XCircle,
        };
      default:
        return {
          label: status || 'Unknown',
          bg: 'bg-slate-800 border-slate-700 text-slate-300',
          dot: 'bg-slate-400',
          icon: Clock,
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </span>
  );
};
