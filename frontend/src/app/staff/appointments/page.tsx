"use client";

import { useEffect, useState } from "react";
import { appointmentService } from "@/services/appointmentService";
import { useAuth } from "@/context/AuthContext";
import {
  IconUser,
  IconCalendar,
  IconClock,
  IconStethoscope,
  IconFilter,
  IconCircleCheck,
  IconCircleDashed,
  IconCircleX,
  IconPlayerPlay,
  IconNotes,
  IconGenderMale,
  IconGenderFemale,
  IconSearch,
} from "@tabler/icons-react";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import receptionistService from "@/services/receptionistService";
import ErrorState from "@/components/ErrorState";

interface Appointment {
  id: number;
  patientName: string;
  doctorName: string;
  patientGender: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes: string;
  createdAt: string;
}

interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

export default function ManageAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [updating, setUpdating] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [offlineForm, setOfflineForm] = useState({
    fullName: "",
    age: "",
    gender: "MALE",
    phone: "",
    email: "",
    address: "",
    doctorId: "",
    appointmentDate: "",
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await appointmentService.getAllAppointments(
          user?.clinicId!,
        );
        const drResponse = await fetch(
          `/spring-server/api/doctor/clinic/${user?.clinicId}`,
        );
        const data = await drResponse.json();
        setDoctors(data);
        setAppointments(response);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [user?.clinicId]);

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
      toast.success(`Status updated to ${newStatus.replace("_", " ")}`);
    } catch (err: any) {
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const handleOfflineRegistration = async () => {
    try {
      setSubmitting(true);

      if (
        !offlineForm.fullName ||
        !offlineForm.phone ||
        !offlineForm.doctorId ||
        !offlineForm.appointmentDate
      ) {
        toast.error("Please fill required fields");
        return;
      }

      await receptionistService.addOfflinePatient(
        Number(offlineForm.doctorId),
        offlineForm.appointmentDate,
        {
          fullName: offlineForm.fullName,
          age: offlineForm.age,
          gender: offlineForm.gender,
          phone: offlineForm.phone,
          email: offlineForm.email || undefined,
          address: offlineForm.address || undefined,
        },
      );

      toast.success("Offline patient registered successfully");
      setShowModal(false);

      // Refresh appointments
      const refreshed = await appointmentService.getAllAppointments(
        user?.clinicId!,
      );
      setAppointments(refreshed);

      // Reset form
      setOfflineForm({
        fullName: "",
        age: "",
        gender: "MALE",
        phone: "",
        email: "",
        address: "",
        doctorId: "",
        appointmentDate: "",
      });
    } catch (err) {
      toast.error("Failed to register offline patient");
    } finally {
      setSubmitting(false);
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
  if (error) return <ErrorState message={error} />;

  return (
    <div className="p-4 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-base-content uppercase">
            Clinic <span className="text-primary">Schedule</span>
          </h1>
          <p className="text-base-content/60 font-bold mt-1 uppercase tracking-widest">
            {appointments.length} Total Patient Encounters
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary btn-sm font-black uppercase"
        >
          + Register Offline Patient
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex items-center gap-2 mr-2 opacity-50">
          <IconFilter size={18} />
          <span className="font-black uppercase">Filter View</span>
        </div>
        <div className="join bg-base-200 p-1 rounded-xl shadow-inner border border-base-300">
          {["ALL", "BOOKED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`join-item btn border-none px-5 font-black text-sm ${
                  filterStatus === status
                    ? "btn-primary shadow-md"
                    : "btn-ghost hover:bg-base-300"
                }`}
              >
                {status === "ALL" ? "Everything" : status.replace("_", " ")}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Main Grid */}
      {filteredAppointments.length === 0 ? (
        <div className="hero bg-base-200 rounded-3xl py-24 border-2 border-dashed border-base-300">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <IconSearch size={48} className="mx-auto mb-4 opacity-20" />
              <h2 className="text-xl font-black opacity-40 uppercase tracking-widest">
                No matching records
              </h2>
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
                className="group card bg-base-200 border border-base-300 hover:border-primary/40 transition-all duration-300"
              >
                <div className="card-body p-6">
                  {/* Patient Info */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="avatar placeholder">
                        <div className="bg-base-300 text-base-content rounded-xl w-12 border border-base-content/10 flex justify-center items-center">
                          <IconUser size={24} />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-black text-lg group-hover:text-primary transition-colors">
                          {apt.patientName}
                        </h3>
                        <div className="flex items-center gap-1 opacity-50">
                          {apt.patientGender?.toLowerCase() === "male" ? (
                            <IconGenderMale size={14} />
                          ) : (
                            <IconGenderFemale size={14} />
                          )}
                          <p className="text-sm font-black uppercase tracking-tighter">
                            {apt.patientGender}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`badge ${config.color} gap-1.5 font-black py-3 px-3 text-sm uppercase`}
                    >
                      {config.icon}
                      {config.label}
                    </div>
                  </div>

                  {/* Schedule Details */}
                  <div className="bg-base-100/50 rounded-2xl p-4 space-y-3 border border-base-300">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 opacity-40 font-black text-sm uppercase">
                        <IconCalendar size={14} /> Date
                      </span>
                      <span className="font-bold text-xs">
                        {apt.appointmentDate}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 opacity-40 font-black text-sm uppercase">
                        <IconClock size={14} /> Slot
                      </span>
                      <span className="font-bold text-xs">
                        {apt.appointmentTime}
                      </span>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="flex gap-2 min-h-10">
                    <IconNotes size={14} className="mt-1 opacity-30 shrink-0" />
                    <p className="text-[11px] opacity-60 font-medium italic line-clamp-2 leading-relaxed">
                      {apt.notes || "No clinical notes provided by patient."}
                    </p>
                  </div>

                  {/* Admin Actions */}
                  <div className="card-actions justify-stretch mt-4 pt-4 border-t border-base-300 gap-2">
                    {apt.status === "BOOKED" && (
                      <button
                        onClick={() => handleStatusUpdate(apt.id, "CHECKED_IN")}
                        className="btn btn-info btn-sm font-black flex-1 text-sm uppercase"
                      >
                        Check In
                      </button>
                    )}

                    {apt.status === "CHECKED_IN" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(apt.id, "IN_PROGRESS")
                        }
                        className="btn btn-warning btn-sm font-black flex-1 text-sm uppercase"
                      >
                        Start Visit
                      </button>
                    )}

                    {apt.status === "IN_PROGRESS" && (
                      <button
                        onClick={() => handleStatusUpdate(apt.id, "COMPLETED")}
                        className="btn btn-success btn-sm font-black flex-1 text-sm uppercase"
                      >
                        Complete
                      </button>
                    )}

                    {(apt.status === "BOOKED" ||
                      apt.status === "IN_PROGRESS") && (
                      <button
                        onClick={() => handleStatusUpdate(apt.id, "CANCELLED")}
                        disabled={updating === apt.id}
                        className="btn btn-ghost btn-outline btn-sm font-black text-sm uppercase hover:btn-error"
                      >
                        Cancel
                      </button>
                    )}

                    {(apt.status === "COMPLETED" ||
                      apt.status === "CANCELLED") && (
                      <button className="btn btn-disabled btn-sm font-black flex-1 text-sm uppercase">
                        Closed Case
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showModal && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-black text-xl uppercase mb-4">
              Register Offline Patient
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="input input-bordered"
                value={offlineForm.fullName}
                onChange={(e) =>
                  setOfflineForm({ ...offlineForm, fullName: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Age"
                className="input input-bordered"
                value={offlineForm.age}
                onChange={(e) =>
                  setOfflineForm({ ...offlineForm, age: e.target.value })
                }
              />

              <select
                className="select select-bordered"
                value={offlineForm.gender}
                onChange={(e) =>
                  setOfflineForm({ ...offlineForm, gender: e.target.value })
                }
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>

              <input
                type="text"
                placeholder="Phone Number"
                className="input input-bordered"
                value={offlineForm.phone}
                onChange={(e) =>
                  setOfflineForm({ ...offlineForm, phone: e.target.value })
                }
              />

              <input
                type="email"
                placeholder="Email (optional)"
                className="input input-bordered"
                value={offlineForm.email}
                onChange={(e) =>
                  setOfflineForm({ ...offlineForm, email: e.target.value })
                }
              />

              <input
                type="date"
                className="input input-bordered"
                value={offlineForm.appointmentDate}
                onChange={(e) =>
                  setOfflineForm({
                    ...offlineForm,
                    appointmentDate: e.target.value,
                  })
                }
              />

              <select
                className="select select-bordered md:col-span-2"
                value={offlineForm.doctorId}
                onChange={(e) =>
                  setOfflineForm({ ...offlineForm, doctorId: e.target.value })
                }
              >
                <option value="">Select Doctor</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} — {doc.specialization}
                  </option>
                ))}
              </select>

              <textarea
                placeholder="Address (optional)"
                className="textarea textarea-bordered md:col-span-2"
                value={offlineForm.address}
                onChange={(e) =>
                  setOfflineForm({ ...offlineForm, address: e.target.value })
                }
              />
            </div>

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                disabled={submitting}
                onClick={handleOfflineRegistration}
              >
                {submitting ? "Saving..." : "Register & Book"}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
