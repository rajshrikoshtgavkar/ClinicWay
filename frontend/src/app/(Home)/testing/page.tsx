"use client";
import React, { useState, useEffect } from "react";

import {
  IconCalendar,
  IconClock,
  IconMapPin,
  IconUsers,
  IconBellBolt,
  IconVideo,
  IconCircleCheck,
  IconUxCircle,
  IconAlertCircle,
  IconPlusEqual,
  IconUser,
  IconPhone,
  IconMail,
  IconHome,
  IconCreditCard,
  IconWallet,
} from "@tabler/icons-react";

// Mock data
const mockDoctors = [
  {
    id: 1,
    name: "Dr. Rajesh Kumar",
    specialization: "Cardiologist",
    hospital: "City Heart Hospital",
    area: "Koregaon Park",
    city: "Pune",
    timing: "9:00 AM - 5:00 PM",
    fee: 800,
    rating: 4.8,
    experience: "15 years",
    currentQueue: 12,
    avgTime: 15,
    maxPatients: { morning: 20, afternoon: 15, evening: 10 },
    location: "https://maps.google.com",
    status: "Available",
  },
];

const App = () => {
  const [view, setView] = useState("landing"); // landing, login, register, home, doctorList, doctorDetails, booking, queue, compounder, doctor
  const [userRole, setUserRole] = useState("patient"); // patient, compounder, doctor
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [booking, setBooking] = useState<any>(null);
  const [queue, setQueue] = useState<any[]>([]);
  const [filters, setFilters] = useState({ specialization: "all" });

  // Simulated queue management
  useEffect(() => {
    if (booking) {
      const interval = setInterval(() => {
        setQueue((prev) => {
          const newQueue = [...prev];
          if (newQueue.length > 0 && Math.random() > 0.7) {
            newQueue.shift();
          }
          return newQueue;
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [booking]);

  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Smart Healthcare Queue Management
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Book appointments, track queue status in real-time, and save your
            valuable time
          </p>
          <button
            onClick={() => setView("register")}
            className="px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition shadow-lg"
          >
            Get Started Free
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <IconUsers className="text-indigo-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Real-Time Queue</h3>
            <p className="text-gray-600">
              Track your position in queue and get live updates on wait times
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <IconBellBolt className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Smart Notifications</h3>
            <p className="text-gray-600">
              Set custom alarms and receive timely updates about your
              appointment
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <IconVideo className="text-purple-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Online Consultation</h3>
            <p className="text-gray-600">
              Book video consultations with doctors from the comfort of your
              home
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const LoginPage = () => {
    const [credentials, setCredentials] = useState({
      email: "",
      password: "",
      role: "patient",
    });

    const handleLogin = () => {
      setUser({
        name: "John Doe",
        email: credentials.email,
        phone: "+91 98765 43210",
        profileImage: "",
        role: credentials.role,
      });
      setUserRole(credentials.role);
      if (credentials.role === "patient") {
        setView("home");
      } else if (credentials.role === "compounder") {
        setView("compounder");
      } else {
        setView("doctor");
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconUser className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Login to continue</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Login As
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={credentials.role}
                onChange={(e) =>
                  setCredentials({ ...credentials, role: e.target.value })
                }
              >
                <option value="patient">Patient</option>
                <option value="compounder">Compounder/Staff</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="your@email.com"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              Login
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setView("register")}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Don't have an account? Register
            </button>
          </div>
        </div>
      </div>
    );
  };

  const RegisterPage = () => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "patient",
    });

    const handleRegister = () => {
      setUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });
      setUserRole(formData.role);
      setView("home");
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600 mt-2">Join MediQueue today</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Register As
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="patient">Patient</option>
                <option value="compounder">Compounder/Staff</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            <button
              onClick={handleRegister}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              Register
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setView("login")}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Already have an account? Login
            </button>
          </div>
        </div>
      </div>
    );
  };

  const HomePage = () => (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <IconCalendar className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-indigo-600">
              MediQueue
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.name}</span>
            <button
              onClick={() => {
                setView("landing");
                setUser(null);
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find a Doctor
          </h1>
          <p className="text-gray-600">
            Search for doctors in your area and book appointments
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">Select City</option>
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                <option value="">Select Area</option>
                <option value="Koregaon Park">Koregaon Park</option>
                <option value="Kothrud">Kothrud</option>
                <option value="Deccan">Deccan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={filters.specialization}
                onChange={(e) =>
                  setFilters({ ...filters, specialization: e.target.value })
                }
              >
                <option value="all">All Specializations</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Orthopedic">Orthopedic</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => setView("doctorList")}
            className="mt-4 w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Search Doctors
          </button>
        </div>

        {booking && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-4">Your Active Appointment</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">{booking.doctor}</p>
                <p className="opacity-90">Token: #{booking.token}</p>
              </div>
              <button
                onClick={() => setView("queue")}
                className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                View Queue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const DoctorListPage = () => {
    const filteredDoctors = mockDoctors.filter(
      (doc) =>
        (selectedCity === "" || doc.city === selectedCity) &&
        (selectedArea === "" || doc.area === selectedArea) &&
        (filters.specialization === "all" ||
          doc.specialization === filters.specialization),
    );

    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <button
              onClick={() => setView("home")}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Back
            </button>
            <span className="text-gray-700">{user?.name}</span>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Available Doctors {selectedArea && `in ${selectedArea}`}
          </h1>

          <div className="grid gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                        <IconUser className="text-indigo-600" size={32} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {doctor.name}
                        </h3>
                        <p className="text-indigo-600 font-medium">
                          {doctor.specialization}
                        </p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <IconHome size={18} />
                        <span>{doctor.hospital}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <IconMapPin size={18} />
                        <span>
                          {doctor.area}, {doctor.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <IconClock size={18} />
                        <span>{doctor.timing}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <IconUsers size={18} />
                        <span>Queue: {doctor.currentQueue} patients</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        ⭐ {doctor.rating}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {doctor.experience} exp
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        ₹{doctor.fee}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setView("doctorDetails");
                    }}
                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const DoctorDetailsPage = () => {
    const [consultationType, setConsultationType] = useState("offline");

    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button
              onClick={() => setView("doctorList")}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Back to Doctors
            </button>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
                <IconUser className="text-indigo-600" size={48} />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedDoctor?.name}
                </h1>
                <p className="text-xl text-indigo-600 font-medium mb-3">
                  {selectedDoctor?.specialization}
                </p>
                <div className="flex items-center gap-4">
                  <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium">
                    ⭐ {selectedDoctor?.rating} Rating
                  </span>
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium">
                    {selectedDoctor?.experience} Experience
                  </span>
                  <span
                    className={`px-4 py-2 ${
                      selectedDoctor?.status === "Available"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    } rounded-full font-medium`}
                  >
                    {selectedDoctor?.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <IconHome className="text-indigo-600" size={20} />
                  <div>
                    <p className="font-semibold">Hospital</p>
                    <p>{selectedDoctor?.hospital}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <IconMapPin className="text-indigo-600" size={20} />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p>
                      {selectedDoctor?.area}, {selectedDoctor?.city}
                    </p>
                    <a
                      href={selectedDoctor?.location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline text-sm"
                    >
                      View on Maps →
                    </a>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <IconClock className="text-indigo-600" size={20} />
                  <div>
                    <p className="font-semibold">Timing</p>
                    <p>{selectedDoctor?.timing}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <IconUsers className="text-indigo-600" size={20} />
                  <div>
                    <p className="font-semibold">Current Queue</p>
                    <p>{selectedDoctor?.currentQueue} patients waiting</p>
                    <p className="text-sm text-gray-500">
                      Avg. time: {selectedDoctor?.avgTime} mins/patient
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Consultation Fee</h3>
              <p className="text-3xl font-bold text-indigo-600">
                ₹{selectedDoctor?.fee}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-4">
                Select Consultation Type
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setConsultationType("offline")}
                  className={`p-4 rounded-lg border-2 transition ${
                    consultationType === "offline"
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconHome
                      className={
                        consultationType === "offline"
                          ? "text-indigo-600"
                          : "text-gray-400"
                      }
                      size={24}
                    />
                    <div className="text-left">
                      <p className="font-semibold">In-Person Visit</p>
                      <p className="text-sm text-gray-600">
                        Visit hospital for consultation
                      </p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setConsultationType("online")}
                  className={`p-4 rounded-lg border-2 transition ${
                    consultationType === "online"
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconVideo
                      className={
                        consultationType === "online"
                          ? "text-indigo-600"
                          : "text-gray-400"
                      }
                      size={24}
                    />
                    <div className="text-left">
                      <p className="font-semibold">Online Consultation</p>
                      <p className="text-sm text-gray-600">
                        IconVideo call with doctor
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <button
              onClick={() => setView("booking")}
              className="w-full py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    );
  };

  const BookingPage = () => {
    const [patientType, setPatientType] = useState("self");
    const [patientDetails, setPatientDetails] = useState({
      name: "",
      age: "",
      phone: "",
    });
    const [paymentMethod, setPaymentMethod] = useState("");
    const [showPayment, setShowPayment] = useState(false);

    const handleBooking = () => {
      if (!paymentMethod) {
        setShowPayment(true);
        return;
      }

      const newBooking = {
        id: Date.now(),
        doctor: selectedDoctor?.name,
        token: Math.floor(Math.random() * 100) + selectedDoctor?.currentQueue,
        patient: patientType === "self" ? user?.name : patientDetails.name,
        position: selectedDoctor?.currentQueue + 1,
        estimatedTime:
          (selectedDoctor?.currentQueue + 1) * selectedDoctor?.avgTime,
        paymentMethod,
      };
      setBooking(newBooking);

      const initialQueue = Array.from(
        { length: selectedDoctor?.currentQueue || 0 },
        (_, i) => ({
          id: i + 1,
          token: i + 1,
          name: `Patient ${i + 1}`,
          status: "waiting",
        }),
      );
      initialQueue.push({
        id: newBooking.token,
        token: newBooking.token,
        name: newBooking.patient,
        status: "waiting",
      });
      setQueue(initialQueue);

      setView("queue");
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button
              onClick={() => setView("doctorDetails")}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Back
            </button>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Book Appointment
            </h2>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Patient Information
              </h3>
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setPatientType("self")}
                  className={`flex-1 py-3 rounded-lg border-2 font-medium transition ${
                    patientType === "self"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  For Self
                </button>
                <button
                  onClick={() => setPatientType("other")}
                  className={`flex-1 py-3 rounded-lg border-2 font-medium transition ${
                    patientType === "other"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  For Someone Else
                </button>
              </div>

              {patientType === "other" && (
                <div className="space-y-4 mt-4">
                  <input
                    type="text"
                    placeholder="Patient Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={patientDetails.name}
                    onChange={(e) =>
                      setPatientDetails({
                        ...patientDetails,
                        name: e.target.value,
                      })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={patientDetails.age}
                    onChange={(e) =>
                      setPatientDetails({
                        ...patientDetails,
                        age: e.target.value,
                      })
                    }
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={patientDetails.phone}
                    onChange={(e) =>
                      setPatientDetails({
                        ...patientDetails,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">Doctor</span>
                <span className="font-semibold">{selectedDoctor?.name}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">Consultation Fee</span>
                <span className="font-semibold">₹{selectedDoctor?.fee}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Current Queue</span>
                <span className="font-semibold">
                  {selectedDoctor?.currentQueue} patients
                </span>
              </div>
            </div>

            {showPayment && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Payment Method
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setPaymentMethod("online")}
                    className={`w-full p-4 rounded-lg border-2 transition flex items-center gap-3 ${
                      paymentMethod === "online"
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <IconCreditCard
                      className={
                        paymentMethod === "online"
                          ? "text-indigo-600"
                          : "text-gray-400"
                      }
                      size={24}
                    />
                    <div className="text-left">
                      <p className="font-semibold">Pay Online (Razorpay)</p>
                      <p className="text-sm text-gray-600">
                        Pay now and confirm booking
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("cash")}
                    className={`w-full p-4 rounded-lg border-2 transition flex items-center gap-3 ${
                      paymentMethod === "cash"
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <IconWallet
                      className={
                        paymentMethod === "cash"
                          ? "text-indigo-600"
                          : "text-gray-400"
                      }
                      size={24}
                    />
                    <div className="text-left">
                      <p className="font-semibold">Pay at Hospital</p>
                      <p className="text-sm text-gray-600">
                        Pay cash during visit
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleBooking}
              className="w-full py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              {showPayment && paymentMethod === "online"
                ? "Proceed to Payment"
                : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const QueuePage = () => {
    const [showAlarmModal, setShowAlarmModal] = useState(false);
    const [alarmThreshold, setAlarmThreshold] = useState(3);

    const yourPosition = queue.findIndex((p) => p.isYou) + 1;
    const patientsAhead = yourPosition - 1;
    const estimatedTime = patientsAhead * (selectedDoctor?.avgTime || 15);

    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <button
              onClick={() => setView("home")}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← IconHome
            </button>
            <span className="text-gray-700">{user?.name}</span>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-8 text-white mb-6">
            <h2 className="text-3xl font-bold mb-6">Your Appointment Status</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-sm opacity-90 mb-1">Your Token</p>
                <p className="text-4xl font-bold">#{booking?.token}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-sm opacity-90 mb-1">Position in Queue</p>
                <p className="text-4xl font-bold">{yourPosition}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-sm opacity-90 mb-1">Patients Ahead</p>
                <p className="text-4xl font-bold">{patientsAhead}</p>
              </div>
            </div>
            <div className="mt-6 bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Estimated Wait Time</p>
                  <p className="text-2xl font-bold">{estimatedTime} mins*</p>
                  <p className="text-xs opacity-75 mt-1">
                    *May vary based on consultation time
                  </p>
                </div>
                <button
                  onClick={() => setShowAlarmModal(true)}
                  className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
                >
                  <IconBellBolt size={20} />
                  Set Alarm
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Doctor Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Doctor</p>
                <p className="font-semibold text-lg">{selectedDoctor?.name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Specialization</p>
                <p className="font-semibold text-lg">
                  {selectedDoctor?.specialization}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Hospital</p>
                <p className="font-semibold text-lg">
                  {selectedDoctor?.hospital}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                  <IconCircleCheck size={16} />
                  Doctor Available
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Queue Status
            </h3>
            <div className="space-y-3">
              {queue.map((patient, index) => (
                <div
                  key={patient.id}
                  className={`p-4 rounded-lg border-2 transition ${
                    patient.isYou
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                          patient.isYou
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {patient.isYou ? "You" : patient.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Token #{patient.token}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        patient.status === "waiting"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {patient.status === "waiting"
                        ? "Waiting"
                        : "In Consultation"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showAlarmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Set Reminder Alarm
              </h3>
              <p className="text-gray-600 mb-4">
                Get notified when your turn is approaching
              </p>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert me when there are
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={alarmThreshold}
                  onChange={(e) => setAlarmThreshold(Number(e.target.value))}
                >
                  <option value={1}>1 patient remaining</option>
                  <option value={2}>2 patients remaining</option>
                  <option value={3}>3 patients remaining</option>
                  <option value={5}>5 patients remaining</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAlarmModal(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert(
                      `Alarm set! You'll be notified when ${alarmThreshold} patients remain.`,
                    );
                    setShowAlarmModal(false);
                  }}
                  className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                >
                  Set Alarm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const CompounderView = () => {
    const [showAddPatient, setShowAddPatient] = useState(false);
    const [newPatient, setNewPatient] = useState({
      name: "",
      phone: "",
      type: "offline",
    });
    const [patients, setPatients] = useState([
      {
        id: 1,
        token: 1,
        name: "Ramesh Sharma",
        type: "online",
        status: "waiting",
        payment: "paid",
      },
      {
        id: 2,
        token: 2,
        name: "Priya Desai",
        type: "online",
        status: "waiting",
        payment: "paid",
      },
      {
        id: 3,
        token: 3,
        name: "Amit Kumar",
        type: "offline",
        status: "waiting",
        payment: "pending",
      },
    ]);
    const [doctorStatus, setDoctorStatus] = useState("not-arrived");

    const addPatient = () => {
      const newId = patients.length + 1;
      setPatients([
        ...patients,
        {
          id: newId,
          token: newId,
          name: newPatient.name,
          type: newPatient.type,
          status: "waiting",
          payment: "pending",
        },
      ]);
      setNewPatient({ name: "", phone: "", type: "offline" });
      setShowAddPatient(false);
    };

    const updateStatus = (id, status) => {
      setPatients(patients.map((p) => (p.id === id ? { ...p, status } : p)));
    };

    // const updateStatus = (
    //   id: (typeof patients)[number]["id"],
    //   status: (typeof patients)[number]["status"]
    // ) => {
    //   setPatients(
    //     patients.map((p) =>
    //       p.id === id ? { ...p, status } : p
    //     )
    //   );
    // };

    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Compounder Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                {selectedDoctor?.name || "Dr. Rajesh Kumar"}
              </p>
            </div>
            <button
              onClick={() => {
                setView("landing");
                setUser(null);
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Logout
            </button>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Total Patients</span>
                <IconUsers className="text-indigo-600" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {patients.length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Waiting</span>
                <IconClock className="text-yellow-600" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {patients.filter((p) => p.status === "waiting").length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Completed</span>
                <IconCircleCheck className="text-green-600" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {patients.filter((p) => p.status === "completed").length}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Doctor Status</h2>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={doctorStatus}
                onChange={(e) => setDoctorStatus(e.target.value)}
              >
                <option value="not-arrived">Not Arrived</option>
                <option value="arrived">Arrived</option>
                <option value="on-break">On Break</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full ${
                  doctorStatus === "arrived"
                    ? "bg-green-500"
                    : doctorStatus === "on-break"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              ></div>
              <span className="font-medium capitalize">
                {doctorStatus.replace("-", " ")}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Patient Queue</h2>
              <button
                onClick={() => setShowAddPatient(true)}
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <IconPlusEqual size={20} />
                Add Walk-in Patient
              </button>
            </div>

            <div className="space-y-3">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className="p-4 border-2 border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
                        {patient.token}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-lg">{patient.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              patient.type === "online"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {patient.type}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              patient.payment === "paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {patient.payment}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              patient.status === "waiting"
                                ? "bg-yellow-100 text-yellow-700"
                                : patient.status === "in-consultation"
                                  ? "bg-blue-100 text-blue-700"
                                  : patient.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                          >
                            {patient.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {patient.status === "waiting" && (
                        <button
                          onClick={() =>
                            updateStatus(patient.id, "in-consultation")
                          }
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                        >
                          Start
                        </button>
                      )}
                      {patient.status === "in-consultation" && (
                        <button
                          onClick={() => updateStatus(patient.id, "completed")}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => updateStatus(patient.id, "cancelled")}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showAddPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Add Walk-in Patient
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Patient Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={newPatient.name}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, name: e.target.value })
                  }
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={newPatient.phone}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, phone: e.target.value })
                  }
                />
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={newPatient.type}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, type: e.target.value })
                  }
                >
                  <option value="offline">Walk-in (Offline)</option>
                  <option value="online">Pre-booked (Online)</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddPatient(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addPatient}
                  className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
                >
                  Add Patient
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const DoctorView = () => {
    const [patients, setPatients] = useState([
      {
        id: 1,
        token: 1,
        name: "Ramesh Sharma",
        type: "online",
        consultationType: "offline",
        status: "waiting",
      },
      {
        id: 2,
        token: 2,
        name: "Priya Desai",
        type: "online",
        consultationType: "online",
        status: "waiting",
        meetingLink: "",
      },
      {
        id: 3,
        token: 3,
        name: "Amit Kumar",
        type: "offline",
        consultationType: "offline",
        status: "waiting",
      },
    ]);
    const [limits, setLimits] = useState({
      morning: 20,
      afternoon: 15,
      evening: 10,
    });
    const [showLimits, setShowLimits] = useState(false);

    const handleOnlineConsultation = (id, action) => {
      if (action === "accept") {
        const meetingLink =
          "https://meet.google.com/" + Math.random().toString(36).substring(7);
        setPatients(
          patients.map((p) =>
            p.id === id ? { ...p, status: "accepted", meetingLink } : p,
          ),
        );
        alert(`Online consultation accepted! Meeting link: ${meetingLink}`);
      } else {
        setPatients(
          patients.map((p) => (p.id === id ? { ...p, status: "rejected" } : p)),
        );
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Doctor Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Dr. Rajesh Kumar - Cardiologist
              </p>
            </div>
            <button
              onClick={() => {
                setView("landing");
                setUser(null);
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Logout
            </button>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-gray-600 mb-2">Today's Patients</p>
              <p className="text-3xl font-bold text-gray-900">
                {patients.length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-gray-600 mb-2">Waiting</p>
              <p className="text-3xl font-bold text-yellow-600">
                {patients.filter((p) => p.status === "waiting").length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-gray-600 mb-2">Online Requests</p>
              <p className="text-3xl font-bold text-blue-600">
                {
                  patients.filter(
                    (p) =>
                      p.consultationType === "online" && p.status === "waiting",
                  ).length
                }
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-gray-600 mb-2">Completed</p>
              <p className="text-3xl font-bold text-green-600">
                {patients.filter((p) => p.status === "completed").length}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Patient Limits
              </h2>
              <button
                onClick={() => setShowLimits(!showLimits)}
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
              >
                {showLimits ? "Hide" : "Manage Limits"}
              </button>
            </div>

            {showLimits && (
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Morning (9AM-12PM)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={limits.morning}
                    onChange={(e) =>
                      setLimits({ ...limits, morning: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Afternoon (12PM-3PM)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={limits.afternoon}
                    onChange={(e) =>
                      setLimits({
                        ...limits,
                        afternoon: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Evening (3PM-6PM)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={limits.evening}
                    onChange={(e) =>
                      setLimits({ ...limits, evening: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            )}

            {!showLimits && (
              <div className="flex items-center gap-6 text-gray-700">
                <div>
                  <span className="text-sm text-gray-600">Morning: </span>
                  <span className="font-semibold">
                    {limits.morning} patients
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Afternoon: </span>
                  <span className="font-semibold">
                    {limits.afternoon} patients
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Evening: </span>
                  <span className="font-semibold">
                    {limits.evening} patients
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Patient Queue
            </h2>
            <div className="space-y-3">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className={`p-4 border-2 rounded-lg ${
                    patient.consultationType === "online" &&
                    patient.status === "waiting"
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                          patient.consultationType === "online"
                            ? "bg-blue-600 text-white"
                            : "bg-indigo-100 text-indigo-600"
                        }`}
                      >
                        {patient.token}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-lg">
                            {patient.name}
                          </p>
                          {patient.consultationType === "online" && (
                            <IconVideo className="text-blue-600" size={20} />
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              patient.consultationType === "online"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {patient.consultationType === "online"
                              ? "Online Consultation"
                              : "In-Person Visit"}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              patient.status === "waiting"
                                ? "bg-yellow-100 text-yellow-700"
                                : patient.status === "accepted"
                                  ? "bg-green-100 text-green-700"
                                  : patient.status === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {patient.status}
                          </span>
                        </div>
                        {patient.meetingLink && (
                          <a
                            href={patient.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                          >
                            Join Meeting →
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {patient.consultationType === "online" &&
                        patient.status === "waiting" && (
                          <>
                            <button
                              onClick={() =>
                                handleOnlineConsultation(patient.id, "accept")
                              }
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium flex items-center gap-2"
                            >
                              <IconCircleCheck size={16} />
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                handleOnlineConsultation(patient.id, "reject")
                              }
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium flex items-center gap-2"
                            >
                              <IconUxCircle size={16} />
                              Reject
                            </button>
                          </>
                        )}
                      {patient.status === "accepted" && (
                        <button
                          onClick={() =>
                            setPatients(
                              patients.map((p) =>
                                p.id === patient.id
                                  ? { ...p, status: "completed" }
                                  : p,
                              ),
                            )
                          }
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render based on current view
  return (
    <div>
      {view === "landing" && <LandingPage />}
      {view === "login" && <LoginPage />}
      {view === "register" && <RegisterPage />}
      {view === "home" && <HomePage />}
      {view === "doctorList" && <DoctorListPage />}
      {view === "doctorDetails" && <DoctorDetailsPage />}
      {view === "booking" && <BookingPage />}
      {view === "queue" && <QueuePage />}
      {view === "compounder" && <CompounderView />}
      {view === "doctor" && <DoctorView />}
    </div>
  );
};

export default App;
