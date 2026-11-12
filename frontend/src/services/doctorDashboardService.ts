import { api } from "./api";

export const doctorServiceFrontend = {
  async getDoctorDashboard() {
    return await api.get("/doctor/dashboard");
  },
};
