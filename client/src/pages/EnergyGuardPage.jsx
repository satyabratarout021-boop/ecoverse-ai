import React, { useState, useEffect } from 'react';
import { energyAPI } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import {
  Zap,
  Sun,
  BatteryCharging,
  Lightbulb,
  AlertTriangle,
  Activity,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EnergyGuardPage = () => {
  const navigate = useNavigate();
  const [energyAssets, setEnergyAssets] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadEnergyData = async () => {
    try {
      const res = await energyAPI.getTelemetry();
      if (res.data.success) {
        setEnergyAssets(res.data.energyAssets);
        setRecentComplaints(res.data.recentComplaints);
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnergyData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-amber-500/20 bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              MODULE FOUR
            </span>
            <span className="text-xs text-slate-400">Smart Energy & Clean Microgrid</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">EnergyGuard — Smart Clean Power Grid</h1>
          <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
            Live solar array telemetry, smart streetlight mesh monitoring, battery storage management, and rapid power outage resolution.
          </p>
        </div>

        <button
          onClick={() => navigate('/smartsathi?category=streetlight')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white text-xs font-bold shadow-lg shadow-amber-500/20 transition-all self-start sm:self-auto"
        >
          <Zap className="w-4 h-4" />
          <span>Report Streetlight Fault</span>
        </button>
      </div>

      {/* KPI Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Solar Generation */}
        <div className="p-5 rounded-2xl glass-card border-amber-500/20">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-medium">Solar Array Generation</span>
            <Sun className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-white">420.8 kW</div>
          <div className="text-[11px] text-amber-400 font-semibold mt-1">Peak Clean Energy Output</div>
          <div className="text-[10px] text-slate-400 mt-1">Solar Park Alpha + Rooftops</div>
        </div>

        {/* Battery Bank */}
        <div className="p-5 rounded-2xl glass-card border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Battery Energy Storage (BESS)</span>
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">86.4%</div>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '86.4%' }} />
          </div>
          <div className="text-[10px] text-slate-400 mt-2">1.2 MWh LiFePO4 Reserve</div>
        </div>

        {/* Renewable Energy Mix */}
        <div className="p-5 rounded-2xl glass-card border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Clean Energy Ratio</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">68.4%</div>
          <div className="text-[11px] text-slate-300 mt-1">Target: 75% by 2027</div>
          <div className="text-[10px] text-slate-400 mt-1">Grid frequency: 50.02 Hz (Stable)</div>
        </div>

        {/* Smart Streetlights */}
        <div className="p-5 rounded-2xl glass-card border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Smart Streetlight Grid</span>
            <Lightbulb className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-3xl font-black text-white">238 / 240</div>
          <div className="text-[11px] text-slate-300 mt-1">96.5% Operational Status</div>
          <div className="text-[10px] text-amber-400 font-semibold mt-1">2 faulty lamps tagged in 3D</div>
        </div>
      </div>

      {/* Streetlight Grid Status & Clean Energy Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Streetlight Grid Matrix (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-white">LoRaWAN Smart Streetlight Mesh</h3>
              <p className="text-xs text-slate-400 mt-0.5">Automated lux sensing & dimming schedule across city & village</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              AUTO-DIM: ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-slate-400 block text-[10px]">City Commercial</span>
              <span className="font-bold text-white block mt-1">84 Lamps</span>
              <span className="text-[10px] text-emerald-400 font-semibold">100% Active</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-slate-400 block text-[10px]">Residential Sector</span>
              <span className="font-bold text-white block mt-1">62 Lamps</span>
              <span className="text-[10px] text-amber-400 font-semibold">1 Maintenance</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-slate-400 block text-[10px]">Village Agri Link</span>
              <span className="font-bold text-white block mt-1">54 Lamps</span>
              <span className="text-[10px] text-amber-400 font-semibold">1 Maintenance</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-slate-400 block text-[10px]">Solar Farm Loop</span>
              <span className="font-bold text-white block mt-1">40 Lamps</span>
              <span className="text-[10px] text-emerald-400 font-semibold">100% Active</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
            Smart streetlights dim to 30% intensity between 01:00 AM and 04:30 AM when motion sensors detect zero vehicular or pedestrian activity, saving over 14,000 kWh every month.
          </p>
        </div>

        {/* Clean Energy & Peak Shaving (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-base text-white">Clean Energy Best Practices</h3>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="font-bold text-amber-300 block mb-1">Peak Load Shaving</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Village water pumps and high-draw processing equipment are scheduled during peak solar hours (11:00 - 14:00) to maximize zero-carbon utilization.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="font-bold text-amber-300 block mb-1">Automated Inverter MPPT Alerts</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Thermal sensors on inverter strings flag dust build-up or overheating before catastrophic failure occurs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Electricity Complaints Feed */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-white">Electricity & Streetlight Civic Reports</h3>
            <p className="text-xs text-slate-400 mt-0.5">Shared records from the canonical EcoVerse database</p>
          </div>
          <span className="font-mono text-xs text-cyan-400 font-semibold">
            {recentComplaints.length} Records
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentComplaints.map((c) => (
            <div
              key={c._id}
              onClick={() => navigate(`/smartsathi?id=${c._id}`)}
              className="p-4 rounded-2xl glass-card border-slate-800 hover:border-slate-700 cursor-pointer transition-all space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-cyan-400">{c.complaintId}</span>
                <StatusBadge status={c.status} />
              </div>

              <h4 className="text-xs font-bold text-white line-clamp-1">{c.title}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">{c.description}</p>

              {c.energyDetails?.poleNumber && (
                <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-300 font-semibold">
                  Lamp Post Pole: #{c.energyDetails.poleNumber}
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                <span className="truncate">{c.location?.area}</span>
                <span>{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
