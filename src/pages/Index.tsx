
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarCheck, CalendarDays, CheckCircle, FileText, Heart, ShieldCheck, User, UserPlus, Users } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-health-50 to-white">
      {/* Header/Navigation */}
      <header className="px-6 py-4 md:px-12 lg:px-20 flex items-center justify-between">
        <div className="flex items-center">
          <Heart className="h-8 w-8 text-health-600 mr-2" />
          <span className="text-2xl font-bold text-health-800">HealthSync</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-700 hover:text-health-700 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-gray-700 hover:text-health-700 transition-colors">
            How It Works
          </a>
          <a href="#testimonials" className="text-gray-700 hover:text-health-700 transition-colors">
            Testimonials
          </a>
        </nav>
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="outline" className="hidden md:flex">
              Sign In
            </Button>
          </Link>
          <Link to="/login">
            <Button className="bg-health-600 hover:bg-health-700">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-20 text-center md:text-left md:flex items-center justify-between">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Modern Healthcare <br />
            <span className="text-health-700">Appointment System</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
            Streamline your healthcare journey with our intuitive appointment
            scheduling system designed for patients and healthcare providers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/login">
              <Button className="w-full sm:w-auto bg-health-600 hover:bg-health-700 text-lg px-8 py-6">
                Schedule Appointment
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="w-full sm:w-auto text-lg px-8 py-6">
                Provider Login
              </Button>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-64 h-64 bg-health-100 rounded-full opacity-50"></div>
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-health-200 rounded-full opacity-50"></div>
            <Card className="relative bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-md">
              <div className="p-8">
                <div className="bg-health-50 p-4 rounded-lg mb-6 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Your next appointment</p>
                    <p className="font-semibold text-gray-900">Dr. Emily Carter</p>
                  </div>
                  <CalendarCheck className="h-10 w-10 text-health-600" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center p-3 border rounded-lg">
                    <CalendarDays className="h-5 w-5 text-health-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">Tomorrow, 10:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 border rounded-lg">
                    <User className="h-5 w-5 text-health-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Doctor</p>
                      <p className="font-medium">Dr. Emily Carter</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 border rounded-lg">
                    <FileText className="h-5 w-5 text-health-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Reason</p>
                      <p className="font-medium">Annual check-up</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-health-600 hover:bg-health-700">
                  View Details
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 md:px-12 lg:px-20 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose HealthSync
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform offers a comprehensive solution for modern healthcare scheduling and management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 border rounded-xl hover:shadow-md transition-shadow">
            <div className="bg-health-100 h-12 w-12 rounded-full flex items-center justify-center mb-4">
              <CalendarCheck className="h-6 w-6 text-health-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Scheduling</h3>
            <p className="text-gray-600">
              Book appointments with your preferred healthcare providers in just a few clicks.
            </p>
          </div>

          <div className="p-6 border rounded-xl hover:shadow-md transition-shadow">
            <div className="bg-health-100 h-12 w-12 rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-health-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Provider Network</h3>
            <p className="text-gray-600">
              Access a wide network of qualified healthcare professionals across various specialties.
            </p>
          </div>

          <div className="p-6 border rounded-xl hover:shadow-md transition-shadow">
            <div className="bg-health-100 h-12 w-12 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-health-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Medical Records</h3>
            <p className="text-gray-600">
              Securely store and access your medical records and history in one place.
            </p>
          </div>

          <div className="p-6 border rounded-xl hover:shadow-md transition-shadow">
            <div className="bg-health-100 h-12 w-12 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="h-6 w-6 text-health-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Privacy & Security</h3>
            <p className="text-gray-600">
              Your health information is protected with industry-leading security measures.
            </p>
          </div>

          <div className="p-6 border rounded-xl hover:shadow-md transition-shadow">
            <div className="bg-health-100 h-12 w-12 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="h-6 w-6 text-health-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">For Providers</h3>
            <p className="text-gray-600">
              Healthcare providers can efficiently manage patient appointments and records.
            </p>
          </div>

          <div className="p-6 border rounded-xl hover:shadow-md transition-shadow">
            <div className="bg-health-100 h-12 w-12 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-health-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Reminders</h3>
            <p className="text-gray-600">
              Never miss an appointment with automated reminders and notifications.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-6 md:px-12 lg:px-20 bg-health-50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform makes healthcare scheduling simple and efficient for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <div className="bg-health-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserPlus className="h-8 w-8 text-health-600" />
            </div>
            <div className="bg-health-600 text-white text-xl font-bold h-8 w-8 rounded-full flex items-center justify-center mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-3">Create Account</h3>
            <p className="text-gray-600">
              Sign up and create your personal health profile to get started.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <div className="bg-health-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="h-8 w-8 text-health-600" />
            </div>
            <div className="bg-health-600 text-white text-xl font-bold h-8 w-8 rounded-full flex items-center justify-center mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-3">Find Providers</h3>
            <p className="text-gray-600">
              Browse our network of healthcare professionals and specialties.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <div className="bg-health-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarDays className="h-8 w-8 text-health-600" />
            </div>
            <div className="bg-health-600 text-white text-xl font-bold h-8 w-8 rounded-full flex items-center justify-center mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-3">Schedule Appointment</h3>
            <p className="text-gray-600">
              Select a convenient time slot and confirm your appointment.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/login">
            <Button className="bg-health-600 hover:bg-health-700 text-lg px-8 py-6">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-6 md:px-12 lg:px-20 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from patients and healthcare providers who use our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-health-50 p-8 rounded-xl">
            <p className="text-gray-700 mb-6">
              "HealthSync has transformed how I manage my healthcare appointments. The platform is intuitive and saves me so much time!"
            </p>
            <div className="flex items-center">
              <div className="bg-health-200 h-12 w-12 rounded-full flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-health-600" />
              </div>
              <div>
                <p className="font-semibold">Sarah Johnson</p>
                <p className="text-sm text-gray-500">Patient</p>
              </div>
            </div>
          </div>

          <div className="bg-health-50 p-8 rounded-xl">
            <p className="text-gray-700 mb-6">
              "As a healthcare provider, HealthSync has streamlined my practice management and reduced no-shows by over 40%."
            </p>
            <div className="flex items-center">
              <div className="bg-health-200 h-12 w-12 rounded-full flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-health-600" />
              </div>
              <div>
                <p className="font-semibold">Dr. James Rodriguez</p>
                <p className="text-sm text-gray-500">Orthopedic Specialist</p>
              </div>
            </div>
          </div>

          <div className="bg-health-50 p-8 rounded-xl">
            <p className="text-gray-700 mb-6">
              "I love being able to access all my medical records in one place. The appointment scheduling process is so simple!"
            </p>
            <div className="flex items-center">
              <div className="bg-health-200 h-12 w-12 rounded-full flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-health-600" />
              </div>
              <div>
                <p className="font-semibold">Michael Wilson</p>
                <p className="text-sm text-gray-500">Patient</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 md:px-12 lg:px-20 bg-health-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-xl text-health-50 mb-8">
            Join thousands of patients and healthcare providers who trust HealthSync.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/login">
              <Button className="w-full sm:w-auto bg-white text-health-600 hover:bg-health-50 text-lg px-8 py-6">
                Create Account
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <Heart className="h-6 w-6 text-health-500 mr-2" />
              <span className="text-xl font-bold">HealthSync</span>
            </div>
            <p className="text-gray-400">
              Modern healthcare appointment scheduling system for patients and providers.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">HIPAA Compliance</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                support@healthsync.com
              </li>
              <li className="text-gray-400">
                (555) 123-4567
              </li>
              <li className="text-gray-400">
                123 Health Avenue, Medical District, CA 90210
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} HealthSync. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
