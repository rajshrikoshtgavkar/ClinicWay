import { api } from "./api";

export const doctorListService = {
  async getAvailableDoctors() {
    console.log("DoctorListService: Fetching available doctors");
    return await api.get("/doctor/available");
  },
};

export default doctorListService;
