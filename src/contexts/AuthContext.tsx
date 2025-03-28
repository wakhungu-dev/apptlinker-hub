
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Patient } from "@/types";
import { getCurrentUser, loginUser, logoutUser } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  patientData: Patient | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from API on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        
        // If user is a patient, set patient data
        if (userData && userData.role === 'patient') {
          // For now we're just using the same user data
          // In a real app, we would fetch detailed patient data
          setPatientData({
            ...userData,
            role: 'patient',
            dateOfBirth: '',
            phone: '',
            address: '',
            medicalHistory: []
          });
        }
      } catch (error) {
        console.error("Failed to fetch current user", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userData = await loginUser(username, password);
      setUser(userData);
      
      // If user is a patient, set patient data
      if (userData && userData.role === 'patient') {
        // For now we're just using the same user data
        // In a real app, we would fetch detailed patient data
        setPatientData({
          ...userData,
          role: 'patient',
          dateOfBirth: '',
          phone: '',
          address: '',
          medicalHistory: []
        });
      }
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.first_name || userData.name}!`,
      });
    } catch (error) {
      console.error("Login error", error);
      setError("Invalid credentials");
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setPatientData(null);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error("Logout error", error);
      toast({
        title: "Logout Failed",
        description: "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    patientData,
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
