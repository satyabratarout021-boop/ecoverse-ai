import mongoose from 'mongoose';

const telemetryReadingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['water', 'energy', 'waste_hotspot', 'air_quality'],
      required: true,
    },
    locationName: {
      type: String,
      required: true,
    },
    coordinates: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      z: { type: Number, default: 0 },
    },
    metrics: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ['optimal', 'warning', 'critical', 'maintenance'],
      default: 'optimal',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const TelemetryReading = mongoose.model('TelemetryReading', telemetryReadingSchema);
