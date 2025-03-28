
import { useEffect, useState } from "react";
import { getDoctors, getSpecializations } from "@/lib/mock-data";
import { Doctor, Specialization } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar, Filter, Search, User } from "lucide-react";

const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [doctorsData, specializationsData] = await Promise.all([
          getDoctors(),
          getSpecializations(),
        ]);
        setDoctors(doctorsData);
        setFilteredDoctors(doctorsData);
        setSpecializations(specializationsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let results = doctors;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(term) ||
          doctor.specializations.some((spec) =>
            spec.name.toLowerCase().includes(term)
          ) ||
          doctor.biography.toLowerCase().includes(term)
      );
    }

    // Filter by selected specializations
    if (selectedSpecializations.length > 0) {
      results = results.filter((doctor) =>
        doctor.specializations.some((spec) =>
          selectedSpecializations.includes(spec.id)
        )
      );
    }

    setFilteredDoctors(results);
  }, [searchTerm, selectedSpecializations, doctors]);

  const handleSpecializationChange = (specializationId: string) => {
    setSelectedSpecializations((prev) =>
      prev.includes(specializationId)
        ? prev.filter((id) => id !== specializationId)
        : [...prev, specializationId]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSpecializations([]);
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Doctors</h1>
          <p className="text-muted-foreground">
            Find healthcare providers by specialty
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                {selectedSpecializations.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-health-100 text-health-800"
                  >
                    {selectedSpecializations.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Specializations</h4>
                <div className="grid grid-cols-1 gap-2">
                  {specializations.map((specialization) => (
                    <div
                      key={specialization.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`specialization-${specialization.id}`}
                        checked={selectedSpecializations.includes(
                          specialization.id
                        )}
                        onCheckedChange={() =>
                          handleSpecializationChange(specialization.id)
                        }
                      />
                      <Label
                        htmlFor={`specialization-${specialization.id}`}
                        className="flex-grow cursor-pointer"
                      >
                        {specialization.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {(searchTerm || selectedSpecializations.length > 0) && (
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <User className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium">No Doctors Found</h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search criteria
          </p>
          <Button variant="outline" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-health-100 to-health-50 py-8 px-4 flex flex-col items-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-md mb-3">
                    <User className="h-10 w-10 text-health-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-center">{doctor.name}</h3>
                  <div className="flex flex-wrap gap-1 justify-center mt-2">
                    {doctor.specializations.map((specialization) => (
                      <Badge
                        key={specialization.id}
                        variant="outline"
                        className="bg-white/80 text-health-800"
                      >
                        {specialization.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {doctor.biography}
                  </p>
                  
                  <h4 className="font-medium text-sm mb-2">Availability</h4>
                  <div className="space-y-1 mb-4">
                    {doctor.availability.map((slot) => (
                      <div
                        key={slot.id}
                        className="text-sm flex items-center text-gray-600"
                      >
                        <div className="w-24 font-medium">{slot.day}:</div>
                        <div>
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center mt-4">
                    <Link to="/appointments/new">
                      <Button className="bg-health-600 hover:bg-health-700">
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Appointment
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;
