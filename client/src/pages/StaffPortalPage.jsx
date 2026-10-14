import React, { useState, useEffect } from 'react';
import { complaintAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { RoleBadge } from '../components/common/RoleBadge';
import {
  Wrench,
  Clock,
  Play,
  CheckCircle2,
  Camera,
  Upload,
  Send,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const StaffPortalPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Update Progress Modal
  const [activeTask, setActiveTask] = useState(null);
  const [newStatus, setNewStatus] = useState('in_progress');
  const [workNote, setWorkNote] = useState('');
  const [evidenceImage, setEvidenceImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadTasks = async () => {
    try {
      // Fetch complaints assigned to this staff or within their department
      const res = await complaintAPI.getAll({
        department: user?.department || undefined,
        limit: 50,
      });
      if (res.data.success) {
        setTasks(res.data.complaints);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [user]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidenceImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateTask = async () => {
    if (!activeTask) return;
    setSubmitting(true);
    try {
      const res = await complaintAPI.updateStatus(activeTask._id, {
        status: newStatus,
        note: workNote,
        afterImage: evidenceImage,
      });

      if (res.data.success) {
        setActiveTask(null);
        setWorkNote('');
        setEvidenceImage('');
        await loadTasks();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-amber-500/20 bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950">
        <div>
          <div className="flex items-center gap-2">
            <RoleBadge role={user?.role} department={user?.department} />
            <span className="text-xs text-slate-400">Field Operations Workspace</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Department Staff Task Portal</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Active field tickets allocated to your department. Update work progress, log on-site notes, and upload resolution proof for admin verification.
          </p>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <Wrench className="w-4 h-4 text-amber-400" />
          <span>Assigned Department Queue ({tasks.length} Tickets)</span>
        </h3>

        {tasks.length === 0 ? (
          <div className="p-12 text-center glass-panel rounded-3xl text-xs text-slate-400">
            No active tasks currently assigned to your queue.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="p-5 rounded-2xl glass-card border-slate-800 hover:border-slate-700 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">{task.complaintId}</span>
                    <StatusBadge status={task.status} />
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-1">{task.title}</h4>
                  <p className="text-[11px] text-slate-300 line-clamp-2">{task.description}</p>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="truncate">{task.location?.area}</span>
                  </div>

                  {task.images && task.images.length > 0 && (
                    <img
                      src={task.images[0]}
                      alt="Incident"
                      className="w-full h-28 object-cover rounded-xl border border-slate-700"
                    />
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setActiveTask(task);
                      setNewStatus(task.status === 'assigned' ? 'in_progress' : 'resolved');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Update Progress & Evidence</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Update Modal */}
      {activeTask && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl glass-panel border border-amber-500/40 p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-400" />
              <span>Update Field Task Status</span>
            </h3>

            <p className="text-xs text-slate-300">
              Task: <span className="font-mono text-cyan-400 font-bold">{activeTask.complaintId}</span> — {activeTask.title}
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Target Status *</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              >
                <option value="in_progress">In Progress (Field Work Commenced)</option>
                <option value="resolved">Resolved (Work Completed, Ready for Verification)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Technician Work Notes *</label>
              <textarea
                required
                rows={3}
                placeholder="Describe actions taken on site, parts replaced, or tests executed..."
                value={workNote}
                onChange={(e) => setWorkNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Attach Resolution Evidence Photo (After Repair)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-slate-800 file:text-slate-200"
              />
              {evidenceImage && (
                <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-emerald-500/50">
                  <img src={evidenceImage} alt="Resolution" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setActiveTask(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTask}
                disabled={submitting || !workNote.trim()}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white shadow-md"
              >
                {submitting ? 'Saving...' : 'Save & Submit Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
