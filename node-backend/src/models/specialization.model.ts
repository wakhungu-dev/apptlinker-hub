import mongoose, { Schema } from 'mongoose';
import { ISpecialization } from './interfaces';

const SpecializationSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

export default mongoose.model<ISpecialization>('Specialization', SpecializationSchema);
