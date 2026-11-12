"use client";

import { useEffect, useState } from "react";
import { doctorServiceFrontend } from "@/services/doctorDashboardService";
import Link from "next/link";

interface AppointmentDto {
  id: number;
  patientName: string;
  patientGender: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes: string;
}

interface DoctorDashboardData {
  doctorName: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  bio: string;
  consultationFee: number;
  availableSlots: string;
  isAvailable: boolean;
  totalAppointments: number;
  completedAppointments: number;
  todayAppointments: number;
  todayAppointmentsList: AppointmentDto[];
}

export default function PatientDashboardPage() {
  const [data, setData] = useState<DoctorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await doctorServiceFrontend.getDoctorDashboard();
        console.log("Doctor Dashboard data fetched:", response);
        setData(response);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching dashboard:", err);
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-warning">
          <span>No data available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-4 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-base-content">
          Welcome back, Dr. {data.doctorName}! 👋
        </h1>
        <p className="text-base-content/70 mt-2">{data.email}</p>
        <div className="mt-2">
          <span
            className={`badge ${
              data.isAvailable ? "badge-success" : "badge-warning"
            }`}
          >
            {data.isAvailable ? "Available" : "Not Available"}
          </span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Appointments */}
        <div className="stat bg-base-200 rounded-lg shadow">
          <div className="stat-figure text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Total Appointments</div>
          <div className="stat-value text-primary">
            {data.totalAppointments}
          </div>
        </div>

        {/* Completed Appointments */}
        <div className="stat bg-base-200 rounded-lg shadow">
          <div className="stat-figure text-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Completed</div>
          <div className="stat-value text-success">
            {data.completedAppointments}
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="stat bg-base-200 rounded-lg shadow">
          <div className="stat-figure text-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Today's Appointments</div>
          <div className="stat-value text-info">{data.todayAppointments}</div>
        </div>
      </div>

      {/* Doctor Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h2 className="card-title">Professional Info</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Specialization:</span>{" "}
                {data.specialization}
              </p>
              <p>
                <span className="font-semibold">License No:</span>{" "}
                {data.licenseNumber}
              </p>
              <p>
                <span className="font-semibold">Consultation Fee:</span> ₹
                {data.consultationFee}
              </p>
              <p>
                <span className="font-semibold">Available Slots:</span>{" "}
                {data.availableSlots}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow lg:col-span-2">
          <div className="card-body">
            <h2 className="card-title">Bio</h2>
            <p className="text-sm text-base-content/70">
              {data.bio || "No bio available"}
            </p>
          </div>
        </div>
      </div>

      {/* Today's Appointments Section */}
      <div className="card bg-base-200 shadow">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">Today's Appointments</h2>
            <Link
              href="/doctor/appointments"
              className="btn btn-primary btn-sm"
            >
              View All
            </Link>
          </div>

          {data.todayAppointmentsList.length === 0 ? (
            <div className="alert">
              <span>No appointments scheduled for today.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Gender</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {data.todayAppointmentsList.map((apt) => (
                    <tr key={apt.id}>
                      <td className="font-semibold">{apt.patientName}</td>
                      <td>{apt.patientGender}</td>
                      <td>{apt.appointmentTime}</td>
                      <td>
                        <div
                          className={`badge ${
                            apt.status === "COMPLETED"
                              ? "badge-success"
                              : apt.status === "BOOKED"
                                ? "badge-info"
                                : "badge-warning"
                          }`}
                        >
                          {apt.status}
                        </div>
                      </td>
                      <td className="text-xs">{apt.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
