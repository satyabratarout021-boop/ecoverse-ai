import React, { useState, useEffect } from 'react';
import { complaintAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { RoleBadge } from '../components/common/RoleBadge';
import {
  Shield,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  XCircle,
  Eye,
  RefreshCw,
  Search,
  Filter,
  Check,
  X,
  FileCheck,
} from 'lucide-react';

export const AdminPortalPage = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState('unassigned'); // 'unassigned', 'verification', 'all', 'audit', 'users'
  const [staffList, setStaffList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assignment Modal
  const [assigningComplaint, setAssigningComplaint] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [assignmentInstructions, setAssignmentInstructions] = useState('');
  const [submittingAssign, setSubmittingAssign] = useState(false);

  // Verification Modal
  const [verifyingComplaint, setVerifyingComplaint] = useState(null);
  const [verificationNotes, setVerificationNotes] = useState('');

  // Rejection Modal
  const [rejectingComplaint, setRejectingComplaint] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const loadData = async () => {
    try {
      const [compRes, staffRes, auditRes] = await Promise.all([
        complaintAPI.getAll({ limit: 100 }),
        userAPI.getStaffByDepartment('all'),
        userAPI.getAuditLogs(),
      ]);

      if (compRes.data.success) setComplaints(compRes.data.complaints);
      if (staffRes.data.success) setStaffList(staffRes.data.staff);
      if (auditRes.data.success) setAuditLogs(resOrEmpty(auditRes.data.logs));

      if (user?.role === 'super_admin') {
        const usersRes = await userAPI.getAll();
        if (usersRes.data.success) setUsersList(usersRes.data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resOrEmpty = (val) => val || [];

  useEffect(() => {
    loadData();
  }, [user]);

  // Handle Assignment
  const handleConfirmAssignment = async () => {
    if (!assigningComplaint || !selectedStaffId) return;
    setSubmittingAssign(true);
    try {
      const res = await complaintAPI.assign(assigningComplaint._id, {
        staffId: selectedStaffId,
        instructions: assignmentInstructions,
      });
      if (res.data.success) {
        setAssigningComplaint(null);
        setSelectedStaffId('');
        setAssignmentInstructions('');
        await loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingAssign(false);
    }
  };

  // Handle Verification Decision ('verify' or 'reopen')
  const handleVerificationDecision = async (decision) => {
    if (!verifyingComplaint) return;
    try {
      const res = await complaintAPI.verify(verifyingComplaint._id, {
        decision,
        notes: verificationNotes,
      });
      if (res.data.success) {
        setVerifyingComplaint(null);
        setVerificationNotes('');
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Rejection
  const handleConfirmRejection = async () => {
    if (!rejectingComplaint || !rejectionReason) return;
    try {
      const res = await complaintAPI.reject(rejectingComplaint._id, { reason: rejectionReason });
      if (res.data.success) {
        setRejectingComplaint(null);
        setRejectionReason('');
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const unassignedList = complaints.filter((c) => c.status === 'pending');
  const awaitingVerificationList = complaints.filter((c) => c.status === 'resolved');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-blue-500/20 bg-gradient-to-r from-slate-950 via-blue-950/20 to-slate-950">
        <div>
          <div className="flex items-center gap-2">
            <RoleBadge role={user?.role} />
            <span className="text-xs text-slate-400">Command & Control</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Unified Admin Command Center</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Review incoming citizen reports, assign authorized staff, verify field evidence, and enforce service standards.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('unassigned')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'unassigned'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>New Unassigned Reports ({unassignedList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'verification'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Awaiting Verification ({awaitingVerificationList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>All Cases ({complaints.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'audit'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Audit Logs ({auditLogs.length})</span>
        </button>

        {user?.role === 'super_admin' && (
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>User Management ({usersList.length})</span>
          </button>
        )}
      </div>

      {/* Tab 1: Unassigned Reports */}
      {activeTab === 'unassigned' && (
        <div className="space-y-4">
          {unassignedList.length === 0 ? (
            <div className="p-12 text-center glass-panel rounded-3xl text-xs text-slate-400">
              Zero unassigned reports. All citizen complaints are currently allocated to field staff.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unassignedList.map((c) => (
                <div
                  key={c._id}
                  className="p-5 rounded-2xl glass-card border-amber-500/30 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">{c.complaintId}</span>
                    <PriorityBadge priority={c.priority} />
                  </div>

                  <h3 className="font-bold text-sm text-white">{c.title}</h3>
                  <p className="text-xs text-slate-300 line-clamp-2">{c.description}</p>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <span className="capitalize font-semibold text-emerald-400">{c.department} Dept</span>
                    <span>{c.location?.area}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        setAssigningComplaint(c);
                        // Filter staff by department if available
                        const matching = staffList.filter((s) => s.department === c.department);
                        if (matching.length > 0) setSelectedStaffId(matching[0]._id);
                        else if (staffList.length > 0) setSelectedStaffId(staffList[0]._id);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 transition-all"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Assign to Staff</span>
                    </button>

                    <button
                      onClick={() => setRejectingComplaint(c)}
                      className="py-2 px-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60 font-semibold text-xs"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Awaiting Verification */}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          {awaitingVerificationList.length === 0 ? (
            <div className="p-12 text-center glass-panel rounded-3xl text-xs text-slate-400">
              No tasks currently awaiting verification.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {awaitingVerificationList.map((c) => (
                <div
                  key={c._id}
                  className="p-5 rounded-2xl glass-card border-emerald-500/40 space-y-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">{c.complaintId}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      RESOLVED BY STAFF
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white">{c.title}</h3>

                  {/* Before vs After Evidence Photos */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">Before:</span>
                      <img
                        src={c.resolutionEvidence?.beforeImage || c.images?.[0]}
                        alt="Before"
                        className="w-full h-24 object-cover rounded-lg border border-slate-700"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">After Repair:</span>
                      <img
                        src={c.resolutionEvidence?.afterImage}
                        alt="After"
                        className="w-full h-24 object-cover rounded-lg border border-emerald-500/40"
                      />
                    </div>
                  </div>

                  {c.resolutionEvidence?.notes && (
                    <p className="text-xs text-slate-300 italic bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      Work Notes: "{c.resolutionEvidence.notes}"
                    </p>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setVerifyingComplaint(c)}
                      className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/20 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Review & Verify (Close Case)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: All Complaints Table */}
      {activeTab === 'all' && (
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3">ID</th>
                <th className="pb-3">Title</th>
                <th className="pb-3">Dept</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Priority</th>
                <th className="pb-3">Assigned Staff</th>
                <th className="pb-3">Area</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {complaints.map((c) => (
                <tr key={c._id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 font-mono font-bold text-cyan-400">{c.complaintId}</td>
                  <td className="py-3 font-semibold text-white max-w-[200px] truncate">{c.title}</td>
                  <td className="py-3 capitalize text-slate-300">{c.department}</td>
                  <td className="py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="py-3">
                    <PriorityBadge priority={c.priority} />
                  </td>
                  <td className="py-3 text-slate-300">{c.assignedStaffName || '—'}</td>
                  <td className="py-3 text-slate-400 max-w-[150px] truncate">{c.location?.area}</td>
                  <td className="py-3 text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-3">
          <h3 className="font-bold text-base text-white mb-2">Platform Audit Trail</h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log._id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-emerald-400">{log.action}</span>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    By: <span className="text-white">{log.performedByName}</span> ({log.role})
                  </div>
                </div>
                <span className="text-[10px] text-slate-500">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: User Management (Super Admin only) */}
      {activeTab === 'users' && user?.role === 'super_admin' && (
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 overflow-x-auto">
          <h3 className="font-bold text-base text-white mb-4">Authorized User Accounts</h3>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Department</th>
                <th className="pb-3">Assigned Area</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {usersList.map((u) => (
                <tr key={u._id} className="hover:bg-slate-900/40">
                  <td className="py-3 font-semibold text-white">{u.name}</td>
                  <td className="py-3 text-slate-300">{u.email}</td>
                  <td className="py-3">
                    <RoleBadge role={u.role} department={u.department} />
                  </td>
                  <td className="py-3 capitalize text-slate-400">{u.department || '—'}</td>
                  <td className="py-3 text-slate-400">{u.assignedArea}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign Modal */}
      {assigningComplaint && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl glass-panel border border-blue-500/40 p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-400" />
              <span>Assign Civic Complaint</span>
            </h3>
            <p className="text-xs text-slate-300">
              Case: <span className="font-mono text-cyan-400 font-bold">{assigningComplaint.complaintId}</span> — {assigningComplaint.title}
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Select Department Staff *
              </label>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              >
                {staffList.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.department ? s.department.toUpperCase() : 'General'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Admin Directive & Instructions
              </label>
              <textarea
                rows={2}
                placeholder="Specific instructions for the field technician..."
                value={assignmentInstructions}
                onChange={(e) => setAssignmentInstructions(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setAssigningComplaint(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssignment}
                disabled={submittingAssign || !selectedStaffId}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md"
              >
                {submittingAssign ? 'Assigning...' : 'Confirm Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {verifyingComplaint && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl glass-panel border border-teal-500/40 p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-teal-400" />
              <span>Verify Field Resolution Evidence</span>
            </h3>

            <p className="text-xs text-slate-300">
              Case: <span className="font-mono text-cyan-400 font-bold">{verifyingComplaint.complaintId}</span>
            </p>

            {/* Evidence photos */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Before:</span>
                <img
                  src={verifyingComplaint.resolutionEvidence?.beforeImage || verifyingComplaint.images?.[0]}
                  alt="Before"
                  className="w-full h-28 object-cover rounded-xl border border-slate-700"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">After Repair:</span>
                <img
                  src={verifyingComplaint.resolutionEvidence?.afterImage}
                  alt="After"
                  className="w-full h-28 object-cover rounded-xl border border-emerald-500/40"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Admin Verification Notes</label>
              <input
                type="text"
                placeholder="Optional sign-off comment or feedback..."
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setVerifyingComplaint(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerificationDecision('reopen')}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white shadow-md"
              >
                Return to Staff (Needs More Work)
              </button>
              <button
                onClick={() => handleVerificationDecision('verify')}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-xs font-bold text-white shadow-md"
              >
                Verify & Officially Close Case
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingComplaint && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl glass-panel border border-rose-500/40 p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-400" />
              <span>Reject Civic Complaint</span>
            </h3>
            <p className="text-xs text-slate-300">
              Provide mandatory official reason for rejection to notify the citizen.
            </p>

            <textarea
              required
              rows={3}
              placeholder="e.g. Private property outside municipal jurisdiction..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setRejectingComplaint(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejection}
                disabled={!rejectionReason.trim()}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
