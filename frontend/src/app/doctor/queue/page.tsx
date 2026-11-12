"use client";

import { useEffect, useState } from "react";
import {
  queueService,
  DoctorQueueResponse,
  QueueEntryDto,
} from "@/services/queueService";
import {
  IconStethoscope,
  IconUsers,
  IconCircle,
  IconClock,
  IconPhone,
  IconAlertCircle,
  IconRefresh,
  IconArrowRight,
  IconVideo,
} from "@tabler/icons-react";
import Loading from "@/components/Loading";
import AddMeetingLinkModal from "@/components/AddMeetingLinkModal";

export default function DoctorQueueManagement() {
  const [queueData, setQueueData] = useState<DoctorQueueResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calling, setCalling] = useState(false);
  const [completing, setCompleting] = useState<number | null>(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [meetingLinkModalOpen, setMeetingLinkModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);

  const fetchQueue = async () => {
    try {
      const response = await queueService.getDoctorQueue();
      const data = response.data || response;
      setQueueData(data as DoctorQueueResponse);
      console.log(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load queue");
      console.error("Error fetching queue:", err);
    }
  };

  useEffect(() => {
    const loadQueue = async () => {
      try {
        setLoading(true);
        await fetchQueue();
      } finally {
        setLoading(false);
      }
    };

    loadQueue();
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefreshEnabled) return;

    const interval = setInterval(() => {
      fetchQueue();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefreshEnabled]);

  const handleCallNext = async () => {
    try {
      setCalling(true);
      const response = await queueService.callNextPatient();
      const data = response.data || response;
      // Update queue data
      await fetchQueue();
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to call next patient");
      console.error("Error calling next patient:", err);
    } finally {
      setCalling(false);
    }
  };

  const handleComplete = async (queueId: number) => {
    try {
      setCompleting(queueId);
      const response = await queueService.completePatient(queueId);
      const data = response.data || response;
      // Update queue data
      await fetchQueue();
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to complete patient");
      console.error("Error completing patient:", err);
    } finally {
      setCompleting(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
              <IconStethoscope size={40} className="text-primary" />
              Queue Management
            </h1>
            <p className="text-base-content/60 mt-2">
              Manage today's patient queue
            </p>
          </div>
          <button
            onClick={fetchQueue}
            className="btn btn-circle btn-outline"
            title="Refresh queue"
          >
            <IconRefresh size={24} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error mb-6" role="alert">
            <IconAlertCircle />
            <span>{error}</span>
          </div>
        )}

        {/* Stats */}
        {queueData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="stat bg-base-100 rounded-lg shadow">
              <div className="stat-title">Waiting</div>
              <div className="stat-value text-primary">
                {queueData.waitingPatients?.length || 0}
              </div>
              <div className="stat-desc">Patients in queue</div>
            </div>

            <div className="stat bg-base-100 rounded-lg shadow">
              <div className="stat-title">Current</div>
              <div className="stat-value text-info">
                {queueData.currentPatient ? "1" : "0"}
              </div>
              <div className="stat-desc">Being consulted</div>
            </div>

            <div className="stat bg-base-100 rounded-lg shadow">
              <div className="stat-title">Completed</div>
              <div className="stat-value text-success">
                {queueData.totalSeenToday}
              </div>
              <div className="stat-desc">Today</div>
            </div>

            <div className="stat bg-base-100 rounded-lg shadow">
              <div className="stat-title">Total</div>
              <div className="stat-value">
                {(queueData.waitingPatients?.length || 0) +
                  (queueData.currentPatient ? 1 : 0) +
                  queueData.totalSeenToday}
              </div>
              <div className="stat-desc">This session</div>
            </div>
          </div>
        )}

        {/* Current Patient */}
        {queueData?.currentPatient ? (
          <div className="card bg-linear-to-br from-info to-info/80 text-info-content shadow-xl mb-8">
            <div className="card-body">
              <h2 className="card-title text-2xl flex items-center gap-3">
                <div className="badge badge-lg gap-2 bg-white/20">
                  <IconCircle size={16} />
                  CURRENT
                </div>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                {/* Patient Info */}
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm opacity-75">Patient Name</p>
                  <p className="font-bold text-xl">
                    {queueData.currentPatient.patientName}
                  </p>
                  <div className="mt-4 space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <IconPhone size={16} />
                      {queueData.currentPatient.patientPhone}
                    </p>
                    <p>Age: {queueData.currentPatient.patientAge}</p>
                    <p>Gender: {queueData.currentPatient.patientGender}</p>
                  </div>
                </div>

                {/* Appointment Info */}
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm opacity-75">Appointment Time</p>
                  <p className="font-bold text-lg flex items-center gap-2 mt-1">
                    <IconClock size={20} />
                    {new Date(
                      queueData.currentPatient.appointmentTime,
                    ).toLocaleTimeString()}
                  </p>
                  <p className="text-sm opacity-75 mt-3">Called At</p>
                  <p className="font-bold">
                    {queueData.currentPatient.calledTime
                      ? new Date(
                          queueData.currentPatient.calledTime,
                        ).toLocaleTimeString()
                      : "N/A"}
                  </p>
                </div>

                {/* Action */}
                <div className="bg-white/10 rounded-lg p-4 flex flex-col justify-center gap-3">
                  <p className="text-sm opacity-75">Actions</p>
                  <button
                    onClick={() => {
                      setSelectedAppointmentId(
                        queueData.currentPatient!.appointmentId,
                      );
                      setMeetingLinkModalOpen(true);
                    }}
                    className="btn btn-info gap-2 text-info-content"
                  >
                    <IconVideo size={20} />
                    Add Meeting Link
                  </button>
                  <button
                    onClick={() =>
                      handleComplete(queueData.currentPatient!.queueId)
                    }
                    disabled={completing === queueData.currentPatient.queueId}
                    className="btn btn-accent gap-2 text-accent-content"
                  >
                    {completing === queueData.currentPatient.queueId ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Completing...
                      </>
                    ) : (
                      <>
                        <IconCircle size={20} />
                        Mark Complete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card bg-warning/10 border border-warning/30 shadow-xl mb-8">
            <div className="card-body">
              <h2 className="card-title flex items-center gap-2">
                <IconAlertCircle size={24} className="text-warning" />
                No Current Patient
              </h2>
              <p>Click "Call Next Patient" to start consultation.</p>
              <div className="card-actions mt-4">
                <button
                  onClick={handleCallNext}
                  disabled={calling || !queueData?.waitingPatients?.length}
                  className="btn btn-primary gap-2"
                >
                  {calling ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Calling...
                    </>
                  ) : (
                    <>
                      <IconArrowRight size={20} />
                      Call Next Patient
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Call Next Button (when patient exists) */}
        {queueData?.currentPatient && queueData.waitingPatients?.length > 0 && (
          <div className="mb-8">
            <button
              onClick={handleCallNext}
              disabled={calling}
              className="btn btn-primary btn-lg gap-2 w-full"
            >
              {calling ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Calling Next Patient...
                </>
              ) : (
                <>
                  <IconArrowRight size={24} />
                  Call Next Patient
                </>
              )}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Waiting Patients */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title flex items-center gap-2 mb-4">
                <div className="badge badge-warning gap-2">
                  <IconUsers size={16} />
                  WAITING ({queueData?.waitingPatients?.length || 0})
                </div>
              </h2>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {queueData?.waitingPatients &&
                queueData.waitingPatients.length > 0 ? (
                  queueData.waitingPatients.map((patient, index) => (
                    <div
                      key={patient.queueId}
                      className="flex items-start gap-4 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition"
                    >
                      <div className="shrink-0 w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center font-bold text-warning">
                        #{patient.position}
                      </div>
                      <div className="grow min-w-0">
                        <p className="font-bold truncate">
                          {patient.patientName}
                        </p>
                        <p className="text-sm opacity-60">
                          Age: {patient.patientAge}, {patient.patientGender}
                        </p>
                        <p className="text-xs opacity-50 mt-1">
                          Checked in:{" "}
                          {new Date(patient.checkInTime).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold">
                          {patient.estimatedWaitMinutes} min
                        </p>
                        <p className="text-xs opacity-60">estimated</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 opacity-50">
                    <p>No patients waiting</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Completed Patients */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title flex items-center gap-2 mb-4">
                <div className="badge badge-success gap-2">
                  <IconCircle size={16} />
                  COMPLETED ({queueData?.completedPatients?.length || 0})
                </div>
              </h2>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {queueData?.completedPatients &&
                queueData.completedPatients.length > 0 ? (
                  queueData.completedPatients.map((patient) => (
                    <div
                      key={patient.queueId}
                      className="flex items-start gap-4 p-3 bg-success/10 rounded-lg"
                    >
                      <div className="shrink-0 w-10 h-10 rounded-full bg-success/30 flex items-center justify-center text-success">
                        <IconCircle size={20} />
                      </div>
                      <div className="grow min-w-0">
                        <p className="font-bold truncate">
                          {patient.patientName}
                        </p>
                        <p className="text-sm opacity-60">
                          Age: {patient.patientAge}, {patient.patientGender}
                        </p>
                        <p className="text-xs opacity-50 mt-1">
                          Completed:{" "}
                          {new Date(patient.checkInTime).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 opacity-50">
                    <p>No patients completed yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Auto-refresh Toggle */}
        {queueData && (
          <div className="mt-8 card bg-base-100 shadow-xl">
            <div className="card-body">
              <label className="label cursor-pointer gap-3">
                <input
                  type="checkbox"
                  checked={autoRefreshEnabled}
                  onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text font-bold">
                  Auto-refresh queue every 30 seconds
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Meeting Link Modal */}
      <AddMeetingLinkModal
        appointmentId={selectedAppointmentId || 0}
        appointmentDetails={
          queueData?.currentPatient
            ? {
                patientName: queueData.currentPatient.patientName,
                doctorName: queueData.currentPatient.doctorName || "Dr. N/A",
                appointmentDate: new Date(
                  queueData.currentPatient.appointmentTime,
                ).toLocaleDateString(),
                appointmentTime: new Date(
                  queueData.currentPatient.appointmentTime,
                ).toLocaleTimeString(),
              }
            : undefined
        }
        isOpen={meetingLinkModalOpen}
        onClose={() => {
          setMeetingLinkModalOpen(false);
          setSelectedAppointmentId(null);
        }}
        onSuccess={() => {
          fetchQueue(); // Refresh queue after adding meeting link
        }}
      />
    </div>
  );
}
