import mongoose, { Schema } from 'mongoose';
import { IDoctor } from './interfaces';

const DoctorSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specializations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Specialization',
        required: true,
      },
    ],
    biography: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDoctor>('Doctor', DoctorSchema);
