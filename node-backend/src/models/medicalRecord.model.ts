import mongoose, { Schema } from 'mongoose';
import { IMedicalRecord } from './interfaces';
import { encryptFields } from '../utils/encryption';

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

// Apply encryption to sensitive medical data
encryptFields(MedicalRecordSchema, [
  'diagnosis',
  'prescription',
  'notes'
]);

export default mongoose.model<IMedicalRecord>('MedicalRecord', MedicalRecordSchema);
