
import { Appointment, Doctor, Patient, Specialization } from "@/types";

const API_URL = "http://localhost:8000/api";

// Helper function for API requests
async function apiRequest(endpoint: string, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options as any).headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "An error occurred");
  }

  return response.json();
}

// Authentication APIs
export const loginUser = (username: string, password: string) => {
  return apiRequest("/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
};

export const logoutUser = () => {
  return apiRequest("/logout/", { method: "POST" });
};

export const getCurrentUser = () => {
  return apiRequest("/user/");
};

export const registerUser = (userData: any, role: string) => {
  return apiRequest("/register/", {
    method: "POST",
    body: JSON.stringify({ ...userData, role }),
  });
};

// Doctors APIs
export const getDoctors = async (): Promise<Doctor[]> => {
  return apiRequest("/doctors/");
};

export const getDoctorById = async (id: string): Promise<Doctor> => {
  return apiRequest(`/doctors/${id}/`);
};

export const getDoctorAvailability = async (doctorId: string, date: string) => {
  return apiRequest("/check-availability/", {
    method: "POST",
    body: JSON.stringify({ doctor_id: doctorId, date }),
  });
};

// Patients APIs
export const getPatients = async (): Promise<Patient[]> => {
  return apiRequest("/patients/");
};

export const getPatientById = async (id: string): Promise<Patient> => {
  return apiRequest(`/patients/${id}/`);
};

// Appointments APIs
export const getAppointments = async (): Promise<Appointment[]> => {
  return apiRequest("/appointments/");
};

export const getAppointmentById = async (id: string): Promise<Appointment> => {
  return apiRequest(`/appointments/${id}/`);
};

export const createAppointment = async (appointmentData: Partial<Appointment>) => {
  return apiRequest("/appointments/", {
    method: "POST",
    body: JSON.stringify(appointmentData),
  });
};

export const updateAppointment = async (id: string, appointmentData: Partial<Appointment>) => {
  return apiRequest(`/appointments/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(appointmentData),
  });
};

export const deleteAppointment = async (id: string) => {
  return apiRequest(`/appointments/${id}/`, {
    method: "DELETE",
  });
};

// Specializations APIs
export const getSpecializations = async (): Promise<Specialization[]> => {
  return apiRequest("/specializations/");
};

// Medical Records APIs
export const getMedicalRecords = async () => {
  return apiRequest("/medical-records/");
};

export const getMedicalRecordById = async (id: string) => {
  return apiRequest(`/medical-records/${id}/`);
};

export const createMedicalRecord = async (recordData: any) => {
  return apiRequest("/medical-records/", {
    method: "POST",
    body: JSON.stringify(recordData),
  });
};
