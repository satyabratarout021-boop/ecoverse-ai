import express from 'express';
import {
  getUsers,
  getStaffByDepartment,
  getDepartments,
  getAuditLogs,
  updateUserRole,
} from '../controllers/userController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/departments', getDepartments);
router.get('/staff/:department', authenticate, getStaffByDepartment);
router.get('/', authenticate, authorizeRoles('super_admin', 'local_admin'), getUsers);
router.get('/audit-logs', authenticate, authorizeRoles('super_admin', 'local_admin'), getAuditLogs);
router.put('/:id/role', authenticate, authorizeRoles('super_admin'), updateUserRole);

export default router;
