import mongoose, { Schema } from 'mongoose';
import { IPatient } from './interfaces';
import { encryptFields } from '../utils/encryption';

const PatientSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    insuranceProvider: {
      type: String,
      trim: true,
    },
    insuranceId: {
      type: String,
      trim: true,
    },
    medicalHistory: {
      type: String,
      trim: true,
    },
    allergies: {
      type: String,
      trim: true,
    },
    bloodType: {
      type: String,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

// Apply encryption to sensitive patient data
encryptFields(PatientSchema, [
  'phone',
  'address',
  'insuranceId',
  'medicalHistory',
  'allergies'
]);

export default mongoose.model<IPatient>('Patient', PatientSchema);
