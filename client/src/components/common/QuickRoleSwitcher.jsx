import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, ChevronDown, Check, Sparkles } from 'lucide-react';

export const QuickRoleSwitcher = () => {
  const { user, demoLogin } = useAuth();
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const roles = [
    {
      role: 'citizen',
      label: 'Citizen User',
      subtitle: 'Aarav Mohanty (Reports issues & tracks)',
      color: 'text-emerald-400',
    },
    {
      role: 'local_admin',
      label: 'Local Admin',
      subtitle: 'Smt. Rashmi Patel (Reviews, assigns, verifies)',
      color: 'text-blue-400',
    },
    {
      role: 'department_staff',
      department: 'water',
      label: 'Staff — Water (JalRakshak)',
      subtitle: 'Vikram Sethi (Fixes pipelines & leaks)',
      color: 'text-cyan-400',
    },
    {
      role: 'department_staff',
      department: 'waste',
      label: 'Staff — Waste (EcoMind)',
      subtitle: 'Deepak Rout (Clears garbage & hotspots)',
      color: 'text-green-400',
    },
    {
      role: 'department_staff',
      department: 'electricity',
      label: 'Staff — Energy (EnergyGuard)',
      subtitle: 'Ananya Sen (Streetlights & Solar)',
      color: 'text-amber-400',
    },
    {
      role: 'super_admin',
      label: 'Super Admin',
      subtitle: 'Dr. Alok Verma (Platform settings & oversight)',
      color: 'text-purple-400',
    },
  ];

  const handleSwitch = async (r) => {
    setSwitching(true);
    try {
      await demoLogin(r.role, r.department);
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 hover:border-emerald-500/50 text-xs font-medium text-slate-200 transition-all shadow-sm"
        title="Switch user role to test end-to-end civic workflows"
      >
        <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span className="hidden sm:inline text-slate-400">Role:</span>
        <span className="font-semibold text-emerald-300">
          {user ? `${user.role.replace('_', ' ').toUpperCase()}${user.department ? ` (${user.department})` : ''}` : 'Select Role'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 rounded-xl glass-dropdown p-2 shadow-2xl z-50 border border-slate-700/80 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Quick Role Switcher (Judge & Testing Mode)
            </div>
            <div className="space-y-1 mt-1 max-h-80 overflow-y-auto">
              {roles.map((r, idx) => {
                const isActive =
                  user &&
                  user.role === r.role &&
                  (!r.department || user.department === r.department);

                return (
                  <button
                    key={idx}
                    disabled={switching}
                    onClick={() => handleSwitch(r)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-start justify-between text-xs transition-colors ${
                      isActive
                        ? 'bg-emerald-950/60 border border-emerald-500/30 text-white'
                        : 'hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className={`font-semibold flex items-center gap-1.5 ${r.color}`}>
                        <UserCheck className="w-3.5 h-3.5" />
                        {r.label}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{r.subtitle}</div>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-emerald-400 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
