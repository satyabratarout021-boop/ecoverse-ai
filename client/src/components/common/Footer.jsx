import React from 'react';
import { Leaf, ShieldCheck, Heart, Radio, Cpu } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/80 py-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="font-semibold text-slate-200">EcoVerse AI</span>
            <span className="text-slate-500">— Smart Village & Smart City Management Platform</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-time Socket Gateway Online</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>EcoAI Civic Intelligence Engine</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>RBAC Municipal Security</span>
            </span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-900 text-center text-[11px] text-slate-400">
          Built for Unified Smart City & Village Administration. All modules share the common complaint database and 3D geospatial telemetry.
        </div>
      </div>
    </footer>
  );
};
