import mongoose, { Schema } from 'mongoose';
import { IAppointment } from './interfaces';

const AppointmentSchema: Schema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'cancelled', 'completed'],
      default: 'scheduled',
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Method to check if the appointment time conflicts with existing appointments
AppointmentSchema.statics.checkConflict = async function (
  doctorId: string,
  date: Date,
  startTime: Date,
  endTime: Date,
  excludeId?: string
) {
  const query = {
    doctor: doctorId,
    date: date,
    status: { $in: ['scheduled', 'confirmed'] },
    $or: [
      // Time range overlaps
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
      },
    ],
  };

  if (excludeId) {
    Object.assign(query, { _id: { $ne: excludeId } });
  }

  const conflictingAppointments = await this.find(query);
  return conflictingAppointments.length > 0;
};

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);
