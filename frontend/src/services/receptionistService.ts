import { api } from "./api";

export const receptionistService = {
  async addOfflinePatient(
    doctorId: number,
    appointmentDate: string,
    patientData: {
      fullName: string;
      age: string;
      gender: string;
      phone: string;
      email?: string;
      address?: string;
    },
  ) {
    console.log(
      "ReceptionistService: adding offline patient for doctor:",
      doctorId,
    );
    return await api.post(
      `/appointments/offline?doctorId=${doctorId}&appointmentDate=${appointmentDate}`,
      patientData,
    );
  },

  async updateAppointmentStatus(appointmentId: number, status: string) {
    console.log(
      "ReceptionistService: updating appointment status:",
      appointmentId,
      status,
    );
    return await api.patch(`/api/appointments/${appointmentId}/status`, {
      status,
    });
  },
};

export default receptionistService;
