import React, { useState, useEffect } from 'react';
import { wasteAPI, complaintAPI } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import {
  Trash2,
  Sparkles,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Recycle,
  TrendingUp,
  MapPin,
  Truck,
  ArrowRight,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EcoMindPage = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [classificationResult, setClassificationResult] = useState(null);
  const [providerInfo, setProviderInfo] = useState('');
  const [hotspots, setHotspots] = useState([]);
  const [wasteComplaints, setWasteComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load telemetry & complaints
  const loadWasteData = async () => {
    try {
      const [hotRes, compRes] = await Promise.all([
        wasteAPI.getHotspots(),
        complaintAPI.getAll({ department: 'waste' }),
      ]);

      if (hotRes.data.success) {
        setHotspots(hotRes.data.hotspots);
      }

      if (compRes.data.success) {
        setWasteComplaints(compRes.data.complaints);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWasteData();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        classifyImage(reader.result, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const classifyImage = async (base64, mimeType) => {
    setAnalyzing(true);
    setClassificationResult(null);
    try {
      const res = await wasteAPI.classify(base64, mimeType);
      if (res.data.success) {
        setClassificationResult(res.data.result);
        setProviderInfo(res.data.provider);
      }
    } catch (err) {
      console.error('Classification error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-emerald-500/20 bg-gradient-to-r from-slate-950 via-emerald-950/30 to-slate-950">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              MODULE TWO
            </span>
            <span className="text-xs text-slate-400">Smart Waste & Circular Economy</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">EcoMind — Smart Sanitation Hub</h1>
          <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
            Computer vision waste classification, ultrasonic bin hotspot monitoring, route optimization for collection vehicles, and civic sanitation tracking.
          </p>
        </div>

        <button
          onClick={() => navigate('/smartsathi?category=waste')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <Trash2 className="w-4 h-4" />
          <span>Report Garbage Hotspot</span>
        </button>
      </div>

      {/* AI Image Classification Tool Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload & Classifier Card (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl glass-panel border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-base text-white">AI Waste Material Classifier</h3>
            </div>
            {providerInfo && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                {providerInfo}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Upload or capture a photo of discarded waste. Our integrated vision model analyzes material composition, recyclability score, and tells you exactly which bin color to use.
          </p>

          {/* Upload Dropzone */}
          <div className="relative border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-6 text-center transition-colors bg-slate-900/40">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-white">
                Drag & Drop or Click to Upload Waste Photo
              </span>
              <span className="text-[11px] text-slate-400">JPG, PNG, WEBP supported</span>
            </div>
          </div>

          {/* Analyzing Progress */}
          {analyzing && (
            <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center gap-3 animate-pulse">
              <Cpu className="w-5 h-5 text-emerald-400 animate-spin" />
              <span className="text-xs text-emerald-300 font-semibold">
                Analyzing image features, material texture, and density...
              </span>
            </div>
          )}

          {/* Classification Results Card */}
          {classificationResult && (
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/50 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Detection Result
                  </span>
                  <h4 className="text-xl font-extrabold text-white capitalize mt-0.5">
                    {classificationResult.classification} Waste
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-cyan-400">
                      Confidence: {(classificationResult.confidence * 100).toFixed(1)}%
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-emerald-400 font-semibold">
                      {classificationResult.recyclable ? '100% Recyclable' : 'Non-Recyclable'}
                    </span>
                  </div>
                </div>

                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Uploaded waste"
                    className="w-20 h-20 object-cover rounded-xl border border-slate-700 shrink-0"
                  />
                )}
              </div>

              {/* Designated Bin Recommendation */}
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3">
                <Recycle className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px]">Designated Civic Disposal Bin:</span>
                  <span className="font-bold text-emerald-300">
                    {classificationResult.disposalBin}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                {classificationResult.advice}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Est. Weight</span>
                  <span className="font-bold text-white">{classificationResult.estimatedWeightKg} kg</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Avoided Carbon Emission</span>
                  <span className="font-bold text-emerald-400">-{classificationResult.carbonImpactKg} kg CO₂</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ultrasonic Bin Hotspots & Collection Fleet (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Smart Bin Fill Hotspots</h3>
              <span className="text-[10px] font-mono text-cyan-400">TELEMETRY</span>
            </div>

            <div className="space-y-3">
              {hotspots.map((h) => {
                const fill = h.metrics?.fillLevelPercent ?? 50;
                const isCritical = fill >= 80;
                return (
                  <div
                    key={h._id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isCritical
                        ? 'bg-rose-950/20 border-rose-500/40'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-semibold text-xs text-white">{h.locationName}</span>
                      <span
                        className={`text-xs font-black ${
                          isCritical ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {fill}% FULL
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCritical ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${fill}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Type: {h.metrics?.binType || 'Municipal Bin'}</span>
                      <span className="capitalize">{h.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Collection Truck Fleet Status */}
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Active Sanitation Collection Fleet</span>
              </span>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">EV Compactor Truck #EV-04</span>
                  <span className="text-[10px] text-slate-400">Route: Central Village Market Loop</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                  ON ROUTE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Waste Complaints Feed with Before/After Evidence */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-white">Waste & Sanitation Civic Reports</h3>
            <p className="text-xs text-slate-400 mt-0.5">Connected to the shared EcoVerse complaint database</p>
          </div>
          <span className="font-mono text-xs text-cyan-400 font-semibold">
            {wasteComplaints.length} Records
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wasteComplaints.map((c) => (
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

              {c.images && c.images.length > 0 && (
                <img
                  src={c.images[0]}
                  alt="Waste proof"
                  className="w-full h-28 object-cover rounded-xl border border-slate-700"
                />
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
