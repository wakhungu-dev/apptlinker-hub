import { Appointment, Doctor, Patient, Specialization, User } from "@/types";

// Generate a random ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock specializations
export const specializations: Specialization[] = [
  { id: "1", name: "Cardiology" },
  { id: "2", name: "Dermatology" },
  { id: "3", name: "Neurology" },
  { id: "4", name: "Orthopedics" },
  { id: "5", name: "Pediatrics" },
  { id: "6", name: "Psychiatry" },
  { id: "7", name: "Oncology" },
  { id: "8", name: "Gynecology" },
  { id: "9", name: "Internal Medicine" },
  { id: "10", name: "Family Medicine" },
];

// Mock users (including patients and doctors)
export const users: User[] = [
  {
    id: "1",
    email: "admin@healthcare.com",
    role: "admin",
    name: "Admin User",
    createdAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    email: "patient1@example.com",
    role: "patient",
    name: "Sarah Johnson",
    createdAt: "2023-01-10T00:00:00.000Z",
  },
  {
    id: "3",
    email: "patient2@example.com",
    role: "patient",
    name: "Michael Wilson",
    createdAt: "2023-01-15T00:00:00.000Z",
  },
  {
    id: "4",
    email: "doctor1@healthcare.com",
    role: "doctor",
    name: "Dr. Emily Carter",
    first_name: "Emily",
    last_name: "Carter",
    createdAt: "2023-01-05T00:00:00.000Z",
  },
  {
    id: "5",
    email: "doctor2@healthcare.com",
    role: "doctor",
    name: "Dr. James Rodriguez",
    first_name: "James",
    last_name: "Rodriguez",
    createdAt: "2023-01-08T00:00:00.000Z",
  },
];

// Mock patients
export const patients: Patient[] = [
  {
    id: "2",
    email: "patient1@example.com",
    role: "patient",
    name: "Sarah Johnson",
    createdAt: "2023-01-10T00:00:00.000Z",
    dateOfBirth: "1985-03-15",
    phone: "555-123-4567",
    address: "123 Main St, Anytown, USA",
    insuranceProvider: "Blue Cross",
    insuranceId: "BC123456789",
    medicalHistory: ["Asthma", "Allergies: Pollen"],
  },
  {
    id: "3",
    email: "patient2@example.com",
    role: "patient",
    name: "Michael Wilson",
    createdAt: "2023-01-15T00:00:00.000Z",
    dateOfBirth: "1992-07-22",
    phone: "555-987-6543",
    address: "456 Elm St, Somewhere, USA",
    insuranceProvider: "Aetna",
    insuranceId: "AE987654321",
    medicalHistory: ["Hypertension"],
  },
];

// Mock doctors
export const doctors: Doctor[] = [
  {
    id: "4",
    user: {
      id: "4",
      first_name: "Emily",
      last_name: "Carter",
      email: "doctor1@healthcare.com",
    },
    specializations: [specializations[0], specializations[8]],
    biography:
      "Dr. Carter is a board-certified cardiologist with over 10 years of experience in diagnosing and treating heart conditions.",
    availability: [
      {
        id: "1",
        doctorId: "4",
        day: "Monday",
        startTime: "09:00",
        endTime: "17:00",
      },
      {
        id: "2",
        doctorId: "4",
        day: "Wednesday",
        startTime: "09:00",
        endTime: "17:00",
      },
      {
        id: "3",
        doctorId: "4",
        day: "Friday",
        startTime: "09:00",
        endTime: "15:00",
      },
    ],
  },
  {
    id: "5",
    user: {
      id: "5",
      first_name: "James",
      last_name: "Rodriguez",
      email: "doctor2@healthcare.com",
    },
    specializations: [specializations[3], specializations[9]],
    biography:
      "Dr. Rodriguez specializes in orthopedic surgery and sports medicine, with a focus on minimally invasive procedures.",
    availability: [
      {
        id: "4",
        doctorId: "5",
        day: "Tuesday",
        startTime: "08:00",
        endTime: "16:00",
      },
      {
        id: "5",
        doctorId: "5",
        day: "Thursday",
        startTime: "08:00",
        endTime: "16:00",
      },
      {
        id: "6",
        doctorId: "5",
        day: "Saturday",
        startTime: "10:00",
        endTime: "14:00",
      },
    ],
  },
];

