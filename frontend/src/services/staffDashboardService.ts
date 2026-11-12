import { api } from "./api";

export const staffDashboardService = {
  async getStaffDashboard() {
    return await api.get("/staff/dashboard");
  },
};
