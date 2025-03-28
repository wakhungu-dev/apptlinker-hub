
import { Appointment, Doctor, Patient, Specialization } from "@/types";
import * as mockData from "./mock-data";

const API_URL = "http://localhost:8000/api";
const USE_MOCK = false; // Set to false to use real API instead of mock data

// Helper function for API requests
async function apiRequest(endpoint: string, options = {}) {
  if (USE_MOCK) {
    // Handle mock data instead of real API requests
    console.log(`Mock API request: ${endpoint}`, options);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockApiHandler(endpoint, options);
  }
  
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

// Mock API handler
async function mockApiHandler(endpoint: string, options: any = {}) {
  // Parse the request body if it exists
  let requestBody: any = {};
  if (options.body) {
    try {
      requestBody = JSON.parse(options.body);
    } catch (e) {
      console.error("Failed to parse request body", e);
    }
  }
  
  // Handle different API endpoints
  if (endpoint === "/register/" && options.method === "POST") {
    const userData = requestBody;
    const role = userData.role;
    
    if (role === "patient") {
      const newPatient = await mockData.createPatient({
        email: userData.user.email,
        role: "patient",
        name: `${userData.user.first_name} ${userData.user.last_name}`,
        dateOfBirth: userData.date_of_birth || "",
        phone: userData.phone || "",
        address: userData.address || "",
        insuranceProvider: userData.insurance_provider || "",
        insuranceId: userData.insurance_id || "",
        medicalHistory: []
      });
      return newPatient;
    } else if (role === "doctor") {
      // Create mock doctor implementation
      return {
        id: "mock-doctor-id",
        user: {
          id: "mock-user-id",
          first_name: userData.user.first_name,
          last_name: userData.user.last_name,
          email: userData.user.email,
        },
        specializations: userData.specializations || [],
        biography: userData.biography || ""
      };
    } else {
      throw new Error("Invalid role specified");
    }
  }
  
  if (endpoint === "/login/" && options.method === "POST") {
    const { username, password } = requestBody;
    const user = await mockData.login(username, password);
    if (user) {
      return {
        ...user,
        profile_id: user.id
      };
    }
    throw new Error("Invalid credentials");
  }
  
  if (endpoint === "/logout/" && options.method === "POST") {
    return { success: true };
  }
  
  if (endpoint === "/user/") {
    return mockData.users[0]; // Return the admin user for now
  }
  
  if (endpoint === "/doctors/") {
    return mockData.getDoctors();
  }
  
  if (endpoint.match(/\/doctors\/\w+\//)) {
    const id = endpoint.split('/')[2];
    const doctor = await mockData.getDoctorById(id);
    if (!doctor) throw new Error("Doctor not found");
    return doctor;
  }
  
  if (endpoint === "/patients/") {
    return mockData.getPatients();
  }
  
  if (endpoint.match(/\/patients\/\w+\//)) {
    const id = endpoint.split('/')[2];
    const patient = await mockData.getPatientById(id);
    if (!patient) throw new Error("Patient not found");
    return patient;
  }
  
  if (endpoint === "/appointments/") {
    if (options.method === "POST") {
      return mockData.createAppointment(requestBody);
    }
    return mockData.getAppointments();
  }
  
  if (endpoint.match(/\/appointments\/\w+\//)) {
    const id = endpoint.split('/')[2];
    
    if (options.method === "DELETE") {
      return mockData.cancelAppointment(id);
    }
    
    if (options.method === "PATCH") {
      return mockData.updateAppointment(id, requestBody);
    }
    
    const appointment = await mockData.getAppointmentById(id);
    if (!appointment) throw new Error("Appointment not found");
    return appointment;
  }
  
  if (endpoint === "/check-availability/") {
    // Mock availability logic
    const { doctor_id, date } = requestBody;
    
    // Simple mock response
    return {
      doctor_id,
      date,
      available_slots: [
        { start_time: "09:00", end_time: "09:30" },
        { start_time: "10:00", end_time: "10:30" },
        { start_time: "11:00", end_time: "11:30" },
        { start_time: "14:00", end_time: "14:30" },
        { start_time: "15:00", end_time: "15:30" },
      ]
    };
  }
  
  if (endpoint === "/specializations/") {
    return mockData.getSpecializations();
  }
  
  if (endpoint === "/medical-records/") {
    // Simple mock medical records
    return [];
  }
  
  // Default fallback
  throw new Error(`Unhandled mock endpoint: ${endpoint}`);
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

// Keep the rest of the API functions the same
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
