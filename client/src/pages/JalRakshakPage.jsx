import React, { useState, useEffect } from 'react';
import { waterAPI } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import {
  Droplets,
  AlertTriangle,
  Activity,
  Gauge,
  CheckCircle2,
  TrendingDown,
  Info,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const JalRakshakPage = () => {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hourly consumption simulation trend data for Recharts
  const consumptionData = [
    { hour: '00:00', liters: 12000 },
    { hour: '04:00', liters: 8000 },
    { hour: '08:00', liters: 45000 },
    { hour: '12:00', liters: 32000 },
    { hour: '16:00', liters: 28000 },
    { hour: '20:00', liters: 42000 },
    { hour: '23:59', liters: 16000 },
  ];

  const loadWaterData = async () => {
    try {
      const res = await waterAPI.getTelemetry();
      if (res.data.success) {
        setFacilities(res.data.facilities);
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
    loadWaterData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-cyan-500/20 bg-gradient-to-r from-slate-950 via-cyan-950/30 to-slate-950">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              MODULE THREE
            </span>
            <span className="text-xs text-slate-400">Smart Water & Aquifer Grid</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">JalRakshak — Smart Water Management</h1>
          <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
            Real-time reservoir telemetry, ultrasonic water level tracking, automated pipeline leak detection, and water quality indices.
          </p>
        </div>

        <button
          onClick={() => navigate('/smartsathi?category=water_leakage')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all self-start sm:self-auto"
        >
          <Droplets className="w-4 h-4" />
          <span>Report Water Leak</span>
        </button>
      </div>

      {/* KPI Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Reservoir Level */}
        <div className="p-5 rounded-2xl glass-card border-cyan-500/20">
          <div className="flex items-center justify-between text-cyan-400 mb-2">
            <span className="text-xs font-medium">Reservoir Storage Level</span>
            <Droplets className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-white">78.4%</div>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
            <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '78.4%' }} />
          </div>
          <div className="text-[10px] text-slate-400 mt-2">9.8M of 12.5M Litres Available</div>
        </div>

        {/* Pipeline Pressure */}
        <div className="p-5 rounded-2xl glass-card border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Main Line Pressure</span>
            <Gauge className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">3.8 Bar</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold">Optimal Operating Range (3.5 - 4.2)</div>
          <div className="text-[10px] text-slate-400 mt-1">Pressure sensor: Station Alpha</div>
        </div>

        {/* Water Quality Index */}
        <div className="p-5 rounded-2xl glass-card border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Water Quality Index (WQI)</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">94 / 100</div>
          <div className="text-[11px] text-slate-300 mt-1">
            pH: 7.2 • Turbidity: 1.4 NTU • Cl: 0.8 ppm
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold mt-1">Safe Potable Grade</div>
        </div>

        {/* Active Leak Alerts */}
        <div className="p-5 rounded-2xl glass-card border-amber-500/20">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-medium">Active Leakage Tickets</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-amber-400">
            {stats?.activeLeaks ?? 1}
          </div>
          <div className="text-[11px] text-slate-300 mt-1">1 Major Distribution Leak</div>
          <div className="text-[10px] text-amber-400 font-semibold mt-1">Field repair underway</div>
        </div>
      </div>

      {/* Hourly Flow Chart & Conservation Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hourly Flow Chart (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-white">Municipal & Village Water Consumption Trend</h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time smart meter telemetry in litres/hr</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
              PEAK: 08:00 AM
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={consumptionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="waterFlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="liters"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#waterFlow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conservation & Aquifer Recharge (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-base text-white">JalRakshak Conservation Tips</h3>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="font-bold text-cyan-300 block mb-1">Village Rainwater Recharge</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Recharging the heritage village pond with monsoon runoff increases the water table by 1.8 meters annually.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="font-bold text-cyan-300 block mb-1">Drip Irrigation Advisory</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Smart soil moisture sensors reduce agricultural water wastage by 42% compared to flood canals.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="font-bold text-cyan-300 block mb-1">Rapid Valve Throttling</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Automated pressure reduction valves prevent burst pipes during low night-time consumption hours.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Water Complaints Connected Database Feed */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-white">Active Water Complaints & Leaks</h3>
            <p className="text-xs text-slate-400 mt-0.5">Canonical tickets from the shared EcoVerse complaint engine</p>
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

              {c.waterDetails?.estimatedLossLitresPerHr && (
                <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-300 font-semibold">
                  Water Loss: {c.waterDetails.estimatedLossLitresPerHr} L/hr
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
