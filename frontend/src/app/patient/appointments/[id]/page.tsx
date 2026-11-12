"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { appointmentService } from "@/services/appointmentService";
import MeetingLinkDisplay from "@/components/MeetingLinkDisplay";
import Loading from "@/components/Loading";
import {
  IconArrowLeft,
  IconCalendar,
  IconClock,
  IconStethoscope,
  IconUser,
  IconPhone,
  IconMapPin,
  IconNotes,
  IconCircleCheck,
  IconAlertCircle,
  IconVideo,
  IconUserExclamation,
  IconBuildingHospital,
} from "@tabler/icons-react";

interface AppointmentDetail {
  id: number;
  doctorName: string;
  doctorSpecialization: string;
  doctorPhone: string;
  doctorEmail: string;
  clinicName: string;
  clinicAddress: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  status: string;
  notes: string;
  meetingLink?: string;
  meetingPlatform?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AppointmentDetail() {
  const params = useParams();
  const router = useRouter();
  const rawAppointmentId = params.id;
  const appointmentId = Array.isArray(rawAppointmentId)
    ? rawAppointmentId[0]
    : rawAppointmentId;
  const parsedAppointmentId = Number(appointmentId);
  const hasValidAppointmentId =
    typeof appointmentId === "string" &&
    /^\d+$/.test(appointmentId) &&
    Number.isSafeInteger(parsedAppointmentId) &&
    parsedAppointmentId > 0;

  const [appointment, setAppointment] = useState<AppointmentDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!hasValidAppointmentId) {
        setError("Invalid appointment ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await appointmentService.getAppointmentById(
          parsedAppointmentId,
        );
        setAppointment(response);
        setError(null);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load appointment details",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [appointmentId, hasValidAppointmentId, parsedAppointmentId]);

  const getStatusConfig = (status: string) => {
    const base =
      "px-4 py-2 rounded-xl border-2 font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
    switch (status) {
      case "COMPLETED":
        return {
          class: `${base} bg-success text-success-content border-black`,
          icon: <IconCircleCheck size={18} stroke={3} />,
          label: "Completed",
        };
      case "BOOKED":
        return {
          class: `${base} bg-info text-info-content border-black`,
          icon: <IconCalendar size={18} stroke={3} />,
          label: "Scheduled",
        };
      case "IN_PROGRESS":
        return {
          class: `${base} bg-warning text-warning-content border-black`,
          icon: <IconAlertCircle size={18} stroke={3} />,
          label: "In Progress",
        };
      case "CANCELLED":
        return {
          class: `${base} bg-error text-error-content border-black`,
          icon: <IconAlertCircle size={18} stroke={3} />,
          label: "Cancelled",
        };
      default:
        return {
          class: `${base} bg-neutral text-neutral-content border-black`,
          icon: <IconAlertCircle size={18} stroke={3} />,
          label: status,
        };
    }
  };

  if (loading) return <Loading />;

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-base-100 p-8 flex items-center justify-center">
        <div className="card w-full max-w-md bg-base-200 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <IconUserExclamation size={48} className="text-error mb-4" />
          <h2 className="text-2xl font-black uppercase mb-2">Error Occurred</h2>
          <p className="font-bold opacity-70 mb-6">
            {error || "Appointment not found"}
          </p>
          <button
            onClick={() => router.back()}
            className="btn btn-neutral border-2 border-black font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(appointment.status);

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity mb-4"
          >
            <IconArrowLeft size={16} stroke={3} /> Back to Schedule
          </button>
          <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
            Appointment{" "}
            <span className="text-primary text-2xl block md:inline md:ml-2">
              #{appointment.id}
            </span>
          </h1>
        </div>
        <div className={statusConfig.class}>
          {statusConfig.icon}
          {statusConfig.label}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Timing & Clinic */}
        <div className="space-y-6">
          {/* Timing Card */}
          <div className="card bg-warning border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="card-body p-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <IconClock size={18} stroke={3} /> Timing Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black uppercase opacity-60 leading-none mb-1">
                    Date
                  </p>
                  <p className="text-2xl font-black">
                    {appointment.appointmentDate}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase opacity-60 leading-none mb-1">
                    Time Slot
                  </p>
                  <p className="text-2xl font-black">
                    {appointment.appointmentTime}
                  </p>
                </div>
                <div className="badge badge-neutral font-black uppercase tracking-widest p-3 border-2 border-black">
                  {appointment.appointmentType === "ONLINE"
                    ? "Virtual"
                    : "In-Clinic"}
                </div>
              </div>
            </div>
          </div>

          {/* Clinic Card */}
          <div className="card bg-base-200 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="card-body p-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <IconBuildingHospital size={18} stroke={3} /> Location
              </h3>
              <p className="text-lg font-black uppercase leading-tight mb-2">
                {appointment.clinicName}
              </p>
              <div className="flex gap-2 opacity-70">
                <IconMapPin size={18} className="shrink-0" />
                <p className="text-sm font-bold leading-tight">
                  {appointment.clinicAddress}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Doctor & Links */}
        <div className="lg:col-span-2 space-y-6">
          {/* Doctor Info */}
          <div className="card bg-base-100 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="card-body p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b-4 border-black pb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary border-4 border-black flex items-center justify-center text-primary-content">
                    <IconStethoscope size={32} stroke={3} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black uppercase leading-none">
                      {appointment.doctorName}
                    </h2>
                    <p className="font-black text-primary text-xs tracking-widest uppercase mt-1">
                      {appointment.doctorSpecialization}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <IconPhone size={16} stroke={3} /> {appointment.doctorPhone}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold opacity-60">
                    <IconUser size={16} stroke={3} /> {appointment.doctorEmail}
                  </div>
                </div>
              </div>

              {/* Online Link */}
              {appointment.appointmentType === "ONLINE" && (
                <div className="bg-primary/10 border-2 border-black p-6 rounded-2xl mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <IconVideo size={24} className="text-primary" />
                    <h4 className="font-black uppercase tracking-widest text-sm">
                      Virtual Meeting Room
                    </h4>
                  </div>
                  <MeetingLinkDisplay
                    meetingLink={appointment.meetingLink}
                    meetingPlatform={appointment.meetingPlatform}
                    appointmentStatus={appointment.status}
                    appointmentTime={appointment.appointmentTime}
                  />
                </div>
              )}

              {/* Notes */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 opacity-50">
                  <IconNotes size={18} stroke={3} /> Medical Notes
                </h3>
                <div className="bg-base-200 border-2 border-black p-6 rounded-2xl">
                  <p className="font-bold italic opacity-80 leading-relaxed">
                    {appointment.notes ||
                      "No additional notes provided for this visit."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Quick Info Footer */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-neutral text-neutral-content p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
              <p className="text-[10px] font-black uppercase opacity-50 mb-1">
                Patient Name
              </p>
              <p className="text-xl font-black uppercase leading-none">
                {appointment.patientName}
              </p>
            </div>
            <div className="flex-1 bg-base-100 p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
              <p className="text-[10px] font-black uppercase opacity-50 mb-1">
                Booking Date
              </p>
              <p className="text-xl font-black uppercase leading-none">
                {new Date(appointment.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Actions */}
          {appointment.status === "BOOKED" && (
            <div className="pt-4">
              <button className="btn btn-error btn-block h-16 border-4 border-black font-black uppercase tracking-widest text-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                Cancel Appointment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
