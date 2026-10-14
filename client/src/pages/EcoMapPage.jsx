import React, { useEffect, useState } from 'react';
import { complaintAPI } from '../services/api';
import { EcoVerseWorld } from '../components/3d/EcoVerseWorld';
import { Compass, Filter, Info, ShieldAlert, Sparkles } from 'lucide-react';

export const EcoMapPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const res = await complaintAPI.getAll({ limit: 100 });
      if (res.data.success) {
        setComplaints(res.data.complaints);
      }
    } catch (err) {
      console.error('Error fetching 3D map complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden flex flex-col">
      {/* 3D Scene Canvas */}
      <div className="flex-1 w-full h-full relative">
        <EcoVerseWorld complaints={complaints} />
      </div>

      {/* Floating Bottom HUD Guide */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
        <div className="glass-panel px-4 py-2 rounded-2xl flex items-center gap-3 text-xs text-slate-300 shadow-xl border border-slate-700/80 pointer-events-auto">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>Interactive EcoMap 3D</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400">
            Rotate: Left Click + Drag • Pan: Right Click + Drag • Zoom: Scroll
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-cyan-400 font-mono font-bold">{complaints.length} Active Records</span>
        </div>
      </div>
    </div>
  );
};
