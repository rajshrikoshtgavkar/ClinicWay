"use client";

import { useEffect, useState } from "react";
import { appointmentService } from "@/services/appointmentService";
import {
  IconUser,
  IconCalendar,
  IconClock,
  IconFilter,
  IconCircleCheck,
  IconCircleDashed,
  IconCircleX,
  IconPlayerPlay,
  IconNotes,
  IconGenderMale,
  IconGenderFemale,
  IconSearch,
  IconChecklist,
} from "@tabler/icons-react";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import Link from "next/link";
import CompleteVisitModal from "@/components/CompleteVisitModal";

interface Appointment {
  id: number;
  patientName: string;
  patientGender: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes: string;
  createdAt: string;
}

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [updating, setUpdating] = useState<number | null>(null);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await appointmentService.getDoctorAppointments();
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

  const handleStatusUpdate = async (
    appointmentId: number,
    newStatus: string,
  ) => {
    try {
      setUpdating(appointmentId);
      await appointmentService.updateAppointmentStatus(appointmentId, {
        status: newStatus as
          | "BOOKED"
          | "CHECKED_IN"
          | "IN_PROGRESS"
          | "COMPLETED"
          | "CANCELLED",
      });
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt,
        ),
      );
      toast.success(`Patient marked as ${newStatus.replace("_", " ")}`);
    } catch (err: any) {
      toast.error("Status update failed");
    } finally {
      setUpdating(null);
    }
  };

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
          icon: <IconCircleDashed size={14} />,
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
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-base-content uppercase">
            Clinic <span className="text-primary">Manager</span>
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="badge badge-outline font-black text-[10px] tracking-widest px-3">
              {appointments.length} TOTAL SESSIONS
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-base-200 p-2 rounded-2xl border border-base-300">
          <IconChecklist className="text-primary ml-2" />
          <div className="pr-4">
            <p className="text-[10px] font-black opacity-40 uppercase leading-none">
              Status
            </p>
            <p className="text-sm font-bold">Live Dashboard</p>
          </div>
          <Link href="/doctor/queue" className="btn btn-neutral btn-sm">
            Live Queue
          </Link>
        </div>
      </div>

      {/* Filter Tabs - Neo-Brutalist Join */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="join bg-base-200 p-1 rounded-2xl border border-base-300 shadow-sm">
          {["ALL", "BOOKED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`join-item btn btn-sm border-none px-6 font-black text-[10px] tracking-tight ${
                  filterStatus === status
                    ? "btn-primary shadow-md"
                    : "btn-ghost hover:bg-base-300"
                }`}
              >
                {status === "ALL" ? "EVERYTHING" : status.replace("_", " ")}
              </button>
            ),
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-8 rounded-2xl border-2 border-error/20 font-bold uppercase text-xs">
          <IconCircleX stroke={3} />
          {error}
        </div>
      )}

      {/* Appointments Grid */}
      {filteredAppointments.length === 0 ? (
        <div className="card bg-base-200 border-2 border-dashed border-base-300 py-20 text-center">
          <IconSearch size={48} className="mx-auto mb-4 opacity-10" />
          <p className="font-black opacity-30 uppercase tracking-widest text-sm">
            No appointments found in this category
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAppointments.map((apt) => {
            const config = getStatusConfig(apt.status);
            return (
              <div
                key={apt.id}
                className="card bg-base-200 border border-base-300 hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="card-body p-6">
                  {/* Patient Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4">
                      <div className="avatar placeholder">
                        <div className="bg-base-300 text-base-content rounded-xl w-12 border border-base-content/5 flex justify-center items-center font-black">
                          {apt.patientName.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-black text-lg group-hover:text-primary transition-colors leading-tight">
                          {apt.patientName}
                        </h3>
                        <div className="flex items-center gap-1 opacity-50">
                          {apt.patientGender === "MALE" ? (
                            <IconGenderMale
                              size={14}
                              className="text-blue-500"
                            />
                          ) : (
                            <IconGenderFemale
                              size={14}
                              className="text-pink-500"
                            />
                          )}
                          <span className="text-[10px] font-black uppercase tracking-tighter">
                            {apt.patientGender}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`badge ${config.color} gap-1.5 font-black py-3 px-3 text-[10px] uppercase border-none`}
                    >
                      {config.icon}
                      {config.label}
                    </div>
                  </div>

                  {/* Timing Box */}
                  <div className="bg-base-100/50 rounded-2xl p-4 mb-4 border border-base-300 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-black opacity-40 uppercase tracking-widest mb-1">
                        Date
                      </p>
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <IconCalendar size={14} className="opacity-40" />
                        {apt.appointmentDate}
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-black opacity-40 uppercase tracking-widest mb-1">
                        Time Slot
                      </p>
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <IconClock size={14} className="opacity-40" />
                        {apt.appointmentTime}
                      </div>
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className="flex gap-3 mb-6">
                    <IconNotes size={16} className="shrink-0 opacity-20" />
                    <p className="text-[11px] leading-relaxed font-medium opacity-60 italic">
                      {apt.notes || "No clinical notes provided."}
                    </p>
                  </div>

                  {/* Action Row */}
                  <div className="card-actions flex-nowrap border-t border-base-300 pt-4 gap-2">
                    {apt.status === "BOOKED" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(apt.id, "IN_PROGRESS")
                        }
                        disabled={updating === apt.id}
                        className="btn btn-warning btn-sm font-black flex-1 text-[10px] uppercase shadow-sm"
                      >
                        {updating === apt.id ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          "Start Visit"
                        )}
                      </button>
                    )}

                    {apt.status === "IN_PROGRESS" && (
                      <button
                        onClick={() => {
                          setSelectedAppointmentId(apt.id);
                          setCompleteModalOpen(true);
                        }}
                        disabled={updating === apt.id}
                        className="btn btn-success btn-sm font-black flex-1 text-[10px] uppercase shadow-sm"
                      >
                        {updating === apt.id ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          "Mark Complete"
                        )}
                      </button>
                    )}

                    {(apt.status === "BOOKED" ||
                      apt.status === "IN_PROGRESS") && (
                      <button
                        onClick={() => handleStatusUpdate(apt.id, "CANCELLED")}
                        disabled={updating === apt.id}
                        className="btn btn-ghost btn-sm font-black text-[10px] uppercase border border-base-300 hover:btn-error"
                      >
                        Cancel
                      </button>
                    )}

                    {(apt.status === "COMPLETED" ||
                      apt.status === "CANCELLED") && (
                      <button className="btn btn-disabled btn-sm font-black flex-1 text-[10px] uppercase bg-base-300/50">
                        Record Closed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <CompleteVisitModal
        isOpen={completeModalOpen}
        onClose={() => {
          setCompleteModalOpen(false);
          setSelectedAppointmentId(null);
        }}
        onConfirm={async (notes) => {
          if (!selectedAppointmentId) return;

          try {
            setUpdating(selectedAppointmentId);

            await appointmentService.updateAppointmentStatus(
              selectedAppointmentId,
              {
                status: "COMPLETED",
                notes,
              },
            );

            setAppointments((prev) =>
              prev.map((apt) =>
                apt.id === selectedAppointmentId
                  ? { ...apt, status: "COMPLETED", notes }
                  : apt,
              ),
            );

            toast.success("Visit completed successfully");
            setCompleteModalOpen(false);
            setSelectedAppointmentId(null);
          } catch {
            toast.error("Failed to complete visit");
          } finally {
            setUpdating(null);
          }
        }}
      />
    </div>
  );
}
