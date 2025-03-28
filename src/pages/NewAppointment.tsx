
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  getDoctors,
  getPatients,
  createAppointment,
} from "@/lib/mock-data";
import { Doctor, Patient } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Calendar, ChevronLeft, Clock } from "lucide-react";

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

const NewAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    doctorId: "",
    patientId: user?.role === "patient" ? user.id : "",
    date: "",
    startTime: "",
    endTime: "",
    reason: "",
    notes: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const doctorsData = await getDoctors();
        setDoctors(doctorsData);

        if (user?.role === "doctor" || user?.role === "admin") {
          const patientsData = await getPatients();
          setPatients(patientsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load necessary data for scheduling.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // If this is the startTime, automatically set endTime to 30 minutes later
    if (name === "startTime") {
      const startTimeIndex = timeSlots.findIndex((slot) => slot === value);
      if (startTimeIndex < timeSlots.length - 1) {
        setFormData((prev) => ({
          ...prev,
          startTime: value,
          endTime: timeSlots[startTimeIndex + 1],
        }));
      }
    }
  };

  const calculateEndTime = (startTime: string) => {
    // Simple calculation: add 30 minutes
    const [hours, minutes] = startTime.split(":").map(Number);
    let endHours = hours;
    let endMinutes = minutes + 30;
    
    if (endMinutes >= 60) {
      endHours += 1;
      endMinutes -= 60;
    }
    
    return `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.doctorId || !formData.patientId || !formData.date || !formData.startTime || !formData.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Calculate end time if not set
      const endTime = formData.endTime || calculateEndTime(formData.startTime);
      
      const appointmentData = {
        ...formData,
        endTime,
        status: "scheduled" as const,
        patientName: patients.find(p => p.id === formData.patientId)?.name,
        doctorName: doctors.find(d => d.id === formData.doctorId)?.name,
      };
      
      await createAppointment(appointmentData);
      
      toast({
        title: "Appointment Scheduled",
        description: "Your appointment has been successfully scheduled.",
      });
      
      navigate("/appointments");
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({
        title: "Scheduling Failed",
        description: error instanceof Error ? error.message : "Failed to schedule the appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse flex flex-col items-center justify-center">
          <div className="rounded-full bg-gray-200 h-12 w-12 flex items-center justify-center mb-4">
            <Calendar className="h-6 w-6 text-gray-400" />
          </div>
          <div className="h-4 bg-gray-200 rounded-full w-48 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded-full w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Schedule New Appointment
          </h1>
          <p className="text-muted-foreground">
            Book a consultation with a healthcare provider
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Appointment Information</CardTitle>
            <CardDescription>
              Fill out the form below to schedule your appointment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {user?.role !== "patient" && (
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("patientId", value)
                  }
                  value={formData.patientId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="doctorId">Doctor</Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("doctorId", value)
                }
                value={formData.doctorId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specializations.map(s => s.name).join(", ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="flex">
                  <Calendar className="mr-2 h-4 w-4 mt-3 text-gray-400" />
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Time</Label>
                <div className="flex">
                  <Clock className="mr-2 h-4 w-4 mt-3 text-gray-400" />
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange("startTime", value)
                    }
                    value={formData.startTime}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Visit</Label>
              <Input
                id="reason"
                name="reason"
                placeholder="Brief description of your reason for visit"
                value={formData.reason}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Any additional information that might be helpful"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="bg-health-600 hover:bg-health-700">
              Schedule Appointment
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default NewAppointment;
