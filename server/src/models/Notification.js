import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null if broadcast by role
    },
    recipientRole: {
      type: String,
      enum: ['super_admin', 'local_admin', 'department_staff', 'citizen', 'all'],
      default: null,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        'complaint_new',
        'complaint_assigned',
        'status_updated',
        'evidence_submitted',
        'complaint_verified',
        'complaint_rejected',
        'complaint_reopened',
        'feedback_received',
        'system_alert',
      ],
      default: 'system_alert',
    },
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      default: null,
    },
    complaintCode: {
      type: String,
      default: '',
    },
    read: {
      type: Boolean,
      default: false,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.model('Notification', notificationSchema);
