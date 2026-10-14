import { Complaint } from '../models/Complaint.js';
import { User } from '../models/User.js';
import { AuditLog } from '../models/AuditLog.js';
import { sendNotification } from '../services/notificationService.js';

export const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      department,
      priority,
      location,
      images,
      voiceTranscript,
      wasteDetails,
      waterDetails,
      energyDetails,
    } = req.body;

    if (!title || !description || !category || !department) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, category, and department are required.',
      });
    }

    const citizenId = req.user ? req.user._id : null;
    const citizenName = req.user ? req.user.name : 'Citizen User';

    // Set default coordinates if not provided
    const defaultCoords = { x: (Math.random() - 0.5) * 16, y: 0.5, z: (Math.random() - 0.5) * 16 };
    const finalLocation = {
      address: location?.address || 'EcoVerse Central Village & City Sector',
      landmark: location?.landmark || '',
      area: location?.area || 'City Quarter - High Tech Commercial',
      coordinates: {
        x: location?.coordinates?.x ?? defaultCoords.x,
        y: location?.coordinates?.y ?? defaultCoords.y,
        z: location?.coordinates?.z ?? defaultCoords.z,
      },
      lat: location?.lat || 20.2961,
      lng: location?.lng || 85.8245,
    };

    const newComplaint = new Complaint({
      title,
      description,
      category,
      department,
      priority: priority || 'medium',
      status: 'pending',
      citizen: citizenId,
      citizenName,
      location: finalLocation,
      images: Array.isArray(images) ? images : images ? [images] : [],
      voiceTranscript: voiceTranscript || '',
      wasteDetails: wasteDetails || {},
      waterDetails: waterDetails || {},
      energyDetails: energyDetails || {},
      statusHistory: [
        {
          status: 'pending',
          updatedBy: citizenId,
          updatedByName: citizenName,
          comment: 'Complaint registered by citizen in EcoVerse portal.',
          timestamp: new Date(),
        },
      ],
    });

    await newComplaint.save();

    // Log audit
    await AuditLog.create({
      action: 'COMPLAINT_CREATED',
      performedBy: citizenId,
      performedByName: citizenName,
      role: req.user?.role || 'citizen',
      targetType: 'Complaint',
      targetId: newComplaint._id.toString(),
      details: {
        complaintId: newComplaint.complaintId,
        category,
        department,
        priority: newComplaint.priority,
      },
    });

    // Notify Local Admins and Super Admins
    await sendNotification({
      recipientRole: 'local_admin',
      title: `New Civic Report: ${newComplaint.complaintId}`,
      message: `${citizenName} reported "${title}" in ${finalLocation.area} (${department} department).`,
      type: 'complaint_new',
      complaintId: newComplaint._id,
      complaintCode: newComplaint.complaintId,
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully.',
      complaint: newComplaint,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getComplaints = async (req, res) => {
  try {
    const {
      status,
      department,
      category,
      priority,
      search,
      area,
      myOnly,
      limit = 100,
      page = 1,
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (department) query.department = department;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (area) query['location.area'] = area;

    // Role-specific filtering
    if (req.user) {
      if (myOnly === 'true' || req.user.role === 'citizen' && myOnly !== 'false') {
        query.citizen = req.user._id;
      } else if (req.user.role === 'department_staff' && myOnly === 'true') {
        query.assignedStaff = req.user._id;
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('citizen', 'name email phone avatar')
      .populate('assignedStaff', 'name email phone department')
      .populate('assignedAdmin', 'name email');

    res.json({
      success: true,
      total,
      count: complaints.length,
      page: Number(page),
      complaints,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    let complaint;

    if (id.startsWith('ECO-')) {
      complaint = await Complaint.findOne({ complaintId: id });
    } else {
      complaint = await Complaint.findById(id);
    }

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    await complaint.populate('citizen', 'name email phone avatar');
    await complaint.populate('assignedStaff', 'name email phone department');
    await complaint.populate('assignedAdmin', 'name email');

    res.json({
      success: true,
      complaint,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const assignComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { staffId, department, priority, instructions } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    let staff = null;
    if (staffId) {
      staff = await User.findById(staffId);
      if (!staff) {
        return res.status(400).json({ success: false, message: 'Specified staff member does not exist.' });
      }
      complaint.assignedStaff = staff._id;
      complaint.assignedStaffName = staff.name;
    }

    if (department) complaint.department = department;
    if (priority) complaint.priority = priority;

    complaint.assignedAdmin = req.user._id;
    complaint.status = 'assigned';

    const commentText = instructions
      ? `Assigned to ${staff ? staff.name : 'department team'}. Notes: ${instructions}`
      : `Assigned to ${staff ? staff.name : 'department team'}.`;

    complaint.statusHistory.push({
      status: 'assigned',
      updatedBy: req.user._id,
      updatedByName: req.user.name,
      comment: commentText,
      timestamp: new Date(),
    });

    if (instructions) {
      complaint.workNotes.push({
        staff: req.user._id,
        staffName: `${req.user.name} (Admin)`,
        note: `Assignment Directive: ${instructions}`,
        timestamp: new Date(),
      });
    }

    await complaint.save();

    await AuditLog.create({
      action: 'COMPLAINT_ASSIGNED',
      performedBy: req.user._id,
      performedByName: req.user.name,
      role: req.user.role,
      targetType: 'Complaint',
      targetId: complaint._id.toString(),
      details: {
        complaintId: complaint.complaintId,
        assignedTo: staff ? staff.name : 'None',
        department: complaint.department,
      },
    });

    // Notify assigned staff
    if (staff) {
      await sendNotification({
        recipient: staff._id,
        title: `Task Assigned: ${complaint.complaintId}`,
        message: `Admin ${req.user.name} assigned you: "${complaint.title}" at ${complaint.location.area}.`,
        type: 'complaint_assigned',
        complaintId: complaint._id,
        complaintCode: complaint.complaintId,
      });
    }

    // Notify Citizen
    await sendNotification({
      recipient: complaint.citizen,
      title: `Complaint Assigned: ${complaint.complaintId}`,
      message: `Your complaint has been assigned to ${complaint.department.toUpperCase()} department officer ${staff ? staff.name : ''}.`,
      type: 'complaint_assigned',
      complaintId: complaint._id,
      complaintCode: complaint.complaintId,
    });

    res.json({
      success: true,
      message: 'Complaint assigned successfully.',
      complaint,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, evidenceImage, beforeImage, afterImage } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    if (status) complaint.status = status;

    if (status === 'resolved') {
      complaint.resolvedAt = new Date();
    }

    if (beforeImage || afterImage || evidenceImage || note) {
      if (beforeImage) complaint.resolutionEvidence.beforeImage = beforeImage;
      if (afterImage) complaint.resolutionEvidence.afterImage = afterImage;
      if (evidenceImage && !afterImage) complaint.resolutionEvidence.afterImage = evidenceImage;
      if (note) complaint.resolutionEvidence.notes = note;
      complaint.resolutionEvidence.submittedAt = new Date();
    }

    if (note) {
      complaint.workNotes.push({
        staff: req.user._id,
        staffName: req.user.name,
        note,
        timestamp: new Date(),
      });
    }

    complaint.statusHistory.push({
      status: status || complaint.status,
      updatedBy: req.user._id,
      updatedByName: req.user.name,
      comment: note || `Status updated to ${status}.`,
      evidenceImage: afterImage || evidenceImage || '',
      timestamp: new Date(),
    });

    await complaint.save();

    await AuditLog.create({
      action: 'STATUS_UPDATE',
      performedBy: req.user._id,
      performedByName: req.user.name,
      role: req.user.role,
      targetType: 'Complaint',
      targetId: complaint._id.toString(),
      details: {
        complaintId: complaint.complaintId,
        status,
        note,
      },
    });

    // Notify Citizen
    await sendNotification({
      recipient: complaint.citizen,
      title: `Status Update: ${complaint.complaintId}`,
      message: `Your report "${complaint.title}" is now "${(status || complaint.status).toUpperCase()}". Note: ${note || 'Field work progress recorded.'}`,
      type: 'status_updated',
      complaintId: complaint._id,
      complaintCode: complaint.complaintId,
    });

    // If marked resolved by staff, notify Local Admin to verify
    if (status === 'resolved') {
      await sendNotification({
        recipientRole: 'local_admin',
        title: `Verification Needed: ${complaint.complaintId}`,
        message: `Field staff ${req.user.name} marked "${complaint.title}" as RESOLVED with evidence. Awaiting verification.`,
        type: 'evidence_submitted',
        complaintId: complaint._id,
        complaintCode: complaint.complaintId,
      });
    }

    res.json({
      success: true,
      message: 'Status updated successfully.',
      complaint,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, notes } = req.body; // decision: 'verify' or 'reopen'

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    if (decision === 'verify') {
      complaint.status = 'verified';
      complaint.verifiedAt = new Date();
      complaint.statusHistory.push({
        status: 'verified',
        updatedBy: req.user._id,
        updatedByName: `${req.user.name} (Admin)`,
        comment: notes || 'Admin verified the field resolution evidence. Case closed.',
        timestamp: new Date(),
      });

      // Notify citizen
      await sendNotification({
        recipient: complaint.citizen,
        title: `Case Verified & Closed: ${complaint.complaintId}`,
        message: `Your issue "${complaint.title}" has been verified and resolved! Please rate our service.`,
        type: 'complaint_verified',
        complaintId: complaint._id,
        complaintCode: complaint.complaintId,
      });
    } else {
      complaint.status = 'reopened';
      complaint.reopenReason = notes || 'Admin requested further verification or corrective work.';
      complaint.statusHistory.push({
        status: 'reopened',
        updatedBy: req.user._id,
        updatedByName: `${req.user.name} (Admin)`,
        comment: `Returned for additional work: ${notes || 'Resolution evidence incomplete.'}`,
        timestamp: new Date(),
      });

      // Notify staff
      if (complaint.assignedStaff) {
        await sendNotification({
          recipient: complaint.assignedStaff,
          title: `Task Reopened: ${complaint.complaintId}`,
          message: `Admin ${req.user.name} returned "${complaint.title}" for additional work: ${notes}`,
          type: 'complaint_reopened',
          complaintId: complaint._id,
          complaintCode: complaint.complaintId,
        });
      }
    }

    await complaint.save();

    await AuditLog.create({
      action: decision === 'verify' ? 'COMPLAINT_VERIFIED' : 'COMPLAINT_REOPENED_BY_ADMIN',
      performedBy: req.user._id,
      performedByName: req.user.name,
      role: req.user.role,
      targetType: 'Complaint',
      targetId: complaint._id.toString(),
      details: { complaintId: complaint.complaintId, decision, notes },
    });

    res.json({
      success: true,
      message: decision === 'verify' ? 'Complaint verified and closed.' : 'Complaint returned for work.',
      complaint,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be a number between 1 and 5.' });
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    complaint.feedback = {
      rating,
      comment: comment || '',
      submittedAt: new Date(),
    };

    await complaint.save();

    await AuditLog.create({
      action: 'FEEDBACK_SUBMITTED',
      performedBy: req.user._id,
      performedByName: req.user.name,
      role: 'citizen',
      targetType: 'Complaint',
      targetId: complaint._id.toString(),
      details: { complaintId: complaint.complaintId, rating, comment },
    });

    // Notify admins and staff
    await sendNotification({
      recipientRole: 'local_admin',
      title: `Citizen Feedback: ${complaint.complaintId} (${rating} Stars)`,
      message: `${req.user.name} left a rating of ${rating}/5: "${comment || 'No comment'}"`,
      type: 'feedback_received',
      complaintId: complaint._id,
      complaintCode: complaint.complaintId,
    });

    res.json({
      success: true,
      message: 'Thank you for your valuable feedback!',
      feedback: complaint.feedback,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const reopenComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    complaint.status = 'reopened';
    complaint.reopenReason = reason || 'Citizen requested review.';
    complaint.statusHistory.push({
      status: 'reopened',
      updatedBy: req.user._id,
      updatedByName: req.user.name,
      comment: `Reopened: ${reason || 'Citizen indicated issue is still persisting.'}`,
      timestamp: new Date(),
    });

    await complaint.save();

    await sendNotification({
      recipientRole: 'local_admin',
      title: `Citizen Reopened Case: ${complaint.complaintId}`,
      message: `${req.user.name} reopened "${complaint.title}". Reason: ${reason}`,
      type: 'complaint_reopened',
      complaintId: complaint._id,
      complaintCode: complaint.complaintId,
    });

    res.json({
      success: true,
      message: 'Complaint has been reopened for investigation.',
      complaint,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const rejectComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ success: false, message: 'A rejection reason is required.' });
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    complaint.status = 'rejected';
    complaint.rejectionReason = reason;
    complaint.statusHistory.push({
      status: 'rejected',
      updatedBy: req.user._id,
      updatedByName: req.user.name,
      comment: `Rejected: ${reason}`,
      timestamp: new Date(),
    });

    await complaint.save();

    // Notify citizen
    await sendNotification({
      recipient: complaint.citizen,
      title: `Complaint Rejected: ${complaint.complaintId}`,
      message: `Your report was reviewed and marked as rejected. Reason: ${reason}`,
      type: 'complaint_rejected',
      complaintId: complaint._id,
      complaintCode: complaint.complaintId,
    });

    res.json({
      success: true,
      message: 'Complaint rejected.',
      complaint,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
