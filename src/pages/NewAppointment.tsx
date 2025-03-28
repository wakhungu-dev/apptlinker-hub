
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { createAppointment, getDoctors, getDoctorAvailability } from "@/lib/api";
import { Doctor } from "@/types";

const NewAppointment = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<{ start_time: string; end_time: string }[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast({
          title: "Error",
          description: "Failed to load doctors. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchDoctors();
  }, []);

  const handleDoctorChange = (value: string) => {
    setSelectedDoctor(value);
    setAvailableSlots([]);
    setSelectedSlot("");
  };

  const handleDateChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value;
    setSelectedDate(date);
    setSelectedSlot("");
    
    if (date && selectedDoctor) {
      setIsFetchingSlots(true);
      try {
        const response = await getDoctorAvailability(selectedDoctor, date);
        setAvailableSlots(response.available_slots || []);
      } catch (error) {
        console.error("Error fetching availability:", error);
        toast({
          title: "Error",
          description: "Failed to load available time slots",
          variant: "destructive",
        });
        setAvailableSlots([]);
      } finally {
        setIsFetchingSlots(false);
      }
    } else {
      setAvailableSlots([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to book an appointment",
        variant: "destructive",
      });
      return;
    }

    if (!selectedSlot) {
      toast({
        title: "Error",
        description: "Please select a time slot",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    const [startTime, endTime] = selectedSlot.split("-");

    try {
      await createAppointment({
        patient: user.profile_id,
        doctor: selectedDoctor,
        date: selectedDate,
        start_time: startTime.trim(),
        end_time: endTime.trim(),
        reason: reason,
        status: "scheduled",
      });
      
      toast({
        title: "Success",
        description: "Your appointment has been scheduled",
      });
      
      navigate("/appointments");
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Appointment</h1>
          <p className="text-muted-foreground">
            Schedule a new appointment with a healthcare provider
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
          <CardDescription>
            Fill in the details to schedule your appointment
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doctor">Select Doctor</Label>
              <Select 
                value={selectedDoctor} 
                onValueChange={handleDoctorChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      Dr. {doctor.user.first_name} {doctor.user.last_name} ({doctor.specializations.map(s => s.name).join(", ")})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Select Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                min={new Date().toISOString().split('T')[0]}
                disabled={!selectedDoctor}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Select Time Slot</Label>
              <Select 
                value={selectedSlot} 
                onValueChange={setSelectedSlot}
                disabled={isFetchingSlots || availableSlots.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    isFetchingSlots 
                      ? "Loading available slots..." 
                      : availableSlots.length === 0 
                        ? "No available slots for selected date" 
                        : "Select a time slot"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {availableSlots.map((slot) => (
                    <SelectItem key={`${slot.start_time}-${slot.end_time}`} value={`${slot.start_time}-${slot.end_time}`}>
                      {slot.start_time} - {slot.end_time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Visit</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please briefly describe the reason for your visit"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Scheduling..." : "Schedule Appointment"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default NewAppointment;
