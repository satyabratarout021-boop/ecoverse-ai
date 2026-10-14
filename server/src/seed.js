import { connectDB, disconnectDB } from './config/db.js';
import { User } from './models/User.js';
import { Department } from './models/Department.js';
import { Complaint } from './models/Complaint.js';
import { Notification } from './models/Notification.js';
import { TelemetryReading } from './models/TelemetryReading.js';
import { AuditLog } from './models/AuditLog.js';

export const seedDatabase = async () => {
  console.log('[Seed] Seeding database with initial accounts, departments, complaints, and telemetry...');

  // Clear existing collections if any
  await User.deleteMany({});
  await Department.deleteMany({});
  await Complaint.deleteMany({});
  await Notification.deleteMany({});
  await TelemetryReading.deleteMany({});
  await AuditLog.deleteMany({});

  // 1. Create Departments
  const departments = await Department.create([
    {
      code: 'water',
      name: 'JalRakshak Water Management',
      description: 'Potable water pipelines, reservoirs, pressure pumps, and leakage mitigation.',
      color: '#0284c7',
      icon: 'Droplets',
      headOfficerName: 'Er. Rajesh Mahapatra',
      slaHours: 24,
    },
    {
      code: 'waste',
      name: 'EcoMind Waste & Sanitation',
      description: 'Municipal garbage collection, smart recycling, compost facilities, and hotspot clearing.',
      color: '#16a34a',
      icon: 'Trash2',
      headOfficerName: 'Dr. Sunita Nayak',
      slaHours: 24,
    },
    {
      code: 'electricity',
      name: 'EnergyGuard Power & Solar',
      description: 'Smart streetlights, microgrid distribution, rooftop solar networks, and emergency repairs.',
      color: '#eab308',
      icon: 'Zap',
      headOfficerName: 'Er. Amitav Panda',
      slaHours: 12,
    },
    {
      code: 'roads',
      name: 'Civic Roads & Drainage',
      description: 'Pothole restoration, storm drainage, crosswalks, sidewalks, and village link roads.',
      color: '#f97316',
      icon: 'Construction',
      headOfficerName: 'Shri Manoj Das',
      slaHours: 48,
    },
    {
      code: 'general',
      name: 'General Civic Services',
      description: 'Parks, community halls, heritage preservation, and public amenities.',
      color: '#8b5cf6',
      icon: 'Building2',
      headOfficerName: 'Smt. Priya Sharma',
      slaHours: 48,
    },
  ]);

  // 2. Create Users
  const superAdmin = await User.create({
    name: 'Dr. Alok Verma (Super Admin)',
    email: 'superadmin@ecoverse.gov',
    password: 'Admin@1234',
    role: 'super_admin',
    department: null,
    phone: '+91 98765 00001',
    assignedArea: 'EcoVerse Central Command Center',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  });

  const localAdmin = await User.create({
    name: 'Smt. Rashmi Patel (Local Admin)',
    email: 'localadmin@ecoverse.gov',
    password: 'Admin@1234',
    role: 'local_admin',
    department: null,
    phone: '+91 98765 00002',
    assignedArea: 'EcoVerse Sector A (Village & City Central)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  });

  const staffWater = await User.create({
    name: 'Vikram Sethi (Water Dept Staff)',
    email: 'staff.water@ecoverse.gov',
    password: 'Staff@1234',
    role: 'department_staff',
    department: 'water',
    phone: '+91 98765 00003',
    assignedArea: 'Village Sector - Heritage Pond & Well',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  });

  const staffWaste = await User.create({
    name: 'Deepak Rout (Sanitation Staff)',
    email: 'staff.waste@ecoverse.gov',
    password: 'Staff@1234',
    role: 'department_staff',
    department: 'waste',
    phone: '+91 98765 00004',
    assignedArea: 'Sanitation Hub - Recycling & Sorting Facility',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  });

  const staffEnergy = await User.create({
    name: 'Ananya Sen (Energy Staff)',
    email: 'staff.energy@ecoverse.gov',
    password: 'Staff@1234',
    role: 'department_staff',
    department: 'electricity',
    phone: '+91 98765 00005',
    assignedArea: 'Renewable Zone - Solar Park & Wind Hub',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  });

  const staffCivic = await User.create({
    name: 'Rohan Tripathy (Roads Staff)',
    email: 'staff.civic@ecoverse.gov',
    password: 'Staff@1234',
    role: 'department_staff',
    department: 'roads',
    phone: '+91 98765 00006',
    assignedArea: 'City Quarter - High Tech Commercial',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
  });

  const citizen = await User.create({
    name: 'Aarav Mohanty (Citizen)',
    email: 'citizen@ecoverse.gov',
    password: 'Citizen@1234',
    role: 'citizen',
    department: null,
    phone: '+91 98765 00007',
    assignedArea: 'City Quarter - Residential Green Towers',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
  });

  // 3. Create canonical Complaints with 3D coordinates & full lifecycle
  const complaint1 = await Complaint.create({
    complaintId: 'ECO-2026-1001',
    title: 'Flickering Solar Smart Streetlight at North Boulevard',
    description: 'Streetlight #SL-104 is blinking erratically at night, causing visibility concerns for commuters.',
    category: 'streetlight',
    department: 'electricity',
    priority: 'high',
    status: 'assigned',
    citizen: citizen._id,
    citizenName: citizen.name,
    assignedAdmin: localAdmin._id,
    assignedStaff: staffEnergy._id,
    assignedStaffName: staffEnergy.name,
    location: {
      address: 'North Boulevard, near City Tower B',
      landmark: 'Lamp Post #SL-104',
      area: 'City Quarter - High Tech Commercial',
      coordinates: { x: 5.2, y: 0.5, z: 4.8 },
      lat: 20.298,
      lng: 85.827,
    },
    images: ['https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600'],
    energyDetails: {
      assetType: 'streetlight',
      poleNumber: 'SL-104',
      outageScope: 'Localized Lamp Post Driver Fault',
    },
    statusHistory: [
      {
        status: 'pending',
        updatedBy: citizen._id,
        updatedByName: citizen.name,
        comment: 'Reported by citizen Aarav Mohanty.',
        timestamp: new Date(Date.now() - 36 * 3600 * 1000),
      },
      {
        status: 'assigned',
        updatedBy: localAdmin._id,
        updatedByName: localAdmin.name,
        comment: 'Assigned to Energy Staff Ananya Sen. Priority set to High.',
        timestamp: new Date(Date.now() - 24 * 3600 * 1000),
      },
    ],
    workNotes: [
      {
        staff: localAdmin._id,
        staffName: `${localAdmin.name} (Admin)`,
        note: 'Inspect LED driver and solar inverter connector.',
        timestamp: new Date(Date.now() - 24 * 3600 * 1000),
      },
    ],
  });

  const complaint2 = await Complaint.create({
    complaintId: 'ECO-2026-1002',
    title: 'Major Potable Water Pipeline Leak near Village Reservoir',
    description: 'Heavy water spillage observed from the 100mm distribution main line feeding North Village households.',
    category: 'water_leakage',
    department: 'water',
    priority: 'emergency',
    status: 'in_progress',
    citizen: citizen._id,
    citizenName: citizen.name,
    assignedAdmin: localAdmin._id,
    assignedStaff: staffWater._id,
    assignedStaffName: staffWater.name,
    location: {
      address: 'Reservoir Feeder Road, North Sector',
      landmark: 'Valve Junction 04',
      area: 'Water Facility - Reservoir & Filtration Plant',
      coordinates: { x: -6.5, y: 0.5, z: 6.2 },
      lat: 20.301,
      lng: 85.819,
    },
    images: ['https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=600'],
    waterDetails: {
      issueType: 'leakage',
      estimatedLossLitresPerHr: 1850,
      facilityName: 'North Village Main Reservoir',
      pipelinePressureBar: 3.8,
    },
    statusHistory: [
      {
        status: 'pending',
        updatedBy: citizen._id,
        updatedByName: citizen.name,
        comment: 'Urgent leak reported with photos.',
        timestamp: new Date(Date.now() - 18 * 3600 * 1000),
      },
      {
        status: 'assigned',
        updatedBy: localAdmin._id,
        updatedByName: localAdmin.name,
        comment: 'Emergency dispatch to Vikram Sethi.',
        timestamp: new Date(Date.now() - 14 * 3600 * 1000),
      },
      {
        status: 'in_progress',
        updatedBy: staffWater._id,
        updatedByName: staffWater.name,
        comment: 'Excavation begun. Replacement rubber gasket and sleeve clamp being installed.',
        timestamp: new Date(Date.now() - 5 * 3600 * 1000),
      },
    ],
    workNotes: [
      {
        staff: staffWater._id,
        staffName: staffWater.name,
        note: 'Main valve temporarily throttled to 40% to prevent water wastage while welding sleeve clamp.',
        timestamp: new Date(Date.now() - 4 * 3600 * 1000),
      },
    ],
  });

  const complaint3 = await Complaint.create({
    complaintId: 'ECO-2026-1003',
    title: 'Garbage Dump Overflow at Village Market Square',
    description: 'Dry plastics and mixed organic food containers have accumulated behind the weekly farmer market.',
    category: 'waste',
    department: 'waste',
    priority: 'medium',
    status: 'pending',
    citizen: citizen._id,
    citizenName: citizen.name,
    location: {
      address: 'Farmer Market Plaza, Village Sector',
      landmark: 'Near Community Shed',
      area: 'Village Sector - Central Community Hub',
      coordinates: { x: -3.8, y: 0.5, z: -4.2 },
      lat: 20.292,
      lng: 85.815,
    },
    images: ['https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600'],
    wasteDetails: {
      classification: 'mixed',
      confidence: 0.91,
      estimatedWeightKg: 85,
      recyclable: true,
      carbonImpactKg: 64,
      hotspotZone: 'Zone-3 Market',
    },
    statusHistory: [
      {
        status: 'pending',
        updatedBy: citizen._id,
        updatedByName: citizen.name,
        comment: 'Citizen submitted report with AI classification.',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000),
      },
    ],
  });

  const complaint4 = await Complaint.create({
    complaintId: 'ECO-2026-1004',
    title: 'Deep Pothole Repaired on Heritage Village Link Road',
    description: 'Dangerous pothole on the asphalt surface repaired with cold mix bitumen.',
    category: 'roads',
    department: 'roads',
    priority: 'high',
    status: 'resolved',
    citizen: citizen._id,
    citizenName: citizen.name,
    assignedAdmin: localAdmin._id,
    assignedStaff: staffCivic._id,
    assignedStaffName: staffCivic.name,
    location: {
      address: 'Heritage Link Road Km 1.2',
      landmark: 'Opposite Village School',
      area: 'Village Sector - North Agri Farms',
      coordinates: { x: -7.1, y: 0.5, z: 1.5 },
      lat: 20.299,
      lng: 85.811,
    },
    images: ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600'],
    resolutionEvidence: {
      beforeImage: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600',
      afterImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=600',
      notes: 'Pothole excavated to 150mm, leveled with graded aggregate and compacted with roller.',
      submittedAt: new Date(Date.now() - 6 * 3600 * 1000),
    },
    resolvedAt: new Date(Date.now() - 6 * 3600 * 1000),
    statusHistory: [
      {
        status: 'pending',
        updatedBy: citizen._id,
        updatedByName: citizen.name,
        comment: 'Citizen reported road hazard.',
        timestamp: new Date(Date.now() - 48 * 3600 * 1000),
      },
      {
        status: 'assigned',
        updatedBy: localAdmin._id,
        updatedByName: localAdmin.name,
        comment: 'Assigned to Rohan Tripathy.',
        timestamp: new Date(Date.now() - 40 * 3600 * 1000),
      },
      {
        status: 'in_progress',
        updatedBy: staffCivic._id,
        updatedByName: staffCivic.name,
        comment: 'Bitumen and compactor dispatched.',
        timestamp: new Date(Date.now() - 20 * 3600 * 1000),
      },
      {
        status: 'resolved',
        updatedBy: staffCivic._id,
        updatedByName: staffCivic.name,
        comment: 'Compaction completed and road opened to traffic.',
        evidenceImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=600',
        timestamp: new Date(Date.now() - 6 * 3600 * 1000),
      },
    ],
  });

  const complaint5 = await Complaint.create({
    complaintId: 'ECO-2026-1005',
    title: 'Monsoon Storm Drainage Blockage Cleared near Health Complex',
    description: 'Silt and tree debris cleared from stormwater grating, restoring unobstructed flow.',
    category: 'drainage',
    department: 'roads',
    priority: 'medium',
    status: 'verified',
    citizen: citizen._id,
    citizenName: citizen.name,
    assignedAdmin: localAdmin._id,
    assignedStaff: staffCivic._id,
    assignedStaffName: staffCivic.name,
    location: {
      address: 'Civic Health Complex Perimeter',
      landmark: 'Main Drain Gate 2',
      area: 'City Quarter - Hospital & Health Complex',
      coordinates: { x: 6.8, y: 0.5, z: -5.4 },
      lat: 20.291,
      lng: 85.831,
    },
    images: ['https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600'],
    resolutionEvidence: {
      beforeImage: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600',
      afterImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=600',
      notes: 'Desilting machine completed flush. Water flowing smoothly at 450 l/s.',
      submittedAt: new Date(Date.now() - 30 * 3600 * 1000),
    },
    resolvedAt: new Date(Date.now() - 30 * 3600 * 1000),
    verifiedAt: new Date(Date.now() - 20 * 3600 * 1000),
    feedback: {
      rating: 5,
      comment: 'Super fast response! No water logging occurred during subsequent rain.',
      submittedAt: new Date(Date.now() - 16 * 3600 * 1000),
    },
    statusHistory: [
      {
        status: 'pending',
        updatedBy: citizen._id,
        updatedByName: citizen.name,
        comment: 'Drainage blockage reported.',
        timestamp: new Date(Date.now() - 72 * 3600 * 1000),
      },
      {
        status: 'assigned',
        updatedBy: localAdmin._id,
        updatedByName: localAdmin.name,
        comment: 'Assigned to Rohan Tripathy.',
        timestamp: new Date(Date.now() - 60 * 3600 * 1000),
      },
      {
        status: 'resolved',
        updatedBy: staffCivic._id,
        updatedByName: staffCivic.name,
        comment: 'Grating desilted.',
        timestamp: new Date(Date.now() - 30 * 3600 * 1000),
      },
      {
        status: 'verified',
        updatedBy: localAdmin._id,
        updatedByName: localAdmin.name,
        comment: 'Admin verified evidence and closed ticket.',
        timestamp: new Date(Date.now() - 20 * 3600 * 1000),
      },
    ],
  });

  const complaint6 = await Complaint.create({
    complaintId: 'ECO-2026-1006',
    title: 'Solar Inverter Cluster #3 Output Fluctuation',
    description: 'Inverter shows thermal derating warning causing 18% power reduction in Array Section C.',
    category: 'electricity_fault',
    department: 'electricity',
    priority: 'medium',
    status: 'in_progress',
    citizen: citizen._id,
    citizenName: citizen.name,
    assignedAdmin: localAdmin._id,
    assignedStaff: staffEnergy._id,
    assignedStaffName: staffEnergy.name,
    location: {
      address: 'EcoVerse Clean Energy Park',
      landmark: 'Inverter Shed C-3',
      area: 'Renewable Zone - Solar Park & Wind Hub',
      coordinates: { x: 3.5, y: 0.5, z: -7.5 },
      lat: 20.288,
      lng: 85.835,
    },
    images: ['https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600'],
    energyDetails: {
      assetType: 'solar_panel',
      poleNumber: 'INV-C3',
      solarPowerDropKw: 24.5,
    },
    statusHistory: [
      {
        status: 'pending',
        updatedBy: citizen._id,
        updatedByName: citizen.name,
        comment: 'Telemetry deviation reported by energy warden.',
        timestamp: new Date(Date.now() - 10 * 3600 * 1000),
      },
      {
        status: 'assigned',
        updatedBy: localAdmin._id,
        updatedByName: localAdmin.name,
        comment: 'Assigned to Ananya Sen.',
        timestamp: new Date(Date.now() - 8 * 3600 * 1000),
      },
      {
        status: 'in_progress',
        updatedBy: staffEnergy._id,
        updatedByName: staffEnergy.name,
        comment: 'Cooling fans cleaned; recalibrating MPPT controllers.',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000),
      },
    ],
  });

  // 4. Create Telemetry Readings
  await TelemetryReading.create([
    {
      type: 'water',
      locationName: 'North Village Main Reservoir',
      coordinates: { x: -6.5, y: 0.5, z: 6.2 },
      status: 'warning',
      metrics: {
        capacityLiters: 12500000,
        currentFillPercent: 78.4,
        outflowRateLps: 340,
        pressureBar: 3.8,
        ph: 7.2,
        turbidityNtu: 1.4,
        chlorinePpm: 0.8,
      },
    },
    {
      type: 'water',
      locationName: 'City High-Tech Filtration Hub',
      coordinates: { x: 2.1, y: 0.5, z: 3.2 },
      status: 'optimal',
      metrics: {
        capacityLiters: 8000000,
        currentFillPercent: 91.2,
        outflowRateLps: 520,
        pressureBar: 4.2,
        ph: 7.4,
        turbidityNtu: 0.6,
        chlorinePpm: 1.0,
      },
    },
    {
      type: 'energy',
      locationName: 'EcoVerse Solar Park Array Alpha',
      coordinates: { x: 3.5, y: 0.5, z: -7.5 },
      status: 'optimal',
      metrics: {
        peakCapacityKw: 500,
        currentGenerationKw: 420.8,
        batteryStoragePercent: 86.4,
        gridFrequencyHz: 50.02,
        carbonSavedKgToday: 1420,
      },
    },
    {
      type: 'energy',
      locationName: 'Smart Streetlight Grid Core',
      coordinates: { x: 0, y: 0.5, z: 0 },
      status: 'optimal',
      metrics: {
        totalStreetlights: 240,
        activeLamps: 238,
        faultyLamps: 2,
        dimmingScheduleEnabled: true,
      },
    },
    {
      type: 'waste_hotspot',
      locationName: 'Farmer Market Plaza Bin Cluster',
      coordinates: { x: -3.8, y: 0.5, z: -4.2 },
      status: 'critical',
      metrics: {
        fillLevelPercent: 92,
        sensorType: 'Ultrasonic Depth',
        binType: 'Mixed Waste',
        lastPickupHoursAgo: 22,
      },
    },
    {
      type: 'waste_hotspot',
      locationName: 'High Tech Tech-Park Recycling Point',
      coordinates: { x: 4.8, y: 0.5, z: 2.1 },
      status: 'optimal',
      metrics: {
        fillLevelPercent: 35,
        sensorType: 'Ultrasonic Depth',
        binType: 'Plastic & Paper Recyclables',
        lastPickupHoursAgo: 6,
      },
    },
  ]);

  // 5. Create Notifications
  await Notification.create([
    {
      recipient: localAdmin._id,
      title: 'New Emergency Water Leak',
      message: 'Citizen reported high pressure leakage near Reservoir Feeder Road.',
      type: 'complaint_new',
      complaintId: complaint2._id,
      complaintCode: complaint2.complaintId,
    },
    {
      recipient: staffWater._id,
      title: 'Emergency Task Assigned',
      message: 'Local Admin assigned you ECO-2026-1002 (Water Leakage).',
      type: 'complaint_assigned',
      complaintId: complaint2._id,
      complaintCode: complaint2.complaintId,
    },
    {
      recipient: citizen._id,
      title: 'Road Repair Completed',
      message: 'Your report ECO-2026-1004 has been marked resolved by staff Rohan Tripathy.',
      type: 'status_updated',
      complaintId: complaint4._id,
      complaintCode: complaint4.complaintId,
    },
  ]);

  // 6. Create Initial Audit Logs
  await AuditLog.create([
    {
      action: 'SYSTEM_BOOT_SEED',
      performedByName: 'EcoVerse Seed Provisioner',
      role: 'system',
      targetType: 'Settings',
      details: { environment: 'Smart Village & Smart City Simulation' },
    },
    {
      action: 'COMPLAINT_VERIFIED',
      performedBy: localAdmin._id,
      performedByName: localAdmin.name,
      role: 'local_admin',
      targetType: 'Complaint',
      targetId: complaint5._id.toString(),
      details: { complaintId: complaint5.complaintId, status: 'verified' },
    },
  ]);

  console.log('[Seed] Database successfully seeded with 7 user roles, 5 departments, 6 complaints, and live telemetry!');
};

// If executed directly via CLI
if (process.argv[1]?.endsWith('seed.js')) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      await disconnectDB();
      console.log('[Seed] Completed successfully. Exiting.');
      process.exit(0);
    } catch (err) {
      console.error('[Seed] Error during seeding:', err);
      process.exit(1);
    }
  })();
}
