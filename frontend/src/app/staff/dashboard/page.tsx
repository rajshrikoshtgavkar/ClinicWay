"use client";

import { useEffect, useState } from "react";
import { staffDashboardService } from "@/services/staffDashboardService";
import Link from "next/link";
import {
  IconUsers,
  IconStethoscope,
  IconCalendarEvent,
  IconClock,
  IconSettings,
  IconAlertCircle,
  IconChevronRight,
  IconArrowRight,
} from "@tabler/icons-react";
import Loading from "@/components/Loading";
import ErrorState from "@/components/ErrorState";

// --- Main Component ---

export default function StaffDashboardPage() {
  const [data, setData] = useState<StaffDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await staffDashboardService.getStaffDashboard();
        setData(response);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <div className="p-10 text-center">No data available</div>;

  return (
    <div className="min-h-screen bg-base-100 p-4 lg:p-8 space-y-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-base-content">
            Welcome, {data.staffName.split(" ")[0]}! 👋
          </h1>
          <p className="text-base-content/60 font-medium">{data.email}</p>
        </div>
        <div className="flex gap-2">
          <span className="badge badge-neutral badge-lg py-4">
            {data.department}
          </span>
          <span
            className={`badge badge-lg py-4 ${data.isActive ? "badge-success" : "badge-warning"}`}
          >
            {data.isActive ? "Active Account" : "Inactive"}
          </span>
        </div>
      </header>

      {/* Stats Section - Using DaisyUI Stat Group */}
      <div className="stats stats-vertical lg:stats-horizontal shadow-sm bg-base-200 w-full border border-base-300">
        <div className="stat">
          <div className="stat-figure text-primary">
            <IconStethoscope size={32} />
          </div>
          <div className="stat-title font-semibold">Total Doctors</div>
          <div className="stat-value text-primary">{data.totalDoctors}</div>
          <div className="stat-desc">Active in {data.department}</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <IconCalendarEvent size={32} />
          </div>
          <div className="stat-title font-semibold">Total Appointments</div>
          <div className="stat-value text-secondary">
            {data.totalAppointments}
          </div>
          <div className="stat-desc">Cumulative total</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-accent">
            <IconClock size={32} />
          </div>
          <div className="stat-title font-semibold">Today&apos;s Schedule</div>
          <div className="stat-value text-accent">{data.todayAppointments}</div>
          <div className="stat-desc">Remaining for today</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-info">
            <IconUsers size={32} />
          </div>
          <div className="stat-title font-semibold">Total Patients</div>
          <div className="stat-value text-info">{data.totalPatients}</div>
          <div className="stat-desc">Registered patients</div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Doctors",
            sub: "Manage medical staff",
            icon: <IconStethoscope />,
            href: "/staff/doctors",
            color: "hover:border-primary",
          },
          {
            label: "Appointments",
            sub: "Schedule and tracking",
            icon: <IconCalendarEvent />,
            href: "/staff/appointments",
            color: "hover:border-secondary",
          },
          {
            label: "Settings",
            sub: "System configuration",
            icon: <IconSettings />,
            href: "/staff/settings",
            color: "hover:border-accent",
          },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`card bg-base-200 border-2 border-transparent transition-all duration-300 shadow-sm ${action.color} group`}
          >
            <div className="card-body flex-row items-center gap-4">
              <div className="p-3 bg-base-100 rounded-xl group-hover:scale-110 transition-transform">
                {action.icon}
              </div>
              <div className="flex-1">
                <h3 className="card-title text-md mb-0">{action.label}</h3>
                <p className="text-xs text-base-content/60">{action.sub}</p>
              </div>
              <IconChevronRight
                size={18}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Appointments Table */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body p-0 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-6 py-4 md:p-0 mb-2">
            <div>
              <h2 className="card-title text-2xl font-bold">
                Upcoming Appointments
              </h2>
              <p className="text-sm text-base-content/60 font-medium">
                Review your agenda for today
              </p>
            </div>
            <Link
              href="/staff/appointments"
              className="btn btn-ghost btn-sm gap-2"
            >
              View Full History <IconArrowRight size={16} />
            </Link>
          </div>

          {data.recentAppointments.length === 0 ? (
            <div className="p-12 text-center">
              <IconCalendarEvent
                size={48}
                className="mx-auto mb-4 opacity-20"
              />
              <p className="text-base-content/50 italic">
                No appointments scheduled for today.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-lg w-full">
                <thead className="bg-base-200/50">
                  <tr>
                    <th>Patient Name</th>
                    <th>Time Slot</th>
                    <th>Status</th>
                    <th className="hidden md:table-cell">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentAppointments.map((apt: any) => (
                    <tr
                      key={apt.id}
                      className="hover:bg-base-200/30 transition-colors"
                    >
                      <td className="font-bold">{apt.patientName}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <IconClock
                            size={16}
                            className="text-base-content/40"
                          />
                          {apt.appointmentTime}
                        </div>
                      </td>
                      <td>
                        <div
                          className={`badge badge-sm font-bold ${
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
                      <td className="text-xs text-base-content/60 italic hidden md:table-cell">
                        {apt.notes || "No additional notes"}
                      </td>
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
