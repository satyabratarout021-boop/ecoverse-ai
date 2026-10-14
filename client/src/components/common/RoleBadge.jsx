import React from 'react';
import { ShieldCheck, UserCheck, Wrench, User } from 'lucide-react';

export const RoleBadge = ({ role, department, className = '' }) => {
  const getBadgeConfig = () => {
    switch (role) {
      case 'super_admin':
        return {
          label: 'Super Admin',
          bg: 'bg-purple-950/80 border-purple-500/40 text-purple-300',
          icon: ShieldCheck,
        };
      case 'local_admin':
        return {
          label: 'Local Admin',
          bg: 'bg-blue-950/80 border-blue-500/40 text-blue-300',
          icon: UserCheck,
        };
      case 'department_staff':
        return {
          label: `${department ? department.toUpperCase() : 'Dept'} Staff`,
          bg: 'bg-amber-950/80 border-amber-500/40 text-amber-300',
          icon: Wrench,
        };
      case 'citizen':
      default:
        return {
          label: 'Citizen',
          bg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
          icon: User,
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
};
