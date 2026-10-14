import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { analyticsAPI, complaintAPI } from '../services/api';
import { EcoVerseWorld } from '../components/3d/EcoVerseWorld';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import {
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  ShieldCheck,
  TrendingUp,
  Droplets,
  Trash2,
  Zap,
  Construction,
  Compass,
  ArrowUpRight,
  Activity,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [dashRes, compRes] = await Promise.all([
          analyticsAPI.getDashboard(),
          complaintAPI.getAll({ limit: 10 }),
        ]);

        if (dashRes.data.success) {
          setStats(dashRes.data.stats);
          setRecentActivities(dashRes.data.recentActivities);
        }

        if (compRes.data.success) {
          setComplaints(compRes.data.complaints);
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const deptChartData = stats
    ? [
        { name: 'Water', count: stats.departmentStats?.water || 0, fill: '#0ea5e9' },
        { name: 'Waste', count: stats.departmentStats?.waste || 0, fill: '#10b981' },
        { name: 'Energy', count: stats.departmentStats?.electricity || 0, fill: '#f59e0b' },
        { name: 'Roads', count: stats.departmentStats?.roads || 0, fill: '#f97316' },
        { name: 'General', count: stats.departmentStats?.general || 0, fill: '#8b5cf6' },
      ]
    : [];

  const statusColors = ['#f59e0b', '#38bdf8', '#818cf8', '#10b981', '#14b8a6'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Hero Welcome & Quick Highlights */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-emerald-500/20 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/40 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              UNIFIED COMMAND PLATFORM
            </span>
            <span className="text-xs text-slate-400">Smart City & Smart Village Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            EcoVerse AI Operations Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Real-time geospatial intelligence, automated civic complaint workflows, sensor telemetry, and AI-assisted governance for sustainable communities.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link
            to="/map-3d"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
          >
            <Compass className="w-4 h-4" />
            <span>Launch EcoMap 3D</span>
          </Link>
          <Link
            to="/smartsathi"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            <span>Report Civic Issue</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Complaints */}
        <div
          onClick={() => navigate('/smartsathi')}
          className="p-4 rounded-2xl glass-card border-slate-800 hover:border-slate-700 cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Reports</span>
            <Layers className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="text-2xl font-black text-white">{stats?.totalComplaints ?? '...'}</div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <span>Canonical records</span>
          </div>
        </div>

        {/* Pending */}
        <div
          onClick={() => navigate('/smartsathi?status=pending')}
          className="p-4 rounded-2xl glass-card border-amber-500/20 hover:border-amber-500/40 cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-medium">Pending Review</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-amber-300">{stats?.pendingComplaints ?? '...'}</div>
          <div className="text-[10px] text-amber-400/80 mt-1">Awaiting local admin</div>
        </div>

        {/* In Progress */}
        <div
          onClick={() => navigate('/smartsathi?status=in_progress')}
          className="p-4 rounded-2xl glass-card border-indigo-500/20 hover:border-indigo-500/40 cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between text-indigo-400 mb-2">
            <span className="text-xs font-medium">In Progress</span>
            <Play className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-indigo-300">{stats?.inProgressComplaints ?? '...'}</div>
          <div className="text-[10px] text-indigo-400/80 mt-1">Field staff on-site</div>
        </div>

        {/* Resolved */}
        <div
          onClick={() => navigate('/smartsathi?status=resolved')}
          className="p-4 rounded-2xl glass-card border-emerald-500/20 hover:border-emerald-500/40 cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-medium">Resolved</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-emerald-300">{stats?.resolvedComplaints ?? '...'}</div>
          <div className="text-[10px] text-emerald-400/80 mt-1">Evidence submitted</div>
        </div>

        {/* Verified / Closed */}
        <div
          onClick={() => navigate('/smartsathi?status=verified')}
          className="p-4 rounded-2xl glass-card border-teal-500/20 hover:border-teal-500/40 cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between text-teal-400 mb-2">
            <span className="text-xs font-medium">Verified & Closed</span>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-teal-300">{stats?.verifiedComplaints ?? '...'}</div>
          <div className="text-[10px] text-teal-400/80 mt-1">Admin signed-off</div>
        </div>

        {/* Avg Resolution Time */}
        <div className="p-4 rounded-2xl glass-card border-cyan-500/20">
          <div className="flex items-center justify-between text-cyan-400 mb-2">
            <span className="text-xs font-medium">Avg Resolution</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-cyan-300">
            {stats ? `${stats.avgResolutionHours}h` : '...'}
          </div>
          <div className="text-[10px] text-cyan-400/80 mt-1">Real SLA measurement</div>
        </div>
      </div>

      {/* 3D World Interactive Preview & Sustainability Dial */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive 3D World Section */}
        <div className="lg:col-span-2 rounded-3xl glass-panel p-5 border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Interactive EcoMap 3D (Simulated Village & City)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Rotate, zoom, and click markers to view real database complaints on the 3D grid.
              </p>
            </div>
            <Link
              to="/map-3d"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Fullscreen</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-800 relative">
            <EcoVerseWorld complaints={complaints} />
          </div>
        </div>

        {/* Sustainability Score & Department Performance */}
        <div className="rounded-3xl glass-panel p-6 border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                EcoVerse Sustainability Index
              </span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="flex items-center justify-center py-4">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#1e293b"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 * (1 - (stats?.sustainabilityScore || 85) / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-extrabold text-white">
                    {stats?.sustainabilityScore ?? 85}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-400 tracking-wide">
                    / 100 SCORE
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 text-center mt-2 leading-relaxed">
              Composite score calculated from water leak closure speed, clean solar ratio (68.4%), and rapid municipal waste segregation.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Clean Solar</span>
              <span className="font-bold text-amber-400">420 kW</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Water Storage</span>
              <span className="font-bold text-cyan-400">78.4%</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Hotspot Clear</span>
              <span className="font-bold text-emerald-400">92%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts & Recent Civic Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution Bar Chart */}
        <div className="p-6 rounded-3xl glass-panel border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-white">Department Complaint Breakdown</h3>
              <p className="text-xs text-slate-400 mt-0.5">Real distribution across municipal & village sectors</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {deptChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Status Lifecycle Pie Chart */}
        <div className="p-6 rounded-3xl glass-panel border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-white">Complaint Lifecycle Breakdown</h3>
              <p className="text-xs text-slate-400 mt-0.5">Active progress through municipal workflow</p>
            </div>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            {stats?.statusBreakdown && stats.statusBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statusBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {stats.statusBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">Loading chart data...</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Log & Recent Complaints Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Complaints (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-panel border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-white">Recent Civic Reports</h3>
              <p className="text-xs text-slate-400 mt-0.5">Live complaints across city and village sectors</p>
            </div>
            <Link to="/smartsathi" className="text-xs font-semibold text-emerald-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {complaints.length === 0 ? (
              <div className="text-xs text-slate-400 py-6 text-center">No reports yet.</div>
            ) : (
              complaints.slice(0, 5).map((c) => (
                <div
                  key={c._id}
                  onClick={() => navigate(`/smartsathi?id=${c._id}`)}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">{c.complaintId}</span>
                      <StatusBadge status={c.status} />
                      <PriorityBadge priority={c.priority} />
                    </div>
                    <h4 className="text-xs font-semibold text-white truncate">{c.title}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{c.location?.area}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-semibold capitalize block">
                      {c.department}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Audit Log / Recent Activities (1 col) */}
        <div className="p-6 rounded-3xl glass-panel border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-white">Audit & Operations Log</h3>
            <span className="text-[10px] text-emerald-400 font-mono">LIVE FEED</span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentActivities.length === 0 ? (
              <div className="text-xs text-slate-400 py-6 text-center">No recent activities.</div>
            ) : (
              recentActivities.map((act) => (
                <div key={act._id} className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-850 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-emerald-300 font-mono text-[10px]">
                      {act.action}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    By: <span className="font-medium text-white">{act.performedByName}</span> ({act.role})
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
