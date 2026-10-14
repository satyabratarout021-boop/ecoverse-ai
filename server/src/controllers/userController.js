import { User } from '../models/User.js';
import { Department } from '../models/Department.js';
import { AuditLog } from '../models/AuditLog.js';

export const getUsers = async (req, res) => {
  try {
    const { role, department } = req.query;
    const query = {};
    if (role) query.role = role;
    if (department) query.department = department;

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getStaffByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const query = { role: 'department_staff' };
    if (department && department !== 'all') {
      query.$or = [{ department }, { department: null }];
    }

    const staffMembers = await User.find(query).select('name email phone department assignedArea');
    res.json({ success: true, staff: staffMembers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json({ success: true, departments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, department, assignedArea } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (role) user.role = role;
    if (department !== undefined) user.department = department;
    if (assignedArea) user.assignedArea = assignedArea;

    await user.save();

    await AuditLog.create({
      action: 'USER_ROLE_UPDATED',
      performedBy: req.user._id,
      performedByName: req.user.name,
      role: req.user.role,
      targetType: 'User',
      targetId: user._id.toString(),
      details: { updatedRole: role, department },
    });

    res.json({
      success: true,
      message: 'User role updated successfully.',
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