// Mock appointments
export const appointments: Appointment[] = [
  {
    id: "1",
    patientId: "2",
    doctorId: "4",
    date: "2023-06-05",
    startTime: "10:00",
    endTime: "10:30",
    status: "completed",
    reason: "Annual checkup",
    notes: "Patient reported occasional chest pain. EKG normal. Follow-up in 3 months recommended.",
    patientName: "Sarah Johnson",
    doctorName: "Dr. Emily Carter",
  },
  {
    id: "2",
    patientId: "3",
    doctorId: "5",
    date: "2023-06-06",
    startTime: "09:30",
    endTime: "10:00",
    status: "completed",
    reason: "Knee pain evaluation",
    notes: "X-rays showed mild osteoarthritis. Prescribed anti-inflammatory medication and physical therapy.",
    patientName: "Michael Wilson",
    doctorName: "Dr. James Rodriguez",
  },
  {
    id: "3",
    patientId: "2",
    doctorId: "5",
    date: new Date().toISOString().split('T')[0],
    startTime: "14:00",
    endTime: "14:30",
    status: "confirmed",
    reason: "Back pain follow-up",
    patientName: "Sarah Johnson",
    doctorName: "Dr. James Rodriguez",
  },
];

// Mock API functions

// Auth
export const login = async (email: string, password: string): Promise<User | null> => {
  // In a real implementation, we would validate credentials
  const user = users.find((u) => u.email === email);
  return user || null;
};

// Patients
export const getPatients = async (): Promise<Patient[]> => {
  return patients;
};

export const getPatientById = async (id: string): Promise<Patient | null> => {
  const patient = patients.find((p) => p.id === id);
  return patient || null;
};

export const createPatient = async (patient: Omit<Patient, "id" | "createdAt">): Promise<Patient> => {
  const newPatient = {
    ...patient,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  patients.push(newPatient);
  return newPatient;
};

export const updatePatient = async (id: string, data: Partial<Patient>): Promise<Patient | null> => {
  const index = patients.findIndex((p) => p.id === id);
  if (index === -1) return null;
  
  patients[index] = { ...patients[index], ...data };
  return patients[index];
};

// Doctors
export const getDoctors = async (): Promise<Doctor[]> => {
  return doctors;
};

export const getDoctorById = async (id: string): Promise<Doctor | null> => {
  const doctor = doctors.find((d) => d.id === id);
  return doctor || null;
};

export const createDoctor = async (doctor: Omit<Doctor, "id" | "createdAt">): Promise<Doctor> => {
  const newDoctor = {
    ...doctor,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  doctors.push(newDoctor);
  return newDoctor;
};

export const updateDoctor = async (id: string, data: Partial<Doctor>): Promise<Doctor | null> => {
  const index = doctors.findIndex((d) => d.id === id);
  if (index === -1) return null;
  
  doctors[index] = { ...doctors[index], ...data };
  return doctors[index];
};

// Specializations
export const getSpecializations = async (): Promise<Specialization[]> => {
  return specializations;
};

// Appointments
export const getAppointments = async (): Promise<Appointment[]> => {
  return appointments;
};

export const getAppointmentById = async (id: string): Promise<Appointment | null> => {
  const appointment = appointments.find((a) => a.id === id);
  return appointment || null;
};

export const getAppointmentsByDoctor = async (doctorId: string): Promise<Appointment[]> => {
  return appointments.filter((a) => a.doctorId === doctorId);
};

export const getAppointmentsByPatient = async (patientId: string): Promise<Appointment[]> => {
  return appointments.filter((a) => a.patientId === patientId);
};

export const createAppointment = async (appointment: Omit<Appointment, "id">): Promise<Appointment> => {
  // Validate availability (in a real implementation, this would be more robust)
  const doctor = doctors.find((d) => d.id === appointment.doctorId);
  if (!doctor) throw new Error("Doctor not found");
  
  // Check for conflicts
  const conflictingAppointments = appointments.filter(
    (a) => 
      a.doctorId === appointment.doctorId && 
      a.date === appointment.date &&
      ((a.startTime <= appointment.startTime && appointment.startTime < a.endTime) ||
       (a.startTime < appointment.endTime && appointment.endTime <= a.endTime) ||
       (appointment.startTime <= a.startTime && a.startTime < appointment.endTime))
  );
  
  if (conflictingAppointments.length > 0) {
    throw new Error("This time slot is already booked");
  }
  
  const newAppointment = {
    ...appointment,
    id: generateId(),
  };
  
  appointments.push(newAppointment);
  return newAppointment;
};

export const updateAppointment = async (id: string, data: Partial<Appointment>): Promise<Appointment | null> => {
  const index = appointments.findIndex((a) => a.id === id);
  if (index === -1) return null;
  
  appointments[index] = { ...appointments[index], ...data };
  return appointments[index];
};

export const cancelAppointment = async (id: string): Promise<Appointment | null> => {
  return updateAppointment(id, { status: "cancelled" });
};
