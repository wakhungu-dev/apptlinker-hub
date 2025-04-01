
import { ReactNode, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  ClipboardList,
  Home,
  LogOut,
  Menu,
  Settings,
  User,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Define navigation items based on user role
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    ...(user.role === "admin" || user.role === "doctor"
      ? [
          {
            path: "/patients",
            label: "Patients",
            icon: Users,
          },
        ]
      : []),
    ...(user.role === "admin" || user.role === "patient"
      ? [
          {
            path: "/doctors",
            label: "Doctors",
            icon: User,
          },
        ]
      : []),
    { path: "/appointments", label: "Appointments", icon: Calendar },
    ...(user.role === "patient"
      ? [
          {
            path: "/medical-records",
            label: "Medical Records",
            icon: ClipboardList,
          },
        ]
      : []),
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navbar for mobile */}
      <div className="bg-white bg-opacity-90 backdrop-blur-sm shadow md:hidden flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <span className="text-health-700 font-bold text-lg">HealthSync</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <aside
          className={cn(
            "bg-white bg-opacity-90 backdrop-blur-sm shadow-md fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out",
            "md:relative md:translate-x-0 flex flex-col w-64",
            isMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          <div className="p-6 flex items-center justify-center md:justify-start">
            <span className="text-health-700 font-bold text-2xl">HealthSync</span>
          </div>

          <div className="px-4 py-2">
            <div className="flex items-center space-x-3 p-2 rounded-lg mb-4">
              <Avatar className="w-10 h-10 bg-health-600 text-white">
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500 capitalize">
                  {user.role}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                  location.pathname === item.path
                    ? "bg-health-50 text-health-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4">
            <Button
              variant="outline"
              className="w-full justify-start text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8 ml-0 md:ml-64 bg-white bg-opacity-75 backdrop-blur-sm rounded-lg shadow">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
