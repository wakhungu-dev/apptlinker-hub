
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import NewAppointment from "./pages/NewAppointment";
import Doctors from "./pages/Doctors";
import Patients from "./pages/Patients";
import MedicalRecords from "./pages/MedicalRecords";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/dashboard" element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            } />
            
            <Route path="/appointments" element={
              <DashboardLayout>
                <Appointments />
              </DashboardLayout>
            } />
            
            <Route path="/appointments/new" element={
              <DashboardLayout>
                <NewAppointment />
              </DashboardLayout>
            } />
            
            <Route path="/doctors" element={
              <DashboardLayout>
                <Doctors />
              </DashboardLayout>
            } />
            
            <Route path="/patients" element={
              <DashboardLayout>
                <Patients />
              </DashboardLayout>
            } />
            
            <Route path="/medical-records" element={
              <DashboardLayout>
                <MedicalRecords />
              </DashboardLayout>
            } />
            
            <Route path="/settings" element={
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            } />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
