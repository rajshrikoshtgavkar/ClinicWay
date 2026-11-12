import { api } from "./api";

export interface PatientDetailsPayload {
  name: string;
  age: number;
  gender: string;
  phone: string;
}

export interface CreateAppointmentPayload {
  doctorId: number;
  bookingFor: "SELF" | "OTHER";
  patientDetails?: PatientDetailsPayload;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:mm
  appointmentType: "ONLINE" | "IN_PERSON";
  paymentMode: "ONLINE" | "IN_PERSON";
  notes?: string;
}

export interface UpdateAppointmentStatusPayload {
  status: "BOOKED" | "CHECKED_IN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  notes?: string;
}

export const appointmentService = {
  // ✅ CREATE
  createAppointment(payload: CreateAppointmentPayload) {
    return api.post("/appointment/create", payload);
  },

  // Get All Appointments by clinic
  getAllAppointments(clinicId: string) {
    return api.get(`/appointment/all-clinic?clinicId=${clinicId}`);
  },

  // ✅ PATIENT LIST (THIS WAS MISSING)
  getPatientAppointments() {
    return api.get("/appointment/patient/list");
  },

  // ✅ SINGLE APPOINTMENT
  getAppointmentById(id: number) {
    return api.get(`/appointment/${id}`);
  },

  // Add Meeting Link
  addMeetingLink(
    appointmentId: number,
    meetingLink: string,
    meetingPlatform: string,
  ) {
    return api.put(`/appointment/${appointmentId}/meeting-link`, {
      meetingLink,
      meetingPlatform,
    });
  },

  // ✅ DOCTOR DASHBOARD
  getDoctorAppointments() {
    return api.get("/appointment/doctor/list");
  },

  // ✅ CLINIC DASHBOARD
  getClinicAppointments(clinicId: number) {
    return api.get(`/appointment/all-clinic?clinicId=${clinicId}`);
  },

  // ✅ STATUS UPDATE
  updateAppointmentStatus(id: number, payload: UpdateAppointmentStatusPayload) {
    return api.put(`/appointment/${id}/status`, payload);
  },

  // ✅ CANCEL
  cancelAppointment(id: number) {
    return api.delete(`/appointment/${id}`);
  },
};

export default appointmentService;
