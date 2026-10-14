import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { Complaint } from '../src/models/Complaint.js';
import { Notification } from '../src/models/Notification.js';
import { seedDatabase } from '../src/seed.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../src/middleware/auth.js';

describe('EcoVerse AI API & Workflow Tests', () => {
  let citizenUser;
  let adminUser;
  let staffUser;
  let citizenToken;
  let adminToken;
  let staffToken;

  before(async () => {
    await connectDB();
    await seedDatabase();

    citizenUser = await User.findOne({ email: 'citizen@ecoverse.gov' });
    adminUser = await User.findOne({ email: 'localadmin@ecoverse.gov' });
    staffUser = await User.findOne({ email: 'staff.water@ecoverse.gov' });

    citizenToken = jwt.sign({ id: citizenUser._id, role: citizenUser.role, name: citizenUser.name }, JWT_SECRET);
    adminToken = jwt.sign({ id: adminUser._id, role: adminUser.role, name: adminUser.name }, JWT_SECRET);
    staffToken = jwt.sign({ id: staffUser._id, role: staffUser.role, name: staffUser.name }, JWT_SECRET);
  });

  after(async () => {
    await disconnectDB();
  });

  test('1. Citizen User Authentication & Password Hashing Verification', async () => {
    assert.ok(citizenUser, 'Citizen user should exist in seeded database');
    const isMatch = await citizenUser.comparePassword('Citizen@1234');
    assert.strictEqual(isMatch, true, 'Password comparison should succeed for correct credentials');
    const isWrong = await citizenUser.comparePassword('WrongPassword');
    assert.strictEqual(isWrong, false, 'Password comparison should reject invalid credentials');
  });

  test('2. Complaint Creation & Unique ID Generation Workflow', async () => {
    const complaint = new Complaint({
      title: 'Broken Pipeline on South Avenue',
      description: 'Potable water leaking near primary school gate.',
      category: 'water_leakage',
      department: 'water',
      priority: 'high',
      status: 'pending',
      citizen: citizenUser._id,
      citizenName: citizenUser.name,
      location: {
        address: 'South Avenue, Village Sector',
        area: 'Village Sector - North Agri Farms',
        coordinates: { x: -5, y: 0.5, z: 2 },
      },
      statusHistory: [
        {
          status: 'pending',
          updatedBy: citizenUser._id,
          updatedByName: citizenUser.name,
          comment: 'Initial filing by citizen',
        },
      ],
    });

    await complaint.save();

    assert.ok(complaint._id, 'Complaint should be saved to database');
    assert.match(complaint.complaintId, /^ECO-\d{4}-\d+$/, 'Complaint ID format must be ECO-YYYY-XXXX');
    assert.strictEqual(complaint.status, 'pending');
  });

  test('3. Admin Assignment & Staff Progress Workflow', async () => {
    const complaint = await Complaint.findOne({ status: 'pending' });
    assert.ok(complaint, 'There should be a pending complaint to assign');

    // Admin assigns to water staff
    complaint.status = 'assigned';
    complaint.assignedAdmin = adminUser._id;
    complaint.assignedStaff = staffUser._id;
    complaint.assignedStaffName = staffUser.name;
    complaint.statusHistory.push({
      status: 'assigned',
      updatedBy: adminUser._id,
      updatedByName: adminUser.name,
      comment: 'Assigned to field staff for urgent inspection.',
    });
    await complaint.save();

    assert.strictEqual(complaint.status, 'assigned');
    assert.strictEqual(complaint.assignedStaffName, staffUser.name);

    // Staff updates to in_progress with notes
    complaint.status = 'in_progress';
    complaint.workNotes.push({
      staff: staffUser._id,
      staffName: staffUser.name,
      note: 'On site. Excavation begun, spare flange ready.',
    });
    complaint.statusHistory.push({
      status: 'in_progress',
      updatedBy: staffUser._id,
      updatedByName: staffUser.name,
      comment: 'Field work initiated.',
    });
    await complaint.save();

    assert.strictEqual(complaint.status, 'in_progress');
    assert.strictEqual(complaint.workNotes.length, 1);
  });

  test('4. Staff Resolution, Evidence Upload & Admin Verification', async () => {
    const complaint = await Complaint.findOne({ status: 'in_progress' });
    assert.ok(complaint, 'There should be an in_progress complaint');

    // Staff resolves with evidence
    complaint.status = 'resolved';
    complaint.resolvedAt = new Date();
    complaint.resolutionEvidence = {
      beforeImage: 'https://example.com/before.jpg',
      afterImage: 'https://example.com/after.jpg',
      notes: 'Pipe welded and pressure tested at 4.0 bar.',
      submittedAt: new Date(),
    };
    complaint.statusHistory.push({
      status: 'resolved',
      updatedBy: staffUser._id,
      updatedByName: staffUser.name,
      comment: 'Resolved on site. Awaiting admin closure.',
      evidenceImage: 'https://example.com/after.jpg',
    });
    await complaint.save();

    assert.strictEqual(complaint.status, 'resolved');
    assert.ok(complaint.resolutionEvidence.afterImage);

    // Admin verifies
    complaint.status = 'verified';
    complaint.verifiedAt = new Date();
    complaint.statusHistory.push({
      status: 'verified',
      updatedBy: adminUser._id,
      updatedByName: adminUser.name,
      comment: 'Resolution verified and closed.',
    });
    await complaint.save();

    assert.strictEqual(complaint.status, 'verified');
    assert.ok(complaint.verifiedAt);
  });

  test('5. Citizen Feedback Rating Submission', async () => {
    const complaint = await Complaint.findOne({ status: 'verified' });
    assert.ok(complaint, 'There should be a verified complaint');

    complaint.feedback = {
      rating: 5,
      comment: 'Prompt repair, excellent service by the team!',
      submittedAt: new Date(),
    };
    await complaint.save();

    assert.strictEqual(complaint.feedback.rating, 5);
  });

  test('6. Notification Persistence & Retrieval', async () => {
    const notif = await Notification.create({
      recipient: citizenUser._id,
      title: 'Water Leak Resolved',
      message: 'Your reported leak has been verified and closed.',
      type: 'complaint_verified',
      complaintCode: 'ECO-2026-1002',
    });

    assert.ok(notif._id);
    assert.strictEqual(notif.read, false);

    const retrieved = await Notification.findById(notif._id);
    assert.strictEqual(retrieved.title, 'Water Leak Resolved');
  });
});
