
import React, { createContext, useContext, useEffect, useState } from "react";
import { Patient, User, Doctor } from "@/types";
import { login, getPatientById, getDoctorById } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  patientData: Patient | null;
  doctorData: Doctor | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [doctorData, setDoctorData] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Load additional data based on user role
        if (parsedUser.role === "patient") {
          getPatientById(parsedUser.id).then((data) => {
            if (data) setPatientData(data);
          });
        } else if (parsedUser.role === "doctor") {
          getDoctorById(parsedUser.id).then((data) => {
            if (data) setDoctorData(data);
          });
        }
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await login(email, password);
      
      if (!user) {
        setError("Invalid email or password");
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return;
      }
      
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      
      // Load additional data based on user role
      if (user.role === "patient") {
        const data = await getPatientById(user.id);
        if (data) setPatientData(data);
      } else if (user.role === "doctor") {
        const data = await getDoctorById(user.id);
        if (data) setDoctorData(data);
      }
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
      });
    } catch (e) {
      console.error("Login error", e);
      setError("An unexpected error occurred");
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setPatientData(null);
    setDoctorData(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const value = {
    user,
    patientData,
    doctorData,
    isLoading,
    error,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
