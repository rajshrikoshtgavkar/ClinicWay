"use client";

import { useEffect, useState } from "react";
import { appointmentService } from "@/services/appointmentService";
import { queueService, QueueStatusResponse } from "@/services/queueService";
import {
  IconClipboardList,
  IconClock,
  IconStethoscope,
  IconMapPin,
  IconAlertCircle,
  IconCircleCheck,
  IconHourglass,
  IconRefresh,
  IconPlayerPlay,
  IconCircleX,
} from "@tabler/icons-react";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";

interface Appointment {
  id: number;
  doctorName: string;
  doctorSpecialization: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes?: string;
}

export default function PatientQueueStatus() {
  const [queueStatus, setQueueStatus] = useState<QueueStatusResponse | null>(
    null,
  );
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await appointmentService.getPatientAppointments();
        const appointments = response.data || response;

        const today = new Date().toISOString().split("T")[0];
        const todaysAppointment = (appointments as Appointment[]).find(
          (apt) =>
            (apt.appointmentDate === today && apt.status === "BOOKED") ||
            apt.status === "IN_PROGRESS",
        );

        if (todaysAppointment) {
          setAppointment(todaysAppointment);
        } else {
          setError("No appointment scheduled for today");
        }
      } catch (err: any) {
        setError("Failed to load today's schedule");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const fetchQueueStatus = async () => {
    if (!appointment) return;
    try {
      const response = await queueService.getMyQueueStatus();
      setQueueStatus(response.data || response);
    } catch (err) {
      console.log("Queue not joined yet");
    }
  };

  useEffect(() => {
    if (appointment) fetchQueueStatus();
  }, [appointment]);

  useEffect(() => {
    if (!autoRefreshEnabled || !appointment || !queueStatus) return;
    const interval = setInterval(fetchQueueStatus, 30000);
    return () => clearInterval(interval);
  }, [autoRefreshEnabled, appointment, queueStatus]);

  const handleCheckIn = async () => {
    if (!appointment) return;
    try {
      setCheckingIn(true);
      const response = await queueService.checkIn(appointment.id);
      setQueueStatus(response.data || response);
      toast.success("Checked in successfully!");
    } catch (err: any) {
      toast.error(err.message || "Check-in failed");
    } finally {
      setCheckingIn(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "WAITING":
        return {
          color: "badge-warning",
          icon: <IconHourglass size={14} />,
          label: "Waiting",
        };
      case "IN_PROGRESS":
        return {
          color: "badge-info",
          icon: <IconPlayerPlay size={14} />,
          label: "In Progress",
        };
      case "COMPLETED":
        return {
          color: "badge-success",
          icon: <IconCircleCheck size={14} />,
          label: "Completed",
        };
      default:
        return {
          color: "badge-ghost",
          icon: <IconAlertCircle size={14} />,
          label: status,
        };
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="px-4 py-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-base-content">
            Live <span className="text-primary">Queue</span> Status
          </h1>
          <p className="text-base-content/60 font-medium mt-1">
            Monitor your real-time position in the clinic
          </p>
        </div>
        <button
          onClick={fetchQueueStatus}
          className="btn btn-circle btn-ghost bg-base-200 border border-base-300"
        >
          <IconRefresh size={24} stroke={3} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Appointment Info */}
        <div className="lg:col-span-5 space-y-6">
          {appointment ? (
            <div className="card bg-base-200 border border-base-300">
              <div className="card-body p-8">
                <div className="flex gap-4 mb-6">
                  <div className="avatar placeholder">
                    <div className="bg-primary/10 text-primary rounded-xl w-14 border border-primary/20 flex justify-center items-center">
                      <IconStethoscope size={28} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-black text-xl leading-tight">
                      {appointment.doctorName}
                    </h3>
                    <p className="text-xs font-bold opacity-50 uppercase tracking-tighter">
                      {appointment.doctorSpecialization}
                    </p>
                  </div>
                </div>

                <div className="bg-base-100/50 rounded-2xl p-5 space-y-4 border border-base-300">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 opacity-60 font-bold uppercase text-[10px] tracking-widest">
                      <IconClock size={16} /> Scheduled
                    </span>
                    <span className="font-black">
                      {appointment.appointmentTime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 opacity-60 font-bold uppercase text-[10px] tracking-widest">
                      <IconMapPin size={16} /> Date
                    </span>
                    <span className="font-black">
                      {appointment.appointmentDate}
                    </span>
                  </div>
                </div>

                {!queueStatus && (
                  <button
                    onClick={handleCheckIn}
                    disabled={checkingIn}
                    className="btn btn-primary btn-block mt-6 shadow-lg shadow-primary/20 font-black"
                  >
                    {checkingIn ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      "Confirm Check-In"
                    )}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="card bg-base-200 border-2 border-dashed border-base-300 p-10 text-center">
              <IconCircleX size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-black opacity-40 uppercase tracking-widest">
                No Active Appointment
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Queue & Stats */}
        <div className="lg:col-span-7 space-y-6">
          {queueStatus ? (
            <>
              {/* Live Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card bg-primary text-primary-content p-6 flex flex-row items-center justify-between border-b-4 border-primary-focus">
                  <div>
                    <p className="text-[10px] font-black uppercase opacity-80 tracking-widest">
                      Your Position
                    </p>
                    <p className="text-5xl font-black">
                      #{queueStatus.position}
                    </p>
                  </div>
                  <IconClipboardList size={48} className="opacity-20" />
                </div>
                <div className="card bg-base-200 border border-base-300 p-6 flex flex-row items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">
                      Est. Wait Time
                    </p>
                    <p className="text-5xl font-black text-primary">
                      {queueStatus.estimatedWaitMinutes}
                      <span className="text-sm">m</span>
                    </p>
                  </div>
                  <IconClock size={48} className="opacity-10" />
                </div>
              </div>

              {/* Status & Timeline */}
              <div className="card bg-base-200 border border-base-300">
                <div className="card-body p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-black text-lg uppercase tracking-widest opacity-40 text-[12px]">
                      Service Journey
                    </h3>
                    <div
                      className={`badge ${getStatusConfig(queueStatus.status).color} gap-1.5 font-black py-3 px-4`}
                    >
                      {getStatusConfig(queueStatus.status).icon}
                      {getStatusConfig(queueStatus.status).label}
                    </div>
                  </div>

                  <ul className="steps steps-vertical w-full">
                    <li
                      className="step step-primary font-black text-sm"
                      data-content="✓"
                    >
                      <div className="flex flex-col items-start ml-4">
                        <span>Checked In</span>
                        <span className="text-[10px] opacity-40">
                          {new Date(
                            queueStatus.checkInTime,
                          ).toLocaleTimeString()}
                        </span>
                      </div>
                    </li>
                    <li
                      className={`step ${queueStatus.calledTime ? "step-primary" : ""} font-black text-sm`}
                      data-content={queueStatus.calledTime ? "✓" : "2"}
                    >
                      <div className="flex flex-col items-start ml-4">
                        <span>Doctor Called</span>
                        {queueStatus.calledTime && (
                          <span className="text-[10px] opacity-40">
                            {new Date(
                              queueStatus.calledTime,
                            ).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    </li>
                    <li
                      className={`step ${queueStatus.completedTime ? "step-primary" : ""} font-black text-sm`}
                      data-content={queueStatus.completedTime ? "✓" : "3"}
                    >
                      <div className="flex flex-col items-start ml-4">
                        <span>Consultation Complete</span>
                      </div>
                    </li>
                  </ul>

                  <div className="mt-8 pt-6 border-t border-base-300 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="toggle toggle-primary toggle-sm"
                        checked={autoRefreshEnabled}
                        onChange={(e) =>
                          setAutoRefreshEnabled(e.target.checked)
                        }
                      />
                      <span className="text-[10px] font-black uppercase opacity-40">
                        Auto-Refresh Live
                      </span>
                    </div>
                    <span className="text-[10px] font-black opacity-30 italic">
                      Last updated: Just now
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="card bg-base-200 border-2 border-dashed border-base-300 p-20 text-center">
              <IconHourglass
                size={60}
                className="mx-auto mb-6 opacity-10 animate-pulse"
              />
              <h3 className="text-xl font-black opacity-40">
                Waiting for Check-in
              </h3>
              <p className="max-w-xs mx-auto mt-2 text-sm opacity-50 font-medium">
                Join the queue to see your live position and get an estimated
                arrival time for the doctor.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
