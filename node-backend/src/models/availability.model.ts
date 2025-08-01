import mongoose, { Schema } from 'mongoose';
import { IAvailability } from './interfaces';

const AvailabilitySchema: Schema = new Schema({
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
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
});

// Create a compound index to ensure uniqueness for (doctor, day, startTime)
AvailabilitySchema.index({ doctor: 1, day: 1, startTime: 1 }, { unique: true });

export default mongoose.model<IAvailability>('Availability', AvailabilitySchema);
