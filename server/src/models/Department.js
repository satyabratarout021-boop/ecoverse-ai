import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#10b981',
    },
    icon: {
      type: String,
      default: 'Layers',
    },
    headOfficerName: {
      type: String,
      default: 'Regional Administrator',
    },
    slaHours: {
      type: Number,
      default: 48,
    },
  },
  {
    timestamps: true,
  }
);

export const Department = mongoose.model('Department', departmentSchema);
