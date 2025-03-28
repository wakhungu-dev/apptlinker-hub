
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getAppointmentsByDoctor, getAppointmentsByPatient } from "@/lib/mock-data";
import { Appointment } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  UserPlus,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === "scheduled" || apt.status === "confirmed"
  );

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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/appointments/new">
            <Button className="bg-health-600 hover:bg-health-700">
              <Calendar className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">
              Upcoming Appointments
            </CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-sm text-muted-foreground">
              {upcomingAppointments.length === 0
                ? "No upcoming appointments"
                : upcomingAppointments.length === 1
                ? "Next appointment is coming up soon"
                : `You have ${upcomingAppointments.length} upcoming appointments`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Next Appointment</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div>
                <div className="text-lg font-semibold">
                  {user?.role === "patient"
                    ? upcomingAppointments[0].doctorName
                    : upcomingAppointments[0].patientName}
                </div>
                <div className="text-sm text-muted-foreground mb-1">
                  {formatDate(upcomingAppointments[0].date)} at{" "}
                  {upcomingAppointments[0].startTime}
                </div>
                <Badge
                  className={getStatusColor(upcomingAppointments[0].status)}
                  variant="outline"
                >
                  {getStatusIcon(upcomingAppointments[0].status)}
                  <span className="ml-1 capitalize">
                    {upcomingAppointments[0].status}
                  </span>
                </Badge>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No upcoming appointments scheduled
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
            <UserPlus className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/appointments/new">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
            </Link>
            {user?.role === "patient" && (
              <Link to="/doctors">
                <Button variant="outline" className="w-full justify-start">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Find Doctors
                </Button>
              </Link>
            )}
            {user?.role === "doctor" && (
              <Link to="/patients">
                <Button variant="outline" className="w-full justify-start">
                  <UserPlus className="mr-2 h-4 w-4" />
                  View Patients
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
          <CardDescription>
            View your recent and upcoming appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-4">No appointments found</div>
          ) : (
            <div className="space-y-4">
              {appointments.slice(0, 5).map((appointment) => (
                <div
                  key={appointment.id}
                  className="border rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="bg-health-100 text-health-800 h-12 w-12 rounded-full flex items-center justify-center">
                        <Calendar className="h-6 w-6" />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">
                        {user?.role === "patient"
                          ? appointment.doctorName
                          : appointment.patientName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(appointment.date)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.startTime} - {appointment.endTime}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Reason: {appointment.reason}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
