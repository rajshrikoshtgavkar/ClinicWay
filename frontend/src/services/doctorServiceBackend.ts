import { api } from "./api";

export const doctorService = {
  async markArrival(doctorId: number) {
    console.log("DoctorService: marking arrival for doctor:", doctorId);
    return await api.patch(`/api/appointments/doctor/${doctorId}/arrival`, {});
  },

  async toggleOnlineConsultation(doctorId: number) {
    console.log(
      "DoctorService: toggling online consultation for doctor:",
      doctorId
    );
    return await api.patch(
      `/api/appointments/doctor/${doctorId}/online-consult`,
      {}
    );
  },

  async getTodayAppointments(doctorId: number) {
    console.log(
      "DoctorService: getting today's appointments for doctor:",
      doctorId
    );
    return await api.get(`/api/appointments/doctor/${doctorId}/today`);
  },
};

export default doctorService;
