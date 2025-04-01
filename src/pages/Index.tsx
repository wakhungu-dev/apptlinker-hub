
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="hero-gradient absolute inset-0 opacity-90"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white">HealthSync</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link to="/dashboard">
                  <Button variant="default" className="bg-gradient-to-r from-health-600 to-purple-600 border-0 hover:from-health-700 hover:to-purple-700">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" className="bg-white bg-opacity-85 text-health-700 hover:bg-opacity-100">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="default" className="bg-gradient-to-r from-health-600 to-purple-600 border-0 hover:from-health-700 hover:to-purple-700">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="relative pt-12 pb-20 sm:pt-16 lg:pt-32 lg:pb-28 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Your Health, <span className="text-gradient">Our Priority</span>
                </h1>
                <p className="mt-6 text-xl text-white">
                  Schedule appointments with healthcare professionals seamlessly. HealthSync makes managing your medical appointments easy and stress-free.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  {user ? (
                    <Link to="/appointments/new">
                      <Button size="lg" className="px-8 bg-gradient-to-r from-health-600 to-purple-600 border-0 hover:from-health-700 hover:to-purple-700">
                        Book an Appointment
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/register">
                      <Button size="lg" className="px-8 bg-gradient-to-r from-health-600 to-purple-600 border-0 hover:from-health-700 hover:to-purple-700">
                        Get Started
                      </Button>
                    </Link>
                  )}
                  <Link to="/doctors" className="text-base font-semibold leading-7 text-white hover:text-health-100">
                    Browse Doctors <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <img
                  src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  alt="Healthcare"
                  className="rounded-lg shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="features-gradient bg-opacity-85 backdrop-blur-md py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-health-600">Healthcare Made Simple</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage your healthcare
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              HealthSync offers comprehensive tools for patients and healthcare providers to streamline appointment scheduling and record management.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {/* Feature cards */}
              <div className="relative pl-16 feature-card p-6 rounded-lg transition-transform duration-300 hover:scale-105">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-health-500 to-purple-600 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                  </svg>
                </div>
                <p className="text-base font-semibold leading-7 text-gray-900">Easy Appointment Scheduling</p>
                <p className="mt-2 text-base leading-7 text-gray-600">Book appointments with your preferred healthcare providers in just a few clicks. Choose from available time slots and manage your schedule effortlessly.</p>
              </div>
              
              <div className="relative pl-16 feature-card p-6 rounded-lg transition-transform duration-300 hover:scale-105">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-health-500 to-purple-600 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <p className="text-base font-semibold leading-7 text-gray-900">Find the Right Specialist</p>
                <p className="mt-2 text-base leading-7 text-gray-600">Browse through our extensive network of qualified healthcare professionals. Filter by specialization to find the perfect match for your needs.</p>
              </div>
              
              <div className="relative pl-16 feature-card p-6 rounded-lg transition-transform duration-300 hover:scale-105">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-health-500 to-purple-600 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                </div>
                <p className="text-base font-semibold leading-7 text-gray-900">Secure Medical Records</p>
                <p className="mt-2 text-base leading-7 text-gray-600">Your medical history is securely stored and easily accessible when needed. Share information with healthcare providers efficiently and securely.</p>
              </div>
              
              <div className="relative pl-16 feature-card p-6 rounded-lg transition-transform duration-300 hover:scale-105">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-health-500 to-purple-600 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                </div>
                <p className="text-base font-semibold leading-7 text-gray-900">Appointment Reminders</p>
                <p className="mt-2 text-base leading-7 text-gray-600">Never miss an appointment again with our automated reminder system. Receive notifications before your scheduled visits.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="cta-gradient bg-opacity-90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            <span className="block">Ready to take control of your healthcare?</span>
            <span className="block text-gradient-alt">Create your account today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to="/register">
                <Button variant="default" size="lg" className="bg-gradient-to-r from-health-500 to-purple-600 border-0 hover:from-health-600 hover:to-purple-700 text-white hover:text-white">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link to="/doctors">
                <Button variant="outline" size="lg" className="bg-white/20 text-white border-health-100 hover:bg-white/30">
                  View Doctors
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white bg-opacity-85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <div className="mt-8 flex justify-center space-x-6">
            <p className="text-center text-base text-gray-500">
              &copy; 2023 HealthSync. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
