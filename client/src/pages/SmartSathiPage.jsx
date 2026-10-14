import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { EcoVerseWorld } from '../components/3d/EcoVerseWorld';
import {
  FileText,
  PlusCircle,
  Image,
  Mic,
  MapPin,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star,
  RefreshCw,
  Search,
  Filter,
  Camera,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const SmartSathiPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const highlightedId = searchParams.get('id');

  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('roads');
  const [department, setDepartment] = useState('roads');
  const [priority, setPriority] = useState('medium');
  const [area, setArea] = useState('City Quarter - High Tech Commercial');
  const [address, setAddress] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0.5, z: 0 });
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Feedback states
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Reopen states
  const [reopenReason, setReopenReason] = useState('');
  const [showReopenInput, setShowReopenInput] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryDeptMap = {
    roads: 'roads',
    drainage: 'roads',
    infrastructure: 'roads',
    waste: 'waste',
    water_leakage: 'water',
    water_shortage: 'water',
    streetlight: 'electricity',
    electricity_fault: 'electricity',
    other: 'general',
  };

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setCategory(cat);
    setDepartment(categoryDeptMap[cat] || 'general');
  };

  const loadComplaints = async () => {
    try {
      const res = await complaintAPI.getAll({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchQuery || undefined,
      });
      if (res.data.success) {
        setComplaints(res.data.complaints);

        // Highlight selected complaint if query param passed
        if (highlightedId) {
          const match = res.data.complaints.find((c) => c._id === highlightedId || c.complaintId === highlightedId);
          if (match) setSelectedComplaint(match);
        } else if (res.data.complaints.length > 0 && !selectedComplaint) {
          setSelectedComplaint(res.data.complaints[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, [statusFilter, searchQuery]);

  // Voice Speech-To-Text Handler using Web Speech API
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your description.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  // Image Upload Handler
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Complaint Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return;

    setSubmitting(true);
    try {
      const payload = {
        title,
        description,
        category,
        department,
        priority,
        location: {
          area,
          address: address || area,
          coordinates,
        },
        images: imagePreview ? [imagePreview] : [],
      };

      const res = await complaintAPI.create(payload);
      if (res.data.success) {
        // Reset form
        setTitle('');
        setDescription('');
        setImagePreview('');
        setShowForm(false);
        await loadComplaints();
        setSelectedComplaint(res.data.complaint);
      }
    } catch (err) {
      console.error('Error submitting complaint:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Citizen Rating / Feedback Handler
  const handleSubmitFeedback = async () => {
    if (!selectedComplaint) return;
    setSubmittingFeedback(true);
    try {
      const res = await complaintAPI.feedback(selectedComplaint._id, {
        rating: feedbackRating,
        comment: feedbackComment,
      });
      if (res.data.success) {
        setSelectedComplaint((prev) => ({
          ...prev,
          feedback: res.data.feedback,
        }));
        await loadComplaints();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  // Reopen Complaint Handler
  const handleReopen = async () => {
    if (!selectedComplaint || !reopenReason) return;
    try {
      const res = await complaintAPI.reopen(selectedComplaint._id, { reason: reopenReason });
      if (res.data.success) {
        setSelectedComplaint(res.data.complaint);
        setShowReopenInput(false);
        setReopenReason('');
        await loadComplaints();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-emerald-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              MODULE ONE
            </span>
            <span className="text-xs text-slate-400">Citizen Services Portal</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">SmartSathi — Citizen Complaint Center</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Report road hazards, water leaks, garbage accumulation, or electrical outages with photo proof and 3D geotags.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showForm ? 'Close Form' : 'Report New Issue'}</span>
        </button>
      </div>

      {/* New Complaint Filing Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-3xl glass-panel border border-emerald-500/40 space-y-4 animate-in slide-in-from-top-4 duration-200"
        >
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Submit Civic Complaint</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Complaint Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Deep Pothole near Village School"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Issue Category *</label>
              <select
                value={category}
                onChange={handleCategoryChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="roads">Potholes & Damaged Roads</option>
                <option value="waste">Garbage & Waste Accumulation</option>
                <option value="drainage">Drainage & Sewage Issues</option>
                <option value="water_leakage">Potable Water Leakage</option>
                <option value="water_shortage">Water Supply Shortage</option>
                <option value="streetlight">Broken Streetlights</option>
                <option value="electricity_fault">Electrical Faults & Transformers</option>
                <option value="infrastructure">Public Infrastructure Damage</option>
                <option value="other">Other Civic Problem</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Assigned Department</label>
              <input
                type="text"
                disabled
                value={department.toUpperCase()}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-emerald-400 font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="low">Low (Standard Routine)</option>
                <option value="medium">Medium (Within 48h)</option>
                <option value="high">High (Within 24h)</option>
                <option value="emergency">Emergency (Immediate Dispatch)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Locality / Sector</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="City Quarter - High Tech Commercial">City Quarter - High Tech Commercial</option>
                <option value="City Quarter - Residential Green Towers">City Quarter - Residential Green Towers</option>
                <option value="City Quarter - Hospital & Health Complex">City Quarter - Hospital & Health Complex</option>
                <option value="Village Sector - North Agri Farms">Village Sector - North Agri Farms</option>
                <option value="Village Sector - Central Community Hub">Village Sector - Central Community Hub</option>
                <option value="Village Sector - Heritage Pond & Well">Village Sector - Heritage Pond & Well</option>
                <option value="Water Facility - Reservoir & Filtration Plant">Water Facility - Reservoir & Filtration Plant</option>
                <option value="Renewable Zone - Solar Park & Wind Hub">Renewable Zone - Solar Park & Wind Hub</option>
                <option value="Sanitation Hub - Recycling & Sorting Facility">Sanitation Hub - Recycling & Sorting Facility</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">Detailed Description *</label>
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg border transition-all ${
                  isRecording
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                <Mic className="w-3 h-3 text-rose-400" />
                <span>{isRecording ? 'Listening... Speak now' : 'Voice Input (Speech-to-Text)'}</span>
              </button>
            </div>
            <textarea
              required
              rows={3}
              placeholder="Describe the issue, landmarks, severity, and any immediate danger..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Image upload */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Attach Photo Evidence</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
              />
              {imagePreview && (
                <div className="mt-2 relative w-32 h-20 rounded-lg overflow-hidden border border-slate-700">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* 3D Coordinate Picker */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">3D Map Pin Placement</label>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-cyan-400 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 flex-1">
                  [{coordinates.x}, {coordinates.y}, {coordinates.z}]
                </span>
                <button
                  type="button"
                  onClick={() => setIsPickingLocation(!isPickingLocation)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    isPickingLocation
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500 animate-pulse'
                      : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 inline mr-1" />
                  {isPickingLocation ? 'Click Map...' : 'Pick on 3D Map'}
                </button>
              </div>
            </div>
          </div>

          {/* Interactive 3D Picker View if active */}
          {isPickingLocation && (
            <div className="h-64 w-full rounded-2xl overflow-hidden border border-rose-500/50 relative">
              <EcoVerseWorld
                complaints={complaints}
                isPickingLocation={isPickingLocation}
                setIsPickingLocation={setIsPickingLocation}
                onLocationPicked={(coords) => setCoordinates(coords)}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Registering...' : 'Submit to SmartSathi'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Main Layout: Complaints List (Left) + Detailed Tracker & Resolution (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Complaints Directory (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search complaint ID, title, area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="verified">Verified</option>
            </select>
          </div>

          {/* List items */}
          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {complaints.length === 0 ? (
              <div className="p-8 text-center glass-panel rounded-2xl text-xs text-slate-400">
                No matching complaints found.
              </div>
            ) : (
              complaints.map((c) => {
                const isSelected = selectedComplaint?._id === c._id;
                return (
                  <div
                    key={c._id}
                    onClick={() => setSelectedComplaint(c)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                        : 'glass-card border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">{c.complaintId}</span>
                      <div className="flex items-center gap-1.5">
                        <StatusBadge status={c.status} />
                        <PriorityBadge priority={c.priority} />
                      </div>
                    </div>

                    <h4 className="text-xs font-semibold text-white line-clamp-1">{c.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{c.description}</p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-800">
                      <span className="capitalize text-slate-400 font-medium">{c.department} Dept</span>
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Complaint Detail & Lifecycle Timeline (7 cols) */}
        <div className="lg:col-span-7">
          {selectedComplaint ? (
            <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-bold text-cyan-400">
                      {selectedComplaint.complaintId}
                    </span>
                    <StatusBadge status={selectedComplaint.status} />
                    <PriorityBadge priority={selectedComplaint.priority} />
                  </div>
                  <h2 className="text-lg font-bold text-white leading-tight">
                    {selectedComplaint.title}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{selectedComplaint.location?.area}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400 block">Reported By</span>
                  <span className="text-xs font-bold text-slate-200">
                    {selectedComplaint.citizenName || 'Citizen User'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {new Date(selectedComplaint.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Description & Evidence */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-300">Incident Details</h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  {selectedComplaint.description}
                </p>

                {selectedComplaint.images && selectedComplaint.images.length > 0 && (
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1 font-medium">Citizen Photos:</span>
                    <div className="flex gap-2 overflow-x-auto py-1">
                      {selectedComplaint.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="Incident proof"
                          className="w-36 h-24 object-cover rounded-xl border border-slate-700"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Assigned Staff & Department Info */}
              <div className="grid grid-cols-2 gap-4 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Department</span>
                  <span className="font-bold text-emerald-400 capitalize">
                    {selectedComplaint.department} Department
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Assigned Staff</span>
                  <span className="font-bold text-cyan-400">
                    {selectedComplaint.assignedStaffName || 'Pending Assignment'}
                  </span>
                </div>
              </div>

              {/* Resolution Evidence (Before vs After Photos) */}
              {selectedComplaint.resolutionEvidence && selectedComplaint.resolutionEvidence.afterImage && (
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide block">
                    Staff Resolution Evidence (Before vs After)
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">Before:</span>
                      <img
                        src={selectedComplaint.resolutionEvidence.beforeImage || selectedComplaint.images?.[0]}
                        alt="Before"
                        className="w-full h-28 object-cover rounded-xl border border-slate-700"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">After Repair:</span>
                      <img
                        src={selectedComplaint.resolutionEvidence.afterImage}
                        alt="After"
                        className="w-full h-28 object-cover rounded-xl border border-emerald-500/40"
                      />
                    </div>
                  </div>
                  {selectedComplaint.resolutionEvidence.notes && (
                    <p className="text-xs text-slate-300 italic mt-1">
                      Work Notes: "{selectedComplaint.resolutionEvidence.notes}"
                    </p>
                  )}
                </div>
              )}

              {/* Lifecycle Progress Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-300">Status History Timeline</h4>
                <div className="space-y-3 pl-2 border-l-2 border-slate-800">
                  {selectedComplaint.statusHistory?.map((h, idx) => (
                    <div key={idx} className="relative pl-4">
                      <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-slate-950" />
                      <div className="flex items-center gap-2">
                        <StatusBadge status={h.status} />
                        <span className="text-[10px] text-slate-500">
                          {new Date(h.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{h.comment}</p>
                      <span className="text-[10px] text-slate-400">By: {h.updatedByName}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Citizen Feedback Rating Submission */}
              {selectedComplaint.status === 'verified' && !selectedComplaint.feedback?.rating && (
                <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-500/40 space-y-3">
                  <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wide">
                    Rate Civic Resolution Service
                  </h4>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        onClick={() => setFeedbackRating(star)}
                        className={`w-6 h-6 cursor-pointer transition-colors ${
                          star <= feedbackRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-amber-400 ml-2">{feedbackRating} / 5 Stars</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Leave optional comments about the repair quality..."
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={submittingFeedback}
                    className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-xs font-bold text-white shadow-md transition-all"
                  >
                    {submittingFeedback ? 'Submitting...' : 'Submit Satisfaction Rating'}
                  </button>
                </div>
              )}

              {/* Display existing feedback */}
              {selectedComplaint.feedback?.rating && (
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">
                    Citizen Feedback Rating
                  </span>
                  <div className="flex items-center gap-1 mt-1 text-amber-400">
                    {Array.from({ length: selectedComplaint.feedback.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                    <span className="text-xs font-bold text-white ml-1">
                      {selectedComplaint.feedback.rating} / 5 Stars
                    </span>
                  </div>
                  {selectedComplaint.feedback.comment && (
                    <p className="text-slate-300 mt-1 italic">"{selectedComplaint.feedback.comment}"</p>
                  )}
                </div>
              )}

              {/* Option to Reopen ticket if resolved/verified but citizen still dissatisfied */}
              {['resolved', 'verified'].includes(selectedComplaint.status) && (
                <div className="pt-2 border-t border-slate-800">
                  {showReopenInput ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="State reason why this issue persists..."
                        value={reopenReason}
                        onChange={(e) => setReopenReason(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleReopen}
                          className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white"
                        >
                          Confirm Reopen Case
                        </button>
                        <button
                          onClick={() => setShowReopenInput(false)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowReopenInput(true)}
                      className="text-xs text-orange-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Issue persisting? Click to reopen ticket</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center glass-panel rounded-3xl text-slate-400 text-xs">
              Select any complaint from the directory to inspect its live status, assigned staff, work notes, and resolution evidence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
