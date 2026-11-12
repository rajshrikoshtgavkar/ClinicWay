import { api } from "./api";

export interface QueueStatusResponse {
  queueId: number;
  appointmentId: number;
  patientName: string;
  doctorName: string;
  doctorSpecialization: string;
  status: "WAITING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  position: number;
  estimatedWaitMinutes: number;
  checkInTime: string;
  calledTime?: string;
  completedTime?: string;
}

export interface QueueEntryDto {
  appointmentId: number;
  queueId: number;
  patientId: number;
  patientName: string;
  patientPhone: string;
  patientAge: string;
  patientGender: string;
  doctorName: string;
  status: string;
  position: number;
  estimatedWaitMinutes: number;
  checkInTime: string;
  calledTime?: string;
  appointmentTime: string;
}

export interface DoctorQueueResponse {
  currentPatient?: QueueEntryDto;
  waitingPatients: QueueEntryDto[];
  completedPatients: QueueEntryDto[];
  totalSeenToday: number;
}

export const queueService = {
  async checkIn(appointmentId: number) {
    return await api.post("/queue/check-in", {
      appointmentId,
    });
  },

  async getMyQueueStatus() {
    return await api.get("/queue/my-status");
  },

  async getDoctorQueue() {
    return await api.get("/queue/doctor/current");
  },

  async callNextPatient() {
    return await api.put("/queue/call-next", {});
  },

  async completePatient(queueId: number) {
    return await api.put(`/queue/${queueId}/complete`, {});
  },
};
