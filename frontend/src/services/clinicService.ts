import { api } from "./api";

export const clinicService = {
  async getAllClinics() {
    console.log("ClinicService: fetching all clinics");
    return await api.get("/api/clinics");
  },

  async getClinicsByCity(city: string) {
    console.log("ClinicService: fetching clinics for city:", city);
    return await api.get(`/api/clinics/by-city?city=${city}`);
  },

  async getClinicById(id: number) {
    console.log("ClinicService: fetching clinic with id:", id);
    return await api.get(`/api/clinics/${id}`);
  },
};

export default clinicService;
