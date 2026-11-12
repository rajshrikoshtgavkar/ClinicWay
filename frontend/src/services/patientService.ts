import { api } from "./api";

export interface PatientProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  address?: string;
  medicalHistory?: string;
  profileImage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePatientProfileRequest {
  name: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  address?: string;
  medicalHistory?: string;
}

export const patientService = {
  async getPatientDashboard() {
    return await api.get("/patient/dashboard");
  },

  async getPatientProfile() {
    return await api.get("/patient/profile");
  },

  async getPatientById(id: number) {
    return await api.get(`/patient/${id}`);
  },

  async updatePatientProfile(data: UpdatePatientProfileRequest) {
    return await api.put("/patient/profile", data);
  },
};
