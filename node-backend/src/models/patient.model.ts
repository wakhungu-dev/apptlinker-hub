import mongoose, { Schema } from 'mongoose';
import { IPatient } from './interfaces';

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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPatient>('Patient', PatientSchema);
