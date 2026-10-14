import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { AuditLog } from '../models/AuditLog.js';
import { JWT_SECRET } from '../middleware/auth.js';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      department: user.department,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Role is strictly forced to citizen on self-registration
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone || '',
      role: 'citizen',
    });

    const token = generateToken(user);

    await AuditLog.create({
      action: 'USER_REGISTER',
      performedBy: user._id,
      performedByName: user.name,
      role: user.role,
      targetType: 'User',
      targetId: user._id.toString(),
      details: { email: user.email, role: user.role },
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = generateToken(user);

    await AuditLog.create({
      action: 'USER_LOGIN',
      performedBy: user._id,
      performedByName: user.name,
      role: user.role,
      targetType: 'User',
      targetId: user._id.toString(),
      details: { email: user.email },
    });

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Demo quick-login switcher for rapid role testing during evaluation
export const demoLogin = async (req, res) => {
  try {
    const { role, department } = req.body;
    let query = {};

    if (role === 'super_admin') {
      query = { role: 'super_admin' };
    } else if (role === 'local_admin') {
      query = { role: 'local_admin' };
    } else if (role === 'department_staff') {
      query = { role: 'department_staff' };
      if (department) query.department = department;
    } else {
      query = { role: 'citizen' };
    }

    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ success: false, message: `No demo account found for role: ${role}` });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: `Switched session to ${user.name} (${user.role}${user.department ? ' - ' + user.department : ''})`,
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
