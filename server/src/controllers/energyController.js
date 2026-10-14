import { Complaint } from '../models/Complaint.js';
import { TelemetryReading } from '../models/TelemetryReading.js';

export const getEnergyTelemetry = async (req, res) => {
  try {
    const energyAssets = await TelemetryReading.find({ type: 'energy' });
    const complaints = await Complaint.find({ department: 'electricity' })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('citizen', 'name phone')
      .populate('assignedStaff', 'name phone');

    const totalEnergyComplaints = await Complaint.countDocuments({ department: 'electricity' });
    const activeOutages = await Complaint.countDocuments({
      department: 'electricity',
      status: { $in: ['pending', 'assigned', 'in_progress'] },
    });
    const resolvedEnergy = await Complaint.countDocuments({
      department: 'electricity',
      status: { $in: ['resolved', 'verified'] },
    });

    res.json({
      success: true,
      energyAssets,
      recentComplaints: complaints,
      stats: {
        totalEnergyComplaints,
        activeOutages,
        resolvedEnergy,
        solarGenerationKw: 420.8,
        batteryStoragePercent: 86,
        cleanEnergyMixPercent: 68.4,
        smartStreetlightCount: 240,
        operationalStreetlightsPercent: 96.5,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
