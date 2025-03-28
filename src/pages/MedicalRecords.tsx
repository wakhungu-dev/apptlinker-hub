
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, FileText, FileLock, AlertTriangle } from "lucide-react";

const MedicalRecords = () => {
  const { user, patientData } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");

  if (!user || user.role !== "patient") {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FileLock className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Restricted</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access medical records.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Medical Records</h1>
        <p className="text-muted-foreground">
          View and manage your health information
        </p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center mb-6">
          <div className="bg-health-100 text-health-800 h-12 w-12 rounded-full flex items-center justify-center mr-4">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Your Medical Records</h2>
            <p className="text-gray-600">
              Secure access to your complete health history
            </p>
          </div>
          <div className="ml-auto flex items-center">
            <Lock className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600">End-to-end encrypted</span>
          </div>
        </div>

        <Tabs defaultValue="personal" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal Health</TabsTrigger>
            <TabsTrigger value="visits">Visit History</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Health Information</CardTitle>
                <CardDescription>
                  Your health profile and medical conditions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {patientData?.medicalHistory && patientData.medicalHistory.length > 0 ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Medical Conditions
                      </h3>
                      <ul className="space-y-2 pl-5 list-disc">
                        {patientData.medicalHistory.map((condition, index) => (
                          <li key={index} className="text-gray-700">
                            {condition}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Allergies & Medications
                      </h3>
                      <p className="text-gray-600 italic">
                        No allergies or current medications recorded.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
                    <h3 className="text-lg font-medium">No Records Found</h3>
                    <p className="text-gray-600 mb-4">
                      We don't have any medical history on file for you.
                    </p>
                    <Button className="bg-health-600 hover:bg-health-700">
                      Update Health Profile
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visits" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Visit History</CardTitle>
                <CardDescription>
                  Record of your past appointments and treatments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
                  <h3 className="text-lg font-medium">No Visit History</h3>
                  <p className="text-gray-600 mb-4">
                    We don't have any recorded visits or treatments on file.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Medical Documents</CardTitle>
                <CardDescription>
                  Test results, imaging, and other medical documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <FileLock className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium">No Documents Found</h3>
                  <p className="text-gray-600 mb-4">
                    You don't have any medical documents available.
                  </p>
                  <Button className="bg-health-600 hover:bg-health-700">
                    Upload Documents
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MedicalRecords;
