"use client";

import { useEffect, useState } from "react";
import { patientService } from "@/services/patientService";
import Link from "next/link";
import {
  IconCalendar,
  IconCircleCheck,
  IconActivity,
  IconUser,
  IconHistory,
  IconPlus,
  IconChevronRight,
} from "@tabler/icons-react";
import Loading from "@/components/Loading";

// Types remain the same as your DTOs
interface AppointmentDto {
  id: number;
  doctorName: string;
  patientName: string;
  patientGender: string;
  doctorSpecialization: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes: string;
}

interface PatientDashboardData {
  patientName: string;
  profileImage: string;
  email: string;
  age: string;
  gender: string;
  address: string;
  medicalHistory: string;
  totalAppointments: number;
  completedAppointments: number;
  upcomingAppointments: number;
  recentAppointments: AppointmentDto[];
}

export default function PatientDashboardPage() {
  const [data, setData] = useState<PatientDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await patientService.getPatientDashboard();
        setData(response);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <Loading />;

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="alert alert-error shadow-lg max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error || "No data available"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-8">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-10">
        <div className="flex items-center gap-4">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-16 shadow-lg">
              <img src={data.profileImage} alt="" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-base-content">
              Welcome back,{" "}
              <span className="text-primary">{data.patientName} </span> !
            </h1>
            <p className="text-base-content/60 font-medium">{data.email}</p>
          </div>
        </div>
        <Link
          href="/patient/appointments/book"
          className="btn btn-primary shadow-md hover:scale-105 transition-transform"
        >
          <IconPlus className="w-5 h-5" />
          Book Appointment
        </Link>
      </div>

      {/* --- STATS SECTION --- */}
      <div className="stats stats-vertical lg:stats-horizontal shadow-xl bg-base-200 w-full border border-base-200">
        <div className="stat">
          <div className="stat-figure text-primary">
            <IconActivity size={32} />
          </div>
          <div className="stat-title font-semibold uppercase tracking-wider text-xs">
            Total Visits
          </div>
          <div className="stat-value text-primary">
            {data.totalAppointments}
          </div>
          <div className="stat-desc">Lifetime checkups</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <IconCircleCheck size={32} />
          </div>
          <div className="stat-title font-semibold uppercase tracking-wider text-xs">
            Completed
          </div>
          <div className="stat-value text-secondary">
            {data.completedAppointments}
          </div>
          <div className="stat-desc">Past consultations</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-accent">
            <IconCalendar size={32} />
          </div>
          <div className="stat-title font-semibold uppercase tracking-wider text-xs">
            Upcoming
          </div>
          <div className="stat-value text-accent">
            {data.upcomingAppointments}
          </div>
          <div className="stat-desc">Scheduled sessions</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- PERSONAL INFO --- */}
        <div className="card bg-base-200 shadow-xl border border-base-200">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <IconUser size={20} />
              </div>
              <h2 className="card-title text-lg">Patient Profile</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between border-b border-base-200 pb-2">
                <span className="text-base-content/50">Age</span>
                <span className="font-bold">{data.age} Years</span>
              </div>
              <div className="flex justify-between border-b border-base-200 pb-2">
                <span className="text-base-content/50">Gender</span>
                <span className="font-bold capitalize">{data.gender}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-base-content/50">Address</span>
                <span className="font-medium text-sm leading-relaxed">
                  {data.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- MEDICAL HISTORY --- */}
        <div className="card lg:col-span-2 bg-base-200 shadow-xl border border-base-200 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <IconHistory size={120} />
          </div>
          <div className="card-body">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                <IconHistory size={20} />
              </div>
              <h2 className="card-title text-lg">Medical History</h2>
            </div>
            <div className="bg-base-200/50 p-6 rounded-2xl min-h-30">
              <p className="text-base-content/80 leading-relaxed italic">
                "
                {data.medicalHistory ||
                  "No clinical history records found in our database."}
                "
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- APPOINTMENTS TABLE --- */}
      <div className="card bg-base-200 shadow-xl border border-base-200">
        <div className="card-body p-0 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 md:p-0 mb-6">
            <div>
              <h2 className="card-title text-2xl font-bold">
                Recent Appointments
              </h2>
              <p className="text-sm text-base-content/50">
                Your latest medical consultations
              </p>
            </div>
            <Link
              href="/patient/appointments"
              className="btn btn-ghost btn-outline btn-sm gap-2"
            >
              View Records <IconChevronRight size={16} />
            </Link>
          </div>

          <div className="overflow-x-auto px-4 md:px-0">
            <table className="table table-lg w-full">
              <thead className="bg-base-200/50">
                <tr className="border-none">
                  <th className="rounded-l-xl">Medical Professional</th>
                  <th>Schedule</th>
                  <th>Status</th>
                  <th className="rounded-r-xl">Observation</th>
                </tr>
              </thead>
              <tbody>
                {data.recentAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10">
                      <div className="flex flex-col items-center gap-2 opacity-40">
                        <IconCalendar size={48} />
                        <p className="font-medium">
                          No appointment history found.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.recentAppointments.map((apt) => (
                    <tr
                      key={apt.id}
                      className="hover:bg-base-200/30 transition-colors"
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="mask mask-squircle w-12 h-12 bg-base-300 flex items-center justify-center font-bold text-base-content/40">
                            Dr
                          </div>
                          <div>
                            <div className="font-bold text-base-content">
                              {apt.patientName}
                            </div>
                            <div className="text-xs opacity-50 font-bold uppercase tracking-tighter">
                              {apt.patientGender}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="font-medium">{apt.appointmentDate}</div>
                        <div className="text-sm opacity-50">
                          {apt.appointmentTime}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge badge-md font-bold py-3 px-4 ${
                            apt.status === "COMPLETED"
                              ? "badge-success bg-success/10 text-success border-success/20"
                              : apt.status === "BOOKED"
                                ? "badge-info bg-info/10 text-info border-info/20"
                                : "badge-warning bg-warning/10 text-warning border-warning/20"
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-sm opacity-70">
                        {apt.notes || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
