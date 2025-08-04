import { Document } from 'mongoose';

// User interface
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'patient' | 'doctor' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Specialization interface
export interface ISpecialization extends Document {
  name: string;
}

// Patient interface
export interface IPatient extends Document {
  user: IUser['_id'];
  dateOfBirth: Date;
  phone: string;
  address: string;
  insuranceProvider?: string;
  insuranceId?: string;
  medicalHistory?: string;
  allergies?: string;
  bloodType?: string;
  createdAt: Date;
  updatedAt: Date;
  // Method for decrypting fields
  getDecrypted(field: string): string | null;
}

// Doctor interface
export interface IDoctor extends Document {
  user: IUser['_id'];
  specializations: ISpecialization['_id'][];
  biography: string;
  createdAt: Date;
  updatedAt: Date;
}

// Availability interface
export interface IAvailability extends Document {
  doctor: IDoctor['_id'];
  day: string;
  date: string;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
}

// Appointment interface
export interface IAppointment extends Document {
  patient: IPatient['_id'];
  doctor: IDoctor['_id'];
  date: Date;
  startTime: Date;
  endTime: Date;
  reason: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Medical Record interface
export interface IMedicalRecord extends Document {
  patient: IPatient['_id'];
  appointment?: IAppointment['_id'];
  diagnosis: string;
  prescription?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
