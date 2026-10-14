import express from 'express';
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  assignComplaint,
  updateStatus,
  verifyComplaint,
  submitFeedback,
  reopenComplaint,
  rejectComplaint,
} from '../controllers/complaintController.js';
import { authenticate, authorizeRoles, optionalAuthenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuthenticate, getComplaints);
router.get('/:id', optionalAuthenticate, getComplaintById);
router.post('/', authenticate, createComplaint);
router.put('/:id/assign', authenticate, authorizeRoles('super_admin', 'local_admin'), assignComplaint);
router.put('/:id/status', authenticate, authorizeRoles('super_admin', 'local_admin', 'department_staff'), updateStatus);
router.put('/:id/verify', authenticate, authorizeRoles('super_admin', 'local_admin'), verifyComplaint);
router.post('/:id/feedback', authenticate, submitFeedback);
router.put('/:id/reopen', authenticate, reopenComplaint);
router.put('/:id/reject', authenticate, authorizeRoles('super_admin', 'local_admin'), rejectComplaint);

export default router;
