import mongoose, { Schema } from 'mongoose';
import { IMedicalRecord } from './interfaces';

const MedicalRecordSchema: Schema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    appointment: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    diagnosis: {
      type: String,
      required: true,
    },
    prescription: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMedicalRecord>('MedicalRecord', MedicalRecordSchema);
