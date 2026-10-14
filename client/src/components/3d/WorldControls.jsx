import React from 'react';
import {
  RotateCcw,
  Sun,
  Moon,
  Building,
  Home,
  Droplets,
  Zap,
  Trash2,
  Construction,
  Layers,
  MapPin,
} from 'lucide-react';

export const WorldControls = ({
  cameraView,
  setCameraView,
  isNight,
  setIsNight,
  activeFilter,
  setActiveFilter,
  onResetCamera,
  isPickingLocation,
  setIsPickingLocation,
  complaintCount = 0,
}) => {
  const filters = [
    { id: 'all', label: 'All Issues', icon: Layers },
    { id: 'water', label: 'Water (JalRakshak)', icon: Droplets, color: 'text-cyan-400' },
    { id: 'waste', label: 'Waste (EcoMind)', icon: Trash2, color: 'text-emerald-400' },
    { id: 'electricity', label: 'Power (EnergyGuard)', icon: Zap, color: 'text-amber-400' },
    { id: 'roads', label: 'Roads & Infrastructure', icon: Construction, color: 'text-orange-400' },
  ];

  return (
    <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-20">
      {/* Left Pill: Department & Marker Filters */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl glass-panel pointer-events-auto shadow-xl border border-slate-700/70 overflow-x-auto max-w-full">
        {filters.map((f) => {
          const Icon = f.icon;
          const active = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                active
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${f.color || 'text-slate-400'}`} />
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Pill: Camera Presets & Environment Toggles */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel pointer-events-auto shadow-xl border border-slate-700/70">
        {/* Preset views */}
        <div className="flex items-center gap-1 pr-2 border-r border-slate-800">
          <button
            onClick={() => setCameraView('overview')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              cameraView === 'overview' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Overview View"
          >
            Overview
          </button>
          <button
            onClick={() => setCameraView('city')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              cameraView === 'city' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="City Quarter View"
          >
            <Building className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">City</span>
          </button>
          <button
            onClick={() => setCameraView('village')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              cameraView === 'village' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Village Quarter View"
          >
            <Home className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Village</span>
          </button>
        </div>

        {/* Location Picker Toggle */}
        {setIsPickingLocation && (
          <button
            onClick={() => setIsPickingLocation(!isPickingLocation)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isPickingLocation
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
            title="Click to place pin coordinates on 3D map"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>{isPickingLocation ? 'Click Map...' : 'Pick Pin'}</span>
          </button>
        )}

        {/* Day/Night Toggle */}
        <button
          onClick={() => setIsNight(!isNight)}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title={isNight ? 'Switch to Daytime' : 'Switch to Night Mode'}
        >
          {isNight ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Reset Camera */}
        <button
          onClick={onResetCamera}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Reset Camera Position"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
