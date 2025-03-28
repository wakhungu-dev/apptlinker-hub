
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { 
  BellRing, 
  Lock, 
  LogOut, 
  Mail, 
  Phone, 
  Shield, 
  User 
} from "lucide-react";

const Settings = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    appointments: true,
    updates: false,
  });

  const handleSaveProfile = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    }, 1000);
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Notification Preferences Saved",
        description: "Your notification settings have been updated.",
      });
    }, 1000);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    defaultValue={user?.name}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email}
                    placeholder="Your email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="Your phone number"
                    defaultValue=""
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    defaultValue=""
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Your street address"
                  defaultValue=""
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Your city"
                    defaultValue=""
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="Your state"
                    defaultValue=""
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    placeholder="Your zip code"
                    defaultValue=""
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={handleSaveProfile}
                className="bg-health-600 hover:bg-health-700"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter your current password"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter a new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </div>
                </div>
                <Button variant="outline">
                  <Lock className="mr-2 h-4 w-4" />
                  Set Up
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                className="bg-health-600 hover:bg-health-700"
                disabled={loading}
              >
                Update Password
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BellRing className="mr-2 h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <div className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </div>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, email: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <div className="text-sm text-muted-foreground">
                    Receive notifications via text message
                  </div>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={notifications.sms}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, sms: checked })
                  }
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="font-medium">Notification Types</div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="appointmentNotifications">
                    Appointment Reminders
                  </Label>
                  <Switch
                    id="appointmentNotifications"
                    checked={notifications.appointments}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        appointments: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="updatesNotifications">
                    System Updates & News
                  </Label>
                  <Switch
                    id="updatesNotifications"
                    checked={notifications.updates}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, updates: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-health-600 hover:bg-health-700"
                onClick={handleSaveNotifications}
                disabled={loading}
              >
                Save Preferences
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Contact Details
              </CardTitle>
              <CardDescription>
                Manage how we can reach you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  defaultValue={user?.email}
                  placeholder="Email for communications"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  defaultValue=""
                  placeholder="Phone for communications"
                />
                <div className="flex items-center space-x-2 mt-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Used for appointment reminders
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
              </CardTitle>
              <CardDescription>
                Securely sign out from your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
