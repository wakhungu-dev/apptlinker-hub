
export interface User {
  id: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  name: string;
  createdAt: string;
}

export interface Patient extends User {
  role: 'patient';
  dateOfBirth: string;
  phone: string;
  address: string;
  insuranceProvider?: string;
  insuranceId?: string;
  medicalHistory?: string[];
}

export interface Specialization {
  id: string;
  name: string;
}

export interface Doctor extends User {
  role: 'doctor';
  specializations: Specialization[];
  biography: string;
  availability: Availability[];
}

export interface Availability {
  id: string;
  doctorId: string;
  day: string;
  startTime: string;
  endTime: string;
}

export interface AppointmentStatus {
  value: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  label: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus['value'];
  reason: string;
  notes?: string;
  patientName?: string;
  doctorName?: string;
}
