"use client";
import {
  IconClock,
  IconHome,
  IconMapPin,
  IconUser,
  IconUsers,
  IconVideo,
} from "@tabler/icons-react";
import { useState } from "react";

export default function DoctorDetailsPage() {
  const [consultationType, setConsultationType] = useState("offline");
  const selectedDoctor = {
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
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            // onClick={() => setView("doctorList")}
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
            // onClick={() => setView("booking")}
            className="w-full py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
