import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: true,
      enum: [
        'roads',
        'waste',
        'drainage',
        'water_leakage',
        'water_shortage',
        'streetlight',
        'electricity_fault',
        'infrastructure',
        'other',
      ],
    },
    department: {
      type: String,
      required: true,
      enum: ['water', 'waste', 'electricity', 'roads', 'general'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'emergency'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'in_progress', 'resolved', 'verified', 'reopened', 'rejected'],
      default: 'pending',
      index: true,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    reopenReason: {
      type: String,
      default: '',
    },
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    citizenName: {
      type: String,
      default: 'Citizen User',
    },
    assignedAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedStaffName: {
      type: String,
      default: '',
    },
    location: {
      address: {
        type: String,
        default: 'EcoVerse Central Zone',
      },
      landmark: {
        type: String,
        default: '',
      },
      area: {
        type: String,
        enum: [
          'City Quarter - High Tech Commercial',
          'City Quarter - Residential Green Towers',
          'City Quarter - Hospital & Health Complex',
          'Village Sector - North Agri Farms',
          'Village Sector - Central Community Hub',
          'Village Sector - Heritage Pond & Well',
          'Water Facility - Reservoir & Filtration Plant',
          'Renewable Zone - Solar Park & Wind Hub',
          'Sanitation Hub - Recycling & Sorting Facility',
          'Transit Corridor - Highway & EV Interchange'
        ],
        default: 'City Quarter - High Tech Commercial',
      },
      coordinates: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0.5 },
        z: { type: Number, default: 0 },
      },
      lat: { type: Number, default: 20.2961 },
      lng: { type: Number, default: 85.8245 },
    },
    images: {
      type: [String],
      default: [],
    },
    voiceTranscript: {
      type: String,
      default: '',
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        updatedByName: { type: String, default: 'System' },
        comment: { type: String, default: '' },
        evidenceImage: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    workNotes: [
      {
        staff: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        staffName: { type: String, default: 'Staff' },
        note: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    resolutionEvidence: {
      beforeImage: { type: String, default: '' },
      afterImage: { type: String, default: '' },
      notes: { type: String, default: '' },
      submittedAt: { type: Date, default: null },
    },
    feedback: {
      rating: { type: Number, min: 1, max: 5, default: null },
      comment: { type: String, default: '' },
      submittedAt: { type: Date, default: null },
    },
    wasteDetails: {
      classification: {
        type: String,
        enum: ['plastic', 'paper', 'metal', 'glass', 'organic', 'mixed', 'hazardous', null],
        default: null,
      },
      confidence: { type: Number, default: null },
      estimatedWeightKg: { type: Number, default: null },
      recyclable: { type: Boolean, default: true },
      carbonImpactKg: { type: Number, default: null },
      hotspotZone: { type: String, default: '' },
    },
    waterDetails: {
      issueType: {
        type: String,
        enum: ['leakage', 'contamination', 'pressure_loss', 'pump_failure', 'shortage', null],
        default: null,
      },
      estimatedLossLitresPerHr: { type: Number, default: null },
      facilityName: { type: String, default: '' },
      pipelinePressureBar: { type: Number, default: null },
    },
    energyDetails: {
      assetType: {
        type: String,
        enum: ['streetlight', 'transformer', 'power_line', 'solar_panel', 'substation', null],
        default: null,
      },
      poleNumber: { type: String, default: '' },
      outageScope: { type: String, default: '' },
      solarPowerDropKw: { type: Number, default: null },
    },
    resolvedAt: { type: Date, default: null },
    verifiedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// Auto-generate human-readable complaintId prior to validation
complaintSchema.pre('validate', async function (next) {
  if (!this.complaintId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Complaint').countDocuments();
    const seq = (count + 1).toString().padStart(4, '0');
    this.complaintId = `ECO-${year}-${seq}`;
  }
  next();
});

export const Complaint = mongoose.model('Complaint', complaintSchema);
