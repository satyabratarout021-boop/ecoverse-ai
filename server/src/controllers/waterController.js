import { Complaint } from '../models/Complaint.js';
import { TelemetryReading } from '../models/TelemetryReading.js';

export const getWaterTelemetry = async (req, res) => {
  try {
    const facilities = await TelemetryReading.find({ type: 'water' });
    const complaints = await Complaint.find({ department: 'water' })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('citizen', 'name phone')
      .populate('assignedStaff', 'name phone');

    // Aggregate statistics
    const totalWaterComplaints = await Complaint.countDocuments({ department: 'water' });
    const activeLeaks = await Complaint.countDocuments({
      department: 'water',
      status: { $in: ['pending', 'assigned', 'in_progress'] },
    });
    const resolvedWater = await Complaint.countDocuments({
      department: 'water',
      status: { $in: ['resolved', 'verified'] },
    });

    res.json({
      success: true,
      facilities,
      recentComplaints: complaints,
      stats: {
        totalWaterComplaints,
        activeLeaks,
        resolvedWater,
        systemHealth: activeLeaks > 5 ? 'Warning: High Leakage' : 'Optimal Operating State',
        reservoirTotalCapacityMillionLitres: 12.5,
        currentReservoirLevelPercent: 78.4,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
