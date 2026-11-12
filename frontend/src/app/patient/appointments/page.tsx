"use client";

import { useEffect, useState } from "react";
import { appointmentService } from "@/services/appointmentService";
import Link from "next/link";
import {
  IconCalendar,
  IconClock,
  IconStethoscope,
  IconFilter,
  IconPlus,
  IconCircleCheck,
  IconCircleDashed,
  IconCircleX,
  IconPlayerPlay,
  IconNotes,
  IconInfoCircle,
} from "@tabler/icons-react";
import Loading from "@/components/Loading";

interface Appointment {
  id: number;
  doctorName: string;
  doctorSpecialization: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes: string;
  createdAt: string;
}

export default function MyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await appointmentService.getPatientAppointments();
        setAppointments(response);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return {
          color: "badge-success",
          icon: <IconCircleCheck size={14} />,
          label: "Completed",
        };
      case "BOOKED":
        return {
          color: "badge-info",
          icon: <IconCircleDashed size={14} />,
          label: "Scheduled",
        };
      case "IN_PROGRESS":
        return {
          color: "badge-warning",
          icon: <IconPlayerPlay size={14} />,
          label: "In Progress",
        };
      case "CANCELLED":
        return {
          color: "badge-error",
          icon: <IconCircleX size={14} />,
          label: "Cancelled",
        };
      default:
        return {
          color: "badge-ghost",
          icon: <IconInfoCircle size={14} />,
          label: status,
        };
    }
  };

  const filteredAppointments =
    filterStatus === "ALL"
      ? appointments
      : appointments.filter((apt) => apt.status === filterStatus);

  if (loading) return <Loading />;

  return (
    <div className="px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-base-content">
            My <span className="text-primary">Appointments</span>
          </h1>
          <p className="text-base-content/60 font-medium mt-1">
            Manage your visits and medical consultations
          </p>
        </div>
        <Link
          href="/patient/clinics"
          className="btn btn-primary btn-wide shadow-lg shadow-primary/20 gap-2"
        >
          <IconPlus size={20} stroke={3} />
          Book Appointment
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex items-center gap-2 mr-2 opacity-50">
          <IconFilter size={18} />
          <span className="text-xs font-black uppercase">Filter Status</span>
        </div>
        <div className="join bg-base-200 p-1 rounded-xl shadow-inner">
          {["ALL", "BOOKED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`join-item btn btn-sm border-none px-5 ${
                  filterStatus === status
                    ? "btn-primary shadow-md"
                    : "btn-ghost hover:bg-base-300"
                }`}
              >
                {status === "ALL" ? "All Visits" : status.replace("_", " ")}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="alert alert-error shadow-lg mb-8">
          <IconCircleX />
          <span className="font-bold">{error}</span>
        </div>
      )}

      {/* Main List */}
      {filteredAppointments.length === 0 ? (
        <div className="hero bg-base-200 rounded-3xl py-20 border-2 border-dashed border-base-300">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <div className="bg-base-300 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-50">
                <IconCalendar size={32} />
              </div>
              <h2 className="text-xl font-bold opacity-60">
                No appointments found
              </h2>
              <p className="py-2 opacity-40 text-sm">
                Try switching filters or book a new consultation to get started.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAppointments.map((apt) => {
            const config = getStatusConfig(apt.status);
            return (
              <div
                key={apt.id}
                className="group card bg-base-200 border border-base-300 hover:border-primary/40 hover:shadow-2xl transition-all duration-300"
              >
                <div className="card-body p-6">
                  {/* Doctor Info */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="avatar placeholder">
                        <div className="bg-primary/10 text-primary rounded-xl w-12 border border-primary/20 flex justify-center items-center">
                          <IconStethoscope size={24} />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-black text-lg group-hover:text-primary transition-colors">
                          {apt.doctorName}
                        </h3>
                        <p className="text-xs font-bold opacity-50 uppercase tracking-tighter">
                          {apt.doctorSpecialization}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`badge ${config.color} gap-1.5 font-bold py-3`}
                    >
                      {config.icon}
                      {config.label}
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="bg-base-200/50 rounded-2xl p-4 space-y-3 border border-base-200">
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2 opacity-60 font-medium">
                        <IconCalendar size={16} /> Date
                      </span>
                      <span className="font-bold">{apt.appointmentDate}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2 opacity-60 font-medium">
                        <IconClock size={16} /> Time
                      </span>
                      <span className="font-bold">{apt.appointmentTime}</span>
                    </div>
                  </div>

                  {/* Notes Preview */}
                  {apt.notes && (
                    <div className="flex gap-2">
                      <IconNotes
                        size={16}
                        className="mt-1 opacity-40 shrink-0"
                      />
                      <p className="text-xs opacity-70 italic line-clamp-2 leading-relaxed">
                        {apt.notes}
                      </p>
                    </div>
                  )}

                  {/* Action Footer */}
                  <div className="card-actions gap-6 mt-6 pt-4 border-t border-base-content">
                    <Link
                      href={`/patient/queue`}
                      className="btn btn-neutral btn-outline btn-sm font-bold"
                    >
                      View Queue Status
                    </Link>
                    <Link
                      href={`/patient/appointments/${apt.id}`}
                      className="btn btn-neutral btn-sm font-bold"
                    >
                      View Full Details
                    </Link>
                    {apt.status === "BOOKED" && (
                      <button className="btn btn-error btn-outline btn-sm font-bold">
                        Cancel Visit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
