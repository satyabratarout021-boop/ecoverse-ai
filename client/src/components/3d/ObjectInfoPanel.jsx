import React from 'react';
import { X, ExternalLink, MapPin, Tag, Activity, Clock } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { Link } from 'react-router-dom';

export const ObjectInfoPanel = ({ selectedObject, selectedComplaint, onClose }) => {
  if (!selectedObject && !selectedComplaint) return null;

  return (
    <div className="absolute bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] rounded-2xl glass-panel p-5 shadow-2xl z-30 border border-slate-700/80 animate-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            {selectedComplaint ? 'Civic Complaint Marker' : '3D Infrastructure Asset'}
          </span>
          <h3 className="font-bold text-base text-white leading-tight mt-0.5">
            {selectedComplaint ? selectedComplaint.title : selectedObject.name}
          </h3>
          {selectedComplaint && (
            <span className="font-mono text-xs text-cyan-400 font-semibold">
              {selectedComplaint.complaintId}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4 space-y-3 text-xs">
        {selectedComplaint ? (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={selectedComplaint.status} />
              <PriorityBadge priority={selectedComplaint.priority} />
              <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 capitalize font-medium">
                {selectedComplaint.department}
              </span>
            </div>

            <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
              {selectedComplaint.description}
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate">{selectedComplaint.location?.area || 'Village / City Sector'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{new Date(selectedComplaint.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {selectedComplaint.images && selectedComplaint.images.length > 0 && (
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block mb-1">Attached Incident Evidence:</span>
                <img
                  src={selectedComplaint.images[0]}
                  alt="Incident evidence"
                  className="w-full h-28 object-cover rounded-lg border border-slate-700"
                />
              </div>
            )}

            <div className="pt-2">
              <Link
                to={`/smartsathi?id=${selectedComplaint._id}`}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 text-xs transition-all"
              >
                <span>Open Full SmartSathi Ticket</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                {selectedObject.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                {selectedObject.department}
              </span>
            </div>

            <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
              {selectedObject.details}
            </p>

            <div className="flex items-center gap-2 text-xs">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Live Telemetry Status:</span>
              <span className="font-semibold text-emerald-300">{selectedObject.status}</span>
            </div>

            {selectedObject.coordinates && (
              <div className="font-mono text-[11px] text-slate-500">
                3D Coordinates: [{selectedObject.coordinates.x.toFixed(1)}, {selectedObject.coordinates.y.toFixed(1)}, {selectedObject.coordinates.z.toFixed(1)}]
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
