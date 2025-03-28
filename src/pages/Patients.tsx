
import { useEffect, useState } from "react";
import { getPatients } from "@/lib/mock-data";
import { Patient } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, ClipboardList, Search, User } from "lucide-react";

const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        const data = await getPatients();
        setPatients(data);
        setFilteredPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      setFilteredPatients(
        patients.filter(
          (patient) =>
            patient.name.toLowerCase().includes(term) ||
            patient.email.toLowerCase().includes(term) ||
            patient.phone.includes(term) ||
            (patient.insuranceProvider &&
              patient.insuranceProvider.toLowerCase().includes(term))
        )
      );
    } else {
      setFilteredPatients(patients);
    }
  }, [searchTerm, patients]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse flex flex-col items-center justify-center">
          <div className="rounded-full bg-gray-200 h-12 w-12 flex items-center justify-center mb-4">
            <User className="h-6 w-6 text-gray-400" />
          </div>
          <div className="h-4 bg-gray-200 rounded-full w-48 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded-full w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">
            Manage and review patient information
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search patients by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredPatients.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <User className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium">No Patients Found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? "Try adjusting your search criteria" : "No patients are registered yet"}
          </p>
          {searchTerm && (
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <Card key={patient.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-health-100 text-health-800 h-10 w-10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <CardDescription className="text-sm">
                      Patient ID: {patient.id}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Date of Birth:</div>
                  <div>
                    {new Date(patient.dateOfBirth).toLocaleDateString()}
                  </div>
                  <div className="text-muted-foreground">Phone:</div>
                  <div>{patient.phone}</div>
                  <div className="text-muted-foreground">Email:</div>
                  <div className="truncate">{patient.email}</div>
                  <div className="text-muted-foreground">Insurance:</div>
                  <div>
                    {patient.insuranceProvider || "Not provided"}
                  </div>
                </div>

                {patient.medicalHistory && patient.medicalHistory.length > 0 && (
                  <div className="border-t pt-3 mt-3">
                    <div className="text-sm font-medium mb-1">Medical History:</div>
                    <ul className="text-sm text-gray-600 space-y-1 pl-5 list-disc">
                      {patient.medicalHistory.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-between pt-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/patients/${patient.id}`}>
                      <ClipboardList className="mr-2 h-4 w-4" />
                      Medical Records
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    className="bg-health-600 hover:bg-health-700"
                    asChild
                  >
                    <Link to="/appointments/new">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Patients;
