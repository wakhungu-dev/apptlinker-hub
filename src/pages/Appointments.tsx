
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getAppointmentsByDoctor, getAppointmentsByPatient, cancelAppointment } from "@/lib/mock-data";
import { Appointment } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        if (user) {
          let data: Appointment[] = [];
          if (user.role === "doctor") {
            data = await getAppointmentsByDoctor(user.id);
          } else if (user.role === "patient") {
            data = await getAppointmentsByPatient(user.id);
          }
          setAppointments(data);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "scheduled":
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;
    
    try {
      await cancelAppointment(selectedAppointment.id);
      setAppointments(
        appointments.map((apt) =>
          apt.id === selectedAppointment.id
            ? { ...apt, status: "cancelled" }
            : apt
        )
      );
      toast({
        title: "Appointment Cancelled",
        description: "The appointment has been successfully cancelled.",
      });
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast({
        title: "Error",
        description: "Failed to cancel the appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowCancelDialog(false);
      setSelectedAppointment(null);
    }
  };

  const canCancel = (appointment: Appointment) => {
    return (
      appointment.status === "scheduled" || appointment.status === "confirmed"
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">
            Manage your healthcare appointments
          </p>
        </div>
        <Link to="/appointments/new">
          <Button className="bg-health-600 hover:bg-health-700">
            <Calendar className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Appointments</CardTitle>
          <CardDescription>
            View all your scheduled, confirmed, and past appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium">No Appointments Found</h3>
              <p className="text-gray-500 mb-4">
                You don't have any appointments yet.
              </p>
              <Link to="/appointments/new">
                <Button className="bg-health-600 hover:bg-health-700">
                  Schedule Your First Appointment
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border rounded-lg p-5 hover:shadow-md transition-shadow"
                >
                  <div className="md:flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="bg-health-100 text-health-800 h-14 w-14 rounded-full flex items-center justify-center">
                          <Calendar className="h-6 w-6" />
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-lg">
                          {user?.role === "patient"
                            ? appointment.doctorName
                            : appointment.patientName}
                        </div>
                        <div className="flex items-center text-muted-foreground mb-1">
                          <Calendar className="mr-1 h-4 w-4" />
                          {formatDate(appointment.date)}
                        </div>
                        <div className="flex items-center text-muted-foreground mb-2">
                          <Clock className="mr-1 h-4 w-4" />
                          {appointment.startTime} - {appointment.endTime}
                        </div>
                        <Badge
                          className={getStatusColor(appointment.status)}
                          variant="outline"
                        >
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1 capitalize">
                            {appointment.status}
                          </span>
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 space-x-2 flex">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600"
                        asChild
                      >
                        <Link to={`/appointments/${appointment.id}`}>
                          View Details
                        </Link>
                      </Button>
                      {canCancel(appointment) && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowCancelDialog(true);
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-medium">Reason:</div>
                    <div className="text-sm text-gray-600">
                      {appointment.reason}
                    </div>
                  </div>
                  {appointment.notes && (
                    <div className="mt-2">
                      <div className="text-sm font-medium">Notes:</div>
                      <div className="text-sm text-gray-600">
                        {appointment.notes}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Keep Appointment
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelAppointment}
            >
              Yes, Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Appointments;
